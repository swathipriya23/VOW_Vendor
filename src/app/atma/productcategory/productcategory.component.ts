import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'

@Component({
  selector: 'app-productcategory',
  templateUrl: './productcategory.component.html',
  styleUrls: ['./productcategory.component.scss']
})
export class ProductcategoryComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  productCatForm: FormGroup;
  
  constructor(private fb: FormBuilder, private atmaService: AtmaService, private notification: NotificationService) { }

  ngOnInit(): void {
    this.productCatForm = this.fb.group({
      // code: ['', Validators.required],
      name: ['',Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')],// Validators.pattern('^[a-zA-Z \-\']')],   //[Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$')
      client_id: -1,
      isprodservice: true,
      stockimpact: false
    })
  }
  productCatSubmitForm() {
    this.atmaService.productCatCreateForm(this.productCatForm.value)
      .subscribe(result => {
        // if (result.code === "UNEXPECTED_ERROR" && result.description === "Duplicate Name") {
        //   this.notification.showWarning("Duplicate! Code Or Name ...")
        // } 
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          // this.notification.showError("INVALID_DATA!...")
          this.notification.showError("Duplicate! [INVALID_DATA! ...]")
        }
        else if(result.code === "INVALID_DATA" && result.description === "Duplicate Name"){
          this.notification.showWarning("Duplicate Data! ...")
        }
        else {
          this.notification.showSuccess("Created Successfully!...")
          this.onSubmit.emit();
        }
        // this.notification.showSuccess("Updated Successfully!...")
        this.onSubmit.emit();
        console.log("productcat result",result)
      })
  }

  onCancelClick() {
    this.onCancel.emit()
  }

}

