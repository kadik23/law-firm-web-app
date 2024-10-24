const adminController = require('../controllers/AdminController.js')


const authMiddleware = require("../middlewares/AuthMiddleware.js")
const checkAdminMiddleware = require("../middlewares/CheckAdminMiddleware.js")

const adminRouter = require('express').Router()



adminRouter.post('/contactus' ,adminController.contactForm);
adminRouter.post('/categories/add',authMiddleware,checkAdminMiddleware,adminController.addCategory);
adminRouter.get('/categories/all',authMiddleware,checkAdminMiddleware,adminController.getAllCategories);
adminRouter.get('/categories/name',authMiddleware,checkAdminMiddleware,adminController.getCategoryByName);
adminRouter.delete('/categories/delete',authMiddleware,checkAdminMiddleware,adminController.deleteCategory);






module.exports = adminRouter