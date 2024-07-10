const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.router");
const setupSwagger = require("./utils/swaggerConfig");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname,".env")});

const app = express();
setupSwagger(app);
app.use(express.json());
	
app.use("/api", authRoutes);

console.log(process.env.DB_CONNECTION_STRING);
mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => { console.log("Connection established");});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Auth Service running on port ${PORT}`);
});
