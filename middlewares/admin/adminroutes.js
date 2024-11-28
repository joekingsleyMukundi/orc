// Middleware function to check for specific emails
function checkUserEmail(req, res, next) {
    const userEmail = req.session.user.email; // Ensure `req.user` is defined and get the email
    console.log(userEmail !== "joekingsleymukundi@gmail.com")
    // Check if the email matches either of the specified addresses
    if (userEmail !== "joekingsleymukundi@gmail.com") {
        return res.redirect("/dashboard"); // Redirect to the dashboard if email matches
    }

    next(); // Continue to the next middleware or route handler if email doesn't match
}

module.exports = checkUserEmail;