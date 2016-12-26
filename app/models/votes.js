'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voteSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId
    },
    poll_id: {
        type: Schema.Types.ObjectId
    }
});

module.exports = mongoose.model('Vote', voteSchema);
