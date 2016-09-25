var React = require('react');
var moment = require('moment');
var cx = require('classnames');
var BookingItem = require('./bookingItem');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var BookingSingleDate = React.createClass({
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











module.exports = BookingSingleDate;
