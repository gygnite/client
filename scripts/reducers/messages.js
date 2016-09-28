'use strict';

var assign = require('object-assign');
var MESSAGES = require('../actions/constants').MESSAGES;


function messages(state, action) {
    if (!state) {
        state = {
            inboxes: []
        };
    }
    switch (action.type) {
        case MESSAGES.SET_INBOXES:
            var inboxes = action.inboxes.map(function(inb, i) {
                var gs = Object.keys(inb.messageGroups);
                gs.map(function(g, index) {
                    if (index === 0) {
                        inb.messageGroups[g] = group(inb.messageGroups[g], {type: MESSAGES.SET_ACTIVE_MESSAGE_GROUP});
                    } else {
                        inb.messageGroups[g] = group(inb.messageGroups[g], {type: MESSAGES.REMOVE_ACTIVE_MESSAGE_GROUP});
                    }
                });
                if (i === 0) {
                    return inbox(inb, {type: MESSAGES.SET_ACTIVE_INBOX});
                } else {
                    return inbox(inb, {type: MESSAGES.REMOVE_ACTIVE_INBOX});
                }
            });
            return assign({}, state, {
                inboxes: inboxes
            });
            break;
        case MESSAGES.SET_ACTIVE_INBOX:
            var inboxes = state.inboxes.map(function(inb, i) {
                if (inb.identity.slug === action.slug) {
                    return inbox(inb, action);
                }
                return inbox(inb, {type: MESSAGES.REMOVE_ACTIVE_INBOX});
            });
            return assign({}, state, {
                inboxes: inboxes
            });
            break;
        case MESSAGES.SET_ACTIVE_MESSAGE_GROUP:
            var inboxes = state.inboxes.map(function(inb, i) {
                if (inb.identity.isActive) {
                    var gs = Object.keys(inb.messageGroups);
                    gs.map(function(g, index) {
                        if (action.slug === g) {
                            inb.messageGroups[g] = group(inb.messageGroups[g], {type: MESSAGES.SET_ACTIVE_MESSAGE_GROUP});
                        } else {
                            inb.messageGroups[g] = group(inb.messageGroups[g], {type: MESSAGES.REMOVE_ACTIVE_MESSAGE_GROUP});
                        }
                    });
                }
                return inb;
            });
            return assign({}, state, {
                inboxes: inboxes
            });
            break;
        case MESSAGES.ADD_MESSAGE:
            var inboxes = state.inboxes.map(function(inb, i) {
                if (inb.identity.slug === action.sender) {
                    if (inb.messageGroups.hasOwnProperty(action.receiver)) {
                        //message group exists
                        inb.messageGroups[action.receiver].messages.unshift(action.message);
                    }
                }
                //in case user owns both sender and reciever inboxes
                if (inb.identity.slug === action.receiver) {
                    if (inb.messageGroups.hasOwnProperty(action.sender)) {
                        inb.messageGroups[action.sender].messages.unshift(action.message);
                    }
                }
                return inb;
            });
            return assign({}, state, {
                inboxes: inboxes
            });
            break;
        case MESSAGES.MARK_GROUP_AS_READ:
            var inboxes = state.inboxes.map(function(inb, i) {
                if (inb.identity.isActive && inb.messageGroups.hasOwnProperty(action.slug)) {
                    inb.messageGroups[action.slug].hasUnread = false;
                }
                return inb;
            });
            return assign({}, state, {
                inboxes: inboxes
            });
            break;
        default: return state;
    }
    return state;
}


module.exports = messages;


function inbox(state, action) {
    if (!state) {
        state = {};
    }
    switch (action.type) {
        case MESSAGES.SET_ACTIVE_INBOX:
            var identity = state.identity;
            identity.isActive = true;
            return assign({}, state, {
                identity: identity
            });
            break;
        case MESSAGES.REMOVE_ACTIVE_INBOX:
            var identity = state.identity;
            identity.isActive = false;
            return assign({}, state, {
                identity: identity
            });
            break;
        default: return state;
    }

    return state;
}

function group(state, action) {
    if (!state) {
        state = {};
    }

    switch(action.type) {
        case MESSAGES.SET_ACTIVE_MESSAGE_GROUP:
            var identity = state.identity;
            identity.isActive = true;
            return assign({}, state, {
                identity: identity
            });
            break;
        case MESSAGES.REMOVE_ACTIVE_MESSAGE_GROUP:
            var identity = state.identity;
            identity.isActive = false;
            return assign({}, state, {
                identity: identity
            });
            break;
        case MESSAGES.MARK_GROUP_AS_READ:
            return assign({}, state, {
                hasUnread: false
            });
            break;
        default: return state;
    }

    return state;
}
