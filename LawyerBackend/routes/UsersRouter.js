const userController = require('../controllers/AuthController.js');
const authMiddleware = require("../middlewares/AuthMiddleware.js");
const categoriesController = require("../controllers/User/Categories.js");
const blogsController = require("../controllers/User/Blogs");
const attorneysController = require('../controllers/User/Attorneys.js');
const favoritesController = require('../controllers/User/Favorites.js');
const blogCommentsController = require('../controllers/User/BlogComments');
const servicesController = require('../controllers/User/Services.js');
const testimonialsController = require("../controllers/User/Testimonials");
const problemsController = require("../controllers/User/problems.js");

const userRouter = require('express').Router();

// Authentication Routes
userRouter.post('/signup', userController.signUp);
userRouter.post('/uploadFiles', authMiddleware(["client", "admin", "attorney"]), userController.addFiles);
userRouter.post('/signin', userController.signIn);
userRouter.get('/current', authMiddleware(["client", "admin", "attorney"]), userController.getCurrentClient);
userRouter.get('/validate', authMiddleware(["client", "admin", "attorney"]), userController.checkUserAuthentication);

// Categories Routes
userRouter.get('/categories/all', categoriesController.getAllCategories);
userRouter.get('/categories/name', categoriesController.getCategoryByName);

// Blogs Routes
userRouter.get('/blogs/all', blogsController.getAllBlogs);
userRouter.post('/blogs/likeblog', authMiddleware(["client", "admin", "attorney"]), blogsController.likeBlog);
userRouter.get('/blogs/sort', blogsController.sortBlogs);
userRouter.get('/blogs/:id', blogsController.getBlogById);

// Blog Comments Routes
userRouter.post('/blogs/addcomment', authMiddleware(["client", "admin", "attorney"]), blogCommentsController.addBlogComment);
userRouter.delete('/blogs/deletecomment', authMiddleware(["client", "admin", "attorney"]), blogCommentsController.deleteBlogComment);
userRouter.put('/blogs/updatecomment', authMiddleware(["client", "admin", "attorney"]), blogCommentsController.updateBlogComment);
userRouter.post('/blogs/replycomment', authMiddleware(["client", "admin", "attorney"]), blogCommentsController.replyComment);
userRouter.post('/blogs/likecomment', authMiddleware(["client", "admin", "attorney"]), blogCommentsController.likeComment);
userRouter.get('/blogs/commentsByBlog/:id', blogCommentsController.getCommentsByBlog);

// Attorneys Routes
userRouter.get('/attorneys', attorneysController.getAllAttorneys);

// Favorites Routes
userRouter.post('/favorites', authMiddleware(["client"]), favoritesController.CreateFavoriteBlog);
userRouter.get('/favorites', authMiddleware(["client"]), favoritesController.GetAllFavoriteBlogs);
userRouter.delete('/favorites/:id', authMiddleware(["client"]), favoritesController.DeleteFavoriteBlog);
userRouter.get('/favorites/search', authMiddleware(["client"]), favoritesController.SearchFavoriteBlogs);
userRouter.get('/favorites/count', authMiddleware(["client"]), favoritesController.GetFavoritesCount);
userRouter.get('/favorites/IsBlogFavorited/:blogId', authMiddleware(["client", "admin", "attorney"]), favoritesController.IsBlogFavorited);
userRouter.delete('/favorites', authMiddleware(["client"]), favoritesController.DeleteAllFavorites);

// Services Routes
userRouter.get('/services', servicesController.getAllServices);

// Testimonials Routes
userRouter.post('/testimonials', authMiddleware(["client"]), testimonialsController.CreateTestimonial);
userRouter.get('/testimonials', testimonialsController.GetAllTestimonials);
userRouter.get('/testimonials/service/:serviceId', testimonialsController.GetTestimonialsByService);

// Problems Routes
userRouter.get('/problems', authMiddleware(["client", "admin", "attorney"]), problemsController.getAllProblems);
userRouter.get('/problems/:id', authMiddleware(["client", "admin", "attorney"]), problemsController.getProblemById);

module.exports = userRouter;
