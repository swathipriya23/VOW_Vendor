import { Component, OnInit, Output,EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent } from 'rxjs';
import { finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';
import { masterService } from '../master.service';
export interface expid{
  id:string;
  name:string;
  description:string;
}
@Component({
  selector: 'app-create-app-version',
  templateUrl: './create-app-version.component.html',
  styleUrls: ['./create-app-version.component.scss']
})
export class CreateAppVersionComponent implements OnInit {
  @Output() onSubmit=new EventEmitter<any>();
  @Output() onCancel=new EventEmitter<any>();
  @ViewChild('expinput') ExpInput:any;
  @ViewChild('expidref') matExp:MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger:MatAutocompleteTrigger;
  expencecrateform:any=FormGroup;
  expenceform:any=FormGroup;
  expidlist: Array<any>=[];
  has_next:boolean;
  has_previous:boolean;
  page:number=1;
  isLoading:boolean;
  constructor(private fb:FormBuilder,private masterservice:masterService,private Notification:NotificationService,
    private SpinnerService:NgxSpinnerService) { }

  ngOnInit(): void {
    this.expencecrateform=this.fb.group({
      'no':[''],
      'ref_no':[''],
      'remarks':[''],
    });
  }

  public datainterfaceempid(data?:expid):string | undefined{
    return data?data.name:undefined;
  }
  
  getsubmitform(){
    this.SpinnerService.show();
    if(this.expencecrateform.get('no').value==undefined || this.expencecrateform.get('no').value=='' || this.expencecrateform.get('no').value==null){
      this.Notification.showError('please Enter the Version No');
      return false;
    }
    if(this.expencecrateform.get('ref_no').value==undefined || this.expencecrateform.get('ref_no').value=='' || this.expencecrateform.get('ref_no').value==null){
      this.Notification.showError('please Enter the Reference No');
      return false;
    }
    if(this.expencecrateform.get('remarks').value==undefined || this.expencecrateform.get('remarks').value=='' || this.expencecrateform.get('remarks').value==null){
      this.Notification.showError('please Enter the Remarks');
      return false;
    }
    let d:any={'no':this.expencecrateform.get('no').value,'ref_no':this.expencecrateform.get('ref_no').value,
    'remarks':this.expencecrateform.get('remarks').value};
    console.log(d);
    this.masterservice.getappversioncreate(d).subscribe(result=>{
      if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
        this.Notification.showError("[INVALID_DATA! ...]")
        this.SpinnerService.hide();
      }
      else if (result.code === "UNEXPECTED_ERROR" && result.description === "Duplicate Name") {
        this.Notification.showWarning("Duplicate Data! ...")
        this.SpinnerService.hide();
      } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
        this.Notification.showError("INVALID_DATA!...")
        this.SpinnerService.hide();
      }else {
        this.Notification.showSuccess("saved Successfully!...")
        this.SpinnerService.hide();
        this.onSubmit.emit();
      }
    })
  }

  onclickcancel(){
    this.onCancel.emit();
  }
  

}
