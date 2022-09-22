import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Observable, from, fromEvent } from 'rxjs';
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { ShareService } from '../share.service'
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';

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
@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.scss']
})
export class ClientEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  clientEditForm: FormGroup;
  vendorId: number;
  clientEditId: number;
  cityId: any;
  districtId: any;
  stateId: number;
  stateName_: string;
  pincodeId: number
  clientEditButton = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  pinCodeList: Array<pincode>;
  cityList: Array<city>;
  stateList: Array<state>;
  districtList: Array<district>;
  isLoading = false;
  stateID = 0;

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

  constructor(private atmaService: AtmaService, private notification: NotificationService, private toastr: ToastrService,
    private shareService: ShareService, private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.vendorId = this.shareService.vendorID.value;
    // this.getPinCode();
    // this.getCity();
    // this.getDistrict();
    // this.getState();


    this.clientEditForm = this.fb.group({
      name: ['', Validators.required],
      address: this.fb.group({
        line1: ['', Validators.required],
        pincode_id: ['', Validators.required],
        city_id: ['', Validators.required],
        district_id: ['', Validators.required],
        state_id: ['', Validators.required],
        line2: [''],
        line3: [''],
      }),
    })
    // let districtkeyvalue: String = "";
    // this.getDistrict(districtkeyvalue);

    // this.clientEditForm.controls.address.get('district_id').valueChanges
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
    // let districtkeyvalue: String = "";
    // this.getDistrict(districtkeyvalue);

    // this.clientEditForm.controls.address.get('district_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.atmaService.get_districtValue(this.stateID, value, 1)
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

    // this.clientEditForm.controls.address.get('city_id').valueChanges
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
    // let pincodekeyvalue: String = "";
    // this.getPinCode(pincodekeyvalue);

    // this.clientEditForm.controls.address.get('pincode_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),

    //     switchMap(value => this.atmaService.get_pinCode(value, 1)
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

    // this.clientEditForm.controls.address.get('state_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),

    //     switchMap(value => this.atmaService.get_state(value, 1)
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

    this.getClientEdit();

  }
  districtname(){
    let districtkeyvalue: String = "";
    this.getDistrict(districtkeyvalue);

    this.clientEditForm.controls.address.get('district_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.atmaService.get_districtValue(this.stateID, value, 1)
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

    this.clientEditForm.controls.address.get('city_id').valueChanges
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
  pincodename(){
    let pincodekeyvalue: String = "";
    this.getPinCode(pincodekeyvalue);

    this.clientEditForm.controls.address.get('pincode_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),

        switchMap(value => this.atmaService.get_pinCode(value, 1)
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

    this.clientEditForm.controls.address.get('state_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),

        switchMap(value => this.atmaService.get_state(value, 1)
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
  getClientEdit() {
    let data = this.shareService.clientEditForm.value;
    this.vendorId = data.vendor_id;
    this.clientEditId = data.id
    let Name = data.name;
    let Address = data.address_id;
    let District = data.address_id.district_id
    let City = data.address_id.city_id
    let State = data.address_id.state_id
    let PinCode = data.address_id.pincode_id
    let Line1 = Address.line1;
    let Line2 = Address.line2
    let Line3 = Address.line3;
    this.clientEditForm.patchValue({
      name: Name,
      address: {
        line1: Line1,
        line2: Line2,
        line3: Line3,
        district_id: District,
        state_id: State,
        pincode_id: PinCode,
        city_id: City
      }
    })
  }

  public displaydis(autodis?: district): string | undefined {
    return autodis ? autodis.name : undefined;
  }

  get autodis() {
    return this.clientEditForm.controls.address.get('district_id');
  }

  public displaycit(autocit?: city): string | undefined {
    return autocit ? autocit.name : undefined;
  }

  get autocit() {
    return this.clientEditForm.controls.address.get('city_id');
  }

  public displayFnpin(pintype?: pincode): string | undefined {
    return pintype ? pintype.no : undefined;
  }

  get pintype() {
    return this.clientEditForm.controls.address.get('pincode_id');
  }

  public displayFnstate(statetype?: state): string | undefined {
    console.log('id', statetype.id);
    console.log('name', statetype.name);
    return statetype ? statetype.name : undefined;
  }

  get statetype() {
    return this.clientEditForm.controls.address.get('state_id');
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
    this.atmaService.districtdropdown(this.stateID, districtkeyvalue)
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
                this.atmaService.get_districtValue(this.stateID, this.districtInput.nativeElement.value, this.currentpage + 1)
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
  states(data) {
    console.log("state", data)
    let id = data.id
    this.stateID = id
    this.districtInput.nativeElement.value = ' ';
    let districtkeyvalue: String = "";
    this.getDistrict(districtkeyvalue);
  }

  districts(data) {
    this.cityInput.nativeElement.value = ' ';
    let citykey: String = "";
    this.atmaService.get_cityValue(this.stateID, citykey)
      .subscribe((results: any[]) => {
        console.log("city", results)
        let datas = results["data"];
        this.cityList = datas;
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
  clientEditForm_() {
    this.SpinnerService.show();
    
    

    if (this.clientEditForm.value.name === "") {
      this.toastr.error('Please Enter Name');
      this.SpinnerService.hide();
      return false;
    }
    if (this.clientEditForm.value.address.line1 === "") {
      this.toastr.error('Please Enter Address1');
      this.SpinnerService.hide();
      return false;
    }

    if (this.clientEditForm.value.address.pincode_id.id === undefined || this.clientEditForm.value.address.pincode_id === "") {
      this.toastr.error('Please Select Valid Pincode');
      this.SpinnerService.hide();
      return false;
    }
    if (this.clientEditForm.value.address.city_id.id === undefined || this.clientEditForm.value.address.city_id === "") {
      this.toastr.error('Please Select Valid city');
      this.SpinnerService.hide();
      return false;
    }
    if (this.clientEditForm.value.address.district_id.id === undefined || this.clientEditForm.value.address.district_id === "") {
      this.toastr.error('Please Select Valid district');
      this.SpinnerService.hide();
      return false;
    }
    if (this.clientEditForm.value.address.state_id.id === undefined || this.clientEditForm.value.address.state_id === "") {
      this.toastr.error('Please Select Valid state');
      this.SpinnerService.hide();
      return false;
    }



    this.clientEditForm.controls.address.value.pincode_id = this.clientEditForm.controls.address.value.pincode_id.id;
    this.clientEditForm.controls.address.value.city_id = this.clientEditForm.controls.address.value.city_id.id;
    this.clientEditForm.controls.address.value.district_id = this.clientEditForm.controls.address.value.district_id.id;
    this.clientEditForm.controls.address.value.state_id = this.clientEditForm.controls.address.value.state_id.id;


    var str = this.clientEditForm.value.name
    var cleanStr=str.trim();//trim() returns string with outer spaces removed
    this.clientEditForm.value.name = cleanStr

    var str = this.clientEditForm.value.address.line1
    var cleanStr1=str.trim();//trim() returns string with outer spaces removed
    this.clientEditForm.value.address.line1 = cleanStr1

    var str = this.clientEditForm.value.address.line2
    var cleanStr2=str.trim();//trim() returns string with outer spaces removed
    this.clientEditForm.value.address.line2 = cleanStr2


    var str = this.clientEditForm.value.address.line3
    var cleanStr3=str.trim();//trim() returns string with outer spaces removed
    this.clientEditForm.value.address.line3 = cleanStr3



    this.atmaService.clientEditForm(this.clientEditId, this.vendorId, this.clientEditForm.value)
      .subscribe(res => {
        if(res.id === undefined){
          this.notification.showError(res.description);
          this.SpinnerService.hide();
          return false;
        }

        else {
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
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  pinCode(data) {
    this.cityId = data.city;
    this.districtId = data.district;
    this.stateId = data.state;
    this.pincodeId = data
    this.clientEditForm.patchValue({
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
    this.clientEditForm.patchValue({
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
}
