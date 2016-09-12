'use strict';

var DASHBOARD = require('./constants').DASHBOARD;


exports.fetchDashboard = function () {
    return {
        type: DASHBOARD.FETCH_DASHBOARD
    }
};

exports.fetchDashboardComplete = function () {
    return {
        type: DASHBOARD.FETCH_DASHBOARD_COMPLETE
    }
};
