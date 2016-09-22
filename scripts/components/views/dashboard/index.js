var React = require('react');
var AssetCard = require('./assetCard');
var assign = require('object-assign');
var Link = require('react-router').Link;
var cx = require('classnames');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');


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
                                <Link to="/dashboard/settings">
                                    <i className="icon-cog"></i>
                                </Link>
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
