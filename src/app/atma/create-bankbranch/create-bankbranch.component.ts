import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable, from, fromEvent } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router'
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from 'ngx-spinner';


export interface Bank {
  id: string;
  name: string;
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
  selector: 'app-create-bankbranch',
  templateUrl: './create-bankbranch.component.html',
  styleUrls: ['./create-bankbranch.component.scss']
})
export class CreateBankbranchComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  AddForm: FormGroup;
  
  cityId: number;
  districtId: number;
  stateId: number;
  pincodeId: number;
  isLoading = false;
  inputIFSCValue = "";
  disableSubmit = true;

  bankList: Array<Bank>;
  bank_id = new FormControl();

  cityList: Array<cityListss>;
  city_id = new FormControl();
  
  pinCodeList: Array<pinCodeListss>;
  pincode_id = new FormControl();
  

  districtList: Array<districtListss>;
  district_id = new FormControl();

  stateList: Array<stateListss>;
  state_id = new FormControl();

  @ViewChild('bank') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('bankInput') bankInput: any;

  @ViewChild('citytype') matcitAutocomplete: MatAutocomplete;
  @ViewChild('cityInput') cityInput: any;

  @ViewChild('districttype') matdisAutocomplete: MatAutocomplete;
  @ViewChild('districtInput') districtInput: any;

  @ViewChild('statetype') matstatAutocomplete: MatAutocomplete;
  @ViewChild('stateInput') stateInput: any;

  @ViewChild('pintype') matpinAutocomplete: MatAutocomplete;
  @ViewChild('pinInput') pinInput: any;

  has_next = true;
  has_previous = true;
  currentpage: number = 1;

  constructor(private formBuilder: FormBuilder, private atmaService: AtmaService,
    private notification: NotificationService, private toastr: ToastrService,
    private router: Router,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.AddForm = this.formBuilder.group({
      
      name: ['', Validators.required],
      ifsccode: ['', Validators.required],
      microcode: ['', Validators.required],
      bank_id: ['', Validators.required],
      address_id: this.formBuilder.group({
        line1: ['', Validators.required],
        pincode_id: ['', Validators.required],
        city_id: ['', Validators.required],
        district_id: ['', Validators.required],
        state_id: ['', Validators.required],
        line2: ['', Validators.required],
        line3: ['', Validators.required],
      }),
    })
    let bankkeyvalue: String = "";
    this.getBank(bankkeyvalue);

    this.AddForm.get('bank_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.atmaService.getBankSearchdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bankList = datas;

      })
    // this.getPinCode();
    let pinkeyvalue:String="";
    this.getPinCode(pinkeyvalue);
    //this.getPinCode();
    this.AddForm.controls.address_id.get('pincode_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
          console.log('inside tap')
          
      }),

      switchMap(value => this.atmaService.getPinCodeDropDownscroll(value, 1)
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
    // this.getCity();
    let citykeyvalue:String="";
    this.getCity(citykeyvalue);
    this.AddForm.controls.address_id.get('city_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
          console.log('inside tap')
          
      }),

      switchMap(value => this.atmaService.getCityDropDownscroll(value, 1)
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
    // this.getDistrict();
    let districtkeyvalue:String="";
    this.getDistrict(districtkeyvalue);
    this.AddForm.controls.address_id.get('district_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
          console.log('inside tap')
          
      }),

      switchMap(value => this.atmaService.getDistrictDropDownscroll(value, 1)
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
    // this.getState();
    let statekeyvalue:String="";
    this.getState(statekeyvalue);
    this.AddForm.controls.address_id.get('state_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
          console.log('inside tap')
          
      }),

      switchMap(value => this.atmaService.getStateDropDownscroll(value, 1)
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
  autocompletebankScroll() {
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
                this.atmaService.getBankSearchdd(this.bankInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.bankList = this.bankList.concat(datas);
                    // console.log("emp", datas)
                    if (this.bankList.length >= 0) {
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

  public displayFnBank(bank?: Bank): string | undefined {
    console.log('id', bank.id);
    console.log('name', bank.name);
    return bank ? bank.name : undefined;
  }

  get bank() {
    return this.AddForm.get('bank_id');
  }

  private getBank(bankkeyvalue) {
    this.atmaService.getBankSearch(bankkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bankList = datas;
        console.log("bankname", datas)

      })
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
                this.atmaService.getPinCodeDropDownscroll(this.pinInput.nativeElement.value, this.currentpage + 1)
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
    console.log('no',pintype.no);
    return pintype ? pintype.no : undefined;
  }

  get pintype() {
    return this.AddForm.controls.address_id.get('pincode_id');
  }

  private getPinCode(pinkeyvalue) {
    this.atmaService.getPinCodeDropDown(pinkeyvalue)
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
                this.atmaService.getCityDropDownscroll(this.cityInput.nativeElement.value, this.currentpage + 1)
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
    console.log('id',citytype.id);
    console.log('name',citytype.name);
    return citytype ? citytype.name : undefined;
  }

  get citytype() {
    return this.AddForm.controls.address_id.get('city_id');
  }
  private getCity(citykeyvalue) {
    this.atmaService.getCityDropDown(citykeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList = datas;
        console.log("City DD", datas)
        // return true
      })
  }


  stateScroll() {
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
                this.atmaService.getStateDropDownscroll(this.stateInput.nativeElement.value, this.currentpage + 1)
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
  
  public displayFnstate(statetype?: stateListss): string | undefined {
    console.log('id',statetype.id);
    console.log('name',statetype.name);
    return statetype ? statetype.name : undefined;
  }

  get statetype() {
    return this.AddForm.controls.address_id.get('state_id');
  }

  private getState(statekeyvalue) {
    this.atmaService.getStateDropDown(statekeyvalue)
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
                this.atmaService.getDistrictDropDownscroll(this.districtInput.nativeElement.value, this.currentpage + 1)
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
    console.log('id',districttype.id);
    console.log('name',districttype.name);
    return districttype ? districttype.name : undefined;
  }

  get districttype() {
    return this.AddForm.controls.address_id.get('district_id');
  }
  private getDistrict(districtkeyvalue) {
    this.atmaService.getDistrictDropDown(districtkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList = datas;
        console.log("District DD", datas)
       // return true       
      })
  }

  pinCode(data) {
    this.cityId = data.city;
    this.districtId = data.district;
    this.stateId = data.state;
    this.pincodeId = data
    this.AddForm.patchValue({
      address_id: {
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
    this.AddForm.patchValue({
      address_id: {
        city_id: this.cityId,
        state_id: this.stateId,
        district_id: this.districtId,
        pincode_id: this.pincodeId
      }
    })
  }

  validationIFSCcode(e) {
    let ifsccode = e.target.value;
    this.atmaService.getIFSCcode(ifsccode)
      .subscribe(res => {
        let result = res.validation_status
        if (result === 'Success') {
          this.notification.showSuccess("IFSC code validated");
        }
        else {
          this.notification.showWarning("Please Enter a Valid IFSC code");
        }
      })
  }

  createFormate() {
    let data = this.AddForm.controls;
    let datas = this.AddForm.controls.address_id
    let bankclass = new bank();

    bankclass.name = data['name'].value;
    bankclass.ifsccode = data['ifsccode'].value;
    bankclass.microcode = data['microcode'].value;
    bankclass.bank_id = data['bank_id'].value.id;
    let address1 = {
      line1: datas.value.line1,
      line2: datas.value.line2,
      line3: datas.value.line3,
      city_id: datas.value.city_id.id,
      district_id: datas.value.district_id.id,
      state_id: datas.value.state_id.id,
      pincode_id: datas.value.pincode_id.id
    }
    bankclass.address_id = address1;

    console.log("bankclass", bankclass)
    return bankclass;
  }

  submitForm() {
    if(this.AddForm.get('name').value==undefined || this.AddForm.get('name').value.trim()=='' || this.AddForm.get('name').value.trim()=="" || this.AddForm.get('name').value==null){
      this.notification.showError('Please Enter The Name');
      return false;
    }
    if(this.AddForm.get('ifsccode').value==undefined || this.AddForm.get('ifsccode').value=='' || this.AddForm.get('ifsccode').value=="" || this.AddForm.get('ifsccode').value==null){
      this.notification.showError('Please Enter The IFSCCode');
      return false;
    }
    if(this.AddForm.get('microcode').value==undefined || this.AddForm.get('microcode').value=='' || this.AddForm.get('microcode').value=="" || this.AddForm.get('microcode').value==null){
      this.notification.showError('Please Enter The MICROCode');
      return false;
    }
    if(this.AddForm.get('bank_id').value.id==undefined || this.AddForm.get('bank_id').value.id=='' || this.AddForm.get('bank_id').value=="" || this.AddForm.get('bank_id').value.id==null || this.AddForm.get('bank_id').value==undefined || this.AddForm.get('bank_id').value.id==null || this.AddForm.get('bank_id').value.id==''){
      this.notification.showError('Please Enter The Bank Name');
      return false;
    }
    if((this.AddForm.get('address_id') as FormGroup).get('line1').value==undefined || (this.AddForm.get('address_id') as FormGroup).get('line1').value=="" || (this.AddForm.get('address_id') as FormGroup).get('line1').value=='' || (this.AddForm.get('address_id') as FormGroup).get('line1').value==null){
      this.notification.showError('Please Fill The Address Line1');
      return false;
    }
    if((this.AddForm.get('address_id') as FormGroup).get('line2').value==undefined || (this.AddForm.get('address_id') as FormGroup).get('line2').value=="" || (this.AddForm.get('address_id') as FormGroup).get('line2').value=='' || (this.AddForm.get('address_id') as FormGroup).get('line2').value==null){
      this.notification.showError('Please Fill The Address Line2');
      return false;
    }
    if((this.AddForm.get('address_id') as FormGroup).get('line3').value==undefined || (this.AddForm.get('address_id') as FormGroup).get('line3').value=="" || (this.AddForm.get('address_id') as FormGroup).get('line3').value=='' || (this.AddForm.get('address_id') as FormGroup).get('line3').value==null){
      this.notification.showError('Please Fill The Address Line3');
      return false;
    }
    if((this.AddForm.get('address_id') as FormGroup).get('pincode_id').value==undefined || (this.AddForm.get('address_id') as FormGroup).get('pincode_id').value.id==undefined || (this.AddForm.get('address_id') as FormGroup).get('pincode_id').value=="" || (this.AddForm.get('address_id') as FormGroup).get('pincode_id').value=='' || (this.AddForm.get('address_id') as FormGroup).get('pincode_id').value==null){
      this.notification.showError('Please Fill The Address Pincode');
      return false;
    }
    if((this.AddForm.get('address_id') as FormGroup).get('city_id').value==undefined || (this.AddForm.get('address_id') as FormGroup).get('city_id').value.id==undefined || (this.AddForm.get('address_id') as FormGroup).get('city_id').value=="" || (this.AddForm.get('address_id') as FormGroup).get('city_id').value=='' || (this.AddForm.get('address_id') as FormGroup).get('city_id').value==null){
      this.notification.showError('Please Fill The Address City');
      return false;
    }
    if((this.AddForm.get('address_id') as FormGroup).get('district_id').value==undefined || (this.AddForm.get('address_id') as FormGroup).get('district_id').value.id==undefined || (this.AddForm.get('address_id') as FormGroup).get('district_id').value=="" || (this.AddForm.get('address_id') as FormGroup).get('district_id').value=='' || (this.AddForm.get('address_id') as FormGroup).get('district_id').value==null){
      this.notification.showError('Please Fill The Address District');
      return false;
    }
    if((this.AddForm.get('address_id') as FormGroup).get('state_id').value==undefined || (this.AddForm.get('address_id') as FormGroup).get('state_id').value.id==undefined || (this.AddForm.get('address_id') as FormGroup).get('state_id').value=="" || (this.AddForm.get('address_id') as FormGroup).get('state_id').value=='' || (this.AddForm.get('address_id') as FormGroup).get('state_id').value==null){
      this.notification.showError('Please Fill The Address State');
      return false;
    }

    

    this.disableSubmit = true;
    this.spinner.show();
    // if (this.AddForm.valid) {
      this.atmaService.branchCreateForm(this.createFormate())
        .subscribe(res => {
          this.spinner.hide();
          console.log("res", res)
          let code = res.code
          if(res['status']=='success'){
            this.notification.showSuccess("saved Successfully!...")
            this.onSubmit.emit();
          }
          if (code === "INVALID_DATA") {
            this.notification.showError("INVALID_DATA...")
            this.disableSubmit = false;
         }  // else {
          //   this.notification.showSuccess(res['code']);
          //   this.notification.showSuccess(res['description']);
          //   // this.notification.showSuccess("saved Successfully!...")
          //   // this.onSubmit.emit();
          // }
        }
        ,
        (error)=>{
          this.spinner.hide();
          this.notification.showError(error.status+error.statusText);
        }
        )
    // } else {
    //   this.notification.showError("INVALID_DATA...")
    //   this.disableSubmit = false;
    // }
  }
  onCancelClick() {
    this.onCancel.emit()
  }

}
class bank {

  name: string;
  ifsccode: any;
  microcode: any;
  bank_id: number;
  address_id: {
    line1: string;
    line2: string;
    line3: string;
    pincode_id: any;
    city_id: any;
    district_id: any;
    state_id: any;
  }
}
