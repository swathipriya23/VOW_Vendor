import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateDepartmentComponent } from '../Master/create-department/create-department.component';
import { MemoDepartentEditComponent } from '../Master/memo-departent-edit/memo-departent-edit.component';
import { MasterComponent } from '../Master/master/master.component'
import {EmployeeViewComponent} from '../Master/employee-view/employee-view.component'
import { CreateCostcentreComponent} from '../Master/create-costcentre/create-costcentre.component'
import { CostcentreEditComponent} from '../Master/costcentre-edit/costcentre-edit.component'
import { CreateBusinesssegmentComponent} from '../Master/create-businesssegment/create-businesssegment.component'
import { BusinesssegmentEditComponent} from '../Master/businesssegment-edit/businesssegment-edit.component'
import { CreateCCBSComponent} from '../Master/create-ccbs/create-ccbs.component'
import { CcbsEditComponent} from '../Master/ccbs-edit/ccbs-edit.component'
import { CreateHierarchyComponent} from '../Master/create-hierarchy/create-hierarchy.component'
import { HierarchyEditComponent} from '../Master/hierarchy-edit/hierarchy-edit.component'
import { RolesEditComponent} from '../Master/roles-edit/roles-edit.component'
import { PermissionComponent} from '../Master/permission/permission.component'
import { CanActivateGuardService } from '../can-activate-guard.service';
import { DepartmentViewComponent } from './department-view/department-view.component';
import { EmpDetailsCreateComponent } from './emp-details-create/emp-details-create.component';
import { EmpDetailsEditComponent } from './emp-details-edit/emp-details-edit.component';
import { CreateCityComponent } from '../Master/create-city/create-city.component';
import { EmpBankSummaryComponent } from '../Master/emp-bank-summary/emp-bank-summary.component'
import { EmpBankAddComponent } from './emp-bank-add/emp-bank-add.component';
import { CreateRiskComponent} from '../Master/create-risk/create-risk.component';
import { RiskUpdateComponent} from '../Master/risk-update/risk-update.component'
const routes: Routes = [
  { path: '',canActivate:[CanActivateGuardService],
 children:[ 
  { path: 'createdepartment', component: CreateDepartmentComponent, canActivate:[CanActivateGuardService] },
  { path: 'departmentView', component: DepartmentViewComponent, canActivate:[CanActivateGuardService]},
  { path: 'deptEdit', component: MemoDepartentEditComponent, canActivate:[CanActivateGuardService] },
  { path: 'employeeView', component: EmployeeViewComponent, canActivate:[CanActivateGuardService] },
  { path: 'master', component: MasterComponent, canActivate:[CanActivateGuardService] },
  { path: 'createCostcentre', component: CreateCostcentreComponent, canActivate:[CanActivateGuardService]},
  { path: 'costcentreEdit', component: CostcentreEditComponent, canActivate:[CanActivateGuardService]},
  { path: 'createBusinesssegment', component: CreateBusinesssegmentComponent, canActivate:[CanActivateGuardService]},
  { path: 'businesssegmentEdit', component: BusinesssegmentEditComponent, canActivate:[CanActivateGuardService]},
  { path: 'createccbs', component: CreateCCBSComponent, canActivate:[CanActivateGuardService]},
  { path: 'ccbsEdit', component: CcbsEditComponent, canActivate:[CanActivateGuardService]},
  { path: 'createHierarchy', component: CreateHierarchyComponent, canActivate:[CanActivateGuardService]},
  { path: 'hierarchyEdit', component: HierarchyEditComponent, canActivate:[CanActivateGuardService]},
  { path: 'rolesEdit', component: RolesEditComponent, canActivate:[CanActivateGuardService]},
  { path: 'permission', component: PermissionComponent, canActivate:[CanActivateGuardService]},
  { path:  'empcreate',component:EmpDetailsCreateComponent,canActivate:[CanActivateGuardService]},
  { path:'empedit',component:EmpDetailsEditComponent,canActivate:[CanActivateGuardService]},
  { path: 'city',component:CreateCityComponent,canActivate:[CanActivateGuardService]},
  { path:'empbank',component:EmpBankSummaryComponent,canActivate:[CanActivateGuardService]},
  { path:'empbankadd',component:EmpBankAddComponent,canActivate:[CanActivateGuardService]},
  { path: 'createrisk', component:CreateRiskComponent, canActivate:[CanActivateGuardService]},
  { path: 'riskupdate', component:RiskUpdateComponent, canActivate:[CanActivateGuardService]},

]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastermoduleRoutingModule { }
