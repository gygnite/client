'use strict';

global.BASE_URL = require('./apiurl').apiurl;
global.ACTIONS = require('./actions/main');

var React = require('react');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var browserHistory = require('react-router').browserHistory;
var IndexRoute = require('react-router').IndexRoute;
var Cache = require('lscache');
var request = require('superagent');
require('superagent-auth-bearer')(request);
// var mapApi = require('./mapApi');

var createStore = require('redux').createStore;
var Provider = require('react-redux').Provider;
var reducers = require('./reducers/main');
var store = createStore(reducers, {},
    window.devToolsExtension && window.devToolsExtension()
);

var Template = require('./components/controllers/template');

var Main = require('./components/controllers/Main');
var Dashboard = Main.Dashboard;
var Bands = Dashboard.Bands;
var Venues = Dashboard.Venues;
var Profile = Main.Profile;
var Search = Main.Search;
var Booking = Main.Booking;
var Messages = Main.Messages;

var AppRouter = React.createClass({
    render: function() {
        return (
            <Provider store={store}>
                <Router history={browserHistory} >
                    <Route path={ROUTE_CONSTANTS.INDEX} component={Template}>
                        {/*Home Page*/}
                        <IndexRoute component={Main.Index}/>


                        {/*Registration Completion*/}
                        <Route path="/register/:code" component={Main.Registration}/>


                        <Route path={ROUTE_CONSTANTS.DASHBOARD.BASE} onEnter={AuthMiddleware}>
                            <IndexRoute component={Dashboard.Index}/>
                            <Route path={ROUTE_CONSTANTS.BANDS.BASE}>
                                <IndexRoute component={Bands.All}/>
                                <Route path={ROUTE_CONSTANTS.BANDS.NEW} component={Bands.New}/>
                            </Route>
                            <Route path={ROUTE_CONSTANTS.VENUES.BASE}>
                                <Route path={ROUTE_CONSTANTS.VENUES.NEW} component={Venues.New}/>
                            </Route>
                            <Route path={ROUTE_CONSTANTS.DASHBOARD.SETTINGS} component={Dashboard.Settings}/>
                            <Route path="/booking">
                                <Route path="new" component={Booking.New} onEnter={validateStateBeforeBooking}/>
                            </Route>
                            <Route path="/messages" component={Messages.Index}/>
                        </Route>

                        {/* FIXME: Update CWU to not need auth token */}
                        <Route path="/bands/:slug" component={Profile.Band} onLeave={clearProfileStore} />
                        <Route path="/venues/:slug" component={Profile.Venue} onLeave={clearProfileStore} />

                        <Route path="/search">
                            <Route path="bands" component={Search.Band}/>
                            <Route path="venues" component={Search.Venue}/>
                        </Route>
                        {/*Add Catchall 404*/}

                    </Route>
                </Router>
            </Provider>
        )
    }
});


var ROUTE_CONSTANTS = {
    INDEX: '/',
    DASHBOARD: {
        BASE: 'dashboard',
        SETTINGS: 'settings'
    },
    BANDS: {
        BASE: '/bands',
        NEW: 'new'
    },
    VENUES: {
        BASE: '/venues',
        NEW: 'new'
    }
};

module.exports = {
    AppRouter: AppRouter,
    ROUTE_CONSTANTS: ROUTE_CONSTANTS
};


function AuthMiddleware(nextState, replace, callback) {
    var token = Cache.get(ACTIONS.cache.AUTH_TOKEN);
    var user = Cache.get(ACTIONS.cache.USER);
    if (token && user) {
        callback();
    } else {
        Cache.remove(ACTIONS.cache.AUTH_TOKEN);
        Cache.remove(ACTIONS.cache.USER);
        replace('/');
        callback();
    }
}


function clearProfileStore(prevState) {
    console.log("prevstate: ", prevState);
    console.log("store state on exit: ", store.getState());
    store.dispatch(ACTIONS.profile.clearProfile());
    console.log("store state after clear exit: ", store.getState());
}


function validateStateBeforeBooking(nextState, replace) {
    if (!nextState.location.state) {
        store.dispatch(ACTIONS.ui.createAlert('Please choose a venue and date.', 'error'))
        replace('/search/venues');
    } else if (!nextState.location.state.date && !nextState.location.state.order && !nextState.location.state.venue) {
        store.dispatch(ACTIONS.ui.createAlert('Please choose a venue and date.', 'error'))
        replace('/search/venues');
    } else {
        //go
    }
    // console.log("replace", replace);
    // console.log("nextState", callback());
}
