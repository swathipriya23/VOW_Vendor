import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { isBoolean } from 'util';
// import { formatDate } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import { TaService } from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import {ErrorHandlingService} from 'src/app/ta/error-handling.service'
import { ActivatedRoute, Router } from "@angular/router";
import { ShareService } from 'src/app/ta/share.service';
import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { NgxSpinnerService } from "ngx-spinner";
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { environment } from 'src/environments/environment';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-expenceapprove-edit',
  templateUrl: './expenceapprove-edit.component.html',
  styleUrls: ['./expenceapprove-edit.component.scss']
})
export class ExpenceapproveEditComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('closebutton') closebutton;
  @ViewChild('close') close;
  @ViewChild('closeret') closeret;
  @ViewChild('closerej') closerej;
  @ViewChild('assetid') matassetidauto: any;
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger
  comments: any
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  tourmodel: any
  tourmodell: any
  expencetypeList: any
  isDisabled = true;
  exp: any;
  comm: any;
  expense: any;
  expensee: any;
  id: any
  data: any
  getclaimrequest: any
  expenseList = [];
  re: any
  tourrr: any
  types: any
  isccbsbtn: boolean = true;
  clicked = false;
  expensetype: any;
  expenceform: FormGroup;
  tourid: any;
  show_forwarderapprovediv: boolean
  expenceid: any;
  getAdvanceapproveList: any;
  employeelist: any;
  branchlist: any;
  bisinesslist: any;
  costlist: any;
  listBranch: any;
  amt: any;
  ccbsamt: any;
  amtsum: any;
  ccbsper: any;
  persum: any;
  total1: number;
  tourgid: any;
  reason: any;
  startdate: any;
  showattachment: boolean = false
  showeditfile: boolean = true
  requestdate: any;
  employee_code: any;
  employee_name: any;
  show_approvediv: boolean
  show_rejectdiv: boolean
  appr_option: boolean
  show_returndiv: boolean
  show_forwarddiv: boolean
  show_approvebtn: boolean = true
  empdesignation: any;
  empgrade: any;
  aaaa: any;
  viewpdfimageeee: Window;
  pdfimgview: any;
  totalcount: any;
  images: any;
  resultimage: any;
  attachmentlist: any;
  imageUrl = environment.apiURL;
  count: any;
  fileextension: any;
  data_final: any
  tourapprove: any;
  tourforward: any;
  approverid: any;
  file_downloaded: boolean;
  fileid: any;
  p = 1;
  tokenValues: any;
  filesystem_error: boolean;
  pdfUrls: string;
  reapprove: boolean = false;
  file_window: Window;
  jpgUrls: string;
  remarks: any;
  branchid: any;
  has_nextemp: boolean = true;
  has_previousemp: boolean = true;
  has_presentemp: any = 1
  movetootherno: boolean = true;
  applevel: any;
  apichanges: boolean = true;
  isLoading: boolean;
  approvedamt: number;
  eligibleamt: Number;
  claimedamt: Number;
  expencetyp: any;
  approvedbyid: any;
  value: any;
  advance_statusid: any;
  empl: any
  pageSize = 10
  pageadsize = 10
  presentpage = 1
  ccbslist: any;
  reasonchange: any = null;
  statusId: any;
  itemdisable: boolean;
  loginid: any;
  currentDate: any = new Date();
  changeapprover: boolean;
  advancelist: any;
  sumadvance: number = 0;
  netpay: number;
  expencetypee: any;
  invalidpermission: boolean = false;
  tournotend: boolean = false;
  laststatus: any;
  empbrid: boolean = false;
  apvl: boolean = false;
  action: string[];
  actionapprove: boolean = false;
  actionreject: boolean = false;
  actionreturn: boolean = false;
  showreason: boolean = false;
  returnreason: boolean;
  ngreload=true;
  rejectreason: boolean;
  amtapprove: boolean = false;
  pdfshow:boolean = false;
  imgshow:boolean = false;
  expid: any;
  expensename: string;
  filesrc: string;
  file_ext: string[];
  admindata: any;
  admamount:Number =0;
  sumofficial:Number = 0;
  sumtotal:Number = 0;
  sumpersonal:Number = 0;
  enddate: any;
  
  showadmin: boolean = false;
  admindata_per: any;
  showadminper: boolean = false;
  onbeapp: number = 0;
  // tourmodel.comments || !tourmodel.expencetype=any
  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private http: HttpClient, 
    private taservice: TaService, private notification: NotificationService, private shareservice: ShareService,
    private router: Router, private sharedService: SharedService, private taService: TaService,
     private SpinnerService:NgxSpinnerService, private errorhandle :ErrorHandlingService) { }

    
  ngOnInit(): void {
    const params = new URL(window.location.href).searchParams;
    let tourid = params.get('tour_id');
    if (tourid) {
      this.objectassign(tourid);
    }
    const expense_summary = JSON.parse(localStorage.getItem('expense_details'))
    if (!expense_summary['reason']){
      this.notification.showError("This Travel Claim Has already updated  or Moved to Next Level")
    }
    const logindetails = JSON.parse(localStorage.getItem('sessionData'))
    this.loginid = logindetails.employee_id
    this.onbeapp = expense_summary['onbehalfapp'];
    this.approvedbyid = expense_summary['id']
    this.tourgid = expense_summary['tourid']
    this.tourid = expense_summary['tourid']
    this.reason = expense_summary['reason']
    this.startdate = expense_summary['startdate']
    this.enddate = expense_summary['enddate']
    this.action = ['APPROVE', 'RETURN', 'REJECT']

    this.requestdate = expense_summary['requestdate']
    this.employee_code = expense_summary['employee_code']
    this.employee_name = expense_summary['employee_name']
    this.empdesignation = expense_summary['empdesignation']
    this.empgrade = expense_summary['empgrade']
    this.applevel = expense_summary['applevel']
    this.statusId = expense_summary.claim_status_id;
    if (this.applevel == 2) {
      
      this.action = ['APPROVE', 'RETURN', 'REJECT', 'MOVE TO OTHER']
    }
    this.branchid = expense_summary.empbranchgid
    this.advance_statusid = expense_summary['advance_status_id'];
    if (expense_summary.status_name == 'APPROVED') {
      this.reapprove = true;
    }
    this.id = expense_summary['tourid']
    console.log("id", this.id)
    this.tourmodell = {
      requestno: this.id,
      expencetypee: "",
      comments: "",
      bank: ""
    }
    this.tourmodel = {
      tourgid: this.id,
      approvedby: '',
      appcomment: '',

    }
    this.tourapprove = {
      comments: ''
    }
    this.exp = this.tourmodell.expencetype;
    this.comm = this.tourmodell.comments;
    console.log("bbb", this.comm)
    this.comentscl();
    this.getclaimrequestsumm();
    this.getadvanceapprovesumm();
    this.getbranchValue();
    // if (this.applevel == 2 && this.statusId == 2) {
    //   this.ccbsupdate();
    // }

    this.tourrr = this.tourmodell
    console.log("saiii", this.tourrr)

    this.shareservice.dropdownvalue.next(expense_summary)
    //  this.taservice.getfetchimages( this.tourid)
    //  .subscribe((results) => {
    //  //  this.resultimage=results[0].url
    //    this.attachmentlist=results
    //    this.count = this.attachmentlist.length
    //    let stringValue = results[0].file_name.split('.')
    //    this.fileextension=stringValue.pop();

    //  }) 

    this.expenceform = this.formBuilder.group({
      tourgid: this.id,
      appcomment: null,
      empbranchid: null,
      approvedby: null,
      approval: null,
      action: null
    })

    if (this.apichanges) {
      this.expenceform.get('empbranchid').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taservice.getUsageCode(value, 1))
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchlist = datas;
          console.log("Branch List", this.branchlist)
        });

      this.expenceform.get('approval').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taservice.setemployeeValues(value?value:' ', this.branchid, '', this.id))
        )
        .subscribe((results: any[]) => {
          let datas = results;
          this.employeelist = datas;
          console.log("Employee List", this.employeelist)
        });

    }

  }
  displayFn(subject) {
    return subject ? "(" + subject.code + ")" + subject.full_name : undefined;
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 62 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || k== 33 || (k >= 44 && k <= 58));
  }

  remarksupdate(value) {
    this.remarks = value.target.value;
  }

  openpdfimage(url) {
    this.taservice.getviewpdfimages(url)
      .subscribe((results) => {

        this.aaaa = results
        // this.resultimage=results[0].url
        // pdfSrc: string = '/pdf-test.pdf';
        // var fileURL: any ='/ta_210820_052848angularjs_tutorial.pdf';
        // console.log("ri",this.resultimage)
        // var a = document.createElement("a");
        // a.href = fileURL;
        // a.target = '_blank';
        // a.click();

      })
  }

  actionchange() {
    let actionvalue = this.expenceform.value.action
    if (actionvalue == 'APPROVE' && this.applevel == 1 || actionvalue == 'MOVE TO OTHER') {
      this.actionapprove = true;
      this.actionreject = false;
      this.actionreturn = false;
      this.showreason = false;
      const myForm = this.expenceform;
      myForm.patchValue({
        "approval": undefined,
        "empbranchid": null,
        "remarks": null,
      });
    }
    else if (actionvalue == 'APPROVE' && this.applevel == 2) {
      this.amtapprove = true;
      this.actionreject = false;
      this.actionreturn = false;
      this.actionapprove = false;
      this.showreason = true;
    }
    else if (actionvalue == 'REJECT') {
      this.amtapprove = false;
      this.actionreject = true
      this.actionreturn = false;
      this.actionapprove = false;
      this.showreason = true;
    }
    else if (actionvalue == 'RETURN') {
      this.amtapprove = false;
      this.actionreturn = true;
      this.actionreject = false;
      this.actionapprove = false;
      this.showreason = true;
    }
  }
  
  getimages() {
    this.taservice.getfetchimages(this.tourid)
      .subscribe((results) => {
        this.showattachment = true
        this.resultimage = results[0].url
        const file_ext = ['pdf', 'jpg', 'png', 'PDF', 'JPG', 'JPEG', 'jpeg', 'image']
        this.attachmentlist = results
        // this.count = this.attachmentlist.length
        console.log("barcode", results)

        for (var i = 0; i < results.length; i++) {

          var downloadUrl = results[i].url;
          let stringValue = results[i].file_name.split('.')
          this.fileextension = stringValue.pop();
          if (file_ext.includes(this.fileextension)) {
            continue
          }
          else if (this.file_downloaded == false) {
            this.viewpdfimageeee = window.open(downloadUrl, '_blank');
            console.log('barcode', downloadUrl)
            this.fileid = results[i].id
            console.log("this.fileid", this.fileid)
            this.getcall()
          }
        }
        this.file_downloaded = true;
      })
  }

  
  commentPopup(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    this.filesystem_error = false;
    let id = pdf_id;
    this.fileid = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    this.fileextension = stringValue.pop();
    if (this.fileextension === "pdf") {
      this.pdfUrls = this.imageUrl + "taserv/download_documents/" + id + "?type=pdf&token=" + token
      this.file_window = window.open(this.pdfUrls, "_blank", 'width=600,height=400,left=200,top=200')
    }
    else if (this.fileextension === "png" || this.fileextension === "jpeg" || this.fileextension === "jpg" || this.fileextension === "JPG" || this.fileextension === "JPEG") {
      // if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {

      this.jpgUrls = this.imageUrl + "taserv/download_documents/" + id + "?type=" + this.fileextension + "&token=" + token
    }
    else {
      this.filesystem_error = true;
    }
  }

  closefile_window() {
    this.file_window.close()
  }

  objectassign(tour){
    let data=`&tour_no=${tour}`
    if (this.ngreload){
      this.ngreload = false;
      this.taservice.getapprovexpenceSummary(2, 1,data).subscribe(res => {
        let data = res["data"][0];
        var datas = JSON.stringify(Object.assign({}, data));
        localStorage.setItem('expense_details', datas)
          
          // throw new Error;
        
        this.ngOnInit();
        
      });
    }
    
    // let date = JSON.parse(localStorage.getItem('tourmakersummary')
    
  }

  fileDelete() {
    this.taservice.fileDelete(this.fileid)
      .subscribe((res) => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.notification.showWarning("Duplicate! Code Or Name ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
        }
        else {
          this.notification.showSuccess("Deleted Successfully....")
          console.log("res", res)
          this.onSubmit.emit();
          return true
        }

      })
  }

  submitvaluecheck() {
    let values = this.expenceform.value;
    if (values.empbranchid && values.approval && values.appcomment) {
      return false;
    }
    else {
      return true
    }

  }
  getcall() {
    // this.taservice.getfetchimages1(this.fileid)
    //   .subscribe((results) => {
    //     console.log("results", results)
    //   })
  }
  onFileSelected(e) {

    this.images = e.target.files;
    this.totalcount = this.images.length
    this.fileData = this.images
    // console.log("fdddd", this.fileData)
    this.pdfimgview = this.fileData[0].name
    // console.log("pdffff",this.pdfimgview)

  }

  attachmentdtl(expense) {
    let expid = expense.expenseid
    this.expid = expense.expenseid
    if (expid == 1) {
      this.expensename = ' Travelling Expenses'
    }
    else if (expid == 2) {
      this.expensename = ' Daily Reimbursement'
    }
    else if (expid == 5) {
      this.expensename = ' Lodging'
    }
    else if (expid == 4) {
      this.expensename = ' Local Conveyance'
    }
    else if (expid == 9) {
      this.expensename = ' Associated Expenses'
    }
    this.fetchattachment()

  }
  getimagedownload(ind) {
    let value = this.attachmentlist[ind]
    let fileid = value.id;
    let option = 'view'
    // console.log(this.filesrc)
    // let msg = this.filetype_check2(ind);
    // this.commentPopup(value.id, value.file_name)
    this.SpinnerService.show()
    this.taservice.viewfile(fileid, option, value).subscribe(results => {
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      this.filesrc = downloadUrl
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = value.file_name;
      link.click();
      // if (msg == 1) {
      //   this.pdfshow = false;
      //   this.imgshow = true;
      // }
      // else {
      //   this.pdfshow = true;
      //   this.imgshow = false
      // }
    })
  }

  fetchattachment() {
    let tourid = this.expenceform.value.tourgid;
    this.taservice.expallfiles(tourid, this.expid)
      .subscribe(result => {
        this.attachmentlist = result['data']
      })
  }

  comentscl() {
    if (this.tourmodell.comments != "") {
      this.isDisabled = false;
    }
    else {
      this.isDisabled = true;
    }

  }
  getemployeeValue() {
    this.taservice.getemployeeValue()
      .subscribe(result => {
        this.employeelist = result
        console.log("employee", this.employeelist)
      })
  }
  getbranchValue() {
    this.taservice.getbranchValue()
      .subscribe(result => {
        this.branchlist = result['data']
        console.log("branchlist", this.branchlist)
      })
  }



  close_div(cls) {
    this.show_approvebtn = true;
    this.show_approvediv = false;
    this.show_rejectdiv = false;
    this.show_returndiv = false;
    this.show_forwarddiv = false;
    this.show_forwarderapprovediv = false;
    this.tourapprove.comments = '';
  }

  approve_service(data) {
    this.SpinnerService.show();
    this.taservice.approvetourmaker(data)
      .subscribe(res => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.SpinnerService.hide();
          this.notification.showWarning("Duplicate! Code Or Name ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.SpinnerService.hide()
          this.notification.showError("INVALID_DATA!...")
        }
        else if (res.status == 'success') {
          this.SpinnerService.hide()
          this.notification.showSuccess("Claim Approved Successfully....")
          this.close.nativeElement.click()
          this.data = { index: 2 }
          this.sharedService.summaryData.next(this.data)
          this.router.navigateByUrl('ta/ta_summary');
          this.onSubmit.emit();
          return true
        }
        else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)

        }

      })
  }

  reject_service(data) {
    this.SpinnerService.show()
    this.taservice.rejecttourmaker(data)
      .subscribe(res => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.SpinnerService.hide()
          this.notification.showWarning("Duplicate! Code Or Name ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.SpinnerService.hide()
          this.notification.showError("INVALID_DATA!...")
        }
        else if (res.status == 'success') {
          this.SpinnerService.hide()
          this.notification.showSuccess("Claim Rejected Successfully....")
          this.data = { index: 2 }
          this.sharedService.summaryData.next(this.data)
          this.closerej.nativeElement.click()
          this.router.navigateByUrl('ta/ta_summary');
          this.onSubmit.emit();
          return true
        }
        else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)

        }
      })
  }
  return_service(data) {
    this.SpinnerService.show()
    this.taservice.returntourmaker(data)
      .subscribe(res => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.SpinnerService.hide()
          this.notification.showWarning("Duplicate! Code Or Name ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.SpinnerService.hide()
          this.notification.showError("INVALID_DATA!...")
        }
        else if (res.status == 'success') {
          this.SpinnerService.hide()
          this.closeret.nativeElement.click()
          this.notification.showSuccess("Claim Returned Successfully....")
          this.data = { index: 2 }
          this.sharedService.summaryData.next(this.data)
          this.router.navigateByUrl('ta/ta_summary');
          this.onSubmit.emit();
          return true
        }
        else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)

        }
      })
  }

  approve_btn(btn) {
    this.appr_option = true;
    if (btn == 1) {
      this.show_approvebtn = false;
      this.show_approvediv = true;
      this.show_rejectdiv = false;
      this.show_returndiv = false;
      this.show_forwarddiv = false;
      this.show_forwarderapprovediv = false;
    }
    else if (btn == 2) {
      this.show_approvebtn = false;
      this.show_approvediv = false;
      this.show_rejectdiv = true;
      this.show_returndiv = false;
      this.show_forwarddiv = false;
      this.show_forwarderapprovediv = false;
    }
    else if (btn == 3) {
      this.show_approvebtn = false;
      this.show_approvediv = false;
      this.show_rejectdiv = false;
      this.show_returndiv = true;
      this.show_forwarddiv = false;
      this.show_forwarderapprovediv = false;
    }

    else if (btn == 4) {
      this.show_approvebtn = false;
      this.show_approvediv = false;
      this.show_rejectdiv = false;
      this.show_returndiv = false;
      this.show_forwarddiv = true;
      this.show_forwarderapprovediv = false;
    }

    else if (btn == 5) {
      this.show_approvebtn = false;
      this.show_approvediv = false;
      this.show_rejectdiv = false;
      this.show_returndiv = false;
      this.show_forwarddiv = false;
      this.show_forwarderapprovediv = true;
    }
  }
  selectBranch(e) {
    console.log("e", e.value)
    let branchvalue = e
    this.branchid = branchvalue
    this.expenceform.patchValue({
      "approval": undefined
    })

  }

  brclear() {
    let myform = this.expenceform
    myform.patchValue({
      "empbranchid": null,
      "approval": null
    })
    this.apvl = false;
    this.empbrid = false;
  }

  empclear() {
    this.expenceform.patchValue({
      approval: null
    })
    this.apvl = false;
  }

  brchange() {

    this.empbrid = true;
  }

  empchange() {

    this.apvl = true;
  }
  getadvanceapprovesumm(pageNumber = 1, pageSize = 10) {
    this.taservice.getapproveflowalllist(this.tourid)
      .subscribe(result => {
        console.log("Tourmaker", result)
        let datas = result['approve'];
        this.getAdvanceapproveList = datas;
        // let mainelement = datas[datas.length - 1]
        // this.approvedbyid = mainelement.id
        // let lastbefore = datas[datas.length - 2]
        // this.laststatus = mainelement.status
        // this.reasonchange = mainelement.comment

        // if (this.loginid == lastbefore.approver_id && this.statusId == 3 && this.laststatus == 2) {
        //   this.changeapprover = true;
        //   this.actionapprove = true;
        //   this.returnreason = false;
        //   this.rejectreason = false;
        // }
        // else {
        //   this.changeapprover = false;
        //   this.returnreason = true;
        //   this.rejectreason = true;
        // }

        // if ((this.statusId == 3 || this.statusId == 4 || this.statusId == 5) && this.laststatus != 2) {
        //   this.invalidpermission = true;
        // }
        // else {
        //   this.invalidpermission = false;
        // }

        // if (this.loginid != mainelement.approver_id && this.loginid != lastbefore.approver_id && this.applevel == 2) {
        //   this.movetootherno = false;
        // }
        // if (mainelement.applevel == 2 && lastbefore.applevel == 2 && this.applevel == 1) {
        //   this.invalidpermission = true;
        // 
      })
  }
  // getexpenseValue() {
  //   this.taservice.getexpenseTypeValue()
  //     .subscribe(result => {
  //       this.expencetypeList = result['data']
  //       console.log("expense", this.expencetypeList)
  //     })

  // }
  datas: any
  addForm() {

    let result = this.tourrr;
    console.log("nn", result)
    let re = {
      "requestno": result.requestno,
      "expenseid": result.expencetypee,
      "requestercomment": result.comments
    }
    console.log("ddd", re)

    this.getclaimrequest.push(re);
    console.log("ss", this.getclaimrequest)
    this.datas = re
    let data = this.shareservice.dropdownvalue.next(this.datas)
    console.log("data", data)
    this.resetclick();
    // this.tourmodel.expencetype='';
    // this.tourmodel.comments='';
    // this.tourmodel.reset();  
  }

  resetclick() {
    this.tourmodell.expencetypee = '';
    this.tourmodell.comments = '';
  }
  
  back() {
    this.onCancel.emit()
    if (this.statusId == 2){
      this.data = 3
    }
    else if (this.statusId == 3){
      this.data = 4
    }
    else if(this.statusId== 4){
      this.data = 5
    }
    else {
      this.data = 6
    }
    this.shareservice.TourMakerEditId.next('1')
    this.sharedService.summaryData.next(this.data)
    this.router.navigateByUrl('ta/ta_summary');
  }
  getclaimrequestsumm() {
    this.SpinnerService.show()
    this.taService.getclaimrequestsummary(this.tourid)
      .subscribe((result) => {
        this.SpinnerService.hide()
        this.approvedamt = result.approved_amount
        this.eligibleamt = result.eligible_amount
        this.claimedamt = result.claimed_amount
        let datas = result['data'];
        this.admindata = result.booking_amount;
        this.admindata = this.admindata.filter(function (record) {
          return record.official_amt !== 0 || record.personal_amt !== 0 
        });
        this.admindata.forEach(element => {
          this.sumofficial = this.sumofficial + element.official_amt
          this.sumpersonal = this.sumpersonal + element.personal_amt
          this.sumtotal = this.sumtotal + element.total_amt
        });
        if (this.admindata.length > 0) {
          this.showadmin = true;
        }

       

        
        if (result.approver_branch_data) {
          let branchdetail = result.approver_branch_data
          const myform = this.expenceform
          this.remarks = result.approver_comment;
          myform.patchValue({
            "approval": branchdetail,
            "empbranchid": "(" + branchdetail.branch_code + ") " + branchdetail.branch_name,
            "appcomment": this.remarks
          })
          this.branchid = branchdetail.branch_id
        }

        this.getclaimrequest = datas;
        console.log("Claim Request......", this.getclaimrequest)
        for (var i = 0; i < this.getclaimrequest.length; i++) {
          // this.tourid= this.getclaimrequest[i].tourid;
          this.expenceid = this.getclaimrequest[i].expenseid;
          console.log("Claim Request......", this.expenceid)
        }
       

        this.taservice.getclaimccbsEditview(this.id).subscribe(result => {
          this.ccbslist = result;
          this.itemdisable = true;
          console.log(this.ccbslist)
        })
      },(error)=>{
      
        this.SpinnerService.hide();
        this.errorhandle.handleError(error);
      })
  }


  csview(subject) {
    return subject ? subject.name : undefined;
  }
  bsview(subject) {
    return subject ? subject.name : undefined;
  }

  ccbsupdate() {
    this.taservice.claimccbsupdate(this.id).subscribe(res => {
      console.log(res.description)
    })
  }
  filecheck(i){
    if(this.getclaimrequest[i].file_count){
      return true;
    }
    else{
      return false;
    }
  }

  expenseEdit(data) {
    this.data = data
    console.log("dd", this.data)
    this.shareservice.id.next(this.tourid)
    this.shareservice.expenseedit.next(this.data)
    var datas = JSON.stringify(Object.assign({}, data))
    localStorage.setItem("expense_edit", datas)
    if (this.data.expenseid == 1) {
      this.router.navigateByUrl('ta/travel');
    }
    else if (this.data.expenseid == 2) {
      this.router.navigateByUrl('ta/daily');
    }
    else if (this.data.expenseid == 3) {
      this.router.navigateByUrl('ta/inci');
    }
    else if (this.data.expenseid == 4) {
      this.router.navigateByUrl('ta/local')
    }
    else if (this.data.expenseid == 5) {
      this.router.navigateByUrl('ta/lodge')
    }
    else if (this.data.expenseid == 9) {
      this.router.navigateByUrl('ta/misc')
    }
    else if (this.data.expenseid == 7) {
      this.router.navigateByUrl('ta/pack')
    }
    else if (this.data.expenseid == 8) {
      this.router.navigateByUrl('ta/deput')
    }
  }
  approvefirst() {
    const myform = this.expenceform.value;
    // if (myform.empbranchid == null || myform.empbranchid == '') {
    //   this.notification.showError('please select Branch')
    //   return false
    // }
    if (this.remarks == null || this.remarks == '') {
      this.notification.showError("Please Enter Remarks")
      return false;
    }

    // if (myform.approval == null || myform.approval == '') {
    //   this.notification.showError('please select Approver')
    //   return false
    // }
    this.changeapprover = false;

    if (this.changeapprover) {
      let payload = {
        "id": this.approvedbyid,
        "apptype": "claim",
        "tour_id": this.id,
        "comment": myform.appcomment,
        "approver": "3"
      }
      this.taservice.claimapproveupdate(payload).subscribe(results => {
        if (results.status == "success") {
          this.notification.showSuccess("Updated successfully")
          this.data = { index: 2 }
          this.sharedService.summaryData.next(this.data)
          this.router.navigateByUrl('ta/expense-approval');
          this.onSubmit.emit();
          return true
        }
        else {
          this.notification.showError(results.description)
        }
      })
    }
    else {
      let payload = {
        "id": this.approvedbyid,
        "apptype": "claim",
        "tourgid": this.id,
        "appcomment": myform.appcomment,
        "status": "3",
        "approvedby": "3"
      }
      this.approve_service(payload)
    }


  }

  reasonupdate(event) {
    this.reasonchange = event.target.value;
  }
  approveclaim() {
    let myform = this.expenceform.value
    if (myform.appcomment == null || myform.appcomment == '') {
      this.notification.showError("Please Enter Remarks")
      return false;
    }
    var payload = {}
    payload = {
      "id": this.approvedbyid,
      "apptype": "claim",
      "tourgid": this.id,
      "appcomment": myform.appcomment,
    }
    if(this.onbeapp != 0 && this.onbeapp != null){
      payload = {
        "id": this.approvedbyid,
        "apptype": "claim",
        "tourgid": this.id,
        "appcomment": myform.appcomment,
        "onbehalf":this.onbeapp
      }
    }
    this.approve_service(payload);
  }

  returnclaim() {
    let myform = this.expenceform.value
    if (myform.appcomment == null || myform.appcomment == '') {
      this.notification.showError("Please Enter Remarks")
      return false;
    }
    var payload = {}
    payload = {
      "id": this.approvedbyid,
      "apptype": "claim",
      "appcomment": myform.appcomment,
      "tour_id": this.id
    }
    if (this.onbeapp != 0 && this.onbeapp != null){
      payload = {
        "id": this.approvedbyid,
        "apptype": "claim",
        "appcomment": myform.appcomment,
        "tour_id": this.id,
        "onbehalf":this.onbeapp
      }
    }
    this.return_service(payload);
  }

  rejectclaim() {
    let myform = this.expenceform.value
    if (myform.appcomment == null || myform.appcomment == '') {
      this.notification.showError("Please Enter Remarks")
      return false;
    }
   var payload = {}
   payload = {
      "id": this.approvedbyid,
      "apptype": "claim",
      "appcomment": myform.appcomment,
      "tour_id": this.id
    }

    if (this.onbeapp != 0 && this.onbeapp != null){
      payload = {
        "id": this.approvedbyid,
        "apptype": "claim",
        "appcomment": myform.appcomment,
        "tour_id": this.id,
        "onbehalf":this.onbeapp,
      }
    }
    this.reject_service(payload)
  }
  autocompleteid() {
    setTimeout(() => {
      if (this.matassetidauto && this.autocompletetrigger && this.matassetidauto.panel) {
        fromEvent(this.matassetidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.matassetidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.matassetidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.matassetidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.matassetidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextemp) {
              this.taservice.getbranchvalues(this.has_presentemp).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.branchlist)
                let pagination = data['pagination'];
                this.branchlist = this.branchlist.concat(dts);

                if (this.branchlist.length > 0) {
                  this.has_nextemp = pagination.has_next;
                  this.has_previousemp = pagination.has_previous;
                  this.has_presentemp = pagination.index;

                }
              })
            }
          }
        })
      }
    })
  }
  fileeditview(ind) {
    let value = this.attachmentlist[ind]
    let fileid = value.id;
    let option = 'view'

    console.log(this.filesrc)
    let msg = this.filetype_check2(ind);
    // this.commentPopup(value.id, value.file_name)
    this.taservice.viewfile(fileid, option,value).subscribe(results => {
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);

      let token = tokenValue.token;
      if (this.file_ext.includes(this.fileextension.toLowerCase())) {
        this.filesrc = this.imageUrl + 'taserv/document_view?doc_option=' + option + '&id=' + fileid + "&type=" + this.fileextension + "&token=" + token;
      }
      else {
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        this.filesrc = downloadUrl
      }
      if (msg == 1) {
        this.pdfshow = false;
        this.imgshow = true;
      }
      else {
        this.pdfshow = true;
        this.imgshow = false
      }
    })

  }
  filetype_check2(i) {
    let stringValue = this.attachmentlist[i].file_name.split('.')
    this.fileextension = stringValue.pop();
    this.file_ext = ['jpg', 'png', 'JPG', 'JPEG', 'jpeg', 'image']
    if (this.file_ext.includes(this.fileextension)) {
      var msg = 1;
    }
    else {
      var msg = 0;
    }
    return msg


  }
  

}