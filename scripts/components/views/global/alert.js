var React = require('react');
var ReactDOM = require('react-dom');
var cx = require('classnames');
var alertTiming = 3000;

var Alert = React.createClass({
    portal: false,
    getInitialState: function() {
        return {
            show: false,
            alerts: null
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.alerts.length > 0) {
            this._mount(nextProps);
        }
    },
    componentWillUpdate: function(nextProps, nextState) {
        if (nextProps.ui.alerts.length < 1 && this.portal) {
            this._unmount();
        }
    },
    _mount: function(props) {
        var windowExists = document.getElementById('single-alert-window');
        if (!this.portal && !windowExists) {
            this.portal = document.createElement('div');
            this.portal.className = 'alert-window';
            this.portal.id = 'single-alert-window';
            document.body.appendChild(this.portal);
        } else {
            this.portal = windowExists;
        }
        this._doRender(props);
    },
    _doRender: function(props) {
        var alerts = props.alerts.map(function(alert, index) {
            return (<AlertWindow key={"alert-"+index} alert={alert} removeAlert={props.removeAlert}/>);
        });
        ReactDOM.render(<div className="alert-box">
            {alerts}
        </div>, this.portal);
    },
    _unmount: function() {
        this.setState({
            alerts: []
        });
        if (this.portal) {
            document.body.removeChild(this.portal);
            this.portal = null;
        }
    },
    render: function() {
        return (
            <div className="alerts">
                {this.state.alerts}
            </div>
        );
    }
});


module.exports = Alert;



var AlertWindow = React.createClass({
    getInitialState: function() {
        return {
            enter: true,
            active: false,
            leave: false
        }
    },
    componentDidMount: function() {
        setTimeout(function() {
            this._showActive();
        }.bind(this), 10);
        setTimeout(function() {
            this._handleLeave();
        }.bind(this), 300000);
    },
    _showActive: function() {
        this.setState({
            enter: false,
            active: true
        });
    },
    _handleLeave: function() {
        this.setState({
            active: false,
            leave: true
        });
        setTimeout(function() {
            this._removeAlert();
        }.bind(this), 500);
    },
    _removeAlert: function() {
        this.props.removeAlert();
    },
    render: function() {
        //Based on props, show either check, X, or none
        //show message
        var alertMotion = cx({
            ' enter': this.state.enter,
            ' active': this.state.active,
            ' leave': this.state.leave
        });
        var status = (<i className={"alert-icon icon-"+this.props.alert.status}></i>);
        return (
            <div className={"alert-window" + alertMotion}>
                <div className="inner-alert-window">
                    {status}
                    <h4 className="alert-message">{this.props.alert.message}</h4>
                </div>
            </div>
        );
    }
});
