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
  backToCatalogLabel: string;
  errorMessage: boolean = false;
  requestLabel: string;
  requestError: string;
  requestSuccess: string;
  errorRequest: string;
  requestNextAction: string;
  warning: string;
  warningRequest: string;
  requestNumber: string;
  workspaceLocation: string;

  owner: string;
  ownerEmail: string;
  emailLabel: string;
  supervisor: string;
  requestSent: boolean = false;
  storageType: object[];
  requestType: string;
  requestName: string;
  requestingMessage: string;
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
  catalogName: string = null;

  catalogService: CatalogService;

  valid: any;
  formError: boolean = false;
  validations: any = [];
  showRequest: boolean = false;
  requestFormElements: object = {};

  requestGroupForm: FormGroup;
  formArrayItems: {}[];
  formArray: {}[];
  formCheckBoxArray: any;
  formMultiTextArray: any;
  workspaceInfo: {};
  workspaceType: string;

  @Output() catalog: EventEmitter<any> = new EventEmitter<any>();

  constructor(options: any, injector: any, private formBuilder: FormBuilder) {
    super(options, injector);
    this.catalogService = this.getFromInjector(CatalogService);
    this.emailLabel = options['emailLabel'] || 'Email';
    this.backToCatalogLabel = options['backToCatalogLabel'] || 'Back to Catalog';
    this.boxTitleLabel = options['boxTitleLabel'] || 'Title';
    this.requestLabel = options['requestLabel'] || 'Submit Request';
    this.requestError = options['requestError'] || 'Request Error';
    this.requestSuccess = options['requestSuccess'] || 'Request Success';
    this.requestNextAction = options['requestNextAction'] || 'Request Next Action : approve by ServiceConnect';
    this.requestingMessage = options['requestingMessage'] || '... Requesting ...';
    this.warning = options['warning'] || 'Warning';
    this.warningRequest = options['warningRequest'] || 'Pre-filled form';
    this.errorRequest = options['errorRequest'] || 'There were some errors while submiting your request';
    this.valid = options['valid'] || {};
    this.storageType = options['types'] || [];
    this.workspaceInfo = {};
    this.requestTypeSelect = null;
    this.catalogName = '';
    this.formBuilder = new FormBuilder();
    this.formArrayItems = [];
    this.formArray = [];
    this.formCheckBoxArray = {};
    this.formMultiTextArray = [];
    this.workspaceType = '';
  }

  init() {
    this.rdmp = this.fieldMap._rootComp.rdmp;
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
    this.workspaceInfo = req.service.workspaceInfo;
    this.workspaceType = req.service.workspaceType;
    this.projectInfo = req.project;
    this.catalogName = req.service.id;
    this.formArray = [];
    this.formArrayItems = [];
    this.requestGroupForm = new FormGroup({});
    _.forOwn(this.requestFormElements, (el, name) => {
      this.formArrayItems.push({
        id: name,
        title: el['title'],
        type: el['type'],
        typeLabel: el['typeLabel'] || el['type'],
        fields: el['fields'] || [],
        textarea: el['textarea'] || {},
        requestVariable: el['requestVariable'],
        validationMsg: el['validationMsg']
      });
      let validators = null;
      if (el['validate']) {
        validators = Validators.required;
      }
      if (el['type'] === 'checkbox') {
        let checkboxValue = false;
        // Only auto tick on one value is supported for now.
        if (!_.isUndefined(el['prefil'])) {
          const obj = el['prefil'];
          checkboxValue = _.get(this.projectInfo, obj.key, false);
        }
        this.formCheckBoxArray[name] = _.map(el['fields'], () => {
          return new FormControl(checkboxValue);
        });

        this.requestGroupForm.addControl(name, new FormArray(this.formCheckBoxArray[name]));
      } else if (!_.isUndefined(el['prefil'])) {
        try {
          if (el['type'] === 'multi-text') {
            let values = el['prefil'].map((obj) => {
              const value = _.get(this.projectInfo, obj.key, null);
              return value.map((o) => o[obj.val]);
            });
            values = _.flattenDeep(values);
            values = values.filter((ele) => ele !== '');
            if (values.length === 0) {
              // If there is nothing to prefil, start with one.
              values.push('');
            }
            this.formMultiTextArray = _.map(values, (val) => {
              return new FormControl(val);
            });
            this.requestGroupForm.addControl(name, new FormArray(this.formMultiTextArray));
          } else {
            const prefilKey = el['prefil']['key'];
            const prefilVal = el['prefil']['val'] || el['prefil'];
            const element = this.projectInfo[prefilKey];
            const value = element[prefilVal] || element;
            const isDisabled = el['disabled'] || false;
            this.requestGroupForm.addControl(name,
              new FormControl({value: value, disabled: isDisabled}, validators)
            );
          }
        } catch (e) {
          console.error('Please fix form config');
          console.error(e);
        }
      } else {
        this.requestGroupForm.addControl(name, new FormControl('', validators));
      }
    });
  }

  showCatalog() {
    this.showRequest = false;
    this.requestNumber = '';
    this.workspaceLocation = '';
    this.validations = [];
    this.formError = null;
    this.catalog.emit();
  }

  async setStorageTypes() {
    this.storageType = await this.catalogService.getTypes() || [];
  }

  // TODO: validate smarter!
  validate() {
    this.validations = [];
    const form = {};
    _.forEach(this.formArrayItems, (obj) => {
      const control = this.requestGroupForm.get(obj['id']);
      if (control.errors) {
        this.validations.push(obj['validationMsg']);
      } else {
        form[obj['id']] = {
          value: control.value,
          variable: obj.requestVariable
        };
      }
    });

    if (this.validations.length > 0) {
      this.formError = true;
    } else {
      this.requestForm(form);
    }
  }

  async requestForm(form) {
    try {
      this.loading = true;
      jQuery('#modalCreatingRequest').modal('show');
      const workspaceInfo = this.getWorkspaceInfo(this.workspaceInfo, form);
      const catalogName = this.catalogName;
      this.formError = false;
      const createRequest = await this.catalogService.createRequest(form, this.rdmp, catalogName, workspaceInfo, this.workspaceType);
      if (!createRequest.status) {
        this.formError = true;
        this.errorMessage = createRequest.message;
      } else {
        this.requestNumber = createRequest.request_number;
        this.workspaceLocation = createRequest.workspaceLocation;
        this.requestSent = true;
      }
      this.loading = false;
      jQuery('#modalCreatingRequest').modal('hide');
    } catch (e) {
      console.log('form sent:');
      console.log(form);
      console.error(e);
      console.error(e.message);
      jQuery('#modalCreatingRequest').modal('hide');
    }
  }

  getWorkspaceInfo(objs, form) {
    const info = {};
    _.each(objs, (obj, key) => {
      const msg = [];
      if (obj['concat']) {
        _.each(obj['concat'], c => {
          if (form[c] && form[c]['value']) {
            let value = form[c]['value'];
            value = value['name'] || value;
            msg.push(value);
          } else {
            msg.push(c);
          }
        });
      } else {
        msg.push(obj['name']);
      }
      info[key] = msg.join(' ');
    });
    return info;
  }

  removeMulti(index) {
    console.log(`removeMulti${index}`);
    this.formMultiTextArray.pop();
  }

  addMulti() {
    console.log(`addMulti`);
    this.formMultiTextArray.push(new FormControl());
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
    <div class="row">
      <div class="col-md-8 col-md-offset-2">
        <div *ngIf="field.showRequest">
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
                    <option [ngValue]="null" [selected]="true">{{ field.getValue(control, 'typeLabel') }}</option>
                    <option *ngFor="let t of field.getValue(control, 'fields')"
                            [ngValue]="t">{{t.name}}</option>
                  </select>
                </div>
                <div *ngIf="field.getValue(control, 'type') == 'radio'" class="form-group">
                  <label>{{field.getValue(control, 'title')}}</label>
                  <div *ngFor="let radios of field.getValue(control, 'fields')" class="radio">
                    <label>
                      <input type="radio" [value]="radios['name']"
                             formControlName="{{ control }}">
                      {{ radios['name'] }}
                    </label>
                  </div>
                </div>
                <div *ngIf="field.getValue(control, 'type') == 'checkbox'" class="form-group">
                  <label>{{field.getValue(control, 'title')}}</label>
                  <div *ngFor="let check of field.getValue(control, 'fields'); let i = index;">
                    <label class="checkbox-inline">
                      <input [formControl]="field.formCheckBoxArray[field.getValue(control, 'id')][i]"
                             type="checkbox">
                      {{ check['name'] }}
                    </label>
                  </div>
                </div>
                <div *ngIf="field.getValue(control, 'type') == 'multi-text'" class="form-group">
                  <label>{{field.getValue(control, 'title')}}</label>
                  <div *ngFor="let multi of field.formMultiTextArray; let i = index;">
                    <div class="input-group padding-bottom-10">
                      <input class="form-control" [formControl]="field.formMultiTextArray[i]"
                             type="text">
                      <span class="input-group-btn">
                                            <a *ngIf="!field.loading" (click)="field.removeMulti(i)"
                                               class="fa fa-minus-circle btn text-20 pull-right btn-danger"></a>
                                        </span>
                    </div>
                  </div>
                  <div>
                    <div class="padding-bottom-10">
                      <a (click)="field.addMulti()"
                         class="fa fa-plus-circle btn text-20 pull-right btn-success"></a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="alert alert-danger" *ngIf="field.formError">
                <h4>{{ field.errorRequest }}</h4>
                <p *ngIf="field.errorMessage">{{field.errorMessage}}</p>
                <ul>
                  <li *ngFor="let v of field.validations">{{ v }}</li>
                </ul>
              </div>
              <div class="alert alert-warning alert-dismissible show">
                <strong>{{ field.warning }}</strong> {{ field.warningRequest }}
                <button type="button" class="close" data-dismiss="alert">&times;</button>
              </div>
              <button *ngIf="!field.loading" class="btn btn-primary"
                      (click)="field.validate()"
                      type="submit" form="ngForm">{{ field.requestLabel }}
              </button>
              <div *ngIf="field.loading">
                {{ field.requestingMessage }}
              </div>
              <div class="row"><br/></div>
            </form>
          </div>
          <div class="row">
            <div *ngIf="field.requestSent">
              <p>{{ field.requestSuccess }}</p>
              <p>{{ field.requestNextAction }}</p>
              <p *ngIf="field.requestNumber">
                <a href="{{ field.workspaceLocation }}" target="_blank"
                   rel="noopener noreferrer">{{ field.requestNumber }}</a>
              </p>
            </div>
          </div>
          <div class="row">
            <br/><br/>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="modalCreatingRequest" tabindex="-1" role="dialog"
         aria-labelledby="exampleModalCenterTitle" aria-hidden="true"
         data-backdrop="static" data-keyboard="false">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <img class="center-block" src="/images/loading.svg" alt="{{ field.requestingMessage }}">
            <br/>
            <div class="text-center">{{ field.requestingMessage }}</div>
          </div>
        </div>
      </div>
    </div>
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
