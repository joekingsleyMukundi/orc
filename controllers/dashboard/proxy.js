const Dashboard = require('../../models/dashmodel/dash');
const Loan = require('../../models/dashmodel/loan');
const Proxy = require('../../models/dashmodel/proxy');
const Transaction = require('../../models/finances/transactions');
exports.proxydashboard = async (req,res, next)=>{
    const user = req.session.user;
    const dashboard = await Dashboard.findOne({user:user._id});
    const myproxies = await Proxy.find({user:user._id})
    const activeProxies = await Proxy.find({
            userId: user._id,
            status: 'Approved',
            expires: { $gte: new Date() } // Active proxies with expiration date in the future
        });
    const expiredProxies = await Proxy.find({
            userId: user._id,
            status: 'Approved',
            expires: { $lt: new Date() } // Expired proxies with expiration date in the past
        });

    if (req.method == 'POST'){
        const { country, proxyType, duration } = req.body;
        if ( country == ""|| proxyType == "" || duration == "") {
            console.log("jjj")
            req.flash('error', 'All fields are required.');
            return res.redirect('/proxy');
        }
        const userId = user._id; // Assuming req.user contains authenticated user details
        // Set amount based on duration
        let amount;
        switch (duration) {
            case '1':
                amount = 2000;
                break;
            case '3':
                amount = 6000;
                break;
            case '6':
                amount = 12000;
                break;
        }
        console.log(amount)
        // Create a new proxy request
        const proxyRequest = new Proxy({
            userId,
            country,
            proxyType,
            duration,
            amount
        });
        console.log(proxyRequest);

        await proxyRequest.save();
        req.flash('success', 'Proxy request success.');
        return res.redirect('/proxy')
    }
    res.render("proxy",{
        successmessage:req.flash('success'),
        errormessage:req.flash('error'),
        user,
        dashboard,
        myproxies,
        activeProxies,
        expiredProxies
    });
}// Assuming a user model exists

// Controller to handle proxy purchase requests

// Controller for admin to view all pending requests
exports.getPendingProxies = async (req, res) => {
    try {
        const pendingProxies = await Proxy.find({ status: 'Pending' })
        res.render('pendingProxies', { proxies: pendingProxies });
    } catch (error) {
        res.status(500).send('Error fetching proxy requests.');
    }
};

// Controller for admin to approve or reject a proxy request
exports.updateProxyStatus = async (req, res) => {
    try {
        const { proxyId, status, ip, network } = req.body;

        // Update proxy details and status
        const proxyRequest = await Proxy.findById(proxyId);
        if (!proxyRequest) return res.status(404).send('Proxy request not found.');

        proxyRequest.status = status;
        proxyRequest.ip = ip || proxyRequest.ip;
        proxyRequest.network = network || proxyRequest.network;

        // Set expiration date based on duration
        if (status === 'Approved') {
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + proxyRequest.duration);
            proxyRequest.expires = expiryDate;
        }

        await proxyRequest.save();
        res.status(200).send('Proxy status updated successfully.');
    } catch (error) {
        res.status(500).send('Error updating proxy status.');
    }
};
