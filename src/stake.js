const axios = require('axios')
const https = require('https')



class Stake {
    constructor(token = null, keepAlive = true) {
        if(!token) throw new Error('Please set token')

        this.token = token


        this.client = axios.create({
            baseURL: 'https://api.stake.com/graphql',
            httpsAgent: new https.Agent({ keepAlive }),
            headers: {
                'x-access-token': this.token,
                'content-type': 'application/json',
                timeout: 5*1000
            }
        })
    }


    async getBalance(currency) {
        const balances = await this.getBalances()
      
        for(let i=0; i < balances.length; i++) {
            const balance = balances[i].available
            if(balance.currency === currency) return balance.amount
        }
      
        return null
    }

      
    async getBalances() {
        const {user} = await this.getUser()
      
        return user.balances
    }


    async getUser() {
        const data = "{\"operationName\":\"initialUserRequest\",\"variables\":{},\"query\":\"query initialUserRequest {\\n  user {\\n    ...UserAuth\\n    __typename\\n  }\\n}\\n\\nfragment UserAuth on User {\\n  id\\n  name\\n  email\\n  hasPhoneNumberVerified\\n  hasEmailVerified\\n  hasPassword\\n  intercomHash\\n  createdAt\\n  hasTfaEnabled\\n  mixpanelId\\n  hasOauth\\n  flags {\\n    flag\\n    __typename\\n  }\\n  roles {\\n    name\\n    __typename\\n  }\\n  balances {\\n    ...UserBalanceFragment\\n    __typename\\n  }\\n  activeClientSeed {\\n    id\\n    seed\\n    __typename\\n  }\\n  previousServerSeed {\\n    id\\n    seed\\n    __typename\\n  }\\n  activeServerSeed {\\n    id\\n    seedHash\\n    nextSeedHash\\n    nonce\\n    blocked\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment UserBalanceFragment on UserBalance {\\n  available {\\n    amount\\n    currency\\n    __typename\\n  }\\n  vault {\\n    amount\\n    currency\\n    __typename\\n  }\\n  __typename\\n}\\n\"}"
        const res = await this.request(data)

        return res.data.data
    }


    async placeBet({currency, amount, target, condition}) {
        const data = `{\"operationName\":\"DiceRoll\",\"variables\":{\"target\":${target},\"condition\":\"${condition}\",\"identifier\":\"46ceebaf815bf3a8b6b5\",\"amount\":${amount},\"currency\":\"${currency}\"},\"query\":\"mutation DiceRoll($amount: Float!, $target: Float!, $condition: CasinoGameDiceConditionEnum!, $currency: CurrencyEnum!, $identifier: String!) {\\n  diceRoll(amount: $amount, target: $target, condition: $condition, currency: $currency, identifier: $identifier) {\\n    ...CasinoBetFragment\\n    state {\\n      ...DiceStateFragment\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment CasinoBetFragment on CasinoBet {\\n  id\\n  active\\n  payoutMultiplier\\n  amountMultiplier\\n  amount\\n  payout\\n  updatedAt\\n  currency\\n  game\\n  user {\\n    id\\n    name\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment DiceStateFragment on CasinoGameDice {\\n  result\\n  target\\n  condition\\n  __typename\\n}\\n\"}`
        const res = await this.request(data)

        return res.data.data
    }


    async depositToVault({currency, amount}) {
        const data = `{\"operationName\":\"CreateVaultDeposit\",\"variables\":{\"currency\":\"${currency}\",\"amount\":${amount}},\"query\":\"mutation CreateVaultDeposit($amount: Float!, $currency: CurrencyEnum!) {\\n  createVaultDeposit(amount: $amount, currency: $currency) {\\n    id\\n    amount\\n    currency\\n    user {\\n      id\\n      balances {\\n        available {\\n          amount\\n          currency\\n          __typename\\n        }\\n        vault {\\n          amount\\n          currency\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}`
        const res = await this.request(data)

        return res.data.data
    }


    async request(data={}, method='post') {
        try {
            const res = await this.client.request({method, data})

            return res
        } catch(err) {
            if(err.response) throw new Error(err.response.data)
            throw new Error(err)

        }

    }
}

module.exports = Stake
