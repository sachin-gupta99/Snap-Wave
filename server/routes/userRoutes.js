const router = require('express').Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middlewares/auth');

router.post("/set-avatar/:id", isAuthenticated, userController.setAvatar);
router.get("/user/:id", isAuthenticated, userController.getUser);
router.get("/user/basic/:id", isAuthenticated, userController.getUserBasic);
router.get("/users/:id", isAuthenticated, userController.getAllUsers);
router.get("/email/:email", isAuthenticated, userController.getUserByEmail);
router.post("/add-contact/:userId", isAuthenticated, userController.addContact);

module.exports = router;
