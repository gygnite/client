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
        default: return state;
    }
    return state;
}


module.exports = profile;
