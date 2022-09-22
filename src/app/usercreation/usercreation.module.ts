import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr'
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { DatePipe } from '@angular/common';

import { UsercreationRoutingModule } from './usercreation-routing.module';
import { UserSummaryComponent } from './user-summary/user-summary.component';
import { UserCreationComponent } from './user-creation/user-creation.component';


@NgModule({
  declarations: [UserSummaryComponent, UserCreationComponent],
  providers: [DatePipe],
  imports: [
    ToastrModule.forRoot(),
    SharedModule,MaterialModule,
    CommonModule,
    UsercreationRoutingModule,

  ]
})
export class UsercreationModule { }
