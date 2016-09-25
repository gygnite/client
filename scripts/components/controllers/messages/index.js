'use strict';

var Messages = require('../../views/messages/index');
var request = require('superagent');
require('superagent-auth-bearer')(request);
var Cache = require('lscache');
var connect = require('react-redux').connect;

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
                    setTimeout(function() {
                        dispatch(ACTIONS.messages.addMessage(message, receiver_slug, sender_slug))
                    }, 200);
                } else {
                    dispatch(ACTIONS.ui.createAlert('Message send failed.', 'error'));
                }
                dispatch(ACTIONS.ui.sendingMessageComplete());
                console.log("res!", res, err);
                // FIXME: what if error on message send?
            });
        }
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(Messages);
