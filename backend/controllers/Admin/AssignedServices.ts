import { Model, ModelCtor } from "sequelize";
import { IService } from "@/interfaces/Service";
import { db } from "@/models/index";
import { IUser } from "@/interfaces/User";
import { Request, Response } from "express";

const Service: ModelCtor<Model<IService>> = db.services;
const RequestService = db.request_service;
const ServiceFilesUploaded = db.service_files_uploaded;
const User: ModelCtor<Model<IUser>> = db.users;

const getAssignedServices = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: "Unauthorized: User ID is missing." });
    return;
  }
  try {
    const userId = req.user.id;
    const serviceRequests = await RequestService.findAll({
      include: [
        {
          model: Service,
          as: "service",
          attributes: ["id", "name", "createdAt", "updatedAt"],
          required: true,
        },
        {
          model: User,
          as: "User",
          attributes: ["id", "name", "surname", "email", "pays"],
          required: true,
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (!serviceRequests || serviceRequests.length === 0) {
      res.status(200).json([]);
      return;
    }
    res.status(200).json(serviceRequests);
  } catch (error: any) {
    console.error("Error in getAssignedServices:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

const updateFileStatus = async (req: Request, res: Response): Promise<void> => {
  const { fileId } = req.params;
  const { status, rejection_reason } = req.body;
  if (!fileId || !status) {
    res.status(400).json({ error: "Missing fileId or status" });
    return;
  }
  try {
    const file = await ServiceFilesUploaded.findByPk(fileId);
    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }
    await file.update({ 
      status,
      rejection_reason: status === 'Refused' ? rejection_reason : null 
    });
    res.status(200).json({ message: "File status updated", file });
  } catch (error: any) {
    console.error("Error in updateFileStatus:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const updateFolderStatus = async (req: Request, res: Response): Promise<void> => {
  const { requestServiceId } = req.params;
  const { status } = req.body;
  if (!requestServiceId || !status) {
    res.status(400).json({ error: "Missing requestServiceId or status" });
    return;
  }
  try {
    const folder = await RequestService.findByPk(requestServiceId);
    if (!folder) {
      res.status(404).json({ error: "Folder not found" });
      return;
    }
    await folder.update({ status });
    res.status(200).json({ message: "Folder status updated", folder });
  } catch (error: any) {
    console.error("Error in updateFolderStatus:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export { getAssignedServices, updateFileStatus, updateFolderStatus };