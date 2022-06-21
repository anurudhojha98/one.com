const express = require('express');
const AuthRoutes = require('./authRoutes.js');
const ProductRoutes = require('./productRoutes.js');

/**
 * @description Router class to load all routes for the application
 * @author Anurudh Ojha
 */

class Router {
    /**
     * load all routes for the application
     *
     * @param {*} app
     * @memberof Router
     */
    load(app) {
        let router = express.Router({ mergeParams: true });
        //auth routes
        let authRoutes = new AuthRoutes();
        authRoutes.loadRoutes(router);

        //product routes
        let productRoutes = new ProductRoutes();
        productRoutes.loadRoutes(router);

        app.use('/api', router);
    }
}

module.exports = Router;
