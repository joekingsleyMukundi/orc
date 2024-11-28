const axios = require('axios');
const { redisClient } = require('../config/redis');
// Unsplash API key
const ACCESS_KEY = 'KnO1cUW4au5VGzXSIAsSvrIK5WiDCoMT0O8GiyotNIk';
// Fetch products from Unsplash
 // Ensure axios is imported
const fetchProducts = async () => {
  try {
    console.log("getting")
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: 'product',
        page: 1,
        per_page: 4,
        orientation: 'landscape',
        client_id: ACCESS_KEY // Replace with your actual Unsplash API access key
      }
    });

    // Check for successful response status
    if (response.status !== 200) {
      console.log("error1")
      throw new Error(`Error: ${response.statusText}`);
    }

    const products = response.data.results.map(photo => ({
      id: photo.id,
      description: photo.description || 'No description available',
      imageUrl: photo.urls.regular,
    }));

    return products;
  } catch (error) {
    console.error('Error fetching products:', error.message);
    return [];
  }
};



// Store products in Redis with expiration till midnight Kenyan time
const storeProductsInRedis = async (products) => {
  const calculateSecondsTillMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // Set to the next midnight (24:00:00)
    return Math.floor((midnight - now) / 1000); // Convert milliseconds to seconds
};

// Calculate expiration time in seconds
const secondsTillMidnight = calculateSecondsTillMidnight();

// Check if `secondsTillMidnight` is positive before setting the key
if (secondsTillMidnight > 0) {
    await redisClient.setEx('whatsappproducts', secondsTillMidnight, JSON.stringify(products));
} else {
    console.error("Calculated expiration time is invalid.");
}
};
const checkAndFetchProducts = async () => {
  console.log("heeeeeyyyyy")
  const products = await getProductsFromRedis();
  console.log("noooo")
  if (products == null) {
    console.log('No products found in Redis. Fetching new products...');
    await fetchAndStoreProducts();
    return await getProductsFromRedis();  // Return the new products after fetching
  }
  
  return products;
};
// Fetch products from Redis
const getProductsFromRedis = async () => {
  console.log("nobody")
  const products = await redisClient.get('whatsappproducts');
  console.log(products);
  // return await new Promise((resolve, reject) => {
  //    redisClient.get('whatsappproducts', (err, products) => {
  //     if (err) {
  //       reject('Error fetching products from Redis:', err);
  //     } else {
  //       resolve(JSON.parse(products) || []);
  //     }
  //   });
  // });
  return products;
};

// Fetch and store products
const fetchAndStoreProducts = async () => {
  const products = await fetchProducts();
  if (products.length > 0) {
    await storeProductsInRedis(products);
  }
};


module.exports = {
  fetchAndStoreProducts,
  checkAndFetchProducts
};
