declare var module;
declare var sails, Model;
declare var _;

import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';

declare var BrandingService, WorkspaceService, CatalogService;
/**
 * Package that contains all Controllers.
 */
import controller = require('../core/CoreController');
import {Config} from '../Config';

export module Controllers {

  /**
   * Omero related features....
   *
   */
  export class CatalogController extends controller.Controllers.Core.Controller {

    protected _exportedMethods: any = [
      'info',
      'rdmpInfo',
      'request'
    ];

    protected config: Config;

    constructor() {
      super();
      this.config = new Config(sails.config.workspaces);
    }

    public info(req, res) {
      this.config.brandingAndPortalUrl = BrandingService.getFullPath(req);
      this.ajaxOk(req, res, null, {status: true});
    }

    rdmpInfo(req, res) {
      sails.log.debug('rdmpInfo');
      const userId = req.user.id;
      const rdmp = req.param('rdmp');
      let recordMetadata = {};
      this.config.brandingAndPortalUrl = BrandingService.getFullPath(req);
      return WorkspaceService.getRecordMeta(this.config, rdmp)
        .subscribe(response => {
          sails.log.debug('recordMetadata');
          recordMetadata = response;
          this.ajaxOk(req, res, null, {status: true, recordMetadata: recordMetadata});
        }, error => {
          sails.log.error('recordMetadata: error');
          sails.log.error(error);
          this.ajaxFail(req, res, error.message, {status: false, message: error.message});
        });
    }

    request(req, res) {
      sails.log.debug('request');
      this.config.brandingAndPortalUrl = BrandingService.getFullPath(req);

      const userId = req.user.id;
      const rdmp = req.param('rdmp');
      const catalogId = req.param('catalogId');
      const request = req.param('request');
      const openedByEmail = req.param('openedByEmail');

      let createTicket = null;

      const info = {
        "short_description": `Stash Service: ${request.type}`,
        "assigned_to": `${this.config.requesteeId}`,
        "opened_by": `${this.config.testRequestorId}`
      };

      // Find Id of assigned_to
      return CatalogService.sendGetToTable('sys_user', {email: this.config.requesteeEmail})
        .flatMap(response => {
          sails.log.debug(`sendGetToTable ${this.config.requesteeEmail}`);
          info.assigned_to = response.sys_id;
          // Find Id of opened_by
          return CatalogService.sendGetToTable('sys_user', {email: openedByEmail});
        }).flatMap(response => {
          sails.log.debug(`sendGetToTable ${openedByEmail}`);
          sails.log.debug(response);
          info.opened_by = response.sys_id;
          const variables = this.requestToVariables(request);
          variables['rdmp'] = rdmp;
          sails.log.debug(JSON.stringify(variables, null, 2));
          return CatalogService.serviceCatalogPost(
            '/api/sn_sc/servicecatalog/items/',
            catalogId,
            'order_now',
            '1',
            variables
          );
        })
        .subscribe(response => {
          sails.log.debug('createTicket');
          createTicket = response;
          this.ajaxOk(req, res, null, {status: true, createTicket: createTicket});
        }, error => {
          sails.log.error('createTicket: error');
          sails.log.error(error.message);
          sails.log.error(error.message);
          this.ajaxFail(req, res, error.message, {status: false, message: error.message});
        });

    }

    requestToVariables(request) {
      const variables = {};
      _.forOwn(request, (val) => {
        const v = val['variable'];
        const vv = val['value'];
        variables[v] = vv['name'] || vv;
      });
      return variables;
    }

  }
}
module.exports = new Controllers.CatalogController().exports();
