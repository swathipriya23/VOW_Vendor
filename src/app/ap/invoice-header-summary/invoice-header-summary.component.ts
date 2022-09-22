import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild, Output, EventEmitter ,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl} from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { NotificationService } from '../../service/notification.service';
import { ApService } from '../ap.service';
import { ApShareServiceService } from '../ap-share-service.service'


const isSkipLocationChange = environment.isSkipLocationChange

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

export interface Status {
  id: string;
  text: string;
}
export interface SupplierName {
  id: number;
  name: string;
}

@Component({
  selector: 'app-invoice-header-summary',
  templateUrl: './invoice-header-summary.component.html',
  styleUrls: ['./invoice-header-summary.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class InvoiceHeaderSummaryComponent implements OnInit {
  InvoiceHeaderForm :FormGroup
  SelectSupplierForm: FormGroup

  @ViewChild('Suppliertype') matsupAutocomplete: MatAutocomplete;
  @ViewChild('suppInput') suppInput: any;
 
  suplist: any 
  supplierNameData: any;
  selectsupplierlist: any;
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
  default = true
  alternate = false

  toto: any
  amt: any
  sum: any
  gstyesno:any
  tomorrow = new Date();
 
  @Output() linesChange = new EventEmitter<any>();
  uploadList = [];
  images: string[] = [];
  files: string[] = [];

  @ViewChild('takeInput', { static: false })
  InputVar: ElementRef;
  
  searchData: any;
  has_next: any;
  has_previous: any;
  currentpage: number = 1;
  presentpage: number = 1;

  identificationSize: number = 10;
  presentIdentification: number = 1;
  
  status: Array<Status>

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('statusInput') statusInput: any;
  @ViewChild('statusAutoComplete') statusAutocomplete: MatAutocomplete;

  apheader_id=this.share.apheader_id.value;
  apAmount=this.share.apAmount.value;
 
  frmInvHdrSummary: FormGroup;
  isLoading: boolean;
  isSummaryPagination: boolean;

  invHdrSummary: any;
  invHdrStatus: string;
  invoiceheaderres:any
  delinvid: any

  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
 
  constructor(private toastr: ToastrService,private notification: NotificationService, private share: ApShareServiceService, private router: Router,  
    private service: ApService, private fb: FormBuilder,public datepipe: DatePipe, private spinner:NgxSpinnerService, ) { }

  ngOnInit(): void {
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

    this.getInvHdrs()
  }

  getInvHdrs() {
    this.spinner.show();
    this.service.getHdrSummary(this.apheader_id)
      .subscribe(result => {
        this.invoiceheaderres = result['apinvoiceheader'];
        this.invHdrStatus=result.apstatus?.text
        console.log("Invoice Header Summary",this.invoiceheaderres)
        this.spinner.hide();
        
        this.getinvoicehdrrecords(this.invoiceheaderres)
      },error=>{
        console.log("No data found")
        this.spinner.hide();        
      }            
      )
  }

  getsuppindex(ind) {
    this.supplierindex = ind 
  }
  get Suppliertype() {
    return this.SelectSupplierForm.get('name');
  }

  getsuppView(data) {
   
    this.service.getsupplierView(data.id)
      .subscribe(result => {
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
  private getinward_status(keyvalue) {
    this.service.getInwardStatus(keyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.status = datas;

      })
  }

  public displayFnStatus(Status?: Status): string | undefined {
    return Status ? Status.text : undefined;
  }
  inv_status() {
    let keyvalue: String = "";
    this.getinward_status(keyvalue);
    this.frmInvHdrSummary.get('invStatus').valueChanges
      .pipe(
        startWith(""),
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),

        switchMap(value => this.service.getInwardStatus(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.status = datas;

      })

  }


  autocompleteScrollStatus() {
    setTimeout(() => {
      if (
        this.statusAutocomplete &&
        this.autocompleteTrigger &&
        this.statusAutocomplete.panel
      ) {
        fromEvent(this.statusAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.statusAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.statusAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.statusAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.statusAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.service.getInwardStatus(this.statusInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.status = this.status.concat(datas);
                    if (this.status.length >= 0) {
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
        raisorbranchgst: new FormControl(''),
        invoiceamount: new FormControl(0),
        taxamount: new FormControl(0),
        totalamount: new FormControl(0),
        otheramount: new FormControl(0),
        roundoffamt: new FormControl(0),
        invoicegst: new FormControl(''),
        supplier_id: new FormControl(''),
        supplierstate_id: new FormControl(''),
        images:new FormControl(''),
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
      const Taxableamount = +group.controls['invoiceamount'].value;
      const Taxamount = +group.controls['taxamount'].value;
      const RoundingOff = +group.controls['roundoffamt'].value;
      const Otheramount = +group.controls['otheramount'].value;
      let toto = Taxableamount + Taxamount + RoundingOff
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
    }
  
    fileChange(event) {
      let imagesList = [];
      for (var i = 0; i < event.target.files.length; i++) {
        this.images.push(event.target.files[i]);
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

    InvHeaderFormArray(): FormArray {
      return this.InvoiceHeaderForm.get('invoiceheader') as FormArray;
    }

    calchdrTotal(invoiceamount, taxamount, roundoffamt, otheramount, totalamount: FormControl) {

      let ivAnount = Number(invoiceamount.value)
      let ivAtax = Number(taxamount.value)
      const Taxableamount = ivAnount
      const Taxamount = ivAtax
      const RoundingOff = roundoffamt.value
      const Otheramount = otheramount.value
  
      let toto = Taxableamount + Taxamount + RoundingOff
      this.toto = toto - Otheramount
      totalamount.setValue((this.toto), { emitEvent: false });
  
      this.datasums();
    }

    getinvoicehdrrecords(datas) {
      for (let invhdr of datas) {
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
        let apheader_id: FormControl = new FormControl('');
        let dedupinvoiceno: FormControl = new FormControl('');
        let supplier_id: FormControl = new FormControl('');
        let suppliergst: FormControl = new FormControl('');
        let supplierstate_id: FormControl = new FormControl('');
        let raisorbranchgst: FormControl = new FormControl('');
        let invoicegst: FormControl = new FormControl('');
        let images:FormControl = new FormControl('');
        // const InvHeaderFormArray = this.InvoiceHeaderForm.get("invoiceheader") as FormArray;
  
        this.gstyesno = invhdr.invoicegst 
        this.InvoiceHeaderForm.patchValue(
          {
            invoicegst : invhdr.invoicegst })
        
        id.setValue(invhdr.id)
       
        suppname.setValue(invhdr.supplier.name)
        //supplierstate_id.setValue(invhdr.supplierstate_id.id)
        //suppstate.setValue(invhdr.supplierstate_id.name)
        supplier_id.setValue(invhdr.supplier)
        suppliergst.setValue(invhdr.supplier.gstno)

        invoiceno.setValue(invhdr.invoiceno)
        invoicedate.setValue(this.datepipe.transform(invhdr.invoicedate, 'dd-MMM-yyyy'))
        invoiceamount.setValue(invhdr.invoiceamount)
        taxamount.setValue(invhdr.taxamount)
        totalamount.setValue(invhdr.totalamount)
        otheramount.setValue(invhdr.otheramount)
        roundoffamt.setValue(invhdr.roundoffamt)
        invtotalamt.setValue("")
        dedupinvoiceno.setValue(invhdr.dedupinvoiceno)
        apheader_id.setValue(invhdr.apheader_id)
        raisorbranchgst.setValue(invhdr.raisorbranchgst)
        invoicegst.setValue(this.gstyesno)
       // images.setValue(invhdr.file_data[0].file_name)
        // this.type=invhdr.gsttype
  
        this.InvHeaderFormArray().push(new FormGroup({
          id: id,
          suppname: suppname,
          suppstate:suppstate,
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
          images:images
        }))
  
  
        this.calchdrTotal(invoiceamount, taxamount, roundoffamt, otheramount, totalamount)
  
        invoiceamount.valueChanges.pipe(
          debounceTime(20)
        ).subscribe(value => {
          this.calchdrTotal(invoiceamount, taxamount, roundoffamt, otheramount, totalamount)
          if (!this.InvoiceHeaderForm.valid) {
            return;
          }
  
          this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
        }
        )
  
        taxamount.valueChanges.pipe(
          debounceTime(20)
        ).subscribe(value => {
          this.calchdrTotal(invoiceamount, taxamount, roundoffamt, otheramount, totalamount)
          if (!this.InvoiceHeaderForm.valid) {
            return;
          }
          this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
        }
        )
  
        roundoffamt.valueChanges.pipe(
          debounceTime(20)
        ).subscribe(value => {
          this.calchdrTotal(invoiceamount, taxamount, roundoffamt, otheramount, totalamount)
          if (!this.InvoiceHeaderForm.valid) {
            return;
          }
  
          this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
        }
        )
  
        otheramount.valueChanges.pipe(
          debounceTime(20)
        ).subscribe(value => {
          this.calchdrTotal(invoiceamount, taxamount, roundoffamt, otheramount, totalamount)
          if (!this.InvoiceHeaderForm.valid) {
            return;
          }
  
          this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
        }
        )
  
      }
  
    }

    Addinvoice(section, index) {   
      if (this.invoiceheaderres != undefined)
        {
        if (this.invoiceheaderres[index].supplier != section.value.supplier_id) {
          this.notification.showInfo("Please save the changes you have done")
          return false
        }
  
        else if (this.invoiceheaderres[index].suppliergst != section.value.suppliergst) {
          this.notification.showInfo("Please save the changes you have done")
          return false
        }
  
  
        else if (this.invoiceheaderres[index].invoiceno != section.value.invoiceno) {
          this.notification.showInfo("Please save the changes you have done")
          return false
        }
  
        else if (this.invoiceheaderres[index].invoicedate != (this.datepipe.transform(section.value.invoicedate, 'yyyy-MM-dd'))) {
          this.notification.showInfo("Please save the changes you have done")
          return false
        }
  
        else if (this.invoiceheaderres[index].invoiceamount != section.value.invoiceamount) {
          this.notification.showInfo("Please save the changes you have done")
          return false
        }
        else if (this.invoiceheaderres[index].taxamount != section.value.taxamount) {
          this.notification.showInfo("Please save the changes you have done")
          return false
        }
  
        else if (this.invoiceheaderres[index].roundoffamt != section.value.roundoffamt) {
          this.notification.showInfo("Please save the changes you have done")
          return false
        }
        else if (this.invoiceheaderres[index].otheramount != section.value.otheramount) {
          this.notification.showInfo("Please save the changes you have done")
          return false
        }
        else if (this.invoiceheaderres[index].totalamount != section.value.totalamount) {
          this.notification.showInfo("Please save the changes you have done")
          return false
        }
  
        this.share.apinvHeader_id.next(section.value.id);
      
        this.router.navigate(['/ap/invDetailView'], { skipLocationChange: true });
      }
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
         this.service.delInvHdr(this.delinvid)
        .subscribe(result => {
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

    submitinvoiceheader() {
    
      const invoiceheaderdata = this.InvoiceHeaderForm.value.invoiceheader
    
      for (let i in invoiceheaderdata) {
        invoiceheaderdata[i].invoicegst = this.gstyesno
       
        if (invoiceheaderdata[i].supplier_id == '' || invoiceheaderdata[i].supplier_id == null || invoiceheaderdata[i].supplier_id == undefined ) {
          this.toastr.error('Please Choose Supplier Name');
          return false;
        }
  
        if (invoiceheaderdata[i].invoiceno == '' || invoiceheaderdata[i].invoiceno == null || invoiceheaderdata[i].invoiceno == undefined){
          this.toastr.error('Please Enter Invoice Number');
          return false;
        }
  
        if ((invoiceheaderdata[i].invoicedate == '') || (invoiceheaderdata[i].invoicedate == null) || (invoiceheaderdata[i].invoicedate == undefined)) {
          this.toastr.error('Please Choose Invoice Date');
          return false;
        }
  
        if ((invoiceheaderdata[i].invoiceamount == '') || (invoiceheaderdata[i].invoiceamount == null) || (invoiceheaderdata[i].invoiceamount == undefined)) {
          this.toastr.error('Please Enter Taxable Amount');
          return false;
        }
  
        if (invoiceheaderdata[i].taxamount == 0 && this.InvoiceHeaderForm.value.invoicegst === 'Y' ) {
          this.toastr.error('Please Enter Tax Amount');
          return false;
        }

        if ((invoiceheaderdata[i].images == '') || (invoiceheaderdata[i].images == null) || (invoiceheaderdata[i].images == undefined)) 
        {
          this.toastr.error('Please Choose File');
          return false;
        }
        
        invoiceheaderdata[i].invoicedate = this.datepipe.transform(invoiceheaderdata[i].invoicedate, 'yyyy-MM-dd');
        invoiceheaderdata[i].dedupinvoiceno = invoiceheaderdata[i].invoiceno
        delete invoiceheaderdata[i].suppname
        delete invoiceheaderdata[i].id        
      }  
      if (this.apAmount < this.sum || this.apAmount > this.sum) {
        this.toastr.error('Check Header Amount', 'Please Enter Valid Amount');
        return false;
      }
  
      let detaildata = {
        "invoiceheader": invoiceheaderdata 
      }
      console.log("Invoice Header Input ....",detaildata)
      console.log("INPUT",JSON.stringify(detaildata))
      this.service.invHdrAdd(detaildata,this.apheader_id,this.images)
          .subscribe(result => {
            if (result.code != undefined) {
              this.notification.showError(result.description)
  
            } else {
              this.notification.showSuccess("Successfully Invoice Header Saved!...")
              let res1 =  result["data"]
              let res2 =[]
              let j=0
              for (let i=0;i<res1.length;i++)
              {
                if (res1[i].data === undefined)
                {
                  res2.push(res1[i])
                  this.InvoiceHeaderForm.get('invoiceheader')['controls'][j].get('id').setValue(res1[i].id)
                  j=j++
                }
              }
              this.invoiceheaderres = res2
              console.log("invoiceheaderres", this.invoiceheaderres)
  
            }
          })
    }

  
  
  apHeader()
  {
    this.router.navigate(['/ap/apHeader'], { skipLocationChange: true });
  }
  invDetView(id:any){
    // setTimeout(()=>{
      
    //   this.spinner.show();
      
    // });
    this.share.apinvHeader_id.next(id);
    
    this.router.navigate(['/ap/invDetailView'], { skipLocationChange: true });
  }

}
