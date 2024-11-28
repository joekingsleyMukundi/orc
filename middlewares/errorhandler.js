// middlewares/errorHandler.js

function errorHandler(err, req, res, next) {
  console.error('Error occurred:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
}

module.exports = errorHandler;
