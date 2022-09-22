import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { AtmaService } from '../atma.service'
import { ShareService } from '../share.service'
import { NotificationService } from '../notification.service'

@Component({
  selector: 'app-bank-edit',
  templateUrl: './bank-edit.component.html',
  styleUrls: ['./bank-edit.component.scss']
})
export class BankEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  bankEditForm: FormGroup;
  disableSubmit = true;
  presentpage:any=1;
  pagesize:any=10;
  has_next:boolean=true;
  has_previous:boolean=true;
  branchdetails:Array<any>=[];
  id:any;
  constructor(private fb: FormBuilder, private router: Router, private notification: NotificationService,
    private atmaService: AtmaService, private shareService: ShareService) { }

  ngOnInit(): void {
    this.bankEditForm = this.fb.group({
      
      name: ['', Validators.required],
      code: ['',Validators.required]
    })
    this.getBankEdit();
  }
  getBankEdit() {
    let data: any = this.shareService.bankEditValue.value;
    console.log("bankEDITvAUE", data)
    // let Code = data.code
    let Name = data.name;
    let Code = data.code;
    this.bankEditForm.patchValue({
      
      name: Name,
      code:Code

    });
    this.id=data.id;
    this.getbranchdata(this.id);
  }
  getbranchdata(id:any){
    this.atmaService.getbranchdetailsdata(id,this.presentpage).subscribe(data=>{
      this.branchdetails=data['data'];
      let pagination=data['pagination'];
      this.has_next=pagination.has_next;
      this.has_previous=pagination.has_previous;
      this.presentpage=pagination.index;
    })
  }
  has_nextdata(){
    if(this.has_next){
      this.presentpage=this.presentpage+1;
      this.getbranchdata(this.id);
    }
  }
  has_previousdata(){
    if(this.has_previous){
      this.presentpage=this.presentpage-1;
      this.getbranchdata(this.id);
    }
  }
  submitForm() {
    if(this.bankEditForm.get('name').value ==null || this.bankEditForm.get('name').value ==undefined || this.bankEditForm.get('name').value =='' || this.bankEditForm.get('name').value ==""){
      this.notification.showWarning('Please Fill The Bank Name');
      return false;
    }
    if(this.bankEditForm.get('code').value ==null || this.bankEditForm.get('code').value ==undefined || this.bankEditForm.get('code').value =='' || this.bankEditForm.get('code').value ==""){
      this.notification.showWarning('Please Fill The Bank Code');
      return false;
    }
    // this.disableSubmit = true;
    // if (this.bankEditForm.valid) {
      let data: any = this.shareService.bankEditValue.value
      this.atmaService.bankEditForm(this.bankEditForm.value, data.id)
        .subscribe(result => {
          console.log("res", result)
          let code = result.code
          if (result['status']=='success') {
            this.notification.showSuccess("Updated Successfully!...")
            this.onSubmit.emit();
            console.log("bankeditform", result)
            
          } else {
            this.notification.showSuccess(result['code']);
            this.notification.showSuccess(result['description']);
            this.disableSubmit = false;
          }
        }
        )
    // } else {
    //   this.notification.showError(("INVALID_DATA..."))
    //   this.disableSubmit = false;
    // }

  }
  onCancelClick() {
    this.onCancel.emit()
  }

}
