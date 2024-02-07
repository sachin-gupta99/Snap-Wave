const router = require('express').Router();
const { isAuthenticated } = require('../middlewares/auth');
const authController = require('../controllers/authController');

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verifyToken", isAuthenticated, authController.verifyToken);

module.exports = router;