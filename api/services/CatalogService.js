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
const rxjs_1 = require("rxjs");
const qs = require("qs");
const requestPromise = require("request-promise");
const Config_1 = require("../Config");
const services = require("../core/CoreService");
var Services;
(function (Services) {
    class CatalogService extends services.Services.Core.Service {
        constructor() {
            super();
            this._exportedMethods = [
                'rdmpInfo',
                'sendPostToTable',
                'sendGetToTable'
            ];
            this.config = new Config_1.Config(sails.config.workspaces);
        }
        rdmpInfo(rdmp) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    return yield WorkspaceService.getRecordMeta(this.config, rdmp);
                }
                catch (e) {
                    return Promise.reject(new Error(e));
                }
            });
        }
        sendPostToTable(table, query, body) {
            sails.log.debug(this.config.servicenowHeaders);
            const post = requestPromise({
                uri: this.config.domain + `/api/now/table/${table}${args}`,
                method: 'POST',
                body: body,
                qs: query,
                json: true,
                headers: this.config.servicenowHeaders
            });
            return rxjs_1.from(post);
        }
        sendGetToTable(table, body) {
            const query = qs.stringify(body);
            sails.log.debug(query);
            const post = requestPromise({
                uri: this.config.domain + `/api/now/table/${table}`,
                method: 'GET',
                qs: body,
                json: true,
                headers: this.config.servicenowHeaders
            });
            return rxjs_1.from(post);
        }
    }
    Services.CatalogService = CatalogService;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.CatalogService().exports();
