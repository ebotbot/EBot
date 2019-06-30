module.exports = class SchemaManager {
  constructor (mongooseInstance, db) {
    this.users = require(`${__dirname}/UserSchema`)
    this.companies = require(`${__dirname}/CompanySchema`)
    this.projects = require(`${__dirname}/ProjectSchema`)
    this.guilds = require(`${__dirname}/Guild`)
    this.db = db
    
    this.loadHooks()
    this.loadSchemas(mongooseInstance)
    this.startProjectTimers()
  }
  loadSchemas (mongooseInstance) {
    this.users = mongooseInstance.model('users', this.users)
    this.projects = mongooseInstance.model('projects', this.projects)
    this.companies = mongooseInstance.model('companies', this.companies)
    this.guilds = mongooseInstance.model('guilds', this.guilds)
  }
  loadHooks () {
    this.users.post('save', async (doc) => {
      let comp = await this.companies.findOne({ _id: doc.companyID })
      comp.price = comp.investedValue + doc.money
      await comp.save()
    })
    this.companies.post('save', async (doc) => {
      let user = await this.users.findOne({ _id: doc.owner })
      if (!user) return
      if ((user.money - doc.price) !== doc.investedValue) {
        doc.price = doc.investedValue + user.money
        await doc.save()
      }
    })
  }
  startProjectTimers () {
    this.projects.find({}).then(projects => {
      projects.forEach(project => {
        setTimeout(async () => {
          let data = {
            projectType: project.type,
            company: await this.db.findCompanyByShortName(project.company)
          }
          project.delete()
          this.db.client.emit('projectFinished', data)
          console.log('project finished')
          // nao tem que add no loadhooks? os porjcet[
          
        }, project.manufacturingTime)
      })
    })
  }
}