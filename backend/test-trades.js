const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect('mongodb://localhost:27017/nexus-alpha', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const Trade = mongoose.model('Trade', new Schema({}, { strict: false }));
    const result = await Trade.find({ ticker: { $in: ['GOOG', 'GOOGL'] } }).sort({ transactionDate: -1 }).limit(5);
    console.log(JSON.stringify(result, null, 2));
    mongoose.disconnect();
  });
