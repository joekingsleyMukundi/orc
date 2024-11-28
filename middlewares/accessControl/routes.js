const Dashboard = require("../../models/dashmodel/dash");

// Define access rules based on package type
const accessRules = {
    None: ["/blogs_dashboard","/loans","/crypto_dashboard", "/jobs_dashboard", "/shares","/forex", "/proxy", "/games"], // Redirect to /packages
    Basic: ["/crypto_dashboard", "/jobs_dashboard", "/shares","/forex", "/proxy", "/games"],
    Platnum: ["/crypto_dashboard", "/jobs_dashboard", "/shares","/forex", "/proxy"],
    Premium_ads: [ "/forex", "/shares","/games"],
    Premium: [] // Full access
};

// Middleware to check access control based on user package
async function accessControlMiddleware(req, res, next) {
    const user = req.session.user; // Assuming user's package is stored in req.user.package
    const dashboard = await Dashboard.findOne({user:user._id});
    // Redirect to /packages if user has the 'None' package
    const userPackage = dashboard.package;

    // Get restricted routes for the user's package
    const restrictedRoutes = accessRules[userPackage] || [];

    // Check if the requested route is restricted for this package
    if (restrictedRoutes.includes(req.path)) {
        req.flash('error', 'Upgrade package.');
        return res.redirect('/dashboard');
    }

    // Proceed to the next middleware or route handler if access is allowed
    next();
}

module.exports = accessControlMiddleware;
