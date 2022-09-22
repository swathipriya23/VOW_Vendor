import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormGroupDirective } from '@angular/forms';
import { ShareService } from '../share.service';
import { DomSanitizer } from '@angular/platform-browser';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { EcfService } from '../ecf.service';
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
  selector: 'app-salesinvoice-view',
  templateUrl: './salesinvoice-view.component.html',
  styleUrls: ['./salesinvoice-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class SalesinvoiceViewComponent implements OnInit {
  salesheaderForm:FormGroup
  salesheaderid:any
  raisername:any
  raisergstnum:any
  ecftypeid:any
  invheaderdata:any
  headertotalamt:any
  invheaderid:any
  imageUrl = environment.apiURL
  tokenValues: any
  showimageHeaderAPI: boolean
  showimagepdf: boolean
  pdfurl: any
  jpgUrlsAPI: any
  InvoiceHeaderForm:FormGroup
  disabledtlsave : boolean = true
  
  
  @Output() onCancel = new EventEmitter<any>();
  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  constructor(private fb:FormBuilder,private shareservice:ShareService,private ecfservice:EcfService,private SpinnerService:NgxSpinnerService,
    private notification:NotificationService,private datepipe:DatePipe,private errorHandler:ErrorHandlingService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    let data = this.shareservice.salesheaderedit.value
    this.salesheaderid = data
    this.salesheaderForm = this.fb.group({
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
      invoicegst:['']
    })
    this.getsalesheader()
}
getsalesheader(){
  this.SpinnerService.show()
    
    this.ecfservice.getinvoicedetailsummary(this.salesheaderid)
      .subscribe(result => {
        if(result.id != undefined){
        let datas = result
        this.raisername = datas?.raisername
        this.raisergstnum = datas?.branch?.gstin
        this.ecftypeid = datas?.ecftype_id
        this.salesheaderForm.patchValue({
          supplier_type: datas?.supplier_type,
          commodity_id: datas?.commodity_id?.name,
          ecftype: datas?.ecftype,
          branch: datas?.branch?.name,
          ecfdate: this.datepipe.transform(datas?.ecfdate,'dd/MM/yyyy'),
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
        if(result["Invheader"]?.length > 0){
          this.invheaderdata = result["Invheader"]
          for(let i in  this.invheaderdata){
          this.invheaderid = this.invheaderdata[i].id
          }
          this.InvoiceHeaderForm.patchValue({
            invoicegst :  this.invheaderdata[0].invoicegst
          })
          this.getinvoicedetails(this.invheaderid )
        }

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
  return this.sanitizer.bypassSecurityTrustHtml(this.salesheaderForm.get('html').value);
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

data(datas) {
  let id = datas?.file_id
  let filename = datas?.file_name
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

filelist:any
  getfiledetails(){
    this.ecfservice.getinvoicedetailsummary(this.salesheaderid)
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
  roundoffdata:any
  otheramountdata:any
  detailrecords:any
  invdetailtotamt:any
  getinvoicedetails(id) {
    this.SpinnerService.show()
    this.ecfservice.getinvheaderdetails(id)
      .subscribe(results => {
        if(results.id != undefined){
        this.roundoffdata = results?.roundoffamt
        this.otheramountdata = results?.otheramount
        this.detailrecords = results['invoicedtl']
        if(this.detailrecords?.length > 0){
          let detailamount = this.detailrecords?.map(y=>y.totalamount)
          let invdtltotamt = detailamount?.reduce((a, b) => a + b, 0)
          let roundoffamt = Number(this.detailrecords[0]?.roundoffamt)
          let otheramount = Number(this.detailrecords[0]?.otheramount)
          this.invdetailtotamt = invdtltotamt+roundoffamt+otheramount
          

        }
        this.SpinnerService.hide()
    }
        else{
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
  back() {
    this.onCancel.emit()
  }


}
