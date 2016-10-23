var mongoose = require('mongoose');
var bunyan = require('bunyan');
var logger = bunyan.createLogger({name: 'webhooks'});
var Webhook = require('../models/webhook');
var Event = require('../models/event');
var assert = require('assert');
var request = require('request');
var common = require('../common');

/* /webhooks/:id/events */
module.exports.getEventsByWebhook = function(req, res, next) {
    req.log.info('getEventsByWebhook');
    Event
        .find({
            webhookId: req.params.id
        })
        .exec( function(err, events){
            if (err){
                common.errorResponse(req, res, 500, 'Internal Server Error');
            } else {
                common.jsonResponse(req, res, 200, events);
                req.log.info(events);
            }
        })
}

/* POST /webhooks/:id/events */
module.exports.sendEventToWebhook = function(req, res, next) {
    req.log.info('sendEventToWebhook');

    //console.log(req.body['header']);
    //console.log(req.body.body);
    if (common.validObjectId){
        Webhook
            .findById( req.params.id,
                function(err, data){
                    if (err){
                        common.errorResponse(req, res, 400, 'Bad Request');
                        req.log.error(err);
                    } else if (!data) {
                        common.errorResponse(req, res, 404, 'Not Found');
                    } else {
                        sendEvent(data.url, req, res);
                    }
            });
    } else {
        common.errorResponse(req, res, 404, 'Not Found');
    }
};

/* Send event to url */
var sendEvent = function(url, req, res){
    req.log.info('sendEvent');
    var options = {
        headers: req.body.header,
        url: url,
        body: req.body.body,
        json: true
    };

    var webhookRequest = request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            req.log.info('Event sent by webhook');
            common.jsonResponse(req, res, 200, { 'message': 'OK' });
        } else {
            saveEvent(url, req, res);
        }
    });
};

/* Save event to later process */
var saveEvent = function(url, req, res){
    req.log.info('saveEvent');
    var newEvent = new Event();
    
    newEvent.webhookId = req.params.id;
    newEvent.url = url;
    newEvent.header = JSON.stringify(req.body.header);
    newEvent.body = JSON.stringify(req.body.body);
    newEvent.createdAt = new Date();

    Event
        .create(newEvent, function(err, data){
            if (err){
                common.errorResponse(req, res, 400, 'Bad Request');
                req.log.error(err);
            } else {
                req.log.info('Event saved for later try');
                common.jsonResponse(req, res, 202, { 'message': 'Accepted' });
            }
        });
};

/* GET /events */
module.exports.getEvents = function(req, res, next) {
    req.log.info('getEvents');

    Event
        .find({}, function(err, events){
            if (err){
                common.errorResponse(req, res, 500, 'Internal Server Error');
                req.log.error(err);
            } else {
                common.jsonResponse(req, res, 200, events);
            }
        })
};

/* DELETE /events/:id */
module.exports.deleteEventById = function(req, res, next) {
    req.log.info('deleteEventById');
    if (common.validObjectId){
        Event
            .findByIdAndRemove(req.params.eventId, function(err, events){
                if (err){
                    common.errorResponse(req, res, 500, 'Internal Server Error');
                    req.log.error(err);
                } else {
                    res.status(204);
                    res.json();
                }
            });
    } else {
        common.errorResponse(req, res, 404, 'Not Found');        
    }

};