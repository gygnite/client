var React = require('react');
var cx = require('classnames');

var TextArea = React.createClass({
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
            value: this.props.initialValue,
            autoHeight: 50
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
        var scrollHeight = (e.target.scrollHeight < 50) ? 50 :e.target.scrollHeight;
        if (!e.target.value) {
            scrollHeight = 50;
        }

        var value = this.refs[this.props.for].value;
        this.setState({
            value: value,
            textPresent: !!value,
            autoHeight: scrollHeight
        });

        this.props.handleUserInput(this.props.for, value);
    },    
    render: function() {
        var textPresent = cx({
            ' text-present': this.state.textPresent
        });
        return (
            <div className={this.props.className + " input-group" + textPresent}>
                <textarea
                    onChange={this.handleChange}
                    ref={this.props.for}
                    style={{height: this.state.autoHeight + 'px'}}>
                    {this.state.value}
                </textarea>
                <label htmlFor={this.props.for}>{this.props.label}</label>
                <span className="bar"></span>
            </div>
        )
    }
});

module.exports = TextArea;
