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
  selector: 'app-risk',
  templateUrl: './risk.component.html',
  styleUrls: ['./risk.component.scss']
})
export class RiskComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  riskForm: FormGroup;
  vendorId:any;
  constructor(private formBuilder: FormBuilder, private atmaService: AtmaService,private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
    private notification: NotificationService, private toastr: ToastrService, private datePipe: DatePipe,
    private router: Router,private shareService: ShareService) { }

  ngOnInit(): void {
    this.vendorId = this.shareService.vendorID.value;
    this.riskForm = this.formBuilder.group({
      risktype_id: ['',Validators.required],
      risktype_description:['',Validators.required],
      risk_mitigant: ['',Validators.required],
      risk_mitigant_review:['',Validators.required],
      })
      this.getRiskType_List();
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


  
  risksubmitForm() {
    this.SpinnerService.show();
  
    if (this.riskForm.value.risktype_id === undefined || this.riskForm.value.risktype_id === "") {
      this.toastr.error('Please Select Type of Risk');
      this.SpinnerService.hide();
      return false;
    }
    if (this.riskForm.value.risktype_description === "") {
      this.toastr.error('Please Enter Risk Description');
      this.SpinnerService.hide();
      return false;
    }
    if (this.riskForm.value.risk_mitigant === "") {
      this.toastr.error('Please Enter Risk Mitigant');
      this.SpinnerService.hide();
      return false;
    }
    if (this.riskForm.value.risk_mitigant_review === "") {
      this.toastr.error('Please Enter Risk mitigant Review');
      this.SpinnerService.hide();
      return false;
    }

    var str = this.riskForm.value.risktype_description
    var cleanStr_r_des=str.trim();//trim() returns string with outer spaces removed
    this.riskForm.value.risktype_description = cleanStr_r_des

  var str = this.riskForm.value.risk_mitigant
  var cleanStr_r_miti=str.trim();//trim() returns string with outer spaces removed
  this.riskForm.value.risk_mitigant = cleanStr_r_miti

  var str = this.riskForm.value.risk_mitigant_review
  var cleanStr_r_re=str.trim();//trim() returns string with outer spaces removed
  this.riskForm.value.risk_mitigant_review = cleanStr_r_re
     
    // /  let raisorId = this.riskForm.value.raisor.id

    this.atmaService.riskCreateForm(this.vendorId,this.riskForm.value)
      .subscribe(result => {
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

}
