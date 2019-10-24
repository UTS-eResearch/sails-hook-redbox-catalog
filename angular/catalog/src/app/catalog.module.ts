import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {SharedModule} from './shared/shared.module';
import {RequestBoxComponent, KeysPipe} from './components/request-box.component';
import {CatalogFormComponent} from './catalog-form.component';
import {CatalogService} from './catalog.service';
import {CatalogDisplayComponent} from './components/catalog-display.component';

@NgModule({
  imports: [
    BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, SharedModule
  ],
  declarations: [
    CatalogFormComponent, RequestBoxComponent, CatalogDisplayComponent, KeysPipe
  ],
  exports: [],
  providers: [
    CatalogService
  ],
  bootstrap: [
    CatalogFormComponent
  ],
  entryComponents: [
    RequestBoxComponent, CatalogDisplayComponent
  ]
})
export class CatalogModule {
}
