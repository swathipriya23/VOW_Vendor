import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DssRoutingModule } from './dss-routing.module';
import { DssSummaryComponent } from './dss-summary/dss-summary.component';
import { DssReportComponent } from './dss-report/dss-report.component';
import { DssMasterComponent } from './dss-master/dss-master.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material/material.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SubGroupsComponent } from './sub-groups/sub-groups.component';
import { SourceComponent } from './source/source.component';
import { HeadGroupsComponent } from './head-groups/head-groups.component';
import { GlSubgroupComponent } from './gl-subgroup/gl-subgroup.component';




@NgModule({
  declarations: [DssSummaryComponent, DssReportComponent, DssMasterComponent,SubGroupsComponent, SourceComponent, HeadGroupsComponent, GlSubgroupComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DssRoutingModule,
    NgxPaginationModule,
    NgbModule,
    MaterialModule,
    PdfViewerModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DssModule { }
