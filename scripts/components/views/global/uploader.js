var React = require('react');
var ReactDOM = require('react-dom');
var Input = require('./input');


var Uploader = React.createClass({
    getInitialState: function() {
        return {
            fileInput: null,
            preview: ''
        }
    },
    _showUploadNew: function(e) {
        this.refs.uploadInput.click();
    },
    _handleUploadChange: function(e) {
        var inputVal = this.refs.uploadInput.value;
        this.setState({
            fileInput: inputVal.substring(inputVal.lastIndexOf('\\') + 1, inputVal.length)
        });
        this._previewResult();
    },
    _previewResult: function() {
        var preview = document.querySelector('img');
        var file    = document.querySelector('input[type=file]').files[0];
        var reader  = new FileReader();
        reader.addEventListener("load", function () {
            this.setState({
                preview: reader.result
            });
            this.props.saveImage(this.props.for, this.refs.uploadInput.files);
        }.bind(this), false);

        if (file) {
            reader.readAsDataURL(file);
        }
    },
    render: function() {
        return (
            <div className="uploader-input input-group text-present">
                <input
                    onChange={this._handleUploadChange}
                    style={{display:'none'}}
                    type="file"
                    ref="uploadInput"/>
                <button className="button submit upload-button" onClick={this._showUploadNew}>Upload a File</button>
                <img height="50" accept="image/*" className="image-preview" src={this.state.preview} alt="File Preview"/>
                <h3 className="file-name">{this.state.fileInput}</h3>
                <label htmlFor={this.props.for}>{this.props.label}</label>
                <span className="bar"></span>
            </div>
        )
    }
})

module.exports = Uploader;
