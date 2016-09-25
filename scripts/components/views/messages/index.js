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
            confirmNavigateBox: false,
            activeInbox: {},
            activeGroup: {}
        }
    },
    componentWillMount: function() {
        this.props.fetchAllInboxes();
    },
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
    _markGroupAsRead: function(group) {
        this.props.markGroupAsRead(group);
    },
    _handleSubmitMessage: function(data) {
        var content = this.refs.replybox.value.trim();
        var type = data.sender.type;
        var receiver_id = data.receiver.id;
        var sender_id = data.sender.id;
        // FIXME:0 What if no data?? don't send message!
        this.props.sendMessage(content, type, receiver_id, sender_id);
        this.refs.replybox.value = '';
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
    componentWillUpdate: function(nextProps, nextState) {
        console.log("updating", nextProps, nextState);
    },
    render: function() {

        var coverReplyOnSending = cx({
            ' show': this.props.ui.isSendingMessage
        });

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
            var hasUnread = cx({
                ' hasUnread': mg.hasUnread
            });
            return (
                <li key={"mg-"+mg.identity.slug}
                    className={"messages-group-item"+activeGroup}
                    onClick={this._confirmNavigateAway.bind(this, this._selectAsActiveMessageGroup, mg.identity.slug)}>
                    {mg.identity.name}
                    <div className={"unread-badge"+hasUnread}></div>
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

        var messageData = {sender: null, receiver: {name: ''}};
        var activeGroup = {};
        if (currentActiveMessageGroup[0] && activeInbox[0]) {
            messageData = {
                sender: activeInbox[0],
                receiver: currentActiveMessageGroup[0].identity
            };
            activeGroup = currentActiveMessageGroup[0];
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

                        <div className="reply">
                            <div className={"cover-sending"+coverReplyOnSending}>
                                <i className="icon-loader animate-spin"></i>
                            </div>
                            <div className="textbox">
                                <textarea ref="replybox" placeholder={"Reply to " + messageData.receiver.name}></textarea>
                            </div>
                            <div onClick={this._handleSubmitMessage.bind(this, messageData)} className="button extra"><h4>Send</h4></div>
                        </div>

                        <DigestBox>
                            {messagesDigest}
                        </DigestBox>


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




var DigestBox = React.createClass({
    componentWillReceiveProps: function(nextProps) {
        //scroll to bottom
        // console.log("this.refs.digestbox.scrollHeight", this.refs.digestbox.scrollHeight)
        // this.refs.digestbox.scrollTop = 1000;
    },
    render: function() {
        return (
            <div ref="digestbox" className="digest">
                <ul className="digest-list">
                    <ReactCSSTransitionGroup
                        transitionName="messagebox"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}>
                    {this.props.children}
                    </ReactCSSTransitionGroup>
                </ul>
            </div>
        );
    }
});


//
// var InboxList = React.createClass({
//     render: function() {
//         return (
//
//         )
//     }
// });
