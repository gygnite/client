var React = require('react');
var cx = require('classnames');

var Registration = React.createClass({

    componentWillMount: function() {
        //request data
        var code = this.props.params.code;

        // FIXME: What if no code?

        this.props.fetchRegistration(code); //call action to show spinner
    },

    render: function() {
        var view = null;
        if (this.props.ui.isFetchingRegistration) {
            view = (
                <div className="loading">
                    <i className="loader icon-loader animate-spin"></i>
                </div>
            )
        } else {
            view = (
                <div className="registration-status">
                    <h1>Registration Status Complete!</h1>
                </div>
            )
        }



        return (
            <div className="registration">
                {view}
            </div>
        )
    }
})

module.exports = Registration;
