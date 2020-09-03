"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const services = require("../core/CoreService");
var Services;
(function (Services) {
    class ServicenowCatalogService extends services.Services.Core.Service {
        constructor() {
            super(...arguments);
            this._exportedMethods = [
                'submitRequest',
            ];
        }
        submitRequest(oid, workspaceData, options, user, response) {
            return __awaiter(this, void 0, void 0, function* () {
                sails.log.verbose(`ServiceNowCatalog processing request for: ${oid}`);
                let catalogUrl = sails.config.servicenow.catalog.url;
                sails.log.verbose(JSON.stringify(sails.config.servicenow));
                if (_.isEmpty(catalogUrl)) {
                    const errMsg = "Missing ServiceNow Catalog URL configuration.";
                    sails.log.error(errMsg);
                    response.code = "500";
                    response.status = false;
                    response.success = false;
                    response.message = errMsg;
                    return response;
                }
                sails.log.verbose(`ServiceNowCatalog adding workspace to record...`);
                response = yield WorkspaceService.addWorkspaceToRecord(workspaceData.metadata.rdmpOid, oid);
                sails.log.verbose(`ServiceNowCatalog sending request via: ${catalogUrl}`);
                sails.log.verbose(JSON.stringify(workspaceData));
                sails.log.verbose(`ServiceNowCatalog completed request.`);
                return response;
            });
        }
    }
    Services.ServicenowCatalogService = ServicenowCatalogService;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.ServicenowCatalogService().exports();
