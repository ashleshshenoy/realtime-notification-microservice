const jwt = require("jsonwebtoken");

const authorize = (req, res, next) => {
	const authHeader = req.header("Authorization");
	if(!authHeader) return res.status(401).send({ error : "Access denied. No token provided"});
	const token = authHeader.replace("Bearer ", "");
	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified;
		next();
		// eslint-disable-next-line
    } catch (error) {
		res.status(401).send({ error : "Access denied. No token provided"});
	}
};


module.exports = {
	authorize
};