
const userController = require('../controllers/AuthController.js')
const authMiddleware = require("../middlewares/AuthMiddleware.js")
const categoriesController = require("../controllers/User/Categories.js");
const blogsController = require("../controllers/User/Blogs");
const attorneysController = require('../controllers/User/attorneys.js');
const favoritesController = require('../controllers/User/Favorites.js');
const blogCommentsController = require('../controllers/User/BlogComments');
const servicesController = require('../controllers/User/Services.js');
const testimonialsController = require("../controllers/User/testimonials");
const authSchema=require("../schema/authSchema.js")
const categoriesSchema=require("../schema/categoriesSchema.js")
const blogsSchema=require("../schema/blogsSchema.js")
const commentsSchema=require("../schema/blogCommentsSchema")
const favoriteSchema=require("../schema/blogsFavorite")
const servicesSchema=require("../schema/servicesSchema")
const validationErrors=require("../errorHandler/validationErrors")

const userRouter = require('express').Router()



userRouter.post('/signup',authSchema.signup,validationErrors,userController.signUp);
userRouter.post('/uploadFiles', authMiddleware(["client","admin","attorney"]),userController.addFiles);//TODO("validation not working here")
userRouter.post('/signin',authSchema.signIn,validationErrors ,userController.signIn);
userRouter.get('/current' ,authMiddleware(["client","admin","attorney"]),userController.getCurrentClient);
userRouter.get('/validate' ,authMiddleware(["client","admin","attorney"]),userController.checkUserAuthentication);
userRouter.get('/logout' ,authMiddleware(["client","admin","attorney"]),userController.logout);

userRouter.get('/categories/all',categoriesController.getAllCategories);
userRouter.get('/categories/:name',categoriesSchema.getByName,validationErrors,categoriesController.getCategoryByName);

userRouter.get('/blogs/all',blogsController.getAllBlogs);
userRouter.post('/blogs/likeblog',authMiddleware(["client","admin","attorney"]),blogsSchema.like,validationErrors(),blogsController.likeBlog);
userRouter.get('/blogs/sort',blogsSchema.sort,validationErrors,blogsController.sortBlogs);
userRouter.get('/blogs/:id',blogsSchema.getById,validationErrors,blogsController.getBlogById);


userRouter.post('/blogs/addcomment',authMiddleware(["client","admin","attorney"]),commentsSchema.add,validationErrors, blogCommentsController.addBlogComment);
userRouter.delete('/blogs/deletecomment',authMiddleware(["client","admin","attorney"]),commentsSchema.remove,validationErrors, blogCommentsController.deleteBlogComment);
userRouter.put('/blogs/updatecomment',authMiddleware(["client","admin","attorney"]),commentsSchema.update,validationErrors, blogCommentsController.updateBlogComment);
userRouter.post('/blogs/replycomment',authMiddleware(["client","admin","attorney"]),commentsSchema.reply,validationErrors, blogCommentsController.replyComment);
userRouter.post('/blogs/likecomment',authMiddleware(["client","admin","attorney"]),commentsSchema.like,validationErrors, blogCommentsController.likeComment);
userRouter.get('/blogs/commentsByBlog/:id',commentsSchema.getByBlog,validationErrors,blogCommentsController.getCommentsByBlog);

userRouter.get('/attorneys',attorneysController.getAllAttorneys);

userRouter.post('/favorites',authMiddleware(["client"]),favoriteSchema.add,validationErrors,favoritesController.CreateFavoriteBlog);
userRouter.get('/favorites',authMiddleware(["client"]),favoritesController.GetAllFavoriteBlogs);
userRouter.delete('/favorites/:id',authMiddleware(["client"]),favoriteSchema.remove,validationErrors,favoritesController.DeleteFavoriteBlog);
userRouter.get('/favorites/search',authMiddleware(["client"]),favoriteSchema.search,validationErrors,favoritesController.SearchFavoriteBlogs);
userRouter.get('/favorites/count',authMiddleware(["client"]),favoritesController.GetFavoritesCount);
userRouter.get('/favorites/IsBlogFavorited/:blogId',authMiddleware(["client","admin","attorney"]),favoriteSchema.isFavorite,validationErrors,favoritesController.IsBlogFavorited);
userRouter.delete('/favorites',authMiddleware(["client"]),favoritesController.DeleteAllFavorites);

userRouter.get('/services',authMiddleware(["client","admin","attorney"]),servicesController.getAllServices);
userRouter.get('/services/:id',authMiddleware(["client","admin","attorney"]),servicesSchema.getById,validationErrors,servicesController.getOneService);


module.exports = userRouter
