'use strict';

var NewVenue = require('../../../views/dashboard/venues/new');
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
        createVenue: function(band) {

            dispatch(ACTIONS.ui.fetchVenues());

            request.post(BASE_URL+'/api/admins/venues')
                .send(band)
                .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
                .end(function(err, res) {
                    if (!err && !res.body.error) {
                        dispatch(ACTIONS.ui.createAlert(res.body.data.venue.name + ' created successfully!', 'success'));
                        browserHistory.push('/dashboard');
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
        }
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(NewVenue);
