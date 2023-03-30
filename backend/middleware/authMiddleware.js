const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
dotenv.config();

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // token = Bearer sadsfadsggafs
      // Remove the Bearer, take the token
      token = req.headers.authorization.split(" ")[1];

      // decode token id

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded);

      // Find user from DB and return without password
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not autorized, no token");
  }
});

module.exports = protect;
