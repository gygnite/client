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

var AppRouter = React.createClass({
    render: function() {
        return (
            <Provider store={store}>
                <Router history={browserHistory} onUpdate={() => window.scrollTo(0, 0)}>
                    <Route path={ROUTE_CONSTANTS.INDEX} component={Template}>
                        {/*Home Page*/}
                        <IndexRoute component={Main.Index}/>


                        {/*Registration Completion*/}
                        <Route path="/register/:code" component={Main.Registration}/>


                        <Route path={ROUTE_CONSTANTS.DASHBOARD} onEnter={AuthMiddleware}>
                            <IndexRoute component={Dashboard.Index}/>
                            <Route path={ROUTE_CONSTANTS.BANDS.BASE}>
                                <IndexRoute component={Bands.All}/>
                                <Route path={ROUTE_CONSTANTS.BANDS.NEW} component={Bands.New}/>
                            </Route>
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
    DASHBOARD: 'dashboard',
    BANDS: {
        BASE: 'bands',
        NEW: 'new'
    }
};

module.exports = {
    AppRouter: AppRouter,
    ROUTE_CONSTANTS: ROUTE_CONSTANTS
};


function AuthMiddleware(nextState, replace, callback) {
    var token = Cache.get(ACTIONS.cache.AUTH_TOKEN);
    if (token) {
        // console.log("token?", )
        request(BASE_URL + '/auth')
            .authBearer(token)
            .end(function(err, res) {
                // console.log("res: ", res);
                if (err || !res.body.user || !res.body.user.first_name) {
                    // console.log("should redirect?")
                    replace('/');
                    callback();
                } else {
                    callback();
                }
            });
    } else {
        replace('/');
        callback();
    }
}
