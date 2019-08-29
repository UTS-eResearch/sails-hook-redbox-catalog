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
                'rdmpInfo'
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
    }
    Controllers.CatalogController = CatalogController;
})(Controllers = exports.Controllers || (exports.Controllers = {}));
module.exports = new Controllers.CatalogController().exports();
