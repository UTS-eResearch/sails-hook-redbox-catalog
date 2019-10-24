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
            const catalogId = req.param('catalogId');
            const request = req.param('request');
            const openedByEmail = req.param('openedByEmail');
            let createTicket = null;
            const info = {
                "short_description": `Stash Service: ${request.type}`,
                "assigned_to": `${this.config.requesteeId}`,
                "opened_by": `${this.config.testRequestorId}`
            };
            return CatalogService.sendGetToTable('sys_user', { email: this.config.requesteeEmail })
                .flatMap(response => {
                sails.log.debug(`sendGetToTable ${this.config.requesteeEmail}`);
                info.assigned_to = response.sys_id;
                return CatalogService.sendGetToTable('sys_user', { email: openedByEmail });
            }).flatMap(response => {
                sails.log.debug(`sendGetToTable ${openedByEmail}`);
                sails.log.debug(response);
                info.opened_by = response.sys_id;
                const query = { sys_id: catalogId };
                sails.log.debug(JSON.stringify(info, null, 2));
                return CatalogService.serviceCatalogPost('/api/sn_sc/servicecatalog/items/', catalogId, 'add_to_cart', 1, request);
            })
                .subscribe(response => {
                sails.log.debug('createTicket');
                createTicket = response;
                this.ajaxOk(req, res, null, { status: true, createTicket: createTicket });
            }, error => {
                sails.log.error('createTicket: error');
                sails.log.error(error.message);
                sails.log.error(error.message);
                this.ajaxFail(req, res, error.message, { status: false, message: error.message });
            });
        }
    }
    Controllers.CatalogController = CatalogController;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
module.exports = new Controllers.CatalogController().exports();
