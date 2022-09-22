import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, FormGroupDirective, FormControlName } from '@angular/forms';
import { switchMap, finalize, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { EcfService } from '../ecf.service';
import { ShareService } from '../share.service';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { environment } from 'src/environments/environment';





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
  selector: 'app-ecfsummary-view',
  templateUrl: './ecfsummary-view.component.html',
  styleUrls: ['./ecfsummary-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class EcfsummaryViewComponent implements OnInit {
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
  ecfheaderid: any
  invoiceheaderdetailForm: FormGroup
  SubmitApproverForm: FormGroup
  showhdrview = true
  showdtlview = false
  @ViewChild('closebutton') closebutton;
  showgst = true
  
  imageUrl = environment.apiURL
  tokenValues: any
  showimageHeaderAPI: boolean
  showimagepdf: boolean
  pdfurl: any
  jpgUrlsAPI: any
  headertotalamt:any
  raisername:any
  

  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  behalfyesorno = [{ 'value': true, 'display': 'Yes', "checked": true }, { 'value': false, 'display': 'No', "checked": false }]
  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer, private datePipe: DatePipe
    , private ecfservice: EcfService, private shareservice: ShareService, private notification: NotificationService,
    private router: Router, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService,
    private errorHandler:ErrorHandlingService) { }

  ngOnInit(): void {
    let data = this.shareservice.ecfheader.value
    this.ecfheaderid = data
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
      client_code: [''],
      rmcode: [''],
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
      invoiceamt: [''],
      taxamt:['']

    })

    this.SubmitApproverForm = this.fb.group({
      id: this.ecfheaderid,
      branch_id: [''],
      approver_id: [''],
      remarks: ['']

    })
    this.getinvoicedetails()
   


  }
  // getSections(forms) {
  //   return forms.controls.invoiceheader.controls;
  // }

  getecftype() {
    this.ecfservice.getecftype()
      .subscribe(result => {
        if(result){
        this.TypeList = result["data"]
        }

      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  getsuppliertype() {
    this.ecfservice.getsuppliertype()
      .subscribe(result => {
        if(result){
        this.SupptypeList = result["data"]
        }

      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  ecftypeid: any
  ppxid: any
  raisergstnum:any
  checkhr:any
  getinvoicedetails() {
    this.SpinnerService.show()
    
    this.ecfservice.getinvoicedetailsummary(this.ecfheaderid)
      .subscribe(result => {
        if(result.id != undefined){
        let datas = result
        this.raisername = datas?.raisername
        this.raisergstnum = datas?.branch?.gstin
        this.checkhr = datas?.is_onbehalfoff_hr
        this.ecftypeid = datas?.ecftype_id
        if (this.ecftypeid == 4) {
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
          payto: datas?.payto,
          ppx: datas?.ppx,
          notename: datas?.notename,
          remark: datas?.remark,
          client_code: datas?.client_code?.client_name,
          rmcode: datas?.rmcode?.code + "-" + datas?.rmcode?.name,
          is_raisedby_self:datas?.is_raisedby_self,
          raised_by:datas?.raisedby_dtls?.name

        })

        if( this.invheaderdata?.length > 0){
        
          let totalamount =  this.invheaderdata.map(x => x.totalamount);
          this.headertotalamt = totalamount.reduce((a, b) => a + b, 0);
        
        // ----
       
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
  
  Movetodetail(id) {
    //  this.router.navigate(['/invdtlsummaryview'])
    
    this.showhdrview = false
    this.showdtlview = true
    this.getinvheaderid(id)
   
  }
  back() {

    this.onCancel.emit()

  }

  SubmitForm() {
    if (this.SubmitApproverForm?.value?.remarks === "") {
      this.toastr.error('Please Enter Purpose');
      return false;
    }
    this.ecfservice.ecfapprove(this.SubmitApproverForm?.value)
      .subscribe(result => {
        if (result.status) {
          this.notification.showSuccess('Approved Successfully')
          this.router.navigate(['ECF/ecfapproval'])
          this.onSubmit.emit();
        } else {
          this.notification.showError(result.description)
          return false;
        }
      },error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
)

  }
  rejectForm() {
    if (this.SubmitApproverForm?.value?.remarks === "") {
      this.toastr.error('Please Enter Purpose');
      return false;
    }
    this.ecfservice.ecfreject(this.SubmitApproverForm?.value)
      .subscribe(result => {
        if (result.status) {
          this.notification.showSuccess('Rejected Successfully')
          this.router.navigate(['ECF/ecfapproval'])
          this.onSubmit.emit();
        } else {
          this.notification.showError(result.description)
          return false;
        }
      },error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
)

  }

  dtlback() {
    this.SpinnerService.show()
    this.showhdrview = true
    this.showdtlview = false
    this.SpinnerService.hide()

  }
  roundoffdata:any
  otheramountdata:any
  detailrecords: any
  creditrecords: any
  advancedebitrecords: any
  invoicedetailget=[]
  credittotamt:any
  invdetailtotamt:any
  advdbttotamt:any
  
  getinvheaderid(id) {
    this.SpinnerService.show()
    this.ecfservice.getinvheaderdetails(id)
      .subscribe(results => {
        if(results.id != undefined){
        this.roundoffdata = results?.roundoffamt
        this.otheramountdata = results?.otheramount
        if (this.ecftypeid == 2 || this.ppxid == 'S' || this.ecftypeid == 7) {
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
            taxamt:results?.taxamount,
            invoiceamt:results?.totalamount

          })
        }

        if (this.ecftypeid == 3 || this.ppxid == 'E') {
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
            taxableamt: results?.invoiceamount,
            taxamt:results?.taxamount,
            invoiceamt: results?.totalamount
          })
    
        }
    
        if(this.ecftypeid == 5){
    
          this.invoiceheaderdetailForm.patchValue({
            raisorcode: this.raisergstnum,
            raisorname: this.raisername,
            gst: results?.invoicegst,
            invoiceno: results?.invoiceno,
            invoicedate: this.datePipe.transform(results?.invoicedate,'dd/MM/yyyy'),
            taxableamt: results?.invoiceamount,
            taxamt:results?.taxamount,
            invoiceamt: results?.totalamount
          })
    
        }
        this.detailrecords = results['invoicedtl']


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
        if(this.ecftypeid == 8){
          this.invdetailtotamt = Number(invdtltotamt) 
        }
       
        }
        this.advancedebitrecords = results['debit']
        if(  this.advancedebitrecords?.length > 0){
          let dtamt = this.advancedebitrecords?.map(x=>x.amount)
          this.advdbttotamt = dtamt?.reduce((a, b) => a + b, 0)
        }
        this.creditrecords = results['credit']
        if(this.creditrecords?.length > 0){
        let amount =  this.creditrecords?.map(x=>x.amount)
        this.credittotamt = amount?.reduce((a, b) => a + b, 0)
        }
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
  debitrecords: any
  debittotamt:any
  getinvdtlid(id) {
    this.SpinnerService.show()
    this.ecfservice.getinvdetailsrecords(id)
      .subscribe(results => {
        if(results?.id != undefined){
        this.debitrecords = results['debit']
        if(this.debitrecords?.length > 0){
        let amount =  this.debitrecords?.map(x=>x.amount)
        this.debittotamt = amount?.reduce((a, b) => a + b, 0)
        }
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



  data(datas) {
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

  getfiles(data) {
    this.SpinnerService.show()
    this.ecfservice.filesdownload(data?.file_id)
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
  filelist:any
  getfiledetails(){
    this.ecfservice.getinvoicedetailsummary(this.ecfheaderid)
      .subscribe(result => {
       if(result){
        this.filelist = result['Invheader']
       }
      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



}




