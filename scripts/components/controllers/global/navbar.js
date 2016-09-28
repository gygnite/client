'use strict';

var Navbar = require('../../views/global/navbar');
var connect = require('react-redux').connect;
var request = require('superagent');
require('superagent-auth-bearer')(request);
var Cache = require('lscache');
var assign = require('object-assign');
var browserHistory = require('react-router').browserHistory;


function mapStateToProps(state, ownProps) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        getUser: function(token) {
            var user = Cache.get(ACTIONS.cache.USER);
            var token = Cache.get(ACTIONS.cache.AUTH_TOKEN);
            if (user) {
                dispatch(ACTIONS.user.setUser(
                    assign({}, user, {
                        token: token
                    })
                ));
                return;
            }

            dispatch(ACTIONS.ui.fetchUser());
            request.get(BASE_URL + '/auth')
                .authBearer(token)
                .end(function(err, res) {
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
                        console.error(res.body);
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
        },
        fetchNotifications: function() {
            dispatch(ACTIONS.ui.fetchNotifications());
            request.get(BASE_URL+'/api/admins/notifications')
                .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
                .end(function(err, res) {
                    if (!err && !res.body.error) {
                        dispatch(ACTIONS.ui.setNotifications(res.body.notifications));
                    }
                    dispatch(ACTIONS.ui.fetchNotificationsComplete());
                });
        },
        markNotificationsAsRead: function(notification_id) {
            request.put(BASE_URL+'/api/admins/notifications')
                .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
                .send({
                    notification: notification_id
                })
                .end(function(err, res) {
                    if (!err && !res.body.error) {
                        // FIXME: Notification err?
                        dispatch(ACTIONS.ui.setNotificationAsRead(res.body.notification));
                    }
                });
        },
        logout: function() {
            dispatch(ACTIONS.user.logout());
            dispatch(ACTIONS.ui.createAlert('Successfully logged out.', 'success'));
            Cache.flush();
            browserHistory.replace('/');
        }
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(Navbar);
