var React = require('react');
var moment = require('moment');
var BookingItem = require('./bookingItem');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var SingleEntity = React.createClass({
    componentWillMount: function() {
        this.props.fetchAllBookings(this.props.params.entity_slug);
    },
    render: function() {
        // console.log("props; ", this.props);
        console.log("bookings", this.props.bookings);

        var pending = [];
        var confirmed = [];
        var rejected = [];

        var bookings = null;
        if (this.props.bookings.length > 0) {

            pending = this.props.bookings.filter(function(bk, i) {
                return bk.pending;
            }).map(function(bk, i) {
                return (
                    <BookingItem key={"bk-"+i} booking={bk}
                        type="pending"
                        setAccepted={this._setAccepted}
                        setRejected={this._setRejected}/>
                );
            }.bind(this));

            confirmed = this.props.bookings.filter(function(bk, i) {
                return bk.accepted;
            }).map(function(bk, i) {
                return (
                    <BookingItem key={"bk-"+i} booking={bk}
                        type="accepted"
                        setAccepted={this._setAccepted}
                        setRejected={this._setRejected}/>
                );
            }.bind(this));

            rejected = this.props.bookings.filter(function(bk, i) {
                return bk.rejected;
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

module.exports = SingleEntity;
