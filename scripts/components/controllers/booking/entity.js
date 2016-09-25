'use strict';

var SingleEntity = require('../../views/booking/entity');
var connect = require('react-redux').connect;
var request = require('superagent');
require('superagent-auth-bearer')(request);
var Cache = require('lscache');

function mapStateToProps(state, ownProps) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllBookings: function(slug) {
            request.get(BASE_URL+'/api/booking/venue/'+slug)
                .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
                .end(function(err, res) {
                    dispatch(ACTIONS.bookings.setCurrentBookings(res.body.timeslots));
                    console.log("bookings", res.body.timeslots)
                });
        },
        clearBookings: function() {
            dispatch(ACTIONS.bookings.clearCurrentBookings());
        },
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(SingleEntity);
