class Event {    
    constructor(client, file, options = {}) {
        this.client = client
        this.name = options.name || file.name
        this.enabled = "enable" in options ? options.enabled : true
        this.file = file
        this.store = this.client.events
    }

    async _run(...args) {
        if (this.enabled) {
            try {
                await this.run(...args)
            } catch (error) {
              console.log(error)
            }            
        }
    }
    reload() {
        return this.store.load(this.file.path)
    }
}

module.exports = Event