// update-password.js

print('Start updating username and password #################################################################');

var db = db.getSiblingDB('mindglowing_finance');
var existingUser = db.users.findOne();

if (existingUser) {
  db.users.updateOne(
    { _id: existingUser._id }, // Assuming there is an "_id" field
    {
      $set: {
        username: process.env.MINDGLOWING_FINANCE_LOGIN,
        password: process.env.MINDGLOWING_FINANCE_PASSWORD
      }
    }
  );
  print('Username and password updated');
} else {
  print('User not found');
}

print('END #################################################################');