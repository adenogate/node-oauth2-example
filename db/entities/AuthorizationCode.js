const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../connection');
const User = require('./User');
const Client = require('./Client');

const AuthorizationCode = sequelize.define("a_authorization_code", {
    authorization_code: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    expires_at: {
        type: DataTypes.DATE
    },
    redirect_uri: {
        type: DataTypes.STRING
    },
    scope: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
});

AuthorizationCode.belongsTo(Client, {foreignKey: 'client_id', targetKey: 'id'});
AuthorizationCode.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id'});

module.exports = AuthorizationCode;