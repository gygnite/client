'use strict';

var MESSAGES = require('./constants').MESSAGES;


exports.setInboxes = function (inboxes) {
    return {
        type: MESSAGES.SET_INBOXES,
        inboxes: inboxes
    }
};

exports.setActiveInbox = function (slug) {
    return {
        type: MESSAGES.SET_ACTIVE_INBOX,
        slug: slug
    }
};

exports.setActiveMessageGroup = function (slug) {
    return {
        type: MESSAGES.SET_ACTIVE_MESSAGE_GROUP,
        slug: slug
    }
};

exports.markGroupAsRead = function (slug) {
    return {
        type: MESSAGES.MARK_GROUP_AS_READ,
        slug: slug
    }
};

exports.addMessage = function (message, receiver, sender) {
    return {
        type: MESSAGES.ADD_MESSAGE,
        message: message,
        sender: sender,
        receiver: receiver
    }
};

exports.emitMessage = function (message, receiver, sender) {
    return {
        type: MESSAGES.EMIT_MESSAGE,
        message: message,
        sender: sender,
        receiver: receiver
    }
};
