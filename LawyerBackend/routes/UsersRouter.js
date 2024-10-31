
const userController = require('../controllers/UserController.js')

const authMiddleware = require("../middlewares/AuthMiddleware.js")
const categoriesController = require("../controllers/User/Categories.js");
const blogsController = require("../controllers/User/Blogs");



const userRouter = require('express').Router()



userRouter.post('/signup' ,userController.signUp);
userRouter.post('/uploadFiles', authMiddleware,userController.addFiles)
userRouter.post('/signin' ,userController.signIn);

userRouter.get('/categories/all',categoriesController.getAllCategories);
userRouter.get('/categories/name',categoriesController.getCategoryByName);

userRouter.get('/blogs/all',blogsController.getAllBlogs)




module.exports = userRouter