'use strict';
var Index = require('../views/index');
var connect = require('react-redux').connect;

//connect to sockets
// var io = require('socket.io-client')(BASE_URL);



function mapStateToProps(state, ownProps) {
    return state;
}


function mapDispatchToProps(dispatch) {
    return {
        things: function(stuff) {
            // do things
        }
    }
}





module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(Index);
