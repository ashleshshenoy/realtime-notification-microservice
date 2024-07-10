const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	id: { 
		type: String, 
		required: true, 
		unique: true 
	},
	username: { 
		type: String, 
		required: true 
	},
	email: { 
		type: String,
		required: true, 
		unique: true 
	},
	password: { 
		type: String, 
		required: true 
	},
	connected: { 
		type: Boolean, 
		default: false 
	},
	role: { 
		type: String, 
		enum: ["user", "admin"], 
		default: "user" 
	}
});



const User = mongoose.model("User", userSchema);
module.exports = User;
