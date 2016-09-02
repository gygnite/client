'use strict';

//Templateinclude view component here
var Template = require('../../template');
var connect = require('react-redux').connect;
var request = require('superagent');
require('superagent-auth-bearer')(request);
var assign = require('object-assign');

function mapStateToProps(state, ownProps) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        getUser: function(token) {
            dispatch(ACTIONS.ui.fetchUser());
            request.get(BASE_URL + '/auth')
                .authBearer(token)
                .end(function(err, res) {
                    dispatch(ACTIONS.user.setUser(
                        assign({}, res.body.user, {
                            token: res.body.token
                        })
                    ));
                    dispatch(ACTIONS.ui.fetchUserComplete());
                });
        }
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(Template);
