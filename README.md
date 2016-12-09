# synchronized [![Build Status](https://travis-ci.org/JsCommunity/synchronized.png?branch=master)](https://travis-ci.org/JsCommunity/synchronized)

> Function decorator which ensures that calls do not run simultaneously.

## Install

Installation of the [npm package](https://npmjs.org/package/synchronized):

```
> npm install --save synchronized
```

## Usage

```js
  let i = 0

  const fn = synchronized(() => {
    console.log(i)
    return Promise.resolve().then(() => {
      i++
    })
  })

  Promise.all([ fn(), fn() ])

  // => Prints 0 then 1
```

## Development

```
# Install dependencies
> npm install

# Run the tests
> npm test

# Continuously compile
> npm run dev

# Continuously run the tests
> npm run dev-test

# Build for production (automatically called by npm install)
> npm run build
```

## Contributions

Contributions are *very* welcomed, either on the documentation or on
the code.

You may:

- report any [issue](https://github.com/JsCommunity/synchronized/issues)
  you've encountered;
- fork and create a pull request.

## License

ISC © [Pierre Donias](https://github.com/pdonias)
