var React = require('react');
var ReactDOM = require('react-dom');
var Routes = require('./routes').AppRouter;
var node = document.getElementById('app-root');

ReactDOM.render(<Routes />, node);
