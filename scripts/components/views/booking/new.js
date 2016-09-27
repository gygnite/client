var React = require('react');
var Modal = require('../global/modal');
var browserHistory = require('react-router').browserHistory;
var moment = require('moment');
var assign = require('object-assign');
var TextArea = require('../global/textarea');

var NewBooking = React.createClass({
    getInitialState: function() {
        return {
            venue: this.props.location.state.venue,
            date: this.props.location.state.date,
            order: this.props.location.state.order,
            modalOpen: true,
            selectedBand: {},
            message: ''
        }
    },
    componentWillMount: function() {
        this.props.fetchBands();
        window.scrollTo(0,0);
    },
    _closeModal: function() {
        this.setState({
            modalOpen: false
        });
    },
    _returnToSearch: function() {
        browserHistory.push('/search/venues');
        this._closeModal();
    },
    _returnToProfile: function() {
        browserHistory.push('/venues/'+this.props.location.state.venue.slug);
        this._closeModal();
    },
    _setSelectedBand: function(band) {
        this.setState({
            selectedBand: band,
            modalOpen: false
        });
    },
    _handleBookingMessage: function(field, value) {
        this.setState({
            message: value
        });
    },
    _handleBookingRequest: function() {
        var details = {
            originType: 'bands',
            band: this.state.selectedBand.id,
            venue: this.state.venue.id,
            date: this.state.date,
            headliner: this.state.order === 1,
            message: this.state.message,
            band_name: this.state.selectedBand.name,
            venue_slug: this.state.venue.slug
        };
        this.props.createBookingRequest(details);
    },
    render: function() {
        var actOrder = 'supporting';
        if (this.props.location.state.order === 1) {
            actOrder = 'headlining';
        }
        var bands = [];
        bands = this.props.bands.allbands.map(function(band, index) {
            return (
                <li onClick={this._setSelectedBand.bind(this, band)} className="band-list-item" key={"band-"+index}>
                    <div className="band-image">
                        <img src={band.profile_image} alt=""/>
                    </div>
                    <div className="band-title">
                        <h3 className="text">{band.name}</h3>
                    </div>
                </li>
            );
        }.bind(this));

        var order = (this.state.order === 1) ? 'Headlining Act' : 'Supporting Act';

        var completeButton = (
            <div onClick={this._handleBookingRequest} className="button primary">
                <h3>Send Booking Request</h3>
            </div>
        );
        if (this.props.ui.isPostingBooking) {
            var completeButton = (
                <div className="button primary">
                    <i className="icon-loader animate-spin"></i>
                </div>
            );
        }

        return (
            <div className="booking-page">
                <Modal className="modal-inner band-selection"
                    open={this.state.modalOpen}
                    close={this._closeModal}
                    allowClose={false}
                    showCloseIcon={false}>
                    <h1 className="headline">New Booking at {this.props.location.state.venue.name}</h1>
                    <h2 className="date"><i>{moment(this.props.location.state.date).format("dddd, MMM Do Y")}</i></h2>
                    <h4 className="order">As the {actOrder} act</h4>
                    <h3 className="select-headline">Please choose a band for this gig</h3>
                    <ul className="band-list">
                        {bands}
                    </ul>
                    <hr/>
                    <div onClick={this._returnToSearch} className="button extra">Return to search</div>
                    <div onClick={this._returnToProfile} className="button primary">Return to venue profile</div>
                </Modal>
                <div className="booking-checkout">
                    <div className="booking-header">
                        <h1 className="title">Confirm your booking</h1>
                        <p className="disclaimer"><i>This booking will be sent to the venue to be either accepted or rejected.</i></p>
                        <p className="disclaimer"><i>You may discuss further details with the venue in your inbox.</i></p>
                    </div>

                    <div className="booking-details">
                        <div className="details-section">
                            <div className="details-header">
                                <h1>Band</h1>
                            </div>
                            <div className="details-content">
                                <h2>{this.state.selectedBand.name}</h2>
                            </div>
                        </div>
                        <div className="details-section">
                            <div className="details-header">
                                <h1>Venue</h1>
                            </div>
                            <div className="details-content">
                                <h2>{this.state.venue.name}</h2>
                            </div>
                        </div>
                        <div className="details-section">
                            <div className="details-header">
                                <h1>Date</h1>
                            </div>
                            <div className="details-content">
                                <h2>{moment(this.state.date).format("dddd, MMM Do Y")}</h2>
                            </div>
                        </div>
                        <div className="details-section">
                            <div className="details-header">
                                <h1>Position</h1>
                            </div>
                            <div className="details-content">
                                <h2>{order}</h2>
                            </div>
                        </div>
                        <div className="details-section">
                            <div className="details-header">
                                <h1>Message</h1>
                            </div>
                            <div className="details-content">
                                <TextArea
                                    for="message"
                                    label="Send a message with your booking"
                                    handleUserInput={this._handleBookingMessage}/>
                            </div>
                        </div>
                        <div className="details-section">
                            {completeButton}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = NewBooking;
