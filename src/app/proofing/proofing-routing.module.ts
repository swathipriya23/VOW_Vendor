import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProofingMasterComponent } from './proofing-master/proofing-master.component';
import { ProofingMapComponent } from './proofing-map/proofing-map.component';
import { TemplateCreateComponent } from './template-create/template-create.component';
import { ProofingUploadComponent} from './proofing-upload/proofing-upload.component'
import { TemplateEditComponent } from  './template-edit/template-edit.component';
import { CreateAccountComponent } from './create-account/create-account.component';
// import { CreateAccountComponent } from '../create-account/create-account.component';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { AgingReportComponent } from './aging-report/aging-report.component';

const routes: Routes = [
  {
  path: '', canActivate: [CanActivateGuardService],
  children: [
  { path: 'ProofingMaster', component: ProofingMasterComponent },
  { path:'ProofingMap',component:ProofingMapComponent},
  { path:'templateadd',component:TemplateCreateComponent},
  { path:'ProofingUpload',component:ProofingUploadComponent},
  { path:'templateedit',component:TemplateEditComponent},
  { path:'accountcreate',component:CreateAccountComponent},
  // { path:'accountedit',component:CreateAccountComponent},
  {path:'ar',component:AgingReportComponent}
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProofingRoutingModule { }
