/**
 * @description This class is responsible for initialize application object to server.
 * @author Anurudh Ojha
 */

class Server {
  /**
   * @constructor Creates an instance of Server.
   * @param {Object} serverconfig
   * @param {Object} application
   * @memberof Server
   */
  constructor(serverconfig, application) {
    this.config = serverconfig;
    this.application = application;
  }

  /**
   * @description This will start application
   *
   * @returns
   * @memberof Server
   */
  start() {
    try {
      let app = this.application.load();
      let server = app.listen(this.config.server.port, function () {
        let host = server.address().address;
        let port = server.address().port;
        console.info('app listening at http://%s:%s', host, port);
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Server;
