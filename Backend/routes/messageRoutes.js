const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { getUsersForSidedbar, getMessages, sendMessage } = require('../controllers/messageController');
const router = express.Router();

router.route("/users").get(verifyToken, getUsersForSidedbar);
router.route("/messages/:id").get(verifyToken, getMessages);
router.route("/send/:id").post(verifyToken, sendMessage);
module.exports = router;