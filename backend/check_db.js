const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  const users = await db.collection('users').find({}).toArray();
  console.log(JSON.stringify(users.map(u => ({ email: u.email, sub: u.subscription })), null, 2));
  mongoose.connection.close();
});
