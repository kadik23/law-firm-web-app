import { Model, ModelCtor } from "sequelize";
import { IService } from "@/interfaces/Service";
import { db } from "@/models/index";
import { IUser } from "@/interfaces/User";
import { Request, Response } from "express";
import { createNotification } from "../createNotification";

const Service: ModelCtor<Model<IService>> = db.services;
const RequestService = db.request_service;
const ServiceFilesUploaded = db.service_files_uploaded;
const User: ModelCtor<Model<IUser>> = db.users;
const Payment = db.payments;

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

const getClients = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: "Unauthorized: User ID is missing." });
    return;
  }
  try {
    const users = await User.findAll({
      where: { type: 'client' },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Payment,
          required: true,
          as: "payments",
        },
      ],

    });
    if (!users || users.length === 0) {
      res.status(200).json([]);
      return;
    }
    res.status(200).json(users);
  } catch (error: any) {
    console.error("Error in get clients:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

const getClientById = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ error: "Unauthorized: User ID is missing." });
    return;
  }
  const { id } = req.params;
  try {
    const user = await User.findOne({
      where: { id },
      order: [["createdAt", "DESC"]],
    });
    if (!user) {
      res.status(200).json([]);
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error in get client:", error);
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
    const assignedService = await RequestService.findByPk(file.getDataValue("request_service_id") as number,{
      include: [
        {
          model: Service,
          as: "service",
          attributes: ["id", "name"],
          required: true,
        },
      ],
    });
    
    const serviceName = (assignedService as any)?.service?.getDataValue("name") || "Service";
    
    let notif = await createNotification(
      "Documents",
      `Votre document ${file.getDataValue("file_name")} de la demande ${serviceName} a été ${status === 'Refused' ? 'refusé' : 'accepté'}`,
      assignedService?.getDataValue("clientId") as number,
      assignedService?.getDataValue("serviceId") as number,
      2
    );
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
    const serviceId = folder.getDataValue("serviceId");
    let serviceName = "Service";
    if (serviceId) {
      const service = await Service.findByPk(serviceId);
      if (service) {
        serviceName = service.getDataValue("name");
      }
    }
    await createNotification(
      "Documents",
      `Le dossier ${serviceName} a été ${status === 'Completed' ? 'accepté' : status === 'Pending' ? 'en attente' : 'refusé'}`,
      folder.getDataValue("clientId") as number,
      folder.getDataValue("serviceId") as number,
      2
    );
    res.status(200).json({ message: "Folder status updated", folder });
  } catch (error: any) {
    console.error("Error in updateFolderStatus:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export { getAssignedServices, updateFileStatus, updateFolderStatus, getClients, getClientById };