const express = require('express');
const http = require('http');
require('dotenv').config();
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const { connectRabbitMQ, consumeMessages } = require('./utils/rabbitmq')
const { authorize } = require("./middlewares/auth.middleware")
const setupSwagger = require("./utils/swaggerConfig");
const path = require('path');

const io = new Server(server, {
  cors: {
    origin: 'http://127.0.0.1:3003',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization'],
    credentials: true,
  }
});

setupSwagger(app);

app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname,"client.html"));
})

connectRabbitMQ().then(() => {
    console.log('Connected to RabbitMQ');
});
io.use(authorize)


io.on('connection', (socket) => {
    console.log('New client connected');

    consumeMessages(socket.user.id, socket);

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Real-time service listening on port ${PORT}`);
});