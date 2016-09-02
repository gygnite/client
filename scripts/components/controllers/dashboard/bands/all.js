'use strict';

//Bandsinclude view component here
var Bands = require('../../../views/dashboard/bands/all');

var connect = require('react-redux').connect;

function mapStateToProps(state, ownProps) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {}
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(Bands);
