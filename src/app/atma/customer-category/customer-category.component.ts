import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'

@Component({
  selector: 'app-customer-category',
  templateUrl: './customer-category.component.html',
  styleUrls: ['./customer-category.component.scss']
})
export class CustomerCategoryComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  customerCatForm: FormGroup;
  disableSubmit = true;
  
  constructor(private fb: FormBuilder, private atmaService: AtmaService, private notification: NotificationService) { }

  ngOnInit(): void {
    this.customerCatForm = this.fb.group({
      name: ['', Validators.required],
    })
  }
  customerCatSubmitForm() {
    this.disableSubmit = true;
    if(this.customerCatForm.valid){
    this.atmaService.customerCatCreateForm(this.customerCatForm.value)
      .subscribe(res => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          this.disableSubmit = false;
        }
        else {
          this.notification.showSuccess("saved Successfully!...")
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