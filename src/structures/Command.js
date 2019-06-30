const { Permission } = require('discord.js')


class Command {
    constructor(client, file, options = {}) {
        this.client = client
        this.name = options.name || file.name
        this.description = options.description || "Sem descrição"
        this.hidden = options.hidden || false
        this.file = file
        this.store = this.client.commands
        this.usage = options.usage || "Sem informação"
        this.devCommand = options.devCommand || false
    }

    async verifyUser(message, user, options = {}) {
        let member
        const idMatch = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user)
        if (idMatch) return this.client.users.get(idMatch[1])
        if (/(#[0-9]{4})$/.test(user)) member = message.guild.members.find(member => member.user.tag === user)
        else member = message.guild.members.find(member => member.user.username === user)
        if (member) return member.user
        throw new this.client.methods.errors.ParseError("ID da Menção invalida", options.msg)
    }

    async verifyMember(message, member, options = {}) {
        const user = await this.verifyUser(message, member, options)
        return message.guild.members.fetch(user)
    }

    async run(message, args) {
        throw new Error(`O comando ${this.constructor.name} não tem um método run!.`)
    }

    reload() {
        return this.store.load(this.file.path)
    }
    createPrompt (originalMsg, prompts) {
      let obj = {}
      let promptsToShow = prompts
      return new Promise(async (resolve) => {
        while (promptsToShow[0]) {
          let actual = promptsToShow.shift()
          let val = await showPrompt(actual.message, originalMsg)
          if (!val) {
            return originalMsg.channel.send('Você demorou demais e o comando foi cancelado.').then(() => resolve(null))
          }
          if (actual.modify) {
            obj[actual.id] = actual.modify(val)
          } else {
            obj[actual.id] = val
          }
        }
        resolve(obj)
      })
      function showPrompt (message, originalMsg) {
        return new Promise((resolve) => {
          originalMsg.channel.send(`${message}\n\nVocê tem **20 segundos** para responder essa mensagem.`).then(m => {
            m.channel.awaitMessages(m => m.author.id === originalMsg.author.id, { max: 1, time: 20000 }).then(a => {
              resolve(a.first().content)
            }).catch(e => {
              resolve(null)
            })
          })
        })
      }
    }
  
    async createEmojiPrompt (sentMsg, user, options) {
      /*
        options = Array<Object({
          emoji: string - Emoji (unicode, id, etc)
          id: string - Resposta da Promise
        })>
      */
      
      return new Promise(async (resolve) => {
        const filter = (r, u) => {
          let isValidEmoji = options.find(a => a.emoji == r.emoji.name || a.emoji == r.emoji.id)
          
          return isValidEmoji && user.id == u.id && !user.bot
        }
      
        const emojis = options.map(a => a.emoji)
        await emojis.forEach(async (emoji) => await sentMsg.react(emoji))
      
        sentMsg.awaitReactions(filter, { time: 20000, max: 1 }).then((emojis) => {
          const a = emojis.first()
          
          let emoji = options.find(b => b.emoji === a.emoji.name)
          if (!emoji) emoji = options.find(b => b.emoji === a.emoji.id)
          if (emoji) emoji = emoji.id
        
          console.log(emoji)
          resolve(emoji)    
        }).catch((e) => {
          console.log(e)
          resolve(null)
        })
      })
    }
  
  /* Generates a random integer between "min" and "max" */
  randomInteger(min, max) {
    return Math.round(Math.random() * (max - min) + min)
  }
  
  randomBoolean() {
    return this.randomInteger(0, 2) === 0
  }
}

module.exports = Command