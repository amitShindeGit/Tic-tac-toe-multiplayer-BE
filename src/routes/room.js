const router = require("express").Router();
const roomController = require("../controllers/room");

const auth = require("../middleware/auth");

router.get("/", auth, roomController.getAllRooms);
router.get("/:roomId", auth, roomController.getRoomByName);
router.patch("/:roomId", auth, roomController.updateRoomById);
router.post("/", auth, roomController.createRoom);

module.exports = router;
