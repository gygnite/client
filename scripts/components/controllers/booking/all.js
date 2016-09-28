'use strict';

var AllBookings = require('../../views/booking/all');
var connect = require('react-redux').connect;
var request = require('superagent');
require('superagent-auth-bearer')(request);
var Cache = require('lscache');
var notify = require('../../../notifier');


function mapStateToProps(state, ownProps) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        fetchTimeslots: function() {
            request.get(BASE_URL+'/api/booking')
                .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
                .end(function(err, res) {
                    dispatch(ACTIONS.dashboard.setPending(res.body.bands, res.body.venues));
                });
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
                        dispatch(ACTIONS.dashboard.removePending(vid, bid));
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
                        dispatch(ACTIONS.dashboard.removePending(vid, bid));
                        dispatch(ACTIONS.ui.createAlert('Rejected', 'success'));
                    } else {
                        // FIXME: Error set rejected response
                        dispatch(ACTIONS.ui.createAlert('Failed to set to rejected.', 'success'));
                    }
                });
        },
        sendMessage: function(content, type, receiver_id, sender_id) {
            dispatch(ACTIONS.ui.sendingMessage());
            request.post(BASE_URL+'/api/messages/')
            .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
            .send({
                content: content,
                type: type,
                receiver_id: receiver_id,
                sender_id: sender_id
            }).end(function(err, res) {
                if (!err && !res.body.error) {
                    var message = res.body.message;
                    var sender_slug = message.sender_slug;
                    var receiver_slug = (sender_slug === message.band_slug) ? message.venue_slug : message.band_slug;
                    var sender_name = (sender_slug === message.band_slug) ? message.band_name : message.venue_name;
                    dispatch(ACTIONS.messages.emitMessage(message, receiver_slug, sender_slug));
                    dispatch(ACTIONS.messages.addMessage(message, receiver_slug, sender_slug));
                    sendNotification('New message from ' + sender_name, receiver_slug);
                    dispatch(ACTIONS.ui.createAlert('Message sent successfully!', 'success'));
                } else {
                    dispatch(ACTIONS.ui.createAlert('Message send failed.', 'error'));
                }
                dispatch(ACTIONS.ui.sendingMessageComplete());
                // FIXME: what if error on message send?
            });

            //emit notification function
            function sendNotification(text, slug_to_notify) {
                notify('message', text, slug_to_notify)
                .then(function(res) {
                    res.data.notifs.forEach(function(notif){
                        dispatch(ACTIONS.ui.emitNotification({
                            type: 'message',
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
)(AllBookings);
