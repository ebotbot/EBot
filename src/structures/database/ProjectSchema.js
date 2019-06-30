const mongoose = require('mongoose')
module.exports = new mongoose.Schema({
  _id: {
    type: String
  },
  company: {
    type: String
  },
  type: {
    type: String
  },
  manufacturingTime: {
    type: Number
  },
  startedTime: {
    type: Number
  }
})