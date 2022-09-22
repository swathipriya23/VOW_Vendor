import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  taxForm: FormGroup;
  disableSubmit=true;
  pay_receivableList = [
    { "PayRec": "Receivable", id: 1, name: "Receivable" },
    { "PayRec": "Payable", id: 2, name: "Payable" }
  ]
  constructor(private fb: FormBuilder, private atmaService: AtmaService, private notification: NotificationService) { }

  ngOnInit(): void {
    this.taxForm = this.fb.group({
      
      name: ['', Validators.required],
      glno: ['', Validators.required],
      pay_receivable: ['', Validators.required],
      isreceivable:['',Validators.required]
    })
  }

  taxCreateForm() {
    if(this.taxForm.get('name').value==undefined || this.taxForm.get('name').value==null || this.taxForm.get('name').value=="" || this.taxForm.get('name').value==''){
      this.notification.showError('Please Enter The Name');
      return false;
    }
    if(this.taxForm.get('glno').value==undefined || this.taxForm.get('glno').value==null || this.taxForm.get('glno').value=="" || this.taxForm.get('glno').value==''){
      this.notification.showError('Please Enter The GlNo');
      return false;
    }
    if(this.taxForm.get('pay_receivable').value==undefined || this.taxForm.get('pay_receivable').value==null || this.taxForm.get('pay_receivable').value=="" || this.taxForm.get('pay_receivable').value==''){
      this.notification.showError('Please Enter The PayReceivable');
      return false;
    }
    // this.disableSubmit=true
    // if(this.taxForm.valid){
      let  payable:any={'Yes':1,'No':0};
    let receivable:any={'Yes':1,'No':0};
    let data:any={
      "name":this.taxForm.get('name').value.trim(),
      "receivable":receivable[this.taxForm.get('isreceivable').value],
      "payable":payable[this.taxForm.get('pay_receivable').value],
      "glno":this.taxForm.get('glno').value
  }
    this.atmaService.taxCreateForm(data)
      .subscribe(result => {
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.notification.showWarning("Duplicate Code & Name ...")
          this.disableSubmit=false
        } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
          this.disableSubmit=false
        } else {
          this.notification.showSuccess("Saved Successfully!...")
          this.onSubmit.emit();
        }
      })
    // }
    //   else{
    //     this.notification.showError("INVALID_DATA!...")
    //     this.disableSubmit=false
    //   }
  }
  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  onCancelClick() {
    this.onCancel.emit()
  }

}
