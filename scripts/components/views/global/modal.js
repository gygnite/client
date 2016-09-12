var React = require('react');
var ReactDOM = require('react-dom');

var Modal = React.createClass({
    portal: false,

    getDefaultProps: function() {
        return {
            close: function(){},
            allowClose: true,
            showCloseIcon: true,
            open: false,
            transition: 300
        };
    },

    handleClick: function(e) {
        if (e.target.className === 'modal-backdrop' && this.props.allowClose) {
            this.unmount();
        }
        if (e.target.classList.contains('close-icon')) {
            this.unmount();
        }
        if (e.target.dataset.forceClose) {
            this.unmount();
        }
    },

    componentDidMount: function() {
        if (this.props.open) {
            this.mount(this.props);
        }
    },

    mount: function(props) {
        if (!this.portal) {
            this.portal = document.createElement('div');
            this.portal.className = 'modal fade';
            document.body.appendChild(this.portal);
        }
        this.doRender(props);
        setTimeout(this.reveal, 10);
    },

    doRender: function(props) {
        var closeIcon = (<i className="icon-cancel close-icon" onClick={this.handleClick} />);
        if (!this.props.showCloseIcon) {
            closeIcon = null;
        }

        //remove unnecessary div props
        const divProps = Object.assign({}, props);
        delete divProps.close;
        delete divProps.transition;
        delete divProps.allowClose;
        delete divProps.showCloseIcon;
        ReactDOM.render(<div
            style={{overflow: 'auto'}}
            onClick={this.handleClick}
            className="modal-backdrop">
            <div {...divProps}>
                {closeIcon}
                {props.children}
            </div>
        </div>, this.portal);
    },

    reveal: function() {
        if (this.portal) {
            this.portal.classList.add('in');
            document.querySelector('.modal-inner').classList.add('in');
        }
        document.body.classList.add('no-scroll');
    },

    unmount: function() {
        if (this.portal) {
            this.hide(function() {
                ReactDOM.unmountComponentAtNode(this.portal);
                document.body.removeChild(this.portal);
                this.portal = false;
                this.props.close();
            }.bind(this));
        }
        document.body.classList.remove('no-scroll');
    },

    hide: function(callback) {
        if (this.portal) {
            this.portal.classList.remove('in');
            this.portal.classList.add('out');
            if (typeof callback === 'function') {
                setTimeout(callback, this.props.transition);
            }
        }
    },

    componentWillReceiveProps: function(nextProps){
        if (nextProps.open && !this.props.open) {
            this.mount(nextProps);
        } else if (!nextProps.open && this.props.open) {
            this.unmount();
        } else if (nextProps.open && this.props.open) {
            this.mount(nextProps);
        }
	},

    componentWillUnmount: function() {
        this.unmount();
    },

    render: function() {
        return null;
    }
});


module.exports = Modal;
