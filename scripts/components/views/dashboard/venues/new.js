var React = require('react');
var Input = require('../../global/input');
var TextArea = require('../../global/textarea');
var TagInput = require('../../global/taginput');
var Geosuggest = require('react-geosuggest').default;
var Joi = require('joi-browser');

var NewVenue = React.createClass({
    getInitialState: function() {
        return {
            form: {},
            errors: []
        }
    },
    handleInput: function(field, value) {
        var state = this.state;
        state.form[field] = value;
        this.setState(state);
    },
    captureLocation: function(location) {
        var state = this.state;
        state.form['location'] = location;
        this.setState(state);
    },
    _createVenue: function() {
        var errors = [];
        console.log("this state form: ", this.state.form);

        if (!this.state.form.hasOwnProperty('name')) {
            errors.push('You must include a venue name');
        }
        if (!this.state.form.location) {
            errors.push('Please choose a valid input from the location dropdown.');
        }
        if (this.state.form.location) {
            if (!this.state.form.location.location.hasOwnProperty('lat')
                || !this.state.form.location.location.hasOwnProperty('lng')
                || !this.state.form.location.hasOwnProperty('placeId')) {
                    errors.push('Please choose a valid input from the location dropdown.')
                }
        }

        if (errors.length < 1) {
            this.props.createVenue(this.state.form);
        } else {
            console.log("validation errors", errors);
            this.setState({
                errors: errors
            });
            window.scrollTo(0, 0);
        }

    },
    componentDidMount: function() {
        window.scrollTo(0, 0);
    },
    render: function() {
        var button = (
            <div onClick={this._createVenue} className="button submit">
                <h3>Create my venue!</h3>
            </div>
        );
        if (this.props.ui.isFetchingVenues) {
            button = (
                <div className="button submit loader">
                    <i className="loader icon-loader animate-spin"></i>
                </div>
            );
        }
        var errors = this.state.errors.map(function(err, index) {
            return (
                <div key={"err-"+index} className="errors">
                    <div className="err">{err}</div>
                </div>
            );
        });
        return (
            <div className="container">
                <h1 className="headline">New Venue</h1>
                {errors}
                <div className="new-band-form">

                    <section className="new-band-section">
                        <h1>About</h1>
                    </section>

                    <Input
                        for="name"
                        label="* Name"
                        handleUserInput={this.handleInput}>
                        <input type="text"/>
                    </Input>

                    <TextArea
                        for="bio"
                        label="Biography"
                        handleUserInput={this.handleInput} />

                    <section className="new-band-section">
                        <h1>Details</h1>
                    </section>

                    <Input
                        for="location"
                        label="* Location (Address)"
                        className="text-present"
                        handleUserInput={this.handleInput}>
                        <Geosuggest
                            placeholder="Address"
                            onSuggestSelect={this.captureLocation}
                            types={['address']}
                            queryDelay={150}/>
                    </Input>

                    <Input
                        for="capacity"
                        label="Capacity"
                        handleUserInput={this.handleInput}>
                        <input type="text"/>
                    </Input>

                    <section className="new-band-section">
                        <h1>Social Media</h1>
                    </section>

                    <Input
                        for="website_url"
                        label="Website"
                        handleUserInput={this.handleInput}>
                        <input type="text" />
                    </Input>
                    <Input
                        for="facebook_url"
                        label="Facebook"
                        handleUserInput={this.handleInput}>
                        <input type="text" />
                    </Input>

                    {button}

                </div>
            </div>
        )
    }
});

module.exports = NewVenue;
