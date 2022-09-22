import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, FormGroupDirective, FormControlName } from '@angular/forms';
import { switchMap, finalize, debounceTime, distinctUntilChanged, tap,map,takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { EcfService } from '../ecf.service';
import { ShareService } from '../share.service';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { environment } from 'src/environments/environment';





export interface branchListss {
  name: string;
  codename: string;
  id: number;
}
export interface approverListss {
  name: string;
  id: number;
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
  selector: 'app-mailview',
  templateUrl: './mailview.component.html',
  styleUrls: ['./mailview.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class MailviewComponent implements OnInit {

  @Output() linesChange = new EventEmitter<any>();
  @ViewChild(FormGroupDirective) fromGroupDirective: FormGroupDirective
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  ecfheaderviewForm: FormGroup
  InvoiceHeaderForm: FormGroup
  
  TypeList: any
  SupptypeList: any
  isLoading: boolean;
  tomorrow = new Date()
  invheaderdata: any
  echheaderid: any
  invoiceheaderdetailForm: FormGroup
  SubmitApproverForm: FormGroup
  showheaderview = true
  showdetailview = false

  Branchlist: Array<branchListss>;
  Approverlist: Array<approverListss>;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  showgst = true

  @ViewChild('branchtype') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('approvertype') matappAutocomplete: MatAutocomplete;
  @ViewChild('approverInput') approverInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('closebutton') closebutton;
  
  imageUrl = environment.apiURL
  tokenValues: any
  showimageHeaderAPI: boolean
  showimagepdf: boolean
  pdfurl: any
  jpgUrlsAPI: any
  headertotalamt:any
  raisername:any
  ecftotalamount:any
  createdbyid:any
  ismultilevel:boolean = false
  isfinalapprover:boolean = false
  approvellevel:any

  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  behalfyesorno = [{ 'value': true, 'display': 'Yes', "checked": true }, { 'value': false, 'display': 'No', "checked": false }]
  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer, private datePipe: DatePipe
    , private ecfservice: EcfService, private shareservice: ShareService, private notification: NotificationService,
    private router: Router, private toastr: ToastrService,private SpinnerService: NgxSpinnerService,
    private errorHandler:ErrorHandlingService) { }

  ngOnInit(): void {
   
    const params = new URL(window.location.href).searchParams;
    // console.log("params",params)
    this.echheaderid = params.get('ecf_id');
    // console.log("echheaderid",this.echheaderid)
    
    this.ecfheaderviewForm = this.fb.group({
      supplier_type: [''],
      commodity_id: [''],
      ecftype: [''],
      branch: [''],
      ecfdate: [''],
      ecfamount: [''],
      ppx: [''],
      notename: [''],
      remark: [''],
      payto: [''],
      client_code:[''],
      rmcode:[''],
      is_raisedby_self:[''],
      raised_by:['']

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
        this.INVheader(),
      ]),

    })

    this.invoiceheaderdetailForm = this.fb.group({
      raisorcode: [''],
      raisorname: [''],
      transbranch: [''],
      gst: [''],
      suppcode: [''],
      suppname: [''],
      suppbranch: [''],
      suppgst: [''],
      invoiceno: [''],
      invoicedate: [''],
      taxableamt: [''],
      taxamt:[''],
      invoiceamt: ['']

    })

    this.SubmitApproverForm = this.fb.group({
      id: this.echheaderid,
      branch_id:[''],
      approvedby:[''],
      remark: ['']

    })
    this.getinvoicedetails()
    
     
    }

    getbranchdd(){


      let branchkeyvalue: String="";
      this.branchdropdown(branchkeyvalue);
      this.SubmitApproverForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
            // console.log('inside tap')

        }),

        switchMap(value => this.ecfservice.getbranchscroll(value,1)
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


    getapproverdd(){
      if(this.ismultilevel == false){
      // let approverkeyvalue: String="";
      this.approverdropdown();
      this.SubmitApproverForm.get('approvedby').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
            // console.log('inside tap')

        }),

        switchMap(value => this.ecfservice.getapproverscroll(1,this.commodityid, this.createdbyid)
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
      this.SubmitApproverForm.get('approvedby').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
            // console.log('inside tap')

        }),

        switchMap(value => this.ecfservice.getdelmatforapproverscroll(1,this.commodityid,this.approvellevel,this.createdbyid)
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


    public displayFnbranch(branchtype?: branchListss): string | undefined {

      return branchtype ? branchtype.codename : undefined;
    }

    get branchtype() {
      return this.SubmitApproverForm.get('branch_id');
    }

    private branchdropdown(branchkeyvalue) {
      this.ecfservice.getbranch(branchkeyvalue)
        .subscribe((results: any[]) => {
          if(results){
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
  getSections(forms) {
    return forms.controls.invoiceheader.controls;
  }

    public displayFnapprover(approvertype?: approverListss): string | undefined {


      return approvertype ? approvertype.name : undefined;
    }

    get approvertype() {
      return this.SubmitApproverForm.get('approvedby');
    }

    private approverdropdown() {
      if(this.ismultilevel == false){
      this.ecfservice.getapprover(this.commodityid, this.createdbyid)
        .subscribe((results: any[]) => {
        if(results){
          let datas = results["data"];
          this.Approverlist = datas;
        }

        },error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
  )}else{
    this.ecfservice.getdelmatforapprover(this.commodityid,this.approvellevel,this.createdbyid)
    .subscribe((results: any[]) => {
      if(results){
      let datas = results["data"];
      this.Approverlist = datas;
      }
     

    },
    error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }) 
  }
     }

     approverScroll() {
      if(this.ismultilevel == false){
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
      this.ecfservice.getapproverscroll(this.currentpage + 1,this.commodityid, this.createdbyid)
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
        this.ecfservice.getdelmatforapproverscroll(this.currentpage + 1,this.commodityid,this.approvellevel,this.createdbyid)
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
      approverid:any
      getapproveid(data){
        this.approverid = data?.employee_id?.id
       
      }


 
  ecftypeid: any
  ppxid:any
  commodityid:any
  ecfstatusid:any
  raisergstnum:any
  canApprove : boolean = true
  checkhr:any
  getinvoicedetails() {
    this.SpinnerService.show()
    this.ecfservice.getinvoicedetailsummary(this.echheaderid)
      .subscribe(result => {
        if(result?.id != undefined){
        let datas = result
        this.raisername = datas?.raisername
        this.raisergstnum = datas?.branch?.gstin
        this.ecftypeid = datas?.ecftype_id
        this.ecfstatusid =  datas?.ecfstatus_id
        this.commodityid = datas?.commodity_id?.id
        this.checkhr = datas?.is_onbehalfoff_hr

        let json = {"id":this.commodityid }

        this.ecfservice.findmultilevel(json)
        .subscribe(resultss=>{
          // console.log("res1",resultss)
           let muldatas = resultss
           this.ismultilevel = muldatas?.is_multilevel
          //  console.log("ismultilevel",this.ismultilevel)
           if( muldatas?.is_multilevel == true){
             this.getdualdelmat()
           }
        })
        this.canApprove = datas?.data?.can_approve
        this.ecftotalamount = datas?.ecfamount
        this.createdbyid = datas?.raisedby
        
        if(this.ecftypeid == 4){
        this.ppxid = datas?.ppx_id?.id
        }
        this.invheaderdata = result["Invheader"]
        
       
        this.ecfheaderviewForm.patchValue({
          supplier_type: datas?.supplier_type,
          commodity_id: datas?.commodity_id?.name,
          ecftype: datas?.ecftype,
          branch: datas?.branch?.name,
          // branch:datas.raiserbranch.name,
          ecfdate: this.datePipe.transform(datas?.ecfdate,'dd/MM/yyyy'),
          ecfamount: datas?.ecfamount,
          ppx: datas?.ppx,
          notename: datas?.notename,
          remark: datas?.remark,
          payto: datas?.payto,
          client_code:datas?.client_code?.client_name,
          rmcode:datas?.rmcode?.code+"-"+datas?.rmcode?.name,
          is_raisedby_self:datas?.is_raisedby_self,
          raised_by:datas?.raisedby_dtls?.name

        })
        if( this.invheaderdata?.length > 0){
         
          let totalamount =  this.invheaderdata?.map(x => x.totalamount);
          this.headertotalamt = totalamount?.reduce((a, b) => a + b, 0);

       
      }
    
      this.SpinnerService.hide()
    }else{
      this.notification.showError(result?.description)
      this.SpinnerService.hide()
      return false
    }
      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }

  getdualdelmat(){
    this.ecfservice.dualdelmatget(this.echheaderid)
    .subscribe(resdata=>{
      // console.log("res2",resdata)
      let dualdatas = resdata
      this.isfinalapprover  = dualdatas?.isfinal_approver
      this.approvellevel = dualdatas?.next_approver_level
      // console.log("isfinalapprover",this.isfinalapprover)
      // console.log("approvellevel",this.approvellevel)
    })
  }
  

  
  INVheader() {
    let group = new FormGroup({
      invoiceno: new FormControl(),
      invoicedate: new FormControl(''),
      invoiceamount: new FormControl(0),
      taxamount: new FormControl(0),
      totalamount: new FormControl(0),
      otheramount: new FormControl(0),
      roundoffamt: new FormControl(0.0),
      invtotalamt: new FormControl(0),
      // branch_id: new FormControl(''),
      ecfheader_id: new FormControl(0),
      dedupinvoiceno: new FormControl(0),
      suppliergst: new FormControl(''),
      raisorbranchgst: new FormControl(''),
      invoicegst: new FormControl(''),
    })
    group.get('invoiceamount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      
      if (!this.InvoiceHeaderForm.valid) {
        return;
      }

      this.linesChange.emit(this.InvoiceHeaderForm.value['invoice']);
    }
    )

    group.get('taxamount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      
      if (!this.InvoiceHeaderForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
    }
    )

    group.get('roundoffamt').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      
      if (!this.InvoiceHeaderForm.valid) {
        return;
      }

      this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
    }
    )

    return group


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
    return this.sanitizer.bypassSecurityTrustHtml(this.ecfheaderviewForm.get('html').value);
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
  addSection() {
    const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
    control.push(this.INVheader());

  }
  removeSection(i) {
    const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
    control.removeAt(i);
  }
  Movetodetail(id) {
    //  this.router.navigate(['/invoicedetailview'])
    this.showheaderview = false
    this.showdetailview = true
    this.getinvheaderid(id)
  }
  back() {
    this.onCancel.emit()
  }

  forward(){
    this.SpinnerService.show()
    if (this.SubmitApproverForm?.value?.approvedby === "") {
      this.toastr.error('Please Choose Approver');
      this.SpinnerService.hide()
      return false;
    }
    if (this.SubmitApproverForm?.value?.remark === "") {
      this.toastr.error('Please Enter Purpose');
      this.SpinnerService.hide()
      return false;
    }

    if(typeof(this.approverid) != 'number'){
      this.toastr.error('Please Choose Approver Name from the Dropdown');
      this.SpinnerService.hide()
      return false;
    }


    let data={
      "id":this.echheaderid,
      "approvedby":this.approverid,
      "remarks" : this.SubmitApproverForm?.value?.remark
    }
    this.ecfservice.ecfapproveforward(data)
      .subscribe(result => {
        if (result?.status == 'success') {
          this.notification.showSuccess('Forwarded Successfully')
          this.SpinnerService.hide()
          this.onSubmit.emit();
        } else {
          this.notification.showError(result?.description)
          this.SpinnerService.hide()
          return false;
        }
       
      },

      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )

  }

  SubmitForm() {
    this.SpinnerService.show()
    if (this.SubmitApproverForm?.value?.remark === "") {
      this.toastr.error('Please Enter Purpose');
      this.SpinnerService.hide()
      return false;
    }
    this.ecfservice.ecfapprove(this.SubmitApproverForm?.value)
      .subscribe(result => {
        if (result?.status == 'success') {
          this.notification.showSuccess('Approved Successfully')
          this.SpinnerService.hide()
          this.onSubmit.emit();
        } else {
          this.notification.showError(result?.description)
          this.SpinnerService.hide()
          return false;
        }
       
      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )

  }
  rejectForm() {
    this.SpinnerService.show()
    if (this.SubmitApproverForm?.value?.remark === "") {
      this.toastr.error('Please Enter Purpose');
      this.SpinnerService.hide()
      return false;
    }
    this.ecfservice.ecfreject(this.SubmitApproverForm?.value)
      .subscribe(result => {
        if (result?.status == 'success') {
          this.notification.showSuccess('Rejected Successfully')
          let data = this.invheaderdata
          for(let index in data){
            // console.log("credit",index)
            let credit = data[index]?.credit
            for(let creditind in credit ){
            // console.log("credititem",credit)
            if(credit[creditind]?.paymode_id?.id == 6){
              this.ppxdelete(this.SubmitApproverForm?.value?.id)
            }
          }
        }
          this.SpinnerService.hide()
          this.onSubmit.emit();
        } else {
          this.notification.showError(result?.description)
          this.SpinnerService.hide()
          return false;
        }
       
      },

      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      
      )

  }


  ppxdelete(id){
    this.ecfservice.ppxdelete(id).subscribe(result=>{
      if(result?.status != "success"){
        return false
      }
    })
  }

  detailback() {

    this.showheaderview = true
    this.showdetailview = false
  }

  debitrecords: any
  productname :any
  getinvdtlid(id,name) {
    // this.productname = name
    this.SpinnerService.show()
    this.ecfservice.getinvdetailsrecords(id)
      .subscribe(results => {
        if(results?.id != undefined){
        this.debitrecords = results['debit']
        // console.log("dr",this.debitrecords)
        this.SpinnerService.hide()
        }else{
          this.notification.showError(results?.description)
          this.SpinnerService.hide()
          return false
        }
      },

      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }

  roundoffdata:any
  otheramountdata:any
  detailrecords: any
  creditrecords: any
  debitrecordss:any
  invdetailtotamt:any
  credittotamt:any
  advdbttotamt:any
  getinvheaderid(id) {
    this.SpinnerService.show()
    this.ecfservice.getinvheaderdetails(id)
      .subscribe(results => {
        if(results != undefined){
        this.roundoffdata = results?.roundoffamt
        this.otheramountdata = results?.otheramount

        if (this.ecftypeid == 2 || this.ecftypeid == 7) {
          this.invoiceheaderdetailForm.patchValue({
            raisorcode:  this.raisergstnum,
            raisorname: this.raisername,
            gst: results?.invoicegst,
            suppcode: results?.supplier_id?.code,
            suppname: results?.supplier_id?.name,
            suppgst: results?.supplier_id?.gstno,
            invoiceno: results?.invoiceno,
            invoicedate: this.datePipe.transform(results?.invoicedate,'dd/MM/yyyy'),
            taxableamt: results?.invoiceamount,
            taxamt: results?.taxamount,
            invoiceamt: results?.totalamount

          })
        }
        if (this.ecftypeid == 3 ||this.ppxid == 'S') {
          this.invoiceheaderdetailForm.patchValue({
            raisorcode:  this.raisergstnum,
            raisorname: this.raisername,
            gst: results?.invoicegst,
            invoiceno: results?.invoiceno,
            invoicedate: this.datePipe.transform(results?.invoicedate,'dd/MM/yyyy'),
            taxableamt: results?.invoiceamount,
            taxamt : results?.taxamount,
            invoiceamt: results?.totalamount
          })

        }


        if (this.ecftypeid == 3||this.ppxid == 'E') {
          this.invoiceheaderdetailForm.patchValue({
            raisorcode:  this.raisergstnum,
            raisorname: this.raisername,
            gst: results?.invoicegst,
            invoiceno: results?.invoiceno,
            invoicedate: this.datePipe.transform(results?.invoicedate,'dd/MM/yyyy'),
            taxableamt: results?.invoiceamount,
            taxamt:results?.taxamount,
            invoiceamt: results?.totalamount
          })

        }

        if(this.ecftypeid == 8){

          this.invoiceheaderdetailForm.patchValue({
            raisorcode:  this.raisergstnum,
            raisorname: this.raisername,
            gst: results?.invoicegst,
            invoiceno: results?.invoiceno,
            invoicedate: this.datePipe.transform(results?.invoicedate,'dd/MM/yyyy'),
            taxableamt:results?.invoiceamount,
            taxamt:results?.taxamount,
            invoiceamt: results?.totalamount
          })
    
        }
    
        if(this.ecftypeid == 5){
    
          this.invoiceheaderdetailForm.patchValue({
            raisorcode:  this.raisergstnum,
            raisorname: this.raisername,
            gst: results?.invoicegst,
            invoiceno: results?.invoiceno,
            invoicedate: this.datePipe.transform(results?.invoicedate,'dd/MM/yyyy'),
            taxableamt: results?.invoiceamount,
            taxamt:results?.taxamount,
            invoiceamt: results?.totalamount
          })
    
        }
        // console.log("invhdrres",results)
        if(this.ecftypeid !=4){
        this.detailrecords = results['invoicedtl']
        this.detailrecords['expanded'] = false
        if(this.detailrecords?.length > 0){
          let detailamount = this.detailrecords?.map(y=>y.totalamount)
          let invdtltotamt = detailamount?.reduce((a, b) => a + b, 0)
          let roundoffamt = Number(this.detailrecords[0]?.roundoffamt)
          let otheramount = Number(this.detailrecords[0]?.otheramount)
          if(this.ecftypeid == 2 || this.ecftypeid == 7){
          this.invdetailtotamt = invdtltotamt+roundoffamt+otheramount
          }
          if(this.ecftypeid == 3){
            this.invdetailtotamt = Number(invdtltotamt) 
          }
         
          }
        // console.log("ir",this.detailrecords )
        }
        this.creditrecords = results['credit']
        if(this.creditrecords?.length > 0){
          let amount =  this.creditrecords?.map(x=>x.amount)
          this.credittotamt = amount?.reduce((a, b) => a + b, 0)
          }
        this.debitrecordss = results['debit']
        if(  this.debitrecordss?.length > 0){
          let dtamt = this.debitrecordss?.map(x=>x.amount)
          this.advdbttotamt = dtamt?.reduce((a, b) => a + b, 0)
        }
        this.SpinnerService.hide()
      }
       else{
         this.notification.showError(results.description)
         this.SpinnerService.hide()
         return false
       }
       
      
      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )

  }
  debittotamt:any
  findDetails(data) {
    this.productname = data?.productname
    let debitdata = this.debitrecordss?.filter(x => x.invoicedetail === data.id)
    let dbtamt = debitdata?.map(x=>x.amount)
    this.debittotamt = dbtamt?.reduce((a, b) => a + b, 0)
    return this.debitrecordss?.filter(x => x.invoicedetail === data.id);
  }

  data(datas){
    let id = datas?.file_id
    let filename = datas?.file_name
    // this.ecfservice.downloadfile(id)

    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = filename.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg"||
    stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {

        this.showimageHeaderAPI = true
        this.showimagepdf = false
        this.jpgUrlsAPI = this.imageUrl + "ecfserv/fileview/" + id + "?token=" + token;
      }
      if (stringValue[1] === "pdf"|| stringValue[1] === "PDF") {
        this.showimagepdf = true
        this.showimageHeaderAPI = false
        this.ecfservice.downloadfile(id)
          .subscribe((data) => {
            let binaryData = [];
            binaryData.push(data)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            this.pdfurl = downloadUrl
          }, (error) => {
            this.errorHandler.handleError(error);
            this.showimagepdf = false
            this.showimageHeaderAPI = false
            this.SpinnerService.hide();
          })
      }
      if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt"||
      stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
        this.showimagepdf = false
        this.showimageHeaderAPI = false
      }
  
  
  
  }

  getfiles(data){
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

        debitbacks() {
          this.closebutton.nativeElement.click();
        }
}

