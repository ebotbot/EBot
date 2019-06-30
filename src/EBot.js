const { Client } = require("discord.js")
const moment = require("moment")

const readdir = require("readdir")

const Extensions = require("./utils/Extensions")

require("colors")

class EBot extends Client {

    constructor (options) {
        super (options)
    }

    async start (config) {
        this.config = config
        await this.login(config.clientToken)

        new Extensions()

        this.info("Successfully logged-in!", `${this.user.tag} - ${this.user.id}`)

        await this.initActivitiesHandler()
        await this.registerEventListeners()
    }

    async registerEventListeners() {
        const files = await readdir.readSync("./src/listeners")

        files.forEach((file) => {
            const EventListener = require("./listeners/" + file)
            const listener = new EventListener()

            listener.register(this)
            this.info("EventListener \""+ file +"\" was registered!")
        })
    }

    async initActivitiesHandler() {
        await this.selectAndChangeActivity()

        setInterval(async () => {
            await this.selectAndChangeActivity()
        }, 30 * 1000)
    }

    async selectAndChangeActivity() {
        const activity = this.config.activities.random()
        this.info("User activity:", activity)

        await this.user.setActivity(activity.name, {type: activity.type, url: 'https://www.twitch.tv/MrGaabriel'})
    }

    get timestampFormatted () {
        return new moment().format("HH:mm:ss DD/MM/YYYY")
    }

    info (msg, ...options) {
        console.log(`[${this.timestampFormatted}]`.yellow, `[INFO]`.blue, msg, ...options)
    }

    warn (msg, ...options) {
        console.log(`[${this.timestampFormatted}]`.yellow, `[WARN]`.magenta, msg, ...options)
    }

    error (msg, ...options) {
        console.log(`[${this.timestampFormatted}]`.yellow, `[ERROR]`.red, msg, ...options)
    }

}

module.exports = EBot