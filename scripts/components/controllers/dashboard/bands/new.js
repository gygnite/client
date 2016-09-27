'use strict';

//NewBandinclude view component here
var NewBand = require('../../../views/dashboard/bands/new');
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
        createBand: function(band, image) {

            dispatch(ACTIONS.ui.fetchBands());

            request.post(BASE_URL+'/api/admins/bands')
                .send(band)
                .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
                .end(function(err, res) {
                    console.log("log err", err, res.body);

                    if (!err && !res.body.error) {
                        if (image) {
                            saveToCloud(image, res.body.data.band.id);
                        } else {
                            finish(res.body.data.band);
                        }
                    } else{
                        var message = 'Unable to create band.';
                        if (res.body.message) {
                            message = res.body.message;
                        }
                        dispatch(ACTIONS.ui.createAlert(message, 'error'));
                    }
                    dispatch(ACTIONS.ui.fetchBandsComplete());
                });

            function saveToCloud(image, id) {
                request.post(CLOUDINARY_UPLOAD_URL)
                    .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                    .field('file', image)
                    .end(function(err, res) {
                        // FIXME: handle cloudinary upload error
                        addImageToBand(res.body.url, id);
                    });
            }

            function addImageToBand(image, id) {
                request.post(BASE_URL+'/api/admins/bands/image')
                    .send({
                        image_url: image,
                        id: id
                    })
                    .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
                    .end(function(err, res) {
                        finish(res.body.band);
                    });
            }

            function finish(band) {
                dispatch(ACTIONS.ui.createAlert(band.name + ' created successfully!', 'success'));
                browserHistory.replace('/dashboard');
            }
        }
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(NewBand);
