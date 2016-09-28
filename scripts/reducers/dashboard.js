'use strict';

var assign = require('object-assign');
var DASHBOARD = require('../actions/constants').DASHBOARD;


function dashboard(state, action) {
    if (!state) {
        state = {
            timeslots: [],
            pending: {
                bands: [],
                venues: []
            }
        };
    }
    switch (action.type) {
        case DASHBOARD.FETCH_DASHBOARD:
            return assign({}, state, {
                isFetchingDashboard: true
            });
            break;
        case DASHBOARD.FETCH_DASHBOARD_COMPLETE:
            return assign({}, state, {
                isFetchingDashboard: false
            });
            break;
        case DASHBOARD.SET_TIMESLOTS:
            return assign({}, state, {
                timeslots: action.timeslots
            });
            break;
        case DASHBOARD.SET_PENDING:
            var pending = state.pending;
            pending.bands = action.bands;
            pending.venues = action.venues;
            return assign({}, state, {
                pending: pending
            });
            break;
        case DASHBOARD.REMOVE_SINGLE_PENDING:
            var pending = state.pending;

            for (var i = 0; i < state.pending.bands.length; i++) {
                var pendingBandSlots = pending.bands[i].slots.filter(function(item) {
                    return !(item.data.band_id === action.band_id && item.data.venue_id === action.venue_id);
                });
                pending.bands[i] = assign({}, pending.bands[i], {
                    slots: pendingBandSlots
                });
            }

            for (var i = 0; i < state.pending.venues.length; i++) {
                var pendingVenueSlots = pending.venues[i].slots.filter(function(item) {
                    return !(item.data.band_id === action.band_id && item.data.venue_id === action.venue_id);
                });
                pending.venues[i] = assign({}, pending.venues[i], {
                    slots: pendingVenueSlots
                });
            }


            return assign({}, state, {
                pending: pending
            });
            break;

        default: return state;
    }
    return state;
}


module.exports = dashboard;
