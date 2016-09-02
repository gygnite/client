var React = require('react');

var Input = React.createClass({
    render: function() {
        return (
            <div className="input-group">

                {this.props.children}
                <label htmlFor={this.props.for}>{this.props.label}</label>
                <span className="bar"></span>
            </div>
        )
    }
});

module.exports = Input;
