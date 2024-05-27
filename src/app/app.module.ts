import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { GridsterModule } from 'angular-gridster2';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { AddComponent } from './add/add.component';
import { CsHeader } from './additional-components/cs-header.component';
import { CsWizard } from './additional-components/cs-wizard.component';
import { CsNgInit } from './additional-components/init';
import { BarchartComponent } from './additional-components/cs-barChart.component';
import { GridsterComponent } from './additional-components/gridster.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    ViewComponent,
    AddComponent,
    CsHeader,
    CsWizard,
    CsNgInit,
    BarchartComponent,
    GridsterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    GridsterModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
