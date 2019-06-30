const { Command } = require('../src/structures/')

class Help extends Command {
  
  constructor(...args) {
    super(...args, {
      name: 'prefix',
      description: 'change prefix',
      usage: '<prefix>'
    })
  }
  async run(message, args) {
    // TODO: verificar permissions
    if (message.guild.id !== '512419476424228865') return
    if (!args || args.length < 1) return message.channel.send('Você precisa informar o novo prefix')
    await this.client.database.changeGuildPrefix(message.guild.id, args[0])
    return message.channel.send(`O prefixo desse servidor foi alterado para \`${args[0]}\`!`)
  }
  
}
module.exports = Help  