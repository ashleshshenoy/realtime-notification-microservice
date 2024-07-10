const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
	id: { 
		type: String, 
		required: true, 
		unique: true 
	},
	userId: { 
		type: String, 
		required: true 
	},
	message: { 
		type: String, 
		required: true 
	},
	read: { 
		type: Boolean, 
		default: false 
	}
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
