const CryptoTransaction = require("../../models/dashmodel/cryptotrans");
const CryptoDash = require("../../models/dashmodel/cryptodashboard");
const axios = require('axios');

async function getCryptoPrices() {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                ids: 'bitcoin,litecoin,ethereum',
                vs_currencies: 'usd'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching crypto prices:', error);
        throw new Error('Failed to retrieve crypto prices');
    }
}

async function buyCrypto(userId, cryptoType, amount, depositBalance) {
    function getCryptoFullName(cryptoType) {
    let cryptoFullName;

    switch (cryptoType) {
        case "BTC":
            cryptoFullName = "bitcoin";
            break;
        case "ETH":
            cryptoFullName = "ethereum";
            break;
        case "LTC":
            cryptoFullName = "litecoin";
            break;
        default:
            cryptoFullName = "Unknown Crypto";
    }

    return cryptoFullName;
}
    return new Promise((resolve, reject) => {
        const delay = Math.floor(Math.random() * (30000 - 1000 + 1)) + 1000; // Random delay between 1 and 30 seconds

        setTimeout(async () => {
            try {
                // Fetch current crypto prices
                 // Current price of the selected cryptocurrency
                const totalCost = amount
                const cryptot = getCryptoFullName(cryptoType)

                // Check if the user has enough deposit balance
                const userWallet = await CryptoDash.findOne({ user: userId });
                if (!userWallet || depositBalance < totalCost) {
                    return reject(new Error('Insufficient deposit balance.'));
                }

                // Deduct the deposit balance and add crypto to the user's wallet
                
                userWallet.balances[cryptot] =Number(userWallet.balances[cryptot]) +Number(amount);
                userWallet.totalBalance = Number(userWallet.totalBalance) + Number(totalCost) ;
                depositBalance -= totalCost;

                // Record the transaction in the buy transactions table
                const buyTransaction = new CryptoTransaction({
                    user: userId,
                    cryptoType,
                    amount,
                    totalAmount: totalCost,
                    transactionType: 'buy',
                    date: new Date(),
                });

                // Save the transaction and wallet update
                await userWallet.save();
                await buyTransaction.save();

                resolve({
                    message: `${amount} ${cryptoType} bought successfully for ${totalCost} KES.`,
                    transaction: buyTransaction,
                    wallet: userWallet,
                    delay: delay,
                    depobal: depositBalance
                });
            } catch (error) {
                reject(error);
            }
        }, delay); // Random delay before fulfilling the buy transaction
    });
}

async function sellCrypto(userId, cryptoType, amount, depositbal) {
    function getCryptoFullName(cryptoType) {
    let cryptoFullName;

    switch (cryptoType) {
        case "BTC":
            cryptoFullName = "bitcoin";
            break;
        case "ETH":
            cryptoFullName = "ethereum";
            break;
        case "LTC":
            cryptoFullName = "litecoin";
            break;
        default:
            cryptoFullName = "Unknown Crypto";
    }

    return cryptoFullName;
}
    return new Promise((resolve, reject) => {
        const delay = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000; // Random delay between 1 and 5 seconds

        setTimeout(async () => {
            try {
                // Fetch current crypto prices
                const totalAmount = amount
                const cryptot = getCryptoFullName(cryptoType)
                // Check if the user has enough crypto to sell
                const userWallet = await CryptoDash.findOne({ user: userId });
                if (!userWallet || userWallet.balances[cryptot] < amount) {
                    return reject(new Error('Insufficient crypto to sell.'));
                }

                // Adjust for site profit logic
                const profitLossPercentage = Math.random() > 0.7 ? 0.1 : -0.1; // 70% chance for loss
                const adjustedAmount = totalAmount * (1 + profitLossPercentage); // Calculate adjusted profit or loss

                // Deduct the crypto from the user's wallet
                userWallet.balances[cryptot] =Number(userWallet.balances[cryptot]) - Number(totalAmount);
                userWallet.totalBalance = Number(userWallet.totalBalance) - Number(totalAmount) ;; // Add adjusted USD to wallet
                depositbal += adjustedAmount; // Add adjusted USD to deposit balance
                // Record the sell transaction
                const sellTransaction = new CryptoTransaction({
                    user: userId,
                    cryptoType,
                    amount,
                    totalAmount: adjustedAmount,
                    transactionType: 'sell',
                    date: new Date(),
                });

                // Save the transaction and wallet update
                await userWallet.save();
                await sellTransaction.save();

                resolve({
                    message: `${amount} ${cryptoType} sold successfully for ${adjustedAmount} KES  your dashboard earning balance has been credited`,
                    transaction: sellTransaction,
                    delay: delay,
                    depositbal: depositbal,
		    amount:adjustedAmount,
                });
            } catch (error) {
                reject(error);
            }
        }, delay); // Random delay before fulfilling the sell transaction
    });
}

module.exports = {
    buyCrypto,
    sellCrypto
};
