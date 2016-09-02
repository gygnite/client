var React = require('react');

var Footer = React.createClass({
    render: function() {
        return (
            <footer className="app-footer">
                <div className="footer-inner">
                    <div className="connect footer-list">
                        <ul className="footer-list-inner">
                            <h3 className="footer-list-inner-header">Gygnite</h3>
                            <li className="footer-list-inner-item">
                                <p>Home</p>
                            </li>
                            <li className="footer-list-inner-item">
                                <p>Signup</p>
                            </li>
                            <li className="footer-list-inner-item">
                                <p>More Information</p>
                            </li>
                        </ul>
                    </div>
                    <div className="about footer-list">
                        <ul className="footer-list-inner">
                            <h3 className="footer-list-inner-header">About</h3>
                            <li className="footer-list-inner-item">
                                <p>Project</p>
                            </li>
                            <li className="footer-list-inner-item">
                                <p>Author</p>
                            </li>
                        </ul>
                    </div>
                    <div className="connect footer-list">
                        <ul className="footer-list-inner">
                            <h3 className="footer-list-inner-header">Connect</h3>
                            <li className="footer-list-inner-item">
                                <i className="icon-github-circled"></i>
                            </li>
                        </ul>
                    </div>
                    <div className="copyright">
                        <div className="copyright-inner">
                            <i className="icon-copyright"></i>
                            <p><i>Copyright Gygnite 2016 - Michael Hottman</i></p>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
});

module.exports = Footer;
