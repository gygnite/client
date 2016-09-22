var combineReducers = require('redux').combineReducers;

var user        = require('./user');
var ui          = require('./ui');
var settings    = require('./settings');
var dashboard   = require('./dashboard');
var bands       = require('./bands');
var venues      = require('./venues');
var profile     = require('./profile');
var search      = require('./search');
var messages    = require('./messages');

module.exports = combineReducers({
    user: user,
    ui: ui,
    settings: settings,
    dashboard: dashboard,
    bands: bands,
    venues: venues,
    profile: profile,
    search: search,
    messages: messages
});
