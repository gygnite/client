var React = require('react');
var Input = require('../../global/input');

var NewBand = React.createClass({
    handleInput: function(field, value) {
        console.log("changed", field, value);
    },
    render: function() {
        return (
            <div className="container">
                <h1>New Band Form</h1>
                <div className="new-band-form">
                    <Input
                        for="band"
                        label="Name"
                        initialValue="stuff"
                        handleUserInput={this.handleInput}>
                        <input type="text"/>
                    </Input>
                    <Input
                        for="bio"
                        label="Bio"
                        handleUserInput={this.handleInput}>
                        <input type="text"/>
                    </Input>
                    <Input
                        for="bio"
                        label="Bio"
                        handleUserInput={this.handleInput}>
                        <input type="text" />
                    </Input>
                </div>
            </div>
        )
    }
});

module.exports = NewBand;
