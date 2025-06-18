const express = require('express');
const { registerUser,loginUser, emailConfirmation, emailVerification, forgotPassword, resetPassword, emailVerificationApiController, logout } = require('../../controllers/auth/auth');
const router = express.Router();

router.get('/auth_signup',registerUser);
router.get('/auth_signin',loginUser);
router.get('/auth_email_verificaion/:email', emailVerification);
router.get('/auth_confirm_email/:id', emailConfirmation);
router.get('/activate/:id', emailVerificationApiController)
router.get('/auth_forgot_password', forgotPassword);
router.get('/auth_reset_password/:resettoken', resetPassword);
//router.get('/logout',logout)
router.post('/auth_signup',registerUser);
router.post('/auth_signin',loginUser);
router.post('/auth_email_verificaion', emailVerification);
router.post('/auth_confirm_email', emailConfirmation);
router.post('/auth_forgot_password', forgotPassword);
router.post('/auth_reset_password/:resettoken', resetPassword);
module.exports = router;