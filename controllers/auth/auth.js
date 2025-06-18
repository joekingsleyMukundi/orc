const crypto = require('crypto');
const User = require('../../models/authmodel/user');
const Dashboard = require('../../models/dashmodel/dash')
const {sendMail} = require('../../utils/mails')
const formatPhoneNumber = require('../../utils/auth/phoneverify');
const Password = require('../../utils/auth/password');
const { logActivity } = require('../../services/activityService');
const { signToken } = require('../../utils/auth/jwt');
exports.registerUser = async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const existingName = await User.findOne({ fullname });
    if (existingName) {
        return res.status(409).json({ error: 'Name already exists.' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        return res.status(409).json({ error: 'Email already exists.' });
    }

    try {
        const newUser = new User({ fullname, email, password });
        await newUser.save();

        if (req.query.invitedby) {
            const upline = await User.findOne({ fullname: req.query.invitedby });
            if (upline) {
                newUser.upline = upline._id;
                await newUser.save();
            }
        }

        const activateUrl = `${req.protocol}://${req.get('host')}/api/auth/activate/${newUser._id}`;
        const message = `Welcome to Mama Rhyndom ${newUser.fullname}. Activate: ${activateUrl}`;
        //await sendMail(newUser.fullname, newUser.email, 'Welcome', message);

        return res.status(201).json({ message: 'Registration successful. Please verify email.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error. Try again later.' });
    }
};
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    // 2. Check user existence
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    // 3. Check password
    const isMatch = await Password.compare(user.password, password);
    if (!isMatch) {
        return res.status(401).json({ error: 'Incorrect password.' });
    }

    // 4. Check verification
    if (!user.verified) {
        return res.status(403).json({ error: 'Account not activated. Please verify email.' });
    }

    // 5. Sign and return JWT
    const token = signToken(user._id);
    return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            phone: user.phone
        }
    });
};

// controllers/authController.js
exports.emailConfirmation = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User does not exist.' });
        }

        if (!user.verified) {
            return res.status(400).json({ error: 'User is not verified.' });
        }

        // Optional: You can return token here if needed
        return res.status(200).json({
            message: 'Email confirmed successfully.',
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                verified: user.verified
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error during email confirmation.' });
    }
};

exports.emailVerification = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (user.verified) {
            return res.status(400).json({ error: 'User already verified.' });
        }

        return res.status(200).json({
            message: 'User exists but not verified.',
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                verified: user.verified
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error verifying email.' });
    }
};
exports.emailVerificationApiController = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    if (user.verified) {
        return res.status(409).json({ error: 'User already activated.' });
    }

    user.verified = true;
    await user.save();

    return res.status(200).json({ message: 'Account activated successfully.' });
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    const message = `Reset your password using this link: ${resetUrl}`;

    try {
        await sendMail(user.fullname, user.email, 'Password Reset', message);
        return res.status(200).json({ message: 'Password reset instructions sent.' });
    } catch (err) {
        console.error(err);
        user.resetPasswordToken = undefined;
        user.resetPassworExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ error: 'Failed to send email.' });
    }
};

exports.resetPassword = async (req, res) => {
    const { resettoken } = req.params;
    const { password, repassword } = req.body;

    if (!password || !repassword || password !== repassword) {
        return res.status(400).json({ error: 'Passwords must match and not be empty.' });
    }

    const hashedToken = crypto.createHash('sha256').update(resettoken).digest('hex');
    const user = await User.findOne({ resetPasswordToken: hashedToken });

    if (!user) {
        return res.status(404).json({ error: 'Invalid or expired reset token.' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPassworExpire = undefined;
    await user.save();

    logActivity(user._id, "Password reset");
    return res.status(200).json({ message: 'Password has been reset successfully.' });
};

