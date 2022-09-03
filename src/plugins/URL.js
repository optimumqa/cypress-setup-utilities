/// <reference types="cypress" />
const path = require('path')

class URL {
  constructor(on, config, pluginConfig) {
    this.url = ''
    this.finalConfig = {}

    this.CONFIG = {
      ...{
        logging: false,
      },
      ...(pluginConfig || {}),
    }

    this.init(on, config, pluginConfig)
  }

  init(on, config, pluginConfig) {
    this.set(config)

    if (this.CONFIG.logging) {
      console.log('[Plugin:URL] baseUrl: ', config.baseUrl)
    }
  }

  set(config) {
    if (!config.baseUrl) {
      let { PRODUCT, TEAM, ENV } = config.env
      const routes = require(`${path.resolve(
        '.',
        'cypress/fixtures/',
        `${TEAM ? TEAM + '/' : ''}${PRODUCT}/routes.json`,
      )}`)

      this.url = routes[ENV].baseUrl
      config.baseUrl = this.url

      this.finalConfig = config
    }
  }

  getConfig() {
    return this.finalConfig
  }
}

module.exports = URL
