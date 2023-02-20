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
    mongoose.connect('mongodb+srv://shivanu31:shivanu31@ecomappmongoatlas.rxgry.mongodb.net/?retryWrites=true&w=majority');
  });
  mongoose.connect('mongodb+srv://shivanu31:shivanu31@ecomappmongoatlas.rxgry.mongodb.net/?retryWrites=true&w=majority');

module.exports = mongoose;