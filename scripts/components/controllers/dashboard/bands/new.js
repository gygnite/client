'use strict';

//NewBandinclude view component here
var NewBand = require('../../../views/dashboard/bands/new');

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
)(NewBand);
