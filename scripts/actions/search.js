'use strict';

var SEARCH = require('./constants').SEARCH;

exports.setResults = function (results) {
    return {
        type: SEARCH.SET_RESULTS,
        results: results
    }
};

exports.clearResults = function (results) {
    return {
        type: SEARCH.CLEAR_RESULTS
    }
};


// SET_RESULTS: 'SET_RESULTS',
// CLEAR_RESULTS: 'CLEAR_RESULTS',
// ADD_GENRE: 'ADD_GENRE',
// REMOVE_GENRE: 'REMOVE_GENRE',
// CLEAR_GENRES: 'CLEAR_GENRES',
// ADD_GENRE: 'ADD_GENRE',
// SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
// CLEAR_SEARCH_QUERY: 'CLEAR_SEARCH_QUERY'

exports.addGenre = function (genre) {
    console.log("genre!",genre);
    return {
        type: SEARCH.ADD_GENRE,
        genre: genre
    }
};

exports.removeGenre = function (index) {
    return {
        type: SEARCH.REMOVE_GENRE,
        index: index
    }
};

exports.clearGenres = function () {
    return {
        type: SEARCH.CLEAR_GENRES
    }
};

exports.setSearchQuery = function (query) {
    return {
        type: SEARCH.SET_SEARCH_QUERY,
        query: query
    }
};

exports.clearSearchQuery = function() {
    return {
        type: SEARCH.CLEAR_SEARCH_QUERY
    }
};


exports.setActiveHover = function (id) {
    return {
        type: SEARCH.SET_ACTIVE_HOVER,
        id: id
    }
};

exports.clearActiveHover = function (id) {
    return {
        type: SEARCH.CLEAR_ACTIVE_HOVER,
        id: id
    }
};
