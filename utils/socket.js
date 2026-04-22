/**
 * WebSocket Utility - Powered by Socket.IO
 * 
 * WHAT ARE WEBSOCKETS?
 * Unlike HTTP (which is request-response), WebSockets provide a 
 * full-duplex, persistent connection. This allows the server to 
 * "push" data to the client instantly.
 */

const { Server } = require("socket.io");

let io;

/**
 * Initialize Socket.IO
 * @param {http.Server} server - The HTTP server instance
 */
const init = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // In production, restrict this to your frontend URL
      methods: ["GET", "POST", "PUT", "DELETE"]
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Get the initialized IO instance
 */
const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

/**
 * Emit an event to all connected clients
 * @param {string} event - Event name
 * @param {any} data - Data to send
 */
const emit = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

module.exports = {
  init,
  getIO,
  emit
};
