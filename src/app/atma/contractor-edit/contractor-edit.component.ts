import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NotificationService } from '../notification.service'
import { AtmaService } from '../atma.service'
import { ShareService } from '../share.service'
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';

@Component({
  selector: 'app-contractor-edit',
  templateUrl: './contractor-edit.component.html',
  styleUrls: ['./contractor-edit.component.scss']
})
export class ContractorEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  contractorEditForm: FormGroup;
  vendorId: number;
  editId:number;
  contractorEditButton = false;
  constructor(private fb: FormBuilder, private atmaService: AtmaService,private toastr: ToastrService,private SpinnerService: NgxSpinnerService,
    private notification: NotificationService,private errorHandler: ErrorHandlingService, private shareService: ShareService,
  ) { }

  ngOnInit(): void {
    this.contractorEditForm = this.fb.group({
      service: ['', Validators.required],
      name: ['', Validators.required],
      remarks: [''],
    });
    this.getEditContractor()
  }


  getEditContractor() {
    let data = this.shareService.contractorEditForm.value;
    console.log("EDITECONTAX", data)
    this.vendorId = data.vendor_id
    console.log("vendIOOOO",this.vendorId)
    this.editId=data.id
    let Service = data.service;
    let Name = data.name;
    let Remarks = data.remarks;
    this.contractorEditForm.patchValue({
      name: Name,
      service: Service,
      remarks: Remarks
    })
  }

  contractorEdit() {
    this.SpinnerService.show();
    if (this.contractorEditForm.value.name === "") {
      this.toastr.error('Please Enter Name');
      this.SpinnerService.hide();
      return false;
    }
    if (this.contractorEditForm.value.service === "") {
      this.toastr.error('Please Enter Service');
      this.SpinnerService.hide();
      return false;
    }

    var str = this.contractorEditForm.value.name
    var cleanStr=str.trim();//trim() returns string with outer spaces removed
    this.contractorEditForm.value.name = cleanStr
    var str = this.contractorEditForm.value.service
    var cleanStr1=str.trim();//trim() returns string with outer spaces removed
    this.contractorEditForm.value.service = cleanStr1
    var str = this.contractorEditForm.value.remarks
    var cleanStr2=str.trim();//trim() returns string with outer spaces removed
    this.contractorEditForm.value.remarks = cleanStr2

    this.atmaService.contractorEdit(this.editId, this.vendorId, this.contractorEditForm.value)
      .subscribe(result => {
        console.log("COntroct", result)

        if(result.id === undefined){
          this.notification.showError(result.description)
          this.SpinnerService.hide();
          return false;
        }
        else{
          this.notification.showSuccess("Updated Successfully!...")
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
