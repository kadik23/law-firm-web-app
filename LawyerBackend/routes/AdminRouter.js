const express = require('express');

const authMiddleware = require('../middlewares/AuthMiddleware.js');
const validationErrors = require('../errorHandler/validationErrors');

const categoriesController = require('../controllers/Admin/Categories.js');
const contactformController = require('../controllers/Admin/ContactForm.js');
const blogsController = require('../controllers/Admin/Blogs.js');
const attorneysController = require('../controllers/Admin/attorneys.js');
const servicesController = require('../controllers/Admin/Services.js');
const problemsController = require('../controllers/Admin/Problems.js');
const availableTimeController = require('../controllers/Admin/AvailableTime.js');

const contactSchema = require('../schema/contactFormSchema');
const categoriesSchema = require('../schema/categoriesSchema');
const attorneySchema = require('../schema/attorneySchema'); // Fixed typo
const blogsSchema = require('../schema/blogsSchema');
const servicesSchema = require('../schema/servicesSchema');
const problemsSchema = require('../schema/problemsSchema');
const availableTimeSchema = require('../schema/FreeTimeSchema.js');

const adminRouter = express.Router();

// Contact Form
adminRouter.post('/contactus', contactSchema.add, validationErrors, contactformController.contactForm);

// Categories
adminRouter.post('/categories/add', authMiddleware(['admin']), categoriesSchema.add, validationErrors, categoriesController.addCategory);
adminRouter.delete('/categories/delete', authMiddleware(['admin']), categoriesSchema.remove, validationErrors, categoriesController.deleteCategory);

// Attorneys
adminRouter.post('/attorney/add', authMiddleware(['admin']), attorneysController.createAttorney);
adminRouter.get('/attorneys', authMiddleware(['admin']), attorneySchema.getAttorneys, validationErrors, attorneysController.getAdminAttorneys); // Added pagination & search
adminRouter.get('/attorneys/search',authMiddleware(["admin"]),attorneySchema.search,validationErrors,attorneysController.searchAttorneys);
adminRouter.delete('/attorney/delete',authMiddleware(["admin"]),attorneySchema.remove,validationErrors,attorneysController.deleteAttorneys);

// Blogs
adminRouter.post('/blogs/add', authMiddleware(['admin']), blogsController.addBlog);
adminRouter.put('/blogs/update', authMiddleware(['admin']), blogsController.updateBlog);
adminRouter.delete('/blogs/delete', authMiddleware(['admin']), blogsSchema.remove, validationErrors, blogsController.deleteBlog);
adminRouter.get('/blogs/filter', authMiddleware(['admin']), blogsController.filterBlogs);
adminRouter.get('/blogs/', authMiddleware(['admin']), blogsController.getAllBlogs);

// Services
adminRouter.post('/services/create', authMiddleware(['admin']), servicesController.createService);
adminRouter.put('/services/update', authMiddleware(['admin']), servicesController.updateService);
adminRouter.delete('/services/delete',authMiddleware(["admin"]),servicesSchema.remove,validationErrors,servicesController.deleteServices)
adminRouter.get('/services',authMiddleware(["admin"]),servicesController.getAdminServices)

// Problems
adminRouter.post('/problems', authMiddleware(['admin']), problemsSchema.add, validationErrors, problemsController.createProblem);
adminRouter.delete('/problems/:id', authMiddleware(['admin']), problemsSchema.remove, validationErrors, problemsController.deleteProblem);

//FreeTime
adminRouter.post('/available-times', authMiddleware(["admin"]), availableTimeSchema.createAvailableTime, validationErrors, availableTimeController.createAvailableTime);
adminRouter.get('/available-times', authMiddleware(['admin']), availableTimeController.getAllAvailableTimes);
adminRouter.delete('/available-times', authMiddleware(['admin']), availableTimeSchema.deleteAvailableTimes, availableTimeController.deleteAvailableTimes);

module.exports = adminRouter;
