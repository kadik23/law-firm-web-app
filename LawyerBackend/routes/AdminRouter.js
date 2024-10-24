const adminController = require('../controllers/AdminController.js')


const authMiddleware = require("../middlewares/AuthMiddleware.js")
const checkAdminMiddleware = require("../middlewares/CheckAdminMiddleware.js")

const adminRouter = require('express').Router()



adminRouter.post('/contactus' ,adminController.contactForm);
adminRouter.post('/addcategory',authMiddleware,checkAdminMiddleware,adminController.addCategory);






module.exports = adminRouter