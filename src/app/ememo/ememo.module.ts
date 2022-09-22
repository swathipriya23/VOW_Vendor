import { NgModule } from '@angular/core';
import { MemoService } from "../service/memo.service";
import { MemoViewComponent } from '../ememo/memo-view/memo-view.component';
import { MemoForwardComponent } from '../ememo/memo-forward/memo-forward.component';
import { MemoComponent } from '../ememo/memo/memo.component'
import { SummaryListComponent } from '../ememo/mastersummary/summary-list.component';
// import { CreateDepartmentComponent } from '../ememo/create-department/create-department.component'
// import { MemoDepartentEditComponent } from '../ememo/memo-departent-edit/memo-departent-edit.component'
// import { CreateCategoryComponent } from '../ememo/create-category/create-category.component'
// import { MemoCategoryEditComponent } from '../ememo/memo-category-edit/memo-category-edit.component'
// import { SubcategoryCreateComponent } from '../ememo/subcategory-create/subcategory-create.component'
// import { MemoSubCategoryEditComponent } from '../ememo/memo-sub-category-edit/memo-sub-category-edit.component';
import { EmployeeDeptMapComponent } from '../ememo/employee-dept-map/employee-dept-map.component';
// import { EmployeeViewComponent } from '../ememo/employee-view/employee-view.component';
// import { DepartmentViewComponent } from '../ememo/department-view/department-view.component';
import { MemosummaryComponent } from '../ememo/memosummary/memosummary.component';
import { MemoindividualComponent } from '../ememo/memoindividual/memoindividual.component';
import { MemodeptComponent } from '../ememo/memodept/memodept.component';
import { MemoMasterComponent } from '../ememo/memo-master/memo-master.component';
import { CreatePriorityComponent } from '../ememo/create-priority/create-priority.component';
import { PriorityEditComponent } from '../ememo/priority-edit/priority-edit.component';
import { MemoredraftComponent } from '../ememo/memoredraft/memoredraft.component';
import { EmemoRoutingModule } from './ememo-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    MemoViewComponent, MemoForwardComponent, MemoComponent,
    SummaryListComponent,
    EmployeeDeptMapComponent,
    MemosummaryComponent,
    MemoindividualComponent,
    MemodeptComponent,
    MemoMasterComponent,
    CreatePriorityComponent,
    PriorityEditComponent,
    MemoredraftComponent,
  ],
  imports: [
    EmemoRoutingModule,SharedModule,MaterialModule
  ],
  providers: [MemoService],
  entryComponents: [MemoindividualComponent, MemodeptComponent],
})
export class EmemoModule { }
