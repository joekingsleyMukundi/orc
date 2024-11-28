const axios = require('axios');
const basicAuthToken = require('../config/payment');

/**
 * Makes a payment request to the PayHero API.
 * @param {number} amount - The payment amount.
 * @param {string} phoneNumber - The recipient's phone number.
 */
const makePayment = async (amount, phoneNumber) => {
  const url = 'https://backend.payhero.co.ke/api/v2/payments';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${basicAuthToken}`
  };
  
  const data = {
    amount,
    phone_number: phoneNumber,
    channel_id: 1044,
    provider: "m-pesa",
    external_reference: "INV-009",
    callback_url: "https://example.com/callback.php"
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log("Payment successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error making payment:", error.response?.data || error.message);
    throw error;
  }
};

// Example usage:
makePayment(10, "0798766765");
