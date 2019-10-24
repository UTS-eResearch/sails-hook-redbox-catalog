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
      'sendGetToTable',
      'serviceCatalogPost'
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
      let q = `/api/now/table/${table}`;
      const post = requestPromise({
        uri: this.config.domain + q,
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
      const post = requestPromise({
        uri: this.config.domain + `/api/now/table/${table}`,
        method: 'GET',
        qs: body,
        json: true,
        headers: this.config.servicenowHeaders
      });
      return from(post);
    }

    serviceCatalogPost(uri:string, catalogId:string, method:string, quantity: number, variables:any){
      const body = {
        sysparm_quantity: quantity,
        variables: variables
      };
      const url = `${this.config.domain}${uri}${catalogId}/${method}`;
      sails.log.debug("==================");
      sails.log.debug(url);
      sails.log.debug("==================");
      const post = requestPromise({
        uri: url,
        method: 'POST',
        qs: body,
        json: true,
        headers: this.config.servicenowHeaders
      });
      return from(post);
    }
  }
}
module.exports = new Services.CatalogService().exports();
