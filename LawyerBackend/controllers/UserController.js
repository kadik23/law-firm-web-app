const db = require('../models')







const { sequelize } = require('../models'); // Import the Sequelize instance
const { QueryTypes, NOW} = require('sequelize');
const {upload} = require("../middlewares/FilesMiddleware.js");
const fs = require('fs');
const bcrypt = require("bcrypt")

const users = db.users

const uploadFiles = upload.fields([
    { name: "file", maxCount: 1 }
]);

const signUp = async (req, res) => {
    try {
        uploadFiles(req, res, async (err) => {
            if (err) {
                return res.status(400).send('Error uploading files: ' + err.message);
            }

            const { name, surname, email, password, phone_number, pays, ville, age, sex,terms_accepted } = req.body;
            const { file } = req.files;

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)


            const filePath = file ? file[0].path : null;


            let newUser = await users.create({
                name,
                surname,
                email,
                password: hashedPassword,
                phone_number,
                pays,
                ville,
                age,
                sex,
                terms_accepted,
                file: filePath
            });

            if (!newUser) {
                return res.status(401).send('Error creating user.');
            }

            res.status(200).json(newUser);
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
signUp
}