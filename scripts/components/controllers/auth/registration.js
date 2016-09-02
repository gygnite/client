'use strict';

//Registrationinclude view component here
var RegistrationView = require('../../views/auth/registration');
var connect = require('react-redux').connect;
var request = require('superagent');


function mapStateToProps(state, ownProps) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        fetchRegistration: function() {
            //dispatch action to show loader
            dispatch(ACTIONS.ui.fetchRegistration());

            //then send request
            setTimeout(function() {
                dispatch(ACTIONS.ui.fetchRegistrationComplete('success'));
            }, 3000);
                //on res,
                    //dispatch action to remove loader
                    //dispatch action to show success or failure
            // request.post(BASE_URL+"/auth/register")
        }
    }
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistrationView);
