const json5 = require('json5');
const convict = require('convict');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

/**
 * @description 
 * exports a configuration object with all required configurations
 * configuration schemas are loaded from ./configs
 * if ./serverConfig.json exists, it will be used to override default values
 * @author Anurudh Ojha
 */
class LoadConfig {
  /**
   * @constructor Creates an instance of LoadConfig.
   * @memberof LoadConfig
   */
  constructor() {
    this.initConf();
  }

  /**
   * @description Here the actual loding of config files are happening and loaded to a single object
   *
   * @memberof LoadConfig
   */
  initConf() {
    convict.addFormat('path', _.noop, this.pathLoader);
    convict.addFormat('regex', _.noop, this.regexCompiler);
    let confJSON = {};
    let self = this;

    _.map(
      _.filter(
        fs.readdirSync(path.join(__dirname, 'configs')),
        this.endsWithJSON,
      ),
      function (filename) {
        let _confPath = path.join(__dirname, 'configs', filename);
        confJSON[self.configName(filename)] = json5.parse(
          fs.readFileSync(_confPath, 'utf-8'),
        );
      },
    );
    this.conf = convict(confJSON);

    this.conf.validate();

    this._conf = this.conf._instance;

    if ('get' in this._conf) throw new Error('Do not set config.get');
    this._conf.get = this.conf.get.bind(this.conf);
  }

  /**
   * @description This method is used for checking filename is ends with .json or not.
   *
   * @param {String} filename
   * @returns
   * @memberof LoadConfig
   */
  endsWithJSON(filename) {
    return filename.endsWith('.json');
  }

  /**
   * @description This method will return a filename extracted from the path provided in parameter.
   *
   * @param {String} filename
   * @returns
   * @memberof LoadConfig
   */
  configName(filename) {
    return path.basename(filename, '.json');
  }

  /**
   * @description resolve relative path to absolute path from server root dir
   *
   * @param {String} relativePath
   * @returns
   * @memberof LoadConfig
   */
  pathLoader(relativePath) {
    return path.join(__dirname, '..', relativePath);
  }

  /**
   * @description create RegExp from string
   *
   * @param {String} regexString
   * @returns
   * @memberof LoadConfig
   */
  regexCompiler(regexString) {
    return new RegExp(regexString);
  }
}

let loadConfig = new LoadConfig();
module.exports = loadConfig._conf;
