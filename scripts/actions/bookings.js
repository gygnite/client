'use strict';

var BOOKINGS = require('./constants').BOOKINGS;


exports.setCurrentBookings = function (bookings) {
    console.log("bookings action", bookings);
    return {
        type: BOOKINGS.SET_CURRENT_BOOKINGS,
        bookings: bookings
    }
};


exports.clearCurrentBookings = function () {
    return {
        type: BOOKINGS.CLEAR_CURRENT_BOOKINGS
    }
};

exports.setAccepted = function (timeslot) {
    return {
        type: BOOKINGS.SET_ACCEPTED,
        timeslot: timeslot
    }
};

exports.setRejected = function (timeslot) {
    return {
        type: BOOKINGS.SET_REJECTED,
        timeslot: timeslot
    }
};
