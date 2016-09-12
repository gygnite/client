var React = require('react');
var AssetCard = require('./assetCard');
var assign = require('object-assign');
var Link = require('react-router').Link;
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');


var Index = React.createClass({
    componentWillMount: function() {
        this.props.fetchDashboard();
    },
    render: function() {
        var bandLoader = (<i className="icon-loader animate-spin"></i>);
        var assets = [];
        if (!this.props.bands.isFetchingBands || this.props.venues.isFetchingVenues) {
            bandLoader = null;
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
        var assetCards = assets.map(function(asset, index) {
            return (<AssetCard key={"card-"+index} data={asset}/>)
        });
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
                        </div>
                        <ul className="user-assets-cards">

                            {bandLoader}

                            {assetCards}

                            <NewAssetCard />

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
