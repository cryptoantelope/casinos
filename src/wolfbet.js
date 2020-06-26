const axios = require('axios')
const https = require('https')
const zlib = require('zlib')



class Wolfbet {
    /**
     *
     * @param {String}  token
     * @param {Boolean} keepAlive(default: true)
     * @param {Number}  timeout(default: 5000)
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
     * OFFICIAL
     */

    /**
     * Place bet
     * @params  {String} currency, enum "btc", "eth", "ltc", "doge", "trx", "bch", "xrp"
     * @params  {String} [game="dice"]
     * @params  {Number} amount 
     * @params  {Number} bet_value
     * @params  {String} rule, enum "over" or "under"
     * @params  {Number} multiplier
     * @returns {Object} res
     * @returns {Object} res.bet
     * @returns {String} res.bet.hash
     * @returns {Number} res.bet.nonce
     * @returns {String} res.bet.currency
     * @returns {String} res.bet.amount
     * @returns {String} res.bet.profit
     * @returns {String} res.bet.multiplier
     * @returns {String} res.bet.bet_value
     * @returns {String} res.bet.result_value
     * @returns {String} res.bet.state
     * @returns {Number} res.bet.published_at
     * @returns {Object} res.bet.game
     * @returns {Number} res.bet.game.id
     * @returns {String} res.bet.game.name
     * @returns {String} res.bet.game.margin
     * @returns {String} res.bet.game.min_roll
     * @returns {String} res.bet.game.max_roll
     * @returns {Object} res.user_balance
     * @returns {String} res.user_balance.amount
     * @returns {String} res.user_balance.currency
     * 
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
     * Change client seed
     * @param {String} client_seed length 10..64
     * @returns {Object} res
     * @returns {String} res.seed
     */

    async changeClientSeed(client_seed) {
        return await this.request("post", "/user/seed/refresh", {client_seed})
    }



    /**
     * Get user stats race
     * @returns {Object}  res
     * @returns {Object}  res.race
     * @returns {String}  res.race.waggered_btc
     * @returns {String}  res.race.currency
     * @returns {String}  res.race.prize
     * @returns {Number}  res.race.rank
     * @returns {Object}  res.race.user
     * @returns {String}  res.race.user.login
     * @returns {String}  res.race.user.uuid
     * @returns {Boolean} res.race.user.is_admin
     * @returns {Boolean} res.race.user.is_moderator
     * @returns {Boolean} res.race.user.is_high_roller
     * @returns {Number}  res.race.user.is_vip_level
     * @returns {String}  res.race.user.joined
     * @returns {Object}  res.race.user.race_badge
     * @returns {Number}  res.race.user.race_badge.position
     * @returns {String}  res.race.user.race_badge.date
     */

    async getUserStatsRace() {
        return await this.request("get", "/user/stats/race")
    }



    /**
     * Get user stats bets
     * @returns {Object} res
     * @returns {Object} res.dice
     * @returns {Object} res.dice.btc
     * @returns {String} res.dice.btc.total_bets
     * @returns {String} res.dice.btc.win
     * @returns {String} res.dice.btc.lose
     * @returns {String} res.dice.btc.waggered
     * @returns {String} res.dice.btc.waggered_usd
     * @returns {String} res.dice.btc.currency
     * @returns {String} res.dice.btc.profit
     * @returns {Object} res.dice.eth
     * @returns {String} res.dice.eth.total_bets
     * @returns {String} res.dice.eth.win
     * @returns {String} res.dice.eth.lose
     * @returns {String} res.dice.eth.waggered
     * @returns {String} res.dice.eth.waggered_usd
     * @returns {String} res.dice.eth.currency
     * @returns {String} res.dice.eth.profit
     * @returns {Object} res.dice.ltc
     * @returns {String} res.dice.ltc.total_bets
     * @returns {String} res.dice.ltc.win
     * @returns {String} res.dice.ltc.lose
     * @returns {String} res.dice.ltc.waggered
     * @returns {String} res.dice.ltc.waggered_usd
     * @returns {String} res.dice.ltc.currency
     * @returns {String} res.dice.ltc.profit
     * @returns {Object} res.dice.doge
     * @returns {String} res.dice.doge.total_bets
     * @returns {String} res.dice.doge.win
     * @returns {String} res.dice.doge.lose
     * @returns {String} res.dice.doge.waggered
     * @returns {String} res.dice.doge.waggered_usd
     * @returns {String} res.dice.doge.currency
     * @returns {String} res.dice.doge.profit
     * @returns {Object} res.dice.trx
     * @returns {String} res.dice.trx.total_bets
     * @returns {String} res.dice.trx.win
     * @returns {String} res.dice.trx.lose
     * @returns {String} res.dice.trx.waggered
     * @returns {String} res.dice.trx.waggered_usd
     * @returns {String} res.dice.trx.currency
     * @returns {String} res.dice.trx.profit
     * @returns {Object} res.dice.bch
     * @returns {String} res.dice.bch.total_bets
     * @returns {String} res.dice.bch.win
     * @returns {String} res.dice.bch.lose
     * @returns {String} res.dice.bch.waggered
     * @returns {String} res.dice.bch.waggered_usd
     * @returns {String} res.dice.bch.currency
     * @returns {String} res.dice.bch.profit
     * @returns {Object} res.dice.xrp
     * @returns {String} res.dice.xrp.total_bets
     * @returns {String} res.dice.xrp.win
     * @returns {String} res.dice.xrp.lose
     * @returns {String} res.dice.xrp.waggered
     * @returns {String} res.dice.xrp.waggered_usd
     * @returns {String} res.dice.xrp.currency
     * @returns {String} res.dice.xrp.profit
     */

    async getUserStatsBets() {
        return await this.request("get", "/user/stats/bets")
    }



    /**
     * Get user balances
     * @returns {Object} res
     * @returns {Array}  res.balances
     * @returns {String} res.balances.amount
     * @returns {String} res.balances.currency
     * @returns {String} res.balances.withdraw_fee
     * @returns {String} res.balances.withdraw_minimum_amount
     * @returns {Number} res.balances.payment_id_required
     */

    async getUserBalances() {
        return await this.request("get", "/user/balances")
    }



    /**
     * Change server seed
     * @returns {Object} res
     * @returns {String} res.server_seed_hashed
     */

    async changeServerSeed() {
        return await this.request("get", "/game/seed/refresh")
    }


    /**
     * UNOFFICIAL
     */
    
    /**
     * Get user currency balance 
     * @param {String} currency, enum "btc", "eth", "ltc", "doge", "trx", "bch", "xrp"
     */
    async getBalance(currency) {
        const {balances} = await this.getUserBalances()
      
        for(let i=0; i < balances.length; i++) {
          const balance = balances[i]
          
          if(balance.currency === currency) return balance.amount
        }
      
        return null
    }

      
      
    /**
     * Get user profile
     */
    async getUser() {
        return await this.request('get', '/user/profile')
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
