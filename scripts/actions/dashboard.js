'use strict';

var DASHBOARD = require('./constants').DASHBOARD;


exports.fetchDashboard = function () {
    return {
        type: DASHBOARD.FETCH_DASHBOARD
    }
};

exports.fetchDashboardComplete = function () {
    return {
        type: DASHBOARD.FETCH_DASHBOARD_COMPLETE
    }
};


exports.setTimeslots = function (timeslots) {
    return {
        type: DASHBOARD.SET_TIMESLOTS,
        timeslots: timeslots
    }
};



exports.setPending = function (bands, venues) {
    return {
        type: DASHBOARD.SET_PENDING,
        bands: bands,
        venues: venues
    }
};

exports.removePending = function (vid, bid) {
    return {
        type: DASHBOARD.REMOVE_SINGLE_PENDING,
        venue_id: vid,
        band_id: bid
    }
};
