import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.scss']
})
export class UomComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  uomForm: FormGroup;
  disableSubmit = true;
  
  constructor(private fb: FormBuilder, private atmaService: AtmaService, private notification: NotificationService) { }

  ngOnInit(): void {
    this.uomForm = this.fb.group({
      code:['',Validators.required],
      name: ['', Validators.required],
    })
  }
  uomCreateForm() {
    console.log(this.uomForm.value);
    if(this.uomForm.get('name').value.toString().trim()=='' || this.uomForm.get('name').value==undefined || this.uomForm.get('name').value==null){
      this.notification.showError('Please Enter The Name');
      return false;
    }
    if(this.uomForm.get('code').value.toString().trim()=='' || this.uomForm.get('code').value==undefined || this.uomForm.get('code').value==null){
      this.notification.showError('Please Enter The Code');
      return false;
    }
    // this.disableSubmit = true;
    // if(this.uomForm.valid){
      let data:any={
        'code':this.uomForm.get('code').value.toString().trim(),
        'name':this.uomForm.get('name').value.toString().trim()
      };
      console.log(data);
    this.atmaService.uomCreateForm(data)
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
      },
      (error)=>{
        this.notification.showError(error.status+error.statusText);
      }
      );
    // } else {
      //   this.notification.showError("INVALID_DATA!...")
      //   this.disableSubmit = false;
      // }
  }

  onCancelClick() {
    this.onCancel.emit()
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 123)) {
      return false;
    }
    return true;
  }

}
