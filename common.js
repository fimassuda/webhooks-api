var mongoose = require('mongoose');

module.exports.errorResponse = function(req, res, status, errorMessage) {
    res.status(status);
    res.json({
        "code": status,
        "message": errorMessage
    });
    req.log.info({status : status});
};

module.exports.jsonResponse = function(req, res, status, content) {
    res.status(status);
    res.json(content);
    req.log.info({status : status});
};

module.exports.validObjectId = function(id){

    try {
        mongoose.Types.ObjectId(id);
        return true;
    } catch (err) {
        return false;
    }
}

