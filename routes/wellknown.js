const express = require('express')
const router = express.Router()
const fs = require("fs");
const jose = require('node-jose');

router.get('/cert', async(req,res) => {
    const publickey = fs.readFileSync('/var/www/mvcframework/oauth2server/auth/conf/public.pem', 'utf8');
    let keyToShow = publickey.replace(/\n/g, "")
    res.json({
        public_key: keyToShow
    });
})

module.exports = router;