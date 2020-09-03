import {Sails, Model} from 'sails';
import {Observable, from, of, throwError} from 'rxjs';
import * as qs from "qs";

import * as requestPromise from "request-promise";

// import {Config} from '../Config';

import services = require('../core/CoreService');

declare var sails: Sails;
declare var WorkspaceService, _;
declare var RecordsService, TranslationService, WorkflowStepsService;

export module Services {

  // Using configuration for (versioned API): https://developer.servicenow.com/dev.do#!/reference/api/newyork/rest/c_ServiceCatalogAPI#SCatAPIOrderNowPOST
  //
  // Official build info:
  //
  // Build name: Newyork
  // Build date: 06-05-2020_2026
  // Build tag: glide-newyork-06-26-2019__patch9-05-27-2020
  // MID buildstamp: newyork-06-26-2019__patch9-05-27-2020_06-05-2020_2026
  export class ServicenowCatalogService extends services.Services.Core.Service {
    // protected config: Config;

    protected _exportedMethods: any = [
      'submitRequest',
    ];
    /**
     * Submits a ServiceNow catalog item request.
     *
     */
    public async submitRequest(oid, workspaceData, options, user, response) {
      sails.log.verbose(`ServiceNowCatalog processing request for: ${oid}`);
      let catalogUrl = sails.config.servicenow.catalog.url;
      sails.log.verbose(JSON.stringify(sails.config.servicenow));
      // TODO: validate if we have the right configuration
      if (_.isEmpty(catalogUrl)) {
        const errMsg = "Missing ServiceNow Catalog URL configuration.";
        sails.log.error(errMsg)
        response.code = "500";
        response.status = false;
        response.success = false;
        response.message = errMsg;
        return response;
      }
      // associate the workspace with the RDMP
      sails.log.verbose(`ServiceNowCatalog adding workspace to record...`);
      response = await WorkspaceService.addWorkspaceToRecord(workspaceData.metadata.rdmpOid, oid);
      // prepare the request to ServiceNow
      sails.log.verbose(`ServiceNowCatalog sending request via: ${catalogUrl}`);
      sails.log.verbose(JSON.stringify(workspaceData));
      // perform any updates to the workspace record ...
      // all done!
      sails.log.verbose(`ServiceNowCatalog completed request.`);
      return response;
    }
  }
}
module.exports = new Services.ServicenowCatalogService().exports();
