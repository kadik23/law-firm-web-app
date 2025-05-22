const db = require("../models");
const notif=db.notifications
const connected_users=db.connectedUsers
const { io} = require("../socketServer"); // Import Socket.IO instance


async function createNotification(type, description, userId, entityId, fromUserId) {
      let newNotif= await notif.create({
        type, description, userId, entityId
    });
    if (userId) {
        try {
            // Find the connected user's socket ID
            const connectedUser = await connected_users.findOne({
                where: { user_id: userId }
            });

            if (connectedUser && connectedUser.socket_id) {
                // Emit the notification to the specific socket ID
                io.to(connectedUser.socket_id).emit("receive_notification", {
                    from: fromUserId,
                    message: description,
                });
                console.log(`Notification sent to user ${userId} via socket ${connectedUser.socket_id}`);
            } else {
                console.log(`User ${userId} not currently connected via socket.`);
            }
        } catch (error) {
            console.error("Error sending notification via socket:", error);
        }
    }

    return newNotif;
}
module.exports = { createNotification };