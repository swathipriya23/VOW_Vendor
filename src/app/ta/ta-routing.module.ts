import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaMasterComponent } from './ta-master/ta-master.component';
import {OnbehalfSummaryComponent} from'./onbehalf-summary/onbehalf-summary.component';
import{TamakerCreateComponent} from'./tamaker-create/tamaker-create.component';
import{TamakerSummaryComponent} from'./tamaker-summary/tamaker-summary.component';
import{AdvanceMakerComponent} from './advance-maker/advance-maker.component';
import {AdvancemakerSummaryComponent} from './advancemaker-summary/advancemaker-summary.component'
import{ApproveSummaryComponent}from './approve-summary/approve-summary.component';
import{AdvanceApprovalComponent}from './advance-approval/advance-approval.component'
import{AdvanceApproviewComponent}from './advance-approview/advance-approview.component'
import{PackingExpenceComponent}from './packing-expence/packing-expence.component'
import{IncidentalExpenceComponent}from './incidental-expence/incidental-expence.component'
import{TravelingExpenceComponent}from'./traveling-expence/traveling-expence.component'
import{ExpenceEditComponent} from './expence-edit/expence-edit.component'
import { ExpenceapproveEditComponent } from './expenceapprove-edit/expenceapprove-edit.component';
import { DeputationExpenceComponent } from './deputation-expence/deputation-expence.component';
import{LocalconveyanceExpenseComponent} from './localconveyance-expense/localconveyance-expense.component'
import{DailydiemExpenceComponent}from './dailydiem-expence/dailydiem-expence.component'
import{MiscellaneousExpenceComponent}from './miscellaneous-expence/miscellaneous-expence.component'
import{LodgingExpenceComponent}from'./lodging-expence/lodging-expence.component'
import{ExpensemakerSummaryComponent}from './expensemaker-summary/expensemaker-summary.component'
import{CanceladdSummaryComponent}from './canceladd-summary/canceladd-summary.component'
import{CancelapprovalSummaryComponent}from './cancelapproval-summary/cancelapproval-summary.component'
import {TaTransactionSummaryComponent} from './ta-transaction-summary/ta-transaction-summary.component'
import {TaReportComponent} from './ta-report/ta-report.component'
import { HolidaydiemSummaryComponent } from './holidaydiem-summary/holidaydiem-summary.component';
import { GradeeligibilityMasterComponent } from './gradeeligibility-master/gradeeligibility-master.component'
import { CommondropdownMasterComponent } from './commondropdown-master/commondropdown-master.component'
import { CommondropdowndetailMasterComponent } from './commondropdowndetail-master/commondropdowndetail-master.component'
import { TourReportComponent } from './tour-report/tour-report.component'
import { EmployeeTourReportComponent } from './employee-tour-report/employee-tour-report.component'
import { EclaimBillConsolidateComponent } from './eclaim-bill-consolidate/eclaim-bill-consolidate.component'
import { BranchwisePendingReportComponent } from './branchwise-pending-report/branchwise-pending-report.component'
import { ReportComponent } from './report/report.component'
import { ReportTourDetailComponent } from './report-tour-detail/report-tour-detail.component'
import { ReportTourExpenseComponent } from './report-tour-expense/report-tour-expense.component';
import { ReportTourAdvanceComponent } from './report-tour-advance/report-tour-advance.component';
import { DateRelaxationMasterComponent } from './date-relaxation-master/date-relaxation-master.component';
import {TourapprovalViewComponent} from './tourapproval-view/tourapproval-view.component';
import {TourapprovalSummaryComponent} from './tourapproval-summary/tourapproval-summary.component';
import { TourmakerSummaryComponent } from './tourmaker-summary/tourmaker-summary.component'
import { AdvanceapprovalSummaryComponent } from './advanceapproval-summary/advanceapproval-summary.component';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { ExpenseapprovalSummaryComponent } from './expenseapproval-summary/expenseapproval-summary.component';
import { CancelmakerSummaryComponent } from './cancelmaker-summary/cancelmaker-summary.component';

import { TaRecoveryComponent } from './ta-recovery/ta-recovery.component';
import { AssignApproverComponent } from './assign-approver/assign-approver.component';
import { TamakerEditComponent } from './tamaker-edit/tamaker-edit.component';
const routes: Routes = [ 
  {
  path: '', canActivate: [CanActivateGuardService],
  children: [
   
    { path:"ta_approve", component: TourapprovalSummaryComponent },
    { path:"ta_master", component: TaMasterComponent },
    { path:"ta_summary", component: TaTransactionSummaryComponent },
    { path:"ta_report", component: TaReportComponent },
    { path:"onbehalf",component: OnbehalfSummaryComponent},
    {path:"tourmaker",component:TamakerCreateComponent},
    {path:"touradmin",component:TamakerEditComponent},
    {path:"summary",component:TamakerSummaryComponent},
    {path:"advancemaker",component:AdvanceMakerComponent},
    {path:"advancemaker-summary",component:AdvancemakerSummaryComponent },
    {path:"approve-summary",component:AdvanceapprovalSummaryComponent },
    {path:"approve",component:ApproveSummaryComponent},
    {path:"advanceedit",component:AdvanceMakerComponent},
    {path:"approview",component:AdvanceApproviewComponent},
    {path:"expense",component:PackingExpenceComponent},
    {path:"travel",component:TravelingExpenceComponent},
    {path:"inci",component:IncidentalExpenceComponent},
    {path:"exedit",component:ExpenceEditComponent},
    {path:"expense-summary",component:ExpensemakerSummaryComponent},
    {path:"exapprove-edit",component:ExpenceapproveEditComponent},
    {path:"local",component:LocalconveyanceExpenseComponent},
    {path:"pack",component:PackingExpenceComponent},
    {path:"daily",component:DailydiemExpenceComponent},
    {path:"misc",component:MiscellaneousExpenceComponent},
    {path:"deput",component:DeputationExpenceComponent},
    {path:"lodge",component:LodgingExpenceComponent},
    {path:"expensesummary",component:ExpensemakerSummaryComponent},
    {path:"cancelmaker",component:CancelmakerSummaryComponent},
    {path:"canceladd",component:CanceladdSummaryComponent},
    {path:"cancelapprove",component:CancelapprovalSummaryComponent},
    {path:"holidaydiemsummary",component:HolidaydiemSummaryComponent},
   {path:"gradeeligibility",component:GradeeligibilityMasterComponent},
   {path:"commondropdown",component:CommondropdownMasterComponent},
   {path:"commondropdowndetail",component:CommondropdowndetailMasterComponent},
   {path:"tourreport",component:TourReportComponent},
   {path:"employeereport",component:EmployeeTourReportComponent},
   {path:"consolidatereport",component:EclaimBillConsolidateComponent},
   {path:"branchwisereport",component:BranchwisePendingReportComponent},
   {path:"tareports",component:ReportComponent},
   {path:"reporttourdetail",component:ReportTourDetailComponent},
   {path:"reporttourexpense",component:ReportTourExpenseComponent},
   {path:"reporttouradvance",component:ReportTourAdvanceComponent},
   {path:"daterelaxation",component:DateRelaxationMasterComponent},
   {path:"tourapproveview",component:TourapprovalViewComponent},
   {path:"toursummary",component:TourmakerSummaryComponent},
   {path:"expense-approval",component:ExpenseapprovalSummaryComponent},
   {path:"ta-recovery",component:TaRecoveryComponent},
   {path:"assign-approver",component:AssignApproverComponent}


  ]
}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TARoutingModule { }