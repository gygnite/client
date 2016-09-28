'use strict';

var VenueSearch = require('../../views/search/venue');
var request = require('superagent');

var connect = require('react-redux').connect;

function mapStateToProps(state, ownProps) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        fetchVenues: function(location) {
            var nw_lat = location.nw.lat;
            var nw_lng = location.nw.lng;

            var se_lat = location.se.lat;
            var se_lng = location.se.lng;

            var url = 'nw_lat='+nw_lat+'&nw_lng='+nw_lng+'&se_lat='+se_lat+'&se_lng='+se_lng;

            dispatch(ACTIONS.search.clearResults());

            request.get(BASE_URL+'/search/venues?'+url)
                .end(function(err, res) {
                    dispatch(ACTIONS.search.setResults(res.body.venues));
                });
        },
        setActiveHover: function(id) {
            dispatch(ACTIONS.search.setActiveHover(id));
        },
        clearActiveHover: function(id) {
            dispatch(ACTIONS.search.clearActiveHover(id));
        }
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(VenueSearch);
