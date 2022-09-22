import { Component, OnInit ,EventEmitter,Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service'; 
import { masterService } from '../master.service';
@Component({
  selector: 'app-sector-create',
  templateUrl: './sector-create.component.html',
  styleUrls: ['./sector-create.component.scss']
})
export class SectorCreateComponent implements OnInit {
  @Output() onCancel=new EventEmitter<any>();
  @Output() onSubmit=new EventEmitter<any>();
  sectorform:any=FormGroup;
  constructor(private fb:FormBuilder,private Notification:NotificationService,private masterservice:masterService) { }

  ngOnInit(): void {
    this.sectorform=this.fb.group({
      'name':['',Validators.required],
      'desc':['',Validators.required]
    });

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
        this.Notification.showSuccess("Saved Successfully  ")
        this.onSubmit.emit();
      }
    })
  }
  clickcancel(){
    this.onCancel.emit();
  }
}
