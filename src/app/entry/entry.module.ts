import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntryRoutingModule } from './entry-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { EntryMasterComponent } from './entry-master/entry-master.component';
import { EntryServiceComponent } from './entry-service/entry-service.component';


@NgModule({
  declarations: [EntryMasterComponent, EntryServiceComponent],
  imports: [
    ToastrModule.forRoot({ timeOut: 10000 }),
    CommonModule, EntryRoutingModule, SharedModule, MaterialModule,PdfViewerModule
  ]
})
export class EntryModule { }