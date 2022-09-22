import { Component, OnInit, Output, EventEmitter, ViewChild, Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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

export interface RM {
  id: string;
  full_name: string;
}
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

export interface classification {
  id: string;
  text: string;
}
export interface composite {
  id: string;
  text: string;
}
export interface vendortype {
  id: string;
  text: string;
}
export interface orgtype {
  id: string;
  text: string;
}
export interface category {
  id: string;
  text: string;
}
export interface subcategory {
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
  }
};

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
  selector: 'app-create-vendor',
  templateUrl: './create-vendor.component.html',
  styleUrls: ['./create-vendor.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class CreateVendorComponent implements OnInit {
  @ViewChild('name') inputName;
  @ViewChild('sign') inputsignName;
  @ViewChild('pan') inputpanName;
  vendorAddForm: FormGroup;
  compositeList: Array<composite>;
  groupList: Array<category>;
  custcategoryList: Array<subcategory>;
  classificationList: Array<classification>;
  typeList: Array<vendortype>;
  orgtypeList: Array<orgtype>;
  employeeList: Array<RM>;
  pinCodeList: Array<pincode>;
  cityList: Array<city>;
  stateList: Array<state>;
  districtList: Array<district>;
  designationList: Array<Designation>;
  contactTypeList: Array<ContactType>;
  Contract = false;
  fromdate: any;
  todate: Date;
  renewaldate: Date;
  totalEmployee: any;
  permanentEmployee: any;
  temporaryEmployee: any;
  inputGstValue = "";
  inputPanValue = "";
  inputvendor = "";
  cityId: number;
  districtId: number;
  stateId: number;
  pincodeId: number;
  directorNameList = [];
  vendorButton = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  pan_status: any;
  gst_status: any;
  stateID= 0;
  has_districtnext = false;
  has_districtprevious = true;
  districtcurrentpage: number = 1;
  has_citynext = true;
  has_cityprevious = true;
  citycurrentpage: number = 1;
  GstNo: any;
  pan: any;
  futureDays = new Date();
  addButton= false;
  array : number;
  list : string;
  yesflag= false;
  reason_flag =false;
  checkboxForregular = false
  sanction = [{ id: 'Y', name: "YES" }, { id: 'N', name: "NO" }] 
  matchfound = [{ id: 'Y', name: "YES" }, { id: 'N', name: "NO" }]
  // RiskList:any=[{id:1,value:"Information security risk"},{id:2,value:"Reputational risk"},
  // {id:3,value:"Operational risk"},{id:4,value:"Counterparty Risk"},{id:5,value:"Service risk"},
  // {id:6,value:"Service disruption risk"},{id:7,value:"Termination"},{id:8,value:"discontinuation risk"},
  // {id:9,value:"Concentration risk"},{id:10,value:"Non-compliance risk"}]
  
  

  isLoading = false;
  
  @ViewChild('rmemp') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('rmInput') rmInput: any;

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

  @ViewChild('classify') matclassifyAutocomplete: MatAutocomplete;
  @ViewChild('classifyInput') classifyInput: any;

  @ViewChild('gstcat') matgstAutocomplete: MatAutocomplete;
  @ViewChild('gstInput') gstInput: any;
  panvalname='';

 



  constructor(private formBuilder: FormBuilder, private atmaService: AtmaService,private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
    private notification: NotificationService, private toastr: ToastrService, private datePipe: DatePipe,
    private router: Router,private shareService: ShareService) {
      this.futureDays.setDate(this.futureDays.getDate());
     }

  ngOnInit(): void {
    this.vendorAddForm = this.formBuilder.group({
    
      name: ['', Validators.required],
      panno: ['', [Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      gstno: ['', [Validators.pattern('^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$')]],
      // panno: ['', Validators.required],hello
      // gstno: ['', Validators.required],
      composite: ['', Validators.required],
      comregno: [''],
      group: ['', Validators.required],
      custcategory_id: ['', Validators.required],
      classification: ['', Validators.required],
      type: ['', Validators.required],
      website: ['', [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      description:[''],
      // risktype: ['',Validators.required],
      // risktype_description:['',Validators.required],
      // risk_mitigant: ['',Validators.required],
      // risk_mitigant_review:['',Validators.required],
      activecontract: [''],
      nocontract_reason: [{ value: "", disabled: isBoolean }],
      contractdate_from: [{ value: "", disabled: isBoolean }],
      contractdate_to: [{ value: "", disabled: isBoolean }],
      aproxspend: ['0.0'],
      actualspend: ['0.0'],
      orgtype: ['', Validators.required],
      renewal_date: [''],
      remarks: [''],
      rm_id: ['', Validators.required],
      // adhaarno: ['', [Validators.pattern('[0-9]{12}')]],
      director_count: ['0'],
      emaildays: ['30'],
      address: this.formBuilder.group({
        line1: ['', Validators.required],
        line2: [''],
        line3: [''],
        pincode_id: ['', Validators.required],
        city_id: ['', Validators.required],
        district_id: ['', Validators.required],
        state_id: ['', Validators.required],
      }),
      contact: this.formBuilder.group({
        designation: ['', Validators.required],
        // dob: [''],
        email: ['', [ Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        // email: ['', [ Validators.required]],
        // landline: ['', Validators.required],
        // landline2: ['', Validators.required],
        // mobile: ['', Validators.required],
        // mobile2: ['', Validators.required],
        landline: [''],
        landline2: [''],
        mobile: [''],
        mobile2: [''],
        name: ['', Validators.required],
        // type_id: ['', Validators.required],
      }),
      profile: this.formBuilder.group({
        year: [''],
        associate_year: [''],
        // award_details: [''],
        // permanent_employee: [''],
        // temporary_employee: [''],
        // total_employee: [''],
        branch: ['', Validators.required],
        // factory: [''],
        remarks: [''],
      }),
      director: this.formBuilder.group({
        name: [''],
        // d_sign: [''],
        d_pan: [''],
        // d_sanctions: [''],
        // d_match: ['']
      }),
    })
    // this.getOrgType();
    // this.getRiskType_List();
  } 

  
  rmname(){
  let rmkeyvalue: String = "";
    this.getRmEmployee(rmkeyvalue);

    this.vendorAddForm.get('rm_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.atmaService.getEmployeeSearchFilter2(value,1)
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
    districtname(){
      let districtkeyvalue: String = "";
    this.getDistrict(districtkeyvalue);

    this.vendorAddForm.controls.address.get('district_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.atmaService.get_districtValue(this.stateID,value,1)
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
    cityname(){
      let citykeyvalue: String = "";
    this.getCity(citykeyvalue);

    this.vendorAddForm.controls.address.get('city_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.atmaService.get_city(value,1)
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
    pincodename(){
      let pincodekeyvalue: String = "";
    this.getPinCode(pincodekeyvalue);

    this.vendorAddForm.controls.address.get('pincode_id').valueChanges
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
    statename(){
      let statekeyvalue: String = "";
    this.getState(statekeyvalue);

    this.vendorAddForm.controls.address.get('state_id').valueChanges
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
    designationname(){
      let desgkeyvalue: String = "";
    this.getDesignation(desgkeyvalue);
    this.vendorAddForm.controls.contact.get('designation_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.atmaService.get_designation(value,1)
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
  classifyname(){
   
    this.getClassification();

    this.vendorAddForm.get('classification').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.atmaService.getClassification()
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
            
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.classificationList = datas;

      })
  }
  compositename(){
    let gstkeyvalue: String = "";
   
    this.getComposite(gstkeyvalue);

    this.vendorAddForm.get('composite').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.atmaService.getComposite(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
            
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.compositeList = datas;

      })
  }
  typename(){
    
   
      this.getType();
  
      this.vendorAddForm.get('type').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.atmaService.getType()
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
              
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.typeList = datas;
  
        })
    }
    orgtypename(){
      let orgkeyvalue: String = "";
      this.getOrgType(orgkeyvalue);
  
      this.vendorAddForm.get('orgtype').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.atmaService.getOrgType(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
              
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.orgtypeList = datas;
  
        })
    }
    categoryname(){
      this.getGroup();
  
      this.vendorAddForm.get('group').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.atmaService.getGroup()
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
              
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.groupList = datas;
  
        })
    }
    subcategoryname(){
      let vendorkeyvalue: String = "";
      this.getCustCategory(vendorkeyvalue);
  
      this.vendorAddForm.get('custcategory_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.atmaService.getCustCategory(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
              
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.custcategoryList = datas;
  
        })

    }
  
  directorCount() {
    let count = this.vendorAddForm.value.director_count;
    this.addButton = false;
    console.log("number", count)
  }

  addDirectorName() {
   
    let count = this.vendorAddForm.value.director_count
    let name = this.vendorAddForm.value.director.name
    // let directorsign = this.vendorAddForm.value.director.d_sign
    let directorpan = this.vendorAddForm.value.director.d_pan
    // let directorsanction = this.vendorAddForm.value.director.d_sanctions
    // let matchfound = this.vendorAddForm.value.director.d_match
    if (count == 0){
      this.notification.showWarning("Please Enter valid Director count")
    }
    else if (count ==""){
      this.notification.showWarning("Please Fill Director count")
    } else if (name == ""){
      this.notification.showWarning("Please Fill Director Name")
    } 
    // else if (directorsign == ""){
    //   this.notification.showWarning("Please Fill Authorised Signatories")
    // } 
    else if (directorpan == ""){
      this.notification.showWarning("Please Fill Director PAN")
    } 
    // else if (directorsanction == ""){
    //   this.notification.showWarning("Please Fill Sanctions Screening Conducted")
    // } else if (matchfound == ""){
    //   this.notification.showWarning("Please Fill Match Found")
    // } 
     else {
      let data = {
        name: name,
        // d_sign:directorsign,
        d_pan:directorpan,
        // d_sanctions:directorsanction,
        // d_match: matchfound
      }
      let arraySize = this.directorNameList.length
      if (count > arraySize) {
        this.directorNameList.push(data);
        this.array= this.directorNameList.length
        this.list = this.array.toString();
        if (count === this.list){
          this.addButton = true;
        }
        console.log("aa", this.directorNameList)
        this.inputName.nativeElement.value = ' ';
        this.vendorAddForm.value.director.name= [];
        // this.inputsignName.nativeElement.value = ' ';
        // this.vendorAddForm.value.director.d_sign= [];
        this.inputpanName.nativeElement.value = ' ';
        this.vendorAddForm.value.director.d_pan= [];
        // this.vendorAddForm.controls.director.get('d_sanctions').reset('');
        // this.vendorAddForm.controls.director.get('d_match').reset('');
      }  
  

    }
  }

  directorNameDelete(index: number) {
    this.directorNameList.splice(index, 1);
    let count = this.vendorAddForm.value.director_count
    this.array = this.directorNameList.length
    this.list = this.array.toString();
    if (count === this.list){
        this.addButton = true;
    } else {
      this.addButton =false;
    }

  }

  public displayFnRm(rmemp?: RM): string | undefined {
    return rmemp ? rmemp.full_name : undefined;
  }

  get rmemp() {
    return this.vendorAddForm.value.get('rm_id');
  }

  public displayFnDesg(desg?: Designation): string | undefined {
    return desg ? desg.name : undefined;
  }

  get desg() {
    return this.vendorAddForm.value.get('designation_id');
  }

  // public displayFnContactType(contactType?: ContactType): string | undefined {
  //   return contactType ? contactType.name : undefined;
  // }

  // get contactType() {
  //   return this.vendorAddForm.value.get('type_id');
  // }

  public displaydis(autodis?: district): string | undefined {
    return autodis ? autodis.name : undefined;
  }

  get autodis() {
    return this.vendorAddForm.controls.address.get('district_id');
  }

  public displaycit(autocit?: city): string | undefined {
    return autocit ? autocit.name : undefined;
  }
  
  get autocit() {
    return this.vendorAddForm.controls.address.get('city_id');
  }

  public displayFnpin(pintype?: pincode): string | undefined {
    return pintype ? pintype.no : undefined;
  }
  
  get pintype() {
    return this.vendorAddForm.controls.address.get('pincode_id');
  }

  public displayFnstate(statetype?: state): string | undefined {
    return statetype ? statetype.name : undefined;
  }
  
  get statetype() {
    return this.vendorAddForm.controls.address.get('state_id');
  }
  public displayFnclassify(classify?: classification): string | undefined {
    return classify ? classify.text : undefined;
  }
  
  get classify() {
    return this.vendorAddForm.get('classification');
  }
  public displayFngst(gstcat?: composite): string | undefined {
    return gstcat ? gstcat.text : undefined;
  }
  
  get gstcat() {
    return this.vendorAddForm.get('composite');
  }
  public displayFntypes(ventype?: vendortype): string | undefined {
    return ventype ? ventype.text : undefined;
  }
  
  get ventype() {
    return this.vendorAddForm.get('type');
  }
  public displayFnorgtypes(orgtype?: orgtype): string | undefined {
    return orgtype ? orgtype.text : undefined;
  }
  
  get orgtype() {
    return this.vendorAddForm.get('orgtype');
  }
  public displayFncategory(categorytype?: category): string | undefined {
    return categorytype ? categorytype.text : undefined;
  }
  
  get categorytype() {
    return this.vendorAddForm.get('group');
  }
  
  public displayFnsubcategory(subcategory?: subcategory): string | undefined {
    return subcategory ? subcategory.name : undefined;
  }
  
  get subcategory() {
    return this.vendorAddForm.get('custcategory_id');
  }

  private getRmEmployee(rmkeyvalue) {
    this.atmaService.getEmployeeSearchFilter2(rmkeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
      })
  }
  private getComposite(gstkeyvalue) {
    this.atmaService.getComposite(gstkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.compositeList = datas;
        // console.log("composite", datas)
      })
  }

  private getGroup() {
    this.atmaService.getGroup()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.groupList = datas;
      })
  }

  panFlag= false;
  composite_ID:any;
  is_unreg = false;
  compositeFocusOut(data) {
    this.composite_ID = data.id;
    if(this.composite_ID != 3){
      this.panFlag = true;
      this.is_unreg = false;
      this.vendorAddForm.patchValue({
        "panno":  ""
      })
    } else {
      this.panFlag = false;
      let st = 'PANNOTAVBL'
      this.is_unreg = true;
      this.vendorAddForm.patchValue({
        "panno":  st
      })
    }
  }



  private getCustCategory(vendorkeyvalue) {
    this.atmaService.getCustCategory(vendorkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.custcategoryList = datas;
      })
  }

  private getClassification() {
    this.atmaService.getClassification()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.classificationList = datas;
      })
  }

  private getType() {
    this.atmaService.getType()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.typeList = datas;
      })
  }

  selectVendorType(data) {
     if(data.text=="ONE_TIME"){
      this.checkboxForregular = false;
      this.vendorAddForm.get('contractdate_from').disable();
      this.vendorAddForm.get('contractdate_from').reset();
      this.vendorAddForm.get('contractdate_to').disable();
      this.vendorAddForm.get('contractdate_to').reset();
      this.vendorAddForm.get('nocontract_reason').disable();
      this.vendorAddForm.get('renewal_date').reset();
      this.yesflag = false;
      this.reason_flag = false;
      this.vendorAddForm.controls["activecontract"].reset('');
      this.toastr.warning('', 'Contract/Letter of engagement/email can be acceptable', { timeOut: 2000 });
     } else {
      this.checkboxForregular = true;
     }
}

  private getOrgType(orgkeyvalue) {
    this.atmaService.getOrgType(orgkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.orgtypeList = datas;
      })
  }

  private getPinCode(pincodekeyvalue) {
    this.atmaService.get_pinCode(pincodekeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pinCodeList = datas;
        // console.log("pincode", datas)
      })
  }

  private getCity(citykeyvalue) {
    this.atmaService.getCitySearch(citykeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList = datas;
        // console.log("city", datas)

      })
  }

  private getDistrict(districtkeyvalue) {
    this.atmaService.districtdropdown(this.stateID,districtkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList = datas;
        // console.log("district", datas)

      })
  }

  private getState(statekeyvalue) {
    this.atmaService.getStateSearch(statekeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
        // console.log("state", datas)

      })
  }
  private getDesignation(desgkeyvalue) {
    this.atmaService.getDesignationSearch(desgkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.designationList = datas;
        // console.log("designation", datas)

      })
  }

  // private getContactType(contactkeyvalue) {
  //   this.atmaService.getContactSearch(contactkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.contactTypeList = datas;
  //     })
  // }
  autocompleteRMScroll() {
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
                this.atmaService.getEmployeeSearchFilter2(this.rmInput.nativeElement.value, this.currentpage + 1)
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
                this.atmaService.get_districtValue(this.stateID,this.districtInput.nativeElement.value, this.currentpage + 1)
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
  // contactScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matcontactAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matcontactAutocomplete.panel
  //     ) {
  //       fromEvent(this.matcontactAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matcontactAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matcontactAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matcontactAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matcontactAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.atmaService.get_contact(this.contactInput.nativeElement.value, this.currentpage + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.contactTypeList = this.contactTypeList.concat(datas);
  //                   if (this.contactTypeList.length >= 0) {
  //                     this.has_next = datapagination.has_next;
  //                     this.has_previous = datapagination.has_previous;
  //                     this.currentpage = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }
  states(data){
    console.log("state",data)
    let id = data.id
    this.stateID = id
    this.districtInput.nativeElement.value =  ' ';
    let districtkeyvalue: String = "";
    this.getDistrict(districtkeyvalue);
    // this.cityInput.nativeElement.value =  ' ';
    // let districtkey: String = "";
    // this.atmaService.get_districtValue(this.stateID , districtkey, this.districtcurrentpage)
    //   .subscribe((results: any[]) => {
    //     console.log("district",results)
    //     let datas = results["data"];
    //     let datapagination = results["pagination"];
    //     this.districtList = datas;
    //     if (this.districtList.length >= 0) {
    //       this.has_districtnext = datapagination.has_next;
    //       this.has_districtprevious = datapagination.has_previous;
    //       this.districtcurrentpage = datapagination.index;
    //     }
    //    })

  }
  districts(data){
    this.cityInput.nativeElement.value =  ' ';
    let citykey: String = "";
    this.atmaService.get_cityValue(this.stateID , citykey)
      .subscribe((results: any[]) => {
        console.log("city",results)
        let datas = results["data"];
        this.cityList = datas;
       })

  }

  pinCode(data) {
    this.cityId = data.city;
    this.districtId = data.district;
    this.stateId = data.state;
    this.pincodeId = data
    this.vendorAddForm.patchValue({
      address: {
        city_id: this.cityId,
        district_id: this.districtId,
        state_id: this.stateId,
        pincode_id: this.pincodeId
      }
    })
  }

  citys(data) {
    this.cityId = data;
    this.districtId = data.district;
    this.stateId = data.state;
    this.pincodeId = data.pincode;
    this.vendorAddForm.patchValue({
      address: {
        city_id: this.cityId,
        state_id: this.stateId,
        district_id: this.districtId,
        pincode_id: this.pincodeId
      }
    })
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  validationPAN(e) {
    let panno = e.target.value;
   
    if(panno.length==10){
      this.SpinnerService.show();
    this.atmaService.getVendorPanNumber(panno)
      .then(res => {
        let result = res.validation_status
        this.pan_status = result
        if(this.pan_status == "Success"){
          this.notification.showSuccess("PAN Number validated...")
          this.SpinnerService.hide();
        }
        // if (result.pan != panno) {
        //   this.notification.showWarning("Please Enter a Valid PAN Number")
        //   this.panvalname=''
        //   this.SpinnerService.hide();
        // } if (result.pan == panno) {
        //   this.notification.showSuccess("PAN Number validated...")
        //   this.panvalname=res.validation_status.firstName + res.validation_status.lastName
        //   this.SpinnerService.hide();
        // }
        // else{
        //   this.notification.showWarning("Please Enter a Valid PAN Number")
        //   this.panvalname=''
        //   this.SpinnerService.hide();
        // }

      }, 
      error => {
        this.notification.showWarning("PanNo validation failure")
        this.SpinnerService.hide();
      }
      
       
      )
    }
  }

  // name duplication
  name_duplication(e) {
    let panno = e.target.value;
   
    // this.SpinnerService.show();
    this.atmaService.getName_duplication(panno)
      .then(res => {
        // let result = res.validation_status
        // this.pan_status = result
        if(res.validation_status == false){
          this.notification.showWarning("Name Duplication occur...")
          // this.SpinnerService.hide();
        }
      }, 
      error => {
        this.notification.showWarning("Name Validation API Failure")
        this.SpinnerService.hide();
      }
      
       
      )
  } 

  // validationGstNo(e) {
    
  //   let gstno = e.target.value;
  //   if(gstno==""){
  //   this.atmaService.getVendorGstNumber(gstno)
  //     .subscribe(res => {
  //       let result = res.validation_status
  //       this.gst_status = result
  //       if (result === false) {
  //         this.notification.showWarning("Please Enter a Valid GST Number")
  //       } else {
  //         this.notification.showSuccess("GST Number validated...")
  //       }

  //     })}
  // }
  // validationGstNo(event) {
  //   let gstno = event.target.value;
  //   let gst = gstno
  //   gst = gst.slice(2, -3);
  //   this.GstNo = gst;
  //   console.log("gst------",this.GstNo)
  // }

  // validationPAN(event) {
  //   let panno = event.target.value;
  //   this.pan = panno
  //   console.log("pan", this.pan)
  // }

  namevalidation(event){
    
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9 ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  addressvalidation(event){
    
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9-_#@.', &/]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  onClick() {
    console.log("click", this.Contract)
    if (this.Contract === false) {
      this.vendorAddForm.get('nocontract_reason').disable();
      this.vendorAddForm.get('contractdate_from').enable();
     
      this.vendorAddForm.get('contractdate_to').enable();
      this.yesflag = true
      this.reason_flag = false
    } else {
      this.vendorAddForm.get('contractdate_from').disable();
      this.vendorAddForm.get('contractdate_from').reset();
      this.vendorAddForm.get('contractdate_to').disable();
      this.vendorAddForm.get('contractdate_to').reset();
      this.vendorAddForm.get('nocontract_reason').enable();
      this.vendorAddForm.get('renewal_date').reset();
      this.yesflag = false
      this.reason_flag = true
    }
  }

  fromDateSelection(event: string) {
    console.log("fromdate", event)
    const date = new Date(event)
    console.log(date, 'test')
    console.log("ss", this.vendorAddForm.value.contractdate_from)
    this.fromdate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.todate = new Date(date.getFullYear(), date.getMonth() + 12, date.getDate())
    this.renewaldate = new Date(date.getFullYear(), date.getMonth() + 11, date.getDate())
  }

  totalFromPermanentEmployee(event) {
    if (this.temporaryEmployee != undefined){
         this.temporaryEmployee = this.temporaryEmployee
    } else {
      this.temporaryEmployee = 0;
    }
    this.totalEmployee = parseInt(this.permanentEmployee) + parseInt(this.temporaryEmployee);
  }

  totalFromTemporaryEmployee(event) {
    if (this.permanentEmployee != undefined){
      this.permanentEmployee = this.permanentEmployee
 } else {
   this.permanentEmployee = 0;
 }
    this.totalEmployee = parseInt(this.permanentEmployee) + parseInt(this.temporaryEmployee);
  }

  RiskList:any;
  getRiskType_List() {
    this.atmaService.getRiskType()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.RiskList = datas;
      })
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

  
  createFormate() {
    let data = this.vendorAddForm.controls;
    let datas = this.vendorAddForm.controls.address
    let datass = this.vendorAddForm.controls.contact
    let datasss = this.vendorAddForm.controls.profile
    let datassss = this.vendorAddForm.controls.director
    let vendorclass = new vendor();
    // vendorclass.code = data['code'].value;
    // vendorclass.name = data['name'].value;
    vendorclass.panno = data['panno'].value;
    vendorclass.gstno = data['gstno'].value;
    vendorclass.composite = data['composite'].value.id;
    // vendorclass.comregno = data['comregno'].value;
    vendorclass.group = data['group'].value.id;
    vendorclass.custcategory_id = data['custcategory_id'].value.id;
    vendorclass.classification = data['classification'].value.id;
    vendorclass.type = data['type'].value.id;
    // vendorclass.website = data['website'].value;
    vendorclass.activecontract = data['activecontract'].value;
    // vendorclass.nocontract_reason = data['nocontract_reason'].value;
    vendorclass.contractdate_from = data['contractdate_from'].value;
    vendorclass.contractdate_to = data['contractdate_to'].value;
    vendorclass.aproxspend = data['aproxspend'].value;
    vendorclass.actualspend = data['actualspend'].value;
    vendorclass.orgtype = data['orgtype'].value.id;
    vendorclass.renewal_date = data['renewal_date'].value;
    // vendorclass.remarks = data['remarks'].value;
    vendorclass.rm_id = data['rm_id'].value.id;
    // vendorclass.adhaarno = data['adhaarno'].value;
    // vendorclass.director_count = data['director_count'].value;
    // vendorclass.emaildays = data['emaildays'].value;
    if (data['emaildays'].value === "") {
      if(this.yesflag == false){ 
        vendorclass.emaildays = null
      }
    } else {
      vendorclass.emaildays = data['emaildays'].value;
    }

    vendorclass.description = data['description'].value;
    // vendorclass.risktype = data['risktype'].value;
    // vendorclass.risktype_description = data['risktype_description'].value;
    // vendorclass.risk_mitigant = data['risk_mitigant'].value;
    // vendorclass.risk_mitigant_review = data['risk_mitigant_review'].value;


    var str = datas.value.line1
    var cleanStr_l1=str.trim();//trim() returns string with outer spaces removed
    // vendorclass.name = cleanStr_l1

    var str = datas.value.line2
    var cleanStr_l2=str.trim();//trim() returns string with outer spaces removed

    var str = datas.value.line3
    var cleanStr_l3=str.trim();//trim() returns string with outer spaces removed

    let address1 = {
      line1: cleanStr_l1,
      line2: cleanStr_l2,
      line3: cleanStr_l3,
      city_id: datas.value.city_id.id,
      district_id: datas.value.district_id.id,
      state_id: datas.value.state_id.id,
      pincode_id: datas.value.pincode_id.id
    }
    vendorclass.address = address1;


    var str = datass.value.email
    var cleanStr_email=str.trim();//trim() returns string with outer spaces removed

    var str = datass.value.name
    var cleanStr_c_name=str.trim();//trim() returns string with outer spaces removed

    
    var str = datass.value.designation
    var cleanStr_c_des=str.trim();//trim() returns string with outer spaces removed

    let contact1 = {
      // designation_id: datass.value.designation_id.id,
      designation: cleanStr_c_des,
      // dob: datass.value.dob,
      email: cleanStr_email,
      landline: datass.value.landline,
      landline2: datass.value.landline2,
      mobile: datass.value.mobile,
      mobile2: datass.value.mobile2,
      name: cleanStr_c_name,
      // type_id: datass.value.type_id.id
    }
    vendorclass.contact = contact1;

    // var str = datasss.value.award_details
    // var cleanStr_av=str.trim();//trim() returns string with outer spaces removed

    var str = datasss.value.remarks
    var cleanStr_rem=str.trim();//trim() returns string with outer spaces removed

    let profile1 = {
      year: datasss.value.year,
      associate_year: datasss.value.associate_year,
      // award_details: cleanStr_av,
      // permanent_employee: datasss.value.permanent_employee,
      // temporary_employee: datasss.value.temporary_employee,
      // total_employee: datasss.value.total_employee,
      branch: datasss.value.branch,
      // factory: datasss.value.factory,
      remarks: cleanStr_rem
    }
    vendorclass.profile = profile1;
    
    let datadelete= vendorclass.profile

    for(let i in datadelete){
      if (!datadelete[i]){
        delete datadelete[i]
      } 
    }
    console.log('delete',datadelete)
    
    let dateValue = this.vendorAddForm.value;
    vendorclass.contractdate_from = this.datePipe.transform(dateValue.contractdate_from, 'yyyy-MM-dd');
    vendorclass.contractdate_to = this.datePipe.transform(dateValue.contractdate_to, 'yyyy-MM-dd');
    vendorclass.renewal_date = this.datePipe.transform(dateValue.renewal_date, 'yyyy-MM-dd');
    // vendorclass.contact.dob = this.datePipe.transform(dateValue.contact.dob, 'yyyy-MM-dd');


    var str = data['name'].value
    var cleanStr_name=str.trim();//trim() returns string with outer spaces removed
    vendorclass.name = cleanStr_name

    var str = data['comregno'].value
    var cleanStr_spe=str.trim();//trim() returns string with outer spaces removed
    vendorclass.comregno = cleanStr_spe

    var str = data['website'].value
    var cleanStr_rk=str.trim();//trim() returns string with outer spaces removed
    vendorclass.website = cleanStr_rk
    
    var str = data['remarks'].value
    var cleanStr_cp=str.trim();//trim() returns string with outer spaces removed
    vendorclass.remarks = cleanStr_cp 

    var str = data['director_count'].value
    var cleanStr_dc=str.trim();//trim() returns string with outer spaces removed
    vendorclass.director_count = cleanStr_dc

    var str = data['nocontract_reason'].value
    var cleanStr_rn=str.trim();//trim() returns string with outer spaces removed
    vendorclass.nocontract_reason = cleanStr_rn

    var str = data['description'].value;
    var cleanStr_des=str.trim();//trim() returns string with outer spaces removed
    vendorclass.description = cleanStr_des

    // var str = data['risktype_description'].value
    // var cleanStr_r_des=str.trim();//trim() returns string with outer spaces removed
    // vendorclass.risktype_description = cleanStr_r_des

    // var str = data['risk_mitigant'].value
    // var cleanStr_r_miti=str.trim();//trim() returns string with outer spaces removed
    // vendorclass.risk_mitigant = cleanStr_r_miti

    // var str = data['risk_mitigant_review'].value
    // var cleanStr_r_re=str.trim();//trim() returns string with outer spaces removed
    // vendorclass.risk_mitigant_review = cleanStr_r_re

    console.log("vendorclass", vendorclass)
    return vendorclass;
  }

  submitForm() {
    this.SpinnerService.show();

    console.log("submit click", this.Contract)
    if (this.vendorAddForm.value.name === "") {
      this.toastr.error('Please Enter Vendor Name');
      this.SpinnerService.hide();
      return false;
    }
    
    if (this.vendorAddForm.value.panno === "" && this.vendorAddForm.value.composite.id!=3  ) {
      this.toastr.error('Please Enter PAN Number');
      this.SpinnerService.hide();
      return false;
    }
    // if(this.vendorAddForm.value.panno){
    //   if(this.panvalname==''){
    //     this.toastr.error('Please Enter Valid PAN Number');
    //   this.SpinnerService.hide();
    //   return false;
    //   }
    // }
    if (this.vendorAddForm.value.composite.id === undefined || this.vendorAddForm.value.composite === "" ) {
      this.toastr.error('Please Select Valid GST Category');
      this.SpinnerService.hide();
      return false;
    }
    if (this.vendorAddForm.value.group.id === undefined || this.vendorAddForm.value.group === "") {
      this.toastr.error('Please Select Valid Relationship Category');
      this.SpinnerService.hide();
      return false;
    }
    if (this.vendorAddForm.value.custcategory_id.id === undefined || this.vendorAddForm.value.custcategory_id === "") {
      this.toastr.error('Please Select Valid Relationship SubCategory');
      this.SpinnerService.hide();;
      return false;
    }
    if (this.vendorAddForm.value.classification.id === undefined || this.vendorAddForm.value.classification === "") {
      this.toastr.error('Please Select Valid Vendor Type');
      this.SpinnerService.hide();
      return false;
    }
    if (this.vendorAddForm.value.type.id === undefined || this.vendorAddForm.value.type === "") {
      this.toastr.error('Please Select Valid Classification');
      this.SpinnerService.hide();
      return false;
    }
 
    if (this.vendorAddForm.value.orgtype.id === undefined || this.vendorAddForm.value.orgtype === "") {
      this.toastr.error('Please Select Valid Organization Type');
      this.SpinnerService.hide();
      return false;
    }
    // if (this.vendorAddForm.value.risktype === undefined || this.vendorAddForm.value.risktype === "") {
    //   this.toastr.error('Please Select Type of Risk');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.vendorAddForm.value.risktype_description === "") {
    //   this.toastr.error('Please Enter Risk Description');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.vendorAddForm.value.risk_mitigant === "") {
    //   this.toastr.error('Please Enter Risk Mitigant');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.vendorAddForm.value.risk_mitigant_review === "") {
    //   this.toastr.error('Please Enter Risk mitigant Review');
    //   this.SpinnerService.hide();
    //   return false;
    // }
 
   
   
   
    
      // if (this.vendorAddForm.value.gstno === "") {
      //   this.toastr.error('Please Enter GST Name');
      //   this.vendorButton = false;
      //   return false;
      // }
      // if (this.vendorAddForm.value.composite === "" ) {
      //   this.toastr.error('Please Select Any One GST Category');
      //   this.vendorButton = false;
      //   return false;
      // }
      if(this.yesflag){
        if (this.vendorAddForm.value.emaildays === "") {
          // this.vendorAddForm.value.emaildays = null
          this.toastr.error('Please Enter Email Days');
          this.SpinnerService.hide();
          return false;
        }
      }

      if(this.reason_flag){
        if (this.vendorAddForm.value.nocontract_reason === "") {
          // this.vendorAddForm.value.emaildays = null
          this.toastr.error('Please Enter Reason for No Contract');
          this.SpinnerService.hide();
          return false;
        }
      }
      
      if(this.vendorAddForm.value.rm_id.id===undefined || this.vendorAddForm.value.rm_id === ""){
        this.toastr.error('Please Select Valid RM Name');
        this.SpinnerService.hide();
        return false;
  
      }


      if(this.Contract == true){
        if (this.vendorAddForm.value.contractdate_from === undefined) {
          this.toastr.error('Please Enter Contract From Date');
          this.SpinnerService.hide();
          return false;
        }
        if (this.vendorAddForm.value.contractdate_to === undefined) {
          this.toastr.error('Please Enter Contract To Date');
          this.SpinnerService.hide();
          return false;
        }
      }
      // if (this.vendorAddForm.value.group === "") {
      //   this.toastr.error('Please Select Any One Relationship Category');
      //   this.vendorButton = false;
      //   return false;
      // }
      // if (this.vendorAddForm.value.custcategory_id === "") {
      //   this.toastr.error('Please Select Any One Relationship SubCategory');
      //   this.vendorButton = false;
      //   return false;
      // }
      // if (this.vendorAddForm.value.classification === "") {
      //   this.toastr.error('Please Select Any One Vendor Type');
      //   this.vendorButton = false;
      //   return false;
      // }
      // if (this.vendorAddForm.value.type === "") {
      //   this.toastr.error('Please Select Any One Classification');
      //   this.vendorButton = false;
      //   return false;
      // }
   
      // if (this.vendorAddForm.value.orgtype === "") {
      //   this.toastr.error('Please Select Any One Organization Type');
      //   this.vendorButton = false;
      //   return false;
      // }
      // if (this.vendorAddForm.value.remarks === "") {
      //   this.toastr.error('Please Enter Remarks');
      //   this.vendorButton = false;
      //   return false;
      // }
      // if (this.vendorAddForm.value.rm_id === "") {
      //   this.toastr.error('Please Select Any One RM Name');
      //   this.vendorButton = false;
      //   return false;
      // }
      // if (this.vendorAddForm.value.director_count === "") {
      //   this.toastr.error('Please Enter Director Count');
      //   this.vendorButton = false;
      //   return false;
      // }
      if (this.vendorAddForm.value.address.line1 === "") {
        this.toastr.error('Please Enter Address 1');
        this.SpinnerService.hide();
        return false;
      }
      if(this.vendorAddForm.value.address.pincode_id.id===undefined || this.vendorAddForm.value.address.pincode_id === ""){
        this.toastr.error('Please Select Valid Pincode');
        this.SpinnerService.hide();
        return false;
  
      }
      if(this.vendorAddForm.value.address.city_id.id===undefined || this.vendorAddForm.value.address.city_id === ""){
        this.toastr.error('Please Select Valid City');
        this.SpinnerService.hide();
        return false;
  
      }
      if(this.vendorAddForm.value.address.state_id.id===undefined || this.vendorAddForm.value.address.state_id === ""){
        this.toastr.error('Please Select Valid State');
        this.SpinnerService.hide();
        return false;
  
      }
      if(this.vendorAddForm.value.address.district_id.id===undefined || this.vendorAddForm.value.address.district_id === ""){
        this.toastr.error('Please Select Valid District');
        this.SpinnerService.hide();
        return false;
  
      }
      // if(this.vendorAddForm.value.contact.designation_id.id===undefined || this.vendorAddForm.value.contact.designation_id === ""){
      //   this.toastr.error('Please Select Valid Designation');
      //   this.SpinnerService.hide();
      //   return false;
  
      // }
      if(this.vendorAddForm.value.contact.designation === ""){
        this.toastr.error('Please Enter Designation');
        this.SpinnerService.hide();
        return false;
  
      }
     
      // if (this.vendorAddForm.value.address.pincode_id === "" ) {
      //   this.toastr.error('Please Select Any One Pincode');
      //   this.vendorButton = false;
      //   return false;
      // }
      // if (this.vendorAddForm.value.address.city_id === "") {
      //   this.toastr.error('Please Select Any One city');
      //   this.vendorButton = false;
      //   return false;
      // }
      // if (this.vendorAddForm.value.address.district_id === "") {
      //   this.toastr.error('Please Select Any One district');
      //   this.vendorButton = false;
      //   return false;
      // }
      // if (this.vendorAddForm.value.address.state_id === "") {
      //   this.toastr.error('Please Select Any One state');
      //   this.vendorButton = false;
      //   return false;
      // }
      // if (this.vendorAddForm.value.contact.designation_id === "" ) {
      //   this.toastr.error('Please Select Any One Designation');
      //   this.vendorButton = false;
      //   return false;
      // }
   
      if (this.vendorAddForm.value.contact.name === "") {
        this.toastr.error('Please Enter Contact Name');
        this.SpinnerService.hide();
        return false;
      }
      if(this.vendorAddForm.value.contact.email != ""){
        let a = this.vendorAddForm.value.contact.email
        let b = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        let c = b.test(a)
        console.log(c)
        if (c === false){
              this.notification.showError('Please Enter Valid Email Id');
              this.SpinnerService.hide();
              return false;
            }
      }
      if(this.vendorAddForm.value.contact.mobile != ""){
        if(this.vendorAddForm.value.contact.mobile.length != 10) {
          this.notification.showError("Mobile 1 length should be 10 chars");
          this.SpinnerService.hide();
          return false;
        }
      }
      if(this.vendorAddForm.value.contact.mobile2 != ""){
        if(this.vendorAddForm.value.contact.mobile2.length != 10) {
          this.notification.showError("Mobile 2 length should be 10 chars");
          this.SpinnerService.hide();
          return false;
        }
      }
    
      if (this.vendorAddForm.value.profile.branch === "") {
        this.toastr.error('Please Enter Branch Count');
        this.SpinnerService.hide();
        return false;
      }
      let branchcount = this.vendorAddForm.value.profile.branch
      console.log("branch------",Number(branchcount))
      if (Number(branchcount) == 0 ) {
        this.toastr.error('Please Enter Valid Branch Count');
        this.SpinnerService.hide();
        return false;
      }
     
      // if(this.vendorAddForm.value.adhaarno != ""){
      //   if(this.vendorAddForm.value.adhaarno.length != 12) {
      //     this.notification.showError("Adhaar Number length should be 12 ...");
      //     this.SpinnerService.hide();
      //     return false;
      //   }
      // }
      if(this.vendorAddForm.value.website != ""){
        let a = this.vendorAddForm.value.website
        let b = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/
        let c = b.test(a)
        console.log(c)
        if (c === false){
              this.notification.showError('Please Enter Valid Website Name');
              this.SpinnerService.hide();
              return false;
            }
      }
      
     
  
      let count = this.vendorAddForm.value.director_count
      console.log("count", count)
      let arraySize = this.directorNameList.length
      console.log("arraysize", arraySize)
      if (count < arraySize || count > arraySize) {
        this.notification.showError("Director Count Not Match...")
        this.SpinnerService.hide();
        return false;
      }

    //   for(let i=0;i<this.directorNameList.length;i++)
    // {
    //   if(this.directorNameList[i].d_sanctions.id != undefined){
    //     this.directorNameList[i].d_sanctions =this.directorNameList[i].d_sanctions.id;
    //   }
    //   if(this.directorNameList[i].d_match.id != undefined){
    //     this.directorNameList[i].d_match =this.directorNameList[i].d_match.id;
    //   }
    // }
      console.log("list",this.directorNameList)
      this.atmaService.vendorCreateForm(this.createFormate(), this.directorNameList)
        .subscribe(res => {
          console.log("vendor", res)
          if(res.id === undefined){
            this.notification.showError(res.description)
            this.SpinnerService.hide();
            return false;
          } 
          else {
            this.notification.showSuccess("saved Successfully!...")
            this.SpinnerService.hide();
            this.shareService.vendorView.next(res);
            this.router.navigate(['/atma/vendorView'], { skipLocationChange: true })
          }
        },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
        ) 
  }

}
class vendor {
  name: string;
  remarks: string;
  gstno: any;
  panno: any;
  // code: string;
  composite: any;
  comregno: string;
  group: any;
  custcategory_id: any;
  classification: any;
  type: any;
  website: string;
  activecontract: string;
  nocontract_reason: string;
  contractdate_from: string;
  contractdate_to: string;
  aproxspend: any;
  actualspend: any;
  orgtype: any;
  renewal_date: string;
  // adhaarno: any;
  director_count: any;
  rm_id: number;
  emaildays: any;
  address: {
    line1: string;
    line2: string;
    line3: string;
    pincode_id: any;
    city_id: any;
    district_id: any;
    state_id: any;
  }
  contact: {
    designation: any;
    // dob: any;
    email: string;
    landline: any;
    landline2: any;
    mobile: any;
    mobile2: any;
    name: string;
    // type_id: any;
  }
  profile: {
    year: any;
    associate_year: any;
    // award_details: string;
    // permanent_employee: any;
    // temporary_employee: any;
    // total_employee: any;
    branch: any;
    // factory: any;
    remarks: string
  }
  director: {
    name: string;
  }
  description: string;
  risktype:any;
  risktype_description:string;
  risk_mitigant:string;
  risk_mitigant_review:string;

}