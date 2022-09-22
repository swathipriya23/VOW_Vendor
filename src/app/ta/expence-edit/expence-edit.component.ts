import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray, Form } from '@angular/forms';
import { isBoolean } from 'util';
import { Observable } from "rxjs";
// import { formatDate } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import { TaService } from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import { ActivatedRoute, Router } from "@angular/router";
import { ShareService } from 'src/app/ta/share.service';
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from 'src/environments/environment'
const isSkipLocationChange = environment.isSkipLocationChange
import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { RIGHT_ARROW } from '@angular/cdk/keycodes';



@Component({
  selector: 'app-expence-edit',
  templateUrl: './expence-edit.component.html',
  styleUrls: ['./expence-edit.component.scss'],
  providers: [

    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
})


export class ExpenceEditComponent implements OnInit {
  [x: string]: any;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('closebutton') closebutton;
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger
  @ViewChild('ccid') cccid: any;
  @ViewChild('bsid') bsssid: any;
  @ViewChild('bssid') matbssidauto: MatAutocomplete;
  @ViewChild('closefilepopup')closefilepopup;
  comments: any
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  tourmodel: any
  tourmodell: any
  expencetypeList: any
  isDisabled = false;
  exp: any;
  comm: any;
  expense: any;
  expensee: any;
  id: any
  base64textString = [];
  data: any
  showattachment = false
  getclaimrequest: any = [];
  expenseList = [];
  totalcount: any
  pdfimgview: any
  images: any
  showcreatefile = true
  showeditfile = false
  re: any
  tourrr: any
  types: any
  isccbsbtn: boolean = true;
  clicked = false;
  expensetype: any;
  imageUrl = environment.apiURL;
  tourid: any;
  expenceid: any;
  getAdvanceapproveList: any;
  advance_statusid: any; null
  employeelist: any;
  brevent: any;
  branchlist: any;
  bisinesslist: any;
  showcreatecount = true
  costlist: any;
  listBranch: any;
  amt: any;
  ccbsamt: any;
  amtsum: any;
  ccbsper: any;
  persum: any;
  total1: number;
  bs: any;
  file_length: number = 0;
  list: DataTransfer;
  resultimage: any;
  attachmentlist: any;
  fileextension: any;
  file_downloaded: boolean;
  viewpdfimageeee: Window;
  fileid: any;
  tokenValues: any;
  filesystem_error: boolean;
  pdfUrls: string;
  jpgUrls: string;
  file_window: Window;
  upexp2: any;
  showeditcount: boolean;
  reason: any;
  file_ext: any = ['jpg', 'png', 'JPG', 'JPEG', 'jpeg', 'image'];
  expenceform: FormGroup;
  page: any = 1;
  has_nextemp: boolean = true;
  has_previousemp: boolean = true;
  has_presentemp: any = 1
  has_nextbsid: boolean = true;
  has_presentbsid: number = 1;
  p = 1;
  tourgid: number;
  ccid: any;
  bsid: any;
  percentage: number;
  amount: number;
  onbehalf_empName: any;
  isonbehalf = false;
  pageSize = 10;
  pdfshow: boolean = false;
  imgshow: boolean = false;
  filesrc: any;

  @ViewChild('assetid') matassetidauto: any;
  resoncomment: any;
  remarks: any;
  applevel: number;
  isLoading: boolean;
  apichanges: boolean = true;
  branchid: any;
  onbehalfid: Number = 0;
  status_id: any;
  approvedbyid: any;
  maxapplevel: any;
  itemdisable: boolean = false;
  payload: any;
  advancelist: any;
  approvedamt: number;
  eligibleamt: number;
  claimedamt: Number;
  sumadvance: number = 0;
  netpay: number = 0;
  admamount: Number = 0;
  sumofficial: Number = 0;
  sumpersonal: Number = 0;
  sumtotal: Number = 0;
  // admamountper: Number = 0;
  invoiceid: any;
  token: any;
  daterelax: number;
  tournotend: boolean = false;
  currentDate: any = new Date();
  apvl: boolean = false;
  empbrid: boolean = false;
  formdata: any;
  mainind = 0;
  trexp = 'Cab, Bus, Train, Air'
  ldexp = 'Lodging, Homestay, Client-Entertainment'
  lcexp = 'Cab, Auto, Personal Car, Personal Scooter'
  ddexp = 'Food Allowance, Medical Expenses'
  asexp = 'Laundry, Others'
  showadmin: boolean = false;

  // tourmodel.comments || !tourmodel.expencetype=any
  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private http: HttpClient, private taservice: TaService, private notification: NotificationService, private shareservice: ShareService,
    private router: Router, public sharedService: SharedService, private SpinnerService: NgxSpinnerService, private taService: TaService) { }

  ngOnInit(): void {


    let data = this.shareservice.expensesummaryData.value;

    const expense_summary = JSON.parse(localStorage.getItem('expense_details'))
    this.daterelax = expense_summary.date_relaxation;
    const getempdetails = JSON.parse(localStorage.getItem("sessionData"))
    console.log("expense_summary", expense_summary)
    console.log("data", data)
    if (expense_summary.onbehalfof == getempdetails.name ) {
      this.isonbehalf = true;
      this.onbehalf_empName = '(' + expense_summary.employee_code + ') ' + expense_summary.employee_name
      this.onbehalfid = expense_summary.empgid;
      console.log("onbehalf_empName", this.onbehalf_empName)
    } else {
      this.isonbehalf = false;
    }

    this.advance_statusid = expense_summary.advance_status_id
    this.reason = expense_summary['reason']
    this.id = expense_summary['id']
    this.status_id = expense_summary.claim_status_id
    this.maxapplevel = expense_summary.max_applevel
    //  const expense_summary = JSON.parse(localStorage.getItem("tour_details"));




    this.expenceform = this.formBuilder.group({
      tourgid: this.id,
      expentype: null,
      comments: null,
      appcomment: null,
      empbranchid: null,
      approvedby: null,
      approval: null,
      ccbs: new FormArray([this.createccbs()
      ])
    })


    console.log("id", this.id)
    console.log("reason", this.reason)
    this.tourmodell = {
      requestno: this.id,
      expencetypee: "",
      comments: "",
      bank: "",
      approval: "",
      remarks: ""
    }

    this.exp = this.tourmodell.expencetype;
    this.comm = this.tourmodell.comments;
    console.log("bbb", this.comm)
    this.comentscl();
    this.claimsummary();
    this.getbusinesssegmentValue();
    this.getbranchValue();
    this.tourrr = this.tourmodell
    console.log("saiii", this.tourrr)


    this.shareservice.dropdownvalue.next(data)

    this.expenceform.get('expentype').valueChanges.subscribe(x => {
      this.tourmodell.expencetypee = x
    })

    this.expenceform.get('comments').valueChanges.subscribe(x => {
      this.tourmodell.comments = x
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
          switchMap(value => this.taservice.setemployeeValues(value ? value : '', this.branchid, '', this.id))
        )
        .subscribe((results: any[]) => {
          let datas = results;
          this.employeelist = datas;
          console.log("Employee List", this.employeelist)
        });



    }

    //  this.getadvanceapprovesumm();
    this.getadvanceapprovesumm();

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
      this.isDisabled = false;
    }

  }
  createccbs() {
    let group = this.formBuilder.group({
      id: 0,
      bsid: null,
      ccid: '',
      amount: null,
      tourgid: this.id,
      percentage: null,
    });
    return group;
  }

  claimsummary() {
    this.SpinnerService.show()
    this.taservice.getexpenseTypeValue()
      .subscribe(result => {
        this.SpinnerService.hide()
        this.getclaimrequestsumm();
        const expense_summary = JSON.parse(localStorage.getItem('expense_details'))
        var reason_check = expense_summary.reason_id;
        this.expencetypeList = result['data']
        if (reason_check == '11' || reason_check == 11) {
          this.expencetypeList = [this.expencetypeList[2],this.expencetypeList[4]]
        }
        else {
          // this.expencetypeList.splice(7)
        }
      })
  }

  checkind(ind, event) {
    let present = this.expenceform.value.ccbs[ind].bsid
    if (present) {
      var formvalue = this.expenceform.value.ccbs[ind].bsid.name
    }
    else {
      var formvalue = null
    }

    let value = event.target.value
    if (value != formvalue) {
      this.taservice.getbusinesssegmentValue(value, 1)
        .subscribe(result => {
          this.bisinesslist = result['data']
        })
    }

    else {
      this.getbusinesssegmentValue()
    }

  }

  checkccind(ind, event) {
    let present = this.expenceform.value.ccbs[ind].ccid
    if (present) {
      var formvalue = this.expenceform.value.ccbs[ind].ccid.name
    }
    else {
      var formvalue = null
    }
    let value = event.target.value
    if (value != formvalue) {
      this.taservice.getcostcenterValue(value, this.expenceform.value.ccbs[ind].bsid.id)
        .subscribe(result => {
          this.costlist = result['data']
        })
    }

    else {
      this.taservice.getcostcenterValue('', this.expenceform.value.ccbs[ind].bsid.id)
        .subscribe(result => {
          this.costlist = result['data']
        })
    }
  }

  ccbsreadonly(status) {
    if (status.value.ccbs_edit_status == 0 || this.applevel == 1) {
      return true;
    }
    else {
      return false;
    }
  }

  addccbs() {


    if (this.amt == null || this.amt == 0) {
      this.notification.showError("Amount Can't be ZERO (0)")
      return false
    }

    var sum_percent: number = 0;
    let percentlist = (this.expenceform.get('ccbs') as FormArray).value
    percentlist.forEach(element => {
      if (element.ccbs_edit_status != 0 || element.ccbs_edit_status == 1 || element.ccbs_edit_status == null) {
        sum_percent = sum_percent + parseFloat(element.percentage);
      }
    });
    if (sum_percent < 100 && this.amt != null) {
      const datas = this.expenceform.get('ccbs') as FormArray;
      datas.push(this.createccbs())
    }
    else {
      this.notification.showError("Check CCBS Percentage or Amount...")
    }
  }
  getbranchValue() {
    this.taservice.getbranchvalues(this.page)
      .subscribe(result => {
        this.branchlist = result['data']
        let datapagination = result["pagination"];


        if (this.branchlist.length > 0) {
          this.has_nextemp = datapagination.has_next;
          this.has_previousemp = datapagination.has_previous;
          this.has_presentemp = datapagination.index;
        }
      })

  }
  getbusinesssegmentValue() {
    this.taservice.getbusinesssegmentValue('', 1)
      .subscribe(result => {
        this.bisinesslist = result['data']
        console.log("bisinesslist", this.bisinesslist)
      })
  }
  getBS(id, ind) {
    this.bs = id
    const myForm = (<FormArray>this.expenceform.get("ccbs")).at(ind);
    myForm.patchValue({
      ccid: undefined
    });

    this.getcostcenterValue()
  }
  getcostcenterValue() {
    this.taservice.getcostcenterValue('', this.bs)
      .subscribe(result => {
        this.costlist = result['data']
        console.log("costlist", this.costlist)
      })
  }
  brclear() {
    let myform = this.expenceform
    myform.patchValue({
      "empbranchid": null,
      "approval": null
    })
    this.empbrid = false;
    this.apvl = false;

  }

  brchange() {

    this.empbrid = true;
  }

  empchange() {

    this.apvl = true;
  }
  empclear() {
    this.expenceform.patchValue({
      approval: null
    })

    this.apvl = false;
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 62 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || k== 33 || (k >= 44 && k <= 58));
  }

  remarksupdate(value) {
    this.remarks = value.target.value;
  }
  submitccbs() {
    let sum_percent: number = 0;
    let amount: number = 0;
    let percentlist = (this.expenceform.get('ccbs') as FormArray).value
    percentlist.forEach(element => {
      if (element.percentage < 0.1) {
        this.notification.showError("Percentage Can't be Zero")
        throw new Error
      }
      if (element.ccid == null || element.bsid == null) {
        this.notification.showError("Please select CCBS")
        throw new Error
      }
      sum_percent = sum_percent + Number(element.percentage)
      amount = amount + Number(element.amount)
    });
    if (sum_percent == 100 && this.claimedamt == amount && amount != 0) {
      this.closebutton.nativeElement.click();
      this.notification.showSuccess("CCBS Added Successfully....")
    }
    else {
      this.notification.showError("Invalid data...")
      return false;
    }
  }
  displayFn(subject) {
    return subject ? "(" + subject.code + ")" + subject.full_name : undefined;
  }
  csview(subject) {
    return subject ? subject.name : undefined;
  }
  bsview(subject) {
    return subject ? subject.name : undefined;
  }
  reson(event) {
    this.resoncomment = event.target.value;
  }
  percen_calc(event, ind) {
    let value = (Number(event.target.value) / this.amt) * 100;
    console.log(event.target.value, this.amt)

    if (value > 0) {
      const myForm = (<FormArray>this.expenceform.get('ccbs')).at(ind);
      myForm.patchValue({
        percentage: value
      });
    }
    else {
      const myForm = (<FormArray>this.expenceform.get('ccbs')).at(ind);
      myForm.patchValue({
        percentage: null
      });
    }
  }

  amount_calc(event, ind) {

    var value = (Number(event.target.value) / 100) * this.amt;
    if (value > 0) {
      const myForm = (<FormArray>this.expenceform.get('ccbs')).at(ind);
      myForm.patchValue({
        amount: value
      });
    }
    else {
      const myForm = (<FormArray>this.expenceform.get('ccbs')).at(ind);
      myForm.patchValue({
        amount: null
      });
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

  getadvanceapprovesumm(pageNumber = 1, pageSize = 10) {
    this.taservice.getapproveflowalllist(this.id)
      .subscribe(result => {
        console.log("Tourmaker123", result)
        let datas = result['approve'];


        this.getAdvanceapproveList = datas;
        this.approvedbyid = datas[datas.length - 1].id
        var file_valid = datas[datas.length - 1].status;
        if (file_valid > 1) {
          this.showcreatefile = false
          this.showcreatecount = false
          this.showeditfile = true
          this.showeditcount = true
        }
        else {
          this.showcreatefile = true
          this.showeditfile = false
          this.showeditcount = false
        }

      })
  }
  onFileSelected(evt: any) {
    const file = evt.target.files;

    for (var i = 0; i < file.length; i++) {
      if (this.file_length == 0) {
        this.list = new DataTransfer();
        this.list.items.add(file[i]);
        console.log("FIELS", file)
      }
      else {
        this.list.items.add(file[i]);
      }
      if (file[i]) {
        let stringValue = file[i].name.split('.')
        this.fileextension = stringValue.pop()
        const reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file[i]);
        this.file_length = this.file_length + 1;
      }

    }

    let myfilelist = this.list.files
    evt.target.files = myfilelist
    this.images = evt.target.files;
    console.log("this.images", this.images)
    this.totalcount = evt.target.files.length;
    this.fileData = evt.target.files
    console.log("fdddd", this.fileData)
    this.pdfimgview = this.fileData[0].name
    console.log("pdffff", this.pdfimgview)

  }

  filetype_check(i: string | number) {
    let stringValue = this.images[i].name.split('.')
    this.fileextension = stringValue.pop();
    if (this.file_ext.includes(this.fileextension)) {
      var msg = 1;
    }
    else {
      var msg = 0;
    }
    return msg


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
  removeSection1(index, ccbs) {
    (<FormArray>this.expenceform.get('ccbs')).removeAt(index);
  }

  handleReaderLoaded(e) {
    var conversion = btoa(e.target.result)
    this.file_ext = ['jpg', 'png', 'JPG', 'JPEG', 'jpeg', 'image']
    if (this.file_ext.includes(this.fileextension)) {
      this.base64textString.push('data:image/png;base64,' + conversion);

    }
    else {
      this.base64textString.push('data:application/pdf;base64,' + conversion);

    }
  }
  deleteUpload(i) {
    this.base64textString.splice(i, 1);
    this.list.items.remove(i);
    console.log("filedata", this.list.files);
    this.totalcount = this.list.items.length;
    if (this.totalcount === 0) {
      (<HTMLInputElement>document.getElementById("uploadFile")).value = null;
    }
    else {
      (<HTMLInputElement>document.getElementById("uploadFile")).files = this.list.files;
    }
  }
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  getimages() {
    this.taservice.getfetchimages(this.tourid)
      .subscribe((results) => {
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

  getcall() {
    // this.taservice.getfetchimages1(this.fileid)
    //   .subscribe((results) => {
    //     console.log("results", results)
    //   })
  }

  expfileupload(evt) {
    let data = {
      "tour_id": this.expenceform.value.tourgid,
      "ref_type": 2,
      "requirement_type": this.expid
    }
    evt.target.files = this.list.files;
    this.fileData = evt.target.files;
    console.log(data)
    this.taservice.expfileupload(this.fileData, data)
      .subscribe((results) => {
        if (results.status == 'success') {
          this.notification.showSuccess("File Uploaded Successfully")
          this.closefilepopup.nativeElement.click()
        }
        else {
          this.notification.showError(results.description)
        }
      })
  }


  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    }
  }
  getexpenseValue(reason) {
    // this.taservice.getexpenseTypeValue()
    //   .subscribe(result => {
    //     this.expencetypeList = result['data']
    //     if (reason == '11' || reason == 11) {
    //       this.expencetypeList = [this.expencetypeList[7]]
    //     }
    //     else {
    //       this.expencetypeList.splice(7)
    //     }
    //     console.log("expense", this.expencetypeList)
    //   })

  }
  datas: any
  addForm() {
    let result = this.tourrr;
    if (result.expencetypee && result.comments != '') {
      let re = {
        "requestno": result.requestno,
        "expenseid": result.expencetypee,
        "requestercomment": result.comments,
        "eligibleamount": 0.00,
        "claimedamount": 0.00
      }

      this.getclaimrequest.push(re);

      //  const upexp = this.expencetypeList.filter(function(record){ return record.id == result.expencetypee;});
      const exp_list = this.expencetypeList.filter(function (record) { return record.id !== result.expencetypee; });
      this.expencetypeList = exp_list;

      this.datas = re
      let data = this.shareservice.dropdownvalue.next(this.datas)
      console.log("data", data)
      this.resetclick();
    }
    else {
      if (result.expencetypee == "") {
        this.notification.showError("Please Select expense Type")
      }
      else if (result.comments == "") {
        this.notification.showError('Please Enter Comment')
      }
      return false;
    }


  }

  resetclick() {
    this.tourmodell.expencetypee = '';
    this.tourmodell.comments = '';
    this.expenceform.controls['expentype'].reset()
    this.expenceform.controls['comments'].reset()
    // this.expenceform.reset();
    // this.expenceform.value.tourno=this.tourid;
  }
  

  expensedelete(getclaim, i) {
    console.log('getclaimvalues', getclaim)
    let tourid = getclaim.tourid
    let expenseid = getclaim.expenseid

    this.getclaimrequest.splice(i, 1)
    if (getclaim.id) {
      this.taservice.expensedeleteSummary(tourid, expenseid)
        .subscribe(res => {
          if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
            this.notification.showWarning("Duplicate! Code Or Name ...")

          }
          else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
            this.notification.showError("INVALID_DATA!!...")

          }
          else if (res.status == 'Successfully Deleted') {

            this.notification.showSuccess("Deleted Successfully.....")
            console.log("res", res)
            this.claimsummary()
            return true;
          }
          else {
            this.notification.showError(res.description)
          }
        }
        )
    }
    else {
      this.claimsummary()
    }

    // this.expencetypeList.push(this.upexp2[this.expenceid - 1]);
  }
  expenseadddelete(index: number) {


  }
  back() {
    this.onCancel.emit()
    if (this.status_id) {
      this.data = 1
    }
    else {
      this.data = 0
    }
    this.shareservice.TourMakerEditId.next(this.data)
    this.sharedService.summaryData.next(this.data)
    this.router.navigateByUrl('ta/ta_summary');
  }

  getclaimrequestsumm() {

    this.taService.getclaimrequestsummary(this.id)
      .subscribe(result => {
        let datas = result['data'];
        this.showadminper = false;
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

        

        if (!result.is_tour_ended) {
          this.notification.showWarning('Travel expense can be submitted after the travel ended')
          this.tournotend = true;
        }
        this.approvedamt = result.approved_amount
        console.log(this.approvedamt);
        this.eligibleamt = result.eligible_amount
        this.claimedamt = result.claimed_amount
        if (this.claimedamt >= 25000) {
          this.notification.showInfo("This expense will be additionally routed for your Functional Head's approval, as it is above ₹25,000.00.")
        }
        this.amt = this.claimedamt
        console.log('daaaatas', datas)
        for (var i = 0; i < datas.length; i++) {
          var expenseid = datas[i].expenseid
          const exp_list = this.expencetypeList.filter(function (record) {
            return record.id !== expenseid;
          });
          this.expencetypeList = exp_list;
          console.log("EXP", this.expencetypeList)
        }
        if (this.status_id != -1 && this.status_id != 1) {
          const myform = this.expenceform
          this.remarks = result.maker_comment;
          myform.patchValue({
            "appcomment": result.maker_comment
          })
        }
        this.showattachment = true
        if (datas[0].id != null) {
          this.getclaimrequest = datas
          this.invoiceid = datas[0].invoiceheadergid
          this.crnno = datas[0].crn_no
          // console.log('this.getclaimrequest', this.getclaimrequest)
        }
        else {
          this.getclaimrequest = []
        }
        // console.log("Claim Request......", this.getclaimrequest)
        for (var i = 0; i < this.getclaimrequest.length; i++) {
          this.tourid = this.getclaimrequest[i].tourid;
          this.expenceid = this.getclaimrequest[i].expenseid;
          // console.log("Claim Request......", this.expenceid)
        }

        this.taservice.getclaimccbsEditview(this.id).subscribe(result => {
          const length = result.length
          const myform = (this.expenceform.get('ccbs') as FormArray)
          for (var i = 1; i < length; i++) {
            myform.push(this.createccbs())

          }
          result.forEach(element => {
            element.ccid = element.cc_data;
            element.bsid = element.bs_data;
          });
          const ccbsform = this.expenceform
          ccbsform.patchValue({
            ccbs: result
          })
          if (length > 0) {
            if (this.status_id != -1 && this.status_id != 5) {
              (this.expenceform.get('ccbs') as FormArray).disable()
              this.itemdisable = true;
            }
          }
        })
        if (this.approvedamt < this.sumadvance) {
          this.netpay = Number(this.sumadvance) - this.approvedamt
        }
        else {
          this.netpay = Number(this.approvedamt) - this.sumadvance
        }

      })

  }

  paymentstatus() {

  }
  getTotal(marks) {
    // console.log('marks',marks)
    let total = 0;

    // marks.forEach((item) => {
    //   total += Number(item.eligibleamount);
    // });
    for (let i = 0; i < marks.length; i++) {
      total = total + Number(marks[i].eligibleamount)
    }
    // total=total+Number(marks.eligibleamount)
    // total = this.formatPipe.transform(total);
    // console.log('total',total)

    return total;
  }
  pdfdownload() {
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      this.token = tokenValue.token
    }
    this.taservice.getadvpdf(this.invoiceid).subscribe(data => {

      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = this.crnno+ ".pdf";
      link.click();
      // var file = new Blob([results], { type: 'application/pdf' })
      // var fileURL = window.URL.createObjectURL(file);

      // // window.open(fileURL); 
      // var a = document.createElement('a');
      // a.href = fileURL;
      // a.download = 'claim.pdf';
      // document.body.appendChild(a);
      // a.click();
    }, (error) => {
      console.log('getPDF error: ', error.error.text);
    })
  }
  getTotall(marks) {
    this.total1 = 0;
    marks.forEach((item) => {
      this.total1 += Number(item.claimedamount);
    });
    // total1 = this.formatPipe.transform(total1);

    return this.total1;


  }
  skiprm() {
    this.taservice.skiprmapproval(this.expenceform.value.tourgid).subscribe(res => {
      if (res.status == 'success') {
        this.notification.showSuccess(res.message || res.description);
      }
      else {
        this.notification.showError(res.description)
      }
    })
  }

  updatesubmit() {
    let data = this.expenceform.value
    let payload = {
      "id": this.approvedbyid,
      "tour_id": this.id,
      "approver": data.approval.id,
      "comment": this.remarks
    }
    this.SpinnerService.show()
    this.taservice.claimapproveupdate(payload).subscribe(results => {
      if (results.status == "success") {
        this.SpinnerService.hide();
        this.notification.showSuccess("Updated successfully")
        this.onCancel.emit()
        this.data = { index: 5 }
        this.shareservice.radiovalue.next('1')
        this.sharedService.summaryData.next(this.data)
        this.router.navigateByUrl('ta/expense-summary');
      }
      else {
        this.SpinnerService.hide();
        this.notification.showError(results.description)
      }

    })
  }

  expenseEdit(data) {
    this.data = data
    console.log("dd", this.data)
    var datas = JSON.stringify(Object.assign({}, data))
    localStorage.setItem("expense_edit", datas)

    this.shareservice.id.next(this.id)
    this.shareservice.expenseedit.next(this.data)
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

  submitdisable() {
    let data = this.expenceform.value
    if (data.approval == null) {
      return true
    }
    if (data.appcomment == null || data.appcomment == '') {
      return true;
    }
    else {
      return false
    }
  }
  fileview(ind) {
    this.filesrc = this.base64textString[ind]
    console.log(this.filesrc)
    let msg = this.filetype_check(ind);
    if (msg == 1) {
      this.pdfshow = false;
      this.imgshow = true;
    }
    else {
      this.pdfshow = true;
      this.imgshow = false
    }
  }
  clearfile(evt) {
    this.base64textString = [];
    // this.list.items.remove(1);    
    this.list = evt.target.files;
    this.file_length = 0;
    (<HTMLInputElement>document.getElementById("uploadFile")).value = null;
  }

  exptip(name) {
    switch (String(name)) {
      case 'Travelling Expenses':
        return this.trexp
      case 'Lodging':
        return this.ldexp
      case 'Associated Expense':
        return this.asexp
      case 'Daily Reimbursement':
        return this.ddexp
      case 'Local Conveyance':
        return this.lcexp
      default:
        return 'Error'
    }
  }

  fileeditview(ind) {
    this.filesrc = null;
    let value = this.attachmentlist[ind]
    let fileid = value.id;
    let option = 'view'
    let msg = this.filetype_check2(ind);
    // this.commentPopup(value.id, value.file_name)
    this.taservice.viewfile(fileid, option, value).subscribe(results => {
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
  submitForm() {
    this.formdata = this.expenceform.value
    let ccbsdata = [...this.formdata.ccbs];
    let sum_percent: number = 0;
    let amount: number = 0;
    ccbsdata.forEach(element => {
      if (element.id == 0) {
        delete element.id;
      }
      if (element.percentage < 0.1) {
        this.notification.showError("Percentage Can't be Zero")
        throw new Error
      }
      if (element.ccid == null || element.bsid == null) {
        this.notification.showError("Please select CCBS")
        throw new Error
      }
      element.ccid = element.ccid.id;
      element.bsid = element.bsid.id;
      element.percentage = Number(element.percentage)
      sum_percent = sum_percent + Number(element.percentage)
      element.amount = Number(element.amount)
      amount = amount + Number(element.amount)
    });

    if (sum_percent != 100) {
      this.notification.showError("Check CCBS Percentage")
      return false;
    }
    if (this.claimedamt != amount) {
      this.notification.showError("Check CCBS Amount")
      return false
    }

    if (this.isonbehalf) {
      this.payload = {
        "tourgid": this.formdata.tourgid,
        // "approvedby": '-1',
        "appcomment": this.formdata.appcomment,
        "ccbs": ccbsdata,
        "onbehalfof": this.onbehalfid
      }
    }
    else {
      this.payload = {
        "tourgid": this.formdata.tourgid,
        // "approvedby": '-1',
        "appcomment": this.formdata.appcomment,
        "ccbs": ccbsdata
      }
    }

    console.log("Expense summary", this.payload)
    this.SpinnerService.show()
    this.taservice.expenseAdd(this.payload)
      .subscribe(res => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.SpinnerService.hide()
          this.notification.showWarning("Duplicate! Code Or Name ...")
        }
        else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.SpinnerService.hide()
          this.notification.showError("INVALID_DATA!...")
        }
        else if (res.status === "SUCCESS" || res.status == "success") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Claim Created Successfully....")
          if (this.status_id) {
            this.data = 1
          }
          else {
            this.data = 0
          }
          this.shareservice.TourMakerEditId.next(this.data)
          this.sharedService.summaryData.next(this.data)
          this.router.navigateByUrl('ta/ta_summary');
          console.log("res", res)
          this.onSubmit.emit();
          return true
        }
        else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)

        }
      }
      )
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


  fileDelete(id, ind) {
    this.attachmentlist.splice(ind, 1)
    this.SpinnerService.show()
    this.taservice.fileDelete(id)
      .subscribe((res) => {
        this.SpinnerService.hide()
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
      console.log(this.filesrc)
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
  numberOnly(event) {
    return (event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46)
  }

  bsidget() {
    setTimeout(() => {
      if (this.matbssidauto && this.autocompletetrigger && this.matbssidauto.panel) {
        fromEvent(this.matbssidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.matbssidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.matbssidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.matbssidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.matbssidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextbsid) {
              this.taservice.getbusinesssegmentValue(this.bsssid.nativeElement.value, this.has_presentbsid + 1).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.bisinesslist)
                let pagination = data['pagination'];
                this.bisinesslist = this.bisinesslist.concat(dts);

                if (this.bisinesslist.length > 0) {
                  this.has_nextbsid = pagination.has_next;
                  this.has_presentbsid = pagination.has_previous;
                  this.has_presentbsid = pagination.index;

                }
              })
            }
          }
        })
      }
    })

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



}
