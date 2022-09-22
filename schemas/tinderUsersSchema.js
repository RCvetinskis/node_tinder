const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tinderUserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  preference: {
    type: String,
    required: true,
  },
  pictures: {
    type: [String],
    required: false,
    default: "https://cdn-icons-png.flaticon.com/512/1053/1053244.png?w=360",
  },
  likes: {
    type: [],
    required: false,
  },
  likedBy: {
    type: [],
    required: false,
  },
  filteredUsers: {
    type: [],
    required: false,
  },
});

module.exports = mongoose.model("tinderUserSchema", tinderUserSchema);
