const express = require('express')
const path = require('path')
const app = express()
const port = 3030
const oauthServer = require('./server')
app.use(express.urlencoded({extended: true}));
app.disable('x-powered-by');

// mustache template engine
const mustacheExpress = require('mustache-express');
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/public/view');

app.use('/oauth', require('./routes/oauth'))
app.use('/auth', require('./routes/auth'))
app.use('/secure', oauthServer.authenticate({
            scope: "openid"
        }), require('./routes/secure'))
app.use('/wellknown', require('./routes/wellknown'))
app.use('/static', express.static(path.join(__dirname, 'public/static')))
app.use("/", (req,res) => res.redirect("/oauth"))


app.listen(port)
console.log("oauth server listening on port ", port);
