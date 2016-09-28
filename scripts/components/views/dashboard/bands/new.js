var React = require('react');
var Input = require('../../global/input');
var TextArea = require('../../global/textarea');
var TagInput = require('../../global/taginput');
var Uploader = require('../../global/uploader');
var Geosuggest = require('react-geosuggest').default;
var Joi = require('joi-browser');
var Dropzone = require('react-dropzone');


var NewBand = React.createClass({
    getInitialState: function() {
        return {
            form: {},
            errors: [],
            image: {
                preview: null
            },
        }
    },
    handleInput: function(field, value) {
        var state = this.state;
        state.form[field] = value;
        this.setState(state);
        this._validate(field);
    },
    captureLocation: function(location) {
        var state = this.state;
        state.form['location'] = location;
        this.setState(state);
        this._validate('location');
    },
    _validate: function(field) {
        var errors = this.state.errors;
        switch (field) {
            case 'location':
                if (this.state.form.location && this.state.form.location.location) {
                    errors = errors.filter(function(err) {
                        return err.type !== 'location';
                    });
                }
                break;
            case 'name':
                if (this.refs[field].refs[field].value.trim()) {
                    errors = errors.filter(function(err) {
                        return err.type !== 'name';
                    });
                }
                break;
            case 'genres':
                if (this.state.form.genres.length > 0) {
                    errors = errors.filter(function(err) {
                        return err.type !== 'genre';
                    });
                }
                break;
            default: break;
        }
        this.setState({
            errors: errors
        });
    },
    _createBand: function() {

        var errors = [];

        if (!this.state.form.name) {
            errors.push({
                type: 'name',
                message: 'You must include a band name'
            });
        }
        if (!this.state.form.location) {
            errors.push({
                type: 'location',
                message: 'Please choose a valid input from the location dropdown.'
            });
        }
        if (this.state.form.location) {
            if (!this.state.form.location.location.hasOwnProperty('lat')
                || !this.state.form.location.location.hasOwnProperty('lng')
                || !this.state.form.location.hasOwnProperty('placeId')) {
                    errors.push({
                        type: 'location',
                        message: 'Please choose a valid input from the location dropdown.'
                    });
                }
        }
        if (!this.state.form.genres || this.state.form.genres.length < 1) {
            errors.push({
                type: 'genre',
                message: 'You must include at least one genre. The more genres you add, the easier you will be found in search!'
            });
        }

        if (errors.length < 1) {
            var image = false;
            if (this.state.image.size) {
                image = this.state.image;
            }
            this.props.createBand(this.state.form, image);
        } else {
            this.setState({
                errors: errors
            });
            window.scrollTo(0, 0);
        }

    },
    _onOpenClick: function () {
        this.refs.dropzone.open();
    },
    _handleDrop: function (files) {
        if (files[0]) {
            this.setState({
                image: files[0]
            });
        }
    },
    componentDidMount: function() {
        window.scrollTo(0, 0);
    },
    render: function() {
        var button = (
            <div onClick={this._createBand} className="button submit">
                <h3>Create my band!</h3>
            </div>
        );
        if (this.props.ui.isFetchingBands) {
            button = (
                <div className="button submit loader">
                    <i className="loader icon-loader animate-spin"></i>
                </div>
            );
        }

        var errors = {
            name: [],
            location: [],
            genre: []
        }
        this.state.errors.map(function(err, index) {
            if (errors.hasOwnProperty(err.type)) {
                errors[err.type].push(err.message);
            }
        });

        var imagePreviewStyle = {
            backgroundImage: 'url('+this.state.image.preview+')'
        };

        return (
            <div className="container">
                <h1 className="headline">New Band</h1>

                <div className="new-band-form">

                    <section className="new-band-section">
                        <h1>About you</h1>
                    </section>

                    <Input
                        ref="name"
                        for="name"
                        label="* Name"
                        handleUserInput={this.handleInput}>
                        <input type="text"/>
                    </Input>

                    {errors.name.map(function(err, i) {
                        return (<ErrorMessage key={"name-err"+i} message={err}/>);
                    })}

                    <Input
                        ref="location"
                        for="location"
                        label="* Location"
                        className="text-present"
                        handleUserInput={this.handleInput}>
                        <Geosuggest
                            placeholder="City and State"
                            onSuggestSelect={this.captureLocation}
                            types={['(cities)']}
                            queryDelay={150}/>
                    </Input>

                    {errors.location.map(function(err, i) {
                        return (<ErrorMessage key={"location-err"+i} message={err}/>);
                    })}

                    <TagInput
                        ref="genre"
                        for="genres"
                        label="* Genres (adding more will help with search)"
                        placeholder="+ genres"
                        handleUserInput={this.handleInput}/>

                    {errors.genre.map(function(err, i) {
                        return (<ErrorMessage key={"genre-err"+i} message={err}/>);
                    })}

                    <TextArea
                        for="bio"
                        label="Biography / Tell us about your band!"
                        handleUserInput={this.handleInput}/>



                    <div className="upload-image-box">
                        <div className="upload-image-button submit" onClick={this._onOpenClick}>
                            <h4>Upload an Image!</h4>
                        </div>


                        <Dropzone
                            className="create-upload-image"
                            ref="dropzone"
                            onDrop={this._handleDrop}
                            multiple={false}>
                            <div className="image-preview" style={imagePreviewStyle}></div>
                        </Dropzone>
                    </div>


                    <section className="new-band-section">
                        <h1>Details</h1>
                    </section>

                    <Input
                        for="year_established"
                        label="Band Since (year)"
                        handleUserInput={this.handleInput}>
                        <input type="text" />
                    </Input>

                    <Input
                        for="avg_set_length"
                        label="Average Set Length (in minutes)"
                        handleUserInput={this.handleInput}>
                        <input type="text" />
                    </Input>

                    <TagInput
                        for="influences"
                        label="Influences"
                        placeholder="+ influence"
                        handleUserInput={this.handleInput}/>

                    <TagInput
                        for="gear_owned"
                        label="Gear You Have"
                        placeholder="+ item"
                        handleUserInput={this.handleInput}/>

                    <TagInput
                        for="gear_needed"
                        label="Gear You Need Provided"
                        placeholder="+ item"
                        handleUserInput={this.handleInput}/>

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
                    <Input
                        for="soundcloud_url"
                        label="SoundCloud"
                        handleUserInput={this.handleInput}>
                        <input type="text" />
                    </Input>
                    <Input
                        for="bandcamp_url"
                        label="Bandcamp"
                        handleUserInput={this.handleInput}>
                        <input type="text" />
                    </Input>
                    <Input
                        for="myspace_url"
                        label="Myspace"
                        handleUserInput={this.handleInput}>
                        <input type="text" />
                    </Input>

                    {button}

                </div>
            </div>
        )
    }
});

module.exports = NewBand;



var ErrorMessage = React.createClass({
    render: function() {
        return (
            <div className="error-box">
                <div className="icon-error"></div>
                <div className="error-message">
                    <h4><i>{this.props.message}</i></h4>
                </div>
            </div>
        );
    }
});
