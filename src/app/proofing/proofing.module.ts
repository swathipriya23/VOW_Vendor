import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ToastrModule} from 'ngx-toastr'
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon'
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatMenuModule } from '@angular/material/menu'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatTabsModule } from '@angular/material/tabs';
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner';

import { ProofingRoutingModule } from './proofing-routing.module';
import { ProofingMasterComponent } from './proofing-master/proofing-master.component';
import { ProofingMapComponent} from './proofing-map/proofing-map.component';
import { TemplateCreateComponent } from './template-create/template-create.component';
import { ProofingUploadComponent } from './proofing-upload/proofing-upload.component';
import { TemplateEditComponent } from './template-edit/template-edit.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { MaterialModule } from '../material/material.module';
import { AgingReportComponent } from './aging-report/aging-report.component';
@NgModule({
  declarations: [ProofingMasterComponent,ProofingMapComponent,ProofingUploadComponent, TemplateCreateComponent, TemplateEditComponent, AgingReportComponent,CreateAccountComponent],
  imports: [
    CommonModule,ProofingRoutingModule,
    MatIconModule,ToastrModule.forRoot(),
    FormsModule, MatInputModule, MatRadioModule, MatTooltipModule, MatProgressSpinnerModule,
    ReactiveFormsModule, HttpClientModule, MatTableModule, MatAutocompleteModule, MatTabsModule,
    MatCheckboxModule, MatSelectModule, MatNativeDateModule, MatButtonModule,NgxSpinnerModule, MatFormFieldModule, MatDatepickerModule, NgxPaginationModule,MaterialModule
  ]
})
export class ProofingModule { }
