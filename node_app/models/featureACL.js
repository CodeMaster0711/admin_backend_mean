'use strict';

module.exports = function(sequelize, DataTypes) {
    const FeatureACL = sequelize.define('FeatureACL', {
        role_id: DataTypes.INTEGER(11),
        feature_api_url: DataTypes.STRING
    },{
        underscored: true
    });

    return FeatureACL;
};
