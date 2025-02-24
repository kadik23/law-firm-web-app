const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (roles = []) => {
  return (req, res, next) => {
    const authToken = req.cookies.authToken;

    console.log("authToken:", authToken);

    try {
      if (!authToken) {
        return res.status(401).json({ error: "Unauthorized - Missing Token" });
      }
      try {
         jwt.verify(authToken, process.env.SECRET);
      } catch (error) {
        return res.status(401).json({ error: "Unauthorized - Invalid Token" });
      }
      const data = jwt.verify(authToken, process.env.SECRET);

      if (!data.user) {
        return res.status(401).json({ error: "Unauthorized - Invalid Token" });
      }

      const { password, ...filteredUserData } = data.user;
      req.user = filteredUserData; 

      if (roles.length > 0 && !roles.includes(data.user.type)) {
        return res.status(403).json({ error: "Forbidden - Insufficient Role" });
      }

      console.log("Authorized user:", data.user);
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Unauthorized - Token Expired" });
      }

      console.error("Error during token verification:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
};