class Store {
  constructor() {
    /** @type {object} */
    this.items = {}

    return this
  }

  getItem(data = {}) {
    return this.items[data.name] || null
  }

  setItem(data = {}) {
    this.items[data.name] = new Item(data)

    return this.items[data.name]
  }
}

class Item {
  constructor(data = {}) {
    this.name = data.name || ''
    this.value = data.value || undefined

    return this
  }
}

module.exports = Store
