const {Primedice, Stake, Wolfbet} = require('../')
const should = require('should')


const primedice = new Primedice(process.env.PRIMEDICE_TOKEN)
const stake = new Stake(process.env.STAKE_TOKEN)
const wolfbet = new Wolfbet(process.env.WOLFBET_TOKEN, process.env.WOLFBET_COOKIE)


describe('Wolfbet', () => {

    describe('user profile', () => {
        it('should return user profile', async () => {
            const {user} = await wolfbet.getUser()
            should.exist(user)
        })
        it('should return user balances', async () => {
            const balances = await wolfbet.getBalances()
            should.exist(balances)
            balances.length.should.be.above(0)
        })
        it('should return user balance', async () => {
            const balance = await wolfbet.getBalance('doge')
            should.exist(balance)
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
        it('should return user balances', async () => {
            const balances = await stake.getBalances()
            should.exist(balances)
            balances.length.should.be.above(0)
        })
        it('should return user balance', async () => {
            const balance = await stake.getBalance('doge')
            should.exist(balance)
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

    describe('vault', () => {
        it('should deposit into vault', async () => {
            const {createVaultDeposit} = await stake.depositToVault({
                coin: 'doge',
                amount: 0.00000001 
            })
            should.exist(createVaultDeposit)
        })
    })
})


describe('Primedice', () => {

    describe('user profile', () => {
        it('should return user profile', async () => {
            const {user} = await primedice.getUser()
            should.exist(user)
        })
        it('should return user balances', async () => {
            const balances = await primedice.getBalances()
            should.exist(balances)
            balances.length.should.be.above(0)
        })
        it('should return user balance', async () => {
            const balance = await primedice.getBalance('doge')
            should.exist(balance)
        })
    })

    describe('bet', () => {
        it('should place a bet', async () => {
            const {primediceRoll} = await primedice.placeBet({
                coin: 'doge',
                amount: 0.00000001,
                target: 49.5,
                condition: 'above'
            })
            should.exist(primediceRoll)
        })
    })
    
    describe('vault', () => {
        it('should deposit into vault', async () => {
            const {createVaultDeposit} = await primedice.depositToVault({
                coin: 'doge',
                amount: 0.00000001 
            })
            should.exist(createVaultDeposit)
        })
    })
})