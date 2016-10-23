var mongoose = require('mongoose');
var dbURI = 'ds063856.mlab.com:63856/vanhack';
var readLine = require('readline');
var bunyan = require('bunyan');
var logger = bunyan.createLogger({name: 'webhooks'});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + process.env.MONGODBUSER + ':' + process.env.MONGODBPASS + '@ds063856.mlab.com:63856/vanhack');

mongoose.connection.on('connected', function() {
  logger.info('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function(err) {
  logger.error('Mongoose connection error: ' + err)
});

mongoose.connection.on('disconnected', function() {
  logger.info('Mongoose disconnected');
});

if (process.platform === "win32"){
  var rl = readLine.createInterface ({
    input: process.stdin,
    output: process.stdout
  });
  rl.on ("SIGINT", function (){
    process.emit ("SIGINT");
  });

}

var gracefulShutdown = function (msg, callback){
  mongoose.connection.close(function (){
    logger.info('Mongoose disconnected through ' + msg);
    callback();
  });
};

process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function(){
    process.kill(process.pid, 'SIGUSR2');
  });
});

process.on('SGIINT', function() {
  gracefulShutdown('app termination', function(){
    process.exit(0);
  });
});