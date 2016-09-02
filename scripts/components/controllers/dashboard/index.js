'use strict';

//Dashboardinclude view component here
var Dashboard = require('../../views/dashboard/index');

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
)(Dashboard);
