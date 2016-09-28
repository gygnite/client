'use strict';

var NewBooking = require('../../views/booking/new');
var request = require('superagent');
require('superagent-auth-bearer')(request);
var Cache = require('lscache');
var browserHistory = require('react-router').browserHistory;
var notify = require('../../../notifier');


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
                dispatch(ACTIONS.bands.setBands(res.body.bands));
                dispatch(ACTIONS.ui.fetchBandsComplete());
            });
        },
        createBookingRequest: function(details) {

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
                        var message = res.body.message;
                        var sender_slug = message.sender_slug;
                        var receiver_slug = (sender_slug === message.band_slug) ? message.venue_slug : message.band_slug;
                        dispatch(ACTIONS.ui.createAlert('Booking sent!', 'success'));
                        dispatch(ACTIONS.messages.emitMessage(message, receiver_slug, sender_slug));
                        sendNotification('New booking request from ' + details.band_name, details.venue_slug);
                        browserHistory.replace('/messages');
                    } else {
                        dispatch(ACTIONS.ui.createAlert('Failed to send booking...', 'error'));
                    }
                });

            function sendNotification(text, slug_to_notify) {
                notify('booking', text, slug_to_notify)
                .then(function(res) {
                    res.data.notifs.forEach(function(notif){
                        dispatch(ACTIONS.ui.emitNotification({
                            type: 'booking',
                            text: text,
                            slug: slug_to_notify,
                            id: notif.id
                        }));
                    });
                }).catch(function(err) {
                    //handle error sending notification
                    // FIXME: Notificatin in message
                    console.error('err sending notif', err);
                });
            }
        }
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(NewBooking);
