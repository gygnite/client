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
var io = require('socket.io-client');
var ioConnection = io.connect(BASE_URL, {
    query: 'token='+Cache.get(ACTIONS.cache.AUTH_TOKEN)
});

var createStore = require('redux').createStore;
var applyMiddleware = require('redux').applyMiddleware;
var compose = require('redux').compose;
var Provider = require('react-redux').Provider;
var reducers = require('./reducers/main');

var store = createStore(reducers, {},
    // compose(
        applyMiddleware(socketConnectionMiddleware),
        // window.devToolsExtension && window.devToolsExtension()
    // )
);

socketReceiver(store);


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


                        {/*FIXME:0 Registration Completion*/}
                        <Route path="/register/:code" component={Main.Registration}/>


                        <Route path="/search">
                            <Route path="bands" component={Search.Band}/>
                            <Route path="venues" component={Search.Venue}/>
                        </Route>

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
                                <IndexRoute component={Booking.All}/>
                                <Route path="new" component={Booking.New} onEnter={validateStateBeforeBooking}/>
                                <Route path="e/:entity_slug" component={Booking.SingleEntity}/>
                                <Route path="e/:entity_slug/t/:booking_id" component={Booking.SingleDate}/>
                            </Route>
                            <Route path="/messages" component={Messages.Index}/>
                        </Route>

                        <Route path="/bands/:slug" component={Profile.Band} onLeave={clearProfileStore} />
                        <Route path="/venues/:slug" component={Profile.Venue} onLeave={clearProfileStore} />

                        {/*FIXME:0 Add Catchall 404*/}

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
    store.dispatch(ACTIONS.profile.clearProfile());
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
}




function socketReceiver(store) {

    ioConnection.on('connection', function(socket) {
        socket.join(Cache.get(ACTIONS.cache.USER).id);
    });
    ioConnection.on('message', function(data) {
        store.dispatch(ACTIONS.messages.addMessage(data.message, data.sender, data.receiver));
    });
    ioConnection.on('notification', function(data) {
        store.dispatch(ACTIONS.ui.createAlert(data.text, 'success'));
        store.dispatch(ACTIONS.ui.addNotification(data));
    });
}

function socketConnectionMiddleware(store) {
    return next => action => {
        var result = next(action);
        if (ioConnection && action.type) {
            emitter(ioConnection, action);
        }
        return result;
    }
}



function emitter(io, action) {
    switch (action.type) {
        case 'SET_USER':
            io.emit('connectToRoom', {
                user: action.user.id
            });
            break;
        case 'EMIT_MESSAGE':
            io.emit('message', {
                message: action.message,
                receiver: action.receiver,
                sender: action.sender
            });
            break;
        case 'EMIT_NOTIFICATION':
            io.emit('notification', {
                type: action.notif_type,
                text: action.notif_text,
                slug_to_notify: action.notif_slug,
                id: action.notif_id
            });
            break;
        default: return;
    }
}
