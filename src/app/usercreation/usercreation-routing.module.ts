import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';

import { UserSummaryComponent } from './user-summary/user-summary.component';
import { UserCreationComponent } from './user-creation/user-creation.component';


const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
      { path: 'usersummary', component: UserSummaryComponent },
      { path: 'usercreation', component: UserCreationComponent}
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsercreationRoutingModule { }
