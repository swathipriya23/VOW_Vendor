import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service'; 
import { masterService } from '../master.service';
import { ShareService } from '../share.service';
@Component({
  selector: 'app-sector-edit',
  templateUrl: './sector-edit.component.html',
  styleUrls: ['./sector-edit.component.scss']
})
export class SectorEditComponent implements OnInit {
  @Output() onCancel=new EventEmitter<any>();
  @Output() onSubmit=new EventEmitter<any>();
  sectorform:any=FormGroup;
  editid:any;
  constructor(private fb:FormBuilder,private Notification:NotificationService,private masterservice:masterService
    ,private shareservice:ShareService) { }

  ngOnInit(): void {
    this.sectorform=this.fb.group({
      'name':['',Validators.required],
      'desc':['',Validators.required]
    });
    let editdata:any=this.shareservice.sectorEdit.value;
    this.editid=editdata.id;
    this.sectorform.patchValue({'name':editdata.name,'desc':editdata.description});


  }
  submitform(){
    console.log(this.sectorform.value);
    if(this.sectorform.get('name').value==undefined || this.sectorform.get('name').value=='' || this.sectorform.get('name').value==null){
      this.Notification.showError('Please Enter The Sector Name');
      return false;
    }
    if(this.sectorform.get('desc').value==undefined || this.sectorform.get('desc').value=='' || this.sectorform.get('desc').value==null){
      this.Notification.showError('Please Enter The Sector Description');
      return false;
    }
    let d:any={
      'id':this.editid,
      "name":this.sectorform.get('name').value.toString().trim(),
      "description":this.sectorform.get('desc').value.toString().trim()
    };
    this.masterservice.getsectorcreate(d).subscribe(result=>{
      if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
        this.Notification.showError("[INVALID_DATA! ...]")
      }
      else if (result.code === "UNEXPECTED_ERROR" && result.description === "Duplicate Name") {
        this.Notification.showWarning("Duplicate Data! ...")
      } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
        this.Notification.showError("INVALID_DATA!...")
      }else {
        this.Notification.showSuccess("Updated Successfully  ")
        this.onSubmit.emit();
      }
    })
  }
  clickcancel(){
    this.onCancel.emit();
  }
}
