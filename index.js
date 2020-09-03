const _ = require('lodash');
var configService = require('../../../api/services/ConfigService.js');

module.exports = function (sails) {
  return {
    initialize: function (cb) {

      configService.mergeHookConfig('@researchdatabox/sails-hook-redbox-servicenow-catalog', sails.config);
      return cb();

    },
    //If each route middleware do not exist sails.lift will fail during hook.load()
    routes: {

    },
    configure: function () {

    }
  }
};
