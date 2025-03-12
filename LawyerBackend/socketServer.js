const { Server } = require("socket.io");

const io = new Server(process.env.SOCKET_PORT, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000'
    }
});

const users = {}; // Store userId → socketId mapping

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Register user with their userId
    socket.on("register", (userId) => {
        users[userId] = socket.id;
        console.log(`User ${userId} registered with socket ID: ${socket.id}`);
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        Object.keys(users).forEach((userId) => {
            if (users[userId] === socket.id) {
                delete users[userId];
                console.log(`User ${userId} disconnected`);
            }
        });
    });
});

module.exports = { io, users };
