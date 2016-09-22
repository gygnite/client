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
        case SEARCH.SET_ACTIVE_HOVER:
            var items = state.results.map(function(item) {
                if (item.id === action.id) {
                    return marker(item, action);
                } else {
                    return marker(item, SEARCH.CLEAR_ACTIVE_HOVER);
                }
            });
            return assign({}, state, {
                results: items
            });
            break;
        case SEARCH.CLEAR_ACTIVE_HOVER:
            var items = state.results.map(function(item) {
                if (item.id === action.id) {
                    return marker(item, action);
                } else {
                    return item;
                }
            });
            return assign({}, state, {
                results: items
            });
            break;
        default: return state;
    }
    return state;
}


module.exports = search;




function marker(state, action) {
    if (!state) {
        state = {};
    }
    switch(action.type) {
        case SEARCH.SET_ACTIVE_HOVER:
            return assign({}, state, {
                isActive: true
            });
            break;
        case SEARCH.CLEAR_ACTIVE_HOVER:
            return assign({}, state, {
                isActive: false
            });
            break;
        default: return state;
    }

    return state;
}
