import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentationRoutingModule } from './documentation-routing.module';
import { DocumentsComponent } from './documents/documents.component';


@NgModule({
  declarations: [DocumentsComponent],
  imports: [
    CommonModule,
    DocumentationRoutingModule
  ]
})
export class DocumentationModule { }
