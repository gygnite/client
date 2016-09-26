'use strict';
var React = require('react');
var moment = require('moment');
var cx = require('classnames');
var Link = require('react-router').Link;

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
        var message = {
            content: this.refs.messagebox.value.trim(),
            sender: this.props.booking.venue.id,
            receiver: this.props.booking.band.id,
            type: 'venue'
        };
        this.props.sendMessage(message.content, message.type, message.receiver, message.sender);
        this.refs.messagebox.value = '';
        this.setState({
            messageOpen: false
        });
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
                            <Link to={"/bands/"+this.props.booking.band.slug}>
                                <h2 className="block name">{this.props.booking.band.name}</h2>
                            </Link>
                            <Link to={"/booking/e/"+this.props.booking.venue.slug+"/t/"+this.props.booking.data.timeslot_id}>
                                <h3 className="block date"><i>{moment(this.props.booking.data.start_time).format('dddd, MMMM Do YYYY')}</i></h3>
                            </Link>
                            <h3 className="block venue"><i>{this.props.booking.venue.name}</i></h3>
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


module.exports = BookingItem;
