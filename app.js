const fs = require("fs")

const defaultconfig = {
    clientToken: "Discord Bot Token",
    clientId: "Discord Bot ID",
    ownerIds: ["Owner(s) ID(s)"],
    activities: [
        {
            name: "stocks",
            type: "WATCHING"
        }
    ]
}

if (!fs.existsSync("config.json")) {
    fs.writeFile("config.json", JSON.stringify(defaultconfig), () => {})

    console.log("Looks like you're running EBot without a config file!")
    console.log("I've created the \"config.json\" file for you!")
    return
}

const config = require("./config.json")

// Gambiarra para não quebrar as configs
for (key in defaultconfig) {
    if (!config[key]) {
        config[key] = defaultconfig[key]

        fs.writeFile("config.json", JSON.stringify(config), () => {})
    }
}

const EBot = require("./src/EBot")

const bot = new EBot()
bot.start(config)