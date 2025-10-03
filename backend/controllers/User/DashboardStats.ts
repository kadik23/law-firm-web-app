import { Request, Response } from "express";
import { db } from "@/models/index";
import { Model, ModelCtor } from "sequelize";
import { IPayment } from "@/interfaces/Payment";
import { IFavorite } from "@/interfaces/Favorite";
import { IRequestService } from "@/interfaces/RequestService";

const RequestService: ModelCtor<Model<IRequestService>> = db.request_service;
const Payment: ModelCtor<Model<IPayment>> = db.payments;
const Favorite: ModelCtor<Model<IFavorite>> = db.favorites;

interface DashboardStats {
    totalPayments: number,
    totalServices: number,
    totalFavorites: number,
}

const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: "Unauthorized: User ID is missing." });
    return;
  }

  try {
    const [
      totalPayments,
      totalServices,
      totalFavorites,
    ] = await Promise.all([
      Payment.count({where: {client_id: req.user.id}}),
      RequestService.count({where: {clientId: req.user.id}}),
      Favorite.count({where: {userId: req.user.id}}),
    ]);

    const stats: DashboardStats = {
      totalPayments,
      totalServices,
      totalFavorites,
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