// Authorization Code Grant (auth code is exchanged for access token)
const Client = require("./db/entities/Client");
const AuthorizationCode = require("./db/entities/AuthorizationCode");
const Token = require("./db/entities/Token");
const User = require("./db/entities/User");
const time = require("./services/lib/time");

// generateAccessToken:  (client, user, scope, cb) => {},// auto
// generateRefreshToken: (client, user, scope, cb) => {},// auto
// generateAuthorizationCode: (client, user, scope) => {},// auto

// use false to stop
const model = {
    getClient: async(clientId, clientSecret) => {
        console.log("-- Model.getClient --");

        const clientObj = await Client.findOne({
            where: { 
                id: clientId
            }
        }).then(client => {
            if (client == null)
                return false;
            client = client.dataValues;

            client.grants = client.grants.split(';');
            client.data_uris = client.data_uris.split(';');

            let clientObj = {
                id: client.id,
                grants: client.grants, // assume that it is only 1
                redirectUris: client.data_uris, // assume that it is only 1
            }
            
            return clientObj;
        }).catch(err => false);
    
        console.log(clientObj);

        return clientObj;
    },
    saveAuthorizationCode: async(code, client, user) => {
        console.log("-- Model.saveAuthorizationCode --");
        
        
        // set access token valid for 1 hour
        // the framework error
        const expires_at = time.extendTime(new Date(), 3*60*60*1000);

        let authorizationCode = {
            authorization_code: code.authorizationCode,
            expires_at: expires_at,
            redirect_uri: code.redirectUri,
            client_id: client.id,
            user_id: user.id,
            scope: code.scope
        }

        await AuthorizationCode.create(authorizationCode);

        let compatibleAuthCodeObj = {
            authorizationCode: code.authorizationCode,
            expiresAt: expires_at,
            redirectUri: code.redirectUri,
            scope: code.scope,
            client: {
                id: client.id
            },
            user: {
                id: user.id,
                name: user.name
            }
        }

        console.log(compatibleAuthCodeObj);

        return compatibleAuthCodeObj;
    },
    getAuthorizationCode: async(authorizationCode) => { // string form encoded
        console.log("-- Model.getAuthorizationCode --");
        
        const ac = await AuthorizationCode.findOne({where: { authorization_code: authorizationCode}})
        .then(async(code) => {
            if(code == null)
                return false;

            code = code.dataValues;

            const client = await Client.findOne({where: { id: code.client_id}});
            const user = await User.findOne({where: { id: code.user_id}})

            let compatibleAuthCodeObj = {
                code: code.authorization_code,
                expiresAt: code.expires_at,
                redirectUri: code.redirect_uri,
                scope: code.scope,
                client: {
                    id: client.dataValues.id
                },
                user: {
                    id: user.dataValues.id,
                    name: user.dataValues.name,
                    role: user.dataValues.role
                }
            }

            return compatibleAuthCodeObj;
        }).catch(err => false)

        console.log(ac);

        return ac;
    },
    revokeAuthorizationCode: async(code) => {
        console.log("-- Model.revokeAuthorizationCode --");
        
        const result = await AuthorizationCode.findOne({where: { authorization_code: code.code }})
        .then(async(authcode) => {
            if(authcode == null)
                return false;
            const result = await authcode.destroy();// drop
            return true; // true for success
        }).catch(err => false)

        return result;
    },
    saveToken: async(token, client, user) => {
        console.log("-- Model.saveToken --");

        console.log(token);

        const tokenObj = {
            access_token: token.accessToken,
            access_token_expires_at: token.accessTokenExpiresAt,
            refresh_token: token.refreshToken,
            refresh_token_expires_at: token.refreshTokenExpiresAt,
            scope: token.scope,
            client_id: client.id,
            user_id: user.id
        }

        await Token.create(tokenObj);

        const compatibleTokenObj = {
            accessToken: token.accessToken,
            accessTokenExpiresAt: token.accessTokenExpiresAt,
            refreshToken: token.refreshToken,
            refreshTokenExpiresAt: token.refreshTokenExpiresAt,
            scope: token.scope,
            client: {
                id: client.id
            },
            user: {
                id: user.id
            }
        }

        console.log("Saved Token: ", compatibleTokenObj)
        console.log("--- ACCESS TOKEN SAVED ---");

        return compatibleTokenObj;
    },
    getAccessToken: async(accessToken) => {
        console.log("-- Model.getAccessToken --");
    
        const token = await Token.findOne({where: { access_token: accessToken}})
        .then((token) => {
            if(token == null)
                return false;

            token = token.dataValues;

            console.log(token)

            let compatibleTokenObj = {
                accessToken: token.access_token,
                accessTokenExpiresAt: token.access_token_expires_at,
                refreshToken: token.refresh_token,
                refreshTokenExpiresAt: token.refresh_token_expires_at,
                scope: token.scope,
                client: {
                    id: token.client_id
                },
                user: { 
                    id: token.user_id
                }
            }
            return compatibleTokenObj;
        }).catch(err => false)

        return token;
    },

    // TODO: implement
    getRefreshToken: async(refreshToken) => {
        console.log("-- Model.getRefreshToken --");

        const token = await Token.findOne({where: { refresh_token: refreshToken}})
        .then((token) => {
            if(token == null)
                return false;
            token = token.dataValues
            return {
                refreshToken: token.refresh_token,
                refreshTokenExpiresAt: token.refresh_token_expires_at,
                scope: token.scope,
                client: {
                    id: token.client_id
                },
                user: {
                    id: token.user_id
                }
            }
        }).catch(err => false)
        return token;
    },
    revokeToken: async(token) => {
        console.log("-- Model.revokeToken --");
        console.log(token)

        const result = await Token.findOne({where: { refresh_token: token.refreshToken}})
        .then(async(token) => {
            if(token == null)
                return false;
            const result = await token.destroy();// drop
            return true; // true for success
        }).catch(err => false)

        return result;
    },

    validateScope: (user, client, scope) => {
        // Invoked to check if the requested scope is valid for a particular client/user combination.
        // This model function is optional. If not implemented, any scope is accepted.
        console.log("-- validate scope --")
        console.log("scope: ", scope)

       // put your scope validationhere
        
        return scope; // every scope valid
    },
    verifyScope: (accessToken, scope) => {
        console.log("-- verify scope --")
        // Invoked during request authentication to check if the provided access
        // token was authorized the requested scopes.
        return accessToken.scope == scope;
    }
};

  
module.exports = model;