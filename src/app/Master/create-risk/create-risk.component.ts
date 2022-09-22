import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { masterService } from '../master.service';

@Component({
  selector: 'app-create-risk',
  templateUrl: './create-risk.component.html',
  styleUrls: ['./create-risk.component.scss']
})
export class CreateRiskComponent implements OnInit {
  createrisk:FormGroup
  @Output() onCancel=new EventEmitter<any>();
  @Output() onSubmit=new EventEmitter<any>();
  constructor(private fb:FormBuilder,private Notification:NotificationService,private masterservice:masterService) { }

  ngOnInit(): void {
    this.createrisk=this.fb.group({
     
      'name':['',Validators.required]
    });
  }

  submitform(){
    if(this.createrisk.get('name').value.toString().trim()=='' || this.createrisk.get('name').value==undefined || this.createrisk.get('name').value=='' || this.createrisk.get('name').value==null){
      this.Notification.showError('Please Enter The Risk Name');
      return false;
    }
    let data:any={
      "name":this.createrisk.get('name').value.toString().trim(),
      // 'code':this.createdesignation.get('code').value
    };
    this.masterservice.getRiskcreate(data).subscribe(result=>{
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
        this.Notification.showWarning("Duplicate Data! ...");
      }
      else {
        this.Notification.showSuccess("Saved Successfully  ")
        this.onSubmit.emit();
      }
    })
  };
  clickcancel(){
    this.onCancel.emit();
  }
  keypressnodigit(event:any){
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode<64 || charCode>123)) {
      return false;
    }
    return true;
  }

}
