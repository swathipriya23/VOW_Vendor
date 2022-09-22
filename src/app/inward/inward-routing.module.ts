import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourierComponent } from '../inward/courier/courier.component';
import { ChannelComponent } from '../inward/channel/channel.component';
import { DocumentComponent } from '../inward/document/document.component';
import { InwardSummaryComponent } from '../inward/inward-summary/inward-summary.component';
import { InwardMasterComponent } from '../inward/inward-master/inward-master.component';
import { InwardFormComponent } from '../inward/inward-form/inward-form.component';
import { InwardDetailsComponent } from '../inward/inward-details/inward-details.component';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { ChannelEditComponent } from './channel-edit/channel-edit.component';
import { DocumentEditComponent } from './document-edit/document-edit.component';
import { CourierEditComponent } from './courier-edit/courier-edit.component';

const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
  { path: 'inwardcourier', component: CourierComponent },
  { path: 'inwardchannel', component: ChannelComponent },
  { path: 'inwarddocument', component: DocumentComponent },
  { path: 'inward', component: InwardSummaryComponent },
  { path: 'inwardMaster', component: InwardMasterComponent },

  { path: 'inwardForm', component: InwardFormComponent },
  { path: 'inwardDetailView', component: InwardDetailsComponent },
  { path: 'channelEdit', component: ChannelEditComponent },
  { path: 'documentEdit', component: DocumentEditComponent },
  { path: 'courierEdit', component: CourierEditComponent },
]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InwardRoutingModule { }
