const { Command } = require('../src/structures/')
const { MessageEmbed } = require('discord.js')

class Ping extends Command {
  constructor(...args) {
    super(...args, {
      name: "ping",
      description: "Teste",
      usage: "ping",
      aliases: ["pong"]
    })
  }
  
  async run(message, args) {
    const embed = new MessageEmbed()
    .setTitle('🏓 **Pong!**')
    .setColor(0xFF0000)
    .setDescription(`Calculando ping OwO`)
    const msg = await message.reply(embed)
    const embedtoEdit = new MessageEmbed()
    .setTitle('🏓 **Pong!**')
    .setColor(0xFF0000)
    .setDescription(`⚡ **API Ping**: ${msg.createdTimestamp - message.createdTimestamp}ms`)
    
    msg.edit(`${message.author.toString()}`, embedtoEdit)
  }
}
// ok
//Vou abrir o console pra ver se dá algum erro
module.exports = Ping