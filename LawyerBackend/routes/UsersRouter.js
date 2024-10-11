
const userController = require('../controllers/UserController.js')




const userRouter = require('express').Router()



userRouter.post('/signup',  userController.signUp);




module.exports = userRouter