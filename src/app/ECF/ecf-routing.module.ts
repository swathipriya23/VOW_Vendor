import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import{EcfSummaryComponent} from './ecf-summary/ecf-summary.component';
import { EcfapprovalSummaryComponent } from'./ecfapproval-summary/ecfapproval-summary.component';
import { ApproverheaderViewComponent } from './approverheader-view/approverheader-view.component'
import { ApproverinvoicedetailViewComponent } from './approverinvoicedetail-view/approverinvoicedetail-view.component'
import { EcfsummaryViewComponent } from './ecfsummary-view/ecfsummary-view.component'
import { EcfsummaryinvdetailViewComponent } from './ecfsummaryinvdetail-view/ecfsummaryinvdetail-view.component';
import { EcfInventoryComponent } from './ecf-inventory/ecf-inventory.component'
import { EcfComponent } from './ecf/ecf.component';
import { MailviewComponent } from './mailview/mailview.component';


const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
  {path: 'ecfsummary', component: EcfSummaryComponent ,canActivate:[CanActivateGuardService] },
  {path:'ecfapproval',component:EcfapprovalSummaryComponent ,canActivate:[CanActivateGuardService]},
  {path:'headerview',component:ApproverheaderViewComponent ,canActivate:[CanActivateGuardService]},
  {path:'invoicedetailview',component:ApproverinvoicedetailViewComponent ,canActivate:[CanActivateGuardService]},
  {path:'summaryview',component:EcfsummaryViewComponent ,canActivate:[CanActivateGuardService]},
  {path:'invdtlsummaryview',component:EcfsummaryinvdetailViewComponent ,canActivate:[CanActivateGuardService]},
  {path:'inventory',component:EcfInventoryComponent ,canActivate:[CanActivateGuardService]},
  {path: 'ecf', component: EcfComponent ,canActivate:[CanActivateGuardService]},
  {path: 'ecfView', component: MailviewComponent ,canActivate:[CanActivateGuardService]}
]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
 
})
export class EcfRoutingModule { }
