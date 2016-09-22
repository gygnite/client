var React = require('react');
var cx = require('classnames');
var moment = require('moment');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');


var Messages = React.createClass({
    getInitialState: function() {
        return {
            showInactiveInboxList: false
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
        this.props.setActiveInbox(slug);
    },
    _selectAsActiveMessageGroup: function(slug) {
        this.props.setActiveMessageGroup(slug);
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

        var inactiveInboxesIdentities = inboxGroups.map(function(inbox, i) {
            return (
                <li key={"inbox"+inbox.slug}
                    onClick={this._selectAsActiveInbox.bind(this, inbox.slug)}>
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
                    onClick={this._selectAsActiveMessageGroup.bind(this, mg.identity.slug)}>
                    {mg.identity.name}
                </li>
            );
        }.bind(this));

        var currentActiveMessageGroup = messageGroups.filter(function(mg, i) {
            return mg.identity.isActive;
        });

        var currentActiveMessageGroupTitles = currentActiveMessageGroup.map(function(mg, i) {
            return (
                <div key={"camg-"+mg.identity.slug}>
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
                var isMe = cx({
                    ' isme': activeInboxSlug === msg.sender_slug,
                    ' notme': activeInboxSlug !== msg.sender_slug
                });
                return (
                    <li className={"message-body"+isMe} key={"msg-"+i}>
                        <div className="message-content">
                            <p>{msg.content}</p>
                        </div>
                        <div className="message-details">
                            <p className="timestamp"><i>Received {moment(msg.date_created).fromNow()}</i></p>
                        </div>
                    </li>
                );
            });
        }


        return (
            <div className="message-page">
                <div className="messages-main">
                    <div className="inbox-list">
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
                        <div className="messages-group">
                            <h2 className="messages-group-title">Inbox</h2>
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
                        <div className="digest">
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
                            <textarea name="" id="" cols="30" rows="10"></textarea>
                            <button>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = Messages;
