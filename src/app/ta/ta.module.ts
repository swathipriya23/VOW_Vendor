import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr'
import { NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TARoutingModule } from './ta-routing.module';
import { TaMasterComponent } from './ta-master/ta-master.component';
import { TamakerCreateComponent } from './tamaker-create/tamaker-create.component';
import { TamakerEditComponent } from './tamaker-edit/tamaker-edit.component';
import { TourApprovalComponent } from './tour-approval/tour-approval.component';
import { TourapprovalViewComponent } from './tourapproval-view/tourapproval-view.component';
import { AdvanceMakerComponent } from './advance-maker/advance-maker.component';
import { AdvanceApprovalComponent } from './advance-approval/advance-approval.component';
import { ExpenceViewComponent } from './expence-view/expence-view.component';
import { ExpenceEditComponent } from './expence-edit/expence-edit.component';
import { TravelingExpenceComponent } from './traveling-expence/traveling-expence.component';
import { DailydiemExpenceComponent } from './dailydiem-expence/dailydiem-expence.component';
import { IncidentalExpenceComponent } from './incidental-expence/incidental-expence.component';
import { LodgingExpenceComponent } from './lodging-expence/lodging-expence.component';
import { PackingExpenceComponent } from './packing-expence/packing-expence.component';
import { MiscellaneousExpenceComponent } from './miscellaneous-expence/miscellaneous-expence.component';
import { ExpenceApproverComponent } from './expence-approver/expence-approver.component';
import { OnbehalfSummaryComponent } from './onbehalf-summary/onbehalf-summary.component';
import { OnbehalfMakerComponent } from './onbehalf-maker/onbehalf-maker.component';
import { TaButtonComponent } from './ta-button/ta-button.component';
import { TamakerSummaryComponent } from './tamaker-summary/tamaker-summary.component';
import { TourmakerSummaryComponent } from './tourmaker-summary/tourmaker-summary.component';
import { TourapprovalSummaryComponent } from './tourapproval-summary/tourapproval-summary.component';
import { AdvancemakerSummaryComponent } from './advancemaker-summary/advancemaker-summary.component';
import { AdvanceapprovalSummaryComponent } from './advanceapproval-summary/advanceapproval-summary.component';
import { ExpensemakerSummaryComponent } from './expensemaker-summary/expensemaker-summary.component';
import { ExpenseapprovalSummaryComponent } from './expenseapproval-summary/expenseapproval-summary.component';
import { ApproveSummaryComponent } from './approve-summary/approve-summary.component';
import { AdvanceApproviewComponent } from './advance-approview/advance-approview.component';
import { LocalconveyanceExpenseComponent } from './localconveyance-expense/localconveyance-expense.component';
import { CancelmakerSummaryComponent } from './cancelmaker-summary/cancelmaker-summary.component';
import { CancelapprovalSummaryComponent } from './cancelapproval-summary/cancelapproval-summary.component';
import { AssignApproverComponent } from './assign-approver/assign-approver.component';
import { CanceladdSummaryComponent } from './canceladd-summary/canceladd-summary.component';
import { DeputationExpenceComponent } from './deputation-expence/deputation-expence.component';
import { TaTransactionSummaryComponent } from './ta-transaction-summary/ta-transaction-summary.component';
import { TaReportComponent } from './ta-report/ta-report.component';
import { HolidaydiemSummaryComponent } from './holidaydiem-summary/holidaydiem-summary.component';
import { GradeeligibilityMasterComponent } from './gradeeligibility-master/gradeeligibility-master.component';
import { CommondropdownMasterComponent } from './commondropdown-master/commondropdown-master.component';
import { CommondropdowndetailMasterComponent } from './commondropdowndetail-master/commondropdowndetail-master.component';
import { TourReportComponent } from './tour-report/tour-report.component';
import { EmployeeTourReportComponent } from './employee-tour-report/employee-tour-report.component';
import { EclaimBillConsolidateComponent } from './eclaim-bill-consolidate/eclaim-bill-consolidate.component';
import { BranchwisePendingReportComponent } from './branchwise-pending-report/branchwise-pending-report.component';
import { ReportComponent } from './report/report.component';
import { ReportTourDetailComponent } from './report-tour-detail/report-tour-detail.component';
import { ReportTourExpenseComponent } from './report-tour-expense/report-tour-expense.component';
import { ReportTourAdvanceComponent } from './report-tour-advance/report-tour-advance.component';
import { DateRelaxationMasterComponent } from './date-relaxation-master/date-relaxation-master.component';
import { ExpenceapproveEditComponent } from './expenceapprove-edit/expenceapprove-edit.component';
import { OnbehalfMasterComponent } from './onbehalf-master/onbehalf-master.component';
import { ClaimAllowanceMasterComponent } from './claim-allowance-master/claim-allowance-master.component';
import { TaRecoveryComponent } from './ta-recovery/ta-recovery.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { TraveladminSummaryComponent } from './traveladmin-summary/traveladmin-summary.component';
import { ChatComponent } from './chat/chat.component';
import { AlltoursummaryComponent } from './alltoursummary/alltoursummary.component';
import { CityMasterComponent } from './city-master/city-master.component';
import { HolidaymasterComponent } from './holidaymaster/holidaymaster.component';
import { TravelreasonexpenseComponent } from './travelreasonexpense/travelreasonexpense.component';
import {ClipboardModule} from '@angular/cdk/clipboard';



@NgModule({
    declarations: [TaMasterComponent, TamakerCreateComponent, TamakerEditComponent, TourApprovalComponent, TourapprovalViewComponent, AdvanceMakerComponent, AdvanceApprovalComponent, ExpenceViewComponent, ExpenceEditComponent, TravelingExpenceComponent, DailydiemExpenceComponent, IncidentalExpenceComponent, LodgingExpenceComponent, PackingExpenceComponent, MiscellaneousExpenceComponent, ExpenceApproverComponent, OnbehalfSummaryComponent, OnbehalfMakerComponent, TaButtonComponent, TamakerSummaryComponent, TourmakerSummaryComponent, TourapprovalSummaryComponent, AdvancemakerSummaryComponent, AdvanceapprovalSummaryComponent, ExpensemakerSummaryComponent, ExpenseapprovalSummaryComponent, ApproveSummaryComponent, AdvanceApproviewComponent, LocalconveyanceExpenseComponent, CancelmakerSummaryComponent, CancelapprovalSummaryComponent, AssignApproverComponent, CanceladdSummaryComponent, TaTransactionSummaryComponent, TaReportComponent,HolidaydiemSummaryComponent, GradeeligibilityMasterComponent, CommondropdownMasterComponent, CommondropdowndetailMasterComponent, TourReportComponent, EmployeeTourReportComponent, EclaimBillConsolidateComponent, BranchwisePendingReportComponent, ReportComponent, ReportTourDetailComponent, ReportTourExpenseComponent, ReportTourAdvanceComponent, DateRelaxationMasterComponent,DeputationExpenceComponent, ExpenceapproveEditComponent, OnbehalfMasterComponent, ClaimAllowanceMasterComponent, TaRecoveryComponent, TraveladminSummaryComponent, ChatComponent, AlltoursummaryComponent, CityMasterComponent, HolidaymasterComponent, TravelreasonexpenseComponent],
  imports: [
    ToastrModule.forRoot(),
    TARoutingModule,NgxMaterialTimepickerModule,ClipboardModule,
    SharedModule,
    MaterialModule,
    PdfViewerModule
  ],
  providers:[],
  bootstrap:[TaMasterComponent],
  entryComponents:[OnbehalfMakerComponent]
})
export class TAModule { }