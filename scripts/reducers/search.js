'use strict';

var assign = require('object-assign');
var SEARCH = require('../actions/constants').SEARCH;

function search(state, action) {
    if (!state) {
        state = {
            genres: [],
            query: '',
            results: []
        };
    }
    switch (action.type) {
        case SEARCH.SET_RESULTS:
            return assign({}, state, {
                results: action.results
            });
            break;
        case SEARCH.CLEAR_RESULTS:
            return assign({}, state, {
                results: []
            });
            break;
        case SEARCH.ADD_GENRE:
            return assign({}, state, {
                genres: [...state.genres, action.genre]
            });
            break;
        case SEARCH.REMOVE_GENRE:
            return assign({}, state, {
                genres: [...state.genres.slice(0, action.index), ...state.genres.slice(action.index + 1)]
            });
            break;
        case SEARCH.CLEAR_GENRES:
        console.log("state on clear gens", state.genres);
            return assign({}, state, {
                genres: []
            });
            break;
        case SEARCH.SET_SEARCH_QUERY:
            return assign({}, state, {
                query: action.query
            });
            break;
        case SEARCH.CLEAR_SEARCH_QUERY:
            return assign({}, state, {
                query: ''
            });
            break;
        default: return state;
    }
    return state;
}


module.exports = search;
