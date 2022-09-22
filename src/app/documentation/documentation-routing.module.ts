import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentsComponent } from './documents/documents.component';
import { CanActivateGuardService } from '../can-activate-guard.service';
const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
      { path: 'documentation', component: DocumentsComponent },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentationRoutingModule { }
