const router = require("express").Router();
const boardController = require("../controllers/board");

const auth = require("../middleware/auth");

router.get("/", auth, boardController.getBoardById);
router.get("/:boardId", auth, boardController.getBoardById);
router.post("/", auth, boardController.createBoard);
router.patch("/:boardId", auth, boardController.updateBoard);

module.exports = router;
