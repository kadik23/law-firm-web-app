import { ChargiliPaymentRequest, ChargiliPaymentResponse, ChargiliWebhookData, PaymentStatusResponse } from '@/interfaces/ChargiliPay';
import { mapChargiliStatus } from '@/utils/mapChargiliData';
import { ChargilyClient } from '@chargily/chargily-pay';
import crypto from 'crypto';

class ChargiliPayService {
  private client: ChargilyClient;
  private apiKey: string;
  constructor() {
    const apiKey = process.env.CHARGILI_API_KEY || '';
    const mode = process.env.NODE_ENV === 'production' ? 'live' : 'test';
    
    this.client = new ChargilyClient({
      api_key: apiKey,
      mode: mode as 'test' | 'live',
    });
    
    this.apiKey = process.env.CHARGILI_API_KEY || '';
  }

  async createPayment(paymentData: ChargiliPaymentRequest): Promise<ChargiliPaymentResponse> {
    try {
      console.log('Creating Chargili Pay customer with data:', {
        name: paymentData.clientName,
        email: paymentData.clientEmail,
      });

      const customer = await this.client.createCustomer({
        name: paymentData.clientName,
        email: paymentData.clientEmail,
      });

      console.log('Customer created:', customer.id);

      console.log('Creating Chargili Pay product with data:', {
        name: `Payment - ${paymentData.invoiceNumber}`,
        description: `Payment for invoice ${paymentData.invoiceNumber}`,
      });

      const product = await this.client.createProduct({
        name: `Payment - ${paymentData.invoiceNumber}`,
        description: `Payment for invoice ${paymentData.invoiceNumber}`,
      });

      console.log('Product created:', product.id);

      console.log('Creating Chargili Pay price with data:', {
        amount: paymentData.amount,
        currency: 'dzd',
        product_id: product.id,
      });

      const price = await this.client.createPrice({
        amount: paymentData.amount,
        currency: 'dzd',
        product_id: product.id,
      });

      console.log('Price created:', price.id);

      console.log('Creating Chargili Pay checkout with data:', {
        items: [{ price: price.id, quantity: 1 }],
        success_url: paymentData.backUrl,
        failure_url: paymentData.backUrl,
        payment_method: paymentData.paymentMethod === 'EDAHABIYA' ? 'edahabia' : 'cib' as 'edahabia' | 'cib',
        locale: 'en' as const,
        pass_fees_to_customer: false,
      });

      const checkoutData = {
        items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        success_url: paymentData.backUrl,
        failure_url: paymentData.backUrl,
        payment_method: paymentData.paymentMethod === 'EDAHABIYA' ? 'edahabia' : 'cib' as 'edahabia' | 'cib',
        locale: 'en' as const,
        pass_fees_to_customer: false,
      };

      console.log('Creating Chargili Pay checkout with data:', checkoutData);

      const checkout = await this.client.createCheckout(checkoutData);

      console.log('Checkout created successfully:', checkout.id);

      return {
        id: checkout.id,
        checkout_url: checkout.checkout_url,
        status: checkout.status,
      };
    } catch (error) {
      console.error('Chargili Pay API Error Details:', {
        error: error,
        message: (error as any).message,
        status: (error as any).status,
        response: (error as any).response?.data,
        responseStatus: (error as any).response?.status,
        responseHeaders: (error as any).response?.headers,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
        paymentData: paymentData
      });
      
      // Try to extract more specific error information
      if ((error as any).response?.data) {
        console.error('Chargili Pay Response Data:', (error as any).response.data);
      }
      
      if ((error as any).response?.status) {
        console.error('Chargili Pay Response Status:', (error as any).response.status);
      }
      
      throw new Error(`Failed to create payment with Chargili Pay: ${(error as any).message}`);
    }
  }


  verifyWebhookSignature(signature: string, payload: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', this.apiKey)
      .update(payload)
      .digest('hex');
    
    return signature === expectedSignature;
  }

  processWebhook(webhookData: ChargiliWebhookData): {
    paymentId: number;
    status: 'COMPLETED' | 'FAILED' | 'CANCELLED';
    amount: number;
  } {
    return {
      paymentId: webhookData.data.id,
      status: mapChargiliStatus(webhookData.data.status),
      amount: webhookData.data.amount,
    };
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    try {
      const checkout = await this.client.getCheckout(paymentId);
  
      return {
        id: checkout.id,
        status: checkout.status as 'paid' | 'failed' | 'canceled',
        amount: (checkout as any).amount_total || 0,
        currency: (checkout as any).currency || 'dzd',
        payment_method: (checkout as any).payment_method || '',
        customer_id: (checkout as any).customer?.id || '',
        description: (checkout as any).metadata?.invoice_number || '',
        created_at: checkout.created_at,
        updated_at: checkout.updated_at,
      };
    } catch (error) {
      console.error('Chargili Pay API Error:', error);
      throw new Error('Failed to get payment status from Chargili Pay');
    }
  }
}

export default new ChargiliPayService();

