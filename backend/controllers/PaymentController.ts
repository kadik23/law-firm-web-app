import { Request, Response } from 'express';
import { db } from '@/models/index';
import { Model, ModelCtor } from 'sequelize';
import { IPayment, IPaymentTransaction } from '@/interfaces/Payment';
import ChargiliPayService from '@/services/ChargiliPayService';
import { createNotification } from './createNotification';

const Payment: ModelCtor<Model<IPayment>> = db.payments;
const PaymentTransaction: ModelCtor<Model<IPaymentTransaction>> = db.payment_transactions;
const RequestService = db.request_service;
const Service = db.services;
const User = db.users;

/**
 * @swagger
 * /api/payments/create:
 *   post:
 *     summary: Create a new payment
 *     description: Creates a new payment for a service with Chargili Pay integration
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - request_service_id
 *               - payment_method
 *               - payment_type
 *               - amount
 *             properties:
 *               request_service_id:
 *                 type: number
 *                 example: 1
 *               payment_method:
 *                 type: string
 *                 enum: [CIB, EDAHABIYA, FREE_CONSULTATION]
 *                 example: "CIB"
 *               payment_type:
 *                 type: string
 *                 enum: [FULL, PARTIAL]
 *                 example: "FULL"
 *               amount:
 *                 type: number
 *                 example: 50000
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const createPayment = async (req: Request, res: Response): Promise<void> => {
  const transaction = await db.sequelize.transaction();

  try {
    const { request_service_id, payment_method, payment_type, amount } = req.body;
    const client_id = req.user?.id;

    if (!client_id) {
      await transaction.rollback();
      res.status(401).json({ error: 'Unauthorized: Client ID not found.' });
      return;
    }

    if (!request_service_id || !payment_method || !payment_type || !amount) {
      await transaction.rollback();
      res.status(400).json({ error: 'Missing required fields.' });
      return;
    }

    if (amount <= 0) {
      await transaction.rollback();
      res.status(400).json({ error: 'Amount must be greater than 0.' });
      return;
    }

    const requestService = await RequestService.findOne({
      where: { id: request_service_id, clientId: client_id },
      include: [{ model: Service, as: 'service' }],
      transaction,
    });

    if (!requestService) {
      await transaction.rollback();
      res.status(404).json({ error: 'Request service not found.' });
      return;
    }

    const service = requestService.get('service') as any;
    const totalAmount = service.price;

    if (payment_type === 'FULL' && Math.abs(amount - totalAmount) > 0.01) {
      await transaction.rollback();
      res.status(400).json({ 
        error: 'Full payment amount must equal total service price.',
        required_amount: totalAmount,
        provided_amount: amount
      });
      return;
    }

    if (payment_type === 'PARTIAL') {
      if (amount >= totalAmount) {
        await transaction.rollback();
        res.status(400).json({ 
          error: 'Partial payment amount must be less than total service price.',
          total_amount: totalAmount,
          partial_amount: amount
        });
        return;
      }

      const minPartialAmount = totalAmount * 0.1;
      if (amount < minPartialAmount) {
        await transaction.rollback();
        res.status(400).json({ 
          error: 'Partial payment must be at least 10% of total amount.',
          minimum_amount: minPartialAmount,
          provided_amount: amount
        });
        return;
      }
    }

    const payment = await Payment.create({
      request_service_id,
      total_amount: totalAmount,
      paid_amount: 0,
      remaining_balance: totalAmount,
      payment_method,
      payment_status: 'PENDING',
      payment_type,
      client_id,
      service_id: service.id,
    }, { transaction });

    if (payment_method === 'CIB' || payment_method === 'EDAHABIYA') {
      const client = await User.findByPk(client_id, { transaction });
      if (!client) {
        await transaction.rollback();
        res.status(404).json({ error: 'Client not found.' });
        return;
      }

      const clientEmail = client.get('email') as string;
      const clientName = `${client.get('name')} ${client.get('surname')}`;
      const invoiceNumber = `INV-${payment.get('id')}-${Date.now()}`;

      const chargiliResponse = await ChargiliPayService.createPayment({
        amount,
        clientEmail,
        clientName,
        paymentMethod: payment_method as 'CIB' | 'EDAHABIYA',
        invoiceNumber,
        backUrl: process.env.FRONTEND_URL 
          ? `${process.env.FRONTEND_URL.replace(/\/$/, '')}/client/dashboard/payments/${payment.get('id')}`
          : `http://localhost:3000/client/dashboard/payments/${payment.get('id')}`,
      });

      await payment.update({
        chargili_payment_id: chargiliResponse.id,
        chargili_checkout_url: chargiliResponse.checkout_url,
      }, { transaction });

      await transaction.commit();

      res.status(201).json({
        message: 'Payment created successfully',
        payment: payment.toJSON(),
        checkout_url: chargiliResponse.checkout_url,
        payment_summary: {
          total_amount: totalAmount,
          payment_amount: amount,
          remaining_balance: payment_type === 'FULL' ? 0 : totalAmount - amount,
          payment_type,
          next_steps: payment_type === 'PARTIAL'
            ? 'Complete remaining balance later'
            : 'Payment will be processed'
        }
      });
    } else {
      await transaction.rollback();
      res.status(400).json({ error: 'Invalid payment method.' });
    }
  } catch (error) {
    console.error('Error creating payment:', error);
    await transaction.rollback();
    res.status(500).json({ error: 'Internal server error: ' + (error as any).message });
  }
};

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Chargili Pay webhook endpoint
 *     description: Handles webhook notifications from Chargili Pay
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  const t = await db.sequelize.transaction();

  try {
    const signature = req.get('signature') || '';
    const payload = (req as any).rawBody;

    if (!signature) {
      console.error('❌ Missing signature header');
      await t.rollback();
      res.sendStatus(400);
      return;
    }

    if (!ChargiliPayService.verifyWebhookSignature(signature, payload)) {
      await t.rollback();
      res.status(400).json({ error: 'Invalid webhook signature.' });
      return;
    }

    const webhookData = req.body;
    const { paymentId, status, amount } = ChargiliPayService.processWebhook(webhookData);

    const payment = await Payment.findOne({
      where: { chargili_payment_id: paymentId },
      include: [
        { model: User, as: 'client' },
        { model: Service, as: 'service' },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!payment) {
      await t.rollback();
      res.status(404).json({ error: 'Payment not found.' });
      return;
    }

    await payment.update(
      {
        payment_status: status,
        chargili_webhook_data: webhookData,
      },
      { transaction: t }
    );

    if (status === 'COMPLETED') {
      await PaymentTransaction.create(
        {
          payment_id: payment.get('id') as number,
          transaction_amount: amount,
          transaction_date: new Date(),
          chargili_transaction_id: paymentId.toString(),
          chargili_status: status,
          chargili_response_data: webhookData,
        },
        { transaction: t }
      );

      // Update payment amounts
      const currentPaidAmount = payment.get('paid_amount') as number;
      const newPaidAmount = Number(currentPaidAmount) + Number(amount);
      const totalAmount = payment.get('total_amount') as number;
      const remainingBalance = totalAmount - newPaidAmount;

      await payment.update(
        {
          paid_amount: newPaidAmount,
          remaining_balance: remainingBalance,
          payment_status: remainingBalance <= 0 ? 'COMPLETED' : 'PENDING',
        },
        { transaction: t }
      );

      // Send notification to client
      const client = payment.get('client') as any;
      if (client) {
        const paymentType = payment.get('payment_type') as string;
        const messageForClient =
          paymentType === 'FULL'
            ? `Votre paiement de ${amount} DZD a été complété avec succès.`
            : `Votre paiement partiel de ${amount} DZD a été traité. Solde restant : ${remainingBalance} DZD.`;

        const messageForAdmin = 
          paymentType === 'FULL'
            ? `un paiement de ${amount} DZD a été complété avec succès.`
            : `un paiement partiel de ${amount} DZD a été traité pour le client ${client.name}. Solde restant : ${remainingBalance} DZD.`;

        await createNotification(
          'Payment',
          messageForClient,
          client.id,
          payment.get('id') as number,
          undefined,
          t
        );
        await createNotification(
          'Payment',
          messageForAdmin,
          2,
          payment.get('id') as number,
          client.id,
          t
        );
      }
    }

    await t.commit();
    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    await t.rollback();
    res.status(500).json({ error: 'Internal server error: ' + (error as any).message });
  }
};

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get payment details
 *     description: Retrieves payment details by ID
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment details retrieved successfully
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 */
export const getPaymentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let client_id = req.user?.id;
    if(req.query.client_id && req.user?.type == 'admin'){
        client_id = Number(req.query.client_id);
    }
    if (!client_id) {
      res.status(401).json({ error: 'Unauthorized: Client ID not found.' });
      return;
    }

    const payment = await Payment.findOne({
      where: { id, client_id },
      include: [
        {
          model: User,
          as: 'client',
        },
        {
          model: Service,
          as: 'service',
        },
        {
          model: PaymentTransaction,
          as: 'transactions',
        },
      ],
    });

    if (!payment) {
      res.status(404).json({ error: 'Payment not found.' });
      return;
    }

    res.status(200).json({ payment: payment.toJSON() });
  } catch (error) {
    console.error('Error getting payment:', error);
    res.status(500).json({ error: 'Internal server error: ' + (error as any).message });
  }
};

/**
 * @swagger
 * /api/payments/client/{clientId}:
 *   get:
 *     summary: Get client payments
 *     description: Retrieves all payments for a specific client
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Client payments retrieved successfully
 *       500:
 *         description: Internal server error
 */
export const getClientPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    let currentUserId = req.user?.id;
    if(req.query.client_id && req.user?.type == 'admin'){
      currentUserId = Number(req.query.client_id);
    }
    const payments = await Payment.findAll({
      where: { client_id: currentUserId },
      include: [
        {
          model: Service,
          as: 'service',
        },
        {
          model: PaymentTransaction,
          as: 'transactions',
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({ payments: payments.map(p => p.toJSON()) });
  } catch (error) {
    console.error('Error getting client payments:', error);
    res.status(500).json({ error: 'Internal server error: ' + (error as any).message });
  }
};

export const getPaymentsCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.id;

    const count = await Payment.count({
      where: { client_id: currentUserId },
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting payments count:', error);
    res.status(500).json({ error: 'Internal server error: ' + (error as any).message });
  }
};

export const getTransactionsCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const count = await PaymentTransaction.count({
      where: { payment_id: id },
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting transactions count:', error);
    res.status(500).json({ error: 'Internal server error: ' + (error as any).message });
  }
};

/**
 * @swagger
 * /api/payments/partial/{paymentId}:
 *   get:
 *     summary: Get payment details for adding transactions
 *     description: Retrieves payment details to add new transactions to existing payment
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment details retrieved successfully
 *       500:
 *         description: Internal server error
 */
export const getPartialPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paymentId } = req.params;
    const client_id = req.user?.id;

    if (!client_id) {
      res.status(401).json({ error: 'Unauthorized: Client ID not found.' });
      return;
    }

    const payment = await Payment.findOne({
      where: { 
        id: paymentId,
        client_id,
        payment_type: 'PARTIAL',
        payment_status: 'PENDING'
      },
      include: [
        {
          model: Service,
          as: 'service',
        },
        {
          model: PaymentTransaction,
          as: 'transactions',
        },
      ],
    });

    if (!payment) {
      res.status(404).json({ error: 'Payment not found or not eligible for additional transactions.' });
      return;
    }

    res.status(200).json({ payment: payment.toJSON() });
  } catch (error) {
    console.error('Error getting payment details:', error);
    res.status(500).json({ error: 'Internal server error: ' + (error as any).message });
  }
};

export const getAllPartialPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const client_id = req.user?.id;

    if (!client_id) {
      res.status(401).json({ error: 'Unauthorized: Client ID not found.' });
      return;
    }

    const payments = await Payment.findAll({
      where: { 
        client_id,
        payment_type: 'PARTIAL',
        payment_status: 'PENDING'
      },
      include: [
        {
          model: Service,
          as: 'service',
        },
        {
          model: PaymentTransaction,
          as: 'transactions',
        },
      ],
    });

    if (!payments) {
      res.status(404).json({ error: 'Payment not found or not eligible for additional transactions.' });
      return;
    }

    res.status(200).json({ payments: payments });
  } catch (error) {
    console.error('Error getting payment details:', error);
    res.status(500).json({ error: 'Internal server error: ' + (error as any).message });
  }
};

/**
 * @swagger
 * /api/payments/{paymentId}/add-transaction:
 *   post:
 *     summary: Add a new transaction to an existing payment
 *     description: Adds a new transaction to an existing payment record
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: body
 *         name: transaction
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - transaction_amount
 *             - chargili_transaction_id
 *             - chargili_status
 *           properties:
 *             transaction_amount:
 *               type: number
 *               example: 10000
 *             chargili_transaction_id:
 *               type: string
 *               example: "PARTIAL-1234567890123"
 *             chargili_status:
 *               type: string
 *               enum: [COMPLETED, FAILED, PENDING]
 *               example: "COMPLETED"
 *             chargili_response_data:
 *               type: object
 *               example: { type: "partial_payment", amount: 10000 }
 *     responses:
 *       200:
 *         description: Transaction added successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 */
export const addTransactionToPayment = async (req: Request, res: Response): Promise<void> => {
  const t = await db.sequelize.transaction();

  try {
    const { paymentId } = req.params;
    const { transaction_amount, chargili_transaction_id, chargili_status, payment_method } = req.body;
    const client_id = req.user?.id;

    if (!client_id) {
      await t.rollback();
      res.status(401).json({ error: 'Unauthorized: Client ID not found.' });
      return;
    }

    if (!transaction_amount || !chargili_transaction_id || !chargili_status) {
      await t.rollback();
      res.status(400).json({ error: 'Missing required transaction fields.' });
      return;
    }

    const payment = await Payment.findOne({
      where: { id: paymentId, client_id },
      include: [{ model: PaymentTransaction, as: 'transactions' }],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!payment) {
      await t.rollback();
      res.status(404).json({ error: 'Payment not found.' });
      return;
    }

    const currentPaidAmount = payment.get('paid_amount') as number;
    const totalAmount = payment.get('total_amount') as number;
    const remainingBalance = totalAmount - currentPaidAmount;

    if (remainingBalance <= 0) {
      await t.rollback();
      res.status(400).json({ error: 'Payment is already completed.' });
      return;
    }

    if (transaction_amount > remainingBalance) {
      await t.rollback();
      res.status(400).json({
        error: 'Transaction amount exceeds remaining balance.',
        remaining_balance: remainingBalance,
        transaction_amount: transaction_amount
      });
      return;
    }

    const newPaidAmount = Number(currentPaidAmount) + Number(transaction_amount);
    const newRemainingBalance = totalAmount - newPaidAmount;
    const invoiceNumber = `INV-${payment.get('id')}-${Date.now()}`;

    const chargiliResponse = await ChargiliPayService.createPayment({
      amount: transaction_amount,
      clientEmail: req.user?.email,
      clientName: req.user?.name,
      paymentMethod: payment_method,
      invoiceNumber,
      backUrl: `${process.env.FRONTEND_URL}/client/dashboard/payments/${paymentId}`,
    });

    await payment.update(
      {
        chargili_payment_id: chargiliResponse.id,
        chargili_checkout_url: chargiliResponse.checkout_url,
      },
      { transaction: t }
    );

    await PaymentTransaction.create(
      {
        payment_id: payment.get('id') as number,
        transaction_amount,
        transaction_date: new Date(),
        chargili_transaction_id,
        chargili_status,
        chargili_response_data: chargiliResponse,
      },
      { transaction: t }
    );

    await payment.update(
      {
        paid_amount: newPaidAmount,
        remaining_balance: newRemainingBalance,
        payment_status: newRemainingBalance <= 0 ? 'COMPLETED' : 'PENDING',
      },
      { transaction: t }
    );

    const client = payment.get('client') as any;
    if (client) {
      const messageForClient = `Votre paiement partiel de ${transaction_amount} DZD a été traité. Solde restant : ${newRemainingBalance} DZD.`;
      const messageForAdmin = `Un paiement partiel de ${transaction_amount} DZD a été traité pour le client ${client.name}. Solde restant : ${newRemainingBalance} DZD.`;
      await createNotification('Payment', messageForClient, client.id, payment.get('id') as number, undefined, t);
      await createNotification('Payment', messageForAdmin, 2, payment.get('id') as number, client.id, t);
    }

    await t.commit();

    res.status(200).json({
      message: 'Transaction added successfully',
      payment: payment.toJSON(),
      new_remaining_balance: newRemainingBalance,
      payment_type: 'PARTIAL_UPDATE',
      checkout_url: chargiliResponse.checkout_url,
    });
  } catch (error) {
    console.error('Error adding transaction to payment:', error);
    await t.rollback();
    res.status(500).json({ error: 'Internal server error: ' + (error as any).message });
  }
};
