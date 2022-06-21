
const jwt = require("jsonwebtoken");
const message = require('../common/message');
const constants = require('../common/constants');
const config = require('../config/config');
const UserPermission = require('../models/UserPermissions');
module.exports = {
    isAuthenticated(req, res, next) {
        if (typeof req.headers.authorization !== constants.UNDEFINED) {
            let token = req.headers[constants.X_ACCESS_TOKEN] || req.headers[constants.AUTHORIZATION];
            if (token.startsWith(constants.BEARER)) {
                token = token.slice(7, token.length);
            }
            if (token) {
                jwt.verify(token, config.SECRET_KEY, (err, decoded) => {
                    if (err) {
                        return res.json({
                            success: false,
                            message: message.INVALID_TOKEN
                        });
                    } else {
                        UserPermission.find({}).then((userPermission) => {
                            let permission = userPermission[0][decoded.role];
                            let isAuthorized = false;
                            if (req.method === 'POST') {
                                if (permission.includes('create')) {
                                    isAuthorized = true;
                                }
                            } else if (req.method === 'GET') {
                                if (permission.includes('fetch')) {
                                    isAuthorized = true;
                                }
                            } else if (req.method === 'PUT' || req.method === 'PATCH') {
                                if (permission.includes('update')) {
                                    isAuthorized = true;
                                }
                            } else if (req.method === 'DELETE') {
                                if (permission.includes('delete')) {
                                    isAuthorized = true;
                                }
                            }
                            console.log(`---role ${decoded.role} isAuthorized ${isAuthorized} method ${req.method} ---`)
                            if (!isAuthorized) {
                                return res.status(401).json({
                                    success: false,
                                    message: message.UNAUTHORIZED_ACCESS
                                });
                            } else {
                                req.decoded = decoded;
                                next();
                            }
                        }).catch((err) => {
                            console.error(err);
                        });
                    }
                });
            } else {
                return res.json({
                    success: false,
                    message: message.TOKEN_IS_NOT_IN_HEADER
                });
            }
        } else {
            return res.status(401).json({
                success: false,
                message: message.NOT_AUTHORIZED
            });
        }
    }
}