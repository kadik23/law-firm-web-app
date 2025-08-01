import { Request, Response } from "express";
import { db } from "@/models/index";
import { Model, ModelCtor } from "sequelize";
import { IService } from "@/interfaces/Service";
import { IUser } from "@/interfaces/User";
import { IBlog } from "@/interfaces/Blog";
import { ITestimonial } from "@/interfaces/Testimonial";
import { ICategory } from "@/interfaces/Category";
import { IConsultation } from "@/interfaces/Consultation";
import { IServiceFilesUploaded } from "@/interfaces/ServiceFilesUploaded";
import { Op } from "sequelize";

const Service: ModelCtor<Model<IService>> = db.services;
const User: ModelCtor<Model<IUser>> = db.users;
const Blog: ModelCtor<Model<IBlog>> = db.blogs;
const Testimonial: ModelCtor<Model<ITestimonial>> = db.testimonials;
const Category: ModelCtor<Model<ICategory>> = db.categories;
const Consultation: ModelCtor<Model<IConsultation>> = db.Consultation;
const ServiceFilesUploaded: ModelCtor<Model<IServiceFilesUploaded>> = db.service_files_uploaded;
const RequestService = db.request_service;

interface DashboardStats {
  totalAvocats: number;
  totalServices: number;
  totalTestimonials: number;
  totalBlogs: number;
  totalClients: number;
  totalConsultations: number;
  totalClientFiles: number;
  totalCategories: number;
  recentConsultations: any[];
  recentBlogs: any[];
  recentServices: any[];
  pendingConsultations: number;
  completedConsultations: number;
  pendingFiles: number;
  acceptedFiles: number;
  refusedFiles: number;
  monthlyStats: {
    consultations: number;
    newClients: number;
    newServices: number;
    newBlogs: number;
  };
}

const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: "Unauthorized: User ID is missing." });
    return;
  }

  try {
    const now = new Date();

    const [
      totalAvocats,
      totalServices,
      totalTestimonials,
      totalBlogs,
      totalClients,
      totalConsultations,
      totalClientFiles,
      totalCategories
    ] = await Promise.all([
      User.count({ where: { type: 'attorney' } }),
      Service.count(),
      Testimonial.count(),
      Blog.count(),
      User.count({ where: { type: 'client' } }),
      Consultation.count(),
      ServiceFilesUploaded.count(),
      Category.count()
    ]);

    const [recentConsultations, recentBlogs, recentServices] = await Promise.all([
      Consultation.findAll({
        include: [
          {
            model: User,
            as: 'client',
            attributes: ['id', 'name', 'surname', 'email']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: 5
      }),
      Blog.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5
      }),
      Service.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5
      })
    ]);

    const [pendingConsultations, completedConsultations] = await Promise.all([
      Consultation.count({ where: { status: 'Pending' } }),
      Consultation.count({ where: { status: 'Completed' } })
    ]);

    const [pendingFiles, acceptedFiles, refusedFiles] = await Promise.all([
      ServiceFilesUploaded.count({ where: { status: 'Pending' } }),
      ServiceFilesUploaded.count({ where: { status: 'Accepted' } }),
      ServiceFilesUploaded.count({ where: { status: 'Refused' } })
    ]);

    const [monthlyConsultations, monthlyNewClients, monthlyNewServices, monthlyNewBlogs] = await Promise.all([
      Consultation.count({where: {createdAt: { [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1)) }}}),
      User.count({ where: { type: 'client', createdAt: { [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1)) } } }),
      Service.count({where: { createdAt: { [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1)) }}}),
      Blog.count({where: { createdAt: { [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1)) }}})
    ]);

    const stats: DashboardStats = {
      totalAvocats,
      totalServices,
      totalTestimonials,
      totalBlogs,
      totalClients,
      totalConsultations,
      totalClientFiles,
      totalCategories,
      recentConsultations: recentConsultations.map(consultation => {
        const client = (consultation as any).client;
        return {
          id: (consultation as any).id,
          clientName: client ? `${client.name} ${client.surname}` : 'Client inconnu',
          status: (consultation as any).status,
          date: (consultation as any).date,
          time: (consultation as any).time,
          createdAt: (consultation as any).createdAt
        };
      }),
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
      pendingConsultations,
      completedConsultations,
      pendingFiles,
      acceptedFiles,
      refusedFiles,
      monthlyStats: {
        consultations: monthlyConsultations,
        newClients: monthlyNewClients,
        newServices: monthlyNewServices,
        newBlogs: monthlyNewBlogs
      }
    };

    res.status(200).json(stats);
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

export { getDashboardStats }; 