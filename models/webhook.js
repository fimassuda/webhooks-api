var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var webhookSchema = new Schema({
    url: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('webhook', webhookSchema);