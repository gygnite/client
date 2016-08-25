'use strict';
var Index = require('../views/index');
var connect = require('react-redux').connect;



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
