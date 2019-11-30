const {Stake, Wolfbet} = require('../')
const should = require('should')


const wolfbet = new Wolfbet(process.env.WOLFBET_TOKEN)
const stake = new Stake(process.env.STAKE_TOKEN)


describe('Wolbet', () => {

    describe('user profile', () => {
        it('should return user profile', async () => {
            const {user} = await wolfbet.getUser()
            should.exist(user)
        })
    })

    describe('bet', () => {
        it('should place a bet', async () => {
            const {bet} = await wolfbet.placeBet({
                currency: 'doge',
                amount: 0.00000001,
                bet_value: 49.5,
                rule: 'under',
                multiplier: 2
            })
            should.exist(bet)
        })
    })
})

describe('Stake', () => {

    describe('user profile', () => {
        it('should return user profile', async () => {
            const {user} = await stake.getUser()
            should.exist(user)
        })
    })

    describe('bet', () => {
        it('should place a bet', async () => {
            const {diceRoll} = await stake.placeBet({
                coin: 'doge',
                amount: 0.00000001,
                target: 49.5,
                condition: 'above'
            })
            should.exist(diceRoll)
        })
    })
})