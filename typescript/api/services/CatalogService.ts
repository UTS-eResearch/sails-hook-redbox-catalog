import {Sails, Model} from 'sails';

import {Config} from '../Config';

import services = require('../core/CoreService');

declare var sails: Sails;
declare var WorkspaceService, _;

export module Services {

  export class CatalogService extends services.Services.Core.Service {
    protected config: Config;

    protected _exportedMethods: any = [
      'rdmpInfo',
      'createRequest',
      'sendEmail'
    ];

    constructor() {
      super();
      this.config = new Config(sails.config.workspaces);
    }

    async rdmpInfo(rdmp: any) {
      try {
          return await WorkspaceService.getRecordMeta(this.config, rdmp);
      } catch (e) {
        return Promise.reject(new Error(e));
      }
    }


  }
}
module.exports = new Services.CatalogService().exports();
