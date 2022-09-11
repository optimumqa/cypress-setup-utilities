<h1 align="center">Welcome to cypress-setup-utilities 👋 </h1>
<a href="https://github.com/optimumqa/cypress-setup-utilities/blob/main/LICENSE">
  <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-yellow.svg" target="_blank" />
</a>
<a href="">
  <img alt="Cypress" src="https://img.shields.io/badge/-cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e" target="_blank" />
</a>
<a href="">
  <img alt="Javascript" src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" target="_blank" />
</a>

Cypress plugin for use with [cypress-multi-product-template](https://github.com/optimumqa/cypress-multi-product-template).

Read more about the boilerplate project [here](https://github.com/optimumqa/cypress-multi-product-template/blob/main/README.md)

### Installation

```sh
npm install cypress-setup-utilities
```

## Usage

```js
// ./cypress/plugins/index.js

module.exports = (on, config) => {
  config = require('@optimumqa/cypress-setup-utilities')(on, config)

  return config
}
```

## What's inside?

### Stores

Enables you to create stores while running your spec files.

Can be useful if you need to save a token inside one spec, and re-use it inside another.

You can have infinite stores.

Example of setting a new item into 'CommonStore'.

> If the store does not exist, it will be created:

```js
cy.task('setItem', {
  storeId: 'CommonStore',
  item: {
    name: 'token',
    value: 'foo',
  },
})
```

Example of getting an item from a store:

```js
cy.task('getItem', {
  storeId: 'CommonStore',
  item: {
    name: 'token',
  },
}).then((item) => {
  console.log(item)
})
```

### Config

This part takes your environment variables passed in CLI, and saves them to your config.

This particular project looks for following arguments: `[product, team, env, type]`

| name      | type     | default   |
| --------- | -------- | --------- |
| `product` | `String` | undefined |
| `team`    | `String` | undefined |
| `env`     | `String` | `staging` |
| `type`    | `String` | `default` |

> `team` and `type` can be excluded

You can access these arguments from the config using

```js
Cypress.env('PRODUCT')
Cypress.env('TEAM')
Cypress.env('ENV')
Cypress.env('TYPE')

// Or get the original config from CLI(where some values are not set to default)
Cypress.env('originalConfig')
```

#### testFiles

Test files are set depending on the `team` and `product` arguments.

`testFiles` inside the config will be populated with all spec files from `./cypress/integration/team/product/**/*`.

> This will only happen if you have not specified `testFiles` already.

So when you run

```sh
$ cypress run --env product=yourProductName
```

It will give you only the spec files from `./cypress/integration/yourProductname/`.

#### Local config

If you have a local config, `cypress.local.json` inside of `./cypress/configs` it will be merged with the default config.

#### Type based configs

If you have the need to specify different config types for any reason. You can do that by creating them inside `./cypress/configs/your-product-name/`.

For example:

- Create `daily.json` where we have the need to specify only 3 spec files

```json
{
  "testFiles": ["**/your-product-name/spec1.ts", "**/your-product-name/spec2.ts", "**/your-product-name/spec3.ts"]
}
```

Then you create a command in package.json inside `scripts`:

```json
{
  "scripts": {
    "yourProductName-staging-daily": "cypress run --env product=yourProductName,env=staging,type=daily"
  }
}
```

To sum up, both `cypress.local.json` and `./cypress/configs/your-product-name/daily.json` will be merged into the global `./cypress.json` in that order.

#### baseUrl

By default, in the [parent boilerplate](https://github.com/optimumqa/cypress-multi-product-template), three environments are created: [staging, release, production] inside the `./cypress/fixtures/yourProductName/` populated with the `baseUrl` per environment.

When you run cypress, this plugin will take the baseUrl of the current product and environment, and set it to the final cypress config if you have the need to get the `baseUrl` from there, and not from the fixtures `routes.json` file.

Therefor, you can have multiple products inside the [parent boilerplate](https://github.com/optimumqa/cypress-multi-product-template), as this plugin sets up your config depending on the parameters you've given it.

Keeps the package.json clutter free and gives it intuitive commands to run.

### Delete passed video

Deletes videos from passed test cases.

## Summary

- Project is dynamically set up based on the four arguments above
- If you specify `baseUrl` or `testFiles` in configs, they will not be overwritten.

## 🤝 Contributing

Contributions, issues and feature requests are welcome.<br />
Feel free to check [issues page](https://github.com/optimumqa/cypress-setup-utilities/issues) if you want to contribute.<br />

## Show your support

Please ⭐️ this repository if this project helped you!

## 📝 License

This project is [MIT](https://github.com/optimumqa/cypress-setup-utilities/blob/main/LICENSE) licensed.
