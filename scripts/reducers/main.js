var combineReducers = require('redux').combineReducers;

var user = require('./user');

module.exports = combineReducers({
    user: user
});
