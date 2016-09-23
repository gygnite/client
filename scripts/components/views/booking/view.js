var React = require('react');
var moment = require('moment');
var cx = require('classnames');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');


var BookingView = React.createClass({
    componentWillMount: function() {
        this.props.fetchBookings(this.props.params.booking_id);
    },
    componentWillUnmount: function() {
        this.props.clearBookings();
    },
    _setAccepted: function(vid, bid, date) {
        console.log("setting?", vid, bid);
        this.props.setAccepted(vid, bid, date);
    },
    _setRejected: function(vid, bid, date) {
        this.props.setRejected(vid, bid, date);
    },
    render: function() {
        var pending = [];
        var confirmed = [];
        var rejected = [];

        var bookings = (
            <div className="bookings-view">
                <h1>No Bookings Found</h1>
            </div>
        );

        var date = null;
        if (this.props.bookings.length > 0) {
            var formatDate = moment(this.props.bookings[0].data.start_time).format('dddd, MMMM Do YYYY');
            date = (<ShowDate data={this.props.bookings[0]} date={formatDate}/>);

            pending = this.props.bookings.filter(function(bk, i) {
                return bk.data.pending;
            }).map(function(bk, i) {
                return (
                    <BookingItem key={"bk-"+i} booking={bk}
                        type="pending"
                        setAccepted={this._setAccepted}
                        setRejected={this._setRejected}/>
                );
            }.bind(this));

            confirmed = this.props.bookings.filter(function(bk, i) {
                return bk.data.accepted;
            }).map(function(bk, i) {
                return (
                    <BookingItem key={"bk-"+i} booking={bk}
                        type="accepted"
                        setAccepted={this._setAccepted}
                        setRejected={this._setRejected}/>
                );
            }.bind(this));

            rejected = this.props.bookings.filter(function(bk, i) {
                return bk.data.rejected;
            }).map(function(bk, i) {
                return (
                    <BookingItem key={"bk-"+i} booking={bk}
                        type="rejected"
                        setAccepted={this._setAccepted}
                        setRejected={this._setRejected}/>
                );
            }.bind(this));

            var pendingHeader = null;
            if (pending.length > 0) {
                pendingHeader = (
                    <div className="list-section-header">
                        <h1>Pending</h1>
                    </div>
                );
            }
            var confirmedHeader = null;
            if (confirmed.length > 0) {
                confirmedHeader = (
                    <div className="list-section-header">
                        <h1>Confirmed</h1>
                    </div>
                );
            }
            var rejectedHeader = null;
            if (rejected.length > 0) {
                rejectedHeader = (
                    <div className="list-section-header">
                        <h1>Rejected</h1>
                    </div>
                );
            }

            bookings = null;
        }
        return (
            <div className="booking-review container">
                {date}
                {bookings}
                <div className="booking-list-section">
                    {pendingHeader}
                    <ReactCSSTransitionGroup
                        transitionName="bookingstatus"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}>
                        {pending}
                    </ReactCSSTransitionGroup>
                </div>
                <div className="booking-list-section">
                    {confirmedHeader}
                    <ReactCSSTransitionGroup
                        transitionName="bookingstatus"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}>
                        {confirmed}
                    </ReactCSSTransitionGroup>
                </div>
                <div className="booking-list-section">
                    {rejectedHeader}
                    <ReactCSSTransitionGroup
                        transitionName="bookingstatus"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}>
                        {rejected}
                    </ReactCSSTransitionGroup>
                </div>
            </div>
        )
    }
});

module.exports = BookingView;


var ShowDate = React.createClass({
    render: function() {
        return (
            <div className="booking-header">
                <h1>{this.props.data.venue.name}</h1>
                <h2><i>{this.props.date}</i></h2>
            </div>
        )
    }
});



var BookingItem = React.createClass({
    getInitialState: function() {
        return {
            messageOpen: false,
            message: {
                band_id: this.props.booking.band.id,
                venue_id: this.props.booking.venue.id,
                content: ''
            }
        }
    },
    _toggleMessageOpen: function() {
        this.setState({
            messageOpen: !this.state.messageOpen
        });
    },
    _sendMessage: function() {
        if (!this.refs.messagebox.value.trim()) {
            //don't send
            return;
        }
        //send message
    },
    _getStatus: function(booking) {
        if (booking.pending) {
            return 'Pending';
        }
        if (booking.accepted) {
            return 'Confirmed';
        }
        if (booking.rejected) {
            return 'Rejected';
        }
    },
    render: function() {
        var bookingState = this.props.booking.data.pending;
        var imageStyle = {
            backgroundImage: 'url('+this.props.booking.band.image+')'
        };
        var date = moment(this.props.booking.data.start_time).format('dddd, MMMM Do YYYY');
        var role = 'Supporting';
        if (this.props.booking.data.headliner) {
            role = 'Headliner';
        }

        var messageBox = cx({
            ' open': this.state.messageOpen
        });

        var takeAction = null;
        if (this.props.type === 'pending') {
            var bandId = this.props.booking.band.id;
            var venueId = this.props.booking.venue.id;
            var date = this.props.booking.data.start_time;
            takeAction = (
                <div className="item-actions">
                    <div onClick={this.props.setAccepted.bind(null, venueId, bandId, date)}
                        className="action accept">
                        <i className="icon-success action-icon"></i>
                        <p>Accept</p>
                    </div>
                    <div onClick={this.props.setRejected.bind(null, venueId, bandId, date)}
                        className="action reject">
                        <i className="icon-error action-icon"></i>
                        <p>Reject</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="booking-item-box">
                <div className="item-header">
                    <div className="item-image" style={imageStyle}></div>
                </div>
                <div className="booking-item-inner">
                    <div className="content">
                        <div className="item-info">
                            <h2 className="block name">{this.props.booking.band.name}</h2>
                            <h3 className="block date"><i>{moment(this.props.booking.data.start_time).format('dddd, MMMM Do YYYY')}</i></h3>
                            <h3 className={"block status "+this.props.type}>{this._getStatus(this.props.booking.data)}</h3>
                            <h5 className="block headliner"><i>{role}</i></h5>
                        </div>
                        {takeAction}
                    </div>

                    <div className={"booking-message-box"+messageBox}>
                        <div onClick={this._toggleMessageOpen} className="toggle-bar">
                            <h4 className="toggle-bar-text">Message</h4>
                        </div>
                        <div className="message-box-inner">
                            <textarea
                                ref="messagebox"
                                placeholder="Send a message"
                                className="input"></textarea>
                            <div onClick={this._sendMessage} className="send-message">
                                <h4>Send</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
