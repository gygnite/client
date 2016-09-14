'use strict';

'use strict';

var assign = require('object-assign');
var PROFILE = require('../actions/constants').PROFILE;

function profile(state, action) {
    if (!state) {
        state = {};
    }
    switch (action.type) {
        case PROFILE.SET_BAND:
            return assign({}, state, action.band);
            break;
        case PROFILE.SET_VENUE:
            return assign({}, state, action.venue);
            break;
        case PROFILE.CLEAR_PROFILE:
            return {};
            break;
        default: return state;
    }
    return state;
}


module.exports = profile;
