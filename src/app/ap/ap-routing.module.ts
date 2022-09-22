import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { InwardsummaryComponent } from './inwardsummary/inwardsummary.component';
import { ApHeaderComponent } from './ap-header/ap-header.component';
import { InvoiceHeaderSummaryComponent } from './invoice-header-summary/invoice-header-summary.component';
import { InvDetailViewComponent } from './inv-detail-view/inv-detail-view.component';
import { EmployeeQueryComponent } from './employee-query/employee-query.component';
import { EmpQryInvComponent } from './emp-qry-inv/emp-qry-inv.component';
import { ApComponent } from './ap/ap.component';
import { MakersummaryComponent } from './makersummary/makersummary.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { RejectsummaryComponent } from './rejectsummary/rejectsummary.component';
import { PreparepaymentComponent } from './preparepayment/preparepayment.component';
import { PaymentfileComponent } from './paymentfile/paymentfile.component';
import { BouncedetailComponent } from './bouncedetail/bouncedetail.component';
import { BouncesummaryComponent } from './bouncesummary/bouncesummary.component';
import { CommonApSummaryComponent } from './common-ap-summary/common-ap-summary.component';
import { ApHeaderSummaryComponent } from './ap-header-summary/ap-header-summary.component';
import { ApprovescreenComponent } from './approvescreen/approvescreen.component';
import { FailedTransactionComponent } from './failed-transaction/failed-transaction.component';
import { ApprovemailviewComponent } from './approvemailview/approvemailview.component';
// import { SftpComponent } from './sftp/sftp.component';
import { SFTPNewComponent } from './sftp-new/sftp-new.component';
const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
      {path: '', component: ApComponent ,canActivate:[CanActivateGuardService]},
      { path: 'apsummary', component: InwardsummaryComponent ,canActivate:[CanActivateGuardService]  },
      { path: 'apHeader', component: ApHeaderComponent,canActivate:[CanActivateGuardService]  },
      // { path: 'invoiceMaker', component: InvoiceMakerComponent },
      // { path: 'invoiceMakerSummary', component: InvoiceMakerSummaryComponent },
      { path: 'invoiceHeaderSummary', component: InvoiceHeaderSummaryComponent,canActivate:[CanActivateGuardService]  },
      { path: 'invDetailView', component: InvDetailViewComponent ,canActivate:[CanActivateGuardService] },
      { path: 'ap_employeequery', component: EmployeeQueryComponent,canActivate:[CanActivateGuardService]  },
      { path: 'empqryinv', component: EmpQryInvComponent,canActivate:[CanActivateGuardService]  },
      {path: 'ap', component: ApComponent ,canActivate:[CanActivateGuardService]},
      {path: 'makersummary', component: MakersummaryComponent ,canActivate:[CanActivateGuardService]},
      {path: 'paymentfile', component: PaymentfileComponent ,canActivate:[CanActivateGuardService]},
      {path: 'preparepayment', component: PreparepaymentComponent ,canActivate:[CanActivateGuardService]},
      {path: 'rejectsummary', component: RejectsummaryComponent ,canActivate:[CanActivateGuardService]},
      {path: 'bouncedetail', component: BouncedetailComponent ,canActivate:[CanActivateGuardService]},
      {path: 'bouncesummary', component: BouncesummaryComponent ,canActivate:[CanActivateGuardService]},
      {path: 'checklist', component: ChecklistComponent ,canActivate:[CanActivateGuardService]},
      {path: 'commonsummary', component: CommonApSummaryComponent ,canActivate:[CanActivateGuardService]},
      {path: 'apHeaderSummary', component: ApHeaderSummaryComponent,canActivate:[CanActivateGuardService]},
      {path: 'approvescreen', component: ApprovescreenComponent,canActivate:[CanActivateGuardService]},
      {path: 'failed-transaction', component: FailedTransactionComponent,canActivate:[CanActivateGuardService]},
      {path: 'approvemailview', component: ApprovemailviewComponent,canActivate:[CanActivateGuardService]},
      {path: 'sftp', component: SFTPNewComponent,canActivate:[CanActivateGuardService]},

    ]
  }]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApRoutingModule { }
