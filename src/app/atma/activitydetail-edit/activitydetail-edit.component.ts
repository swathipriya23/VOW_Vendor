import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from, fromEvent } from 'rxjs';
import { Router } from '@angular/router'
import { AtmaService } from '../atma.service'
import { ShareService } from '../share.service'
import { NotificationService } from '../notification.service'
import { ToastrService } from 'ngx-toastr';
import { isBoolean } from 'util';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export interface Raisor {
  id: string;
  full_name: string;
}
export interface Approver {
  id: string;
  full_name: string;
}

@Component({
  selector: 'app-activitydetail-edit',
  templateUrl: './activitydetail-edit.component.html',
  styleUrls: ['./activitydetail-edit.component.scss'],
  providers:[{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }]
})
export class ActivitydetailEditComponent implements OnInit {
  ActivityDetailEditForm: FormGroup;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  activityId: number;
  activityDetailEditId: number;
  rasisorEmployeeList: Array<Raisor>;
  employeeList: Array<Approver>;
  data: any;
  activityDetailEditButton = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;

  isLoading = false;
  @ViewChild('raisoremp') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('employeeRaisorInput') employeeRaisorInput: any;

  @ViewChild('approveremp') matappAutocomplete: MatAutocomplete;
  @ViewChild('employeeApproverInput') employeeApproverInput: any;

  constructor(private formBuilder: FormBuilder, private atmaService: AtmaService, private sharedService: ShareService,
    private notification: NotificationService, private toastr: ToastrService,private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
    private router: Router) { }

  ngOnInit(): void {
    // let data = this.sharedService.activityView.value;
    // this.activityId = data
    // console.log("activityid", this.activityId)
    this.ActivityDetailEditForm = this.formBuilder.group({
      // name: [{ value: "", disabled: isBoolean }],
      // name: [''],
      code: ['', Validators.required],
      detailname: [''],
      raisor: ['', Validators.required],
      approver: ['', Validators.required],
      remarks: [''],
    })

    // this.getActivityName();
    this.getActivityDetailEdit();
  }
  raisoremployee(){
    let raisorkeyvalue: String = "";
    this.getRaisorEmployee(raisorkeyvalue);

    this.ActivityDetailEditForm.get('raisor').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.atmaService.get_EmployeeName(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.rasisorEmployeeList = datas;
        console.log("raisor", datas)

      })
  }
  approveremployee(){
    let approverkeyvalue: String = "";
    this.getApproverEmployee(approverkeyvalue);

    this.ActivityDetailEditForm.get('approver').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.atmaService.get_EmployeeName(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
        console.log("approver", datas)

      })
  }
  public displayFnRaisor(raisoremp?: Raisor): string | undefined {
    console.log('id', raisoremp.id);
    console.log('name', raisoremp.full_name);
    return raisoremp ? raisoremp.full_name : undefined;
  }

  get raisoremp() {
    return this.ActivityDetailEditForm.get('raisor');
  }

  public displayFnApprover(approveremp?: Approver): string | undefined {
    console.log('id', approveremp.id);
    console.log('name', approveremp.full_name);
    return approveremp ? approveremp.full_name : undefined;
  }

  get approveremp() {
    return this.ActivityDetailEditForm.get('approver');
  }
  keyPressAlphaNumeric(event) {

    var inp = String.fromCharCode(event.keyCode);
  
    if (/[a-zA-Z]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  getActivityDetailEdit() {
    let data = this.sharedService.activityDetailEditForm.value;
    console.log("activitydetail", data)
    this.activityId=  data.activity_id.id
    this.activityDetailEditId = data.id;
    let Code = data.code;
    let Detailname = data.detailname;
    let Remarks = data.remarks;
    let Raisor = data.raisor;
    let Approver = data.approver;
    this.ActivityDetailEditForm.patchValue({
      "approver": Approver,
      "code": Code,
      "detailname": Detailname,
      "raisor": Raisor,
      "remarks": Remarks,
      // "name":  data.activity_id.name
    })
  }


  getActivityName(){
    this.data = this.sharedService.activityViewDetail.value;
    console.log("edit--",this.data)
    let activityName = this.data.name
    console.log("activityname", activityName)
    this.ActivityDetailEditForm.patchValue({
      "name": activityName,
    });
  }

  private getRaisorEmployee(raisorkeyvalue) {
    this.atmaService.getEmployeeSearchFilter(raisorkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.rasisorEmployeeList = datas;
      })
  }

  private getApproverEmployee(approverkeyvalue) {
    this.atmaService.getEmployeeSearchFilter(approverkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
      })
  }


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  createFormate() {
    let data = this.ActivityDetailEditForm.controls;
    let detailclass = new activityDetail();
    detailclass.raisor = data['raisor'].value.id;
    detailclass.approver = data['approver'].value.id;
    detailclass.code = data['code'].value;
    // detailclass.detailname = data['detailname'].value;
    // detailclass.remarks = data['remarks'].value;
    console.log("detailclass", detailclass)

    var str = data['detailname'].value
      var cleanStr=str.trim();//trim() returns string with outer spaces removed
      detailclass.detailname= cleanStr 
    

    
      var str = data['remarks'].value
      var cleanStr=str.trim();//trim() returns string with outer spaces removed
      detailclass.remarks = cleanStr

    return detailclass;
  }
  autocompleteRaisorScroll() {
    setTimeout(() => {
      if (
        this.matAutocomplete &&
        this.autocompleteTrigger &&
        this.matAutocomplete.panel
      ) {
        fromEvent(this.matAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.get_EmployeeName(this.employeeRaisorInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.rasisorEmployeeList = this.rasisorEmployeeList.concat(datas);
                    if (this.rasisorEmployeeList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  autocompleteApproverScroll() {
    setTimeout(() => {
      if (
        this.matappAutocomplete &&
        this.autocompleteTrigger &&
        this.matappAutocomplete.panel
      ) {
        fromEvent(this.matappAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matappAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matappAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matappAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matappAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.get_EmployeeName(this.employeeApproverInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList = this.employeeList.concat(datas);
                    if (this.employeeList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  submitForm() {
    this.SpinnerService.show();
  
      // if (this.ActivityDetailEditForm.value.detailname === "") {
      //   this.toastr.error('Please Enter Activity Detail Name');
      //   this.SpinnerService.hide();
      //   return false;
      // }
      if (this.ActivityDetailEditForm.value.raisor == "" ||this.ActivityDetailEditForm.value.raisor.id==undefined) {
        this.toastr.error('Invalid  Raisor Name');
        this.SpinnerService.hide();
        return false;
      }
      if (this.ActivityDetailEditForm.value.approver == ""||this.ActivityDetailEditForm.value.approver.id==undefined ) {
        this.toastr.error(' Invalid Approver Name');
        this.SpinnerService.hide();
        return false;
      }
    
      let raisorId = this.ActivityDetailEditForm.value.raisor.id
      console.log("raisorid", raisorId)
      let approverId = this.ActivityDetailEditForm.value.approver.id
      console.log("approverid", approverId)
      if(raisorId == approverId){
        this.notification.showWarning("Should not be same raisor and approver");
        this.SpinnerService.hide();
        return false

      }

    this.atmaService.activityDetailEditForm(this.activityDetailEditId, this.activityId, this.createFormate())
      .subscribe((result) => {
        console.log("res",result)
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
class activityDetail{
  code:string;
  detailname: string;
  raisor: any;
  approver: any;
  remarks: string;
}
