const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

var swaggerDocument = require('./swagger.json')
const Routes = require('./routes');
const config = require('./config');
const Server = require('./server');

var options = {
    customCss: '.swagger-ui .topbar { display: none }'
};
let corsOptions = {
    credentials: true,
    origin: config.app.clientDomain.split(','),
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

/**
 * @description This class is responsible for loading express app and config files
 * @author Anurudh Ojha
 */
class Application {
    /**
     * @constructor Creates an instance of Application. Constructor for loading express app and config files
     * @param {*} expressapp
     * @param {*} config
     * @memberof Application
     */
    constructor(expressapp, config) {
        this.app = expressapp || express();
        this.config = config;
        this.accesslogger;
    }

    /**
     * @description This method will load all routes for the application
     *
     * @memberof Application
     */
    initRoutes() {
        let routes = new Routes();
        routes.load(this.app);
    }

    /**
   * @description All middleware will be loaded here
   *
   * @memberof Application
   */
    loadmiddlewares() {
        this.app.use(helmet());
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
        this.app.use(cors(corsOptions));
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
    }

    /**
* @description Connect database
*
* @returns
* @memberof Application
*/
    async connectDatabase() {
        // we can add these details on configs
        let uri = `${this.config.db.db_client}://${this.config.db.db_nodes}/${this.config.db.db_name}`;
        mongoose.connect(uri, { useNewUrlParser: true });

        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            console.log('Database connected successfully!')
        })
    }

    /**
   * @description This is method will handle all errors that are not catched any where in the application.
   *
   * @param {*} err
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof Application
   */
    handleError(err, req, res, next) {
        if (typeof (err) === 'string') {
            // custom application error
            return res.status(400).json({ message: err });
        }

        if (err.name === 'UnauthorizedError') {
            // jwt authentication error
            return res.status(401).json({ message: 'Invalid Token' });
        }

        // default to 500 server error
        return res.status(500).json({ message: err.message });
    }

    /**
     * @description This is the initial method that will load first to initialize above things
     *
     * @returns
     * @memberof Application
     */
    load() {
        try {
            this.loadmiddlewares();
            this.connectDatabase();
            this.initRoutes();
            this.app.use('/', this.handleError);
            return this.app;
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }
    
}
let app = new Application(null, config);
let server = new Server(config, app);
server.start();