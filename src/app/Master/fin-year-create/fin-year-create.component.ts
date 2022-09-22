import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit,ViewChild,EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { NotificationService } from 'src/app/service/notification.service';
import { masterService } from '../master.service';

import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-fin-year-create',
  templateUrl: './fin-year-create.component.html',
  styleUrls: ['./fin-year-create.component.scss']
})
export class FinYearCreateComponent implements OnInit {
  @ViewChild('pick', {static: false}) private picker: MatDatepicker<Date>
  @Output() onSubmit=new EventEmitter<any>();
  @Output() onCancel=new EventEmitter<any>();
  constructor(private datepipe:DatePipe,private fb:FormBuilder,private Notification:NotificationService,private masterservice:masterService) { }
  finform:any=FormGroup;
  selectYear:any='';
  ngOnInit(): void {
    this.finform=this.fb.group({
      'year':['',Validators.required],
      'month':['',Validators.required]
    });
  }
  onclickcancel(){
    this.onCancel.emit();
  }
  chosenYearHandler(ev:Moment, input){
    console.log(input)
    console.log(ev);
    input._destroyPopup();
   
    console.log(ev.toDate());
    this.finform.get('year').patchValue(ev.toDate());
    this.finform.get('year').patchValue(ev.toDate());
  }

  getsubmitform(){
    console.log(this.finform.value);
    if(this.finform.get('year').value==undefined || this.finform.get('year').value=='' || this.finform.get('year').value==null){
      this.finform.showError('Please Select Valid Financial Year');
      return false;
    }
    if(this.finform.get('month').value==undefined || this.finform.get('month').value=='' || this.finform.get('month').value==null){
      this.Notification.showError('Please Select Valid Financial Month');
      return false;
    }
    let d:any={'fin_year':this.datepipe.transform(this.finform.get('year').value,'yyyy'),'fin_month':this.datepipe.transform(this.finform.get('month').value,'MM')};
    console.log(d);
    this.masterservice.getfinyearcreate(d).subscribe(result=>{
      if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
        this.Notification.showError("[INVALID_DATA! ...]")
      }
      else if (result.code === "UNEXPECTED_ERROR" && result.description === "Duplicate Name") {
        this.Notification.showWarning("Duplicate Data! ...")
      } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
        this.Notification.showError("INVALID_DATA!...")
      }else {
        this.Notification.showSuccess("saved Successfully!...")
        this.onSubmit.emit();
      }
    })
  }
}
