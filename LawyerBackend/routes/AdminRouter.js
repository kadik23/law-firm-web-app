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
const problemsSchema=require("../schema/problemsSchema")
const problemsController = require("../controllers/Admin/problems.js");

const authMiddleware = require("../middlewares/AuthMiddleware.js")

const adminRouter = require('express').Router()



adminRouter.post('/contactus',contactSchema.add,validationErrors ,contactformController.contactForm);

adminRouter.post('/categories/add',authMiddleware(["admin"]),categoriesSchema.add,validationErrors,categoriesController.addCategory);
adminRouter.delete('/categories/delete',authMiddleware(["admin"]),categoriesSchema.remove,validationErrors,categoriesController.deleteCategory);

adminRouter.post('/attorney/add',authMiddleware(["admin"]),attorneysController.createAttorney);
adminRouter.delete('/attorney/delete',authMiddleware(["admin"]),attroneySchema.remove,validationErrors,attorneysController.deleteAttorneys);

adminRouter.post('/blogs/add',authMiddleware(["admin"]),blogsController.addBlog)
adminRouter.put('/blogs/update',authMiddleware(["admin"]),blogsController.updateBlog)
adminRouter.delete('/blogs/delete',authMiddleware(["admin"]),blogsSchema.remove,validationErrors,blogsController.deleteBlog)

adminRouter.post('/services/create',authMiddleware(["admin"]),servicesController.createService)
adminRouter.delete('/services/delete',authMiddleware(["admin"]),servicesSchema.remove,validationErrors,servicesController.deleteServices)

adminRouter.post('/problems', authMiddleware(["admin"]),problemsSchema.add,validationErrors, problemsController.createProblem);

adminRouter.delete('/problems/:id', authMiddleware(["admin"]),problemsSchema.remove,validationErrors, problemsController.deleteProblem);

module.exports = adminRouter