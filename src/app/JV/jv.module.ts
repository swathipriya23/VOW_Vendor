import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { ToastrModule } from 'ngx-toastr';
import { JVComponent } from './jv/jv.component';
import { JvCreationComponent } from './jv-creation/jv-creation.component';
import {JvRoutingModule} from './jv-routing.module';
import { JvSummaryComponent } from './jv-summary/jv-summary.component';
import { JvApprovalSummaryComponent } from './jv-approval-summary/jv-approval-summary.component';
import { JvApprovalviewComponent } from './jv-approvalview/jv-approvalview.component'
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { JvUploadComponent } from './jv-upload/jv-upload.component';
import { JvsummaryViewComponent } from './jvsummary-view/jvsummary-view.component';


@NgModule({
  declarations: [JVComponent,JvCreationComponent, JvSummaryComponent, JvApprovalSummaryComponent, JvApprovalviewComponent, JvUploadComponent, JvsummaryViewComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    ToastrModule,
    JvRoutingModule,
    PdfViewerModule
    

  ]
})
export class JvModule { }
