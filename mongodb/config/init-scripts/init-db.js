// // init-db.js
print('Start #################################################################');

db = db.getSiblingDB('mindglowing_crm');
db.createUser(
  {
    user: process.env.MONGO_USER,
    pwd: process.env.MONGO_PASSWORD,
    roles: [{ role: 'readWrite', db: 'mindglowing_crm' }],
  },
);

//   // Create 'users' collection and insert a document
db.createCollection('users');
db.users.insertOne({
  username: process.env.MINDGLOWING_CRM_LOGIN,
  password: process.env.MINDGLOWING_CRM_PASSWORD,
  setup: true,
});

print('END #################################################################');