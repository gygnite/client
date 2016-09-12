'use strict';

var BANDS = require('./constants').BANDS;

exports.setBands = function (bands) {
    return {
        type: BANDS.SET_BANDS,
        bands: bands //array
    }
};
