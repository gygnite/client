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
            request.get(BASE_URL+'/api/messages')
            .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
            .end(function(err, res) {
                if (res.body && res.body.success) {
                    dispatch(ACTIONS.messages.setInboxes(res.body.data));
                } else {

                }
            });
        },
        setActiveInbox: function(slug) {
            dispatch(ACTIONS.messages.setActiveInbox(slug));
        },
        setActiveMessageGroup: function(slug) {
            dispatch(ACTIONS.messages.setActiveMessageGroup(slug));
        }
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(Messages);
