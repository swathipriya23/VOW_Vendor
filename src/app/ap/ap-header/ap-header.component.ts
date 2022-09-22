import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup,FormArray, FormControl} from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DomSanitizer } from '@angular/platform-browser';

import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { fromEvent, pipe } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

import { NotificationService } from '../../service/notification.service';
import { Router, ActivatedRoute } from '@angular/router';

import { ApService } from '../ap.service';
import { ApShareServiceService } from '../ap-share-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

export interface commoditylistss {
  id: string;
  name: string;
}

export interface Branch {
  id: any;
  name: string;
  code: string;
  codename: string;
}
export interface SupplierName {
  id: number;
  name: string;
}

export interface ppxfilterValue {
  id: string;
  text: string;
}

export interface clientlists{
  id:string;
  client_code:string;
  client_name:string;
}

export interface rmlists{
  id:string;
  full_name:string;
  name:string
}

export interface supplyplacelists {
  id: any;
  name: string;
  code: any;
  name_and_code: any;
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
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

export interface OriginalInv {
  id: string;
  text: string;
}
@Component({
  selector: 'app-ap-header',
  templateUrl: './ap-header.component.html',
  styleUrls: ['./ap-header.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class ApHeaderComponent implements OnInit {
  @ViewChild('commoditytype') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('commodityInput') commodityInput: any;
  @ViewChild('clientrole') matclientAutocomplete: MatAutocomplete;
  @ViewChild('clientInput') clientInput: any;
  @ViewChild('rmrole') matrmAutocomplete: MatAutocomplete;
  @ViewChild('clientInput') rmInput: any;
 

  @ViewChild('commoditytype1') matcommodityAutocomplete1: MatAutocomplete;
  @ViewChild('commodityInput1') commodityInput1: any;
  @ViewChild('br') matBrAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('raisorBr') matRaiserAutocomplete: MatAutocomplete;
  @ViewChild('raiserInput') raiserInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild('Suppliertype') matsupAutocomplete: MatAutocomplete;
  @ViewChild('suppInput') suppInput: any;
  inwardHdrNo = this.share.inwardHdrNo.value
  apEditMode:boolean = false
  crno :any ="-" 
  
  ecftypeid : any
  apsubmitted= false
  showppx =false
  ppxid :any
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  identificationSize: number = 10;
  TypeList: any
  ppxList: any
  advancetypeList:any
  
  SupptypeList: any
  showgstapply = false
  showsupplier = true
  showgst = true

  commodityList: Array<commoditylistss>
  clientlist: Array<clientlists>
  rmlist: Array<rmlists>
  supplyPlaceList: Array<supplyplacelists>
 
  raiserBrList: Array<Branch>
  tomorrow = new Date();
  type: any;
  getgstapplicable: any

  uploadList = [];
  filesToUpload: string[] = [];
  files: string[] = [];

  @ViewChild('takeInput', { static: false })
  InputVar: ElementRef;
     
  @Output() onCancel = new EventEmitter<any>();
 
  @ViewChild('OriginalInvInput') OrgInvInput: any;
  @ViewChild('isOriginalInv') OriginalInvAutoComplete: MatAutocomplete;
  @ViewChild('matPlaceofSupply') matPlaceofSupply: MatAutocomplete;
  @ViewChild('placeOfSupplyInput') placeOfSupplyInput: any;

  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  

  inward_id=this.share.inward_id.value;
  invoice_count=this.share.invoice_count.value;

  public inward_completed:number=0

  @Output() linesChange = new EventEmitter<any>();
  invECFTypeid: any;
  suppid:any;
  suppStateid:any;
  gst:any;
  invoice_date:any;
  invoice_no:any;
  invoice_amount:any;
  branchid:any;
  commodityid:any;
  disableecfsave = false
  
  frmECFNoHdr: FormGroup;
  frmECFHeader: FormGroup;

  InvoiceHeaderForm: FormGroup
  invHdrData:any;

  SelectSupplierForm: FormGroup
  disableecfcheck=false
  showECFChecked:boolean=true
  ECFChecked:boolean=true
  gstApplChecked:boolean=false
  Invoicedata: any
  
  isLoading:boolean=false;
  inwardECFData:any;
  // invHdrData:invHdrData;
  // invHdrDatas:Array<invHdrData>;  
  originalInv:Array<OriginalInv>;
  invHdrList:any;
  apheader_id =this.share.apheader_id.value
  apheaderdet: any;
  apinvHeader_id:any

  default = true
  alternate = false

  barCode:string=""
  shortLink: string = "";
  file: any = null; 
  toto: any
  amt: any
  sum: any
 
  inputSUPPLIERValue = "";
  supplierindex:any
  supplierid:any
  supp:any 
  SupplierName:any 
  SupplierCode:any
  SupplierGSTNumber:any
  SupplierPANNumber:any
  Address:any
  line1:any
  line2:any
  line3:any
  City:any
  stateid:any
  statename:any
  JsonArray = []
  submitbutton = false;
  suplist: any 
  supplierNameData: any;
  selectsupplierlist: any;
  invheadersave:boolean
  showaddbtn:boolean
  showaddbtns:boolean
  AddinvDetails:boolean
  invoiceheaderres:any
  delinvid: any
  ecfAmt:number;
  invHdrId:number;
  fileList : any
  showrmforcreate = true
  showrmforedit = false
  comefrom : any
  supplierGSTflag : boolean = false
  supplierGSTType : string = ""

  constructor(private toastr: ToastrService,private notification: NotificationService, private share: ApShareServiceService, private router: Router,  
     private service: ApService, private fb: FormBuilder,public datepipe: DatePipe, private spinner:NgxSpinnerService, private sanitizer: DomSanitizer,
     private activatedroute : ActivatedRoute  ) { }
  
    
  ngOnInit(): void {
      this.activatedroute.queryParams.subscribe(
        params => {
          if(params)
          {
            this.comefrom = params.comefrom
            this.apheader_id = params.apheader_id
              if(params.inward_completed)
              {
                this.inward_completed = params.inward_completed;
              }
              console.log("his.apheader_id -->", this.apheader_id)             
            }
        })
         
    console.log(this.inward_id)
    this.frmECFNoHdr = this.fb.group({
      ECFNumber:[''],

      ecfType:[''],
      chkgstApplicable:[''],
      supplierName:[''],
      supplierGstNo:[''],
     
      invoiceDate:[''],
      invoiceNumber:[''],
      amount:[''],
      taxableAmount:[''],

      employee:[''],
      branch:[''],      
      branchGst:[''],
      isOriginalInvoice:[''],

      rmcode:[''],
      client_code:[''],
      purpose:[''],
    })
    
    this.frmECFHeader = this.fb.group({
      ecfType:[''],
      ppx : [''],
      ppxno : [''],
      advancetype:[''],
      supplierType:[''],
      commodity:[''],
      ecfDate:[''],
      
      ecfAmount:[''],
      raiserBranch:[''],
      purpose:['']
    })
  
    this.InvoiceHeaderForm = this.fb.group({
      invoicegst: [''],

      invoiceheader: new FormArray([

      ]),

    })

    this.SelectSupplierForm = this.fb.group({
      gstno: [''],
      code: [''],
      panno: [''],
      name: ['']

    })
   
    if(this.apheader_id !== null && this.apheader_id !== "" && this.apheader_id !== undefined)
    {
      this.apEditMode = true
      this.spinner.show();
      this.service.getHdrSummary(this.apheader_id)
        .subscribe((result:any)=> {
            this.spinner.hide();
            if(result)
            {
              this.apheaderdet = result;
              console.log("AP Header details",this.apheaderdet)
              let apdet =this.apheaderdet

              this.ecftypeid=apdet.aptype.id
              this.ecftype(this.ecftypeid)
              this.ppxid = apdet.payto.id

              if (apdet.payto.id == 'E') {
                this.showppx = true
                this.showsupplier = false
                this.showgst = false
              }
    
              if(apdet.payto.id == 'S'){
                this.showppx = true
                this.showsupplier = true
                this.showgst = true
              }
              if(this.ecftypeid == 8)
              {
                this.showppx = true
                this.showsupplier = false
                this.showgst = false
              }
              if (apdet.crno == null || apdet.crno == "" || apdet.crno == undefined)
              {
                this.showECFChecked = false
                this.ECFChecked=false

                if(apdet.aptype.id === 4)
                {
                  this.showppx = true
                }
                else
                {
                  this.showppx = false
                }

                let num: number = +apdet.apamount;
                let amt = new Intl.NumberFormat("en-GB").format(num); 
                amt = amt ? amt.toString() : '';
                this.frmECFHeader.patchValue(
                  { 
                    ecfType: apdet.aptype.id,
                    ppx : apdet.payto,
                    ppxno : "",
                    advancetype: "",
                    supplierType: "",
                    commodity: apdet.commodity_id,
                    ecfDate: this.datepipe.transform(apdet.apdate, 'dd-MMM-yyyy'),
                    ecfAmount: amt,
                    raiserBranch: apdet.raiserbranch,
                    purpose: apdet.remark,
                  }
                )
              }
              else
              {
                this.crno = apdet.crno
                this.showECFChecked=true
                this.disableecfcheck =true

                this.showrmforcreate = false
                this.showrmforedit = true
                let gst;
                if(apdet.apinvoiceheader[0].invoicegst=="Y")
                {
                  gst=true
                }
                else
                {
                  gst=false
                } 
                
                let num: number = +apdet.apinvoiceheader[0].totalamount;
                let amt = new Intl.NumberFormat("en-GB").format(num); 
                amt = amt ? amt.toString() : '';

                let num1: number = +apdet.apinvoiceheader[0].invoiceamount;
                let taxamt = new Intl.NumberFormat("en-GB").format(num1); 
                taxamt = taxamt ? taxamt.toString() : '';

                let orginv 
                if (apdet.is_originalinvoice == null)
                {
                  orginv=""
                }
                else
                {
                  orginv = apdet.is_originalinvoice
                }
                this.frmECFNoHdr.patchValue(
                  {
                  ECFNumber: apdet.crno,

                  ecfType: apdet.aptype.id,
                  chkgstApplicable: gst,
                  supplierName: apdet.apinvoiceheader[0].supplier.name,
                  supplierGstNo: apdet.apinvoiceheader[0].supplier.gstno,
                 
                  invoiceDate: this.datepipe.transform(apdet.apdate, 'dd-MMM-yyyy'),
                  invoiceNumber: apdet.apinvoiceheader[0].invoiceno,
                  amount: amt,
                  taxableAmount: taxamt,
            
                  employee: apdet.raisername,
                  branch: apdet.raiserchoose_branch.name,      
                  branchGst: apdet.raiserchoose_branch.gstin,
                  isOriginalInvoice: orginv,

                  client_code : apdet.client_code ? apdet.client_code : undefined,
                  rmcode : apdet.rmcode == null ? "": apdet.rmcode.name,  

                  barCode: apdet.rmubarcode,
                  rmuCode:apdet.rmubarcode,
                  purpose: apdet.remark,
                  }
                  )
                
                  if(this.ppxid == "S")
                  {
                    this.suppid=apdet.apinvoiceheader[0].supplier?.id;
                    this.suppStateid=apdet.apinvoiceheader[0].supplierstate_data?.id;
                  }
                  this.gst=apdet.apinvoiceheader[0].invoicegst
                  this.branchid=apdet.raiserbranch.id;
                  this.commodityid=apdet.commodity_id.id; 
              }
              
              let invhdrs = apdet.apinvoiceheader
              this.invoiceheaderres = result['apinvoiceheader'];
              this.fileList = result['apinvoiceheader'][0].apfile;
              this.getinvoicehdrrecords(invhdrs)
            }
        })
    }
    else
    {
      this.showrmforcreate = true
      this.showrmforedit = false
    }

    this.getOriginalInv("");
    this.getecftype();
    this.getsuppliertype();
   
    let clientkeyvalue: String = "";
    this.getclient(clientkeyvalue);
    this.frmECFNoHdr.get('client_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.service.getclientscroll(value, 1)
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

    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.frmECFNoHdr.get('rmcode').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.service.getrmscroll(value, 1)
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



   
    this.frmECFHeader.get('commodity').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.service.getcommodityscroll(value, 1)
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


    let suppliername: String = "";
    this.getsuppliername(this.suplist, suppliername);

    this.SelectSupplierForm.get('name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.service.getsuppliernamescroll(this.suplist, value, 1)
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

  InvHeaderFormArray(): FormArray {
    return this.InvoiceHeaderForm.get('invoiceheader') as FormArray;
  }


  getinvoicehdrrecords(datas) {
    const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
    control.clear();
    let i=0;
    for (let invhdr of datas) {
      if (i==0)
      {
        this.type = invhdr.gsttype
        this.getgstapplicable = invhdr.invoicegst
        this.InvoiceHeaderForm.patchValue({
          invoicegst: this.getgstapplicable
        })
      }
      i++
      let id: FormControl = new FormControl('');
      let suppname: FormControl = new FormControl('');
      let suppstate: FormControl = new FormControl('');
      let place_of_supply: FormControl = new FormControl('');
      let invoiceno: FormControl = new FormControl('');
      let invoicedate: FormControl = new FormControl('');
      let invoiceamount: FormControl = new FormControl('');
      let taxamount: FormControl = new FormControl('');
      let totalamount: FormControl = new FormControl('');
      let otheramount: FormControl = new FormControl('');
      let roundoffamt: FormControl = new FormControl('');
      let invtotalamt: FormControl = new FormControl('');
      let apheader_id: FormControl = new FormControl('');
      let dedupinvoiceno: FormControl = new FormControl('');
      let supplier_id: FormControl = new FormControl('');
      let suppliergst: FormControl = new FormControl('');
      let supplierstate_id: FormControl = new FormControl('');
      let raisorbranchgst: FormControl = new FormControl('');
      let invoicegst: FormControl = new FormControl('');
      // let images:FormControl = new FormControl('');
      let status:FormControl = new FormControl('');
      let apfile:FormControl = new FormControl('');
     
      // let file_key: FormArray = new FormArray([])
      // const InvHeaderFormArray = this.InvoiceHeaderForm.get("invoiceheader") as FormArray;

      id.setValue(invhdr.id)
      if (this.ppxid == "S") {
        suppname.setValue(invhdr.supplier?.name)
        supplierstate_id.setValue(invhdr.supplierstate_data? invhdr.supplierstate_data : "")
        // suppstate.setValue(invhdr.supplierstate_id.name)
        supplier_id.setValue(invhdr.supplier? invhdr.supplier : "")
        suppliergst.setValue(invhdr.suppliergst ? invhdr.suppliergst : "")
        if(invhdr.place_of_supply?.code =="INVALID STATE ID" || invhdr.place_of_supply == null || invhdr.place_of_supply == undefined)
        {
          place_of_supply.setValue(this.nostate)
        }
        else
        {
          place_of_supply.setValue(invhdr.place_of_supply)
        }        
      } else {
        suppname.setValue("")
        supplierstate_id.setValue("")
        supplier_id.setValue("")
        suppliergst.setValue("")
        place_of_supply.setValue(this.nostate)
        suppstate.setValue("")
      }
      invoiceno.setValue(invhdr.invoiceno)
      invoicedate.setValue(invhdr.invoicedate)
      let num: number = +invhdr.invoiceamount;
      let temp = new Intl.NumberFormat("en-GB").format(num); 
      temp = temp ? temp.toString() : '';
      invoiceamount.setValue(temp)

      num = +invhdr.taxamount;
      temp = new Intl.NumberFormat("en-GB").format(num); 
      temp = temp ? temp.toString() : '';
      taxamount.setValue(temp)

      totalamount.setValue(invhdr.totalamount)
      otheramount.setValue(invhdr.otheramount)
      roundoffamt.setValue(invhdr.roundoffamt)
      invtotalamt.setValue("")
      dedupinvoiceno.setValue(invhdr.dedupinvoiceno)
      apheader_id.setValue(invhdr.apheader_id)
      raisorbranchgst.setValue(invhdr.raisorbranchgst)
      invoicegst.setValue(this.getgstapplicable)
      status.setValue(invhdr.status.text)
      apfile.setValue("")
      // file_key.setValue(invhdr.file_key)
      // images.setValue(invhdr.apfile[0] ? invhdr.apfile[0].filename : undefined)
      // this.type=invhdr.gsttype

      this.InvHeaderFormArray().push(new FormGroup({
        id: id,
        suppname: suppname,
        suppstate:suppstate,
        place_of_supply:place_of_supply,
        invoiceno: invoiceno,
        invoicedate: invoicedate,
        invoiceamount: invoiceamount,
        taxamount: taxamount,
        totalamount: totalamount,
        otheramount: otheramount,
        roundoffamt: roundoffamt,
        invtotalamt: invtotalamt,
        dedupinvoiceno: dedupinvoiceno,
        apheader_id: apheader_id,
        supplier_id: supplier_id,
        suppliergst: suppliergst,
        supplierstate_id: supplierstate_id,
        raisorbranchgst: raisorbranchgst,
        invoicegst: invoicegst,
        apfile:apfile,
        status:status
      }))


      this.calchdrTotal(invoiceamount, taxamount, totalamount)

      place_of_supply.valueChanges
      .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.service.getPlaceOfSupplyscroll(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
            if (value === "") {              
               this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
            }
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.supplyPlaceList = datas;
      this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
    })
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

  calchdrTotal(invoiceamount, taxamount, totalamount: FormControl) {

    const Taxableamount = invoiceamount.value
    const Taxamount = taxamount.value
  
    // const RoundingOff = roundoffamt.value
    // const Otheramount = otheramount.value

    let toto = Number(String(Taxableamount).replace(/,/g, '')) + Number(String(Taxamount).replace(/,/g, ''))
    this.toto = toto 
    let num: number = +this.toto;
    let temp = new Intl.NumberFormat("en-GB").format(num); 
    temp = temp ? temp.toString() : '';
    this.toto = temp
    // - Otheramount
    totalamount.setValue((this.toto), { emitEvent: false });

    this.datasums();
  }

  ecfChange(e:boolean)
  {
    this.ECFChecked=e;
  }

  ECFAdd(){
    let ecfHdr=this.frmECFNoHdr.value
    if(ecfHdr.ECFNumber===null|| ecfHdr.ECFNumber === ''){
      this.toastr.warning('Please enter ECF No.')
      return false
    }
    if(this.inward_completed===this.invoice_count && this.apheader_id !== null && 
      this.apheader_id !== "" && this.apheader_id !== undefined)
    {
     this.toastr.warning('Entry Completed for this Inward.')
     return false
    }  
      
    this.spinner.show();
    this.service.getInwardECF(ecfHdr.ECFNumber)
        .subscribe((result:any)=> {
            this.spinner.hide();
            this.inwardECFData = result;
            console.log("ecf details",this.inwardECFData)

            if (result.code != undefined) {
              this.notification.showError(result.description)
              }
            else
            {
              console.log("Inward ECF  ",this.inwardECFData)
              let gst:boolean

              this.showrmforcreate = false
              this.showrmforedit = true

            if(this.inwardECFData.Invheader[0].invoicegst=="Y")
            {
              gst=true
            }
            else
            {
              gst=false
            }   
            this.ecftypeid =  this.inwardECFData.ecftype_id
            this.ppxid = this.inwardECFData.payto_id?.id

            if (this.ppxid == 'E') {
              this.showsupplier = false
              this.showgst = false
            }
  
            if(this.ppxid == 'S'){
              this.showsupplier = true
              this.showgst = true
            }
            if(this.ecftypeid ==8)
            {
              this.showsupplier = false
              this.showgst = false
              this.showgstapply = false
            }
            let num: number = +this.inwardECFData.Invheader[0].totalamount;
            let amt = new Intl.NumberFormat("en-GB").format(num); 
            amt = amt ? amt.toString() : '';
           
            let num1: number = +this.inwardECFData.Invheader[0].invoiceamount;
            let taxamt = new Intl.NumberFormat("en-GB").format(num1); 
            taxamt = taxamt ? taxamt.toString() : '';
           
            this.frmECFNoHdr.patchValue({
                        ecfType : this.inwardECFData.ecftype_id,
                        chkgstApplicable :gst,
                        supplierName : this.inwardECFData.Invheader[0].supplier_id?.name,
                        supplierGst : this.inwardECFData.Invheader[0].supplier_id?.gstno,
                        invoiceDate : this.datepipe.transform(this.inwardECFData.Invheader[0].invoicedate, 'dd-MMM-yyyy'),
                        invoiceNumber : this.inwardECFData.Invheader[0].invoiceno,
                        amount : amt,
                        taxableAmount : taxamt,
                        employee : this.inwardECFData.raisername,
                        branch : this.inwardECFData.branch.name,
                        branchGst : this.inwardECFData.branch.gstin,
                        client_code : this.inwardECFData.client_code,
                        rmcode : this.inwardECFData.rmcode == null ? "": this.inwardECFData.rmcode.name,                     
                                 
                        purpose : this.inwardECFData.remark
            });

              this.invECFTypeid=this.inwardECFData.ecftype_id;
              this.suppid=this.inwardECFData.Invheader[0].supplier_id?.id;
              this.suppStateid=this.inwardECFData.Invheader[0].supplierstate_id?.id;
              this.gst=this.inwardECFData.Invheader[0].invoicegst
              this.branchid=this.inwardECFData.raiserbranch.id;
              this.commodityid=this.inwardECFData.commodity_id.id;                        
          }
        },error=>
          {
              this.toastr.warning('ECF No. not exists.');
          }
        )
}

gstApplChange(e:boolean)
{
  this.gstApplChecked=e;
}

ECFSubmit()
{
  let ecfHdr=this.frmECFNoHdr.value    
 
  if(this.inward_completed===this.invoice_count && this.apheader_id !== null && 
    this.apheader_id !== "" && this.apheader_id !== undefined)
  {
    this.toastr.warning('Entry Completed for this Inward.')
    return false
  }  
  if(ecfHdr.ECFNumber===null|| ecfHdr.ECFNumber==='')
  {
    this.toastr.warning('Please enter ECF No.')
    return false
  }
  if(ecfHdr.isOriginalInvoice===null|| ecfHdr.isOriginalInvoice===''|| ecfHdr.isOriginalInvoice===undefined)
  {
    this.toastr.warning('Please select is original invoice.')
    return false
  }
 
 if(this.apheader_id !== null && this.apheader_id !== "" && this.apheader_id !== undefined)
    {
      let inwardDet={
        invoice_count : this.invoice_count,
        inwarddetails_id : this.inward_id,
        ecftype_id : ecfHdr.ecfType,
        supplier_id : this.suppid,
        supplierstate_id : this.suppStateid,
        gst : this.gst,
        ecfdate : this.datepipe.transform(ecfHdr.invoiceDate, 'yyyy-MM-dd'),
        invoice_no : ecfHdr.invoiceNumber,
        dedupeinvoice_no : ecfHdr.invoiceNumber,
        ecfamount : ecfHdr.amount.replace(/,/g, ''),
        raiserbranch : {"id":this.branchid},
        commodity_id : {"id":this.commodityid},
        remark : ecfHdr.purpose,
        is_originalinvoice : ecfHdr.isOriginalInvoice,
        id : this.apheader_id,
        client_code_id :ecfHdr.client_code.id,
        rmcode_id : ecfHdr.rmcode?.id
      }
      console.log("Ap header Edit with CRNo --- INPUT",inwardDet)
      this.spinner.show();
  
      this.service.apHeaderAdd(inwardDet)
      .subscribe(result => {
        this.spinner.hide();
  
          if (result.code != undefined) {
            this.notification.showError(result.description)
            }
          else
           {
            console.log("Inserted",result);
            this.notification.showSuccess('Header Edited Successfully');
            this.apsubmitted = true
            if(result)
            {
              this.apheader_id=result.id
              console.log(result)
              this.spinner.show();
  
              this.service.getHdrSummary(this.apheader_id)
              .subscribe((result:any)=> {
                this.spinner.hide();
  
                if(result)
                {
                  console.log(result)
             
                  this.invoiceheaderres = result['apinvoiceheader'];
                  this.fileList = result['apinvoiceheader'][0].apfile;
                  this.getinvoicehdrrecords(this.invoiceheaderres)
                }
                
              })
  
            }
            
          }          
        })
    }
 else
    {
      let inwardDet={
        invoice_count : this.invoice_count,
        crno : ecfHdr.ECFNumber ,
        inwarddetails_id : this.inward_id,
        ecftype_id : ecfHdr.ecfType,
        supplier_id : this.suppid,
        supplierstate_id : this.suppStateid,
        gst : this.gst,
        invoice_date : this.datepipe.transform(ecfHdr.invoiceDate, 'yyyy-MM-dd'),
        invoice_no : ecfHdr.invoiceNumber,
        dedupeinvoice_no : ecfHdr.invoiceNumber,
        invoice_amount : ecfHdr.amount.replace(/,/g, ''),
        branch_id : this.branchid,
        commodity_id : this.commodityid,
        is_originalinvoice : ecfHdr.isOriginalInvoice,
        remarks : ecfHdr.purpose,
      }
      
      console.log("Ap header Entry with CRNo --- INPUT",inwardDet)
      this.spinner.show();
    
      this.service.docInwAdd(inwardDet,this.file)
        .subscribe(result => {
          this.spinner.hide();
  
          if (result.code != undefined) {
            this.notification.showError(result.description)
            }
          else
           {
            console.log("Inserted",result);
            this.notification.showSuccess('Header Added Successfully');
            this.apsubmitted = true
            if(result)
            {
              this.apheader_id=result.apheader_id
              console.log(result)
              this.spinner.show();
  
              this.service.getHdrSummary(this.apheader_id)
              .subscribe((result:any)=> {
                this.spinner.hide();
  
                if(result)
                {
                  console.log(result)
             
                  this.invoiceheaderres = result['apinvoiceheader'];
                  this.fileList = result['apinvoiceheader'][0].apfile;
                  this.getinvoicehdrrecords(this.invoiceheaderres)
                }
              })
  
            }
            
          }          
        })
    }
    
 
}
// clearControls()
// {
//   this.frmECFNoHdr.reset();

//   this.frmECFNoHdr.patchValue({
       
//     ECFNumber:"",
//     ecfType:"",
//     chkgstApplicable:false,
//     invoiceNo:"",

//     supplierName:"",
//     supplierGstNo:"",
   
//     invoiceDate:"",
//     invoiceNumber:"",
//     amount:0,
//     taxableAmount:"",

//     employee:"",
//     branch:"",      
//     branchGst:"",
//     isOriginalInvoice:"",

//     barCode:"",
//     rmuCode:"",
//     purpose:"",
//     fileUpload:""
//   }
//   )
//   this.suppid="";
//   this.suppStateid="";
//   this.branchid="";
//   this.commodityid="";
//   this.files=[]  

//   this.frmECFHeader.reset();
//   this.frmECFHeader.patchValue(
//     {
//       ecfType:'',
//       ppx : '',
//       ppxno : '',
//       advancetype:'',
//       supplierType:'',
//       commodity:'',
//       ecfDate:'',
      
//       ecfAmount:'',
//       raiserBranch:'',
//       purpose:'',
//       notename:''
//   })
  
//   this.InvoiceHeaderForm.reset()
//   const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');

//   control.clear();
//   this.apheader_id =""
// }
public displayFnclient(clientrole?: clientlists): string | undefined {
  return clientrole ? clientrole.client_name : undefined;
}

get clientrole() {
  return this.frmECFNoHdr.get('client_code');
}

getclient(clientkeyvalue) {
  this.service.getclientcode(clientkeyvalue)
    .subscribe(results => {
      let datas = results["data"];
      this.clientlist = datas;
      console.log("this.clientlist....",this.clientlist)
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
              this.service.getclientscroll(this.clientInput.nativeElement.value, this.currentpage + 1)
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
  return rmrole ? rmrole.full_name : undefined;
}

public displayFnrmedit(rmrole?: rmlists): string | undefined {
  return rmrole ? rmrole.name : undefined;
}

showrm(){
  this.showrmforcreate = true
  this.showrmforedit = false
}

get rmrole() {
  return this.frmECFNoHdr.get('rmcode');
}

getrm(rmkeyvalue) {
  this.service.getrmcode(rmkeyvalue)
    .subscribe(results => {
      let datas = results["data"];
      this.rmlist = datas;
      console.log("this.rmlist....",this.rmlist)

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
              this.service.getrmscroll(this.rmInput.nativeElement.value, this.currentpage + 1)
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



getsuppliertype() {
  this.service.getsuppliertype()
    .subscribe(result => {
      this.SupptypeList = result["data"]
      console.log(this.SupptypeList)

    })
}

public displayFncommodity(commoditytype?: commoditylistss): string | undefined {
  return commoditytype ? commoditytype.name : undefined;
}
getCommodity() 
 {
  let keyvalue: String = "";    
  this.service.getcommodity(keyvalue)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.commodityList = datas;

    })
  this.frmECFHeader.get('commodity').valueChanges
    .pipe(
      startWith(""),
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),

      switchMap(value => this.service.getcommodity(value)
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
              this.service.getcommodityscroll(this.commodityInput.nativeElement.value, this.currentpage + 1)
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

commodityScroll1() {
setTimeout(() => {
  if (
    this.matcommodityAutocomplete1 &&
    this.matcommodityAutocomplete1 &&
    this.matcommodityAutocomplete1.panel
  ) {
    fromEvent(this.matcommodityAutocomplete1.panel.nativeElement, 'scroll')
      .pipe(
        map(x => this.matcommodityAutocomplete1.panel.nativeElement.scrollTop),
        takeUntil(this.autocompleteTrigger.panelClosingActions)
      )
      .subscribe(x => {
        const scrollTop = this.matcommodityAutocomplete1.panel.nativeElement.scrollTop;
        const scrollHeight = this.matcommodityAutocomplete1.panel.nativeElement.scrollHeight;
        const elementHeight = this.matcommodityAutocomplete1.panel.nativeElement.clientHeight;
        const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
        if (atBottom) {
          if (this.has_next === true) {
            this.service.getcommodityscroll(this.commodityInput1.nativeElement.value, this.currentpage + 1)
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

public displayFnBranch(br?: Branch): string | undefined {
  return br ? br.name : undefined;
}
getBranches() 
 {
  let keyvalue: String = "";    
  this.service.getbranch(keyvalue)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.raiserBrList = datas;

    })
  this.frmECFHeader.get('raiserBranch').valueChanges
    .pipe(
      startWith(""),
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),

      switchMap(value => this.service.getbranch(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.raiserBrList = datas;

    })

}

rsrBranchScroll() {
  setTimeout(() => {
    if (
      this.matRaiserAutocomplete &&
      this.matRaiserAutocomplete &&
      this.matRaiserAutocomplete.panel
    ) {
      fromEvent(this.matRaiserAutocomplete.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matRaiserAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matRaiserAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight = this.matRaiserAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight = this.matRaiserAutocomplete.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_next === true) {
              this.service.getbranchscroll(this.raiserInput.nativeElement.value, this.currentpage + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  if (this.raiserBrList.length >= 0) {
                    this.raiserBrList = this.raiserBrList.concat(datas);
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

branchScroll() {
  setTimeout(() => {
    if (
      this.matBrAutocomplete &&
      this.matBrAutocomplete &&
      this.matBrAutocomplete.panel
    ) {
      fromEvent(this.matBrAutocomplete.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matBrAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matBrAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight = this.matBrAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight = this.matBrAutocomplete.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_next === true) {
              this.service.getbranchscroll(this.branchInput.nativeElement.value, this.currentpage + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  if (this.raiserBrList.length >= 0) {
                    this.raiserBrList = this.raiserBrList.concat(datas);
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

  headerSubmit(){
    if(this.inward_completed===this.invoice_count && this.apheader_id !== null && 
      this.apheader_id !== "" && this.apheader_id !== undefined)
    {
    this.toastr.warning('Entry Completed for this Inward.')
    return false
    }  
  
    let ecfHdr=this.frmECFHeader.value
        let inwardDet={
          "supplier_type_id" : ecfHdr.supplierType,
          "commodity_id": {"id": ecfHdr.commodity.id},
		      "ecftype_id": ecfHdr.ecfType,
		      "ecfdate": this.datepipe.transform(ecfHdr.ecfDate, 'yyyy-MM-dd'),
		      "ecfamount": ecfHdr.ecfAmount,
		      "ppx_id": ecfHdr.ppx.id,
		      "remark": ecfHdr.purpose,
		      "payto_id": ecfHdr.ppx.id,
		      "raisedby": 12,
		      "raisername": "",
		      "raiserbranch": {"id": ecfHdr.raiserBranch.id},
		      "inwarddetails_id":this.inward_id,
          "invoice_count" : this.invoice_count,
          "ecfstatus_id":2,
          "id":""
          
        }
        if(this.apheader_id !== null && this.apheader_id !== "" && this.apheader_id !== undefined)
        {
          inwardDet.id = this.apheader_id
        }
        else
        {
          delete inwardDet.id
        }
        console.log("Ap header Entry withOUT CRNo --- INPUT",inwardDet)
        this.spinner.show();
  
        this.service.apHeaderAdd(inwardDet)
        .subscribe(result => {
        this.spinner.hide();
  
          if (result.code != undefined) {
            this.notification.showError(result.description)

        }
        else {
            console.log("Ap header Entry withOUT CRNo completed output.....",result)
            this.disableecfsave = true
            
            this.apheader_id=result.id
            this.share.apheader_id.next(this.apheader_id);
   
            console.log("this.apheader_id.....",this.apheader_id)
            this.notification.showSuccess("AP Header Saved Successfully")
            this.apsubmitted = true
            this.addSection();
            }
      })
    
  }

 
  addSection() {
    const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
    control.push(this.INVheader());
    // if (control.value.length <= 0) {
    //   control.push(this.INVheader());
    // }
  } 
  getSections(forms) {
    return forms.controls.invoiceheader.controls;
  }  

    INVheader() {
      let group = new FormGroup({
        id: new FormControl(),
        invoiceno: new FormControl(),
      dedupinvoiceno: new FormControl(),
      invoicedate: new FormControl(''),
      suppname: new FormControl(''),
      suppliergst: new FormControl(''),
      place_of_supply: new FormControl(''),
      raisorbranchgst: new FormControl(''),
      invoiceamount: new FormControl(0),
      taxamount: new FormControl(0),
      totalamount: new FormControl(0),
      otheramount: new FormControl(0),
      roundoffamt: new FormControl(0),
      invoicegst: new FormControl(''),
      supplier_id: new FormControl(''),
      supplierstate_id: new FormControl(''),
      // images:new FormControl(''),
      status:new FormControl(''),
      file_key: new FormArray([
      ])
      })  
  
       group.get('place_of_supply').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.service.getPlaceOfSupplyscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplyPlaceList = datas;
        this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
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
  
      group.get('roundoffamt').valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calcTotal(group)
        if (!this.InvoiceHeaderForm.valid) {
          return;
        }
  
        this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      }
      )
  
      group.get('otheramount').valueChanges.pipe(
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
      const Taxableamount = group.controls['invoiceamount'].value;
      const Taxamount = group.controls['taxamount'].value;
      const RoundingOff = +group.controls['roundoffamt'].value;
      const Otheramount = +group.controls['otheramount'].value;
      let toto = +Taxableamount.replace(/,/g, '') + +Taxamount.replace(/,/g, '') + RoundingOff
      this.toto = toto - Otheramount
      let num: number = +this.toto;
      let temp = new Intl.NumberFormat("en-GB").format(num); 
      temp = temp ? temp.toString() : '';
      this.toto = temp
      group.controls['totalamount'].setValue((this.toto), { emitEvent: false });
      this.datasums();
    }
  
    datasums() {
      this.amt = this.InvoiceHeaderForm.value['invoiceheader'].map(x => +String(x.totalamount).replace(/,/g, ''));
      this.sum = this.amt.reduce((a, b) => a + b, 0);  
    }
    GSTstatus(data) {
      this.getgstapplicable = data.value
    }
  
    getsuppindex(ind) {
      this.supplierindex = ind 
    }
    get Suppliertype() {
      return this.SelectSupplierForm.get('name');
    }
  
    getsuppView(data) {
      this.spinner.show();
  
      this.service.getsupplierView(data.id)
        .subscribe(result => {
          this.spinner.hide();
  
          let datas = result
          console.log("SUPPLIER",datas)
          this.supplierid = datas
  
          this.SupplierName = result.name
          this.SupplierCode = result.code;
          this.SupplierGSTNumber = result.gstno;
          this.stateid = result.address_id.state_id;
          console.log("this.SupplierGSTNumber....",this.SupplierGSTNumber)
          console.log("this.supplier_id....",this.supplierid)
          console.log("this.supplierstate_id....",this.stateid)
         
          delete this.supplierid.address_id
          delete this.supplierid.code
          delete this.supplierid.gstno
          delete this.supplierid.is_active
          delete this.supplierid.name
          delete this.supplierid.panno

          delete this.stateid.code
          delete this.stateid.country_id
          delete this.stateid.created_by
          delete this.stateid.name
          delete this.stateid.status
          delete this.stateid.updated_by
          
          
          console.log("this.supplier_id....",this.supplierid)
          console.log("this.supplierstate_id....",this.stateid)
          
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppname').setValue(this.SupplierName)
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppliergst').setValue(this.SupplierGSTNumber)
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('supplier_id').setValue(this.supplierid)
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('supplierstate_id').setValue(this.stateid)
          this.submitbutton = true;
  
        })
    }

    getsuppliername(id, suppliername) {
      this.service.getsuppliername(id, suppliername)
        .subscribe((results) => {
          let datas = results["data"];
          this.supplierNameData = datas;
  
        })
  
    }
  
    SelectSuppliersearch() {
      let searchsupplier = this.SelectSupplierForm.value;
      if (searchsupplier.code === "" && searchsupplier.panno === "" && searchsupplier.gstno === "") {
        this.getsuppliername("", "");
      }
      else {
        this.alternate = true;
        this.default = false;
        this.Testingfunctionalternate();
      }
    }
    successdata: any
    Testingfunctionalternate() {
      let searchsupplier = this.SelectSupplierForm.value;
      this.service.getselectsupplierSearch(searchsupplier)
        .subscribe(result => {
          // this.supplierid = result.data.id
          this.selectsupplierlist = result.data
          this.successdata = this.selectsupplierlist
  
        })
    }

    fileView(datas){
      this.service.fileView(datas.file_id)
    }

    fileDownload(datas) {
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      let url = environment.apiURL + "apserv/apfiledownload/" + datas.file_id + "?download=true&token=" + token;
      let anchor = document.createElement('a');
      anchor.href = url;
      anchor.target = '_blank';
      anchor.click();
    }
    // fileDownload(datas){

    //   this.spinner.show()
    //   this.service.downloadfile(datas.file_id)
    //     .subscribe((results) => {
  
    //       let binaryData = [];
    //       binaryData.push(results)
    //       let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    //       let link = document.createElement('a');
    //       link.href = downloadUrl;
    //       link.download = datas.file_name;
    //       link.click();
    //       this.spinner.hide()
    //     },
    //       error => {
    //         this.notification.showError(error);
    //         this.spinner.hide();
    //       }
    //     )

    //   // let id=datas.file_id
    //   // this.service.downloadfile(id)
    // }

    fileChange(event) {
      this.filesToUpload = [];
      for (var i = 0; i < event.target.files.length; i++) {
        this.filesToUpload.push(event.target.files[i]);
      }    
    }

    deleteFile(i)
    {
      this.filesToUpload.splice(i,1)
    }
  
    deleteUpload(file, i) {
      this.service.deleteFileUpload(file.file_id)
        .subscribe(result => {
        this.notification.showSuccess("Successfully file Deleted....")
        this.fileList.splice(i, 1);
      })
    }
  
    public displaytest(SupplierName?: SupplierName): string | undefined {
      return SupplierName ? SupplierName.name : undefined;
    }
    public displayFn(Suppliertype?: SupplierName): string | undefined {
      return Suppliertype ? Suppliertype.name : undefined;
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
                  this.service.getsuppliernamescroll(this.suplist, this.suppInput.nativeElement.value, this.currentpage + 1)
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
    numberOnlyandDotminus(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57) && ((charCode < 45 || charCode > 46))) {
        return false;
      }
      return true;
    }
  
  
    uploadfile=["file1","file2","file3","file4","file5","file6"]
    submitinvoiceheader() {
      const invoiceheaderdata = this.InvoiceHeaderForm.value.invoiceheader
      let ecfHdr=this.frmECFNoHdr.value
      if(ecfHdr.isOriginalInvoice===null|| ecfHdr.isOriginalInvoice===''|| ecfHdr.isOriginalInvoice===undefined)
      {
        this.toastr.warning('Please select is original invoice in AP Header.')
        return false
      }
      this.spinner.show();
      this.service.getHdrSummary(this.apheader_id)
        .subscribe((result:any)=> {
            this.spinner.hide();
            if(result)
            {
              this.apheaderdet = result;
              let apdet = this.apheaderdet
              let orginv = apdet.is_originalinvoice
              if( orginv == null )
              {
                this.toastr.warning('Please save the changes made in Is Original Invoice in AP Header.')
                return false
              }
              for (let i in invoiceheaderdata) {
                invoiceheaderdata[i].invoicegst = this.getgstapplicable
        
                if (this.ecftypeid !== 4 )
                {
                  if ( this.ppxid === "S" && (invoiceheaderdata[i].supplier_id == '' || 
                    invoiceheaderdata[i].supplier_id == null || invoiceheaderdata[i].supplier_id == undefined) ) {
                    this.toastr.error('Please Choose Supplier Name');
                    return false;
                  }       
          
                  if ( this.ppxid === "S" && (invoiceheaderdata[i].place_of_supply == '' || 
                  invoiceheaderdata[i].place_of_supply == null || invoiceheaderdata[i].place_of_supply == undefined) ) {
                  this.toastr.error('Please Choose Place of Supplier');
                  return false;
                }       
                
                  if (invoiceheaderdata[i].invoiceno == '' || invoiceheaderdata[i].invoiceno == null || invoiceheaderdata[i].invoiceno == undefined){
                    this.toastr.error('Please Enter Invoice Number');
                    return false;
                  }
                } 
                if(this.ecftypeid ==2)
                {
                  invoiceheaderdata[i].place_of_supply = invoiceheaderdata[i].place_of_supply.code 
                } 
        
                if ((invoiceheaderdata[i].invoicedate == '') || (invoiceheaderdata[i].invoicedate == null) || (invoiceheaderdata[i].invoicedate == undefined)) {
                  this.toastr.error('Please Choose Invoice Date');
                  return false;
                }
          
                if ((invoiceheaderdata[i].invoiceamount == '') || (invoiceheaderdata[i].invoiceamount == null) || (invoiceheaderdata[i].invoiceamount == undefined)) {
                  this.toastr.error('Please Enter Taxable Amount');
                  return false;
                }
          
                if (invoiceheaderdata[i].taxamount == 0 && this.InvoiceHeaderForm.value.invoicegst === 'Y' && this.ecftypeid != 8) {
                  this.toastr.error('Please Enter Tax Amount');
                  return false;
                }
                invoiceheaderdata[i].invoiceamount = (invoiceheaderdata[i].invoiceamount).replace(/,/g, '')
                invoiceheaderdata[i].taxamount = (invoiceheaderdata[i].taxamount).replace(/,/g, '')
                invoiceheaderdata[i].totalamount = (invoiceheaderdata[i].totalamount).replace(/,/g, '')
                invoiceheaderdata[i].invoicedate = this.datepipe.transform(invoiceheaderdata[i].invoicedate, 'yyyy-MM-dd');
                invoiceheaderdata[i].dedupinvoiceno = invoiceheaderdata[i].invoiceno
                if(this.fileList.length <=0 && this.filesToUpload.length <=0)
                {
                  this.toastr.error('Please Choose File.');
                  return false;
                }
                if(this.filesToUpload.length <=0)
                {
                  delete invoiceheaderdata[i].file_key
                }
                else
                {
                  invoiceheaderdata[i].file_key =[]
                  invoiceheaderdata[i].file_key.push(this.uploadfile[i])         
                }
                
                if (this.ecftypeid === 4)
                {
                  invoiceheaderdata[i].invoicegst = "N"
                }
                
                delete invoiceheaderdata[i].suppname
                if (invoiceheaderdata[i].id ===null || invoiceheaderdata[i].id === undefined || invoiceheaderdata[i].id === "")
                {
                  delete invoiceheaderdata[i].id   
                }     
              }  
              if (this.ECFChecked === true)
              {
                if (this.frmECFNoHdr.value.amount.replace(/,/g, '') < this.sum || this.frmECFNoHdr.value.amount.replace(/,/g, '') > this.sum) {
                  this.toastr.error('Check Header Amount', 'Please Enter Valid Amount');
                  return false;
                }
              }
              else
              {
                if (this.frmECFHeader.value.ecfAmount < this.sum || this.frmECFHeader.value.ecfAmount > this.sum) {
                  this.toastr.error('Check Header Amount', 'Please Enter Valid Amount');
                  return false;
                }
              }              
          
              let detaildata = {
                "invoiceheader": invoiceheaderdata 
              }
              this.spinner.show();
          
              this.service.invHdrAdd(detaildata,this.apheader_id,this.filesToUpload)
                  .subscribe(result => {
                    this.spinner.hide();
          
                    if (result.code != undefined) {
                      this.notification.showError(result.description)
          
                    } else {
                      this.notification.showSuccess("Successfully Invoice Header Saved!...")
                      this.invheadersave = true
                      this.showaddbtn = false
                      this.showaddbtns = true
                      this.AddinvDetails = false
                      this.filesToUpload = [];
                      this.spinner.show();
          
                      this.service.getHdrSummary(this.apheader_id)
                      .subscribe((result:any)=> {
                        this.spinner.hide();
          
                        if(result)
                        {
                          this.invoiceheaderres = result['apinvoiceheader'];
                          this.fileList = result['apinvoiceheader'][0].apfile;
                          this.getinvoicehdrrecords(this.invoiceheaderres)
                        }
                      })
          
                    }
                  })
            }
          })
      
    }

  getecftype(){
      this.service.getecftype()
        .subscribe(result => {
        this.TypeList = result["data"]
        console.log(this.TypeList)      
      })
  }

  public displayFnppxFilter(filterppxdata?: ppxfilterValue): string | undefined {
    return filterppxdata ? filterppxdata.text : undefined;
   }
   get filterppxdata() {
     return this.frmECFHeader.get('ppx');
   }

  getppxtype() {
    this.service.getppxdropdown()
      .subscribe(result => {
        this.ppxList = result["data"]
      })
  } 
  
  ecftype(id)
  {
    this.ecftypeid = id
    
    if(id === 4)
    {
      this.showppx = true
      this.getppxtype()
      this.getadvancetype()
    }
    else
    {
      this.showppx = false
    }
  }
  
  getadvancetype(){
    this.service.getadvancetype()
    .subscribe(result => {
      this.advancetypeList = result["data"]
    })
  }

  getppx(data) {

    let id = data.id
    if (id == "E") {
      this.showsupplier = false      
      this.showgst = false
    }
    if (id == "S") {
      this.showsupplier = true      
      this.showgst = true
      this.showgstapply = true
    }


  }


  Rvalue: number = 0;
  Ovalue: number = 0;
  min: number = -1;
  max: number = 1;
  RoundingOFF(e) {
    if (e > this.max) {
      this.Rvalue = 0
      this.toastr.warning("Should not exceed one rupee");
      return false
    }
    else if (e < this.min) {
      this.Rvalue = 0
      this.toastr.warning("Please enter valid amount");
      return false
    }
    else if (e <= this.max) {
      this.Rvalue = e
    }
  }
  otheradjustmentmaxamount: any;
  otheradjustmentminamount: any;
  OtherAdjustment(e) {
    let data = this.InvoiceHeaderForm.value.invoiceheader
    for (let i in data) {
      let invamt = Number(data[i].invoiceamount)
      let roundamt = Number(data[i].roundoffamt)
      this.otheradjustmentmaxamount = invamt + roundamt

    }

    if (e > this.otheradjustmentmaxamount) {
      this.Ovalue = 0
      this.toastr.warning("Other Adjustment Amount should not exceed taxable amount");
      return false
    }
  }
  
  
  deleteinvheader(data, section, ind) {
   
    let id = section.value.id
    if (id != undefined) {
      this.delinvid = id
    } else {

      if(this.invoiceheaderres == undefined){
        this.removeSection(ind)
      }else{
     
      for (var i = 0; i < this.invoiceheaderres.length; i++) {

        if (i === ind) {
          this.delinvid = this.invoiceheaderres[i].id
        }
      }
    }
  }
    if(this.delinvid != undefined){
      var answer = window.confirm("Are you sure to delete?");
      if (answer) {
        //some code
      }
      else {
        return false;
      }
       this.spinner.show();
  
       this.service.delInvHdr(this.delinvid)
      .subscribe(result => {
        this.spinner.hide();
  
        if(result.status === "success"){
        this.notification.showSuccess("Deleted Successfully")
        this.removeSection(ind)
      }else{
        this.notification.showError(result.description) 
       }
      })
     

    }
    else{
      this.removeSection(ind)
    }

  }
  
  removeSection(i) {
      const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
      control.removeAt(i);
      this.datasums();
    }

  getOriginalInv(keyvalue) {
    this.service.getInwardOrgInv(keyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.originalInv = datas;

      })
  }

  barcodeChange(e:any){
    this.barCode=e.target.value 
  }

  onFileUpload(e) {
    // this.file=e.target.files[0]
    this.file =[];
    for (var i = 0; i < e.target.files.length; i++) {
        this.file.push(e.target.files[i])
       }
  }
  nostate : any
  getPlaceOfSupply(place) {
    this.service.getPlaceOfSupply(place)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplyPlaceList = datas
      })

      this.service.getPlaceOfSupply("nostate")
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.nostate = datas[0]
        console.log("this.nostate",this.nostate)
      })
  }
  getPlaceOfSupplyScroll() {
    setTimeout(() => {
      if (
        this.matPlaceofSupply &&
        this.matPlaceofSupply &&
        this.matPlaceofSupply.panel
      ) {
        fromEvent(this.matPlaceofSupply.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matPlaceofSupply.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matPlaceofSupply.panel.nativeElement.scrollTop;
            const scrollHeight = this.matPlaceofSupply.panel.nativeElement.scrollHeight;
            const elementHeight = this.matPlaceofSupply.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.service.getPlaceOfSupplyscroll(this.placeOfSupplyInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.supplyPlaceList.length >= 0) {
                      this.supplyPlaceList = this.supplyPlaceList.concat(datas);
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

  public displayFnsupply(supplyplace?: supplyplacelists): string | undefined {
    return supplyplace ? supplyplace.name_and_code : undefined;
  }

  Addinvoice(section, index) {   
    let ecfHdr=this.frmECFNoHdr.value
      if(ecfHdr.isOriginalInvoice===null|| ecfHdr.isOriginalInvoice===''|| ecfHdr.isOriginalInvoice===undefined)
      {
        this.toastr.warning('Please select is original invoice in AP Header.')
        return false
      }
      this.spinner.show();
      this.service.getHdrSummary(this.apheader_id)
        .subscribe((result:any)=> {
            this.spinner.hide();
            if(result)
            {
              this.apheaderdet = result;
              let apdet = this.apheaderdet
              let orginv = apdet.is_originalinvoice
              if(orginv == null )
              {
                this.toastr.warning('Please save the changes made in Is Original Invoice in AP Header.')
                return false
              }

              if (this.invoiceheaderres != undefined)
              {
                if ( this.ppxid === "S" && (this.invoiceheaderres[index]?.supplier.id != section.value.supplier_id.id)) {
                  this.notification.showInfo("Please save the changes done in supplier")
                  return false
                }
                if (this.ppxid === "S" && (this.invoiceheaderres[index]?.suppliergst != section.value.suppliergst)) {
                  this.notification.showInfo("Please save the changes done in suppliergst")
                  return false
                }
        
                if(this.ecftypeid == 2)
                {
                  let pos =this.invoiceheaderres[index]?.place_of_supply
                  if (pos.code != section.value.place_of_supply?.code) {
                    this.notification.showInfo("Please save the changes done in Place of Supply")
                    return false
                   }                  
                }
                
                if (this.ecftypeid !== 4 )
                {
                  if (this.invoiceheaderres[index]?.invoiceno != section.value.invoiceno) {
                    this.notification.showInfo("Please save the changes done in Invoice no.")
                    return false
                  }
                }
                if (this.invoiceheaderres[index]?.invoicedate != (this.datepipe.transform(section.value.invoicedate, 'yyyy-MM-dd'))) {
                  this.notification.showInfo("Please save the changes done in Invoice date")
                  return false
                }
        
                let invamt = section.value.invoiceamount
                if (this.invoiceheaderres[index]?.invoiceamount != invamt.replace(/,/g, '')) {
                  this.notification.showInfo("Please save the changes done in Invoice Amount")
                  return false
                }
                let taxamt = section.value.taxamount
                if (this.invoiceheaderres[index]?.taxamount != taxamt.replace(/,/g, '')) {
                  this.notification.showInfo("Please save the changes done in Tax amount")
                  return false
                }
        
              let totamt = section.value.totalamount
               if (this.invoiceheaderres[index]?.totalamount != totamt.replace(/,/g, '')) {
                  this.notification.showInfo("Please save the changes done in Total Amount")
                  return false
                }
              
              if(this.ecftypeid !== 3 && this.ecftypeid !== 4 && this.ecftypeid !== 8 )
                {
                  let vendor_gsttype = this.invoiceheaderres[index].supplier.vendor_gsttype.id 
                  let gstcode : string
                  if(vendor_gsttype == 3)
                  {
                    gstcode = this.invoiceheaderres[index].supplier.address.state.gst_code
                  }
                  else
                  {
                    gstcode =(this.invoiceheaderres[index].suppliergst).substr(0,2)
                  }
        
                  if(this.invoiceheaderres[index].place_of_supply?.gst_code == gstcode)
                    {
                      this.supplierGSTType ="SGST & CGST"
                      this.supplierGSTflag = true
                    }
                  else
                    {
                      this.supplierGSTType ="IGST"
                      this.supplierGSTflag = true
                    }
                }
              
              this.share.apheader_id.next(this.apheader_id);
              this.share.apinvHeader_id.next(section.value.id);
            
              this.router.navigate(['/ap/invDetailView'], {queryParams : {supplierGSTflag:this.supplierGSTflag , supplierGSTType:this.supplierGSTType}, skipLocationChange: true });
            }
            }
          })
    
  
  }

backform() {
  this.InvoiceHeaderForm.reset()
  const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
  control.clear();
  console.log("comefrom -----" , this.comefrom)
  if (this.comefrom == "commonapsummary")
  {
    this.router.navigate(['/ap/commonsummary'], { skipLocationChange: true });
  }
  else if (this.comefrom  == "apsummary")
  {
     this.router.navigate(['/ap/apHeaderSummary'], { skipLocationChange: true });
  }
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

get sanitizedHtml() {
  return this.sanitizer.bypassSecurityTrustHtml(this.frmECFHeader.get('html').value);
}


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


characterandnumberonly(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if ((charCode < 65 || charCode >90)  && (charCode < 96 || charCode > 122) && (charCode < 48 || charCode > 57)){ 
  return false;
  }
  return true;
}
previousCharCode : any =0
charCode : any = 0
getCharCode(e)
{
  this.previousCharCode = this.charCode
  this.charCode = (e.which) ? e.which : e.keyCode;
}

changeToCurrency(ctrl, ctrlname, i=0) {   
  console.log(this.previousCharCode , this.charCode)
  if(this.charCode  != 46 && !(this.previousCharCode ==46 && this.charCode == 48))
  {
    let a = ctrl.value;
    a = a.replace(/,/g, "");
    if (a && !isNaN(+a)) 
    {
      let num: number = +a;
      let temp = new Intl.NumberFormat("en-GB", {style: 'decimal'}).format(num); 
      temp = temp ? temp.toString() : '';
      if(ctrlname == "invAmt1")
      {
        this.frmECFNoHdr.get('amount').setValue(temp)
      }
      else if(ctrlname == "taxAmt1")
      {
        this.frmECFNoHdr.get('taxableAmount').setValue(temp)
      }
      else if(ctrlname == "invAmt")
      {
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('invoiceamount').setValue(temp)
      }
      else if(ctrlname == "taxAmt")
      {
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('taxamount').setValue(temp)
      }
      else if(ctrlname == "totAmt")
      {
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('totalamount').setValue(temp)
      }
    }
  }
}

filterText(ctrl, ctrlname)
  {
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
    if(ctrlname== "ECFNo")
      this.frmECFNoHdr.get('ECFNumber').setValue(text)
    else if(ctrlname == "remarks")
      this.frmECFNoHdr.get('purpose').setValue(text)
    else if(ctrlname == "invoceno")
      this.InvoiceHeaderForm.get('invoiceheader')['controls'][0].get('invoiceno').setValue(text)
  }
}
function INVheader() {
  throw new Error('Function not implemented.');
}

