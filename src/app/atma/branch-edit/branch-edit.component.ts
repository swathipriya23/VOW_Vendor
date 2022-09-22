import { Component, OnInit, Output, EventEmitter, ViewChild, Injectable } from '@angular/core';
import { Observable, from, fromEvent } from 'rxjs'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NotificationService } from '../notification.service'
import { AtmaService } from '../atma.service'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { ShareService } from '../share.service'
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { NONE_TYPE } from '@angular/compiler';
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
  selector: 'app-branch-edit',
  templateUrl: './branch-edit.component.html',
  styleUrls: ['./branch-edit.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class BranchEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  branchEditForm: FormGroup;
  pinCodeList: Array<pincode>;
  cityList: Array<city>;
  stateList: Array<state>;
  districtList: Array<district>;
  designationList: Array<Designation>;
  contactTypeList: Array<ContactType>;
  defaultDate = new FormControl(new Date())
  today = new Date();
  currentDate: any = new Date();
  vendorId: number;
  branchEditID: number;
  inputGstValue = "";
  inputPanValue = "";
  cityId: number;
  districtId: number;
  stateId: number;
  pincodeId: number
  gstNummber: string;
  panNumber: string;
  submitted = false;
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  pan_status: any;
  gst_status: any;
  select: any;
  GstNo: any;
  pan: any;
  gstvalue: any;
  panvalue: any;
  futureDays = new Date();
  branchcode=''
  isGSTValid = true;
  
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
  composite_id: number;
  constructor(private fb: FormBuilder, private atmaService: AtmaService,private SpinnerService: NgxSpinnerService,private errorHandler: ErrorHandlingService,
    private notification: NotificationService, private shareService: ShareService,private toastr: ToastrService,
    private datePipe: DatePipe,) { 
      this.futureDays.setDate(this.futureDays.getDate());
    }

  ngOnInit(): void {
    // this.vendorId = this.shareService.vendorID.value;
    this.branchEditForm = this.fb.group({
      code: [this.branchcode],
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
        email: ['', [ Validators.email,
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
  
  
    this.getBranchEdit()
    this.getbranchvendor()

  }
  getbranchvendor(){
    this.atmaService.getVendor(this.vendorId)
    .subscribe(result => {
    let data = result
    this.composite_id=data.composite.id
   
  
  })
  
  }

  designame(){
    let desgkeyvalue: String = "";
    this.getDesignation(desgkeyvalue);

    this.branchEditForm.controls.contact.get('designation_id').valueChanges
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
  statename(){
    let statekeyvalue: String = "";
    this.getState(statekeyvalue);

    this.branchEditForm.controls.address.get('state_id').valueChanges
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

    this.branchEditForm.controls.address.get('pincode_id').valueChanges
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

    this.branchEditForm.controls.address.get('city_id').valueChanges
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
  districtname(){
    let districtkeyvalue: String = "";
    this.getDistrict(districtkeyvalue);

    this.branchEditForm.controls.address.get('district_id').valueChanges
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
  getBranchEdit() {
    let dataa = this.shareService.branchEditFrom.value;
    console.log("Brnachk", dataa,this.branchcode)
    this.branchEditID = dataa.id;
   

    this.vendorId = dataa.vendor_id;
    this.atmaService.getSingleBranch(this.vendorId, this.branchEditID)
      .subscribe(result => {
        this.branchcode=result.code;
        // console.log("branch", resula t)
        let data = result
        let Name = data.name;
        let Remarks = data.remarks;
        let limitDays = data.limitdays;
        let creditTerms = data.creditterms;
        this.inputGstValue = data.gstno;
        this.GstNo = data.gstno.slice(2, -3);
        // this.gstvalue = this.inputGstValue;
        this.inputPanValue = data.panno;
        this.pan = data.panno;
        // this.panvalue = this.inputPanValue;
        let Contact = data.contact_id;
        let designation = data.contact_id.designation
        // let type = data.contact_id.type_id
        // let dob = Contact.dob;
        // let weddingDate = Contact.wedding_date;
        let Email = Contact.email;
        let LandLine1 = Contact.landline;
        let LandLine2 = Contact.landline2;
        let Mobile1 = Contact.mobile;
        let Mobile2 = Contact.mobile2;
        let contactName = Contact.name;
        let Address = data.address_id;
        let Line1 = Address.line1;
        let Line2 = Address.line2;
        let Line3 = Address.line3;
        let pincode = data.address_id.pincode_id
        let district = data.address_id.district_id
        let state = data.address_id.state_id
        let city = data.address_id.city_id
        this.branchEditForm.patchValue({
          name: Name,
          remarks: Remarks,
          limitdays: limitDays,
          creditterms: creditTerms,
          gstno: this.inputGstValue,
          panno: this.inputPanValue,
          address: {
            line1: Line1,
            line2: Line2,
            line3: Line3,
            city_id: city,
            district_id: district,
            pincode_id: pincode,
            state_id: state
          },
          contact: {
            designation: designation,
            email: Email,
            landline: LandLine1,
            landline2: LandLine2,
            mobile: Mobile1,
            mobile2: Mobile2,
            name: contactName,
            // dob: dob,
            // type_id: type,
            // wedding_date: weddingDate
          }
        })
      })

  }
  public displayFnDesg(desg?: Designation): string | undefined {
    console.log('id', desg.id);
    console.log('name', desg.name);
    return desg ? desg.name : undefined;
  }

  get desg() {
    return this.branchEditForm.value.get('designation_id');
  }

  // public displayFnContactType(contactType?: ContactType): string | undefined {
  //   console.log('id', contactType.id);
  //   console.log('name', contactType.name);
  //   return contactType ? contactType.name : undefined;
  // }

  // get contactType() {
  //   return this.branchEditForm.value.get('type_id');
  // }

  public displaydis(autodis?: district): string | undefined {
    return autodis ? autodis.name : undefined;
  }

  get autodis() {
    return this.branchEditForm.controls.address.get('district_id');
  }

  public displaycit(autocit?: city): string | undefined {
    return autocit ? autocit.name : undefined;
  }

  get autocit() {
    return this.branchEditForm.controls.address.get('city_id');
  }

  public displayFnpin(pintype?: pincode): string | undefined {
    return pintype ? pintype.no : undefined;
  }

  get pintype() {
    return this.branchEditForm.controls.address.get('pincode_id');
  }

  public displayFnstate(statetype?: state): string | undefined {
    console.log('id', statetype.id);
    console.log('name', statetype.name);
    return statetype ? statetype.name : undefined;
  }

  get statetype() {
    return this.branchEditForm.controls.address.get('state_id');
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
  keyPressAlphaNumeric(event) {

    var inp = String.fromCharCode(event.keyCode);
  
    if (/[a-zA-Z]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
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

  numberOnlyForValidation(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  DOBSelection(event: string) {
    const date = new Date(event)
    this.select = new Date(date.getFullYear() + 18, date.getMonth(), date.getDate())
  }
  branchEditForm_() {
    this.SpinnerService.show();
    if(this.branchEditForm.value.gstno === "" && this.composite_id!=3){
      this.notification.showWarning(" GST Number Needed..");
      this.SpinnerService.hide();
      return false
    }
    if(this.isGSTValid == false && this.branchEditForm.value.gstno != ""){
      this.notification.showWarning("Please Enter Valid GST");
      this.SpinnerService.hide();
      return false
    } 
    if(this.GstNo != this.pan && this.composite_id!=3){
      this.notification.showWarning(" GST And PAN Not Match..");
      this.SpinnerService.hide();
      return false
    }
    if (this.branchEditForm.value.name === "") {
      this.toastr.error('Please Enter Name');
      this.SpinnerService.hide();
      return false;
    }
    if (this.branchEditForm.value.limitdays === "") {
      this.branchEditForm.value.limitdays = null
      // this.toastr.error('Please Enter Limitdays');
      // this.SpinnerService.hide();
      // return false;
    }
    // if (this.branchEditForm.value.creditterms === "") {
    //   this.toastr.error('Please Enter Creditterms');
    //   this.SpinnerService.hide();
    //   return false;
    // }
  
    // if (this.branchEditForm.value.contact.designation_id === "" || this.branchEditForm.controls.contact.value.designation_id.id === undefined ) {
    //   this.toastr.error('Please Select Valid Designation Name');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    if (this.branchEditForm.value.contact.designation === "" ) {
      this.toastr.error('Please Enter Designation');
      this.SpinnerService.hide();
      return false;
    }
   
    if (this.branchEditForm.value.contact.name === "") {
      this.toastr.error('Please Enter Contact Name');
      this.SpinnerService.hide();
      return false;
    }
    
    if (this.branchEditForm.value.address.line1 === "") {
      this.toastr.error('Please Enter Address 1');
      this.SpinnerService.hide();
      return false;
    }
   
    if (this.branchEditForm.value.address.pincode_id === "" || this.branchEditForm.controls.address.value.pincode_id.id === undefined) {
      this.toastr.error('Please Select Valid Pincode');
      this.SpinnerService.hide();
      return false;
    }
    if (this.branchEditForm.value.address.city_id === "" || this.branchEditForm.controls.address.value.city_id.id === undefined) {
      this.toastr.error('Please Select Valid city');
      this.SpinnerService.hide();
      return false;
    }
    if (this.branchEditForm.value.address.district_id === "" || this.branchEditForm.controls.address.value.district_id.id === undefined) {
      this.toastr.error('Please Select Valid district');
      this.SpinnerService.hide();
      return false;
    }
    if (this.branchEditForm.value.address.state_id === "" || this.branchEditForm.controls.address.value.state_id.id === undefined) {
      this.toastr.error('Please Select Valid state');
      this.SpinnerService.hide();
      return false;
    }
   
    if(this.branchEditForm.value.gstno!=''){
      let data={
        "gstno":this.branchEditForm.value.gstno,


        
        "state_id":this.branchEditForm.controls.address.value.state_id.id
      }
      let msg:any;
      this.func(data)
    }

    if (this.branchEditForm.value.contact.mobile === "") {
      this.toastr.error('Please Enter Mobile 1');
      this.SpinnerService.hide();
      return false;
    }

  
      if(this.branchEditForm.value.contact.email != ""){
      let a = this.branchEditForm.value.contact.email
        let b = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        let c = b.test(a)
        console.log(c)
          if (c === false){
            this.toastr.error('Please Enter Valid Email Id');
            this.SpinnerService.hide();
            return false;
          }
        }
          if(this.branchEditForm.value.contact.mobile.length != ""){
            if (this.branchEditForm.value.contact.mobile.length != 10){
              this.toastr.error('Mobile 1 length should be 10 chars');
              this.SpinnerService.hide();
              return false;
            }
          }
          if(this.branchEditForm.value.contact.mobile2.length != ""){
            if (this.branchEditForm.value.contact.mobile2.length != 10){
              this.toastr.error('Mobile 2 length should be 10 chars');
              this.SpinnerService.hide();
              return false;
            }
          }
    
     

      // const dateValue = this.branchEditForm.value;
      // const weddingDate = this.branchEditForm.value;
      // if(this.branchEditForm.controls.contact.value.dob != "None"){
      //   dateValue.contact.dob = this.datePipe.transform(dateValue.contact.dob, 'yyyy-MM-dd');
      // }
      //  else {
      //   this.branchEditForm.controls.contact.value.dob = null
      //  }
      // if(this.branchEditForm.controls.contact.value.wedding_date != "None"){
      //    weddingDate.contact.wedding_date = this.datePipe.transform(dateValue.contact.wedding_date, 'yyyy-MM-dd');
      // } else {
      //   this.branchEditForm.controls.contact.value.wedding_date = null
      // }

      
      
      // this.branchEditForm.controls.contact.value.designation_id = this.branchEditForm.controls.contact.value.designation_id.id
      // this.branchEditForm.controls.contact.value.type_id = this.branchEditForm.controls.contact.value.type_id.id
      this.branchEditForm.controls.address.value.city_id = this.branchEditForm.controls.address.value.city_id.id
      this.branchEditForm.controls.address.value.state_id = this.branchEditForm.controls.address.value.state_id.id
      this.branchEditForm.controls.address.value.district_id = this.branchEditForm.controls.address.value.district_id.id
      this.branchEditForm.controls.address.value.pincode_id = this.branchEditForm.controls.address.value.pincode_id.id
      this.branchEditForm.value.code=this.branchcode;


      var str = this.branchEditForm.value.code
      var cleanStr_code=str.trim();//trim() returns string with outer spaces removed
      this.branchEditForm.value.code = cleanStr_code

    var str = this.branchEditForm.value.name
    var cleanStr_name=str.trim();//trim() returns string with outer spaces removed
    this.branchEditForm.value.name = cleanStr_name

    var str = this.branchEditForm.value.creditterms
    var cleanStr_credit=str.trim();//trim() returns string with outer spaces removed
    this.branchEditForm.value.creditterms = cleanStr_credit

    var str = this.branchEditForm.value.remarks
    var cleanStr_remarks=str.trim();//trim() returns string with outer spaces removed
    this.branchEditForm.value.remarks = cleanStr_remarks

    var str = this.branchEditForm.value.address.line1
    var cleanStr1=str.trim();//trim() returns string with outer spaces removed
    this.branchEditForm.value.address.line1 = cleanStr1

    var str = this.branchEditForm.value.address.line2
    var cleanStr2=str.trim();//trim() returns string with outer spaces removed
    this.branchEditForm.value.address.line2 = cleanStr2


    var str = this.branchEditForm.value.address.line3
    var cleanStr3=str.trim();//trim() returns string with outer spaces removed
    this.branchEditForm.value.address.line3 = cleanStr3 



    var str = this.branchEditForm.value.contact.name
    var cleanStr4=str.trim();//trim() returns string with outer spaces removed
    this.branchEditForm.value.contact.name = cleanStr4

    var str = this.branchEditForm.value.contact.email
    var cleanStr5=str.trim();//trim() returns string with outer spaces removed
    this.branchEditForm.value.contact.email = cleanStr5

    
    var str = this.branchEditForm.value.contact.designation
    var cleanStr6=str.trim();//trim() returns string with outer spaces removed
    this.branchEditForm.value.contact.designation = cleanStr6


    // var str = this.branchEditForm.value.contact.dob
    // var cleanStr6=str.trim();//trim() returns string with outer spaces removed
    // this.branchEditForm.value.contact.dob = cleanStr6

    // var str = this.branchEditForm.value.contact.wedding_date
    // var cleanStr7=str.trim();//trim() returns string with outer spaces removed
    // this.branchEditForm.value.contact.wedding_date = cleanStr7

    // var str = this.branchEditForm.value.contact.landline
    // var cleanStr8=str.trim();//trim() returns string with outer spaces removed
    // this.branchEditForm.value.contact.landline = cleanStr8

    // var str = this.branchEditForm.value.contact.landline2
    // var cleanStr9=str.trim();//trim() returns string with outer spaces removed
    // this.branchEditForm.value.contact.landline2 = cleanStr9

    // var str = this.branchEditForm.value.contact.mobile
    // var cleanStr10=str.trim();//trim() returns string with outer spaces removed
    // this.branchEditForm.value.contact.mobile = cleanStr10

    // var str = this.branchEditForm.value.contact.mobile2
    // var cleanStr11=str.trim();//trim() returns string with outer spaces removed
    // this.branchEditForm.value.contact.mobile2 = cleanStr11





      this.atmaService.branchEditForm(this.branchEditID, this.vendorId, this.branchEditForm.value)
        .subscribe((res) => {
          console.log("branchedit",res)
          if(res.id === undefined){
            this.notification.showError(res.description)
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


  numberOnly(limitdays): boolean {
    // const charCode = (event.which) ? event.which : event.keyCode;
    // 
    if (limitdays > 120) {
      // this..value.=0
      this.toastr.error("You've exceeded the maximum limitted days");
      this.branchEditForm.get('limitdays').setValue('');
     

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

  onCancelClick() {
    this.onCancel.emit()
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  // validationGstNo(event) {
  //   let gstno = event.target.value;
  //   let gst = gstno
  //   gst = gst.slice(2, -3);
  //   this.GstNo = gst;
  //   this.gstvalue = this.GstNo
  //   console.log("gst------",this.GstNo)
  // }

  validationPAN(event) {
    let panno = event.target.value;
    this.pan = panno
    this.panvalue = this.pan
    console.log("pan", this.pan)
  }

  // validationPAN(e) {
  //   let panNo = e.target.value;
  //   if (panNo === '') {
  //     this.notification.showWarning(" Please Enter Pan Number...")
  //   }
  //   this.atmaService.getBracnhPanNumber(panNo)
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
    let gstNo = e.target.value;
    if(gstNo!=''){
      this.SpinnerService.show();

      let gst = gstNo
      gst = gst.slice(2, -3);
      this.GstNo = gst;
      console.log("gst------",this.GstNo)

    this.atmaService.getBracnhGSTNo(gstNo)
      .subscribe(res => {
        let result = res.validation_status
        this.gst_status = result
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

  pinCode(data) {
    this.cityId = data.city;
    this.districtId = data.district;
    this.stateId = data.state;
    this.pincodeId = data
    this.branchEditForm.patchValue({
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
    this.branchEditForm.patchValue({
      address: {
        city_id: this.cityId,
        state_id: this.stateId,
        district_id: this.districtId,
        pincode_id: this.pincodeId
      }
    })
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

  async func(data){
  
    await  this.atmaService.gstduplicationstatewise(this.vendorId,data)
  .toPromise().then( msg=>{
   
    if(msg["code"]!="VALID GST"){
      this.toastr.error(msg["code"]);
      this.submitted = false;
       return false;
     }

    // msg=results

  }
  ).catch(err => { console.log(err) });
    
 
}
}
