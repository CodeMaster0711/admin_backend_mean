'use strict';

module.exports = function(sequelize, DataTypes) {
    const DistributionCenter = sequelize.define('DistributionCenter', {
        country_id: DataTypes.INTEGER(11),
        company_id: DataTypes.INTEGER(11),
        address: DataTypes.STRING,
        lat: DataTypes.STRING,
        long: DataTypes.STRING,
        contact_number: DataTypes.STRING
    },{
        underscored: true
    });

    return DistributionCenter;
};
