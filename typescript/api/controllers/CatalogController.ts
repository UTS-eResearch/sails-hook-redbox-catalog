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
      const userId = req.user.id;
      const rdmp = req.param('rdmp');
      let createTicket = null;
      const info = {
        "description": "Creating",
        "short_description": "service",
        "assigned_to": "",
        "opened_by": ""
      };
      return CatalogService.createServiceRecord(info)
        .subscribe(response => {
          sails.log.debug('createTicket');
          createTicket = response;
          this.ajaxOk(req, res, null, {status: true, createTicket: createTicket});
        }, error => {
          sails.log.error('createTicket: error');
          sails.log.error(error);
          this.ajaxFail(req, res, error.message, {status: false, message: error.message});
        });
    }
  }
}
module.exports = new Controllers.CatalogController().exports();
