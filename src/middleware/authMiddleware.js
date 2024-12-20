import jwt from "jsonwebtoken"

export const  authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Extract token after 'Bearer'

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }

      req.user = user; // Add user info to request
      next(); // Pass control to the next middleware
    });
  } else {
    res.status(401).json({ message: "Authorization header missing" });
  }
};



