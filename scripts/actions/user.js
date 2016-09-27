//user actions

var USER = require('./constants').USER;


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

exports.logout = function() {
    return {
        type: USER.LOGOUT_USER
    }
}
