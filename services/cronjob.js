const cron = require('node-cron');
const { updateProductPrices } = require('./productService');
const { redisClient } = require('../config/redis');
const { fetchAndStoreProducts } = require('./whatsappproductservice');
// Update prices every 1-4 minutes randomly
cron.schedule('*/1-4 * * * *', async () => {
  await updateProductPrices();  // Broadcast live to users
});

// Reset data at midnight (Kenyan Time)
cron.schedule('0 0 * * *', async () => {
  console.log('Resetting data at midnight...');
  const products = ['whatsappviews', 'loans', 'jobs', 'blogs', 'crypto', 'shares', 'affiliates'];
  for (const product of products) {
    await redisClient.set(`name:${product},price:`, 0);  // Reset to base price
  }
});

cron.schedule('0 0 * * *', () => {
  console.log('Fetching new products and updating Redis...');
  fetchAndStoreProducts();
}, {
  timezone: "Africa/Nairobi"
});