import { Component, OnInit, Output, EventEmitter, ViewChild, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NotificationService } from '../notification.service'
import { AtmaService } from '../atma.service'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { ShareService } from '../share.service'
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, from, fromEvent } from 'rxjs';
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
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class ProductEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  productEditForm: FormGroup;
  pinCodeList: Array<any>;
  cityList: Array<any>;
  stateList: Array<any>;
  districtList: Array<any>;
  
  defaultDate = new FormControl(new Date())
  today = new Date();
  currentDate: any = new Date();
  vendorId: number;
  productEditId: number;
  designationList: Array<Designation>;
  contactTypeList: Array<ContactType>;
  designationList1: Array<Designation>;
  contactTypeList1: Array<ContactType>;
  designationList2: Array<Designation>;
  contactTypeList2: Array<ContactType>;
  designationList3: Array<Designation>;
  contactTypeList3: Array<ContactType>;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  productButton = false;
  productEditbutton = false

  isLoading = false;
  select1: any;
  select2: any;
  select3: any;
  select4: any;
  futureDaysClient1= new Date();
  futureDaysClient2= new Date();
  futureDaysCustomer1= new Date();
  futureDaysCustomer2= new Date();
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('desg') matdesignationAutocomplete: MatAutocomplete;
  @ViewChild('designationInput') designationInput: any;
  @ViewChild('contactType') matcontactAutocomplete: MatAutocomplete;
  @ViewChild('contactInput') contactInput: any;

  @ViewChild('desg1') matdesignation1Autocomplete: MatAutocomplete;
  @ViewChild('designationInput1') designationInput1: any;
  @ViewChild('contactType1') matcontact1Autocomplete: MatAutocomplete;
  @ViewChild('contactInput1') contactInput1: any;

  @ViewChild('desg2') matdesignation2Autocomplete: MatAutocomplete;
  @ViewChild('designationInput2') designationInput2: any;
  @ViewChild('contactType2') matcontact2Autocomplete: MatAutocomplete;
  @ViewChild('contactInput2') contactInput2: any;

  @ViewChild('desg3') matdesignation3Autocomplete: MatAutocomplete;
  @ViewChild('designationInput3') designationInput3: any;
  @ViewChild('contactType3') matcontact3Autocomplete: MatAutocomplete;
  @ViewChild('contactInput3') contactInput3: any;
  constructor(private fb: FormBuilder, private atmaService: AtmaService,
    private notification: NotificationService, private shareService: ShareService,
    private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
    private datePipe: DatePipe,private toastr: ToastrService ) { 
      this.futureDaysClient1.setDate(this.futureDaysClient1.getDate());
      this.futureDaysClient2.setDate(this.futureDaysClient2.getDate());
      this.futureDaysCustomer1.setDate(this.futureDaysCustomer1.getDate());
      this.futureDaysCustomer2.setDate(this.futureDaysCustomer2.getDate());
    }


  ngOnInit(): void {
    this.vendorId = this.shareService.vendorID.value;

    this.productEditForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      age: [''],
      client_contact1: this.fb.group({
        designation_id: ['', Validators.required],
        email: ['', [Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        landline: [''],
        landline2: [''],
        mobile: [''],
        mobile2: [''],
        name: ['', Validators.required],
        dob: [''],
        // type_id: ['', Validators.required],
        wedding_date: [''],
      }),
      client_contact2: this.fb.group({
        designation_id: ['', Validators.required],
        email:['', [ Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        landline: [''],
        landline2: [''],
        mobile: [''],
        mobile2: [''],
        name: ['', Validators.required],
        wedding_date: ['', Validators.required],
        dob: [''],
        // type_id: [''],
      }),
      customer_contact1: this.fb.group({
        designation_id: ['', Validators.required],
        email: ['', [Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        landline: [''],
        landline2: [''],
        mobile: [''],
        mobile2: [''],
        wedding_date: ['', Validators.required],
        name: ['', Validators.required],
        dob: [''],
        // type_id: [''],
      }),
      customer_contact2: this.fb.group({
        designation_id: ['', Validators.required],
        email:['', [ Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        landline: [''],
        landline2: [''],
        mobile: [''],
        mobile2: [''],
        wedding_date: ['', Validators.required],
        name: ['', Validators.required],
        dob: [''],
        // type_id: [''],
      }),

    })
    // let desgkeyvalue: String = "";
    // this.getDesignation(desgkeyvalue);

    // this.productEditForm.controls.client_contact1.get('designation_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.atmaService.get_designation(value,1)
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

    // this.productEditForm.controls.client_contact1.get('type_id').valueChanges
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
    // let desgkeyvalue1: String = "";
    // this.getDesignation(desgkeyvalue1);

    // this.productEditForm.controls.client_contact2.get('designation_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.atmaService.get_designation(value,1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.designationList1 = datas;

    //   })
    // let contactkeyvalue1: String = "";
    // this.getContactType(contactkeyvalue1);

    // this.productEditForm.controls.client_contact2.get('type_id').valueChanges
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
    //     this.contactTypeList1 = datas;

    //   })
    // let desgkeyvalue2: String = "";
    // this.getDesignation(desgkeyvalue2);

    // this.productEditForm.controls.customer_contact1.get('designation_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.atmaService.get_designation(value,1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.designationList2 = datas;

    //   })
    // let contactkeyvalue2: String = "";
    // this.getContactType(contactkeyvalue2);

    // this.productEditForm.controls.customer_contact1.get('type_id').valueChanges
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
    //     this.contactTypeList2 = datas;

    //   })
      // let desgkeyvalue3: String = "";
      // this.getDesignation(desgkeyvalue3);
  
      // this.productEditForm.controls.customer_contact2.get('designation_id').valueChanges
      //   .pipe(
      //     debounceTime(100),
      //     distinctUntilChanged(),
      //     tap(() => {
      //       this.isLoading = true;
      //       console.log('inside tap')
  
      //     }),
      //     switchMap(value => this.atmaService.get_designation(value,1)
      //       .pipe(
      //         finalize(() => {
      //           this.isLoading = false
      //         }),
      //       )
      //     )
      //   )
      //   .subscribe((results: any[]) => {
      //     let datas = results["data"];
      //     this.designationList3 = datas;
  
      //   })
      // let contactkeyvalue3: String = "";
      // this.getContactType(contactkeyvalue3);
  
      // this.productEditForm.controls.customer_contact2.get('type_id').valueChanges
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
      //     this.contactTypeList3 = datas;
  
      //   })  
    
    // this.getPinCode();
    // this.getCity();
    // this.getDistrict();
    // this.getState();
    this.getProductEdit();
  }
  designame(){
    let desgkeyvalue: String = "";
    this.getDesignation(desgkeyvalue);

    this.productEditForm.controls.client_contact1.get('designation_id').valueChanges
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
  designame1(){
    let desgkeyvalue1: String = "";
    this.getDesignation(desgkeyvalue1);

    this.productEditForm.controls.client_contact2.get('designation_id').valueChanges
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
        this.designationList1 = datas;

      })

  }
  designame2(){
    let desgkeyvalue2: String = "";
    this.getDesignation(desgkeyvalue2);

    this.productEditForm.controls.customer_contact1.get('designation_id').valueChanges
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
        this.designationList2 = datas;

      })
  }
  designame3(){
    let desgkeyvalue3: String = "";
      this.getDesignation(desgkeyvalue3);
  
      this.productEditForm.controls.customer_contact2.get('designation_id').valueChanges
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
          this.designationList3 = datas;
  
        })
  }
  public displayFnDesg(desg?: Designation): string | undefined {
    console.log('id', desg.id);
    console.log('name', desg.name);
    return desg ? desg.name : undefined;
  }

  get desg() {
    return this.productEditForm.value.get('designation_id');
  }

  // public displayFnContactType(contactType?: ContactType): string | undefined {
  //   console.log('id', contactType.id);
  //   console.log('name', contactType.name);
  //   return contactType ? contactType.name : undefined;
  // }

  // get contactType() {
  //   return this.productEditForm.value.get('type_id');
  // }
  public displayFnDesg1(desg1?: Designation): string | undefined {
    console.log('id', desg1.id);
    console.log('name', desg1.name);
    return desg1 ? desg1.name : undefined;
  }

  get desg1() {
    return this.productEditForm.value.get('designation_id');
  }

  // public displayFnContactType1(contactType1?: ContactType): string | undefined {
  //   console.log('id', contactType1.id);
  //   console.log('name', contactType1.name);
  //   return contactType1 ? contactType1.name : undefined;
  // }

  // get contactType1() {
  //   return this.productEditForm.value.get('type_id');
  // }

  public displayFnDesg2(desg2?: Designation): string | undefined {
    console.log('id', desg2.id);
    console.log('name', desg2.name);
    return desg2 ? desg2.name : undefined;
  }

  get desg2() {
    return this.productEditForm.value.get('designation_id');
  }

  // public displayFnContactType2(contactType2?: ContactType): string | undefined {
  //   console.log('id', contactType2.id);
  //   console.log('name', contactType2.name);
  //   return contactType2 ? contactType2.name : undefined;
  // }

  // get contactType2() {
  //   return this.productEditForm.value.get('type_id');
  // }

  public displayFnDesg3(desg3?: Designation): string | undefined {
    console.log('id', desg3.id);
    console.log('name', desg3.name);
    return desg3 ? desg3.name : undefined;
  }

  get desg3() {
    return this.productEditForm.value.get('designation_id');
  }

  // public displayFnContactType3(contactType3?: ContactType): string | undefined {
  //   console.log('id', contactType3.id);
  //   console.log('name', contactType3.name);
  //   return contactType3 ? contactType3.name : undefined;
  // }

  // get contactType3() {
  //   return this.productEditForm.value.get('type_id');
  // }

  getProductEdit() {
    let dataa = this.shareService.productEditForm.value;
    console.log("d", dataa)
    this.vendorId = dataa.vendor_id;
    this.productEditId = dataa.id;
    this.atmaService.get_singleproduct(this.vendorId, this.productEditId)
      .subscribe(result => {
        console.log("wholedata", result)
        let data = result
    let Name = data.name;
    let Type = data.type;
    let Age = data.age;
    /*clientData1*/
    let ClientData1 = data.client1_id;
    let d1 = data.client1_id.designation_id
    // let t1 = data.client1_id.type_id
    let clientdob1 = ClientData1.dob;
    let clientEmail1 = ClientData1.email;
    let clientLandLine1 = ClientData1.landline;
    let clientLandLine2 = ClientData1.landline2;
    let clientMobile1 = ClientData1.mobile;
    let clientMobile2 = ClientData1.mobile2;
    let clientName = ClientData1.name;
    let clientWedding1 = ClientData1.wedding_date;
    /*clientData2*/
    let ClientData2 = data.client2_id;
    let d2 = data.client2_id.designation_id
    // let t2 = data.client2_id.type_id
    let clientdob2 = ClientData2.dob;
    let clientEmail2 = ClientData2.email;
    let client2LandLine1 = ClientData2.landline;
    let client2LandLine2 = ClientData2.landline2;
    let client2Mobile1 = ClientData2.mobile;
    let client2Mobile2 = ClientData2.mobile2;
    let clientName2 = ClientData2.name;
    let clientWedding2 = ClientData2.wedding_date;
    /*Customer1*/
    let Customer1 = data.customer1_id
    let d3 = data.customer1_id.designation_id
    // let t3 = data.customer1_id.type_id
    let custdob1 = Customer1.dob;
    let custEmail1 = Customer1.email;
    let custLandLine1 = Customer1.landline;
    let custLandLine2 = Customer1.landline2;
    let custMobile1 = Customer1.mobile;
    let custMobile2 = Customer1.mobile2;
    let custName1 = Customer1.name;
    let custWedding1 = Customer1.wedding_date;
    /*Customer2*/
    let Customer2 = data.customer2_id
    let d4 = data.customer2_id.designation_id
    // let t4 = data.customer2_id.type_id
    let custdob2 = Customer2.dob;
    let custEmail2 = Customer2.email;
    let cust2LandLine = Customer2.landline;
    let cust2LandLine2 = Customer2.landline2;
    let cust2Mobile1 = Customer2.mobile;
    let cust2Mobile2 = Customer2.mobile2;
    let custName2 = Customer2.name;
    let custWedding2 = Customer2.wedding_date;

    this.productEditForm.patchValue({
      name: Name,
      type: Type,
      age: Age,
      client_contact1: {
        designation_id: d1,
        email: clientEmail1,
        landline: clientLandLine1,
        landline2: clientLandLine2,
        mobile: clientMobile1,
        mobile2: clientMobile2,
        name: clientName,
        dob: clientdob1,
        // type_id: t1,
        wedding_date: clientWedding1
      },
      client_contact2: {
        designation_id: d2,
        email: clientEmail2,
        landline: client2LandLine1,
        landline2: client2LandLine2,
        mobile: client2Mobile1,
        mobile2: client2Mobile2,
        name: clientName2,
        dob: clientdob2,
        // type_id: t2,
        wedding_date: clientWedding2

      },

      customer_contact1: {
        designation_id: d3,
        email: custEmail1,
        landline: custLandLine1,
        landline2: custLandLine2,
        mobile: custMobile1,
        mobile2: custMobile2,
        name: custName1,
        dob: custdob1,
        // type_id: t3,
        wedding_date: custWedding1
      },

      customer_contact2: {
        designation_id: d4,
        email: custEmail2,
        landline: cust2LandLine,
        landline2: cust2LandLine2,
        mobile: cust2Mobile1,
        mobile2: cust2Mobile2,
        name: custName2,
        dob: custdob2,
        // type_id: t4,
        wedding_date: custWedding2

      }
    })
  })

  }
  getPinCode() {
    this.atmaService.getPinCode()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pinCodeList = datas;
      })
  }


  getCity() {
    this.atmaService.getCity()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList = datas;
      })
  }
  getState() {
    this.atmaService.getState()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
      })
  }
  getDistrict() {
    this.atmaService.getDistrict()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList = datas;
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
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
  designationScroll1() {
    setTimeout(() => {
      if (
        this.matdesignation1Autocomplete &&
        this.autocompleteTrigger &&
        this.matdesignation1Autocomplete.panel
      ) {
        fromEvent(this.matdesignation1Autocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matdesignation1Autocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matdesignation1Autocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matdesignation1Autocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matdesignation1Autocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.get_designation(this.designationInput1.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.designationList1 = this.designationList1.concat(datas);
                    if (this.designationList1.length >= 0) {
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
  contactScroll1() {
    setTimeout(() => {
      if (
        this.matcontact1Autocomplete &&
        this.autocompleteTrigger &&
        this.matcontact1Autocomplete.panel
      ) {
        fromEvent(this.matcontact1Autocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcontact1Autocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcontact1Autocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcontact1Autocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcontact1Autocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.get_contact(this.contactInput1.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.contactTypeList1 = this.contactTypeList1.concat(datas);
                    if (this.contactTypeList1.length >= 0) {
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
  designationScroll2() {
    setTimeout(() => {
      if (
        this.matdesignation2Autocomplete &&
        this.autocompleteTrigger &&
        this.matdesignation2Autocomplete.panel
      ) {
        fromEvent(this.matdesignation2Autocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matdesignation2Autocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matdesignation2Autocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matdesignation2Autocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matdesignation2Autocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.get_designation(this.designationInput2.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.designationList2 = this.designationList2.concat(datas);
                    if (this.designationList2.length >= 0) {
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
  contactScroll2() {
    setTimeout(() => {
      if (
        this.matcontact2Autocomplete &&
        this.autocompleteTrigger &&
        this.matcontact2Autocomplete.panel
      ) {
        fromEvent(this.matcontact2Autocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcontact2Autocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcontact2Autocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcontact2Autocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcontact2Autocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.get_contact(this.contactInput2.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.contactTypeList2 = this.contactTypeList2.concat(datas);
                    if (this.contactTypeList2.length >= 0) {
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
  designationScroll3() {
    setTimeout(() => {
      if (
        this.matdesignation3Autocomplete &&
        this.autocompleteTrigger &&
        this.matdesignation3Autocomplete.panel
      ) {
        fromEvent(this.matdesignation3Autocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matdesignation3Autocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matdesignation3Autocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matdesignation3Autocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matdesignation3Autocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.get_designation(this.designationInput3.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.designationList3 = this.designationList3.concat(datas);
                    if (this.designationList3.length >= 0) {
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
  contactScroll3() {
    setTimeout(() => {
      if (
        this.matcontact3Autocomplete &&
        this.autocompleteTrigger &&
        this.matcontact3Autocomplete.panel
      ) {
        fromEvent(this.matcontact3Autocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcontact3Autocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcontact3Autocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcontact3Autocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcontact3Autocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.get_contact(this.contactInput3.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.contactTypeList3 = this.contactTypeList3.concat(datas);
                    if (this.contactTypeList3.length >= 0) {
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
  DOBSelection1(event: string) { 
    const date = new Date(event)
    this.select1 = new Date(date.getFullYear() + 18, date.getMonth(), date.getDate())
  }
  DOBSelection2(event: string) { 
    const date = new Date(event)
    this.select2 = new Date(date.getFullYear() + 18, date.getMonth(), date.getDate())
  }
  DOBSelection3(event: string) {
    const date = new Date(event)
    this.select3 = new Date(date.getFullYear() + 18, date.getMonth(), date.getDate())
  }
  DOBSelection4(event: string) {
    const date = new Date(event)
    this.select4 = new Date(date.getFullYear() + 18, date.getMonth(), date.getDate())
  }

  productCreateForm() {
    this.SpinnerService.show();

    if (this.productEditForm.value.type ===""){
      this.toastr.error('Please Select Type');
      this.SpinnerService.hide();
      return false;
    }
    if (this.productEditForm.value.name ===""){
      this.toastr.error('Please Enter Name');
      this.SpinnerService.hide();
      return false;
    }
    
    if( this.productEditForm.value.client_contact1.name === ""){
      this.toastr.error('Please Enter Client Contact Name');
      this.SpinnerService.hide();
      return false;
    }
   
    if( this.productEditForm.value.client_contact1.designation_id === "" || this.productEditForm.value.client_contact1.designation_id.id === undefined){
      this.toastr.error('Please Select Valid Client Contact Designation');
      this.SpinnerService.hide();
      return false;
    }

    if( this.productEditForm.value.client_contact2.name === ""){
      this.toastr.error('Please Enter Client Contact2 Name');
      this.SpinnerService.hide();
      return false;
    }
   
    if( this.productEditForm.value.client_contact2.designation_id === "" || this.productEditForm.value.client_contact2.designation_id.id === undefined){
      this.toastr.error('Please Select Valid Client Contact2 Designation');
      this.SpinnerService.hide();
      return false;
    }
   
    if( this.productEditForm.value.customer_contact1.name === ""){
      this.toastr.error('Please Enter Customer Contact Name');
      this.SpinnerService.hide();
      return false;
    }
  
   if( this.productEditForm.value.customer_contact1.designation_id === "" || this.productEditForm.value.customer_contact1.designation_id.id === undefined){
      this.toastr.error('Please Select Valid Customer Contact Designation');
      this.SpinnerService.hide();
      return false;
    }
   
    if( this.productEditForm.value.customer_contact2.name === ""){
      this.toastr.error('Please Enter Customer Contact2 Name');
      this.SpinnerService.hide();
      return false;
    }
   
    if( this.productEditForm.value.customer_contact2.designation_id === "" || this.productEditForm.value.customer_contact2.designation_id.id === undefined ){
      this.toastr.error('Please Select Valid Customer Contact2 Designation');
      this.SpinnerService.hide();
      return false;
    }
   
            if(this.productEditForm.value.client_contact1.email != ""){
              let a = this.productEditForm.value.client_contact1.email
              let b = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
              let c = b.test(a)
              console.log(c)
                if (c === false){
                  this.toastr.error('Please Enter Valid Client Contact Email');
                  this.SpinnerService.hide();
                  return false;
                }
              }
              if(this.productEditForm.value.client_contact1.mobile.length != ""){
                if( this.productEditForm.value.client_contact1.mobile.length != 10 ){
                  this.toastr.error('Client Contact MobileNo length should be 10 chars');
                  this.SpinnerService.hide();
                  return false;
                }}
                if(this.productEditForm.value.client_contact1.mobile2.length != ""){
                if( this.productEditForm.value.client_contact1.mobile2.length != 10){
                  this.toastr.error('Client Contact MobileNo2 length should be 10 chars');
                  this.SpinnerService.hide();
                  return false;
                }}
      
      
                if(this.productEditForm.value.client_contact2.email != ""){
                let a1 = this.productEditForm.value.client_contact2.email
                let b1 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                let c1 = b1.test(a1)
                console.log(c1)
                  if (c1 === false){
                    this.toastr.error('Please Enter Valid Client Contact2 Email');
                    this.SpinnerService.hide();
                    return false;
                  }}
                  if(this.productEditForm.value.client_contact2.mobile.length != ""){
                  if( this.productEditForm.value.client_contact2.mobile.length != 10){
                    this.toastr.error('Client Contact2 MobileNo length should be 10 chars');
                    this.SpinnerService.hide();
                    return false;
                  }}
                  if(this.productEditForm.value.client_contact2.mobile2.length != ""){
                  if( this.productEditForm.value.client_contact2.mobile2.length != 10){
                    this.toastr.error('Client Contact2 MobileNo2 length should be 10 chars');
                    this.SpinnerService.hide();
                    return false;
                  }}
      
      
                if(this.productEditForm.value.customer_contact1.email != ""){
                let a2 = this.productEditForm.value.customer_contact1.email
                let b2 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                let c2 = b2.test(a2)
                console.log(c2)
                  if (c2 === false){
                    this.toastr.error('Please Enter Valid Customer Contact Email');
                    this.SpinnerService.hide();
                    return false;
                  }}
                  if(this.productEditForm.value.customer_contact1.mobile.length != ""){
                  if( this.productEditForm.value.customer_contact1.mobile.length != 10){
                    this.toastr.error('Customer Contact MobileNo length should be 10 chars');
                    this.SpinnerService.hide();
                    return false;
                  }}
                  if(this.productEditForm.value.customer_contact1.mobile2.length != ""){
                  if( this.productEditForm.value.customer_contact1.mobile2.length != 10){
                    this.toastr.error('Customer Contact MobileNo2 length should be 10 chars');
                    this.SpinnerService.hide();
                    return false;
                  }}
      
                if(this.productEditForm.value.customer_contact2.email != ""){
                let a3 = this.productEditForm.value.customer_contact2.email
                let b3 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                let c3 = b3.test(a3)
                console.log(c3)
                  if (c3 === false){
                    this.toastr.error('Please Enter Valid Customer Contact2 Email');
                    this.SpinnerService.hide();
                    return false;
                  }}
                  if(this.productEditForm.value.customer_contact2.mobile.length != ""){
                  if( this.productEditForm.value.customer_contact2.mobile.length != 10){
                    this.toastr.error('Customer Contact2 MobileNo length should be 10 chars');
                    this.SpinnerService.hide();
                    return false;
                  }}
                  if(this.productEditForm.value.customer_contact2.mobile2.length != ""){
                  if( this.productEditForm.value.customer_contact2.mobile2.length != 10){
                    this.toastr.error('Customer Contact2 MobileNo2 length should be 10 chars');
                    this.SpinnerService.hide();
                    return false;
                  }}
            




    const clientContact1 = this.productEditForm.value;
    const clientContact2 = this.productEditForm.value;
    const clientWedding1 = this.productEditForm.value;
    const clientWedding2 = this.productEditForm.value;
    const customerContact1 = this.productEditForm.value;
    const customerContact2 = this.productEditForm.value;
    const customerWedding1 = this.productEditForm.value;
    const customerWedding2 = this.productEditForm.value;
    if(this.productEditForm.controls.client_contact1.value.dob != "None"){
      clientContact1.client_contact1.dob = this.datePipe.transform(clientContact1.client_contact1.dob, 'yyyy-MM-dd');
    }
     else {
      this.productEditForm.controls.client_contact1.value.dob = null
     }
     if(this.productEditForm.controls.client_contact1.value.wedding_date != "None"){
      clientWedding1.client_contact1.wedding_date = this.datePipe.transform(clientWedding1.client_contact1.wedding_date, 'yyyy-MM-dd');
   } else {
    this.productEditForm.controls.client_contact1.value.wedding_date = null
   }



   if(this.productEditForm.controls.client_contact2.value.dob != "None"){
    clientContact2.client_contact2.dob = this.datePipe.transform(clientContact2.client_contact2.dob,'yyyy-MM-dd');
  }
   else {
    this.productEditForm.controls.client_contact2.value.dob = null
   }
   if(this.productEditForm.controls.client_contact2.value.wedding_date != "None"){
    clientWedding2.client_contact2.wedding_date = this.datePipe.transform(clientWedding2.client_contact2.wedding_date, 'yyyy-MM-dd');
 } else {
  this.productEditForm.controls.client_contact2.value.wedding_date = null
 }


 if(this.productEditForm.controls.customer_contact1.value.dob != "None"){
  customerContact1.customer_contact1.dob = this.datePipe.transform(customerContact1.customer_contact1.dob, 'yyyy-MM-dd');
}
 else {
  this.productEditForm.controls.customer_contact1.value.dob = null
 }
 if(this.productEditForm.controls.customer_contact1.value.wedding_date != "None"){
  customerWedding1.customer_contact1.wedding_date = this.datePipe.transform(customerWedding1.customer_contact1.wedding_date, 'yyyy-MM-dd');
} else {
this.productEditForm.controls.customer_contact1.value.wedding_date = null
}



if(this.productEditForm.controls.customer_contact2.value.dob != "None"){
  customerContact2.customer_contact2.dob = this.datePipe.transform(customerContact2.customer_contact2.dob, 'yyyy-MM-dd');
}
 else {
  this.productEditForm.controls.customer_contact2.value.dob = null
 }
 if(this.productEditForm.controls.customer_contact2.value.wedding_date != "None"){
  customerWedding2.customer_contact2.wedding_date = this.datePipe.transform(customerWedding2.customer_contact2.wedding_date, 'yyyy-MM-dd');
} else {
this.productEditForm.controls.customer_contact2.value.wedding_date = null
}





    this.productEditForm.controls.client_contact1.value.designation_id = this.productEditForm.controls.client_contact1.value.designation_id.id
    // this.productEditForm.controls.client_contact1.value.type_id = this.productEditForm.controls.client_contact1.value.type_id.id
    this.productEditForm.controls.client_contact2.value.designation_id = this.productEditForm.controls.client_contact2.value.designation_id.id
    // this.productEditForm.controls.client_contact2.value.type_id = this.productEditForm.controls.client_contact2.value.type_id.id
    this.productEditForm.controls.customer_contact1.value.designation_id = this.productEditForm.controls.customer_contact1.value.designation_id.id
    // this.productEditForm.controls.customer_contact1.value.type_id = this.productEditForm.controls.customer_contact1.value.type_id.id
    this.productEditForm.controls.customer_contact2.value.designation_id = this.productEditForm.controls.customer_contact2.value.designation_id.id
    // this.productEditForm.controls.customer_contact2.value.type_id = this.productEditForm.controls.customer_contact2.value.type_id.id


    var str = this.productEditForm.value.name
    var cleanStr_name=str.trim();//trim() returns string with outer spaces removed
    this.productEditForm.value.name = cleanStr_name



    var str = this.productEditForm.value.client_contact1.name
    var cleanStr1=str.trim();//trim() returns string with outer spaces removed
    this.productEditForm.value.client_contact1.name = cleanStr1

    var str = this.productEditForm.value.client_contact1.email
    var cleanStr11=str.trim();//trim() returns string with outer spaces removed
    this.productEditForm.value.client_contact1.email = cleanStr11

    var str = this.productEditForm.value.client_contact2.name
    var cleanStr12=str.trim();//trim() returns string with outer spaces removed
    this.productEditForm.value.client_contact2.name = cleanStr12
   
    var str = this.productEditForm.value.client_contact2.email
    var cleanStr13=str.trim();//trim() returns string with outer spaces removed
    this.productEditForm.value.client_contact2.email = cleanStr13


    
    var str = this.productEditForm.value.customer_contact1.name
    var cleanStr14=str.trim();//trim() returns string with outer spaces removed
    this.productEditForm.value.customer_contact1.name = cleanStr14

    var str = this.productEditForm.value.customer_contact1.email
    var cleanStr15=str.trim();//trim() returns string with outer spaces removed
    this.productEditForm.value.customer_contact1.email = cleanStr15

    var str = this.productEditForm.value.customer_contact2.name
    var cleanStr16=str.trim();//trim() returns string with outer spaces removed
    this.productEditForm.value.customer_contact2.name = cleanStr16
   
    var str = this.productEditForm.value.customer_contact2.email
    var cleanStr17=str.trim();//trim() returns string with outer spaces removed
    this.productEditForm.value.customer_contact2.email = cleanStr17

    this.atmaService.productEditForm(this.productEditId, this.vendorId, this.productEditForm.value)
      .subscribe(res => {
        if(res.id === undefined){
          this.notification.showError(res.description)
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
  client1Copy(data) {
    let datas = data
    let Name = data.value.name;
    let EMail = data.value.email;
    let Designation = datas.value.designation_id
    let landLine1 = datas.value.landline;
    let landLine2 = datas.value.landline2;
    let mobile1 = datas.value.mobile;
    let mobile2 = datas.value.mobile2;
    let dob = datas.value.dob
    let weddingDate = datas.value.wedding_date
    this.productEditForm.patchValue({
      client_contact2: {
        name: Name,
        email: EMail,
        designation_id: Designation,
        landline: landLine1,
        landline2: landLine2,
        mobile: mobile1,
        mobile2: mobile2,
        dob: dob,
        wedding_date: weddingDate
      }
    })
    this.productEditForm.controls.client_contact2.enable();
  }

  customer1Copy(data) {
    let datas = data
    let Name = data.value.name;
    let EMail = data.value.email;
    let Designation = datas.value.designation_id
    // let Type = datas.value.type_id;
    let landLine1 = datas.value.landline;
    let landLine2 = datas.value.landline2;
    let mobile1 = datas.value.mobile;
    let mobile2 = datas.value.mobile2;
    let dob = datas.value.dob
    let weddingDate = datas.value.wedding_date
    this.productEditForm.patchValue({
      customer_contact2: {
        name: Name,
        email: EMail,
        designation_id: Designation,
        landline: landLine1,
        landline2: landLine2,
        mobile: mobile1,
        mobile2: mobile2,
        dob: dob,
        // type_id: Type,
        wedding_date: weddingDate
      }
    })
    this.productEditForm.controls.customer_contact2.enable()

  }
}
