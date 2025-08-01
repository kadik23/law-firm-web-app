import { Server } from "socket.io";
import {db} from "./models";
const connected_users = db.connectedUsers;

export const io = new Server(parseInt(process.env.SOCKET_PORT as string), {
    cors: {
        origin: [
            "http://localhost:3000",
            "http://localhost:3001",
            "https://law-site-beryl.vercel.app",
            process.env.FRONTEND_URL as string,
            process.env.NEXT_PUBLIC_FRONTEND_URL as string
        ].filter(Boolean),
        credentials: true
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
                socket.emit('registrationError', 'Invalid user ID format');
                return;
            }

            // Remove any old socket for this user
            await connected_users.destroy({ where: { user_id: numericUserId } });
            // Insert the new socket
            await connected_users.create({
                user_id: numericUserId,
                socket_id: socket.id // Store as string
            });

            console.log(`User ${userId} registered with socket ID: ${socket.id}`);
            socket.emit('registrationSuccess', 'User registered');
        } catch (error) {
            console.error("Error registering user:", error);
            socket.emit('registrationError', 'Failed to register user');
        }
    });

    // Handle user disconnection
    socket.on("disconnect", async () => {
        try {
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