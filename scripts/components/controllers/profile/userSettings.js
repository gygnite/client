'use strict';

var UserSettings = require('../../views/profile/userSettings');
var Cache = require('lscache');
var assign = require('object-assign');
var request = require('superagent');
require('superagent-auth-bearer')(request);

const CLOUDINARY_UPLOAD_PRESET = 'gygnite';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/gygnite/upload';

var connect = require('react-redux').connect;

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
        saveProfileImage: function(image) {
            var user = Cache.get(ACTIONS.cache.USER);
            request.post(CLOUDINARY_UPLOAD_URL)
                .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                .field('file', image)
                .end(function(err, res) {
                    // FIXME: handle cloudinary upload error
                    saveToUser(res.body.url);
                });


            function saveToUser(profile_image) {
                var token = Cache.get(ACTIONS.cache.AUTH_TOKEN);
                request.put(BASE_URL + '/api/users/image')
                    .authBearer(token)
                    .send({
                        profile_image: profile_image
                    }).end(function(err, res) {
                        if (!err && res.body.profile_image) {
                            dispatch(ACTIONS.user.setUser(
                                assign({}, user, {
                                    profile_image: res.body.profile_image
                                })
                            ));
                            dispatch(ACTIONS.ui.createAlert('Image Saved!', 'success'));
                            user.profile_image = res.body.profile_image;
                            Cache.set(ACTIONS.cache.USER, user);
                        } else {
                            dispatch(ACTIONS.ui.createAlert('Update Failed... Please try again.', 'error'));
                        }

                    });
            }
        },
        updateUser: function(user) {
            delete user.token;
            var token = Cache.get(ACTIONS.cache.AUTH_TOKEN);
            request.put(BASE_URL+'/api/users')
                .authBearer(token)
                .send(user)
                .end(function(err, res) {
                    if (!err && res.body.user) {
                        dispatch(ACTIONS.user.setUser(res.body.user));
                        Cache.set(ACTIONS.cache.USER, res.body.user);
                        dispatch(ACTIONS.ui.createAlert('Update Successful!', 'success'));
                    } else {
                        dispatch(ACTIONS.ui.createAlert('Update Failed... Please try again.', 'error'));
                    }
                });
        },
        fetchAdminAssets: function() {
            dispatch(ACTIONS.ui.fetchBands());
            dispatch(ACTIONS.ui.fetchVenues());
            request.get(BASE_URL+'/api/admins')
            .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
            .end(function(err,res) {
                dispatch(ACTIONS.bands.setBands(res.body.bands));
                dispatch(ACTIONS.venues.setVenues(res.body.venues));
                dispatch(ACTIONS.ui.fetchBandsComplete());
                dispatch(ACTIONS.ui.fetchVenuesComplete());
            });
        },
        logout: function() {
            dispatch(ACTIONS.user.logout());
            Cache.flush();
            browserHistory.push('/');
        },
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(UserSettings);
