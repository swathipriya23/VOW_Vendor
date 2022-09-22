import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { OverallReportSummaryComponent } from './overall-report-summary/overall-report-summary.component';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { OverallReportEntryComponent } from './overall-report-entry/overall-report-entry.component';
import { ReportMasterComponent } from './report-master/report-master.component';
import { VendorReportComponent } from './vendor-report/vendor-report.component';
import { QueryscreenComponent } from './queryscreen/queryscreen.component';

@NgModule({
  declarations: [OverallReportSummaryComponent, OverallReportEntryComponent, ReportMasterComponent, VendorReportComponent, QueryscreenComponent],
  imports: [
    ToastrModule.forRoot({ timeOut: 10000 }),
    CommonModule, ReportRoutingModule, SharedModule, MaterialModule,PdfViewerModule
  ]
})

export class ReportModule { }
