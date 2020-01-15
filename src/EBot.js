require("colors")

const moment = require("moment")

const { Client, Collection } = require('discord.js')
const { CommandStore, EventStore } = require('./structures')

const i18next = require('i18next')
const fsbackend = require('i18next-node-fs-backend')

const scheduler = require("node-schedule")

class EBot extends Client {
  constructor (options) {
    super(options)
    
    this.commands = new CommandStore(this)
    this.events = new EventStore(this)
    this.locale = null
    this.owners = require('../owners.json')
    this.methods = {
      util: require('../util/utils')
    }
    this.database = new(require('./Database'))(process.env.MONGO_URI, this)
  }
  get ping() {
    return this.pings.reduce((prev, p) => prev + p, 0) / this.pings.length
  }
  
  async login(token) {
    const result = await super.login(token)
    await this.init()
    
    return result
  }
  
  async init() {
    const [commands, events] = await Promise.all([this.commands.loadFiles(), this.events.loadFiles()])
    this.info("OK! Initialized successfully!")
    this.info(this.user.tag + " (ID: " + this.user.id + ")")
    this.info("Loaded " + commands + " commands and " + events + " events")
    this.info("I'm ready!")
    
    // verificar se as empresas não quebram
     setTimeout(async () => {
          const companies = await this.database.manager.companies.find({})
          
          companies.forEach((company) => {
            if(company.money <= 0) {
              let owner = this.client.users.get(company.owner)
              owner.send(`Sua empresa ${company.name} faliu!. Tente a sorte novamente com e$createcompany`)
              company.delete()
            }
          })
      }, 3000)
    
    // i18next owo
    i18next.use(fsbackend).init({
      ns: ['commands', 'other'],
      lng: 'en-US',
      fallbackLng: 'en-US',
      backend : {
        loadPath: '/locales/{{lng}}/{{ns}}.json'
      },
      returnEmptyString: false
    })
    this.locale = i18next
    
    scheduler.scheduleJob("15 * *", async () => {
      const companies = await this.database.manager.companies.find({})
      
      companies.forEach((company) => {
        if (company.lastSalaryMonth === moment().month())
          return
        
        this.database.handleSalaries(company)
      })
    })
  }
  
  info(msg, ...args) {  
		console.log(`[${moment().format("HH:MM:SS.SSS")}]`.yellow, `[${"INFO".blue}]`, msg, ...args)
	}
  
  debug(msg, ...args) {  
		console.log(`[${moment().format("HH:MM:SS.SSS")}]`.yellow, `[${"DEBUG".magenta}]`, msg, ...args)
	}

	warn(msg, ...args) {
		console.log(`[${moment().format("HH:MM:SS.SSS")}]`.yellow, `[${"WARN".yellow}]`, msg, ...args)
	}

	error(msg, ...args) {
		console.log(`[${moment().format("HH:MM:SS.SSS")}]`.yellow, `[${"ERROR".red}]`, msg, ...args)
	}
}
module.exports = EBot
