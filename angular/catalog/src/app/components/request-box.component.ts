import {
  Input,
  Output,
  Component,
  OnInit,
  Inject,
  Injector,
  ElementRef,
  ViewChild,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import {SimpleComponent} from '../shared/form/field-simple.component';
import {FieldBase} from '../shared/form/field-base';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import * as _ from "lodash-es";

import {CatalogService} from '../catalog.service';

// STEST-22
declare var jQuery: any;

/**
 * Contributor Model
 *
 * @author <a target='_' href='https://github.com/moisbo'>moisbo</a>
 *
 */
export class RequestBoxField extends FieldBase<any> {

  loading: boolean;
  isLoaded: boolean;

  boxTitleLabel: string;
  nameLabel: string;
  typeLabel: string;
  ownerLabel: string;
  supervisorLabel: string;
  backToCatalogLabel: string;
  requestLabel: string;
  notesLabel: string;
  errorMessage: boolean = false;
  requestError: string;
  requestSuccess: string;
  requestNextAction: string;
  requestNamePlaceholder: string;
  dmEmailLabel: string;
  ciEmailLabel: string;
  retentionLabel: string;
  projectStartLabel: string;
  projectEndLabel: string;

  owner: string;
  ownerEmail: string;
  emailLabel: string;
  supervisor: string;
  requestSent: boolean = false;
  storageType: object[];
  requestType: string;
  requestName: string;
  rdmp: string;
  supervisorEmail: string;
  projectInfo: any = {
    id: null,
    title: null,
    ci: null,
    dataManager: null,
    retention: null,
    projectStart: null,
    projectEnd: null
  };
  ci: any = {name: null, email: null};
  dm: any = {name: null, email: null};
  requestTypeSelect: any = null;
  catalogId: string = null;

  catalogService: CatalogService;

  valid: any;
  formError: boolean = false;
  validations: any = [];
  showRequest: boolean = false;
  requestFormElements: object = {};

  @Output() catalog: EventEmitter<any> = new EventEmitter<any>();

  constructor(options: any, injector: any) {
    super(options, injector);
    this.catalogService = this.getFromInjector(CatalogService);
    this.nameLabel = options['nameLabel'] || 'Name';
    this.typeLabel = options['typeLabel'] || 'Type';
    this.ownerLabel = options['ownerLabel'] || 'Owner';
    this.emailLabel = options['emailLabel'] || 'Email';
    this.supervisorLabel = options['supervisorLabel'] || 'Supervisor';
    this.backToCatalogLabel = options['backToCatalogLabel'] || 'Back to Catalog';
    this.boxTitleLabel = options['boxTitleLabel'] || 'Title';
    this.requestLabel = options['requestLabel'] || 'Request';
    this.notesLabel = options['notesLabel'] || 'Add notes to your request';
    this.requestNamePlaceholder = options['requestNamePlaceholder'] || 'please name your request';
    this.dmEmailLabel = options['dmEmailLabel'] || 'Data Manager';
    this.ciEmailLabel = options['ciEmailLabel'] || 'Supervisor/FNCI';
    this.retentionLabel = options['retentionLabel'] || 'Retention';
    this.projectStartLabel = options['projectStartLabel'] || 'Start of Project';
    this.projectEndLabel = options['projectEndLabel'] || 'End of Project';
    this.requestError = options['requestError'] || 'Request Error';
    this.requestSuccess = options['requestSuccess'] || 'Request Success';
    this.requestNextAction = options['requestNextAction'] || 'Request Next Action : approve by ServiceConnect';
    this.valid = options['valid'] || {};
    this.storageType = options['types'] || [];
    this.requestTypeSelect = null;
    this.catalogId = ''
  }

  init() {
    this.rdmp = this.fieldMap._rootComp.rdmp;
    this.setUserEmail();
    this.setSupervisor();
  }

  registerEvents() {
    this.fieldMap['CatalogDisplay'].field['requestBox'].subscribe(this.showRequestForm.bind(this));
  }

  showRequestForm(req) {
    this.showRequest = true;
    console.log(`generate request for ${JSON.stringify(req.service)}`);
    this.requestType = req.service;
    this.requestFormElements = req.service.form;
    this.projectInfo = req.project;
    this.ci = req.project.ci;
    this.dm = req.project.dm;
    this.catalogId = req.service.catalogId;
    console.log(this.dm);
  }

  showCatalog() {
    this.showRequest = false;
    this.catalog.emit();
  }

  async setStorageTypes() {
    this.storageType = await this.catalogService.getTypes() || [];
  }

  // TODO: validate smarter!
  validate(form: any) {
    this.validations = [];

    // Compare objects this.requestFormElements filter in validate true with form
    _.forOwn(this.requestFormElements, (v, k) => {
      console.log(v);
      console.log(k);
      if (v['validate']) {
        const formValue = form[k];
        if (formValue === '') {
          this.validations.push(v['desc']);
        }
      }
    });

    if (this.validations.length > 0) {
      this.formError = true;
    } else {
      this.requestForm(form);
    }

  }

  async requestForm(request) {

    this.loading = true;
    // TODO: make this dynamic
    if(!request.type){
      request.type = this.requestType['name'];
    }
    request.owner = this.owner;
    request.ownerEmail = this.dm.email;
    request.supervisor = this.ci.email;
    request.owner = this.owner;
    request.retention = this.projectInfo.retention;
    request.projectStart = this.projectInfo.projectStart;
    request.projectEnd = this.projectInfo.projectEnd;

    const catalogId = this.catalogId;
    this.formError = false;
    // validate!
    const createRequest = await this.catalogService.createRequest(request, this.rdmp, this.ownerEmail, catalogId);
    if (!createRequest.status) {
      this.formError = true;
      this.errorMessage = createRequest.message;
    } else {
      this.requestSent = true;
    }
    this.loading = false;
  }

  async setUserEmail() {
    const userInfo = await this.catalogService.getUserInfo();
    const user = userInfo['user'];
    this.ownerEmail = user['email'];
    this.owner = user['name'];
  }

  async setSupervisor() {
    const userInfo = await this.catalogService.getUserInfo();
    this.supervisorEmail = 'email';
  }

  createFormModel(valueElem: any = undefined): any {
    if (valueElem) {
      this.value = valueElem;
    }

    this.formModel = new FormControl(this.value || []);

    if (this.value) {
      this.setValue(this.value);
    }

    return this.formModel;
  }

  setValue(value: any) {
    this.formModel.patchValue(value, {emitEvent: false});
    this.formModel.markAsTouched();
  }

  setEmptyValue() {
    this.value = [];
    return this.value;
  }

}

/*
let description = `
Creating request from Stash

Dear eResearch admin: Please verify this workspace request done via Stash in the next data management plan

${this.config.brandingAndPortalUrl}/record/view/${rdmp}

Details:

${request.name}`;

if(request.type){
  description += `

  Type: ${request.type}

  `;
}

description += `${request.owner} : ${request.ownerEmail}

Supervisor: ${request.supervisor}

Retention Period: ${request.retention}

Project Start: ${request.projectStart}

Project End: ${request.projectEnd}
`;
*/

/**
 * Component that CreateModal to a workspace app
 */
@Component({
  selector: 'ws-requestbox',
  template: `
      <div *ngIf="field.showRequest">
          <div class="row">
              <div class="col-md-7 col-md-offset-2">
                  <div class="row">
                      <h4>{{ field.boxTitleLabel }} : {{ field.requestType['name']}}</h4>
                      <form *ngIf="!field.requestSent" #form="ngForm" novalidate autocomplete="off">
                          <div *ngIf="field.requestFormElements['name']['enable']" class="form-group">
                              <label>{{ field.nameLabel }}</label>
                              <input type="text" class="form-control"
                                     name="name" ngModel required placeholder="{{ field.requestNamePlaceholder }}"
                                     attr.aria-label="{{ field.nameLabel }}">
                          </div>
                          <div *ngIf="field.requestFormElements['type']" class="form-group">
                              <label>{{ field.requestFormElements.type.label }}</label>
                              <select name="type"
                                      ngModel class="form-control"
                                      >
                                  <option value="null" disabled="true" [selected]="true">{{ field.requestFormElements['type']['label'] }}</option>
                                  <option *ngFor="let t of field.requestFormElements.type.fields"
                                          [ngValue]="t">{{t.name}}</option>
                              </select>
                          </div>
                          <div class="form-group">
                              <div class="form-group">
                                  <label>{{ field.ownerLabel }}</label>
                                  <input type="text" class="form-control" [(ngModel)]="field.owner"
                                         name="owner" ngModel="owner" required disabled
                                         attr.aria-label="{{ field.ownerLabel }}">
                              </div>
                          </div>
                          <div class="form-group">
                              <label>{{ field.dmEmailLabel }}</label>
                              <input type="text" class="form-control" [(ngModel)]="field.dm.email"
                                     name="ownerEmail" ngModel="ownerEmail" required disabled
                                     attr.aria-label="{{ field.ownerLabel }}">
                          </div>
                          <div class="form-group">
                              <div class="form-inline">
                                  <div class="form-group">
                                      <label>{{ field.ciEmailLabel }}</label>
                                      <input type="text" class="form-control" [(ngModel)]="field.ci.email"
                                             name="supervisor" ngModel required disabled
                                             size="35" attr.aria-label="{{ field.ciEmailLabel }}">
                                  </div>
                              </div>
                          </div>
                          <div class="form-group">
                              <div class="form-inline">
                                  <div class="form-group">
                                      <label>{{ field.retentionLabel }}</label>
                                      <input type="text" class="form-control" [(ngModel)]="field.projectInfo.retention"
                                             name="retention" ngModel required disabled
                                             size="35" attr.aria-label="{{ field.retentionLabel }}">
                                  </div>
                              </div>
                          </div>
                          <div class="form-group">
                              <div class="form-inline">
                                  <div class="form-group">
                                      <label>{{ field.projectStartLabel }}</label>
                                      <input type="text" class="form-control"
                                             [(ngModel)]="field.projectInfo.projectStart"
                                             name="projectStart" ngModel required disabled
                                             size="35" attr.aria-label="{{ field.projectStartLabel }}">
                                  </div>
                              </div>
                          </div>
                          <div class="form-group">
                              <div class="form-inline">
                                  <div class="form-group">
                                      <label>{{ field.projectEndLabel }}</label>
                                      <input type="text" class="form-control" [(ngModel)]="field.projectInfo.projectEnd"
                                             name="projectEnd" ngModel required disabled
                                             size="35" attr.aria-label="{{ field.projectEndLabel }}">
                                  </div>
                              </div>
                          </div>
                          <div class="form-group">
                              <label>{{ field.requestFormElements.notes.label }}</label>
                              <textarea maxlength="30" rows="10" cols="150"
                                        class="form-control" ngModel name="notes"></textarea>
                          </div>
                          <div class="alert alert-danger" *ngIf="field.formError">
                              <p *ngIf="field.errorMessage">{{field.errorMessage}}</p>
                              <ul>
                                  <li *ngFor="let v of field.validations">{{ v }}</li>
                              </ul>
                          </div>
                          <div class="alert alert-warning alert-dismissible show">
                              <strong>Warning!</strong> This form is pre-filled with information from your data
                              management plan. If the fields are incorrect, please modify your plan.
                              <button type="button" class="close" data-dismiss="alert">&times;</button>
                          </div>
                          <button *ngIf="!field.loading" class="btn btn-primary"
                                  type="submit" (click)="field.validate(form.value)">{{ field.requestLabel }}
                          </button>
                          <div *ngIf="field.loading">
                              ... requesting ...
                          </div>
                          <div class="row"><br/></div>
                      </form>
                  </div>
                  <div class="row">
                      <div *ngIf="field.requestSent">
                          <p>{{ field.requestSuccess }}</p>
                          <p>Owner: <strong>{{ field.owner }}</strong></p>
                          <p>Supervisor: <strong>{{ field.ci.email }}</strong></p>
                          <p>{{ field.requestNextAction }}</p>
                      </div>
                  </div>

              </div>
          </div>

          <div class="row">
              <a (click)="field.showCatalog()" class="btn btn-secondary">{{ field.backToCatalogLabel }}</a>
          </div>
      </div>
      <div class="row"><br/></div>
  `
})
export class RequestBoxComponent extends SimpleComponent implements OnInit, AfterViewInit {
  field: RequestBoxField;

  ngOnInit() {
    this.field.init();
  }

  ngAfterViewInit() {
    this.field.registerEvents();
  }
}
