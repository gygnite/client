module.exports = {
    Index: require('./index'),
    Navbar: require('./global/navbar'),
    Registration: require('./auth/registration'),
    Dashboard: {
        Index: require('./dashboard/index'),
        Bands: {
            All: require('./dashboard/bands/all'),
            New: require('./dashboard/bands/new')
        }
    },
    Profile: {
        Band: require('./profile/band')
    }
};
