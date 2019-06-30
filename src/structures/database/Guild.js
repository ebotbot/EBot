const mongoose = require('mongoose')
module.exports = new mongoose.Schema({
  _id: {
    type: String
  },
  prefix: {
    type: String,
    default: process.env.PREFIX || 'e$'
  },
  lang: {
    type: String,
    default: 'en_US'
  }
})