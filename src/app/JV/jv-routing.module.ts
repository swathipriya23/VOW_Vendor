import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { JVComponent } from './jv/jv.component';
import { JvCreationComponent } from './jv-creation/jv-creation.component';
import {JvSummaryComponent} from './jv-summary/jv-summary.component';
import { JvApprovalSummaryComponent } from './jv-approval-summary/jv-approval-summary.component';
import { JvApprovalviewComponent } from './jv-approvalview/jv-approvalview.component'
import { JvUploadComponent } from './jv-upload/jv-upload.component';
import { JvsummaryViewComponent } from './jvsummary-view/jvsummary-view.component';



const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
     {path:'jvsummary',component:JVComponent,canActivate:[CanActivateGuardService]},
     {path:'jvcreate',component:JvSummaryComponent,canActivate:[CanActivateGuardService]},
     {path:'jvapproval',component:JvApprovalSummaryComponent,canActivate:[CanActivateGuardService]},
     {path:'addjv',component:JvCreationComponent,canActivate:[CanActivateGuardService]},
     {path:'jvview',component:JvApprovalviewComponent,canActivate:[CanActivateGuardService]},
     {path:'jvupload',component:JvUploadComponent,canActivate:[CanActivateGuardService]},
     {path:'jvsummaryview',component:JvsummaryViewComponent,canActivate:[CanActivateGuardService]}
    ]}]





@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JvRoutingModule { }
