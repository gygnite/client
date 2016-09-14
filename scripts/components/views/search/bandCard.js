var React = require('react');
var Link = require('react-router').Link;

var BandCard = React.createClass({
    getInitialState: function() {
        return {
            showGenres: true
        }
    },
    _toggleGenres: function() {
        // this.setState({
        //     showGenres: !this.state.showGenres
        // });
    },
    render: function() {
        return (
            <li className="result band-card" onMouseEnter={this._toggleGenres} onMouseLeave={this._toggleGenres}>

                <div className="inner img">

                </div>
                <Link to={"/bands/"+this.props.band.slug} className="inner title">
                    <div>
                        <h2 className="head">{this.props.band.name}</h2>
                        <h4 className="subtitle"><i>{this.props.band.city}, {this.props.band.state}</i></h4>
                    </div>
                </Link>
            </li>
        )
    }
});

module.exports = BandCard;


// <div className="inner genres">
//     <ul className="genre-list">
//         {this.props.band.genres.map(function(gen, index) {
//             return (<li key={"genre-"+index} className="genre-list-item">{gen}</li>)
//         })}
//     </ul>
// </div>
