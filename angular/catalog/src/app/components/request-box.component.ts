import {
  Output,
  Component,
  OnInit,
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

import {PipeTransform, Pipe} from '@angular/core';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value): any {
    return Object.keys(value);
  }
}

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
  form: {};

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
    this.formArrayItems = [];
    this.formArray = [];
    this.form = {};
  }

  init() {
    this.rdmp = this.fieldMap._rootComp.rdmp;
    this.setUserEmail();
    this.setSupervisor();
  }

  registerEvents() {
    this.fieldMap['CatalogDisplay'].field['requestBox'].subscribe(this.showRequestForm.bind(this));
  }

  getValue(controlName, attr) {
    const obj = _.find(this.formArrayItems, (el) => {
      return el['id'] === controlName;
    });
    return obj[attr];
  }

  showRequestForm(req) {
    this.showRequest = true;
    this.requestType = req.service;
    this.requestFormElements = req.service.form;
    this.projectInfo = req.project;
    this.catalogId = req.service.catalogId;
    this.formArray = [];
    this.formArrayItems = [];
    this.requestGroupForm = new FormGroup({});
    _.forOwn(this.requestFormElements, (el, name) => {
      this.formArrayItems.push({
        id: name,
        title: el['title'],
        type: el['type'],
        fields: el['fields'] || [],
        textarea: el['textarea'] || {},
        requestVariable: el['requestVariable'],
        validationMsg: el['validationMsg']
      });
      if (!_.isUndefined(el['prefil'])) {
        try {
          const prefilKey = el['prefil']['key'];
          const prefilVal = el['prefil']['val'] || el['prefil'];
          const element = this.projectInfo[prefilKey];
          const isDisabled = el['disabled'] || false;
          this.requestGroupForm.addControl(name,
            new FormControl({value: element[prefilVal], disabled: isDisabled}, Validators.required));
        } catch (e) {
          console.error('Please fix form config');
          console.error(e);
        }
      } else {
        this.requestGroupForm.addControl(name, new FormControl('', Validators.required));
      }
    });
  }

  showCatalog() {
    this.showRequest = false;
    this.catalog.emit();
  }

  async setStorageTypes() {
    this.storageType = await this.catalogService.getTypes() || [];
  }

  // TODO: validate smarter!
  validate() {
    this.validations = [];

    _.forEach(this.formArrayItems, (obj) => {
      const control = this.requestGroupForm.get(obj['id']);
      if (control.errors) {
        this.validations.push(obj['validationMsg']);
      } else {
        this.form[obj['id']] = {
          value: control.value,
          variable: obj.requestVariable
        };
      }
    });

    if (this.validations.length > 0) {
      this.formError = true;
      this.form = [];
    } else {
      this.requestForm(this.form);
    }

  }

  async requestForm(form) {

    this.loading = true;
    console.log(form);
    const catalogId = this.catalogId;
    this.formError = false;
    const createRequest = await this.catalogService.createRequest(form, this.rdmp, this.ownerEmail, catalogId);
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
                          <div *ngFor="let control of field.requestGroupForm.controls | keys; let i=index">
                              <div *ngIf="field.getValue(control, 'type') == 'text'" class="form-group">
                                  <label>{{field.getValue(control, 'title')}}</label>
                                  <input class="form-control" type="text"
                                         [name]="field.getValue(control, 'name')"
                                         [id]="field.getValue(control, 'id')"
                                         formControlName="{{ control }}"/>
                              </div>
                              <div *ngIf="field.getValue(control, 'type')  == 'textarea'" class="form-group">
                                  <label>{{field.getValue(control, 'title')}}</label>
                                  <textarea class="form-control"
                                            [rows]="field.getValue(control, 'rows')"
                                            [cols]="field.getValue(control, 'cols')"
                                            [name]="control"
                                            [id]="control"
                                            formControlName="{{ control }}"></textarea>
                              </div>
                              <div *ngIf="field.getValue(control, 'type')  == 'select'" class="form-group">
                                  <label>{{field.getValue(control, 'title')}}</label>
                                  <select [name]="control"
                                          [id]="control"
                                          formControlName="{{ control }}"
                                          class="form-control">
                                      <option *ngFor="let t of field.getValue(control, 'fields')"
                                              [ngValue]="t">{{t.name}}</option>
                                  </select>
                              </div>
                              <div *ngIf="field.getValue(control, 'type') == 'checkbox'" class="form-group">
                                  <label>{{field.getValue(control, 'title')}}</label>
                                  <div *ngFor="let radios of field.getValue(control, 'fields')" class="radio">
                                      <label>
                                          <input type="radio" [value]="radios['name']"
                                                 formControlName="{{ control }}">
                                          {{ radios['name'] }}
                                      </label>
                                  </div>
                              </div>
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
                                  (click)="field.validate()"
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
