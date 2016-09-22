'use strict';

var VenueProfile = require('../../views/profile/venue');
var request = require('superagent');
var Cache = require('lscache');

var connect = require('react-redux').connect;

function mapStateToProps(state, ownProps) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        fetchVenue: function(slug) {
            console.log("fetching!")
            dispatch(ACTIONS.ui.fetchVenues());
            request.get(BASE_URL+'/venues/'+slug)
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
