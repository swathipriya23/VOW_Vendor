import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { OverallReportEntryComponent } from './overall-report-entry/overall-report-entry.component';
import { OverallReportSummaryComponent } from './overall-report-summary/overall-report-summary.component';
import { QueryscreenComponent } from './queryscreen/queryscreen.component';
import { ReportMasterComponent } from './report-master/report-master.component';
import { VendorReportComponent } from './vendor-report/vendor-report.component';


const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
      { path: "report", component: ReportMasterComponent},
      { path: "overall_report_summary", component: OverallReportSummaryComponent},
      { path: "overall_report", component: OverallReportEntryComponent},
      { path: "vendor_report", component: VendorReportComponent},
      { path: "query", component: QueryscreenComponent},
    ]
  }
];
    
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
