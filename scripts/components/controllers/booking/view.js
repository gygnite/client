'use strict';

//BookingViewinclude view component here
var BookingView = require('../../views/booking/view');
var connect = require('react-redux').connect;
var request = require('superagent');
require('superagent-auth-bearer')(request);
var Cache = require('lscache');


function mapStateToProps(state, ownProps) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        fetchBookings: function(id) {
            request(BASE_URL+'/api/booking/'+id)
                .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
                .end(function(err, res) {
                    console.log("res!", res.body);
                    if (!err && !res.body.error) {
                        dispatch(ACTIONS.bookings.setCurrentBookings(res.body.timeslots));
                        console.log("bookigns", res.body.timeslots)
                    } else {

                    }
                });
        },
        clearBookings: function() {
            dispatch(ACTIONS.bookings.clearCurrentBookings());
        },
        setAccepted: function(vid, bid, date) {
            request.put(BASE_URL+'/api/booking/'+vid+'/'+bid)
                .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
                .send({
                    status: 'accepted',
                    date: date
                })
                .end(function(err, res) {
                    if (!err || !res.body.error) {
                        dispatch(ACTIONS.bookings.setAccepted(res.body.timeslot));
                        dispatch(ACTIONS.ui.createAlert('Accepted', 'success'));
                    } else {
                        // FIXME: Error set accepted response
                        dispatch(ACTIONS.ui.createAlert('Failed to set to accepted.', 'success'));
                    }
                });
        },
        setRejected: function(vid, bid, date) {
            request.put(BASE_URL+'/api/booking/'+vid+'/'+bid)
                .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
                .send({
                    status: 'rejected',
                    date: date
                })
                .end(function(err, res) {
                    if (!err || !res.body.error) {
                        dispatch(ACTIONS.bookings.setRejected(res.body.timeslot));
                        dispatch(ACTIONS.ui.createAlert('Rejected', 'success'));
                    } else {
                        // FIXME: Error set rejected response
                        dispatch(ACTIONS.ui.createAlert('Failed to set to rejected.', 'success'));
                    }
                });
        }
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(BookingView);
