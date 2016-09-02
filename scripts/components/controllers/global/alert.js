'use strict';

//Alertinclude view component here
var Alert = require('../../views/global/alert');

var connect = require('react-redux').connect;

function mapStateToProps(state, ownProps) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        removeAlert: function() {
            dispatch(ACTIONS.ui.removeAlert());
        }
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(Alert);
