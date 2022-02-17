# Casinos

![Twitter Follow](https://img.shields.io/twitter/follow/cryptoantelope?style=social)
## Primedice

```javascript
const { Primedice } = require('casinos')

let primedice = new Primedice('token')
await primedice.getUser()
await primedice.placeBet({
                currency: 'doge',
                amount: 0.00000001,
                target: 49.5,
                condition: 'above'
            })
await primedice.depositToVault({
                coin: 'doge',
                amount: 0.00000001 
            })
```

## Wolfbet

```javascript
const { Wolfbet } = require('casinos')

let wolfbet = new Wolfbet('token')
await wolfbet.getUser()
await wolfbet.placeBet({
                currency: 'doge',
                amount: 0.00000001,
                bet_value: 49.5,
                rule: 'under',
                multiplier: 2
            })
await wolfbet.getBalances()
await wolfbet.getBalance('doge')
```

## Stake

```javascript
const { Stake } = require('casinos')

let stake = new Stake('token')
await stake.getUser()
await stake.placeBet({
                currency: 'doge',
                amount: 0.00000001,
                target: 49.5,
                condition: 'above'
            })
await stake.depositToVault({
                coin: 'doge',
                amount: 0.00000001 
            })
```


Buy me a coffee
------

```
 btc: 1Kz3qnYyejUUQYM6z6WqJdSLRnuFFn4sQ6
doge: DSXYTGtzi31b2MeLn8y5RgcD4fiN5x9xsM
 eth: 0xB47adEe31A396B38876DdDdb30976c510283d94a
 bch: qps4cddu4cw9am0e8mtsw5xmrxx6pfyu9cfpm6chgg
```

Support with tips
------
```
stake: cryptoantelope
primedice: cryptoantelope
wolf.bet: cryptoantelope
```
