const CryptoDash = require("../../models/dashmodel/cryptodashboard");
const CryptoTransaction = require("../../models/dashmodel/cryptotrans");
const Dashboard = require("../../models/dashmodel/dash");

const axios = require('axios');
const { buyCrypto, sellCrypto } = require("./cryptologic");

// Function to get current prices for Bitcoin, Litecoin, and Ethereum
async function getCryptoPrices() {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                ids: 'bitcoin,litecoin,ethereum',
                vs_currencies: 'usd',
                include_24hr_change: 'true'  // Include 24-hour change percentage
            }
        });

        const prices = response.data;

        return {
            bitcoin: {
                price: prices.bitcoin.usd,
                changePercent: prices.bitcoin.usd_24h_change.toFixed(2), // Percentage change
                changeAmount: (prices.bitcoin.usd * prices.bitcoin.usd_24h_change / 100).toFixed(4) // Absolute change
            },
            litecoin: {
                price: prices.litecoin.usd,
                changePercent: prices.litecoin.usd_24h_change.toFixed(2),
                changeAmount: (prices.litecoin.usd * prices.litecoin.usd_24h_change / 100).toFixed(4)
            },
            ethereum: {
                price: prices.ethereum.usd,
                changePercent: prices.ethereum.usd_24h_change.toFixed(2),
                changeAmount: (prices.ethereum.usd * prices.ethereum.usd_24h_change / 100).toFixed(4)
            }
        };
    } catch (error) {
        console.error('Error fetching crypto prices:', error);
        throw new Error('Failed to retrieve crypto prices');
    }
}


// Adding the crypto prices to the dashboard data
exports.cryptodashboard = async (req, res, next) => {
    try {
        const user = req.session.user;
        const dashboard = await Dashboard.findOne({ user: user._id });

        // Fetch crypto prices
        const cryptoPrices = await getCryptoPrices();
        const wallet = await CryptoDash.findOne({ user: user._id });
        if (!wallet) {
            throw new Error('Wallet not found');
        }
        const allTransactions = await CryptoTransaction.find().sort({ date: -1 });
        const buyTransactions = allTransactions.filter(tx => tx.transactionType === 'buy');
        const sellTransactions = allTransactions.filter(tx => tx.transactionType === 'sell');
        if (req.method == 'POST'){
            const transactionType = req.query.type; // 'Buy' or 'Sell'
            if (transactionType == "Buy"){
                const {amount, cryptotype, } = req.body;
                if (amount < 500){
                    req.flash('error', 'All trades must be above KES 500')
                    return res.redirect('/crypto_dashboard');
                }
                if (amount == "" || cryptotype == ""){
                    req.flash('error', 'All fields are required.');
                    return res.redirect('/crypto_dashboard');
                }
                if (amount < 500){
                    req.flash('error', 'Trades start from 500 KES.');
                    return res.redirect('/crypto_dashboard');
                }
                const  buydata= await buyCrypto(user._id,cryptotype,amount, dashboard.depositeBalance,)
                console.log(buydata);
                dashboard.depositeBalance = buydata.depobal
                req.flash('success', buydata.message)
                await dashboard.save()
                res.redirect('/crypto_dashboard')
                return
            }
            if (transactionType == "Sell"){
                const {amount, cryptotype, } = req.body;
                if (amount == "" || cryptotype == ""){
                    req.flash('error', 'All fields are required.');
                    return res.redirect('/blogs_dashboard');
                }
                const  selldata= await sellCrypto(user._id,cryptotype,amount, dashboard.depositeBalance,)
                console.log(selldata);
                 dashboard.earningBalance += selldata.amount
		dashboard.appEarnings += selldata.amount
                req.flash('success', selldata.message);
                await dashboard.save()
                res.redirect('/crypto_dashboard')
                return
            }

        }
        res.render('dashboard-crypto', {
            successmessage:req.flash('success'),
            errormessage:req.flash('error'),
            user,
            dashboard,
            cryptoPrices,
            wallet,
            allTransactions,
            buyTransactions,
            sellTransactions, 
        });
    } catch (error) {
        next(error);
    }
};
