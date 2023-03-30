const express = require("express");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageControllers");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Calling APIs with the help of Controllers
router.post("/", protect, sendMessage);
router.get("/:chatId", protect, allMessages);

module.exports = router;
