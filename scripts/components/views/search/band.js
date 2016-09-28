var React = require('react');
var BandCard = require('./bandCard');
var Cache = require('lscache');
var TagInputProps = require('../global/taginputprops');
var Input = require('../global/input');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var BandSearch = React.createClass({
    updateSearchWait: null,

    componentWillMount: function() {
        var s = Cache.get('band_search');
        if (s) {
            this._handleSearchInput(null, s.query);
            this.props.clearGenres();
            s.genres.forEach(function(g) {
                this._addGenre(g);
            }.bind(this));
        }
    },

    getInitialState: function() {
        return {
            searchInput: ''
        }
    },

    _handleSearchInput: function(field, value) {
        this.setState({
            searchInput: value
        });
        this._updateSearchQuery();
    },

    _addGenre: function(value) {
        this.props.addGenre(value);
        this._doSearchWait();
    },

    _removeGenre: function(index) {
        this.props.removeGenre(index);
        this._doSearchWait();
    },

    _updateSearchQuery: function() {
        if (!this.updateSearchWait) {
            this._doSearchWait();
        } else {
            clearTimeout(this.updateSearchWait);
            this._doSearchWait();
        }
    },

    _doSearchWait: function() {
        this.updateSearchWait = setTimeout(function() {
            this.props.updateSearchQuery(this.state.searchInput);
            this._submitSearch();
        }.bind(this), 250);
    },

    _submitSearch: function() {
        this.props.fetchBands(this.props.search.query, this.props.search.genres);
    },

    render: function() {
        var results = this.props.search.results.map(function(result, index) {
            return (<BandCard key={"result-"+index} band={result}/>);
        });
        return (
            <div className="result-page band-results container">
                <h1>Band Searches</h1>
                <Input
                    className=""
                    for="query"
                    label="Type a Search"
                    initialValue={this.state.searchInput}
                    handleUserInput={this._handleSearchInput}>
                    <input type="text"/>
                </Input>
                <TagInputProps
                    className=""
                    for="genres"
                    label="Genre"
                    placeholder="+ genre"
                    tags={this.props.search.genres}
                    addTag={this._addGenre}
                    removeTag={this._removeGenre}
                    handleUserInput={this._handleChange}/>
                <h2>Your search returned {this.props.search.results.length} results.</h2>
                <ul className="result-list">
                    <ReactCSSTransitionGroup
                        transitionName="resultcard"
                        transitionEnterTimeout={250}
                        transitionLeaveTimeout={250}>
                        {results}
                    </ReactCSSTransitionGroup>
                </ul>
            </div>
        )
    }
});

module.exports = BandSearch;
