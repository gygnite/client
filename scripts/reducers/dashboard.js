'use strict';

var assign = require('object-assign');
var DASHBOARD = require('../actions/constants').DASHBOARD;


function dashboard(state, action) {
    if (!state) {
        state = {};
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
        default: return state;
    }
    return state;
}


module.exports = dashboard;
