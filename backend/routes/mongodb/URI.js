const crypto = require('crypto');

// Function to hash the password
function hashPassword(password) {
  // Use SHA-256 hashing algorithm
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  return hashedPassword;
}

// Hash the provided password
const hashedPassword = hashPassword(process.env.MONGO_PASSWORD);

// Use the hashed password in the MongoDB connection string
const mongodb_URI = `mongodb://${process.env.MONGO_USER}:${hashedPassword}@mindglowing_finance_mongo_db:27017/mindglowing_finance`;

module.exports = mongodb_URI;