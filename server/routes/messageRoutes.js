const messageController = require('../controllers/messageController');
const router = require('express').Router();
const { isAuthenticated } = require('../middlewares/auth');

router.post("/send-message", isAuthenticated, messageController.addMessage);
router.post("/get-messages", isAuthenticated, messageController.getAllMessages);

module.exports = router;