'use strict';

//BandProfileinclude view component here
var BandProfile = require('../../views/profile/band');
var request = require('superagent');
require('superagent-auth-bearer')(request);
var Cache = require('lscache');

var connect = require('react-redux').connect;

function mapStateToProps(state, ownProps) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        fetchBand: function(slug) {
            // FIXME: Change from /admins to global/unauthed
            dispatch(ACTIONS.ui.fetchBands());
            request.get(BASE_URL+'/api/admins/bands/'+slug)
            .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
            .end(function(err,res) {
                // console.log("res.body: ", res.body);
                // console.log("ACTIONS: ", ACTIONS);
                dispatch(ACTIONS.profile.setBand(res.body.band));
                dispatch(ACTIONS.ui.fetchBandsComplete());
            });
        }
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(BandProfile);
