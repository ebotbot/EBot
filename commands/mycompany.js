const { Command } = require('../src/structures/')
const { MessageEmbed } = require('discord.js')

class MyCompany extends Command {
  constructor(...args) {
    super(...args, {
      name: 'mycompany',
      description: 'Show info\'s about your company',
      usage: 'listemployees [company]'
    })
  }
  
  async run(message, args) {
    const company = await this.client.database.findCompanyByOwner(message.author.id)
    if(!company) {return message.channel.send('You need a company!')}
    let embed =  new MessageEmbed()
      .setTitle('Your company')
      .setColor(0x000fff)
      .addField('Name', company.name)
      .addField('Code', company.shortName)
      .addField('Price', company.price)
      .addField('Invested Value', company.investedValue)
      message.channel.send(embed)
  }
}

module.exports = MyCompany
