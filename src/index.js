const pluginName = '[@optimumqa/cypress-plugin]:'

console.log('\n')

const DEFAULT_CONFIG = {
  DeletePassedVideo: {
    enabled: true,
    options: {},
    instance: null,
  },
  Store: {
    enabled: true,
    options: {},
    instance: null,
  },
  Config: {
    enabled: true,
    options: {},
    instance: null,
  },
  URL: {
    enabled: true,
    options: {},
    instance: null,
  },
}

const pluginsOrder = [
  'DeletePassedVideo', //
  'Store',
  'Config',
  'URL',
]

function optimumqa_plugin(on, config, userConfig) {
  const CONFIG = {
    ...(DEFAULT_CONFIG || {}),
    ...(userConfig || {}),
  }

  pluginsOrder.forEach((key) => {
    if (CONFIG[key].enabled) {
      const _plugin = require(`./plugins/${key}`)
      CONFIG[key].instance = new _plugin(on, config, CONFIG[key].options)
      config = CONFIG[key].instance.finalConfig || config
    }
  })

  console.log(`${pluginName} Generated config: \n`, config)
}

module.exports = optimumqa_plugin
