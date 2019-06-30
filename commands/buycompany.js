const { Command } = require('../src/structures/')
const { MessageEmbed } = require('discord.js')



class BuyCompany extends Command {
  constructor(...args) {
    super(...args, {
      name: "buycompany",
      description: "Buy a company",
      usage: "buycompany <company code>"
    })
    
  }
  
  async run(message, args) {
    if (!args[0]) { return message.channel.send("You have to inform a company code") }
    let buyer = await this.client.database.findUserById(message.author.id)
    let buyerComp = await this.client.database.findCompanyByOwner(message.author.id)
    let target = await this.client.database.findCompanyByShortName(args[0])
    if(!target) { return message.channel.send("You have to inform a valid company code") }
    // Porcentagem
    let obj = await this.createPrompt(message, [{
      id: 'percent',
      message: "What percentage?",
    }])
    if (!obj) return
    if(parseInt(obj.percent) > 100) { return message.channel.send("You can't give a percentage that's more than 100%!") }
    let avaliablePercent = 100
    if (target.buyers[0]) target.buyers.map(a => a.percent).forEach(a => { avaliablePercent -= a })
    
    if (avaliablePercent < obj.percent) return message.channel.send('You can\'t buy this amount of the company. '+ avaliablePercent +'% of this company is available.')
    if(buyer.money < obj.percent*target.price/100) { return message.channel.send("You don't have enough money to buy this company")}
    // Mandar dm para o vendedor
    let targetUser = this.client.users.get(target.owner)
    let targetDbUser = await this.client.database.findUserById(target.owner)
    let buyerUser = this.client.users.get(buyer.id)
    message.channel.send('Ok, please wait '+ targetUser.tag +' choose an option.')
    targetUser.send(
      `${buyerUser.username} from ${buyerComp .name} want to buy ${obj.percent}% of your company ${target.name}\nYou're going to receive $${obj.percent*target.price/100}.\nTo accept, send **y** or **n** to deny. **You have 1 day to choose an option.**.`
    ).then(m => {
      m.channel.awaitMessages(m => m.author.id === targetUser.id, { max: 1, time: 24 * 60 * 60 * 1000 }).then(a => {
        let response = a.first().content.toLowerCase()
        if (response === 'y') {
          buyer.money -= parseInt(obj.percent) * target.price / 100
          targetDbUser.money = targetDbUser.money + (parseInt(obj.percent) * target.price / 100)
          buyer.save()
          targetDbUser.save()
          target.buyers.push({ id: buyerComp._id, percent: obj.percent })
          target.save()
          m.channel.send(`Success.`)
          message.channel.send('Hooray! You successfully bought '+ obj.percent +'% of '+ target.name +' ('+ target.shortName +')!')
        } else {
          m.channel.send('Ok, your company won\'t be sold.')
          message.channel.send(targetUser.tag +' denied your request.')
        }
      })
    })
  }
}
module.exports = BuyCompany