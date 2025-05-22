const { Server } = require("socket.io");
const db = require("./models");
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
            const numericUserId = parseInt(userId, 10);
            if (isNaN(numericUserId)) {
                console.error(`Invalid userId received for registration: ${userId}`);
                // Optionally send an error back to the client
                socket.emit('registrationError', 'Invalid user ID format');
                return;
            }

            let newUser = await connected_users.create({
                user_id: numericUserId,
                socket_id: socket.id
            });

            if (!newUser) {
                console.log(`Can't connect user ${userId} to web socket`);
            } else {
                console.log(`User ${userId} registered with socket ID: ${socket.id}`);
                // Optionally send a success confirmation back
                socket.emit('registrationSuccess', 'User registered');
            }
        } catch (error) {
            console.error("Error registering user:", error);
            // Optionally send an error back to the client
            socket.emit('registrationError', 'Failed to register user');
        }
    });

    // Handle user disconnection
    socket.on("disconnect", async () => {
        try {
            // Use Sequelize's destroy method
            const deletedRowCount = await connected_users.destroy({
                where: { socket_id: socket.id }
            });

            if (deletedRowCount > 0) {
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
