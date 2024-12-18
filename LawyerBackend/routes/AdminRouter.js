const categoriesController = require('../controllers/Admin/Categories.js')
const contactformController = require('../controllers/Admin/ContactForm.js')
const blogsController = require('../controllers/Admin/Blogs.js')
const attorneysController = require('../controllers/Admin/attorneys.js')

const authMiddleware = require("../middlewares/AuthMiddleware.js")
const checkAdminMiddleware = require("../middlewares/CheckAdminMiddleware.js")

const adminRouter = require('express').Router()



adminRouter.post('/contactus' ,contactformController.contactForm);

adminRouter.post('/categories/add',authMiddleware,checkAdminMiddleware,categoriesController.addCategory);
adminRouter.post('/attorney/add',authMiddleware,checkAdminMiddleware,attorneysController.createAttorney);
adminRouter.delete('/categories/delete',authMiddleware,checkAdminMiddleware,categoriesController.deleteCategory);

adminRouter.post('/blogs/add',authMiddleware,checkAdminMiddleware,blogsController.addBlog)
adminRouter.put('/blogs/update',authMiddleware,checkAdminMiddleware,blogsController.updateBlog)
adminRouter.delete('/blogs/delete',authMiddleware,checkAdminMiddleware,blogsController.deleteBlog)





module.exports = adminRouter