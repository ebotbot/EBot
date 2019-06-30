const EBot = require('./src/EBot')
require('dotenv').config()


const client = new EBot({
  disableEveryone: true,
  fetchAllMembers: true
})

client.login(process.env.BOT_TOKEN)