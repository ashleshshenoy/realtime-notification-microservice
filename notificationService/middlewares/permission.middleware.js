
const isAdmin = (req, res, next) => {
	if(req.user.role != "admin") return res.status(403).json({ error : "Unauthorized access, please try again with valid permissions"});
	next();
};


module.exports = {
	isAdmin
};