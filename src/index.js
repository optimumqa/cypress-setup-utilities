const PLUGINS = require('./configs/defaultConfig')

console.log('\n')

function optimumqa_plugin(on, config) {
  PLUGINS.forEach((plugin) => {
    if (plugin.enabled) {
      const _plugin = require(`./plugins/${plugin.name}`)
      plugin.instance = new _plugin(on, config, plugin.options)

      config = {
        ...config,
        ...(plugin.instance.finalConfig || {}),
      }
    }
  })

  return config
}

module.exports = optimumqa_plugin
