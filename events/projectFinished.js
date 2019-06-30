const { Event } = require('../src/structures/')

function generateRandomInt(max, min) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
module.exports = class extends Event {
  constructor(...args) {
    super(...args)
  }
  async run({projectType, company}) {
  let companyOwner = await this.client.database.findUserById(company.owner)
  let money = 0
    switch(projectType) {
      case "mobile-app":
        money = generateRandomInt(1100, 900)
        break
      case "website":
        money = generateRandomInt(900, 650)
        break
      case "os":
        money = generateRandomInt(1400, 900)
    }
    
    this.client.database.addMoneyToCompany(company._id, money)
  }
}
