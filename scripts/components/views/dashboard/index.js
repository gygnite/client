var React = require('react');
var AssetCard = require('./assetCard');
var assign = require('object-assign');
var Link = require('react-router').Link;
var cx = require('classnames');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var moment = require('moment');

var Index = React.createClass({
    getInitialState: function() {
        return {
            showSearchSelector: false
        }
    },
    _toggleSearchSelector: function() {
        this.setState({
            showSearchSelector: !this.state.showSearchSelector
        });
    },
    componentWillMount: function() {
        this.props.fetchDashboard();
    },
    render: function() {
        var assetCards = (<i className="icon-loader animate-spin"></i>);
        var assets = [];
        if (!this.props.bands.isFetchingBands || this.props.venues.isFetchingVenues) {
            assets = null;
        };
        var bands = this.props.bands.allbands.map(function(band) {
            return assign({}, band, {
                type: 'band'
            });
        });
        var venues = this.props.venues.allvenues.map(function(venue) {
            return assign({}, venue, {
                type: 'venue'
            });
        });
        if (bands.length > venues.length) {
            assets = bands.concat(venues);
        } else {
            assets = venues.concat(bands);
        }
        if (assets) {
            var assetCards = assets.map(function(asset, index) {
               return (<AssetCard key={"card-"+index} data={asset}/>)
            });
        }


        var upcomingGigs = this.props.dashboard.timeslots.map(function(slot, i) {
            console.log("slog!", slot);
            return (
                <div key={"slot-"+i} className="upcoming-gig-item">
                    <div className="date-box">
                        <span><i className="icon-success"></i></span>
                        <h1 className="day">{moment(slot.data.start_time).format('DD')}</h1>
                        <h4 className="month">{moment(slot.data.start_time).format('MMMM')}</h4>
                    </div>
                    <div className="content-box">
                        <h3 className="content-title"><span><i className="icon-mic"></i></span>{slot.band.name}</h3>
                        <h3 className="content-title"><span><i className="icon-location"></i></span>{slot.venue.name}</h3>
                    </div>
                </div>
            )
        });

        var userImageBoxStyle = {
            backgroundImage: 'url('+this.props.user.profile_image+')'
        };
        var searchSelector = cx({
            ' show': this.state.showSearchSelector
        });
        return (
            <div className="dashboard">
                <section className="dash-section">
                    <div className="dash-section-3 user-details">
                        <div className="user-image profile_image" style={userImageBoxStyle}></div>
                        <div className="settings-icons">
                            <div className="setting-icon">
                                <i onClick={this._toggleSearchSelector} className="icon-search"></i>
                                <div className={"search-selector"+searchSelector}>
                                    <div className="arrow-up"></div>
                                    <Link to="/search/bands">
                                        <div className="search-selector-bands search-selector-inner">
                                            <h5>Bands</h5>
                                        </div>
                                    </Link>

                                    <Link to="/search/venues">
                                        <div className="search-selector-venues search-selector-inner">
                                            <h5>Venues</h5>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className="setting-icon">
                                <Link to="/messages">
                                    <i className="icon-comment"></i>
                                </Link>
                            </div>
                            <div className="setting-icon">
                                <Link to="/booking">
                                    <i className="icon-calendar"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="dash-section-9 upcoming-gigs">
                        <div className="dash-section-search">
                            <Link to="/search/venues">
                                <h1>Find a venue to book!</h1>
                            </Link>
                        </div>
                        <h1 className="dash-section-header">Upcoming Gigs</h1>
                        <ul className="upcoming-gigs-list">
                            {upcomingGigs}
                        </ul>
                    </div>
                </section>
                <section className="dash-section">
                    <div className="dash-section-12 user-assets">
                        <div className="dash-section-header">
                            <h1>Current Bands and Venues</h1>
                        </div>
                        <ul className="user-assets-cards">
                            <ReactCSSTransitionGroup
                                transitionName="assetcard"
                                transitionEnterTimeout={250}
                                transitionLeaveTimeout={250}>
                                {assetCards}
                                <NewAssetCard />
                            </ReactCSSTransitionGroup>
                        </ul>
                    </div>
                </section>
            </div>
        )
    }
})

module.exports = Index;




var NewAssetCard = React.createClass({
    render: function() {
        return (
            <li className="asset-card new-asset">

                <Link to="/bands/new">
                    <div className="new-item section">
                            <h3 className="new-asset-text">New Band</h3>
                            <i className="icon-plus-circled"></i>
                    </div>
                </Link>

                <Link to="/venues/new">
                    <div className="new-item section last">
                        <h3 className="new-asset-text">New Venue</h3>
                        <i className="icon-plus-circled"></i>
                    </div>
                </Link>

            </li>
        )
    }
});
