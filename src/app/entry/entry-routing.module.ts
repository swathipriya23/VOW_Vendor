import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { EntryMasterComponent } from './entry-master/entry-master.component';
import { EntryServiceComponent } from './entry-service/entry-service.component';


const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
      { path: "entrymaster", component: EntryMasterComponent},
      { path: "entry", component: EntryServiceComponent},
    ]
  }
];
    
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntryRoutingModule { }
