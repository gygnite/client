var combineReducers = require('redux').combineReducers;

var user = require('./user');
var ui = require('./ui');
var settings = require('./settings');

module.exports = combineReducers({
    user: user,
    ui: ui,
    settings: settings
});
