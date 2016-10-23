var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var eventSchema = new Schema({
    webhookId: Schema.Types.ObjectId,
    url: String,
    header: String,
    body: String,
    createdAt: {
        type: Date,
        expires: 300
    }

})

module.exports = mongoose.model('event', eventSchema);