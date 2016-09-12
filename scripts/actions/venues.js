'use strict';

var VENUES = require('./constants').VENUES;

exports.setVenues = function (venues) {
    return {
        type: VENUES.SET_VENUES,
        venues: venues //array
    }
};
