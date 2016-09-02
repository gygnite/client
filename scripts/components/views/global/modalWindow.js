var React = require('react');
var Modal = require('./modal');

var ModalWindow = React.createClass({
    getInitialState: function() {
        return {
            open: false
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.close) {
            this.setState({
                open: false
            });
        }
    },
    toggleModal: function(action, e) {
        if (action === 'close') {
            this.setState({
                open: false
            });
        } else {
            this.setState({
                open: !this.state.open
            });
        }
    },
    render: function() {
        return (
            <Modal
                className="modal-inner"
                showCloseIcon={false}
                open={this.state.open}
                close={this.toggleModal.bind(this, 'close')}>
                {this.props.children}
            </Modal>
        )
    }
})

module.exports = ModalWindow;
