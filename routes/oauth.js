const express = require('express')
const oauthServer = require('../server')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../db/entities/User')

router.get('/', (req,res) => {res.render("authenticate")});

router.post('/authorize', (req,res,next) => {
    const {username, password} = req.body
    User.findOne({
      where: {
        name: username
      }
    }).then(storedUser => {
      if(storedUser == null) {
        res.status(401).json({
          message: "Unauthenticated user or password error"
        });
        return;
      }

      storedUser = storedUser.dataValues;

      bcrypt.compare(password, storedUser.password).then(r => {
        if(r != true) {
          res.status(401).json({
            message: "Unauthenticated user or password error"
          });
          return;
        }

        // success
        req.body.user = {
            id: storedUser.id,
            name: storedUser.name
        }
        next();

      }).catch(error => {
        res.status(400).json({
          message: "Unauthenticated something went wrong"
        });
      })

      })
      .catch(err => {
        res.status(500).json({
          message: "Unauthenticated something went wrong"
        });
      })


    // else back to form with err message
    // res.redirect("/oauth?err=invalid_user_or_password");
}, oauthServer.authorize({
    authenticateHandler: {
      handle: req => {
        console.log("+++ Authorize Handler +++")
        return req.body.user
      }
    }
  })
)

router.post('/token', (req, res, next) => {
  console.log("+++ Token Handler +++")
  return next();
}, oauthServer.token({
    requireClientAuthentication: {  // whether client needs to provide client_secret
      //'authorization_code': false,
    },
}))  // Sends back token

module.exports = router;