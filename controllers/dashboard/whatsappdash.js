const multer = require('multer');
const path = require('path');
const fs = require('fs');
const tesseract = require("tesseract.js");
const Dashboard = require("../../models/dashmodel/dash");
const WhatsAppDashboard = require("../../models/dashmodel/whatsappdashboard");
const { checkAndFetchProducts } = require("../../services/whatsappproductservice");
const WhatsAppViews = require('../../models/dashmodel/whatsappviews');
const ProductReviews = require('../../models/dashmodel/producrreview');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Save the file with a unique name
    }
});


exports.whatsappdashboard = async (req, res, next)=>{
    const user = req.session.user;
    const dashboard = await Dashboard.findOne({user:user._id});
    const whatsappdash = await WhatsAppDashboard.findOne({user:user._id})
    const totalprods = await WhatsAppViews.find();
    const realp = await ProductReviews.find();
    res.render('dashboard-whatsapp',{
        successmessage:req.flash('success'),
        errormessage:req.flash('error'),
        user,
        dashboard,
        whatsappdash,
        totalprods:realp,
	realp
    })
}

exports.uploadproduct = async (req, res, next) => {
    const user = req.session.user;
    try {
        const filePath = req.file;
        console.log("mimi mutu"+filePath)
        let existingUpload = await ProductReviews.find();
        if (existingUpload.length > 0) {
            existingUpload[0].filePath = filePath.path;
            await existingUpload[0].save();
            req.flash('success', 'Upload updated successfully');
        } else {
            const newProduct = new ProductReviews({
                filePath:filePath.path,
            });
            await newProduct.save();
            req.flash('success', 'Upload successful');
        }
        res.redirect("/whatsApp_dashboard");
    } catch (error) {
        console.error(error);
        req.flash('error', 'Something went wrong, please try again');
        res.redirect("/whatsApp_dashboard");
    }
};

exports.whatsappuploads = async (req, res, next) => {
    const user = req.session.user;
    const whatsappdash = await WhatsAppDashboard.findOne({user:user._id})
    const dashboard = await Dashboard.findOne({user:user._id});
    try {
        const  productId  = req.params.id;
        const { views } = req.body;
        const filePath = req.file.path;
        console.log("mimi"+productId+"mutu"+filePath)

        if (!views || views <= 0) {
            req.flash('error', 'Invalid number of WhatsApp views.');
            return res.redirect("/whatsApp_dashboard");
        }

        const ocrResult = await tesseract.recognize(filePath, 'eng', {
            logger: m => console.log(m), 
        });
        const detectedViews = extractNumberFromOCR(ocrResult.data.text);
        console.log('Detected Views from Screenshot:', detectedViews);

        let existingUpload = await WhatsAppViews.findOne({ user: user._id, productId });
        const packageMultiplier = 100;
        const revenue = views * packageMultiplier;

        if (existingUpload) {
            existingUpload.views = views;
            existingUpload.revenue = revenue;
            existingUpload.filePath = filePath;
            await existingUpload.save();
            req.flash('success', 'Upload updated successfully');
        } else {
            const newProductView = new WhatsAppViews({
                user: user._id,
                productId,
                filePath,
                views,
                revenue
            });
            await newProductView.save();
            req.flash('success', 'Upload successful');
        }
        dashboard.earningBalance = dashboard.earningBalance + revenue;
        dashboard.appEarnings = dashboard.appEarnings + revenue;
        dashboard.monthlyRevenue = dashboard.monthlyRevenue + revenue;
        await dashboard.save();
        whatsappdash.activeBalance = whatsappdash.activeBalance + revenue;
        whatsappdash.revenue =  whatsappdash.revenue + revenue;
        whatsappdash.totalViewCount = whatsappdash.totalViewCount +Number(views);
        await whatsappdash.save()
        res.redirect("/whatsApp_dashboard");
    } catch (error) {
        console.error(error);
        req.flash('error', 'Something went wrong, please try again');
        res.redirect("/whatsApp_dashboard");
    }
};


function extractNumberFromOCR(text) {
    const numberPattern = /\d+/g;
    const match = text.match(numberPattern);
    
    if (match) {
        return parseInt(match[0], 10); 
    }
    return null; 
}
