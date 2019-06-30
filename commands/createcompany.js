const { Command } = require('../src/structures/')
const { MessageEmbed } = require('discord.js')

class CreateCompany extends Command {
  constructor(...args) {
    super(...args, {
      name: "createcompany",
      description: "Teste",
      usage: "createcompany",
      aliases: ["createcomp"]
    })
  }
  
  async run(message, args) {
    let comp = await this.client.database.findCompanyByOwner(message.author.id)
    if (comp) return message.channel.send('You already own a company')
    
    let obj = await this.createPrompt(message, [{
      id: 'short',
      message: 'Choose the company\'s code (it should be between 4 and 5 digits)',
      modify: text => text.toUpperCase()
    }, {
      id: 'name',
      message: 'What\'s the name of the company?'
    }])
    
    if (!obj) 
      return
    
    if (obj.short.length > 5 || obj.short.length < 4 || parseInt(obj.short)) 
      return message.channel.send('Invalid code! It should be between 4 and 5 digits.')
    
    comp = await this.client.database.findCompanyByShortName(obj.short)
    if (comp) return message.channel.send('This code is from another company! Please try again')
    
    comp = await this.client.database.findCompanyByFullName(obj.name)
    if (comp) return message.channel.send('This name is from another company! Please try again')
    
    this.client.database.createCompany(obj.name, obj.short, message.author.id).then(() => {
      message.channel.send(`Alright! The company **${obj.name} (${obj.short})** was successfully created.\n\nGood luck!`)
    })
  }
}
// ok
//Vou abrir o console pra ver se dá algum erro
module.exports = CreateCompany