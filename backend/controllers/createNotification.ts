import { db } from "@/models"
import { Model, ModelCtor } from "sequelize";
import { INotification } from "@/interfaces/Notification";
import { IConnectedUser } from "@/interfaces/ConnectedUser";
import { io } from "@/server";

const notif: ModelCtor<Model<INotification>> = db.notifications;
const connected_users: ModelCtor<Model<IConnectedUser>> = db.connectedUsers;

export async function createNotification(
  type: INotification["type"],
  description: string,
  userId: number,
  entityId: number,
  fromUserId?: number
): Promise<Model<INotification>> {
  const newNotif = await notif.create({
    type,
    description,
    userId,
    entityId,
    isRead: false,
  });
  if (userId) {
    try {
      // Find the connected user's socket ID
      const connectedUser = await connected_users.findOne({
        where: { user_id: userId },
      });

      if (connectedUser && connectedUser.getDataValue('socket_id')) {
        // Emit the notification to the specific socket ID
        console.log('[SocketServer] Emitting receive_notification to socket:', connectedUser.getDataValue('socket_id').toString(), 'for user', userId);
        io.to(connectedUser.getDataValue('socket_id').toString()).emit("receive_notification", {
          from: fromUserId,
          message: description,
        });
        console.log(
          `Notification sent to user ${userId} via socket ${connectedUser.getDataValue('socket_id')}`
        );
      } else {
        console.log(`User ${userId} not currently connected via socket.`);
      }
    } catch (error: unknown) {
      console.error("Error sending notification via socket:", error);
    }
  }

  return newNotif;
}