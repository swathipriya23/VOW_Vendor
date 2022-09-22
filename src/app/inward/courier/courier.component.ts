import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { DataService } from '../inward.service'
import { fromEvent, Observable } from 'rxjs';
import { Router } from '@angular/router'
import { NotificationService } from '../notification.service'
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';

export interface designationListss {
  name: string;
  id: number;
}

export interface cityListss {
  name: string;
  id: number;
}
export interface pinCodeListss {
  no: string;
  id: number;
}
export interface districtListss {
  name: string;
  id: number;
}
export interface stateListss {
  name: string;
  id: number;
}


@Component({
  selector: 'app-courier',
  templateUrl: './courier.component.html',
  styleUrls: ['./courier.component.css']
})
export class CourierComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  @ViewChild('designationtype') matDesAutocomplete: MatAutocomplete;
  @ViewChild('designationInput') designationInput: any;

  @ViewChild('citytype') matcitAutocomplete: MatAutocomplete;
@ViewChild('SCROLLcityInput') SCROLLcityInput: any;

@ViewChild('districttype') matdisAutocomplete: MatAutocomplete;
@ViewChild('SCROLLdistrictInput') SCROLLdistrictInput: any;

@ViewChild('statetype') matstatAutocomplete: MatAutocomplete;
@ViewChild('SCROLLstateInput') SCROLLstateInput: any;

@ViewChild('pintype') matpinAutocomplete: MatAutocomplete;
@ViewChild('SCROLLpinInput') SCROLLpinInput: any;
  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  cityList: Array<cityListss>;
  city_id = new FormControl();

  pinCodeList: Array<pinCodeListss>;
  pincode_id = new FormControl();


  districtList: Array<districtListss>;
  district_id = new FormControl();

  stateList: Array<stateListss>;
  state_id = new FormControl();

  courierForm: FormGroup;
  // pinCodeList: Array<any>;
  // cityList: Array<any>;
  // stateList: Array<any>;
  // districtList: Array<any>;
  designationList: Array<any>;
  contactTypeList: Array<any>;
  isLoading = false;
  currentpagecom_branch=1;
  has_nextcom_branch=true;
  has_previouscom=true;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  cityId: any=[];
  districtId: any=[];
  stateId: any=[];
  pincodeId: any=[];
  designationID: any;
  contactid: any;
  totaldata: any;

  constructor(private fb: FormBuilder, private notification: NotificationService,
    private dataService: DataService, private router: Router, private toastr:ToastrService,) { }

  ngOnInit(): void {
    this.courierForm = this.fb.group({
      // code: ['', Validators.required],
      name: ['', Validators.required],
      type: [''],
      contactperson: ['', Validators.required],
      address: this.fb.group({
        line1: [''],
        pincode_id: [''],
        city_id: [''],
        district_id: [''],
        state_id: [''],
        line2: [''],
        line3: [''],
      }),
      contact: this.fb.group({
        designation_id: ['', Validators.required],
        email: ['', Validators.email],
        landline: [''],
        landline2: [''],
        mobile: [''],
        mobile2: [''],
        name: ['', Validators.required],
        type_id: ['', Validators.required],

      }),
    })

    // this.getPinCode();
    // this.getCity();
    // this.getDistrict();
    // this.getState();
    // this.getDesignation();
    this.getContactType();

    let diskeyvalue:String="";
    this.getDesignation(diskeyvalue);
    // this.dataService.getDesignationScroll('',1).subscribe(data=>{
    //   this.designationList=data['data'];
    // });
    (this.courierForm.get('contact') as FormGroup).get('designation_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
          console.log('inside tap')
          
      }),

      switchMap(value => this.dataService.getDesignationScroll(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      this.designationList = results["data"];
      console.log('branch_id=',results)
      console.log('branch_data=',this.designationList)
  
    })
    
    let pinkeyvalue:String="";
    this.getPinCode(pinkeyvalue);
    
    (this.courierForm.get('address') as FormGroup).get('pincode_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
          console.log('inside tap')
          
      }),

      switchMap(value => this.dataService.getPinCodeDropDownscroll(value, 1)
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
      console.log("pincode_id", datas)
  
    })
    
    let citykeyvalue:String="";
    this.getCity(citykeyvalue);
    (this.courierForm.get('address') as FormGroup).get('city_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
          console.log('inside tap')
          
      }),

      switchMap(value => this.dataService.getCityDropDownscroll(value, 1)
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
      console.log("cityList", datas)
    })
  
    let districtkeyvalue:String="";
    this.getDistrict(districtkeyvalue);
    (this.courierForm.get('address') as FormGroup).get('district_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
          console.log('inside tap')
          
      }),

      switchMap(value => this.dataService.getDistrictDropDownscroll(value, 1)
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
      console.log("districtList", datas)
  
    })
    
    let statekeyvalue:String="";
    this.getState(statekeyvalue);
    (this.courierForm.get('address') as FormGroup).get('state_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
          console.log('inside tap')
          
      }),

      switchMap(value => this.dataService.getStateDropDownscroll(value, 1)
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
      console.log("stateList", datas)
  
    })

  }


  // private getPinCode() {
  //   this.dataService.getPinCode()
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.pinCodeList = datas;
  //       // console.log("pincode", datas)
  //     })
  // }


  // private getCity() {
  //   this.dataService.getCity()
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.cityList = datas;
  //       // console.log("city", datas)

  //     })
  // }
  // private getState() {
  //   this.dataService.getState()
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.stateList = datas;
  //       // console.log("statte", datas)

  //     })
  // }
  // private getDistrict() {
  //   this.dataService.getDistrict()
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.districtList = datas;
  //       // console.log("district", datas)

  //     })
  // }
  // private getDesignation() {
  //   this.dataService.getDesignation()
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.designationList = datas;
  //       // console.log("desi", datas)

  //     })
  // }
    private getDesignation(diskeyvalue) {
    this.dataService.getDesignationScroll(diskeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.designationList = datas;
        // console.log("desi", datas)

      })
  }
  private getDistrict(districtkeyvalue) {
    this.dataService.getDistrictDropDown(districtkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList = datas;
        console.log("District DD", datas)
       // return true       
      })
  }
  private getContactType() {
    this.dataService.getContactType()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.contactTypeList = datas;
        // console.log("contaactyut", datas)

      })
  }

  autocompleteScroll_Designation(){
    setTimeout(() => {
      console.log('santhosh')
      if (
        this.matDesAutocomplete &&
        this.autocompleteTrigger &&
        this.matDesAutocomplete.panel
      ) {
        fromEvent(this.matDesAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matDesAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matDesAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matDesAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matDesAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getDesignationScroll(this.SCROLLpinInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.designationList = this.designationList.concat(datas);
                    // console.log("emp", datas)
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
  public displayFndesignation(designationtype): string | undefined {
    console.log('id',designationtype);
    console.log('no',designationtype.name);
    return designationtype ? designationtype: undefined;
  }

  get designationtype() {
    return this.courierForm.controls.contact.get('designation_id');
  }
  autocompletepinScroll() {
    setTimeout(() => {
      if (
        this.matpinAutocomplete &&
        this.autocompleteTrigger &&
        this.matpinAutocomplete.panel
      ) {
        fromEvent(this.matpinAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matpinAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matpinAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matpinAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matpinAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getPinCodeDropDownscroll(this.SCROLLpinInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.pinCodeList = this.pinCodeList.concat(datas);
                    // console.log("emp", datas)
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
  public displayFnpin(pintype?: pinCodeListss): string | undefined {
    console.log('id',pintype.id);
    console.log('no',pintype);
    return pintype ? pintype.no : undefined;
  }

  get pintype() {
    return this.courierForm.controls.address_id.get('pincode_id');
  }

  private getPinCode(pinkeyvalue) {
    this.dataService.getPinCodeDropDown(pinkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pinCodeList = datas;
        console.log("PinCode DD", datas)
       // return true
      })
  }
  autocompletecityScroll() {
    setTimeout(() => {
      if (
        this.matcitAutocomplete &&
        this.autocompleteTrigger &&
        this.matcitAutocomplete.panel
      ) {
        fromEvent(this.matcitAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcitAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcitAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcitAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcitAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getCityDropDownscroll(this.SCROLLcityInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.cityList = this.cityList.concat(datas);
                    // console.log("emp", datas)
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
  public displayFncity(citytype?: cityListss): string | undefined {
    console.log('name',citytype);
    return citytype ? citytype.name : undefined;
  }

  get citytype() {
    return this.courierForm.controls.address_id.get('city_id');
  }
  private getCity(citykeyvalue) {
    this.dataService.getCityDropDown(citykeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList = datas;
        console.log("City DD", datas)
        // return true
      })
  }

  
  public displayFnstate(statetype?: stateListss): string | undefined {
    console.log('name',statetype);
    return statetype ? statetype.name : undefined;
  }

  get statetype() {
    return this.courierForm.controls.address_id.get('state_id');
  }
  autocompletestatScroll() {
    setTimeout(() => {
      if (
        this.matstatAutocomplete &&
        this.autocompleteTrigger &&
        this.matstatAutocomplete.panel
      ) {
        fromEvent(this.matstatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matstatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matstatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matstatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matstatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getStateDropDownscroll(this.SCROLLstateInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.stateList = this.stateList.concat(datas);
                    // console.log("emp", datas)
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
  private getState(statekeyvalue) {
    this.dataService.getStateDropDown(statekeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
        console.log("State DD", datas)
       // return true
      })
  }

  autocompletedistScroll() {
    setTimeout(() => {
      if (
        this.matdisAutocomplete &&
        this.autocompleteTrigger &&
        this.matdisAutocomplete.panel
      ) {
        fromEvent(this.matdisAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matdisAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matdisAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matdisAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matdisAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getDistrictDropDownscroll(this.SCROLLdistrictInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.districtList = this.districtList.concat(datas);
                    // console.log("emp", datas)
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
  public displayFndistrict(districttype?: districtListss): string | undefined {
    console.log('name',districttype);
    return districttype ? districttype.name : undefined;
  }

  checker_designation(d){
    this.designationID = d.id
  }

  pinCode(data) {
    this.totaldata = data
    this.cityId['name'] = data.city.name;
    this.districtId['name'] = data.district.name;
    this.stateId['name'] = data.state.name;
    this.pincodeId['no'] = data.no;
    console.log(data)
    this.courierForm.controls.address.patchValue({
      "pincode_id": this.pincodeId,
      "city_id": this.cityId,
      "state_id": this.stateId,
      "district_id": this.districtId,
    })
  }

  citys(data) {
    console.log(data)
    this.cityId['name'] = data.city_name;
    this.districtId['name'] = data.district.name;
    this.stateId['name'] = data.state.name;
    this.pincodeId['no'] = data.pincode.no;
    this.courierForm.controls.address.patchValue({
      "pincode_id": this.pincodeId,
      "city_id": this.cityId,
      "state_id": this.stateId,
      "district_id": this.districtId,
    })
  }

  checker_contacttype(d){
    console.log(d)
    this.contactid = d.id
    this.courierForm.controls.address.patchValue({
    "type": d.id
    });
  }
  courierCreateForm() {
    if ((this.courierForm.get('name') as FormGroup).value ==null || (this.courierForm.get('name') as FormGroup).value ==""){
      this.toastr.error('Add name Field','Empty value inserted' ,{timeOut: 1500});
      return false;
    }
    if ((this.courierForm.get('contactperson') as FormGroup).value ==null || (this.courierForm.get('contactperson') as FormGroup).value ==""){
      this.toastr.error('Add name Field','Empty value inserted' ,{timeOut: 1500});
      return false;
    }
    if ((this.courierForm.get('contact') as FormGroup).get('designation_id').value ==null || (this.courierForm.get('contact') as FormGroup).get('designation_id').value ==""){
      this.toastr.error('Add name Field','Empty value inserted' ,{timeOut: 1500});
      return false;
    }
    if ((this.courierForm.get('contact') as FormGroup).get('email').value ==null || (this.courierForm.get('contact') as FormGroup).get('email').value ==""){
      this.toastr.error('Add name Field','Empty value inserted' ,{timeOut: 1500});
      return false;
    }
    let data = this.courierForm.value
    data["address"]['pincode_id'] = this.totaldata.id;
    data["address"]["city_id"] = this.totaldata.city.id,
    data["address"]["state_id"] = this.totaldata.state.id,
    data["address"]["district_id"] = this.totaldata.district.id,
    data["type"] = this.contactid
    data["contact"]["designation_id"] = this.designationID
    console.log('finalData',data)
    this.dataService.courierCreateForm(data)
      .subscribe(res => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.notification.showWarning("Duplicate! Code Or Name ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
        }
        else {
          this.notification.showSuccess("Saved Successfully!...")
          this.onSubmit.emit();
        }
        // console.log("COuried>SSSSSSSS>>>>>>>>>", res)
        return true
      })
  }


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onCancelClick() {
    this.onCancel.emit()
  }

}
