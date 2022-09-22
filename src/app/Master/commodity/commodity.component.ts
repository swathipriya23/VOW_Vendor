import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { masterService } from '../master.service'
import { ShareService } from '../share.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from 'src/app/service/notification.service';
@Component({
  selector: 'app-commodity',
  templateUrl: './commodity.component.html',
  styleUrls: ['./commodity.component.scss']
})
export class CommodityComponent implements OnInit {
  commodityForm: FormGroup;
  isvisible:boolean=false;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private shareService: ShareService,
    private dataService: masterService, private toastr:ToastrService,private notification: NotificationService, private router: Router, private SpinnerService: NgxSpinnerService ) { }

  ngOnInit(): void {
    this.commodityForm = this.fb.group({
      name:['', Validators.required] ,
      description:['',Validators.required],
      is_multilevel:[''],
      Approval_level:['']
    })
  }

  commoditySubmit(){
    console.log("this.commodityForm.value",this.commodityForm.value)
    if (this.commodityForm.value.name===""){
      this.toastr.error('Please Enter Commodity Name Field','Empty value not Allowed');
      return false;
    }
    if (this.commodityForm.value.name.trim()===""){
      this.toastr.error('Please Enter Commodity Name Field',' WhiteSpace Not Allowed');
      return false;
    }
    if (this.commodityForm.value.name.trim().length > 20){
      this.toastr.error('Not more than 20 characters','Enter valid Commodity name' );
      return false;
    }
    if (this.commodityForm.value.description.trim()===""){
      this.toastr.error('Please Enter Commodity Remarks Field');
      return false;
    }
    if (this.commodityForm.value.is_multilevel==true){
      if(this.commodityForm.value.Approval_level== null || this.commodityForm.value.Approval_level== undefined || this.commodityForm.value.Approval_level== '' )
      {
        this.toastr.warning("Approval Level Cannot Be Empty");
        return false;
      } 
    }
    let data = this.commodityForm.value
    this.SpinnerService.show();
   this.dataService.commodityCreateForm(data)
   .subscribe(res => {
    if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
      this.notification.showError("[INVALID_DATA! ...]")
      this.SpinnerService.hide();
    }
    else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
      this.notification.showWarning("Duplicate Data! ...")
      this.SpinnerService.hide();
    } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
      this.notification.showError("INVALID_DATA!...")
      this.SpinnerService.hide();
    }
     else {
       this.notification.showSuccess("Successfully created!...")
       this.SpinnerService.hide();
      this.onSubmit.emit();
     }
       console.log("commodity Form SUBMIT", res)
       return true
     },(error) => {
      this.SpinnerService.hide();
    }) 
  }

  omit_special_char(event)
{   
  var k;  
  k = event.charCode;  
  return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
}
 onCancelClick() {
  
  this.onCancel.emit()
 }
 enb(){
   this.isvisible=!this.isvisible;
   this.commodityForm.value.is_multilevel=this.isvisible
   console.log( this.commodityForm.value.is_multilevel)
  
}
numberOnlyandDot(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}
} 