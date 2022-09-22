import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-paymode',
  templateUrl: './create-paymode.component.html',
  styleUrls: ['./create-paymode.component.scss']
})
export class CreatePaymodeComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  paymodeAddForm: FormGroup;
  disableSubmit = true;

  constructor(private formBuilder: FormBuilder, private atmaService: AtmaService,private toastr: ToastrService,
    private notification: NotificationService,private router: Router) { }

  ngOnInit(): void {
    this.paymodeAddForm = this.formBuilder.group({
     
      name: ['', Validators.required],
      code:['',Validators.required]
        });
  }
  createFormat() {
    let data = this.paymodeAddForm.controls;
    let objPaymode = new paymode();
  
    objPaymode.name = data['name'].value;
    console.log("objPaymode", objPaymode)
    return objPaymode;
  }

  submitForm() {
    if(this.paymodeAddForm.get('name').value.toString().trim()=='' || this.paymodeAddForm.get('name').value==undefined || this.paymodeAddForm.get('name').value==null){
      this.notification.showError('Please Enter The Name');
      return false;
    }
    this.atmaService.createpaymodeForm(this.createFormat())
      .subscribe(res => {
          if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
            this.notification.showWarning("Duplicate! Code Or Name ...")
            this.disableSubmit = false;
          } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
            this.notification.showError("INVALID_DATA!...")
            this.disableSubmit = false;
          }
          else if(res.code === "INVALID_DATA" && res.description === "Duplicate Name"){
            this.notification.showWarning("Duplicate Data! ...")
          }
          else {
            this.notification.showSuccess(" Saved Successfully!...")
            this.onSubmit.emit();
          }
        
      }
      )
   
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 123)) {
      return false;
    }
    return true;
  }
  onCancelClick() {
    this.onCancel.emit()
  }

}
class paymode {
  code: string;
  name: string;
}
