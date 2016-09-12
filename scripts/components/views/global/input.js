var React = require('react');
var cx = require('classnames');

var Input = React.createClass({
    propTypes: {
        handleUserInput: React.PropTypes.func.isRequired,
        className: React.PropTypes.string
    },
    getDefaultProps: function() {
        return {
            className: ''
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
                textPresent: true
            });
        }
    },
    handleChange: function(e) {
        // console.log("changing", this.refs[this.props.for].value);
        var value = this.refs[this.props.for].value;
        this.setState({
            value: value,
            textPresent: !!value
        });

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
