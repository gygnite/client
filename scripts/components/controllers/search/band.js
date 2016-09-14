'use strict';

//BandSearchesinclude view component here

var BandSearch = require('../../views/search/band');
var connect = require('react-redux').connect;
var request = require('superagent');
var Cache = require('lscache');

function mapStateToProps(state, ownProps) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        fetchBands: function(input, genres) {

            // save search to local storage
            Cache.set('band_search', {
                query: input,
                genres: genres
            });

            dispatch(ACTIONS.ui.fetchBands());

            //normalize
            genres = (!genres) ? [] : genres;
            input = (input) ? input = 'q='+encodeURI(input) : '';

            //split genres and join with genre=*&
            genres = genres.map(function(g) {
                return 'genre='+g
            }).join('&');

            var url = input + '&' + genres;

            request.get(BASE_URL+'/search/bands?'+url)
                .end(function(err, res) {
                    console.log("RESPONSE: ", res);
                    dispatch(ACTIONS.search.setResults(res.body.bands));
                    dispatch(ACTIONS.ui.fetchBandsComplete());
                });
        },
        addGenre: function(genre) {
            dispatch(ACTIONS.search.addGenre(genre));
        },
        removeGenre: function(index) {
            dispatch(ACTIONS.search.removeGenre(index));
        },
        clearGenres: function() {
            dispatch(ACTIONS.search.clearGenres());
        },
        updateSearchQuery: function(input) {
            console.log("is there no fucking input???????", input)
            dispatch(ACTIONS.search.setSearchQuery(input));
        }
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(BandSearch);
