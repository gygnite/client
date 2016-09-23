'use strict';

var assign = require('object-assign');
var BOOKINGS = require('../actions/constants').BOOKINGS;


function bookings(state, action) {
    if (!state) {
        state = [];
    }
    switch (action.type) {
        case BOOKINGS.SET_CURRENT_BOOKINGS:
            return assign([], state, action.bookings);
            break;
        case BOOKINGS.CLEAR_CURRENT_BOOKINGS:
            return [];
            break;
        case BOOKINGS.SET_ACCEPTED:
            var bookings = state.map(function(bk) {
                if (action.timeslot.band_id === bk.band.id) {
                    return booking(bk, action);
                } return bk;
            });
            return assign([], state, bookings);
            break;
        case BOOKINGS.SET_REJECTED:
            var bookings = state.map(function(bk) {
                if (action.timeslot.band_id === bk.band.id) {
                    return booking(bk, action);
                } return bk;
            });
            return assign([], state, bookings);
            break;
        default: return state;
    }
    return state;
}


function booking(state, action) {
    if (!state) {
        state = {};
    }
    switch (action.type) {
        case BOOKINGS.SET_ACCEPTED:
            var data = assign({}, state.data, {
                pending: false,
                accepted: true,
                rejected: false
            });
            return assign({}, state, {
                data: data
            });
            break;
        case BOOKINGS.SET_REJECTED:
            var data = assign({}, state.data, {
                pending: false,
                accepted: false,
                rejected: true
            });
            return assign({}, state, {
                data: data
            });
            break;
        default: return state;
    }
    return state;
}


module.exports = bookings;
