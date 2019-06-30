const { Command } = require('../src/structures/')
const { MessageEmbed } = require('discord.js')

const { discordNumberEmojis } = require("../util/constants.js") 

const faker = require('faker')

class HireEmployee extends Command {
  constructor(...args) {
    super(...args, {
      name: 'hireemployee',
      description: 'Hire a employee',
      usage: 'hireemploye'
    })
  }
  
  async run(message, args) {
    const company = await this.client.database.findCompanyByOwner(message.author.id)
    
    const maxEmployees = Math.round(company.price / 100)
    if (company.employees.length >= maxEmployees) {
      message.channel.send("`" + company.shortName + "` already has " + maxEmployees + " or more employees!")
      return
    }
    
    const searchingMsg = await message.channel.send("Searching for candidates...")
    
    const maxSalary = company.price
    
    const candidates = []
    for (let i = 0; i < 5; i++) {
      const name = faker.name.findName()
      console.log("Machimo " + maxSalary)
      
      const salary = this.randomInteger(998, maxSalary)
      console.log(salary)
      
      const image = faker.image.avatar()
      
      const habilityPercent = (salary / maxSalary) * 100
      
      candidates.push({ name: name, salary: salary, image: image, habilityPercent: habilityPercent })
    }
    
    const embed = new MessageEmbed()
    
    embed.setTitle("Candidates for the job")
    embed.setColor("#7289DA")
    
    embed.setTimestamp(new Date())
    
    candidates.forEach((candidate, idx) => {
      embed.addField(discordNumberEmojis[idx + 1] + " " + candidate.name, ":money_with_wings: **Salary:** " + candidate.salary + "\n📊 **Habilidade %:** " + (Math.round(candidate.habilityPercent * 100) / 100) + "%", true)
    })

    const msg = await message.channel.send({ embed })
    
    await searchingMsg.delete() 
    
    const candidatesPrompt = await this.createEmojiPrompt(
      msg,
      message.author, [{
        id: '1',
        emoji: '1⃣'
      }, {
        id: '2',
        emoji: '2⃣'
      }, {
        id: '3',
        emoji: '3⃣'
      }, {
        id: '4',
        emoji: '4⃣'
      }, {
        id: '5',
        emoji: '5⃣'
      }]
    )
    
    if (!candidatesPrompt) 
      return
    
    const choosen = candidates[candidatesPrompt.toString() - 1]
    if (!choosen)
      return
    
    await msg.delete()
    
    const candidateEmbed = new MessageEmbed ()
    
    candidateEmbed.setTitle("ℹ Info about " + choosen.name.split(" ")[0])
    
    candidateEmbed.setColor("#7289DA")
    candidateEmbed.setTimestamp(new Date())
    
    candidateEmbed.setThumbnail(choosen.image)
    
    candidateEmbed.addField("💁 Complete name", choosen.name, true)
    candidateEmbed.addField("💸 Requested salary", "$" + choosen.salary, true)
    candidateEmbed.addField("📊 Hability %", (Math.round(choosen.habilityPercent * 100) / 100) + "%", true)
    
    const candidateMessage = await message.channel.send({ embed: candidateEmbed })
    
    const hirePrompt = await this.createEmojiPrompt(
      candidateMessage,
      message.author, [{
        id: 'hire',
        emoji: '✅'
      }, {
        id: 'cancel',
        emoji: 'cancel:577264909910409220'
      }]
    )
    
    if (!hirePrompt)
      return
    
    if (hirePrompt === 'hire') {
      company.employees.push(choosen)
      company.save()
      
      await candidateMessage.delete()
      message.channel.send("Alright! `" + choosen.name + "` has been hired! (Employee `" + company.employees.length + "/" + maxEmployees + "`)")
    } 
    
    if (hirePrompt === 'cancel') {
      await candidateMessage.delete()
      
      message.channel.send("Cancelled!")
    }
  }

}


module.exports = HireEmployee