var React = require('react');
var CalendarView = require('./calendar');

var VenueProfile = React.createClass({
    componentWillMount: function() {
        this.props.fetchVenue(this.props.params.slug);
    },
    render: function() {
        //handle graceful degredation for links
        var urls = [];
        for (var url in this.props.profile) {
            if (this.props.profile.hasOwnProperty(url)) {
                if (url.indexOf('_url') > -1) {
                    if (this.props.profile[url] !== null) {
                        var urlSrc = url.substring(0, 1).toUpperCase() + url.substring(1, url.length - 4);
                        urls.push({
                            type: urlSrc,
                            url: this.props.profile[url]
                        });
                    }
                }
            }
        }
        //handle graceful degredation for venue details
        var details = [];
        if (this.props.profile.capacity) {
            details.push('Capacity: ' + this.props.profile.capacity);
        }

        var profileImage = this.props.profile.profile_image;
        var imageStyle = {
            backgroundImage: 'url('+profileImage+')'
        };
        return (
            <div className="profile band-profile">
                <div className="header-box">
                    <div className="img" style={imageStyle}></div>
                    <div className="headline">
                        <h1 className="headline-text">
                            {this.props.profile.name}
                        </h1>
                    </div>
                </div>
                <div className="main-box">
                    <div className="details-box">
                        <ul className="details-list">
                            <li className="detail">Location: {this.props.profile.address}, {this.props.profile.city_state}</li>
                            {details.map(function(det, index) {
                                return (<li className="detail" key={'detail-'+index}>{det}</li>);
                            })}
                        </ul>
                        <div className="links-box">
                            <ul className="link-list">
                                {urls.map(function(item, index) {
                                    return (
                                        <li className="link" key={'url-'+index}>
                                            <a className="link-inner" href={item.url} target="_blank">{item.type}</a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="bio-box">
                        <p>{this.props.profile.bio}</p>
                    </div>
                </div>
                <CalendarView type="venue" data={this.props.profile}/>
            </div>
        )
    }
});

module.exports = VenueProfile;
