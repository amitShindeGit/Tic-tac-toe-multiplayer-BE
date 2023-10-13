const mongoose = require("mongoose");
const Room = mongoose.model("Room");

exports.createRoom = async (req, res) => {
  const { name } = req.body;

  const nameRegex = /^[A-Za-z0-9\s]+$/;

  if (!nameRegex.test(name))
    throw "Room name can contain only alphabets and numbers";

  if (name.length >= 10) throw "Room name cannot be more than 10 characters";

  try {
    const roomExists = await Room.findOne({ name });

    if (roomExists) throw "Room with that name already exists";

    const room = new Room({
      name,
    });

    await room.save();

    res.json({
      message: "Room created",
    });
  } catch (e) {
    res.json({
      message: "Something went wrong from our end.",
    });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});

    res.json(rooms);
  } catch (e) {
    res.json({
      message: "Something went wrong from our end.",
    });
  }
};

exports.getRoomByName = async (req, res) => {
  const id = req.params.roomId;

  try {
    const roomExists = await Room.findOne({ _id: id });

    if (roomExists) {
      res.json(roomExists);
    } else {
      res.json({
        data: {},
        message: "No room found",
      });
    }
  } catch (e) {
    res.json({
      message: "Something went wrong from our end.",
    });
  }
};

exports.updateRoomById = async (req, res) => {
  const id = req.params.roomId;
  const { players } = req.body;

  try {
    const existingRoomData = await Room.findOne({
      _id: id,
    });

    if (!existingRoomData) throw "No room data found";

    let updateData = {
      players:
        existingRoomData?.players.length >= 1
          ? [...existingRoomData?.players, players]
          : [players],
    };

    if (existingRoomData?.players.includes(players)) {
      updateData = {};
    }

    if (existingRoomData?.players.length >= 2) {
      updateData = {};
    }

    const updatedRoom = await Room.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (updatedRoom) {
      res.json(updatedRoom);
    } else {
      res.json({
        data: {},
        message: "No room found to update",
      });
    }
  } catch (e) {
    res.json({
      data: {},
      message: "Something went wrong while updating room.",
    });
  }
};
