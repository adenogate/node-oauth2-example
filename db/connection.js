const Sequelize = require('sequelize');

const sequelize = new Sequelize('oauth2server', 'postgres', '********', {
    host: '127.0.0.1',
    dialect: 'postgres'
});

module.exports = sequelize;