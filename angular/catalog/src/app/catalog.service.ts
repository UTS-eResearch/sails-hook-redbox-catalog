import {Injectable, Inject} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/delay';
import {Observable} from 'rxjs/Observable';

import {BaseService} from './shared/base-service';
import {ConfigService} from './shared/config-service';

@Injectable()
export class CatalogService extends BaseService {

  protected baseUrl: any;
  public recordURL: string = this.brandingAndPortalUrl + '/record/view';
  protected initSubject: any;

  constructor(@Inject(Http) http: Http,
              @Inject(ConfigService) protected configService: ConfigService) {
    super(http, configService);
    this.initSubject = new Subject();
    this.emitInit();
  }

  public waitForInit(handler: any) {
    const subs = this.initSubject.subscribe(handler);
    this.emitInit();
    return subs;
  }

  public emitInit() {
    if (this.brandingAndPortalUrl) {
      this.initSubject.next('');
    }
  }

  public async getTypes() {
    const wsUrl = this.brandingAndPortalUrl + '/ws/catalog/types';
    try {
      const result = await this.http.get(
        wsUrl,
        this.options
      ).toPromise();
      return Promise.resolve(this.extractData(result));
    } catch (e) {
      return Promise.reject(new Error(e));
    }
  }

  public async createRequest(request: any, rdmpId: string, catalogId: string, workspaceInfo: any, workspaceType: string) {
    const wsUrl = this.brandingAndPortalUrl + '/ws/catalog/request';
    try {
      const result = await this.http.post(
        wsUrl,
        {
          request: request,
          rdmp: rdmpId,
          catalogId: catalogId,
          workspaceInfo: workspaceInfo,
          workspaceType: workspaceType
        },
        this.options
      ).toPromise();
      return Promise.resolve(this.extractData(result));
    } catch (e) {
      return Promise.reject(new Error(e));
    }
  }

  public async getUserInfo() {
    const wsUrl = this.brandingAndPortalUrl + '/user/info';
    try {
      const result = await this.http.get(
        wsUrl,
        this.options
      ).toPromise();
      return Promise.resolve((this.extractData(result)));
    } catch (e) {
      return Promise.reject(new Error(e));
    }
  }

  public async getRDMPInfo(rdmp) {
    const wsUrl = this.brandingAndPortalUrl + '/ws/catalog/rdmp';
    try {
      const result = await this.http.post(
        wsUrl,
        {rdmp: rdmp},
        this.options
      ).toPromise();
      return Promise.resolve((this.extractData(result)));
    } catch (e) {
      return Promise.reject(new Error(e));
    }
  }

}
