"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Services = void 0;
const numeral = require("numeral");
const moment = require("moment");
const axios_1 = require("axios");
const util = require('util');
const redbox_core_types_1 = require("@researchdatabox/redbox-core-types");
var Services;
(function (Services) {
    class ServicenowCatalogService extends redbox_core_types_1.Services.Core.Service {
        constructor() {
            super(...arguments);
            this._exportedMethods = [
                'submitRequest',
            ];
        }
        submitRequest(oid, workspaceData, options, user, response) {
            return __awaiter(this, void 0, void 0, function* () {
                sails.log.verbose(`ServiceNowCatalog processing request for: ${oid}`);
                sails.log.verbose("Global config:");
                sails.log.verbose(JSON.stringify(sails.config.servicenow));
                sails.log.verbose("Hook config:");
                sails.log.verbose(JSON.stringify(options));
                let catalogUrl = this.getConfig('catalog.axios.url', options);
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
                try {
                    response = yield WorkspaceService.addWorkspaceToRecord(workspaceData.metadata.rdmpOid, oid);
                }
                catch (err) {
                    sails.log.error(`ServiceNowCatalog failed to associate workspace to record: ${workspaceData.metadata.rdmpOid}`);
                    sails.log.error(JSON.stringify(err));
                    return response;
                }
                let body_template = this.getConfig('catalog.body_template', options);
                sails.log.verbose(`ServiceNowCatalog body template:`);
                sails.log.verbose(JSON.stringify(body_template));
                const rdmpData = yield RecordsService.getMeta(workspaceData.metadata.rdmpOid);
                const catalogFields = this.getConfig('catalog.fields', options);
                const outgoingDataSource = { workspace: workspaceData, rdmp: rdmpData, oid: oid, moment: moment, numeral: numeral, translationService: TranslationService };
                body_template = this.runDataRemap(outgoingDataSource, body_template, catalogFields);
                sails.log.verbose(`ServiceNowCatalog sending request via: ${catalogUrl}, options:`);
                const axiosOptions = this.getConfig('catalog.axios', options);
                axiosOptions.data = body_template;
                sails.log.verbose(JSON.stringify(axiosOptions));
                let snResponse = null;
                try {
                    snResponse = yield (0, axios_1.default)(axiosOptions);
                }
                catch (err) {
                    sails.log.error(`ServiceNowCatalog failed to submit to request for workspace OID: ${oid}, error is:`);
                    sails.log.error(JSON.stringify(err));
                    response.code = `${err.code}`;
                    response.status = false;
                    response.success = false;
                    response.message = `ServiceNowCatalog failed to submit to request for workspace OID: ${oid}, check server logs.`;
                }
                if (!_.isNull(snResponse)) {
                    if (snResponse.status == 200) {
                        const updateSource = snResponse.data;
                        workspaceData = this.runDataRemap(updateSource, workspaceData, this.getConfig('catalog.update_fields', options));
                        yield RecordsService.updateMeta(null, oid, workspaceData);
                    }
                    else {
                        sails.log.error(`ServiceNowCatalog submit request failed for workspace OID: ${oid}, check server logs.`);
                        sails.log.error(JSON.stringify(snResponse));
                        response.code = `${snResponse.status}`;
                        response.status = false;
                        response.success = false;
                        response.message = `ServiceNowCatalog failed to submit to request for workspace OID: ${oid}, check server logs.`;
                    }
                }
                sails.log.verbose(`ServiceNowCatalog completed request for ${oid}`);
                return response;
            });
        }
        getConfig(fieldPath, options) {
            return _.get(options, fieldPath, _.get(sails.config.servicenow, fieldPath));
        }
        runDataRemap(source, target, fields) {
            for (const fieldDef of fields) {
                const source_field = fieldDef.source_field;
                const dest_field = fieldDef.dest_field;
                const dest_template = fieldDef.dest_template;
                let src_data = null;
                if (!_.isEmpty(source_field)) {
                    src_data = _.get(source, source_field);
                }
                if (!_.isEmpty(dest_template)) {
                    const imports = _.extend({ data: src_data, config: fieldDef, moment: moment, numeral: numeral, translationService: TranslationService }, source);
                    const templateData = { imports: imports };
                    const template = _.template(dest_template, templateData);
                    src_data = template();
                }
                if (!_.isEmpty(dest_field)) {
                    _.set(target, dest_field, src_data);
                }
            }
            return target;
        }
    }
    Services.ServicenowCatalogService = ServicenowCatalogService;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.ServicenowCatalogService().exports();
