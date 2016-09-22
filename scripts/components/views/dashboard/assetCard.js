var React = require('react');
var Link = require('react-router').Link;

var AssetCard = React.createClass({
    render: function() {
        var profileImage = this.props.data.profile_image;
        var imageStyle = {
            backgroundImage: 'url('+profileImage+')'
        };
        var path = (this.props.data.type === 'band') ? '/bands/' : '/venues/';
        return (
            <li className="asset-card">

                <div className="asset-inner inner img" style={imageStyle}></div>

                <Link to={path+this.props.data.slug}>
                    <div className="asset-inner inner content">
                        <h2>{this.props.data.name}</h2>
                    </div>
                </Link>
                <div className="asset-inner inner show-box">
                    <Link to={"/dashboard/settings"+path+this.props.data.slug}>
                        <div className="section edit"><h5>Edit</h5></div>
                    </Link>
                    <Link to={path+this.props.data.slug}>
                        <div className="section view"><h5>View</h5></div>
                    </Link>
                </div>

            </li>
        )
    }
});

module.exports = AssetCard;
