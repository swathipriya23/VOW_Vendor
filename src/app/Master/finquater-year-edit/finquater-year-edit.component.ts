import { Component, OnInit,ViewChild,EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { masterService } from '../master.service';
import { ShareService } from '../share.service';

@Component({
  selector: 'app-finquater-year-edit',
  templateUrl: './finquater-year-edit.component.html',
  styleUrls: ['./finquater-year-edit.component.scss']
})
export class FinquaterYearEditComponent implements OnInit {
  @Output() onSubmit=new EventEmitter<any>();
  @Output() onCancel=new EventEmitter<any>();
  constructor(private shareservice:ShareService,private fb:FormBuilder,private Notification:NotificationService,private masterservice:masterService) { }
  finform:any=FormGroup;
  id:any;
  ngOnInit(): void {
    this.finform=this.fb.group({
      'year':['',Validators.required],
      'month':['',Validators.required]
    });
    let d:any=this.shareservice.finquateredit.value;
    this.id=d.id;
    this.finform.patchValue({'year':d.year,'month':d.month});
  }
  onclickcancel(){
    this.onCancel.emit();
  }
  getsubmitform(){
    console.log(this.finform.value);
    if(this.finform.get('name').value==undefined || this.finform.get('name').value=='' || this.finform.get('name').value==null){
      this.finform.showError('please Enter the Expence Name');
      return false;
    }
    if(this.finform.get('desc').value==undefined || this.finform.get('desc').value=='' || this.finform.get('desc').value==null){
      this.Notification.showError('please Enter the Expence Name');
      return false;
    }
    let d:any={'id':this.id,'year':this.finform.get('year').value,'month':this.finform.get('month').value};
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
