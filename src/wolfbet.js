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
                timeout: 5*1000,
                'accept-encoding': 'gzip, deflate, br',
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.50 Safari/537.36'
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




    async depositOnVault({amount, currency, password, code}) {
        const deposit = {
            amount,
            currency,
            password,
            code
	}

        return await this.request('post', '/user/vault/deposit', deposit)
    }




    async withdrawFromVault({amount, currency, password}) {
       const withdraw = {
           amount,
           currency,
           password,
           code
       }

       return await this.request('post', '/user/vault/withdraw', withdraw)
    }




    async request(method, url, params = {}) {
        try {
            const res = await this.client.request({method, url, params})
            const decompressed = zlib.brotliDecompressSync(res.data)
            const data = JSON.parse(decompressed.toString())

            return data
        } catch(err) {
            if(err.response) throw new Error(err.statusText)
            throw new Error(err)
        }
    }
}

module.exports = Wolfbet
