const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')

const defaultEnvironment = 'staging'

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

    /**
     * Save original config just for reference
     */
    const configClone = JSON.parse(JSON.stringify(config.env))
    const originalConfig = {
      product: configClone.product,
      env: configClone.env,
      type: configClone.type,
    }

    let { product, env, type } = config.env

    /**
     * Make sure there is a default environment
     */
    if (!env) {
      env = defaultEnvironment
    }

    /**
     * Load component global config
     */
    this.finalConfig = require(path.resolve('.', 'cypress/configs', `${product}/global.ts`)).default

    /**
     * Load test type config and merge with the above one
     *
     * In the CLI this is defined with `--type`
     */
    if (type) {
      this.finalConfig = _.merge(
        this.finalConfig,
        require(path.resolve('.', 'cypress/configs', `${product}/${type}.ts`)).default,
      )
    }

    /**
     * Load local config if exists
     */
    try {
      const myConfigPath = path.resolve('.', `cypress/configs/${product}/`, 'cypress.local.ts')
      if (fs.existsSync(myConfigPath)) {
        const myConfig = require(myConfigPath).default

        this.finalConfig = _.merge(this.finalConfig, myConfig)

        if (this.CONFIG.logging && Object.keys(myConfig).length) {
          console.log(`\n[Plugin:Config]: Local config found.`, this.finalConfig)
        }
      }
    } catch (error) {
      console.error(error)
    }

    /**
     * Precaution as `e2e` needs to be defined
     */
    if (!this.finalConfig.e2e) {
      this.finalConfig.e2e = {}
    }

    /**
     * If no specs are defined, load up every products spec file
     */
    if (!this.finalConfig.e2e.specPattern || !this.finalConfig.e2e.specPattern.length) {
      this.finalConfig.e2e.specPattern = [`cypress/e2e/${product}/**/*`]
    }

    /**
     * Set the `env` prop if it's not set
     */
    if (!this.finalConfig.env) {
      this.finalConfig.env = {}
    }

    /**
     * Set PRODUCT, ENV, and TYPE for easier references when they're needed in the runtime
     */
    if (!this.finalConfig.env.PRODUCT) {
      this.finalConfig.env.PRODUCT = product
    }

    if (!this.finalConfig.env.ENV) {
      this.finalConfig.env.ENV = env
    }

    if (!this.finalConfig.env.TYPE) {
      this.finalConfig.env.TYPE = type
    }

    /**
     * Store the original variables from the main Cypress config into the final config
     */
    this.finalConfig.env.originalConfig = originalConfig

    /**
     * Copy baseUrl from fixtures of the current product, and environment into final config
     */
    const routes = require(`${path.resolve('.', 'cypress/fixtures/', `${product}/routes.json`)}`)

    if (!this.finalConfig.e2e.baseUrl) {
      this.finalConfig.e2e.baseUrl = routes.envs[env].baseUrl
    }

    if (this.CONFIG.logging) {
      console.log('[Plugin:Config] Product: ', this.finalConfig.env.PRODUCT)
      console.log('[Plugin:Config] Environment: ', this.finalConfig.env.ENV)
      console.log('[Plugin:Config] Type: ', this.finalConfig.env.TYPE)
      console.log('[Plugin:Config] Original env config: ', JSON.stringify(this.finalConfig.env.originalConfig))
      console.log('[Plugin:Config] Config overrides: \n', this.finalConfig)
    }

    this.finalConfig = _.merge(config, this.finalConfig)
  }
}

module.exports = Config
