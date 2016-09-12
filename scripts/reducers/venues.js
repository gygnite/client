'use strict';

var assign = require('object-assign');
var VENUES = require('../actions/constants').VENUES;


function venues(state, action) {
    if (!state) {
        state = {
            allvenues: []
        };
    }
    switch (action.type) {
        case VENUES.FETCH_VENUES:
            return assign({}, state, {
                isFetchingVenues: true
            });
            break;
        case VENUES.FETCH_VENUES_COMPLETE:
            return assign({}, state, {
                isFetchingVenues: false
            });
            break;
        case VENUES.SET_VENUES:
            return assign({}, state, {
                allvenues: action.venues
            });
            break;
        default: return state;
    }
    return state;
}


module.exports = venues;
