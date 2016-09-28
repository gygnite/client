var React = require('react');
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link;
var Input = require('../global/input');
var Cache = require('lscache');
var cx = require('classnames');
var Geosuggest = require('react-geosuggest').default;
var Modal = require('../global/modal');
import GoogleMap from 'google-map-react';

var VenueSearch = React.createClass({
    getDefaultProps: function() {
        return {
            defaultCenter: {lat: 40.58526019999999, lng:-105.084423},
            defaultZoom: 1
        };
    },
    getInitialState: function() {
        return {
            center: this.props.defaultCenter,
            zoom: this.props.defaultZoom
        }
    },
    componentWillMount: function() {
        var center = Cache.get('venue_search');
        if (center) {
            this.setState({
                center: center,
                zoom: 13
            });
        }
    },
    _onMapMove: function(mapEvent) {
        if (mapEvent.bounds.se.lng - mapEvent.bounds.nw.lng < 0.01) {
            //handle lack of map on mobile
            mapEvent.bounds.se.lng += 0.1;
            mapEvent.bounds.nw.lng -= 0.1;
        }
        Cache.set('venue_search', mapEvent.center);
        this.props.fetchVenues(mapEvent.bounds);
    },
    _handleInput: function(field, value) {},
    _captureLocation: function(loc) {
        this.setState({
            center: {
                lat: loc.location.lat,
                lng: loc.location.lng
            },
            zoom: 13
        });
    },
    _distanceToMouse: function(markerPos, mousePos, markerProps) {
        var K_CIRCLE_SIZE = 30;
        var K_STICK_SIZE = 20;


        var x = markerPos.x + 40;
        // because of marker non symmetric,
        // we transform it central point to measure distance from marker circle center
        // you can change distance function to any other distance measure
        var y = (markerPos.y + 40) - 5;

        var distanceKoef = 0.8;
        // it's just a simple example, you can tweak distance function as you wish
        // console.log("distanceKoef * Math.sqrt((x - mousePos.x) * (x - mousePos.x) + (y - mousePos.y) * (y - mousePos.y))", )
        return distanceKoef * Math.sqrt((x - mousePos.x) * (x - mousePos.x) + (y - mousePos.y) * (y - mousePos.y));
    },
    _showActiveMarker: function(marker, data) {
        // console.log("data.id", data.id);
        this.props.setActiveHover(data.id);
    },
    _hideActiveMarker: function(marker, data) {
        // console.log("leaving! marker", data);
        this.props.clearActiveHover(data.id);
    },
    _handleMapClick: function(obj) {
        //close all map balloons

    },
    render: function() {
        var markers = this.props.search.results.map(function(marker, index) {
            var lat = Number(marker.lat);
            var lng = Number(marker.lng);
            return (
                <Marker
                    id={marker.id}
                    key={'marker-'+index}
                    lat={lat}
                    lng={lng}
                    data={marker}/>
            );
        });
        var markerListItems = this.props.search.results.map(function(marker, index) {
            return (
                <MarkerListItem
                    key={"list-marker-"+index}
                    data={marker}
                    onEnter={this._showActiveMarker}
                    onLeave={this._hideActiveMarker}/>
            );
        }.bind(this));
        return (
            <div id="map-component">
                <div className="true-map-box">
                    <GoogleMap
                        bootstrapURLKeys={{
                            key: mapApi.key,
                            language: mapApi.language
                        }}
                        defaultCenter={this.props.defaultCenter}
                        defaultZoom={this.props.defaultZoom}
                        zoom={this.state.zoom}
                        center={this.state.center}
                        onChange={this._onMapMove}
                        hoverDistance={25}
                        debounced={true}
                        onClick={this._handleMapClick}
                        distanceToMouse={this._distanceToMouse}
                        onChildMouseEnter={this._showActiveMarker}
                        onChildMouseLeave={this._hideActiveMarker}>
                        {markers}
                    </GoogleMap>
                </div>
                <div className="map-components-box">
                    <div className="map-search-box">
                        <span><i className="icon-search"></i></span>
                        <Input
                            for="search"
                            handleUserInput={this._handleInput}>
                            <Geosuggest
                                placeholder="Search Venues!"
                                onSuggestSelect={this._captureLocation}
                                types={['geocode', 'establishment']}
                                queryDelay={150}/>
                        </Input>
                    </div>
                    <div className="map-list-box">
                        <ul className="marker-list">
                            {markerListItems}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = VenueSearch;





var Marker = React.createClass({
    getInitialState: function() {
        return {
            open: false
        }
    },
    _toggleBalloon: function() {
        this.setState({
            open: !this.state.open
        });
    },
    close: function() {
        this.setState({
            open: false
        });
    },
    render: function() {
        var balloon = cx({
            ' show-balloon': this.state.open
        });
        var hover = cx({
            ' hover': this.props.$hover || this.props.data.isActive
        });
        return (
            <div className="marker">
                <div className="marker-container">
                    <i className={"icon-location" + hover + balloon} onClick={this._toggleBalloon}></i>
                </div>
                <div className={"marker-balloon-container" + balloon} onClick={this._toggleBalloon}>
                    <h3>{this.props.data.name}</h3>
                </div>
            </div>
        )
    }
});

var MarkerListItem = React.createClass({
    render: function() {
        var active = cx({
            ' active':this.props.data.isActive
        });
        console.log("marker item", this.props.data);
        var imgStyle = {
            backgroundImage: 'url('+this.props.data.profile_image+')'
        };
        return (
            <Link to={"/venues/"+this.props.data.slug}>
                <li onMouseEnter={this.props.onEnter.bind(null, null, this.props.data)}
                    onMouseLeave={this.props.onLeave.bind(null, null, this.props.data)}
                    className={"marker-list-item"+active}>
                    <div className="title-box">
                        <h2 className="name">{this.props.data.name}</h2>
                        <h3 className="location"><i>{this.props.data.address}</i></h3>
                        <h3 className="location"><i>{this.props.data.city_state}</i></h3>
                    </div>
                </li>
            </Link>
        )
    }
});




function getUserLocation() {
    return new Promise(function(resolve, reject) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                resolve(pos);
            }, function() {
                reject({lat: null, lng: null});
            });
        } else {
            console.error("Browser doesn't support geolocation.");
            reject({lat: null, lng: null});
        }
    });
}




var API_KEY = 'AIzaSyB6x0hsaTwZ0w_xUsdsYI3FWF_xYWWoupM';
var mapApi = {
   key: API_KEY,
   language: 'en'
};
