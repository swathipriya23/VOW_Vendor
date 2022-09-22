import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { from } from 'rxjs';
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { ShareService } from '../share.service'


@Component({
  selector: 'app-productcategory-edit',
  templateUrl: './productcategory-edit.component.html',
  styleUrls: ['./productcategory-edit.component.scss']
})
export class ProductcategoryEditComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  productCatEditForm: FormGroup;
  
  constructor(private fb: FormBuilder, private atmaService: AtmaService, private notification: NotificationService, private sharedService: ShareService) { }

  ngOnInit(): void {
    this.productCatEditForm = this.fb.group({
      code: [''],
      name: ['', Validators.required],
      client_id: 1,
      isprodservice: true,
      stockimpact: false
    });
    this.getproductCatEdit();
  }

  getproductCatEdit(){
    let id = this.sharedService.productCategoryEdit.value
    console.log("getproductCatEdit Edit", this.sharedService.productCategoryEdit.value)
    this.atmaService.getproductCatEdit(id)
      .subscribe((result: any)  => {
        let Name = result.name;
        let Code = result.code;
        let Isprodservice = result.isprodservice;
        let Stockimpact = result.stockimpact;
        this.productCatEditForm.patchValue({
          name: Name,
          code: Code,
          isprodservice: Isprodservice,
          stockimpact: Stockimpact
        })
      })
  }


  productCatEditSubmitForm(){
    if(this.productCatEditForm.get('code').value=='' || this.productCatEditForm.get('code').value==undefined){
      this.notification.showError('Please Enter The Code');
      return false;
    }
    if(this.productCatEditForm.get('name').value=='' || this.productCatEditForm.get('name').value==undefined){
      this.notification.showError('Please Enter The Code');
      return false;
    }
    let idValue: any = this.sharedService.productCategoryEdit.value
    let data = this.productCatEditForm.value
    this.atmaService.editProductCatEdit(data, idValue.id)
      .subscribe(result => {
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          // this.notification.showError("INVALID_DATA!...")
          this.notification.showError("Duplicate! [INVALID_DATA! ...]")
        }
        else {
          this.notification.showSuccess("Updated Successfully!...")
          this.onSubmit.emit();
        }
        // this.notification.showSuccess("Updated Successfully!...")
        this.onSubmit.emit();
        console.log("procatEdit", result)
        return true
      })
  }

  onCancelClick() {
    this.onCancel.emit()
  }

}
