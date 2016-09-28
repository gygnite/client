var React = require('react');
var BookingItem = require('./bookingItem');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');


var AllBookings = React.createClass({
    componentWillMount: function() {
        this.props.fetchTimeslots();
    },
    _setAccepted: function(vid, bid, date) {
        this.props.setAccepted(vid, bid, date);
    },
    _setRejected: function(vid, bid, date) {
        this.props.setRejected(vid, bid, date);
    },

    render: function() {

        var bandTimeslots = this.props.dashboard.pending.bands;
        var venueTimeslots = this.props.dashboard.pending.venues;

        var venueSlots = venueTimeslots.map(function(item) {
            return item.slots.map(function(bk, i) {
                var type = (bk.data.pending) ? 'pending' : ((bk.data.accepted) ? 'accepted' : 'rejected');
                return (
                    <BookingItem key={"bk-"+i} booking={bk}
                        type={type}
                        setAccepted={this._setAccepted}
                        setRejected={this._setRejected}
                        sendMessage={this.props.sendMessage}/>
                );
            }.bind(this));
        }.bind(this));

        if (venueTimeslots.length === 0 || venueSlots.length === 0) {
            venueSlots = (
                <h1>You have no pending bookings!</h1>
            )
        }

        return (
            <div className="bookings-view container">
                <h1 className="header">Pending Bookings</h1>
                    <ReactCSSTransitionGroup
                        transitionName="bookingstatus"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}>
                        {venueSlots}
                    </ReactCSSTransitionGroup>
            </div>
        )
    }
});

module.exports = AllBookings;
