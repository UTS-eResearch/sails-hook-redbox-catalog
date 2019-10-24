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
import {FormGroup, FormControl, Validators, FormBuilder, FormArray} from '@angular/forms';
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

  requestGroupForm: FormGroup;
  formArrayItems: {}[];
  formArray: {}[];

  @Output() catalog: EventEmitter<any> = new EventEmitter<any>();

  constructor(options: any, injector: any, private formBuilder: FormBuilder) {
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
    this.catalogId = '';
    this.formBuilder = new FormBuilder();
    this.requestGroupForm = this.formBuilder.group({
      formArray: this.formBuilder.array([])
    });
    this.formArrayItems = [];
    this.formArray = [];
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
    this.requestType = req.service;
    this.requestFormElements = req.service.form;
    this.projectInfo = req.project;
    this.catalogId = req.service.catalogId;
    this.formArray = [];
    this.formArrayItems = [];
    _.forOwn(this.requestFormElements, (el, name) => {
      this.formArrayItems.push({
        id: name,
        title: el['title'],
        type: el['type'],
        fields: el['fields'] || [],
        textarea: el['textarea'] || {}
      });
      if (!_.isUndefined(el['prefil'])) {
        try {
          const prefilKey = el['prefil']['key'];
          const prefilVal = el['prefil']['val'];
          const element = this.projectInfo[prefilKey];
          const isDisabled = el['disabled'] || false;
          this.formArray.push(this.formBuilder.control({value: element[prefilVal], disabled: isDisabled}));
        } catch (e) {
          console.error('Please fix form config');
          console.error(e);
        }
      } else {
        this.formArray.push(this.formBuilder.control(''));
      }
    });
    console.log(this.formArray);
  }

  showCatalog() {
    this.showRequest = false;
    this.catalog.emit();
  }

  async setStorageTypes() {
    this.storageType = await this.catalogService.getTypes() || [];
  }

  // TODO: validate smarter!
  validate(form) {

    _.forEach(this.formArray, (formElement) => {
      console.log(formElement.get('name'));
      console.log(formElement.value);
    });

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
      //this.requestForm(form);
    }

  }

  async requestForm(request) {

    this.loading = true;
    // TODO: make this dynamic
    if (!request.type) {
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
                      <form [formGroup]="field.requestGroupForm"
                            *ngIf="!field.requestSent" id="form"
                            novalidate autocomplete="off">
                          <div formArrayName="formArray" *ngFor="let arrayItem of field.formArrayItems; let i=index">
                              <div *ngIf="arrayItem['type'] == 'text'" class="form-group">
                                  <label>{{arrayItem['title']}}</label>
                                  <input class="form-control" type="text"
                                         [name]="arrayItem['id']"
                                         [id]="arrayItem['id']"
                                         name="{{ arrayItem['id'] }}"
                                         [formControl]="field.formArray[i]"/>
                              </div>
                              <div *ngIf="arrayItem['type'] == 'textarea'" class="form-group">
                                  <label>{{arrayItem['title']}}</label>
                                  <textarea class="form-control"
                                            [maxlength]="arrayItem['maxlength']" [rows]="arrayItem['rows']"
                                            [cols]="arrayItem['cols']"
                                            [name]="arrayItem['id']"
                                            [id]="arrayItem['id']"
                                            name="{{ arrayItem['id'] }}"
                                            [formControl]="field.formArray[i]"></textarea>
                              </div>
                              <div *ngIf="arrayItem['type'] == 'select'" class="form-group">
                                  <label>{{arrayItem['title']}}</label>
                                  <select [name]="arrayItem['id']"
                                          [id]="arrayItem['id']"
                                          name="{{ arrayItem['id'] }}"
                                          [formControl]="field.formArray[i]"
                                          class="form-control">
                                      <option *ngFor="let t of arrayItem['fields']"
                                              [ngValue]="t">{{t.name}}</option>
                                  </select>
                              </div>
                          </div>
                          <div class="alert alert-warning alert-dismissible show">
                              <strong>Warning!</strong> This form is pre-filled with information from your data
                              management plan. If the fields are incorrect, please modify your plan.
                              <button type="button" class="close" data-dismiss="alert">&times;</button>
                          </div>
                          <button *ngIf="!field.loading" class="btn btn-primary"
                                  (click)="field.validate(form)"
                                  type="submit" form="ngForm">{{ field.requestLabel }}
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
