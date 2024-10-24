const nodemailer = require("nodemailer");
require('dotenv').config();
const db = require('../models')
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
const addCategory = async (req,res)=> {
    try {
        console.log("controller:" + req.body)
        const {name} = req.body;
        let newCategory = await categories.create({
            name
        });

        if (!newCategory) {
            return res.status(401).send('Error creating category');
        }else {
            return res.status(200).send(newCategory);
        }
    } catch (e) {
        console.error('Error creating category', e);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    contactForm,
    addCategory
};
