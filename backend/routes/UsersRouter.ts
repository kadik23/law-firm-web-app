import express, { Router } from "express";
import * as userController from "@/controllers/AuthController";
import authMiddleware from "@/middlewares/AuthMiddleware";
import * as categoriesController from "@/controllers/User/Categories";
import * as blogsController from "@/controllers/User/Blogs";
import * as attorneysController from "@/controllers/User/attorneys";
import * as favoritesController from "@/controllers/User/Favorites";
import * as blogCommentsController from "@/controllers/User/BlogComments";
import * as servicesController from "@/controllers/User/Services";
import * as authSchema from "@/schema/authSchema";
import * as categoriesSchema from "@/schema/categoriesSchema";
import * as blogsSchema from "@/schema/blogsSchema";
import * as commentsSchema from "@/schema/blogCommentsSchema";
import * as favoriteSchema from "@/schema/blogsFavorite";
import * as servicesSchema from "@/schema/servicesSchema";
import * as testimonialSchema from "@/schema/testimonialSchema";
import * as problemsSchema from "@/schema/problemsSchema";
import * as consultationSchema from "@/schema/consultationSchema";
import { validationErrors } from "@/errorHandler/validationErrors";
import * as testimonialsController from "@/controllers/User/testimonials";
import * as problemsController from "@/controllers/User/problems";
import * as consultationController from "@/controllers/User/consultation";
import { upload } from "@/middlewares/FilesMiddleware";

const userRouter: Router = express.Router();

// Authentication Routes
userRouter.post(
  "/signup",
  authSchema.signup,
  validationErrors,
  userController.signUp
);
userRouter.post(
  "/uploadFiles",
  authMiddleware(["client", "admin", "attorney"]),
  userController.addFiles
);
userRouter.post(
  "/signin",
  authSchema.signIn,
  validationErrors,
  userController.signIn
);
userRouter.get(
  "/current",
  authMiddleware(["client", "admin", "attorney"]),
  userController.getCurrentClient
);
userRouter.get(
  "/validate",
  authMiddleware(["client", "admin", "attorney"]),
  userController.checkUserAuthentication
);
userRouter.get(
  "/logout",
  authMiddleware(["client", "admin", "attorney"]),
  userController.logout
);
userRouter.put(
  "/update",
  authMiddleware(["client", "admin", "attorney"]),
  userController.updateUserInfo
);
userRouter.put(
  "/update-password",
  authMiddleware(["client", "admin", "attorney"]),
  userController.updateUserPassword
);
//Categories Routes
userRouter.get("/categories/all", categoriesController.getAllCategories);
userRouter.get(
  "/categories/:name",
  categoriesSchema.getByName,
  validationErrors,
  categoriesController.getCategoryByName
);
//Blogs Routes
userRouter.get("/blogs/all", blogsController.getAllBlogs);
userRouter.post(
  "/blogs/likeblog",
  authMiddleware(["client", "admin", "attorney"]),
  blogsSchema.like,
  validationErrors,
  blogsController.likeBlog
);
userRouter.post(
  "/blogs/dislikeblog",
  authMiddleware(["client", "admin", "attorney"]),
  blogsSchema.like,
  validationErrors,
  blogsController.dislikeBlog
);
userRouter.get(
  "/blogs/IsBlogLiked/:blogId",
  authMiddleware(["client", "admin", "attorney"]),
  blogsSchema.isLike,
  validationErrors,
  blogsController.IsBlogLiked
);
userRouter.get(
  "/blogs/sort",
  blogsSchema.sort,
  validationErrors,
  blogsController.sortBlogs
);
userRouter.get(
  "/blogs/:id",
  blogsSchema.getById,
  validationErrors,
  blogsController.getBlogById
);
userRouter.get("/blogs/like/count/:id", blogsController.GetLikesCount);

// Attorneys Routes
userRouter.get("/attorneys", attorneysController.getAllAttorneys);

//Comments Routes
userRouter.post(
  "/blogs/addcomment",
  authMiddleware(["client", "admin", "attorney"]),
  commentsSchema.add,
  validationErrors,
  blogCommentsController.addBlogComment
);
userRouter.delete(
  "/blogs/deletecomment/:commentId",
  authMiddleware(["client", "admin", "attorney"]),
  commentsSchema.remove,
  validationErrors,
  blogCommentsController.deleteBlogComment
);
userRouter.put(
  "/blogs/updatecomment/:commentId",
  authMiddleware(["client", "admin", "attorney"]),
  commentsSchema.update,
  validationErrors,
  blogCommentsController.updateBlogComment
);
userRouter.post(
  "/blogs/replycomment",
  authMiddleware(["client", "admin", "attorney"]),
  commentsSchema.reply,
  validationErrors,
  blogCommentsController.replyComment
);
userRouter.post(
  "/blogs/likecomment",
  authMiddleware(["client", "admin", "attorney"]),
  commentsSchema.like,
  validationErrors,
  blogCommentsController.likeComment
);
userRouter.get(
  "/blogs/commentsByBlog/:id",
  commentsSchema.getByBlog,
  validationErrors,
  blogCommentsController.getCommentsByBlog
);
userRouter.get(
  "/blogs/repliesCommentsByComment/:commentId",
  commentsSchema.getByComment,
  validationErrors,
  blogCommentsController.getRepliesByComment
);
userRouter.get(
  "/blogs/IsCommentLiked/:commentId",
  authMiddleware(["client", "admin", "attorney"]),
  commentsSchema.isLike,
  validationErrors,
  blogCommentsController.IsCommentLiked
);

//Favorite Routes
userRouter.post(
  "/favorites",
  authMiddleware(["client"]),
  favoriteSchema.add,
  validationErrors,
  favoritesController.CreateFavoriteBlog
);
userRouter.get(
  "/favorites",
  authMiddleware(["client"]),
  favoritesController.GetAllFavoriteBlogs
);
userRouter.delete(
  "/favorites/:id",
  authMiddleware(["client"]),
  favoriteSchema.remove,
  validationErrors,
  favoritesController.DeleteFavoriteBlog
);
userRouter.get(
  "/favorites/search",
  authMiddleware(["client"]),
  favoriteSchema.search,
  validationErrors,
  favoritesController.SearchFavoriteBlogs
);
userRouter.get(
  "/favorites/count",
  authMiddleware(["client"]),
  favoritesController.GetFavoritesCount
);
userRouter.get(
  "/favorites/IsBlogFavorited/:blogId",
  authMiddleware(["client", "admin", "attorney"]),
  favoriteSchema.isFavorite,
  validationErrors,
  favoritesController.IsBlogFavorited
);
userRouter.delete(
  "/favorites",
  authMiddleware(["client"]),
  favoritesController.DeleteAllFavorites
);

//Services Routes
userRouter.get("/services", servicesController.getAllServices);
userRouter.get(
  "/services/assignedServices",
  authMiddleware(["client"]),
  servicesController.getAssignedServices
);
userRouter.get(
  "/services/assignedService/:id/",
  authMiddleware(["client"]),
  servicesSchema.getById,
  validationErrors,
  servicesController.getOneAssignedService
);
userRouter.get(
  "/services/:id",
  servicesSchema.getById,
  validationErrors,
  servicesController.getOneService
);
userRouter.post(
  "/services/assign_client",
  authMiddleware(["client"]),
  servicesSchema.assignClient,
  validationErrors,
  servicesController.assignClient
);
userRouter.delete(
  "/services/remove_assign_client/:request_service_id",
  authMiddleware(["client"]),
  servicesSchema.remAssign,
  validationErrors,
  servicesController.removeAssign
);
userRouter.delete(
  "/services/remove_all_assign_client",
  authMiddleware(["client"]),
  servicesController.removeAllAssign
);
userRouter.delete(
  "/service-files/:request_service_id",
  authMiddleware(["client"]),
  servicesController.deleteServiceFiles
);
userRouter.put(
  "/service-files/:uploaded_file_id",
  authMiddleware(["client"]),
  upload.array("file", 5),
  servicesController.updateServiceFile
);
userRouter.post(
  "/service-files/:request_service_id",
  authMiddleware(["client"]),
  servicesController.uploadServiceFiles
);
userRouter.get(
  "/service-files/:request_service_id",
  authMiddleware(["client", "admin"]),
  servicesController.getServiceFiles
);
userRouter.get(
  "/services/problem/:problem_id",
  servicesSchema.getByProblemId,
  validationErrors,
  servicesController.getAllServicesByProblem
);

// Testimonials Routes
userRouter.post(
  "/testimonials",
  authMiddleware(["client"]),
  testimonialSchema.add,
  validationErrors,
  testimonialsController.CreateTestimonial
);
userRouter.get("/testimonials", testimonialsController.GetAllTestimonials);
userRouter.get(
  "/testimonials/service/:serviceId",
  testimonialSchema.getByService,
  validationErrors,
  testimonialsController.GetTestimonialsByService
);
userRouter.put(
  "/testimonials/:testimonialId",
  authMiddleware(["client"]),
  testimonialSchema.update,
  validationErrors,
  testimonialsController.UpdateTestimonial
);
userRouter.delete(
  "/testimonials/:testimonialId",
  authMiddleware(["client"]),
  testimonialSchema.remove,
  validationErrors,
  testimonialsController.DeleteTestimonial
);
// Problems Routes
userRouter.get("/problems", problemsController.getAllProblems);
userRouter.get(
  "/problems/:id",
  problemsSchema.getByID,
  validationErrors,
  problemsController.getProblemById
);
userRouter.get(
  "/problems/category/:category_id",
  problemsSchema.getByCategoryID,
  validationErrors,
  problemsController.getAllProblemsByCategory
);

// Consultation Routes
userRouter.post(
  "/consultations",
  authMiddleware(["client"]),
  consultationSchema.add,
  validationErrors,
  consultationController.createConsultation
);
userRouter.get(
  "/consultations",
  authMiddleware(["client"]),
  consultationController.getMyConsultations
);
userRouter.get(
  "/available_slots",
  authMiddleware(["client"]),
  require("@/controllers/Admin/availableSlot").getAllAvailableSlots
);
userRouter.get(
  "/available_slots_with_bookings",
  authMiddleware(["client"]),
  require("@/controllers/Admin/availableSlot").getAvailableSlotsWithBookings
);

export default userRouter;
