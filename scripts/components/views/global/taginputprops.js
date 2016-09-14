var React = require('react');
var cx = require('classnames');

var TagInputProps = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        tags: React.PropTypes.array
    },
    getDefaultProps: function() {
        return {
            className: '',
            shouldValidate: false,
            placeholder: '+Tag',
            tags: []
        };
    },
    getInitialState: function() {
        return {
            textPresent: false,
            value: ''
        }
    },
    _addTag: function(e) {
        if ((e.keyCode === 13 || e.charCode === 13) && this.state.value.trim() !== '') {
            this.props.addTag(this.state.value);
            this.setState({
                value: ''
            });
        }
    },
    _removeTag: function(index) {
        this.props.removeTag(index);
    },
    _handleChange: function(e) {
        this.setState({
            value: e.target.value
        });
    },
    render: function() {
        var textPresent = cx({
            ' text-present': this.state.textPresent
        });
        var tags = this.props.tags.map(function(tag, index) {
            return (
                <div key={'tag-'+index} className="tag">
                    {tag}
                    <i className="icon-error tag-close" onClick={this._removeTag.bind(this, index)}></i>
                </div>
            );
        }.bind(this));
        return (
            <div className={this.props.className + " input-group text-present" + textPresent}>
                {tags}
                <input
                    placeholder={this.props.placeholder}
                    onKeyUp={this._addTag}
                    onChange={this._handleChange}
                    value={this.state.value}
                    type="text"
                    className="tag-input"/>
                <label htmlFor={this.props.for}>{this.props.label}</label>
                <span className="bar"></span>
            </div>
        )
    }
});

module.exports = TagInputProps;
