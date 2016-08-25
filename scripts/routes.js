var React = require('react');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var browserHistory = require('react-router').browserHistory;
var IndexRoute = require('react-router').IndexRoute;

// var mapApi = require('./mapApi');

var createStore = require('redux').createStore;
var Provider = require('react-redux').Provider;
var reducers = require('./reducers/main');
var store = createStore(reducers, {},
    window.devToolsExtension && window.devToolsExtension()
);

var Template = require('./template');

var Main = require('./components/controllers/Main');

var AppRouter = React.createClass({
    render: function() {
        return (
            <Provider store={store}>
                <Router history={browserHistory}>
                    <Route path={ROUTE_CONSTANTS.INDEX} component={Template}>

                        <IndexRoute component={Main.Index}/>

                    </Route>
                </Router>
            </Provider>
        )
    }
});


var ROUTE_CONSTANTS = {
    INDEX: '/'
};

module.exports = {
    AppRouter: AppRouter,
    ROUTE_CONSTANTS: ROUTE_CONSTANTS
};
