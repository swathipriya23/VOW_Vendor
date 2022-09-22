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
export interface branchlistss{
  id:number,
  name:string
}

@Component({
  selector: 'app-activitydetail',
  templateUrl: './activitydetail.component.html',
  styleUrls: ['./activitydetail.component.scss'],
  providers:[{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }]
})
export class ActivitydetailComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  ActivityDetailAddForm: FormGroup;
  activityId: number;
  rasisorEmployeeList: Array<Raisor>;
  employeeList: Array<Approver>;
  data: any;
  activityDetailButton = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  login_emp_details:any

  isLoading = false;
  @ViewChild('raisoremp') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('employeeRaisorInput') employeeRaisorInput: any;

  @ViewChild('approveremp') matappAutocomplete: MatAutocomplete;
  @ViewChild('employeeApproverInput') employeeApproverInput: any;

    // activity dropdown
    @ViewChild('branchContactInput') branchContactInput:any;
    @ViewChild('branchtype') matAutocompletebrach: MatAutocomplete;


  constructor(private formBuilder: FormBuilder, private atmaService: AtmaService, private sharedService: ShareService,
    private notification: NotificationService, private toastr: ToastrService,private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
    private router: Router) { }
  ngOnInit(): void {
    this.login_emp_details = this.sharedService.loginID.value
    console.log("login_emp_details",this.login_emp_details)

    // let data = this.sharedService.activityView.value;
    // this.activityId = data
    this.ActivityDetailAddForm = this.formBuilder.group({
      // name: [{ value: "", disabled: isBoolean }],
      // name: [''],
      code: [''],
      activity_id: [''],
      detailname: ['', Validators.pattern('^[a-zA-Z \-\']+')],
      raisor: ['', Validators.required],
      approver: ['', Validators.required],
      remarks: [''],
    })

    // this.getActivityName();
    this.branchViewId =  this.sharedService.pre_branch.value
    // this.getPre_Activity();
    let json ={
      "id":this.login_emp_details.employee_id,
      "full_name": "("+this.login_emp_details.code +") "+ this.login_emp_details.name

    }
    let Raisor = json;
    console.log("json", Raisor)
    this.ActivityDetailAddForm.patchValue({
      "raisor": Raisor,
    })

  }
  raisoremployee(){
    let raisorkeyvalue: String = "";
    this.getRaisorEmployee(raisorkeyvalue);

    this.ActivityDetailAddForm.get('raisor').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          

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
        

      })
  }
  approveremployee(){
    let approverkeyvalue: String = "";
    this.getApproverEmployee(approverkeyvalue);

    this.ActivityDetailAddForm.get('approver').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
         

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
       

      })

  }
  public displayFnRaisor(raisor?: Raisor): string | undefined {
 
    return raisor ? raisor.full_name : undefined;
  }

  get raisor() {
    return this.ActivityDetailAddForm.get('raisor');
  }

  public displayFnApprover(approver?: Approver): string | undefined {
    
    return approver ? approver.full_name : undefined;
  }

  get approver() {
    return this.ActivityDetailAddForm.get('approver');
  }

  branchViewId:any;
  getActivityName() {
    this.data = this.sharedService.activityViewDetail.value;
    this.branchViewId = this.data.branch
    console.log('get branch id',this.data.branch)
    let activityName = this.data.name
    
    // this.ActivityDetailAddForm.patchValue({
    //   "name": activityName,
    // });
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
  keyPressAlphaNumeric(event) {

    var inp = String.fromCharCode(event.keyCode);
  
    if (/[a-zA-Z]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  createFormate() {
    let data = this.ActivityDetailAddForm.controls;
    let detailclass = new activityDetail();
    detailclass.raisor = data['raisor'].value.id;
    detailclass.approver = data['approver'].value.id;
    detailclass.code = data['code'].value;
    // detailclass.detailname = data['detailname'].value;
    // detailclass.remarks = data['remarks'].value;

  
      var str = data['detailname'].value
      var cleanStr=str.trim();//trim() returns string with outer spaces removed
      detailclass.detailname= cleanStr 
    

    
      var str = data['remarks'].value
      var cleanStr=str.trim();//trim() returns string with outer spaces removed
      detailclass.remarks = cleanStr
    


    return detailclass;
  }

  submitForm() {
    this.SpinnerService.show();
  
    if (this.ActivityDetailAddForm.value.activity_id === "" ||this.ActivityDetailAddForm.value.activity_id.id==undefined) {
      this.toastr.error('Invalid  Activity Name');
      this.SpinnerService.hide();
      return false;
    }
      // if (this.ActivityDetailAddForm.value.detailname === "") {
      //   this.toastr.error('Please Enter Activity Detail Name');
      //   this.SpinnerService.hide();
      //   return false;
      // }
      if (this.ActivityDetailAddForm.value.raisor == "" ||this.ActivityDetailAddForm.value.raisor.id==undefined) {
        this.toastr.error('Invalid  Raisor Name');
        this.SpinnerService.hide();
        return false;
      }
      if (this.ActivityDetailAddForm.value.approver == ""||this.ActivityDetailAddForm.value.approver.id==undefined ) {
        this.toastr.error(' Invalid Approver Name');
        this.SpinnerService.hide();
        return false;
      }
      // if (this.ActivityDetailAddForm.value.remarks === "") {
      //   this.toastr.error('Please Enter Remarks');
      //   this.activityDetailButton = false;
      //   return false;
      // }
     
      let raisorId = this.ActivityDetailAddForm.value.raisor.id
      let approverId = this.ActivityDetailAddForm.value.approver.id
      if(raisorId == approverId){
        this.notification.showWarning("Should not be same raisor and approver");
        this.SpinnerService.hide();
        return false

      }

    this.atmaService.activityDetailCreateForm(this.activityId, this.createFormate())
      .subscribe(result => {
        if(result.id === undefined){
          this.notification.showError(result.description)
          this.SpinnerService.hide();
          return false;
        }
        else{
          this.notification.showSuccess("Saved Successfully!...")
          this.SpinnerService.hide();
          this.sharedService.add_submit_preActivityID.next(this.activityId)
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






























  activityList:any
  getPre_Activity(pageNumber = 1, pageSize = 10) {
    this.atmaService.getActivityList(this.branchViewId, pageNumber, pageSize)
      .subscribe(result => {
        console.log("activity-summary", result)
        let datas = result['data'];
        this.activityList = datas;
        // let datapagination = result["pagination"];
        // this.activityList = datas;
        // if (this.activityList.length >= 0) {
        //   this.has_next = datapagination.has_next;
        //   this.has_previous = datapagination.has_previous;
        //   this.presentpage = datapagination.index;
        //   this.isActivityPagination = true;
        // } if (this.activityList <= 0) {
        //   this.isActivityPagination = false;
        // }
      })

    // if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft' ||this.requestStatusName == "Renewal Process" && this.vendorStatusName == "Draft") {
    //   this.getmodification_vender();
    //   this.activity_modify = true;

    // }

  }

  select_preActivity(data){
    // let data = this.sharedService.activityView.value;
    this.activityId = data.id

    let activityName = data.name
    
    this.ActivityDetailAddForm.patchValue({
      "name": activityName,
    });
  }




// activity list---activity id
  branchlist:any
  isLoadingbranch=false

  brachname(){
    let prokeyvalue: String = "";
      this.getbranch(prokeyvalue);
      this.ActivityDetailAddForm.get('activity_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoadingbranch = true;
          }),
          switchMap(value => this.atmaService.getActivityList_(this.branchViewId,value)
            .pipe(
              finalize(() => {
                this.isLoadingbranch = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchlist= datas;
          console.log("activity dropdown", datas)

        })

  }
  private getbranch(prokeyvalue)
  {
    this.atmaService.getActivityList_(this.branchViewId,prokeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;

      })
  }

  public displaybranch(producttype?: branchlistss): string | undefined {
    return producttype ? producttype.name : undefined;
    
  }


  FocusOut_select_preActivity(data) {
    this.activityId = data.id

    let activityName = data.name
    
    this.ActivityDetailAddForm.patchValue({
      "detailname": activityName,
    });

  }
    
}
class activityDetail{
  detailname: string;
  raisor: any;
  approver: any;
  remarks: string;
  code:string;
}