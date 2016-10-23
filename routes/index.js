var express = require('express');
var router = express.Router();
var ctrlWebhook = require('../controllers/webhooks.js');
var ctrlEvents = require('../controllers/events.js');
var common = require('../common');

/* /webhooks */
router.get('/webhooks', ctrlWebhook.getWebhooks);
router.post('/webhooks', ctrlWebhook.createWebhook);
router.all('/webhooks', methodNotAllowed);

/* /webhooks/:id */
router.get('/webhooks/:id', ctrlWebhook.getWebhookById);
router.put('/webhooks/:id', ctrlWebhook.updateWebhook);
router.delete('/webhooks/:id', ctrlWebhook.deleteWebhook);
router.all('/webhooks/:id', methodNotAllowed);

/* /webhooks/:id/event */
router.post('/webhooks/:id/events', ctrlEvents.sendEventToWebhook);
router.get('/webhooks/:id/events', ctrlEvents.getEventsByWebhook);
router.all('/webhooks/:id/events', methodNotAllowed);

/** /events */
router.get('/events', ctrlEvents.getEvents);
router.all('/events', methodNotAllowed);

/** /events/:eventId */
router.delete('/events/:eventId', ctrlEvents.deleteEventById);
router.all('/events/:eventId', methodNotAllowed);

function methodNotAllowed(req, res, next){
    common.errorResponse(req, res, 405, 'Method Not Allowed');
}

module.exports = router;

