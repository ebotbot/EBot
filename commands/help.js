const { Command } = require('../src/structures/')

class Help extends Command {
  
  constructor(...args) {
    super(...args, {
      name: 'help',
      description: 'help',
      usage: 'help'
    })
  }
  async run(message, args) {
    message.reply('https://ebot-1.gitbook.io/')
  }
  
}
module.exports = Help  