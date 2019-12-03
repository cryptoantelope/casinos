const axios = require('axios')
const https = require('https')
const zlib = require('zlib')



class Wolfbet {
    constructor(token = null, keepAlive = true) {
        if(!token) throw new Error('Please set token')

        this.token = `Bearer ${token}`

        this.client = axios.create({
            baseURL: 'https://wolf.bet/api/v1',
            httpsAgent: new https.Agent({ keepAlive }),
            responseType: 'arraybuffer',
            headers: {
                authorization: this.token,
                'accept-encoding': 'gzip, deflate, br',
                timeout: 5*1000
            }
        })
    }


    async getBalance(currency) {
        const balances = await this.getBalances()
      
        for(let i=0; i < balances.length; i++) {
          const balance = balances[i]
          
          if(balance.currency === currency) return balance.amount
        }
      
        return null
    }

      
    async getBalances() {
        const {user} = await this.getUser()
        return user.balances
    }


      

    async getUser() {
        return await this.request('get', '/user/profile')
    }


    async placeBet({currency, amount, bet_value, rule, multiplier}) {
        const bet = {
            amount: amount.toString(),
            auto: 0,
            bet_value: bet_value.toString(),
            currency,
            game: "dice",
            multiplier: multiplier.toString(),
            rule
        }

        return await this.request('post', '/bet/place', bet)
    }


    async request(method, url, params = {}) {
        const res = await this.client.request({method, url, params})
        if(res.status !== 200) throw new Error(data.statusText)

        const decompressed = zlib.brotliDecompressSync(res.data)
        const data = JSON.parse(decompressed.toString())

        return data
    }
}

module.exports = Wolfbet