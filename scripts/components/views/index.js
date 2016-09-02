var React = require('react');
var Footer = require('./global/footer');

var Index = React.createClass({

    render: function() {
        return (
            <div className="index">
                <div id="background-picture-main"></div>
                <div className="index-div">
                    <div className="main-content index-div-full">
                        <h1 className="headline">Control your performances</h1>
                        <div className="main-subpoints">
                            <div className="sub-point">
                                <div className="sub-point-icon">
                                    <i className="icon-calendar sub-icon"></i>
                                </div>
                                <div className="sub-point-text">
                                    <h3>Find more artists</h3>
                                </div>
                            </div>
                            <div className="sub-point">
                                <div className="sub-point-icon">
                                    <i className="icon-mic sub-icon"></i>
                                </div>
                                <div className="sub-point-text">
                                    <h3>Play more shows</h3>
                                </div>
                            </div>
                            <div className="sub-point">
                                <div className="sub-point-icon">
                                    <i className="icon-money sub-icon"></i>
                                </div>
                                <div className="sub-point-text">
                                    <h3>Make more money</h3>
                                </div>
                            </div>
                        </div>
                        <div className="scroll-down-pointer">
                            <i className="icon-down-open"></i>
                        </div>
                    </div>
                </div>
                <div className="index-div color-purple">
                    <div className="helper-content-header index-div-short">
                        <div className="title">
                            <h1>A place for artists</h1>
                        </div>
                        <div className="content">
                            <p>Looking to book more shows?</p>
                        </div>
                    </div>
                </div>
                <div className="index-div">
                    <div className="helper-content index-div-full">
                        <div className="header-icon">
                            <i className="icon-location"></i>
                        </div>
                        <div className="header">
                            <h2>Find Venues and Gigs</h2>
                            <hr/>
                        </div>
                        <div className="content">
                            <ul className="content-list">
                                <li className="content-list-item"><p>Find new venues to play at</p></li>
                                <li className="content-list-item"><p>View their calendar and send booking requests</p></li>
                                <li className="content-list-item"><p>Read their profile and see reviews from other artists</p></li>
                            </ul>
                        </div>
                        <div className="header-icon">
                            <i className="icon-calendar"></i>
                        </div>
                        <div className="header">
                            <h2>Control Your Calendar</h2>
                            <hr/>
                        </div>
                        <div className="content">
                            <ul className="content-list">
                                <li className="content-list-item"><p>Send booking requests to venues and set your price</p></li>
                                <li className="content-list-item"><p>Update and control your calendar</p></li>
                                <li className="content-list-item"><p>Manage upcoming gigs</p></li>
                            </ul>
                        </div>
                        <div className="header-icon">
                            <i className="icon-group"></i>
                        </div>
                        <div className="header">
                            <h2>Highlight Your Band</h2>
                            <hr/>
                        </div>
                        <div className="content">
                            <ul className="content-list">
                                <li className="content-list-item"><p>Write your bio</p></li>
                                <li className="content-list-item"><p>Upload some great music samples</p></li>
                                <li className="content-list-item"><p>Show everyone where you've played and where you'll play next</p></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="index-div color-teal">
                    <div className="helper-content-header float-right index-div-short">
                        <div className="title">
                            <h1>A place for venues</h1>
                        </div>
                        <div className="content">
                            <p>Have unfilled timeslots?</p><p>Need more artists to play?</p>
                        </div>
                    </div>
                </div>
                <div className="index-div">
                    <div className="helper-content index-div-full">
                        <div className="header-icon">
                            <i className="icon-location"></i>
                        </div>
                        <div className="header">
                            <h2>Find Great Talent</h2>
                            <hr/>
                        </div>
                        <div className="content">
                            <ul className="content-list">
                                <li className="content-list-item"><p>Search for up-and-coming artists by genre</p></li>
                                <li className="content-list-item"><p>View their calendar and send booking requests to artists</p></li>
                                <li className="content-list-item"><p>Read their profile, see reviews, and listen to their music before booking</p></li>
                            </ul>
                        </div>
                        <div className="header-icon">
                            <i className="icon-calendar"></i>
                        </div>
                        <div className="header">
                            <h2>Control Your Calendar</h2>
                            <hr/>
                        </div>
                        <div className="content">
                            <ul className="content-list">
                                <li className="content-list-item"><p>Update and control your calendar, block dates, and create timelots</p></li>
                                <li className="content-list-item"><p>Manage your upcoming shows, timeslots, and artists</p></li>
                                <li className="content-list-item"><p>Setup events and get the word out</p></li>
                            </ul>
                        </div>
                        <div className="header-icon">
                            <i className="icon-bar"></i>
                        </div>
                        <div className="header">
                            <h2>Highlight Your Venue</h2>
                            <hr/>
                        </div>
                        <div className="content">
                            <ul className="content-list">
                                <li className="content-list-item"><p>Let the world know how great your venue is</p></li>
                                <li className="content-list-item"><p>Write your bio and brag about who has played your stage</p></li>
                                <li className="content-list-item"><p>Show the world all of the great upcoming events at your venue</p></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
});

module.exports = Index;
