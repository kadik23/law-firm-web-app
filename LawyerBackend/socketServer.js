const { Server } = require("socket.io");
const {db} = require("./models");
const connected_users=db.connectedUsers

const io = new Server(process.env.SOCKET_PORT, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000'
    }
});



io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Register user with their userId
    socket.on("register", async (userId) => {
        try {
            let newUser = await connected_users.create({
                user_id: userId,
                socket_id: socket.id
            });

            if (!newUser) {
                console.log(`Can't connect user ${userId} to web socket`);
            } else {
                console.log(`User ${userId} registered with socket ID: ${socket.id}`);
            }
        } catch (error) {
            console.error("Error registering user:", error);
        }
    });

    // Handle user disconnection
    socket.on("disconnect", async () => {
        try {
            const deletedUser = await connected_users.findOneAndDelete({ socket_id: socket.id });

            if (deletedUser) {
                console.log(`User with socket ID ${socket.id} disconnected and removed.`);
            } else {
                console.log(`Socket ID ${socket.id} disconnected but was not found in DB.`);
            }
        } catch (error) {
            console.error("Error during user disconnection:", error);
        }
    });
});


module.exports = {io};
