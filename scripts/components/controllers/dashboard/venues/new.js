'use strict';

var NewVenue = require('../../../views/dashboard/venues/new');
var request = require('superagent');
require('superagent-auth-bearer');
var Cache = require('lscache');
var browserHistory = require('react-router').browserHistory;
const CLOUDINARY_UPLOAD_PRESET = 'gygnite';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/gygnite/upload';

var connect = require('react-redux').connect;

function mapStateToProps(state, ownProps) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        createVenue: function(venue, image) {

            dispatch(ACTIONS.ui.fetchVenues());

            request.post(BASE_URL+'/api/admins/venues')
                .send(venue)
                .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
                .end(function(err, res) {
                    if (!err && !res.body.error) {
                        if (image) {
                            saveToCloud(image, res.body.data.venue.id);
                        } else {
                            finish(res.body.data.venue);
                        }
                    } else{
                        //error
                        // FIXME: New Band Error
                        var message = 'Unable to create venue.';
                        if (res.body.message) {
                            message = res.body.message;
                        }
                        dispatch(ACTIONS.ui.createAlert(message, 'error'));
                    }
                    dispatch(ACTIONS.ui.fetchVenuesComplete());
                });

            function saveToCloud(image, id) {
                request.post(CLOUDINARY_UPLOAD_URL)
                    .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                    .field('file', image)
                    .end(function(err, res) {
                        addImageToVenue(res.body.url, id);
                    });
            }

            function addImageToVenue(image, id) {
                request.post(BASE_URL+'/api/admins/venues/image')
                    .send({
                        image_url: image,
                        id: id
                    })
                    .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
                    .end(function(err, res) {
                        finish(res.body.venue);
                    });
            }

            function finish(band) {
                dispatch(ACTIONS.ui.createAlert(venue.name + ' created successfully!', 'success'));
                browserHistory.replace('/dashboard');
            }
        }
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(NewVenue);
