import nodemailer from 'nodemailer';
import { Request, Response } from 'express';

/**
 * @swagger
 * /admin/contactus:
 *   post:
 *     summary: Send a contact form message
 *     description: This endpoint allows users to send a contact message. No authentication is required.
 *     tags:
 *       - Contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's first name
 *                 example: "John"
 *               surname:
 *                 type: string
 *                 description: The user's surname
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *                 example: "john.doe@example.com"
 *               message:
 *                 type: string
 *                 description: The message to be sent
 *                 example: "I have a question about your services."
 *     responses:
 *       200:
 *         description: The message was sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Message sent successfully"
 *                 messageId:
 *                   type: string
 *                   description: The unique identifier for the sent message
 *                   example: "<unique-message-id>"
 *       500:
 *         description: Internal Server Error - An error occurred while sending the message
 */

export const contactForm = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, surname, email, message } = req.body;
        if (!name || !surname || !email || !message) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        let info = await transporter.sendMail({
            from: `"${name} ${surname}" <${process.env.EMAIL_USER}>`,
            to: "kadiksalah03@gmail.com",
            subject: `Contact us - ${email}`,
            text: message,
            replyTo: email, 
        });
        console.log(info.messageId);
        res.status(200).json({ message: 'Message sent successfully', messageId: info.messageId });
    } catch (e: any) {
        console.error('Error sending message', e);
        res.status(500).send('Internal Server Error');
    }
};