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
import { environment } from 'src/environments/environment';
import { ErrorHandlingService } from '../error-handling.service';
import { NgxSpinnerService } from "ngx-spinner";

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
  selector: 'app-ecfcoview',
  templateUrl: './ecfcoview.component.html',
  styleUrls: ['./ecfcoview.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]

})
export class EcfcoviewComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  showhdrview = true
  showdtlview = false
  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  behalfyesorno = [{ 'value': true, 'display': 'Yes', "checked": true }, { 'value': false, 'display': 'No', "checked": false }]
  ecfheaderviewForm:FormGroup
  InvoiceHeaderForm:FormGroup
  invoiceheaderdetailForm:FormGroup
  coviewdata:any
  cosummarydata:any
  ecftypeid:any
  ppxid:any
  SubmitApproverForm:FormGroup
  tomorrow = new Date()
  tranrecords:any
  ecfheaderid:any
  @ViewChild('closebutton') closebutton;
  @ViewChild('closebuttons') closebuttons;
  @ViewChild('closebutton1') closebutton1;

  imageUrl = environment.apiURL
  tokenValues: any
  showimageHeaderAPI: boolean
  showimagepdf: boolean
  pdfurl: any
  jpgUrlsAPI: any
  headertotalamt:any
  showgst = true
  
  




  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer, private datePipe: DatePipe
    , private ecfservice: EcfService, private shareservice: ShareService, private notification: NotificationService,
    private router: Router, private toastr: ToastrService,private errorHandler:ErrorHandlingService,private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    let data = this.shareservice.coview.value
    this.coviewdata = data
    // console.log("data",data)
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
      is_raisedby_self:[''],
      raised_by:['']
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
      taxamount:['']

    })


    this.getcoviewdetails();

  }
  credittcfamount:any
  invdtltcfamount:any
  checkhr:any
  getcoviewdetails(){
    this.SpinnerService.show()
    this.cosummarydata =  this.coviewdata['Invheader']
    this.ecftypeid = this.coviewdata?.ecftype_id
    this.ecfheaderid = this.coviewdata?.id
    this.checkhr = this.coviewdata?.is_onbehalfoff_hr
    if(this.ecftypeid == 8){
      if(this.cosummarydata[0]['credit']?.length > 0){
     let creditdata = this.cosummarydata[0]['credit']
     let creditamt = creditdata?.map(x=>x.amount)
     this.credittcfamount = creditamt?.reduce((a, b) => a + b, 0)
      }
    if(this.cosummarydata[0]['invoicedtl']?.length > 0){
     let dtldata = this.cosummarydata[0]['invoicedtl']
     let dtlamt = dtldata?.map(x=>x.amount)
     this.invdtltcfamount = dtlamt?.reduce((a, b) => a + b, 0)
    }
  }

    if (this.ecftypeid == 4) {
      this.ppxid = this.coviewdata?.ppx_id
    }

    this.ecfheaderviewForm.patchValue({
      supplier_type: this.coviewdata?.supplier_type,
      commodity_id: this.coviewdata?.commodity_id?.name,
      ecftype: this.coviewdata?.ecftype,
      branch: this.coviewdata?.raiserbranch?.name +"-"+ this.coviewdata?.raiserbranch?.code,
      ecfdate: this.datePipe.transform(this.coviewdata?.ecfdate,'dd/MM/yyyy'),
      ecfamount: this.coviewdata?.ecfamount,
      payto: this.coviewdata?.payto,
      ppx: this.coviewdata?.ppx,
      notename: this.coviewdata?.notename,
      remark: this.coviewdata?.remark,
      is_raisedby_self:this.coviewdata?.is_raisedby_self,
      raised_by:this.coviewdata?.raisedby_dtls?.name

    })
    if( this.cosummarydata.length > 0){
      let totalamount =  this.cosummarydata.map(x => x.totalamount);
      this.headertotalamt = totalamount.reduce((a, b) => a + b, 0);
    

    if(this.ecftypeid == 8){

      this.invoiceheaderdetailForm.patchValue({
        raisorcode: this.coviewdata?.raiserbranch?.code,
        raisorname: this.coviewdata?.raisername,
        gst: this.cosummarydata[0]?.invoicegst,
        invoiceno: this.cosummarydata[0]?.invoiceno,
        invoicedate: this.datePipe.transform(this.cosummarydata[0]?.invoicedate,'dd/MM/yyyy'),
        taxableamt: this.cosummarydata[0]?.invoiceamount,
        invoiceamt: this.cosummarydata[0]?.totalamount,
        taxamount: this.cosummarydata[0]?.taxamount
      })

    }

    if(this.ecftypeid == 5){

      this.invoiceheaderdetailForm.patchValue({
        raisorcode: this.coviewdata?.raiserbranch?.code,
        raisorname: this.coviewdata?.raisername,
        gst: this.cosummarydata[0]?.invoicegst,
        invoiceno: this.cosummarydata[0]?.invoiceno,
        invoicedate: this.datePipe.transform(this.cosummarydata[0]?.invoicedate,'dd/MM/yyyy'),
        taxableamt: this.cosummarydata[0]?.invoiceamount,
        invoiceamt: this.cosummarydata[0]?.totalamount,
        taxamount: this.cosummarydata[0]?.taxamount
      }
      )

    }
  }
    this.SpinnerService.hide()
  }

  roundoffdata:any
  otheramountdata:any
  invhdrArray:any[] = []
  invdetailtotamt:any
  advdbttotamt:any
  credittotamt:any

  Movetodetail(id) {
    
    // const index = this.cosummarydata.findIndex(x=>x.id == id)
    // this.roundoffdata = this.cosummarydata[0].roundoffamt
    // this.otheramountdata = this.cosummarydata[0].otheramount
    // this.invhdrArray.push(this.cosummarydata[index])
    // console.log("invhdrArray",this.invhdrArray)

    this.showhdrview = false
    this.showdtlview = true
    this.getinvheaderid(id)
  }
  detailrecords:any
  advancedebitrecords:any
  creditrecords:any

  getinvheaderid(id) {
    if(this.ecftypeid != 8){
    this.ecfservice.getinvheaderdetails(id)
    .subscribe(results => {
      if(results?.id != undefined){
      this.roundoffdata = results?.roundoffamt
      this.otheramountdata = results?.otheramount

      if (this.ecftypeid == 2 ||this.ppxid == 'S') {
        this.invoiceheaderdetailForm.patchValue({
          raisorcode: results?.raisorbranchgst,
          raisorname: this.coviewdata?.raisername,
          gst:  results?.invoicegst,
          suppcode: results?.supplier_id?.code,
          suppname: results?.supplier_id?.name,
          suppgst: results?.supplier_id?.gstno,
          invoiceno: results?.invoiceno,
          invoicedate: this.datePipe.transform(results?.invoicedate,'dd/MM/yyyy'),
          taxableamt: results?.invoiceamount,
          invoiceamt: results?.totalamount,
          taxamount:results?.taxamount
  
        })
      }
      if (this.ecftypeid == 3||this.ppxid == 'E') {
        this.invoiceheaderdetailForm.patchValue({
          raisorcode:  results?.raisorbranchgst,
          raisorname: this.coviewdata?.raisername,
          gst: results?.invoicegst,
          invoiceno: results?.invoiceno,
          invoicedate: this.datePipe.transform(results?.invoicedate,'dd/MM/yyyy'),
          taxableamt: results?.invoiceamount,
          invoiceamt: results?.totalamount,
          taxamount:results?.taxamount
        })
  
      }
      this.detailrecords = results['invoicedtl']


        if(this.detailrecords?.length > 0){
        let detailamount = this.detailrecords?.map(y=>y.totalamount)
        let invdtltotamt = detailamount?.reduce((a, b) => a + b, 0)
        let roundoffamt = Number(this.detailrecords[0]?.roundoffamt)
        let otheramount = Number(this.detailrecords[0]?.otheramount)
        if(this.ecftypeid == 2){
        this.invdetailtotamt = invdtltotamt+roundoffamt+otheramount
        }
        if(this.ecftypeid == 3){
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
      }else{
        this.notification.showError(results.description)
        return false
      }
      })
    }
  }
  debitdetailArray:any[]=[]
  
  Movetodebit(id){
   
    for(let i=0;i< this.invhdrArray?.length;i++){
      let debitdata = this.invhdrArray[i]['debit']
      for(let j in debitdata){
        if(debitdata[j].invoicedetail == id){
        this.debitdetailArray.push(debitdata[j]) 
        // if( this.debitdetailArray.length > 0){
        //   let dtamt = this.debitdetailArray.map(x=>x.amount)
        //   this.debittotamt = dtamt.reduce((a, b) => a + b, 0)
        // }

        
        }
      }
    
    }



   


  }

  debitrecords: any
  debittotamt:any
  getinvdtlid(id) {
    // this.SpinnerService.show()
    this.ecfservice.getinvdetailsrecords(id)
      .subscribe(results => {
        if(results?.id != undefined){
        this.debitrecords = results['debit']
        if(this.debitrecords?.length > 0){
        let amount =  this.debitrecords?.map(x=>x.amount)
        this.debittotamt = amount?.reduce((a, b) => a + b, 0)
        }
        // this.SpinnerService.hide()
      }else{
        this.notification.showError(results?.description)
        // this.SpinnerService.hide()
        return false
      }

      },

      // error => {
      //   this.errorHandler.handleError(error);
      //   this.SpinnerService.hide();
      // }
      
      )
  }



  back() {

    this.onCancel.emit()

  }

  dtlback() {

    this.showhdrview = true
    this.showdtlview = false

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

gettrandata(){
  this.ecfservice.gettransactionstatus(this.ecfheaderid)
  .subscribe(result =>{
    if(result){
    this.tranrecords = result['data']
    }
  },error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  }
)
}

getfiledownload(datas){
  let id = datas?.file_id
  this.ecfservice.downloadfile(id)
}

getfiles(data){

this.ecfservice.filesdownload(data?.file_id)
      .subscribe((results) => {
        
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = data?.file_name;
        link.click();
      })
    }
    debitbacks() {
      this.closebutton.nativeElement.click();
    }
    fileback() {
      this.closebuttons.nativeElement.click();
    }

    tranback() {
      this.closebutton1.nativeElement.click();
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
  
   

}
