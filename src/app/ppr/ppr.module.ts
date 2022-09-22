import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PprRoutingModule } from './ppr-routing.module';
import { PprSummaryComponent } from './ppr-summary/ppr-summary.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PprViewComponent } from './ppr-view/ppr-view.component';
import { BudgetBuilderComponent } from './budget-builder/budget-builder.component';
import { CostAllocationComponent } from './cost-allocation/cost-allocation.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { CostTransactionComponent } from './cost-transaction/cost-transaction.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'

import { VarianceAnalysisComponent } from './variance-analysis/variance-analysis.component';
import { PprLevelComponent } from './ppr-level/ppr-level.component';
import { EmployeeBusinessMappingComponent } from './employee-business-mapping/employee-business-mapping.component';
import { BudgetBuilderApproveComponent } from './budget-builder-approve/budget-builder-approve.component';
import { BudgetBuilderViewerComponent } from './budget-builder-viewer/budget-builder-viewer.component';
import { BudgetBuilderCheckerComponent } from './budget-builder-checker/budget-builder-checker.component';
import { PprActiveClientComponent } from './ppr-active-client/ppr-active-client.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { DssReportComponent } from './dss-report/dss-report.component';
import { PprSourcesComponent } from './ppr-sources/ppr-sources.component';
import { HeadGroupsComponent } from './head-groups/head-groups.component';
import { GlSubgroupComponent } from './gl-subgroup/gl-subgroup.component';
import { SubGroupsComponent } from './sub-groups/sub-groups.component';
import { ExpensegrpLevelMappingComponent } from './expensegrp-level-mapping/expensegrp-level-mapping.component';
import { PprReportComponent } from './ppr-report/ppr-report.component';
@NgModule({
  declarations: [PprSummaryComponent, PprViewComponent, BudgetBuilderComponent, CostAllocationComponent, CostTransactionComponent, VarianceAnalysisComponent, PprLevelComponent, EmployeeBusinessMappingComponent, BudgetBuilderApproveComponent, BudgetBuilderViewerComponent, BudgetBuilderCheckerComponent, PprActiveClientComponent, DssReportComponent, PprSourcesComponent, HeadGroupsComponent, GlSubgroupComponent, SubGroupsComponent, ExpensegrpLevelMappingComponent, PprReportComponent],
  imports: [
    NgxPaginationModule,
    PprRoutingModule,
    NgbModule,
    SharedModule,MaterialModule,
   PdfViewerModule,
   MatSlideToggleModule,
   MatDatepickerModule,
   MatInputModule,
   MatNativeDateModule
  ],
  // entryComponents: [DialogApplicationDetails],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // providers: [DialogApplicationDetails],
  // bootstrap:[DialogApplicationDetails],
})
export class PprModule { }
