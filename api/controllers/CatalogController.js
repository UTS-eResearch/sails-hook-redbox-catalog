"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
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
            const catalogName = req.param('catalogName');
            const request = req.param('request');
            const username = req.user.username;
            const workspaceInfo = req.param('workspaceInfo');
            const workspaceType = req.param('workspaceType');
            const workspaceTitle = workspaceInfo['workspaceTitle'];
            const workspaceDescription = workspaceInfo['workspaceDescription'];
            let createTicket = null;
            const reqInfo = {
                "assigned_to": this.config.assignedToEmail,
                "opened_by": this.config.openedById,
                "requested_by": '',
                "affected_contact": ''
            };
            let recordMetadata = {};
            let rdmpTitle = '';
            let workspaceLocation = '';
            let requestorName = '';
            let emailPermissions = [];
            let request_number = '';
            let catalogId;
            let catalogItem;
            if (this.config.catalogItems) {
                catalogItem = this.config.catalogItems.find((item) => {
                    return item['name'] === catalogName;
                });
            }
            else {
                const errorMessage = 'No service-now catalog items were configured, please contact your system administrator';
                this.ajaxFail(req, res, errorMessage, { status: false, message: errorMessage });
            }
            if (catalogItem) {
                catalogId = catalogItem['id'];
            }
            else {
                const errorMessage = 'No service-now catalog was found, please contact your system administrator';
                this.ajaxFail(req, res, errorMessage, { status: false, message: errorMessage });
            }
            if (request['data_manager'] && request['data_manager']['value']) {
                reqInfo.requested_by = request['data_manager']['value'];
                try {
                    requestorName = reqInfo.requested_by.substr(0, reqInfo.requested_by.indexOf('.'));
                }
                catch (e) {
                    sails.log.error('Requested By name Error');
                    sails.log.error(e);
                    requestorName = 'Stash User';
                }
            }
            else {
                const errorMessage = `No data manager in plan to assign ticket`;
                this.ajaxFail(req, res, errorMessage, { status: false, message: errorMessage });
            }
            if (request['data_supervisor'] && request['data_supervisor']['value']) {
                reqInfo.affected_contact = request['data_supervisor']['value'];
                emailPermissions.push(reqInfo.affected_contact);
            }
            else {
                const errorMessage = `No supervisor in plan to assign ticket`;
                this.ajaxFail(req, res, errorMessage, { status: false, message: errorMessage });
            }
            if (reqInfo.requested_by && reqInfo.assigned_to && catalogId) {
                sails.log.debug('----------');
                sails.log.debug(`Catalog ${catalogName} id: ${catalogId}`);
                return CatalogService.sendGetToTable('sys_user', { email: reqInfo.assigned_to })
                    .flatMap(response => {
                    if (response && response['result']) {
                        const result = _.first(response['result']);
                        reqInfo.assigned_to = result['sys_id'];
                        sails.log.debug(`assigned_to ${reqInfo.assigned_to}`);
                    }
                    else {
                        const errorMessage = 'Cannot find user to assign ticket on Service Now';
                        sails.log.error(errorMessage);
                        sails.log.error(response);
                        throw rxjs_1.throwError(errorMessage);
                    }
                    return CatalogService.sendGetToTable('sys_user', { email: reqInfo.requested_by });
                }).flatMap(response => {
                    sails.log.debug('requestToVariables');
                    const variables = this.requestToVariables(request);
                    variables['rdmp'] = `${this.config.brandingAndPortalUrl}/record/view/${rdmp}`;
                    variables['requestor'] = requestorName;
                    if (response && response['result']) {
                        const result = _.first(response['result']);
                        sails.log.debug(`requestedByEmail ${reqInfo.requested_by}`);
                        sails.log.debug(result['sys_id']);
                        reqInfo.requested_by = result['sys_id'];
                        variables['user_id'] = reqInfo.requested_by;
                        variables['opened_by'] = reqInfo.requested_by;
                    }
                    else {
                        sails.log.error(response);
                        throw rxjs_1.throwError('Cannot find requested_by Id on Service Now');
                    }
                    sails.log.debug(variables);
                    sails.log.debug('----------');
                    return CatalogService.serviceCatalogPost('/api/sn_sc/servicecatalog/items/', catalogId, 'order_now', '1', variables, reqInfo.assigned_to, reqInfo.opened_by, reqInfo.requested_by);
                }).flatMap(response => {
                    sails.log.debug('create catalog item');
                    if (response && response['result']) {
                        const result = response['result'];
                        request_number = result['request_number'];
                        workspaceLocation = `${this.config.domain}${this.config.taskURL}${result['sys_id']}`;
                    }
                    else {
                        workspaceLocation = `${this.config.domain}`;
                    }
                    return WorkspaceService.getRecordMeta(this.config, rdmp);
                }).flatMap(response => {
                    sails.log.debug('get recordMetadata');
                    recordMetadata = response;
                    rdmpTitle = recordMetadata['title'];
                    const record = {
                        rdmpOid: rdmp,
                        rdmpTitle: rdmpTitle,
                        title: workspaceTitle,
                        location: workspaceLocation,
                        description: request_number + ' : ' + workspaceType + ' ' + workspaceDescription,
                        type: this.config.recordType
                    };
                    return WorkspaceService.createWorkspaceRecord(this.config, username, record, this.config.recordType, this.config.workflowStage, emailPermissions);
                })
                    .flatMap(workspace => {
                    sails.log.debug('create WorkspaceRecord');
                    if (recordMetadata['workspaces']) {
                        const wss = recordMetadata['workspaces'].find(id => workspace.oid === id);
                        if (!wss) {
                            recordMetadata['workspaces'].push({ id: workspace.oid });
                        }
                    }
                    return WorkspaceService.updateRecordMeta(this.config, recordMetadata, rdmp);
                })
                    .subscribe(response => {
                    sails.log.debug('createTicket, linkWorkspace');
                    createTicket = response;
                    this.ajaxOk(req, res, null, {
                        status: true,
                        createTicket: createTicket,
                        request_number: request_number,
                        workspaceLocation: workspaceLocation
                    });
                }, error => {
                    sails.log.error('request: error');
                    const errorMessage = 'There was an error submitting your request. Please contact support team';
                    sails.log.error(`${errorMessage} ${error.message}`);
                    this.ajaxFail(req, res, error.message, { status: false, message: errorMessage });
                });
            }
        }
        requestToVariables(request) {
            const variables = {};
            _.forOwn(request, (val) => {
                const v = val['variable'];
                const vv = val['value'];
                variables[v] = vv['name'] || vv;
                if (Array.isArray(variables[v]) && variables[v].length === 1) {
                    variables[v] = _.first(variables[v]);
                }
            });
            return variables;
        }
    }
    Controllers.CatalogController = CatalogController;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
module.exports = new Controllers.CatalogController().exports();
