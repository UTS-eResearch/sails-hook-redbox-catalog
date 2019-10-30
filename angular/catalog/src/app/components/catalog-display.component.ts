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
export class CatalogDisplayField extends FieldBase<any> {

  loading: boolean;
  isLoaded: boolean;

  boxTitleLabel: string;


  requestLabel: string;
  errorMessage: boolean = false;
  requestError: string;
  requestSuccess: string;
  requestNextAction: string;
  catalogHelp: string;

  owner: string;
  ownerEmail: string;
  supervisor: string;
  dataManager: object;
  ci: object;
  requestSent: boolean = false;
  type: object[];
  rdmp: string;
  projectInfo: any = {
    id: null,
    title: null,
    ci: null,
    dm: null,
    retention: null,
    projectStart: null,
    projectEnd: null
  };

  catalogService: CatalogService;

  valid: any;
  formError: boolean = false;
  validations: any = [];

  services: any = [];
  showCatalog: boolean = true;

  @Output() requestBox: EventEmitter<any> = new EventEmitter<any>();

  constructor(options: any, injector: any) {
    super(options, injector);
    this.catalogService = this.getFromInjector(CatalogService);
    this.catalogHelp = options['catalogHelp'] || 'For help email:<>';
    this.boxTitleLabel = options['boxTitleLabel'] || 'Title';
    this.requestLabel = options['requestLabel'] || 'Request';
    this.requestError = options['requestError'] || 'Request Error';
    this.requestSuccess = options['requestSuccess'] || 'Request Success';
    this.requestNextAction = options['requestNextAction'] || 'Request Next Action';
    this.valid = options['valid'] || {};
    this.services = options['services'] || [];
  }

  init() {
    this.rdmp = this.fieldMap._rootComp.rdmp;
    this.setRDMPInfo();
  }

  registerEvents() {
    this.fieldMap['RequestBox'].field['catalog'].subscribe(this.enableCatalog.bind(this));
  }

  createRequest(serviceId) {
    this.showCatalog = false;
    const selectedService = _.find(this.services, {id: serviceId});
    this.requestBox.emit({service: selectedService, project: this.projectInfo});
  }

  enableCatalog() {
    console.log('enable catalog');
    this.showCatalog = true;
  }

  async setRDMPInfo() {
    const rdmpInfo = await this.catalogService.getRDMPInfo(this.rdmp);
    const recordMeta = rdmpInfo.recordMetadata;
    this.projectInfo = {
      id: this.rdmp,
      title: recordMeta['title'],
      ci: recordMeta['contributor_ci'],
      dm: recordMeta['contributor_data_manager'],
      retention: recordMeta['redbox:retentionPeriod_dc:date'],
      projectStart: recordMeta['dc:coverage_vivo:DateTimeInterval_vivo:start'],
      projectEnd: recordMeta['dc:coverage_vivo:DateTimeInterval_vivo:end'],
      projectHdr: recordMeta['project-hdr'],
    };
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
  selector: 'ws-catalogdisplay',
  styles: ['.service { box-shadow: 1px 2px 4px grey;  padding: 12px;  margin: 5px; height: 340px;}'],
  template: `
      <div class="row">
          <br/>
      </div>
      <div class="row">
          <div class="alert alert-info">
              <h4><strong>{{ field.boxTitleLabel }}</strong></h4>
              <h4>{{ field.projectInfo['title'] || ''}}</h4>
          </div>
      </div>
      <div class="row">
          <br/>
      </div>
      <div *ngIf="field.showCatalog">
          <div class="row">
              <h4>Select a service for your data management plan</h4>
              <div class="col-lg-4 col-md-5 col-sm-6 col-xs-12" *ngFor="let s of field.services">
                  <div class="card service" style="width: 30rem;">
                      <img class="card-img-top" src="/angular/catalog/{{ s.logo }}" alt="{{ s.name }}">
                      <div class="card-body">
                          <h5 class="card-title" style="margin-top: 1px"><span *ngIf="s.displayName">{{ s.name }}</span>
                          </h5>
                          <p class="card-text">{{ s.desc }}</p>
                          <a (click)="field.createRequest(s.id)" class="btn btn-primary">{{ s.requestButton }}</a>
                      </div>
                  </div>
                  <br/>
              </div>
          </div>
          <div class="row">
              <br/>
          </div>
      </div>
  `
})
export class CatalogDisplayComponent extends SimpleComponent implements OnInit, AfterViewInit {
  field: CatalogDisplayField;

  ngOnInit() {
    this.field.init();
  }

  ngAfterViewInit() {
    this.field.registerEvents();
  }
}
