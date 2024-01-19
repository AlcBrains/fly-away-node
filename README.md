## Intro

Node version of fly-away electron app. 

## Setup
Recommend using node 14. Other versions aren't compatible with node-sass included in this repo.
Before running in guns blazing, ensure you have a valid ssh keypair associated with a github account, otherwise npm ci will fail while trying to do a git ls remote 

`npm ci`
`npm run globalnpms pm2`

`npm run build:all`
`npm run server:nonstop`


#### Code changes watch

To watch changes run
`npm run watch:all`
and in a separate tab run 
`npm run server`
