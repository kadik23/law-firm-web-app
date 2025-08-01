import { Request, Response } from "express";
import { db } from "@/models/index";
import { Model, ModelCtor } from "sequelize";
import { IService } from "@/interfaces/Service";
import { IUser } from "@/interfaces/User";
import { IBlog } from "@/interfaces/Blog";
import { ITestimonial } from "@/interfaces/Testimonial";
import { Op } from "sequelize";
import { AttorneyDashboardStats } from "@/interfaces/AttorneyDashboardStats";

const Service: ModelCtor<Model<IService>> = db.services;
const User: ModelCtor<Model<IUser>> = db.users;
const Blog: ModelCtor<Model<IBlog>> = db.blogs;
const Testimonial: ModelCtor<Model<ITestimonial>> = db.testimonials;
const RequestService = db.request_service;

const getAttorneyDashboardStats = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: "Unauthorized: User ID is missing." });
    return;
  }

  try {
    const attorneyId = req.user.id;

    const [
      totalAttorneys,
      totalServices,
      totalTestimonials,
      totalBlogs,
      myBlogs,
      pendingBlogs,
      acceptedBlogs,
      refusedBlogs,
      assignedServices,
      pendingAssignedServices,
      completedAssignedServices
    ] = await Promise.all([
      User.count({ where: { type: 'attorney' } }),
      Service.count(),
      Testimonial.count(),
      Blog.count(),
      Blog.count({ where: { userId: attorneyId } }),
      Blog.count({ where: { accepted: false, rejectionReason: null, userId: attorneyId } }),
      Blog.count({ where: { accepted: true, userId: attorneyId } }),
      Blog.count({ where: { accepted: false, rejectionReason: { [Op.ne]: null }, userId: attorneyId } }),
      RequestService.count(),
      RequestService.count({ where: { status: 'Pending' } }),
      RequestService.count({ where: { status: 'Completed' } })
    ]);

    const [recentBlogs, recentServices, recentTestimonials] = await Promise.all([
      Blog.findAll({
        where: { userId: attorneyId },
        order: [['createdAt', 'DESC']],
        limit: 5
      }),
      Service.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5
      }),
      Testimonial.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5
      })
    ]);

    const [monthlyNewBlogs, monthlyNewServices, monthlyNewTestimonials] = await Promise.all([
      Blog.count({ where: { userId: attorneyId, createdAt: { [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1)) } } }),
      Service.count({where: { createdAt: { [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1)) }}}),
      Testimonial.count({where: { createdAt: { [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1)) }}})
    ]);

    const stats: AttorneyDashboardStats = {
      totalAttorneys,
      totalServices,
      totalTestimonials,
      totalBlogs,
      myBlogs,
      pendingBlogs,
      acceptedBlogs,
      refusedBlogs,
      assignedServices,
      pendingAssignedServices,
      completedAssignedServices,
      recentBlogs: recentBlogs.map(blog => ({
        id: (blog as any).id,
        title: (blog as any).title,
        status: (blog as any).accepted,
        createdAt: (blog as any).createdAt
      })),
      recentServices: recentServices.map(service => ({
        id: (service as any).id,
        name: (service as any).name,
        price: (service as any).price,
        createdAt: (service as any).createdAt
      })),
      recentTestimonials: recentTestimonials.map(testimonial => ({
        id: (testimonial as any).id,
        content: (testimonial as any).feedback || (testimonial as any).content || "Aucun contenu",
        rating: (testimonial as any).rating || 3, // Default rating if not available
        createdAt: (testimonial as any).createdAt
      })),
      monthlyStats: {
        newBlogs: monthlyNewBlogs,
        newServices: monthlyNewServices,
        newTestimonials: monthlyNewTestimonials
      }
    };

    res.status(200).json(stats);
  } catch (error: any) {
    console.error("Error fetching attorney dashboard stats:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

export { getAttorneyDashboardStats }; 