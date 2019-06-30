const { Command } = require('../src/structures')
const { MessageEmbed } = require('discord.js')
const APP_VALUE = 900
const WEBSITE_VALUE = 700
const OS_VALUE = 1000

class CreateProject extends Command {
  constructor(...args) {
    super(...args, {
      name: "createproject",
      description: "Create a project",
      usage: "createproject"
    })
  }
  
  async run(message, args) {
    let comp = await this.client.database.findCompanyByOwner(message.author.id)
    let projectsRunning = await this.client.database.manager.projects.find({ company: comp._id })
    if (projectsRunning.length == comp.employeeCount) return message.channel.send('Sorry, you can\'t create new projects by now.\nAll of your employees ('+ comp.employeeCount +') are already working on a project.\nTo create another project, hire a new employee using `e$hireemployee`.')
    let companyOwner = await this.client.database.findUserById(comp.owner)
    if(!comp) { return message.channel.send("You need a company") }
    
    const msg = await message.channel.send("Select a project:\n💻 - Website (30 minutes, $700)\n📱 - Mobile App (30 minutes, $900)\n💾 Operational System (1 hour, $1000)")
    let obj = await this.createEmojiPrompt(
      msg,   
      message.author, [{
        id: 'website',
        emoji: '💻'
      }, {
        id: 'app',
        emoji: '📱'
      }, {
        id: 'os',
        emoji: '💾'
      }]
    )
    
    if(!obj) return
    switch (obj) {
      case 'app':
        if (companyOwner.money < APP_VALUE) 
          return message.channel.send(`You don't have enough funds (**$${APP_VALUE}**) to develop a mobile app`)
        
        console.log(companyOwner.money)
        
        companyOwner.money -= APP_VALUE
        comp.investedValue += APP_VALUE
        companyOwner.save()
        comp.save()
        
        message.channel.send('You started developing a mobile app. It will take you **30 minutes** and **$900** to develop it.')
        this.client.database.createProject(comp, 'mobile-app', 1800000, Date.now())
        
        msg.delete()
        
        break
      case 'website':
        if (companyOwner.money < WEBSITE_VALUE)
          return message.channel.send(`You don't have enough funds (**$${WEBSITE_VALUE}**) to develop a website`)
      
        console.log(companyOwner.money)
        
        companyOwner.money -= WEBSITE_VALUE
        comp.investedValue += WEBSITE_VALUE
        companyOwner.save()
        comp.save()
        
        message.channel.send('You started developing a website. It will take you **30 minutes** and **$700** to develop it.')
        this.client.database.createProject(comp, 'website', 1800000, Date.now())
        
        msg.delete()
        
        break
      case 'os':
        if (companyOwner.money < OS_VALUE) return message.channel.send(`You don't have enough funds (**${OS_VALUE}**) to develop a operational system.`)
        companyOwner.money -= OS_VALUE
        comp.investedValue += OS_VALUE
        companyOwner.save()
        comp.save()
        
        message.channel.send('You started developing a OS. It will take you **1 hour** and **$1000** to develop it.')
        this.client.database.createProject(comp, 'os', 1 * 60 * 60 * 1000, Date.now())
        
        msg.delete()
        break
    }
    
  }
}
module.exports = CreateProject