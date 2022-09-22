import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { ApRoutingModule } from './ap-routing.module';
import { InwardsummaryComponent } from './inwardsummary/inwardsummary.component';
import { ApHeaderComponent } from './ap-header/ap-header.component';
import { InvoiceHeaderSummaryComponent } from './invoice-header-summary/invoice-header-summary.component';
import { InvDetailViewComponent } from './inv-detail-view/inv-detail-view.component';
import { EmployeeQueryComponent } from './employee-query/employee-query.component';
import { EmpQryInvComponent } from './emp-qry-inv/emp-qry-inv.component';
import { ApComponent } from './ap/ap.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { BouncedetailComponent } from './bouncedetail/bouncedetail.component';
import { BouncesummaryComponent } from './bouncesummary/bouncesummary.component';
import { MakersummaryComponent } from './makersummary/makersummary.component';
import { PaymentfileComponent } from './paymentfile/paymentfile.component';
import { PreparepaymentComponent } from './preparepayment/preparepayment.component';
import { RejectsummaryComponent } from './rejectsummary/rejectsummary.component';
import { CommonApSummaryComponent } from './common-ap-summary/common-ap-summary.component';
import { ApHeaderSummaryComponent } from './ap-header-summary/ap-header-summary.component';
import { ApprovescreenComponent } from './approvescreen/approvescreen.component';
import { FailedTransactionComponent } from './failed-transaction/failed-transaction.component';
import { ApprovemailviewComponent } from './approvemailview/approvemailview.component';
// import { SftpComponent } from './sftp/sftp.component';
import { SFTPNewComponent } from './sftp-new/sftp-new.component';

@NgModule({
  declarations: [InwardsummaryComponent, ApHeaderComponent, InvoiceHeaderSummaryComponent,
     InvDetailViewComponent,EmployeeQueryComponent, EmpQryInvComponent, ApComponent,
      ChecklistComponent, BouncedetailComponent, BouncesummaryComponent, MakersummaryComponent,
       PaymentfileComponent, PreparepaymentComponent, RejectsummaryComponent, CommonApSummaryComponent,ApHeaderSummaryComponent, 
       ApprovescreenComponent, FailedTransactionComponent, ApprovemailviewComponent, SFTPNewComponent],
  imports: [
    CommonModule,
    ApRoutingModule,
    SharedModule,
    MaterialModule,
    ToastrModule,
    PdfViewerModule
  ]
})
export class ApModule { }
