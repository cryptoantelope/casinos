const {Primedice, Stake, Wolfbet} = require('../')
const should = require('should')




describe('Wolfbet', () => {
    const wolfbet = new Wolfbet(process.env.WOLFBET_TOKEN)

    describe('Official endPoints', () => {
        it('should place a bet', async () => {
            const {bet} = await wolfbet.placeBet({
                currency: 'doge',
                game: 'dice',
                amount: 0.00000001,
                bet_value: 49.5,
                rule: 'under',
                multiplier: 2
            })
            should.exist(bet)
        })

        it('should change client seed', async () => {
            const {seed} = await wolfbet.changeClientSeed('abcdefghij')
            should.exist(seed)
        })

        it('should return user stat race', async () => {
            const {race} = await wolfbet.getUserStatsRace()
            should.exist(race)
        })

        it('should return user stat bets', async () => {
            const {dice} = await wolfbet.getUserStatsBets()
            should.exist(dice)
        })

        it('should return user balances', async () => {
            const {balances} = await wolfbet.getUserBalances()
            should.exist(balances)
            balances.length.should.be.above(0)
        })

        it('should change server seed', async () => {
            const {server_seed_hashed} = await wolfbet.changeServerSeed()
            should.exist(server_seed_hashed)
        })
    })

    describe('Unofficial endPoints', () => {
        it('should return user profile', async () => {
            const {user} = await wolfbet.getUser()
            should.exist(user)
        })
        
        it('should return user balance', async () => {
            const balance = await wolfbet.getBalance('doge')
            should.exist(balance)
        })
    })



    if(process.env.WOLFBET_PASSWORD && process.env.WOLFBET_CODE) {
        describe('vault', () => {
            it('should be a deposit on vault', async () => {
                const deposit = await wolfbet.depositOnVault({
                    amount: 0.000001,
                    currency: 'doge',
                    password: process.env.WOLFBET_PASSWORD,
                   code: process.env.WOLFBET_CODE
                })
                should.exist(deposit)

                deposit.should.have.property('userBalance')
                deposit.should.have.property('vaultBalance')
            })

            it('should be a withdraw from vault', async () => {
                const deposit = await wolfbet.withdrawFromVault({
                    amount: 0.000001,
                    currency: 'doge',
                    password: process.env.WOLFBET_PASSWORD,
                    code: process.env.WOLFBET_CODE 
                })
                should.exist(deposit)

                deposit.should.have.property('userBalance')
                deposit.should.have.property('vaultBalance')
	        })
        })
    }
})

/*
describe('Stake', () => {
    const stake = new Stake(process.env.STAKE_TOKEN)

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
    const primedice = new Primedice(process.env.PRIMEDICE_TOKEN)

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


*/