'use strict';

var Navbar = require('../../views/global/navbar');
var connect = require('react-redux').connect;
var request = require('superagent');
var Cache = require('lscache');
var assign = require('object-assign');
var browserHistory = require('react-router').browserHistory;


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
                    console.log("err?", err);
                    if (!err && res.body) {
                        dispatch(ACTIONS.user.setUser(
                            assign({}, res.body.user, {
                                token: res.body.token
                            })
                        ));
                    }
                    dispatch(ACTIONS.ui.fetchUserComplete());
                });
        },
        login: function(user) {
            dispatch(ACTIONS.ui.fetchUser());
            dispatch(ACTIONS.ui.keepModal());
            request.post(BASE_URL+'/auth/login')
                .send(user)
                .end(function(err, res) {
                    dispatch(ACTIONS.ui.fetchUserComplete());
                    //if err, set err state
                    //else set user
                    if (err || res.status === 401) {
                        //show err state
                        console.log("invalid user");
                        console.error(res.body);
                        console.log("here?? ")
                        dispatch(ACTIONS.ui.createAlert('Login failed', 'error'));
                        dispatch(ACTIONS.user.clearUser());
                        Cache.remove(ACTIONS.cache.AUTH_TOKEN);
                        Cache.remove(ACTIONS.cache.USER);
                    } else {
                        Cache.set(ACTIONS.cache.AUTH_TOKEN, res.body.token);
                        Cache.set(ACTIONS.cache.USER, res.body.user);
                        dispatch(ACTIONS.user.setUser(
                            assign({}, res.body.user, {
                                token: res.body.token
                            })
                        ));
                        dispatch(ACTIONS.ui.closeModal());
                        dispatch(ACTIONS.ui.createAlert('Login successful', 'success'));

                        browserHistory.push('/dashboard');
                    }
                });
        },
        signup: function(user) {
            dispatch(ACTIONS.ui.fetchUser());
            dispatch(ACTIONS.ui.keepModal());
            request.post(BASE_URL+'/auth/signup')
                .send(user)
                .end(function(err, res) {
                    dispatch(ACTIONS.ui.fetchUserComplete());
                    if (err || res.status > 399) {
                        if (res.body.message) {
                            console.error(res.body.message);
                            dispatch(ACTIONS.ui.createAlert(res.body.message, 'error'));
                        }
                    } else {
                        // FIXME:50 SEND TO REGISTRATION PAGE
                            //User should check email
                        dispatch(ACTIONS.ui.closeModal());
                        dispatch(ACTIONS.ui.createAlert(res.body.message, 'success'));
                    }
                });
        }
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(Navbar);
