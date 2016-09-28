'use strict';

var Messages = require('../../views/messages/index');
var request = require('superagent');
require('superagent-auth-bearer')(request);
var Cache = require('lscache');
var connect = require('react-redux').connect;
var notify = require('../../../notifier');

function mapStateToProps(state, ownProps) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAllInboxes: function() {
            dispatch(ACTIONS.ui.fetchMessages());
            request.get(BASE_URL+'/api/messages')
            .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
            .end(function(err, res) {
                if (res.body && res.body.success) {
                    dispatch(ACTIONS.messages.setInboxes(res.body.data));
                } else {

                }
                dispatch(ACTIONS.ui.fetchMessagesComplete());
            });
        },
        setActiveInbox: function(slug) {
            dispatch(ACTIONS.messages.setActiveInbox(slug));
        },
        setActiveMessageGroup: function(slug) {
            dispatch(ACTIONS.messages.setActiveMessageGroup(slug));
        },
        markGroupAsRead: function(group) {
            var group_slug = group.identity.slug;
            dispatch(ACTIONS.messages.markGroupAsRead(group_slug));
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
)(Messages);
