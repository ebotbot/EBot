const mongoose = require('mongoose')
module.exports = new mongoose.Schema({
  _id: {
    type: String
  },
  name: {
    type: String
  },
  employees: {
    type: Array,
    default: []
  },
  shortName: {
    type: String
  },
  price: {
    type: Number,
    default: 2000
  },
  investedValue: {
    type: Number,
    default: 0
  },
  buyers: {
    type: Array,
    default: []
  },
  owner: {
    type: String
  },
  lastSalaryMonth: {
    type: Number,
    default: 0
  }
})