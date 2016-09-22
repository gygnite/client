var React = require('react');
var cx = require('classnames');
var CalendarView = require('./calendar');

var BandProfile = React.createClass({
    componentWillMount: function() {
        this.props.fetchBand(this.props.params.slug);
    },
    componentDidMount: function() {
        window.scrollTo(0,0);
    },
    render: function() {
        console.log("this.props.profile: ", this.props.profile);
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
        //handle graceful degredation for band details
        var details = [];
        if (this.props.profile.avg_set_length) {
            details.push('Set Length: ' + this.props.profile.avg_set_length + ' mins');
        }
        if (this.props.profile.year_established) {
            details.push('Band Since: ' + this.props.profile.year_established);
        }
        if (this.props.profile.influences) {
            details.push('Influences: ' + this.props.profile.influences);
        }

        var profileImage = this.props.profile.profile_image;
        var imageStyle = {
            backgroundImage: 'url('+profileImage+')'
        };

        return (
            <div className="profile band-profile">
                <div className={"header-box"}>
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
                            <li className="detail">Location: {this.props.profile.city}, {this.props.profile.state}</li>
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
                <CalendarView type="band" data={this.props.profile}/>
            </div>
        )
    }
});

module.exports = BandProfile;
