import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { AtmaService } from '../atma.service'
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../share.service'
import { NotificationService } from '../notification.service'

@Component({
  selector: 'app-apcategory-edit',
  templateUrl: './apcategory-edit.component.html',
  styleUrls: ['./apcategory-edit.component.scss']
})
export class ApcategoryEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  apCategoryEditForm: FormGroup
  disableSubmit = true;
  assetlist=[{'id':'1', 'name':'Y','show':'Yes'},{'id':'2', 'name':'N','show':'No'}]

  constructor(private fb: FormBuilder,private notification: NotificationService,private router: Router,private shareService: ShareService,private atmaService: AtmaService) { }

  ngOnInit(): void {
    this.apCategoryEditForm = this.fb.group({
      name: ['', Validators.required],
      no: ['', Validators.required],
      glno: ['', Validators.required],
      isasset: ['', Validators.required],
    })
    this.getApCategoryEdit()
  }
  getApCategoryEdit() {
    let id = this.shareService.apCategoryEdit.value
    this.atmaService.getApCategoryEdit(id)
      .subscribe((results: any) => {
        let Name = results.name;
        let No=results.no;
        let Glno = results.glno;
        let Isasset=results.isasset;
        console.log(Isasset)
        this.apCategoryEditForm.patchValue({
          name: Name,
          no:No,
          glno:Glno,
          isasset:Isasset,
         
         
        })
      })
    }

  apcategory_EditForm() {
    this.disableSubmit = true;
    if(this.apCategoryEditForm.valid){
    let idValue: any = this.shareService.apCategoryEdit.value
    let data = this.apCategoryEditForm.value
    this.atmaService.apCategoryEdit(data, idValue.id)
      .subscribe(res => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.notification.showWarning("Duplicate! Code Or Name ...")
          this.disableSubmit = false;
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
          this.disableSubmit = false;
        }
        else {
          this.notification.showSuccess("Saved Successfully!...")
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