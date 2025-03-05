const userController = require('../controllers/AuthController.js');
const authMiddleware = require("../middlewares/AuthMiddleware.js");
const categoriesController = require("../controllers/User/Categories.js");
const blogsController = require("../controllers/User/Blogs");
const attorneysController = require('../controllers/User/Attorneys.js');
const favoritesController = require('../controllers/User/Favorites.js');
const blogCommentsController = require('../controllers/User/BlogComments');
const servicesController = require('../controllers/User/Services.js');
const authSchema=require("../schema/authSchema.js")
const categoriesSchema=require("../schema/categoriesSchema.js")
const blogsSchema=require("../schema/blogsSchema.js")
const commentsSchema=require("../schema/blogCommentsSchema")
const favoriteSchema=require("../schema/blogsFavorite")
const servicesSchema=require("../schema/servicesSchema")
const testimonialSchema=require("../schema/testimonialSchema")
const problemsSchema=require("../schema/problemsSchema")
const consultationSchema=require("../schema/consultationSchema")
const validationErrors=require("../errorHandler/validationErrors")
const testimonialsController = require("../controllers/User/Testimonials");
const problemsController = require("../controllers/User/problems.js");
const consultationController = require("../controllers/User/consultation.js");
const {upload} = require("../middlewares/FilesMiddleware");

const userRouter = require('express').Router();

// Authentication Routes
userRouter.post('/signup',authSchema.signup,validationErrors,userController.signUp);
userRouter.post('/uploadFiles', authMiddleware(["client","admin","attorney"]), userController.addFiles);
userRouter.post('/signin',authSchema.signIn,validationErrors ,userController.signIn);
userRouter.get('/current' ,authMiddleware(["client","admin","attorney"]),userController.getCurrentClient);
userRouter.get('/validate' ,authMiddleware(["client","admin","attorney"]),userController.checkUserAuthentication);
userRouter.get('/logout' ,authMiddleware(["client","admin","attorney"]),userController.logout);
//Categories Routes
userRouter.get('/categories/all',categoriesController.getAllCategories);
userRouter.get('/categories/:name',categoriesSchema.getByName,validationErrors,categoriesController.getCategoryByName);
//Blogs Routes
userRouter.get('/blogs/all',blogsController.getAllBlogs);
userRouter.post('/blogs/likeblog',authMiddleware(["client","admin","attorney"]),blogsSchema.like,validationErrors,blogsController.likeBlog);
userRouter.get('/blogs/sort',blogsSchema.sort,validationErrors,blogsController.sortBlogs);
userRouter.get('/blogs/:id',blogsSchema.getById,validationErrors,blogsController.getBlogById);

// Attorneys Routes
userRouter.get('/attorneys', attorneysController.getAllAttorneys);

//Comments Routes
userRouter.post('/blogs/addcomment',authMiddleware(["client","admin","attorney"]),commentsSchema.add,validationErrors, blogCommentsController.addBlogComment);
userRouter.delete('/blogs/deletecomment',authMiddleware(["client","admin","attorney"]),commentsSchema.remove,validationErrors, blogCommentsController.deleteBlogComment);
userRouter.put('/blogs/updatecomment',authMiddleware(["client","admin","attorney"]),commentsSchema.update,validationErrors, blogCommentsController.updateBlogComment);
userRouter.post('/blogs/replycomment',authMiddleware(["client","admin","attorney"]),commentsSchema.reply,validationErrors, blogCommentsController.replyComment);
userRouter.post('/blogs/likecomment',authMiddleware(["client","admin","attorney"]),commentsSchema.like,validationErrors, blogCommentsController.likeComment);
userRouter.get('/blogs/commentsByBlog/:id',commentsSchema.getByBlog,validationErrors,blogCommentsController.getCommentsByBlog);

//Favorite Routes
userRouter.post('/favorites',authMiddleware(["client"]),favoriteSchema.add,validationErrors,favoritesController.CreateFavoriteBlog);
userRouter.get('/favorites',authMiddleware(["client"]),favoritesController.GetAllFavoriteBlogs);
userRouter.delete('/favorites/:id',authMiddleware(["client"]),favoriteSchema.remove,validationErrors,favoritesController.DeleteFavoriteBlog);
userRouter.get('/favorites/search',authMiddleware(["client"]),favoriteSchema.search,validationErrors,favoritesController.SearchFavoriteBlogs);
userRouter.get('/favorites/count',authMiddleware(["client"]),favoritesController.GetFavoritesCount);
userRouter.get('/favorites/IsBlogFavorited/:blogId',authMiddleware(["client","admin","attorney"]),favoriteSchema.isFavorite,validationErrors,favoritesController.IsBlogFavorited);
userRouter.delete('/favorites',authMiddleware(["client"]),favoritesController.DeleteAllFavorites);

//Services Routes
userRouter.get('/services',authMiddleware(["client","admin","attorney"]),servicesController.getAllServices);
userRouter.get('/services/:id',authMiddleware(["client","admin","attorney"]),servicesSchema.getById,validationErrors,servicesController.getOneService);
userRouter.post('/services/assign_client',authMiddleware(["client", "admin", "attorney"]),servicesSchema.assignClient,validationErrors,servicesController.assignClient);
userRouter.delete('/service-files/:request_service_id', authMiddleware(["client"]), servicesController.deleteServiceFiles);
userRouter.put('/service-files/:request_service_id',authMiddleware(["client"]),upload.single('file'),servicesController.updateServiceFile);
userRouter.post('/service-files/:request_service_id',authMiddleware(["client"]),servicesController.uploadServiceFiles);

// Testimonials Routes
userRouter.post('/testimonials', authMiddleware(["client"]),testimonialSchema.add,validationErrors, testimonialsController.CreateTestimonial);
userRouter.get('/testimonials', testimonialsController.GetAllTestimonials);
userRouter.get('/testimonials/service/:serviceId',testimonialSchema.getByService,validationErrors, testimonialsController.GetTestimonialsByService);

// Problems Routes
userRouter.get('/problems', authMiddleware(["client", "admin", "attorney"]), problemsController.getAllProblems);
userRouter.get('/problems/:id', authMiddleware(["client", "admin", "attorney"]),problemsSchema.getByID,validationErrors, problemsController.getProblemById);

// Consultation Routes
userRouter.post('/consultations', authMiddleware(["client"]),consultationSchema.add,validationErrors, consultationController.createConsultation);

// Consultation Routes
userRouter.post('/consultations', authMiddleware(["client"]), consultationController.createConsultation);

module.exports = userRouter;
