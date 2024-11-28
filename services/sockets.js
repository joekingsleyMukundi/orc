const { Server } = require('socket.io');

let io; // Declare io variable to avoid circular dependency during initialization

const initSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",  // Allow all origins for simplicity
      methods: ["GET", "POST"]
    }
  });
  
  // Setup event listenersi
  io.on('connection', (socket) => {
    console.log('A user connected', socket.id);
    
    // Each user joins a room based on their user ID
    socket.on('joinRoom', (userId) => {
      socket.join(userId);  // User-specific room
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected', socket.id);
    });
  });
};

const getSocketInstance = () => {
  if (!io) {
    throw new Error('Socket server not initialized. Please call initSocketServer first.');
  }
  return io;
};

module.exports = { initSocketServer, getSocketInstance };
