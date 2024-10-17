
const userController = require('../controllers/UserController.js')

const authMiddleware = require("../middlewares/AuthMiddleware.js")



const userRouter = require('express').Router()



userRouter.post('/signup' ,userController.signUp);
userRouter.post('/uploadFiles', authMiddleware,userController.addFiles)



module.exports = userRouter