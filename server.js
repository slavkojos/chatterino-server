import { createRequire } from 'module';
import cors from 'cors';
import {
  users,
  addUser,
  getUserList,
  getUser,
  removeUser,
  getOnlineUsers,
} from './users.js';
import {
  rooms,
  checkIfRoomExists,
  addMessageToRoom,
  readMessagesFromRoom,
} from './rooms.js';
const require = createRequire(import.meta.url);
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { instrument } = require('@socket.io/admin-ui');

app.use(cors());
server.listen(4000, () => {
  console.log('listening on *:4000');
});

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://admin.socket.io'],
  },
});

io.on('connection', socket => {
  console.log(`User connected with ${socket.id}`);
  socket.on('disconnect', () => {
    console.log('user disconnected');
    removeUser(socket.id);
    console.log('users online', users);
    io.emit('online-users', users);
  });
  socket.on('login', message => {
    console.log('message', message);
    addUser(message.id, message.username);
    console.log('New login from ' + message.username);
    console.log('users online', users);
    io.emit('online-users', users);
  });
  socket.on('get-room', message => {
    console.log('trying to find a room');
    const room = checkIfRoomExists(message.user1ID, message.user2ID);
    socket.join(room.roomID);
    console.log('this is the room', room);
    io.to(room.roomID).emit('deliver-room', room);
  });
  socket.on('send-message', message => {
    console.log('adding new message');
    const payload = {
      roomID: message.roomID,
      senderID: message.senderID,
      message: message.message,
    };
    addMessageToRoom(payload.roomID, payload.senderID, payload.message);
    console.log('sending message to room ', message.roomID);
    io.to(message.roomID).emit('deliver-message', payload);
  });
  socket.on('read-messages', room => {
    const messages = readMessagesFromRoom(room);
    io.to(room).emit('recieve-messages', messages);
  });
});

app.get('/online-users', (req, res) => {
  res.send(users);
});
instrument(io, { auth: false });
