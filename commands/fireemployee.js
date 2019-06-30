const { Command } = require('../src/structures/')
const Pagination = require('discord-paginationembed')
const { discordNumberEmojis } = require("../util/constants.js")  

class FireEmployee extends Command {

  constructor(...args) {
    super(...args, {
      name: 'fireemployee',
      description: 'Fire a employee',
      usage: 'fireemployee <employee name>'
    })
  }
  
  async run(message, args) {
    const company = await this.client.database.findCompanyByOwner(message.author.id)  
    
    const fieldsEmbed = new Pagination.FieldsEmbed()
      .setAuthorizedUsers([message.author.id])
      .setArray(company.employees)
      .setChannel(message.channel)
      .setElementsPerPage(1)
      .setPageIndicator(true)
      .formatField('Employee', (employee, idx) => `${discordNumberEmojis[idx + 1]} ${employee.name}\n:money_with_wings:**Salary:** ${employee.salary}\n📊 **Hability %:** ${Math.round(employee.habilityPercent)}%\n`)
      .addFunctionEmoji('🔥', (usr, instance) => {
        const employee = instance.array[instance.page - 1]
        
        company.employees.remove(employee)
        company.save()
        
        message.channel.send("You've fired `" + employee.name + "`!")
        
        const chance = this.randomInteger(0, 100)
        if (chance <= 10) {
          if (this.randomBoolean()) {
            const penalty = this.randomInteger(200, 500)
            
            company.price -= penalty
            company.save()
            
            message.channel.send("`" + employee.name + "` appealed to justice and won! `-$" + penalty + "` penalty")
          } else {
            message.channel.send("`" + employee.name + "` appealed to justice and lost!")
          }
        }
        
        instance.clientAssets.message.delete()
      })
    
    const discordEmbed = fieldsEmbed.embed
    
    discordEmbed.setTitle("Choose an employee")
     
    discordEmbed.setColor("#7289DA")
    discordEmbed.setTimestamp(new Date())
    
    await fieldsEmbed.build();
  }
}

module.exports = FireEmployee