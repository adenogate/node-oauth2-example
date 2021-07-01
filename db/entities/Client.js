const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../connection');
const User = require('./User');

const Client = sequelize.define("a_client", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    client_secret: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data_uris: {
        type: DataTypes.STRING,
        allowNull: false
    },
    grants: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

Client.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id'});

module.exports = Client;