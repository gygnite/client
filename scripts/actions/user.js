//user actions

var USER = require('./constants').USER;


exports.things = function (stuff) {
    //do things
};

exports.setUser = function (user) {
    return {
        type: USER.SET_USER,
        user: user
    }
};

exports.clearUser = function () {
    return {
        type: USER.CLEAR_USER,
        user: {}
    }
};
