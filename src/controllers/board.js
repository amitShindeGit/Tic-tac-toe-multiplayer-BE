const mongoose = require("mongoose");
const Board = mongoose.model("Board");

exports.createBoard = async (req, res) => {
  const { players, winner, room } = req.body;
  const board = ["", "", "", "", "", "", "", "", ""];

  try {
    const newBoard = new Board({
      board,
      players,
      winner,
      room,
    });

    await newBoard.save();

    res.json({
      boardData: newBoard,
      message: "New board created",
    });
  } catch (e) {
    res.json({
      message: "Something went wrong from our end.",
    });
  }
};

exports.updateBoard = async (req, res) => {
  const { squareNumber, squareValue, players, winner } = req.body;
  const boardId = req.params.boardId;

  try {
    const existingBoardData = await Board.findOne({
      _id: boardId,
    });

    if (!existingBoardData) throw "No board data found";

    let updateBoard = existingBoardData.board;
    if (typeof squareNumber === "number") {
      updateBoard[squareNumber] = squareValue;
    }

    const updateData = { board: updateBoard };

    if (
      players &&
      existingBoardData?.players?.length < 2 &&
      existingBoardData?.players[0]?.id !== players[0]?.id
    ) {
      updateData.players = [
        ...existingBoardData?.players,
        {
          id: players[0]?.id,
          name: players[0]?.name,
          move: players[0]?.move,
        },
      ];
    }

    if (winner) {
      updateData.winner = winner;
    }

    const updatedBoard = await Board.findByIdAndUpdate(boardId, updateData, {
      new: true,
    });

    res.json({
      updateBoard: updatedBoard,
    });
  } catch (e) {
    res.json({
      message: "Something went wrong from our end.",
    });
  }
};

exports.getBoardById = async (req, res) => {
  const id = req.params.boardId;

  try {
    let boardExists;
    if (id) {
      boardExists = await Board.findOne({ _id: id });
    } else {
      boardExists = await Board.find({});
    }

    if (boardExists) {
      res.json(boardExists);
    } else {
      res.json({
        message: "No board found",
      });
    }
  } catch (e) {
    res.json({
      message: "Something went wrong from our end.",
    });
  }
};
