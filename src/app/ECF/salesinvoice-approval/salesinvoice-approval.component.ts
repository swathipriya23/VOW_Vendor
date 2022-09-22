import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
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
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { switchMap, finalize, debounceTime, distinctUntilChanged, tap,map,takeUntil } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
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
  selector: 'app-salesinvoice-approval',
  templateUrl: './salesinvoice-approval.component.html',
  styleUrls: ['./salesinvoice-approval.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class SalesinvoiceApprovalComponent implements OnInit {
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
  SubmitApproverForm:FormGroup
  Branchlist: Array<branchListss>;
  Approverlist: Array<approverListss>;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  isLoading: boolean;
  @ViewChild('branchtype') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('approvertype') matappAutocomplete: MatAutocomplete;
  @ViewChild('approverInput') approverInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  commodityid:any
  createdbyid:any
  ecfstatusid:any
  InvoiceHeaderForm:FormGroup
  disabledtlsave : boolean = true
  
  
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]


  constructor(private fb:FormBuilder,private shareservice:ShareService,private ecfservice:EcfService,private SpinnerService:NgxSpinnerService,
    private notification:NotificationService,private datepipe:DatePipe,private errorHandler:ErrorHandlingService,
    private sanitizer: DomSanitizer,private toastr:ToastrService) { }

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
    this.SubmitApproverForm = this.fb.group({
      id: this.salesheaderid,
      branch_id:[''],
      approvedby:[''],
      remark: ['']

    })
    this.InvoiceHeaderForm = this.fb.group({
      invoicegst :['']
    })
    this.getsalesheader()
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

      switchMap(value => this.ecfservice.getapproverscroll(1,this.commodityid,this.createdbyid)
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
       

      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
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
   
    this.ecfservice.getapprover(this.commodityid,this.createdbyid)
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
    this.ecfservice.getapproverscroll(this.currentpage + 1,this.commodityid,this.createdbyid)
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
    approverid:any
    getapproveid(data){
      this.approverid = data?.employee_id?.id
      
     
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
          this.ecfstatusid =  datas?.ecfstatus_id
          this.createdbyid = datas?.raisedby
          this.commodityid = datas?.commodity_id?.id
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
    detailback() {
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
        "id":this.salesheaderid,
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
  
  
  

}
