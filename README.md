# cypress-setup-utilities

Cypress plugin for use with [cypress-multi-product-template](https://github.com/optimumqa/cypress-multi-product-template).

## Installation

```sh
npm install cypress-setup-utilities
```

## Usage

```js
// ./cypress/plugins/index.js

module.exports = (on, config) => {
  require('@optimumqa/cypress-plugin')(on, config)

  return config
}
```
