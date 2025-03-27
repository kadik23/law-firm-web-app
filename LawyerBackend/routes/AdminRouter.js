const express = require('express');

const authMiddleware = require('../middlewares/AuthMiddleware.js');
const validationErrors = require('../errorHandler/validationErrors');

const categoriesController = require('../controllers/Admin/Categories.js');
const contactformController = require('../controllers/Admin/ContactForm.js');
const blogsController = require('../controllers/Admin/Blogs.js');
const attorneysController = require('../controllers/Admin/attorneys.js');
const servicesController = require('../controllers/Admin/Services.js');
const problemsController = require('../controllers/Admin/Problems.js');

const contactSchema = require('../schema/contactFormSchema');
const categoriesSchema = require('../schema/categoriesSchema');
const attorneySchema = require('../schema/attorneySchema'); // Fixed typo
const blogsSchema = require('../schema/blogsSchema');
const servicesSchema = require('../schema/servicesSchema');
const problemsSchema = require('../schema/problemsSchema');

const adminRouter = express.Router();

// Contact Form
adminRouter.post('/contactus', contactSchema.add, validationErrors, contactformController.contactForm);

// Categories
adminRouter.post('/categories/add', authMiddleware(['admin']), categoriesSchema.add, validationErrors, categoriesController.addCategory);
adminRouter.delete('/categories/delete', authMiddleware(['admin']), categoriesSchema.remove, validationErrors, categoriesController.deleteCategory);

// Attorneys
adminRouter.post('/attorney/add', authMiddleware(['admin']), attorneySchema.add, validationErrors, attorneysController.createAttorney);
adminRouter.get('/attorneys', authMiddleware(['admin']), attorneySchema.getAttorneys, validationErrors, attorneysController.getAdminAttorneys); // Added pagination & search
adminRouter.get('/attorneys/search',authMiddleware(["admin"]),attorneySchema.search,validationErrors,attorneysController.searchAttorneys);
// Blogs
adminRouter.post('/blogs/add', authMiddleware(['admin']), blogsSchema.add, validationErrors, blogsController.addBlog);
adminRouter.put('/blogs/update', authMiddleware(['admin']), blogsSchema.update, validationErrors, blogsController.updateBlog);
adminRouter.delete('/blogs/delete', authMiddleware(['admin']), blogsSchema.remove, validationErrors, blogsController.deleteBlog);

// Services
adminRouter.post('/services/create', authMiddleware(['admin']), servicesSchema.add, validationErrors, servicesController.createService);

// Problems
adminRouter.post('/problems', authMiddleware(['admin']), problemsSchema.add, validationErrors, problemsController.createProblem);
adminRouter.delete('/problems/:id', authMiddleware(['admin']), problemsSchema.remove, validationErrors, problemsController.deleteProblem);

module.exports = adminRouter;
