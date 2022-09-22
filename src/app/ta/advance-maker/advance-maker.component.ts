import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { isBoolean } from 'util';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import { TaService } from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import { ActivatedRoute, Router } from "@angular/router";
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ShareService } from 'src/app/ta/share.service';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { E, I } from '@angular/cdk/keycodes';
import { NgxSpinnerService } from "ngx-spinner";
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { resourceLimits } from 'worker_threads';
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
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'app-advance-maker',
  templateUrl: './advance-maker.component.html',
  styleUrls: ['./advance-maker.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class AdvanceMakerComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() lineChanges = new EventEmitter<any>();
  @ViewChild('closebutton') closebutton;
  @ViewChild('assetid') matassetidauto: MatAutocomplete;
  @ViewChild('bssid') matbssidauto: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger
  @ViewChild('inputassetid') inputasset: any;
  @ViewChild('ccid') cccid: any;
  @ViewChild('bsid') bsssid: any;

  currentDate: any = new Date();
  // date = new Date().toLocaleDateString();
  defaultDate = new FormControl(new Date());
  today = new Date();
  date = new Date();
  latest: any
  currentpage: number = 1;
  pagesize = 10;
  overall: any
  isDisabled: boolean;
  days: any
  tourmodel: any
  values = [];
  tourdata = [];
  stratdate: Date;
  enddate: Date;
  endatetemp: Date
  startdatetemp: Date
  starttdate: any
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  totall:number;
  select:any;
  selectto:any;
  showccbs:boolean;
  request:any
  isSumbitbtn:boolean
  isAdvancebtn:boolean
  total:any;
  submitbtn:boolean=true
  a:any
  data:any
  reasonlist:Array<any>
  showme:boolean=false;
  tourr:any
  isnew:boolean
  istaapprove:any
  tourmodell:any
  touremodel:any
  employeelist:Array<any>
  listBranch:Array<any>
  branchlist:Array<any>
  bisinesslist:Array<any>
  costlist:Array<any>
  dataa:any
  datas:any
  advancelist:any
  re:any
  strat:any
  end:any
  has_next = true;
  has_previous = true;
  linesChange: any
  subTotal: any
  closeResult: string;
  isLoading = false;
  @ViewChild('approveremp') matappAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('employeeApproverInput') employeeApproverInput: any;
  approvedby: any;
  totalccbs: any;
  ccbstotal: any;
  ccbsamt: any;
  amtsum: any;
  ccbsper: any;
  persum: any;
  bs: any;
  tour: any[];
  advanceform: FormGroup
  has_nextid: boolean = true;
  has_presentid: number = 1;
  has_nextbsid: boolean = true;
  has_presentbsid: number = 1;
  branchid: any;
  subject: any;
  approvelevel: boolean = false;
  currentind: any;
  sp_percentage: any;
  remarks: any;
  tourid: any;
  getAdvanceapproveList: any;
  alreadymaked: any;
  ccbsresult: any;
  backrequest: boolean;
  colorapply: boolean;
  requestno: any;
  reason: any;
  startdate: any;
  enddatee: any;
  requestdate: any;
  employee_code: any;
  imageUrl = environment.apiURL;
  empgrade: any;
  empdesignation: any;
  employee_name: any;
  applevel: number;
  approver: boolean = false;
  data_final: any;
  advanceid: any;
  amtenable: boolean = false;
  updatingamt: number;
  advanceamtid: any;
  approvesum: number = 0;
  showapproveddiv: boolean;
  showrejectdiv: boolean;
  showreturndiv: boolean;
  show_approvediv: boolean = false;
  show_rejectdiv: boolean = false;
  show_returndiv: boolean = false;
  resoncomment: any;
  ccbsdeletearray: Array<any> = [];
  appflow: boolean = true;
  ischanged: boolean = false;
  pageSize = 10;
  p = 1;
  apichanges: boolean = true;
  lastcomment: any = null;
  mainccbs: any;
  onbehalfname: any;
  onbehalfid: any;
  onbehalfenable: boolean = false;
  success: boolean = true;
  ishidden: boolean=false
  advancecancel: any
  approval: any;
  cmt: any;
  show_cancelbtn:boolean=false
  tourcanid: any;
  remarksbtn:boolean=true
  token: any;
  requestamt: number = 0;
  app: any;
  addbtn: boolean=true;
 

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private datePipe: DatePipe, private http: HttpClient,
    private notification: NotificationService, private taservice: TaService,
    public sharedService: SharedService, private route: Router, private activatedroute: ActivatedRoute, private SpinnerService: NgxSpinnerService,
    private shareservice: ShareService) { }



  ngOnInit(): void {
    const advance_summary = JSON.parse(localStorage.getItem('advancemakersummary'))
    this.employee_name = advance_summary.employee_name
    this.employee_code = advance_summary.employee_code
    this.empgrade = advance_summary.empgrade
    this.empdesignation = advance_summary.empdesignation
    this.reason = advance_summary.reason
    this.startdate = this.datePipe.transform(advance_summary.startdate, 'yyyy-MM-dd');
    this.requestdate = this.datePipe.transform(advance_summary.requestdate, 'yyyy-MM-dd');
    this.enddatee = this.datePipe.transform(advance_summary.enddate, 'yyyy-MM-dd');

    const onbehalf = JSON.parse(localStorage.getItem('onbehalf'))
    if (advance_summary.onbehalfof) {
      this.onbehalfenable = true;
      this.onbehalfname = onbehalf.onbename;
      this.onbehalfid = onbehalf.onbeid
      this.app=onbehalf.app
    }
    if(advance_summary['apptype']=="AdvanceCancel"){
      this.show_cancelbtn = true
      this.dataa= advance_summary.tourid
      this.tourcanid= advance_summary.id
      this.ishidden = false;
      this.onbehalfenable=false
      this.appflow=true
      this.submitbtn = false
      this.remarksbtn=false
    }
    
    // if(advance_summary['tour_approvedby']){
    //   this.dataa= advance_summary.tourid
    //   this.ishidden = true;
    //   this.submitbtn=false;
    //   this.getadvancecancel();
    // }
    
 
    if (advance_summary.advance_status == "PENDING") {
      this.dataa = advance_summary.tourgid;
    }
    else {
      this.dataa = advance_summary.tourgid;
      this.isAdvancebtn = true;
    }
    if (advance_summary.applevel == undefined) {
      console.log("this is maker")
    }
    else {
      console.log("this is approver")
      this.dataa = advance_summary.tourid;
      this.onbehalfenable = false;
      var approval = true;
      this.tourid = this.dataa;
      this.applevel = 1;
      this.show_approvediv = true;
      this.apichanges = false;
    }
    if (this.applevel == 1) {
      this.getapprovelflowall();
    }
    else {
      this.getadvanceapprovesumm();
    }
    console.log("summary", advance_summary)
    this.getccbssum();
    let data1 = this.shareservice.approveview.value
    this.datas = data1['status']
    console.log("status", this.datas)
    console.log("data1", data1)
    // if(advance_summary['advance_cancel_status']){
    //   this.dataa= advance_summary.id
    //   this.getadvancecancel();
    //   this.iscancel=false
    // }
    // if (data['id'] != 0){
    
      if(advance_summary['type']=="AdvanceCancel"){
        this.addbtn=false
         this.dataa= advance_summary.id
         this.ishidden = true;
         this.submitbtn=false
         this.appflow=true
       this.getadvancecancel();
  
  
       }
      this.taservice.getadvanceEditsummary(this.dataa)
      .subscribe((result: any[]) => {
        this.requestno = this.dataa
        this.reason = result['reason']
        this.startdate = this.datePipe.transform(result['startdate'], 'yyyy-MM-dd');
       
        this.enddatee = this.datePipe.transform(result['enddate'], 'yyyy-MM-dd');
        this.alreadymaked = result['detail'];
        if (result['detail'].length > 0) {
          this.backrequest = true;
          if (this.applevel == 1) {
            this.backrequest = false;
          }
        }
        if (this.alreadymaked.length != 0) {

          for (var i = 0; i < this.alreadymaked.length; i++) {

            if (i > 0) {
              const data = this.advanceform.get('advance') as FormArray;
              data.push(this.createItem())
            }
            const myform = (this.advanceform.get('advance') as FormArray).at(i)
            if (this.alreadymaked[i].status_name == 'APPROVED') {
              myform.patchValue({ appamount: this.alreadymaked[i].appamount })
            }
            else if (this.alreadymaked[i].status_name == 'PENDING' && advance_summary.advance_status == 'RETURNED') {
              this.advanceamtid = this.alreadymaked[i].id
              myform.patchValue({ appamount: this.alreadymaked[i].appamount })
            }
            else if (this.alreadymaked[i].status_name == 'PENDING') {
              if (this.applevel == 1) {
                this.advanceamtid = this.alreadymaked[i].id
                myform.patchValue({ appamount: this.alreadymaked[i].appamount })
              }
              else {
                myform.patchValue({ appamount: null })
              }
            }
            myform.patchValue({
              "id": this.alreadymaked[i].id,
              "reqamount": this.alreadymaked[i].reqamount,
              "reason": this.alreadymaked[i].reason,
              "approval": this.alreadymaked[i].approver_id,
              "statuss": this.alreadymaked[i].status_name,
              "crnno": this.alreadymaked[i].crnno,
              "invoiceheadergid": this.alreadymaked[i].invoiceheadergid
            });
            this.advanceform.patchValue({ remarks: this.remarks })
          }
          let sumarray = this.advanceform.value.advance
          sumarray.forEach(element => {
            if (element.appamount == null) {
              this.approvesum = Number(this.approvesum) + 0;
            }
            else {
              this.approvesum = this.approvesum + parseFloat(element.appamount)
            }
          });
          for (var i = 0; i < this.ccbsresult.length; i++) {
            const data = this.advanceform.get('ccbss') as FormArray;
            data.push(this.createccbs())
            const datas = this.advanceform.get('ccbs') as FormArray;
            datas.push(this.createccbs())
            const myform = (this.advanceform.get('ccbss') as FormArray).at(i)
            myform.patchValue({
              "id": this.ccbsresult[i].id,
              "bsid": this.ccbsresult[i].bs_data,
              "ccid": this.ccbsresult[i].cc_data,
              "percentage": this.ccbsresult[i].percentage,
              "amount": this.ccbsresult[i].amount,
              "ccbs_edit_status": this.ccbsresult[i].ccbs_edit_status
            })
          }
          let approverdata = result['approver_branch_data']
          if (approverdata == undefined) {
            this.appflow = false;
          }
          var branchdetail = '(' + approverdata.branch_code + ')' + approverdata.branch_name
          this.advanceform.patchValue({ empbranchid: branchdetail })
          if (this.applevel != 1) {
            this.selectBranch(approverdata.branch_id)
          }
          this.advanceform.patchValue({ approval: approverdata })

          let amountlist = (this.advanceform.get('advance') as FormArray).value
          let amount: number = 0;
          amountlist.forEach(element => {
            amount = amount + parseFloat(element.reqamount);
          });

          this.sum = amount
          var length = (this.advanceform.get('advance') as FormArray).length
          var appamount = Number((this.advanceform.get('advance') as FormArray).at(length - 1).value.appamount)
          this.requestamt = appamount;
          this.updatingamt = appamount;
          //  for (let stat in advstatus){
          //    if(stat =='APPROVED' || stat =='RETURNED'){
          //     this.amt = Number((this.advanceform.get('advance') as FormArray).at(length-1).value.appamount)
          //    }
          //    else{
          //      this.amt = 0;
          //    }
          //  }

        }

        else {
          this.amt == 0;
          this.appflow = false;
        }

        console.log("advance summary", result)
      })

    // this.isnew = false;
    // }
    // else{

    // this.advanceform = new FormGroup({
    //   requestno: new FormControl(''),
    //   requestdate: new FormControl(''),
    //   reason: new FormControl(''),
    //   startdate: new FormControl(''),
    //   enddate: new FormControl(''),
    //   advreason: new FormControl(''),
    //   advamount: new FormControl(''),
    //   advstatus: new FormControl(''),
    //   advpdf: new FormControl(''),
    //   bsid: new FormControl(''),
    //   ccid: new FormControl(''),
    //   ccbsamount: new FormControl(''),
    //   ccbspercent: new FormControl(''),
    //   remarks: new FormControl('')

    // })

    // this.isnew = false;
    // }
    // else{


    // }
    this.getccbssum();

    this.getbusinesssegmentValue();



    this.advanceform = this.formBuilder.group({
      advance: new FormArray([
        this.createItem()

      ]
      ),
      ccbss: new FormArray([
      ]),
      approval: new FormControl(''),
      empbranchid: new FormControl(''),
      remarks: new FormControl(''),
      ccbs: new FormArray([])
      // data: new FormArray([]),
    });
    if (this.apichanges) {
      this.advanceform.get('empbranchid').valueChanges
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

      this.advanceform.get('approval').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taservice.setemployeeValue(value, this.branchid, this.onbehalfid))
        )
        .subscribe((results: any[]) => {
          let datas = results;
          this.employeelist = datas;
          console.log("Employee List", this.employeelist)
        });

    }

    if (approval) {
      this.advanceform.disable();
      this.approver = true;
      this.advanceform.controls['advance'].enable();
      this.advanceid = advance_summary.id;
    }
    else {
      this.getbranchValue();
      this.getemployeeValue();
    }
  }


  cancelback(){
    this.route.navigateByUrl('ta/cancelapprove');

}
  getccbssum() {
    this.taservice.getadvanceccbsEditview(this.dataa)
      .subscribe(result => {
        this.ccbsresult = result
        console.log("CCBS DATA", result)
        var amount = 0;
        result.forEach(element => {
          amount = amount + parseFloat(element.amount)
        });
        this.amt = amount
      })
  }
  remarksupdate(value) {
    this.remarks = value.target.value;
  }

  index: any

  datafinal: any
  res: any
  advancee: any

  number(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    else {
      if (event.target.value == '0') {
        return false;
      }
      else {
        return true;
      }
    }
  }
  number2(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    else {
      if (event.target.value == '0') {
        return false;
      }
      else {
        return true;
      }
    }
  }

  checkind(ind) {
    (<FormArray>this.advanceform.get("ccbss")).at(ind).get('bsid').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.getbusinesssegmentValue(value, 1))
      )
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.bisinesslist = datas;
        console.log("Employee List", this.employeelist)
      });
    return true
  }

  checkccind(ind) {
    (<FormArray>this.advanceform.get("ccbss")).at(ind).get('ccid').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.getcostcenterValue(value, this.bs))
      )
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.costlist = datas;
      });
    return true
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
  empidupdate(id){
    this.approval =id
  }
  reson(event) {
    this.resoncomment = event.target.value;

  }
  comment(e){
    this.cmt = e.target.value
  }
  checkdisable(status){
    if(status.value.statuss == 'APPROVED'|| status.value.statuss =='REJECTED'){
      this.colorapply = true;
      return true;
    }
    else {
      return false;
    }
  }
  checkremove(status) {
    if (status.value.statuss != null) {
      return true;
    }
  }

  pdfcheck(dtl){
    console.log(dtl.value.statuss);
    if (dtl.value.statuss == 'APPROVED'){
      return true;
    }
    else{
      return false;
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
  advpdfdownload(invoice) {
    var invoiceid = invoice.value.invoiceheadergid
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      this.token = tokenValue.token
    }
    let url = this.imageUrl + 'taserv/pdf_download/' + invoiceid + '?token=' + this.token
    window.open(url, '_blank')
  }
  createItem() {

    let group = this.formBuilder.group({
      id: 0,
      remarks: new FormControl(''),
      reason: null,
      reqamount: null,
      appamount: null,
      tourgid: this.dataa,
      invoiceheadergid: null,
      approval: null,
      statuss: null,
      crnno: null,
      pdf: null,
      onbehalfof: this.onbehalfid
    });
    return group;
  }

  createccbs() {
    let group = this.formBuilder.group({
      id: 0,
      bsid: null,
      ccid: null,
      amount: null,
      tourgid: this.dataa,
      percentage: null,
      ccbs_edit_status: null
    });
    return group;
  }
  addSection() {
    const data = this.advanceform.get('advance') as FormArray;
    data.push(this.createItem())
    // this.showme=true;
    // this.tourmodel.detail=(this.advance[1])
    // this.isDisabled=true;
    // this.tourmodel.advance=this.tourmodel.detail;
    // let detail=this.tourmodel.detail;
    // console.log("kk",detail)
    // let advance=this.tourmodel;
    // this.tourmodell=advance['bank']
    // console.log("vvvv", this.tourmodell)
    this.isAdvancebtn = true;


  }
  valuecheck() {
    if (this.amt == null || this.amt == 0) {
      return false;
    }
  }
  addccbs() {

    var advlength = this.advanceform.value.advance.length
    var adv = (this.advanceform.get('advance') as FormArray).at(advlength - 1).value.statuss;

    if (adv != null && adv != 'PENDING') {
      return false
    }
    if (this.amt == null || this.amt == 0) {
      this.notification.showError("Amount Can't be ZERO (0)")
      return false
    }

    var sum_percent: number = 0;
    let percentlist = (this.advanceform.get('ccbss') as FormArray).value
    percentlist.forEach(element => {
      if (element.ccbs_edit_status != 0 || element.ccbs_edit_status == 1 || element.ccbs_edit_status == null) {
        sum_percent = sum_percent + parseFloat(element.percentage);
      }
    });
    if (sum_percent < 100 && this.amt != null) {
      const data = this.advanceform.get('ccbss') as FormArray;
      data.push(this.createccbs());
      const datas = this.advanceform.get('ccbs') as FormArray;
      datas.push(this.createccbs())
      this.success = true;
    }
    else {
      this.notification.showError("Check CCBS Percentage or Amount...")
    }
  }

  removeSection(index) {
    (<FormArray>this.advanceform.get('advance')).removeAt(index);
    this.isAdvancebtn = false;
    let amountlist = (this.advanceform.get('advance') as FormArray).value
    let amount: number = 0;
    amountlist.forEach(element => {
      amount = amount + parseFloat(element.reqamount);
    });
    var length = (this.advanceform.get('advance') as FormArray).length
    this.amt = (this.advanceform.get('advance') as FormArray).at(length - 1).value.reqamount;
    this.sum = amount
  }
  removeSection1(index, ccbs) {
    (<FormArray>this.advanceform.get('ccbss')).removeAt(index);
    (<FormArray>this.advanceform.get('ccbs')).removeAt(index);
    this.ccbsdeletearray = this.ccbsdeletearray.concat(ccbs.value.id);
  }


  fieldGlobalIndex(index) {
    let dat = this.pageSize * (this.p - 1) + index;
    return dat
  }
  numberOnly(event) {
    return (event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46)
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
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
  getbusinesssegmentValue() {
    this.taservice.getbusinesssegmentValue('', 1)
      .subscribe(result => {
        this.bisinesslist = result['data']
        console.log("bisinesslist", this.bisinesslist)
      })
  }
  getBS(id, ind) {
    this.bs = id
    const myForm = (<FormArray>this.advanceform.get("ccbs")).at(ind);
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
  // isDisabled(item) : boolean {
  //   return item ;
  //  }

  value: any
  percen_calc(event, ind) {
    this.success = true;
    let value = (event.target.value / this.amt) * 100;
    if (value > 0) {
      const myForm = (<FormArray>this.advanceform.get('ccbss')).at(ind);
      myForm.patchValue({
        percentage: value
      });
    }
  }

  disablecheck(){
    let data =  this.advanceform.value
    if(data.empbranchid == null){

      return true
    }
    if (data.approval == null){
      return true
    }
    if (data.remarks == null || data.remarks == ''){
      return true;
    }
    else{
      return false
    }
  }

  updateapproveamt(event, ind) {
    this.amtenable = true;
    this.updatingamt = Number(event.target.value)
    let formarray = this.advanceform.value.advance;
    this.approvesum = 0;
    formarray.forEach(element => {
      this.approvesum = this.approvesum + parseFloat(element.appamount)
    });
  }

  value1: any
  amount_calc(event, ind) {
    this.success = true;
    var value = (event.target.value / 100) * this.amt;
    if (value > 0) {
      const myForm = (<FormArray>this.advanceform.get('ccbss')).at(ind);
      myForm.patchValue({
        amount: value
      });
    }
  }
  selectBranch(e) {
    console.log("e", e.value)
    let branchvalue = e
    this.branchid = branchvalue
    var value = ''
    this.taservice.setemployeeValue(value, branchvalue, this.onbehalfid)
      .subscribe(results => {
        let datas = results
        this.employeelist = results
        console.log("employee", this.employeelist)
      })
  }

  amt: any
  sum: any
  datasums() {

    let ccbslist = (this.advanceform.get('ccbss') as FormArray).value
    const oldsum = this.sum
    let amountlist = (this.advanceform.get('advance') as FormArray).value
    let amount: number = 0;
    amountlist.forEach(element => {
      amount = amount + parseFloat(element.reqamount);
    });
    var length = (this.advanceform.get('advance') as FormArray).length
    var reqamt = (this.advanceform.get('advance') as FormArray).at(length - 1).value.reqamount;
    this.amt = Math.round(reqamt * 100) / 100
    this.sum = Math.round(amount * 1000) / 1000

    if (this.sum != oldsum) {
      ccbslist.forEach(element => {
        if (element.id == 0 || element.ccbs_edit_status == 1) {
          var index = ccbslist.indexOf(element.statuss);
          (this.advanceform.get('ccbss') as FormArray).removeAt(index + 1);
          (this.advanceform.get('ccbs') as FormArray).removeAt(index + 1);
        }
        if (element.id > 0 && element.ccbs_edit_status != 0) {
          this.ccbsdeletearray = this.ccbsdeletearray.concat(element.id);
        }
      });
    }
    console.log((this.advanceform.get('ccbss') as FormArray).value)
  }
  amtt: any
  summ: any
  // dataasums(){
  //   this.amtt = this.tourmodel.detail.map(x => x.reqamountt);;
  //    console.log('data check amt', this.amtt);
  //     this.summ = this.amtt.reduce((a, b) => a + b, 0);
  //        console.log('sum of total ', this.summ);
  // }
  negcheck(event) {
    if (event.target.value == '0') {
      event.target.value = null;
      return false;
    }
    return event.charCode >= 48
  }
  CancelClick(){
    this.route.navigateByUrl('ta/canceladd');
}
reasonvals(e){
  this.value = e.target.value
 }
 cancelapprove(){
   this.data_final={   
   "id":this.tourcanid,
   "tourgid":this.dataa,
   "apptype":"AdvanceCancel",
   "appcomment":this.value,
   "status":"3",
   }

   this.taservice.approvetourmaker(this.data_final)
  .subscribe(res=>{
    if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
      this.SpinnerService.hide()
      this.notification.showWarning("Duplicate! Code Or Name ...")
    } 
    else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
      this.SpinnerService.hide()
      this.notification.showError("INVALID_DATA!...")
    }
    else if(res.status =='success'){
      this.SpinnerService.hide()
    this.notification.showSuccess("Approved Successfully....")
    this.route.navigateByUrl('ta/cancelapprove')
    console.log("res",res)
    // this.data = {index: 4}
    // this.sharedService.summaryData.next(this.data)
    // this.route.navigateByUrl('ta/tamaster');
    this.onSubmit.emit();
    return true
    }
    else if (res.code === "UNEXPECTED_ERROR" && res.description.MESSAGE){
      this.SpinnerService.hide()
      this.notification.showError(res.description.MESSAGE);
    }
    else{
      this.SpinnerService.hide()
      this.notification.showError(res.description);
    }
  })
 }
 cancelreject() {
   this.data_final={   
     "id":this.tourcanid,
     "tour_id":this.dataa,
     "apptype":"AdvanceCancel",
     "appcomment":this.value,
     }
     this.taservice.rejecttourmaker(this.data_final)
     .subscribe(res=>{
       if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
         this.SpinnerService.hide()
         this.notification.showWarning("Duplicate! Code Or Name ...")
       } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
         this.SpinnerService.hide()
         this.notification.showError("INVALID_DATA!...")
       }
       else if(res.status =='success' || res.status =="SUCCESS"){
         this.SpinnerService.hide()
       this.notification.showSuccess("Rejected Successfully....")
       this.route.navigateByUrl('ta/cancelapprove')
   
       console.log("res",res)
       // this.data = {index: 4}
       // this.sharedService.summaryData.next(this.data)
       // this.route.navigateByUrl('ta/tamaster');
       this.onSubmit.emit();
       return true
       }
       else{
         this.SpinnerService.hide()
         this.notification.showError(res.description)
       }
     })
   }
   
cancel(){
  if (this.onbehalfid==""){
    this.advancecancel={
      "tour_id":this.dataa,
      "appcomment":this.remarks,
      "apptype":"AdvanceCancel",
      "status":"1",
      "approval":this.approval
    }
  }
  else{
  this.advancecancel={
    "tour_id":this.dataa,
    "appcomment":this.remarks,
    "apptype":"AdvanceCancel",
    "status":"1",
    "approval":this.approval,
    "onbehalfof":this.onbehalfid,
  }
}
  this.taservice.advanceCancel(this.advancecancel)
  .subscribe(res=>{
    if (res.status === "success") {
      this.SpinnerService.hide()
      this.notification.showSuccess("Advance Cancelled Successfully....")
      this.onSubmit.emit();
      // this.route.navigateByUrl('ta/ta_approve');
      return true;
    }else {
      this.SpinnerService.hide()
      this.notification.showError(res.description)
      return false;
    }
  })
}
 
  submitccbs() {
    if (this.amt == null || this.amt == 0 || this.amt == '0') {
      this.notification.showError("CCBS Amount Can't be '0'");
      return false;
    }
    var sum_percent: number = 0;
    let percentlist = (this.advanceform.get('ccbss') as FormArray).value
    percentlist.forEach(element => {
      if (element.percentage < 0.1) {
        this.notification.showError("Percentage Can't be Zero")
        this.success = false;
        return false;
      }
      if (element.ccid == null || element.bsid == null) {
        this.notification.showError("Please select CCBS")
        this.success = false;
        return false;
      }
      if (element.ccbs_edit_status == 1 || element.ccbs_edit_status == null) {
        sum_percent = sum_percent + parseFloat(element.percentage);
      }
    });
    if (this.success) {

      if (sum_percent == 100) {
        this.closebutton.nativeElement.click();
        this.notification.showSuccess("CCBS Added Successfully....")
      }
      else {
        this.notification.showError("Check CCBS percentage")
        return false;
      }
    }
    else {
      this.notification.showError("Invalid data...")
      return false;
    }
  }

getadvancecancel(){
  this.taservice.getadvancecancelflowlist(this.dataa)
  .subscribe(result => {
  console.log("Tourmaker", result)
  this.getAdvanceapproveList = result['approve'];
  })
}

  getapprovelflowall() {
    this.taservice.getapproveflowalllist(this.dataa)
      .subscribe(result => {
        console.log("Tourmaker", result)
        let datas = result['approve'];
        const advstatuslist = [1, 2, 5]
        const advstatus = result['approve']
        if (advstatuslist.includes(result['advance_status_id']) || advstatuslist.includes(advstatus[advstatus.length - 1].status)) {
          this.isAdvancebtn = true;
        }
        else if (this.isAdvancebtn) {
          this.isAdvancebtn = false;
        }
        this.isAdvancebtn = true;

        let comments = result['approve']
        comments = comments.filter(function (record) {
          return record.apptype == 'ADVANCE CREATION';
        })
        var applength = comments.length;
        var comment = comments[applength - 2].comment;
        var status = comments[applength - 1].status;
        if (status != 2) {
          this.ischanged = true;
          this.advanceform.disable();
        }
        if (comments[applength - 1].status != 2 && comments[applength - 1].apptype == "ADVANCE CREATION") {
          this.lastcomment = comments[applength - 1].comment;
        }
        this.remarks = comment;
        this.getAdvanceapproveList = datas;

      })
  }

  getadvanceapprovesumm(pageNumber = 1, pageSize = 10) {
    this.taservice.getadvanceEditview(this.dataa)
      .subscribe(result => {
        console.log("Tourmaker", result)
        let datas = result['approve'];
        const advstatuslist = [1, 2, 5]
        const advstatus = result['approve']
        if (advstatuslist.includes(result['advance_status_id']) || advstatuslist.includes(advstatus[advstatus.length - 1].status)) {
          this.isAdvancebtn = true;
        }
        else if (this.isAdvancebtn) {
          this.isAdvancebtn = false;
        }

        var applength = result['approve'].length;
        let comments = result['approve']
        var comment = comments[applength - 2].comment
        this.remarks = comment;
        this.getAdvanceapproveList = datas;

      })
  }
  // percentage_matched(i){
  //   let num:any=i;
  //   let sumd:any=0; 
  //   let val:any=this.sp_percentage
  //   console.log((this.advanceform.get('ccbss') as FormArray).value)
  //   for(let j=0;j<(this.advanceform.get('ccbss') as FormArray).length;j++){
  //     if(i<=num){
  //       sumd=sumd+(this.advanceform.get('listofquantity') as FormArray).at(j).get('asset_quantity').value;
  //     }

  //   }
  //   // console.log('sumd=',sumd);
  //   // console.log('lll',this.splitqty_ng);
  //   if((val ) < sumd ){

  //     this.notification.showError('Data Not Matched');
  //     // console.log(event.target.value );
  //     // console.log();

  //     (this.advanceform.get('listofquantity') as FormArray).at(i).get('asset_quantity').reset();
  //     return false;
  //   }
  // }

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

            if (this.has_nextid) {
              this.taservice.getUsageCode(this.inputasset.nativeElement.value, this.has_presentid + 1).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.branchlist)
                let pagination = data['pagination'];
                this.branchlist = this.branchlist.concat(dts);

                if (this.branchlist.length > 0) {
                  this.has_nextid = pagination.has_next;
                  this.has_presentid = pagination.has_previous;
                  this.has_presentid = pagination.index;

                }
              })
            }
          }
        })
      }
    })


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

  submitForm() {

    var sum_percent: number = 0;
    let percentlist = (this.advanceform.get('ccbss') as FormArray).value
    percentlist.forEach(element => {
      if (element.ccid == null || element.bsid == null) {
        this.notification.showError("Please select CCBS")
        this.success = false;
        return false;
      }
      if (element.ccbs_edit_status == 1 || element.ccbs_edit_status == null) {
        sum_percent = sum_percent + parseFloat(element.percentage);
      }

      if (element.percentage < 0.1) {
        this.notification.showError("Percentage Can't be Zero")
        this.success = false;
        return false;
      }
    });
    if (this.success) {
      if (sum_percent != 100) {
        this.notification.showError("Check CCBS Percentage or Amount...")
        return false;
      }
    }
    else {
      return false;
    }
    const subject = this.advanceform.get('approval') as FormArray
    var employee = subject;
    var length = (<FormArray>this.advanceform.get("advance")).length - 1
    const myForm = (<FormArray>this.advanceform.get("advance")).at(length);
    myForm.patchValue({
      approval: employee.value.id,
    });
    myForm.patchValue({
      remarks: this.remarks,
    });

    let datadelete = this.advanceform.value.advance
    datadelete.forEach(element => {
      if (element.statuss == 'APPROVED' || element.statuss == 'REJECTED') {
        var index = datadelete.indexOf(element.statuss);
        (this.advanceform.get('advance') as FormArray).removeAt(index + 1)
      }
    });
    for (let i in datadelete) {
      if (datadelete[i].id == 0) {
        delete datadelete[i].id;
      }
      if (datadelete[i].onbehalfof == 0 || datadelete[i].onbehalf == null) {
        delete datadelete[i].onbehalfof;
      }
    }

    const ccbslist = (this.advanceform.get('ccbss') as FormArray).value

    let mainccbs = ccbslist.filter(function (element) {
      return (element.id >= 0 && element.ccbs_edit_status != 0 || element.id != undefined && element.ccbs_edit_status != 0)
    })
    // mainccbs.forEach(element => {
    //   const array = {
    //     "id":element.id,
    //       "bsid":element.bsid.id,
    //       "ccid":element.ccid.id,
    //       "amount":element.amount,
    //       "percentage":element.percentage
    //   }
    //   this.mainccbs.push(array);
    // });
    for (let j in mainccbs) {
      if (mainccbs[j].id == 0) {
        delete mainccbs[j].id;
        mainccbs[j].ccid = mainccbs[j].ccid.id;
        mainccbs[j].bsid = mainccbs[j].bsid.id;
      }
      else {
        mainccbs[j].ccid = mainccbs[j].ccid.id;
        mainccbs[j].bsid = mainccbs[j].bsid.id;
      }
    }
    // const ccbslists = (this.advanceform.get('ccbss') as FormArray).value
    // var lengthss = ccbslists.length;
    // for(var i=0;i<lengthss;i++){
    //   if (ccbslists[i].length == null || ccbslists.length == undefined){
    //     (this.advanceform.get('ccbs') as FormArray).removeAt(i);
    //   }
    //   else{
    //   const ccbsform = (this.advanceform.get('ccbs') as FormArray).at(i)
    //   ccbsform.patchValue({
    //     "id":ccbslists[i].id,
    //     "bsid":ccbslists[i].bsid.id,
    //     "ccid":ccbslists[i].ccid.id,
    //     "amount":ccbslists[i].amount,
    //     "percentage":ccbslists[i].percentage
    //   });
    // }
    // }

    console.log(this.ccbsdeletearray)
    let approve = true;

    let payload = {
      "advance": this.advanceform.value.advance,
      "ccbs": mainccbs
    }
    if (approve) {
      this.SpinnerService.show()
      this.taservice.advanceCreate(payload)
        .subscribe(res => {
          console.log("RESSs", res)
          if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
            this.SpinnerService.hide()
            this.notification.showWarning("Duplicate! Code Or Name ...")
          }
          else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
            this.SpinnerService.hide()
            this.notification.showError("INVALID_DATA!...")
          }
          else if (res.status === "SUCCESS" || res.status == "success") {
            // this.ccbsdeletearray.forEach(element => {
            //   if(Number(element)> 0){
            //     this.taservice.getccbsedit(element).subscribe(res =>{
            //       if(res.status =='success'){
            //       }
            //       else{
            //         this.notification.showError(res.message)
            //         return false
            //       }
            //     })
            //     }

            // });
            this.SpinnerService.hide()
            this.notification.showSuccess(res.message)
            this.data = { index: 3 }
            this.sharedService.summaryData.next(this.data)
            this.route.navigateByUrl('ta/advancemaker-summary');
            this.isSumbitbtn = true;
            if (this.datas == 5) {
              this.isSumbitbtn = false;
            }
            else if (this.datas == 2) {
              this.isSumbitbtn = true;
            }
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
    else {
      this.showccbs = true
      this.isSumbitbtn = false;
    }
  }


  approved() {
    this.data_final = {
      "id": this.advanceid,
      "tourgid": this.tourid,
      "apptype": "advance",
      "applevel": "1",
      "appcomment": this.resoncomment,
      "appamount": this.updatingamt,
      "status": "3",
      // "approvedby":this.appid
    }

    this.approve_service(this.data_final)
  }
  rejected() {
    this.data_final = {
      "id": this.advanceid,
      "tour_id": this.tourid,
      "apptype": "advance",
      "appcomment": this.resoncomment,


    }
    this.reject_service(this.data_final)
  }

  returned() {
    this.data_final = {
      "id": this.advanceid,
      "tour_id": this.tourid,
      "apptype": "advance",
      "appcomment": this.resoncomment,
      "appamount": this.updatingamt
    }
    this.return_service(this.data_final)
  }

  onCancelClick() {
    this.onCancel.emit()

    if (this.backrequest) {
      this.data = { index: 3 }
      this.sharedService.summaryData.next(this.data)
      this.route.navigateByUrl('ta/ta_summary')
    }
    else if (this.applevel == 1) {
      this.data = { index: 4 }
      this.sharedService.summaryData.next(this.data)
      this.route.navigateByUrl('ta/ta_summary');
    }
    else {
      this.route.navigateByUrl('ta/approve');
    }

  }


  approve_service(data) {
    if (this.updatingamt == null) {
      this.notification.showError("Please enter Approve Amount");
      return false;
    }
    if (this.resoncomment == null) {
      this.notification.showError('Please enter reason');
      return false;
    }
    this.SpinnerService.show()
    this.taservice.approvetourmaker(data)
      .subscribe(res => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.SpinnerService.hide()
          this.notification.showWarning("Duplicate! Code Or Name ...")
        }
        else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.SpinnerService.hide()
          this.notification.showError("INVALID_DATA!...")
        }
        else if (res.status == 'success') {
          this.SpinnerService.hide()
          this.notification.showSuccess("Approved Successfully....")
          this.route.navigateByUrl('ta/approve-summary')
          console.log("res", res)
          // this.data = {index: 4}
          // this.sharedService.summaryData.next(this.data)
          // this.route.navigateByUrl('ta/tamaster');
          this.onSubmit.emit();
          return true
        }
        else if (res.code === "UNEXPECTED_ERROR" && res.description.MESSAGE) {
          this.SpinnerService.hide()
          this.notification.showError(res.description.MESSAGE);
        }
        else {
          this.SpinnerService.hide()
          this.notification.showError(res.description);
        }
      })
  }
  reject_service(data) {

    if (this.resoncomment == null) {
      this.notification.showError('Please enter reason');
      return false;
    }
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
        else if (res.status == 'success' || res.status == "SUCCESS") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Rejected Successfully....")
          this.route.navigateByUrl('ta/approve-summary')

          console.log("res", res)
          // this.data = {index: 4}
          // this.sharedService.summaryData.next(this.data)
          // this.route.navigateByUrl('ta/tamaster');
          this.onSubmit.emit();
          return true
        }
        else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
        }
      })
  }

  amountcheck(event) {
    let amount = Number(event.target.value)
    if (this.requestamt < amount) {
      event.target.value = null;
    }
  }
  return_service(data) {

    if (this.updatingamt == null) {
      this.notification.showError("Please enter Approve Amount");
      return false;
    }
    if (this.resoncomment == null) {
      this.notification.showError('Please enter reason');
      return false;
    }
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
          this.notification.showSuccess("Returned Successfully....")
          this.route.navigateByUrl('ta/approve-summary')
          console.log("res", res)
          // this.data = {index: 4}
          // this.sharedService.summaryData.next(this.data)
          // this.route.navigateByUrl('ta/tamaster');
          this.onSubmit.emit();
          return true
        }
        else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
        }
      })
  }


}
