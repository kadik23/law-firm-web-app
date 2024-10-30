const nodemailer = require("nodemailer");
require('dotenv').config();
const db = require('../../models')
const categories=db.categories
const contactForm = async (req, res) =>  {
    try {
        const {name, surname, email, message} = req.body;
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,

            },
        });


        let info = await transporter.sendMail({
            from: `${name} ${surname} <${email}>`,
            to: "buis.meriem.03@gmail.com",
            subject: "Contact us",
            text: message,
        });

        console.log(info.messageId);
        res.status(200).json({message: 'Message sent successfully', messageId: info.messageId});
    }catch (e) {
        console.error('Error sending message', e);
        res.status(500).send('Internal Server Error');
    }
}
module.exports = {
    contactForm,
};