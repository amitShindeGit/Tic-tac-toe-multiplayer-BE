//Env imports
require("dotenv").config();

//Model imports
require("./src/models/User");
require("./src/models/Board");
require("./src/models/Room");
require("./src/models/Board");

//Jwt import
const jwt = require("jsonwebtoken");

const app = require("./app");

//MongoDB connection
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose Connection ERROR: " + err.message);
});

mongoose.connection.once("open", () => {
  console.log("MongoDB Connected!");
});

const User = mongoose.model("User");
const Board = mongoose.model("Board");
const Room = mongoose.model("Room");
//MongoDb Connection ends

const server = app.listen(3001, () => {
  console.log("Server started on port 3001");
});

//Socket
const io = require("socket.io")(server, {
  allowEIO3: true,
  cors: {
    origin: true,
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  },
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = await jwt.verify(token, process.env.SECRET);
    socket.userId = payload.id;
    next();
  } catch (err) {}
});

io.on("connection", async (socket) => {
  console.log("Connected: " + socket.userId);

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.userId);
  });

  socket.on("joinRoom", async ({ roomId, userId, boardId }) => {
    socket.join(roomId);
    let boardDataRes = await Board.find({ _id: boardId});

    io.to(roomId).emit("newPlayerJoinedRoom", {
      boardId: boardId,
      boardData: boardDataRes[0]
    });

    console.log("A user joined chatroom: " + roomId);
  });

  socket.on("leaveRoom", async ({ roomId, userId }) => {
    socket.leave(roomId);

    console.log("A user left chatroom: " + roomId);
  });

  socket.on("playAgain", ({ roomId, boardId }) => {
    io.to(roomId).emit("resetGame", {
      boardId: boardId,
    });
  });

  socket.on("onPlayAgain", ({ roomId, boardData }) => {
    io.to(roomId).emit("onResetGame", {
      boardData: boardData,
    });
  });

  socket.on("updateRoomPlayers", async ({ roomId, userId }) => {
    const roomData = await Room.find({ _id: roomId });
    const updatedPlayers = roomData[0]?.players?.filter(
      (player) => player !== userId
    );

    let updateRoomData = {
      players: updatedPlayers,
    };

    await Room.findByIdAndUpdate(roomId, updateRoomData);
  });

  socket.on("playerMove", async ({ roomId, move, boardId, tileNumber }) => {
    const user = await User.findOne({ _id: socket.userId });
    const boardData = await Board.findOne({ _id: boardId });

    const updatedBoard = [...boardData?.board];
    updatedBoard[tileNumber] = move;

    const isBoardNew = boardData?.board.every((tile) => tile === "");

    let updateData = {};
    if (isBoardNew) {
      updateData = {
        board: updatedBoard,
        lastMove: { id: user?.id, move: move },
      };
    } else if (
      boardData?.players?.length < 2 &&
      boardData?.players[0].id !== user?.id
    ) {
      updateData = {
        board: updatedBoard,
        lastMove: { id: user?.id, move: move },
      };
    } else {
      updateData = {
        board: updatedBoard,
        lastMove: { id: user?.id, move: move },
      };
    }

    const newUpdatedBoard = await Board.findByIdAndUpdate(
      { _id: boardId },
      updateData,
      { new: true }
    );

    io.to(roomId).emit("updateBoard", {
      updatedBoard: newUpdatedBoard,
    });
  });
});
