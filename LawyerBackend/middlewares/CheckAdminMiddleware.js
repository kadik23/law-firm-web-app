const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    console.log("admin:"+req.body)
    try {
        const user = req.user

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(user.type);
        if (user.type === 'admin') {
            console.log("user is admin");
            next();
        } else {
            return res.json({ message: 'Unauthorized - User is not an admin' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};