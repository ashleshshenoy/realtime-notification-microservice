const express = require("express");
const mongoose = require("mongoose");
const notificationRoutes = require("./routes/notification.router");
const {connectRabbitMQ} = require("./utils/rabbitmq");
const setupSwagger = require("./utils/swaggerConfig");
require("dotenv").config();

const app = express();
setupSwagger(app);
app.use(express.json());

app.use("/api", notificationRoutes);

mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => { console.log("Connection established");});
 
connectRabbitMQ().then(() => {
	console.log("Connected to RabbitMQ");
});
  
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
	console.log(`Notification Service running on port ${PORT}`);
});
