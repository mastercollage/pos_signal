// app.js
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);


const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
const cors = require('cors'); // Import the cors package


app.use(cors({
  origin: 'http://localhost:8100', // Adjust with your Ionic app's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // If your app uses cookies or authentication
}));
// Store connected clients and their unique IDs
const clients = {};

// Counter for connected users
let connectedUsers = 0;

// Handle socket connection
io.on('connection', (socket) => {
  // Increment the connected users count
  connectedUsers++;

  // Log the number of connected users
  console.log(`User connected. Total connected users: ${connectedUsers}`);

  // Generate a unique ID for each client and store it
  const clientId = socket.id;
  clients[clientId] = { socket };

  // Handle signals from the frontend
  socket.on('signal', ({ id,refid, type }) => {
    // Broadcast the signal to all clients except the sender
    console.log('User connected. Total connected users: %s %s %s',id,refid,type);
    socket.broadcast.emit('signal', { id, refid , type });
  });

  // Handle disconnect event
  socket.on('disconnect', () => {
    // Decrement the connected users count
    connectedUsers--;

    // Log the number of connected users
    console.log(`User disconnected. Total connected users: ${connectedUsers}`);

    // Remove the client from the clients list
    delete clients[clientId];
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});