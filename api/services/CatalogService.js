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
const Config_1 = require("../Config");
const services = require("../core/CoreService");
var Services;
(function (Services) {
    class CatalogService extends services.Services.Core.Service {
        constructor() {
            super();
            this._exportedMethods = [
                'rdmpInfo',
                'createRequest',
                'sendEmail'
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
    }
    Services.CatalogService = CatalogService;
})(Services = exports.Services || (exports.Services = {}));
module.exports = new Services.CatalogService().exports();
