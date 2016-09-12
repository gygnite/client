'use strict';

var PROFILE = require('./constants').PROFILE;

exports.setBand = function (band) {
    return {
        type: PROFILE.SET_BAND,
        band: band
    }
};
