import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSelectModule } from '@angular/material/select'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatSliderModule } from '@angular/material/slider';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const MaterialComponents = [
  MatButtonModule, MatCardModule,
  MatIconModule,MatDialogModule,MatTooltipModule,
  MatInputModule,MatListModule,
  MatFormFieldModule,MatGridListModule,
  MatSelectModule,MatMenuModule,
  MatAutocompleteModule,MatPaginatorModule,
  MatCheckboxModule,MatProgressSpinnerModule,
  MatRadioModule,MatSidenavModule,
  MatDatepickerModule,MatSnackBarModule,
  MatNativeDateModule,MatTableModule,MatSortModule,
  MatButtonToggleModule,MatTabsModule,MatSliderModule,
  MatChipsModule,MatToolbarModule,MatExpansionModule, DragDropModule, CdkTableModule, CdkTreeModule,
  MatProgressBarModule
];

@NgModule({
  declarations: [],
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule { }
