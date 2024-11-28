const { redisClient } = require("../config/redis");
const { randomIncrement } = require("../utils/pricer");
const { getSocketInstance } = require("./sockets");
// Update product prices randomly and emit top 4 products
const updateProductPrices = async () => {
  const products = ['whatsappviews', 'loans', 'jobs', 'blogs', 'crypto', 'shares', 'affiliates'];
  const updatedPrices = [];
  // Loop through each product, update its price
  for (const product of products) {
    const key = `product:${product}:price`;
    const currentPrice = parseInt(await redisClient.get(key)) || 100;
    const newPrice = currentPrice + randomIncrement();
    await redisClient.set(key, newPrice);
    updatedPrices.push({ product, price: newPrice });
  }
  // Fetch the top 4 products by price
  const topProducts = await getTopProducts(); // Get the top 4 products
  // Emit only the top 4 products to all users
  const io = getSocketInstance();
  io.emit('priceUpdate', topProducts);
};
// Fetch top 4 products by price
const getTopProducts = async () => {
  const products = ['whatsappviews', 'loans', 'jobs', 'blogs', 'crypto', 'shares', 'affiliates'];

  const productPrices = await Promise.all(
    products.map(async (product) => {
      const price = parseInt(await redisClient.get(`product:${product}:price`)) || 100;
      return { product, price };
    })
  );
  // Sort and get top 4
  const topProducts = productPrices.sort((a, b) => b.price - a.price).slice(0, 4);
  // Ensure that the result contains both name and price
  return topProducts.map(({ product, price }) => ({ name: product, price })); 
};

// Export the functions
module.exports = {
  updateProductPrices,
  getTopProducts,
};