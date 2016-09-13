'use strict';

var PROFILE = require('./constants').PROFILE;

exports.setBand = function (band) {
    return {
        type: PROFILE.SET_BAND,
        band: band
    }
};

exports.setVenue = function (venue) {
    return {
        type: PROFILE.SET_VENUE,
        venue: venue
    }
};
