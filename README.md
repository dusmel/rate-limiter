# API Rate limiter


This project is a simple implementation of an API rate limiter built with Node and keep the state of incoming requests to an external store ( redis ). The goal is to control the rate at which users requests are processed by the apis.  This implementation can easily be used as a middleware in an API GATEWAY. 


## Table of Contents

- [Installation](#installation)
- [Design decisions](#design-decision)
- [How to test](#usage)
- [API Rate Limiter](#api-rate-limiter)
- [Contributing](#contributing)
- [License](#license)

## Installation

The following script should get you started right away. But with all scripts on the internet you should have a look first [link]()

Requirements: Git, Node and NPM, redis

```bash
```

**Manual**


```bash
git clone https://github.com/ollm/OpenComic.git
cd rate-limiter
pnpm install
redis-server
npm run dev
```

I use pnpm but you can use npm, yarn or anything really!

**Build from docker hub**



## How to test
**Manual**

The main endpoint to test is `GET localhost:4000/api/v1/custom/emails`, if you try without an API KEY it will return an unauthorized response. You can get a mocked API_KEY the `src/constants/apiKeys.js` file.

These are the default configuration
```js
export const defaultTimeWindowToken = 4;
export const defaultMonthlyToken = 6;
export const defaultSystemToken = 10;
```

The numbers were made small for the sake of easy testing. But feel free to change them inside `src/constants/tokens.js`.

>> PS: I will also mention that authentication was entirely mocked given that it is out of scope of this project. 



**Using a very simple frontend to simulate requests**







## API Rate Limiter

A section dedicated to explaining the API rate limiter feature of your project.

## Contributing

Guidelines on how to contribute to your project and how others can get involved.

## License

This project is licensed under the [MIT License](LICENSE).
