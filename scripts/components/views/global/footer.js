var React = require('react');
var Link = require('react-router').Link;

var Footer = React.createClass({
    render: function() {
        return (
            <footer className="app-footer">
                <div className="footer-inner">
                    <div className="connect footer-list">
                        <ul className="footer-list-inner">
                            <h3 className="footer-list-inner-header">Gygnite</h3>
                            <Link to="/">
                                <li className="footer-list-inner-item">
                                    <p>Home</p>
                                </li>
                            </Link>
                        </ul>
                    </div>
                    <div className="about footer-list">
                        <ul className="footer-list-inner">
                            <h3 className="footer-list-inner-header">About</h3>
                            <a href="https://github.com/gygnite">
                                <li className="footer-list-inner-item">
                                    <p>Project</p>
                                </li>
                            </a>
                            <a href="https://www.linkedin.com/in/mhottman">
                                <li className="footer-list-inner-item">
                                    <p>Author</p>
                                </li>
                            </a>
                        </ul>
                    </div>
                    <div className="connect footer-list">
                        <ul className="footer-list-inner">
                            <h3 className="footer-list-inner-header">Connect</h3>
                            <a href="https://github.com/gygnite">
                                <li className="footer-list-inner-item">
                                    <i className="icon-github-circled"></i>
                                </li>
                            </a>
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
