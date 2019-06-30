const { Command } = require('../src/structures/')
const Pagination = require('discord-paginationembed')

class ListEmployees extends Command {
  constructor(...args) {
    super(...args, {
      name: 'listemployees',
      description: 'List a company\'s employees',
      usage: 'listemployees [company]'
    })
  }
  
  async run(message, args) {
    const company = await this.client.database.findCompanyByOwner(message.author.id)
    
    const fieldsEmbed = new Pagination.FieldsEmbed()
      .setAuthorizedUsers([message.author.id])
      .setArray(company.employees)
      .setChannel(message.channel)
      .setElementsPerPage(2)
      .setPageIndicator(true)
      .formatField('Employees', (employee, idx) => `**${employee.name}**\n:money_with_wings:**Salary:** ${employee.salary}\n📊 **Hability %:** ${Math.round(employee.habilityPercent)}%\n`)
    
    const discordEmbed = fieldsEmbed.embed
    
    discordEmbed.setTitle(company.shortName + "'s employees")
     
    discordEmbed.setColor("#7289DA")
    discordEmbed.setTimestamp(new Date())
    
    await fieldsEmbed.build();
  }
}

module.exports = ListEmployees