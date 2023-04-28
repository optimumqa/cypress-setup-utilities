const fs = require('fs-extra')
const path = require('path')

const defaultEnvironment = 'staging'
const defaultType = 'default'

class Config {
  constructor(on, config, pluginConfig) {
    this.finalConfig = {
      e2e: {},
    }

    this.CONFIG = {
      ...{
        logging: false,
      },
      ...(pluginConfig || {}),
    }

    this.init(on, config, pluginConfig)
  }

  init(on, config, pluginConfig) {
    this.finalConfig = {}

    const configClone = JSON.parse(JSON.stringify(config.env))
    const originalConfig = {
      product: configClone.product,
      env: configClone.env,
      type: configClone.type,
    }

    let { product, env, type } = config.env

    if (!env) {
      env = defaultEnvironment
    }

    if (!type) {
      type = defaultType
    }

    this.finalConfig = require(path.resolve('.', 'cypress/configs', `${product}/${type}.ts`)).default

    if (!this.finalConfig.e2e) {
      this.finalConfig.e2e = {}
    }

    if (!this.finalConfig.specPattern || !this.finalConfig.specPattern.length) {
      this.finalConfig.specPattern = [`cypress/e2e/${product}/**/*`]
    }

    if (!this.finalConfig.env) {
      this.finalConfig.env = {}
    }

    if (!this.finalConfig.env.PRODUCT) {
      this.finalConfig.env.PRODUCT = product
    }

    if (!this.finalConfig.env.ENV) {
      this.finalConfig.env.ENV = env
    }

    if (!this.finalConfig.env.TYPE) {
      this.finalConfig.env.TYPE = type
    }

    this.finalConfig.env = {
      ...this.finalConfig.env,
      ...config.env,
    }

    this.finalConfig.env.originalConfig = originalConfig

    if (this.CONFIG.logging) {
      console.log('[Plugin:Config] Product: ', this.finalConfig.env.PRODUCT)
      console.log('[Plugin:Config] Environment: ', this.finalConfig.env.ENV)
      console.log('[Plugin:Config] Type: ', this.finalConfig.env.TYPE)
      console.log('[Plugin:Config] Original config: ', JSON.stringify(this.finalConfig.env.originalConfig))
    }

    /**
     * Copy baseUrl from fixtures of the current product, environment into final config
     */
    const routes = require(`${path.resolve('.', 'cypress/fixtures/', `${product}/routes.json`)}`)

    if (!this.finalConfig.e2e.baseUrl) {
      this.finalConfig.e2e.baseUrl = routes[env].baseUrl
    }

    try {
      const myConfigPath = path.resolve('.', 'cypress/configs/', 'cypress.local.ts')
      if (fs.existsSync(myConfigPath)) {
        this.finalConfig = {
          ...this.finalConfig,
          ...require(myConfigPath).default,
        }

        if (this.CONFIG.logging) {
          console.log(`\n[Plugin:Config]: Local config found.`)
        }
      }
    } catch (error) {
      console.error(error)
    }

    if (this.CONFIG.logging) {
      console.log('[Plugin:Config] Config set:', this.finalConfig)
    }
  }
}

module.exports = Config
