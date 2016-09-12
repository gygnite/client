'use strict';

// NOTE: UI Actions
var UI = require('./constants').UI;

exports.closeModal = function () {
    return {
        type: UI.CLOSE_MODAL
    }
};

exports.keepModal = function () {
    return {
        type: UI.KEEP_MODAL
    }
};

exports.fetchRegistration = function () {
    return {
        type: UI.FETCH_REGISTRATION
    }
};

exports.fetchRegistrationComplete = function(status) {
    return {
        type: UI.FETCH_REGISTRATION_COMPLETE,
        status: status
    }
};

exports.fetchUser = function () {
    return {
        type: UI.FETCH_USER
    }
};

exports.fetchUserComplete = function () {
    return {
        type: UI.FETCH_USER_COMPLETE
    }
};

exports.createAlert = function(message, status) {
    return {
        type: UI.CREATE_ALERT,
        message: message,
        status: status
    }
};

exports.removeAlert = function () {
    return {
        type: UI.REMOVE_ALERT
    }
};


exports.fetchBands = function () {
    console.log("fetching bands");
    return {
        type: UI.FETCH_BANDS
    }
};

exports.fetchBandsComplete = function () {
    return {
        type: UI.FETCH_BANDS_COMPLETE
    }
};


exports.fetchVenues = function () {
    return {
        type: UI.FETCH_VENUES
    }
};

exports.fetchVenuesComplete = function () {
    return {
        type: UI.FETCH_VENUES_COMPLETE
    }
};