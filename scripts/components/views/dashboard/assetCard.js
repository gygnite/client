var React = require('react');
var Link = require('react-router').Link;

var AssetCard = React.createClass({
    render: function() {
        var path = (this.props.data.type === 'band') ? '/bands/' : '/venues/';
        return (
            <li className="asset-card">
                <Link to={path+this.props.data.slug}>
                    <div className="asset-inner">
                        <h3>{this.props.data.name}</h3>
                    </div>
                </Link>
            </li>
        )
    }
});

module.exports = AssetCard;
