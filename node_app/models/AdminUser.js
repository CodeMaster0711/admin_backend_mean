'use strict';

module.exports = function(sequelize, DataTypes) {
    const AdminUser = sequelize.define('AdminUser', {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        company_id: DataTypes.INTEGER(11),
        role_id: DataTypes.INTEGER(11),
        number_password_attempt:{
            type: DataTypes.INTEGER(1),
            defaultValue: 0
        },
        max_session_time: DataTypes.DOUBLE,
        FAfield: DataTypes.STRING// todo ask customer about 2 fa field
    },{
        underscored: true
    });
    return AdminUser;
};
