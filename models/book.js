const mongoose = require("mongoose");
const { type } = require("os");

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  auhor: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  category: {
    type: String,
  },
  stock:{
    type:Number,
    required:true
  }
});

const Book = mongoose.model("book", bookSchema);
module.exports = { Book };
