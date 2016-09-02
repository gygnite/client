'use strict';

var assign = require('object-assign');
var SETTINGS = require('../actions/constants').SETTINGS;

function settings(state, action) {
    if (!state) {
        state = {};
    }
    return state;
}


module.exports = settings;
