import { Component, OnInit,ViewChild,EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { masterService } from '../master.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-finquater-year-create',
  templateUrl: './finquater-year-create.component.html',
  styleUrls: ['./finquater-year-create.component.scss']
})
export class FinquaterYearCreateComponent implements OnInit {
  @Output() onSubmit=new EventEmitter<any>();
  @Output() onCancel=new EventEmitter<any>();
  constructor(private datepipe:DatePipe,private fb:FormBuilder,private Notification:NotificationService,private masterservice:masterService) { }
  finform:any=FormGroup;
  ngOnInit(): void {
    this.finform=this.fb.group({
      'year':['',Validators.required],
      'month':['',Validators.required]
    });
  }
  onclickcancel(){
    this.onCancel.emit();
  }
  getsubmitform(){
    console.log(this.finform.value);
    if(this.finform.get('year').value==undefined || this.finform.get('year').value=='' || this.finform.get('year').value==null){
      this.finform.showError('Please Select Financial Year');
      return false;
    }
    if(this.finform.get('month').value==undefined || this.finform.get('month').value=='' || this.finform.get('month').value==null){
      this.Notification.showError('Please Select Financial Month');
      return false;
    }
    let d:any={'fin_year':this.datepipe.transform(this.finform.get('year').value,'yyyy'),'fin_month':this.datepipe.transform(this.finform.get('month').value,'MM')};
    console.log(d);
    this.masterservice.getfinQuateryearcreate(d).subscribe(result=>{
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
