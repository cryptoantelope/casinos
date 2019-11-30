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
                'content-type': 'application/json'
            }
        })
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


    async request(data={}, method='post') {
        const res = await this.client.request({method, data})
        if(res.status !== 200) throw new Error(data.statusText)

        return res
    }
}

module.exports = Stake