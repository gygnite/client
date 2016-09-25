module.exports = {
    Index: require('./index'),
    Navbar: require('./global/navbar'),
    Registration: require('./auth/registration'),
    Dashboard: {
        Index: require('./dashboard/index'),
        Settings: require('./profile/userSettings'),
        Bands: {
            All: require('./dashboard/bands/all'),
            New: require('./dashboard/bands/new')
        },
        Venues: {
            New: require('./dashboard/venues/new')
        }
    },
    Profile: {
        Band: require('./profile/band'),
        Venue: require('./profile/venue')
    },
    Search: {
        Band: require('./search/band'),
        Venue: require('./search/venue')
    },
    Booking: {
        New: require('./booking/new'),
        SingleDate: require('./booking/singledate'),
        SingleEntity: require('./booking/entity')
    },
    Messages: {
        Index: require('./messages/index')
    }
};
