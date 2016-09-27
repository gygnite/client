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
var bookings     = require('./bookings');

var appReducer = combineReducers({
    user: user,
    ui: ui,
    dashboard: dashboard,
    bands: bands,
    venues: venues,
    profile: profile,
    search: search,
    messages: messages,
    bookings: bookings
});

module.exports = function(state, action) {
    if (action.type === 'LOGOUT_USER') {
        state = undefined;
    }
    return appReducer(state, action);
}
