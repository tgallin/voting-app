'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pollSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId
    },
    question: String,
    options: [{
        label: String,
        voteCount: Number
    }],
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Poll', pollSchema);
