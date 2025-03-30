
const { io, users } = require("../../socketServer"); // Import Socket.IO instance


const sendNotification = async (req, res) =>  {
    const fromUserId = req.user.id; // Authenticated user's ID
    const { toUserId, message } = req.body; // Receiver's ID & message

    if (!toUserId || !message) {
        return res.status(400).json({ error: "toUserId and message are required" });
    }

    const recipientSocketId = users[toUserId]; // Get the socket ID of the recipient
    if (recipientSocketId) {
        io.to(recipientSocketId).emit("receive_notification", {
            from: fromUserId,
            message: message,
        });
        return res.status(200).json({ success: true, message: "Notification sent!" });
    } else {
        return res.status(400).json({ error: "User is not connected" });
    }
}


module.exports = {sendNotification};
