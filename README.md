# Casinos

![Twitter Follow](https://img.shields.io/twitter/follow/cryptoantelope?style=social)
## Wolfbet

```javascript
const { Wolfbet } = require('wolfbet')

let wolfbet = new Wolfbet('token')
await client.getUser()
await client.placeBet({
                currency: 'doge',
                amount: 0.00000001,
                bet_value: 49.5,
                rule: 'under',
                multiplier: 2
            })
let stake = new Wolfbet('token')
```

## Stake

```javascript
const { Stake } = require('wolfbet')

let stake = new Stake('token')
await stake.getUser()
await stake.placeBet({
                coin: 'doge',
                amount: 0.00000001,
                target: 49.5,
                condition: 'above'
            })
```

![dogecoin wallet](https://img.shields.io/badge/doge-DSXYTGtzi31b2MeLn8y5RgcD4fiN5x9xsM-blue)