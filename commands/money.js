const { Command } = require('../src/structures/')

class Money extends Command {

  constructor(...args) {
    super(...args, {
      name: 'money',
      description: 'capitalsimo',
      usage: 'capitalismo'
    })
  }
  
  async run(message, args) {
    let user = await this.client.database.findUserById(message.author.id)
    if(!user) return message.channel.send("Wallet not found")
    message.channel.send(`You have **$${Math.floor(user.money)}** in your account`)
  }
}
module.exports = Money