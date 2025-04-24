const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { getUsersForSidedbar } = require('../controllers/messageController');
const router = express.Router();

router.route("/users").get(verifyToken,getUsersForSidedbar);
module.exports = router;