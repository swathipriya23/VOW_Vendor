import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
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
export interface commoditylistss {
  id: string;
  name: string;
}
export interface branchListss {
  id: any;
  name: string;
  code: string;
  codename: string;
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
export interface SupplierName {
  id: number;
  name: string;
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
  selector: 'app-salesinvoice',
  templateUrl: './salesinvoice.component.html',
  styleUrls: ['./salesinvoice.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class SalesinvoiceComponent implements OnInit {
  disabledate = true
  tomorrow = new Date();
  salesheaderForm:FormGroup;
  commodityList: Array<commoditylistss>
  clientlist: Array<clientlists>
  rmlist: Array<rmlists>
  Branchlist: Array<branchListss>
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('commoditytype') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('commodityInput') commodityInput: any;
  @ViewChild('clientrole') matclientAutocomplete: MatAutocomplete;
  @ViewChild('clientInput') clientInput: any;
  @ViewChild('rmrole') matrmAutocomplete: MatAutocomplete;
  @ViewChild('rmInput') rmInput: any;
  @ViewChild('branchtype') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('Suppliertype') matsupAutocomplete: MatAutocomplete;
  @ViewChild('suppInput') suppInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  showbranch = false
  showbranchdata = false
  branchrole: any
  branchroleid: any
  branchrolesidd: any
  roledata: any
  salesheaderid : any
  raisedbyid:any
  ecfstatusid:any
  raisergst:any 
  raiserbranchid:any  
  createdbyid:any
  InvoiceHeaderForm:FormGroup
  SelectSupplierForm:FormGroup
  InvoiceDetailForm:FormGroup
  ecftypeid:any
  ecfstatusname:any
  commodityid:any
  ecftotalamount:any
  branchrolename:any
  type:any
  getgstapplicable:any
  SubmitoverallForm:FormGroup
  toto:any
  amt:any
  sum:any
  gstyesno:any
  showtaxforgst = false
  showsupppopup = true
  showsupplierpan = false
  showsuppliercode = false
  supplierindex:any
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
  supplierid:any;
  stateid:any;
  SupplierName:any
  Invoicedata:any
  invoiceheaderres:any
  formData: FormData = new FormData();
  @ViewChild('fileInput', { static: false }) InputVars: ElementRef;
  @ViewChildren('fileInput') fileInput: QueryList<ElementRef>;
  showinvoiceheader : boolean = false
  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  @ViewChild('closebuttons') closebuttons;
  @ViewChild('closedbuttons') closedbuttons;
  branchgstnumber:any
  showinvoicedetail:boolean = false
  hsnList: Array<hsnlistss>
  uomList: Array<uomlistss>
  @ViewChild('hsntype') mathsnAutocomplete: MatAutocomplete;
  @ViewChild('hsnInput') hsnInput: any;
  @ViewChild('uomtype') matuomAutocomplete: MatAutocomplete;
  @ViewChild('uomInput') uomInput: any;
  totalamount:any;
  changeindex: any
  hsncodess:any
  igstrate:any
  sgstrate:any
  cgstrate:any
  totaltax:any
  totaltaxable:any
  overalltotal:any
  indexDet:any
  invoiceheaderaddonid:any
  invheadertotamount:any
  suppid:any
  taxableamount:any
  invoiceno:any
  getinvoiceheaderresults:any
  INVsum:any
  statename:any
  hsnpercent: any
  hsncode: any
  Roundoffamount: any
  OtherAdjustmentamt: any
  INVamt:any
  Roundoffsamount:any
  OtherAdjustmentamts:any
  Approverlist: Array<approverListss>;
  @ViewChild('approvertype') matappAutocomplete: MatAutocomplete;
  @ViewChild('approverInput') approverInput: any;
  showapprove : boolean = false
  showinvhdredit : boolean = false
  showinvdtledit : boolean = false
  disablehdr : boolean = false
  disablehdrsave : boolean = false
  disabledtlsave : boolean = false
  disabledtl : boolean = false
  disableinvdtlsave : boolean = false
  disableinvdtl : boolean = false
  showlink : boolean = false
  showlink1 : boolean = false
  showlink2 : boolean = false

  @Output() linesChange = new EventEmitter<any>();
  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer, private datePipe: DatePipe,
    private ecfservice: EcfService, private shareservice: ShareService, private notification: NotificationService,
    private router: Router, private toastr: ToastrService, private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingService) { }

  ngOnInit(): void {
    let data = this.shareservice.salesheaderedit.value
    this.salesheaderid = data
    const getToken = localStorage.getItem("sessionData")
    let tokendata = JSON.parse(getToken)
    this.raisedbyid = tokendata.employee_id
    this.salesheaderForm = this.fb.group({
      supplier_type: ['SINGLE'],
      commodity_id: [''],
      ecftype: ['SLI'],
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
      is_raisedby_self: [''],
      raised_by: [''],
    })

    this.SelectSupplierForm = this.fb.group({
      gstno: [''],
      code: [''],
      panno: [''],
      name: ['']
    })

    this.InvoiceHeaderForm = this.fb.group({
      invoicegst: [''],
      invoiceheader: new FormArray([
        // this.INVheader(),
      ]),
    })

    this.SubmitoverallForm = this.fb.group({
      id: [''],
      approver_branch: [''],
      approvedby_id: [''],
      ecftype: [''],
      tds: [''],
    })
    this.InvoiceDetailForm = this.fb.group({
      roundoffamt: [0],
      otheramount: [0],
      invoicedtl: new FormArray([
        // this.INVdetail(),
      ])
    })

    this.getbranchrole()
    this.getinvoiceheader()
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

getapprovedropdowns() {
  // let approverkeyvalue: String = "";
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

public displayFnapprover(approvertype?: approverListss): string | undefined {
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

approverScroll() {
  
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

public displayFnbranch(branchtype?: branchListss): string | undefined {
  return branchtype ? branchtype.name : undefined;
 }
 get branchtype() {
   return this.SubmitoverallForm.get('approver_branch');
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








  getinvoiceheader() {
    this.SpinnerService.show()
    if (this.salesheaderid != "" && this.salesheaderid != undefined && this.salesheaderid != null) {
      this.ecfservice.getinvoicedetailsummary(this.salesheaderid)
        .subscribe(result => {
          this.showlink = true
          if(result.id != undefined){
            let invheader = result['Invheader']
                if (invheader.length > 0) {
                  for (let i in invheader) {
                    this.invoiceheaderaddonid = invheader[i]?.id
                    this.invheadertotamount = Number(invheader[i]?.totalamount)
                    this.suppid = invheader[i]?.supplier_id
                    let invamount = Number(invheader[i]?.invoiceamount)
                    let roundamount = Number(invheader[i]?.roundoffamt)
                    let otheramount = Number(invheader[i]?.otheramount)
                    this.taxableamount = invamount
                    this.totalamount = invheader[i]?.totalamount
                    this.invoiceno = invheader[i]?.invoiceno
                    this.getgstapplicable = invheader[i]?.invoicegst
                    this.InvoiceDetailForm.patchValue({
                      roundoffamt: invheader[i]?.roundoffamt,
                      otheramount: invheader[i]?.otheramount
                    })

                  }
                  this.Addinvoice( this.invoiceheaderaddonid)
                }
                let datas = result
                this.ecftypeid = result?.ecftype_id
                this.ecfstatusid = result?.ecfstatus_id
                this.ecfstatusname = result?.ecfstatus
                this.commodityid = result?.commodity_id?.id
                this.ecftotalamount = result?.ecfamount
                this.raisergst = result?.branch?.gstin
                this.raiserbranchid = result?.branch?.id
                this.createdbyid = result?.raisedby
                for (let a of datas?.Invheader) {
                this.type = a?.gsttype
                this.getgstapplicable = a?.invoicegst
                if (a?.invoicegst == 'Y') {
                  this.showtaxforgst = true
                } else {
                  this.showtaxforgst = false
                }
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
    
    
                this.salesheaderForm.patchValue({
                supplier_type: datas?.supplier_type,
                commodity_id: datas?.commodity_id,
                ecftype: datas?.ecftype,
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
     
 
}
InvHeaderFormArray(): FormArray {
  return this.InvoiceHeaderForm.get('invoiceheader') as FormArray;
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
    
      suppname.setValue(invhdr?.supplier_id?.name)
      supplierstate_id.setValue(invhdr?.supplierstate_id?.id)
      suppstate.setValue(invhdr?.supplierstate_id?.name)
      supplier_id.setValue(invhdr?.supplier_id?.id)
      suppliergst.setValue(invhdr?.supplier_id?.gstno)
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
            this.salesheaderForm.patchValue({
              branch: this.branchrole
            })
            this.salesheaderForm.controls['branch'].disable();
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
            this.salesheaderForm.patchValue({
              branch: datas
            })
          }
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
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
    if (this.InvoiceHeaderForm?.value?.invoicegst == "" || this.InvoiceHeaderForm?.value?.invoicegst == null || this.InvoiceHeaderForm?.value?.invoicegst == undefined ) {
      this.toastr.warning('', 'Please Choose GST Applicable Or Not', { timeOut: 1500 });
      this.showsupppopup = false
      return false
    }
    if (invoiceheaders[ind]?.suppname == null) {
      this.dataclear()
    }
  }
 
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
 
  


  hsnindex: any
  getindex(index) {
   this.hsnindex = index
  }

  getinvoicedtlrecords(datas) {
    if (datas?.invoicedtl?.length === 0) {
      const control = <FormArray>this.InvoiceDetailForm.get('invoicedtl');
      control.push(this.INVdetail());

      if ((this.ecftypeid == 6 && this.InvoiceHeaderForm?.value?.invoicegst == 'N')) {
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


  getuomdropdown() {
    this.getuom('')
  }
  gethsndropdown() {
    this.gethsn('')
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

 


  getgst(data, index) {
    this.changeindex = index
    if (this.getgstapplicable === "Y") {
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
 
  INVdatasums() {
    this.INVamt = this.InvoiceDetailForm.value['invoicedtl'].map(x => Number((x.totalamount)));
    this.Roundoffsamount = this.InvoiceDetailForm?.value?.roundoffamt
    this.OtherAdjustmentamts = this.InvoiceDetailForm?.value?.otheramount
    let INVsum = (this.INVamt.reduce((a, b) => a + b, 0));
    this.INVsum = (INVsum + Number(this.Roundoffsamount) + Number(this.OtherAdjustmentamts)).toFixed(2)
   }


  getcommoditydd() {
    let commoditykeyvalue: String = "";
    this.getcommodity(commoditykeyvalue);
    this.salesheaderForm.get('commodity_id').valueChanges
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
    this.salesheaderForm.get('rmcode').valueChanges
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
    this.salesheaderForm.get('client_code').valueChanges
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
  public displayFncommodity(commoditytype?: commoditylistss): string | undefined {
    return commoditytype ? commoditytype.name : undefined;
  }

get commoditytype() {
  return this.salesheaderForm.get('commodity_id');
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
    return this.salesheaderForm.get('client_code');
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
  get rmrole() {
    return this.salesheaderForm.get('rmcode');
  }
  getrm(rmkeyvalue) {
    this.ecfservice.getrmcode(rmkeyvalue)
      .subscribe(results => {
        if (results) {
          let datas = results["data"];
          this.rmlist = datas;
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
  getheaderbranch() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.salesheaderForm.get('branch').valueChanges
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


  public displayFnbranchrole(branchtyperole?: branchListss): string | undefined {
    return branchtyperole ? +branchtyperole.code + "-" + branchtyperole.name : undefined;
  }
 get branchtyperole() {
    return this.salesheaderForm.get('branch');
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
  numberOnlyandDot(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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

  SubmitForm(){
    const saleshdrdata = this.salesheaderForm.value
    if (this.salesheaderForm?.value?.supplier_type === "") {
      this.toastr.error('Please Select Supplier Type');
      this.SpinnerService.hide();
      return false;
    }
    if (this.salesheaderForm?.value?.commodity_id == undefined || this.salesheaderForm?.value?.commodity_id <= 0) {
      this.toastr.error('Please Select Commodity Name');
      this.SpinnerService.hide();
      return false;
    }
    if (this.salesheaderForm?.value?.client_code == undefined || this.salesheaderForm?.value?.client_code <= 0) {
      this.toastr.error('Please Select Client Name');
      this.SpinnerService.hide();
      return false;
    }
    if (this.salesheaderForm?.value?.rmcode == undefined || this.salesheaderForm?.value?.rmcode <= 0) {
      this.toastr.error('Please Select RM Name');
      this.SpinnerService.hide();
      return false;
    }
    if (this.salesheaderForm?.value?.ecfamount === "" || this.salesheaderForm?.value?.ecfamount === null || this.salesheaderForm?.value?.ecfamount === undefined) {
      this.toastr.error('Please Enter ECF Amount');
      this.SpinnerService.hide();
      return false;
    }
    saleshdrdata.ecftype = 6
    saleshdrdata.supplier_type = 1
    saleshdrdata.payto = 'C'
    saleshdrdata.is_raisedby_self = true
    saleshdrdata.ecfdate = this.datePipe.transform(saleshdrdata?.ecfdate, 'yyyy-MM-dd');
    if(typeof(saleshdrdata.commodity_id) == 'object'){
      saleshdrdata.commodity_id = saleshdrdata?.commodity_id?.id
    }else if(typeof(saleshdrdata.commodity_id) == 'number'){
      saleshdrdata.commodity_id =  saleshdrdata.commodity_id 
    }else{
      this.notification.showError ("Please Choose any one Commodity Name from the dropdown");
      this.SpinnerService.hide();
      return false;
    }
    if(typeof(saleshdrdata.client_code) == 'object'){
      saleshdrdata.client_code = saleshdrdata?.client_code?.id
      }else if(typeof(saleshdrdata.client_code) == 'number'){
        saleshdrdata.client_code = saleshdrdata?.client_code
      }else{
        this.notification.showError ("Please Choose any one Client Name from the dropdown");
        this.SpinnerService.hide();
        return false;
      }
      
      if(typeof( saleshdrdata.rmcode) == 'object'){
        saleshdrdata.rmcode = saleshdrdata?.rmcode?.id
      }else if( typeof(saleshdrdata.rmcode) == 'number'){
        saleshdrdata.rmcode =  saleshdrdata.rmcode
      }else {
        this.notification.showError ("Please Choose any one RM Name from the dropdown");
        this.SpinnerService.hide();
        return false;
      }
      
      if (this.roledata == true) {
        saleshdrdata.branch = saleshdrdata?.branch?.id
      } else {
        saleshdrdata.branch = this.branchroleid
      }
      if (saleshdrdata?.branch == "" || saleshdrdata?.branch == undefined || saleshdrdata?.branch == null) {
        saleshdrdata.branch = this.branchroleid
      }
      this.SpinnerService.show();
    if (this.ecfstatusid === 2) {
      this.ecfservice.ecfmodification(saleshdrdata, this.salesheaderid)
        .subscribe(result => {
          if (result.id == undefined) {
            this.notification.showError(result?.description)
            this.SpinnerService.hide()
            return false
          }
          else {
            this.notification.showSuccess("Successfully Sales Header Saved")
            this.SpinnerService.hide();
            this.salesheaderid = result?.id
            this.ecftypeid = result?.ecftype
            this.raisergst = result?.raiserbranchgst
            this.raiserbranchid = result?.branch
            this.createdbyid = result?.raisedby
            this.ecftotalamount = result?.ecfamount
            this.showinvoiceheader = true
            this.disablehdr = true
            this.disablehdrsave = true
          }
        },error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
      }else if(this.salesheaderid != ""){
        this.ecfservice.editecfheader(saleshdrdata, this.salesheaderid)
          .subscribe(result => {
           if (result.id == undefined) {
              this.notification.showError(result?.description)
              this.SpinnerService.hide()
              return false
            }
            else {
              this.notification.showSuccess("Successfully Sales Header Saved")
              this.SpinnerService.hide();
              this.salesheaderid = result?.id
              this.ecftypeid = result?.ecftype
              this.raisergst = result?.raiserbranchgst
              this.raiserbranchid = result?.branch
              this.createdbyid = result?.raisedby
              this.ecftotalamount = result?.ecfamount
              this.showinvoiceheader = true
              this.disablehdr = true
              this.disablehdrsave = true
      }
    },error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }else{
    this.ecfservice.createecfheader(saleshdrdata)
          .subscribe(result => {
           if (result?.id == undefined) {
              this.notification.showError(result?.description)
              this.SpinnerService.hide()
              return false
            }
            else {
              this.notification.showSuccess("Successfully Sales Header Saved")
              this.SpinnerService.hide()
              this.salesheaderid = result?.id
              this.ecftypeid = result?.ecftype
              this.raisergst = result?.raiserbranchgst
              this.raiserbranchid = result?.branch
              this.createdbyid = result?.raisedby
              this.ecftotalamount = result?.ecfamount
              this.showinvoiceheader = true
              this.disablehdr = true
              this.disablehdrsave = true
  }
  },error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
    }
  }
  salesreset(){
   
      this.salesheaderForm.controls['ecftype'].reset(""),
      this.salesheaderForm.controls['supplier_type'].reset(""),
      this.salesheaderForm.controls['commodity_id'].reset(""),
      this.salesheaderForm.controls['ecfamount'].reset(""),
      this.salesheaderForm.controls['ppx'].reset(""),
      this.salesheaderForm.controls['notename'].reset(""),
      this.salesheaderForm.controls['remark'].reset(""),
      this.salesheaderForm.controls['payto'].reset(""),
      this.salesheaderForm.controls['client_code'].reset("")
      this.salesheaderForm.controls['rmcode'].reset("")
      this.salesheaderForm.controls['advancetype'].reset("")
      this.salesheaderForm.controls['is_raisedby_self'].reset("")
      this.salesheaderForm.controls['raised_by'].reset("") 
  
  }

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
     if (invoiceheaderdata[i]?.suppname == ''  || invoiceheaderdata[i]?.suppname == null || invoiceheaderdata[i]?.suppname == undefined ) {
        this.toastr.error('Please Choose Supplier Name');
        this.SpinnerService.hide()
        return false;
      }
     if (invoiceheaderdata[i]?.invoiceno == ''  || invoiceheaderdata[i]?.invoiceno == null  || invoiceheaderdata[i]?.invoiceno == undefined ) {
        this.toastr.error('Please Enter Invoice Number');
        this.SpinnerService.hide()
        return false;
      }
     if (invoiceheaderdata[i]?.invoicedate == ''  || invoiceheaderdata[i]?.invoicedate == null  || invoiceheaderdata[i]?.invoicedate == undefined) {
        this.toastr.error('Please Choose Invoice Date');
        this.SpinnerService.hide()
        return false;
      }
    if (invoiceheaderdata[i]?.invoiceamount == '' || invoiceheaderdata[i]?.invoiceamount == null || invoiceheaderdata[i]?.invoiceamount == undefined) {
        this.toastr.error('Please Enter Taxable Amount');
        this.SpinnerService.hide()
        return false;
      }
    if (invoiceheaderdata[i]?.taxamount == 0 && this.InvoiceHeaderForm?.value?.invoicegst === 'Y') {
        this.toastr.error('Please Enter Tax Amount');
        this.SpinnerService.hide()
        return false;
      }
  
        if (invoiceheaderdata[i]?.filedataas.length <= 0) {
          this.toastr.error('Please Upload File');
          this.SpinnerService.hide()
          return false;

        }
        if (invoiceheaderdata[i].id === "") {
          delete invoiceheaderdata[i]?.id
        }
        if (this.salesheaderid != undefined) {
          invoiceheaderdata[i].ecfheader_id = this.salesheaderid
        } else {
          invoiceheaderdata[i].ecfheader_id = this.salesheaderid
        }
        invoiceheaderdata[i].invoicedate = this.datePipe.transform(invoiceheaderdata[i]?.invoicedate, 'yyyy-MM-dd');
        invoiceheaderdata[i].invoicegst = this.InvoiceHeaderForm?.value?.invoicegst
        invoiceheaderdata[i].invtotalamt = this.sum
        invoiceheaderdata[i].raisorbranchgst = this.raisergst
        if (invoiceheaderdata[i]?.suppname == null) {
          invoiceheaderdata[i].suppname = ""
        }
       
        delete invoiceheaderdata[i]?.suppstate
        // delete invoiceheaderdata[i]?.filekey
       }
      if (this.salesheaderForm?.value?.ecfamount < this.sum || this.salesheaderForm?.value?.ecfamount > this.sum) {
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
              let data = this.InvoiceHeaderForm?.value?.invoiceheader
              for (let i in data) {
                data[i].id = result?.invoiceheader[i]?.id
              }
              let results = result?.invoiceheader
              for(let i in results){
                this.invoiceheaderaddonid = results[i]?.id
                this.invheadertotamount = Number(results[i]?.totalamount)
                this.suppid = results[i]?.supplier_id
                let invamount = Number(results[i]?.invoiceamount)
                let roundamount = Number(results[i]?.roundoffamt)
                let otheramount = Number(results[i]?.otheramount)
                this.taxableamount = invamount
                this.totalamount = results[i]?.totalamount
                this.invoiceno = results[i]?.invoiceno
                this.getgstapplicable = results[i]?.invoicegst
                }
                this.Addinvoice( this.invoiceheaderaddonid)
                this.invoiceheaderres = result?.invoiceheader
            
             this.showinvoicedetail = true
             this.disabledtl = true
             this.disabledtlsave = true

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
             
              let data = this.InvoiceHeaderForm?.value?.invoiceheader
              for (let i in data) {
                data[i].id = result?.invoiceheader[i]?.id
              }
              let results = result?.invoiceheader
              for(let i in results){
                this.invoiceheaderaddonid = results[i]?.id
                this.invheadertotamount = Number(results[i]?.totalamount)
                this.suppid = results[i]?.supplier_id
                let invamount = Number(results[i]?.invoiceamount)
                let roundamount = Number(results[i]?.roundoffamt)
                let otheramount = Number(results[i]?.otheramount)
                this.taxableamount = invamount
                this.totalamount = results[i]?.totalamount
                this.invoiceno = results[i]?.invoiceno
                this.getgstapplicable = results[i]?.invoicegst
                }
                this.Addinvoice( this.invoiceheaderaddonid)
              this.invoiceheaderres = result?.invoiceheader
              
              this.showinvoicedetail = true
              this.disabledtl = true
              this.disabledtlsave = true
            }
          },error => {
              this.errorHandler.handleError(error);
              this.SpinnerService.hide();
            }
          )
      }
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

    Addinvoice(id){
      this.SpinnerService.show()
     
    //   let invdtldatas = this.InvoiceDetailForm.get('invoicedtl') as FormArray
    //   invdtldatas.clear()
     
    //     for(let i in result){
    //     this.invoiceheaderaddonid = result[i]?.id
    //     this.invheadertotamount = Number(result[i]?.totalamount)
    //     this.suppid = result[i]?.supplier_id
    //     let invamount = Number(result[i]?.invoiceamount)
    //     let roundamount = Number(result[i]?.roundoffamt)
    //     let otheramount = Number(result[i]?.otheramount)
    //     this.taxableamount = invamount
    //     this.totalamount = result[i]?.totalamount
    //     this.invoiceno = result[i]?.invoiceno
    //     this.getgstapplicable = result[i]?.invoicegst
    //     }
      
    //  if (this.invoiceheaderaddonid === "" || this.invoiceheaderaddonid === undefined || this.invoiceheaderaddonid === null) {
    //     this.toastr.warning('', 'Please Create Invoice Header First ', { timeOut: 1500 });
    //     this.SpinnerService.hide()
    //     return false
    //   }
      this.ecfservice.getinvheaderdetails(id)
        .subscribe(results => {
          if (results.id != undefined) {
            this.getinvoiceheaderresults = results
             if (results['invoicedtl']?.length === 0) {
                this.INVsum = ''
                }
            
                this.getinvoicedtlrecords(results)
                               
                  }else{
                    this.notification.showError(results?.description)
                    this.SpinnerService.hide()
                    return false
                  }},
                    error => {
                      this.errorHandler.handleError(error);
                      this.SpinnerService.hide();
                    }
                  )
                
              
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
       if ( this.InvoiceHeaderForm?.value?.invoicegst === 'Y') {
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
      if (invdetaildata[i]?.id === "" || invdetaildata[i]?.id === undefined || invdetaildata[i]?.id === null) {
          delete invdetaildata[i].id
        }
      
        if (this.getgstapplicable === 'Y' ) {
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
        if (this.getgstapplicable === 'N' ) {
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
              this.invoicedetailsdata = result?.invoicedetails
              let data = this.InvoiceDetailForm.value.invoicedtl
              for(let i in data){
                data[i].id = this.invoicedetailsdata[i].id
              }
              this.showapprove = true
              this.disableinvdtl = true
              this.disableinvdtlsave = true
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
              this.invoicedetailsdata = result?.invoicedetails
              let data = this.InvoiceDetailForm.value.invoicedtl
              for(let i in data){
                data[i].id = this.invoicedetailsdata[i].id
              }
              this.showapprove = true
              this.disableinvdtl = true
              this.disableinvdtlsave = true
              return true
            }
          },error => {
              this.errorHandler.handleError(error);
              this.SpinnerService.hide();
            }
          )
      }
    }
    invoicedetailsdata:any
   
  
    deleteinvdetail(section,ind){
      let id = section?.value?.id
      if(id != undefined){
        var answer = window.confirm("Are you sure to delete?");
        if (answer) {
          //some code
          this.ecfservice.invdtldelete(id)
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
        }
        else {
          return false;
        }
      }else {
        this.removeinvdtlSection(ind)
        if (this.InvoiceDetailForm?.value?.invoicedtl?.length === 0) {
          this.addinvdtlSection()
        }
    }
  }

    deleteinvheader(data,section,ind){
      let id = section?.value?.id
      if(id != undefined){
        var answer = window.confirm("Are you sure to delete?");
        if (answer) {
          //some code
          this.ecfservice.invhdrdelete(id)
          .subscribe(result => {
            if (result?.status == "success") {
              this.notification.showSuccess("Deleted Successfully")
              this.removeSection(ind)
              if (this.InvoiceDetailForm?.value?.invoiceheader?.length === 0) {
                this.addSection()
              }
            } else {
              this.notification.showError(result?.description)
            }
  
          })
        }
        else {
          return false;
        }
      }else {
        this.removeSection(ind)
        if (this.InvoiceDetailForm?.value?.invoiceheader?.length === 0) {
          this.addSection()
        }
    }
  }

    ecffid: any
    ECFData:any
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
      this.ecffid = this.salesheaderid
      
      this.ECFData = {
        "id": this.ecffid,
        "approvedby_id": data?.approvedby_id?.id,
        "ecftype": this.ecftypeid,
        "tds": 0,
        "approver_branch": data?.approver_branch
      }
      this.ecfservice.SalesOverallSubmit(this.ECFData)
        .subscribe(result => {
          if (result?.status == 'success') {
            this.notification.showSuccess("Successfully Sales Invoice Created!...")
            this.SpinnerService.hide()
            this.onSubmit.emit()
            
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
   

    viewinvhdr(){
      this.disablehdr = true
      this.showinvoiceheader = true
      this.disablehdrsave = true
      this.showlink = false
      this.showlink1 = true
    }

    viewinvdtl(){
      this.disabledtl = true
      this.showinvoicedetail = true
      this.disabledtlsave = true
      this.showlink1 = false
      this.showlink2 = true
    }

    viewappdtl(){
      this.disableinvdtlsave = true
      this.disableinvdtl = true
      this.showapprove = true
      this.showlink2 = false
    }
    salesback(){
      this.onCancel.emit()
    }


}
