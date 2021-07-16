import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  try {
    if (!token) {
      return res.status(404).json({ error: `Token not found` });
    }
    // console.log(token)
    const verify = jwt.verify(token, process.env.SECRET);
    if(!verify) {
      return res.status(404).json({ error: `Token expired` });
    }
    const user = await User.findOne({ _id: verify.id });
    // console.log(user);
    if (!user) {
      return res.status(404).json({ error: `User not found on auth` });
    }
    req.user = user;
    // console.log(req.user)
    next();
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error` });
  }
};

export default auth;
