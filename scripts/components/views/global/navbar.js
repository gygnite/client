var React = require('react');
var Modal = require('./modal');
var Joi = require("joi-browser");
var Link = require('react-router').Link;
var Input = require('./input');
var cx = require('classnames');
var Cache = require('lscache');

var Navbar = React.createClass({
    getInitialState: function() {
        return {
            menuOpen: false
        }
    },
    toggleMenu: function() {
        this.setState({
            menuOpen: !this.state.menuOpen
        });
    },
    componentWillMount: function() {
        //check if user exists
        // console.log("props on template mount: ", !this.props.user.token);
        var token = Cache.get(ACTIONS.cache.AUTH_TOKEN);
        if (!this.props.user.token) {
            this.props.getUser(token);
        }
    },
    render: function() {
        // console.log("props on nav", this.props);
        var menuOpen = cx({
            ' open': this.state.menuOpen
        });
        var mainNavigation;
        if (this.props.ui.isFetchingUser) {
            mainNavigation = (
                <ul className="navbar-list">
                    <i className="loader icon-loader animate-spin"></i>
                </ul>
            )
        } else if (this.props.user.first_name) {
            mainNavigation = (
                <ul className="navbar-list">
                    <li className="navbar-list-item">
                        <i className="messages icon-comment"></i>
                    </li>
                    <li className="navbar-list-item">
                        <Link to="/dashboard">
                            <h3 className="navbar-link">
                                {this.props.user.first_name} {this.props.user.last_name}
                            </h3>
                        </Link>
                    </li>
                </ul>
            );
        } else {
            mainNavigation = (
                <ul className="navbar-list">
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
                    showCloseIcon={false}
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
                    <div className="menu-list-item" onClick={this.props.close}>
                        <Link to="/">
                            <h1>Dashboard</h1>
                        </Link>
                    </div>

                    <div className="menu-list-item" onClick={this.props.close}>
                        <Link to="/">
                            <h1>Stuff</h1>
                        </Link>
                    </div>

                    <div className="menu-list-item" onClick={this.props.close}>
                        <Link to="/">
                            <h1>More stuff</h1>
                        </Link>
                    </div>

                    <div className="menu-list-item" onClick={this.props.close}>
                        <Link to="/">
                            <h1>Things</h1>
                        </Link>
                    </div>

                </ul>
            </div>
        )
    }
});
