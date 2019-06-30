const SchemaManager = require('./structures/database/SchemaManager')
const uniqid = require('uniqid')

const moment = require("moment")

class Database {
  constructor (mongoURI, client) {
    this.client = client
    this.mongoose = require('mongoose')
    this.mongoose.connect(mongoURI, { useNewUrlParser: true })
    this.manager = new SchemaManager(this.mongoose, this)
  }
  // GUILD
  getGuildById (id) {
    return this.manager.guilds.findOne({ _id: id }).then(g => g)
  }
  createGuild (id, lang = 'en_US', prefix = 'd$') {
    return new this.manager.guilds({
      _id: id,
      prefix: process.env.PREFIX || prefix,
      lang: lang
    }).save()
  }
  changeGuildLang (id, lang) {
    this.getGuildById(id).then(async doc => {
      doc.lang = lang
      await doc.save()
    })
  }
  changeGuildPrefix (id, prefix) {
    this.getGuildById(id).then(async doc => {
      doc.prefix = prefix
      await doc.save()
    })
  }
  // COMPANY
  createCompany (name, short, owner) {
    return new this.manager.companies({
      _id: uniqid('comp-'),
      owner: owner,
      shortName: short,
      name: name
    }).save().then(a => this.createUser(owner, a))
  }
  
  findCompanyById (id) {
    return this.manager.companies.findOne({ _id: id }).then(d => d)
  }
  
  findCompanyByOwner (id) {
    return this.manager.companies.findOne({ owner: id }).then(d => d)
  }
  
  findCompanyByShortName (name) {
    return this.manager.companies.findOne({ shortName: name }).then(d => d)
  }
  
  findCompanyByFullName (name) {
    return this.manager.companies.findOne({ name: name }).then(d => d)
  }
  
  findUserByCompanyId (id) {
    return this.manager.users.findOne({ companyID: id }).then(d => d)
  }
  
  findUserById (id) {
    return this.manager.users.findOne({ _id: id }).then(d => d)
  }
  
  //PROJECTS
  findProjectById (id) {
    return this.manager.projects.findOne({_id: id}).then(d => d)
  }
  
  findProjectByCompany (id) {
    return this.manager.projects.findOne({company: id}).then(d => d)
  }
  
  async createProject(company, type, manufacturingTime, startedTime) {
    let project = new this.manager.projects({
      _id: uniqid('project-'),
      company: company._id,
      type: type,
      manufacturingTime: manufacturingTime,
      startedTime: startedTime
    })
    await project.save()
    setTimeout(async () => {
      let data = {
        projectType: type,
        company: await this.findCompanyById(project.company)
      }
      project.delete()
      this.client.emit('projectFinished', data)
      console.log('project finished')
    }, manufacturingTime)
    return project
  }
  
  //USERS
  createUser (id, company) {
    return new this.manager.users({
      _id: id,
      companyID: company._id
    }).save()
  }
  
  // distribui money entre os buyers da empresa
  async addMoneyToCompany (id, money) {
    let comp = await this.findCompanyById(id)
    let remainingMoney = money
    
    comp.buyers.forEach(async a => {
      let compMoney = parseInt(a.percent) * parseInt(remainingMoney) / 100
      await this.findUserByCompanyId(a.id).then(async doc => {
        doc.money += compMoney
        remainingMoney -= compMoney
        this.client.users.get(doc._id).send(`You've won $${compMoney} with a ${comp.name}'s project. `).then(a => doc.save()) 
      })
    })
    
    await this.findUserByCompanyId(id).then(async doc => {
      doc.money += remainingMoney
      this.client.users.get(doc.id).send(`You've won ${remainingMoney} with your company project`)
      await doc.save()
    })
    
    return true
  }
  
  async handleSalaries(company) {
    if (company.employees.length === 0)
      return
    
    const owner = await this.client.database.findUserById(company.owner)
    
    this.client.debug("Handle salaries to company " + company.name + " (" + company.employees.length + " employees)")
    
    if (owner.money < 0) {
      this.client.debug("(" + company.name + ") Owner hasn't money!!!")
      
      try {
        const user = await this.client.fetchUser(company.owner)
        
        await user.send("You're currently out of money to pay your employee's salaries!")
        this.client.debug("(" + company.name + ") Message sent via DM!")
      } catch (err) {
        this.client.debug("(" + company.name + ") Message could not be sent!")
      }
      
      return
    }
    
    this.client.debug("(" + company.name + ") Owner has money!!!")
    
    company.employees.forEach((employee) => {
      this.client.debug("(" + company.name + ") Employee: " + employee.name + " - Salary: $" + employee.salary)
      
      owner.money -= employee.salary
    })
    

    company.lastSalaryMonth = moment().month()
    company.save()
    owner.save()
  }
}

module.exports = Database