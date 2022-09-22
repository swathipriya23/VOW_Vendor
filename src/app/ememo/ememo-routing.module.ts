import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { CreatePriorityComponent } from './create-priority/create-priority.component';
import { SummaryListComponent } from './mastersummary/summary-list.component';
import { MemoForwardComponent } from './memo-forward/memo-forward.component';
import { MemoMasterComponent } from './memo-master/memo-master.component';
import { MemoViewComponent } from './memo-view/memo-view.component';
import { MemoComponent } from './memo/memo.component';
import { MemoredraftComponent } from './memoredraft/memoredraft.component';
import { MemosummaryComponent } from './memosummary/memosummary.component';
import { PriorityEditComponent } from './priority-edit/priority-edit.component';

const routes: Routes = [
 { path: '',canActivate:[CanActivateGuardService],
 children:[ 
  { path: 'memosummary', component: MemosummaryComponent , canActivate:[CanActivateGuardService]},
  { path: 'memoView', component: MemoViewComponent , canActivate:[CanActivateGuardService]},
  { path: 'memoRedraft', component: MemoredraftComponent, canActivate:[CanActivateGuardService] },
  { path: 'memoForward', component: MemoForwardComponent, canActivate:[CanActivateGuardService] },
  { path: 'memocreate', component: MemoComponent, canActivate:[CanActivateGuardService] },
  { path: 'memomaster', component: SummaryListComponent, canActivate:[CanActivateGuardService] },
  { path: 'memoMaster', component: MemoMasterComponent, canActivate:[CanActivateGuardService]},
  { path: 'createPriority', component: CreatePriorityComponent, canActivate:[CanActivateGuardService]},
  { path: 'priorityEdit', component: PriorityEditComponent, canActivate:[CanActivateGuardService]}
]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmemoRoutingModule { }
