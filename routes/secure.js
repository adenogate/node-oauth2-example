const express = require('express')
const oauthServer = require('../server.js')
const router = express.Router()
const User = require('../db/entities/User')
const jwt = require("jsonwebtoken")
const fs = require("fs")

router.get("/is-valid-access-token", (req, res) => {
    res.json({
        message: "your access token is valid"
    })
});

router.get("/userinfo", async(req, res) => {
    const uid = res.locals.oauth.token.user.id;

    const user = await User.findOne({
        where: {
            id: uid
        }
    })
    res.json({
        name: user.dataValues.name,
        role: user.dataValues.role
    });
})

module.exports = router;