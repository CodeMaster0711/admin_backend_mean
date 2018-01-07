'use strict';

module.exports = function(sequelize, DataTypes) {
    const Company = sequelize.define('Company', {
        company_name: DataTypes.STRING,
        name: DataTypes.STRING,
        company_address: DataTypes.STRING,
        contact_number: DataTypes.STRING,
        country_id: DataTypes.INTEGER(11)
    },{
        underscored: true
    });

    return Company;
};
