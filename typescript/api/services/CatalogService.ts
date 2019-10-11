import {Sails, Model} from 'sails';
import {Observable, from, of, throwError} from 'rxjs';
import * as qs from "qs";

import * as requestPromise from "request-promise";

import {Config} from '../Config';

import services = require('../core/CoreService');

declare var sails: Sails;
declare var WorkspaceService, _;

export module Services {

  export class CatalogService extends services.Services.Core.Service {
    protected config: Config;

    protected _exportedMethods: any = [
      'rdmpInfo',
      'sendPostToTable',
      'sendGetToTable'
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

    sendPostToTable(table: string, query: any, body: any) {
      sails.log.debug(this.config.servicenowHeaders);
      const post = requestPromise({
        uri: this.config.domain + `/api/now/table/${table}${args}`,
        method: 'POST',
        body: body,
        qs: query,
        json: true,
        headers: this.config.servicenowHeaders
      });
      return from(post);
    }

    sendGetToTable(table: string, body: any) {
      const query = qs.stringify(body);
      sails.log.debug(query);
      const post = requestPromise({
        uri: this.config.domain + `/api/now/table/${table}`,
        method: 'GET',
        qs: body,
        json: true,
        headers: this.config.servicenowHeaders
      });
      return from(post);
    }
  }
}
module.exports = new Services.CatalogService().exports();
