const categoriesController = require('../controllers/Admin/Categories.js')
const contactformController = require('../controllers/Admin/ContactForm.js')
const blogsController = require('../controllers/Admin/Blogs.js')
const attorneysController = require('../controllers/Admin/attorneys.js')
const servicesController = require('../controllers/Admin/Services.js')

const authMiddleware = require("../middlewares/AuthMiddleware.js")

const adminRouter = require('express').Router()



adminRouter.post('/contactus' ,contactformController.contactForm);

adminRouter.post('/categories/add',authMiddleware(["admin"]),categoriesController.addCategory);
adminRouter.post('/attorney/add',authMiddleware(["admin"]),attorneysController.createAttorney);
adminRouter.delete('/categories/delete',authMiddleware(["admin"]),categoriesController.deleteCategory);


adminRouter.post('/blogs/add',authMiddleware(["admin"]),blogsController.addBlog)
adminRouter.put('/blogs/update',authMiddleware(["admin"]),blogsController.updateBlog)
adminRouter.delete('/blogs/delete',authMiddleware(["admin"]),blogsController.deleteBlog)

adminRouter.post('/services/create',authMiddleware(["admin"]),servicesController.createService)



module.exports = adminRouter