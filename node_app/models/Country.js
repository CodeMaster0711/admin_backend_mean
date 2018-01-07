'use strict';

module.exports = function(sequelize, DataTypes) {
	const Country = sequelize.define('Country', {
		name: DataTypes.STRING,
		country_code: DataTypes.STRING,
		status: DataTypes.BOOLEAN
	},{
    underscored: true
  });

	return Country;
};
