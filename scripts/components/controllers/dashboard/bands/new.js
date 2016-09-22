'use strict';

//NewBandinclude view component here
var NewBand = require('../../../views/dashboard/bands/new');
var request = require('superagent');
require('superagent-auth-bearer');
var Cache = require('lscache');
var browserHistory = require('react-router').browserHistory;

var connect = require('react-redux').connect;

function mapStateToProps(state, ownProps) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        createBand: function(band) {

            // console.log("band.profileimage", band.profile_image);

            dispatch(ACTIONS.ui.fetchBands());

            request.post(BASE_URL+'/api/admins/bands')
                .send(band)
                .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
                .end(function(err, res) {
                    console.log("log err", err, res.body);

                    if (!err && !res.body.error) {
                        dispatch(ACTIONS.ui.createAlert(res.body.data.band.name + ' created successfully!', 'success'));
                        browserHistory.push('/dashboard');
                    } else{
                        //error
                        // FIXME: New Band Error
                        var message = 'Unable to create band.';
                        if (res.body.message) {
                            message = res.body.message;
                        }
                        dispatch(ACTIONS.ui.createAlert(message, 'error'));
                    }
                    dispatch(ACTIONS.ui.fetchBandsComplete());
                });
        }
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(NewBand);
