var React = require('react');
var cx = require('classnames');

var Input = React.createClass({
    propTypes: {
        handleUserInput: React.PropTypes.func.isRequired,
        className: React.PropTypes.string
    },
    getDefaultProps: function() {
        return {
            className: '',
            shouldValidate: false,
            placeholder: '+Tag'
        };
    },
    getInitialState: function() {
        return {
            textPresent: false,
            value: this.props.initialValue || '',
            tags: []
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
    _addTag: function(e) {
        var tags = this.state.tags;
        if (!e || (e.keyCode === 13 || e.charCode === 13) && this.state.value.trim() !== '') {
            tags.push(this.state.value);
            this.setState({
                value: '',
                tags: tags
            });
            //update parent tag field
            this.props.handleUserInput(this.props.for, this.state.tags);
        }

    },
    _removeTag: function(index) {
        var tags = this.state.tags;
        tags.splice(index, 1);
        this.setState({
            value: '',
            tags: tags
        });
        //update parent tag field
        this.props.handleUserInput(this.props.for, this.state.tags);
    },
    handleChange: function(e) {
        var value = this.refs[this.props.for].value;
        this.setState({
            value: value,
            textPresent: !!value
        });
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
        var tags = this.state.tags.map(function(tag, index) {
            return (
                <div key={'tag-'+index} className="tag">
                    {tag}
                    <i className="icon-error tag-close" onClick={this._removeTag.bind(this, index)}></i>
                </div>
            );
        }.bind(this));
        var enterIconStyle = {
            transform: 'translateX('+(100 + this.state.value.length*7)+'px)',
            zIndex: '0'
        };
        var inputIndexStyle = {
            zIndex: 1
        };
        return (
            <div className={this.props.className + " input-group text-present" + textPresent}>
                {tags}
                <input
                    placeholder={this.props.placeholder}
                    onKeyUp={this._addTag}
                    value={this.state.value}
                    onChange={this.handleChange}
                    ref={this.props.for}
                    type="text"
                    className="tag-input"
                    style={inputIndexStyle}/>
                <i className="icon-level-up enter-on-tag"
                    style={enterIconStyle}
                    onClick={this._addTag.bind(this, null)}>
                </i>
                <label htmlFor={this.props.for}>{this.props.label}</label>
                <span className="bar"></span>
            </div>
        )
    }
});

module.exports = Input;
