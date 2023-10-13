const router = require("express").Router();
const userController = require("../controllers/user");
const auth = require("../middleware/auth");

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/:userId", auth, userController.getUserById);

module.exports = router;
