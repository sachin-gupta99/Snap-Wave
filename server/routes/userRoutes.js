const router = require('express').Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middlewares/auth');

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/set-avatar/:id", isAuthenticated, userController.setAvatar);
router.post("/verifyToken", isAuthenticated, userController.verifyToken);
router.get("/user/:id", isAuthenticated, userController.getUser);
router.get("/users/:id", isAuthenticated, userController.getAllUsers);

module.exports = router;
