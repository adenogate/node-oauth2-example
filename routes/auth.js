const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../db/entities/User')

router.get('/registration', (req,res) => {res.render("registration")}); // form for registration

router.post('/registrate', (req,res) => {
    const { email, password } = req.body;

    User.findOne({
      where: {
        name: email
      }
    }).then(async(storedUser) => {
      if(storedUser != null) {
        res.status(400).json({
          message: "user already exists"
        })
        return;
      }
  
      const hash = bcrypt.hashSync(password, 10);

      await User.create({
        name: email,
        password: hash,
        role: "user"
      });
  
      res.status(201).json({
        name: email,
        message: "user was registrated successfully"
      });
    }).catch(err => {
      res.status(500).json({
        message: "registration failed"
      });
    })
});

module.exports = router;