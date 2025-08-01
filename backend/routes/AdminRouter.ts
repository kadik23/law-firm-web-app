import express, { Router } from "express";

import authMiddleware from "@/middlewares/AuthMiddleware";
import { validationErrors } from "@/errorHandler/validationErrors";

import * as categoriesController from "@/controllers/Admin/Categories";
import * as contactformController from "@/controllers/Admin/ContactForm";
import * as blogsController from "@/controllers/Admin/Blogs";
import * as attorneysController from "@/controllers/Admin/attorneys";
import * as servicesController from "@/controllers/Admin/Services";
import * as problemsController from "@/controllers/Admin/problems";
import * as AssignedServices from "@/controllers/Admin/AssignedServices";
import * as AvailableSlots from "@/controllers/Admin/availableSlot";
import * as notificationsController from "@/controllers/User/Notifications";
import * as consultationsController from "@/controllers/Admin/Consultations";
import * as dashboardStatsController from "@/controllers/Admin/DashboardStats";

import * as contactSchema from "@/schema/contactFormSchema";
import * as categoriesSchema from "@/schema/categoriesSchema";
import * as attorneySchema from "@/schema/attorneySchema";
import * as blogsSchema from "@/schema/blogsSchema";
import * as servicesSchema from "@/schema/servicesSchema";
import * as problemsSchema from "@/schema/problemsSchema";

const adminRouter: Router = express.Router();

// Contact Form
adminRouter.post(
  "/contactus",
  contactSchema.add,
  validationErrors,
  contactformController.contactForm
);

// Categories
adminRouter.post(
  "/categories/add",
  authMiddleware(["admin"]),
  categoriesSchema.add,
  validationErrors,
  categoriesController.addCategory
);
adminRouter.delete(
  "/categories/delete",
  authMiddleware(["admin"]),
  categoriesSchema.remove,
  validationErrors,
  categoriesController.deleteCategory
);

// Attorneys
adminRouter.post(
  "/attorney/add",
  authMiddleware(["admin"]),
  attorneysController.createAttorney
);
adminRouter.get(
  "/attorneys",
  authMiddleware(["admin"]),
  attorneySchema.getAttorneys,
  validationErrors,
  attorneysController.getAdminAttorneys
);
adminRouter.get(
  "/attorneys/search",
  authMiddleware(["admin"]),
  attorneySchema.search,
  validationErrors,
  attorneysController.searchAttorneys
);
adminRouter.delete(
  "/attorney/delete",
  authMiddleware(["admin"]),
  attorneySchema.remove,
  validationErrors,
  attorneysController.deleteAttorneys
);

// Blogs
adminRouter.post(
  "/blogs/add",
  authMiddleware(["admin"]),
  blogsController.addBlog
);
adminRouter.put(
  "/blogs/update",
  authMiddleware(["admin"]),
  blogsController.updateBlog
);
adminRouter.delete(
  "/blogs/delete",
  authMiddleware(["admin"]),
  blogsSchema.remove,
  validationErrors,
  blogsController.deleteBlog
);
adminRouter.get(
  "/blogs/filter",
  authMiddleware(["admin"]),
  blogsController.filterBlogs
);
adminRouter.get(
  "/blogs/",
  authMiddleware(["admin"]),
  blogsController.getAllBlogs
);
adminRouter.put(
  "/blogs/process",
  authMiddleware(["admin"]),
  blogsController.processBlog
);

// Services
adminRouter.post(
  "/services/create",
  authMiddleware(["admin"]),
  servicesController.createService
);
adminRouter.put(
  "/services/update",
  authMiddleware(["admin"]),
  servicesController.updateService
);
adminRouter.delete(
  "/services/delete",
  authMiddleware(["admin"]),
  servicesSchema.remove,
  validationErrors,
  servicesController.deleteServices
);
adminRouter.get(
  "/services",
  authMiddleware(["admin"]),
  servicesController.getAdminServices
);

// Problems
adminRouter.post(
  "/problems",
  authMiddleware(["admin"]),
  problemsSchema.add,
  validationErrors,
  problemsController.createProblem
);
adminRouter.delete(
  "/problems/:id",
  authMiddleware(["admin"]),
  problemsSchema.remove,
  validationErrors,
  problemsController.deleteProblem
);

// Assigned Servoces
adminRouter.get(
  "/assigned_services",
  authMiddleware(["admin"]),
  AssignedServices.getAssignedServices
);

adminRouter.put(
  "/assigned_services/file_status/:fileId",
  authMiddleware(["admin"]),
  AssignedServices.updateFileStatus
);

adminRouter.put(
  "/assigned_services/folder_status/:requestServiceId",
  authMiddleware(["admin"]),
  AssignedServices.updateFolderStatus
);

adminRouter.post(
  "/available_slots",
  authMiddleware(["admin"]),
  AvailableSlots.addAvailableSlot
);
adminRouter.delete(
  "/available_slots/:id",
  authMiddleware(["admin"]),
  AvailableSlots.removeAvailableSlot
);
adminRouter.get(
  "/available_slots",
  authMiddleware(["admin"]),
  AvailableSlots.getAllAvailableSlots
);
adminRouter.get(
  "/consultations",
  authMiddleware(["admin", "client"]),
  consultationsController.getAllConsultations
);
adminRouter.put(
  "/consultations/:id",
  authMiddleware(["admin"]),
  consultationsController.updateConsultation
);

// Notifications
adminRouter.get(
  "/notifications/all",
  authMiddleware(["admin", "client", "attorney"]),
  notificationsController.getAllNotifications
);

adminRouter.get(
  "/notifications/unread/count",
  authMiddleware(["admin", "client", "attorney"]),
  notificationsController.getUnreadNotificationsCount
);

adminRouter.delete(
  "/notifications/:id",
  authMiddleware(["admin", "client", "attorney"]),
  notificationsController.deleteNotification
);

// Dashboard Stats
adminRouter.get(
  "/dashboard/stats",
  authMiddleware(["admin"]),
  dashboardStatsController.getDashboardStats
);

export default adminRouter;
