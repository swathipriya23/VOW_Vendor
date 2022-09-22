import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable, from, fromEvent } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Router } from '@angular/router'
import { AtmaService } from '../atma.service'
import { ShareService } from '../share.service'
import { NotificationService } from '../notification.service'
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
  selector: 'app-bankbranch-edit',
  templateUrl: './bankbranch-edit.component.html',
  styleUrls: ['./bankbranch-edit.component.scss']
})
export class BankbranchEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  bankbranchEditForm: FormGroup;

  cityId: number;
  districtId: number;
  stateId: number;
  pincodeId: number;
  isLoading = false;
  disableSubmit = true;
  bankBranch: any;
  
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
@ViewChild('SCROLLbankInput') SCROLLbankInput: any;

@ViewChild('citytype') matcitAutocomplete: MatAutocomplete;
@ViewChild('SCROLLcityInput') SCROLLcityInput: any;

@ViewChild('districttype') matdisAutocomplete: MatAutocomplete;
@ViewChild('SCROLLdistrictInput') SCROLLdistrictInput: any;

@ViewChild('statetype') matstatAutocomplete: MatAutocomplete;
@ViewChild('SCROLLstateInput') SCROLLstateInput: any;

@ViewChild('pintype') matpinAutocomplete: MatAutocomplete;
@ViewChild('SCROLLpinInput') SCROLLpinInput: any;
inputIFSCValue = "";
has_next = true;
has_previous = true;
currentpage: number = 1;



  constructor(private router: Router, private fb: FormBuilder, private notification: NotificationService,
    private sharedService: ShareService, private atmaService: AtmaService,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.bankbranchEditForm = this.fb.group({
     
      name: ['', Validators.required],
      ifsccode: ['', Validators.required],
      microcode: ['', Validators.required],
      bank_id: ['', Validators.required],
      address_id: this.fb.group({
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

    this.bankbranchEditForm.get('bank_id').valueChanges
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
    this.getBankbranchEdit();

    let pinkeyvalue:String="";
    this.getPinCode(pinkeyvalue);
    
    this.bankbranchEditForm.controls.address_id.get('pincode_id').valueChanges
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
    
    let citykeyvalue:String="";
    this.getCity(citykeyvalue);
    this.bankbranchEditForm.controls.address_id.get('city_id').valueChanges
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
  
    let districtkeyvalue:String="";
    this.getDistrict(districtkeyvalue);
    this.bankbranchEditForm.controls.address_id.get('district_id').valueChanges
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
    
    let statekeyvalue:String="";
    this.getState(statekeyvalue);
    this.bankbranchEditForm.controls.address_id.get('state_id').valueChanges
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
                this.atmaService.getBankSearchdd(this.SCROLLbankInput.nativeElement.value, this.currentpage + 1)
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
    return this.bankbranchEditForm.get('bank_id');
  }

  getBankbranchEdit() {
    let datas: any = this.sharedService.bankBranchEditValue.value;
    console.log("EDit.............", datas)
    this.bankBranch = datas.id
    console.log("id",this.bankBranch)
    this.atmaService.get_singleBankBranch(this.bankBranch)
      .subscribe(result => {
        let data = result
        console.log("ss", data)
    let Name = data.name;
    let Ifsccode = data.ifsccode;
    let Microcode = data.microcode;
    let bankName = data.bank
    let Address = data.address_id;
    let Line = Address.line1;
  
    let pincodeid = data.address_id.pincode_id
    let cityid = data.address_id.city_id
    let Stateid = data.address_id.state_id
    let districtid = data.address_id.district_id
    let addressLandLine2 = Address.line2;
    let addressLandLine3 = Address.line3;
    this.bankbranchEditForm.patchValue({
     
      "name": Name,
      "ifsccode": Ifsccode,
      "microcode": Microcode,
      "bank_id": bankName,
      address_id: {
        line1: Line,
        line2: addressLandLine2,
        line3: addressLandLine3,
        "pincode_id": pincodeid,
        "city_id": cityid,
        "state_id": Stateid,
        "district_id": districtid,
      },
    })
  })

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
                this.atmaService.getPinCodeDropDownscroll(this.SCROLLpinInput.nativeElement.value, this.currentpage + 1)
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
    return this.bankbranchEditForm.controls.address_id.get('pincode_id');
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
                this.atmaService.getCityDropDownscroll(this.SCROLLcityInput.nativeElement.value, this.currentpage + 1)
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
    return this.bankbranchEditForm.controls.address_id.get('city_id');
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

  
  public displayFnstate(statetype?: stateListss): string | undefined {
    console.log('id',statetype.id);
    console.log('name',statetype.name);
    return statetype ? statetype.name : undefined;
  }

  get statetype() {
    return this.bankbranchEditForm.controls.address_id.get('state_id');
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
                this.atmaService.getStateDropDownscroll(this.SCROLLstateInput.nativeElement.value, this.currentpage + 1)
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
                this.atmaService.getDistrictDropDownscroll(this.SCROLLdistrictInput.nativeElement.value, this.currentpage + 1)
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
    return this.bankbranchEditForm.controls.address_id.get('district_id');
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
    this.bankbranchEditForm.patchValue({
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
    this.bankbranchEditForm.patchValue({
      address_id: {
        city_id: this.cityId,
        state_id: this.stateId,
        district_id: this.districtId,
        pincode_id: this.pincodeId
      }
    })
  }

  createFormate() {
    let data = this.bankbranchEditForm.controls;
    let datas = this.bankbranchEditForm.controls.address_id
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
  editBranchForm() {
    if(this.bankbranchEditForm.get('name').value==null || this.bankbranchEditForm.get('name').value=='' || this.bankbranchEditForm.get('name').value==null){
      this.notification.showError("Please Enter The Name");
      return false;
    }
    if(this.bankbranchEditForm.get('ifsccode').value==null || this.bankbranchEditForm.get('ifsccode').value=='' || this.bankbranchEditForm.get('ifsccode').value==null){
      this.notification.showError("Please Enter The IFSCCode");
      return false;
    }
    if(this.bankbranchEditForm.get('microcode').value==null || this.bankbranchEditForm.get('microcode').value=='' || this.bankbranchEditForm.get('microcode').value==null){
      this.notification.showError("Please Enter The MicroCode");
      return false;
    }
    if(this.bankbranchEditForm.get('bank_id').value==null || this.bankbranchEditForm.get('bank_id').value=='' || this.bankbranchEditForm.get('bank_id').value==null){
      this.notification.showError("Please Enter The Bank Name");
      return false;
    }
    if((this.bankbranchEditForm.get('address_id') as FormGroup).get('line1').value==undefined || (this.bankbranchEditForm.get('address_id') as FormGroup).get('line1').value=='' || (this.bankbranchEditForm.get('address_id') as FormGroup).get('line1').value==null){
      this.notification.showError('Please Enter The Address Line1');
      return false;
    }
    if((this.bankbranchEditForm.get('address_id') as FormGroup).get('line2').value==undefined || (this.bankbranchEditForm.get('address_id') as FormGroup).get('line2').value=='' || (this.bankbranchEditForm.get('address_id') as FormGroup).get('line2').value==null){
      this.notification.showError('Please Enter The Address Line2');
      return false;
    }
    if((this.bankbranchEditForm.get('address_id') as FormGroup).get('line3').value==undefined || (this.bankbranchEditForm.get('address_id') as FormGroup).get('line3').value=='' || (this.bankbranchEditForm.get('address_id') as FormGroup).get('line3').value==null){
      this.notification.showError('Please Enter The Address Line2');
      return false;
    }
    if((this.bankbranchEditForm.get('address_id') as FormGroup).get('city_id').value==undefined || (this.bankbranchEditForm.get('address_id') as FormGroup).get('city_id').value=='' || (this.bankbranchEditForm.get('address_id') as FormGroup).get('city_id').value==null){
      this.notification.showError('Please Enter The Address City');
      return false;
    }
    if((this.bankbranchEditForm.get('address_id') as FormGroup).get('district_id').value==undefined || (this.bankbranchEditForm.get('address_id') as FormGroup).get('district_id').value=='' || (this.bankbranchEditForm.get('address_id') as FormGroup).get('district_id').value==null){
      this.notification.showError('Please Enter The Address District');
      return false;
    }
    if((this.bankbranchEditForm.get('address_id') as FormGroup).get('state_id').value==undefined || (this.bankbranchEditForm.get('address_id') as FormGroup).get('state_id').value=='' || (this.bankbranchEditForm.get('address_id') as FormGroup).get('state_id').value==null){
      this.notification.showError('Please Enter The Address State');
      return false;
    }
    if((this.bankbranchEditForm.get('address_id') as FormGroup).get('pincode_id').value==undefined || (this.bankbranchEditForm.get('address_id') as FormGroup).get('pincode_id').value=='' || (this.bankbranchEditForm.get('address_id') as FormGroup).get('pincode_id').value==null){
      this.notification.showError('Please Enter The Address PinCode');
      return false;
    }
    this.spinner.show();
    this.disableSubmit = true;
    // if (this.bankbranchEditForm.valid) {
      let data: any = this.sharedService.bankBranchEditValue.value
      this.atmaService.editbranchForm(this.createFormate(), data.id)
        .subscribe(res => {
          console.log("res", res);
          this.spinner.hide();
          let code = res.code;
          if(res['status']=='success'){
            this.notification.showSuccess("Updated Successfully!...")
            this.onSubmit.emit();
            console.log("brancheditRes>>>>>>>>>>>>>>", res)
          }
          else if  (code === "INVALID_DATA") {
            this.notification.showError("INVALID_DATA...")
            this.disableSubmit = false;
          } else {
            this.notification.showSuccess(res['code']);
            this.notification.showSuccess(res['description']);
            // this.notification.showSuccess("Updated Successfully!...")
            // this.onSubmit.emit();
            // console.log("brancheditRes>>>>>>>>>>>>>>", res)
          }
        },
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
  code: string;
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