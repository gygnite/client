'use strict';

var VenueProfile = require('../../views/profile/venue');
var request = require('superagent');
require('superagent-auth-bearer')(request);
var Cache = require('lscache');

var connect = require('react-redux').connect;

function mapStateToProps(state, ownProps) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        fetchVenue: function(slug) {
            // FIXME: Change from /admins to global/unauthed
            dispatch(ACTIONS.ui.fetchVenues());
            request.get(BASE_URL+'/api/admins/venues/'+slug)
            .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
            .end(function(err,res) {
                console.log("res.body: ", res.body);
                // console.log("ACTIONS: ", ACTIONS);

                // FIXME: Add error handling -> needed on bands too!

                dispatch(ACTIONS.profile.setVenue(res.body.venue));
                dispatch(ACTIONS.ui.fetchVenuesComplete());
            });
        }
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(VenueProfile);
