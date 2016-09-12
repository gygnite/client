'use strict';

var assign = require('object-assign');
var BANDS = require('../actions/constants').BANDS;


function bands(state, action) {
    if (!state) {
        state = {
            allbands: []
        };
    }
    switch (action.type) {
        case BANDS.SET_BANDS:
            return assign({}, state, {
                allbands: action.bands
            });
            break;
        default: return state;
    }
    return state;
}


module.exports = bands;
