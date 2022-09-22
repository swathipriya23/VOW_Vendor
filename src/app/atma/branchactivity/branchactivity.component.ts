import { Component, OnInit, Output, EventEmitter, ViewChild, Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from, fromEvent} from 'rxjs';
import { Router } from '@angular/router'
import { AtmaService } from '../atma.service'
import { ShareService } from '../share.service'
import { NotificationService } from '../notification.service'
import { ToastrService } from 'ngx-toastr';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { isBoolean } from 'util';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize,takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';


export interface Designation {
  id: string;
  name: string;
}
export interface ContactType {
  id: string;
  name: string;
}


export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  },
  
}

@Injectable()
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-branchactivity',
  templateUrl: './branchactivity.component.html',
  styleUrls: ['./branchactivity.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
  ]
})
export class BranchactivityComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  ActivityAddForm: FormGroup;
  pinCodeList: Array<any>;
  cityList: Array<any>;
  stateList: Array<any>;
  districtList: Array<any>;
  designationList: Array<Designation>;
  contactTypeList: Array<ContactType>;
  Fidelity = false;
  Bidding = false;
  activityStatusList: string[] = ['Active','Inactive'];
  activityTypeList: string[] = ['product','Service'];  
  branchId: number;
  vendorData: any;
  activityButton = false;
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;        
  select: any;
  futureDays = new Date();

  @ViewChild('desg') matdesignationAutocomplete: MatAutocomplete;
  @ViewChild('designationInput') designationInput: any;

  @ViewChild('contactType') matcontactAutocomplete: MatAutocomplete;
  @ViewChild('contactInput') contactInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  constructor(private formBuilder: FormBuilder, private atmaService: AtmaService,private sharedService: ShareService,private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
    private notification: NotificationService, private toastr: ToastrService, private datePipe: DatePipe,
    private router: Router) { this.futureDays.setDate(this.futureDays.getDate()); }

  ngOnInit(): void {
    let data = this.sharedService.branchID.value;
    this.branchId = data.id
    console.log("branchid",this.branchId)
    this.ActivityAddForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      start_date: [''],
      end_date: [''],
      contract_spend: [''],
      rm: [''],
      fidelity: [''],
      bidding: [''],
      description: [''],
      activity_status: ['', Validators.required],
      contact: this.formBuilder.group({
        designation: [''],
        // dob: [''],
        email: ['', [ Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        landline: [''],
        landline2: [''],
        mobile: [''],
        mobile2: [''],
        name: [''],
        // type_id: ['', Validators.required],
      }),
    })
    // let desgkeyvalue: String = "";
    // this.getDesignation(desgkeyvalue);

    // this.ActivityAddForm.controls.contact.get('designation_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.atmaService.get_designation(value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.designationList = datas;

    //   })
    // // let contactkeyvalue: String = "";
    // this.getContactType(contactkeyvalue);

    // this.ActivityAddForm.controls.contact.get('type_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.atmaService.get_contact(value,1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.contactTypeList = datas;

    //   })
    this.getActivityRM();

  }
  designame(){
    let desgkeyvalue: String = "";
    this.getDesignation(desgkeyvalue);

    this.ActivityAddForm.controls.contact.get('designation_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.atmaService.get_designation(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.designationList = datas;

      })
 
  }

  getActivityRM(){
    this.vendorData = this.sharedService.vendorDATA.value;
    console.log("vendortotaldata",this.vendorData)
    let employeeName = this.vendorData.rm_id.full_name
    console.log("empname", employeeName)
    this.ActivityAddForm.patchValue({
      "rm": employeeName,
    });
  }

  public displayFnDesg(desg?: Designation): string | undefined {
    // console.log('id', desg.id);
    // console.log('name', desg.name);
    return desg ? desg.name : undefined;
  }

  get desg() {
    return this.ActivityAddForm.value.get('designation_id');
  }

  public displayFnContactType(contactType?: ContactType): string | undefined {
    // console.log('id', contactType.id);
    // console.log('name', contactType.name);
    return contactType ? contactType.name : undefined;
  }

  get contactType() {
    return this.ActivityAddForm.value.get('type_id');
  }

  private getDesignation(desgkeyvalue) {
    this.atmaService.getDesignationSearch(desgkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.designationList = datas;
        // console.log("designation", datas)

      })
  }

  private getContactType(contactkeyvalue) {
    this.atmaService.getContactSearch(contactkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.contactTypeList = datas;
        // console.log("contacttype", datas)

      })
  }
  designationScroll() {
    setTimeout(() => {
      if (
        this.matdesignationAutocomplete &&
        this.autocompleteTrigger &&
        this.matdesignationAutocomplete.panel
      ) {
        fromEvent(this.matdesignationAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matdesignationAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matdesignationAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matdesignationAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matdesignationAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.get_designation(this.designationInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.designationList = this.designationList.concat(datas);
                    if (this.designationList.length >= 0) {
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
  contactScroll() {
    setTimeout(() => {
      if (
        this.matcontactAutocomplete &&
        this.autocompleteTrigger &&
        this.matcontactAutocomplete.panel
      ) {
        fromEvent(this.matcontactAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcontactAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcontactAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcontactAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcontactAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.get_contact(this.contactInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.contactTypeList = this.contactTypeList.concat(datas);
                    if (this.contactTypeList.length >= 0) {
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
  fromDateSelection(event: string) {
    console.log("fromdate", event)
    const date = new Date(event)
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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

  submitForm() {
    this.SpinnerService.show();

    if (this.ActivityAddForm.value.name === "") {
      this.toastr.error('Please Enter Activity Name');
      this.SpinnerService.hide();
      return false;
    }

    if (this.ActivityAddForm.value.type === "") {
      this.toastr.error('Please Select Any One Activity Type');
      this.SpinnerService.hide();
      return false;
    }
    // if (this.ActivityAddForm.value.start_date === "") {
    //   this.ActivityAddForm.value.start_date = null
    //   // this.toastr.error('Please Choose start Date');
    //   // this.SpinnerService.hide();
    //   // return false;
    // }
    // if (this.ActivityAddForm.value.end_date === "") {
    //   this.ActivityAddForm.value.end_date = null
    //   // this.toastr.error('Please Choose end Date');
    //   // this.SpinnerService.hide();
    //   // return false;
    // }
    if (this.ActivityAddForm.value.contract_spend === "") {
      this.ActivityAddForm.value.contract_spend = null
      // this.toastr.error('Please Enter Contract Spend');
      // this.SpinnerService.hide();
      // return false;
    }
    if (this.ActivityAddForm.value.activity_status === "") {
      this.toastr.error('Please Select Any One Activity Status');
      this.SpinnerService.hide();
      return false;
    }


    if (this.ActivityAddForm.value.contact.designation === "") {
      this.ActivityAddForm.value.contact.designation = null
    }
    if (this.ActivityAddForm.value.contact.name === "") {
      this.ActivityAddForm.value.contact.name = null
    }

    // if (this.ActivityAddForm.value.contact.designation_id === "" || this.ActivityAddForm.value.contact.designation_id.id === undefined) {
    //   this.toastr.error('Please Select Valid Designation');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    
    // if (this.ActivityAddForm.value.contact.designation === "") {
    //   this.toastr.error('Please Enter Designation');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    
    // if (this.ActivityAddForm.value.contact.name === "") {
    //   this.toastr.error('Please Enter Contact Name');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.ActivityAddForm.value.contact.mobile === "") {
    //   this.toastr.error('Please Enter MobileNo ');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    


    if(this.ActivityAddForm.value.contact.email != ""){
      var str = this.ActivityAddForm.value.contact.email
      var cleanStr_rn=str.trim();
      this.ActivityAddForm.value.contact.email = cleanStr_rn

      let a = this.ActivityAddForm.value.contact.email
      let b = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      let c = b.test(a)
      if (c === false){
        this.toastr.error('Please Enter Valid Email Id');
        this.SpinnerService.hide();
        return false;
      }
  }
      if(this.ActivityAddForm.value.contact.mobile.length != ""){
        if (this.ActivityAddForm.value.contact.mobile.length != 10){
          this.toastr.error('MobileNo length should be 10 chars');
          this.SpinnerService.hide();
          return false;
        }
      }
      
    if(this.ActivityAddForm.value.contact.mobile2.length != ""){
      if (this.ActivityAddForm.value.contact.mobile2.length != 10){
        this.toastr.error('MobileNo2 length should be 10 chars');
        this.SpinnerService.hide();
        return false;
      }
    }

    if(this.ActivityAddForm.value.contact.mobile2.length != ""){
      if (this.ActivityAddForm.value.contact.mobile2.length != 10){
        this.toastr.error('MobileNo2 length should be 10 chars');
        this.SpinnerService.hide();
        return false;
      }
    }
    
  
    const dateValue = this.ActivityAddForm.value;
    // dateValue.contact.dob = this.datePipe.transform(dateValue.contact.dob, 'yyyy-MM-dd');
    dateValue.start_date = this.datePipe.transform(dateValue.start_date, 'yyyy-MM-dd');
    dateValue.end_date = this.datePipe.transform(dateValue.end_date, 'yyyy-MM-dd');
    // this.ActivityAddForm.controls.contact.value.designation_id = this.ActivityAddForm.controls.contact.value.designation_id.id
    // this.ActivityAddForm.controls.contact.value.type_id = this.ActivityAddForm.controls.contact.value.type_id.id



    var str = this.ActivityAddForm.value.name
    var cleanStr_name=str.trim();//trim() returns string with outer spaces removed
    this.ActivityAddForm.value.name = cleanStr_name

    var str = this.ActivityAddForm.value.description
    var cleanStr_descpt=str.trim();//trim() returns string with outer spaces removed
    this.ActivityAddForm.value.description = cleanStr_descpt

   if(this.ActivityAddForm.value.contact.name != null){
    var str = this.ActivityAddForm.value.contact.name
    var cleanStr4=str.trim();//trim() returns string with outer spaces removed
    this.ActivityAddForm.value.contact.name = cleanStr4
   }

    var str = this.ActivityAddForm.value.contact.email
    var cleanStr5=str.trim();//trim() returns string with outer spaces removed
    this.ActivityAddForm.value.contact.email = cleanStr5


    if(this.ActivityAddForm.value.contact.designation != null){
      var str = this.ActivityAddForm.value.contact.designation
      var cleanStr6=str.trim();//trim() returns string with outer spaces removed
      this.ActivityAddForm.value.contact.designation = cleanStr6
    }
   



    this.atmaService.branchActivityCreateForm(this.branchId, this.ActivityAddForm.value)
      .subscribe(res => {
        if(res.id === undefined){
          this.notification.showError(res.description)
          this.SpinnerService.hide();
          return false;
        }
        else{
          this.notification.showSuccess("saved Successfully!...")
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
