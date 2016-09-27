var React = require('react');
var Modal = require('./modal');
var Joi = require("joi-browser");
var Link = require('react-router').Link;
var Input = require('./input');
var cx = require('classnames');
var Cache = require('lscache');
var cx = require('classnames');

var Navbar = React.createClass({
    getInitialState: function() {
        return {
            menuOpen: false,
            alertBox: false,
            settingsBox: false,
            showMobileMenu: false
        }
    },
    toggleMenu: function() {
        this.setState({
            menuOpen: !this.state.menuOpen
        });
    },
    componentWillMount: function() {
        var token = Cache.get(ACTIONS.cache.AUTH_TOKEN);
        if (!this.props.user.token) {
            this.props.getUser(token);
        }

        this.props.fetchNotifications();
    },
    toggleAlertBox: function() {
        this.setState({
            alertBox: !this.state.alertBox,
            settingsBox: false
        });
    },
    toggleSettingsDropdown: function() {
        this.setState({
            alertBox: false,
            settingsBox: !this.state.settingsBox
        });
    },
    toggleMobileMenu: function() {
        this.setState({
            showMobileMenu: !this.state.showMobileMenu
        });
    },
    _markNotificationAsRead: function(notification_id, shouldSend) {
        if (shouldSend) {
            this.props.markNotificationsAsRead(notification_id);
        }
    },
    render: function() {
        // console.log("props!", this.props.ui);
        var notifsView = null;
        if (this.props.ui.notifications.length > 0) {
            notifsView = this.props.ui.notifications.map(function(notif, index) {
                var icon = null;
                var link = (notif.type === 'message') ? '/messages' : '/booking';
                if (notif.type === 'booking') {
                    icon = (
                        <i className="icon-calendar"></i>
                    );
                } else if (notif.type === 'message') {
                    icon = (
                        <i className="icon-comment"></i>
                    );
                }
                var shouldSend = false;
                // console.log("should send", notif)
                if (!notif.seen && notif.id) {
                    shouldSend = true;
                }
                var unread = cx({
                    ' unread': !notif.seen
                });
                return (
                    <Link key={"notif-"+index} to={link}>
                        <li className={"dropdown-link "+unread} onMouseEnter={this._markNotificationAsRead.bind(this, notif.id, shouldSend)}>
                            <p><span>{icon}</span>{notif.text}</p>
                        </li>
                    </Link>

                )
            }.bind(this));
        } else {
            notifsView = (
                <li className="dropdown-link">
                    <p>No notifications found</p>
                </li>
            )
        }

        var hasUnreadAlert = false;
        var numUnreadAlerts = 0;
        for (var i = 0; i < this.props.ui.notifications.length; i++) {
            var currNotif = this.props.ui.notifications[i];
            if (!currNotif.seen) {
                hasUnreadAlert = true;
                numUnreadAlerts++;
            }
        }
        var showNumUnreadAlerts = null;
        if (numUnreadAlerts) {
            showNumUnreadAlerts = (
                <i className="icon-alert-count-badge">{numUnreadAlerts}</i>
            );
        }

        var menuOpen = cx({
            ' open': this.state.menuOpen
        });
        var showAlertBox = cx({
            ' show': this.state.alertBox
        });
        var settingsBox = cx({
            ' show': this.state.settingsBox
        });
        var mobileMenu = cx({
            ' show': this.state.showMobileMenu
        })
        var mainNavigation;
        var mainMobileNavigation;
        if (this.props.ui.isFetchingUser) {
            mainNavigation = (
                <ul className="navbar-list">
                    <i className="loader icon-loader animate-spin"></i>
                </ul>
            )
        } else if (this.props.user.id) {
            var image = this.props.user.profile_image;
            var imageBoxStyle = {
                backgroundImage: 'url('+image+')'
            };
            mainNavigation = (
                <ul className="navbar-list">
                    <li className="navbar-list-item">
                        <div className="user-image profile_image" style={imageBoxStyle}></div>
                    </li>
                    <Link to="/dashboard">
                        <li className="navbar-list-item">
                            <p className="user-name">{this.props.user.first_name}</p>
                        </li>
                    </Link>
                    <li className="border-bar navbar-list-item"></li>
                    <li className="navbar-list-item">
                        <i className="icon-alert nav-icon" onClick={this.toggleAlertBox}></i>
                        {showNumUnreadAlerts}
                        <div className={"alerts navbar-dropdown"+showAlertBox} onClick={this.toggleAlertBox}>
                            <h5 className="dropdown-header">Notifications</h5>
                            <ul className="dropdown-list">
                                {notifsView}
                            </ul>
                        </div>
                    </li>
                    <li className="navbar-list-item">
                        <i className="icon-cog nav-icon" onClick={this.toggleSettingsDropdown}></i>
                        <div className={"settings navbar-dropdown"+settingsBox} onClick={this.toggleSettingsDropdown}>
                            <ul className="dropdown-list">
                                <Link to="/dashboard/settings" activeClassName="active">
                                    <li className="dropdown-link">Settings</li>
                                </Link>
                                <li className="dropdown-link" onClick={this.props.logout}>Logout</li>
                            </ul>
                        </div>
                    </li>
                </ul>
            );
            var mainMobileNavigation = (
                <div className="mobile-navbar">
                    <div className={"mobile-trigger"+mobileMenu} onClick={this.toggleMobileMenu}>
                        <i className="icon-secondary-menu"></i>
                    </div>
                    <ul className={"mobile-dropup"+mobileMenu}
                        onClick={this.toggleMobileMenu}>
                        <Link to="/dashboard/" activeClassName="active" onlyActiveOnIndex={true}>
                            <li className="mobile-dropup-item">
                                <i className="icon-home"></i>
                            </li>
                        </Link>
                        <Link to="/messages" activeClassName="active">
                            <li className="mobile-dropup-item"
                                onClick={this.toggleMobileMenu}>
                                <i className="icon-comment"></i>
                            </li>
                        </Link>
                        <Link to="/dashboard/settings" activeClassName="active">
                            <li className="mobile-dropup-item"
                                onClick={this.toggleMobileMenu}>
                                <i className="icon-cog"></i>
                            </li>
                        </Link>
                    </ul>
                </div>
            );
            var notifs = (
                <ul className="navbar-list-mobile">
                    <li className="navbar-list-item">
                        <i className="icon-alert nav-icon" onClick={this.toggleAlertBox}></i>
                        {showNumUnreadAlerts}
                        <div className={"alerts navbar-dropdown mobile"+showAlertBox} onClick={this.toggleAlertBox}>
                            <h5 className="dropdown-header">Notifications</h5>
                            <ul className="dropdown-list">
                                {notifsView}
                            </ul>
                        </div>
                    </li>
                </ul>
            )
        } else {
            mainNavigation = (
                <ul className="navbar-list no-user">
                    <MenuLabel label="Login" close={closeModal}>
                        <Login {...this.props} />
                    </MenuLabel>
                    <MenuLabel label="Signup" close={closeModal}>
                        <Signup {...this.props}/>
                    </MenuLabel>
                </ul>
            )
        }
        var closeModal = this.props.ui.shouldCloseModal || false;
        return (
            <div className="navbar">
                <div className="brand">
                    <Link to="/">
                        <h3 className="brand-text">Gygnite</h3>
                    </Link>
                </div>
                <div className={"menu"+menuOpen}>
                    <MenuList close={this.toggleMenu} open={this.state.menuOpen}/>
                </div>
                <div className="menu-bar-icon">
                    <i className={"icon-menu" + menuOpen} onClick={this.toggleMenu}></i>
                </div>

                {mainNavigation}
                {mainMobileNavigation}
                {notifs}

            </div>
        )
    }
});

module.exports = Navbar;





var MenuLabel = React.createClass({
    getInitialState: function() {
        return {
            open: false
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.close) {
            this.setState({
                open: false
            });
        }
    },
    toggleModal: function(action, e) {
        if (action === 'close') {
            this.setState({
                open: false
            });
        } else {
            this.setState({
                open: !this.state.open
            });
        }
    },
    render: function() {
        return (
            <li className="navbar-list-item" onClick={this.toggleModal.bind(this, 'open')}>
                <h3 className="navbar-link">{this.props.label}</h3>
                <Modal
                    className="modal-inner"
                    showCloseIcon={true}
                    open={this.state.open}
                    close={this.toggleModal.bind(this, 'close')}>
                    {this.props.children}
                </Modal>
            </li>
        )
    }
});




var Login = React.createClass({
    getInitialState: function() {
        return {
            form: {}
        }
    },
    _handleInput: function(field, value) {
        var state = this.state;
        state.form[field] = value;
        this.setState(state);
    },
    _loginUser: function() {
        Joi.validate(this.state.form, loginSchema, function(err, success) {
            if (err) {
                //don't send
                console.error('Invalid input');
                // FIXME:20 Handle errors with form input component
            } else {
                // console.log("props: ", this.props)
                this.props.login(this.state.form);
            }
        }.bind(this));
    },
    _showErrors: function(errs) {

    },
    render: function() {
        var button = (
            <div onClick={this._loginUser} className="button submit">
                <h3>Login</h3>
            </div>
        );
        var loading = this.props.ui.isFetchingUser;
        if (loading) {
            button = (
                <div className="button submit loader">
                    <i className="loader icon-loader animate-spin"></i>
                </div>
            );
        }
        return (
            <div className="form modal-form login">
                <div className="form-header">
                    <h1>Login</h1>
                </div>
                <div className="form-content">
                    <Input
                        for="email"
                        label="Email"
                        handleUserInput={this._handleInput}>
                        <input type="email" required/>
                    </Input>
                    <Input
                        for="password"
                        label="Password"
                        handleUserInput={this._handleInput}>
                        <input type="password" required/>
                    </Input>
                </div>
                <div className="form-submit">
                    {button}
                </div>
            </div>
        );
    }
});


var Signup = React.createClass({
    getInitialState: function() {
        return {
            form: {}
        }
    },
    _handleInput: function(field, value) {
        var state = this.state;
        state.form[field] = value;
        this.setState(state);
        console.log("state of form", this.state.form)
    },
    _signupUser: function() {
        // console.log("signing up", this.state.form);
        Joi.validate(this.state.form, signupSchema, function(err, success) {
            if (err) {
                //don't send
                console.error('invalid input');
                // FIXME:30 Handle errors with form input component
            } else {
                // console.log("props: ", this.props)
                this.props.signup(this.state.form);
            }
        }.bind(this));
    },
    render: function() {
        var button = (
            <div onClick={this._signupUser} className="button submit">
                <h3>Signup</h3>
            </div>
        );
        var loading = this.props.ui.isFetchingUser;
        if (loading) {
            button = (
                <div className="button submit loader">
                    <i className="loader icon-loader animate-spin"></i>
                </div>
            );
        }
        return (
            <div className="form modal-form signup">
                <div className="form-header">
                    <h1>Signup</h1>
                </div>
                <div className="form-content">
                    <Input
                        for="first_name"
                        label="First Name"
                        handleUserInput={this._handleInput}>
                        <input type="text" required/>
                    </Input>
                    <Input
                        for="last_name"
                        label="Last Name"
                        handleUserInput={this._handleInput}>
                        <input type="text" required/>
                    </Input>
                    <Input
                        for="email"
                        label="Email"
                        handleUserInput={this._handleInput}>
                        <input type="email" required/>
                    </Input>
                    <Input
                        for="password"
                        label="Password"
                        handleUserInput={this._handleInput}>
                        <input type="password" required/>
                    </Input>
                </div>
                <div className="form-submit">
                    {button}
                </div>
            </div>
        )
    }
});




var validPassword = Joi.string().regex(/^(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/g).required();
var loginSchema = Joi.object().keys({
    email: Joi.string().email().required().label('Email'),
    password: validPassword
});

var signupSchema = Joi.object().keys({
    email: Joi.string().email().required().regex(/^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/igm).label('Email'),
    password: validPassword,
    first_name: Joi.string().required(),
    last_name: Joi.string().required()
});






var MenuList = React.createClass({
    getInitialState: function() {
        return {
            enter: false,
            active: false,
            leave: false
        }
    },
    componentWillReceiveProps: function(nextProps) {
        // console.log("nextProps", nextProps);
        if (nextProps.open) {
            this.setState({
                enter: true,
                active: false,
                leave: false
            });
            this._mount();
        } else {
            this.setState({
                enter: false,
                active: false,
                leave: true
            });
            this._unmount();
        }
    },
    _mount: function() {
        document.body.classList.add('no-scroll');
        setTimeout(function() {
            this.setState({
                enter: false,
                active: true,
                leave: false
            });
        }.bind(this), 350);
    },
    _unmount: function() {
        document.body.classList.remove('no-scroll');
        this.setState({
            enter: false,
            active: false,
            leave: true
        });
    },
    render: function() {
        var state = cx({
            ' enter': this.state.enter,
            ' active': this.state.active,
            ' leave': this.state.leave
        });

        return (
            <div className={'container menu-content' + state}>
                <ul className="menu-content-list">

                    <div className="menu-section">
                        <i className="menu-section-icon icon-home"></i>
                        <h2>Navigation</h2>
                        <div className="menu-list-group" onClick={this.props.close}>
                            <div className="menu-list-item" onClick={this.props.close}>
                                <Link to="/">
                                    <h3>Home</h3>
                                </Link>
                            </div>
                            <div className="menu-list-item" onClick={this.props.close}>
                                <Link to="/dashboard">
                                    <h3>Dashboard</h3>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="menu-section">
                        <i className="menu-section-icon icon-search"></i>
                        <h2>Search</h2>
                        <div className="menu-list-group">
                            <div className="menu-list-item" onClick={this.props.close}>
                                <Link to="/search/bands">
                                    <h3>Bands</h3>
                                </Link>
                            </div>
                            <div className="menu-list-item" onClick={this.props.close}>
                                <Link to="/search/venues">
                                    <h3>Venues</h3>
                                </Link>
                            </div>
                        </div>
                    </div>



                </ul>
            </div>
        )
    }
});
