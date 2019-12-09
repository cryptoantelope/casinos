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
        const data = '[{"operationName": "Balances", "variables": {"available": true}, "query": "query Balances($available: Boolean = false, $vault: Boolean = false) {user { id balances {available @include(if: $available) { currency amount} vault @include(if: $vault) { currency amount }} }}"}]'
        const res = await this.request(data)

        return res.data[0].data
    }


    async placeBet({coin, amount, target, condition}) {
        const data = `{"query": "mutation { diceRoll(amount: ${amount}, target: ${target}, condition: ${condition}, currency: ${coin}) { id payout amountMultiplier payoutMultiplier createdAt nonce }}"}`
        const res = await this.request(data)

        return res.data.data
    }


    async depositToVault({coin, amount}) {
        const data = `{"query": "mutation { createVaultDeposit( currency: ${coin} amount: ${amount} ) { id }}"}`
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