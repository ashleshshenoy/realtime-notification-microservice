const express = require("express");
const Notification = require("../models/notification.model");
const { v4: uuidv4 } = require("uuid");
const {authorize} = require("./../middlewares/auth.middleware");
const {isAdmin} = require("./../middlewares/permission.middleware");
const router = express.Router();
const {publishMessage} = require("../utils/rabbitmq");



// admin permission required
router.post("/notifications", authorize, isAdmin, async (req, res) => {
	try {
		const { userId, message } = req.body;
		if(!userId || !message) res.status(400).json({ error : "Invalid request, required fields are missing"});
		const notification = new Notification({ id: uuidv4(), userId: userId, message });
		await notification.save();
		await publishMessage(req.user.id, userId, message);  // message is pushed into the queue 
		res.status(201).json(notification);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});


router.get("/notifications", authorize, async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const skip = (page - 1) * limit;
	try {
		const notifications = await Notification.find({ userId: req.user.id })
			.limit(limit)
			.skip(skip)
			.exec();
		res.status(200).json(notifications);
	} catch (error) {
		res.status(400).json({ error : error.message});
	}
});

router.get("/notifications/:id", authorize, async (req, res) => {
	try {
		const notification = await Notification.findOne({ id: req.params.id, userId: req.user.id });
		if (!notification) return res.status(404).json({ error : "Invalid request, requested notification not found"});
		res.status(200).json(notification);
	} catch (error) {
		res.status(400).json({ error : error.message});
	}
});

router.put("/notifications/:id", authorize, async (req, res) => {
	try {
		const notificationId = req.params.id;
		const notification = await Notification.findOneAndUpdate(
			{ id: notificationId },
			{ read: true },{ new: true }
		);
		if (!notification) return res.status(404).json({ error : "Invalid request, requested notification not found"});
		res.status(200).json(notification);
	} catch (error) {
		res.status(400).josn({ error : error.message });
	}
});

module.exports = router;
