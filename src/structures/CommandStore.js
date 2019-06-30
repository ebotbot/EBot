const Store = require('./Store')
const { Collection } = require('discord.js')

class CommandStore extends Store {
  constructor(client) {
    super(client, "commands")
  }
  
  get(name) {
    return super.get(name)
  }
  has(name) {
    return super.has(name) 
  }
  set(command) {
    super.set(command)
    return command
  }
}

module.exports = CommandStore