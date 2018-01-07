'use strict';

module.exports = function(sequelize, DataTypes) {
    const UserActivityLog = sequelize.define('UserActivityLog', {
        admin_user_id: DataTypes.INTEGER(11),
        action: DataTypes.STRING,
        payload: DataTypes.STRING
    },{
        underscored: true
    });

    return UserActivityLog;
};
