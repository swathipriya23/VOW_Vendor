import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, FormControlDirective,Validators } from '@angular/forms';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe, DecimalPipe } from '@angular/common';
import { ApService } from '../ap.service';
import { ApShareServiceService } from '../ap-share-service.service';
import { NotificationService } from '../../service/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { fromEvent, pipe } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { data } from 'jquery';
import { not, THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { I } from '@angular/cdk/keycodes';
import { Ap1Service } from '../ap1.service';
import { AnyRecord } from 'dns';

const isSkipLocationChange = environment.isSkipLocationChange

export interface paymodelistss {
  code: string;
  id: string;
  name: string;
}

export interface debbanklistss {
  bankbranch: {bank :{name: string}}
  account_no: string;
  id: string;
  accountholder: string;
}

export interface commoditylistss {
  id: string;
  name: string;
}

export interface approverListss {
  full_name: string;
  id: number;
}
export interface branchListss {
  id: any;
  name: string;
  code: string;
  codename: string;

}

export interface prodlistss {
  code: any;
  id: any;
  name: string;
  uom_id: {
        code: any,
        id: any,
        name: string
        }  
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


export interface productcodelists{
  id:string;
  bsproduct_code:string;
  bsproduct_name:string;
}

export interface SupplierName {
  id: number;
  name: string;
}

export interface taxtypefilterValue {
  id: number;
  subtax: {id: any,name:any,glno:any};
  taxrate: number;
}

export interface paytofilterValue {
  id: string;
  text: string;
}
export interface ppxfilterValue {
  id: string;
  text: string;
}

export interface OriginalInv {
  id: string;
  text: string;
}

export interface cred {
  id: string;
  text: string;
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

@Component({
  selector: 'app-inv-detail-view',
  templateUrl: './inv-detail-view.component.html',
  styleUrls: ['./inv-detail-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe, DecimalPipe
  ]
})
export class InvDetailViewComponent implements OnInit {
  fromecf = false 
  showheaderdata = true
  showinvocedetail = false

  ecfheaderForm: FormGroup
  TypeList: any
  commodityList: Array<commoditylistss>
  uploadList = [];
  images: string[] = [];
  @ViewChild('takeInput', { static: false })
  InputVar: ElementRef;
  ppxList: any
  advancetypeList:any
  payList: any
  isLoading = false;
  attachmentlist: any
  showppxmodal = false
  ppxLoad = true
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
  aptypeid: any 
  crno :any
  paytoid : any
  tomorrow = new Date();
  showviewinvoice = false
  showviewinvoices = false
  showeditinvhdrform = true
  showaddbtn = false
  showaddbtns = true
  disableecfsave = false
  invheadersave = false
  showadddebits = false
  showadddebit = true
  invdtlsave = false
  showdebitpopup = true
  showccbspopup = true
  
  showtaxtypes = [true, true, true,true, true, true,true, true, true]
  showtaxrates = [true, true, true,true, true, true,true, true, true]
  showaddinvheader = false
  hideinv = false

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('commoditytype') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('commodityInput') commodityInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  trueorfalse = [{ 'value': true, 'display': 'True'}, { 'value': false, 'display': 'False'}]
  
  showinvoicediv =true
  showdebitdiv=false
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
  supplierdata: any
//declaration sugu
  // invHdrID=56;
  type1=['exact',
        'supplier',
        'invoice_amount',
        'invoiceno',
        'invoice_date']

  exactList: any;
  withoutSuppList: any;
  withoutInvAmtList: any;
  withoutInvNoList: any;
  withoutInvDtList: any;
  typeid:number;
  data:any=[];
  array:any=[{"auditchecklist":[]}];
  bo:any=[];
  invoicedate:any;
  sta=3;
  cli:boolean=false;
  remark:any;
  rem = new FormControl('', Validators.required);

  showthreshold = false
  // Approverlist: Array<approverListss>;
  // Branchlist: Array<branchListss>;
  SubmitoverallForm: FormGroup

  submitoverallbtn = false
  ECFData: any
  tdsList: any
  // @ViewChild('branchtype') matbranchAutocomplete: MatAutocomplete;
  // @ViewChild('branchInput') branchInput: any;
  // @ViewChild('approvertype') matappAutocomplete: MatAutocomplete;
  // @ViewChild('approverInput') approverInput: any;
auditflage:boolean=false;
dedupflage:boolean=false;
  invoiceheaderdetailForm: FormGroup
  InvoiceDetailForm: FormGroup

  creditdetForm: FormGroup
  prodList: Array<prodlistss>
  hsnList: Array<hsnlistss>
  uomList: Array<uomlistss>
  @ViewChild('hsntype') mathsnAutocomplete: MatAutocomplete;
  @ViewChild('productInput') productInput: any;
  @ViewChild('prodAutocom') matProdAutocomplete: MatAutocomplete;
  @ViewChild('hsnInput') hsnInput: any;
  @ViewChild('uomtype') matuomAutocomplete: MatAutocomplete;
  @ViewChild('uomInput') uomInput: any;
  @ViewChild('taxtype') mattactypeAutocomplete: MatAutocomplete;
  @ViewChild('taxtypeInput') taxtypeInput: any;
  hsncodess: any
  totaltax: any
  indexDet: any
  invoicedetailsdata: any
  ccbsdata: any
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
  gsttype: any
  type: any

  ecfheaderidd: any


  creditglForm: FormGroup
  accList: any
  showaccno = [false, false, false,false, false, false,false, false, false]
  creditbrnchList: any
  credittranList: any
  showtranspay = [false, false, false,false, false, false,false, false, false]
  showtaxtype = [false, false, false,false, false, false,false, false, false]
  showtaxrate = [false, false, false,false, false, false,false, false, false]
  showeraacc = [false, false, false,false, false, false,false, false, false]
  readonlydebit = [false, false, false,false, false, false,false, false, false]
  showglpopup = false
  glList: any
  taxlist: any
  taxratelist: any
  taxrate: number =0

  getcredit = true 
  paymodesList: any
 
  PaymodeList: any
  payableSelected =false
  debbankList:any
  addcreditindex: any 
  @ViewChild('debitclosebtn') debitclosebtn;
  @ViewChild('closebutton') closebutton;
  @ViewChild('closebuttons') closebuttons;
  @ViewChild('ccbsOpen') ccbsOpen;

  @ViewChild('ccbsclose') ccbsclose;
  @ViewChild('auditclose') auditclose;


  @ViewChild('paymode_id') matpaymodeAutocomplete: MatAutocomplete;
  @ViewChild('paymodeInput') paymodeInput: any;
  @ViewChild('debbank') matdebbankAutocomplete: MatAutocomplete;
  @ViewChild('debbankInput') debbankInput: any;
 

  @ViewChild('cattype') matcatAutocomplete: MatAutocomplete;
  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('subcategorytype') matsubcatAutocomplete: MatAutocomplete;
  @ViewChild('subcategoryInput') subcategoryInput: any;
  @ViewChild('producttype') matproductAutocomplete: MatAutocomplete;
  @ViewChild('bsproductInput') bsproductInput: any;
  @ViewChild('bstype') matbsAutocomplete: MatAutocomplete;
  @ViewChild('bsInput') bsInput: any;
  @ViewChild('cctype') matccAutocomplete: MatAutocomplete;
  @ViewChild('ccInput') ccInput: any;
  @ViewChild('closeppxbutton') closeppxbutton;
  @ViewChild('uploadinput') uploadinput: any;
 

  inwardHdrNo = this.shareservice.inwardHdrNo.value
 
  DebitDetailForm: FormGroup
  ccbsForm: FormGroup
  categoryNameData: Array<catlistss>;
  subcategoryNameData: Array<subcatlistss>;
  bsNameData: Array<bslistss>;
  ccNameData: Array<cclistss>;
  businesslist:Array<productcodelists>
   catid: any
  bssid: any
  name:any;
  designation:any;
  branch:any;

  SGST = false
  CGST = false
  IGST = false
  invoicenumber: any
  value: any
  invtotamount: any
  invtaxamount: any
  invtaxableamount: any
  invdate: any
  invgst: any
  raisorbranchgst: any
  inputSUPPLIERgst: any

  SupplierDetailForm: FormGroup

  showsuppname = true
  showsuppgst = true
  showsuppstate = true
  ppxdata:any
  ppxForm:FormGroup
  raisedbyid:any


  
  presentpage: number = 1;
  identificationSize: number = 10;
  
  originalInv:Array<OriginalInv>;
  @ViewChild('OriginalInvInput') OrgInvInput: any;
  @ViewChild('isOriginalInv') OriginalInvAutoComplete: MatAutocomplete;
  
  apHdrRes : any
  invHdrRes:any;
  invDetailList:any;
  invDebitList:any;
  invDebitTot:number;
  invCreditList:any;
  invCreditTot:number;
  getgstapplicable: any
  gstAppl :boolean
  
  apheader_id=this.shareservice.apheader_id.value;
  apinvHeader_id=this.shareservice.apinvHeader_id.value;
  // apheader_id=260
  // apinvHeader_id=159
  frmInvHdr: FormGroup;
  getinvoiceheaderresults: any
  creditid: any;
  invDetails:any={}
  invDet:any
  invCredDet:any
  quelength:any;
  invdtlsaved:boolean = false
  debitsaved:boolean = false
  creditsaved:boolean = false
  ccbssaved:boolean = false
  viewtrnlist:any=[];
  supplierGSTflag : boolean 
  supplierGSTType :string
  productRCMflag = false
  invdtls : any 

  constructor(private service: ApService, private router: Router,  private formBuilder: FormBuilder,private toastr: ToastrService,public datepipe: DatePipe, 
    private shareservice: ApShareServiceService, private spinner:NgxSpinnerService,private notification: NotificationService,private service1: Ap1Service,
    private activatedroute : ActivatedRoute, private decimalpipe: DecimalPipe ) { }

  ngOnInit(): void {
    this.activatedroute.queryParams.subscribe(
      params => {
        if(params)
        {
          this.supplierGSTflag = params.supplierGSTflag
          this.supplierGSTType = params.supplierGSTType        
        }
      })
    
      this.frmInvHdr=this.formBuilder.group({
      rsrCode:new FormControl(''),
      rsrEmp:new FormControl(''),
      gst:new FormControl(''),

      supCode:new FormControl(''),
      supName:new FormControl(''),
      supGST:new FormControl(''),

      invNo:new FormControl(''),
      invDate:new FormControl(''),
      taxableAmt:new FormControl(''),
      invAmt:new FormControl(''),
     
    })

    this.InvoiceDetailForm = this.formBuilder.group({
      roundoffamt :[''],     
      invoicedtls: new FormArray([
      ]),
      
      creditdtl: new FormArray([
      ])
    });

    this.creditdetForm = this.formBuilder.group({
      supName:new FormControl(''),
      isexcempted:new FormControl(''),
      TDSSection: new FormControl(''),
      TDSRate: new FormControl(''),
      thresholdValue: new FormControl(''),
      amountPaid:new FormControl(''),
      normaltdsRate:new FormControl(''),
      balThroAmt: new FormControl(''),
      bankdetails_id:new FormControl(''),
    }),

    this.DebitDetailForm = this.formBuilder.group({

      debitdtl: new FormArray([
      ])
    });

    this.ccbsForm = this.formBuilder.group({

      ccbsdtl: new FormArray([
      ])
    })
    

    this.creditglForm = this.formBuilder.group({
      name: [''],
      glnum: ['']

    })

    this.ppxForm = this.formBuilder.group({
      ppxdtl: new FormArray([
      ])
    })


    this.gethsn('')
    this.getProduct('')
    this.getPaymodes()
   
    this.SubmitoverallForm = this.formBuilder.group({
      apheader_id: [''],
      approver_branch: [''],
      approved_by: [''],
      aptype: [''],
      tds: [''],
      remarks: [''],
      remark: ['']
    })

    this.getApHdr();
  }

  getApHdr()
  {
    this.spinner.show(); 
    this.service.getHdrSummary(this.apheader_id)
    .subscribe(result => {  
      if (result.code == undefined)
      { 
        this.apHdrRes = result
        let apres = this.apHdrRes

        if(apres.apinvoiceheader[0].entry_flag == 1)
        {
          this.creditEntryFlag = 1
        }
        else
        {
          this.creditEntryFlag = 0
        }
        this.aptypeid = apres.aptype.id
        this.crno = apres.crno
        this.paytoid = apres.payto.id
        this.raisedbyid = apres.raisedby.id
        if (apres.crno !== null && apres.crno !== undefined && apres.crno !== "")
        {
          this.fromecf = true
          this.SubmitoverallForm.patchValue(
            {
              apheader_id : apres.id,
              approver_branch : apres.approver_branch.name,
              approved_by: apres.approvername,
              aptype: apres.aptype.id,
              tds: apres.tds.text,
              remarks: apres.remark
            })
        }
        else
        {
          this.fromecf = false
          this.SubmitoverallForm.patchValue(
            {
              apheader_id : apres.id,
              aptype: apres.aptype.id,
            })
        }
       
        this.service.getInvHdr(this.apinvHeader_id)
        .subscribe(result => {
          if(result.code == undefined){
            let data=result
            this.invHdrRes=data
            this.getInvHdr(); 
          }
          else
          {
            console.log("Error while fetching Invoice Header.")
            this.spinner.hide();  
          }
  
        },error=>{
          console.log("Error while fetching Inv Header data")
          this.spinner.hide();  
        }            
        )
        this.invdtls = this.apHdrRes.apinvoiceheader[0].apinvoicedetails
      }
      else
      {
        console.log("Error while fetching AP Header data")
        this.spinner.hide();  
      }
    })
    
    
  }

  creditEntryFlag = 0
  checkAdvance = false
  getInvHdr()
  {  
     if (this.invHdrRes !==undefined && this.invHdrRes!==null)
      {
        let num: number = +this.invHdrRes.totalamount;
        let amt = new Intl.NumberFormat("en-GB").format(num); 
        amt = amt ? amt.toString() : '';

        num = +this.invHdrRes.invoice_amount;
        let taxableamt = new Intl.NumberFormat("en-GB").format(num); 
        taxableamt = taxableamt ? taxableamt.toString() : '';
        this.frmInvHdr.patchValue(
          {
            rsrCode:"",
            rsrEmp:this.invHdrRes.raiser_employeename,
            
            supCode:this.invHdrRes.supplier?.code,
            supName:this.invHdrRes.supplier?.name,
            supGST:this.invHdrRes.supplier?.gstno,

            invNo:this.invHdrRes.invoice_no,
            invDate:this.datepipe.transform(this.invHdrRes.invoice_date,'dd-MMM-yyyy'),
            invAmt:amt,
            taxableAmt:taxableamt,
            gst:this.invHdrRes.invoicegst,
          }           
        )
        this.InvoiceDetailForm.patchValue({roundoffamt: this.invHdrRes.roundoffamt})
        
        this.creditdetForm.patchValue({supName : this.invHdrRes.supplier?.name})
        this.gsttype = this.supplierGSTType
        this.type = this.supplierGSTType
        this.typeid= this.invHdrRes.invoicetype.id
        this.invoicedate=this.invHdrRes.invoice_date
        this.Roundoffsamount = this.invHdrRes.roundoffamt
       
        //this.aptype = this.invHdrRes.invoicetype
    
        this.getgstapplicable = this.invHdrRes.invoicegst
        if(this.getgstapplicable == "Y")
        {
          this.gstAppl = true
        }
        else
        {
          this.gstAppl = false
        }
   
        //this.invheadertotamount = this.invHdrRes.totalamount
        //this.totalamount = this.invHdrRes.totalamount
        this.suppid = this.invHdrRes.supplier?.id
        let invamount = Number(this.invHdrRes.invoice_amount)
        this.totalamount = Number(this.invHdrRes.totalamount)
        let roundamount = Number(this.invHdrRes.roundoffamt)
        this.taxableamount = invamount
        // this.taxableamount = this.invHdrRes.invoice_amount

        this.invoiceno = this.invHdrRes.invoice_no

        let id
        if(this.aptypeid == 2){
          id = {"supplier_id":this.suppid}
        }
        else if(this.aptypeid == 3)
        {
          id={"raisedby": this.raisedbyid}
        }

        if(id != undefined)
        {
          this.ppxdata =[]
          this.service.ppxheader(id).subscribe(result=>{
            if(result)
            {
              let datas = result['data']
              let ppxdata = datas.filter(x => (Number(x.AP_liquedate_limit) > 0 ))  
              for(let i=0; i<ppxdata.length; i++)
              {
                let ppxdetails = ppxdata[i].ppxdetails.data
                let current_crno
                if(ppxdetails.length>0)
                  {
                    current_crno = ppxdetails.filter(x => x.current_crno == this.crno)[0]?.current_crno
                    if(current_crno == undefined && ppxdata[i].liquedate_limit <=0)
                    {
                      delete ppxdata[i]
                      continue;
                    }
                      if(ppxdata[i].AP_liquedate_limit < ppxdata[i].liquedate_limit)
                      {
                        ppxdata[i].AP_liquedate_limit = ppxdata[i].liquedate_limit
                      }                      
                    }                
              }
              console.log("ppxdata----", ppxdata)   
              for(let i=0; i<ppxdata.length; i++)
              {
                if(ppxdata[i] != undefined)
                this.ppxdata.push(ppxdata[i])
              }  
              if (this.ppxdata.length >0)    
              {
                this.checkAdvance = true
              }    
              else
              {
                this.checkAdvance = false
              }
            }
          })
        }

        this.service.getInvDetail(this.apinvHeader_id)
        .subscribe(result => {
          let data=result?.["data"];
          if (data != undefined)
          {          
          this.invDetailList =data
          console.log("Invoice Detail ",this.invDetailList);  
          if(this.aptypeid !== 4)
          {
            this.getinvoicedtlrecords();         
  
            this.service.getInvCredit(this.apinvHeader_id)
            .subscribe(result => {
              if (result)
                {
                  this.creditres = result.data;
                  this.invCreditList =result.data;
                  console.log("Invoice Credit Detail ",this.invCreditList);  
                  let invCreditList1 = this.invCreditList.filter(x => (x.is_display == "YES" && (
                                                                                                  ( x.amount>0 && !(x.paymode.id ==7 || x.paymode.gl_flag=='Payable') || 
                                                                                                    x.amount >= 0 && (x.paymode.id ==7 || x.paymode.gl_flag=='Payable')
                                                                                                  )
                                                                                                )
                                                                      )
                                                                );
                  console.log("Invoice Credit Detail ",invCreditList1);  
                  this.getcreditrecords(invCreditList1); 
                  this.spinner.hide(); 
                  if(this.checkAdvance == true) 
                  {
                    this.notification.showInfo("Please Check for Advance");
                  }
                }       
              },error=>{
                console.log("Inv Credit Detail data not found")
                this.spinner.hide();  
              }            
            ) 
          }
          else
          {
            if(this.invDetailList.length >1)
            {
              this.toastr.error('There exists more than one Invoice Details.');
              this.router.navigate(['/ap/apHeader'], {queryParams:{comefrom : "apsummary", apheader_id : this.apheader_id}, skipLocationChange: true });
              return false
            }
            this.invtotamount = this.totalamount
            this.debitEntryFlag[0] = this.invDetailList.map(x => x.entry_flag)[0]
            this.invdtladdonid = this.invDetailList.map(x => x.id)[0]

            if(this.debitEntryFlag[0] == 0)
            {
              this.service.entryDebit({invoiceheader_id : this.apinvHeader_id, invoicedetails_id : this.invdtladdonid})
              .subscribe(result => {  
                if (result.status == "success")
                {
                  let det ={"entry_flag" : 1}
                  this.service.updateDebEntryFlag(this.invdtladdonid, det)
                  .subscribe(result => {
                    console.log("Debit entry flag update--", result)
                    if(result)
                    {
                      this.debitEntryFlag[0] =1 
                      this.service.getInvDebit(this.apinvHeader_id)
                      .subscribe(result => {
                        if (result)
                          {
                            let data = result["data"];
                            this.getdebittdatas =data.filter(x => x.amount > 0)
                            this.getdebitrecords(this.getdebittdatas)
                            this.spinner.hide();  
                          }       
                        },error=>{
                          console.log("Debit Detail data not found")
                          this.spinner.hide();  
                        }            
                      ) 
                    }
                  })
                }
                else
                {
                  this.spinner.hide();
                  this.toastr.warning(result.message)
                }              
              })   
            }
            else
            {
              this.service.getInvDebit(this.apinvHeader_id)
              .subscribe(result => {
                if (result)
                  {
                    let data = result["data"];
                    this.getdebittdatas =data.filter(x => x.amount > 0)
                    this.getdebitrecords(this.getdebittdatas)
                    this.spinner.hide();  
                  }       
                },error=>{
                  console.log("Debit Detail data not found")
                  this.spinner.hide();  
                }            
              ) 
            }
                       
            if(this.creditEntryFlag  == 0)
            {
              this.service.entryCredit({invoiceheader_id : this.apinvHeader_id, invoicedetails_id : "0"})
              .subscribe(result => {
              if (result)
              {  
                console.log("entry Credit result --",result)
                if(result.status !== "success")
                {
                  this.spinner.hide();
                  this.toastr.warning(result.message)
                }     
                else
                {
                  let det ={"entry_flag" : 1}
                  this.service.updateCredEntryFlag(this.apinvHeader_id, det)
                  .subscribe(result => {
                    console.log("credit entry flag update--", result)
                    if(result)
                    {
                      this.creditEntryFlag =1
                      this.service.getInvCredit(this.apinvHeader_id)
                      .subscribe(result => {
                        if (result)
                          {
                            this.creditres = result.data;
                            this.invCreditList =result.data;
                            console.log("Invoice Credit Detail ",this.invCreditList);  
                            let invCreditList1 = this.invCreditList.filter(x => (x.is_display == "YES" && (
                                                                                                  ( x.amount>0 && !(x.paymode.id ==7 || x.paymode.gl_flag=='Payable') || 
                                                                                                    x.amount >= 0 && (x.paymode.id ==7 || x.paymode.gl_flag=='Payable')
                                                                                                  )
                                                                                                )
                                                                      )
                                                                );
                            console.log("Invoice Credit Detail ",invCreditList1);  
                            this.getcreditrecords(invCreditList1); 
                            this.spinner.hide();                       
                          }       
                        },error=>{
                          console.log("Inv Credit Detail data not found")
                          this.spinner.hide();  
                        }            
                      )
                    }
                  })
                }
               }
              })
            }
            else
            {  
              this.service.getInvCredit(this.apinvHeader_id)
              .subscribe(result => {
                if (result)
                  {
                    this.creditres = result.data;
                    this.invCreditList =result.data;
                    console.log("Invoice Credit Detail ",this.invCreditList);  
                    let invCreditList1 = this.invCreditList.filter(x => (x.is_display == "YES" && (
                                                                                                  ( x.amount>0 && !(x.paymode.id ==7 || x.paymode.gl_flag=='Payable') || 
                                                                                                    x.amount >= 0 && (x.paymode.id ==7 || x.paymode.gl_flag=='Payable')
                                                                                                  )
                                                                                                )
                                                                      )
                                                                );
                    console.log("Invoice Credit Detail ",invCreditList1);  
                    this.getcreditrecords(invCreditList1); 
                    this.spinner.hide();  
                  }       
                },error=>{
                  console.log("Inv Credit Detail data not found")
                  this.spinner.hide();  
                }            
              )
            }
            
        
          }
          }        
          },error=>{
            console.log("Error in getting Inv Detail")
            this.spinner.hide();  
          }            
        )
      }
      else{
        this.toastr.error('Invoice Hdr not available');
        return false;
        this.spinner.hide();  
      }

  }
  hsnindex: any
  getindex(index) {
    // console.log("hsnnn", this.hsnindex)
    this.hsnindex = index

  }

  NOHSN : any
  debitEntryFlag = [0,0,0,0,0,0,0]
  getinvoicedtlrecords() {
    let datas=this.invDetailList
    
    this.service.gethsn("nohsn")
    .subscribe((results: any[]) => {
      this.NOHSN = results["data"][0];
      console.log("NOHSN", this.NOHSN)
    })
    if (datas.length==0){
      console.log("data invoice details ---->",datas)
      return false
    }
    else
    {
    this.totalamount = 0 
    let i=0
    
    for (let details of datas) {
      let id: FormControl = new FormControl('');
      let description: FormControl = new FormControl('');
      let productcode: FormControl = new FormControl('');
      let productname: FormControl = new FormControl('');
      let hsn: FormControl = new FormControl('');
      let hsn_percentage: FormControl = new FormControl('');
      let uom: FormControl = new FormControl('');
      let unitprice: FormControl = new FormControl(0);
      let quantity: FormControl = new FormControl(0);
      let amount: FormControl = new FormControl(0);
      let cgst: FormControl = new FormControl(0);
      let sgst: FormControl = new FormControl(0);
      let igst: FormControl = new FormControl(0);
      let discount: FormControl = new FormControl(0);
      let taxamount: FormControl = new FormControl(0);
      let totalamount: FormControl = new FormControl(0);
      let roundoffamt: FormControl = new FormControl('');
      let otheramount: FormControl = new FormControl(''); 
      let is_capitalized: FormControl = new FormControl(0)
      let entry_flag: FormControl = new FormControl(0)

      const invdetFormArray = this.InvoiceDetailForm.get("invoicedtls") as FormArray;

      if(details.entry_flag == 1)
      {
        this.debitEntryFlag[i] =1
      }
      else
      {
        this.debitEntryFlag[i] =0
      }
      id.setValue(details.id)
      productcode.setValue(details.productcode)
      this.service.getproduct(details.productcode)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let prod = datas;
        if(prod.product_isrcm == "Y")
        {
          this.productRCMflag = true
        }
      })
      productname.setValue({code:details.productcode,name:details.productname})
      description.setValue(details.description)
      if(details.hsn.code == "UNEXPECTED_ERROR")
      {
        hsn.setValue("")
        hsn_percentage.setValue("")  
        cgst.setValue(0)
        sgst.setValue(0)
        igst.setValue(0)   
        taxamount.setValue(0)  
      }
      else if(details.hsn?.Status == "Failed")
      {
        hsn.setValue("NO HSN")
        hsn_percentage.setValue(0) 
        cgst.setValue(0)
        sgst.setValue(0)
        igst.setValue(0)
        taxamount.setValue(0)
      }
      else
      {
        hsn.setValue(details.hsn)
        hsn_percentage.setValue(details.hsn_percentage) 
        let num = +details.cgst;
        let cgstt = new Intl.NumberFormat("en-GB").format(num); 
        cgstt = cgstt ? cgstt.toString() : '';
        cgst.setValue(cgstt)

        num = +details.sgst;
        let sgstt = new Intl.NumberFormat("en-GB").format(num); 
        sgstt = sgstt ? sgstt.toString() : '';
        sgst.setValue(sgstt)

        num = +details.igst;
        let igstt = new Intl.NumberFormat("en-GB").format(num); 
        igstt = igstt ? igstt.toString() : '';
        igst.setValue(igstt) 

        num = +details.taxamount;
        let tax = new Intl.NumberFormat("en-GB").format(num); 
        tax = tax ? tax.toString() : '';
        taxamount.setValue(tax)
      }
      uom.setValue(details.uom.uom)

      let num: number = +details.unitprice;
      let up = new Intl.NumberFormat("en-GB").format(num); 
      up = up ? up.toString() : '';
      unitprice.setValue(up)

      num = +details.quantity;
      let qty = new Intl.NumberFormat("en-GB").format(num); 
      qty = qty ? qty.toString() : '';
      quantity.setValue(qty)

      num = +details.amount;
      let amt = new Intl.NumberFormat("en-GB").format(num); 
      amt = amt ? amt.toString() : '';
      amount.setValue(amt)

      num = +details.discount;
      let dis = new Intl.NumberFormat("en-GB").format(num); 
      dis = dis ? dis.toString() : '';
      discount.setValue(dis)

      num = +details.totalamount;
      let tot = new Intl.NumberFormat("en-GB").format(num); 
      tot = tot ? tot.toString() : '';
      totalamount.setValue(tot)

      roundoffamt.setValue(details.roundoffamt)
      otheramount.setValue(details.otheramount)
      entry_flag.setValue(details.entry_flag)
      if(details.is_capitalized == 0)
      {
        is_capitalized.setValue(false)     
      }
      else
      {
        is_capitalized.setValue(true)     
      }
          
      this.totalamount += details.totalamount

      invdetFormArray.push(new FormGroup({
        id: id,
        productcode: productcode,
        productname: productname,
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
        roundoffamt:roundoffamt,
        otheramount:otheramount,
        is_capitalized:is_capitalized,
        entry_flag : entry_flag
      }))

      hsn.valueChanges
      .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.service.gethsnscroll(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
            if (value === "") {

              this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('hsn_percentage').reset()
              this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('cgst').reset(0)
              this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('sgst').reset(0)
              this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('igst').reset(0)
              this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('taxamount').reset(0)
              this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount)

            }
          }),

        )

      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.hsnList = datas;
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
    })

    productname.valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.service.getproduct(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.prodList = datas;
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
    })

  this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount)


  unitprice.valueChanges.pipe(
    debounceTime(20)
  ).subscribe(value => {
    // this.calcTotalM(value)
    this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount)
    if (!this.InvoiceDetailForm.valid) {
      return;
    }

    this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
  }
  )

  quantity.valueChanges.pipe(
    debounceTime(20)
  ).subscribe(value => {
    // this.calcTotalM(value)
    this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount)
    if (!this.InvoiceDetailForm.valid) {
      return;
    }

    this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
  }
  )

  amount.valueChanges.pipe(
    debounceTime(20)
  ).subscribe(value => {
    // this.calcTotalM(value)
    this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount)
    if (!this.InvoiceDetailForm.valid) {
      return;
    }

    this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
  }
  )

  taxamount.valueChanges.pipe(
    debounceTime(20)
  ).subscribe(value => {
    // this.calcTotalM(value)
    this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount)
    if (!this.InvoiceDetailForm.valid) {
      return;
    }

    this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
  }
  )


  totalamount.valueChanges.pipe(
    debounceTime(20)
  ).subscribe(value => {
    // this.calcTotalM(value)
    this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount)
    if (!this.InvoiceDetailForm.valid) {
      return;
    }

    this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
  }
  )

  discount.valueChanges.pipe(
    debounceTime(20)
  ).subscribe(value => {
    // this.calcTotalM(value)
    this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount)
    if (!this.InvoiceDetailForm.valid) {
      return;
    }

    this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
  }
  )
  i++;
  }

  this.cdtsum = this.totalamount
  }
}

previousCharCode : any =0
charCode : any = 0
getCharCode(e)
{
  this.previousCharCode = this.charCode
  this.charCode = (e.which) ? e.which : e.keyCode;
}

invDtlChangeToCurrency(ctrlname, i) {   
  if(this.charCode  != 46 && !(this.previousCharCode ==46 && this.charCode == 48))
  {
    let a = this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get(ctrlname).value;
    a = a.replace(/,/g, "");
    if (a && !isNaN(+a)) 
    {
      let num: number = +a;
      let temp = new Intl.NumberFormat("en-GB", {style: 'decimal'}).format(num); 
      temp = temp ? temp.toString() : '';
      this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get(ctrlname).setValue(temp)      
    }
  }
}

creditChangeToCurrency(ctrlname, i) {   
  if(this.charCode  != 46 && !(this.previousCharCode ==46 && this.charCode == 48))
  {
    let a = this.InvoiceDetailForm.get('creditdtl')['controls'][i].get(ctrlname).value;
    a = a.replace(/,/g, "");
    if (a && !isNaN(+a)) 
    {
      let num: number = +a;
      let temp = new Intl.NumberFormat("en-GB", {style: 'decimal'}).format(num); 
      temp = temp ? temp.toString() : '';
      this.InvoiceDetailForm.get('creditdtl')['controls'][i].get(ctrlname).setValue(temp)      
    }
  }
}

debitChangeToCurrency(i) {   
  if(this.charCode  != 46 && !(this.previousCharCode ==46 && this.charCode == 48))
  {
    let a = this.DebitDetailForm.get('debitdtl')['controls'][i].get('amt').value; 
    a = a.replace(/,/g, "");
    if (a && !isNaN(+a)) 
    {
      let num: number = +a;
      let temp = new Intl.NumberFormat("en-GB", {style: 'decimal'}).format(num); 
      temp = temp ? temp.toString() : '';
      this.DebitDetailForm.get('debitdtl')['controls'][i].get('amt').setValue(temp)   
    }
  }
  let a = this.DebitDetailForm.get('debitdtl')['controls'][i].get('amt').value;
  this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(a)
}

ccbsChangeToCurrency(i) {   
  if(this.charCode  != 46 && !(this.previousCharCode ==46 && this.charCode == 48))
  {
    let a = this.ccbsForm.get('ccbsdtl')['controls'][i].get('amount').value; 
    a = a.replace(/,/g, "");
    if (a && !isNaN(+a)) 
    {
      let num: number = +a;
      let temp = new Intl.NumberFormat("en-GB", {style: 'decimal'}).format(num); 
      temp = temp ? temp.toString() : '';
      this.ccbsForm.get('ccbsdtl')['controls'][i].get('amount').setValue(temp)   
    }
  }
}

ppxChangeToCurrency(i) {    
  if(this.ppxLoad == false) 
  {
    if(this.charCode  != 46 && !(this.previousCharCode ==46 && this.charCode == 48))
    {
      let a = String(this.ppxForm.get('ppxdtl')['controls'][i].get('liquidate_amt').value); 
      a = a.replace(/,/g, "");
      if (a && !isNaN(+a)) 
      {
        let num: number = +a;
        let temp = new Intl.NumberFormat("en-GB", {style: 'decimal'}).format(num); 
        temp = temp ? temp.toString() : '';
        this.ppxForm.get('ppxdtl')['controls'][i].get('liquidate_amt').setValue(temp)   
      }
    }
  }  
}

reductionflag = false
getcreditrecords(datas) {
  this.selectedppxdata=[]
  let dta = this.InvoiceDetailForm.value.creditdtl
   console.log("datas",datas);
  let creditdet= datas;
  let i=0
  // this.taxableamount = 0
  for (let data of creditdet) {
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
    let bankdetails_id: FormControl = new FormControl('');

    const creditdetailformArray = this.InvoiceDetailForm.get("creditdtl") as FormArray;

    if(i==0)
    {
      
      this.creditdetForm.patchValue(
        {
        bankdetails_id : data.bankdetails? data.bankdetails : undefined  })
    }
    id.setValue(data.id)
    invoiceheader_id.setValue(data.apinvoiceheader)
    paymode_id.setValue(data.paymode)
   
    creditbank_id.setValue(data.creditbank_id)
    this.creditids = data.creditbank_id
    suppliertax_id.setValue(data.suppliertax_id)
    creditglno.setValue(data.creditglno)

    suppliertaxtype.setValue(data.suppliertaxtype)
    suppliertaxrate.setValue(data.suppliertaxrate)
    taxexcempted.setValue(data.taxexcempted)

    let num: number = +data.amount
    let amt = new Intl.NumberFormat("en-GB").format(num); 
    amt = amt ? amt.toString() : '';
    amount.setValue(amt)

    num = +data.taxableamount
    let taxbleamt = new Intl.NumberFormat("en-GB").format(num); 
    taxbleamt = taxbleamt ? taxbleamt.toString() : '';
    taxableamount.setValue(taxbleamt)

    ddtranbranch.setValue(data.ddtranbranch)
    ddpaybranch.setValue(data.ddpaybranch)
    this.categoryid = data.category_code
    category_code.setValue(data.category_code) 
    this.subcategoryid = data.subcategory_code
    subcategory_code.setValue(data.subcategory_code)  
   
    this.bankdetailsids = data.bankdetails
    bankdetails_id.setValue(data.bankdetails)         

    console.log("data.paymode.gl_flag==",data.paymode.gl_flag)
    if (data.paymode.gl_flag == "Payable")
    {
       let pay_to = data.pay_to

      let accdet 
      if(pay_to == "S")
      {
        if(data?.supplierpayment_details  == null || data?.supplierpayment_details == undefined)
        {
          this.notification.showError("Supplier Account Information not available.  Account No. " +data.creditrefno +" is deactivated. Please select the Account detail")
          accno.setValue("")   
          creditrefno.setValue("")   
          bank.setValue("")
          ifsccode.setValue("")
          branch.setValue("")
          benificiary.setValue("")
        }
        else if(data.supplierpayment_details.data?.length <1)
        {
          this.notification.showError("Supplier Account Information not available.  Account No. " +data.creditrefno +" is deactivated. Please select the Account Detail")
          accno.setValue("")   
          creditrefno.setValue("")   
          bank.setValue("")
          ifsccode.setValue("")
          branch.setValue("")
          benificiary.setValue("")
        }
        else
        {
          accdet = data.supplierpayment_details["data"][0] 
  
          // let accNo = accdet?.account_no
          // if(accNo  == null || accNo == undefined)
          // {
          //   this.notification.showError("Supplier Account No. not available.")
          //   accno.setValue("")
          //   creditrefno.setValue("") 
          // }
          // else
          // {
            accno.setValue(accdet?.account_no)              
            creditrefno.setValue(accdet?.account_no)    
          // }
          // let bankname = accdet?.bank_id.name ? accdet?.bank_id.name : undefined
          // if(bankname  == null || bankname == undefined)
          // {
          //   this.notification.showError("Supplier Bank Name not available.")
          //   bank.setValue("") 
          // }
          // else
          // {
            bank.setValue(accdet?.bank_id?.name)              
          // }
          
          // let ifsc = accdet?.branch_id?.ifsccode ? accdet?.branch_id?.ifsccode : undefined
          // if(ifsc  == null || ifsc == undefined)
          // {
          //   this.notification.showError("Supplier IFSC Code not available.")
          //   ifsccode.setValue("")
          // }
          // else
          // {
            ifsccode.setValue(accdet?.branch_id?.ifsccode)
          // }
          // let bankbranch = accdet?.branch_id?.name ? accdet?.branch_id?.name : undefined
          // if(bankbranch  == null || bankbranch == undefined)
          // {
          //   this.notification.showError("Supplier Bank branch not available.")
          //   branch.setValue("")
          // }
          // else
          // {
            branch.setValue(accdet?.branch_id?.name)
          // }
          // let benficiary = accdet?.beneficiary ? accdet?.beneficiary : undefined
          // if(benficiary  == null || benficiary == undefined)
          // {
          //   this.notification.showError("Beneficiary Name not available.")
          //   benificiary.setValue("")
          // }
          // else
          // {
            benificiary.setValue(accdet?.beneficiary)
          // }
        }        
      }
      else if(pay_to == "E")
      {
        if(data?.employee_account_dtls  == null || data?.employee_account_dtls == undefined)
        {
          this.notification.showError("Employee Account Information not available.  Account No. " +data.creditrefno +" is deactivated. Please select the Account Detail")
          accno.setValue("")    
          creditrefno.setValue("")   
          bank.setValue("") 
          ifsccode.setValue("")
          branch.setValue("")
          benificiary.setValue("")
        }
        else if(data?.employee_account_dtls.data?.length < 1)
        {
          this.notification.showError("Employee Account Information not available.  Account No. " +data.creditrefno +" is deactivated. Please select the Account Detail")
          accno.setValue("")  
          creditrefno.setValue("")     
          bank.setValue("") 
          ifsccode.setValue("")
          branch.setValue("")
          benificiary.setValue("")
        }
        else
        { 
          accdet  = data.employee_account_dtls
          // let accNo = accdet?.account_number ? accdet?.account_number : undefined
          // if(accNo  == null || accNo == undefined)
          // {
          //   this.notification.showError("Employee Account No. not available.")
          //   accno.setValue("")
          //   creditrefno.setValue("") 
          // }
          // else
          // {
          accno.setValue(accdet?.account_number)               
          creditrefno.setValue(accdet?.account_number)   
          // }
          // let bankname = accdet?.bank_name ? accdet?.bank_name : undefined
          // if(bankname  == null || bankname == undefined)
          // {
          //   this.notification.showError("Employee Bank Name not available.")
          //   bank.setValue("") 
          // }
          // else
          // {
            bank.setValue(accdet?.bank_name)              
          // }
          
          // let ifsc = accdet?.bankbranch?.ifsccode ? accdet?.bankbranch?.ifsccode : undefined
          // if(ifsc  == null || ifsc == undefined)
          // {
          //   this.notification.showError("Employee IFSC Code not available.")
          //   ifsccode.setValue("")
          // }
          // else
          // {
            ifsccode.setValue(accdet?.bankbranch?.ifsccode)
          // }
          // let bankbranch = accdet?.bankbranch?.name ? accdet?.bankbranch?.name : undefined
          // if(bankbranch  == null || bankbranch == undefined)
          // {
          //   this.notification.showError("Employee Bank branch not available.")
          //   branch.setValue("")
          // }
          // else
          // {
            branch.setValue(accdet?.bankbranch?.name)
          // }
          // let benficiary = accdet?.beneficiary_name ? accdet?.beneficiary_name : undefined
          // if(benficiary  == null || benficiary == undefined)
          // {
          //   this.notification.showError("Beneficiary Name not available.")
          //   benificiary.setValue("")
          // }
          // else
          // {
            benificiary.setValue(accdet?.beneficiary_name)
          // }
        }       
      }
    }
    else
    {
      if(data.creditglno != "151515" && data.creditglno != "151516" && data.creditglno != "151517" )  
      {
        num = +data.amount
        let amt = new Intl.NumberFormat("en-GB").format(num); 
        amt = amt ? amt.toString() : '';
        amountchange.setValue(amt)  
      }       
    }

    credittotal.setValue(0)
    if(data.paymode.id == 6)
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
      accno : accno,

      id: id,
      bank: bank,
      branch: branch,
      ifsccode: ifsccode,
      benificiary: benificiary,

      amountchange: amountchange,
      credittotal: credittotal,
      bankdetails_id: bankdetails_id
    }))

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
      debounceTime(500)
    ).subscribe(value => {

      this.amountReduction()
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['creditdtl']);
    }
    )
    if(data.suppliertaxtype !="")
    {
      this.CreditDessss(data.paymode,i, data.suppliertaxtype, true)
    }
    else
    {
      this.CreditDessss(data.paymode,i, "", true)
    }   
   
    i++
  
  }

  let dta1 = this.InvoiceDetailForm.value.creditdtl
 
  if(dta1.length === 0){
    const control = <FormArray>this.InvoiceDetailForm.get('creditdtl');
    control.push(this.creditdetails());

    let num:number = +this.totalamount
    let amt = new Intl.NumberFormat("en-GB").format(num); 
    amt = amt ? amt.toString() : '';
    this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(amt)
  }

  this.getcredit = false 
  this.reductionflag = true
  this.creditdatasums()
  this.amountReduction()
}

indexvalueOninvdetails(index) {
  this.indexDet = index
}

addinvdtlSection() {

    const control = <FormArray>this.InvoiceDetailForm.get('invoicedtls');
    let n = control.length
    control.push(this.INVdetail());
   
    if (this.getgstapplicable === "N") {
      this.InvoiceDetailForm.get('invoicedtls')['controls'][n].get('hsn').setValue("NO HSN");	
      this.InvoiceDetailForm.get('invoicedtls')['controls'][n].get('hsn_percentage').setValue(this.NOHSN.igstrate);
      this.InvoiceDetailForm.get('invoicedtls')['controls'][n].get('sgst').setValue(0)
      this.InvoiceDetailForm.get('invoicedtls')['controls'][n].get('cgst').setValue(0)
      this.InvoiceDetailForm.get('invoicedtls')['controls'][n].get('igst').setValue(0)
      this.InvoiceDetailForm.get('invoicedtls')['controls'][n].get('taxamount').setValue(0)
    }
  }

INVdetail() {
   let group = new FormGroup({
      id: new FormControl(''),
      productcode: new FormControl(''),
      productname: new FormControl(''),
      description: new FormControl(''),
      hsn: new FormControl(''),
      hsn_percentage: new FormControl(''),
      uom: new FormControl(''),
      unitprice: new FormControl(0),
      quantity: new FormControl(0),
      amount: new FormControl(0),
      cgst: new FormControl(0),
      sgst: new FormControl(0),
      igst: new FormControl(0),
      discount: new FormControl(0),
      taxamount: new FormControl(0),
      totalamount: new FormControl(0),
      roundoffamt: new FormControl(0),
      otheramount: new FormControl(0),
      is_capitalized: new FormControl(false)
    });

    group.get('productname').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.service.getproduct(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.prodList = datas;
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
    })

  
    group.get('hsn').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;

        }),
        switchMap(value => this.service.gethsnscroll(value, 1)
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


    // group.get('uom').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.service.uomscroll(value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.uomList = datas;
    //     this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    //   })


    group.get('unitprice').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
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

    group.get('discount').valueChanges.pipe(
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
    return group;
  }

  calcTotalM(group: FormGroup) {
    const Unitprice = +String(group.controls['unitprice'].value).replace(/,/g, '');
    const quantity = +String(group.controls['quantity'].value).replace(/,/g, '');
    const discounts = +String(group.controls['discount'].value).replace(/,/g, '');
    const roundoff = +group.controls['roundoffamt'].value;
    const otheramt = +group.controls['otheramount'].value;
    this.totaltaxable = quantity * Unitprice

    let num: number = +this.totaltaxable 
    let tottax = new Intl.NumberFormat("en-GB").format(num); 
    tottax = tottax ? tottax.toString() : '';
    group.controls['amount'].setValue((tottax), { emitEvent: false });

    let taxamount = +String(group.controls['taxamount'].value).replace(/,/g, '');
    this.overalltotal = this.totaltaxable + taxamount - discounts

    num = +this.overalltotal 
    let tot = new Intl.NumberFormat("en-GB").format(num); 
    tot = tot ? tot.toString() : '';
    group.controls['totalamount'].setValue((tot), { emitEvent: false });
    this.INVdatasums();
  }

  
  public displayFnuom(uomtype?: uomlistss): string | undefined {
    return uomtype ? uomtype.name : undefined;
  }

  get uomtype() {
    return this.InvoiceDetailForm.get('uom');
  }

  getuom(uomkeyvalue) {
    this.service.getuom(uomkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.uomList = datas;
        // console.log("uomList", datas)

      })
  }

  // uomScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matuomAutocomplete &&
  //       this.matuomAutocomplete &&
  //       this.matuomAutocomplete.panel
  //     ) {
  //       fromEvent(this.matuomAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matuomAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matuomAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matuomAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matuomAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.service.uomscroll(this.uomInput.nativeElement.value, this.currentpage + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   if (this.uomList.length >= 0) {
  //                     this.uomList = this.uomList.concat(datas);
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

  public displayFnProduct(product?: prodlistss): string | undefined {
   
      return product ? product.name : undefined;
  }

  getProduct(keyvalue) {
    this.service.getproduct(keyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.prodList = datas;
        console.log("this.prodList..", this.prodList)
      })
  }
 	
  prodChange = [false,false,false,false,false,false]
  productChange(prod:any,ind)	
  {	
    this.prodChange[ind] = true
    console.log("prod value...",prod)	
    console.log(prod.product_isrcm)
    if(prod.product_isrcm == "Y")
    {
      this.productRCMflag = true
    }
    else
    {
      this.productRCMflag = false
    }
    this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('uom').setValue(prod.uom_id.name)	
    
    console.log(this.supplierGSTflag)
    if(this.supplierGSTflag && !(this.productRCMflag == false && this.getgstapplicable =="N"))
    {
      this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('hsn').setValue(prod.hsn_id);	
      this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('hsn_percentage').setValue(prod.hsn_id.igstrate);
      if(this.supplierGSTType !=="")
      {
        this.getgst(ind)
      }
      else
      {
        this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('sgst').setValue(0)
        this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('cgst').setValue(0)
        this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('igst').setValue(0)
        this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('taxamount').setValue(0)        
      }
    }
    if(this.productRCMflag == false && this.getgstapplicable =="N")
      {
        this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('hsn').setValue(this.NOHSN);	
        this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('hsn_percentage').setValue(this.NOHSN.igstrate);
        this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('sgst').setValue(0)
        this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('cgst').setValue(0)
        this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('igst').setValue(0)
        this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('taxamount').setValue(0)
      } 
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
    this.service.gethsn(hsnkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.hsnList = datas;
        console.log("hsnList", datas)
      })
  }

  gethsncode(igstrate, code, ind) {
    this.hsnpercent = igstrate
    this.hsncode = code
    this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('hsn_percentage').setValue(this.hsnpercent)
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
                this.service.gethsnscroll(this.hsnInput.nativeElement.value, this.currentpage + 1)
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

  getgst(index) {
    if(this.aptypeid !== 3 && this.aptypeid !== 4 && this.aptypeid !== 8)
    {
      const overalloffIND = this.InvoiceDetailForm.value.invoicedtls;
      console.log("overalloffIND.....",overalloffIND)
      this.gsttype = this.supplierGSTType
      if(this.prodChange[index] || ( !this.prodChange[index] && this.getgstapplicable ==="Y"))
      {
        this.hsncodess = overalloffIND[index].hsn.code;
        console.log("this.hsncodess...", this.hsncodess)
        let unit = String(overalloffIND[index].unitprice).replace(/,/g, '')
        let units = Number(unit)
        let qtyy:any = Number(String(overalloffIND[index].quantity).replace(/,/g, ''))
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
          || (unit !== "" || unit !== undefined || unit !== null)) 
        {
          let json = {
            "code": this.hsncodess,
            "unitprice": units,
            "qty": qtyy,
            "discount": 0,
            "type": this.gsttype
          }
          console.log("jsoooon", json)
          this.service.GSTcalculation(json)
            .subscribe(result => {
              // console.log("gstttres", result)
              this.igstrate = result.igst
              this.sgstrate = result.sgst
              this.cgstrate = result.cgst
  
              this.totaltax = this.igstrate + this.sgstrate + this.cgstrate
  
              let num:number = +(this.igstrate)
              let igstt = new Intl.NumberFormat("en-GB").format(num); 
              igstt = igstt ? igstt.toString() : '';

              num = +(this.sgstrate)
              let sgstt = new Intl.NumberFormat("en-GB").format(num); 
              sgstt = sgstt ? sgstt.toString() : '';

              num = +(this.cgstrate)
              let cgstt = new Intl.NumberFormat("en-GB").format(num); 
              cgstt = cgstt ? cgstt.toString() : '';

              num = +(this.totaltax)
              let tot = new Intl.NumberFormat("en-GB").format(num); 
              tot = tot ? tot.toString() : '';

              this.InvoiceDetailForm.get('invoicedtls')['controls'][index].get('sgst').setValue(sgstt)
              this.InvoiceDetailForm.get('invoicedtls')['controls'][index].get('cgst').setValue(cgstt)
              this.InvoiceDetailForm.get('invoicedtls')['controls'][index].get('igst').setValue(igstt)
              this.InvoiceDetailForm.get('invoicedtls')['controls'][index].get('taxamount').setValue(tot)
            })
        }
      }
    }
      

     
    // }
  }
  // getgst(data, index) {
  //   // console.log("hsndataaa", data)
  //    if (this.getgstapplicable === "Y" ) {
  //     let overalloffIND = this.InvoiceDetailForm.value.invoicedtls;

  //     this.hsncodess = overalloffIND[index].hsn.code;

  //     let unit = overalloffIND[index].unitprice
  //     let units = Number(unit)
  //     let qtyy = overalloffIND[index].quantity
  //     if (qtyy === null || qtyy === undefined) {
  //       qtyy = 0
  //     }

  //     if ((this.hsncodess === "" || this.hsncodess === undefined || this.hsncodess === null)
  //       || (qtyy === "" || qtyy === undefined || qtyy === null)
  //       || (unit === "" || unit === undefined || unit === null)) {
  //       return false
  //     }


  //     if ((this.hsncodess !== "" || this.hsncodess !== undefined || this.hsncodess !== null)
  //       || (qtyy !== "" || qtyy !== undefined || qtyy !== null)
  //       || (unit !== "" || unit !== undefined || unit !== null)) {

  //       let json = {
  //         "code": this.hsncodess,
  //         "unitprice": units,
  //         "qty": qtyy,
  //         "discount": 0,
  //         "type": this.type
  //       }
  //       // console.log("jsoooon", json)
  //       this.service.GSTcalculation(json)
  //         .subscribe(result => {
  //           // console.log("gstttres", result)
  //           this.igstrate = result.igst
  //           this.sgstrate = result.sgst
  //           this.cgstrate = result.cgst

  //           this.totaltax = this.igstrate + this.sgstrate + this.cgstrate


  //           this.InvoiceDetailForm.get('invoicedtls')['controls'][index].get('sgst').setValue(this.sgstrate)
  //           this.InvoiceDetailForm.get('invoicedtls')['controls'][index].get('cgst').setValue(this.cgstrate)
  //           this.InvoiceDetailForm.get('invoicedtls')['controls'][index].get('igst').setValue(this.igstrate)
  //           this.InvoiceDetailForm.get('invoicedtls')['controls'][index].get('taxamount').setValue(this.totaltax)
  //         })
  //     }
  //    }
  // }

  calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount: FormControl) {
    const Quantity = Number(String(quantity.value).replace(/,/g, ''))
    const unitsprice = Number(String(unitprice.value).replace(/,/g, ''))
    const taxAmount = Number(String(taxamount.value).replace(/,/g, ''))
    const discounts = Number(String(discount.value).replace(/,/g, ''))
    this.totaltaxable = Quantity * unitsprice

    let num: number = +this.totaltaxable 
    let tottax = new Intl.NumberFormat("en-GB").format(num); 
    tottax = tottax ? tottax.toString() : '';
    amount.setValue((tottax),{ emitEvent: false });

    num = +(this.totaltaxable + taxAmount -discounts)
    let tot = new Intl.NumberFormat("en-GB").format(num); 
    tot = tot ? tot.toString() : '';
    this.overalltotal = tot;
    totalamount.setValue((this.overalltotal), { emitEvent: false });
    this.INVdatasums();
  }

  getinvdtlSections(forms) {
    return forms.controls.invoicedtls.controls;
  }

  removeinvdtlSection(i) {
    const control = <FormArray>this.InvoiceDetailForm.get('invoicedtls');
    control.removeAt(i);
    this.INVdatasums()
  }
  Roundoffsamount:any

  INVdatasums() {
    this.INVamt = this.InvoiceDetailForm.value['invoicedtls'].map(x =>Number((String(x.totalamount).replace(/,/g, ''))));
    this.Roundoffsamount = this.InvoiceDetailForm.value.roundoffamt
    let INVsum =  (this.INVamt.reduce((a, b) => a + b,0));
    this.INVsum = INVsum+Number(this.Roundoffsamount)
    this.totalamount = this.INVsum
    console.log('this.INVsum', this.INVsum);  
  }
  invdtladdonid: any
  invdtltaxableamount: any
  invdtloverallamount: any
  invdtltaxamount: any
  cgstval: any
  sgstval: any
  igstval: any
  gettaxrate: any

  adddebits(section, data, index) {
    let invdtldatas = this.invoicedetailsdata

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
    else if (invdtldatas[index].hsn != section.value.hsn.code) {
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
  showdefaultslno :boolean
  showaltslno:boolean
  debitdata : any[]
  isCaptalized : boolean 
  adddebit(section, data, index) {
    
    this.spinner.show();
    this.debitsaved=false

    let datas = this.DebitDetailForm.get('debitdtl') as FormArray
    datas.clear()


    // console.log("debitsec", section)
    if (this.invoicedetailsdata != undefined) {
      let datas = this.invoicedetailsdata[index]
      this.invdtltaxableamount = this.invoicedetailsdata[index].amount
      this.invtotamount = String(this.invoicedetailsdata[index].totalamount).replace(/,/g, '')
      this.invdtltaxamount = this.invoicedetailsdata[index].taxamount
      this.cgstval = this.invoicedetailsdata[index].cgst
      this.sgstval = this.invoicedetailsdata[index].sgst
      this.igstval = this.invoicedetailsdata[index].igst
      this.gettaxrate = this.cgstval + this.sgstval + this.igstval
      this.invdtladdonid = datas.id
      this.isCaptalized =this.invoicedetailsdata[index].is_capitalized
    }
    else {
      let sections = section.value
      this.invdtltaxableamount = sections.amount
      this.invtotamount = String(sections.totalamount).replace(/,/g, '')
      this.invdtltaxamount = sections.taxamount
      this.cgstval = sections.cgst
      this.sgstval = sections.sgst
      this.igstval = sections.igst
      this.gettaxrate = this.cgstval + this.sgstval + this.igstval
      this.invdtladdonid = sections.id
      this.isCaptalized = sections.is_capitalized
    }
    if(this.invdtladdonid == undefined || this.invdtladdonid == ""){
      this.notification.showWarning("Please save the Invoice Detail Changes")
      this.spinner.hide();
      return false;
    }
    else{
      this.service.getInvDebit(this.apinvHeader_id)
      .subscribe(result => {

      console.log("getInvdebit",result)
      if (result)
      {
      this.showinvoicediv=false
      this.showdebitdiv=true

      this.getdebittdatas = result["data"]
     
      if (this.getdebittdatas.length>0) 
      {
        this.debitdata = this.filterdebitinvdtl(this.getdebittdatas,this.invdtladdonid)
        this.getdebitrecords(this.debitdata)
      }
      else
      {
        this.getdebitrecords(this.getdebittdatas)
      }
    }
    })
    }

    this.spinner.hide();
  }

  filterdebitinvdtl(debitdata,invdtlid):any[]
  {
    let debitdtl=[]
    debitdtl = debitdata.filter(data => data.apinvoicedetail == invdtlid && data.amount !== 0)    
    return debitdtl
   }

  getdebitrecords(datas) {
    console.log(datas)
    // if(datas.length == 0){
    //   const control = <FormArray>this.DebitDetailForm.get('debitdtl');
    //   control.push(this.debitdetail());
    // }
    if (datas.length === 0) {
      let catdata = {
        "code": "GST Tax",
        "id": 232,
        "name": "GST TAX"
      }

      let igstdata = {
        "code": "IGST",
        "id": 1251,
        "glno": 179000065,
        "name": "IGST"
      }

      let cgstdata = {
        "code": "CGST",
        "id": 1252,
        "glno": 179000045,
        "name": "CGST"
      }
      let sgstdata = {
        "code": "SGST",
        "id": 1253,
        "glno": 179000035,
        "name": "SGST"
      }
      let ccdata = {
        "code": "003",
        "id": 218,
        "name": "GST"

      }

      for (let i = 0; i <= 2; i++) {
        if (i === 0 && this.getgstapplicable == "Y") {             
          this.adddebitSection()
          this.readonlydebit[i] = false
       
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.invdtltaxableamount)
          this.debitdatasums()
        }

        if (i == 1 && this.type === "IGST" && this.getgstapplicable == "Y") {
          this.adddebitSection()
          this.readonlydebit[i] = true
                     
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(catdata)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(igstdata)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(igstdata.glno)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.igstval)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')
        }
        if (i == 1 && this.type === "SGST & CGST" && this.getgstapplicable == "Y") {
          this.adddebitSection()
          this.readonlydebit[i] = true
       
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(catdata)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(cgstdata)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(cgstdata.glno)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.cgstval)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')
        }

        if (i == 2 && this.type === "SGST & CGST" && this.getgstapplicable == "Y") {
          this.adddebitSection()
          this.readonlydebit[i] = true
       
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(catdata)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(sgstdata)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(sgstdata.glno)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.sgstval)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')
        }
        if (this.igstval == 0 && this.cgstval == 0 && this.sgstval == 0 && i == 0 && this.getgstapplicable == "N") {
          this.adddebitSection()
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.invtotamount)
          this.debitdatasums()
        }
      }
    }
    else
    {
      let i=0
      let flg =false
       
      for (let debit of datas) {  
        let id: FormControl = new FormControl('');
        let apinvoicedetail_id: FormControl = new FormControl('');
        let branchCode: FormControl = new FormControl('');
        let category_code: FormControl = new FormControl('');
        let subcategory_code: FormControl = new FormControl('');
        let debitglno: FormControl = new FormControl('');
        let bsproduct_code: FormControl = new FormControl('');
        let bsproduct_code_id: FormControl = new FormControl('');
        let amt: FormControl = new FormControl('');
        let amount: FormControl = new FormControl('');
        let deductionamount: FormControl = new FormControl(0);
        let remarks: FormControl = new FormControl('');
        const debitFormArray = this.DebitDetailForm.get("debitdtl") as FormArray;  
  
        id.setValue(debit.id)
        apinvoicedetail_id.setValue(debit.apinvoicedetail)
        branchCode.setValue(this.apHdrRes.raiserchoose_branch.code) 
        let code = (debit.category_code.code).toLowerCase().trim()
        if(code == "dummy" || code.indexOf("unexpected error") >= 0 || code.indexOf("unexpected_error") >= 0 || code.indexOf("invalid_data") >= 0)
        {
          category_code.setValue("")   
          debitglno.setValue("")         
        }
        else
        {
          category_code.setValue(debit.category_code)    
          debitglno.setValue(debit.debitglno)
        }
        
        let subcode = (debit.subcategory_code.code).toLowerCase().trim()
        if(subcode == "dummy" || subcode.indexOf("unexpected error") >= 0 || subcode.indexOf("unexpected_error") >= 0 || subcode.indexOf("invalid_data") >= 0)
        {
          subcategory_code.setValue("")  
          debitglno.setValue("")      
        }
        else
        {
          subcategory_code.setValue(debit.subcategory_code)  
          debitglno.setValue(debit.debitglno)  
        }
   
        bsproduct_code.setValue(debit.bsproduct_code)
        bsproduct_code_id.setValue(debit.bsproduct_code.id)

        let num: number = +debit.amount;
        let dbtamt = new Intl.NumberFormat("en-GB").format(num); 
        dbtamt = dbtamt ? dbtamt.toString() : '';
        amt.setValue(dbtamt)
        amount.setValue(dbtamt)
        deductionamount.setValue(debit.deductionamount)
        let debtax =Number((this.cgstval +this.sgstval + this.igstval)/2)
        if(debit.amount <= debtax )
         {
           if(flg == false)
           {
            flg = true
            this.readonlydebit[i] = false
           }
           else
           {
            this.readonlydebit[i] = true
           }           
         }
         else
         {
          this.readonlydebit[i] = false
         }
  
        i++;
       
        debitFormArray.push(new FormGroup({
          id: id,
          apinvoicedetail_id: apinvoicedetail_id,
          branchCode : branchCode,
          category_code: category_code,
          subcategory_code: subcategory_code,
          debitglno: debitglno,
          bsproduct_code: bsproduct_code,
          bsproduct_code_id: bsproduct_code_id,
          amt: amt,
          amount: amount,
          deductionamount: deductionamount,
          remarks: remarks,
         }))
         let val 
         if(this.isCaptalized)
          {
            val = "Asset Clearing"
          }         
  
        category_code.valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
            }),
            switchMap(value => this.service.getcategoryscroll(val ? val : value, 1)
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
            switchMap(value => this.service.getsubcategoryscroll(this.catid, value, 1)
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
          bsproduct_code.valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
              }),
              switchMap(value => this.service.getbusinessproductscroll(value, 1)
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
              // console.log("bsdata", this.bsNameData)
              this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
            })
  
        this.calctotaldebitdata(amount)
  
        amount.valueChanges.pipe(
          debounceTime(20)
        ).subscribe(value => {
          // console.log("should be called first")
          
          // this.debitdatasums()
          this.debitdatasums();
          if (!this.DebitDetailForm.valid) {
            return;
          }
          this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
        }
        )
      }
     // }
  }
  }

 
  deleteinvdetail(section, ind) {
    let delinvdtlid
    let id = section.value.id

    if (id != undefined && id != "" && id != null) {
      delinvdtlid = id
    }

    if(delinvdtlid != undefined && delinvdtlid != "" && delinvdtlid != null){
      var answer = window.confirm("Are you sure to delete?");
      if (!answer) {
        return false;
      }
      this.spinner.show();
  
      this.service.invDetDel(delinvdtlid)
      .subscribe(result => {
        this.spinner.hide();
  
        if (result.code != undefined) {
          this.notification.showError(result.description)
        }
        else {
        // console.log("delres2", result)
        this.notification.showSuccess("Deleted Successfully")
        }
      })
    }
    this.removeinvdtlSection(ind)
    this.INVdatasums()
    this.debitEntryFlag[ind] = 0
  }

  datasums() {
    this.amt = this.InvoiceDetailForm.value['invoiceheader'].map(x => x.totalamount);
    this.sum = this.amt.reduce((a, b) => a + b, 0);
  }  

  non_rcmentry = false
  submitinvoicedtl() {
    const invoicedtlss = this.InvoiceDetailForm.value.invoicedtls
    let prodChangeFlag = true
    for(let i=0; i< invoicedtlss.length; i++ )
    {
      if(this.prodChange[i] == false)
        prodChangeFlag = false
    }
    if(prodChangeFlag == false)
    {
      this.toastr.error('Please choose product for all Invoice Detail lines.');
      return false;
    }
    let index =0
    for (let i in invoicedtlss) {
      if ((invoicedtlss[i].productname == '') || (invoicedtlss[i].productname == null) || (invoicedtlss[i].productname == undefined)) {
        this.toastr.error('Please choose product');
        return false;
      }

      if ((invoicedtlss[i].description == '') || (invoicedtlss[i].description == null) || (invoicedtlss[i].description == undefined)) {
        this.toastr.error('Please Enter particulars');
        return false;
      }

      if ((invoicedtlss[i].hsn == ''  && this.getgstapplicable === 'Y') || (invoicedtlss[i].hsn== null  && this.getgstapplicable === 'Y') || (invoicedtlss[i].hsn == undefined  && this.getgstapplicable === 'Y')) {
        this.toastr.error('Please Choose hsncode');
        return false;
      }
      
      if ((invoicedtlss[i].unitprice == 0) || (invoicedtlss[i].unitprice == null) || (invoicedtlss[i].unitprice == undefined)) {
        this.toastr.error('Please Enter Unit Price');
        return false;
      }

      if ((invoicedtlss[i].quantity == 0) || (invoicedtlss[i].quantity == null) || (invoicedtlss[i].quantity == undefined)) {
        this.toastr.error('Please Enter Quantity');
        return false;
      }

      if ((invoicedtlss[i].amount == 0) || (invoicedtlss[i].amount == null) || (invoicedtlss[i].amount == undefined)) {
        this.toastr.error('Please Enter Amount');
        return false;
      }

      if (invoicedtlss[i].id === "" || invoicedtlss[i].id === undefined) 
      {
        delete invoicedtlss[i].id
      }
     
      if(invoicedtlss[i].is_capitalized == true)
      {
        invoicedtlss[i].is_capitalized = 1
      }
      else
      {
        invoicedtlss[i].is_capitalized = 0
      }
      if(this.prodChange[index] == true)
      {
        invoicedtlss[i].entry_flag = 0
        this.creditEntryFlag = 0
      }

      invoicedtlss[i].unitprice = String(invoicedtlss[i].unitprice).replace(/,/g, '');
      invoicedtlss[i].quantity = String(invoicedtlss[i].quantity).replace(/,/g, '');
      invoicedtlss[i].amount = String(invoicedtlss[i].amount).replace(/,/g, '');
      invoicedtlss[i].cgst = String(invoicedtlss[i].cgst).replace(/,/g, '');
      invoicedtlss[i].sgst = String(invoicedtlss[i].sgst).replace(/,/g, '');
      invoicedtlss[i].igst = String(invoicedtlss[i].igst).replace(/,/g, '');
      invoicedtlss[i].discount = String(invoicedtlss[i].discount).replace(/,/g, '');
      invoicedtlss[i].taxamount = String(invoicedtlss[i].taxamount).replace(/,/g, '');
      invoicedtlss[i].totalamount = String(invoicedtlss[i].totalamount).replace(/,/g, '');
      
      invoicedtlss[i].productcode=invoicedtlss[i].productname.code
      invoicedtlss[i].productname=invoicedtlss[i].productname.name    
      if(index==0)
      {
        invoicedtlss[i].roundoffamt=this.Roundoffsamount     
      }
      index++     
    }

    if(this.productRCMflag === false && (this.INVsum > this.totalamount || this.INVsum < this.totalamount))
    {
      this.toastr.error('Check Invoice Header Amount', 'Please Enter Valid Amount');
      return false
    }
    else
    {
      this.totalamount = this.INVsum
      let num: number = +this.totalamount;
      let amt = new Intl.NumberFormat("en-GB").format(num); 
      amt = amt ? amt.toString() : '';
    }
   
    let detaildata = {

			"invoicedtls": invoicedtlss

		}
    console.log("input",detaildata)
    this.spinner.show();
  
    this.service.invDetAddEdit(this.apinvHeader_id,detaildata)
    .subscribe(result => {
      if (result.code != undefined) {
        this.spinner.hide();
        this.notification.showError(result.description)
      }
      else {
        console.log("invdetEDIT RESULT ", result)   
        let invdetRes = result["data"]
        this.Roundoffsamount = invdetRes[0].roundoffamt
        for (let i=0; i<invdetRes.length; i++ )
        {
          if(this.prodChange[i]==true)
          {
            this.service.entryDebit({invoiceheader_id : this.apinvHeader_id, invoicedetails_id : invdetRes[i].id})
            .subscribe(result => {  
              if (result.status == "success")
              {
                let det ={"entry_flag" : 1}
                this.service.updateDebEntryFlag(invdetRes[i].id, det)
                .subscribe(result => {
                  console.log("Debit entry flag update--", result)
                  if(result)
                  {
                    this.debitEntryFlag[i] =1 
                  }
                })
              }
            })        
          }
        }
        if(this.creditEntryFlag == 0)
        {
          this.service.invCreditEntryDel(this.apinvHeader_id)
          .subscribe(result => {
          if (result)
          {  
            console.log("entry Credit delete --",result)
            // for(let i=0; i < invdetRes.length; i++)
            // {
              this.service.entryCredit({invoiceheader_id : this.apinvHeader_id, invoicedetails_id : "0"})
              .subscribe(result => {
              if (result)
              {  
                console.log("entry Credit result --",result)
                if(result.status !== "success")
                {
                  this.spinner.hide();
                  this.toastr.warning(result.message)
                }     
                else  
                //  if(i == invdetRes.length -1)
                {
                  let det ={"entry_flag" : 1}
                  this.service.updateCredEntryFlag(this.apinvHeader_id, det)
                  .subscribe(result => {
                    console.log("credit entry flag update--", result)
                    if(result)
                    {
                      this.creditEntryFlag =1
                      this.service.getInvCredit(this.apinvHeader_id)
                      .subscribe(result => {
                        if (result)
                          {
                            this.invCreditList =result.data;
                            console.log("Invoice Credit Detail ",this.invCreditList);  
                            let invCreditList1 = this.invCreditList.filter(x => (x.is_display == "YES" && (
                                                                                                    ( x.amount>0 && !(x.paymode.id ==7 || x.paymode.gl_flag=='Payable') || 
                                                                                                      x.amount >= 0 && (x.paymode.id ==7 || x.paymode.gl_flag=='Payable')
                                                                                                    )
                                                                                                  )
                                                                        )
                                                                  );
                            console.log("Invoice Credit Detail ",invCreditList1);  
          
                            let invcdtdatas = this.InvoiceDetailForm.get('creditdtl') as FormArray
                            invcdtdatas.clear()
                            this.getcredit = true
                            this.getcreditrecords(invCreditList1); 
                            this.spinner.hide();  
                          }       
                        },error=>{
                          console.log("Inv Credit Detail data not found")
                          this.spinner.hide();  
                        }            
                      ) 
                    }
                  })
                }
              }
              },(error)=>{
                this.spinner.hide();
                this.toastr.warning(error.status)
            })
         
          }
          })
        }       
      this.spinner.hide();
      this.notification.showSuccess("Successfully Invoice Details Saved")
      this.invoicedetailsdata = result["data"]
      this.invdtlsaved = true
      return true
      }
    })
}



  public displayFnOriginalInv(OriginalInv?: OriginalInv): string | undefined {
    return OriginalInv ? OriginalInv.text : undefined;
  }

  autocompleteOriginalInv(){
    setTimeout(() => {
      if (
        this.autocompleteOriginalInv &&
        this.autocompleteTrigger &&
        this.OriginalInvAutoComplete.panel
      ) {
        fromEvent(this.OriginalInvAutoComplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.OriginalInvAutoComplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.OriginalInvAutoComplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.OriginalInvAutoComplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.OriginalInvAutoComplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.service.getInwardOrgInv(this.OrgInvInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.originalInv = this.originalInv.concat(datas);
                    if (this.originalInv.length >= 0) {
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

  invDetDelete(invDetid:any)
  {
    this.spinner.show();
  
    this.service.invDetDel(invDetid)
      .subscribe(result => {
        this.spinner.hide();
  
        if (result.code != undefined) {
          this.notification.showError(result.description)
        }
        else {
          this.notification.showSuccess('Deleted Successfully');
          this.getInvHdr();
        } 
      })
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
  backform() {
    //this.router.navigate(['/ap/apHeader'], { skipLocationChange: true });
  }

  creditaddonindex: any
  getcreditindex: any
  amountchangedata: any

  addoncreditindex(indexx, data) {
    this.creditaddonindex = indexx
    this.getcreditindex = indexx
    this.amountchangedata = data
    // console.log("secdata",data)
  }

  public displayPaymode(paymode?: paymodelistss): string | undefined {
    return paymode ? paymode.name : undefined;
  }

  getPaymodes()
  {
    this.service.getPaymode("")
    .subscribe((results: any[]) => {
      this.paymodesList = results["data"];
      console.log("this.paymodesList----",this.paymodesList)
    })
  }

  getPaymode(ind) {
    this.payableSelected = false

    this.service.getPaymode("")
    .subscribe((results: any[]) => {
      let paymodedata = results["data"];
      this.PaymodeList = paymodedata;

      if(this.aptypeid == 3)
      {
        this.PaymodeList  =paymodedata.filter(pay => pay.id === 4 || pay.id === 6 )
      }
      else
      {
        const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
        for (let i=0; i < creditdtlsdatas.length; i++) 
        {
          let paymodeid = creditdtlsdatas[i].paymode_id?.id
          let gl_flag = this.PaymodeList.filter(pay => pay.id === paymodeid)[0]?.gl_flag
          if (gl_flag === 'Payable' && ind !== i)
          {
            this.payableSelected = true
            return false
          }
          else
          {
            this.payableSelected = false
          }
        }
      }
    })   
  }

  public displaydebbank(debbank?: debbanklistss | any): string | undefined {
    console.log("debbank...",debbank)
    if(debbank?.code !== "INVALID_BANK_ID")
    {
      return debbank ? debbank.bankbranch?.bank?.name + "-" + debbank?.account_no : undefined;
    }
  }


  getdebbank() {
    this.service.getdebbankacc("")
      .subscribe((results: any[]) => {
        let debbankdata = results["data"];
        this.debbankList = debbankdata;
        // console.log("pll", this.PaymodeList)

      })
  }

  getCreditSections(form) {
    return form.controls.creditdtl.controls;
  }

  addcreditSection(exceedAmt = 0) {    
    this.spinner.show()
    this.service.getInvDetail(this.apinvHeader_id)
        .subscribe(result => {
          this.spinner.hide();
          if (result?.data != undefined)
          { 
            this.invDetailList =result["data"];

            let chkEntryFlag = true
            for(let invDetail of this.invDetailList)
            {
              if(invDetail["entry_flag"] == 0)
              {
                chkEntryFlag = false
              }
            }

            if(chkEntryFlag == false)
            {
              this.notification.showError("Please change the Product in all the invoice details lines.")
              return false
            }
          }
          else
          {
            this.notification.showError(result?.message)
            return false
          }

          if ( this.bankdetailsids?.code =="INVALID_BANK_ID" || this.bankdetailsids === '' || this.bankdetailsids === null || this.bankdetailsids === undefined) {
            this.toastr.error('Please Choose Debit Bank')
            return false
          }
          const control = <FormArray>this.InvoiceDetailForm.get('creditdtl');
          control.push(this.creditdetails());
          let creditDtl = this.InvoiceDetailForm.value.creditdtl
      
          let index = creditDtl.length-1
          if(exceedAmt != 0)
          {
            let paymodetds = this.paymodesList.filter(x => x.id == 7)[0]
            this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('paymode_id').setValue(paymodetds)
            let type = this.InvoiceDetailForm.value.creditdtl[index-1].suppliertaxtype
            console.log("type----", type)
            this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('suppliertaxtype').setValue(type.subtax.name + " - " + type.subtax.glno)
            let num = +exceedAmt
            let amt = new Intl.NumberFormat("en-GB").format(num); 
            amt = amt ? amt.toString() : '';
            this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('taxableamount').setValue(amt)
            this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('suppliertaxrate').setValue(type.taxrate.rate)
            this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditglno').setValue(type.subtax.glno)
            
            let taxableamt2 = Number(String(this.InvoiceDetailForm.value.creditdtl[index].taxableamount).replace(/,/g, ''))
            let taxrate2 = this.InvoiceDetailForm.value.creditdtl[index].suppliertaxrate
            this.service.gettdstaxcalculation(taxableamt2, taxrate2)
            .subscribe(result => {
              let amt = Math.round(result.tdsrate)
              let num = +amt
              let amtch = new Intl.NumberFormat("en-GB").format(num); 
              amtch = amtch ? amtch.toString() : '';
              this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amountchange').setValue(amtch)
            })
          }

          if (index === 1) {
            let num:number = +this.totalamount
            let amt = new Intl.NumberFormat("en-GB").format(num); 
            amt = amt ? amt.toString() : '';
            
            this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(amt)
            this.creditdatasums()
          }      
        })
  }
  removecreditSection(i) {
    const control = <FormArray>this.InvoiceDetailForm.get('creditdtl');
    control.removeAt(i);
    this.creditdatasums()
  }
  credit: any

  paymodeid=[0,0,0,0,0,0,0,0]
  taxableamount: any

  amtChangeFlag = [true,true,true,true,true,true,true,true]
  CreditDessss(pay, index, taxtype ="", getcred = false) {

    this.getcreditindex = index

    pay=this.paymodesList.filter(x => x.name == pay.name)[0]

    console.log("pay",pay)
    this.paymodeid[index] = pay.id
    if(pay.gl_flag === "Payable")
    {
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amountchange').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('taxableamount').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('suppliertaxtype').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('suppliertaxrate').reset()
      // this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('taxexcempted').reset("N")
      this.amtChangeFlag[index] = false
      this.payableSelected = true
      let paymode_details=pay.paymode_details ? pay.paymode_details:undefined
      console.log("paymode_details>>",paymode_details)
      if(paymode_details!=undefined)
      {
        let gl=paymode_details['data'][0]?.glno
        console.log("gl",gl)
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditglno').setValue(gl)
       }
    }
    else
    {
      this.payableSelected = false
    }

    if (this.paymodeid[index] === 5 || this.paymodeid[index] === 8 || this.paymodeid[index] === 4 || this.paymodeid[index] === 1 )
     {
       if(this.paymodeid[index] == 5)
       {
        this.getaccno(this.paymodeid[index],index)     
       }
       else if(this.paymodeid[index] == 4)
       {
        this.getERA(index)
       }
      this.showaccno[index] = true     
      }
    else
     {
      if(this.paymodeid[index] == 2 || this.paymodeid[index] == 6 || this.paymodeid[index] == 7 )
      {
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      }      
      this.showaccno[index] = false
    }
    if (this.paymodeid[index] === 3) {
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditrefno').reset()
      this.showtranspay[index] = true
      this.showaccno[index] = false
    } else {
      this.showtranspay[index] = false
      // this.showaccno[index]=false
    }
    if (this.paymodeid[index] === 7) {
      this.showtaxtype[index] = true
      this.showtaxrate[index] = true
      this.showtaxtypes[index] = false
      this.showtaxrates[index] = false
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditrefno').reset()
      if ( !getcred)
      {
        console.log(this.taxableamount)
        let num: number = Number(this.taxableamount)
        let taxbleAmt = new Intl.NumberFormat("en-GB").format(num); 
        taxbleAmt = taxbleAmt ? taxbleAmt.toString() : '';
     
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('taxableamount').setValue(taxbleAmt)
      }      
      this.gettaxtype(taxtype , index)
    } else {
      this.showtaxtype[index] = false
      this.showtaxrate[index] = false
      this.showtaxtypes[index] = true
      this.showtaxrates[index] = true
    }
    if (this.paymodeid[index] == 6 ) 
    {
      if(this.getcredit == false) 
      {
        this.showppxmodal = true
        this.getPpxrecords()
      }       
    }
    else
    {
      if(this.showppxmodal == true)
      {
        this.closeppx()
      }      
    }
    if (this.paymodeid[index] == 2) {
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditrefno').reset()
      // this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditglno').reset()
      if(this.getcredit == false)
      {
        this.showglpopup = true
        this.creditglForm.patchValue({
          name: pay.name
        })
        this.getcreditgl(this.paymodeid[index])
      }
    }  
    else
    {
      if(this.showglpopup == true)
      {
        this.closeCreditGL()
      } 
    } 

    // this.service.getPaymode(pay.name)
    // .subscribe((results: any[]) => {
    //   pay = results["data"][0];

       
    // })
    // console.log("payid", this.paymodeid[index])
    // this.getcreditpaymodesummary();
  }

  accountno: any
  getacc(accountno, index) {

    this.accountno = accountno
    this.getcreditpaymodesummary(index)
  }

  optionsummary = false
  firstsummary = true
  creditListed: any
  arraydata: any
  accno: any
  creditids: any
  bankdetailsids : any
  accountnumber: any

  getbankdetailsid(det:any)
  {
    this.bankdetailsids = det
  }

  getcreditpaymodesummary(index) {
    let ind = index
    if (this.accountno === undefined) {
      this.accountnumber = this.accnumm
    } else {
      this.accountnumber = this.accountno
    }
    this.service.getcreditpaymodesummaryy(1, 10, this.paymodeid[index], this.suppid, this.accountnumber)
      .subscribe((results: any[]) => {
        if(results)
        {
          let datas = results["data"];
        this.creditListed = datas
        console.log("cpres", datas)
        for (let i of this.creditListed) {

          let accno = i.account_no
          let bank = i.bank_id.name
          let branch = i.branch_id.name
          let ifsc = i.branch_id.ifsccode
          let beneficiary = i.beneficiary
          this.creditids = i.bank_id.id

          this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditrefno').setValue(accno)
          this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').setValue(bank)
          this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').setValue(branch)
          this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').setValue(ifsc)
          this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').setValue(beneficiary)
        }
        
        }
        
      })
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

  taxrateid: any
  taxratename: any
  vendorid: any
  maintaintaxlist: any
  othertaxlist: any
  ERAList: any

  getERA(ind) {
    // console.log("paymodeid",this.paymodeid[index])
    if (this.paymodeid[ind] == 4) {
      this.service.geteraAcc(this.raisedbyid)
        .subscribe(result => {
          console.log("era list==", result)
          if(result.data != undefined)
          {
            this.ERAList = result.data
            let credAccNo = this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('creditrefno').value
            if (credAccNo != "")
            {
              let accdet = this.ERAList.filter(x => x.account_number == credAccNo)[0]
              if (accdet != undefined && accdet != null)
              {
                this.creditids = accdet.bankbranch.bank.id
                this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('accno').setValue(accdet.id)
                this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('creditrefno').setValue(accdet.account_number)
                this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('bank').setValue(accdet.bank_name)
                this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('branch').setValue(accdet.bankbranch?.name)
                this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('ifsccode').setValue(accdet.bankbranch?.ifsccode)
                this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('benificiary').setValue(accdet.beneficiary_name)
              }              
            }   
          }
        })
    }

    if (this.paymodeid[ind] == 1) {
      this.service.getbrapaymode(this.paymodeid[ind])
        .subscribe(result => {
          if (result == "None") {
            this.notification.showInfo("The selected branch does not have any account no")
          }
          // this.ERAList = result
          this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('creditrefno').setValue(result)

        })
    }
  }

getEraAccDet(acc,ind)
{
  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('accno').setValue(acc.id)
  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('creditrefno').setValue(acc.account_number)
  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('bank').setValue(acc.bank_name)
  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('branch').setValue(acc.bankbranch?.name)
  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('ifsccode').setValue(acc.bankbranch?.ifsccode)
  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('benificiary').setValue(acc.beneficiary_name)
}


  
  // gettaxtype() {
  //   this.service.gettdstaxtype(this.suppid)
  //     .subscribe(result => {
  //       this.vendorid = result.vendor_id
  //       // console.log("venid", this.vendorid)
  //       this.taxlist = result['subtax_list']
  //       this.maintaintaxlist = this.taxlist.filter(dept => dept.dflag === "M");
  //       this.othertaxlist = this.taxlist.filter(dept => dept.dflag === "O");
  //     })
  // }
  gettaxtype(taxtype = "", ind = 0) {  
    this.service.getvendorid(this.suppid)
      .subscribe(result => {
        if(result)
        {
          this.vendorid = result["data"][0].supplierbranch_id.vendor_id
          this.service.gettdstaxtype1(this.vendorid)
            .subscribe(results => {
              this.taxlist = results["data"]
              if (taxtype !="")
              {               
                 let tax = this.taxlist.filter(x => x.subtax.name == taxtype )[0]
                 this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('suppliertaxtype').setValue(taxtype + " - " + tax.subtax.glno)
                 this.gettaxrates(tax, ind, true)
              }
            }) 
        }
      })
  }
  gettaxrates(tax, ind, getcred = false)
  {
    this.taxrateid = tax.subtax.id
    // Get Supplier Details

    console.log("tax---", tax)
    let tdsCalc = false
    if ((this.suppid !== null && this.suppid !== undefined && this.suppid !== "") && this.paytoid == "S")
    {
      this.service.getsupplierdet(this.suppid,this.apinvHeader_id,this.taxrateid)
      .subscribe(result => {
        if (result)
        {
         let supplierdata =result["data"];
         console.log("supplier details>>",supplierdata)
         if (supplierdata?.length>0)
         {
           this.supplierdata = supplierdata[0]
           this.creditdetForm.patchValue(
             {
               // supName : this.invHdrRes.supplier.name,
               isexcempted : this.supplierdata.isexcempted,
             })
 
           if(this.supplierdata.isexcempted === "Y")
           {
             this.showthreshold = true
             
             let num: number = Number(this.supplierdata.excemthrosold_amt)
             let thresAmt = new Intl.NumberFormat("en-GB").format(num); 
             thresAmt = thresAmt ? thresAmt.toString() : '';          
             
             num = Number(this.supplierdata.paid_invoiceamount)
             let paidInvAmt = new Intl.NumberFormat("en-GB").format(num); 
             paidInvAmt = paidInvAmt ? paidInvAmt.toString() : '';
          
             num = +this.supplierdata.excemthrosold_amt- +this.supplierdata.paid_invoiceamount
             let balAmt = new Intl.NumberFormat("en-GB").format(num); 
             balAmt = balAmt ? balAmt.toString() : '';

             if(this.supplierdata.is_throsold == true) 
             {
              paidInvAmt = thresAmt
              balAmt = "0"
             }

             this.creditdetForm.patchValue(
               {
                 TDSSection : tax.subtax.name,
                 TDSRate : this.supplierdata.vendor_data.data[0].excemrate,
                 thresholdValue : thresAmt,
                 amountPaid : paidInvAmt,
                 normaltdsRate : tax.taxrate.rate, 
                 balThroAmt: balAmt
               }
             )
             if(getcred == false) 
             {
              if(this.supplierdata.is_throsold == false) 
              {
                this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('taxexcempted').setValue("Y")
                this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('suppliertaxrate').setValue(this.supplierdata.vendor_data.data[0].excemrate)
                this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('creditglno').setValue(tax.subtax.glno)
  
                let exceedAmt = this.supplierdata.current_exide_amt
                if(exceedAmt == null || exceedAmt == undefined)
                {
                  tdsCalc = true

                  num = +this.taxableamount
                  let taxbleAmt = new Intl.NumberFormat("en-GB").format(num); 
                  taxbleAmt = taxbleAmt ? taxbleAmt.toString() : '';
                  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('taxableamount').setValue(taxbleAmt)    
                  this.gettaxcalc(ind)                
                }
                else
                {
                  tdsCalc = true
                  num = +this.supplierdata.current_tds_applicable_amt
                  let tdsApplAmt = new Intl.NumberFormat("en-GB").format(num); 
                  tdsApplAmt = tdsApplAmt ? tdsApplAmt.toString() : '';
                  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('taxableamount').setValue(tdsApplAmt)
                  this.gettaxcalc(ind,exceedAmt)  
                }                
              }
             }            
           }
           else
           {
             this.showthreshold = false
           }
         }
        }              
      },error=>{
          console.log("Error while getting supplier info..", error)
          this.spinner.hide();  
          }            
        ) 
    }
      
    this.taxratename = tax.subtax.name
    console.log("suppliertax.....", tax)
    console.log("this.taxratename.....", this.taxratename)
   
    if(getcred == false && tdsCalc == false)
    {
      this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('suppliertaxrate').setValue(tax.taxrate.rate)
      this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('creditglno').setValue(tax.subtax.glno)
      
      this.gettaxcalc(ind)  
    }    
  }

  gettaxid(data) {
    this.taxrateid = data.id
   
    this.taxratename = data.subtax_type
    this.gettdstaxrates()
  }

  maintaintaxratelist: any
  othertaxratelist: any
  gettdstaxrates() {
    this.service.gettdstaxrate(this.vendorid, this.taxrateid)
      .subscribe(result => {
        this.taxratelist = result['data']
        this.maintaintaxratelist = this.taxratelist.filter(dept => dept.dflag === "M");
        this.othertaxratelist = this.taxratelist.filter(dept => dept.dflag === "O");

      })

  }
  taxindex: any


  gettaxcalc( index, exceedAmt = 0) {
    this.taxindex = index

    let creditdata = this.InvoiceDetailForm.value.creditdtl
    let taxrate = creditdata[index].suppliertaxrate
    let taxableamt = String(creditdata[index].taxableamount).replace(/,/g, '')

    if (taxrate === undefined || taxrate === "" || taxrate === null || taxableamt === undefined || taxableamt === "" || taxableamt === null) {
      return false
    }

    if (taxrate != undefined || taxrate != "" || taxrate != null || taxableamt != undefined || taxableamt != "" || taxableamt != null) {

      this.service.gettdstaxcalculation(taxableamt, taxrate)
        .subscribe(results => {
          console.log("taxres", results)
          let amount = Math.round(results.tdsrate)
          let num = +amount
          let amt = new Intl.NumberFormat("en-GB").format(num); 
          amt = amt ? amt.toString() : '';
          this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amountchange').setValue(amt)
          if(exceedAmt >0)
          {
            this.addcreditSection(exceedAmt)
          }
        })
    }

  }
  suppid: any
  creditList: any
  paymodename: any
  creditListeds: any
  getcreditsummary(pageNumber = 1, pageSize = 10) {   
    this.service.getcreditsummary(pageNumber, pageSize, this.suppid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.creditListeds = datas;
        for (var i = 0; i < datas.length; i++) {
          this.paymodename = datas[i].paymode_id.name
        }
      })

  }

  accdata: any
  accnumm: any
  getaccno(payid, index) {

    this.service.getbankaccno(payid, this.suppid)
      .subscribe(res => {
        if(res['data'] != undefined)
        {
          this.accList = res['data']
          console.log("account details...", this.accList)
          if (this.accList.length >0)
          {
            // this.accdata = this.accList[0]?.id
            this.accnumm = this.accList[0]?.account_no
            let credAccNo = this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditrefno').value
            if (credAccNo != "")
            {
              let id = this.accList.filter(x => x.account_no == credAccNo)[0]?.id
              if (id != undefined && id != null)
              {
                this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('accno').setValue(id) 
              }              
            }                       
          }          
         // this.getcreditpaymodesummary(index)
        }
      })

  }

  getcreditgl(payid) {
    this.service.creditglno(payid)
      .subscribe(res => {
        this.glList = res['data']       
      })
  }

  creditgllno: any
  getgl(glno) {
    this.creditgllno = glno
    this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditglno').setValue(this.creditgllno)
  }

  glsubmitForm() {
    this.showglpopup =false
    this.closebuttons.nativeElement.click();
  }

  closeCreditGL(){
    this.showglpopup =false
    this.closebuttons.nativeElement.click();
  }
  getPpxSections(form) {
    return form.controls.ppxdtl.controls;
  }

  ppxDisable = [false,false,false,false,false,false,false]
  getPpxrecords()
   {
    this.ppxLoad = true
    let ppxcontrol = this.ppxForm.controls["ppxdtl"] as FormArray;
    ppxcontrol.clear()
    console.log("this.ppxdata-->", this.ppxdata)
    let x=0
    for (let ppx of this.ppxdata) {
      let apppxheader_id: FormControl = new FormControl('');      
      let name: FormControl = new FormControl('');      
      let crno: FormControl = new FormControl('');
      let ppxheader_date: FormControl = new FormControl('');
      let ppxheader_amount: FormControl = new FormControl('');
      let ecfheader_id: FormControl = new FormControl('');
      let ppxheader_balance: FormControl = new FormControl('');
      let liquidate_limit: FormControl = new FormControl('');
      let ecf_amount: FormControl = new FormControl(0);
      let credit_glno: FormControl = new FormControl(0);      
      let ppxdetails: FormControl = new FormControl('');
      let liquidate_amt: FormControl = new FormControl('');
      let select: FormControl = new FormControl('');

      const ppxFormArray = this.ppxForm.get("ppxdtl") as FormArray;
  
      apppxheader_id.setValue(ppx.id)      
      name.setValue(ppx.payto_name.name)      
      crno.setValue(ppx.crno)
      ppxheader_date.setValue(this.datepipe.transform(ppx.ppxheader_date, 'dd-MMM-yyyy'))

      let num: number = +ppx.ppxheader_amount
      let amt = new Intl.NumberFormat("en-GB").format(num); 
      amt = amt ? amt.toString() : '';
      ppxheader_amount.setValue(amt)

      ecfheader_id.setValue("")

      num = +ppx.ppxheader_balance
      amt = new Intl.NumberFormat("en-GB").format(num); 
      amt = amt ? amt.toString() : '';
      ppxheader_balance.setValue(amt)

      num = +ppx.AP_liquedate_limit
      amt = new Intl.NumberFormat("en-GB").format(num); 
      amt = amt ? amt.toString() : '';
      liquidate_limit.setValue(amt)

      num = +ppx.ecf_amount
      amt = new Intl.NumberFormat("en-GB").format(num); 
      amt = amt ? amt.toString() : '';
      ecf_amount.setValue(amt)

      credit_glno.setValue(ppx.credit_glno)
      ppxdetails.setValue(ppx.ppxdetails)
      liquidate_amt.setValue(0)
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
        if(creditdtlsdatas[i].paymode_id.id == 6 && creditdtlsdatas[i].creditrefno == ppx.crno)
        {
          if(this.getcreditindex == i)
          {
            this.ppxDisable[x] = false         
          }
          else
          {
            this.ppxDisable[x] = true
          }
          // num = +creditdtlsdatas[i].amount
          // amt = new Intl.NumberFormat("en-GB").format(num); 
          // amt = amt ? amt.toString() : '';
          liquidate_amt.setValue(creditdtlsdatas[i].amount)
          select.setValue(true)
        }

      }
      ppxFormArray.push(new FormGroup({
        apppxheader_id : apppxheader_id,
        name: name,
        crno: crno,
        ppxheader_date: ppxheader_date,
        ppxheader_amount: ppxheader_amount,
        ecfheader_id: ecfheader_id,
        ppxheader_balance: ppxheader_balance,
        liquidate_limit: liquidate_limit,
        ecf_amount: ecf_amount,
        credit_glno: credit_glno,
        ppxdetails: ppxdetails,
        liquidate_amt: liquidate_amt,   
        select : select  
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
            if(this.selectedppxdata[j].crno == ppxForm[i].crno)
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
       if (Number(String(this.selectedppxdata[n].liquidate_amt).replace(/,/g, ''))<=0)
       {
        this.notification.showError("Please give a valid amount to liquidate.")
       }
       else
       {
        this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditrefno').setValue(this.selectedppxdata[n].crno)
        this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditglno').setValue(this.selectedppxdata[n].credit_glno)
        this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('amountchange').setValue(this.selectedppxdata[n].liquidate_amt)
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
      let amt = String(this.ppxForm.value.ppxdtl[ind].liquidate_amt).replace(/,/g, '')
      let balamt = String(this.ppxForm.value.ppxdtl[ind].ppxheader_balance).replace(/,/g, '')
      let limitamt = String(this.ppxForm.value.ppxdtl[ind].liquidate_limit).replace(/,/g, '')
  
      if (+amt > Number(balamt) || +amt > this.totalamount || +amt > +limitamt) 
      {
        let n = amt.slice(0,amt.length-1)
        let num: number = +n
        amt = new Intl.NumberFormat("en-GB").format(num); 
        amt = amt ? amt.toString() : '';
        this.ppxForm.get('ppxdtl')['controls'][ind].get('liquidate_amt').setValue(amt) 
        this.notification.showError("Liquidate amount should not exceed the Invoice Amount, Balance Amount and Liquidate Limit.")
      }  
      else
      {
        this.ppxChangeToCurrency(ind)
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
          this.ppxsum +=+(String(ppxForm[i].liquidate_amt).replace(/,/g, ''))
         }
       }
    }    
  }

  creditdetails() {
    let group = new FormGroup({
      invoiceheader_id: new FormControl(this.apinvHeader_id),
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
      bankdetails_id: new FormControl(''),


    })
  
   group.get('amountchange').valueChanges.pipe(
      debounceTime(500)
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

  
  public displayFnFilter(filterdata?: taxtypefilterValue | any): string | undefined {
    if(filterdata.subtax !== undefined )
    {
    return filterdata ? filterdata.subtax.name + " - " + filterdata.subtax.glno : undefined;
    }
    else
    {
      return filterdata
    }
  }
  get filterdata() {
    return this.InvoiceDetailForm.get('suppliertaxtype');
  }
  calcreditamount: any
  fullliq = false

  amountReduction() {
    let creditForm = this.InvoiceDetailForm.value.creditdtl
    let reductionSum =0
    let roundoffamt: number=0
    
    for (let i in creditForm) 
    {
      let amtch = +String(creditForm[i].amountchange).replace(/,/g, '')
      // if(creditForm[i].paymode_id.id == 4 || creditForm[i].paymode_id.id == 5)
      // {
      //   roundoffamt = Number(amtch)
      // }
      // else 
      if(((amtch >=0 && creditForm[i].paymode_id.id == 7)|| (amtch > 0 && creditForm[i].paymode_id.id !=7)) 
                          && creditForm[i].creditglno != "151515" && creditForm[i].creditglno != "151516" && creditForm[i].creditglno != "151517")
      {
        reductionSum += amtch
        let num: number = amtch
        let amt = new Intl.NumberFormat("en-GB").format(num); 
        amt = amt ? amt.toString() : '';
        this.InvoiceDetailForm.get('creditdtl')['controls'][i].get('amount').setValue(amt)
      }
    }

    if(reductionSum == this.invHdrRes.totalamount)
    {
      this.fullliq = true
    }
    else
    {
      this.fullliq = false
    }
    // let creditgl = false
    // for (let i in creditForm) 
    // {
    //   if(creditForm[i].creditglno == "151515" || creditForm[i].creditglno == "151516" || creditForm[i].creditglno == "151517")
    //   {
    //     creditgl = true
    //   }
    // }
    // let num: number 
    // if(creditgl )
    //   num = Number(this.invHdrRes.totalamount - reductionSum + roundoffamt)
    // else
    let num: number = Number(this.invHdrRes.totalamount - reductionSum)
    let amt = new Intl.NumberFormat("en-GB").format(num); 
    amt = amt ? amt.toString() : '';
    if(creditForm[0].paymode_id.id == 4 || creditForm[0].paymode_id.id == 5) 
    {
      this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(amt)
    }
    this.creditdatasums();
    // if(this.reductionflag == true) 
    // {
      // let dataForm = this.InvoiceDetailForm.value.creditdtl
      // console.log("dataForm[this.getcreditindex].creditglno",dataForm[this.getcreditindex].creditglno)
  
      // if(dataForm[this.getcreditindex].creditglno != "151515" && dataForm[this.getcreditindex].creditglno != "151516" &&
      //                                                              dataForm[this.getcreditindex].creditglno != "151517" )
      //   {
      //     for (let data in dataForm) {
  
      //       if (data == "0" && dataForm[0].paymode_id.id == 5) {
      
      //         this.InvoiceDetailForm.get('creditdtl')['controls'][data].get('amount').setValue(this.creditamt1 - dataForm[ this.getcreditindex].amountchange)
      //       }
      //       if (data == this.getcreditindex) {
      //         this.InvoiceDetailForm.get('creditdtl')['controls'][data].get('amount').setValue(dataForm[this.getcreditindex].amountchange)    
      //       }    
      //     }
      //     this.creditdatasums()
      //   }       
    // }    
  }

  cdtamt: any
  cdtsum: any
  creditdatasums() {
    this.cdtamt = this.InvoiceDetailForm.value['creditdtl'].map(x => String(x.amount).replace(/,/g, ''));
    this.cdtsum = this.cdtamt.reduce((a, b) => Number(a) + Number(b), 0).toFixed(2);
    }
  CreditData: any
  categoryid: any
  subcategoryid: any
  ppxflag =false
  creditres: any

  submitcredit() {
    this.spinner.show()
    this.service.getInvDetail(this.apinvHeader_id)
        .subscribe(result => {
          this.spinner.hide();
          if (result?.data != undefined)
          { 
            this.invDetailList =result["data"];

            let chkEntryFlag = true
            for(let invDetail of this.invDetailList)
            {
              if(invDetail["entry_flag"] == 0)
              {
                chkEntryFlag = false
              }
            }

            if(chkEntryFlag == false  && this.aptypeid != 4)
            {
              this.notification.showError("Please change the Product in all the invoice details lines.")
              return false
            }
          }
          else
          {
            this.notification.showError(result?.message)
            return false
          }
          const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
          if(this.bankdetailsids?.code =="INVALID_BANK_ID" || this.bankdetailsids === "" || this.bankdetailsids === null || this.bankdetailsids === undefined)
          {
            this.toastr.error('Please Choose Debit bank')
            return false
          }
          for (let i in creditdtlsdatas) {
            creditdtlsdatas[i].amount = Number(String(creditdtlsdatas[i].amount).replace(/,/g, ''))

            if (creditdtlsdatas[i].paymode_id === '' || creditdtlsdatas[i].paymode_id === null || creditdtlsdatas[i].paymode_id === undefined) {
              this.toastr.error('Please Choose Paymode')
              return false
            }
            console.log("creditdtlsdatas[i]---------",creditdtlsdatas[i])
            if ((creditdtlsdatas[i].paymode_id.id === 5 || creditdtlsdatas[i].paymode_id.id === 4) && 
                      (creditdtlsdatas[i].accno == null || creditdtlsdatas[i].accno == undefined || creditdtlsdatas[i].accno =="")) {
              this.toastr.error('Please Choose Acc No.')
              return false
            }
             if ((creditdtlsdatas[i].paymode_id.id === 5 || creditdtlsdatas[i].paymode_id.id === 4) && 
                      (Number(creditdtlsdatas[i].amount <0))) {
              this.toastr.error('Amount cannot be less than Zero.')
              return false
            }
            if ((creditdtlsdatas[i].paymode_id.id === 5 || creditdtlsdatas[i].paymode_id.id === 4) && 
                      (creditdtlsdatas[i].bank == null || creditdtlsdatas[i].bank == undefined || creditdtlsdatas[i].bank =="")) {
              this.toastr.error('Bank Name is not available.')
              return false
            }
             if ((creditdtlsdatas[i].paymode_id.id === 5 || creditdtlsdatas[i].paymode_id.id === 4) && 
                      (creditdtlsdatas[i].ifsccode == null || creditdtlsdatas[i].ifsccode == undefined || creditdtlsdatas[i].ifsccode =="")) {
              this.toastr.error('IFSC Code is not available.')
              return false
            }
            if ((creditdtlsdatas[i].paymode_id.id === 5 || creditdtlsdatas[i].paymode_id.id === 4) && 
                      (creditdtlsdatas[i].branch == null || creditdtlsdatas[i].branch == undefined || creditdtlsdatas[i].branch =="")) {
              this.toastr.error('Branch Name is not available.')
              return false
            }
             if ((creditdtlsdatas[i].paymode_id.id === 5 || creditdtlsdatas[i].paymode_id.id === 4) && 
                      (creditdtlsdatas[i].benificiary == null || creditdtlsdatas[i].benificiary == undefined || creditdtlsdatas[i].benificiary =="")) {
              this.toastr.error('Beneficiary Name is not available.')
              return false
            }
            if (creditdtlsdatas[i].paymode_id.id === 7 && (creditdtlsdatas[i].suppliertaxtype === '' ||
              creditdtlsdatas[i].suppliertaxtype === null || creditdtlsdatas[i].suppliertaxtype === undefined)) {
              this.toastr.error('Please Choose Taxtype')
              return false
            }
            
            if (creditdtlsdatas[i].id === "") {
              delete creditdtlsdatas[i].id
            }
      
            if (creditdtlsdatas[i].paymode_id.id == 6 && 
              (creditdtlsdatas[i]?.amount == null || creditdtlsdatas[i]?.amount == "" || creditdtlsdatas[i]?.amount == undefined || Number(creditdtlsdatas[i]?.amount)) <= 0) {
              this.toastr.error("Amount cannot be less than Zero")
              return false
            }
            if (creditdtlsdatas[i].paymode_id.id === 2) {
              creditdtlsdatas[i].taxableamount = 0
              creditdtlsdatas[i].category_code = this.categoryid
              creditdtlsdatas[i].subcategory_code = this.subcategoryid
              creditdtlsdatas[i].credittotal = this.cdtsum
              creditdtlsdatas[i].creditbank_id = this.creditids
              creditdtlsdatas[i].suppliertax_id = 0
              creditdtlsdatas[i].suppliertaxtype = ""
              creditdtlsdatas[i].suppliertaxrate = 0
              creditdtlsdatas[i].ddtranbranch = 0
              creditdtlsdatas[i].ddpaybranch = 0
            }
            if (creditdtlsdatas[i].paymode_id.id === 4 || creditdtlsdatas[i].paymode_id.id === 1) {
              creditdtlsdatas[i].taxableamount = 0
              creditdtlsdatas[i].category_code = this.categoryid
              creditdtlsdatas[i].subcategory_code = this.subcategoryid
              creditdtlsdatas[i].credittotal = this.cdtsum
              creditdtlsdatas[i].creditbank_id = this.creditids
              creditdtlsdatas[i].suppliertax_id = 0
              creditdtlsdatas[i].suppliertaxtype = ""
              creditdtlsdatas[i].suppliertaxrate = 0
              creditdtlsdatas[i].ddtranbranch = 0
              creditdtlsdatas[i].ddpaybranch = 0
              // creditdtlsdatas[i].creditglno = 0
            }
            if (creditdtlsdatas[i].paymode_id.id === 5) {
              creditdtlsdatas[i].taxableamount = 0
              creditdtlsdatas[i].category_code = this.categoryid
              creditdtlsdatas[i].subcategory_code = this.subcategoryid
              creditdtlsdatas[i].credittotal = this.cdtsum
              creditdtlsdatas[i].creditbank_id = this.creditids
              // creditdtlsdatas[i].creditglno = 0
              creditdtlsdatas[i].suppliertax_id = 0
              creditdtlsdatas[i].suppliertaxtype = ""
              creditdtlsdatas[i].suppliertaxrate = 0
              creditdtlsdatas[i].ddtranbranch = 0
              creditdtlsdatas[i].ddpaybranch = 0
            }
            if (creditdtlsdatas[i].paymode_id.id === 6) {
              creditdtlsdatas[i].taxableamount = 0
              creditdtlsdatas[i].category_code = this.categoryid
              creditdtlsdatas[i].subcategory_code = this.subcategoryid
              creditdtlsdatas[i].credittotal = this.cdtsum
              creditdtlsdatas[i].creditbank_id = this.creditids
              // creditdtlsdatas[i].creditglno = 0
              creditdtlsdatas[i].suppliertax_id = 0
              creditdtlsdatas[i].suppliertaxtype = ""
              creditdtlsdatas[i].suppliertaxrate = 0
              creditdtlsdatas[i].ddtranbranch = 0
              creditdtlsdatas[i].ddpaybranch = 0
            }
           
            if (creditdtlsdatas[i].paymode_id.id === 7) {
              creditdtlsdatas[i].taxableamount = String(creditdtlsdatas[i].taxableamount ).replace(/,/g, '')
              creditdtlsdatas[i].category_code = this.categoryid
              creditdtlsdatas[i].subcategory_code = this.subcategoryid
              creditdtlsdatas[i].credittotal = this.cdtsum
              creditdtlsdatas[i].creditbank_id = this.creditids
              // creditdtlsdatas[i].creditglno = 0
              creditdtlsdatas[i].suppliertax_id = this.taxrateid
              creditdtlsdatas[i].suppliertaxtype = this.taxratename
              // creditdtlsdatas[i].suppliertaxrate = this.taxrate
              creditdtlsdatas[i].ddtranbranch = 0
              creditdtlsdatas[i].ddpaybranch = 0
            }
           
            creditdtlsdatas[i].bankdetails_id = this.bankdetailsids.id
            // creditdtlsdatas[i].bankdetails_id = 1
             
            delete creditdtlsdatas[i].amountchange
          }
          if (this.cdtsum > this.totalamount || this.cdtsum < this.totalamount) {
            this.toastr.error('Check Invoice Header Amount', 'Please Enter Valid Amount');
            return false
          }
          this.CreditData = this.InvoiceDetailForm.value.creditdtl
          
          let detaildata = {
            "apcredit": this.CreditData
          }
          
          console.log("this.CreditData =",detaildata)
          console.log(JSON.stringify(detaildata))
          this.spinner.show();
        
          this.service.invCreditAddEdit(this.apinvHeader_id, detaildata)
              .subscribe(result => {
                this.spinner.hide();
        
                if (result.code != undefined) {
                  this.notification.showError(result.description)
                }
                else {
                  let creditres = result["data"]
                  console.log("credit result--", creditres)
      
                  let i = 0
                  let ppxdet  = []
                  for (let x in creditres) {
                    if(creditres[x].paymode == 6)
                      {
                        let ppxdetailid 
                        let id = creditres[x].id
                        let ppxdetails = this.selectedppxdata[i].ppxdetails["data"]
                        let ppx
                        if(ppxdetails.length>0)
                        {
                          ppx = ppxdetails.filter(x => x.current_crno == this.crno)[0]
                          ppxdetailid = ppx?.id
                          console.log("ppxdetailid..",ppxdetailid)
                        }
                        let ppxdata
                        if (ppxdetailid != undefined)
                        {
                          ppxdata = { "apppxheader_id" : this.selectedppxdata[i].id,
                                        "apinvoiceheader_id" : this.apinvHeader_id,
                                        "apcredit_id" : id,
                                        "ppxdetails_amount" : String(this.selectedppxdata[i].ppxheader_amount).replace(/,/g, ''),
                                        "ppxdetails_adjusted" : String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, ''),
                                        "ppxdetails_balance" : Number(String(this.selectedppxdata[i].ppxheader_balance).replace(/,/g, ''))-
                                                               Number(String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, '')),
                                        "ap_amount" :         String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, ''),
                                        "ppxlique_crno" : this.crno,
                                        "id" : ppxdetailid
                                      }
                        }                  
                        else
                        {
                          ppxdata = { "apppxheader_id" : this.selectedppxdata[i].apppxheader_id,
                                        "apinvoiceheader_id" : this.apinvHeader_id,
                                        "apcredit_id" : id,
                                        "ppxdetails_amount" : String(this.selectedppxdata[i].ppxheader_amount).replace(/,/g, ''),
                                        "ppxdetails_adjusted" :String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, ''),
                                        "ppxdetails_balance" : Number(String(this.selectedppxdata[i].ppxheader_balance).replace(/,/g, ''))-
                                                               Number(String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, '')),
                                        "ap_amount" : String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, ''),
                                        "ppxlique_crno" : this.crno
                                      }
                        }
                        ppxdet.push(ppxdata)
                        console.log("ppxdet-->",ppxdet)
                        i+=1;
                      }
                    }
      
                  if (ppxdet.length >0)
                  {
                    let data = {"ppxdetails" : ppxdet}
      
                    this.service.ppxdetails(data).subscribe(result=>{
                      if(result)
                      {
                        console.log("PPX Details Inserted..", result)            
                      }
                    })      
                  }
               
                  this.notification.showSuccess("Successfully Credit Details Saved!...")
                  this.creditsaved = true   
                  
                  this.service.getInvCredit(this.apinvHeader_id)
                  .subscribe(result => {
                    if (result.code == undefined)
                      {
                        this.creditres = result.data
                      }
                    })
                }
              })
        })   
  }

  goback() {
    let creditdatas = this.getinvoiceheaderresults['credit']
    if (creditdatas.length != 0) {
      let creditarraydata = this.InvoiceDetailForm.value.creditdtl
      for (let i in creditdatas) {
        for (let j in creditarraydata) {
          if (i == j) {
            if (creditdatas[i].paymode_id != creditarraydata[j].paymode_id) {
              this.notification.showInfo("Please save the changes you have done")
              return false
            }
            else if (creditdatas[i].creditrefno != creditarraydata[j].creditrefno) {
              this.notification.showInfo("Please save the changes you have done")
              return false
            }
            else if (creditdatas[i].suppliertaxtype != creditarraydata[j].suppliertaxtype) {
              this.notification.showInfo("Please save the changes you have done")
              return false
            }
            else if (creditdatas[i].suppliertaxrate != creditarraydata[j].suppliertaxrate) {
              this.notification.showInfo("Please save the changes you have done")
              return false
            }
            else if (creditdatas[i].taxableamount != creditarraydata[j].taxableamount) {
              this.notification.showInfo("Please save the changes you have done")
              return false
            }
            else if (creditdatas[i].amount != creditarraydata[j].amount) {
              this.notification.showInfo("Please save the changes you have done")
              return false
            }
            else if (creditdatas[i].creditglno != creditarraydata[j].creditglno) {
              this.notification.showInfo("Please save the changes you have done")
              return false

            }
          }


          else {


            this.showheaderdata = true
            this.showinvocedetail = false


            let invdtldatas = this.InvoiceDetailForm.get('invoicedtl') as FormArray
            invdtldatas.clear()
            let crdtdtldatas = this.InvoiceDetailForm.get('creditdtl') as FormArray
            crdtdtldatas.clear()



          }
        }
      }
    } else {
      this.showheaderdata = true
      this.showinvocedetail = false


      let invdtldatas = this.InvoiceDetailForm.get('invoicedtl') as FormArray
      invdtldatas.clear()
      let crdtdtldatas = this.InvoiceDetailForm.get('creditdtl') as FormArray
      crdtdtldatas.clear()
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
    let amountchange = String(this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('amountchange').value).replace(/,/g, '')
    let creditamount1 = String(this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').value).replace(/,/g, '')
    console.log("amountchange in delete ...", amountchange)

    let num: number = Number(creditamount1) + Number(amountchange)
    let amt = new Intl.NumberFormat("en-GB").format(num); 
    amt = amt ? amt.toString() : '';

    this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(amt)
    if (id != undefined) {
      this.delcreditid = id
    } else {
      if(this.creditid == undefined){
        this.removecreditSection(ind)
      }else{
      for (var i = 0; i < this.creditid.length; i++) {
        if (i === ind) {
          this.delcreditid = this.creditid[i].id
        }
      }
    }

  }
  if(this.delcreditid != undefined){
    var answer = window.confirm("Are you sure to delete?");
    if (!answer) {
      return false;
    }
    this.spinner.show();
  
    this.service.invCreditDel(this.delcreditid)
      .subscribe(result => {
        this.spinner.hide();
      
        if(result.status == "success")
        {
          this.notification.showSuccess("Deleted Successfully")
          this.removecreditSection(ind)
        }
        else
        {
          this.notification.showError(result.description) 
          this.spinner.hide();
        }
        })
    }
    else{
          this.removecreditSection(ind)
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
    this.readonlydebit[control.length-1] = false
  }

  adddsplit(section: any, i: number) {
    if (section.value.category_code.code === "GST Tax")
    {
      return false
    }
    const control = <FormArray>this.DebitDetailForm.get('debitdtl');
    // control.push(this.debitdetail());

    control.insert(i+1,this.debitdetail())

    const dbtdetaildata = this.DebitDetailForm.value.debitdtl;
    for(let i=0; i<dbtdetaildata.length; i++)
    {
      if (dbtdetaildata[i].category_code.code !=="GST Tax")
      {
        this.readonlydebit[i] = false
      }
      else
      {
        this.readonlydebit[i] = true
      }
    }


  }

  removedebitSection(i) {

    const control = <FormArray>this.DebitDetailForm.get('debitdtl');
    control.removeAt(i);
    this.debitdatasums()
  }

   debitdetail() {
    let group = new FormGroup({
      apinvoicedetail_id: new FormControl(),
      branchCode: new FormControl(this.apHdrRes.raiserchoose_branch.code),
      category_code: new FormControl(0),
      subcategory_code: new FormControl(0),
      debitglno: new FormControl(''),
      bsproduct_code:new FormControl(''),
      bsproduct_code_id:new FormControl(''),
      amt: new FormControl(0.0),
      amount: new FormControl(0.0),
      deductionamount: new FormControl(0),
      // debittotal: new FormControl(),
      // cc: new FormControl(),
      // bs: new FormControl(),
      // ccbspercentage: new FormControl(100),
      remarks: new FormControl(''),
      
    })

    group.get('amount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.debitdatasums();
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
        switchMap(value => this.service.getcategoryscroll(value, 1)
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
        switchMap(value => this.service.getsubcategoryscroll(this.catid, value, 1)
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
      group.get('bsproduct_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.service.getbusinessproductscroll(value, 1)
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

  calctotaldebitdata(amount: FormControl) {
    this.debitdatasums()
  }






  calamount: any
  subamount: any
  calcTotaldebit(index) {
    let dataOnDetails = this.DebitDetailForm.value.debitdtl
    let percent: any = +dataOnDetails[index].ccbspercentage
    this.calamount = this.invdtltaxableamount * percent / 100


    this.DebitDetailForm.get('debitdtl')['controls'][index].get('amount').setValue(this.calamount)
    // console.log("test", this.calamount)
    this.debitdatasums()
  }

  calcdebitamount(group: FormGroup) {
    const amount = +group.controls['amount'].value;
    group.controls['amount'].setValue((amount), { emitEvent: false });
    this.debitdatasums()
  }

  dbtamt: any
  dbtsum: any
  debitsum: any


  debitdatasums() {
    this.dbtamt = this.DebitDetailForm.value['debitdtl'].map(x => String(x.amount).replace(/,/g, ''));
    // console.log('data check amt', this.dbtamt);
    this.dbtsum = this.dbtamt.reduce((a, b) =>(Number(a) + Number(b)), 0);

  //   let data = this.DebitDetailForm.value.debitdtl
  //   if(this.ecftypeid != 4){
  //   if (data.length === 1) {
  //     this.debitsum = this.invdtltaxableamount + this.gettaxrate
  //     console.log("debittest",data) 
  //   } else {
  //     this.debitsum = this.dbtsum
  //   }
  // }else{
    //this.debitsum = Number(this.dbtsum)
    this.debitsum = this.dbtsum.toFixed(2);
    console.log("this.debitsum-->",this.debitsum)
  // }


  }
  public displaycatFn(cattype?: catlistss): string | undefined {
    return cattype ? cattype.code : undefined;
  }

  get cattype() {
    return this.DebitDetailForm.get('category_code');
  }
  getcat(catkeyvalue) {
    if (this.isCaptalized == true)
    {
      catkeyvalue = "Asset Clearing"
    }
    this.service.getcat(catkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryNameData = datas;
        this.catid = datas.id;


      })
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
                let cat = "Asset Clearing"
                if(!this.isCaptalized)
                {
                  cat =this.categoryInput.nativeElement.value
                }
                this.service.getcategoryscroll(cat, this.currentpage + 1)
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
                this.service.getsubcategoryscroll(this.catid, this.subcategoryInput.nativeElement.value, this.currentpage + 1)
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
    this.service.getsubcat(id, subcatkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcategoryNameData = datas;


      })
  }

  public displayFnbp(producttype?: productcodelists): string | undefined {
    return producttype ? producttype.bsproduct_name : undefined;
  }

  get producttype() {
    return this.DebitDetailForm.get('bsproduct_code');
  }
  getbpdropdown(){
    this.getbusinessproduct('')
  }

  getbusinessproduct(businesskeyvalue) {
    this.service.getbusinessproductdd(businesskeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
       this.businesslist = datas

      })
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
                this.service.getbusinessproductscroll(this.bsproductInput.nativeElement.value, this.currentpage + 1)
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

  getGLNumber(data, index) {
    this.GLNumb = data.glno
    this.DebitDetailForm.get('debitdtl')['controls'][index].get('debitglno').setValue(data.glno)

  }
  debitamt(index)
  {
    let amt= this.DebitDetailForm.get('debitdtl')['controls'][index].get('amt').value
    this.DebitDetailForm.get('debitdtl')['controls'][index].get('amount').setValue(amt)
  }

  get bstype() {
    return this.DebitDetailForm.get('bs');
  }
  getbs(bskeyvalue) {
    this.service.getbs(bskeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsNameData = datas;
        this.catid = datas.id;
       
      })
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
                this.service.getbsscroll(this.bsInput.nativeElement.value, this.currentpage + 1)
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
    this.service.getcc(bssid, cckeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccNameData = datas;
        this.ccid = datas.id;

      })

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
                this.service.getccscroll(this.bssid, this.ccInput.nativeElement.value, this.currentpage + 1)
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
    //this.router.navigate(['ECF/inventory'])

  }

  moveback() {
   // this.router.navigate(['ECF/invdetailcreate'])
  }



  ccidd: any
  cccodeid: any
  getccdata(code, id) {
    this.ccidd = code
    this.cccodeid = id

  }


  Ddetails: any
  debitres: any

  remarkss: any
  debitform() {



    this.Ddetails = this.DebitDetailForm.value.debitdtl;


    const dbtdetaildata = this.DebitDetailForm.value.debitdtl;

    this.categoryid = dbtdetaildata[0].category_code
    this.subcategoryid = dbtdetaildata[0].subcategory_code
    
    for (let i in dbtdetaildata) {
      if ((dbtdetaildata[i].category_code == '') || (dbtdetaildata[i].category_code == null) || (dbtdetaildata[i].category_code == undefined)) {
        this.toastr.error('Please Choose Category');
        return false;
      }
      if ((dbtdetaildata[i].subcategory_code == '') || (dbtdetaildata[i].subcategory_code == null) || (dbtdetaildata[i].subcategory_code == undefined)) {
        this.toastr.error('Please Choose Sub Category');
        return false;
      }
      dbtdetaildata[i].bsproduct_code_id = dbtdetaildata[i].bsproduct_code.id 
      
      if (dbtdetaildata[i].bsproduct_code_id == '') {
        console.log("dbtdetaildata[i].bsproduct_code---",dbtdetaildata[i].bsproduct_code)
        this.toastr.error('Please Choose Bussiness Product Code');
        return false;
      }
      if (dbtdetaildata[i].id === "") {
        delete dbtdetaildata[i].id
      }
      // delete dbtdetaildata[i].bsproduct_code
      dbtdetaildata[i].apinvoicedetail_id = this.apinvHeader_id
      // if(this.ecftypeid == 4){
      //   dbtdetaildata[i].apinvoicedetail = ""
      //   dbtdetaildata[i].debittotal = this.totalamount
      // }else{
       // dbtdetaildata[i].debittotal = this.invtotamount
      //}
      dbtdetaildata[i].amount = String(dbtdetaildata[i].amount).replace(/,/g, '') 
      dbtdetaildata[i].amt = String(dbtdetaildata[i].amt).replace(/,/g, '') 
      dbtdetaildata[i].deductionamount = 0
      if (dbtdetaildata[i].id === "") {
        delete dbtdetaildata[i].id
      }
      if (this.invdtladdonid === "" || this.invdtladdonid === undefined || this.invdtladdonid === null) {
        delete dbtdetaildata[i].apinvoicedetail_id
      }
      else
      {
        dbtdetaildata[i].apinvoicedetail_id = this.invdtladdonid
      }
      
    }
    if (Number(this.debitsum) != Number(this.invtotamount)) {
      console.log(this.debitsum, "   +   ", this.invtotamount)
      this.toastr.error('Check Invoice Header Amount', 'Please Enter Valid Amount');
      return false
    }

    this.Ddetails = this.DebitDetailForm.value.debitdtl;
    let debdata = {"apdebit" : this.Ddetails}
    console.log("debdata -->", debdata)
    this.spinner.show();
  
    this.service.invDebitAddEdit(this.apinvHeader_id, debdata)
        .subscribe(result => {
          this.spinner.hide();
  
          if (result.code != undefined) {
            this.notification.showError(result.description)

          }
          else {
            this.notification.showSuccess("Successfully Debit Details Saved!...")
            this.debitres = result["data"]
            console.log("saved debit ", this.debitres )
            this.debitsaved = true
           
            //check for ccbs
            this.spinner.show();
  
            this.service.getInvDebit(this.apinvHeader_id)
            .subscribe(result => {
              this.spinner.hide();
  
             if (result)
             {
                this.debitres = result["data"]
                console.log(" Debit data ...",this.debitres )
      
                let invdbtdatas = this.DebitDetailForm.get('debitdtl') as FormArray
                invdbtdatas.clear()
               
                if (this.invdtladdonid === "" || this.invdtladdonid === undefined || this.invdtladdonid === null) 
                {
                  this.debitdata = this.debitres
                }
                else
                {
                  this.debitdata = this.filterdebitinvdtl(this.debitres,this.invdtladdonid)
                }
                this.getdebitrecords(this.debitdata)
                for (let debit of this.debitdata)
                {
                  if(debit.category_code.code !== "GST Tax")
                  {
                    let debamt=debit.amount
                    let ccbsdata=debit.ccbs
                    if(ccbsdata)
                    {
                      if(ccbsdata.length > 0)
                      {
                        let ccbsamtdata= ccbsdata.map(x => x.amount)
               
                        let sum = ccbsamtdata.reduce((a,b) => a+b,0)        
                        if(sum !== debamt)
                        {
                          this.ccbsAutosave();
                          return false
                        }
                      }
                      else
                      {
                        this.ccbsAutosave();
                        return false
                      }
                    }
                    else
                    {
                      this.ccbsAutosave();
                      return false
                    }      
                  }
                } 
              }
              else
              {
                this.debitClose()        
              }
            })     
          }
        })    
        
  }

  ccbsAutosave()
  {      
    this.debdata = this.invdtls.filter(x => x.id == this.invdtladdonid)[0]?.apdebit?.data
    this.ccbsdet = this.debdata[0]?.ccbs
         
    if(this.debdata != undefined && this.debdata != null && this.ccbsdet != undefined && this.ccbsdet != null)
    {  
    for(let deb of this.debitdata)
    {
      let ccbs
          
      if(deb.ccbs.length==0)
      {
        ccbs = this.ccbsdet
        let ccbsdetails  = []
       
        for(let item of ccbs)
        {
          delete item.id
          item.amount = deb.amount * item.ccbspercentage / 100
          ccbsdetails.push(item)
        }        
        
        let ccbsdet = {"ccbs" : ccbsdetails}
        
        this.service.ccbsAddEdit(deb.id, ccbsdet)
            .subscribe(result => {
              if (result.code != undefined) {
                this.notification.showError(result.description)      
              }
              else {
                this.ccbsres = result
                console.log("this.ccbsres ", this.ccbsres )
              }
            })  
      }  
    }
    }
  }

  debitClose()
  {
      this.showinvoicediv=true
      this.showdebitdiv=false

      let debitcontrol = this.DebitDetailForm.controls["debitdtl"] as FormArray;
      debitcontrol.clear()
  }


  deldebitid: any
  deletedebitdetail(section, ind) {
    if (section.value.category_code.code === "GST Tax")
    {
      return false
    }

    let id = section.value.id

    if (id != undefined) {
      this.deldebitid = id
    } 
    if(this.deldebitid != undefined){
      var answer = window.confirm("Are you sure to delete?");
      if (!answer) {
        return false;
      }
    this.spinner.show();
  
    this.service.invDebitDel(this.deldebitid)
      .subscribe(result => {
       this.spinner.hide();
  
       if(result.status == "success"){
        this.notification.showSuccess("Deleted Successfully")
        this.removedebitSection(ind)
       }else{
        this.notification.showError(result.description) 
       }
      })

      const dbtdetaildata = this.DebitDetailForm.value.debitdtl;
      let debtax
      debtax =Number((this.cgstval +this.sgstval + this.igstval) / 2)
      for(let i=0; i<dbtdetaildata.length; i++)
      {
        if (dbtdetaildata[i].amount <= debtax)
        {
          this.readonlydebit[i] = true
        }
        else
        {
          this.readonlydebit[i] = false
        }
      }
    
    }else{
      this.removedebitSection(ind)
    }

  }

  debitback() {
    let datas = this.getdebittdatas
    let debitdatas = this.DebitDetailForm.value.debitdtl
    for (let i in datas) {
      for (let j in debitdatas) {
        if (i == j) {
          if (datas[i].category_code.id != debitdatas[j].category_code.id) {
            this.notification.showInfo("Please save the changes you have done")
            return false

          }
          else if (datas[i].subcategory_code.id != debitdatas[j].subcategory_code.id) {
            this.notification.showInfo("Please save the changes you have done")
            return false

          }
          else if (datas[i].debitglno != debitdatas[j].debitglno) {
            this.notification.showInfo("Please save the changes you have done")
            return false

          }
          // else if (datas[i].ccbs.bs_code.code != debitdatas[j].bs.code) {
          //   this.notification.showInfo("Please save the changes you have done")
          //   return false

          // }
          // else if (datas[i].ccbs.cc_code.code != debitdatas[j].cc.code) {
          //   this.notification.showInfo("Please save the changes you have done")
          //   return false

          // }
          // else if (datas[i].ccbs.remarks != debitdatas[j].remarks) {
          //   this.notification.showInfo("Please save the changes you have done")
          //   return false

          // }
          else if (datas[i].amount != debitdatas[j].amount) {
            this.notification.showInfo("Please save the changes you have done")
            return false

          }
          else if (datas[i].deductionamount != debitdatas[j].deductionamount) {
            this.notification.showInfo("Please save the changes you have done")
            return false

          }
          // else if (datas[i].ccbs.ccbspercentage != debitdatas[j].ccbspercentage) {
          //   this.notification.showInfo("Please save the changes you have done")
          //   return false

          // }
        }

        else {
          this.debitclosebtn.nativeElement.click();

        }
      }
    }
  }

  debitbacks() {
               //check for ccbs
               this.service.getInvDebit(this.apinvHeader_id)
               .subscribe(result => {
      
               console.log("getInvDebit",result)
               if (result)
               {
              
                  this.getdebittdatas = result["data"]
              
                  if (this.getdebittdatas.length>0) 
                  {
                    this.debitdata = this.filterdebitinvdtl(this.getdebittdatas,this.invdtladdonid)
                  }
                  else
                  {
                    this.debitdata = this.getdebittdatas
                  }
                  let debres =this.debitdata
                  for (let debit of debres)
                  {
                   if(debit.category_code.code !== "GST Tax" && debit.amount !== 0)
                     {
                      let debamt=debit.amount
                      let ccbsdata=debit.ccbs
                      if(ccbsdata)
                      {
                        if(ccbsdata.length > 0)
                        {
                          let ccbsamtdata= ccbsdata.map(x => x.amount)
                 
                          let sum = ccbsamtdata.reduce((a,b) => a+b,0)        
                          if(sum !== debamt)
                          {
                           var answer = window.confirm("CCBS entry not completed. Are you sure to close debit?");
                           if (answer) {
                             this.debitClose() 
                             return false
                           }
                           else {
                             return false;
                           }                            
                          }
                        }
                        else
                        {
                         var answer = window.confirm("CCBS entry not completed. Are you sure to close debit?");
                         if (answer) {
                           this.debitClose()  
                           return false
                         }
                         else {
                           return false;
                         }  
                        }
                      }
                      else
                      {
                       var answer = window.confirm("CCBS entry not completed. Are you sure to close debit?");
                       if (answer) {
                         this.debitClose() 
                         return false  
                       }
                       else {
                         return false;
                       }  
                      }      
                    }
                  } 
                  this.debitClose() 
                  
                }
             })


               
  }

 // -------ccbs--------

 getbsdropdown(){
  this.getbs('')
}
 getccbsSections(form) {

  return form.controls.ccbsdtl.controls;
}
ccbsindex: any
addccbsSection() {
 
  const control = <FormArray>this.ccbsForm.get('ccbsdtl');
  control.push(this.ccbsdetail());
}

removeccbsSection(i) {

  const control = <FormArray>this.ccbsForm.get('ccbsdtl');
  control.removeAt(i);
  this.debitdatasums()
}

ccbsaddindex: any =0
addonccbsindex(index) {
    this.ccbsaddindex = index
  }

  ccbsamount: any
  calcTotalccbs(index) {
    let dataOnDetails = this.ccbsForm.value.ccbsdtl
    let percent: any = +dataOnDetails[index].ccbspercentage
    this.ccbsamount = this.debitamount * percent / 100

    let num: number = +this.ccbsamount;
    let amt = new Intl.NumberFormat("en-GB").format(num); 
    amt = amt ? amt.toString() : '';

    this.ccbsForm.get('ccbsdtl')['controls'][index].get('amount').setValue(amt)
    this.debitccbssums()
  }
  
ccbsdetail() {
  let group = new FormGroup({
    id: new FormControl(),    
    cc_code: new FormControl(),
    bs_code: new FormControl(),
    code: new FormControl(),
    ccbspercentage: new FormControl(100),
    glno: new FormControl(''),
    remarks: new FormControl(''),
    amount: new FormControl(0.0),   
  })

  group.get('ccbspercentage').valueChanges.pipe(
    debounceTime(20)
  ).subscribe(value => {

    this.calcTotalccbs(this.ccbsaddindex)
    if (!this.ccbsForm.valid) {
      return;
    }
    this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
  }
  )

  group.get('amount').valueChanges.pipe(
    debounceTime(20)
  ).subscribe(value => {

    this.calcTotalccbs(this.ccbsaddindex)
    if (!this.ccbsForm.valid) {
      return;
    }
    this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
  }
  )

  let bskeyvalue: String = "";
  this.getbs(bskeyvalue);
  group.get('bs_code').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.service.getbsscroll(value, 1)
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
      this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
    })

  group.get('cc_code').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.service.getccscroll(this.bssid, value, 1)
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
      this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
    })


  return group
}

viewccbs(section, data, index) {
  let debitdata = this.debitdata

  if (debitdata[index]?.category_code.name != section.value.category_code.name) {
    this.notification.showInfo("Please save the changes done in Category code")
    this.showccbspopup = false
    return false

  }
  else if (debitdata[index]?.subcategory_code.name != section.value.subcategory_code.name) {
    this.notification.showInfo("Please save the changes done in Subcategory")
    this.showccbspopup = false
    return false

  }
  else if (debitdata[index]?.debitglno != section.value.debitglno) {
    this.notification.showInfo("Please save the changes done in GL Number")
    this.showccbspopup = false
    return false

  }
  else if (debitdata[index]?.bsproduct_code_id != section.value.bsproduct_code_id) {
    this.notification.showInfo("Please save the changes done in Business Product code")
    this.showccbspopup = false
    return false

  }
  else if (debitdata[index]?.amount != section.value.amount) {
    this.notification.showInfo("Please save the changes done in Amount")
    this.showccbspopup = false
    return false

  }
  else if (debitdata[index]?.deductionamount != section.value.deductionamount) {
    this.notification.showInfo("Please save the changes done in Adjust amount")
    this.showccbspopup = false
    return false

  }
  else {
    this.addccbs(section, data, index)
  }
}

enableUpload = true
fileToUpload: any;
ccbsFile :boolean = false
chooseFile(event:any){
    this.fileToUpload =[]
    this.fileToUpload=event.target.files[0];
    this.ccbsFile=true;   
  } 

uploadFile() {
    if(this.ccbsFile==false)
    {
      this.notification.showWarning("Please select a file to Upload")
    }
    else
    {
      this.spinner.show();  
      this.service.uploadCcbsFile(this.debitaddonid, this.fileToUpload).subscribe(result=>{
        if(result?.data)
        {
          this.service.getCcbs(this.debitaddonid)
          .subscribe(result => {
            if (result === undefined)
            {
                return false
            }
      
            this.getccbsdatas = result["data"]
          let ccbs = this.ccbsForm.controls["ccbsdtl"] as FormArray;
          ccbs.clear()
          this.getccbsrecords(this.getccbsdatas)
          this.debitccbssums()
          })
          this.enableUpload= false
          this.notification.showSuccess("Uploaded successfully.")
         
          this.spinner.hide();
          this.ccbsFile=false;
        }
        else
        {
          this.spinner.hide();
          this.notification.showError("Invalid File Format.")
          this.ccbsFile=false;
        }
      }
      )
    }    
  }
debitaddonid:any
debitamount:any
debitglno:any
getccbsdatas: any

debdata : any
ccbsdet : any

addccbs(section, data, index) {
  this.uploadinput.nativeElement.value=""
  this.fileToUpload =[]
  this.enableUpload= true
  this.spinner.show();
  
  this.ccbssaved = false
  let datas = this.ccbsForm.get('ccbsdtl') as FormArray
  datas.clear()
  if (this.debitdata != undefined) {
    let datas = this.debitdata[index]
    this.debitglno=datas.debitglno
    this.debitamount = String(datas.amount).replace(/,/g, '')    
    this.debitaddonid = datas.id

  } else {
    let sections = section.value
    this.debitglno=sections.debitglno
    this.debitamount = String(sections.amount).replace(/,/g, '')   
    this.debitaddonid = sections.id
  }

  if(this.debitaddonid == undefined){
    this.notification.showWarning("Please save the Debit Detail Changes")
    this.showccbspopup = false
    this.spinner.hide();
 
    return false;

  }else{
  
  this.service.getCcbs(this.debitaddonid)
    .subscribe(result => {
       console.log("getccbsrecords",result)
      if (result === undefined)
      {
          return false
      }

      this.getccbsdatas = result["data"]
      if (this.getccbsdatas.length === 0) 
      {
        this.addccbsSection()
        this.debdata = this.invdtls.filter(x => x.id == this.invdtladdonid)[0]?.apdebit?.data
        if(this.debdata != undefined && this.debdata != null)
        {
          this.ccbsdet = this.debdata[0]?.ccbs[0]
          if (this.ccbsdet != undefined && this.ccbsdet != null)
          {
            this.ccbsForm.get('ccbsdtl')['controls'][0].get('cc_code').setValue(this.ccbsdet.cc_code)
            this.ccbsForm.get('ccbsdtl')['controls'][0].get('bs_code').setValue(this.ccbsdet.bs_code)
            this.ccbsForm.get('ccbsdtl')['controls'][0].get('code').setValue(this.ccbsdet.code)
          }
        }
         
        this.ccbsForm.get('ccbsdtl')['controls'][0].get('glno').setValue(this.debitglno)
        this.ccbsForm.get('ccbsdtl')['controls'][0].get('ccbspercentage').setValue(100)
        let num: number = +this.debitamount;
        let amt = new Intl.NumberFormat("en-GB").format(num); 
        amt = amt ? amt.toString() : '';
        
        this.ccbsForm.get('ccbsdtl')['controls'][0].get('amount').setValue(amt)
        this.debitccbssums()   
      }
      else      
      {
        this.getccbsrecords(this.getccbsdatas)       
      }
    })
  }
  this.spinner.hide();
}

getccbsrecords(datas) {
  console.log(datas)
 
  if(datas.length == 0){

    const control = <FormArray>this.ccbsForm.get('ccbsdtl');
    control.push(this.ccbsdetail());
  }

  for (let ccbs of datas) {
    let id: FormControl = new FormControl('');
    
    let cc_code: FormControl = new FormControl('');
    let bs_code: FormControl = new FormControl('');
    let code: FormControl = new FormControl('');
    let ccbspercentage: FormControl = new FormControl('');
    let glno: FormControl = new FormControl('');
    let remarks: FormControl = new FormControl(0);
    let amount: FormControl = new FormControl('');
    const ccbsFormArray = this.ccbsForm.get("ccbsdtl") as FormArray;

    id.setValue(ccbs.id)
    
    cc_code.setValue(ccbs.cc_code)
    bs_code.setValue(ccbs.bs_code)
    code.setValue(ccbs.code)
    ccbspercentage.setValue(ccbs.ccbspercentage)
    glno.setValue(ccbs.glno)
    remarks.setValue(ccbs.remarks)
    let num: number = +ccbs.amount;
    let amt = new Intl.NumberFormat("en-GB").format(num); 
    amt = amt ? amt.toString() : '';

    amount.setValue(amt)

    ccbsFormArray.push(new FormGroup({
      id: id,
      cc_code: cc_code,
      bs_code: bs_code,
      code: code,
      ccbspercentage: ccbspercentage,
      glno: glno,
      remarks: remarks,
      amount: amount,  
    }))
    
    let bskeyvalue: String = "";
    this.getbs(bskeyvalue);
    bs_code.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.service.getbsscroll(value, 1)
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
        // console.log("bsdata", this.bsNameData)
        this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
      })

    cc_code.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.service.getccscroll(this.bssid, value, 1)
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
        this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
      })

    this.debitccbssums();

    ccbspercentage.valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalccbs(this.ccbsaddindex)
      if (!this.ccbsForm.valid) {
        return;
      }
      this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
    }
    )

    amount.valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      this.calcTotalccbs(this.ccbsaddindex)
      if (!this.ccbsForm.valid) {
        return;
      }
      this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
    }
    )
  }
  // }
}

ccbsdetails:any
ccbsres: any

ccbsform() {
  const ccbsdata = this.ccbsForm.value.ccbsdtl;
  for (let i in ccbsdata) {

    if ((ccbsdata[i].cc_code == '') || (ccbsdata[i].cc_code == null) || (ccbsdata[i].cc_code == undefined)) {
      this.toastr.error('Please Choose cc');
      return false;
    }
    if ((ccbsdata[i].bs_code == '') || (ccbsdata[i].bs_code == null) || (ccbsdata[i].bs_code == undefined)) {
      this.toastr.error('Please Choose bs');
      return false;
    }
    if (ccbsdata[i].id === "") {
      delete ccbsdata[i].id
    }
    ccbsdata[i].code=ccbsdata[i].cc_code.id
    ccbsdata[i].amount = String(ccbsdata[i].amount).replace(/,/g, '');   
  }
  let percentage =ccbsdata.map(x => x.ccbspercentage )
  let percentsum = percentage.reduce((a, b) =>(Number(a) + Number(b)), 0);
  
  if (percentsum != 100) {
    this.toastr.error('Total CCBS Percentage should be 100');
    return false
  }
  if (this.ccbsssum > this.debitamount || this.ccbsssum < this.debitamount) {
    this.toastr.error('Check Debit Amount', 'Please Enter Valid Amount');
    return false
  }
  this.ccbsdetails = this.ccbsForm.value.ccbsdtl;
  let ccbsdet = {"ccbs" : this.ccbsdetails}
  this.spinner.show();
  
  this.service.ccbsAddEdit(this.debitaddonid, ccbsdet)
      .subscribe(result => {
        this.spinner.hide();
  
        if (result.code != undefined) {
          this.notification.showError(result.description)

        }
        else {
          this.notification.showSuccess("Successfully CCBS Details Saved!...")
          this.ccbsres = result
          console.log("this.ccbsres ", this.ccbsres )
          this.ccbssaved =true
          this.ccbsclose.nativeElement.click();
        }
      })    
}

delccbsid: any
deleteccbs(section, ind) {
    let id = section.value.id

    if (id != undefined) {
      this.delccbsid = id
    } else {

      if(this.ccbsres == undefined){
        this.removeccbsSection(ind)
      }else{
      for (var i = 0; i < this.ccbsres.length; i++) {
        if (i === ind) {
          this.delccbsid = this.ccbsres[i].id
        }
      }
    }
    }
    if(this.delccbsid != undefined){
      var answer = window.confirm("Are you sure to delete?");
      if (!answer) {
        return false;
      }
      this.spinner.show();
  
    this.service.ccbsdelete(this.delccbsid)
      .subscribe(result => {
        this.spinner.hide();
  
       if(result.status == "success"){
        this.notification.showSuccess("Deleted Successfully")
        this.removeccbsSection(ind)
       }else{
        this.notification.showError(result.description) 
       }
      })
    
    }else{
      this.removeccbsSection(ind)
    }
  }

  ccbsamt: any
  ccbssum: any
  ccbsssum: any


  debitccbssums() {
    this.ccbsamt = this.ccbsForm.value['ccbsdtl'].map(x => String(x.amount).replace(/,/g, ''));
    this.ccbssum = this.ccbsamt.reduce((a, b) =>(Number(a) + Number(b)), 0);
    this.ccbsssum = this.ccbssum
  }

  ccbsback() {
    // let datas = this.getdebittdatas
    // let debitdatas = this.DebitDetailForm.value.debitdtl
    // for (let i in datas) {
    //   for (let j in debitdatas) {
    //     if (i == j) {
    //       if (datas[i].category_code.id != debitdatas[j].category_code.id) {
    //         this.notification.showInfo("Please save the changes you have done")
    //         return false

    //       }
    //       else if (datas[i].subcategory_code.id != debitdatas[j].subcategory_code.id) {
    //         this.notification.showInfo("Please save the changes you have done")
    //         return false

    //       }
    //       else if (datas[i].debitglno != debitdatas[j].debitglno) {
    //         this.notification.showInfo("Please save the changes you have done")
    //         return false

    //       }
    //       // else if (datas[i].ccbs.bs_code.code != debitdatas[j].bs.code) {
    //       //   this.notification.showInfo("Please save the changes you have done")
    //       //   return false

    //       // }
    //       // else if (datas[i].ccbs.cc_code.code != debitdatas[j].cc.code) {
    //       //   this.notification.showInfo("Please save the changes you have done")
    //       //   return false

    //       // }
    //       // else if (datas[i].ccbs.remarks != debitdatas[j].remarks) {
    //       //   this.notification.showInfo("Please save the changes you have done")
    //       //   return false

    //       // }
    //       else if (datas[i].amount != debitdatas[j].amount) {
    //         this.notification.showInfo("Please save the changes you have done")
    //         return false

    //       }
    //       else if (datas[i].deductionamount != debitdatas[j].deductionamount) {
    //         this.notification.showInfo("Please save the changes you have done")
    //         return false

    //       }
    //       // else if (datas[i].ccbs.ccbspercentage != debitdatas[j].ccbspercentage) {
    //       //   this.notification.showInfo("Please save the changes you have done")
    //       //   return false

    //       // }
    //     }

    //     else {
    //       this.closebutton.nativeElement.click();

    //     }
    //   }
    // }
  }

  ccbsbacks() {
    const ccbsdata = this.ccbsForm.value.ccbsdtl;

    let percentage =ccbsdata.map(x => x.ccbspercentage )
    let percentsum = percentage.reduce((a, b) =>(Number(a) + Number(b)), 0);
    
    if (percentsum != 100) {
      this.notification.showWarning('Total CCBS Percentage should be 100');
      return false
    }
   
    if(Number(this.ccbsssum) != Number(this.debitamount) )
    {
      this.notification.showWarning("CCBS Amount Mismatch.")
    }    
    let ccbscontrol = this.ccbsForm.controls["ccbsdtl"] as FormArray;
    ccbscontrol.clear()
  }



  Rvalue: number = 0;
  Ovalue: number = 0;
  min: number = -1;
  max: number = 1;
  RoundingOFF(e) {
    if (e >= this.max) {
      // this.Rvalue = 0
      this.InvoiceDetailForm.patchValue({
        roundoffamt : 0
      })
      this.toastr.warning("Round off Amount should be between -1 and 1");
      return false
    }
    else if (e < this.min) {
      // this.Rvalue = 0
      this.InvoiceDetailForm.patchValue({
        roundoffamt : 0
      })
      this.toastr.warning("Round off Amount should be between -1 and 1");
      return false
    }
    else if (e < this.max) {
      this.Rvalue = e
      this.INVdatasums()
    }
  }
  
  AdjustAmount(e,ind) {
    if (e >= this.max) {
      // this.Rvalue = 0
      this.DebitDetailForm.get('debitdtl')['controls'][ind].get('deductionamount').setValue(0)
      this.toastr.warning("Should be between -1 and 1");
      return false
    }
    else if (e < this.min) {
      this.DebitDetailForm.get('debitdtl')['controls'][ind].get('deductionamount').setValue(0)
      this.toastr.warning("Should be between -1 and 1");
      return false
    }
    else if (e < this.max) {
      this.debitAdjust(ind)
      this.debitdatasums()
    }
  }

  debitAdjust(ind)
  {
    let dataOnDetails = this.DebitDetailForm.value.debitdtl
    let amt: any = +(String(dataOnDetails[ind].amt).replace(/,/g, ""));
    let adj: any = +dataOnDetails[ind].deductionamount
    let dbt = amt + adj

    let temp = new Intl.NumberFormat("en-GB", {style: 'decimal'}).format(dbt); 
    temp = temp ? temp.toString() : '';
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('amount').setValue(dbt.toFixed(2))
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


  numberOnlyandDotminus(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57) && ((charCode < 45 || charCode > 46))) {
      return false;
    }
    return true;
  }

  // backform() {
  //   this.onCancel.emit()

  // }

  overallback() {
    this.router.navigate(['/ap/apHeader'], {queryParams:{comefrom : "apsummary", apheader_id : this.apheader_id}, skipLocationChange: true });
  }


  suppliersubmitForm() {
    this.closebuttons.nativeElement.click();
  }

  supplierbackform() {
    this.closebuttons.nativeElement.click();
  }

  characterOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode >90)  && (charCode < 96 || charCode > 122) ){ 
    return false;
    }
    return true;
  }

  characterandnumberonly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode >90)  && (charCode < 96 || charCode > 122) && (charCode < 48 || charCode > 57)){ 
    return false;
    }
    return true;
  }
  // ---------overall submit------

  // public displayFnbranch(branchtype?: branchListss): string | undefined {

  //   return branchtype ? branchtype.name : undefined;
  // }

  // // get branchtype() {
  // //   return this.SubmitoverallForm.get('approver_branch');
  // // }

  // public displayFnbranchrole(branchtyperole?: branchListss): string | undefined {

  //   return branchtyperole ? +branchtyperole.code +"-"+branchtyperole.name : undefined;
   
  // }

  // get branchtyperole() {
  //   return this.ecfheaderForm.get('branch');
  // }


  // private branchdropdown(branchkeyvalue) {
  //   this.service.getbranch(branchkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.Branchlist = datas;
        

  //     })
  // }

  // branchScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matbranchAutocomplete &&
  //       this.matbranchAutocomplete &&
  //       this.matbranchAutocomplete.panel
  //     ) {
  //       fromEvent(this.matbranchAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matbranchAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.service.getbranchscroll(this.branchInput.nativeElement.value, this.currentpage + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   if (this.Branchlist.length >= 0) {
  //                     this.Branchlist = this.Branchlist.concat(datas);
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



  // gettdsapplicable() {
  //   this.service.gettdsapplicability()
  //     .subscribe(result => {
  //     this.tdsList = result['data']
  //     })
  // }

  // public displayFnapprover(approvertype?: approverListss): string | undefined {
  //   return approvertype ? approvertype.full_name : undefined;
  // }

  // // get approvertype() {
  // //   return this.SubmitoverallForm.get('approved_by');
  // // }
  // approvid: any
  // approverid(data) {
  //  this.approvid = data.id
  // }


  // private approverdropdown(approverkeyvalue) {
  //   this.service.getapprover(approverkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.Approverlist = datas;
       

  //     })
  // }

  // approverScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matappAutocomplete &&
  //       this.matappAutocomplete &&
  //       this.matappAutocomplete.panel
  //     ) {
  //       fromEvent(this.matappAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matappAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matappAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matappAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matappAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.service.getapproverscroll(this.approverInput.nativeElement.value, this.currentpage + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   if (this.Approverlist.length >= 0) {
  //                     this.Approverlist = this.Approverlist.concat(datas);
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

  


  OverallFormSubmit() {
    console.log("this.dedupflage",this.dedupflage)
    console.log("this.auditflage",this.auditflage)
    if(this.dedupflage==false || this.auditflage==false)
    {
      this.toastr.error('Please Check Audit & Dedup CheckList.')
      return false
    }
    if(this.bankdetailsids?.code =="INVALID_BANK_ID" || this.bankdetailsids === "" || this.bankdetailsids === null || this.bankdetailsids === undefined)
    {
      this.toastr.error('Please save the credit section with Debit bank.')
      return false
    }

    // console.log(this.creditres)
    // let creddata = this.creditres.filter(x => x.amount > 0 && x.paymode.gl_flag == "Adjustable")

    // let credamt = creddata.map(x => x.amount)
    // let credsum = credamt.reduce((a,b) => Number(a) + Number(b))
    // if(credsum != +this.totalamount)
    // {
    //   this.toastr.error('Credit Amount mismatch')
    //   return false
    // }

    const overallform = this.SubmitoverallForm.value
   
    if(overallform.remark === "" )
    {
      this.toastr.error('Please enter Remarks.')
      return false
    }
    overallform.remarks =overallform.remark
    this.spinner.show();
  
    this.service.OverallAPSubmit(this.SubmitoverallForm.value)
    
    .subscribe(result => {
      this.spinner.hide();
  
      if (result.status != "success") {
        this.notification.showError(result.message)
        return false
      }
      else {
        this.notification.showSuccess("Successfully AP Created!...")
        this.onSubmit.emit()
        this.submitoverallbtn = true
      }
    })   
  }

  filterText(ctrl, ctrlname, ind)
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
    if(ctrlname== "desc")
      this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('description').setValue(text)
    else if(ctrlname == "ccbsrem")
      this.ccbsForm.get('ccbsdtl')['controls'][ind].get('remarks').setValue(text)
    else if(ctrlname == "remarks")
      this.SubmitoverallForm.get('remark').setValue(text)
  }




//Dedup
getdedup()
{
  this.dedupflage=true;
    //dedupe for type(exact)
    this.service.getInwDedupeChk(this.apinvHeader_id,this.type1[0])
    .subscribe(result => {
      this.exactList = result['data']
      console.log("exactList",this.exactList)
  
      // let dataPagination = result['pagination'];
      // if (this.exactList.length >= 0) {
      //   this.has_next = dataPagination.has_next;
      //   this.has_previous = dataPagination.has_previous;
      //   this.presentpage = dataPagination.index;
      //   this.isSummaryPagination = true;
      // } if (this.exactList <= 0) {
      //   this.isSummaryPagination = false;
      // }        
    },error=>{
      console.log("No data found")
    }            
    )
  //dedupe for type(WITHOUT_SUPPLIER)
    this.service.getInwDedupeChk(this.apinvHeader_id,this.type1[1])
  .subscribe(result => {
    this.withoutSuppList = result['data']
    console.log("WITHOUT_SUPPLIER List",this.withoutSuppList)
    // let dataPagination = result['pagination'];
    // if (this.exactList.length >= 0) {
    //   this.has_next = dataPagination.has_next;
    //   this.has_previous = dataPagination.has_previous;
    //   this.presentpage = dataPagination.index;
    //   this.isSummaryPagination = true;
    // } if (this.exactList <= 0) {
    //   this.isSummaryPagination = false;
    // }        
  },error=>{
    console.log("No data found")
  }            
  )
  
  //dedupe for type(WITHOUT_INVOICE_AMOUNT)
  this.service.getInwDedupeChk(this.apinvHeader_id,this.type1[2])
    .subscribe(result => {
      this.withoutInvAmtList = result['data']
      console.log("WITHOUT_INVOICE_AMOUNT List",this.withoutInvAmtList)
      // let dataPagination = result['pagination'];
      // if (this.exactList.length >= 0) {
      //   this.has_next = dataPagination.has_next;
      //   this.has_previous = dataPagination.has_previous;
      //   this.presentpage = dataPagination.index;
      //   this.isSummaryPagination = true;
      // } if (this.exactList <= 0) {
      //   this.isSummaryPagination = false;
      // }        
    },error=>{
      console.log("No data found")
    }             
    )
  
    //dedupe for type(WITHOUT_INVOICE_NUMBER)
  this.service.getInwDedupeChk(this.apinvHeader_id,this.type1[3])
  .subscribe(result => {
    this.withoutInvNoList = result['data']
    console.log("WITHOUT_INVOICE_NUMBER List",this.withoutInvNoList)
  //   let dataPagination = result['pagination'];
  //   if (this.exactList.length >= 0) {
  //     this.has_next = dataPagination.has_next;
  //     this.has_previous = dataPagination.has_previous;
  //     this.presentpage = dataPagination.index;
  //     this.isSummaryPagination = true;
  //   } if (this.exactList <= 0) {
  //    this.isSummaryPagination = false;
  //   }        
  },error=>{
    console.log("No data found")
  }            
  )
  
  //dedupe for type(WITHOUT_INVOICE_DATE)
  this.service.getInwDedupeChk(this.apinvHeader_id,this.type1[4])
    .subscribe(result => {
      this.withoutInvDtList = result['data']
      console.log("WITHOUT_INVOICE_DATE List",this.withoutInvDtList)
      // let dataPagination = result['pagination'];
      // if (this.exactList.length >= 0) {
      //   this.has_next = dataPagination.has_next;
      //   this.has_previous = dataPagination.has_previous;
      //   this.presentpage = dataPagination.index;
      //   this.isSummaryPagination = true;
      // } if (this.exactList <= 0) {
      //   this.isSummaryPagination = false;
      // }        
    },error=>{
      console.log("No data found")
    }            
    )
    this.spinner.hide();
}
getquestion()
{
  this.auditflage=true;
  this.service.audicservie(this.typeid).subscribe(data=>{
    this.data=data['data'];
    for(let i=0;i<this.data.length;i++){
      this.data[i]['clk']=false;
      this.data[i]['value']=1;       
    }
    this.quelength=this.data.length
    console.log('check=',data);
    console.log("quelength",this.quelength)
})
}

submitted(){
  this.array=[{"auditchecklist":[]}]
  console.log(this.data);
  for(let i=0;i<this.data.length;i++){
    if(this.data[i]['clk']){
      let dear:any={
        'apauditchecklist_id':this.data[i]['id'],
        'apinvoiceheader_id':this.apinvHeader_id,
        'value':this.data[i]['value']
      };
       }
  }
let obj={
    'auditchecklist':this.bo
  }
  console.log('obj', obj);
  this.service.audiokservie(obj).subscribe(data=>{
    this.notification.showSuccess(data['status'])
   },
   (error)=>{
   alert(error.status+error.statusText);
  }
  )
  this.auditclose.nativeElement.click();
}
ok(i:any,dt)
{
  let val=1;
  let dear:any={
    "apauditchecklist_id":dt.id,
    "apinvoiceheader_id":this.apinvHeader_id,
    "value":val}; 
  console.log(dear)
  console.log("check bounce",dear)
  for(let i=0;i<this.bo.length;i++){
   if(this.bo[i].apauditchecklist_id==dt.id ){
     this.bo.splice(i,1)
   }
  }
this.bo.push(dear)
  console.log("bo",this.bo)
 }
 notok(i:any,dt)
 {
   let d=2;
    let dear:any={
    "apauditchecklist_id":dt.id,
    "apinvoiceheader_id":this.apinvHeader_id,
    "value":d};  
   console.log("check bounce",dear)
   for(let i=0;i<this.bo.length;i++){
    if(this.bo[i].apauditchecklist_id==dt.id ){
      this.bo.splice(i,1)
    }
   }
this.bo.push(dear)
console.log("bo",this.bo)
}
 nap(i:any,dt)
 {
 let d=3
let dear:any={
    "apauditchecklist_id":dt.id,
    "apinvoiceheader_id":this.apinvHeader_id,
    "value":d};
    console.log("check bounce",dear)
    for(let i=0;i<this.bo.length;i++){
     if(this.bo[i].apauditchecklist_id==dt.id ){
       this.bo.splice(i,1)
     }
    }
 this.bo.push(dear)
 console.log("bo",this.bo)
 }
 bounce()
 {
  this.cli=true;
  this.remark=this.rem.value;
  console.log("date",this.invoicedate)
  console.log("Hai",this.remark)
  let bouio:any={
    "status_id":this.sta.toString(),
    "apinvoicehdr_id":this.apinvHeader_id.toString(),
    "invoicedate":this.invoicedate.toString(),
    "remark":this.remark.toString()
};
let obj={
  'auditchecklist':this.bo
}
 this.service.audiokservie(obj).subscribe(data=>{
   console.log(data)
    if(data['status']=="success"){
    this.notification.showSuccess(data['message']);

    }
  }
 )

 this.service.bounce(bouio).subscribe(data=>{
  console.log(data)
 }
)
 console.log("check bounce",obj)
 this.auditclose.nativeElement.click();
 }

 disables(){
   let count=0
  //  let tocount=0
  //  for(let i=0;i<this.bo.length;i++)
  //  {
  //   if(this.bo[i].value==2){
  //     count++
  //   }
  //   else{
  //     tocount=tocount+1;
  //   }
  // }
  //  if(tocount==this.quelength){
  //   return false
  //   }
  //   else{
  //     return true
  //   }  
  for(let i=0;i<this.bo.length;i++)
   {
    if(this.bo[i].value==2){
      return true;
      
    }
  }
  
   }
   nextClick() {
    if (this.has_next === true) {
    this.presentpage=this.presentpage+1;
       this.getdedup();
    }
  }
previousClick() {
    if (this.has_previous === true) {
this.presentpage=this.presentpage-1;
this.getdedup();
    }
  }
  viewtrn()
  {
    console.log("id",this.apinvHeader_id)
    this.service1.viewtracation(this.apinvHeader_id).subscribe(data=>
     {
       this.viewtrnlist = data['data']
       console.log("trnDt",this.viewtrnlist)
     })
  }
  view(dt){
   this.name=dt.from_user.name
  //  this.designation=dt.from_user.designation
   this.branch=dt.from_user_branch.name
  }
  viewto(dt)
 {
   this.name=dt.to_user.name
  //  this.designation=dt.to_user.designation
   this.branch=dt.to_user_branch.name
 }


 debitsamp:any=[]
 creditsamp:any=[]
 debtcrtsamp:any=[]
sampleentrybutton:boolean=true
  beforeent()
  {
    this.spinner.show()
    this.sampleentrybutton=false
      this.service.getInvDebit(this.apinvHeader_id)
                .subscribe(result => {
                  if (result)
                    {
                      let data = result["data"];
                      this.debitsamp =data.filter(x => x.amount > 0)
                      console.log("this.debitsamp", this.debitsamp)
                      for(let j=0;j<this.debitsamp.length;j++)
                      {
                        this.service1.gldesget(this.debitsamp[j].debitglno).subscribe((glresult=>{
                          let gldescription=glresult["data"][0]?.gl_description
                            let debit={
                              type:"Debit",
                              glno:this.debitsamp[j].debitglno,
                              gldes:gldescription,
                              amount: this.debitsamp[j].amount
                            }
                            this.debtcrtsamp.push(debit)
                          }))
                      }
                      console.log("this.debtcrtsamp",this.debtcrtsamp)
                      this.spinner.hide();  
                    }       
                  },error=>{
                    console.log("Debit Detail data not found")
                    this.spinner.hide();  
                  }            
                ) 
        this.service.getInvCredit(this.apinvHeader_id)
                .subscribe(result => {              
                  if (result)
                    {
                      this.invCreditList =result.data;
                      console.log("Invoice Credit Detail ",this.invCreditList);  
                      this.creditsamp = this.invCreditList.filter(x => (x.paymode.gl_flag != "Payable" && x.amount!=0));
                      console.log("Invoice Credit Detail ",this.creditsamp);  
                      for(let i=0;i<this.creditsamp.length;i++)
                      {
                        this.service1.gldesget(this.creditsamp[i].creditglno).subscribe((glresult=>{
                          let gldescription=glresult["data"][0]?.gl_description
                            let credit={
                              type:"Credit",
                              glno:this.creditsamp[i].creditglno,
                              gldes:gldescription,
                              amount: this.creditsamp[i].amount
                            }
                            this.debtcrtsamp.push(credit)
                          }))
                      }
                      this.spinner.hide();  
                    }       
                  },error=>{
                    console.log("Inv Credit Detail data not found")
                    this.spinner.hide();  
                  }            
                )
  }
}


