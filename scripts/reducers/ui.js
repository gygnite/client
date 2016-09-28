'use strict';
var assign = require('object-assign');
var UI = require('../actions/constants').UI;

function ui(state, action) {
    if (!state) {
        state = {
            alerts: [],
            notifications: []
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
            return assign({}, state, {
                alerts:  state.alerts
            });
        case UI.FETCH_BANDS:
            return assign({}, state, {
                isFetchingBands: true
            });
            break;
        case UI.FETCH_BANDS_COMPLETE:
            return assign({}, state, {
                isFetchingBands: false
            });
            break;
        case UI.FETCH_POST_BOOKING:
            return assign({}, state, {
                isPostingBooking: true
            });
            break;
        case UI.FETCH_POST_BOOKING_COMPLETE:
            return assign({}, state, {
                isPostingBooking: false
            });
            break;
        case UI.FETCH_MESSAGES:
            return assign({}, state, {
                isFetchingMessages: true
            });
            break
        case UI.FETCH_MESSAGES_COMPLETE:
            return assign({}, state, {
                isFetchingMessages: false
            });
            break;
        case UI.SENDING_MESSAGE:
            return assign({}, state, {
                isSendingMessage: true
            });
            break;
        case UI.SENDING_MESSAGE_COMPLETE:
            return assign({}, state, {
                isSendingMessage: false
            });
            break;
        case UI.FETCH_NOTIFICATIONS:
            return assign({}, state, {
                isFetchingNotifications: true
            });
            break;
        case UI.FETCH_NOTIFICATIONS_COMPLETE:
            return assign({}, state, {
                isFetchingNotifications: false
            });
            break;
        case UI.SET_NOTIFICATIONS:
            return assign({}, state, {
                notifications: action.notifications
            });
            break;
        case UI.ADD_NOTIFICATION:
            var notifs = state.notifications;
            notifs.unshift(action.notification);
            if (notifs.length > 9) {
                notifs.pop();
            }
            return assign({}, state, {
                notifications: notifs
            });
            break;
        case UI.SET_NOTIFICATION_AS_READ:
            var notifs = state.notifications.map(function(notif) {
                if (notif.id === action.notification.id) {
                    return action.notification;
                }
                return notif;
            });
            return assign({}, state, {
                notifications: notifs
            });
            break;
        default: return state;
    }
    return state;
}

module.exports = ui;




function singleAlert(state, action) {
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
