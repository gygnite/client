'use strict';

//Dashboardinclude view component here
var Dashboard = require('../../views/dashboard/index');

var connect = require('react-redux').connect;

var Cache = require('lscache');
var request = require('superagent');
require('superagent-auth-bearer')(request);



function mapStateToProps(state, ownProps) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        fetchDashboard: function() {
            dispatch(ACTIONS.ui.fetchBands());
            dispatch(ACTIONS.ui.fetchVenues());
            request.get(BASE_URL+'/api/admins')
            .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
            .end(function(err,res) {
                console.log("res.body: ", res.body);
                dispatch(ACTIONS.bands.setBands(res.body.bands));
                dispatch(ACTIONS.venues.setVenues(res.body.venues));
                dispatch(ACTIONS.ui.fetchBandsComplete());
                dispatch(ACTIONS.ui.fetchVenuesComplete());
            });
        }
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);
