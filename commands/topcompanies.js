const { Command } = require('../src/structures/')
const Pagination = require('discord-paginationembed')

class TopCompanies extends Command {
  constructor(...args) {
    super(...args, {
        name: "topcompanies",
      description: "Teste",
      usage: "topcompanies",
      aliases: ["topcomp"]
    })
  }
  
  async run(message, args) {
    this.client.database.manager.companies.find({}).sort('-price').limit(50).then(docs => {
    const fieldsEmbed = new Pagination.FieldsEmbed()
      .setAuthorizedUsers([message.author.id])
      .setArray(docs)
      .setChannel(message.channel)
      .setElementsPerPage(10)
      .setPageIndicator(true)
      .formatField('Companies', (a, i) => `${i + 1}° lugar: ${a.name} (${a.shortName}) - \$${a.price}`)
    
    const discordEmbed = fieldsEmbed.embed
    discordEmbed.setTitle('Top 50 richest companies')
    fieldsEmbed.build();

    })
  }
}
// ok
//Vou abrir o console pra ver se dá algum erro
module.exports = TopCompanies