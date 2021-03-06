var React = require('react');
var cx = require('classnames');


var Transition = React.createClass({
    PropTypes: {
        transitionName: React.PropTypes.string.isRequired,
        currentLocation: React.PropTypes.object.isRequired
    },
    getDefaultProps: function() {
        return {
            enterTimeout: 300,
            leaveTimeout: 300,
        };
    },
    getInitialState: function() {
        return {
            enter: true,
            active: false,
            leave: false
        }
    },
    componentWillMount: function() {
        this.handleEnter();
    },
    componentWillReceiveProps: function(nextProps) {
        var currLocation = this.props.currentLocation;
        var nextLocation = nextProps.currentLocation;
        if (currLocation.pathname === nextLocation.pathname
            && currLocation.hash === nextLocation.hash
            && currLocation.search === nextLocation.search) {
            return;
        }
        this.handleLeave();
        this.handleTransitionEnter();
        setTimeout(function() {
            this.handleEnter();
        }.bind(this), 10);

    },
    handleLeave: function() {
        this.setState({
            leave: true,
            enter: false,
            active: false
        });
    },
    handleTransitionEnter: function() {
        setTimeout(function() {
            this.setState({
                enter: true,
                active: false,
                leave: false
            });
        }.bind(this), 10);
    },
    handleEnter: function() {
        setTimeout(function() {
            this.setState({
                active: true,
                enter: false,
                leave: false
            });
        }.bind(this), 10);
    },
    mapChildren: function(child) {
        var enter = cx({
            '-enter': this.state.enter
        });
        var active = cx({
            '-active': this.state.active
        });
        var leave = cx({
            '-leave': this.state.leave
        });
        return React.cloneElement(child, {
            className:this.props.transitionName + enter + active + leave
        });
    },

    render: function() {
        var children = React.Children.map(this.props.children, this.mapChildren);
        return (
            <span>
                {children}
            </span>
        )
    }
})

module.exports = Transition;
