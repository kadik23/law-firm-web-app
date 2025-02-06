const categoriesController = require('../controllers/Admin/Categories.js')
const contactformController = require('../controllers/Admin/ContactForm.js')
const blogsController = require('../controllers/Admin/Blogs.js')
const attorneysController = require('../controllers/Admin/attorneys.js')
const servicesController = require('../controllers/Admin/Services.js')

const authMiddleware = require("../middlewares/AuthMiddleware.js")
const checkAdminMiddleware = require("../middlewares/CheckAdminMiddleware.js")

const adminRouter = require('express').Router()



adminRouter.post('/contactus' ,contactformController.contactForm);

adminRouter.post('/categories/add',authMiddleware(["admin"]),checkAdminMiddleware,categoriesController.addCategory);
adminRouter.post('/attorney/add',authMiddleware(["admin"]),checkAdminMiddleware,attorneysController.createAttorney);
adminRouter.delete('/categories/delete',authMiddleware(["admin"]),checkAdminMiddleware,categoriesController.deleteCategory);

adminRouter.post('/blogs/add',authMiddleware(["admin"]),checkAdminMiddleware,blogsController.addBlog)
adminRouter.put('/blogs/update',authMiddleware(["admin"]),checkAdminMiddleware,blogsController.updateBlog)
adminRouter.delete('/blogs/delete',authMiddleware(["admin"]),checkAdminMiddleware,blogsController.deleteBlog)

adminRouter.post('/services/create',authMiddleware(["admin"]),checkAdminMiddleware,servicesController.createService)



module.exports = adminRouter