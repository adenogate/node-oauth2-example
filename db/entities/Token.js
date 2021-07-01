const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../connection');
const User = require('./User');
const Client = require('./Client');

const Token = sequelize.define("a_token", {
    access_token: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    access_token_expires_at: {
        type: DataTypes.DATE
    },
    refresh_token: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    refresh_token_expires_at: {
        type: DataTypes.DATE
    },
    scope: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
});

Token.belongsTo(Client, {foreignKey: 'client_id', targetKey: 'id'});
Token.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id'})

module.exports = Token;