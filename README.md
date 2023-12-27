# API Rate limiter


This project is a simple implementation of an API rate limiter built with Node and keep the state of incoming requests to an external store ( redis ). The goal is to control the rate at which users requests are processed by the apis.  This implementation can easily be used as a middleware in an API GATEWAY. 


## Table of Contents

- [Installation](#installation)
- [How to test](#how-to-test)
- [Design decisions](#design-decisions)
- [Bonus](#bonus)


## Installation

The following script should get you started right away. But with all scripts on the internet you should have a look first [link](https://gist.github.com/dusmel/b92b5ef3ee2d927f5aa9d37b37f3754b)

This assumes that your redis-server is running. if you don't have redis installed ``` brew install redis``` should sort you out.

Requirements: Git, Node and NPM, redis

```bash
 curl -L https://gist.githubusercontent.com/dusmel/b92b5ef3ee2d927f5aa9d37b37f3754b/raw/dddea873a2cff3b1ebd55b99205e9615b16fba49/start-rater-limiter.sh -H "Cache-Control: no-cache, no-store, must-revalidate" | bash
```

**Manual**

```bash
 git clone git@github.com:dusmel/rate-limiter.git 
 cd rate-limiter 
 cp .env.example .env 
 pnpm install 
 redis-server # you can do this in a separate tab
 pnpm dev 
```
And voila 🎉

I use pnpm but you can use npm, yarn or anything really!


## How to test
**Manual**

The main endpoint to test is `GET localhost:4000/api/v1/custom/emails`, if you try without an API KEY it will return an unauthorized response. You can get a mocked API_KEY in the `src/constants/apiKeys.js` file.

These are the default configuration
```js
export const defaultTimeWindowToken = 4;
export const defaultMonthlyToken = 6;
export const defaultSystemToken = 10;
```

The numbers were made small for the sake of easy testing. But feel free to change them inside `src/constants/tokens.js`.

> PS: I will also mention that authentication was entirely mocked given that it is out of scope of this project.

<br />

**Using a very simple frontend to simulate requests [Link](https://github.com/dusmel/rate-limiter-simulator/tree/main)** 



This assumes that the backend is running on 4000.

**Install**
```bash
git clone git@github.com:dusmel/rate-limiter-simulator.git
cd rate-limiter-simulator
pnpm install
pnpm dev
```


https://github.com/dusmel/rate-limiter/assets/27511264/943e17eb-e0dc-4e0a-bbb8-7b6baaa1228d



## Design decisions

**Goals**

1. **The solution aims at improving the API performance by controlling the rate at which client requests are processed by the APIs**: Each client has their timeWindow token, giving an option to have more or less and not bound to a general token for everyone.

2. **The solution should be designed in a way that is easy to scale, or can work for a distributed system**: This led to a decision to have an external store that remembers the state for every request and has a fast lookup, in  a hash like structure ( I used redis for this). and can work for requests coming from different servers or processes. 

3. **The solution should be simple and memory efficient**: For this reason we used the token bucket algorithm, we store the timestamp  and the token remaining for a given time-window of each client. We will only have one record per client and the token associated with it.

<img width="800px" height="auto" src="https://github.com/dusmel/rate-limiter/assets/27511264/9bb036c9-1092-4353-b636-23260bcfac51" alt="rate limiter system design" />



## Bonus

I included two more endpoints:

1. `GET localhost:4000/api/v1/custom-v2/emails` using a simple sliding window implementation
2. `GET localhost:4000/api/v1/third-party/emails` using express-rate-limit package



