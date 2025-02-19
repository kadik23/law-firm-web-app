const categoriesController = require('../controllers/Admin/Categories.js')
const contactformController = require('../controllers/Admin/ContactForm.js')
const blogsController = require('../controllers/Admin/Blogs.js')
const attorneysController = require('../controllers/Admin/attorneys.js')
const servicesController = require('../controllers/Admin/Services.js')
const validationErrors=require("../errorHandler/validationErrors")
const contactSchema=require('../schema/contactFormSchema')
const categoriesSchema=require('../schema/categoriesSchema')
const attroneySchema=require('../schema/attroneySchema')
const blogsSchema=require('../schema/blogsSchema')
const servicesSchema=require('../schema/servicesSchema')

const authMiddleware = require("../middlewares/AuthMiddleware.js")

const adminRouter = require('express').Router()



adminRouter.post('/contactus',contactSchema.add,validationErrors ,contactformController.contactForm);

adminRouter.post('/categories/add',authMiddleware(["admin"]),categoriesSchema.add,validationErrors,categoriesController.addCategory);
adminRouter.post('/attorney/add',authMiddleware(["admin"]),attroneySchema.add,validationErrors,attorneysController.createAttorney);
adminRouter.delete('/categories/delete',authMiddleware(["admin"]),categoriesSchema.remove,validationErrors,categoriesController.deleteCategory);


adminRouter.post('/blogs/add',authMiddleware(["admin"]),blogsSchema.add,validationErrors,blogsController.addBlog)
adminRouter.put('/blogs/update',authMiddleware(["admin"]),blogsSchema.update,validationErrors,blogsController.updateBlog)
adminRouter.delete('/blogs/delete',authMiddleware(["admin"]),blogsSchema.remove,validationErrors,blogsController.deleteBlog)

adminRouter.post('/services/create',authMiddleware(["admin"]),servicesSchema.add,validationErrors,servicesController.createService)



module.exports = adminRouter