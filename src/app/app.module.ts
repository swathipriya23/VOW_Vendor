import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './material/material.module'
import { DatePipe, HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './common/footer/footer.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { TestComponent } from './common/test/test.component';
// import { ProjectComponent } from './project/project.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResizableDirective } from './resizable.directive'
// import { TextSearchPipe } from '../app/filter/text-search.pipe';
import { LoginComponent } from './login/login.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ToastrModule } from 'ngx-toastr';
// import { EmployeeSummaryComponent } from './Employee/employee-summary/employee-summary.component';
// import { CreateContactComponent } from './Employee/create-contact/create-contact.component';
// import { ContactEditComponent } from './Employee/contact-edit/contact-edit.component';
// import { CreateDesignationComponent } from './Employee/create-designation/create-designation.component';
// import { DesignationEditComponent } from './Employee/designation-edit/designation-edit.component';
// import { CreateCountryComponent } from './Employee/create-country/create-country.component';
// import { CountryEditComponent } from './Employee/country-edit/country-edit.component';
// import { CreateStateComponent } from './Employee/create-state/create-state.component';
// import { StateEditComponent } from './Employee/state-edit/state-edit.component';
// import { CreateDistrictComponent } from './Employee/create-district/create-district.component';
// import { DistrictEditComponent } from './Employee/district-edit/district-edit.component';
// import { CreateCityComponent } from './Employee/create-city/create-city.component';
// import { CityEditComponent } from './Employee/city-edit/city-edit.component';
// import { CreatePincodeComponent } from './Employee/create-pincode/create-pincode.component';
// import { PincodeEditComponent } from './Employee/pincode-edit/pincode-edit.component';
import { JwtUnAuthorizedInterceptorServiceService } from './jwt-un-authorized-interceptor-service.service';
import { LodingspinComponent } from './lodingspin/lodingspin.component';
// import { TQModule } from './tq/tq.module';
// import { TQRoutingModule } from './tq/tq-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';
// import { ReportsComponent } from './reports/reports.component';
// import { InsightsComponent } from './reports/insights/insights.component';
// import { ReportsRoutingModule } from '../app/reports/reports-routing.module';
// import { ReportsModule } from '../app/reports/reports.module';
import { CookieService } from 'ngx-cookie-service';
import { MemoService } from './service/memo.service';
import { UtilitiesComponent } from './utilities/utilities.component';
import { LoginLogoComponent } from './login-logo/login-logo.component';
import { ListViewComponent } from './list-view/list-view.component';
// import { NacwelcomeComponent } from './nacwelcome/nacwelcome.component';
import { LogoutComponent } from './logout/logout.component';
import { SafePipe } from './safe.pipe';


@NgModule({
  declarations: [
    AppComponent, LoginComponent, FooterComponent,
    SidebarComponent, ContactComponent, AboutComponent, TestComponent,
    ResizableDirective,
    // EmployeeSummaryComponent,
    // CreateContactComponent,
    // ContactEditComponent,
    // CreateDesignationComponent,
    // DesignationEditComponent,
    // CreateCountryComponent,
    // CountryEditComponent,
    // CreateStateComponent,
    // StateEditComponent,
    // CreateDistrictComponent,
    // DistrictEditComponent,
    // CreateCityComponent,
    // CityEditComponent,
    // CreatePincodeComponent,
    // PincodeEditComponent,
    LodingspinComponent,
    // ReportsComponent,
    // InsightsComponent,
    UtilitiesComponent,
    LoginLogoComponent,
    ListViewComponent,
    
    // NacwelcomeComponent,
    
    LogoutComponent,
    
    SafePipe,
   
  ],
  imports: [
    NgIdleKeepaliveModule.forRoot(),
    ToastrModule.forRoot(),
    SharedModule,MaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    // TQModule,
    // TQRoutingModule,
     NgbModule, PdfViewerModule,
    // ReportsRoutingModule, ReportsModule, 
  ],
  providers: [MemoService,CookieService,DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtUnAuthorizedInterceptorServiceService,
      multi: true
    },
    {provide: LocationStrategy, useClass: PathLocationStrategy}, 
      // {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }