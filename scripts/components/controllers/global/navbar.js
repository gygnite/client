'use strict';

var Navbar = require('../../views/global/navbar');

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
)(Navbar);
