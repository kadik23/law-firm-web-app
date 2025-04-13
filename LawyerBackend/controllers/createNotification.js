const db = require("../models");
const notif=db.notifications
const { io} = require("../socketServer"); // Import Socket.IO instance


async function createNotification(type, description, userId, entityId, fromUserId) {
      let newNotif= await notif.create({
        type, description, userId, entityId
    });
    if (userId) {
        io.to(userId).emit("receive_notification", {
            from: fromUserId,
            message: description,
        });
    }
    return newNotif
}
module.exports = { createNotification };