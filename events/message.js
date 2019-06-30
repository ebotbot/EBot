const { Event } = require('../src/structures/')
const { Permissions, Collection, RichEmbed } = require('discord.js')

module.exports = class extends Event {
  
  constructor(...args) {
    super(...args)
  }
  
  async run(message) {
    // Por enquanto não aceitar comandos via DM
    if(message.author.bot || message.channel.type === 'dm') return
    // database
    let guilddb = await this.getGuildData(message.guild.id)
    let t = this.client.locale.getFixedT(guilddb.lang)
      
    if (message.guild && !message.guild.me) await message.guild.members.fetch(this.client.user)
    if(message.content === this.client.user.toString() || (message.guild && message.content === message.guild.me.toString())) {
      return message.reply("Olá, eu sou o EBOT")
    }
    const gprefix = guilddb.prefix
    const prefix = new RegExp(`^<@!?${this.client.user.id}> |^${this.client.methods.util.regExpEsc(gprefix)}`).exec(message.content)
    if (!prefix) return
    const args = message.content.slice(prefix[0].length).trim().split(/ +/g)
    const cmd = this.client.commands.get(args.shift().toLowerCase())
    if (!cmd) return
    await this.runCommand(message, cmd, args, t)
  }
  async runCommand(message, cmd, args, t) {
    try {
      if(cmd.devCommand && !this.client.owners.owners.includes(message.author.id))
        return message.channel.send("Você não tem permissão para executar este comando!")
      await cmd.run(message, args, t)
    } catch (error) {
        console.log(error)
    }
  }
  
  async getGuildData (id) {
    let db = this.client.database
    let guilddb = await db.getGuildById(id)
    if (!guilddb) {
      this.client.database.createGuild(id)
      guilddb = await db.getGuildById(id)
    }
    return guilddb
  }
}