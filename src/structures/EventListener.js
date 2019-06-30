class EventListener {

    constructor (name) {
        this.name = name
    }

    register (client) {
        client.on(this.name, (...args) => this.run(...args))
    }

    run (...args) {}

}

module.exports = EventListener