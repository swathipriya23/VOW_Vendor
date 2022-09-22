import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { DssSummaryComponent } from './dss-summary/dss-summary.component';
import { DssMasterComponent } from './dss-master/dss-master.component';
const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
     {path: 'dssreport', component: DssSummaryComponent},
     {path: 'dssmaster', component: DssMasterComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DssRoutingModule { }
