var React = require('react');
var cx = require('classnames');
var moment = require('moment');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var Modal = require('../global/modal');
var Link = require('react-router').Link;

var Messages = React.createClass({
    getInitialState: function() {
        return {
            showInactiveInboxList: false,
            confirmNavigateBox: false
        }
    },
    componentWillMount: function() {
        this.props.fetchAllInboxes();
    },
    // componentWillUpdate: function(nextProps, nextState) {
    //     this.refs.digestbox.scrollTop = this.refs.digestbox.scrollHeight;
    //     console.log("digestbox:", this.refs.digestbox.scrollTop)
    // },
    // componentDidMount: function() {
    //     this.refs.digestbox.scrollTop = this.refs.digestbox.scrollHeight;
    //     console.log("digestbox:", this.refs.digestbox.scrollHeight)
    // },
    _toggleCurrentActiveInboxDropdown: function() {
        this.setState({
            showInactiveInboxList: !this.state.showInactiveInboxList
        });
    },
    _selectAsActiveInbox: function(slug) {
        this.refs.replybox.value = '';
        this._closeConfirmNavigation();
        this.props.setActiveInbox(slug);
    },
    _selectAsActiveMessageGroup: function(slug) {
        this.refs.replybox.value = '';
        this._closeConfirmNavigation();
        this.props.setActiveMessageGroup(slug);
    },
    _handleSubmitMessage: function() {
        
    },
    _confirmNavigateAway: function(callback, slug) {
        if (!this.refs.replybox.value.trim()) {
            callback(slug);
        } else {
            this.setState({
                confirmNavigateBox: true,
                confirmCallback: callback.bind(this, slug)
            });
        }
    },
    _closeConfirmNavigation: function() {
        this.setState({
            confirmNavigateBox: false
        });
    },
    render: function() {

        var inactiveInboxList = cx({
            ' show': this.state.showInactiveInboxList
        });

        var inboxGroups = this.props.messages.inboxes.map(function(inbox) {
            return inbox.identity;
        });

        var activeInbox = inboxGroups.filter(function(inbox, i) {
            return inbox.isActive;
        });

        var activeInboxSlug;
        if (activeInbox[0]) {
            activeInboxSlug = activeInbox[0].slug;
        }

        var activeInboxIdentity = activeInbox.map(function(inbox, i) {
            return (<div key={"inbox"+inbox.slug}>{inbox.name}</div>);
        });

        var inactiveInboxesIdentities = inboxGroups.filter(function(inbox, i) {
            //remove active inbox from dropdown list
            return activeInboxSlug !== inbox.slug;
        }).map(function(inbox, i) {
            return (
                <li key={"inbox"+inbox.slug}
                    onClick={this._confirmNavigateAway.bind(this, this._selectAsActiveInbox, inbox.slug)}>
                    {inbox.name}
                </li>
            );
        }.bind(this));

        var activeMessageGroups = this.props.messages.inboxes.filter(function(inbox) {
            return inbox.identity.isActive;
        })[0];

        var messageGroups = [];
        if (activeMessageGroups) {
            for (var group in activeMessageGroups.messageGroups) {
                messageGroups.push(activeMessageGroups.messageGroups[group]);
            }
        }

        var messageGroupsList = messageGroups.map(function(mg, i) {
            var activeGroup = cx({
                ' active': mg.identity.isActive
            });
            return (
                <li key={"mg-"+mg.identity.slug}
                    className={"messages-group-item"+activeGroup}
                    onClick={this._confirmNavigateAway.bind(this, this._selectAsActiveMessageGroup, mg.identity.slug)}>
                    {mg.identity.name}
                </li>
            );
        }.bind(this));

        var currentActiveMessageGroup = messageGroups.filter(function(mg, i) {
            return mg.identity.isActive;
        });

        var currentActiveMessageGroupTitles = currentActiveMessageGroup.map(function(mg, i) {
            var imageStyle = {
                backgroundImage: 'url('+mg.identity.image+')'
            };
            return (
                <div key={"camg-"+mg.identity.slug} className="message-chain-title">
                    <div className="title-image" style={imageStyle}></div>
                    <h1>{mg.identity.name}</h1>
                </div>
            );
        });

        var currentActiveMessageGroupContent = currentActiveMessageGroup.map(function(cmcg, i) {
            return cmcg.messages;
        })[0];


        var messagesDigest = [];
        if (currentActiveMessageGroupContent) {
            messagesDigest = currentActiveMessageGroupContent.map(function(msg, i) {
                var timeslot = null;
                if (msg.timeslot_id && (activeInboxSlug !== msg.sender_slug) && msg.timeslot_pending) {
                    timeslot = (
                        <div className="message-timeslot">
                            <hr/>
                            <p className="autogen"><i>Autogenerated</i></p>
                            <div className="timeslot-date">
                                <p>Booking for {moment(msg.timeslot_date).format("ddd, MMM Do 'YY")}</p>
                            </div>
                            <Link to={"/booking/e/"+activeInboxSlug+"/t/"+msg.timeslot_id} >
                                <div className="timeslot-link button error">
                                    View Booking
                                </div>
                            </Link>
                        </div>
                    );
                }
                if (msg.timeslot_id && (activeInboxSlug === msg.sender_slug) && msg.timeslot_pending) {
                    timeslot = (
                        <div className="message-timeslot">
                            <hr/>
                            <p className="autogen"><i>Autogenerated</i></p>
                            <div className="timeslot-date">
                                <p>Booking for {moment(msg.timeslot_date).format("ddd, MMM Do 'YY")}</p>
                            </div>
                        </div>
                    );
                }
                if (msg.timeslot_accepted) {
                    timeslot = (
                        <div className="message-timeslot">
                            <hr/>
                            <p className="autogen"><i>Autogenerated</i></p>
                            <div className="timeslot-date">
                                <p>Booking for {moment(msg.timeslot_date).format("ddd, MMM Do 'YY")}</p>
                            </div>
                            <div className="timeslot-link with-status accepted">
                                Accepted
                            </div>
                        </div>
                    );
                }
                if (msg.timeslot_rejected) {
                    timeslot = (
                        <div className="message-timeslot">
                            <hr/>
                            <p className="autogen"><i>Autogenerated</i></p>
                            <div className="timeslot-date">
                                <p>Booking for {moment(msg.timeslot_date).format("ddd, MMM Do 'YY")}</p>
                            </div>
                            <div className="timeslot-link with-status rejected">
                                Rejected
                            </div>
                        </div>
                    );
                }

                var isMe = cx({
                    ' isme': activeInboxSlug === msg.sender_slug,
                    ' notme': activeInboxSlug !== msg.sender_slug
                });
                var recOrSent = (activeInboxSlug === msg.sender_slug) ? 'Sent' : 'Received';
                return (
                    <li key={"msg-"+i} className="list-item">
                        <div className={"message-body"+isMe}>
                            <div className="message-content">
                                <p>{msg.content}</p>
                            </div>
                            <div className="message-details">
                                <p className="timestamp"><i>{recOrSent} {moment(msg.date_created).fromNow()}</i></p>
                            </div>
                            {timeslot}
                        </div>
                    </li>
                );
            }.bind(this));
        }


        return (
            <div className="message-page">
                <div className="messages-main">
                    <div className="inbox-list">
                        <h2 className="inbox-list-title">Inbox</h2>

                        <div className="messages-group">
                            <div className="select-inbox-box" onClick={this._toggleCurrentActiveInboxDropdown}>
                                <div className="current-active">
                                    {activeInboxIdentity}
                                </div>
                                <div className="current-active-select">
                                    <i className="icon-down-open"></i>
                                </div>
                                <div className={"inactive-inbox-dropdown"+inactiveInboxList}>
                                    <ul className="inactive-inbox-list">
                                        {inactiveInboxesIdentities}
                                    </ul>
                                </div>
                            </div>
                            <ul className="messages-group-list">
                                {messageGroupsList}
                            </ul>
                        </div>
                    </div>
                    <div className="messages-window">
                        <div className="current-message-chain">
                            <ReactCSSTransitionGroup
                                transitionName="grouptitle"
                                transitionEnterTimeout={500}
                                transitionLeaveTimeout={300}>
                            {currentActiveMessageGroupTitles}
                            </ReactCSSTransitionGroup>
                        </div>
                        <div ref="digestbox" className="digest">
                            <ul className="digest-list">
                                <ReactCSSTransitionGroup
                                    transitionName="messagebox"
                                    transitionEnterTimeout={500}
                                    transitionLeaveTimeout={300}>
                                {messagesDigest}
                                </ReactCSSTransitionGroup>
                            </ul>
                        </div>
                        <div className="reply">
                            <div className="textbox">
                                <textarea ref="replybox" placeholder="Reply"></textarea>
                            </div>
                            <div onClick={this._handleSubmitMessage} className="button extra"><h4>Send</h4></div>
                        </div>
                    </div>
                </div>
                <Modal
                    className="modal-inner"
                    open={this.state.confirmNavigateBox}
                    close={this._closeConfirmNavigation}
                    showCloseIcon={false}
                    allowClose={false}>
                    <div className="confirm-navigation">
                        <div className="confirm-text">
                            <h2 className="main">You have input in the reply box, are you sure you want to navigate away?</h2>
                            <h5 className="helper"><i>Navigating will not save your input.</i></h5>
                        </div>
                        <div onClick={this.state.confirmCallback} className="button success">Yes, I'm sure</div>
                        <div onClick={this._closeConfirmNavigation} className="button error">No</div>
                    </div>
                </Modal>
            </div>
        )
    }
});

module.exports = Messages;
