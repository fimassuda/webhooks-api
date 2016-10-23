var express = require('express');
var bunyan = require('bunyan');
var logger = bunyan.createLogger({name: 'webhooks'});
var uuid = require('node-uuid');
var bodyParser = require('body-parser');
var cors = require('cors');
require('./models/db');
var routes = require('./routes/index');
var common = require('./common');

var app = express();
app.use(cors());

logger.info('Initializing Webhook API');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  req.log = logger.child({tid: uuid(), method: req.method, url: req.url});
  req.log.debug({headers: req.headers, body: req.body});
  next();
});
 
app.use(function(req, res, next){
  if (!req.get('content-type') || req.get('content-type') === 'application/json'){
    next();
  } else {
    commo.errorResponse(req, res, 415, 'Unsupported Media Type');
  }
})

app.use('/v1', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  common.errorResponse(req, res, 404, 'Not Found');
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    common.errorResponse(req, res, 500, err.message);
    req.log.error(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  common.errorResponse(req, res, 500, 'Internal Server Error');
  req.log.error(err);
});

module.exports = app;