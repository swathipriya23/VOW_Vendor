import { Component, OnInit, Output, EventEmitter, ViewChild, Injectable } from '@angular/core';
import { Observable, from, fromEvent } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NotificationService } from '../notification.service'
import { AtmaService } from '../atma.service'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { ShareService } from '../share.service'
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';

export interface Designation {
  id: string;
  name: string;
}
export interface ContactType {
  id: string;
  name: string;
}
export interface district {
  id: string;
  name: string;
}

export interface city {
  id: string;
  name: string;
}

export interface pincode {
  no: string;
  id: number;
}

export interface state {
  name: string;
  id: number;
}

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};
@Injectable()
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class BranchComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  branchForm: FormGroup;
  pinCodeList: Array<pincode>;
  cityList: Array<city>;
  stateList: Array<state>;
  districtList: Array<district>;
  designationList: Array<Designation>;
  contactTypeList: Array<ContactType>;
  defaultDate = new FormControl(new Date())
  today = new Date();
  setDOB: any = new Date();
  setWedding_Date: any = new Date();
  vendorId: number;
  branchButton = false;
  inputGstValue = "";
  inputPanValue = "";
  cityId: number;
  districtId: number;
  stateId: number;
  stateName_: string;
  pincodeId: number;
  dobValue: string;
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  pan_status: any;
  isGSTValid = true;
  select: any;
  GstNo: any;
  limitdays:any;
  pan: any;
  futureDays = new Date();
  Email: any;
  branchList: any;
  modificationdata:any;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('autocit') matcityAutocomplete: MatAutocomplete;
  @ViewChild('cityInput') cityInput: any;

  @ViewChild('autodis') matdistrictAutocomplete: MatAutocomplete;
  @ViewChild('districtInput') districtInput: any;

  @ViewChild('statetype') matstateAutocomplete: MatAutocomplete;
  @ViewChild('stateInput') stateInput: any;

  @ViewChild('pintype') matpincodeAutocomplete: MatAutocomplete;
  @ViewChild('pinCodeInput') pinCodeInput: any;

  @ViewChild('desg') matdesignationAutocomplete: MatAutocomplete;
  @ViewChild('designationInput') designationInput: any;

  @ViewChild('contactType') matcontactAutocomplete: MatAutocomplete;
  @ViewChild('contactInput') contactInput: any;
  composite_id: any;
  constructor(private fb: FormBuilder, private atmaService: AtmaService,
    private notification: NotificationService, private shareService: ShareService,private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService,private errorHandler: ErrorHandlingService,
    private datePipe: DatePipe, ) {
      this.futureDays.setDate(this.futureDays.getDate());
     }

  ngOnInit(): void {
    
    this.vendorId = this.shareService.vendorID.value;
    this.modificationdata = this.shareService.modification_data.value;
    console.log("modfi",this.modificationdata)
    
    this.branchForm = this.fb.group({
        name: ['', Validators.required],
        remarks: [''],
        limitdays: [''],
        creditterms: [''],
        panno: ['', ],
        gstno: ['', [Validators.pattern('^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$')]],
         address: this.fb.group({
        line1: ['', Validators.required],
        pincode_id: ['', Validators.required],
        city_id: ['', Validators.required],
        district_id: ['', Validators.required],
        state_id: ['', Validators.required],
        line2: [''],
        line3: [''],
      }),
      contact: this.fb.group({
        designation: ['', Validators.required],
        email: ['', [ 
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        landline: [''],
        landline2: [''],
        mobile: ['',Validators.required],
        mobile2: [''],
        name: ['', Validators.required],
        // dob: [''],
        // wedding_date: [''],
        // type_id: ['', Validators.required],

      }),

    })
   
    // let desgkeyvalue: String = "";
    // this.getDesignation(desgkeyvalue);

    // this.branchForm.controls.contact.get('designation_id').valueChanges
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
    // let contactkeyvalue: String = "";
    // this.getContactType(contactkeyvalue);

    // this.branchForm.controls.contact.get('type_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.atmaService.get_contact(value, 1)
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
    // let districtkeyvalue: String = "";
    // this.getDistrict(districtkeyvalue);

    // this.branchForm.controls.address.get('district_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.atmaService.get_district(value,1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.districtList = datas;

    //   })
    // let citykeyvalue: String = "";
    // this.getCity(citykeyvalue);

    // this.branchForm.controls.address.get('city_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.atmaService.get_city(value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.cityList = datas;

    //   })
    // // let pincodekeyvalue: String = "";
    // this.getPinCode(pincodekeyvalue);

    // this.branchForm.controls.address.get('pincode_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),

    //     switchMap(value => this.atmaService.get_pinCode(value,1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.pinCodeList = datas;

    //   })
    // let statekeyvalue: String = "";
    // this.getState(statekeyvalue);

    // this.branchForm.controls.address.get('state_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),

    //     switchMap(value => this.atmaService.get_state(value,1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.stateList = datas;

    //   })
      this.getbranchvendor();

  }
  designame(){
    let desgkeyvalue: String = "";
    this.getDesignation(desgkeyvalue);

    this.branchForm.controls.contact.get('designation_id').valueChanges
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
  districtname(){
    let districtkeyvalue: String = "";
    this.getDistrict(districtkeyvalue);

    this.branchForm.controls.address.get('district_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.atmaService.get_district(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList = datas;

      })
  }
  statename(){
    let statekeyvalue: String = "";
    this.getState(statekeyvalue);

    this.branchForm.controls.address.get('state_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),

        switchMap(value => this.atmaService.get_state(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;

      })

  }
  pincodename(){
    let pincodekeyvalue: String = "";
    this.getPinCode(pincodekeyvalue);

    this.branchForm.controls.address.get('pincode_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),

        switchMap(value => this.atmaService.get_pinCode(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pinCodeList = datas;

      })

  }
  cityname(){
    let citykeyvalue: String = "";
    this.getCity(citykeyvalue);

    this.branchForm.controls.address.get('city_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.atmaService.get_city(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList = datas;

      })
 
  }
  gstvalue:any;
  getbranchvendor(){
    this.atmaService.getVendor(this.vendorId)
    .subscribe(result => {
    let data = result
    this.composite_id=data.composite.id
    console.log("getbranchvendor",data );
   if(this.modificationdata.type_name== 1){
        this.pan = this.modificationdata.new_data.panno
        if(this.pan == 'PANNOTAVBL'){
          this.gstvalue = 'GSTNOTAVAILABLE'
        }  
    } else {
        this.pan = data.panno
        if(this.pan == 'PANNOTAVBL'){
          this.gstvalue = 'GSTNOTAVAILABLE'
        }
        // this.pan =data.panno;
    }
    let Gst = data.gstno;
    this.GstNo = data.gstno.slice(2, -3);
    this.branchForm.patchValue({
      "panno": this.pan,
      "gstno": this.gstvalue
      
    })
  })
  
  }
  public displayFnDesg(desg?: Designation): string | undefined {
    console.log('id', desg.id);
    console.log('name', desg.name);
    return desg ? desg.name : undefined;
  }

  get desg() {
    return this.branchForm.value.get('designation_id');
  }

  // public displayFnContactType(contactType?: ContactType): string | undefined {
  //   console.log('id', contactType.id);
  //   console.log('name', contactType.name);
  //   return contactType ? contactType.name : undefined;
  // }

  // get contactType() {
  //   return this.branchForm.value.get('type_id');
  // }

  public displaydis(autodis?: district): string | undefined {
    return autodis ? autodis.name : undefined;
  }

  get autodis() {
    return this.branchForm.controls.address.get('district_id');
  }

  public displaycit(autocit?: city): string | undefined {
    return autocit ? autocit.name : undefined;
  }
  
  get autocit() {
    return this.branchForm.controls.address.get('city_id');
  }

  public displayFnpin(pintype?: pincode): string | undefined {
    return pintype ? pintype.no : undefined;
  }
  
  get pintype() {
    return this.branchForm.controls.address.get('pincode_id');
  }

  public displayFnstate(statetype?: state): string | undefined {
    console.log('id',statetype.id);
    console.log('name',statetype.name);
    return statetype ? statetype.name : undefined;
  }
  
  get statetype() {
    return this.branchForm.controls.address.get('state_id');
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.branchForm.controls[controlName].hasError(errorName);
  }

  private getPinCode(pincodekeyvalue) {
    this.atmaService.getPinCodeSearch(pincodekeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pinCodeList = datas;
        console.log("pincode", datas)
      })
  }

  private getCity(citykeyvalue) {
    this.atmaService.getCitySearch(citykeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList = datas;
        console.log("city", datas)

      })
  }

  private getDistrict(districtkeyvalue) {
    this.atmaService.getDistrictSearch(districtkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList = datas;
        console.log("district", datas)

      })
  }

  private getState(statekeyvalue) {
    this.atmaService.getStateSearch(statekeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
        console.log("state", datas)

      })
  }
  private getDesignation(desgkeyvalue) {
    this.atmaService.getDesignationSearch(desgkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.designationList = datas;
        console.log("designation", datas)

      })
  }

  private getContactType(contactkeyvalue) {
    this.atmaService.getContactSearch(contactkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.contactTypeList = datas;
        console.log("contacttype", datas)

      })
  }
  DOBSelection(event: string) {
    const date = new Date(event)
    // this.future = new Date(date.getFullYear(), date.getMonth(), date.getDate()-1)
    this.select = new Date(date.getFullYear()+ 18, date.getMonth(), date.getDate())
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
  branchCreateForm() {
    this.SpinnerService.show();
    if(this.branchForm.value.gstno === "" && this.composite_id!=3){
      this.notification.showWarning(" GST Number Needed..");
      this.SpinnerService.hide();
      return false
    } 
    if(this.isGSTValid == false && this.branchForm.value.gstno != ""){
      this.notification.showWarning("Please Enter Valid GST");
      this.SpinnerService.hide();
      return false
    } 

    if(this.GstNo != this.pan && this.composite_id!=3){
      this.notification.showWarning(" GST And PAN Not Match..");
      this.SpinnerService.hide();
      return false
    }

    if (this.branchForm.value.name === "") {
      this.toastr.error('Please Enter Name');
      this.SpinnerService.hide();
      return false;
    }
    if (this.branchForm.value.limitdays === "") {
      this.branchForm.value.limitdays = null
      // this.toastr.error('Please Enter Limitdays');
      // this.SpinnerService.hide();
      // return false;
    }
    // if (this.branchForm.value.creditterms === "") {
    //   this.toastr.error('Please Enter Creditterms');
    //   this.SpinnerService.hide();
    //   return false;
    // }
  
    if (this.branchForm.value.contact.name === "") {
      this.toastr.error('Please Enter Contact Name');
      this.SpinnerService.hide();
      return false;
    }
   
    // if (this.branchForm.value.contact.designation_id === "" || this.branchForm.controls.contact.value.designation_id.id === undefined ) {
    //   this.toastr.error('Please Select Valid Designation Name');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    if (this.branchForm.value.contact.designation === "") {
      this.toastr.error('Please Enter Designation');
      this.SpinnerService.hide();
      return false;
    }
   
    if (this.branchForm.value.address.line1 === "") {
      this.toastr.error('Please Enter Address 1');
      this.SpinnerService.hide();
      return false;
    }
    
    if (this.branchForm.value.address.pincode_id === "" || this.branchForm.controls.address.value.pincode_id.id === undefined) {
      this.toastr.error('Please Select Valid Pincode');
      this.SpinnerService.hide();
      return false;
    }
    if (this.branchForm.value.address.city_id === "" || this.branchForm.controls.address.value.city_id.id === undefined) {
      this.toastr.error('Please Select Valid city');
      this.SpinnerService.hide();
      return false;
    }
    if (this.branchForm.value.address.district_id === "" || this.branchForm.controls.address.value.district_id.id === undefined) {
      this.toastr.error('Please Select Valid district');
      this.SpinnerService.hide();
      return false;
    }
    if (this.branchForm.value.address.state_id === "" || this.branchForm.controls.address.value.state_id.id === undefined) {
      this.toastr.error('Please Select Valid state');
      this.SpinnerService.hide();
      return false;
    }
    if (this.branchForm.value.contact.mobile === "") {
      this.toastr.error('Please Enter Mobile 1 ');
      this.SpinnerService.hide();
      return false;
    }
    
    if(this.branchForm.value.contact.email != ""){
        let a = this.branchForm.value.contact.email
        let b = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        let c = b.test(a)
        if (c === false){
          this.toastr.error('Please Enter Valid Email Id');
          this.SpinnerService.hide();
          return false;
        }
    }
        if(this.branchForm.value.contact.mobile.length != ""){
          if (this.branchForm.value.contact.mobile.length != 10){
            this.toastr.error('Mobile 1 length should be 10 chars');
            this.SpinnerService.hide();
            return false;
          }
        }
        
      if(this.branchForm.value.contact.mobile2.length != ""){
        if (this.branchForm.value.contact.mobile2.length != 10){
          this.toastr.error('Mobile 2 length should be 10 chars');
          this.SpinnerService.hide();
          return false;
        }
      }
  
 
    // const dateValue = this.branchForm.value;
    // dateValue.contact.dob = this.datePipe.transform(dateValue.contact.dob, 'yyyy-MM-dd');
    // const weddingDate = this.branchForm.value;
    // weddingDate.contact.wedding_date = this.datePipe.transform(dateValue.contact.wedding_date, 'yyyy-MM-dd');
    
      
    // if(this.branchForm.controls.contact.value.designation_id>0){
    //   this.branchForm.controls.contact.value.designation_id=this.branchForm.controls.contact.value.designation_id
    // }else{
    // this.branchForm.controls.contact.value.designation_id = this.branchForm.controls.contact.value.designation_id.id
    // }
    // this.branchForm.controls.contact.value.type_id = this.branchForm.controls.contact.value.type_id.id
    this.branchForm.controls.address.value.city_id = this.branchForm.controls.address.value.city_id.id
    this.branchForm.controls.address.value.state_id = this.branchForm.controls.address.value.state_id.id
    this.branchForm.controls.address.value.district_id = this.branchForm.controls.address.value.district_id.id
    this.branchForm.controls.address.value.pincode_id = this.branchForm.controls.address.value.pincode_id.id


    var str = this.branchForm.value.name
    var cleanStr_name=str.trim();//trim() returns string with outer spaces removed
    this.branchForm.value.name = cleanStr_name

    var str = this.branchForm.value.creditterms
    var cleanStr_credit=str.trim();//trim() returns string with outer spaces removed
    this.branchForm.value.creditterms = cleanStr_credit

    var str = this.branchForm.value.remarks
    var cleanStr_remarks=str.trim();//trim() returns string with outer spaces removed
    this.branchForm.value.remarks = cleanStr_remarks

    var str = this.branchForm.value.address.line1
    var cleanStr1=str.trim();//trim() returns string with outer spaces removed
    this.branchForm.value.address.line1 = cleanStr1

    var str = this.branchForm.value.address.line2
    var cleanStr2=str.trim();//trim() returns string with outer spaces removed
    this.branchForm.value.address.line2 = cleanStr2


    var str = this.branchForm.value.address.line3
    var cleanStr3=str.trim();//trim() returns string with outer spaces removed
    this.branchForm.value.address.line3 = cleanStr3 



    var str = this.branchForm.value.contact.name
    var cleanStr4=str.trim();//trim() returns string with outer spaces removed
    this.branchForm.value.contact.name = cleanStr4

    var str = this.branchForm.value.contact.email
    var cleanStr5=str.trim();//trim() returns string with outer spaces removed
    this.branchForm.value.contact.email = cleanStr5


    
    var str = this.branchForm.value.contact.designation
    var cleanStr6=str.trim();//trim() returns string with outer spaces removed
    this.branchForm.value.contact.designation = cleanStr6


    // var str = this.branchForm.value.contact.dob
    // var cleanStr6=str.trim();//trim() returns string with outer spaces removed
    // this.branchForm.value.contact.dob = cleanStr6

    // var str = this.branchForm.value.contact.wedding_date
    // var cleanStr7=str.trim();//trim() returns string with outer spaces removed
    // this.branchForm.value.contact.wedding_date = cleanStr7

    // var str = this.branchForm.value.contact.landline
    // var cleanStr8=str.trim();//trim() returns string with outer spaces removed
    // this.branchForm.value.contact.landline = cleanStr8

    // var str = this.branchForm.value.contact.landline2
    // var cleanStr9=str.trim();//trim() returns string with outer spaces removed
    // this.branchForm.value.contact.landline2 = cleanStr9

    // var str = this.branchForm.value.contact.mobile
    // var cleanStr10=str.trim();//trim() returns string with outer spaces removed
    // this.branchForm.value.contact.mobile = cleanStr10

    // var str = this.branchForm.value.contact.mobile2
    // var cleanStr11=str.trim();//trim() returns string with outer spaces removed
    // this.branchForm.value.contact.mobile2 = cleanStr11
    if(this.composite_id == 3 && this.branchForm.value.gstno === undefined){
      this.branchForm.value.gstno = 'GSTNOTAVAILABLE'
    }
    
    


    this.atmaService.branchFormCreate(this.vendorId, this.branchForm.value)
      .subscribe((res) => {
        console.log("resultzzz",res)
        if(res.vendor_id==this.vendorId)  {
          this.notification.showSuccess("Saved Successfully!...")
          this.SpinnerService.hide();
          this.onSubmit.emit();
        }else{
         
            this.notification.showError(res.description)
            this.SpinnerService.hide();
            // this.designationInput.nativeElement.value = null;
            this.pinCodeInput.nativeElement.value = null;
            this.cityInput.nativeElement.value = null;
            this.districtInput.nativeElement.value = null;
            this.stateInput.nativeElement.value = null;
            // this.branchForm.controls.contact.value.designation_id = ""
            this.branchForm.controls.address.value.pincode_id = ""
            this.branchForm.controls.address.value.city_id = ""
            this.branchForm.controls.address.value.district_id = ""
            this.branchForm.controls.address.value.state_id = ""
            return false;
          
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
   
    
  }

  numberOnlyForValidation(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  numberOnly(limitdays): boolean {
    // const charCode = (event.which) ? event.which : event.keyCode;
    // 
    if (limitdays > 120) {
      // this..value.=0
      this.toastr.error("You've exceeded the maximum limitted days"); 
      this.branchForm.get('limitdays').setValue(0);
      
      return false;
    }
    return true;
  }

  // Only Numbers with Decimals
  keyPressNumbersDecimal(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  setDob(date: string) {
    this.setDOB = date
    this.setDOB = this.datePipe.transform(this.setDOB, 'dd-MMM-yyyy');
    console.log("setDOB   " + this.setDOB)
    return this.setDOB;
  }

  setWeddingDate(date: string) {
    this.setWedding_Date = date;
    this.setWedding_Date = this.datePipe.transform(this.setWedding_Date, 'dd-MMM-yyyy');
    console.log("setWedding_Date", this.setWedding_Date)

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

  // validationPAN(e) {
  //   let panno = e.target.value;
  //   this.atmaService.getBracnhPanNumber(panno)
  //     .subscribe(res => {
  //       let result = res.validation_status
  //       this.pan_status = result
  //       if (result === false) {
  //         this.notification.showWarning("Please Enter a Valid PAN Number")
  //       } else {
  //         this.notification.showSuccess(" Pan Number Validated...")
  //       }
  //     })
    
  // }

  validationGstNo(e) {
    let gstno = e.target.value;
    if(gstno!=''){
      this.SpinnerService.show();
    let gst = gstno
    gst = gst.slice(2, -3);
    this.GstNo = gst;
    console.log("gst------",this.GstNo)

    this.atmaService.getBracnhGSTNo(gstno)
      .subscribe(res => {
        let result = res.validation_status
        
      
        if (result === false) {
          this.notification.showWarning("Please Enter a Valid GST Number")
          this.isGSTValid = false
          this.SpinnerService.hide();
        } else {
          this.notification.showSuccess(" GST Number Validated...")
          this.isGSTValid = true
          this.SpinnerService.hide();
        }
      },
      error => {
        this.notification.showWarning("GST validation failure")
        this.SpinnerService.hide();
      }
      )}
  }
  // validationGstNo(event) {
  //   let gstno = event.target.value;
  //   let gst = gstno
  //   gst = gst.slice(2, -3);
  //   this.GstNo = gst;
  //   console.log("gst------",this.GstNo)
  // }

  validationPAN(event) {
    let panno = event.target.value;
    this.pan = panno
    console.log("pan", this.pan)
  }

  pinCode(data) {
    this.cityId = data.city;
    this.districtId = data.district;
    this.stateId = data.state;
    this.pincodeId = data
    this.branchForm.patchValue({
      address: {
        city_id: this.cityId,
        district_id: this.districtId,
        state_id: this.stateId,
        pincode_id: this.pincodeId
      }
    })
  } 

  citys(data) {
    console.log("Dddddddddd",data)
    this.cityId = data;
    this.districtId = data.district;
    this.stateId = data.state;
    this.pincodeId = data.pincode;
    this.branchForm.patchValue({
      address: {
        city_id: this.cityId,
        state_id: this.stateId,
        district_id: this.districtId,
        pincode_id: this.pincodeId
      }
    })
  }
  cityScroll() {
    setTimeout(() => {
      if (
        this.matcityAutocomplete &&
        this.autocompleteTrigger &&
        this.matcityAutocomplete.panel
      ) {
        fromEvent(this.matcityAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcityAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcityAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcityAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcityAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.get_city(this.cityInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.cityList = this.cityList.concat(datas);
                    if (this.cityList.length >= 0) {
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
  districtScroll() {
    setTimeout(() => {
      if (
        this.matdistrictAutocomplete &&
        this.autocompleteTrigger &&
        this.matdistrictAutocomplete.panel
      ) {
        fromEvent(this.matdistrictAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matdistrictAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matdistrictAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matdistrictAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matdistrictAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.get_district(this.districtInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.districtList = this.districtList.concat(datas);
                    if (this.districtList.length >= 0) {
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
  stateScroll() {
    setTimeout(() => {
      if (
        this.matstateAutocomplete &&
        this.autocompleteTrigger &&
        this.matstateAutocomplete.panel
      ) {
        fromEvent(this.matstateAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matstateAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matstateAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matstateAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matstateAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.get_state(this.stateInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.stateList = this.stateList.concat(datas);
                    if (this.stateList.length >= 0) {
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
  pinCodeScroll() {
    setTimeout(() => {
      if (
        this.matpincodeAutocomplete &&
        this.autocompleteTrigger &&
        this.matpincodeAutocomplete.panel
      ) {
        fromEvent(this.matpincodeAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matpincodeAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matpincodeAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matpincodeAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matpincodeAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.get_pinCode(this.pinCodeInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.pinCodeList = this.pinCodeList.concat(datas);
                    if (this.pinCodeList.length >= 0) {
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
}
