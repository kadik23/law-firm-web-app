
const userController = require('../controllers/AuthController.js')
const authMiddleware = require("../middlewares/AuthMiddleware.js")
const categoriesController = require("../controllers/User/Categories.js");
const blogsController = require("../controllers/User/Blogs");
const attorneysController = require('../controllers/User/attorneys.js');
const favoritesController = require('../controllers/User/Favorites.js');
const blogCommentsController = require('../controllers/User/BlogComments');
const servicesController = require('../controllers/User/Services.js');



const userRouter = require('express').Router()



userRouter.post('/signup' ,userController.signUp);
userRouter.post('/uploadFiles', authMiddleware(["client"]),userController.addFiles);
userRouter.post('/signin' ,userController.signIn);
userRouter.get('/current' ,authMiddleware(["client","admin","attorney"]),userController.getCurrentClient);
userRouter.get('/validate' ,authMiddleware(["client","admin","attorney"]),userController.checkUserAuthentication);

userRouter.get('/categories/all',categoriesController.getAllCategories);
userRouter.get('/categories/name',categoriesController.getCategoryByName);

userRouter.get('/blogs/all',blogsController.getAllBlogs);
userRouter.get('/blogs/:id',blogsController.getBlogById);
userRouter.post('/blogs/likeblog',authMiddleware(["client","admin","attorney"]),blogsController.likeBlog);
userRouter.get('/blogs/sort',blogsController.sortBlogs);


userRouter.post('/blogs/addcomment',authMiddleware(["client","admin","attorney"]), blogCommentsController.addBlogComment);
userRouter.delete('/blogs/deletecomment',authMiddleware(["client","admin","attorney"]), blogCommentsController.deleteBlogComment);
userRouter.put('/blogs/updatecomment',authMiddleware(["client","admin","attorney"]), blogCommentsController.updateBlogComment);
userRouter.post('/blogs/replycomment',authMiddleware(["client","admin","attorney"]), blogCommentsController.replyComment);
userRouter.post('/blogs/likecomment',authMiddleware(["client","admin","attorney"]), blogCommentsController.likeComment);
userRouter.get('/blogs/commentsByBlog/:id',blogCommentsController.getCommentsByBlog);

userRouter.get('/attorneys',attorneysController.getAllAttorneys);

userRouter.post('/favorites',authMiddleware(["client"]),favoritesController.CreateFavoriteBlog);
userRouter.get('/favorites',authMiddleware(["client"]),favoritesController.GetAllFavoriteBlogs);
userRouter.delete('/favorites/:id',authMiddleware(["client"]),favoritesController.DeleteFavoriteBlog);
userRouter.delete('/favorites',authMiddleware(["client"]),favoritesController.DeleteAllFavorites);
userRouter.get('/favorites/search',authMiddleware(["client"]),favoritesController.SearchFavoriteBlogs);
userRouter.get('/favorites/count',authMiddleware(["client"]),favoritesController.GetFavoritesCount);

userRouter.get('/services',authMiddleware,servicesController.getAllServices);
userRouter.get('/services/:id',authMiddleware,servicesController.getOneService);


module.exports = userRouter
