const axios = require('axios')
const https = require('https')



class Primedice {
    constructor(token = null, keepAlive = true) {
        if(!token) throw new Error('Please set token')

        this.token = token


        this.client = axios.create({
            baseURL: 'https://api.primedice.com/graphql',
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
        const data = `{\"operationName\":\"PrimediceRoll\",\"variables\":{\"currency\":\"${currency}\",\"amount\":${amount},\"target\":${target},\"condition\":\"${condition}\"},\"query\":\"mutation PrimediceRoll($amount: Float!, $target: Float!, $condition: CasinoGamePrimediceConditionEnum!, $currency: CurrencyEnum!) {\\n  primediceRoll(amount: $amount, target: $target, condition: $condition, currency: $currency) {\\n    ...CasinoBetFragment\\n    state {\\n      ...PrimediceStateFragment\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment CasinoBetFragment on CasinoBet {\\n  id\\n  active\\n  payoutMultiplier\\n  amountMultiplier\\n  amount\\n  payout\\n  updatedAt\\n  currency\\n  game\\n  user {\\n    id\\n    name\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment PrimediceStateFragment on CasinoGamePrimedice {\\n  result\\n  target\\n  condition\\n  __typename\\n}\\n\"}`
        const res = await this.request(data)

        return res.data.data
    }


    async depositToVault({currency, amount}) {
        const data = `{\"operationName\":\"CreateVaultDeposit\",\"variables\":{\"currency\":\"${currency}\",\"amount\":${amount}},\"query\":\"mutation CreateVaultDeposit($amount: Float!, $currency: CurrencyEnum!) {\\n  createVaultDeposit(amount: $amount, currency: $currency) {\\n    id\\n    amount\\n    currency\\n    user {\\n      id\\n      balances {\\n        available {\\n          amount\\n          currency\\n          __typename\\n        }\\n        vault {\\n          amount\\n          currency\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}`
        const res = await this.request(data)

        return res.data.data
    }


    async request(data={}, method='post') {
        const res = await this.client.request({method, data})
        if(res.status !== 200) throw new Error(data.statusText)

        return res
    }
}

module.exports = Primedice
