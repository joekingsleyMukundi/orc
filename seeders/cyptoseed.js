const CryptoTransaction = require("../models/dashmodel/cryptotrans");

async function seedTransactions() {
    const initialBuys = Array.from({ length: 25 }, () => ({
        user: null, // Set user if needed
        cryptoType: ['BTC', 'ETH', 'LTC'][Math.floor(Math.random() * 3)],
        transactionType: 'buy',
        amount: (Math.random() * 0.5).toFixed(4), // Random amount
        price: (Math.random() * 2000 + 1000).toFixed(2), // Random price
    }));

    const initialSells = Array.from({ length: 18 }, () => ({
        user: null, // Set user if needed
        cryptoType: ['BTC', 'ETH', 'LTC'][Math.floor(Math.random() * 3)],
        transactionType: 'sell',
        amount: (Math.random() * 0.5).toFixed(4),
        price: (Math.random() * 2000 + 1000).toFixed(2),
    }));

    await CryptoTransaction.insertMany([...initialBuys, ...initialSells]);
    console.log("Database seeded with initial transactions!");
}

module.exports = seedTransactions