import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PprSummaryComponent } from './ppr-summary/ppr-summary.component';
import { PprViewComponent } from './ppr-view/ppr-view.component';
import { CostAllocationComponent } from './cost-allocation/cost-allocation.component'

import { CanActivateGuardService } from '../can-activate-guard.service';
import { CostTransactionComponent } from './cost-transaction/cost-transaction.component';
import { VarianceAnalysisComponent } from './variance-analysis/variance-analysis.component';
import { PprLevelComponent } from './ppr-level/ppr-level.component';
import { EmployeeBusinessMappingComponent } from './employee-business-mapping/employee-business-mapping.component';
import { BudgetBuilderApproveComponent } from './budget-builder-approve/budget-builder-approve.component';
import { BudgetBuilderViewerComponent } from './budget-builder-viewer/budget-builder-viewer.component';
import { BudgetBuilderCheckerComponent } from './budget-builder-checker/budget-builder-checker.component';
import { PprActiveClientComponent } from './ppr-active-client/ppr-active-client.component';
import { DssReportComponent } from './dss-report/dss-report.component';
import { PprSourcesComponent } from './ppr-sources/ppr-sources.component';
import { HeadGroupsComponent } from './head-groups/head-groups.component';
import { GlSubgroupComponent } from './gl-subgroup/gl-subgroup.component';
import { SubGroupsComponent } from './sub-groups/sub-groups.component';

const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
      { path: 'pprreport', component: PprSummaryComponent },
      { path: 'Pprview', component: PprViewComponent },
      { path: 'CAC', component: CostAllocationComponent },
      { path: 'ctc',component:CostTransactionComponent },
      {path:'VarianceAnalysis',component:VarianceAnalysisComponent},
      {path:'Plc',component:PprLevelComponent},
      {path:"empbsmapping",component:EmployeeBusinessMappingComponent},
      {path:'budgetapprover',component:BudgetBuilderApproveComponent},
      {path:'budgetreviewer',component:BudgetBuilderViewerComponent},
      {path:'budgetchecker',component:BudgetBuilderCheckerComponent},
      {path:'pac',component:PprActiveClientComponent},
      {path:'dss',component:DssReportComponent},
      {path:'pprsources',component:PprSourcesComponent},
      {path:'headgroup',component:HeadGroupsComponent},
      {path:'glsubgroup',component:GlSubgroupComponent},
      {path:'subgroup',component:SubGroupsComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PprRoutingModule { }
