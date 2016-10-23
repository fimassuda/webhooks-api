var mongoose = require('mongoose');
var assert = require('assert');
var Webhook = require('../models/webhook');
var common = require('../common.js')

/* /webhooks */
module.exports.getWebhooks = function(req, res, next) {
    req.log.info('getWebhooks');
    Webhook.find({})
        .select(
            {
                _id: 1,
                url: 1
            }
        )
        .exec(function(err, data){
        if (err) {
            common.errorResponse(req, res, 500, "Internal Server Error");
        } else {
            common.jsonResponse(req, res, 200, data);
        }
    });
};

module.exports.createWebhook = function(req, res, next) {
    req.log.info('createWebhook');
    var newWebhook = new Webhook(req.body);
    var validation = newWebhook.validateSync();

    if (validation && !assert.ok(validation.errors)){
        if (!assert.ok(validation.errors['url'])){
            common.errorResponse(req, res, 400, "URL is required"); 
        }
    } else {
        Webhook
        .create(newWebhook, function(err, data){
            if (err){
                common.errorResponse(req, res, 400, "Bad Request");
            } else {
                req.log.info('Created Webhook: ' + data._id);
                res
                    .status(201)
                    .location('/webhooks/' + data._id)
                    .json();
            }
        });
    }
};

/* /webhooks/:id */
module.exports.getWebhookById = function(req, res, next) {
    req.log.info("getWebhookById");

    if (common.validObjectId(req.params.id)){

        Webhook
            .findById(req.params.id, '-__v')
            .exec(function(err, data){
                if (err){
                    req.log.error(err);
                    common.errorResponse(req, res, 400, 'Bad Request');
                } else if (!data) {
                    common.errorResponse(req, res, 404, 'Not Found');
                } else {
                    common.jsonResponse(req, res, 200, data);
                }
            });
    } else {
        common.errorResponse(req, res, 404, 'Not Found');
    }

};

module.exports.updateWebhook = function(req, res, next) {
    req.log.info("updateWebhook: " + req.params.id);

    if(common.validObjectId){
        var newWebhook = new Webhook(req.body);
        var validation = newWebhook.validateSync();

        if (validation && !assert.ok(validation.errors)){
            if (!assert.ok(validation.errors['url'])){
                common.errorResponse(req, res, 400, "URL is required"); 
            }
        } else {

            Webhook
                .findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: req.body
                    },
                    function(err, updatedWebhook){
                        if (err){
                            common.errorResponse(req, res, 500, 'Internal Server Error');
                            req.log.error(err); 
                        } else {
                            common.jsonResponse(req,res, 204);
                        }
                    }
                );
        }

    } else {
        common.errorResponse(req, res, 404, 'Not Found');
    }
};

module.exports.deleteWebhook = function(req, res, next) {
    req.log.info("deleteWebhook: " + req.params.id);
    if (common.validObjectId){
        Webhook
            .findByIdAndRemove( req.params.id, function(err, updatedWebhook){
                if (err){
                    req.log.info(err);
                    common.errorResponse(req, res, 500, 'Internal Server Error');
                } else {
                    common.jsonResponse(req,res, 204);
                }
            });    
    } else {
        common.errorResponse(req, res, 404, 'Not Found');
    }
};