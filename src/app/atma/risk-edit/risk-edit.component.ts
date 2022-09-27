import { Component, OnInit,Output, EventEmitter, ViewChild, Injectable } from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from, fromEvent } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../share.service'
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { ToastrService } from 'ngx-toastr';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { isBoolean } from 'util';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent,MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';

@Component({
  selector: 'app-risk-edit',
  templateUrl: './risk-edit.component.html',
  styleUrls: ['./risk-edit.component.scss']
})
export class RiskEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  riskeditForm: FormGroup;
  vendorId:any;
  hhh:File;

  constructor(private formBuilder: FormBuilder, private atmaService: AtmaService,private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
    private notification: NotificationService, private toastr: ToastrService, private datePipe: DatePipe,
    private router: Router,private shareService: ShareService) { }

  ngOnInit(): void {
    let data: any = this.shareService.vendorViewHeaderName.value;
    this.vendorId = data.id;
    this.riskeditForm = this.formBuilder.group({
      risktype_id: ['',Validators.required],
      risktype_description:['',Validators.required],
      risk_mitigant: ['',Validators.required],
      risk_mitigant_review:['',Validators.required],
      })
      this.getRiskType_List();
      this.getRiskEdit();
  }


  getRiskEdit() {
    let dataa:any= this.shareService.riskEdit.value;
    console.log("risk-edit", dataa)
    this.riskEditID = dataa.id;
    this.atmaService.getSingleRisk(this.vendorId, this.riskEditID)
      .subscribe(result => {
        let data = result
        let riskType = data.risktype_id.id;
        let risktypedescription = data.risktype_description;
        let riskmitigant = data.risk_mitigant;
        let risk_mitigant_review = data.risk_mitigant_review;
        this.riskeditForm.patchValue({
      "risktype_id": riskType,
      "risktype_description": risktypedescription,
      "risk_mitigant": riskmitigant,
      "risk_mitigant_review": risk_mitigant_review,
        })
      })

  }


  RiskList:any;
  getRiskType_List() {
    this.atmaService.getRiskType()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.RiskList = datas;
      })
  }

  
  onCancelClick() {
    this.onCancel.emit()
  }


  riskEditID:any;
  risksubmitForm() {
    this.SpinnerService.show();
  
    if (this.riskeditForm.value.risktype_id === undefined || this.riskeditForm.value.risktype_id === "") {
      this.toastr.error('Please Select Type of Risk');
      this.SpinnerService.hide();
      return false;
    }
    if (this.riskeditForm.value.risktype_description === "") {
      this.toastr.error('Please Enter Risk Description');
      this.SpinnerService.hide();
      return false;
    }
    if (this.riskeditForm.value.risk_mitigant === "") {
      this.toastr.error('Please Enter Risk Mitigant');
      this.SpinnerService.hide();
      return false;
    }
    if (this.riskeditForm.value.risk_mitigant_review === "") {
      this.toastr.error('Please Enter Risk mitigant Review');
      this.SpinnerService.hide();
      return false;
    }
     
    
    var str = this.riskeditForm.value.risktype_description
    var cleanStr_r_des=str.trim();//trim() returns string with outer spaces removed
    this.riskeditForm.value.risktype_description = cleanStr_r_des

  var str = this.riskeditForm.value.risk_mitigant
  var cleanStr_r_miti=str.trim();//trim() returns string with outer spaces removed
  this.riskeditForm.value.risk_mitigant = cleanStr_r_miti

  var str = this.riskeditForm.value.risk_mitigant_review
  var cleanStr_r_re=str.trim();//trim() returns string with outer spaces removed
  this.riskeditForm.value.risk_mitigant_review = cleanStr_r_re
    // /  let raisorId = this.riskeditForm.value.raisor.id
    console.log("risk-edit json", this.riskeditForm.value)

    this.atmaService.riskEdit_Form(this.riskEditID,this.vendorId,this.riskeditForm.value)
      .subscribe(result => {
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


}
