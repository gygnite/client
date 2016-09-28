var React = require('react');
var cx = require('classnames');
var Joi = require('joi-browser');

var Input = React.createClass({
    propTypes: {
        handleUserInput: React.PropTypes.func.isRequired,
        className: React.PropTypes.string,
        shouldValidate: React.PropTypes.bool
    },
    getDefaultProps: function() {
        return {
            className: '',
            shouldValidate: false
        };
    },
    getInitialState: function() {
        return {
            textPresent: false,
            value: this.props.initialValue
        }
    },
    componentDidMount: function() {
        //check if has content on mount
        if (this.props.initialValue) {
            this.setState({
                textPresent: true,
                value: this.props.initialValue
            });
        }
    },
    handleChange: function(e) {
        var value = this.refs[this.props.for].value;
        this.setState({
            value: value,
            textPresent: !!value
        });

        //handleValidate
        if (this.props.shouldValidate) {

        }

        this.props.handleUserInput(this.props.for, value);
    },
    mapChildren: function(child) {
        return React.cloneElement(child, {
            onChange: this.handleChange,
            ref: this.props.for,
            value: this.state.value || ''
        });
    },
    render: function() {
        var children = React.Children.map(this.props.children, this.mapChildren);
        var textPresent = cx({
            ' text-present': this.state.textPresent
        });
        return (
            <div className={this.props.className + " input-group" + textPresent}>
                {children}
                <label htmlFor={this.props.for}>{this.props.label}</label>
                <span className="bar"></span>
            </div>
        )
    }
});

module.exports = Input;












var validPassword = Joi.string().regex(/^(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/g).required();
var loginSchema = Joi.object().keys({
    email: Joi.string().email().required().label('Email'),
    password: validPassword
});

var signupSchema = Joi.object().keys({
    email: Joi.string().email().required().regex(/^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/igm).label('Email'),
    password: validPassword,
    first_name: Joi.string().required(),
    last_name: Joi.string().required()
});
