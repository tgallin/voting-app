'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    github: {
        id: String,
        displayName: String,
        username: String
    }
});

module.exports = mongoose.model('User', userSchema);
