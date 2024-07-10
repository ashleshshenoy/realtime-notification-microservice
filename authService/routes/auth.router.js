const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const SALT_ROUNDS = 12;


router.post("/register", async (req, res) => {
	try {
		const { username, email, password } = req.body;
		if(!username || !email || !password ) return res.status(400).json({ error : "Invalid request, required fields are missing"});
		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
		const user = new User({ id: uuidv4(), username, email, password: hashedPassword  });
		await user.save();
		res.status(201).json(user);
	} catch (error) {
		res.status(400).json({ error : error.message});
	}
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(401).json({ error : "Authentication failed, Invalid credentials." });
		}
		const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET);
		res.json({ token });
	} catch (error) {
		res.status(400).json({ error : error.message });
	}
});

module.exports = router;
