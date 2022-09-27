import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
// import { threadId } from 'worker_threads';
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { ShareService } from '../share.service'
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';

@Component({
  selector: 'app-contractor',
  templateUrl: './contractor.component.html',
  styleUrls: ['./contractor.component.scss']
})
export class ContractorComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  contractorForm: FormGroup;
  vendorId: number;
  contractorButton = false;
  constructor(private fb: FormBuilder, private atmaService: AtmaService,private toastr: ToastrService,
    private shareService: ShareService,private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
    private notification: NotificationService) { }

  ngOnInit(): void {
    this.contractorForm = this.fb.group({
      service: ['', Validators.required],
      name: ['', Validators.required],
      remarks: [''],
    })
  }


  contractorCreateForm() {
    this.SpinnerService.show();
    if (this.contractorForm.value.name === "") {
      this.toastr.error('Please Enter Name');
      this.SpinnerService.hide();
      return false;
    }
    if (this.contractorForm.value.service === "") {
      this.toastr.error('Please Enter Service');
      this.SpinnerService.hide();
      return false;
    }
    this.vendorId = this.shareService.vendorID.value;

    var str = this.contractorForm.value.name
    var cleanStr=str.trim();//trim() returns string with outer spaces removed
    this.contractorForm.value.name = cleanStr
    var str = this.contractorForm.value.service
    var cleanStr1=str.trim();//trim() returns string with outer spaces removed
    this.contractorForm.value.service = cleanStr1
    var str = this.contractorForm.value.remarks
    var cleanStr2=str.trim();//trim() returns string with outer spaces removed
    this.contractorForm.value.remarks = cleanStr2

    this.atmaService.contractorCreateForm(this.vendorId, this.contractorForm.value)
      .subscribe(result => {
        console.log("COntroct", result)
        if(result.id === undefined){
          this.notification.showError(result.description)
          this.SpinnerService.hide();
          return false;
        }
        else{
          this.notification.showSuccess("Saved Successfully!...")
          this.SpinnerService.hide();
          this.onSubmit.emit();
        }
      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
    
  }

  onCancelClick() {
    this.onCancel.emit()
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  namevalidation(event){
    
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9-/  ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  addressvalidation(event){
    
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9-_#@.', /&]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
