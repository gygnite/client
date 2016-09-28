var React = require('react');
var cx = require('classnames');
var Dropzone = require('react-dropzone');
var Input = require('../global/input');
var Link = require('react-router').Link;

var UserSettings = React.createClass({
    wait: null,
    getInitialState: function() {
        return {
            file: {}
        }
    },
    componentWillMount: function() {
        this.props.getUser();
        this.props.fetchAdminAssets();
    },
    _handleUpdateUserField: function(field, value) {
        var user = this.props.user;
        user[field] = value;
        this._doWaitToUpdateUser(user);
    },
    _doWaitToUpdateUser: function(user) {
        if (!this.wait) {
            this._doUpdateUser(user);
        } else {
            clearTimeout(this.wait);
            this._doUpdateUser(user);
        }
    },
    _doUpdateUser: function(user) {
        this.wait = setTimeout(function() {
            //props update user
            this.props.updateUser(user);
        }.bind(this), 400);
    },
    _handleDrop: function(files) {
        this.setState({
            file: files[0]
        });
        this.props.saveProfileImage(files[0]);
    },
    _onOpenClick: function() {
        this.refs.dropzone.open();
    },
    _handleLogout: function() {
        this.props.logout();
    },
    render: function() {
        var image = null;
        if (this.state.file && this.state.file.preview) {
            image = this.state.file.preview;
        }
        var imageBoxStyle = {
            backgroundImage: 'url('+this.props.user.profile_image+')'
        };

        var bands = (
            <div className="admin-asset empty">
                <h2>No bands found!</h2>
                <Link to="/bands/new">
                    <div className="button half success">
                        <i className="icon-plus-circled"></i>Add a new band!
                    </div>
                </Link>
            </div>
        );
        if (this.props.bands.allbands.length > 0) {
            var bands = this.props.bands.allbands.map(function(asset, index) {
                return (<AdminAsset type="bands" asset={asset}/>);
            });
        }

        var venues = (
            <div className="admin-asset empty">
                <h2>No venues found!</h2>
                <Link to="/venues/new">
                    <div className="button half success">
                        <i className="icon-plus-circled"></i>Add a new venue!
                    </div>
                </Link>
            </div>
        );
        if (this.props.venues.allvenues.length > 0) {
            var venues = this.props.venues.allvenues.map(function(asset, index) {
                return (<AdminAsset type="venues" asset={asset}/>);
            });
        }


        return (
            <div className="container user-settings">
                <div className="header-box">
                    <div className="image-box">
                        <div className="image-box-inner profile_image" style={imageBoxStyle}></div>
                        <Dropzone
                            className="upload-image"
                            ref="dropzone"
                            onDrop={this._handleDrop}
                            multiple={false}>
                            <i className="icon-pencil edit-image"></i>
                        </Dropzone>
                    </div>
                    <div className="headline-box">
                        <h2 className="headline">Welcome, {this.props.user.first_name}!</h2>
                        <h4 className="subheadline"><i>Settings</i></h4>
                    </div>
                </div>

                <SettingsSectionBox label="Account">
                    <div className="content">
                        <UpdateField
                            field={this.props.user.first_name}
                            label='First Name'
                            formField="first_name"
                            handleChange={this._handleUpdateUserField}/>
                        <UpdateField
                            field={this.props.user.last_name}
                            label='Last Name'
                            formField="last_name"
                            handleChange={this._handleUpdateUserField}/>
                        <div className="section">
                            <div onClick={this._handleLogout} className="button error logout">Logout</div>
                        </div>
                    </div>

                </SettingsSectionBox>

                <SettingsSectionBox label="Bands">
                    <div className="content">
                        {bands}
                    </div>
                </SettingsSectionBox>

                <SettingsSectionBox label="Venues">
                    <div className="content">
                        {venues}
                    </div>
                </SettingsSectionBox>
            </div>
        )
    }
});

module.exports = UserSettings;




var SettingsSectionBox = React.createClass({
    getInitialState: function() {
        return {
            visible: false
        }
    },
    _toggleContentVisible: function() {
        this.setState({
            visible: !this.state.visible
        });
    },
    render: function() {
        var isVisible = cx({
            ' show': this.state.visible
        });
        return (
            <div className={"settings-box user-settings-box" + isVisible}>
                <div className="label" onClick={this._toggleContentVisible}><h1>{this.props.label}</h1></div>
                <div className="show-hide" onClick={this._toggleContentVisible}>
                    <i className="icon-down-open show-hide-icon"></i>
                </div>
                <div className={"settings-box-inner"+isVisible}>
                    {this.props.children}
                </div>
            </div>
        )
    }
});





var UpdateField = React.createClass({
    getInitialState: function() {
        return {
            showInput: false
        }
    },
    _toggleInput: function() {
        this.setState({
            showInput: !this.state.showInput
        });
    },
    render: function() {
        var showInput = cx({
            ' show': this.state.showInput
        });
        var showField = cx({
            ' show': !this.state.showInput
        });
        return (
            <div className="section">
                <div className="update button" onClick={this._toggleInput}>
                    {this.props.label}
                    <i className="icon-pencil"></i>
                </div>
                <div className={"field" + showField}>
                    <h3>{this.props.field}</h3>
                </div>
                <div className={"field input" + showInput}>
                    <Input
                        for={this.props.formField}
                        label={this.props.label}
                        initialValue={this.props.field}
                        handleUserInput={this.props.handleChange}>
                        <input type="text"/>
                    </Input>
                </div>
            </div>
        )
    }
});



var AdminAsset = React.createClass({
    render: function() {
        var image = this.props.asset.profile_image;
        var imageStyle = {
            backgroundImage: 'url('+image+')'
        };
        return (
            <div className="admin-asset">
                <div className="image-box" style={imageStyle}></div>
                <div className="content-box">
                    <h4>{this.props.asset.name}</h4>
                </div>
                <div className="show-box">
                    <Link to={"/dashboard/settings/"+this.props.type+"/"+this.props.asset.slug}>
                        <div className="section edit"><h5>Edit</h5></div>
                    </Link>
                    <Link to={"/"+this.props.type+"/"+this.props.asset.slug}>
                        <div className="section view"><h5>View</h5></div>
                    </Link>
                </div>
            </div>
        )
    }
});
