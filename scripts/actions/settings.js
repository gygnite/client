
var SETTINGS = require('./constants').SETTINGS;

exports.login = function (user) {
    return {
        type: SETTINGS.SET_USER,
        user: user
    }
};
