import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { ToastrService } from 'ngx-toastr';
import  {DataService} from '../../service/data.service'
@Component({
  selector: 'app-create-bank',
  templateUrl: './create-bank.component.html',
  styleUrls: ['./create-bank.component.scss']
})
export class CreateBankComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  bankAddForm: FormGroup;
  disableSubmit = true;

  constructor(private formBuilder: FormBuilder, private atmaService: AtmaService, private toastr: ToastrService,
    private router: Router, private notification: NotificationService,private dataService:DataService) { }

  ngOnInit(): void {
    this.bankAddForm = this.formBuilder.group({
     
      name: ['', Validators.required]
    })
  }
  createFormat() {
    let data = this.bankAddForm.controls;
    let objBank = new Bank();
   
    objBank.name = data['name'].value;
    console.log("objBank", objBank)
    return objBank;
  }

  submitForm() {
    // this.disableSubmit = true;
    if(this.bankAddForm.get('name').value=='' || this.bankAddForm.get('name').value==null || this.bankAddForm.get('name').value==undefined || this.bankAddForm.get('name').value==""){
      this.notification.showError('Please Fill Bank Field');
      return false;
    }
    this.dataService.isLoading.next(true)
    if(this.bankAddForm.valid){
    this.atmaService.createBankForm(this.createFormat())
      .subscribe(res => {
        console.log("res", res)
        let code = res.code
        if (code === "INVALID_DATA") {
          this.notification.showError("INVALID_DATA...")
          this.disableSubmit = false;
        } 
        if(res['status']=='success'){
          this.notification.showSuccess("saved Successfully!...")
        this.onSubmit.emit();
        this.dataService.isLoading.next(false)
        }
        else {
          this.notification.showSuccess(res['code']);
          this.notification.showSuccess(res['description']);
          // this.onSubmit.emit();
          // this.dataService.isLoading.next(false)
        }
      }
      )
    } else{
      this.notification.showError(("INVALID_DATA..."))
      this.disableSubmit = false;
    }
  }

  onCancelClick() {
    this.onCancel.emit()
  }

}
class Bank {
  code: string;
  name: string;

}
