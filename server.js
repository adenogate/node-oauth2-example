const OAuthServer = require('express-oauth-server')
const model = require('./model')

const oauthServer = new OAuthServer({
  model: model,
  grants: ['authorization_code', 'refresh_token'],// supported grant types
  accessTokenLifetime: 60 * 60 * 24,// 1day
  allowEmptyState: true,// no state needed, false for production
  allowExtendedTokenAttributes: true
})

module.exports = oauthServer;