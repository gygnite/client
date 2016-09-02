var React = require('react');
var Input = require('../../global/input');

var NewBand = React.createClass({
    render: function() {
        return (
            <div className="container">
                <h1>New Band Form</h1>
                <div className="new-band-form">
                    <Input for="band_label" label="Band Name">
                        <input type="text" required/>
                    </Input>
                </div>
            </div>
        )
    }
});

module.exports = NewBand;
