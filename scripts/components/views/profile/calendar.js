var React = require('react');
var InfiniteCalendar = require('react-infinite-calendar').default;
var Input = require('../global/input');
var moment = require('moment');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
var Cache = require('lscache');
var request = require('superagent');

var CalendarView = React.createClass({
    getInitialState: function() {
        return {
            selectedDate: new Date()
        }
    },
    _setSelectedDate: function(date) {
        this.setState({
            selectedDate: date
        });
    },
    _noBodyScroll: function() {
        document.body.classList.add('no-scroll');
    },
    _removeNoBodyScroll: function() {
        setTimeout(function() {
            document.body.classList.remove('no-scroll');
        }, 150);
    },
    _handleNewVenueBooking: function(e, order) {
        e.preventDefault();

        //check if user is logged in
        //check if user has bands to book with

        var token = Cache.get(ACTIONS.cache.AUTH_TOKEN);

        if (token) {
            //no user, show alert, must be logged in
            var date = moment(this.state.selectedDate);
            var venue = this.props.data;
            console.log("this.state.selectedDate", date);
            console.log("this.state.venue", venue);
            browserHistory.push({
                pathname: '/booking/new',
                state: { date: date, venue: venue, order: order}
            });
        } else {
            //redirect to booking page
            //check there if bands exist
        }

    },
    render: function() {
        console.log("browserHistory: ",browserHistory);
        var timeslots = [];
        if (this.props.data && this.props.data.timeslots) {
            timeslots = this.props.data.timeslots.filter(function(ts, index) {
                return moment(this.state.selectedDate).isSame(ts.start_time, 'day');
            }.bind(this));
            console.log("timeslots", timeslots);
        }

        var timeslotComponent = null;
        if (this.props.type === 'band') {
            timeslotComponent = (<BandTimeslots timeslots={timeslots}/>);
        } else {
            timeslotComponent = (
                <VenueTimeslots
                    handleNewBooking={this._handleNewVenueBooking}
                    timeslots={timeslots}/>
            );
        }

        return (
            <div className="profile-calendar">
                <InfiniteCalendar
                    onScroll={this._noBodyScroll}
                    onScrollEnd={this._removeNoBodyScroll}
                    className="calendar"
                    min={Date.now()}
                    minDate={Date.now()}
                    max={moment().add(2, 'y')}
                    theme={calTheme}
                    layout="portrait"
                    width={'50%'}
                    height={433}
                    display={'days'}
                    onSelect={this._setSelectedDate}
                    selectedDate={this.state.selectedDate}/>
                <div className="date-details">
                    <div className="form modal-form">
                        <Input handleUserInput={this._setSelectedDate}>
                            <input type="date" required/>
                        </Input>
                    </div>
                    <div className="header">
                        <h2>Events for {this.props.data.name}</h2>
                    </div>

                    {timeslotComponent}

                </div>
            </div>

        )
    }
});

module.exports = CalendarView;




var BandTimeslots = React.createClass({
    render: function() {
        console.log("timeslots", this.props.timeslots);
        return (
            <div className="timeslots">
                {this.props.timeslots.map(function(ts, index) {
                    return (
                        <div key={"ts-"+index}>
                            <h2>{moment(ts.start_time).format('dddd, hA')}</h2>
                            <h3>at {ts.name}</h3>
                        </div>
                    );
                })}
            </div>
        )
    }
});


var VenueTimeslots = React.createClass({
    render: function() {

        var timeslots = this.props.timeslots;

        if (timeslots.length < 2) {
            var diff = 2 - this.props.timeslots.length;
            var blanks = Array(diff).fill({empty: true});
            if (timeslots.length > 0) {
                if (timeslots[0].headliner) {
                    timeslots = timeslots.concat(blanks);
                } else {
                    timeslots = blanks.concat(timeslots);
                }
            } else {
                timeslots = blanks;
            }
        }
        timeslots = timeslots.map(function(ts, index) {
            if (ts.empty) {
                return (
                    <Slot
                        handleNewBooking={this.props.handleNewBooking}
                        key={"ts-"+index} type="blank" order={index+1}/>
                    );
            } else {
                return (
                    <Slot
                        handleNewBooking={this.props.handleNewBooking}
                        key={"ts-"+index} type="ts" data={ts}/>
                );
            }
        }.bind(this));
        return (
            <div className="timeslots">
                {timeslots}
            </div>
        )
    }
});



var Slot = React.createClass({
    _handleNewBooking: function(e) {
        if (this.props.handleNewBooking) {
            this.props.handleNewBooking(e, this.props.order);
        }
    },
    render: function() {
        var slot = null;
        console.log("props!", this.props);
        if (this.props.type === 'blank') {
            slot = (
                <Link onClick={this._handleNewBooking} to="/booking/new">
                    <div className="timeslot-inner blank">
                        <h3 className="text">Open availability, book now!</h3>
                    </div>
                </Link>
            );
        } else {
            if (this.props.data.pending || this.props.data.venue_booking) {
                slot = (
                    <div className="timeslot-inner unavailable">
                        <h3>Timeslot unavailable</h3>
                    </div>
                );
            } else {
                slot = (
                    <div className="timeslot-inner">
                        <h3>{this.props.data.name}</h3>
                    </div>
                );
            }
        }
        return (
            <div className={"timeslot "+this.props.type}>
                {slot}
            </div>
        )
    }
});






var calTheme = {
    selectionColor: 'rgb(146, 118, 255)',
    textColor: {
        default: '#333',
        active: '#FFF'
    },
    weekdayColor: 'rgb(146, 118, 255)',
    headerColor: 'rgb(127, 95, 251)',
    floatingNav: {
        background: 'rgba(81, 67, 138, 0.96)',
        color: '#FFF',
        chevron: '#FFA726'
    }
};
