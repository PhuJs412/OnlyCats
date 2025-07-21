import { Server } from "socket.io";
import http from 'http';

let io: Server;

export const initSocket = (server: http.Server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log("Client connected:", socket.id);

        // Khi client join với userId = ...
        socket.on("join", (userId: string) => {
            socket.join(userId); // Join vào room với userId của client
            console.log(`User ${userId} joined room`);
        });

        // Client disconnect tới room
        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized !");
    return io;
};