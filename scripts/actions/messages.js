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
