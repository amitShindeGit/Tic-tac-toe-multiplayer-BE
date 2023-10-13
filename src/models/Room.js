const mongoose = require("mongoose");

function arrayLimit(val) {
  return val.length <= 2;
}

const roomScheme = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  players: {
    type: Array,
    validate: [arrayLimit, "{PATH} exceeds the limit of 2"],
  },
});

module.exports = mongoose.model("Room", roomScheme);
