const { Event } = require('../src/structures/')

module.exports = class extends Event {
  
  constructor(...args) {
    super(...args)
  }
  
  async run() {
    await this.client.user.setActivity('https://ebot-1.gitbook.io/')
  }
}