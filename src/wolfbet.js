const axios = require('axios')
const https = require('https')
const zlib = require('zlib')



class Wolfbet {
    /**
     *
     * @param {String} token
     * @param {Boolean} keepAlive(default: true)
     * @param {Number} timeout(default: 5000)
     */
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



    /**
     *
     * @param {String} currency, enum "btc", "eth", "ltc", "doge", "trx", "bch", "xrp"
     */
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



    /**
     *
     * @params {String} currency, enum "btc", "eth", "ltc", "doge", "trx", "bch", "xrp"
     * @params {String} game (default: "dice") 
     * @params {Number} amount 
     * @params {Number} bet_value
     * @params {String} rule, enum "over" or "under"
     * @params {Number} multiplier
     */
    async placeBet({currency, game='dice', amount, bet_value, rule, multiplier}) {
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



    /**
     *
     * @params {Number} amount
     * @params {String} currency, enum "btc", "eth", "ltc", "doge", "trx", "bch", "xrp"
     * @params {String} password
     * @params {String} code two-factor authentication
     */
    async depositOnVault({amount, currency, password, code}) {
        const deposit = {
            amount: amount.toString(),
            currency,
            password,
            code
	}

        return await this.request('post', '/user/vault/deposit', deposit)
    }



    /**
     *
     * @params {Number} amount
     * @params {String} currency, enum "btc", "eth", "ltc", "doge", "trx", "bch", "xrp"
     * @params {String} password
     * @params {String} code two-factor authentication
     */
    async withdrawFromVault({amount, currency, password}) {
       const withdraw = {
           amount,
           currency,
           password,
           code
       }

       return await this.request('post', '/user/vault/withdraw', withdraw)
    }



    /**
     * @params {String} method, enum 'get', 'post'
     * @params {String} url
     * @params {Object} params
     * @params {Object} data (default: null)
     */
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
