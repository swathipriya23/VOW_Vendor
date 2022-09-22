import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { MastermoduleRoutingModule } from './mastermodule-routing.module';
import { MasterComponent } from '../Master/master/master.component';
import { CreateCostcentreComponent } from '../Master/create-costcentre/create-costcentre.component';
import { CostcentreEditComponent } from '../Master/costcentre-edit/costcentre-edit.component';
import { CreateBusinesssegmentComponent } from '../Master/create-businesssegment/create-businesssegment.component';
import { BusinesssegmentEditComponent } from '../Master/businesssegment-edit/businesssegment-edit.component';
import { CreateCCBSComponent } from '../Master/create-ccbs/create-ccbs.component';
import { CcbsEditComponent } from '../Master/ccbs-edit/ccbs-edit.component';
import { CreateHierarchyComponent } from '../Master/create-hierarchy/create-hierarchy.component';
import { HierarchyEditComponent } from '../Master/hierarchy-edit/hierarchy-edit.component';
import { RolesEditComponent } from '../Master/roles-edit/roles-edit.component';
import {DepartmentViewComponent} from '../Master/department-view/department-view.component';
import { PermissionComponent } from '../Master/permission/permission.component';
import {EmployeeViewComponent} from '../Master/employee-view/employee-view.component';
import {CreateDepartmentComponent} from '../Master/create-department/create-department.component'
import {MemoDepartentEditComponent} from '../Master/memo-departent-edit/memo-departent-edit.component';
import {CreateCategoryComponent} from '../Master/create-category/create-category.component';
import {MemoCategoryEditComponent} from '../Master/memo-category-edit/memo-category-edit.component';
import {MemoSubCategoryEditComponent} from '../Master/memo-sub-category-edit/memo-sub-category-edit.component';
import {SubcategoryCreateComponent} from '../Master/subcategory-create/subcategory-create.component';
import { EmpDetailsCreateComponent } from './emp-details-create/emp-details-create.component';
import { EmpDetailsEditComponent } from './emp-details-edit/emp-details-edit.component';
import { CreateCityComponent } from './create-city/create-city.component';
import { EmpBankSummaryComponent } from './emp-bank-summary/emp-bank-summary.component';
import { EmpBankAddComponent } from './emp-bank-add/emp-bank-add.component';

import { CreateDesignationComponent } from './create-designation/create-designation.component';
import { DesignationEditComponent } from './designation-edit/designation-edit.component';
import { SectorCreateComponent } from './sector-create/sector-create.component';
import { SectorEditComponent } from './sector-edit/sector-edit.component';

import { PmdBranchCreateComponent } from './pmd-branch-create/pmd-branch-create.component';
import { PmdBranchEditComponent } from './pmd-branch-edit/pmd-branch-edit.component';
import {ExpenceCreateComponent} from './expence-create/expence-create.component';
import {ExpenceEditComponent} from './expence-edit/expence-edit.component';
import {EntityCreateComponent} from './entity-create/entity-create.component';
import {FinYearCreateComponent} from './fin-year-create/fin-year-create.component';
import {FinYearEditComponent} from './fin-year-edit/fin-year-edit.component';
import {FinquaterYearCreateComponent} from './finquater-year-create/finquater-year-create.component';
import {FinquaterYearEditComponent} from './finquater-year-edit/finquater-year-edit.component';
import { CommodityComponent } from './commodity/commodity.component';
import { DelmatMakerComponent } from './delmat-maker/delmat-maker.component';
import { CreateRiskComponent } from './create-risk/create-risk.component';
import { RiskUpdateComponent } from './risk-update/risk-update.component';
import { CreateAppVersionComponent } from './create-app-version/create-app-version.component';
import { CreateClientComponent } from './create-client/create-client.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import { EmpbranchCreateComponent } from './empbranch-create/empbranch-create.component';
import { EmpbranchEditComponent } from './empbranch-edit/empbranch-edit.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
@NgModule({
  declarations: [
    MasterComponent, CreateCostcentreComponent,DepartmentViewComponent,
    CostcentreEditComponent, CreateBusinesssegmentComponent,
    BusinesssegmentEditComponent, CreateCCBSComponent,
    CcbsEditComponent, CreateHierarchyComponent,
    HierarchyEditComponent, RolesEditComponent,MemoDepartentEditComponent,
    PermissionComponent,EmployeeViewComponent,CreateDepartmentComponent,
    CreateCategoryComponent,MemoCategoryEditComponent,
    ExpenceCreateComponent,ExpenceEditComponent,EntityCreateComponent,
    FinYearCreateComponent,FinYearEditComponent,FinquaterYearCreateComponent,FinquaterYearEditComponent,
    MemoSubCategoryEditComponent,SubcategoryCreateComponent, EmpDetailsCreateComponent, 
    EmpDetailsEditComponent, CreateCityComponent, EmpBankSummaryComponent, EmpBankAddComponent, 
    CreateDesignationComponent, DesignationEditComponent, SectorCreateComponent, 
    SectorEditComponent, MemoSubCategoryEditComponent,SubcategoryCreateComponent, 
    EmpDetailsCreateComponent, EmpDetailsEditComponent, CreateCityComponent, 
    EmpBankSummaryComponent, EmpBankAddComponent, PmdBranchCreateComponent, 
    PmdBranchEditComponent, CommodityComponent, DelmatMakerComponent, CreateRiskComponent, RiskUpdateComponent,
    CreateAppVersionComponent, CreateClientComponent, EditClientComponent, EmpbranchCreateComponent, EmpbranchEditComponent

  ],
  imports: [
    MastermoduleRoutingModule, SharedModule, MaterialModule,MatSlideToggleModule
  ]
})
export class MastermoduleModule { }
