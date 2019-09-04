const _ = require('lodash');
const ncp = require('ncp');
const fs = require('fs-extra');

const CatalogController = require('./api/controllers/CatalogController');
const CatalogService = require('./api/services/CatalogService');
const recordTypeConfig = require('./config/recordtype.js');
const workflowConfig = require('./config/workflow.js');
const workspaceTypeConfig = require('./config/workspacetype.js');
const recordFormConfig = require('./form-config/catalog-1.0-draft.js');

module.exports = function (sails) {
  return {
    initialize: function (cb) {
      // Do Some initialisation tasks
      // This can be for example: copy files or images to the redbox-portal front end
      // The Hook is environment specific, that is, the environments are also available whenever the sails app is hooked
      let angularDest = './assets/angular/catalog';
      let angularOrigin = './node_modules/@uts-eresearch/sails-hook-redbox-catalog/angular/catalog/dist';
      let angularTmpDest = '.tmp/public/angular/catalog';
      ncp.limit = 16;
      if (!fs.existsSync(angularTmpDest)) { //Using this so sails bootstrap does not break
        console.log(`===========================`);
        console.log(`Angular dist dir (${angularOrigin}) not found`);
        console.log(`===========================`);
        return cb();
      }
      if (!fs.existsSync(angularTmpDest)) { //Using this so sails bootstrap does not break
        console.log(`===========================`);
        console.log(`Angular dist dir (${angularTmpDest}) not found`);
        console.log(`===========================`);
        return cb();
      }
      if (fs.existsSync(angularDest)) {
        fs.removeSync(angularDest);
      }
      if (fs.existsSync(angularTmpDest)) {
        fs.removeSync(angularTmpDest);
      }
      console.log(angularTmpDest);
      ncp(angularOrigin, angularTmpDest, function (err) {
        if (err) {
          return console.error(err);
        } else {
          console.log('Catalog: Copied angular app to ' + angularTmpDest);
        }
        ncp(angularOrigin, angularDest, function (err) {
          if (err) {
            return console.error(err);
          } else {
            console.log('Catalog: Copied angular app to ' + angularDest);
          }
          return cb();
        });
      });
    },
    //If each route middleware do not exist sails.lift will fail during hook.load()
    routes: {
      before: {},
      after: {
        'post /:branding/:portal/ws/catalog/rdmp': CatalogController.rdmpInfo,
        'post /:branding/:portal/ws/catalog/request': CatalogController.request
      }
    },
    configure: function () {
      sails.services['CatalogService'] = CatalogService;
      sails.config = _.merge(sails.config, recordTypeConfig);
      sails.config = _.merge(sails.config, workflowConfig);
      sails.config = _.merge(sails.config, workspaceTypeConfig);
      sails.config['form']['forms'] = _.merge(sails.config['form']['forms'], {'catalog-1.0-draft': recordFormConfig});
    }
  }
};
