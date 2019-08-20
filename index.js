const _ = require('lodash');

const CatalogController = require('./api/controllers/CatalogController');
const CatalogService = require('./api/services/CatalogService');
const recordTypeConfig = require('./config/recordtype.js');
const workflowConfig = require('./config/workflow.js');
const recordFormConfig = require('./form-config/template-1.0-draft.js');

module.exports = function (sails) {
  return {
    initialize: function (cb) {
      // Do Some initialisation tasks
      // This can be for example: copy files or images to the redbox-portal front end
      return cb();
    },
    //If each route middleware do not exist sails.lift will fail during hook.load()
    routes: {
      before: {},
      after: {
        'get /:branding/:portal/ws/catalog/': CatalogController.helloWorld
      }
    },
    configure: function () {
      //TODO: Temporarily commenting this out as it's not initialising correctly
      // sails.services['CatalogService'] = CatalogService;
      // sails.config = _.merge(sails.config, recordTypeConfig);
      // sails.config = _.merge(sails.config, workflowConfig);
      // sails.config['form']['forms'] = _.merge(sails.config['form']['forms'], {'catalog-1.0-draft': recordFormConfig});
    }
  }
};
