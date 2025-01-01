
const userController = require('../controllers/AuthController.js')

const authMiddleware = require("../middlewares/AuthMiddleware.js")
const categoriesController = require("../controllers/User/Categories.js");
const blogsController = require("../controllers/User/Blogs");
const attorneysController = require('../controllers/User/attorneys.js');
const favoritesController = require('../controllers/User/Favorites.js');



const userRouter = require('express').Router()



userRouter.post('/signup' ,userController.signUp);
userRouter.post('/uploadFiles', authMiddleware,userController.addFiles);
userRouter.post('/signin' ,userController.signIn);

userRouter.get('/categories/all',categoriesController.getAllCategories);
userRouter.get('/categories/name',categoriesController.getCategoryByName);

userRouter.get('/blogs/all',blogsController.getAllBlogs);
userRouter.get('/blogs/:id',blogsController.getBlogById);

userRouter.get('/attorneys',attorneysController.getAllAttorneys);

userRouter.post('/favorites',authMiddleware,favoritesController.CreateFavoriteBlog);
userRouter.get('/favorites',authMiddleware,favoritesController.GetAllFavoriteBlogs);
userRouter.delete('/favorites/:id',authMiddleware,favoritesController.DeleteFavoriteBlog);



module.exports = userRouter
