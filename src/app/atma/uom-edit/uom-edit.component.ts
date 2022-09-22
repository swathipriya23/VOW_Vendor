import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { from } from 'rxjs';
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { ShareService } from '../share.service'

@Component({
  selector: 'app-uom-edit',
  templateUrl: './uom-edit.component.html',
  styleUrls: ['./uom-edit.component.scss']
})
export class UomEditComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  uomEditForm: FormGroup;
  disableSubmit = true;
  
  constructor(private fb: FormBuilder, private atmaService: AtmaService, private notification: NotificationService, private sharedService: ShareService) { }

  ngOnInit(): void {
    this.uomEditForm = this.fb.group({
      name: ['', Validators.required],
      code:['',Validators.required]
    });
    this.getuomEdit();
  }

  getuomEdit(){
    let id = this.sharedService.uomEdit.value
    console.log("getuomEdit Edit", this.sharedService.uomEdit.value)
    this.atmaService.getuomEdit(id)
      .subscribe((result: any)  => {
        let Name = result.name;
        let Code=result.code;
        this.uomEditForm.patchValue({
          name: Name,
          code:Code
        })
      })
  }


  uomEditFormSubmit(){
    console.log(this.uomEditForm.value);
    if(this.uomEditForm.get('name').value.toString().trim()=='' || this.uomEditForm.get('name').value==undefined || this.uomEditForm.get('name').value==null){
      this.notification.showError('Please Enter The Name');
      return false;
    }
    if(this.uomEditForm.get('code').value.toString().trim()=='' || this.uomEditForm.get('code').value==undefined || this.uomEditForm.get('code').value==null){
      this.notification.showError('Please Enter The Code');
      return false;
    }
    let data:any={
      'name':this.uomEditForm.get('name').value.toString().trim(),
      'code':this.uomEditForm.get('code').value.toString().trim()
    };
    console.log(data);
    let idValue: any = this.sharedService.uomEdit.value
    // let data = this.uomEditForm.value
    this.atmaService.edituomSubmitEdit(data, idValue.id)
        .subscribe(res => {
          if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
            this.notification.showWarning("Duplicate! Code Or Name ...")
            this.disableSubmit = false;
          } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
            this.notification.showError("INVALID_DATA!...")
            this.disableSubmit = false;
          }
          else {
            this.notification.showSuccess(" updated Successfully!...")
            this.onSubmit.emit();
          }
        }) 
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