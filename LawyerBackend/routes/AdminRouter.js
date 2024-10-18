const adminController = require('../controllers/AdminController.js')




const adminRouter = require('express').Router()



adminRouter.post('/contactus' ,adminController.contactForm);






module.exports = adminRouter