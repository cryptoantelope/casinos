const axios = require('axios')
const https = require('https')
const zlib = require('zlib')



class Wolfbet {
    constructor(token = null, keepAlive = true, timeout = 5000) {
        if(!token) throw new Error('Please set token')

        this.token = `Bearer ${token}`

        this.client = axios.create({
            baseURL: 'https://wolf.bet/api/v1',
            httpsAgent: new https.Agent({ keepAlive }),
            responseType: 'arraybuffer',
            headers: {
                authorization: this.token,
                timeout,
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




    async placeBet({currency, game, amount, bet_value, rule, multiplier}) {
        const bet = {
            currency,
            game,
            amount: amount.toString(),
            bet_value: bet_value.toString(),
            rule,
            multiplier: multiplier.toString(),
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




    async request(method, url, params = {}, data=null) {
        const request = {
            method,
            url,
            params
            }

        if(data) request.data = data

        try {
            const res = await this.client.request(request)
            const decompressed = zlib.brotliDecompressSync(res.data)
            const resData = JSON.parse(decompressed.toString())

            return resData
        } catch(err) {
            throw new Error(err)
        }
    }
}

module.exports = Wolfbet
