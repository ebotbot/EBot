const mongoose = require('mongoose')
module.exports = new mongoose.Schema({
  _id: {
    type: String
  },
  companyID: {
    type: String,
    default: null
  },
  money: {
    type: Number,
    default: 2000
  }
})