const db = require('../models')






require("dotenv").config()
const { sequelize } = require('../models'); // Import the Sequelize instance
const { QueryTypes, NOW} = require('sequelize');
const {upload} = require("../middlewares/FilesMiddleware.js");
const fs = require('fs');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const users = db.users
const files = db.files



const signUp = async (req, res) => {
    try {

            const { name, surname, email, password, phone_number, pays, ville, age, sex,terms_accepted } = req.body;

            console.log(password)

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

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
                terms_accepted
            });

            if (!newUser) {
                return res.status(401).send('Error creating user.');
            }
            console.log(process.env.SECRET)
            const token = jwt.sign({user : newUser}, "itsasecret", {expiresIn: "7d"})
            console.log("Success sign in")
            res.status(200).send({token:token})

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
};

const uploadFiles = upload.any();

const addFiles = async (req, res) => {
    try {
        uploadFiles(req, res, async (err) => {
            if (err) {
                return res.status(400).send('Error uploading files: ' + err.message);
            }

            const uploadedFiles = req.files;
            if (!uploadedFiles || uploadedFiles.length === 0) {
                return res.status(400).send('No files were uploaded.');
            }

            const userId = req.user.id;

            const fileRecords = uploadedFiles.map(file => ({
                path: file.path,
                userId: userId,
            }));

            await files.bulkCreate(fileRecords);

            res.status(200).json({ message: 'Files uploaded successfully', files: fileRecords });
        });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).send('Internal Server Error');
    }
};


const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await users.findOne({ where: { email } });

        if (!user) {
            return res.status(401).send('Invalid email or password.');
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send('Invalid email or password.');
        }
        const token = jwt.sign({ user: { id: user.id, email: user.email } }, "itisasecret", { expiresIn: '7d' });

        console.log("Successful sign in");
        res.status(200).send({ token });
    } catch (error) {
        console.error('Error during sign in:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    signUp,
    addFiles,
    signIn
};
