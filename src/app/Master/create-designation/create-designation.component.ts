import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { masterService } from '../master.service';
@Component({
  selector: 'app-create-designation',
  templateUrl: './create-designation.component.html',
  styleUrls: ['./create-designation.component.scss']
})
export class CreateDesignationComponent implements OnInit {
  @Output() onCancel=new EventEmitter<any>();
  @Output() onSubmit=new EventEmitter<any>();
  createdesignation:any=FormGroup;
  constructor(private fb:FormBuilder,private Notification:NotificationService,private masterservice:masterService) { }

  ngOnInit(): void {
    this.createdesignation=this.fb.group({
      'code':['',Validators.required],
      'name':['',Validators.required]
    });
  }
  submitform(){
    if(this.createdesignation.get('name').value.toString().trim()=='' || this.createdesignation.get('name').value==undefined || this.createdesignation.get('name').value=='' || this.createdesignation.get('name').value==null){
      this.Notification.showError('Please Enter The Designation Name');
      return false;
    }
    let data:any={
      "name":this.createdesignation.get('name').value.toString().trim(),
      'code':this.createdesignation.get('code').value
    };
    this.masterservice.getdesignationcreate(data).subscribe(result=>{
      console.table("result", result)
      if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
        this.Notification.showError("[INVALID_DATA! ...]")
      }
      else if (result.code === "UNEXPECTED_ERROR" && result.description === "Duplicate Name") {
        this.Notification.showWarning("Duplicate Data! ...")
      } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
        this.Notification.showError("INVALID_DATA!...")
      }
      else if(result.code === "INVALID_DATA" && result.description === "Duplicate Name"){
        this.Notification.showWarning("Duplicate Data! ...")
      }
      else {
        this.Notification.showSuccess("saved Successfully!...")
        this.onSubmit.emit();
      }
    })
  };
  clickcancel(){
    this.onCancel.emit();
  }
  keypressnodigit(event:any){
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode !=32 && (charCode < 48 || charCode > 57) && (charCode<64 || charCode>123) ) {
      return false;
    }
    return true;
  }
}
