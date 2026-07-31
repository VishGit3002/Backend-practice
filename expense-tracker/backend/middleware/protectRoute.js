import User from "../models/auth.model.js";
import jwt from "jsonwebtoken";

async function protectRoute(req, res, next) {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decodedToken)

    const user = await User.findById(decodedToken.id);
    // console.log(user)

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
export default protectRoute;
