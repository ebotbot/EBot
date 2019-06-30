const EventListener = require("../structures/EventListener")

class MessageListener extends EventListener {

    constructor () {
        super("message")
    }

    run (message) {
        if (message.author.bot) {
            return
        }

        // TODO: we got some things to do
    }
}

module.exports = MessageListener