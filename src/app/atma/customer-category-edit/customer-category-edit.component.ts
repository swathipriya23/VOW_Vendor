import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { from } from 'rxjs';
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { ShareService } from '../share.service'

@Component({
  selector: 'app-customer-category-edit',
  templateUrl: './customer-category-edit.component.html',
  styleUrls: ['./customer-category-edit.component.scss']
})
export class CustomerCategoryEditComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  CustomerCategoryEditForm: FormGroup;
  disableSubmit = true;
  
  constructor(private fb: FormBuilder, private atmaService: AtmaService, private notification: NotificationService, private sharedService: ShareService) { }

  ngOnInit(): void {
    this.CustomerCategoryEditForm = this.fb.group({
      name: ['', Validators.required],
    })
    this.getCustomerCatEdit();
  }

  getCustomerCatEdit(){
    let id = this.sharedService.customerCategoryEdit.value
    console.log("getCustomerCatEdit Edit", this.sharedService.customerCategoryEdit.value)
    this.atmaService.getCustomerCatEdit(id)
      .subscribe((result: any)  => {
        let Name = result.name;     
        this.CustomerCategoryEditForm.patchValue({
          name: Name,
        })
      })
  }

  CustomerCategoryEditFormSubmit(){
    this.disableSubmit = true;
    if(this.CustomerCategoryEditForm.valid){
    let idValue: any = this.sharedService.customerCategoryEdit.value
    let data = this.CustomerCategoryEditForm.value
    this.atmaService.editCustomerCatEdit(data, idValue.id)
      .subscribe(res => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.notification.showWarning("Duplicate! Code Or Name ...")
          this.disableSubmit = false;
        }
        else {
          this.notification.showSuccess("Updated Successfully!...")
          this.onSubmit.emit();
        }
      })} else {
        this.notification.showError("INVALID_DATA!...")
        this.disableSubmit = false;
      }
  }

  onCancelClick() {
    this.onCancel.emit()
  }

}
