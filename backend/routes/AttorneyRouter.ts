import authMiddleware from "@/middlewares/AuthMiddleware";
import express, { Router } from "express";
import * as blogsController from "@/controllers/Attorney/Blogs";
import * as attorneysController from "@/controllers/User/attorneys";
import * as dashboardStatsController from "@/controllers/Attorney/DashboardStats";

const attorneyRouter: Router = express.Router();

// Dashboard Stats
attorneyRouter.get(
  "/dashboard/stats",
  authMiddleware(["attorney"]),
  dashboardStatsController.getAttorneyDashboardStats
);

attorneyRouter.put(
    "/attorney/update",
    authMiddleware(["attorney"]),
    attorneysController.updateAttorney
  );

// Blogs Routes
attorneyRouter.get(
    "/blogs",
    authMiddleware(["attorney"]),
    blogsController.getMyBlogs
  );
  attorneyRouter.post(
    "/blogs",
    authMiddleware(["attorney"]),
    blogsController.addMyBlog
  );
  attorneyRouter.get(
    "/blogs/:id",
    authMiddleware(["attorney"]),
    blogsController.getMyBlogById
  );
  attorneyRouter.put(
    "/blogs/:id",
    authMiddleware(["attorney"]),
    blogsController.updateMyBlog
  );
  attorneyRouter.delete(
    "/blogs",
    authMiddleware(["attorney"]),
    blogsController.deleteMyBlogs
  );

export default attorneyRouter;