'use strict';

'use strict';

var assign = require('object-assign');
var moment = require('moment');
var PROFILE = require('../actions/constants').PROFILE;

function profile(state, action) {
    if (!state) {
        state = {};
    }
    switch (action.type) {
        case PROFILE.SET_BAND:
            var tss =  action.band.timeslots.map(function(ts, index) {
                return  timeslot(ts, action);
            });
            return assign({}, action.band, {
                timeslots: tss
            });
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




function timeslot(state, action) {
    if (!state) {
        state = {};
    }
    switch(action.type) {
        case PROFILE.SET_BAND:
            if (moment().isSame(state.start_time, 'day')) {
                return assign({}, state, {
                    today: true
                });
            }
            return state;
            break;
        default: return state;
    }

    return state;

}
