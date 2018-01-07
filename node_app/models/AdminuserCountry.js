'use strict';

module.exports = function(sequelize, DataTypes) {
    const AdminuserCountry = sequelize.define('AdminuserCountry', {
        adminuser_id: DataTypes.INTEGER(11),
        country_id: DataTypes.INTEGER(11)
    },{
        underscored: true
    });
    return AdminuserCountry;
};
