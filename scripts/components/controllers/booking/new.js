'use strict';

var NewBooking = require('../../views/booking/new');
var request = require('superagent');
require('superagent-auth-bearer')(request);
var Cache = require('lscache');
var browserHistory = require('react-router').browserHistory;

var connect = require('react-redux').connect;

function mapStateToProps(state, ownProps) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        fetchBands: function() {
            dispatch(ACTIONS.ui.fetchBands());
            request.get(BASE_URL+'/api/admins')
            .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
            .end(function(err,res) {
                console.log("res.body admin assets: ", res.body);
                dispatch(ACTIONS.bands.setBands(res.body.bands));
                dispatch(ACTIONS.ui.fetchBandsComplete());
            });
        },
        createBookingRequest: function(details) {
            console.log("sending booking request: ", details);

            dispatch(ACTIONS.ui.fetchPostBooking());

            var sender = details.band;
            var receiver = details.venue;
            var originType = 'bands';

            var query = 'sender='+sender+'&receiver='+receiver+'&originType='+originType;

            //post booking request to api
            request.post(BASE_URL+'/api/booking?'+query)
                .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
                .send(details)
                .end(function(err, res) {

                    dispatch(ACTIONS.ui.fetchPostBookingComplete());

                    if (res.body.success) {
                        dispatch(ACTIONS.ui.createAlert('Booking sent!', 'success'));
                        browserHistory.replace('/messages');
                    } else {
                        dispatch(ACTIONS.ui.createAlert('Failed to send booking...', 'error'));
                    }
                });

            //on success
                //show alert
                //reroute to messages page

            //on error
                //show alert
                //stay on page with details


        }
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(NewBooking);
