'use strict';
var assign = require('object-assign');
var UI = require('../actions/constants').UI;

function ui(state, action) {
    if (!state) {
        state = {
            alerts: []
        };
    }

    switch (action.type) {
        case UI.CLOSE_MODAL:
            return assign({}, state, {
                shouldCloseModal: true
            });
            break;
        case UI.KEEP_MODAL:
            return assign({}, state, {
                shouldCloseModal: false
            });
            break;
        case UI.FETCH_REGISTRATION:
            return assign({}, state, {
                isFetchingRegistration: true
            });
            break;
        case UI.FETCH_REGISTRATION_COMPLETE:
            return assign({}, state, {
                isFetchingRegistration: false
            });
            break;
        case UI.FETCH_USER:
            return assign({}, state, {
                isFetchingUser: true
            });
            break;
        case UI.FETCH_USER_COMPLETE:
            return assign({}, state, {
                isFetchingUser: false
            });
        case UI.CREATE_ALERT:
            state.alerts.push(singleAlert(state.alerts, action));
            return assign({}, state, {
                alerts: state.alerts
            });
            break;
        case UI.REMOVE_ALERT:
            state.alerts.shift();
            // console.log("state of alerts: ", state.alerts);
            return assign({}, state, {
                alerts:  state.alerts
            });
        default: return state;
    }
    return state;
}

module.exports = ui;






function singleAlert(state, action) {
    // console.log("alert state: ", state, action)
    if (!state) {
        state = {
            message: '',
            status: 'error'
        };
    }

    if (!action.status) {
        console.error('Please include a status with your alert.');
        action.status = 'error';
    }

    switch (action.type) {
        case UI.CREATE_ALERT:
            return assign({}, state, {
                message: action.message,
                status: action.status
            });
            break;
        default: return state;

    }
}
