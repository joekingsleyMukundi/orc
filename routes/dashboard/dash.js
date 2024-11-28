const express = require('express');
const { dashboard } = require('../../controllers/dashboard/dash');
const { whatsappdashboard, whatsappuploads, uploadproduct } = require('../../controllers/dashboard/whatsappdash.js');
const { jobdashboard, addJob, buyAccount, completePurchase } = require('../../controllers/dashboard/jobsdash.js');
const { cryptodashboard } = require('../../controllers/dashboard/cryptodash.js');
const { blogdashboard, createBlog, blogwritter } = require('../../controllers/dashboard/blogsdash.js');
const RequireAuth = require('../../middlewares/auth/auth.js');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const JobAccounts = require('../../models/dashmodel/jobsaccounts.js');
const { loandashboard, requestLoan } = require('../../controllers/dashboard/loans.js');
const { affiliate, downlineDashboard, deleteDownline } = require('../../controllers/dashboard/affiliates.js');
const { proxydashboard } = require('../../controllers/dashboard/proxy.js');
const { packages } = require('../../controllers/dashboard/packages.js');
const accessControlMiddleware = require('../../middlewares/accessControl/routes.js');
const checkUserEmail = require('../../middlewares/admin/adminroutes.js');
const { adminJobdashboard } = require('../../controllers/admin/jobs.js');
const { wallet, mpesapayment, withdraw, callback } = require('../../controllers/payments/wallet.js');
const { cashback } = require('../../controllers/dashboard/cashback.js');
const accessToken = require('../../middlewares/accessToken.js');
const { games, gamesupdate } = require('../../controllers/dashboard/game.js');
const { addons } = require('../../controllers/dashboard/addons.js');
const { shares } = require('../../controllers/dashboard/shares.js');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Set the directory for storing files
    },
    filename: (req, file, cb) => {
        const originalName = file.originalname;
        cb(null, originalName); // Use the original filename
    },
});
const upload = multer({ storage: storage });

router.get('/dashboard', RequireAuth, accessControlMiddleware, dashboard);
router.get('/whatsApp_dashboard', RequireAuth, accessControlMiddleware, whatsappdashboard);
router.post('/whatsAppViews/:id',accessControlMiddleware,upload.single('file'), whatsappuploads)
router.get('/jobs_dashboard', RequireAuth,accessControlMiddleware, jobdashboard);
router.post('/jobs/add', RequireAuth,accessControlMiddleware, addJob);
router.get('/jobs/buy/:id', RequireAuth,accessControlMiddleware, buyAccount);
router.get('/jobs/delete/:id', RequireAuth,accessControlMiddleware, async (req, res) => {
    try {
        await JobAccounts.findByIdAndDelete(req.params.id);
        res.redirect('/jobs_dashboard'); // Redirect back to the jobs page after deletion
    } catch (error) {
        req.flash('error', 'Server error occurred while adding job.');
        res.redirect('/jobs_dashboard');
    }
});
router.get('/crypto_dashboard', RequireAuth,accessControlMiddleware, cryptodashboard);
router.post('/crypto_dashboard', RequireAuth,accessControlMiddleware, cryptodashboard);
router.get('/blogs_dashboard', RequireAuth,accessControlMiddleware, blogdashboard);
router.get('/create/blog', RequireAuth,accessControlMiddleware, blogwritter);
router.post('/blogs/create',RequireAuth,accessControlMiddleware, createBlog);
router.get('/loans',RequireAuth,accessControlMiddleware, loandashboard)
router.post('/request/loan', RequireAuth,accessControlMiddleware, requestLoan);
router.get('/downlines', RequireAuth,accessControlMiddleware, affiliate)
router.get('/dashboard/user/:id', RequireAuth,accessControlMiddleware, downlineDashboard)
router.get('/dashboard/user/delete/:id', RequireAuth,accessControlMiddleware, deleteDownline)
router.get('/proxy',RequireAuth,accessControlMiddleware, proxydashboard)
router.post('/request/proxy',RequireAuth,accessControlMiddleware, proxydashboard)
router.get('/jobs/proccess/:id',RequireAuth,accessControlMiddleware,completePurchase )
router.get('/packages', RequireAuth, packages)
router.get('/admin/view/jobs', RequireAuth, checkUserEmail, adminJobdashboard)
router.get('/wallet',RequireAuth,wallet)
router.get('/cashback',RequireAuth,cashback)
router.get('/payment/package', RequireAuth, accessToken,mpesapayment)
router.get('/games',RequireAuth,accessControlMiddleware,games)
router.post('/games/update',RequireAuth,gamesupdate)
router.get('/addons', RequireAuth, addons)
router.post('/withdraw', RequireAuth, withdraw)
router.post('/callback/:id', callback)
router.get('/shares', RequireAuth,accessControlMiddleware, shares)
router.post('/productreview',RequireAuth,upload.single('file'),uploadproduct)
module.exports = router;
