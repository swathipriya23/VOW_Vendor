import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
// import { ProjectComponent } from './project/project.component';
import { LoginComponent } from './login/login.component';
import { LoginLogoComponent} from './login-logo/login-logo.component';
import { ListViewComponent} from './list-view/list-view.component'
// import { SummaryListComponent } from './ememo/mastersummary/summary-list.component';
// import { EmployeeSummaryComponent} from '../app/Employee/employee-summary/employee-summary.component'
// import { CreateContactComponent} from '../app/Employee/create-contact/create-contact.component'
// import { ContactEditComponent} from '../app/Employee/contact-edit/contact-edit.component'
// import { CreateDesignationComponent} from '../app/Employee/create-designation/create-designation.component'
// import { DesignationEditComponent} from '../app/Employee/designation-edit/designation-edit.component'
// import { CreateCountryComponent} from '../app/Employee/create-country/create-country.component'
// import { CountryEditComponent} from '../app/Employee/country-edit/country-edit.component'
// import { CreateStateComponent} from '../app/Employee/create-state/create-state.component'
// import { StateEditComponent} from '../app/Employee/state-edit/state-edit.component'
// import { CreateDistrictComponent} from '../app/Employee/create-district/create-district.component'
// import { DistrictEditComponent} from '../app/Employee/district-edit/district-edit.component'
// import { CreateCityComponent} from '../app/Employee/create-city/create-city.component'
// import { CityEditComponent} from '../app/Employee/city-edit/city-edit.component'
// import { CreatePincodeComponent} from '../app/Employee/create-pincode/create-pincode.component'
// import { PincodeEditComponent} from '../app/Employee/pincode-edit/pincode-edit.component'
// import { CreatePriorityComponent} from '../app/ememo/create-priority/create-priority.component'
// import { PriorityEditComponent} from '../app/ememo/priority-edit/priority-edit.component'
import { CanActivateGuardService } from './can-activate-guard.service';
import { UtilitiesComponent } from './utilities/utilities.component';
// import { NacwelcomeComponent } from './nacwelcome/nacwelcome.component';
import { LogoutComponent } from './logout/logout.component';


const routes: Routes = [
  { path: 'verify', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  // { path: 'verify2', component: NacwelcomeComponent },
  { path: 'loginlogo', component: LoginLogoComponent},
  { path: 'listview', component: ListViewComponent},
  {path:'utilities/mobileupdate',component:UtilitiesComponent,canActivate:[CanActivateGuardService]},
  { path: 'contact', component: ContactComponent, canActivate:[CanActivateGuardService] },
  { path: 'about', component: AboutComponent, canActivate:[CanActivateGuardService] },
  // { path: 'project', component: ProjectComponent, canActivate:[CanActivateGuardService] },
  // { path: 'employeeSummary', component: EmployeeSummaryComponent, canActivate:[CanActivateGuardService]},
  // { path: 'createcontact', component: CreateContactComponent, canActivate:[CanActivateGuardService]},
  // { path: 'contactEdit', component: ContactEditComponent, canActivate:[CanActivateGuardService]},
  // { path: 'createDesignation', component: CreateDesignationComponent, canActivate:[CanActivateGuardService]},
  // { path: 'designationEdit', component: DesignationEditComponent, canActivate:[CanActivateGuardService]},
  // { path: 'createCountry', component: CreateCountryComponent, canActivate:[CanActivateGuardService]},
  // { path: 'countryEdit', component: CountryEditComponent, canActivate:[CanActivateGuardService]},
  // { path: 'createState', component:CreateStateComponent, canActivate:[CanActivateGuardService]},
  // { path: 'stateEdit', component:StateEditComponent, canActivate:[CanActivateGuardService]},
  // { path: 'createDistrict', component: CreateDistrictComponent, canActivate:[CanActivateGuardService]},
  // { path: 'districtEdit', component: DistrictEditComponent, canActivate:[CanActivateGuardService]},
  // { path: 'createCity', component: CreateCityComponent, canActivate:[CanActivateGuardService]},
  // { path: 'cityEdit', component: CityEditComponent, canActivate:[CanActivateGuardService]},
  // { path: 'createPincode', component: CreatePincodeComponent, canActivate:[CanActivateGuardService]},
  // { path: 'pincodeEdit', component: PincodeEditComponent, canActivate:[CanActivateGuardService]},
  {path: '', pathMatch: 'full', redirectTo: 'verify' },
  // {path:'ememo',loadChildren:()=> import("./ememo/ememo.module").then(m=>m.EmemoModule)},
  {path:'atma',loadChildren:()=> import("./atma/atma.module").then(m=>m.AtmaModule)},
  // {path:'master',loadChildren:()=> import("./Master/mastermodule.module").then(m=>m.MastermoduleModule)},
  // {path:'ppr',loadChildren:()=> import("./ppr/ppr.module").then(m=>m.PprModule)},
  // {path:'fa',loadChildren:()=> import("./fa/fa.module").then(m=>m.FAModule)},
  // {path:'ta',loadChildren:()=> import("./ta/ta.module").then(m=>m.TAModule)},
  {path:'documentation',loadChildren:()=> import("./documentation/documentation.module").then(m=>m.DocumentationModule)},
  // {path:'ECF',loadChildren:()=> import("./ECF/ecfnew.module").then(m=>m.EcfnewModule)},
  // {path:'ap',loadChildren:()=> import("./ap/ap.module").then(m=>m.ApModule)},
  // {path:'inward',loadChildren:()=> import("./inward/inward.module").then(m=>m.InwardModule)},
  // {path:'JV',loadChildren:()=> import("./JV/jv.module").then(m=>m.JvModule)},
  // {path:'entry',loadChildren: ()=> import('./entry/entry.module').then(m=>m.EntryModule)},
  // {path:'report',loadChildren: ()=> import('./report/report.module').then(m=>m.ReportModule)},
  // {path:'dss',loadChildren:()=> import("./dss/dss.module").then(m=>m.DssModule)},
  // {path:'proofing',loadChildren:()=> import("./proofing/proofing.module").then(m=>m.ProofingModule)},
  {path:'usercreation',loadChildren:()=> import("./usercreation/usercreation.module").then(m=>m.UsercreationModule)}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
