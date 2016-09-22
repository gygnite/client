var React = require('react');
var Link = require('react-router').Link;
// import InfiniteCalendar from 'react-infinite-calendar';
var InfiniteCalendar = require('react-infinite-calendar').default;
var Flickity = require('react-flickity-component')(React);
var moment = require('moment');
var Input = require('../global/input');
var Modal = require('../global/modal');

var dateFormat = "MMM Do";

var Dashboard = React.createClass({
    getInitialState: function() {
        return {
            date: moment().format(dateFormat),
            selectedDate: moment()
        }
    },
    _noBodyScroll: function() {
        document.body.classList.add('no-scroll');
    },
    _removeNoBodyScroll: function() {
        setTimeout(function() {
            document.body.classList.remove('no-scroll');
        }, 150);
    },
    _setSelectedDate: function(e) {
        this.setState({
            selectedDate:  moment(e.target.value)
        });
        this._showDate(e.target.value);
    },
    _showDate: function(date) {
        this.setState({
            date: moment(date).format(dateFormat)
        });
    },
    render: function() {
        return (
            <div className="dashboard">
                <section className="dash-section">
                    <div className="dash-section-3 user-details">
                        <div className="user-img">
                            <div className="icon-group"></div>
                        </div>
                        <div className="settings-icons">
                            <div className="setting-icon">
                                <i className="icon-search"></i>
                            </div>
                            <div className="setting-icon">
                                <i className="icon-comment"></i>
                            </div>
                            <div className="setting-icon">
                                <i className="icon-cog"></i>
                            </div>
                        </div>
                    </div>
                    <div className="dash-section-9 upcoming-gigs">
                        <h1>Upcoming Gigs</h1>
                    </div>
                </section>
                <section className="dash-section">
                    <div className="dash-section-12 user-assets">
                        <div className="dash-section-header">
                            <h1>Current Bands and Venues</h1>
                            <p><i>To move between cards, click the tabs or grab and swipe</i></p>
                        </div>
                        <div className="user-assets-cards">
                            <Flickity
                            className={'carousel'}
                            elementType={'div'}
                            options={{
                                setGallerySize: false,
                                resize: false,
                                cellAlign: 'left',
                                selectedAttraction: 0.2,
                                friction: 0.8,
                                prevNextButtons: false
                            }}>


                                <AssetCard name="Band 1"/>
                                <AssetCard name="Venue 1"/>
                                <NewAssetCard/>

                            </Flickity>
                        </div>
                    </div>
                </section>
                <section className="dash-section">
                    <div className="dash-section-12 band-music">
                        <InfiniteCalendar
                            onScroll={this._noBodyScroll}
                            onScrollEnd={this._removeNoBodyScroll}
                            className="calendar"
                            min={Date.now()}
                            minDate={Date.now()}
                            theme={calTheme}
                            layout="portrait"
                            width={'50%'}
                            height={433}
                            display={'days'}
                            onSelect={this._showDate}
                            selectedDate={this.state.selectedDate}/>
                        <div className="date-details">
                            <div className="form modal-form">
                                <Input>
                                    <input onChange={this._setSelectedDate} ref="email" type="date" required/>
                                </Input>
                            </div>
                            <div className="header">
                                <div className="edit">
                                    <i className="icon-pencil"></i>
                                </div>
                                <h1>{this.state.date}</h1>
                            </div>

                            <div className="timeslots">
                                <Timeslot time={'7:00 PM'}/>
                                <Timeslot time={'8:30 PM'}/>
                                <Timeslot time={'10:00 PM'}/>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
});

module.exports = Dashboard;



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




var Timeslot = React.createClass({
    clickme: function(time, e) {
        alert(time);
    },
    render: function() {
        return (
            <div onClick={this.clickme.bind(this, this.props.time)} className="slot">
                <div className="time">
                    <h2>{this.props.time}</h2>
                </div>
                <div className="slot-content">
                    <h2>Muscular Housecat</h2>
                    <p>Any details about the show?</p>
                </div>
            </div>
        )
    }
});



var AssetCard = React.createClass({
    render: function() {
        return (
            <div className="asset-card">
                <div className="header">
                    <h2>{this.props.name}</h2>
                </div>
            </div>
        )
    }
})



var NewAssetCard = React.createClass({
    getInitialState: function() {
        return {
            open: false
        }
    },
    toggleModal: function() {
        this.setState({
            open: !this.state.open
        });
    },
    render: function() {
        return (
            <div className="asset-card new-card">
                <div className="header">
                    <h2>New Band or Venue</h2>
                </div>
                <div className="icon" onClick={this.toggleModal}>
                    <Modal
                        className="modal-inner"
                        showCloseIcon={true}
                        allowClose={false}
                        open={this.state.open}
                        close={this.toggleModal.bind(this, 'close')}>
                        <BandOrVenueSelection />
                    </Modal>
                    <i className="icon-plus-circled"></i>
                </div>
            </div>
        )
    }
});


var BandOrVenueSelection = React.createClass({
    render: function() {
        return (
            <div className="new-band-or-venue">
                <h1>New Band or Venue</h1>
            </div>
        )
    }
})
