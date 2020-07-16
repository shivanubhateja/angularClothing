var mongoose = require('mongoose');

//mongo config
  mongoose.Promise = global.Promise;

  var localDb = mongoose.connection;

  localDb.on('connecting', function () {
    console.log('connecting to MongoDB...');
  });

  localDb.on('error', function (error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
  });
  localDb.on('connected', function () {
    console.log('MongoDB connected!');
  });
  localDb.once('open', function () {
    console.log('MongoDB connection opened!');
  });
  localDb.on('reconnected', function () {
    console.log('MongoDB reconnected!');
  });
  localDb.on('disconnected', function () {
    console.log('MongoDB disconnected!');
    // mongoose.connect('mongodb://ssccgl:ssccgl@ssccgl-shard-00-00-lulnn.mongodb.net:27017,ssccgl-shard-00-01-lulnn.mongodb.net:27017,ssccgl-shard-00-02-lulnn.mongodb.net:27017/sscDb?ssl=true&replicaSet=ssccgl-shard-0&authSource=admin&retryWrites=true', { server: { auto_reconnect: true }});
  });
  mongoose.connect('mongodb+srv://shivanu31:shivanu31@ecomappmongoatlas.rxgry.mongodb.net/?retryWrites=true&w=majority');
  // mongoose.connect('mongodb://ssccgl:ssccgl@ssccgl-shard-00-00-lulnn.mongodb.net:27017,ssccgl-shard-00-01-lulnn.mongodb.net:27017,ssccgl-shard-00-02-lulnn.mongodb.net:27017/sscDb?ssl=true&replicaSet=ssccgl-shard-0&authSource=admin&retryWrites=true', { server: { auto_reconnect: true } });

module.exports = mongoose;