import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { AtmaService } from '../atma.service'
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../share.service'
// import {ShareService} from '../../Master/share.service'
import { NotificationService } from '../notification.service'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-producttype-edit',
  templateUrl: './producttype-edit.component.html',
  styleUrls: ['./producttype-edit.component.scss']
})
export class ProducttypeEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  producttypeeditForm: FormGroup
  productcategoryList: Array<any>;

  constructor(private fb: FormBuilder, private shareService: ShareService,
    private notification: NotificationService,
    private atmaService: AtmaService, private router: Router,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.producttypeeditForm = this.fb.group({
      productcategory_id: ['', Validators.required],
      code: [''],
      name: ['', Validators.required],
  })
  this.getProductTypeEdit();
  this.getproductcategory();

}
  private getproductcategory() {
    this.atmaService.getproductcategory()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productcategoryList = datas;
        console.log("productcat", datas)
  
      }, error => {
        return Observable.throw(error);
      })
  }

  getProductTypeEdit() {

    let id = this.shareService.productTypeEdit.value

    this.atmaService.getProductTypeEdit(id)

      .subscribe((results: any) => {
        let ProductCategory = results.productcategory.id;
        let Code=results.code;
        let Name=results.name;
    
        
       
        this.producttypeeditForm.patchValue({
          productcategory_id:ProductCategory,
          code: Code,
          name:Name,
       
         
        })
      })
   }
   producttype_editForm() {
    if (this.producttypeeditForm.value.name===""){
      this.toastr.error('Add name Field','Empty value inserted' ,{timeOut: 1500});
      // this.onCancel.emit()
      return false;
    }
    if (this.producttypeeditForm.value.productcategory_id===""){
      this.toastr.error('Add productcategory Field','Empty value inserted' ,{timeOut: 1500});
      // this.onCancel.emit()
      return false;
    }
    let idValue: any = this.shareService.productTypeEdit.value
    let data = this.producttypeeditForm.value
    this.atmaService.ProductTypeEdit(data, idValue.id)
      .subscribe(res => {
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("INVALID_DATA!...")
        } else {
          this.notification.showSuccess("Updated Successfully!...")
          this.onSubmit.emit();
        }
       
        return true
      })
  }


  onCancelClick() {
    this.onCancel.emit()
  }

}
