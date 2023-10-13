const mongoose = require("mongoose");

function arrayLimit(val) {
  return val.length <= 2;
}

const boardSchema = new mongoose.Schema(
  {
    board: {
      type: [String],
      required: true,
    },
    players: {
      type: Array,
      validate: [arrayLimit, "{PATH} exceeds the limit of 2"],
    },
    lastMove: {
      type: Array,
      validate: [arrayLimit, "{PATH} exceeds the limit of 2"],
    },
    winner: {
      type: String
    },
    room: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Board", boardSchema);
