import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { EcfService } from '../ecf.service';
import { ShareService } from '../share.service';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { TextFieldModule } from '@angular/cdk/text-field';
export interface commoditylistss {
  id: string;
  name: string;
}
export interface approverListss {
  id: string;
  name: string;
  limit: number;
 }
export interface branchListss {
  id: any;
  name: string;
  code: string;
  codename: string;
}
export interface hsnlistss {
  id: any;
  name: string;
  code: string;
}
export interface uomlistss {
  id: any;
  name: string;
  code: string;
}
export interface catlistss {
  id: any;
  name: string;
  code: any
}
export interface subcatlistss {
  id: any;
  name: string;
  code: string;
}
export interface bslistss {
  id: any;
  name: string;
  code: any
}
export interface cclistss {
  id: any;
  name: string;
  code: any
}
export interface SupplierName {
  id: number;
  name: string;
}
export interface taxtypefilterValue {
  id: number;
  subtax_type: string;
}
export interface paytofilterValue {
  id: string;
  text: string;
}
export interface ppxfilterValue {
  id: string;
  text: string;
}
export interface clientlists {
  id: string;
  client_code: string;
  client_name: string;
}
export interface rmlists {
  id: string;
  full_name: string;
  name: string
}
export interface emplists {
  id: string;
  full_name: string;
  name: string;
}
export interface productcodelists {
  id: string;
  bsproduct_code: string;
  bsproduct_name: string;
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
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd/MM/yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'app-ecf-inventory',
  templateUrl: './ecf-inventory.component.html',
  styleUrls: ['./ecf-inventory.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class EcfInventoryComponent implements OnInit {
  showheaderdata = true
  showinvocedetail = false
  ecfheaderForm: FormGroup
  TypeList: any
  commodityList: Array<commoditylistss>
  clientlist: Array<clientlists>
  rmlist: Array<rmlists>
  emplist: Array<emplists>
  uploadList = [];
  images: string[] = [];
  @ViewChild('takeInput', { static: false }) InputVar: ElementRef;
  @ViewChild('fileInput', { static: false }) InputVars: ElementRef;
  ppxLoad = true
  crnLoad = true
  ppxList: any
  ppxdata:any
  crndata:any
  ppxForm:FormGroup
  crnForm:FormGroup
  advancetypeList: any
  payList: any
  isLoading = false;
  attachmentlist: any
  showppxmodal = false
  showcrnmodal = false
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  showppx = false
  showpayto = false
  showsupptype = true
  showadvance = false
  showgstapply = false
  showgsttt = true
  SupptypeList: any
  ecfheaderid: any
  ecftypeid: any
  tomorrow = new Date();
  showviewinvoice = false
  showviewinvoices = false
  showeditinvhdrform = false
  showaddbtn = false
  showaddbtns = true
  disableecfsave = false
  invheadersave = false
  showadddebits = false
  showadddebit = true
  invdtlsave = false
  submitdebitdtlbtn = false
  showdebitpopup = true
  showtaxtypes = [true, true, true, true, true, true, true, true, true]
  showtaxrates = [true, true, true, true, true, true, true, true, true]
  showaddinvheader = false
  hideinv = false
  showgstaplicable = true
  showsplit = false
  showdelete = false
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('commoditytype') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('commodityInput') commodityInput: any;
  @ViewChild('clientrole') matclientAutocomplete: MatAutocomplete;
  @ViewChild('clientInput') clientInput: any;
  @ViewChild('rmrole') matrmAutocomplete: MatAutocomplete;
  @ViewChild('rmInput') rmInput: any;
  @ViewChild('behalfEmp') matBehalfAutocomplete: MatAutocomplete;
  @ViewChild('behalfInput') behalfInput: any;
 @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  behalfyesorno = [{ 'value': true, 'display': 'Yes'}, { 'value': false, 'display': 'No' }]
  InvoiceHeaderForm: FormGroup
  SelectSupplierForm: FormGroup
  SupplierCode: string;
  SupplierGSTNumber: string;
  SupplierPANNumber: string;
  Address: string;
  City: string;
  line1: any;
  line2: any;
  line3: any;
  default = true
  alternate = false
  JsonArray = []
  submitbutton = false;
  suplist: any
  inputSUPPLIERValue = "";
  supplierNameData: any;
  selectsupplierlist: any;
  gstyesno: any
  supplierid: any
  supp: any
  supplierindex: any
  stateid: any
  Invoicedata: any
  date: any
  ecfid: any
  invoiceheaderid: any
  invoiceno: any
  invheaderdata: any
  invoiceheaderres: any
  ivoicehid: any
  @Output() linesChange = new EventEmitter<any>();
  @ViewChild('Suppliertype') matsupAutocomplete: MatAutocomplete;
  @ViewChild('suppInput') suppInput: any;
  SupplierName: any
  toto: any
  amt: any
  sum: any
  AddinvDetails = true
  delinvid: any
  getsuplist: any
  discreditbtn = false
  Approverlist: Array<approverListss>;
  Branchlist: Array<branchListss>;
  SubmitoverallForm: FormGroup
  submitoverallbtn = false
  ECFData: any
  tdsList: any
  @ViewChild('branchtype') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('approvertype') matappAutocomplete: MatAutocomplete;
  @ViewChild('approverInput') approverInput: any;
  invoiceheaderdetailForm: FormGroup
  InvoiceDetailForm: FormGroup
  hsnList: Array<hsnlistss>
  uomList: Array<uomlistss>
  @ViewChild('hsntype') mathsnAutocomplete: MatAutocomplete;
  @ViewChild('hsnInput') hsnInput: any;
  @ViewChild('uomtype') matuomAutocomplete: MatAutocomplete;
  @ViewChild('uomInput') uomInput: any;
  @ViewChild('taxtype') mattactypeAutocomplete: MatAutocomplete;
  @ViewChild('taxtypeInput') taxtypeInput: any;
  hsncodess: any
  totaltax: any
  indexDet: any
  invoicedetailsdata: any
  delinvdtlid: any
  ccbspercentage: any
  AdddebitDetails = true
  INVsum: any
  INVamt: any
  totalamount: any
  totaltaxable: any
  overalltotal: any
  igstrate: any
  cgstrate: any
  sgstrate: any
  type: any
  ecfheaderidd: any
  creditglForm: FormGroup
  accList: any
  showaccno = [false, false, false, false, false, false, false, false, false]
  creditbrnchList: any
  credittranList: any
  showtranspay = [false, false, false, false, false, false, false, false, false]
  showtaxtype = [false, false, false, false, false, false, false, false, false]
  showtaxrate = [false, false, false, false, false, false, false, false, false]
  showeraacc = [false, false, false, false, false, false, false, false, false]
  showglpopup = false
  showgrnpopup = false
  glList: any
  taxlist: any
  taxratelist: any
  PaymodeNonPoList: any
  PaymodeNonPoLists: any
  PaymodeNonPocrnList:any
  PaymodeNonPoliqList:any
  PaymodeAdvVenList: any
  PaymodeAdvERAList: any
  PaymodeAdvBRAList: any
  PaymodeERAList: any
  PaymodeERALists: any
  PaymodeCRNList = [{"code": "P0009","gl_flag": "Adjustable","id": 11,"name": "CRNGL",}]
  addcreditindex: any
  @ViewChild('closebutton') closebutton;
  @ViewChild('closebuttons') closebuttons;
  @ViewChild('closedbuttons') closedbuttons;
  @ViewChild('closeppxbutton') closeppxbutton;
  @ViewChild('closecrnbutton') closecrnbutton;
  @ViewChild('cattype') matcatAutocomplete: MatAutocomplete;
  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('subcategorytype') matsubcatAutocomplete: MatAutocomplete;
  @ViewChild('subcategoryInput') subcategoryInput: any;
  @ViewChild('bstype') matbsAutocomplete: MatAutocomplete;
  @ViewChild('bsInput') bsInput: any;
  @ViewChild('cctype') matccAutocomplete: MatAutocomplete;
  @ViewChild('ccInput') ccInput: any;
  @ViewChild('producttype') matproductAutocomplete: MatAutocomplete;
  @ViewChild('productInput') productInput: any;
  DebitDetailForm: FormGroup
  categoryNameData: Array<catlistss>;
  subcategoryNameData: Array<subcatlistss>;
  bsNameData: Array<bslistss>;
  ccNameData: Array<cclistss>;
  businesslist: Array<productcodelists>
  invheaderid: any
  catid: any
  bssid: any
  SGST = false
  CGST = false
  IGST = false
  invoicenumber: any
  value: any
  invdate: any
  raisorbranchgst: any
  SupplierDetailForm: FormGroup
  showsuppname = true
  showsuppgst = true
  showsuppstate = true
  filesHeader: FormGroup;
  showapproverforcreate = true
  showapproverforedit = false
  showsupppopup = true
  readdata = false
  readdatanew = true
  readinvdata = false
  readcreditdata = false
  readinvhdrdata = false
  readecfdata = false
  showsupplierpan = false
  showsuppliercode = false
  showsupplierdata = false
  showtaxforgst = false
  commodityid: any
  disabledate = true
  formData: FormData = new FormData();
  file_length: number = 0
  list: any
  fileextension: any
  totalcount: any
  base64textString = []
  fileData: any
  pdfimgview: any
  file_ext: any = ['jpg', 'png', 'JPG', 'JPEG', 'jpeg', 'image'];
  showreasonattach: boolean = true;
  selectedbranchgst: any
  invdetailidforadvance: any
  raisedbyid: any
  shownotify = false
  showcrnnotify = false
  raisergst: any
  raiserbranchid: any
  createdbyid:any
  @ViewChildren('fileInput') fileInput: QueryList<ElementRef>
  currncyLength = 0
  ismultilevel:boolean = false
  crnglForm:FormGroup
  
  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer, private datePipe: DatePipe,
    private ecfservice: EcfService, private shareservice: ShareService, private notification: NotificationService,
    private router: Router, private toastr: ToastrService, private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingService) { }

  ngOnInit(): void {
    const getToken = localStorage.getItem("sessionData")
    let tokendata = JSON.parse(getToken)
    this.raisedbyid = tokendata.employee_id
    let data = this.shareservice.ecfheaderedit.value
    this.ecfheaderidd = data
    this.ecfheaderForm = this.fb.group({
      supplier_type: [''],
      commodity_id: [''],
      ecftype: [''],
      ecfdate: new Date(),
      ecfamount: [''],
      ppx: [''],
      notename: [''],
      remark: [''],
      payto: [''],
      advancetype: [''],
      ppxno: [''],
      branch: [''],
      rmcode: [''],
      client_code: [''],
      is_raisedby_self: [true],
      raised_by: [''],
    })
   this.InvoiceHeaderForm = this.fb.group({
      branch_id: [''],
      invtotalamt: [''],
      ecfheader_id: [''],
      dedupinvoiceno: [''],
      suppliergst: [''],
      raisorbranchgst: [''],
      invoicegst: [''],
      invoiceheader: new FormArray([
        // this.INVheader(),
      ]),
    })
    this.SelectSupplierForm = this.fb.group({
      gstno: [''],
      code: [''],
      panno: [''],
      name: ['']
    })
    this.SubmitoverallForm = this.fb.group({
      id: [''],
      approver_branch: [''],
      approvedby_id: [''],
      ecftype: [''],
      tds: [''],
    })
    this.invoiceheaderdetailForm = this.fb.group({
      raisorcode: [''],
      raisorname: [''],
      transbranch: [''],
      gst: [''],
      suppcode: [''],
      suppbranch: [''],
      suppname: [''],
      suppgstno: [''],
      invoiceno: [''],
      invoicedate: [''],
      taxableamt: [''],
      invoiceamt: [''],
      taxamount: [''],
      rndamount: [''],
      otheramount: ['']
     })

    this.InvoiceDetailForm = this.fb.group({
      roundoffamt: [0],
      otheramount: [0],
      invoicedtl: new FormArray([
        // this.INVdetail(),
      ]),

      creditdtl: new FormArray([
        // this.creditdetails(),
      ])

    })

    this.DebitDetailForm = this.fb.group({

      debitdtl: new FormArray([
        // this.debitdetail()
      ])
    })

    this.filesHeader = this.fb.group({
      file_upload: new FormArray([
      ]),
    })
   this.creditglForm = this.fb.group({
      name: [''],
      glnum: ['']
    })
    this.crnglForm = this.fb.group({
      category_code: [''],
      subcategory_code: [''],
      debitglno:['']
    })
   this.SupplierDetailForm = this.fb.group({
      invoiceno: [''],
      invoicedate: [''],
      supplier_name: [''],
      suppliergst: [''],
      pincode: ['']
    })

    this.filesHeader = this.fb.group({
      file_upload: new FormArray([
      ]),
    })

    this.ppxForm = this.fb.group({
      ppxdtl: new FormArray([
      ])
    })

    this.crnForm = this.fb.group({
      crndtl: new FormArray([
      ])
    })


    this.getinvoicedetails();
    this.getecftype();
    this.getsuppliertype();
    this.getPaymode();
    this.getbranchrole();
    
    this.ecfheaderForm.get('ppx').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getppxdropdown()
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ppxList = datas;
      })
    }

  behalfSelf = true
  getBehalf(data)
  {
    this.behalfSelf = data.value
  }

  getsuppdd() {
    let suppliername: String = "";
    this.getsuppliername(this.suplist, suppliername);
    this.SelectSupplierForm.get('name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getsuppliernamescroll(this.suplist, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierNameData = datas;
      })
    this.getsuppliername(this.suplist, "");

  }

  getcatdropdown() {
    this.getcat('')
  }
  getbsdropdown() {
    this.getbs('')
  }
  getuomdropdown() {
    this.getuom('')
  }
  gethsndropdown() {
    this.gethsn('')
  }
  getcommoditydata(datas) {
    this.commodityid = datas.id
  }
  getbranchdropdown() {
    this.branchdropdown('');
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.SubmitoverallForm.get('approver_branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
         }),
        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
       })
}

  getheaderbranch() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.ecfheaderForm.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
         }),

        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
       })
  }

  getbpdropdown() {
    this.getbusinessproduct('')
  }

  getapprovedropdowns() {
    // let approverkeyvalue: String = "";
    if(this.ismultilevel == true){
    this.approverdropdown();
    this.SubmitoverallForm.get('approvedby_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          }),

        switchMap(value => this.ecfservice.getdelmatapproverscroll(1, this.commodityid,this.createdbyid)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Approverlist = datas;
        })
    }else{
      this.approverdropdown();
    this.SubmitoverallForm.get('approvedby_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          }),

        switchMap(value => this.ecfservice.getapproverscroll(1, this.commodityid,this.createdbyid)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Approverlist = datas;
        })
    }
}

  getcatdropdowns(){
    this.getcat('');
    this.crnglForm.get('category_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          }),

        switchMap(value => this.ecfservice.getcategoryscroll(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryNameData = datas;
        })
    }

    getsubcatdropdowns(){
      this.getsubcat(this.catid,"");
      this.crnglForm.get('subcategory_code').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            }),
  
          switchMap(value => this.ecfservice.getsubcategoryscroll(this.catid,value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.subcategoryNameData = datas;
          })
      }
    
  

  getcommoditydd() {
    let commoditykeyvalue: String = "";
    this.getcommodity(commoditykeyvalue);
    this.ecfheaderForm.get('commodity_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
       }),
        switchMap(value => this.ecfservice.getcommodityscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.commodityList = datas;
      })
}

  getrmdd() {
    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.ecfheaderForm.get('rmcode').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
       }),
        switchMap(value => this.ecfservice.getrmscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.rmlist = datas;
      })
}

  getclientdd() {
    let clientkeyvalue: String = "";
    this.getclient(clientkeyvalue);
    this.ecfheaderForm.get('client_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getclientscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.clientlist = datas;
      })
  }

  getpaytodropdown() {

    if (this.ecftypeid == 3) {
     this.ecfheaderForm.get('payto').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservice.getpayto(this.ecftypeid)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.payList = datas.filter(a => a.id != 'S');
        })
    }

  }

  getbehalfemp() {
    let value: String = "";
    this.getrm(value);
    this.ecfheaderForm.get('raised_by').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
       }),
        switchMap(value => this.ecfservice.getrmscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.emplist =[]
        for(let item of datas)
        {
          let val ={id: item.id, full_name : item.full_name, name : item.full_name}
          this.emplist.push(val)
        }
      })
}

behalfEmpScroll() {
  setTimeout(() => {
    if (
      this.matBehalfAutocomplete &&
      this.matBehalfAutocomplete &&
      this.matBehalfAutocomplete.panel
    ) {
      fromEvent(this.matBehalfAutocomplete.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matBehalfAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matBehalfAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight = this.matBehalfAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight = this.matBehalfAutocomplete.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_next === true) {
              this.ecfservice.getrmscroll(this.behalfInput.nativeElement.value, this.currentpage + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  if (this.emplist.length >= 0) {
                    for(let item of datas)
                    {
                      let val ={id: item.id, full_name : item.full_name, name : item.full_name}
                      this.emplist.push(val)
                    }                    
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

get behalfEmp() {
  return this.ecfheaderForm.get('raised_by');
}

  invoicegst: any
  ecfstatusid: any
  ecfeditdata: any
  ecfstatusname: any
  ppxid: any
  fileList: any
  branchrolename: any
  paytoid: any
  ecftotalamount: any

  hrFlag = false
  getinvoicedetails() {
    this.SpinnerService.show()
    this.ecfservice.getOnbehalfofHR()
        .subscribe(result => {
          if(result.data != undefined){
            this.hrFlag = result.data[0].is_onbehalfoff_hr
          }  
          if (this.ecfheaderidd != "" && this.ecfheaderidd != undefined && this.ecfheaderidd != null) {
            this.ecfservice.getinvoicedetailsummary(this.ecfheaderidd)
              .subscribe(result => {
                if(result.id != undefined){
                this.showapproverforcreate = false
                this.showapproverforedit = true
                let invheader = result['Invheader']
                if (invheader.length > 0) {
                  for (let i in invheader) {
                    this.InvoiceDetailForm.patchValue({
                      roundoffamt: invheader[i]?.roundoffamt,
                      otheramount: invheader[i]?.otheramount
                    })
                  }
                }
                this.showviewinvoice = true
                this.showviewinvoices = false
                this.showaddbtn = true
                this.showaddbtns = false
                this.showadddebit = false
                this.showadddebits = true
                this.showeditinvhdrform = false
                let datas = result
                this.ecfeditdata = datas
                this.ecftypeid = result?.ecftype_id
                this.ecfstatusid = result?.ecfstatus_id
                this.ecfstatusname = result?.ecfstatus
                this.commodityid = result?.commodity_id?.id
                this.ecftotalamount = result?.ecfamount
                this.raisergst = result?.branch?.gstin
                this.raiserbranchid = result?.branch?.id
                this.createdbyid = result?.raisedby
                if (this.ecftypeid == 4) {
                  this.ppxid = result?.ppx_id?.id
                }
                if (this.ecftypeid == 3) {
                  this.paytoid = result?.payto_id?.id
                  // console.log("hrFlag",this.hrFlag)
                  if(this.hrFlag){
                       this.ecfheaderForm.controls['is_raisedby_self'].enable();
                       this.ecfheaderForm.controls['raised_by'].enable();
                    }else{
                      this.ecfheaderForm.controls['is_raisedby_self'].disable();
                      this.ecfheaderForm.controls['raised_by'].disable();
                   }
                }
              for (let a of datas?.Invheader) {
                  this.type = a?.gsttype
                  this.getgstapplicable = a?.invoicegst
                  if (a?.invoicegst == 'Y') {
                    this.showtaxforgst = true
                  } else {
                    this.showtaxforgst = false
                  }
                }
               if (datas?.ecftype_id == 2 || datas?.ecftype_id == 7) {
                  this.showdatefornonpo = true
                  this.showdate = false
                  this.shownotfornonpo = false
                  this.showfornonpo = true
                }
               if (datas?.ecftype_id == 3) {
                  this.showpayto = true
                  this.showsuppname = false
                  this.showsuppgst = false
                  this.showsuppstate = false
                  this.showdatefornonpo = false
                  this.showdate = true
                  this.shownotfornonpo = true
                  this.showfornonpo = false
                  this.showgsttt = false
                 }
                 if (datas?.ecftype_id == 4 && datas?.ppx_id.id == 'E') {
                  this.showppx = true
                  this.showsuppname = false
                  this.showsuppgst = false
                  this.showsuppstate = false
                  this.showgsttt = false
                  this.showadvance = true
                  this.showdatefornonpo = false
                  this.showdate = true
                  this.shownotfornonpo = true
                  this.showfornonpo = false
                  this.showgstapply = true
                }
              if (datas?.ecftype_id == 4 && datas?.ppx_id?.id == 'S') {
                  this.showppx = true
                  this.showsuppname = true
                  this.showsuppgst = true
                  this.showsuppstate = true
                  this.showgsttt = true
                  this.showadvance = true
                  this.showdatefornonpo = false
                  this.showdate = true
                  this.shownotfornonpo = true
                  this.showfornonpo = false
                  this.showgstapply = true
                }
                if (this.roledata == false) {
                  this.branchrolename = datas.branch.name
                } else {
                  this.branchrolename = datas.branch
                }
               let rmcode = {
                  "id": datas?.rmcode?.id,
                  "full_name": "(" + datas?.rmcode?.code + ")" + "" + datas?.rmcode?.name
                }
      
      
                  this.ecfheaderForm.patchValue({
                  supplier_type: datas?.supplier_type_id,
                  commodity_id: datas?.commodity_id,
                  ecftype: datas?.ecftype_id,
                  branch: this.branchrolename,
                  ecfdate: datas?.ecfdate,
                  ecfamount: datas?.ecfamount,
                  ppx: datas?.ppx_id,
                  payto: datas?.payto_id,
                  notename: datas?.notename,
                  remark: datas?.remark,
                  rmcode: rmcode,
                  client_code: datas?.client_code,
                  is_raisedby_self: datas?.is_raisedby_self,
                  raised_by: datas?.raisedby_dtls,
                  
                })

                console.log("is_raisedby_self",datas.is_raisedby_self)
      
               if (datas?.ecftype_id ==3 && datas?.is_raisedby_self==false)
               { 
                this.raisedbyid = datas?.raisedby_dtls.id
               }
               if (datas?.crno != null) {
                  this.SubmitoverallForm.patchValue({
                    approver_branch: datas?.data.approver_branch,
                    approvedby_id: datas?.data?.limit['data'][0].employee_id
                  })
                }
                this.getinvoicehdrrecords(result)
      
                this.InvoiceHeaderForm.patchValue({
                  invoicegst: this.getgstapplicable
                })
                this.SpinnerService.hide()
              }else{
                this.notification.showError(result?.description);
                this.SpinnerService.hide();
                return false;
              }
              },
              error => {
                this.errorHandler.handleError(error);
                this.SpinnerService.hide();
              }
              )
          }
          else {
            const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
            control.push(this.INVheader());
            this.SpinnerService.hide()      
          }        
        })
   
  }

  InvHeaderFormArray(): FormArray {
    return this.InvoiceHeaderForm.get('invoiceheader') as FormArray;
  }
 data(datas) {
    let id = datas
    this.ecfservice.downloadfile(id)
  }

  getfiles(data) {
   this.SpinnerService.show()
    this.ecfservice.filesdownload(data.file_id)
      .subscribe((results) => {
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = data.file_name;
        link.click();
        this.SpinnerService.hide()
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
  }

  fileDeletes(data, index: number) {
   this.ecfservice.deletefile(data)
      .subscribe(result => {
        if (result?.status == 'success') {
         // this.fileList.splice(index, 1);
          this.InvoiceHeaderForm.value.invoiceheader[this.fileindex].filedataas.splice(index, 1)
          this.InvoiceHeaderForm.value.invoiceheader[this.fileindex].filekey.splice(index, 1)
          this.notification.showSuccess("Deleted....")
          this.closedbuttons.nativeElement.click();
          } else {
          this.notification.showError(result?.description)
          this.closedbuttons.nativeElement.click();
          return false
        }
      })
 }

 viewinvheader() {
    let invdata = this.ecfheaderForm.value
    let ecfdates = this.datePipe.transform(invdata.ecfdate, 'yyyy-MM-dd')

    if (this.ecfeditdata.ecftype_id != invdata.ecftype) {
      this.notification.showInfo("Please save the changes you have done")
      return false
    }
    else if (this.ecfeditdata.supplier_type_id != invdata.supplier_type) {
      this.notification.showInfo("Please save the changes you have done")
      return false
    }
    else if (this.ecfeditdata.commodity_id.id != invdata.commodity_id.id) {
      this.notification.showInfo("Please save the changes you have done")
      return false
    }
    else if (this.ecfeditdata.ecfdate != ecfdates) {
      this.notification.showInfo("Please save the changes you have done")
      return false
    }
    else if (this.ecfeditdata.ecfamount != invdata.ecfamount) {
      this.notification.showInfo("Please save the changes you have done")
      return false
    }
    else if (this.ecfeditdata.remark != invdata.remark) {
      this.notification.showInfo("Please save the changes you have done")
      return false
    }


    else {
      this.showeditinvhdrform = true
      this.disableecfsave = true
      this.readecfdata = true

    }
  }

  viewinvheaders() {
    this.showeditinvhdrform = true
    this.disableecfsave = true
    this.readecfdata = true
  }
  getinvoicehdrrecords(datas) {
    if (datas?.Invheader?.length == 0) {
      const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
      control.push(this.INVheader());
     }
     for (let invhdr of datas?.Invheader) {
      let id: FormControl = new FormControl('');
      let suppname: FormControl = new FormControl('');
      let suppstate: FormControl = new FormControl('');
      let invoiceno: FormControl = new FormControl('');
      let invoicedate: FormControl = new FormControl('');
      let invoiceamount: FormControl = new FormControl('');
      let taxamount: FormControl = new FormControl('');
      let totalamount: FormControl = new FormControl('');
      let otheramount: FormControl = new FormControl('');
      let roundoffamt: FormControl = new FormControl('');
      let invtotalamt: FormControl = new FormControl('');
      let ecfheader_id: FormControl = new FormControl('');
      let dedupinvoiceno: FormControl = new FormControl('');
      let supplier_id: FormControl = new FormControl('');
      let suppliergst: FormControl = new FormControl('');
      let supplierstate_id: FormControl = new FormControl('');
      let raisorbranchgst: FormControl = new FormControl('');
      let invoicegst: FormControl = new FormControl('');
      let filevalue: FormArray = new FormArray([]);
      let file_key: FormArray = new FormArray([]);
     
      id.setValue(invhdr.id)
      if (this.ecftypeid == 2 || this.ppxid == "S" || this.ecftypeid == 7) {
        suppname.setValue(invhdr?.supplier_id?.name)
        supplierstate_id.setValue(invhdr?.supplierstate_id?.id)
        suppstate.setValue(invhdr?.supplierstate_id?.name)
        supplier_id.setValue(invhdr?.supplier_id?.id)
        suppliergst.setValue(invhdr?.supplier_id?.gstno)
      } else {
        suppname.setValue("")
        supplierstate_id.setValue("")
        supplier_id.setValue("")
        suppliergst.setValue("")
        suppstate.setValue("")
      }
      invoiceno.setValue(invhdr?.invoiceno)
      invoicedate.setValue(invhdr?.invoicedate)
      invoiceamount.setValue(invhdr?.invoiceamount)
      taxamount.setValue(invhdr?.taxamount)
      totalamount.setValue(invhdr?.totalamount)
      otheramount.setValue(invhdr?.otheramount)
      roundoffamt.setValue(invhdr?.roundoffamt)
      invtotalamt.setValue("")
      dedupinvoiceno.setValue(invhdr?.dedupinvoiceno)
      ecfheader_id.setValue(invhdr?.ecfheader_id)
      raisorbranchgst.setValue(invhdr?.raisorbranchgst)
      invoicegst.setValue(this.getgstapplicable)
      filevalue.setValue([])
      file_key.setValue([])
      
       this.InvHeaderFormArray().push(new FormGroup({
        id: id,
        suppname: suppname,
        suppstate: suppstate,
        invoiceno: invoiceno,
        invoicedate: invoicedate,
        invoiceamount: invoiceamount,
        taxamount: taxamount,
        totalamount: totalamount,
        otheramount: otheramount,
        roundoffamt: roundoffamt,
        invtotalamt: invtotalamt,
        dedupinvoiceno: dedupinvoiceno,
        ecfheader_id: ecfheader_id,
        supplier_id: supplier_id,
        suppliergst: suppliergst,
        supplierstate_id: supplierstate_id,
        raisorbranchgst: raisorbranchgst,
        invoicegst: invoicegst,
        filevalue: filevalue,
        file_key: file_key,
        filedataas: this.filefun(invhdr),
        filekey: this.filefun(invhdr)
    }))
     this.calchdrTotal(invoiceamount, taxamount, totalamount)
     invoiceamount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calchdrTotal(invoiceamount, taxamount, totalamount)
        if (!this.InvoiceHeaderForm.valid) {
          return;
        }
       this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      }
      )
      taxamount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calchdrTotal(invoiceamount, taxamount, totalamount)
        if (!this.InvoiceHeaderForm.valid) {
          return;
        }
        this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      }
      )
      roundoffamt.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calchdrTotal(invoiceamount, taxamount, totalamount)
        if (!this.InvoiceHeaderForm.valid) {
          return;
        }
       this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      }
      )
      otheramount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calchdrTotal(invoiceamount, taxamount, totalamount)
        if (!this.InvoiceHeaderForm.valid) {
          return;
        }
      this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      }
      )
    }
}
filefun(data) {
   let arr = new FormArray([])
   let dataForfILE = data.file_data
    if (data.file_data == "" || data.file_data == null || data.file_data == undefined) {
      dataForfILE = []
    } else {
      for (let file of dataForfILE) {
        let file_id: FormControl = new FormControl('');
        let file_name: FormControl = new FormControl('');
        file_id.setValue(file.file_id);
        file_name.setValue(file.file_name)
       arr.push(new FormGroup({
          file_id: file_id,
          file_name: file_name
        }))

      }
    }
    return arr;
   }

  calchdrTotal(invoiceamount, taxamount, totalamount: FormControl) {
    let ivAnount = Number(invoiceamount.value)
    let ivAtax = Number(taxamount.value)
    const Taxableamount = ivAnount
    const Taxamount = ivAtax
    let toto = Taxableamount + Taxamount
    this.toto = toto
    totalamount.setValue((this.toto), { emitEvent: false });
    this.datasums();
  }
 gettdsapplicable() {
    this.ecfservice.gettdsapplicability()
      .subscribe(result => {
        this.tdsList = result['data']
      })
  }
  public displayFnpayFilter(filterpaydata?: paytofilterValue): string | undefined {
    return filterpaydata ? filterpaydata.text : undefined;
  }
  get filterpaydata() {
    return this.ecfheaderForm.get('payto');
  }
  public displayFnppxFilter(filterppxdata?: ppxfilterValue): string | undefined {
    return filterppxdata ? filterppxdata.text : undefined;
  }
  get filterppxdata() {
    return this.ecfheaderForm.get('ppx');
  }
 getecftype() {
    this.ecfservice.getecftype()
      .subscribe(result => {
        if (result) {
          let TypeList = result["data"]
          this.TypeList = TypeList.filter(a => a.id != 8 && a.id != 1 && a.id != 6)
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  showbranch = false
  showbranchdata = false
  branchrole: any
  branchroleid: any
  branchrolesidd: any
  roledata: any
  getbranchrole() {
    this.ecfservice.getbranchrole()
      .subscribe(result => {
        if (result) {
          let roledata = result?.enable_ddl
          this.roledata = result?.enable_ddl
         if (roledata == false) {
            this.showbranch = false
            this.showbranchdata = true
            this.branchrole = result?.branch_name
            this.branchroleid = result?.id
            this.ecfheaderForm.patchValue({
              branch: this.branchrole
            })
            this.ecfheaderForm.controls['branch'].disable();
          } else {
            this.branchroleid = result?.id
            this.branchrole = result?.branch_name
            this.showbranch = true
            this.showbranchdata = false
            let datas = {
              "id": result?.id,
              "code": result?.code,
              "name": result?.branch_name
            }
            this.ecfheaderForm.patchValue({
              branch: datas
            })
          }
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  showdatefornonpo = true
  showdate = false
  shownotfornonpo = false
  showfornonpo = true
  getecf(id) {
    this.ecftypeid = id
    let supprecord = {"id": 1,"text": "SINGLE"}
    let paymentfor = {"id": "E","text": "EMPLOYEE"}
    if (id === 3) {
      this.showpayto = true
      this.showdatefornonpo = false
      this.showdate = true
      this.shownotfornonpo = true
      this.showfornonpo = false
      this.showppx = false
      this.showadvance = false
      this.showgsttt = false
      this.getpaytype()
      this.ecfheaderForm.patchValue({
        supplier_type: supprecord?.id,
        payto: paymentfor
      })
      this.ecfheaderForm.controls['supplier_type'].disable();
      this.ecfheaderForm.controls['payto'].disable();
      if(this.hrFlag)
      {
        this.ecfheaderForm.controls['is_raisedby_self'].enable();
        this.ecfheaderForm.controls['raised_by'].enable();
      }
      else
      {
        this.ecfheaderForm.controls['is_raisedby_self'].disable();
        this.ecfheaderForm.controls['raised_by'].disable();
      }
    }
    else if (id === 4) {
      this.showppx = true
      this.showadvance = true
      this.showdatefornonpo = false
      this.showdate = true
      this.shownotfornonpo = true
      this.showfornonpo = false
      this.showpayto = false
      this.getppxtype()
      this.getadvancetype()
      this.ecfheaderForm.patchValue({
        supplier_type: supprecord?.id,
      })
      this.ecfheaderForm.controls['supplier_type'].disable();
      this.ecfheaderForm.controls['payto'].enable();
      this.ecfheaderForm.controls['is_raisedby_self'].disable();
      this.ecfheaderForm.controls['raised_by'].disable();
    }
    else {
      this.ecfheaderForm.controls['supplier_type'].enable();
      this.ecfheaderForm.controls['payto'].enable();
      this.showdatefornonpo = true
      this.showdate = false
      this.shownotfornonpo = false
      this.showfornonpo = true
      this.showppx = false
      this.showadvance = false
      this.showpayto = false
      this.showsupptype = true
      this.ecfheaderForm.controls['is_raisedby_self'].disable();
      this.ecfheaderForm.controls['raised_by'].disable();
    }
  }
  getppxtype() {
    this.ecfservice.getppxdropdown()
      .subscribe(result => {
        if (result) {
          this.ppxList = result["data"]
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  advancefilterlist: any
  getadvancetype() {
     this.ecfservice.getadvancetype()
      .subscribe(result => {
        if (result) {
          this.advancetypeList = result["data"]
          this.advancefilterlist = this.advancetypeList.filter(data => data.id != 3)
         }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  ppxddid: any
  showadvforemployee = true
  showadvforsupplier = false
  getppx(data) {
    let id = data?.id
    let advancerecord = {"id": 3,"text": "Employee advance & Deposits"}
    if (id == "E") {
      this.showsuppname = false
      this.showsuppgst = false
      this.showsuppstate = false
      this.showgsttt = false
      this.showadvforemployee = true
      this.showadvforsupplier = false
      this.ecfheaderForm.patchValue({
        advancetype: advancerecord?.id
      })
      this.ecfheaderForm.controls['advancetype'].disable();
    }
    if (id == "S") {
      this.showsuppname = true
      this.showsuppgst = true
      this.showsuppstate = true
      this.showgsttt = true
      this.showgstapply = true
      this.showadvforemployee = false
      this.showadvforsupplier = true
      this.ecfheaderForm.controls['advancetype'].reset()
      this.ecfheaderForm.controls['advancetype'].enable();
    }
  }
  getpaytype() {
    this.ecfservice.getpayto(this.ecftypeid)
      .subscribe(result => {
        if (result) {
          this.payList = result["data"]
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
 getsuppliertype() {
    this.ecfservice.getsuppliertype()
      .subscribe(result => {
        if (result) {
          let SupptypeList = result["data"]
          this.SupptypeList = SupptypeList?.filter(x => x.id != 2)
        }
      })
  }
public displayFncommodity(commoditytype?: commoditylistss): string | undefined {
    return commoditytype ? commoditytype.name : undefined;
  }

get commoditytype() {
  return this.ecfheaderForm.get('commodity_id');
}
getcommodity(commoditykeyvalue) {
    this.ecfservice.getcommodity(commoditykeyvalue)
      .subscribe(results => {
        if (results) {
          let datas = results["data"];
          this.commodityList = datas;
        }
       }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  commodityScroll() {
    setTimeout(() => {
      if (
        this.matcommodityAutocomplete &&
        this.matcommodityAutocomplete &&
        this.matcommodityAutocomplete.panel
      ) {
        fromEvent(this.matcommodityAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcommodityAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcommodityAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcommodityAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcommodityAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.getcommodityscroll(this.commodityInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.commodityList.length >= 0) {
                      this.commodityList = this.commodityList.concat(datas);
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
 public displayFnclient(clientrole?: clientlists): string | undefined {
    return clientrole ? clientrole.client_name : undefined;
  }
 get clientrole() {
    return this.ecfheaderForm.get('client_code');
  }
 getclient(clientkeyvalue) {
    this.ecfservice.getclientcode(clientkeyvalue)
      .subscribe(results => {
        if (results) {
          let datas = results["data"];
          this.clientlist = datas;
        }
       }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
clientScroll() {
    setTimeout(() => {
      if (
        this.matclientAutocomplete &&
        this.matclientAutocomplete &&
        this.matclientAutocomplete.panel
      ) {
        fromEvent(this.matclientAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matclientAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matclientAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matclientAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matclientAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.getclientscroll(this.clientInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.clientlist.length >= 0) {
                      this.clientlist = this.clientlist.concat(datas);
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
  public displayFnrm(rmrole?: rmlists): string | undefined {
    return rmrole ? rmrole?.full_name : undefined;
  }
  public displayFnrmedit(rmrole?: rmlists): string | undefined {
    return rmrole ? rmrole?.name : undefined;
  }
   public displayFnEmp(emprole?: emplists): string | undefined {
    return emprole ? emprole?.name : undefined;
  }
  get emprole() {
    return this.ecfheaderForm.get('raised_by');
  }
 get rmrole() {
    return this.ecfheaderForm.get('rmcode');
  }
  getrm(rmkeyvalue) {
    this.ecfservice.getrmcode(rmkeyvalue)
      .subscribe(results => {
        if (results) {
          let datas = results["data"];
          this.rmlist = datas;
          this.emplist =[]
          for(let item of datas)
          {
            let val ={id: item.id, full_name : item.full_name, name : item.full_name}
            this.emplist.push(val)
          }
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
 rmScroll() {
    setTimeout(() => {
      if (
        this.matrmAutocomplete &&
        this.matrmAutocomplete &&
        this.matrmAutocomplete.panel
      ) {
        fromEvent(this.matrmAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matrmAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matrmAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matrmAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matrmAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.getrmscroll(this.rmInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.rmlist.length >= 0) {
                      this.rmlist = this.rmlist.concat(datas);
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

  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
      ],
      link: [['link', ['linkDialogShow', 'unlink']]],
      air: [
        [
          'font',
          [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'clear',
          ],
        ],
      ],
    },
    height: '200px',
    // uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear',
        ],
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']],
    ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };
  editorDisabled = false;
  enableEditor() {
    this.editorDisabled = false;
  }
  disableEditor() {
    this.editorDisabled = true;
  }
  onBlur() {
    // console.log('Blur');
  }
  onDelete(file) {
    // console.log('Delete file', file.url);
  }
  summernoteInit(event) {
    // console.log(event);
  }
  onFileSelected(e) { }
  SupplierTypeID: any;
  
  SubmitForm() {
    const currentDate = this.ecfheaderForm?.value
    if (this.ecfheaderForm?.value?.ecftype === "") {
      // var answer = window.confirm("Please Select ECF Type");
      // if (answer) {
      //   this.SpinnerService.hide();
      //   return false;
        
      // }
      // else {
      //   return false;
      // }
      this.toastr.error('Please Select ECF Type');
      this.SpinnerService.hide();
      return false;
    }
    if(currentDate.ecftype == 4){
      if (this.ecfheaderForm?.value?.ppx == "" || this.ecfheaderForm?.value?.ppx == null || this.ecfheaderForm?.value?.ppx == undefined){
        this.toastr.error('Please Select Payment For');
        this.SpinnerService.hide();
        return false;
      } 
    }
   if (this.ecfheaderForm?.value?.supplier_type === "") {
      this.toastr.error('Please Select Supplier Type');
      this.SpinnerService.hide();
      return false;
    }
    if (this.ecfheaderForm?.value?.commodity_id == undefined || this.ecfheaderForm?.value?.commodity_id <= 0) {
      this.toastr.error('Please Select Commodity Name');
      this.SpinnerService.hide();
      return false;
    }
    if (this.ecfheaderForm?.value?.client_code == undefined || this.ecfheaderForm?.value?.client_code <= 0) {
      this.toastr.error('Please Select Client Name');
      this.SpinnerService.hide();
      return false;
    }
    if (this.ecfheaderForm?.value?.rmcode == undefined || this.ecfheaderForm?.value?.rmcode <= 0) {
      this.toastr.error('Please Select RM Name');
      this.SpinnerService.hide();
      return false;
    }
    if (this.ecfheaderForm?.value?.ecfamount === "") {
      this.toastr.error('Please Enter ECF Amount');
      this.SpinnerService.hide();
      return false;
    }
    if (this.behalfSelf == undefined || this.behalfSelf == null)
    {
      this.toastr.error('Please Select Behalf of Self');
      this.SpinnerService.hide();
      return false;
    }
    if(this.ecftypeid == 3)
    {
      if(this.hrFlag)
      {
        if(this.ecfheaderForm?.value?.is_raisedby_self == false && 
          (this.ecfheaderForm?.value?.raised_by == undefined || this.ecfheaderForm?.value?.raised_by == null || this.ecfheaderForm?.value?.raised_by ==""))
          {
            this.toastr.error('Please Select Employee');
            this.SpinnerService.hide();
            return false;
          }
      }
      else
      {
        currentDate.is_raisedby_self = true
        currentDate.raised_by = this.raisedbyid
      }
    }
    else if(this.ecftypeid != 3)
    {
      currentDate.is_raisedby_self = true
      currentDate.raised_by = this.raisedbyid
    }

    if(this.ecfheaderForm?.value?.is_raisedby_self == true)
    {
      currentDate.raised_by = this.raisedbyid
    }
    else
    {
      this.raisedbyid = this.ecfheaderForm?.value?.raised_by.id
      currentDate.raised_by = this.ecfheaderForm?.value?.raised_by.id
    }
    currentDate.ecfdate = this.datePipe.transform(currentDate?.ecfdate, 'yyyy-MM-dd');
    if(typeof(currentDate.commodity_id) == 'object'){
    currentDate.commodity_id = this.ecfheaderForm?.value?.commodity_id?.id
    }else if(typeof(currentDate.commodity_id) == 'number'){
      currentDate.commodity_id = currentDate.commodity_id
    }else{
      this.notification.showError ("Please Choose any one Commodity Name from the dropdown");
      this.SpinnerService.hide();
      return false;
    }
    
    if(typeof(currentDate.client_code) == 'object'){
    currentDate.client_code = this.ecfheaderForm?.value?.client_code?.id
    }else if(typeof(currentDate.client_code) == 'number'){
      currentDate.client_code = currentDate.client_code
    }else{
      this.notification.showError ("Please Choose any one Client Name from the dropdown");
      this.SpinnerService.hide();
      return false;
    }
    
    if(typeof( currentDate.rmcode) == 'object'){
    currentDate.rmcode = this.ecfheaderForm?.value?.rmcode?.id
    }else if( typeof(currentDate.rmcode) == 'number'){
      currentDate.rmcode =  currentDate.rmcode
    }else {
      this.notification.showError ("Please Choose any one RM Name from the dropdown");
      this.SpinnerService.hide();
      return false;
    }
    
    if (this.roledata == true) {
      currentDate.branch = this.ecfheaderForm?.value?.branch?.id
    } else {
      currentDate.branch = this.branchroleid
    }
    if (currentDate?.branch == "" || currentDate?.branch == undefined || currentDate?.branch == null) {
      currentDate.branch = this.branchroleid
    }
    if (this.ecftypeid == 3) {
      currentDate.payto = "E"
      currentDate.supplier_type = 1
    }
    if (this.ecftypeid == 2 || this.ecftypeid == 7) {
      currentDate.payto = ""
    }
    if (this.ecftypeid == 4) {
      currentDate.ppx = this.ecfheaderForm?.value?.ppx?.id
      currentDate.payto = this.ecfheaderForm?.value?.ppx
      currentDate.supplier_type = 1
    } else {
      currentDate.ppx = ""
    }
    if (this.ecftypeid == 4 && this.ecfheaderForm?.value?.ppx?.id == 'E') {
      currentDate.advancetype = 3
    }
    this.SpinnerService.show();
    if (this.ecfstatusid === 2) {
      this.ecfservice.ecfmodification(this.ecfheaderForm?.value, this.ecfheaderidd)
        .subscribe(result => {
          if (result.id == undefined) {
            this.notification.showError(result?.description)
            this.SpinnerService.hide()
            return false
          }
          else {
            this.notification.showSuccess("Successfully ECF Header Saved")
            this.SpinnerService.hide();
            this.ecfheaderid = result?.id
            this.ecftypeid = result?.ecftype
            this.SupplierTypeID = result?.supplier_type
            this.ppxid = result?.ppx
            this.paytoid = result?.payto
            this.ecftotalamount = Number(result?.ecfamount)
            this.raisergst = result?.raiserbranchgst
            this.raiserbranchid = result?.branch
            this.createdbyid = result?.raisedby
            this.disableecfsave = true
            this.readecfdata = true
            this.showviewinvoice = false
            this.showviewinvoices = true
            if (this.ecftypeid === 3) {
              this.InvoiceHeaderForm.patchValue({
                invoicegst: "Y"
              })
              this.showsuppname = false
              this.showsuppgst = false
              this.showsuppstate = false
            }
            this.SupplierTypeID = result?.supplier_type
          }
        },error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          })
        } else {
      if (this.ecfheaderidd != "") {
        this.ecfservice.editecfheader(this.ecfheaderForm?.value, this.ecfheaderidd)
          .subscribe(result => {
           if (result.id == undefined) {
              this.notification.showError(result?.description)
              this.SpinnerService.hide()
              return false
            }
            else {
              this.notification.showSuccess("Successfully ECF Header Saved")
              this.SpinnerService.hide();
              this.ecfheaderid = result?.id
              this.ecftypeid = result?.ecftype
              this.SupplierTypeID = result?.supplier_type
              this.ppxid = result?.ppx
              this.paytoid = result?.payto
              this.raisergst = result?.raiserbranchgst
              this.raiserbranchid = result?.branch
              this.createdbyid = result?.raisedby
              this.ecftotalamount = Number(result?.ecfamount)
              this.disableecfsave = true
              this.readecfdata = true
              this.showviewinvoice = false
              this.showviewinvoices = true
              if (this.ecftypeid === 3) {
                this.InvoiceHeaderForm.patchValue({
                  invoicegst: "Y"
                })
                this.showsuppname = false
                this.showsuppgst = false
                this.showsuppstate = false
              }
            }
          },error => {
              this.errorHandler.handleError(error);
              this.SpinnerService.hide();
            }
          )
      }
     else {
        this.ecfservice.createecfheader(this.ecfheaderForm?.value)
          .subscribe(result => {
           if (result?.id == undefined) {
              this.notification.showError(result?.description)
              this.SpinnerService.hide()
              return false
            }
            else {
              this.notification.showSuccess("Successfully ECF Header Saved")
              this.showeditinvhdrform = true
              this.SpinnerService.hide()
              this.ecfheaderid = result?.id
              this.ecftypeid = result?.ecftype
              this.ppxid = result?.ppx
              this.paytoid = result?.payto
              this.raisergst = result?.raiserbranchgst
              this.raiserbranchid = result?.branch
              this.createdbyid = result?.raisedby
              this.ecftotalamount = Number(result?.ecfamount)
              if (this.ecftypeid === 3) {
                this.InvoiceHeaderForm.patchValue({
                  invoicegst: "Y"
                })
                this.showsuppname = false
                this.showsuppgst = false
                this.showsuppstate = false
              }
              this.SupplierTypeID = result?.supplier_type
              this.disableecfsave = true
              this.readecfdata = true
            }

          },error => {
              this.errorHandler.handleError(error);
              this.SpinnerService.hide();
            }
          )
      }
    }

  }
 ecfreset() {
      this.ecfheaderForm.controls['ecftype'].reset(""),
      this.ecfheaderForm.controls['supplier_type'].reset(""),
      this.ecfheaderForm.controls['commodity_id'].reset(""),
      this.ecfheaderForm.controls['ecfamount'].reset(""),
      this.ecfheaderForm.controls['ppx'].reset(""),
      this.ecfheaderForm.controls['notename'].reset(""),
      this.ecfheaderForm.controls['remark'].reset(""),
      this.ecfheaderForm.controls['payto'].reset(""),
      this.ecfheaderForm.controls['client_code'].reset("")
      this.ecfheaderForm.controls['rmcode'].reset("")
      this.ecfheaderForm.controls['advancetype'].reset("")
      this.ecfheaderForm.controls['is_raisedby_self'].reset("")
      this.ecfheaderForm.controls['raised_by'].reset("") 
  
  }
  // -----ECF HEADER ENDS------
 public displaytest(SupplierName?: SupplierName): string | undefined {
    return SupplierName ? SupplierName.name : undefined;
  }
  public displayFn(Suppliertype?: SupplierName): string | undefined {
    return Suppliertype ? Suppliertype.name : undefined;
  }
  get Suppliertype() {
    return this.SelectSupplierForm.get('name');
  }
  getsuppliername(id, suppliername) {
    this.ecfservice.getsuppliername(id, suppliername)
      .subscribe((results) => {
        if (results) {
          let datas = results["data"];
          this.supplierNameData = datas;
        }
       }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    }
 supplierScroll() {
    setTimeout(() => {
      if (
        this.matsupAutocomplete &&
        this.matsupAutocomplete &&
        this.matsupAutocomplete.panel
      ) {
        fromEvent(this.matsupAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsupAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsupAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsupAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsupAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.getsuppliernamescroll(this.suplist, this.suppInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.supplierNameData.length >= 0) {
                      this.supplierNameData = this.supplierNameData.concat(datas);
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

  getSections(forms) {
    return forms.controls.invoiceheader.controls;
  }
  addSection() {
    const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
    control.push(this.INVheader());
   }
  removeSection(i) {
    const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
    control.removeAt(i);
    this.datasums();
  }
  INVheader() {
    let group = new FormGroup({
      id: new FormControl(),
      suppname: new FormControl(),
      suppstate: new FormControl(),
      invoiceno: new FormControl(),
      invoicedate: new FormControl(''),
      invoiceamount: new FormControl(0),
      taxamount: new FormControl(0),
      totalamount: new FormControl(),
      otheramount: new FormControl(0),
      roundoffamt: new FormControl(0),
      invtotalamt: new FormControl(0),
      ecfheader_id: new FormControl(0),
      dedupinvoiceno: new FormControl(0),
      supplier_id: new FormControl(''),
      suppliergst: new FormControl(''),
      supplierstate_id: new FormControl(''),
      raisorbranchgst: new FormControl(''),
      invoicegst: new FormControl(''),
      filevalue: new FormArray([]),
      file_key: new FormArray([]),
      filedataas: new FormArray([]),
      
    })
    group.get('invoiceamount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      this.calcTotal(group)
      if (!this.InvoiceHeaderForm.valid) {
        return;
      }

      this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
    }
    )
    group.get('taxamount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      this.calcTotal(group)
      if (!this.InvoiceHeaderForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
    }
    )
   return group
}
calcTotal(group: FormGroup) {
    const Taxableamount = +group.controls['invoiceamount'].value;
    const Taxamount = +group.controls['taxamount'].value;
    const RoundingOff = +group.controls['roundoffamt'].value;
    const Otheramount = +group.controls['otheramount'].value;
    let toto = Taxableamount + Taxamount
    this.toto = toto - Otheramount
    group.controls['totalamount'].setValue((this.toto), { emitEvent: false });
    this.datasums();
  }

  datasums() {
    this.amt = this.InvoiceHeaderForm.value['invoiceheader'].map(x => x.totalamount);
    this.sum = this.amt.reduce((a, b) => a + b, 0);
  }

  GSTstatus(data) {
    this.gstyesno = data.value
    if (data.value == "N") {
      this.showtaxforgst = false
      this.showsupppopup = true
      let data = this.InvoiceHeaderForm?.value?.invoiceheader
      for (let i = 0; i < data?.length; i++) {
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppname').reset()
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppstate').reset()
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppliergst').reset()
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('supplier_id').reset()
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('supplierstate_id').reset()
      }
      this.dataclear()
     }
    if (data.value == "Y") {
      this.showtaxforgst = true
      this.showsupppopup = true
      this.showsuppliercode = true
      this.showsupplierpan = true
     }

  }

  getsuppindex(ind) {
    this.supplierindex = ind
    let invoiceheaders = this.InvoiceHeaderForm?.value?.invoiceheader
    if (this.InvoiceHeaderForm?.value?.invoicegst == "" && this.ecftypeid != 4 || this.InvoiceHeaderForm?.value?.invoicegst == null && this.ecftypeid != 4 || this.InvoiceHeaderForm?.value?.invoicegst == undefined && this.ecftypeid != 4) {
      this.toastr.warning('', 'Please Choose GST Applicable Or Not', { timeOut: 1500 });
      this.showsupppopup = false
      return false
    }
    if (invoiceheaders[ind]?.suppname == null) {
      this.dataclear()
    }
  }
  statename: any
  getsuppView(data) {
    this.supplierid = data?.id
    this.ecfservice.getsupplierView(data?.id)
      .subscribe(result => {
        if (result) {
          this.SupplierName = result?.name
          this.SupplierCode = result?.code
          this.SupplierGSTNumber = result?.gstno
          this.SupplierPANNumber = result?.panno
          this.Address = result?.address_id
          this.line1 = result?.address_id?.line1
          this.line2 = result?.address_id?.line2
          this.line3 = result?.address_id?.line3
          this.City = result?.address_id?.city_id?.name
          this.stateid = result?.address_id?.state_id?.id
          this.statename = result?.address_id?.state_id?.name
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppname').setValue(this.SupplierName)
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppliergst').setValue(this.SupplierGSTNumber)
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('supplier_id').setValue(this.supplierid)
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('supplierstate_id').setValue(this.stateid)
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppstate').setValue(this.statename)
          this.submitbutton = true;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    }

  SelectSuppliersearch() {
    let searchsupplier = this.SelectSupplierForm?.value;
    if (searchsupplier?.code === "" && searchsupplier?.panno === "" && searchsupplier?.gstno === "") {
      this.getsuppliername("", "");
    }
    else {
      this.SelectSupplierForm.controls['name'].enable();
      this.alternate = true;
      this.default = false;
      this.Testingfunctionalternate();
    }
  }
  searchsupplier: any
  Testingfunctionalternate() {
    this.searchsupplier = this.SelectSupplierForm.value;
    this.ecfservice.getselectsupplierSearch(this.searchsupplier)
      .subscribe(result => {
        if (result) {
          this.selectsupplierlist = result['data']
          if (this.searchsupplier?.gstno?.length === 15 || this.searchsupplier?.panno?.length === 10) {
            let supplierdata = {
              "id": this.selectsupplierlist[0]?.id,
              "name": this.selectsupplierlist[0]?.name
            }
            this.supplierid = supplierdata?.id
            this.SelectSupplierForm.patchValue({name: supplierdata})
            this.getsuppView(supplierdata)
          }
        }
       }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  dataclear() {
    this.SelectSupplierForm.controls['gstno'].reset("")
    this.SelectSupplierForm.controls['code'].reset("")
    this.SelectSupplierForm.controls['panno'].reset("")
    this.SelectSupplierForm.controls['name'].reset("")
    this.SupplierName = "";
    this.SupplierCode = "";
    this.SupplierGSTNumber = "";
    this.SupplierPANNumber = "";
    this.Address = "";
    this.line1 = "";
    this.line2 = "";
    this.line3 = "";
    this.City = "";
    this.suplist = "";
    this.JsonArray = [];
    this.alternate = false
    this.default = true
    this.submitbutton = false;
  }

  numberOnlyandDot(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  only_numalpha(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  getFileDetails(index, e) {
    let data = this.InvoiceHeaderForm.value.invoiceheader
    for (var i = 0; i < e.target.files.length; i++) {
      data[index]?.filevalue?.push(e?.target?.files[i])
      data[index]?.filedataas?.push(e?.target?.files[i])
      }
     
    if(e.target.files.length > 0){
     data[index]?.file_key?.push("file" + index);
    }
   }
   deletefileUpload(invdata, i) {
    let filesValue = this.fileInput.toArray()
    let filesValueLength = filesValue?.length
    for (let i = 0; i < filesValueLength; i++) {
      filesValue[i].nativeElement.value = ""
    }
    let filedata = invdata.filevalue
    let filedatas = invdata.filedataas
    let file_key = invdata.file_key
    
    filedata.splice(i, 1)
    filedatas.splice(i, 1)
    file_key.splice(i, 1)
   
   }

submitinvoiceheader() {
    this.SpinnerService.show();
    const invoiceheaderdata = this.InvoiceHeaderForm?.value?.invoiceheader
    for (let i in invoiceheaderdata) {
     if ((invoiceheaderdata[i]?.suppname == '' && this.ecftypeid == 2) || (this.ecftypeid == 7 && invoiceheaderdata[i]?.suppname == '') || (invoiceheaderdata[i]?.suppname == null && this.ecftypeid == 2) || (invoiceheaderdata[i]?.suppname == null && this.ecftypeid == 7) || (invoiceheaderdata[i]?.suppname == undefined && this.ecftypeid == 2) || (invoiceheaderdata[i]?.suppname == undefined && this.ecftypeid == 7)) {
        this.toastr.error('Please Choose Supplier Name');
        this.SpinnerService.hide()
        return false;
      }
     if ((invoiceheaderdata[i]?.invoiceno == '' && this.ecftypeid == 2) || (invoiceheaderdata[i]?.invoiceno == '' && this.ecftypeid == 7) || (invoiceheaderdata[i]?.invoiceno == null && this.ecftypeid == 2) || (invoiceheaderdata[i]?.invoiceno == '' && this.ecftypeid == 7) || (invoiceheaderdata[i]?.invoiceno == undefined && this.ecftypeid == 2) || (invoiceheaderdata[i]?.invoiceno == '' && this.ecftypeid == 7) && this.ppxid != 'E') {
        this.toastr.error('Please Enter Invoice Number');
        this.SpinnerService.hide()
        return false;
      }
     if ((invoiceheaderdata[i]?.invoicedate == '' && this.ppxid != 'E') || (invoiceheaderdata[i]?.invoicedate == null && this.ppxid != 'E') || (invoiceheaderdata[i]?.invoicedate == undefined && this.ppxid != 'E')) {
        this.toastr.error('Please Choose Invoice Date');
        this.SpinnerService.hide()
        return false;
      }
    if ((invoiceheaderdata[i]?.invoiceamount == '') || (invoiceheaderdata[i]?.invoiceamount == null) || (invoiceheaderdata[i]?.invoiceamount == undefined)) {
        this.toastr.error('Please Enter Taxable Amount');
        this.SpinnerService.hide()
        return false;
      }
    if ((invoiceheaderdata[i]?.taxamount == 0 && this.InvoiceHeaderForm?.value?.invoicegst === 'Y' && this.ecftypeid == 2) || (invoiceheaderdata[i]?.taxamount == 0 && this.InvoiceHeaderForm?.value?.invoicegst === 'Y' && this.ecftypeid == 7)) {
        this.toastr.error('Please Enter Tax Amount');
        this.SpinnerService.hide()
        return false;
      }
    // if (this.ecftypeid != 4) {
        if (invoiceheaderdata[i]?.filedataas.length <= 0) {
          this.toastr.error('Please Upload File');
          this.SpinnerService.hide()
          return false;

        }
      // }
     if (invoiceheaderdata[i].id === "" || invoiceheaderdata[i].id === null) {
        delete invoiceheaderdata[i]?.id
      }
      if (this.ecfheaderid != undefined) {
        invoiceheaderdata[i].ecfheader_id = this.ecfheaderid
      } else {
        invoiceheaderdata[i].ecfheader_id = this.ecfheaderidd
      }
      invoiceheaderdata[i].invoicedate = this.datePipe.transform(invoiceheaderdata[i]?.invoicedate, 'yyyy-MM-dd');
      if (this.ecftypeid == 3) {
        invoiceheaderdata[i].invoicegst = 'N'
        invoiceheaderdata[i].invoiceno = "inv"+ this.datePipe.transform(new Date(), 'ddMM');
      } else {
        invoiceheaderdata[i].invoicegst = this.InvoiceHeaderForm?.value?.invoicegst
      }
      invoiceheaderdata[i].invtotalamt = this.sum
      invoiceheaderdata[i].raisorbranchgst = this.raisergst
      if (invoiceheaderdata[i]?.suppname == null) {
        invoiceheaderdata[i].suppname = ""
      }
      if (this.ppxid == 'E') {
        invoiceheaderdata[i].invoiceno = "inv"+ this.datePipe.transform(new Date(), 'ddMM');
        invoiceheaderdata[i].invoicedate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      }
      delete invoiceheaderdata[i]?.suppstate
      // delete invoiceheaderdata[i]?.filekey
     }
    if (this.ecfheaderForm?.value?.ecfamount < this.sum || this.ecfheaderForm?.value?.ecfamount > this.sum) {
      this.toastr.error('Check ECF Header Amount', 'Please Enter Valid Amount');
      this.SpinnerService.hide()
      return false;
    }
    this.Invoicedata = this.InvoiceHeaderForm?.value?.invoiceheader
    let reqData = this.Invoicedata
    for (let i = 0; i < reqData.length; i++) {
      let keyvalue = "file" + i
      let pairvalue = reqData[i]?.filevalue

      for (let fileindex in pairvalue) {
        this.formData.append(keyvalue, pairvalue[fileindex])
      }
    }
    this.formData.append('data', JSON.stringify(this.Invoicedata));
    if (this.ecfstatusid === 2) {
      this.ecfservice.createinvhdrmodification(this.formData)
        .subscribe(result => {
          if (result['invoiceheader'] == undefined) {
            this.notification.showError(result?.description)
            this.SpinnerService.hide()
            return false
          } else {
            this.notification.showSuccess("Successfully Invoice Header Saved!...")
            this.SpinnerService.hide();
            this.invheadersave = true
            this.readinvhdrdata = true
            this.showgstapply = true
            this.showaddbtn = false
            this.showaddbtns = true
            let data = this.InvoiceHeaderForm?.value?.invoiceheader
            for (let i in data) {
              data[i].id = result?.invoiceheader[i]?.id
            }
           this.invoiceheaderres = result?.invoiceheader
          }
         }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
       } else {
      this.ecfservice.invoiceheadercreate(this.formData)
        .subscribe(result => {
          if (result['invoiceheader'] == undefined) {
            this.notification.showError(result?.description)
            this.SpinnerService.hide()
            return false
          } else{
            this.notification.showSuccess("Successfully Invoice Header Saved!...")
            this.SpinnerService.hide();
            this.invheadersave = true
            this.readinvhdrdata = true
            this.showgstapply = true
            this.showaddbtn = false
            this.showaddbtns = true
            this.AddinvDetails = false
            let data = this.InvoiceHeaderForm?.value?.invoiceheader
            for (let i in data) {
              data[i].id = result?.invoiceheader[i]?.id
            }
            this.invoiceheaderres = result?.invoiceheader
          }
        },error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        )
    }
  }

  deleteinvheader(data, section, ind) {

    let id = section?.value?.id
    if (id != undefined) {
      this.delinvid = id
    } else {
       if (this.invoiceheaderres == undefined) {
        this.removeSection(ind)
      } else {
      for (var i = 0; i < this.invoiceheaderres?.length; i++) {
       if (i === ind) {
            this.delinvid = this.invoiceheaderres[i]?.id
          }
        }
      }
    }
    if (this.delinvid != undefined) {
      var answer = window.confirm("Are you sure to delete?");
      if (answer) {
        //some code
      }
      else {
        return false;
      }
      this.ecfservice.invhdrdelete(this.delinvid)
        .subscribe(result => {
          if (result?.status === "success") {
            this.notification.showSuccess("Deleted Successfully")
            this.removeSection(ind)
            if (this.InvoiceHeaderForm?.value?.invoiceheader?.length === 0) {
              this.addSection()
            }
          } else {
            this.notification.showError(result?.description)
          }
        })
     }
    else {
      this.removeSection(ind)
      if (this.InvoiceHeaderForm?.value?.invoiceheader?.length === 0) {
        this.addSection()
      }
    }

  }
  invoiceheaderaddonid: any
  invheadertotamount: any
  invheaderlist: any

  Addinvoices(section, data, index) {
    let datas = this.ecfeditdata['Invheader']
    let invdates = this.datePipe.transform(section.value.invoicedate, 'yyyy-MM-dd')
    let headerdata = this.InvoiceHeaderForm.value.invoiceheader[index]
    if (this.ecftypeid == 2) {
      if (datas[index].supplier_id.name != section.value.suppname) {
        this.notification.showInfo("Please save the changes you have done")
        return false
      }
      else if (datas[index].supplier_id.id != section.value.supplier_id) {
        this.notification.showInfo("Please save the changes you have done")
        return false
      }
     else if (datas[index].suppliergst != section.value.suppliergst) {
        this.notification.showInfo("Please save the changes you have done")
        return false
      }
     else if (datas[index].invoiceno != section.value.invoiceno) {
        this.notification.showInfo("Please save the changes you have done")
        return false
      }
     else if (datas[index].invoicedate != invdates) {
        this.notification.showInfo("Please save the changes you have done")
        return false
      }
     else if (datas[index].invoiceamount != section.value.invoiceamount) {
        this.notification.showInfo("Please save the changes you have done")
        return false
      }
      else if (datas[index].taxamount != section.value.taxamount) {
        this.notification.showInfo("Please save the changes you have done")
        return false
      }

      else if (datas[index].roundoffamt != section.value.roundoffamt) {
        this.notification.showInfo("Please save the changes you have done")
        return false
      }
      else if (datas[index].otheramount != section.value.otheramount) {
        this.notification.showInfo("Please save the changes you have done")
        return false
      }
      else if (datas[index].totalamount != section.value.totalamount) {
        this.notification.showInfo("Please save the changes you have done")
        return false
      }

      else {
        this.showheaderdata = false
        this.showinvocedetail = true
        this.invheadersave = true
        this.readinvhdrdata = true
        this.Addinvoice(section, data, index)

      }
    }

    if (this.ecftypeid == 3) {

      this.showheaderdata = false
      this.showinvocedetail = true
      this.invheadersave = true
      this.readinvhdrdata = true
      this.Addinvoice(section, data, index)
    }

    if (this.ecftypeid == 4) {

      this.showheaderdata = false
      this.showinvocedetail = true
      this.invheadersave = true
      this.readinvhdrdata = true
      this.Addinvoice(section, data, index)
    }

  }
  getinvoiceheaderresults: any
  getgstapplicable: any
  supinvno: any
  supinvdate: any
  supname: any
  supgstno: any
  suppincode: any

  // Addinvoice(section, data, index) {
  //   this.SpinnerService.show()
  //   this.showheaderdata = false
  //   this.showinvocedetail = true
  //   let invdtldatas = this.InvoiceDetailForm.get('invoicedtl') as FormArray
  //   invdtldatas.clear()
  //   let crdtdtldatas = this.InvoiceDetailForm.get('creditdtl') as FormArray
  //   crdtdtldatas.clear()
  //   if (this.ecftypeid == 4) {
  //     let debitdtldatas = this.DebitDetailForm.get('debitdtl') as FormArray
  //     debitdtldatas.clear()
  //   }
  //   this.invheaderlist = data?.invoiceheader
  //   let suppliername = this.invheaderlist[index]?.suppname
  //   if (this.invoiceheaderres != undefined) {
  //     let datas = this.invoiceheaderres[index]
  //     this.getgstapplicable = datas?.invoicegst
  //     this.invheadertotamount = Number(datas?.totalamount)
  //     this.invoiceheaderaddonid = datas?.id
  //     this.totalamount = this.invoiceheaderres[index]?.totalamount
  //     this.suppid = this.invoiceheaderres[index]?.supplier_id
  //     let invamount = Number(this.invoiceheaderres[index]?.invoiceamount)
  //     let roundamount = Number(this.invoiceheaderres[index]?.roundoffamt)
  //     let otheramount = Number(this.invoiceheaderres[index]?.otheramount)
  //     this.taxableamount = invamount
  //     this.invoiceno = this.invoiceheaderres[index]?.invoiceno
  //     this.invoiceheaderdetailForm.patchValue({
  //       raisorcode: this.raisergst,
  //       raisorname: [''],
  //       transbranch: [''],
  //       gst: datas?.invoicegst,
  //       suppcode: this.SupplierCode,
  //       suppbranch: this.City,
  //       suppname: suppliername,
  //       suppgstno: datas?.suppliergst,
  //       invoiceno: datas?.invoiceno,
  //       invoicedate: this.datePipe.transform(datas?.invoicedate, 'dd/MM/yyyy'),
  //       taxableamt: this.taxableamount,
  //       taxamount: datas?.taxamount,
  //       invoiceamt: datas?.totalamount,
  //       otheramount: otheramount,
  //       rndamount: roundamount,
  //     })
  //   } else {
  //     let sectiondatas = section?.value
  //     this.invoiceheaderaddonid = section?.value?.id
  //     this.invheadertotamount = Number(section?.value?.totalamount)
  //     this.suppid = sectiondatas?.supplier_id
  //     let invamount = Number(sectiondatas?.invoiceamount)
  //     let roundamount = Number(sectiondatas?.roundoffamt)
  //     let otheramount = Number(sectiondatas?.otheramount)
  //     this.taxableamount = invamount
  //     this.totalamount = sectiondatas?.totalamount
  //     this.invoiceno = sectiondatas?.invoiceno
  //     this.getgstapplicable = sectiondatas?.invoicegst
  //     this.invoiceheaderdetailForm.patchValue({
  //       raisorcode: this.raisergst,
  //       raisorname: [''],
  //       transbranch: [''],
  //       gst: sectiondatas?.invoicegst,
  //       suppcode: this.SupplierCode,
  //       suppbranch: this.City,
  //       suppname: sectiondatas?.suppname,
  //       suppgstno: sectiondatas?.suppliergst,
  //       invoiceno: sectiondatas?.invoiceno,
  //       invoicedate: this.datePipe.transform(sectiondatas?.invoicedate, 'dd/MM/yyyy'),
  //       taxableamt: this.taxableamount,
  //       invoiceamt: sectiondatas?.totalamount,
  //       taxamount: sectiondatas?.taxamount,
  //       otheramount: otheramount,
  //       rndamount: roundamount,
  //     })
  //    }
  //  if (this.invoiceheaderaddonid === "" || this.invoiceheaderaddonid === undefined || this.invoiceheaderaddonid === null) {
  //     this.toastr.warning('', 'Please Create Invoice Header First ', { timeOut: 1500 });
  //     this.showinvocedetail = false
  //     this.showheaderdata = true
  //     this.SpinnerService.hide()
  //     return false
  //   }
  //   this.ecfservice.getinvheaderdetails(this.invoiceheaderaddonid)
  //     .subscribe(results => {
  //       if (results.id != undefined) {
  //         this.getinvoiceheaderresults = results
  //         if (this.ecftypeid == 4) {
  //           let invoicedtl = results['invoicedtl']
  //           if (invoicedtl?.length != 0) {
  //             for (let i in invoicedtl) {
  //               this.invdetailidforadvance = invoicedtl[i]?.id
  //               }
  //           }
  //         }
  //         if (this.ecftypeid != 4) {
  //           if (results['invoicedtl']?.length === 0) {
  //             this.INVsum = ''
  //             this.invdtlsave = false
  //             this.readinvdata = false
  //           }
  //         }
  //         if (results['credit']?.length === 0) {
  //           this.accdata = ''
  //           this.discreditbtn = false
  //           this.readcreditdata = false
  //          }
  //         for (let datas of this.getinvoiceheaderresults?.credit) {
  //           datas['temp_amount'] = datas?.amount
  //         }
  //        if (this.ecftypeid != 4) {
  //           for (let a of results?.invoicedtl) {
  //             this.totaltax = a?.taxamount
  //              if (this.ecftypeid == 3) {
  //               this.SupplierDetailForm.patchValue({
  //                 invoiceno: a?.invoiceno,
  //                 invoicedate: a?.invoicedate,
  //                 supplier_name: a?.supplier_name,
  //                 suppliergst: a?.suppliergst,
  //                 pincode: a?.pincode
  //               })
  //             }
  //           }
  //         }
  //         if (results) {
  //           if (this.ecftypeid != 4) {
  //             this.getinvoicedtlrecords(results)
  //             this.getcreditrecords(results)
  //           } else {
  //             this.getdebitrecords(results)
  //             this.getcreditrecords(results)
  //           }
  //       }
  //         if (this.ecftypeid == 2) {
  //           let jsondata = {"supplier_id": this.suppid}
  //           this.ecfservice.ppxadvance(jsondata).subscribe(result => {
  //             if (result['data'] != undefined) {
  //               let datas = result['data']
  //               this.ppxdata = datas.filter(x => x.AP_liquedate_limit > 0)
  //               if (this.ppxdata.length > 0) {
  //                 var answer = window.confirm("Check For Advance");
  //                 if (answer) {
  //                   //some code
  //                 }
  //                 else {
  //                   return false;
  //                 }
  //                 this.shownotify = true
  //                 // this.notification.showSuccess("Check For Advance")
  //               } else {
  //                 this.shownotify = false
  //                 return false
  //               }
  //             }
  //           },
  //             error => {
  //               this.errorHandler.handleError(error);
  //               this.SpinnerService.hide();
  //             }
  //           )
  //         }
  //         if (this.ecftypeid == 3) {
  //           let jsondata = {
  //             "raisedby": this.raisedbyid
  //           }
  //           this.ecfservice.ppxadvance(jsondata).subscribe(result => {
  //             if (result['data'] != undefined) {
  //               let datas = result['data']
  //               this.ppxdata = datas.filter(x => x.AP_liquedate_limit > 0)
  //               if (this.ppxdata.length > 0) {
  //                 var answer = window.confirm("Check For Advance");
  //                 if (answer) {
  //                   //some code
  //                 }
  //                 else {
  //                   return false;
  //                 }
  //                 this.shownotify = true
  //                 // this.notification.showSuccess("Check For Advance")
  //               } else {
  //                 this.shownotify = false
  //                 return false
  //               }
  //             }
  //           },
  //             error => {
  //               this.errorHandler.handleError(error);
  //               this.SpinnerService.hide();
  //             }
  //           )
  //         }
  //         this.SpinnerService.hide()
  //       } else {
  //         this.notification.showError(results?.description)
  //         this.SpinnerService.hide();
  //         return false
  //       }
  //     },
  //       error => {
  //         this.errorHandler.handleError(error);
  //         this.SpinnerService.hide();
  //       }
  //     )
  //   }
  Addinvoice(section,data,index){
    this.SpinnerService.show()
    this.checkmultilevel();
    this.showheaderdata = false
    this.showinvocedetail = true
    let invdtldatas = this.InvoiceDetailForm.get('invoicedtl') as FormArray
    invdtldatas.clear()
    let crdtdtldatas = this.InvoiceDetailForm.get('creditdtl') as FormArray
    crdtdtldatas.clear()
    if (this.ecftypeid == 4) {
      let debitdtldatas = this.DebitDetailForm.get('debitdtl') as FormArray
      debitdtldatas.clear()
    }
    this.invheaderlist = data?.invoiceheader
    let suppliername = this.invheaderlist[index]?.suppname
    if (this.invoiceheaderres != undefined) {
      let datas = this.invoiceheaderres[index]
      this.getgstapplicable = datas?.invoicegst
      this.invheadertotamount = Number(datas?.totalamount)
      this.invoiceheaderaddonid = datas?.id
      this.totalamount = this.invoiceheaderres[index]?.totalamount
      this.suppid = this.invoiceheaderres[index]?.supplier_id
      let invamount = Number(this.invoiceheaderres[index]?.invoiceamount)
      let roundamount = Number(this.invoiceheaderres[index]?.roundoffamt)
      let otheramount = Number(this.invoiceheaderres[index]?.otheramount)
      this.taxableamount = invamount
      this.invoiceno = this.invoiceheaderres[index]?.invoiceno
      this.invoiceheaderdetailForm.patchValue({
        raisorcode: this.raisergst,
        raisorname: [''],
        transbranch: [''],
        gst: datas?.invoicegst,
        suppcode: this.SupplierCode,
        suppbranch: this.City,
        suppname: suppliername,
        suppgstno: datas?.suppliergst,
        invoiceno: datas?.invoiceno,
        invoicedate: this.datePipe.transform(datas?.invoicedate, 'dd/MM/yyyy'),
        taxableamt: this.taxableamount,
        taxamount: datas?.taxamount,
        invoiceamt: datas?.totalamount,
        otheramount: otheramount,
        rndamount: roundamount,
      })
    } else {
      let sectiondatas = section?.value
      this.invoiceheaderaddonid = section?.value?.id
      this.invheadertotamount = Number(section?.value?.totalamount)
      this.suppid = sectiondatas?.supplier_id
      let invamount = Number(sectiondatas?.invoiceamount)
      let roundamount = Number(sectiondatas?.roundoffamt)
      let otheramount = Number(sectiondatas?.otheramount)
      this.taxableamount = invamount
      this.totalamount = sectiondatas?.totalamount
      this.invoiceno = sectiondatas?.invoiceno
      this.getgstapplicable = sectiondatas?.invoicegst
      this.invoiceheaderdetailForm.patchValue({
        raisorcode: this.raisergst,
        raisorname: [''],
        transbranch: [''],
        gst: sectiondatas?.invoicegst,
        suppcode: this.SupplierCode,
        suppbranch: this.City,
        suppname: sectiondatas?.suppname,
        suppgstno: sectiondatas?.suppliergst,
        invoiceno: sectiondatas?.invoiceno,
        invoicedate: this.datePipe.transform(sectiondatas?.invoicedate, 'dd/MM/yyyy'),
        taxableamt: this.taxableamount,
        invoiceamt: sectiondatas?.totalamount,
        taxamount: sectiondatas?.taxamount,
        otheramount: otheramount,
        rndamount: roundamount,
      })
     }
   if (this.invoiceheaderaddonid === "" || this.invoiceheaderaddonid === undefined || this.invoiceheaderaddonid === null) {
      this.toastr.warning('', 'Please Create Invoice Header First ', { timeOut: 1500 });
      this.showinvocedetail = false
      this.showheaderdata = true
      this.SpinnerService.hide()
      return false
    }
    this.ecfservice.getinvheaderdetails(this.invoiceheaderaddonid)
      .subscribe(results => {
        if (results.id != undefined) {
          this.getinvoiceheaderresults = results
          if (this.ecftypeid == 4) {
            let invoicedtl = results['invoicedtl']
            if (invoicedtl?.length != 0) {
              for (let i in invoicedtl) {
                this.invdetailidforadvance = invoicedtl[i]?.id
                }
            }
          }
          if (this.ecftypeid != 4) {
            if (results['invoicedtl']?.length === 0) {
              this.INVsum = ''
              this.invdtlsave = false
              this.readinvdata = false
            }
          }
          if (results['credit']?.length === 0) {
            this.accdata = ''
            this.discreditbtn = false
            this.readcreditdata = false
           }
          for (let datas of this.getinvoiceheaderresults?.credit) {
            datas['temp_amount'] = datas?.amount
          }
         if (this.ecftypeid != 4) {
            for (let a of results?.invoicedtl) {
              this.totaltax = a?.taxamount
               if (this.ecftypeid == 3) {
                this.SupplierDetailForm.patchValue({
                  invoiceno: a?.invoiceno,
                  invoicedate: a?.invoicedate,
                  supplier_name: a?.supplier_name,
                  suppliergst: a?.suppliergst,
                  pincode: a?.pincode
                })
              }
            }
          }
          
          if (results) {
            if (this.ecftypeid != 4) {
              let jsondata
              let jsondatas
              if (this.ecftypeid == 2 ) {
                 jsondata = {"supplier_id": this.suppid}
                 jsondatas = {"crn_supplier_id": this.suppid}
              }
              else if(this.ecftypeid == 3) {
                 jsondata = {"raisedby": this.raisedbyid}
              }
            

              if(jsondata != undefined)
              {
                this.ecfservice.ppxadvance(jsondata).subscribe(result => {
                  if (result['data'] != undefined) {
                    let datas = result['data']
                    this.ppxdata = datas.filter(x => (x.AP_liquedate_limit > 0 && x.liquedate_limit > 0))
                    if (this.ppxdata.length > 0) {
                     var answer = window.confirm("Check For Advance");
                     this.shownotify = true
                    } else {
                      this.shownotify = false
                    }
                  }else{
                    this.notification.showError(result.description)
                    return false
                  }
                     },
                  error => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  }
                )
              }

              if(jsondatas != undefined)
              {
                this.ecfservice.ppxadvance(jsondatas).subscribe(result => {
                  if (result['data'] != undefined) {
                    let datas = result['data']
                    this.crndata = datas.filter(x => (x.AP_liquedate_limit > 0 && x.liquedate_limit > 0))
                    if (this.crndata.length > 0) {
                     var answer = window.confirm("Check For CRN");
                     this.showcrnnotify = true
                    } else {
                      this.showcrnnotify = false
                    }
                  }else{
                    this.notification.showError(result.description)
                    return false
                  }
                     },
                  error => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  }
                )
              }
              this.getinvoicedtlrecords(results)
              this.getcreditrecords(results) 
           
        }else {
          this.getdebitrecords(results)
          this.getcreditrecords(results)
        }

      }
      

          this.SpinnerService.hide()
          
         
        } else {
          this.notification.showError(results?.description)
          this.SpinnerService.hide();
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
    }

     

  hsnindex: any
  getindex(index) {
   this.hsnindex = index
  }

  getinvoicedtlrecords(datas) {
    if (datas?.invoicedtl?.length === 0) {
      const control = <FormArray>this.InvoiceDetailForm.get('invoicedtl');
      control.push(this.INVdetail());

      if ((this.ecftypeid == 2 && this.InvoiceHeaderForm?.value?.invoicegst == 'N') || (this.ecftypeid == 7 && this.InvoiceHeaderForm?.value?.invoicegst == 'N') || (this.ecftypeid == 3)) {
        for (let i = 0; i < 1; i++) {
          this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('hsn').disable()
          this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('hsn_percentage').disable()
          this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('cgst').disable()
          this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('sgst').disable()
          this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('igst').disable()
        }
      }


    }

    for (let details of datas.invoicedtl) {
      let id: FormControl = new FormControl('');
      let dtltotalamt: FormControl = new FormControl('');
      let invoiceheader_id: FormControl = new FormControl('');
      let productname: FormControl = new FormControl('');
      let productcode: FormControl = new FormControl('');
      let invoice_po: FormControl = new FormControl('');
      let description: FormControl = new FormControl('');
      let hsn: FormControl = new FormControl('');
      let hsn_percentage: FormControl = new FormControl('');
      let uom: FormControl = new FormControl('');
      let unitprice: FormControl = new FormControl('');
      let quantity: FormControl = new FormControl('');
      let amount: FormControl = new FormControl('');
      let cgst: FormControl = new FormControl('');
      let sgst: FormControl = new FormControl('');
      let igst: FormControl = new FormControl('');
      let discount: FormControl = new FormControl('');
      let taxamount: FormControl = new FormControl('');
      let totalamount: FormControl = new FormControl('');
      let roundoffamt: FormControl = new FormControl('');
      let otheramount: FormControl = new FormControl('');
      const invdetFormArray = this.InvoiceDetailForm.get("invoicedtl") as FormArray;
      id.setValue(details.id)
      dtltotalamt.setValue(this.totalamount)
      invoiceheader_id.setValue(details?.invoiceheader)
      productname.setValue(details?.productname)
      productcode.setValue(details?.productcode)
      invoice_po.setValue(details?.invoice_po)
      description.setValue(details?.description)
      if (details?.hsn?.code === "UNEXPECTED_ERROR") {
        hsn.setValue("")
      } else {
        hsn.setValue(details?.hsn)
      }
      hsn_percentage.setValue(details?.hsn_percentage)
      uom.setValue(details?.uom)
      unitprice.setValue(details?.unitprice)
      quantity.setValue(details?.quantity)
      amount.setValue(details?.amount)
      cgst.setValue(details?.cgst)
      sgst.setValue(details?.sgst)
      igst.setValue(details?.igst)
      discount.setValue(0)
      taxamount.setValue(details?.taxamount)
      totalamount.setValue(details?.totalamount)
      roundoffamt.setValue(details?.roundoffamt)
      otheramount.setValue(details?.otheramount)

      invdetFormArray.push(new FormGroup({
        id: id,
        dtltotalamt: dtltotalamt,
        invoiceheader_id: invoiceheader_id,
        productname: productname,
        productcode: productcode,
        invoice_po: invoice_po,
        description: description,
        hsn: hsn,
        hsn_percentage: hsn_percentage,
        uom: uom,
        unitprice: unitprice,
        quantity: quantity,
        amount: amount,
        cgst: cgst,
        sgst: sgst,
        igst: igst,
        discount: discount,
        taxamount: taxamount,
        totalamount: totalamount,
        roundoffamt: roundoffamt,
        otheramount: otheramount
       }))

      hsn.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservice.gethsnscroll(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
                if (value === "") {

                  this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('hsn_percentage').reset()
                  this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('cgst').reset(0)
                  this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('sgst').reset(0)
                  this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('igst').reset(0)
                  this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('taxamount').reset(0)
                  this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, roundoffamt, otheramount)

                }
              }),

            )

          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.hsnList = datas;
          this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
        })

      uom.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservice.uomscroll(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.uomList = datas;
          this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
        })

      this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, roundoffamt, otheramount)


      unitprice.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        // this.calcTotalM(value)
        this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, roundoffamt, otheramount)
        if (!this.InvoiceDetailForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      }
      )

      quantity.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        // this.calcTotalM(value)
        this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, roundoffamt, otheramount)
        if (!this.InvoiceDetailForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      }
      )

      amount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        // this.calcTotalM(value)
        this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, roundoffamt, otheramount)
        if (!this.InvoiceDetailForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      }
      )

      taxamount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        // this.calcTotalM(value)
        this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, roundoffamt, otheramount)
        if (!this.InvoiceDetailForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      }
      )


      totalamount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        // this.calcTotalM(value)
        this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, roundoffamt, otheramount)
        if (!this.InvoiceDetailForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      }
      )

      roundoffamt.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        // this.calcTotalM(value)
        this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, roundoffamt, otheramount)
        if (!this.InvoiceDetailForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      }
      )

      otheramount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        // this.calcTotalM(value)
        this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, roundoffamt, otheramount)
        if (!this.InvoiceDetailForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      }
      )

    }
  }
  selectedaccno: any
  getcreditrecords(datas) {
    if (datas?.credit?.length == 0) {
      const control = <FormArray>this.InvoiceDetailForm.get('creditdtl');
      control.push(this.creditdetails());
      for (let i = 0; i < 1; i++) {
        this.InvoiceDetailForm.get('creditdtl')['controls'][i].get('amount').setValue(this.totalamount)
      }
      this.creditdatasums()
    }
    let paymodedatas = datas?.credit
    for (let i = 0; i < paymodedatas?.length; i++) {
      if (paymodedatas[i]?.paymode_id?.id == 5) {
        this.showaccno[i] = true
        this.getcreditindex = i
        this.selectedaccno = paymodedatas[i]?.creditrefno
        this.paymodeid = paymodedatas[i]?.paymode_id?.id
        this.getaccno(paymodedatas[i]?.paymode_id?.id)
      }
    if (paymodedatas[i]?.paymode_id?.id == 1 || paymodedatas[i]?.paymode_id?.id == 4) {
        this.paymodeid = paymodedatas[i]?.paymode_id?.id
        this.showeraacc[i] = true
        this.getERA(i)
      }
    }
     for (let data of datas?.credit) {
      let id: FormControl = new FormControl('');
      let invoiceheader_id: FormControl = new FormControl('');
      let paymode_id: FormControl = new FormControl('');
      let creditbank_id: FormControl = new FormControl('');
      let suppliertax_id: FormControl = new FormControl('');
      let creditglno: FormControl = new FormControl('');
      let creditrefno: FormControl = new FormControl('');
      let suppliertaxtype: FormControl = new FormControl('');
      let suppliertaxrate: FormControl = new FormControl('');
      let taxexcempted: FormControl = new FormControl('');
      let amount: FormControl = new FormControl('');
      let taxableamount: FormControl = new FormControl('');
      let ddtranbranch: FormControl = new FormControl('');
      let credittotal: FormControl = new FormControl('');
      let ddpaybranch: FormControl = new FormControl('');
      let category_code: FormControl = new FormControl('');
      let subcategory_code: FormControl = new FormControl('');
      let bank: FormControl = new FormControl('');
      let branch: FormControl = new FormControl('');
      let ifsccode: FormControl = new FormControl('');
      let benificiary: FormControl = new FormControl('');
      let amountchange: FormControl = new FormControl('');
      let accno: FormControl = new FormControl('');
      const creditdetailformArray = this.InvoiceDetailForm.get("creditdtl") as FormArray;


      id.setValue(data?.id)
      invoiceheader_id.setValue(data?.invoiceheader)
      paymode_id.setValue(data?.paymode_id?.id)
      accno.setValue(data?.creditrefno)
      creditbank_id.setValue(data?.creditbank_id)
      suppliertax_id.setValue(data?.suppliertax_id)
      creditglno.setValue(data?.creditglno)
      creditrefno.setValue(data?.creditrefno)
      suppliertaxtype.setValue(data?.suppliertaxtype)
      suppliertaxrate.setValue(data?.suppliertaxrate)
      taxexcempted.setValue(data?.taxexcempted)
      amount.setValue(data?.amount)
      taxableamount.setValue(data?.taxableamount)
      ddtranbranch.setValue(data?.ddtranbranch)
      ddpaybranch.setValue(data?.ddpaybranch)
      category_code.setValue(data?.category_code)
      subcategory_code.setValue(data?.subcategory_code)
      if (data?.credit_bank != undefined) {
        for (let i = 0; i < data?.credit_bank['data']?.length; i++) {
          bank.setValue(data?.credit_bank['data'][i]?.bank_id?.name)
          branch.setValue(data?.credit_bank['data'][i]?.branch_id?.name)
          ifsccode.setValue(data?.credit_bank['data'][i]?.branch_id?.ifsccode)
          benificiary.setValue(data?.credit_bank['data'][i]?.beneficiary)
        }
      } else {
        bank.setValue("")
        branch.setValue("")
        ifsccode.setValue("")
        benificiary.setValue("")
      }
      amountchange.setValue("")
      credittotal.setValue(0)

      if(data.paymode_id.id == 6)
      {
        creditrefno.setValue(data.creditrefno)
        let advno = data.creditrefno
  
        for (let j = 0; j< this.ppxdata.length; j++)
        {
          if (this.ppxdata[j].crno == advno)
          {
            this.selectedppxdata.push(this.ppxdata[j])
            let n = this.selectedppxdata.length-1
            this.selectedppxdata[n].liquidate_amt = data.amount
          }
        }
      }
      console.log("this.selectedppxdata==",this.selectedppxdata)


      if(data.paymode_id.id == 8)
      {
        creditrefno.setValue(data.creditrefno)
        let crnno = data.creditrefno
  
        for (let j = 0; j< this.crndata.length; j++)
        {
          if (this.crndata[j].crno == crnno)
          {
            this.selectedcrndata.push(this.crndata[j])
            let n = this.selectedcrndata.length-1
            this.selectedcrndata[n].liquidate_amt = data.amount
          }
        }
      }
      console.log("this.selectedcrbdata==",this.selectedcrndata)


      creditdetailformArray.push(new FormGroup({
        invoiceheader_id: invoiceheader_id,
        paymode_id: paymode_id,
        creditbank_id: creditbank_id,
        suppliertax_id: suppliertax_id,
        creditglno: creditglno,
        creditrefno: creditrefno,
        suppliertaxtype: suppliertaxtype,
        suppliertaxrate: suppliertaxrate,
        taxexcempted: taxexcempted,
        amount: amount,
        taxableamount: taxableamount,
        ddtranbranch: ddtranbranch,
        ddpaybranch: ddpaybranch,
        category_code: category_code,
        subcategory_code: subcategory_code,
        id: id,
        bank: bank,
        branch: branch,
        ifsccode: ifsccode,
        benificiary: benificiary,
        amountchange: amountchange,
        credittotal: credittotal,
        accno: accno
      }))
      this.calcTotalcreditdatas(amount)

      amount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {

        this.creditdatasums()
        if (!this.InvoiceDetailForm.valid) {
          return;
        }
        this.linesChange.emit(this.InvoiceDetailForm.value['creditdtl']);
      }
      )

      amountchange.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {

        this.amountReduction()
        if (!this.InvoiceDetailForm.valid) {
          return;
        }
        this.linesChange.emit(this.InvoiceDetailForm.value['creditdtl']);
      }
      )
    }
    this.getcredit = false
 }

  calcTotalcreditdatas(amount: FormControl) {
    this.creditdatasums()
  }

// ---------overall submit------

  public displayFnbranch(branchtype?: branchListss): string | undefined {
   return branchtype ? branchtype.name : undefined;
  }
  get branchtype() {
    return this.SubmitoverallForm.get('approver_branch');
  }
  public displayFnbranchrole(branchtyperole?: branchListss): string | undefined {
    return branchtyperole ? +branchtyperole.code + "-" + branchtyperole.name : undefined;
  }
 get branchtyperole() {
    return this.ecfheaderForm.get('branch');
  }
  branchdropdown(branchkeyvalue) {
    this.ecfservice.getbranch(branchkeyvalue)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.Branchlist = datas;
        }

      },error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
  }

  branchScroll() {
    setTimeout(() => {
      if (
        this.matbranchAutocomplete &&
        this.matbranchAutocomplete &&
        this.matbranchAutocomplete.panel
      ) {
        fromEvent(this.matbranchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbranchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.getbranchscroll(this.branchInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Branchlist.length >= 0) {
                      this.Branchlist = this.Branchlist.concat(datas);
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

  public displayFnapprover(approvertype?: approverListss): string | undefined {
    return approvertype ? approvertype.name : undefined;
   }

  public displayFnapproveredit(approvertype?: approverListss): string | undefined {
   return approvertype ? approvertype.name : undefined;
  }

  get approvertype() {
    return this.SubmitoverallForm.get('approvedby_id');
  }
  approvid: any
  approverid(data) {
    this.approvid = data?.employee_id?.id
    }


  approverdropdown() {
    if(this.ismultilevel == true){
    this.ecfservice.getdelmatapprover(this.commodityid,this.createdbyid)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.Approverlist = datas;
        }
      },error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
    }else{
      this.ecfservice.getapprover(this.commodityid,this.createdbyid)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.Approverlist = datas;
        }
      },error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
    }
    
  }

  approverScroll() {
    if(this.ismultilevel == true){
    setTimeout(() => {
      if (
        this.matappAutocomplete &&
        this.matappAutocomplete &&
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
                this.ecfservice.getdelmatapproverscroll(this.currentpage + 1, this.commodityid,this.createdbyid)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Approverlist.length >= 0) {
                      this.Approverlist = this.Approverlist.concat(datas);
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
  }else{
    setTimeout(() => {
      if (
        this.matappAutocomplete &&
        this.matappAutocomplete &&
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
                this.ecfservice.getapproverscroll(this.currentpage + 1, this.commodityid,this.createdbyid)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Approverlist.length >= 0) {
                      this.Approverlist = this.Approverlist.concat(datas);
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

 fileChange(event, ind) {
    let imagesList = [];
    for (var i = 0; i < event?.target?.files?.length; i++) {
      this.images.push(event?.target?.files[i]);
    }
    this.InputVar.nativeElement.value = '';
    imagesList.push(this.images);
    this.uploadList = [];
    imagesList.forEach((item) => {
      let s = item;
      s.forEach((it) => {
        let io = it.name;
        this.uploadList.push(io);
      });
    });
  }

  deleteUpload(s, index) {
    this.uploadList.forEach((s, i) => {
      if (index === i) {
        this.uploadList.splice(index, 1)
        this.images.splice(index, 1);
      }
    })
  }
  ecffid: any
  OverallFormSubmit() {
    this.SpinnerService.show()
    const data = this.SubmitoverallForm?.value
    if (data?.approvedby_id === "" || data?.approvedby_id === null) {
      this.toastr.warning('', 'Please Choose Approver ', { timeOut: 1500 });
      this.SpinnerService.hide()
      return false;
    }
    if (data?.approver_branch != null && data?.approver_branch != "" && data?.approver_branch != undefined) {
      data.approver_branch = data?.approver_branch?.id
    } else {
      data.approver_branch = ""
    }
    if (this.ecfheaderidd === "") {
      this.ecffid = this.ecfheaderid
    } else {
      this.ecffid = this.ecfheaderidd
    }
    this.ECFData = {
      "id": this.ecffid,
      "approvedby_id": data?.approvedby_id?.id,
      "ecftype": this.ecftypeid,
      "tds": 0,
      "approver_branch": data?.approver_branch
    }
    this.ecfservice.OverallSubmit(this.ECFData)
      .subscribe(result => {
        if (result?.status == 'success') {
          this.notification.showSuccess("Successfully ECF Created!...")
          this.SpinnerService.hide()
          this.onSubmit.emit()
          this.submitoverallbtn = true
        }else {
          this.notification.showError(result?.description)
          this.SpinnerService.hide()
         }
      },error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
  }
  // ---------Invoice Details--------
  indexvalueOninvdetails(index) {
    this.indexDet = index
  }
  getinvdtlSections(forms) {
    return forms.controls.invoicedtl.controls;
  }
  addinvdtlSection() {
    const control = <FormArray>this.InvoiceDetailForm.get('invoicedtl');
    control.push(this.INVdetail());
    if (this.getgstapplicable === "N") {
      for (let i = 0; i < 30; i++) {
        this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('hsn').disable()
        this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('hsn_percentage').disable()
        this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('igst').disable()
        this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('cgst').disable()
        this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('sgst').disable()
        this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('taxamount').disable()
      }
     }
  }

  removeinvdtlSection(i) {
    const control = <FormArray>this.InvoiceDetailForm.get('invoicedtl');
    control.removeAt(i);
    this.INVdatasums()
  }

  ppxdetail() {
    let group = new FormGroup({
      apppxheader_id: new FormControl(),
      apinvoiceheader_id: new FormControl(),
      apcredit_id: new FormControl(),
      ppxdetails_amount: new FormControl(),
      ppxdetails_adjusted: new FormControl(),
      ppxdetails_balance: new FormControl(),
      ecf_amount: new FormControl(),
      ecfheader_id: new FormControl(),
      process_amount: new FormControl(),
    })
    return group
  }


  INVdetail() {

    let group = new FormGroup({
      dtltotalamt: new FormControl(0),
      invoiceheader_id: new FormControl(),
      productname: new FormControl(''),
      productcode: new FormControl('PRD103'),
      invoice_po: new FormControl(''),
      description: new FormControl(''),
      hsn: new FormControl(''),
      hsn_percentage: new FormControl(''),
      uom: new FormControl(''),
      unitprice: new FormControl(''),
      quantity: new FormControl(''),
      amount: new FormControl(0),
      cgst: new FormControl(0),
      sgst: new FormControl(0),
      igst: new FormControl(0),
      discount: new FormControl(0),
      taxamount: new FormControl(0),
      totalamount: new FormControl(0),
      roundoffamt: new FormControl(0),
      otheramount: new FormControl(0),
      invoiceno: new FormControl(""),
      invoicedate: new FormControl(""),
      supplier_name: new FormControl(""),
      suppliergst: new FormControl(""),
      pincode: new FormControl(0),

    })
    group.get('hsn').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;

        }),
        switchMap(value => this.ecfservice.gethsnscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
              if (value === "" || value.id === undefined) {
                this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('hsn_percentage').reset()
                this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('cgst').reset(0)
                this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('sgst').reset(0)
                this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('igst').reset(0)
                this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('taxamount').reset(0)
                this.calcTotalM(group);

              }
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.hsnList = datas;
        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      })


    group.get('uom').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.uomscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.uomList = datas;
        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      })


    group.get('unitprice').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcTotalM(group)
      // this.datasums()
      if (!this.InvoiceDetailForm.valid) {
        return;
      }

      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )


    group.get('quantity').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )

    group.get('sgst').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )

    group.get('cgst').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )

    group.get('igst').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )

    group.get('amount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )

    group.get('taxamount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )

    group.get('roundoffamt').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )

    group.get('otheramount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )
    return group
  }

  public displayFnuom(uomtype?: uomlistss): string | undefined {
    return uomtype ? uomtype.name : undefined;
  }

  get uomtype() {
    return this.InvoiceDetailForm.get('uom');
  }

  getuom(uomkeyvalue) {
    this.ecfservice.getuom(uomkeyvalue)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.uomList = datas;
        }

      },

        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
  }

  uomScroll() {
    setTimeout(() => {
      if (
        this.matuomAutocomplete &&
        this.matuomAutocomplete &&
        this.matuomAutocomplete.panel
      ) {
        fromEvent(this.matuomAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matuomAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matuomAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matuomAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matuomAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.uomscroll(this.uomInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.uomList.length >= 0) {
                      this.uomList = this.uomList.concat(datas);
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



  public displayFnhsn(hsntype?: hsnlistss): string | undefined {
    return hsntype ? hsntype.code : undefined;
  }

  get hsntype() {
    return this.InvoiceDetailForm.get('hsn');
  }
  hsnpercent: any
  hsncode: any
  gethsn(hsnkeyvalue) {
    this.ecfservice.gethsn(hsnkeyvalue)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.hsnList = datas;
        }

      },

        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
  }
 gethsncode(igstrate, code, ind) {
    this.hsnpercent = igstrate
    this.hsncode = code
    this.InvoiceDetailForm.get('invoicedtl')['controls'][ind].get('hsn_percentage').setValue(this.hsnpercent)
  }
  hsnScroll() {
    setTimeout(() => {
      if (
        this.mathsnAutocomplete &&
        this.mathsnAutocomplete &&
        this.mathsnAutocomplete.panel
      ) {
        fromEvent(this.mathsnAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mathsnAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mathsnAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.mathsnAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.mathsnAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.gethsnscroll(this.hsnInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.hsnList.length >= 0) {
                      this.hsnList = this.hsnList.concat(datas);
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
  changeindex: any
  getgst(data, index) {
    this.changeindex = index
    if ((this.getgstapplicable === "Y") && (this.ecftypeid == 2 ||  this.ecftypeid == 7)) {
      let overalloffIND = this.InvoiceDetailForm?.value?.invoicedtl;
      this.hsncodess = overalloffIND[index]?.hsn?.code;
      let unit = overalloffIND[index]?.unitprice
      let units = Number(unit)
      let qtyy = overalloffIND[index]?.quantity
      if (qtyy === null || qtyy === undefined) {
        qtyy = 0
      }
      if ((this.hsncodess === "" || this.hsncodess === undefined || this.hsncodess === null)
        || (qtyy === "" || qtyy === undefined || qtyy === null)
        || (unit === "" || unit === undefined || unit === null)) {
        return false
      }
      if ((this.hsncodess !== "" || this.hsncodess !== undefined || this.hsncodess !== null)
        || (qtyy !== "" || qtyy !== undefined || qtyy !== null)
        || (unit !== "" || unit !== undefined || unit !== null)) {

        let json = {
          "code": this.hsncodess,
          "unitprice": units,
          "qty": qtyy,
          "discount": 0,
          "type": this.type
        }
         this.ecfservice.GSTcalculation(json)
          .subscribe(result => {
            this.igstrate = result?.igst
            this.sgstrate = result?.sgst
            this.cgstrate = result?.cgst
            this.totaltax = this.igstrate + this.sgstrate + this.cgstrate
            this.InvoiceDetailForm.get('invoicedtl')['controls'][index].get('sgst').setValue(this.sgstrate)
            this.InvoiceDetailForm.get('invoicedtl')['controls'][index].get('cgst').setValue(this.cgstrate)
            this.InvoiceDetailForm.get('invoicedtl')['controls'][index].get('igst').setValue(this.igstrate)
            this.InvoiceDetailForm.get('invoicedtl')['controls'][index].get('taxamount').setValue(this.totaltax)


          })

      }
    }
  }
  calcTotalM(group: FormGroup) {
    const Unitprice = +group.controls['unitprice'].value;
    const quantity = +group.controls['quantity'].value;
    const roundoff = +group.controls['roundoffamt'].value;
    const otheramt = +group.controls['otheramount'].value;
    let qty = Number(quantity)
    let unitprices = Number(Unitprice)
    let roundoffs = Number(roundoff)
    let otheramounts = Number(otheramt)
    this.totaltaxable = qty * unitprices
    group.controls['amount'].setValue((this.totaltaxable), { emitEvent: false });
    let taxamount = +group.controls['taxamount'].value;
    let taxes = Number(taxamount)
    this.overalltotal = (this.totaltaxable + taxes).toFixed(2)
    group.controls['totalamount'].setValue((this.overalltotal), { emitEvent: false });
    this.INVdatasums();
  }

  calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, roundoffamt, otheramount: FormControl) {
    const Quantity = Number(quantity.value)
    const unitsprice = Number(unitprice.value)
    const taxAmount = Number(taxamount.value)
    const roundoff = Number(roundoffamt.value)
    const otheramounts = Number(otheramount.value)
    this.totaltaxable = Quantity * unitsprice
    amount.setValue((this.totaltaxable), { emitEvent: false });
    this.overalltotal = (this.totaltaxable + taxAmount).toFixed(2)
    totalamount.setValue((this.overalltotal), { emitEvent: false });
    this.INVdatasums();
  }
  Roundoffamount: any
  OtherAdjustmentamt: any
  INVdatasums() {
    this.INVamt = this.InvoiceDetailForm.value['invoicedtl'].map(x => Number((x.totalamount)));
    this.Roundoffsamount = this.InvoiceDetailForm?.value?.roundoffamt
    this.OtherAdjustmentamts = this.InvoiceDetailForm?.value?.otheramount
    let INVsum = (this.INVamt.reduce((a, b) => a + b, 0));
    this.INVsum = (INVsum + Number(this.Roundoffsamount) + Number(this.OtherAdjustmentamts)).toFixed(2)
   }
 submitinvoicedtl() {
    this.SpinnerService.show()
    const invdetaildata = this.InvoiceDetailForm?.value?.invoicedtl
    let amt = this.InvoiceDetailForm.value['invoicedtl'].map(x => x.amount);
    let amtcheck = amt.reduce((a, b) => a + b, 0);
    for (let i in invdetaildata) {
     if ((invdetaildata[i]?.productname == '') || (invdetaildata[i]?.productname == null) || (invdetaildata[i]?.productname == undefined)) {
        this.toastr.error('Please Enter Item');
        this.SpinnerService.hide()
        return false;
      }
     if ((this.ecftypeid == 2 && this.InvoiceHeaderForm?.value?.invoicegst === 'Y') || (this.ecftypeid == 7 && this.InvoiceHeaderForm?.value?.invoicegst === 'Y')) {
        if ((invdetaildata[i]?.hsn == '') || (invdetaildata[i]?.hsn == null) || (invdetaildata[i]?.hsn == undefined)) {
          this.toastr.error('Please Choose Hsn Code');
          this.SpinnerService.hide()
          return false;
        }
      }

      if ((invdetaildata[i]?.uom == '') || (invdetaildata[i]?.uom == null) || (invdetaildata[i]?.uom == undefined)) {
        this.toastr.error('Please Choose UOM');
        this.SpinnerService.hide()
        return false;
      }
    if ((invdetaildata[i]?.unitprice == '') || (invdetaildata[i]?.unitprice == null) || (invdetaildata[i]?.unitprice == undefined)) {
        this.toastr.error('Please Enter Unit Price');
        this.SpinnerService.hide()
        return false;
      }
    if ((invdetaildata[i]?.quantity == '') || (invdetaildata[i]?.quantity == null) || (invdetaildata[i]?.quantity == undefined)) {
        this.toastr.error('Please Enter Quantity');
        this.SpinnerService.hide()
        return false;
      }
    if (invdetaildata[i]?.id === "" || invdetaildata[i]?.id === null) {
        delete invdetaildata[i].id
      }
    if (this.ecftypeid == 3) {
        let data = this.SupplierDetailForm?.value
        invdetaildata[i].dtltotalamt = this.invheadertotamount
        invdetaildata[i].hsn = "NOHSN-0.0"
        invdetaildata[i].hsn_percentage = 0
        invdetaildata[i].invoiceheader_id = this.invoiceheaderaddonid
        invdetaildata[i].productcode = "PRD103"
        if (invdetaildata[i].uom === null) {
          invdetaildata[i].uom = ""
        }else {
          invdetaildata[i].uom = invdetaildata[i]?.uom?.name
        }
        invdetaildata[i].discount = 0
        invdetaildata[i].invoice_po = ""
        if (this.InvoiceDetailForm?.value?.roundoffamt != null) {
          invdetaildata[i].roundoffamt = this.InvoiceDetailForm?.value?.roundoffamt
        } else {
          invdetaildata[i].roundoffamt = 0
        }
        if (this.InvoiceDetailForm?.value?.otheramount != null) {
          invdetaildata[i].otheramount = this.InvoiceDetailForm?.value?.otheramount
        } else {
          invdetaildata[i].otheramount = 0
        }
        invdetaildata[i].igst = 0
        invdetaildata[i].cgst = 0
        invdetaildata[i].sgst = 0
        invdetaildata[i].taxamount = 0
        delete invdetaildata[i].invoiceno
        delete invdetaildata[i].supplier_name
        delete invdetaildata[i].pincode
        delete invdetaildata[i].suppliergst
        delete invdetaildata[i].invoicedate
     }
      if ((this.getgstapplicable === 'Y' && this.ecftypeid == 2) || (this.getgstapplicable === 'Y' && this.ecftypeid == 7)){
        invdetaildata[i].dtltotalamt = this.invheadertotamount
        invdetaildata[i].hsn = invdetaildata[i]?.hsn?.code
        invdetaildata[i].invoiceheader_id = this.invoiceheaderaddonid
        invdetaildata[i].productcode = "PRD103"
        if (invdetaildata[i].uom === null) {
          invdetaildata[i].uom = ""
        }else {
          invdetaildata[i].uom = invdetaildata[i]?.uom?.name
        }
        invdetaildata[i].discount = 0
        invdetaildata[i].invoice_po = ""
        if (this.InvoiceDetailForm?.value?.roundoffamt != null) {
          invdetaildata[i].roundoffamt = this.InvoiceDetailForm?.value?.roundoffamt
        } else {
          invdetaildata[i].roundoffamt = 0
        }
        if (this.InvoiceDetailForm?.value?.otheramount != null) {
          invdetaildata[i].otheramount = this.InvoiceDetailForm?.value?.otheramount
        } else {
          invdetaildata[i].otheramount = 0
        }
        delete invdetaildata[i]?.invoiceno
        delete invdetaildata[i]?.supplier_name
        delete invdetaildata[i]?.pincode
        delete invdetaildata[i]?.suppliergst
        delete invdetaildata[i]?.invoicedate


      }
      if ((this.getgstapplicable === 'N' && this.ecftypeid == 2) || (this.getgstapplicable === 'N' && this.ecftypeid == 7)) {
        invdetaildata[i].dtltotalamt = this.invheadertotamount
        invdetaildata[i].hsn = "NOHSN-0.0"
        invdetaildata[i].hsn_percentage = 0
        invdetaildata[i].invoiceheader_id = this.invoiceheaderaddonid
        invdetaildata[i].productcode = "PRD103"
        if (invdetaildata[i].uom === null) {
          invdetaildata[i].uom = ""
        }else {
          invdetaildata[i].uom = invdetaildata[i]?.uom?.name
        }
        invdetaildata[i].discount = 0
        invdetaildata[i].invoice_po = ""
        if (this.InvoiceDetailForm?.value?.roundoffamt != null) {
          invdetaildata[i].roundoffamt = this.InvoiceDetailForm?.value?.roundoffamt
        } else {
          invdetaildata[i].roundoffamt = 0
        }
        if (this.InvoiceDetailForm?.value?.otheramount != null) {
          invdetaildata[i].otheramount = this.InvoiceDetailForm?.value?.otheramount
        } else {
          invdetaildata[i].otheramount = 0
        }
        invdetaildata[i].igst = 0
        invdetaildata[i].cgst = 0
        invdetaildata[i].sgst = 0
        invdetaildata[i].taxamount = 0
        delete invdetaildata[i].invoiceno
        delete invdetaildata[i].supplier_name
        delete invdetaildata[i].pincode
        delete invdetaildata[i].suppliergst
        delete invdetaildata[i].invoicedate

      }
    }
   let headervalue = this.InvoiceHeaderForm?.value?.invoiceheader
    for (let invhdrindex in headervalue) {
      if (headervalue[invhdrindex]?.id === this.invoiceheaderaddonid) {
        headervalue[invhdrindex].roundoffamt = this.InvoiceDetailForm?.value?.roundoffamt
        headervalue[invhdrindex].otheramount = this.InvoiceDetailForm?.value?.otheramount
       }
    }
   if (this.INVsum > this.totalamount || this.INVsum < this.totalamount) {
      this.toastr.error('Check Invoice Header Amount', 'Please Enter Valid Amount');
      this.SpinnerService.hide()
      return false
    }

    if (this.ecfstatusid === 2) {
      this.ecfservice.createinvdtlmodification(this.InvoiceDetailForm?.value?.invoicedtl)
        .subscribe(result => {
         if (result['invoicedetails'] == undefined) {
            this.notification.showError(result?.description)
            this.SpinnerService.hide()
            return false
          }else {
            this.notification.showSuccess("Successfully Invoice Detail Saved")
            this.SpinnerService.hide()
            this.invdtlsave = true
            this.readinvdata = true
            this.showdebitpopup = true
            this.showadddebit = true
            this.showadddebits = false
            this.invoicedetailsdata = result?.invoicedetails
            this.ccbspercentage = 100
            if(this.ecftypeid == 7){
              this.addCRNcredit()
              }
            return true
          }
        })

    } else {
      this.ecfservice.invoicedetailcreate(this.InvoiceDetailForm?.value?.invoicedtl)
        .subscribe(result => {
          if (result['invoicedetails'] == undefined) {
            this.notification.showError(result?.description)
            this.SpinnerService.hide()
            return false
          }else {
            let res = result?.invoicedetails
            this.notification.showSuccess("Successfully Invoice Detail Saved")
            this.SpinnerService.hide()
            this.invdtlsave = true
            this.readinvdata = true
            this.showdebitpopup = true
            this.showadddebit = true
            this.showadddebits = false
            this.AdddebitDetails = false
            this.invoicedetailsdata = result?.invoicedetails
            this.ccbspercentage = 100
            if(this.ecftypeid == 7){
            this.addCRNcredit()
            }
            return true
          }
        },error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        )
    }
  }

  // addCRNcredit(){
  //   let count:any
  //   console.log("this.InvoiceDetailForm.value.invoicedtl",this.InvoiceDetailForm.value.invoicedtl)
  //   if(this.type == "SGST & CGST"){
  //   count = this.InvoiceDetailForm.value.invoicedtl.length*3
  //   }else{
  //     count = this.InvoiceDetailForm.value.invoicedtl.length*2
  //   }
  //   for(let i = 0 ;i < count-1;i++){
  //     this.addcreditSection()
  //     console.log(i)
  //   }

  //   for(let i = 0 ;i< this.InvoiceDetailForm.value.invoicedtl.length;i++){
  //     for(let j=0;j< count;j++){
  //       if(j == 0){
  //       this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amount').setValue(this.InvoiceDetailForm.value.invoicedtl[i].amount)
  //       }else if(j == 1){
  //         this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amount').setValue(this.InvoiceDetailForm.value.invoicedtl[i].cgst)
  //       }else if(j == 2){
  //         this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amount').setValue(this.InvoiceDetailForm.value.invoicedtl[i].sgst)
  //       }else if(j == 3){
  //         this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amount').setValue(this.InvoiceDetailForm.value.invoicedtl[i+1].amount)
  //         }else if(j == 4){
  //           this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amount').setValue(this.InvoiceDetailForm.value.invoicedtl[i+1].cgst)
  //         }else if(j == 5){
  //           this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amount').setValue(this.InvoiceDetailForm.value.invoicedtl[i+1].sgst)
  //         }

  //     }
  //   }
  //   this.creditdatasums()
  //   console.log("count",count)
  // }

  
  addCRNcredit(){
    // ---CGST & SGST ---
   let array1=[0,3,6,9,12,15,18,21,24,27,30];
   let array2=[1,4,7,10,13,16,19,22,25,28,31];
   let array3=[2,5,8,11,14,17,20,23,26,29,32];
  //  -----
  // ----IGST ---
  let array4 = [0,2,4,6,8,10,12,14,16,18,20]
  let array5 = [1,3,5,7,9,11,13,15,17,19,21]

  //NON GST
  let array6 = [1,2,3,4,5,6,7,8,9,10,11]
    let count:any
    console.log("this.InvoiceDetailForm.value.invoicedtl",this.InvoiceDetailForm.value.invoicedtl)
    if(this.type == "SGST & CGST"  && this.getgstapplicable == "Y"){
    count = this.InvoiceDetailForm.value.invoicedtl.length*3
    }else if(this.type == "IGST"  && this.getgstapplicable == "Y"){
      count = this.InvoiceDetailForm.value.invoicedtl.length*2
    }else if(this.getgstapplicable == "N"){
      count = this.InvoiceDetailForm.value.invoicedtl.length
    }
    console.log("count",count)
    for(let i = 0 ;i < count-1;i++){
      this.addcreditSection()
      console.log(i)
    }
    if(this.type ==  "SGST & CGST" && this.getgstapplicable == "Y"){
    for(let i = 0 ;i< this.InvoiceDetailForm.value.invoicedtl.length;i++){
      for(let j=i * 3;j< count;j++){
        if(array1.includes(j) ){
        this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amount').setValue(this.InvoiceDetailForm.value.invoicedtl[i].amount)
        }else if(array2.includes(j)){
          this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amount').setValue(this.InvoiceDetailForm.value.invoicedtl[i].cgst)
        }else if(array3.includes(j)){
          this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amount').setValue(this.InvoiceDetailForm.value.invoicedtl[i].sgst)
        }
      }
    }
  }else if(this.type ==  "IGST" && this.getgstapplicable == "Y"){
    for(let i = 0 ;i< this.InvoiceDetailForm.value.invoicedtl.length;i++){
      for(let j=i * 2;j< count;j++){
        if(array4.includes(j) ){
        this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amount').setValue(this.InvoiceDetailForm.value.invoicedtl[i].amount)
        }else if(array5.includes(j)){
          this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amount').setValue(this.InvoiceDetailForm.value.invoicedtl[i].igst)
        }
      }
    }
  }else if(this.getgstapplicable == "N"){
    for(let i = 0 ;i< this.InvoiceDetailForm.value.invoicedtl.length;i++){
      for(let j=i * 1;j< count;j++){
        if(array6.includes(j) ){
        this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amount').setValue(this.InvoiceDetailForm.value.invoicedtl[i].amount)
        }
  }
    }
  }
    this.creditdatasums()
    console.log("count",count)
  }

 deleteinvdetail(section, ind) {
   let id = section.value.id
   if (id != undefined) {
      this.delinvdtlid = id
    }else {
      if (this.invoicedetailsdata == undefined) {
        this.removeinvdtlSection(ind)
      } else {
      for (var i = 0; i < this.invoicedetailsdata?.length; i++) {
          if (i === ind) {
            this.delinvdtlid = this.invoicedetailsdata[i]?.id
          }
        }
      }

    }
    if (this.delinvdtlid != undefined) {
      var answer = window.confirm("Are you sure to delete?");
      if (answer) {
        //some code
      }
      else {
        return false;
      }
      this.ecfservice.invdtldelete(this.delinvdtlid)
        .subscribe(result => {
          if (result?.status == "success") {
            this.notification.showSuccess("Deleted Successfully")
            this.removeinvdtlSection(ind)
            if (this.InvoiceDetailForm?.value?.invoicedtl?.length === 0) {
              this.addinvdtlSection()
            }
          } else {
            this.notification.showError(result?.description)
          }

        })
    } else {
      this.removeinvdtlSection(ind)
      if (this.InvoiceDetailForm?.value?.invoicedtl?.length === 0) {
        this.addinvdtlSection()
      }
    }
  }
  invdtladdonid: any
  invdtltaxableamount: any
  invdtltotamount: any
  invdtloverallamount: any
  invdtltaxamount: any
  cgstval: any
  sgstval: any
  igstval: any
  gettaxrate: any

  adddebits(section, data, index) {
    let invdtldatas = this.getinvoiceheaderresults['invoicedtl']

    if (invdtldatas[index].productname != section.value.productname) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].description != section.value.description) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].hsn.code != section.value.hsn.code) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].hsn_percentage != section.value.hsn_percentage) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].uom.name != section.value.uom.name) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].unitprice != section.value.unitprice) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].quantity != section.value.quantity) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].amount != section.value.amount) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].cgst != section.value.cgst) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].sgst != section.value.sgst) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].igst != section.value.igst) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].taxamount != section.value.taxamount) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].totalamount != section.value.totalamount) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else {
      this.adddebit(section, data, index)

    }
  }
  getdebitresrecords: any
  getdebittdatas: any
  creditslno: any
  creditslnos: any
  showdefaultslno: boolean
  showaltslno: boolean
  Roundoffsamount: any
  OtherAdjustmentamts: any

  adddebit(section, data, index) {
    this.SpinnerService.show()
    let datas = this.DebitDetailForm.get('debitdtl') as FormArray
    datas.clear()
    if (this.invoicedetailsdata != undefined) {
      let datas = this.invoicedetailsdata[index]
      this.invdtltaxableamount = this.invoicedetailsdata[index]?.amount
      this.invdtltotamount = this.invoicedetailsdata[index]?.totalamount
      this.invdtloverallamount = this.invoicedetailsdata[index]?.dtltotalamt
      this.invdtltaxamount = this.invoicedetailsdata[index]?.taxamount
      this.cgstval = this.invoicedetailsdata[index]?.cgst
      this.sgstval = this.invoicedetailsdata[index]?.sgst
      this.igstval = this.invoicedetailsdata[index]?.igst
      this.gettaxrate = this.cgstval + this.sgstval + this.igstval
      this.invdtladdonid = datas?.id
     } else {
      let sections = section?.value
      this.invdtltaxableamount = sections?.amount
      this.invdtltotamount = sections?.totalamount
      this.invdtloverallamount = sections?.dtltotalamt
      this.invdtltaxamount = sections?.taxamount
      this.cgstval = sections?.cgst
      this.sgstval = sections?.sgst
      this.igstval = sections?.igst
      this.gettaxrate = this.cgstval + this.sgstval + this.igstval
      this.invdtladdonid = sections?.id
}
if (this.invdtladdonid == undefined) {
      this.toastr.warning('', 'Please Create Invoice Detail First ', { timeOut: 1500 });
      this.showdebitpopup = false
      this.SpinnerService.hide()
      return false;
      } else {
        this.ecfservice.getinvdetailsrecords(this.invdtladdonid)
        .subscribe(result => {
          if (result.id != undefined) {
            this.getdebitresrecords = result
            this.getdebittdatas = this.getdebitresrecords['debit']
            let a = this.getdebitresrecords['debit']
            if (a.length === 0) {
              let invcatdata = { "code": "DUMMY","id": 81, "name": "DUMMY"}
              let invsubcatdata = {"code": "DUMMY","id": 291,"name": "DUMMY","glno": 888888}
              let invcrncatdata = { "code": "Sundry Debtors","id": 112, "name": "Sundry Debtors"}
              let invcrnsubcatdata = {"code": "Sundry Debtors","id": 353,"name": "Sundry Debtors","glno": 232603}
              let catdata = {"code": "GST","id": 73,"name": "GST"}
              let igstdata = {"code": "I-Payable","id": 244,"glno": 151512,"name": "IGST-Payable"}
              let cgstdata = {"code": "C-Payable","id": 243,"glno": 151513,"name": "CGST-Payable"}
              let sgstdata = {"code": "S-Payable","id": 242,"glno": 151514,"name": "SGST-Payable"}
              let ccdata = {"code": "000","id": 224,"name": "GST"}
              let bsdata = {"code": "00","name": "GST","id": 78}
              for (let i = 0; i <= 2; i++) {
                
                if (i === 0 && this.getgstapplicable == "Y" && this.ecftypeid == 2) {
                  this.adddebitSection()
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(invcatdata)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(invsubcatdata)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(invsubcatdata.glno)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.invdtltaxableamount)
                  this.debitdatasums()
                }
                if (i === 0 && this.getgstapplicable == "Y" && this.ecftypeid == 7) {
                  this.adddebitSection()
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(invcrncatdata)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(invcrnsubcatdata)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(invcrnsubcatdata.glno)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.invdtltotamount)
                  this.debitdatasums()
                }
                if (i == 1 && this.type === "IGST" && this.getgstapplicable == "Y" && this.ecftypeid == 2) {
                  this.adddebitSection()
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(catdata)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(igstdata)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(igstdata.glno)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('bs').setValue(bsdata)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('cc').setValue(ccdata)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.igstval)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(100)
                  this.showsplit = true
                  this.showdelete = true
                }
                if (i == 1 && this.type === "SGST & CGST" && this.getgstapplicable == "Y" && this.ecftypeid == 2) {
                  this.adddebitSection()
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(catdata)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(cgstdata)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(cgstdata.glno)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('bs').setValue(bsdata)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('cc').setValue(ccdata)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.cgstval)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(100)
                  this.showsplit = true
                  this.showdelete = true
                }
               if (i == 2 && this.type === "SGST & CGST" && this.getgstapplicable == "Y" && this.ecftypeid == 2) {
                  this.adddebitSection()
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(catdata)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(sgstdata)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(sgstdata.glno)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('bs').setValue(bsdata)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('cc').setValue(ccdata)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.sgstval)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(100)
                  this.showsplit = true
                  this.showdelete = true
              }
                if (this.igstval == 0 && this.cgstval == 0 && this.sgstval == 0 && i == 0 && this.getgstapplicable == "N" && this.ecftypeid != 7) {
                  this.adddebitSection()
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(invcatdata)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(invsubcatdata)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(invsubcatdata.glno)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.invdtltaxableamount)
                  this.debitdatasums()
                }
                if (this.igstval == 0 && this.cgstval == 0 && this.sgstval == 0 && i == 0 && this.getgstapplicable == "N" && this.ecftypeid == 7) {
                  this.adddebitSection()
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(invcrncatdata)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(invcrnsubcatdata)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(invcrnsubcatdata.glno)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.invdtltotamount)
                  this.debitdatasums()
                }
              }
              this.submitdebitdtlbtn = false
              this.readdata = false
           }
          if (result) {
              this.getdebitrecords(result)
            }
            this.SpinnerService.hide()
          } else {
            this.notification.showError(result?.description)
            this.SpinnerService.hide();
            return false
          }
        },error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          })
        }
     }

  getdebitrecords(datas) {

    if (this.ecftypeid == 4) {
     let invcatdata = {"code": "DUMMY","id": 81,"name": "DUMMY"}
     let invsubcatdata = {"code": "DUMMY","id": 291,"name": "DUMMY","glno": 888888}
      if (datas?.debit?.length == 0) {
        const control = <FormArray>this.DebitDetailForm.get('debitdtl');
        control.push(this.debitdetail());
      for (let i = 0; i < 1; i++) {
        
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(invcatdata)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(invsubcatdata)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(invsubcatdata?.glno)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.totalamount)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(100)
         
        }
      }
    }

    for (let debit of datas?.debit) {
      let id: FormControl = new FormControl('');
      let invoiceheader_id: FormControl = new FormControl('');
      let invoicedetail_id: FormControl = new FormControl('');
      let category_code: FormControl = new FormControl('');
      let subcategory_code: FormControl = new FormControl('');
      let bsproduct: FormControl = new FormControl('');
      let debitglno: FormControl = new FormControl('');
      let amount: FormControl = new FormControl('');
      let debittotal: FormControl = new FormControl('');
      let deductionamount: FormControl = new FormControl(0);
      let cc: FormControl = new FormControl('');
      let bs: FormControl = new FormControl('');
      let ccbspercentage: FormControl = new FormControl('');
      let remarks: FormControl = new FormControl('');
      const debitFormArray = this.DebitDetailForm.get("debitdtl") as FormArray;


      id.setValue(debit?.id)
      invoiceheader_id.setValue(debit?.invoiceheader)
      invoicedetail_id.setValue(debit?.invoicedetail)
      category_code.setValue(debit?.category_code)
      subcategory_code.setValue(debit?.subcategory_code)
      debitglno.setValue(debit?.debitglno)
      if (this.ecftypeid != 4) {
        if (debit?.category_code?.code != "GST") {
          amount.setValue(debit?.amount)
        }
        else {
         if (debit?.subcategory_code?.code == "I-Payable") {
            amount.setValue(this.igstval)
          }
          if (debit?.subcategory_code?.code == "C-Payable") {
            amount.setValue(this.cgstval)
          }
          if (debit?.subcategory_code?.code == "S-Payable") {
            amount.setValue(this.sgstval)
          }
         
        }
      }
      else {
        amount.setValue(debit?.amount)
      }
      debittotal.setValue(0)
      deductionamount.setValue(debit?.deductionamount)
      cc.setValue(debit?.ccbs?.cc_code)
      bs.setValue(debit?.ccbs?.bs_code)
      ccbspercentage.setValue(debit?.ccbs?.ccbspercentage)
      remarks.setValue(debit?.ccbs?.remarks)
      bsproduct.setValue(debit?.bsproduct)


      debitFormArray.push(new FormGroup({
        id: id,
        invoiceheader_id: invoiceheader_id,
        invoicedetail_id: invoicedetail_id,
        category_code: category_code,
        subcategory_code: subcategory_code,
        bsproduct: bsproduct,
        debitglno: debitglno,
        amount: amount,
        debittotal: debittotal,
        deductionamount: deductionamount,
        cc: cc,
        bs: bs,
        ccbspercentage: ccbspercentage,
        remarks: remarks,
        ccbsdtl: this.fb.group({
          cc_code: debit.ccbs.cc_code,
          bs_code: debit.ccbs.bs_code,
          code: debit.ccbs.code,
          ccbspercentage: debit.ccbs.ccbspercentage,
          remarks: debit.ccbs.remarks,
          glno: debit.ccbs.glno,
          id: debit.ccbs.id,
          amount: debit.ccbs.amount,
          debit: debit.ccbs.debit,

        })
     }))


      category_code.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservice.getcategoryscroll(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.categoryNameData = datas;
          this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
        })

      subcategory_code.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservice.getsubcategoryscroll(this.catid, value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.subcategoryNameData = datas;

        })

      let businesskeyvalue: String = "";
      this.getbusinessproduct(businesskeyvalue);
      bsproduct.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservice.getbusinessproductscroll(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.businesslist = datas;
          this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
        })

      let bskeyvalue: String = "";
      this.getbs(bskeyvalue);
      bs.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservice.getbsscroll(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.bsNameData = datas;
          this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
        })

      cc.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservice.getccscroll(this.bssid, value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.ccNameData = datas;
          this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
        })
       this.calctotaldebitdata(amount)

      ccbspercentage.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calcTotaldebit(this.debitaddindex)
        if (!this.DebitDetailForm.valid) {
          return;
        }
        this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
      }
      )

      amount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calcdebiteditamount(amount)
        if (!this.DebitDetailForm.valid) {
          return;
        }
        this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
      }
      )
   

   deductionamount.valueChanges.pipe(
    debounceTime(20)
  ).subscribe(value => {
    this.calcotheramount(this.debitaddindex)
    if (!this.DebitDetailForm.valid) {
      return;
    }
    this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
  }
  )
}

}

calctotaldebitdata(amount: FormControl) {
    this.debitdatasums()
  }
 // -------credit sections------
  creditaddonindex: any
  getcreditindex: any
  amountchangedata: any

  addoncreditindex(indexx, data) {
    this.creditaddonindex = indexx
    this.getcreditindex = indexx
    this.amountchangedata = data
    
  }

  getPaymode() {

    this.ecfservice.getPaymode()
      .subscribe((results: any[]) => {
        if (results) {
          let paymodedata = results["data"];
          this.PaymodeNonPoList = paymodedata.filter(payid => payid.id != 1 && payid.id != 4  && payid.id != 9 && payid.id != 10 && payid.id != 7);
          this.PaymodeNonPoLists = paymodedata.filter(payid => payid.id != 1 && payid.id != 4  && payid.id != 9 && payid.id != 10 && payid.id != 7 && payid.id != 6  && payid.id != 8);
          this.PaymodeNonPocrnList = paymodedata.filter(payid => payid.id != 1 && payid.id != 4  && payid.id != 9 && payid.id != 10 && payid.id != 7 && payid.id != 6);
          this.PaymodeNonPoliqList =  paymodedata.filter(payid => payid.id != 1 && payid.id != 4  && payid.id != 9 && payid.id != 10 && payid.id != 7 && payid.id != 8);
          this.PaymodeAdvVenList = paymodedata.filter(payid => payid.id != 1 && payid.id != 4 && payid.id != 8 && payid.id != 9 && payid.id != 10 && payid.id != 7 && payid.id != 6);
          this.PaymodeAdvERAList = paymodedata.filter(payid => payid.id == 4);
          this.PaymodeAdvBRAList = paymodedata.filter(payid => payid.id == 1);
          this.PaymodeERAList = paymodedata.filter(payid => payid.id != 1 && payid.id != 2 && payid.id != 3 && payid.id != 5 && payid.id != 8 && payid.id != 9 && payid.id != 10 && payid.id != 7)
          this.PaymodeERALists = paymodedata.filter(payid => payid.id != 1 && payid.id != 2 && payid.id != 3 && payid.id != 5 && payid.id != 8 && payid.id != 9 && payid.id != 10 && payid.id != 7 && payid.id != 6)
          // this.PaymodeCRNList =  paymodedata.filter(payid => payid.id != 1 && payid.id != 4 && payid.id != 2 && payid.id != 3 && payid.id != 5 && payid.id != 8 && payid.id != 9 && payid.id != 10 && payid.id != 7 && payid.id != 6)
        }
     },error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
  }


  getCreditSections(form) {
    return form.controls.creditdtl.controls;
  }

  addcreditSection() {

    const control = <FormArray>this.InvoiceDetailForm.get('creditdtl');
    control.push(this.creditdetails());
    let dta = this.InvoiceDetailForm?.value?.creditdtl
   }
  removecreditSection(i) {
    const control = <FormArray>this.InvoiceDetailForm.get('creditdtl');
    control.removeAt(i);
    this.creditdatasums()
  }
  credit: any
  paymodeid: any
  taxableamount: any
  getcredit = true 
  
CreditDessss(data, pay, index) {
    this.credit = data
    this.getcreditindex = index
    this.paymodeid = pay?.id
    // if (this.paymodeid === 5 || this.paymodeid === 8) {
      if (this.paymodeid === 5) {
        if (pay?.paymode_details['data'] != undefined) {
          if (pay?.paymode_details['data']?.length > 0) {
            let glnumber = pay?.paymode_details['data'][0]?.glno
            let catcode = pay?.paymode_details['data'][0]?.category_id?.code
            let subcatcode = pay?.paymode_details['data'][0]?.sub_category_id.code
            if (glnumber != "" || glnumber != undefined || glnumber != null) {
              this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditglno').setValue(glnumber)
            }
            this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('category_code').setValue(catcode)
            this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('subcategory_code').setValue(subcatcode)
          }
        }
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amount').setValue(this.totalamount)
        this.creditdatasums()
      
      this.showaccno[index] = true
      this.showtaxtype[index] = false
      this.showtaxrate[index] = false
      this.showtaxtypes[index] = false
      this.showtaxrates[index] = false
      this.showtranspay[index] = false
      this.showppxmodal = false
      this.showcrnmodal = false
      this.getaccno(this.paymodeid)
    }
    if (this.paymodeid === 4 || this.paymodeid === 1) {
      if (this.paymodeid === 4) {
        if (pay?.paymode_details['data'] != undefined) {
          if (pay?.paymode_details['data']?.length > 0) {

            let glnumber = pay?.paymode_details['data'][0]?.glno
            let catcode = pay?.paymode_details['data'][0]?.category_id?.code
            let subcatcode = pay?.paymode_details['data'][0]?.sub_category_id.code
            if (glnumber != "" || glnumber != undefined || glnumber != null) {
              this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditglno').setValue(glnumber)
            }
            this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('category_code').setValue(catcode)
            this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('subcategory_code').setValue(subcatcode)
          }
        }
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amount').setValue(this.totalamount)
        this.creditdatasums()
      }
      this.showeraacc[index] = true
      this.showtaxtype[index] = false
      this.showtaxrate[index] = false
      this.showtaxtypes[index] = false
      this.showtaxrates[index] = false
      this.showtranspay[index] = false
      this.showppxmodal = false
      this.showcrnmodal = false
      this.getERA(index)
    }


    if (this.paymodeid === 3) {
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditrefno').reset()
      this.showtranspay[index] = true
      this.showaccno[index] = false
      this.showtaxtype[index] = false
      this.showtaxrate[index] = false
      this.showtaxtypes[index] = false
      this.showtaxrates[index] = false

    }

    if (this.paymodeid === 7) {
      this.showtaxtype[index] = true
      this.showtaxrate[index] = true
      this.showtaxtypes[index] = false
      this.showtaxrates[index] = false
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditglno').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditrefno').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('taxableamount').setValue(this.taxableamount)
      this.gettaxtype()
    }

    if (this.paymodeid === 6 ) {
      if(!this.getcredit)
      {
        this.showppxmodal = true
        this.showcrnmodal = false
        this.showtaxtype[index] = false
        this.showtaxrate[index] = false
        this.showtaxtypes[index] = false
        this.showtaxrates[index] = false
        this.showtranspay[index] = false
        this.getPpxrecords()
        this.creditdatasums()
      }      
    }

    if (this.paymodeid === 8 ) {
      if(!this.getcredit)
      {
        this.showcrnmodal = true
        this.showppxmodal = false
        this.showtaxtype[index] = false
        this.showtaxrate[index] = false
        this.showtaxtypes[index] = false
        this.showtaxrates[index] = false
        this.showtranspay[index] = false
        this.getCrnrecords()
        this.creditdatasums()
      }      
    }

    if (this.paymodeid === 2) {
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditrefno').reset()
      
      this.showglpopup = true
      this.creditglForm.patchValue({ name: pay.name })
      this.getcreditgl(this.paymodeid)
    } else {
      this.showglpopup = false
    }
    if(this.paymodeid == 11){
      let datas = this.InvoiceDetailForm.value.creditdtl
     
      if(datas[index].creditglno == 0){
        this.dataclears()
      }
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditrefno').reset()
      if(index == 0){
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amount').setValue(this.taxableamount)
      }
      this.showgrnpopup = true
      this.creditdatasums()
    }else{
      this.showgrnpopup = false
    }
  }

   dataclears(){
    this.crnglForm.controls['category_code'].reset("")
    this.crnglForm.controls['subcategory_code'].reset("")
    this.crnglForm.controls['debitglno'].reset("")
   }
 
  accountno: any
  getacc(accountno, index) {
    this.accountno = accountno
    this.getcreditpaymodesummary()
  }
  optionsummary = false
  firstsummary = true
  creditListed: any
  arraydata: any
  accno: any
  creditids: any
  accountnumber: any
  getcreditpaymodesummary(pageNumber = 1, pageSize = 10) {
    if (this.accountno === undefined) {
      this.accountnumber = this.accnumm
    } else {
      this.accountnumber = this.accountno
    }
    this.ecfservice.getcreditpaymodesummaryy(pageNumber, pageSize, this.paymodeid, this.suppid, this.accountnumber)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.creditListed = datas
         for (let i of this.creditListed) {
            let accno = i?.account_no
            let bank = i?.bank_id?.name
            let branch = i?.branch_id?.name
            let ifsc = i?.branch_id?.ifsccode
            let beneficiary = i?.beneficiary
            let creditids = i?.id
            this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditrefno').setValue(accno)
            this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('bank').setValue(bank)
            this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('branch').setValue(branch)
            this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('ifsccode').setValue(ifsc)
            this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('benificiary').setValue(beneficiary)
            this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditbank_id').setValue(creditids)
           }
          this.arraydata = datas.length

          if (this.arraydata === 0) {
            this.optionsummary = true;
            this.firstsummary = false;
          } else {
            this.optionsummary = false;
            this.firstsummary = true;
          }
        }

      },error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
  }

  choosetype(index) {
    this.showtaxtype[index] = true
    this.showtaxtypes[index] = false
    this.gettaxtype()
   }

  chooserate(index) {
    this.showtaxrate[index] = true
    this.showtaxrates[index] = false
  }

  getPpxSections(form) {
    return form.controls.ppxdtl.controls;
  }

  getCrnSections(form) {
    return form.controls.crndtl.controls;
  }
  

  ppxDisable = [false,false,false,false,false,false,false]
  getPpxrecords()
   {
    this.ppxLoad = true
    let ppxcontrol = this.ppxForm.controls["ppxdtl"] as FormArray;
    ppxcontrol.clear()
    console.log("this.ppxdata-->", this.ppxdata)
    let x=0
    let ecfid
          if (this.ecfheaderid != undefined) {
            ecfid = this.ecfheaderid
          } else {
            ecfid = this.ecfheaderidd
          }
          
    for (let ppx of this.ppxdata) {
      let apppxheader_id: FormControl = new FormControl('');      
      let name: FormControl = new FormControl('');      

      let advno: FormControl = new FormControl('');
      let branchName: FormControl = new FormControl('');      
      let branchCode: FormControl = new FormControl('');
      let apinvoiceheader_id: FormControl = new FormControl('');
      let credit_id: FormControl = new FormControl('');
      let ppxheader_date: FormControl = new FormControl('');
      let ppxheader_amount: FormControl = new FormControl('');
      let ecfheader_id: FormControl = new FormControl('');
      let ppxheader_balance: FormControl = new FormControl('');
      let ecf_amount: FormControl = new FormControl(0);
      let liquedate_limit: FormControl = new FormControl(0);      
      let ap_amount: FormControl = new FormControl('');
      let ppxdetails: FormControl = new FormControl('');
      let liquidate_amt: FormControl = new FormControl('');
      let process_amount: FormControl = new FormControl('');      
      let select: FormControl = new FormControl('');
      let creditglno:FormControl = new FormControl('');

      const ppxFormArray = this.ppxForm.get("ppxdtl") as FormArray;
  
      apppxheader_id.setValue(ppx.id)      
      name.setValue(ppx.payto_name.name)      
      advno.setValue(ppx.crno)
      ppxheader_date.setValue(ppx.ppxheader_date)
      branchName.setValue(ppx.emp_branch_details?.name)  
      branchCode.setValue(ppx.emp_branch_details?.code)
      apinvoiceheader_id.setValue(ppx.apinvoiceheader_id)
      credit_id.setValue(ppx.credit_id)
      ppxheader_amount.setValue(ppx.ppxheader_amount)
      ecfheader_id.setValue(ecfid)
      ppxheader_balance.setValue(ppx.ppxheader_balance)
      ecf_amount.setValue(ppx.ecf_amount)
      liquedate_limit.setValue(ppx.liquedate_limit)
      ap_amount.setValue(ppx.ap_amount)
      ppxdetails.setValue(ppx.ppxdetails)
      liquidate_amt.setValue(0)
      process_amount.setValue(ppx.process_amount)
      creditglno.setValue(ppx.credit_glno)
     
      select.setValue(false)
  
      if (ppx.ppxheader_balance>0)
      {
        this.ppxDisable[x] = false     
      }
      else
      {
        this.ppxDisable[x] = true     
      }
      
      const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
   
      for (let i in creditdtlsdatas)
      {         
        if(creditdtlsdatas[i].paymode_id == 6 && creditdtlsdatas[i].creditrefno == ppx.crno)
        {
          if(this.getcreditindex == i)
          {
            this.ppxDisable[x] = false         
          }
          else
          {
            this.ppxDisable[x] = true
          }
          liquidate_amt.setValue(creditdtlsdatas[i].amount)
          select.setValue(true)
        }

      }
      ppxFormArray.push(new FormGroup({
        apppxheader_id : apppxheader_id,
        name: name,
        advno: advno,
        branchName: branchName,
        branchCode: branchCode,
        apinvoiceheader_id : apinvoiceheader_id,
        credit_id : credit_id,
        ppxheader_date: ppxheader_date,
        ppxheader_amount: ppxheader_amount,
        ecfheader_id: ecfheader_id,
        ppxheader_balance: ppxheader_balance,
        ecf_amount: ecf_amount,
        liquedate_limit: liquedate_limit,
        ap_amount: ap_amount,
        ppxdetails: ppxdetails,
        liquidate_amt: liquidate_amt, 
        process_amount : process_amount,  
        select : select,
        creditglno:creditglno

      })) 
      x++  
    }
    this.getPPXsum()
    this.ppxLoad = false
  }

  selectedppxdata : any =[]
  liquidatevalue:any
  ppxCrno : any
  submitppx()
  {
    this.selectedppxdata=[]
    const ppxForm = this.ppxForm.value.ppxdtl

    let ppxselected =false
    let ind 
    if(this.ppxsum > this.totalamount)
    {
      this.notification.showError("Liquidate Amount should not exceed the Invoice amount.")
      return false
    }
    for (let i in ppxForm)
     {
       console.log("ppxForm[i].select--",ppxForm[i].select)
       if(ppxForm[i].select == true)
       {
        ppxselected = true
        if(this.selectedppxdata.length >0)
        {
          for (let j=0; j< this.selectedppxdata.length;j++)
          {
            if(this.selectedppxdata[j].advno == ppxForm[i].advno)
            {
              ind = j
              
              this.selectedppxdata[j].liquidate_amt=ppxForm[i].liquidate_amt
            }
            else
            {
              this.selectedppxdata.push(ppxForm[i])
            }
          }
        }
        else
        {
          this.selectedppxdata.push(ppxForm[i])
        }        
       }
     }
     if (ppxselected == true)
     {
       let n
       if (ind != undefined)
       {
        n=ind
       }
       else
       {
        n=this.selectedppxdata.length -1      
       }
       if (Number(this.selectedppxdata[n].liquidate_amt)<=0)
       {
        this.notification.showError("Please give a valid amount to liquidate.")
       }
       else
       {
        this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditrefno').setValue(this.selectedppxdata[n].advno)
        this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('amountchange').setValue(this.selectedppxdata[n].liquidate_amt)
        this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditglno').setValue(this.selectedppxdata[n].creditglno)
        let ppxcontrol = this.ppxForm.controls["ppxdtl"] as FormArray;
        ppxcontrol.clear()
        this.closeppxbutton.nativeElement.click();
        this.showppxmodal =false
       }     
     }
     else
     {
      this.notification.showError("Please select an Advance No. and give amount to Liquidate.")
     }  
     console.log("this.selectedppx==", this.selectedppxdata)   
  }

  ppxamt(e,ind)
  {
    if(this.ppxLoad == false)
    {
      let amt = this.ppxForm.value.ppxdtl[ind].liquidate_amt
      let balamt = this.ppxForm.value.ppxdtl[ind].ppxheader_balance
      let limitamt = this.ppxForm.value.ppxdtl[ind].liquedate_limit
      if (e > Number(balamt) || e > this.totalamount || e>Number(limitamt)) 
      {
        let n = amt.slice(0,amt.length-1)
        this.ppxForm.get('ppxdtl')['controls'][ind].get('liquidate_amt').setValue(n) 
        this.notification.showError("Liquidate amount should not exceed the Invoice amount, Liquidate Limit and Balance amount.")
      }   
    }    
  }
  
  closeppx(){
    this.showppxmodal =false
    this.closeppxbutton.nativeElement.click();
  }

  ppxsum : any
  ppxselect(e,ind)
  {
    const ppxForm = this.ppxForm.value.ppxdtl

    if(e.checked==true)
    {       
      let ppxselected =false
      for (let i in ppxForm)
       {
        if(i != ind && ppxForm[i].select == true && this.ppxDisable[i] == false)
        {
          ppxselected = true
        }
       }
       if (ppxselected == true)
       {
        this.notification.showError("Please select only one Advance.")
        this.ppxForm.get('ppxdtl')['controls'][ind].get('select').setValue(false)
        return false         
       }
    }

    this.getPPXsum();
  }

  getPPXsum()
  {
    if(this.ppxLoad == false)
    {
      this.ppxsum = 0
      const ppxForm = this.ppxForm.value.ppxdtl
  
      for (let i in ppxForm)
       {
         if(ppxForm[i].select == true)
         {
          this.ppxsum +=+ppxForm[i].liquidate_amt
         }
       }
    }    
  }



  crnDisable = [false,false,false,false,false,false,false]
  getCrnrecords()
   {
    this.crnLoad = true
    let crncontrol = this.crnForm.controls["crndtl"] as FormArray;
    crncontrol.clear()
    console.log("this.crndata-->", this.crndata)
    let x=0
    let ecfid
          if (this.ecfheaderid != undefined) {
            ecfid = this.ecfheaderid
          } else {
            ecfid = this.ecfheaderidd
          }
          
    for (let crn of this.crndata) {
      let apppxheader_id: FormControl = new FormControl('');      
      let name: FormControl = new FormControl('');      

      let advno: FormControl = new FormControl('');
      let branchName: FormControl = new FormControl('');      
      let branchCode: FormControl = new FormControl('');
      let apinvoiceheader_id: FormControl = new FormControl('');
      let credit_id: FormControl = new FormControl('');
      let ppxheader_date: FormControl = new FormControl('');
      let ppxheader_amount: FormControl = new FormControl('');
      let ecfheader_id: FormControl = new FormControl('');
      let ppxheader_balance: FormControl = new FormControl('');
      let ecf_amount: FormControl = new FormControl(0);
      let liquedate_limit: FormControl = new FormControl(0);      
      let ap_amount: FormControl = new FormControl('');
      let ppxdetails: FormControl = new FormControl('');
      let liquidate_amt: FormControl = new FormControl('');
      let process_amount: FormControl = new FormControl('');      
      let select: FormControl = new FormControl('');
      let creditglno:FormControl = new FormControl('');

      const crnFormArray = this.crnForm.get("crndtl") as FormArray;
  
      apppxheader_id.setValue(crn.id)      
      name.setValue(crn.payto_name.name)      
      advno.setValue(crn.crno)
      ppxheader_date.setValue(crn.ppxheader_date)
      branchName.setValue(crn.emp_branch_details?.name)  
      branchCode.setValue(crn.emp_branch_details?.code)
      apinvoiceheader_id.setValue(crn.apinvoiceheader_id)
      credit_id.setValue(crn.credit_id)
      ppxheader_amount.setValue(crn.ppxheader_amount)
      ecfheader_id.setValue(ecfid)
      ppxheader_balance.setValue(crn.ppxheader_balance)
      ecf_amount.setValue(crn.ecf_amount)
      liquedate_limit.setValue(crn.liquedate_limit)
      ap_amount.setValue(crn.ap_amount)
      ppxdetails.setValue(crn.ppxdetails)
      liquidate_amt.setValue(0)
      process_amount.setValue(crn.process_amount)
      creditglno.setValue(crn.credit_glno)
     
      select.setValue(false)
  
      if (crn.ppxheader_balance>0)
      {
        this.crnDisable[x] = false     
      }
      else
      {
        this.crnDisable[x] = true     
      }
      
      const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
   
      for (let i in creditdtlsdatas)
      {         
        if(creditdtlsdatas[i].paymode_id == 6 && creditdtlsdatas[i].creditrefno == crn.crno)
        {
          if(this.getcreditindex == i)
          {
            this.crnDisable[x] = false         
          }
          else
          {
            this.crnDisable[x] = true
          }
          liquidate_amt.setValue(creditdtlsdatas[i].amount)
          select.setValue(true)
        }

      }
      crnFormArray.push(new FormGroup({
        apppxheader_id : apppxheader_id,
        name: name,
        advno: advno,
        branchName: branchName,
        branchCode: branchCode,
        apinvoiceheader_id : apinvoiceheader_id,
        credit_id : credit_id,
        ppxheader_date: ppxheader_date,
        ppxheader_amount: ppxheader_amount,
        ecfheader_id: ecfheader_id,
        ppxheader_balance: ppxheader_balance,
        ecf_amount: ecf_amount,
        liquedate_limit: liquedate_limit,
        ap_amount: ap_amount,
        ppxdetails: ppxdetails,
        liquidate_amt: liquidate_amt, 
        process_amount : process_amount,  
        select : select,
        creditglno:creditglno

      })) 
      x++  
    }
    this.getCRNsum()
    this.crnLoad = false
  }

  selectedcrndata : any =[]
  crnliquidatevalue:any
  crnCrno : any
  submitcrn()
  {
    this.selectedcrndata=[]
    const crnForm = this.crnForm.value.crndtl

    let crnselected =false
    let ind 
    if(this.crnsum > this.totalamount)
    {
      this.notification.showError("Liquidate Amount should not exceed the Invoice amount.")
      return false
    }
    for (let i in crnForm)
     {
       console.log("ppxForm[i].select--",crnForm[i].select)
       if(crnForm[i].select == true)
       {
        crnselected = true
        if(this.selectedcrndata.length >0)
        {
          for (let j=0; j< this.selectedcrndata.length;j++)
          {
            if(this.selectedcrndata[j].advno == crnForm[i].advno)
            {
              ind = j
              
              this.selectedcrndata[j].liquidate_amt=crnForm[i].liquidate_amt
            }
            else
            {
              this.selectedcrndata.push(crnForm[i])
            }
          }
        }
        else
        {
          this.selectedcrndata.push(crnForm[i])
        }        
       }
     }
     if (crnselected == true)
     {
       let n
       if (ind != undefined)
       {
        n=ind
       }
       else
       {
        n=this.selectedcrndata.length -1      
       }
       if (Number(this.selectedcrndata[n].liquidate_amt)<=0)
       {
        this.notification.showError("Please give a valid amount to liquidate.")
       }
       else
       {
        this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditrefno').setValue(this.selectedcrndata[n].advno)
        this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('amountchange').setValue(this.selectedcrndata[n].liquidate_amt)
        this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditglno').setValue(this.selectedcrndata[n].creditglno)
        let crncontrol = this.crnForm.controls["crndtl"] as FormArray;
        crncontrol.clear()
        this.closecrnbutton.nativeElement.click();
        this.showcrnmodal =false
       }     
     }
     else
     {
      this.notification.showError("Please select an CRN No. and give amount to Liquidate.")
     }  
     console.log("this.selectedcrn==", this.selectedcrndata)   
  }

  crnamt(e,ind)
  {
    if(this.crnLoad == false)
    {
      let amt = this.crnForm.value.crndtl[ind].liquidate_amt
      let balamt = this.crnForm.value.crndtl[ind].ppxheader_balance
      let limitamt = this.crnForm.value.crldtl[ind].liquedate_limit
      if (e > Number(balamt) || e > this.totalamount || e>Number(limitamt)) 
      {
        let n = amt.slice(0,amt.length-1)
        this.crnForm.get('crndtl')['controls'][ind].get('liquidate_amt').setValue(n) 
        this.notification.showError("Liquidate amount should not exceed the Invoice amount, Liquidate Limit and Balance amount.")
      }   
    }    
  }
  
  closecrn(){
    this.showcrnmodal =false
    this.closecrnbutton.nativeElement.click();
  }

  crnsum : any
  crnselect(e,ind)
  {
    const crnForm = this.crnForm.value.crndtl

    if(e.checked==true)
    {       
      let crnselected =false
      for (let i in crnForm)
       {
        if(i != ind && crnForm[i].select == true && this.crnDisable[i] == false)
        {
          crnselected = true
        }
       }
       if (crnselected == true)
       {
        this.notification.showError("Please select only one CRN.")
        this.crnForm.get('crldtl')['controls'][ind].get('select').setValue(false)
        return false         
       }
    }

    this.getCRNsum();
  }

  getCRNsum()
  {
    if(this.crnLoad == false)
    {
      this.crnsum = 0
      const crnForm = this.crnForm.value.crndtl
  
      for (let i in crnForm)
       {
         if(crnForm[i].select == true)
         {
          this.crnsum +=+crnForm[i].liquidate_amt
         }
       }
    }    
  }


taxrateid: any
taxratename: any
vendorid: any
maintaintaxlist: any
othertaxlist: any
ERAList: any

getERA(ind) {
    
    if (this.paymodeid == 4) {
      this.ecfservice.geterapaymode(this.paymodeid, this.raisedbyid)
        .subscribe(result => {
          if (result) {
            if (result['data']?.length == 0) {
              this.notification.showWarning("Employee Account Detail is Empty")
              return false
            } else {
              this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('creditrefno').setValue(result?.account_number)
              this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('bank').setValue(result?.bank_name)
              this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('branch').setValue(result?.bankbranch?.name)
              this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('ifsccode').setValue(result?.bankbranch?.ifsccode)
              this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('benificiary').setValue(result?.beneficiary_name)
            }
          }
        },error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        )
    }

    if (this.paymodeid == 1) {

      this.ecfservice.getbrapaymode(this.paymodeid)
        .subscribe(result => {
          if (result == "None") {
            this.notification.showInfo("The selected branch does not have any account no")
          }
          this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('creditrefno').setValue(result)
        })

    }
  }
  gettaxtype() {
    this.ecfservice.gettdstaxtype(this.suppid)
      .subscribe(result => {
        if (result) {
          this.vendorid = result.vendor_id
          // console.log("venid", this.vendorid)
          this.taxlist = result['subtax_list']
          this.maintaintaxlist = this.taxlist.filter(dept => dept.dflag === "M");
          this.othertaxlist = this.taxlist.filter(dept => dept.dflag === "O");
        }

      },error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
  }

  gettaxid(data) {
    this.taxrateid = data?.id
    this.taxratename = data?.subtax_type
    this.gettdstaxrates()
  }
  maintaintaxratelist: any
  othertaxratelist: any
  gettdstaxrates() {
    this.ecfservice.gettdstaxrate(this.vendorid, this.taxrateid)
      .subscribe(result => {
        if (result) {
          this.taxratelist = result['data']
          this.maintaintaxratelist = this.taxratelist.filter(dept => dept.dflag === "M");
          this.othertaxratelist = this.taxratelist.filter(dept => dept.dflag === "O");
        }
      },error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
    }
  taxindex: any
  taxrate: any
  gettaxcalc(data, index) {
    this.taxindex = index

    let creditdata = this.InvoiceDetailForm.value.creditdtl
    let taxrate = creditdata[index].suppliertaxrate
    this.taxrate = taxrate
    let taxableamt = creditdata[index].taxableamount
    if (taxrate === undefined || taxrate === "" || taxrate === null || taxableamt === undefined || taxableamt === "" || taxableamt === null) {
      return false
    }
    if (taxrate != undefined || taxrate != "" || taxrate != null || taxableamt != undefined || taxableamt != "" || taxableamt != null) {
     this.ecfservice.gettdstaxcalculation(taxableamt, taxrate)
        .subscribe(results => {
         let amount = results.tdsrate
         this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amountchange').setValue(amount)
        })
    }

  }
  suppid: any
  creditList: any
  paymodename: any
  creditListeds: any
  getcreditsummary(pageNumber = 1, pageSize = 10) {
     this.ecfservice.getcreditsummary(pageNumber, pageSize, this.suppid)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          let datapagination = results["pagination"];
          this.creditListeds = datas;
          for (var i = 0; i < datas?.length; i++) {
            this.paymodename = datas[i]?.paymode_id?.name

          }
        }
      },error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
    }

  accdata: any
  accnumm: any
  getaccno(payid) {
    this.ecfservice.getbankaccno(payid, this.suppid)
      .subscribe(res => {
        if (res) {
          let accList = res['data']
          if (accList?.length == 0) {
            this.notification.showWarning("Supplier Account Detail is Empty")
            return false
          } else {
          this.accList = accList.filter(x => x.is_active != false)
            if (this.selectedaccno != undefined) {
              for (let i = 0; i < this.accList?.length; i++) {
                if (this.accList[i]?.is_active == true && this.accList[i]?.status == 1) {
                 if (this.accList[i].account_no == this.selectedaccno) {
                    this.accdata = this.accList[i]?.id
                    this.accnumm = this.accList[i]?.account_no
                    this.getcreditpaymodesummary()
                  }
                }
              }
            }
            else {
              for (let i = 0; i < 1; i++) {
                if (this.accList[i]?.is_active == true && this.accList[i]?.status == 1) {
                  this.accdata = this.accList[i]?.id
                  this.accnumm = this.accList[i]?.account_no
                  this.getcreditpaymodesummary()

                }
              }
            }
          }
        }
     },error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
}

  getcreditgl(payid) {
    this.ecfservice.creditglno(payid)
      .subscribe(res => {
        if (res) {
          this.glList = res['data']
        }
      },error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
    }
  creditgllno: any
  getgl(glno) {
    this.creditgllno = glno
    this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditglno').setValue(this.creditgllno)
   }

   crnsubmitForm(){
     let data = this.crnglForm.value
     this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditglno').setValue(data.debitglno)
     this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('category_code').setValue(data?.category_code?.code)
     this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('subcategory_code').setValue(data?.subcategory_code?.code)
     this.closebuttons.nativeElement.click();
   }

  glsubmitForm() {
    this.closebuttons.nativeElement.click();
  }

  creditdetails() {
    let group = new FormGroup({
      invoiceheader_id: new FormControl(this.invoiceheaderid),
      paymode_id: new FormControl(''),
      creditbank_id: new FormControl(''),
      suppliertax_id: new FormControl(''),
      creditglno: new FormControl(0),
      creditrefno: new FormControl(''),
      suppliertaxtype: new FormControl(''),
      suppliertaxrate: new FormControl(''),
      taxexcempted: new FormControl('N'),
      amount: new FormControl(0),
      amountchange: new FormControl(''),
      taxableamount: new FormControl(0),
      ddtranbranch: new FormControl(0),
      ddpaybranch: new FormControl(0),
      category_code: new FormControl(''),
      subcategory_code: new FormControl(''),
      branch: new FormControl(''),
      benificiary: new FormControl(''),
      bank: new FormControl(''),
      ifsccode: new FormControl(''),
      accno: new FormControl(''),
      credittotal: new FormControl(''),
   })

    group.get('suppliertaxtype').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.gettdstaxtype(this.suppid,)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.taxlist = datas;
        this.linesChange.emit(this.InvoiceDetailForm.value['creditdtl']);
      })


    group.get('amountchange').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.amountReduction()
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['creditdtl']);
    }
    )

    return group
  }

  public displayFnFilter(filterdata?: taxtypefilterValue): string | undefined {
    return filterdata ? filterdata.subtax_type : undefined;
  }
  get filterdata() {
    return this.InvoiceDetailForm.get('suppliertaxtype');
  }
  calcreditamount: any
  amountReduction() {
    let dataForm = this.InvoiceDetailForm.value.creditdtl
    if(this.ecftypeid != 7){
    for (let data in dataForm) {
     if (data == "0") {
        if (this.getcreditindex == 1) {
         this.InvoiceDetailForm.get('creditdtl')['controls'][data].get('amount').setValue(this.totalamount - dataForm[this.getcreditindex]?.amountchange)
        } else {
          this.InvoiceDetailForm.get('creditdtl')['controls'][data].get('amount').setValue(dataForm[data]?.amount - dataForm[this.getcreditindex]?.amountchange)
        }
      }
      if (data == this.getcreditindex) {
        this.InvoiceDetailForm.get('creditdtl')['controls'][data].get('amount').setValue(dataForm[this.getcreditindex]?.amountchange)

      }
    }
  }else{
    for (let data in dataForm) {
      if (data == this.getcreditindex) {
        this.InvoiceDetailForm.get('creditdtl')['controls'][data].get('amount').setValue(dataForm[this.getcreditindex]?.amountchange)

      }
    
  }
}
    this.creditdatasums()
  }

  cdtamt: any
  cdtsum: any
  ppxarray: any[] = []
  crnarray:any [] = []
  creditdatasums() {
    this.cdtamt = this.InvoiceDetailForm.value['creditdtl'].map(x => Number(x.amount));
    this.cdtsum = this.cdtamt.reduce((a, b) => a + b, 0);
   }
  CreditData: any
  creditid: any
  categoryid: any
  subcategoryid: any
  submitcredit() {
    this.SpinnerService.show()
    const creditdtlsdatas = this.InvoiceDetailForm?.value?.creditdtl
    for (let i in creditdtlsdatas) {
     if (creditdtlsdatas[i]?.paymode_id === '' || creditdtlsdatas[i]?.paymode_id === null || creditdtlsdatas[i]?.paymode_id === undefined) {
        this.toastr.error('Please Choose Paymode')
        this.SpinnerService.hide()
        return false
      }
      if (creditdtlsdatas[i]?.id === "" || creditdtlsdatas[i]?.id === null) {
        delete creditdtlsdatas[i].id
      }
      console.log(creditdtlsdatas[i]?.amount,Number(creditdtlsdatas[i]?.amount))
      
      if (creditdtlsdatas[i]?.paymode_id === 2 || creditdtlsdatas[i]?.paymode_id === 6 || creditdtlsdatas[i]?.paymode_id === 8) {
        if (creditdtlsdatas[i]?.paymode_id === 6 || creditdtlsdatas[i]?.paymode_id === 8) {
          if (creditdtlsdatas[i]?.creditrefno == null || creditdtlsdatas[i]?.creditrefno == "" || creditdtlsdatas[i]?.creditrefno == undefined) {
            this.notification.showError("Refno Cannot Be Empty")
            this.SpinnerService.hide()
            return false
          }
          if (creditdtlsdatas[i]?.amount == null || creditdtlsdatas[i]?.amount == "" || creditdtlsdatas[i]?.amount == undefined || Number(creditdtlsdatas[i]?.amount)<=0) {
            this.notification.showError("Amount cannot be less than Zero.")
            this.SpinnerService.hide()
            return false
          }    
        }
        creditdtlsdatas[i].invoiceheader_id = this.invoiceheaderaddonid
        creditdtlsdatas[i].taxableamount = 0
        creditdtlsdatas[i].category_code = this.categoryid
        creditdtlsdatas[i].subcategory_code = this.subcategoryid
        creditdtlsdatas[i].credittotal = this.cdtsum
        creditdtlsdatas[i].creditbank_id = 0
        creditdtlsdatas[i].suppliertax_id = 0
        creditdtlsdatas[i].suppliertaxtype = ""
        creditdtlsdatas[i].suppliertaxrate = 0
        creditdtlsdatas[i].taxexcempted = "N"
        creditdtlsdatas[i].ddtranbranch = 0
        creditdtlsdatas[i].ddpaybranch = 0
      }

      if (creditdtlsdatas[i]?.paymode_id === 11 ) {
       
        creditdtlsdatas[i].invoiceheader_id = this.invoiceheaderaddonid
        creditdtlsdatas[i].taxableamount = 0
        creditdtlsdatas[i].category_code =  creditdtlsdatas[i].category_code
        creditdtlsdatas[i].subcategory_code = creditdtlsdatas[i].subcategory_code
        creditdtlsdatas[i].credittotal = this.cdtsum
        creditdtlsdatas[i].creditbank_id = 0
        creditdtlsdatas[i].suppliertax_id = 0
        creditdtlsdatas[i].suppliertaxtype = ""
        creditdtlsdatas[i].suppliertaxrate = 0
        creditdtlsdatas[i].taxexcempted = "N"
        creditdtlsdatas[i].ddtranbranch = 0
        creditdtlsdatas[i].ddpaybranch = 0
      }


      if (creditdtlsdatas[i]?.paymode_id === 3) {

        if (creditdtlsdatas[i]?.creditrefno == "" || creditdtlsdatas[i]?.creditrefno == null || creditdtlsdatas[i]?.creditrefno == undefined) {
          this.notification.showError("Refno Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        if (creditdtlsdatas[i]?.bank == "" || creditdtlsdatas[i]?.bank == null || creditdtlsdatas[i]?.bank == undefined) {
          this.notification.showError("Bank Name Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        if (creditdtlsdatas[i]?.branch == "" || creditdtlsdatas[i]?.branch == null || creditdtlsdatas[i]?.branch == undefined) {
          this.notification.showError("Branch Name Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        if (creditdtlsdatas[i]?.benificiary == "" || creditdtlsdatas[i]?.benificiary == null || creditdtlsdatas[i]?.benificiary == undefined) {
          this.notification.showError("Benificiary Name Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        if (creditdtlsdatas[i]?.ifsccode == "" || creditdtlsdatas[i]?.ifsccode == null || creditdtlsdatas[i]?.ifsccode == undefined) {
          this.notification.showError("IFSC Code Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        creditdtlsdatas[i].invoiceheader_id = this.invoiceheaderaddonid
        creditdtlsdatas[i].taxableamount = 0
        creditdtlsdatas[i].category_code = this.categoryid
        creditdtlsdatas[i].subcategory_code = this.subcategoryid
        creditdtlsdatas[i].credittotal = this.cdtsum
        creditdtlsdatas[i].creditbank_id = 0
        creditdtlsdatas[i].suppliertax_id = 0
        creditdtlsdatas[i].suppliertaxtype = ""
        creditdtlsdatas[i].suppliertaxrate = 0
        creditdtlsdatas[i].taxexcempted = "N"
        creditdtlsdatas[i].ddtranbranch = 0
        creditdtlsdatas[i].ddpaybranch = 0
        creditdtlsdatas[i].creditglno = 0
     }

      if (creditdtlsdatas[i]?.paymode_id === 4 || creditdtlsdatas[i]?.paymode_id == 1) {
        if (creditdtlsdatas[i]?.paymode_id === 4) {
          if (creditdtlsdatas[i]?.creditrefno == "" || creditdtlsdatas[i]?.creditrefno == null || creditdtlsdatas[i]?.creditrefno == undefined) {
            this.notification.showError("Refno Cannot Be Empty")
            this.SpinnerService.hide()
            return false
          }
          if (creditdtlsdatas[i]?.bank == "" || creditdtlsdatas[i]?.bank == null || creditdtlsdatas[i]?.bank == undefined) {
            this.notification.showError("Bank Name Cannot Be Empty")
            this.SpinnerService.hide()
            return false
          }
          if (creditdtlsdatas[i]?.branch == "" || creditdtlsdatas[i]?.branch == null || creditdtlsdatas[i]?.branch == undefined) {
            this.notification.showError("Branch Name Cannot Be Empty")
            this.SpinnerService.hide()
            return false
          }
          if (creditdtlsdatas[i]?.benificiary == "" || creditdtlsdatas[i]?.benificiary == null || creditdtlsdatas[i]?.benificiary == undefined) {
            this.notification.showError("Benificiary Name Cannot Be Empty")
            this.SpinnerService.hide()
            return false
          }
          if (creditdtlsdatas[i]?.ifsccode == "" || creditdtlsdatas[i]?.ifsccode == null || creditdtlsdatas[i]?.ifsccode == undefined) {
            this.notification.showError("IFSC Code Cannot Be Empty")
            this.SpinnerService.hide()
            return false
          }
          if (Number(creditdtlsdatas[i]?.amount)<0) {
            this.notification.showError("Amount cannot be less than Zero.")
            this.SpinnerService.hide()
            return false
          }   
        }

        creditdtlsdatas[i].invoiceheader_id = this.invoiceheaderaddonid
        creditdtlsdatas[i].taxableamount = 0
        if (creditdtlsdatas[i]?.paymode_id == 1) {
          creditdtlsdatas[i].category_code = this.categoryid
          creditdtlsdatas[i].subcategory_code = this.subcategoryid
          creditdtlsdatas[i].creditglno = 0
        }
        creditdtlsdatas[i].credittotal = this.cdtsum
        creditdtlsdatas[i].creditbank_id = 0
        creditdtlsdatas[i].suppliertax_id = 0
        creditdtlsdatas[i].suppliertaxtype = ""
        creditdtlsdatas[i].suppliertaxrate = 0
        creditdtlsdatas[i].taxexcempted = "N"
        creditdtlsdatas[i].ddtranbranch = 0
        creditdtlsdatas[i].ddpaybranch = 0
      }


      if (creditdtlsdatas[i]?.paymode_id === 5) {
        if (creditdtlsdatas[i]?.creditbank_id == "" || creditdtlsdatas[i]?.creditbank_id == null || creditdtlsdatas[i]?.creditbank_id == undefined) {
          this.notification.showError("Account Detail Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        if (creditdtlsdatas[i]?.creditrefno == "" || creditdtlsdatas[i]?.creditrefno == null || creditdtlsdatas[i]?.creditrefno == undefined) {
          this.notification.showError("Refno Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        if (creditdtlsdatas[i]?.bank == "" || creditdtlsdatas[i]?.bank == null || creditdtlsdatas[i]?.bank == undefined) {
          this.notification.showError("Bank Name Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        if (creditdtlsdatas[i]?.branch == "" || creditdtlsdatas[i]?.branch == null || creditdtlsdatas[i]?.branch == undefined) {
          this.notification.showError("Branch Name Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        if (creditdtlsdatas[i]?.benificiary == "" || creditdtlsdatas[i]?.benificiary == null || creditdtlsdatas[i]?.benificiary == undefined) {
          this.notification.showError("Benificiary Name Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        if (creditdtlsdatas[i]?.ifsccode == "" || creditdtlsdatas[i]?.ifsccode == null || creditdtlsdatas[i]?.ifsccode == undefined) {
          this.notification.showError("IFSC Code Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        if (Number(creditdtlsdatas[i]?.amount)<0) {
          this.notification.showError("Amount cannot be less than Zero.")
          this.SpinnerService.hide()
          return false
        }    
        creditdtlsdatas[i].invoiceheader_id = this.invoiceheaderaddonid
        creditdtlsdatas[i].taxableamount = 0
        // creditdtlsdatas[i].category_code = this.categoryid
        // creditdtlsdatas[i].subcategory_code = this.subcategoryid
        creditdtlsdatas[i].credittotal = this.cdtsum
        // creditdtlsdatas[i].creditbank_id = this.creditids
        // creditdtlsdatas[i].creditglno = 0
        creditdtlsdatas[i].suppliertax_id = 0
        creditdtlsdatas[i].suppliertaxtype = ""
        creditdtlsdatas[i].suppliertaxrate = 0
        creditdtlsdatas[i].taxexcempted = "N"
        creditdtlsdatas[i].ddtranbranch = 0
        creditdtlsdatas[i].ddpaybranch = 0


      }

      if (creditdtlsdatas[i]?.paymode_id === 7) {
        creditdtlsdatas[i].invoiceheader_id = this.invoiceheaderaddonid
        creditdtlsdatas[i].taxableamount = this.taxableamount
        creditdtlsdatas[i].category_code = this.categoryid
        creditdtlsdatas[i].subcategory_code = this.subcategoryid
        creditdtlsdatas[i].credittotal = this.cdtsum
        creditdtlsdatas[i].creditbank_id = 0
        creditdtlsdatas[i].creditglno = 0
        creditdtlsdatas[i].suppliertax_id = 0
        creditdtlsdatas[i].suppliertaxtype = this.taxratename
        creditdtlsdatas[i].suppliertaxrate = this.taxrate
        creditdtlsdatas[i].taxexcempted = "N"
        creditdtlsdatas[i].ddtranbranch = 0
        creditdtlsdatas[i].ddpaybranch = 0
       }
      delete creditdtlsdatas[i]?.amountchange
    }

    if (this.cdtsum > this.totalamount || this.cdtsum < this.totalamount) {
      this.toastr.error('Check Invoice Header Amount', 'Please Enter Valid Amount');
      this.SpinnerService.hide()
      return false
    }

    this.CreditData = this.InvoiceDetailForm?.value?.creditdtl
    if (this.ecfstatusid === 2) {
       this.ecfservice.createcreditmodification(this.CreditData)
        .subscribe(result => {
          if (result) {
            this.creditid = result?.credit
            if (result['credit'] == undefined) {
              this.notification.showError(result?.description)
              this.SpinnerService.hide()
              return false
            }else {
              this.notification.showSuccess("Successfully Credit Details Saved!...")
              this.SpinnerService.hide()
              this.discreditbtn = true
              this.readcreditdata = true

              let ppx = this.creditid.filter(x=> x.paymode_id == 6 || x.paymode_id == 8 )
              if (ppx.length>0)
              {
                let ecfid: any
                if (this.ecfheaderid != undefined) {
                  ecfid = this.ecfheaderid
                } else {
                  ecfid = this.ecfheaderidd
                }
                console.log("---this.selectedppxdata",this.selectedppxdata)
               for (let ind in this.selectedppxdata) {
                
                
                 let  value = {
                    "apppxheader_id": this.selectedppxdata[ind]?.apppxheader_id,
                    "apinvoiceheader_id": this.selectedppxdata[ind]?.apinvoiceheader_id,
                    "apcredit_id": this.selectedppxdata[ind]?.credit_id,
                    "ppxdetails_amount": this.selectedppxdata[ind]?.ppxheader_amount,
                    "ppxdetails_adjusted": this.selectedppxdata[ind]?.liquidate_amt,
                    "ppxdetails_balance": Number(this.selectedppxdata[ind]?.ppxheader_amount) - Number(this.selectedppxdata[ind]?.liquidate_amt),
                    "ecf_amount": this.selectedppxdata[ind]?.liquidate_amt,
                    "ecfheader_id": ecfid,
                    "process_amount": this.selectedppxdata[ind]?.process_amount
                  }
                
               
                 this.ppxarray.push(value)
                }
            
                let ppxdatas = { "ppxdetails": this.ppxarray }
                this.ecfservice.ppxadvancecreate(ppxdatas).subscribe(result => {
                  let data = result
                })
              } 
              
              let crn = this.creditid.filter(x=> x.paymode_id == 8 )
              if (crn.length>0)
              {
                let ecfid: any
                if (this.ecfheaderid != undefined) {
                  ecfid = this.ecfheaderid
                } else {
                  ecfid = this.ecfheaderidd
                }
                console.log("---this.selectedcrndata",this.selectedcrndata)
               for (let ind in this.selectedcrndata) {
                
                
                 let  value = {
                    "apppxheader_id": this.selectedcrndata[ind]?.apppxheader_id,
                    "apinvoiceheader_id": this.selectedcrndata[ind]?.apinvoiceheader_id,
                    "apcredit_id": this.selectedcrndata[ind]?.credit_id,
                    "ppxdetails_amount": this.selectedcrndata[ind]?.ppxheader_amount,
                    "ppxdetails_adjusted": this.selectedcrndata[ind]?.liquidate_amt,
                    "ppxdetails_balance": Number(this.selectedcrndata[ind]?.ppxheader_amount) - Number(this.selectedcrndata[ind]?.liquidate_amt),
                    "ecf_amount": this.selectedcrndata[ind]?.liquidate_amt,
                    "ecfheader_id": ecfid,
                    "process_amount": this.selectedcrndata[ind]?.process_amount,
                    "type":2
                  }
                
               
                 this.crnarray.push(value)
                }
            
                let crndatas = { "ppxdetails": this.crnarray }
                this.ecfservice.ppxadvancecreate(crndatas).subscribe(result => {
                  let data = result
                })
              }  



            }
          }
        },error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          })
        } else {
       this.ecfservice.CreditDetailsSumbit(this.CreditData)
        .subscribe(result => {
         if (result['credit'] == undefined) {
            this.notification.showError(result?.description)
            this.SpinnerService.hide()
            return false
          }else {
            this.notification.showSuccess("Successfully Credit Details Saved!...")
            this.SpinnerService.hide()
            this.discreditbtn = true
            this.readcreditdata = true
            this.creditid = result.credit

            let ppx = this.creditid.filter(x=> x.paymode_id == 6)
            if (ppx.length>0)
            {
              let ecfid: any
              if (this.ecfheaderid != undefined) {
                ecfid = this.ecfheaderid
              } else {
                ecfid = this.ecfheaderidd
              } 
              console.log("---this.selectedppxdata",this.selectedppxdata)
           
             for (let ind in this.selectedppxdata) {
                let value = {
                  "apppxheader_id": this.selectedppxdata[ind]?.apppxheader_id,
                  "apinvoiceheader_id": this.selectedppxdata[ind]?.apinvoiceheader_id,
                  "apcredit_id": this.selectedppxdata[ind]?.credit_id,
                  "ppxdetails_amount": this.selectedppxdata[ind]?.ppxheader_amount,
                  "ppxdetails_adjusted": this.selectedppxdata[ind]?.liquidate_amt,
                  "ppxdetails_balance": Number(this.selectedppxdata[ind]?.ppxheader_amount) - Number(this.selectedppxdata[ind]?.liquidate_amt),
                  "ecf_amount": this.selectedppxdata[ind]?.liquidate_amt,
                  "ecfheader_id": ecfid,
                  "process_amount": this.selectedppxdata[ind]?.process_amount
                }
               this.ppxarray.push(value)
              }
          
              let ppxdatas = { "ppxdetails": this.ppxarray }
              this.ecfservice.ppxadvancecreate(ppxdatas).subscribe(result => {
                let data = result
              })
            }  

            let crn = this.creditid.filter(x=> x.paymode_id == 8 )
              if (crn.length>0)
              {
                let ecfid: any
                if (this.ecfheaderid != undefined) {
                  ecfid = this.ecfheaderid
                } else {
                  ecfid = this.ecfheaderidd
                }
                console.log("---this.selectedcrndata",this.selectedcrndata)
               for (let ind in this.selectedcrndata) {
                
                
                 let  value = {
                    "apppxheader_id": this.selectedcrndata[ind]?.apppxheader_id,
                    "apinvoiceheader_id": this.selectedcrndata[ind]?.apinvoiceheader_id,
                    "apcredit_id": this.selectedcrndata[ind]?.credit_id,
                    "ppxdetails_amount": this.selectedcrndata[ind]?.ppxheader_amount,
                    "ppxdetails_adjusted": this.selectedcrndata[ind]?.liquidate_amt,
                    "ppxdetails_balance": Number(this.selectedcrndata[ind]?.ppxheader_amount) - Number(this.selectedcrndata[ind]?.liquidate_amt),
                    "ecf_amount": this.selectedcrndata[ind]?.liquidate_amt,
                    "ecfheader_id": ecfid,
                    "process_amount": this.selectedcrndata[ind]?.process_amount,
                    "type":2
                  }
                
               
                 this.crnarray.push(value)
                }
            
                let crndatas = { "ppxdetails": this.crnarray }
                this.ecfservice.ppxadvancecreate(crndatas).subscribe(result => {
                  let data = result
                })
              }  


           }
        },error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        )
    }
    
}

gobacks() {
    this.showheaderdata = true
    this.showinvocedetail = false
    let invdtldatas = this.InvoiceDetailForm.get('invoicedtl') as FormArray
    invdtldatas.clear()
    let crdtdtldatas = this.InvoiceDetailForm.get('creditdtl') as FormArray
    crdtdtldatas.clear()
  }
  delcreditid: any
  deletecreditdetail(section, ind) {
    let id = section.value.id
    if (id != undefined) {
      this.delcreditid = id
    } else {
      if (this.creditid == undefined) {
        let credit = this.InvoiceDetailForm?.value?.creditdtl
        this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(credit[0].amount + credit[ind].amount)
        this.removecreditSection(ind)
        } else {
        for (var i = 0; i < this.creditid?.length; i++) {
          if (i === ind) {
            this.delcreditid = this.creditid[i]?.id
          }
        }
      }
    }
    if (this.delcreditid != undefined) {
      var answer = window.confirm("Are you sure to delete?");
      if (answer) {
        //some code
      }
      else {
        return false;
      }
      this.SpinnerService.show();
      let payid = section.value.paymode_id
      this.ecfservice.creditdelete(this.delcreditid)
        .subscribe(result => {
          if (result.status == "success") {
            this.notification.showSuccess("Deleted Successfully")
            this.SpinnerService.hide();
      
            let credit = this.InvoiceDetailForm?.value?.creditdtl
            this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(credit[0]?.amount + credit[ind]?.amount)
            this.removecreditSection(ind)
            if(payid == 6 || payid == 8)
            {
              let ecfid: any
              if (this.ecfheaderid != undefined) {
                ecfid = this.ecfheaderid
              } else {
                ecfid = this.ecfheaderidd
              }
              this.ecfservice.ppxdelete(ecfid)
              .subscribe(result => {
                if(result.status != "success"){
                  this.notification.showError(result.description) 
                  this.SpinnerService.hide();      
                }
              })
            }
          if (this.InvoiceDetailForm?.value?.creditdtl?.length === 0) {
              this.addcreditSection()
            }
          } else {
            this.notification.showError(result?.description)
          }

        })
    } else {
      this.accdata = ''
      let credit = this.InvoiceDetailForm?.value?.creditdtl
      this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(credit[0]?.amount + credit[ind]?.amount)
      this.removecreditSection(ind)
      if (this.InvoiceDetailForm?.value?.creditdtl?.length === 0) {
        this.addcreditSection()
      }
    }

  }

  // -------debit--------


  getDebitSections(form) {

    return form.controls.debitdtl.controls;
  }
  debitindex: any
  adddebitSection() {

    const control = <FormArray>this.DebitDetailForm.get('debitdtl');
    control.push(this.debitdetail());
    this.accdata = ''
    if (this.ecftypeid == 4) {
      let dbtrecord = this.DebitDetailForm?.value?.debitdtl
      let invcatdata = {"code": "DUMMY","id": 81,"name": "DUMMY"}
      let invsubcatdata = { "code": "DUMMY","id": 291,"name": "DUMMY","glno": 888888}
      for (let i = 0; i < dbtrecord?.length; i++) {
        this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(invcatdata)
        this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(invsubcatdata)
        this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(invsubcatdata.glno)
       }
    }
}

adddsplit() {
    const control = <FormArray>this.DebitDetailForm.get('debitdtl');
    control.push(this.debitdetail());
}

  removedebitSection(i) {
   const control = <FormArray>this.DebitDetailForm.get('debitdtl');
    control.removeAt(i);
    this.debitdatasums()
  }

  debitaddindex: any
  addondebitindex(index) {
    this.debitaddindex = index
  }

  debitdetail() {
    let group = new FormGroup({
      invoiceheader_id: new FormControl(),
      invoicedetail_id: new FormControl(),
      category_code: new FormControl(''),
      subcategory_code: new FormControl(''),
      debitglno: new FormControl(''),
      bsproduct: new FormControl(''),
      amount: new FormControl(0.0),
      debittotal: new FormControl(),
      deductionamount: new FormControl(0),
      cc: new FormControl(),
      bs: new FormControl(),
      ccbspercentage: new FormControl(100),
      remarks: new FormControl(''),
      ccbsdtl: new FormGroup({
        cc_code: new FormControl(''),
        bs_code: new FormControl(''),
        code: new FormControl(''),
        glno: new FormControl(''),
        ccbspercentage: new FormControl(100),
        amount: new FormControl(this.invdtltotamount),
        remarks: new FormControl(),
      })
    })

    group.get('ccbspercentage').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcTotaldebit(this.debitaddindex)
      if (!this.DebitDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
    }
    )

    group.get('amount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcdebitamount(group)
      if (!this.DebitDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
    }
    )

    group.get('deductionamount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcotheramount(this.debitaddindex)
      if (!this.DebitDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
    }
    )


     group.get('category_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getcategoryscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryNameData = datas;
        this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
      })

    group.get('subcategory_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getsubcategoryscroll(this.catid, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcategoryNameData = datas;

      })
    let bskeyvalue: String = "";
    this.getbs(bskeyvalue);
    group.get('bs').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getbsscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsNameData = datas;
        this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
      })

    group.get('cc').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getccscroll(this.bssid, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccNameData = datas;
        // console.log("ccdata", this.ccNameData)
        this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
      })

    group.get('bsproduct').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getbusinessproductscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businesslist = datas;
        this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
      })
      return group
  }

  addbsproduct(data, i: number) {
    let ind = i + 1
    for (let i = 0; i <= 2; i++) {
      this.DebitDetailForm.get('debitdtl')['controls'][i].get('bsproduct').setValue(data)
    }
  }


  calamount: any
  subamount: any
  calcTotaldebit(index) {
    if(this.ecftypeid != 7){
    let dataOnDetails = this.DebitDetailForm?.value?.debitdtl
    let percent: any = +dataOnDetails[index].ccbspercentage
    this.calamount = (this.invdtltaxableamount * percent / 100)
    this.DebitDetailForm.get('debitdtl')['controls'][index].get('amount').setValue(this.calamount)
    this.debitdatasums()
    }else{
      let dataOnDetails = this.DebitDetailForm?.value?.debitdtl
    let percent: any = +dataOnDetails[index].ccbspercentage
    this.calamount = (this.invdtltotamount * percent / 100)
    this.DebitDetailForm.get('debitdtl')['controls'][index].get('amount').setValue(this.calamount)
    this.debitdatasums()
    }
  }
  otamount:any
  calcotheramount(index){
   if(this.ecftypeid != 7){
    let dataOnDetails = this.DebitDetailForm?.value?.debitdtl
    let otamt: any = +dataOnDetails[index].deductionamount
    this.otamount = (otamt/this.invdtltaxableamount*100)
    this.DebitDetailForm.get('debitdtl')['controls'][index].get('amount').setValue(otamt)
    this.DebitDetailForm.get('debitdtl')['controls'][index].get('ccbspercentage').setValue(this.otamount)
    this.debitdatasums()
   }else{
    let dataOnDetails = this.DebitDetailForm?.value?.debitdtl
    let otamt: any = +dataOnDetails[index].deductionamount
    this.otamount = (otamt/this.invdtltotamount*100)
    this.DebitDetailForm.get('debitdtl')['controls'][index].get('amount').setValue(otamt)
    this.DebitDetailForm.get('debitdtl')['controls'][index].get('ccbspercentage').setValue(this.otamount)
    this.debitdatasums()
   }
  }

  calcdebitamount(group: FormGroup) {
    const amount = +group.controls['amount'].value;
    let amountvalue = Number(amount)
    group.controls['amount'].setValue((amountvalue), { emitEvent: false });
    this.debitdatasums()
  }

  calcdebiteditamount(amount: FormControl) {
    const amountt = amount.value
    let amountvalue = Number(amountt)
    amount.setValue((amountvalue), { emitEvent: false });
    this.debitdatasums()
  }

  dbtamt: any
  dbtsum: any
  debitsum: any
  debitdatasums() {
    this.dbtamt = this.DebitDetailForm.value['debitdtl'].map(x => Number((x.amount)));
    this.dbtsum = this.dbtamt.reduce((a, b) => (a + b), 0);
    this.debitsum = (this.dbtsum).toFixed(2)
  }
  public displaycatFn(cattype?: catlistss): string | undefined {
    return cattype ? cattype.name : undefined;
  }

  get cattype() {
    return this.DebitDetailForm.get('category_code');
  }
  public displaycrncatFn(crncattype?: catlistss): string | undefined {
    return crncattype ? crncattype.name : undefined;
  }

  get crncattype() {
    return this.crnglForm.get('category_code');
  }
  getcat(catkeyvalue) {
    this.ecfservice.getcat(catkeyvalue)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.categoryNameData = datas;
          this.catid = datas.id;
        }
      },error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
  }


  cid(data) {
    this.catid = data['id'];
    this.getsubcat(this.catid, "");
  }

  categoryScroll() {
    setTimeout(() => {
      if (
        this.matcatAutocomplete &&
        this.matcatAutocomplete &&
        this.matcatAutocomplete.panel
      ) {
        fromEvent(this.matcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.getcategoryscroll(this.categoryInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.categoryNameData.length >= 0) {
                      this.categoryNameData = this.categoryNameData.concat(datas);
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


  public displaysubcatFn(subcategorytype?: subcatlistss): string | undefined {
    return subcategorytype ? subcategorytype.code : undefined;
  }

  get subcategorytype() {
    return this.DebitDetailForm.get('subcategory_code');
  }

  public displaycrnsubcatFn(crnsubcategorytype?: subcatlistss): string | undefined {
    return crnsubcategorytype ? crnsubcategorytype.code : undefined;
  }

  get crnsubcategorytype() {
    return this.crnglForm.get('subcategory_code');
  }

  subcategoryScroll() {
    setTimeout(() => {
      if (
        this.matsubcatAutocomplete &&
        this.matsubcatAutocomplete &&
        this.matsubcatAutocomplete.panel
      ) {
        fromEvent(this.matsubcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsubcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsubcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsubcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsubcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.getsubcategoryscroll(this.catid, this.subcategoryInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.subcategoryNameData.length >= 0) {
                      this.subcategoryNameData = this.subcategoryNameData.concat(datas);
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


  subcatid: any;
  GLNumb
  getsubcat(id, subcatkeyvalue) {
    this.ecfservice.getsubcat(id, subcatkeyvalue)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.subcategoryNameData = datas;
        }
      },error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
  }
  getGLNumber(data, index) {
    this.GLNumb = data.glno
    this.DebitDetailForm.get('debitdtl')['controls'][index].get('debitglno').setValue(data?.glno)
  }

  getcrnGLNumber(data) {
    
    this.crnglForm.patchValue({
      debitglno : data.glno
    })
  }

  public displayFnbp(producttype?: productcodelists): string | undefined {
    return producttype ? producttype.bsproduct_name : undefined;
  }

  get producttype() {
    return this.DebitDetailForm.get('bsproduct');
  }
  getbusinessproduct(businesskeyvalue) {
    this.ecfservice.getbusinessproductdd(businesskeyvalue)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.businesslist = datas
        }
      },error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
  }

  bpScroll() {
    setTimeout(() => {
      if (
        this.matproductAutocomplete &&
        this.matproductAutocomplete &&
        this.matproductAutocomplete.panel
      ) {
        fromEvent(this.matproductAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matproductAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matproductAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matproductAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matproductAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.getbsscroll(this.productInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.businesslist.length >= 0) {
                      this.businesslist = this.businesslist.concat(datas);
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

  public displaybsFn(bstype?: bslistss): string | undefined {
    return bstype ? bstype.name : undefined;
  }

  get bstype() {
    return this.DebitDetailForm.get('bs');
  }
  getbs(bskeyvalue) {
    this.ecfservice.getbs(bskeyvalue)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.bsNameData = datas;
          this.catid = datas.id;
        }
      },error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
  }

  bsScroll() {
    setTimeout(() => {
      if (
        this.matbsAutocomplete &&
        this.matbsAutocomplete &&
        this.matbsAutocomplete.panel
      ) {
        fromEvent(this.matbsAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbsAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbsAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbsAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbsAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.getbsscroll(this.bsInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.bsNameData.length >= 0) {
                      this.bsNameData = this.bsNameData.concat(datas);
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
  bsidd: any

  bsid(data, code) {
    this.bssid = data['id'];
    this.bsidd = code;
    this.getcc(this.bssid, "");
  }
  public displayccFn(cctype?: cclistss): string | undefined {
    return cctype ? cctype.name : undefined;
  }

  get cctype() {
    return this.DebitDetailForm.get('cc');
  }
  ccid: any;
  getcc(bssid, cckeyvalue) {
    this.ecfservice.getcc(bssid, cckeyvalue)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.ccNameData = datas;
          this.ccid = datas.id;
        }
      },error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )

  }

  ccScroll() {
    setTimeout(() => {
      if (
        this.matccAutocomplete &&
        this.matccAutocomplete &&
        this.matccAutocomplete.panel
      ) {
        fromEvent(this.matccAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matccAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matccAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matccAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matccAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.getccscroll(this.bssid, this.ccInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.ccNameData.length >= 0) {
                      this.ccNameData = this.ccNameData.concat(datas);
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
  back() {
    this.router.navigate(['ECF/inventory'])
  }
  moveback() {
    this.router.navigate(['ECF/invdetailcreate'])
  }
  ccidd: any
  cccodeid: any
  getccdata(code, id) {
    this.ccidd = code
    this.cccodeid = id
  }
  Ddetails: any
  debitid: any
  remarkss: any
  debitform() {
    this.SpinnerService.show()
    this.Ddetails = this.DebitDetailForm?.value?.debitdtl;
    const dbtdetaildata = this.DebitDetailForm?.value?.debitdtl;
    for (let i in dbtdetaildata) {

      if ((dbtdetaildata[i]?.category_code == '') || (dbtdetaildata[i]?.category_code == null)) {
        this.toastr.error('Please Choose Category');
        this.SpinnerService.hide()
        return false;
      }
      if ((dbtdetaildata[i]?.subcategory_code == '') || (dbtdetaildata[i]?.subcategory_code == null)) {
        this.toastr.error('Please Choose Sub Category');
        this.SpinnerService.hide()
        return false;
      }
      if ((dbtdetaildata[i]?.bsproduct == '') || (dbtdetaildata[i]?.bsproduct == null)) {
        this.toastr.error('Please Choose Business Product Name');
        this.SpinnerService.hide()
        return false;
      }
      if ((dbtdetaildata[i]?.bs == '') || (dbtdetaildata[i]?.bs == null)) {

        this.toastr.error('Please Choose bs');
        this.SpinnerService.hide()
        return false;
      }
      if ((dbtdetaildata[i]?.cc == '') || (dbtdetaildata[i]?.cc == null)) {
        this.toastr.error('Please Choose cc');
        this.SpinnerService.hide()
        return false;
      }
      if (dbtdetaildata[i]?.id === "" || dbtdetaildata[i]?.id === null) {
        delete dbtdetaildata[i]?.id
      }
      dbtdetaildata[i].invoiceheader_id = this.invoiceheaderaddonid
      if (this.ecftypeid == 4) {
        dbtdetaildata[i].invoicedetail_id = this.invdetailidforadvance
        dbtdetaildata[i].debittotal = Number(this.totalamount)
      } else {
        dbtdetaildata[i].invoicedetail_id = this.invdtladdonid
        dbtdetaildata[i].debittotal = Number(this.invdtltotamount)
      }
     
      dbtdetaildata[i].category_code = dbtdetaildata[i]?.category_code?.code
      dbtdetaildata[i].subcategory_code = dbtdetaildata[i]?.subcategory_code?.code
      dbtdetaildata[i].bsproduct = dbtdetaildata[i]?.bsproduct?.id
      this.categoryid = dbtdetaildata[i]?.category_code
      this.subcategoryid = dbtdetaildata[i]?.subcategory_code
      dbtdetaildata[i].deductionamount = dbtdetaildata[i].deductionamount
      this.ccidd = dbtdetaildata[i]?.cc?.code
      this.bsidd = dbtdetaildata[i]?.bs?.code
      let a = dbtdetaildata[i]?.ccbsdtl
      if (a.id === "") {
        delete a.id
      }
      a.cc_code = this.ccidd
      a.bs_code = this.bsidd
      a.code = this.cccodeid
      a.glno = dbtdetaildata[i]?.debitglno
      a.amount = dbtdetaildata[i]?.amount
      a.remarks = dbtdetaildata[i]?.remarks
      a.ccbspercentage = dbtdetaildata[i]?.ccbspercentage
      a.debit = 0
      delete dbtdetaildata[i].cc
      delete dbtdetaildata[i].bs

    }
    if (this.ecftypeid != 4) {
     if (this.debitsum > this.invdtltotamount || this.debitsum < this.invdtltotamount) {
        this.toastr.error('Check Invoice Header Amount', 'Please Enter Valid Amount');
        this.SpinnerService.hide()
        return false
      }
    }
     if (this.ecftypeid == 4) {
      if (this.debitsum > this.totalamount || this.debitsum < this.totalamount || this.debitsum == undefined) {
        this.toastr.error('Check Invoice Header Amount', 'Please Enter Valid Amount');
        this.SpinnerService.hide()
        return false
      }
    }
   this.Ddetails = this.DebitDetailForm?.value?.debitdtl;
   if (this.ecfstatusid === 2) {
      this.ecfservice.createdebitmodification(this.Ddetails)
        .subscribe(result => {
       if (result['debit'] == undefined) {
            this.notification.showError(result?.description)
            this.SpinnerService.hide()
            return false
          } else {
            this.notification.showSuccess("Successfully Debit Details Saved!...")
            this.SpinnerService.hide()
            if (this.ecftypeid == 4) {
              this.submitdebitdtlbtn = true
              this.readdata = true
            }
            this.debitid = result.debit
            this.closebutton.nativeElement.click();

          }
        },error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        )

    } else {
      this.ecfservice.DebitdetailCreateForm(this.Ddetails)
        .subscribe(result => {
          if (result['debit'] == undefined) {
            this.notification.showError(result?.description)
            this.SpinnerService.hide()
            return false
          }
          else {
            this.notification.showSuccess("Successfully Debit Details Saved!...")
            this.SpinnerService.hide()
            if (this.ecftypeid == 4) {
              this.submitdebitdtlbtn = true
              this.readdata = true
            }
            this.debitid = result?.debit
            this.closebutton.nativeElement.click();
            }
        },error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        )
    }
  }


  deldebitid: any
  deletedebitdetail(section, ind) {
    let id = section.value.id

    if (id != undefined) {
      this.deldebitid = id
    } else {

      if (this.debitid == undefined) {
        this.removedebitSection(ind)
      } else {
        for (var i = 0; i < this.debitid?.length; i++) {
          if (i === ind) {
            this.deldebitid = this.debitid[i]?.id
          }
        }
      }
    }
    if (this.deldebitid != undefined) {
      var answer = window.confirm("Are you sure to delete?");
      if (answer) {
        //some code
      }
      else {
        return false;
      }
      this.ecfservice.debitdelete(this.deldebitid)
        .subscribe(result => {
          if (result.status == "success") {
            this.notification.showSuccess("Deleted Successfully")
            this.removedebitSection(ind)
            if (this.DebitDetailForm?.value?.debitdtl?.length === 0) {
              this.adddebitSection()
            }
          } else {
            this.notification.showError(result?.description)
          }
        })

    } else {
      this.removedebitSection(ind)
      if (this.DebitDetailForm?.value?.debitdtl?.length === 0) {
        this.adddebitSection()
      }
    }

  }
  debitbacks() {
    this.closebutton.nativeElement.click();
  }
  Rvalue: number = 0;
  Ovalue: number = 0;
  min: number = -1;
  max: number = 1;
  RoundingOFF(e) {
    if (e >= this.max) {
     this.InvoiceDetailForm.patchValue({roundoffamt: 0 })
      this.toastr.warning("Amount should not exceed one rupee");
      return false
    }
    else if (e <= this.min) {
      this.InvoiceDetailForm.patchValue({roundoffamt: 0 })
      this.toastr.warning("Please enter valid amount");
      return false
    }
    else if (e < this.max) {
      this.INVdatasums()
    }
    else if (e > this.min) {
      this.INVdatasums()
    }
}
  otheradjustmentmaxamount: any;
  otheradjustmentminamount: any;
  OtherAdjustment(e) {
    let data = this.InvoiceHeaderForm?.value?.invoiceheader
    for (let i in data) {
      let invamt = Number(data[i].invoiceamount)
      let roundamt = Number(data[i].roundoffamt)
      let taxamt = Number(data[i].taxamount)
      this.otheradjustmentmaxamount = invamt + taxamt + roundamt
    }
    if (e >= this.otheradjustmentmaxamount) {
     this.InvoiceDetailForm.patchValue({ otheramount: 0 })
     this.toastr.warning("Other Adjustment Amount should not exceed Invoice Header Amount");
      return false
    }
    else {
      this.INVdatasums()
    }
}
  Taxvalue = 0
  headertaxableamount: any
  Taxamount(e) {
    let data = this.InvoiceHeaderForm?.value?.invoiceheader
    for (let i in data) {
      this.headertaxableamount = Number(data[i]?.invoiceamount)
    }
    if (e > this.headertaxableamount) {
      this.Taxvalue = 0
      this.toastr.warning("Tax Amount should not exceed taxable amount");
      return false
    }
   }
 numberOnlyandDotminus(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57) && ((charCode < 45 || charCode > 46))) {
      return false;
    }
    return true;
  }
 backform() {
    this.onCancel.emit()
 }
 overallback() {
    this.onCancel.emit()
  }
  suppliersubmitForm() {
    this.closebuttons.nativeElement.click();
  }
  supplierbackform() {
    this.closebuttons.nativeElement.click();
  }
 characterOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 96 || charCode > 122) && (charCode < 32 || charCode > 32)) {
      return false;
    }
    return true;
  }
 characterandnumberonly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 96 || charCode > 122) && (charCode < 48 || charCode > 57) && (charCode < 32 || charCode > 32)) {
      return false;
    }
    return true;
  }
  debitdtlid: any
  addsplit(index, data) {
    this.debitdtlid = data?.value?.id
    let ind = index + 1
    const control = <FormArray>this.DebitDetailForm.get('debitdtl');
    control.insert(ind, this.debitdetail())
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('category_code').setValue(data?.value?.category_code)
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('subcategory_code').setValue(data?.value?.subcategory_code)
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('debitglno').setValue(data?.value?.debitglno)
   }
  branchgstnumber: any
  Branchcallingfunction() {
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppname').setValue(this.SupplierName)
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppliergst').setValue(this.SupplierGSTNumber)
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('supplier_id').setValue(this.supplierid)
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('supplierstate_id').setValue(this.stateid)
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppstate').setValue(this.statename)
    this.ecfservice.GetbranchgstnumberGSTtype(this.supplierid, this.raiserbranchid)
      .subscribe((results) => {
        let datas = results;
        this.branchgstnumber = datas?.Branchgst
        this.type = datas?.Gsttype
     })
  }
  showapprover(data) {
    this.approvid = data?.id
    this.showapproverforedit = false
    this.showapproverforcreate = true
  }
  filedatas: any
  fileindex: any
  getfiledetails(datas, ind) {
    this.fileindex = ind
    this.filedatas = datas.value['filekey']
   }
  fileback() {
    this.closedbuttons.nativeElement.click();
  }
  showimageHeaderPreview: boolean = false
  showimageHeaderPreviewPDF: boolean = false
  jpgUrls: any
  pdfurl: any
  filepreview(files) {
    let stringValue = files.name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg" ||
      stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {
      this.showimageHeaderPreview = true
      this.showimageHeaderPreviewPDF = false
      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.jpgUrls = reader.result
      }
    }
    if (stringValue[1] === "pdf" || stringValue[1] === "PDF") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = true
      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.pdfurl = reader.result
      }
    }
    if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt" ||
      stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = false
    }
  }

  checkmultilevel(){
    let json = {"id":this.commodityid }

    this.ecfservice.findmultilevel(json)
    .subscribe(resultss=>{
       let muldatas = resultss
       console.log("muldatas",muldatas)
       this.ismultilevel = muldatas?.is_multilevel
      
    })
  }
  filterText(ctrl, ctrlname){
    let text = String(ctrl.value).trim();
    for(let i = 0; i<text.length; i++)
    {
      let char = text.charAt(i)
      let charcode = text.charCodeAt(i)
      if ((charcode < 65 || charcode >90)  && (charcode < 96 || charcode > 122) && (charcode < 48 || charcode > 57) && (charcode != 32)){ 
        text = text.replace(char, "");
        i=i-1
        }      
    }
   
    if(ctrlname == "remarks"){
      this.ecfheaderForm.get('purpose').setValue(text)
    }
    else if(ctrlname == "invoceno"){
      this.InvoiceHeaderForm.get('invoiceheader')['controls'][0].get('invoiceno').setValue(text)
  }
}

  filterTexts(ctrl, ctrlname,index){
    let text = String(ctrl.value).trim();
    for(let i = 0; i<text.length; i++)
    {
      let char = text.charAt(i)
      let charcode = text.charCodeAt(i)
      if ((charcode < 65 || charcode >90)  && (charcode < 96 || charcode > 122) && (charcode < 48 || charcode > 57) && (charcode != 32)){ 
        text = text.replace(char, "");
        i=i-1
        }      
    }
   
if(ctrlname == "item"){
      this.InvoiceDetailForm.get('invoicedtl')['controls'][index].get('productname').setValue(text)
  }
else if(ctrlname == "description"){
    this.InvoiceDetailForm.get('invoicedtl')['controls'][index].get('description').setValue(text)
}
else if(ctrlname == "remarks"){
  this.DebitDetailForm.get('debitdtl')['controls'][index].get('remarks').setValue(text)
}
  
  
}

}









