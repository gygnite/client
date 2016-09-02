'use strict';

var assign = require('object-assign');
var USER = require('../actions/constants').USER;

function user(state, action) {
    if (!state) {
        state = {};
    }

    switch (action.type) {
        case USER.SET_USER:
            return assign({}, state, action.user);
            break;
        case USER.CLEAR_USER:
            return {};
            break;
        default: return state;
    }
}


module.exports = user;
