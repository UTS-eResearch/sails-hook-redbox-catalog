"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("rxjs/add/operator/map");
const controller = require("../core/CoreController");
const Config_1 = require("../Config");
var Controllers;
(function (Controllers) {
    class CatalogController extends controller.Controllers.Core.Controller {
        constructor() {
            super();
            this._exportedMethods = [
                'info',
                'rdmpInfo',
                'request'
            ];
            this.config = new Config_1.Config(sails.config.workspaces);
        }
        info(req, res) {
            this.config.brandingAndPortalUrl = BrandingService.getFullPath(req);
            this.ajaxOk(req, res, null, { status: true });
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
                this.ajaxOk(req, res, null, { status: true, recordMetadata: recordMetadata });
            }, error => {
                sails.log.error('recordMetadata: error');
                sails.log.error(error);
                this.ajaxFail(req, res, error.message, { status: false, message: error.message });
            });
        }
        request(req, res) {
            sails.log.debug('request');
            this.config.brandingAndPortalUrl = BrandingService.getFullPath(req);
            const userId = req.user.id;
            const rdmp = req.param('rdmp');
            const request = req.param('request');
            const openedByEmail = req.param('openedByEmail');
            let createTicket = null;
            const description = `
      Creating request from Stash
      
      Dear eResearch admin: Please verify this workspace request done via Stash in the next data management plan
      
      ${this.config.brandingAndPortalUrl}/record/view/${rdmp}
      
      Details:
      
      ${request.name}
      
      ${request.owner} : ${request.ownerEmail}
      
      Supervisor: ${request.supervisor}
      
      Retention Period: ${request.retention}
      
      Project Start: ${request.projectStart}
      
      Project End: ${request.projectEnd}
      `;
            const info = {
                "short_description": `Stash Service: ${request.type} : ${request.name}`,
                "description": description,
                "assigned_to": `${this.config.requesteeId}`,
                "opened_by": `${this.config.testRequestorId}`
            };
            sails.log.debug(JSON.stringify(info, null, 2));
            return CatalogService.sendGetToTable('sys_user', { email: this.config.requesteeEmail })
                .flatMap(response => {
                info.assigned_to = response.email;
                return CatalogService.getUserId('sys_user', { email: openedByEmail });
            }).flatMap(response => {
                info.opened_by = response.email;
                return CatalogService.sendPostToTable('sc_request', info);
            })
                .subscribe(response => {
                sails.log.debug('createTicket');
                createTicket = response;
                this.ajaxOk(req, res, null, { status: true, createTicket: createTicket });
            }, error => {
                sails.log.error('createTicket: error');
                sails.log.error(error);
                this.ajaxFail(req, res, error.message, { status: false, message: error.message });
            });
        }
    }
    Controllers.CatalogController = CatalogController;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
module.exports = new Controllers.CatalogController().exports();
