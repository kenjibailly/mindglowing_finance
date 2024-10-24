// Import Node.js crypto module
const crypto = require('crypto');

print('Start #################################################################');

db = db.getSiblingDB('mindglowing_finance');

// Function to hash the password
function hashPassword(password) {
  // Use SHA-256 hashing algorithm
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  return hashedPassword;
}

// Hash the provided password
const hashedPassword = hashPassword(process.env.MINDGLOWING_FINANCE_PASSWORD);

db.createUser(
  {
    user: process.env.MONGO_USER,
    pwd: hashedPassword,
    roles: [{ role: 'readWrite', db: 'mindglowing_finance' }],
  },
);

// Create 'users' collection and insert a document with hashed password
db.createCollection('users');
db.users.insertOne({
  username: process.env.MINDGLOWING_FINANCE_LOGIN,
  password: hashedPassword,
  setup: true,
});


// Create 'customization' collection and insert a document with default settings
db.createCollection('customizations');
db.customizations.insertOne({
  invoice_prefix: 'INV',
  invoice_separator: '-',
  estimate_prefix: 'EST',
  estimate_separator: '-',
  items_per_page: '10',
});

print('END #################################################################');
