import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { AtmaService } from '../atma.service'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ShareService } from '../share.service'
import { Router } from '@angular/router'
import { getAllJSDocTagsOfKind } from 'typescript';
import { getMatFormFieldPlaceholderConflictError, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NotificationService } from '../notification.service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent,MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';


export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

@Injectable()
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'app-vendorreport',
  templateUrl: './vendorreport.component.html',
  styleUrls: ['./vendorreport.component.scss'],
  providers:[
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
  ]
})


export class VendorreportComponent implements OnInit {
  
  VendorstatusesList=[{'id':1,'name':'ONBOARD'},{'id':2, 'name':'MODIFICATION'},{'id':3, 'name':'ACTIVATION'},{'id':4, 'name':'DEACTIVATION'},
  {'id':5, 'name':'RENEWAL'},{'id':6, 'name':'TERMINATION'}]

  vendorSearchForm: any;
  Vendorrequests=[{'id':1,'name':'DRAFT'},{'id':2, 'name':'PENDING_RM'},{'id':3, 'name':'PENDING_CHECKER'},{'id':4, 'name':'PENDING_HEADER'},
  {'id':5, 'name':'APPROVED'},{'id':6, 'name':'RENEWAL_APPROVED'},{'id':0, 'name':'REJECTED'}]
  constructor(private atmaService: AtmaService,private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService, private fb: FormBuilder,private notification: NotificationService, public datepipe: DatePipe,
    private router: Router,
    private shareService: ShareService) { }

    


  ngOnInit(): void {
    this.vendorSearchForm = this.fb.group({
   
      type: [''],
    
      to_date: [''],
      from_date: [''],
      request_for:['']
      
      
      
    })
  }
  vendorreport(){
  this.vendorSearchForm.value.to_date=this.datepipe.transform(this.vendorSearchForm.value.to_date, 'yyyy-MM-dd')
  this.vendorSearchForm.value.from_date=this.datepipe.transform(this.vendorSearchForm.value.from_date, 'yyyy-MM-dd')
  this.atmaService.report(this.vendorSearchForm.value)
  .subscribe(data => {
    let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'Vendorreport'+ date +".xlsx";
      link.click();
    // this.SpinnerService.hide();

  })

}
}
