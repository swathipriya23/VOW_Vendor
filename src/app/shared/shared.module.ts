import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ComponentLoaderDirective } from '../directives/component-loader.directive';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSummernoteModule } from 'ngx-summernote';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [
    ComponentLoaderDirective
  ],
  imports: [
    CommonModule,NgxSummernoteModule,
    FormsModule,NgxSpinnerModule,
    ReactiveFormsModule,NgxPaginationModule,
    HttpClientModule
  ],
  exports: [
    CommonModule,NgxSummernoteModule,
    FormsModule,NgxSpinnerModule,
    ReactiveFormsModule,NgxPaginationModule,
    HttpClientModule,
    ComponentLoaderDirective
  ]
})
export class SharedModule { }
