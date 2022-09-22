import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray, Form } from '@angular/forms';
import { isBoolean } from 'util';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate, DatePipe, Time } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { TaService } from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LOCALE_ID } from '@angular/core';

import { ActivatedRoute, Router } from "@angular/router";
import { ShareService } from 'src/app/ta/share.service';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';
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
      return formatDate(date, 'dd-MMM-yyyy, EEE', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

interface accbybank {
  id: number;
  Name: string;
}
interface billavailable {
  id: number;
  Name: string;
}


@Component({
  selector: 'app-lodging-expence',
  templateUrl: './lodging-expence.component.html',
  styleUrls: ['./lodging-expence.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    { provide: LOCALE_ID, useValue: 'en-EN' },
    { provide: MAT_DATE_LOCALE, useValue: 'en-EN' },
    DatePipe,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
})
export class LodgingExpenceComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  expenseid: any
  exptype: any
  comm: any
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger
  @ViewChild('inputassetid') inputasset: any;
  @ViewChild('assetid') matassetidauto: MatAutocomplete;
  @ViewChild('hsncodeid') hsncodeset: any;
  @ViewChild('hsnid') hsnidauto: MatAutocomplete;
  @ViewChild('gstcodetid') gstcodeset: any;
  @ViewChild('gstid') gstidauto: MatAutocomplete;

  lodging: any
  lodgeid: any
  tourno: any
  citylist: any;
  city: any;
  fromtime: Time;
  acrefno: any;
  vendorgstno: any;
  claimedamount: number;
  billavailable: any;
  vendorname: any;
  lodgcheckoutdate: any;
  totime: any;
  fromdate: any;
  igst: number = 0;
  sgst: number = 0;
  cgst: number = 0;
  appamount: number;
  billnumber: number;
  todate: any;
  applevel: number = 0;

  startdate: any;
  defaultValue = '6:00 am'
  enddate: any;
  detailsframe: any;
  totalbillamount: number;
  eligibleamount: any;
  currentpage: number = 1;
  pagesize = 10;
  noofday: any;
  centerlist: any;
  lodgingform: FormGroup;
  tourdatas: string;
  employeename: any;
  employeegrade: any;
  employeedesignation: any;
  id: any;
  show_number: boolean = false
  feild_disable: boolean = true
  claimid: any;
  expenceid: string;
  approvedamount: number;
  acc: any;
  datecopy: any;
  date: any;
  Dailydiemfromdate: Date;
  DailydiemTodate: Date;
  yesnoList: any;
  taxonly: any;
  pageSize = 10;
  p = 1;
  has_nextid: boolean = true;
  has_presentid: number = 1;
  has_nexthsnid: boolean = true;
  has_presenthsnid: number = 1;
  has_nextgstid: boolean = true;
  has_presentgstid: number = 1;
  isLoading: boolean;
  expname: string;
  maker: boolean;
  approver: boolean = false;
  gstshow: boolean = false;
  lodgefromdate: any;
  lodgetodate: any;
  maximum: any;
  maxdayslimit: any;
  newform: boolean = true;
  billchecklist: any;
  expid: any;
  isonbehalf: boolean;
  onbehalf_empName: string;
  applist: any[];
  statusid: any;
  report: boolean = false;
  typelist: any;
  mainind: any = 0;
  amtchanged: boolean;
  employeecode: any;


  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private http: HttpClient,
    private notification: NotificationService, private taservice: TaService,
    public sharedService: SharedService, private route: Router, private activatedroute: ActivatedRoute, private SpinnerService: NgxSpinnerService,
    private shareservice: ShareService, private router: Router) { }


  ngOnInit(): void {
    let expensetype = JSON.parse(localStorage.getItem('expense_edit'));
    let expensedetails = JSON.parse(localStorage.getItem('expense_details'));
    this.report = expensedetails.report
    this.employeename = expensedetails.employee_name
    this.employeecode=expensedetails.employee_code
    this.employeegrade = expensedetails.empgrade
    this.employeedesignation = expensedetails.empdesignation

    // this.typelist = [{
    //   name:'LODGE',value:1
    // },{
    //   name:'HOME',value:2
    // }]

    this.startdate = new Date(expensedetails.startdate)
    this.enddate = new Date(expensedetails.enddate)
    this.statusid = expensedetails.claim_status_id;
    if (expensedetails.applevel) {
      this.applevel = expensedetails.applevel
    }

    this.expenceid = expensedetails.id
    if (expensedetails.onbehalfof) {
      this.isonbehalf = true;
      this.onbehalf_empName = '(' + expensedetails.employee_code + ') ' + expensedetails.employee_name
      console.log("onbehalf_empName", this.onbehalf_empName)
    } else {
      this.isonbehalf = false;
    }
    if (expensedetails.applevel > 0) {
      this.isonbehalf = false;
      this.expenceid = expensedetails['tourid']
      this.approver = true;
    }
    if (this.statusid == 3 || this.statusid == 4 || this.statusid == 2) {
      this.approver = true;
    }

    if (expensetype.status == 'REQUESTED') {
      this.newform = false;
    }
    this.exptype = expensetype.expenseid
    if (this.exptype == 5) {
      this.expname = 'Lodging';
    }

    console.log("sf", this.exptype)
    this.comm = expensetype.requestercomment
    console.log("cc", this.comm)


    this.taservice.getlodgeeditSummary(this.expenceid).subscribe(res => {
      let lodgelist = res['data'];
      var length = lodgelist.length;
      for (var i = 0; i < length; i++) {
        delete lodgelist[i].claimreqid;
        delete lodgelist[i].exp_name;
        delete lodgelist[i].exp_id
        if (i > 0) {
          this.addSection();
        }
        let value1 = new Date(lodgelist[i].fromdate)
        let value2 = new Date(lodgelist[i].todate)
        lodgelist[i].fromtime = String(value1.getHours()).padStart(2, '0') + ':' + String(value1.getMinutes()).padStart(2, '0')
        lodgelist[i].totime = String(value2.getHours()).padStart(2, '0') + ':' + String(value2.getMinutes()).padStart(2, '0')


        // lodgelist[i].accbybank = String(lodgelist[i].accbybank.value)
        // lodgelist[i].Lodge_Homestay = Number(lodgelist[i].Lodge_Homestay)
        lodgelist[i].claimedamount = lodgelist[i].claimedamount.toFixed(2)
        lodgelist[i].Billamountexculdingtax = lodgelist[i].Billamountexculdingtax.toFixed(2)
        lodgelist[i].taxonly = lodgelist[i].taxonly.toFixed(2)
        lodgelist[i].fromdate = this.datePipe.transform(lodgelist[i].fromdate, 'yyyy-MM-dd');
        lodgelist[i].todate = this.datePipe.transform(lodgelist[i].todate, 'yyyy-MM-dd');
        // lodgelist[i].lodgcheckoutdate = this.datePipe.transform(lodgelist[i].lodgcheckoutdate, 'yyyy-MM-ddTHH:mm');

      }
      if (lodgelist.length != 0) {
        this.gstshow = true;
        this.lodgingform.patchValue({
          data: lodgelist
        })
      }
      this.notification.showInfo(" CEO's approval email attachment - is mandatory if Alcohol / Tobacco is included in the bill.");

    })

    this.lodgingform = this.formBuilder.group({
      data: new FormArray([
        this.createItem(),

      ]),
      // data: new FormArray([]),
    })


    this.getcityValue();
    this.getCenter();
    this.getyesno();
    this.createtime();
    this.getgstcode();
    this.gettypelist();
  }
  gettypelist() {
    this.taservice.getypelist()
      .subscribe(res => {
        this.typelist = res
      })
  }
  cityname(subject) {
    return subject ? subject.city : undefined;
  }
  getyesno() {
    this.taservice.getyesno()
      .subscribe(res => {
        this.yesnoList = res
        this.billchecklist = res
      })
  }

  addSection() {
    const data = this.lodgingform.get('data') as FormArray;
    data.push(this.createItem());
    // this.gstshow = false;
  }
  deleteArray(index: number) {
    (<FormArray>this.lodgingform.get('data')).removeAt(index);
  }
  eligcheck(ind) {
    ind = this.pageSize * (this.p - 1) + ind;
    let form = this.lodgingform.value.data[ind].eligibleamount
    if (form > 0) {
      return false
    }
    else {
      return true
    }
  }

  calc_eligble(ind) {
    ind = this.pageSize * (this.p - 1) + ind;
    // console.log("INDDD", ind)
    const detailframe = this.lodgingform.value.data[ind]
    if (detailframe.fromdate && detailframe.todate && detailframe.totime && detailframe.fromtime && detailframe.city) {
      this.detailsframe = {
        // "tour_id":detailframe.tour_id,
        "Lodge_Homestay": detailframe.Lodge_Homestay,
        "fromdate": detailframe.fromdate,
        "todate": detailframe.todate,
        "city": detailframe.city,
        "expensegid": 5,
      }
    }
    else {
      return false;
    }
    this.detailsframe.fromdate = this.datePipe.transform(detailframe.fromdate, 'yyyy-MM-dd ') + detailframe.fromtime + ':00';
    this.detailsframe.todate = this.datePipe.transform(detailframe.todate, 'yyyy-MM-dd ') + detailframe.totime + ':00';
    console.log("eligible", this.detailsframe)
    let value1 = new Date(this.detailsframe.fromdate)
    let value2 = new Date(this.detailsframe.todate)
    if (value2 <= value1) {
      return false;
    }
    this.SpinnerService.show()
    this.taservice.getlodgingeligibleAmount(this.detailsframe)
      .subscribe(result => {
        const myform = (this.lodgingform.get('data') as FormArray).at(ind)
        this.SpinnerService.hide()
        var elgamt = Number(result['Eligible_amount'])
        var noofday = result['noofdays']
        this.maxdayslimit = noofday
        myform.patchValue({
          "eligibleamount": elgamt,
          // "noofdays": noofday
        })

      }),
      (error) => {
        this.SpinnerService.hide();
        console.log('getPDF error: ', error.error.text);
      }
  }

  limitcheck(i) {
    let ind = this.pageSize * (this.p - 1) + i;
    let myform = this.lodgingform.value.data[ind]
    if (myform.claimedamount > myform.eligibleamount) {
      return true;
    }
    else {
      return false;
    }
  }

  exceednot(i) {
    let ind = this.pageSize * (this.p - 1) + i;
    let myform = this.lodgingform.value.data[ind]
    if (myform.claimedamount > myform.eligibleamount) {
      this.notification.showWarning('You are exceeding the eligible amount, please enter your remarks')
    }
  }

  datechange(ind) {
    ind = this.pageSize * (this.p - 1) + ind;
    let myform = this.lodgingform.value.data[ind];
    let expform = (this.lodgingform.get('data') as FormArray).at(ind)
    if (myform.fromdate.getDate() == myform.todate.getDate()) {
      expform.patchValue({
        totime: null
      })
    }
    this.invaliddateend(ind);
  }

  invaliddatestart(ind) {
    var length = this.lodgingform.value.data.length
    let myform = (this.lodgingform.get('data') as FormArray).at(ind)
    myform.patchValue({
      todate: null
    })
    if (length > ind) {
      for (var i = ind + 1; i < length; i++) {
        let valuecheck = (this.lodgingform.get('data') as FormArray).at(i).value;
        let changeform = (this.lodgingform.get('data') as FormArray).at(i)
        if (valuecheck.fromdate != null || valuecheck.todate != null) {
          this.notification.showError('Invalid Dates in table row at ' + (i + 1))
          changeform.patchValue({
            // "lodgcheckoutdate": null,
            "fromdate": null,
            "todate": null,
            'eligibleamount': null,
            // 'noofday': null
          })
        }

      }
    }
  }
  invaliddateend(ind) {
    var length = this.lodgingform.value.data.length
    if (length > ind) {

      for (var i = ind + 1; i < length; i++) {
        let valuecheck = (this.lodgingform.get('data') as FormArray).at(i).value;
        let changeform = (this.lodgingform.get('data') as FormArray).at(i)
        if (valuecheck.fromdate != null || valuecheck.todate != null) {
          this.notification.showError('Invalid Dates in table row at ' + (i + 1))
          changeform.patchValue({
            "fromdate": null,
            "todate": null,
            'eligibleamount': null,
            'noofday': null
          })
        }
      }
    }
  }


  selectcheck(ind) {
    let myform = (this.lodgingform.get('data') as FormArray).at(ind).value
    return myform.fromdate;
  }
  select2check(ind) {
    let myform = (this.lodgingform.get('data') as FormArray).at(ind).value
    return myform.todate;
  }
  accbybankcheck(ind) {
    let accby = this.lodgingform.value.data.at(ind).accbybank;
    if (accby == '1') {
      return false;
    }
    else {
      return true;
    }
  }

  billcheck(ind) {
    let bill = this.lodgingform.value.data.at(ind).billavailable;
    if (bill == '1') {
      return true;
    }
    else {
      this.lodgingform.value.data.at(ind).billnumber = 0;
      return false;
    }
  }

  fieldGlobalIndex(index) {
    let dat = this.pageSize * (this.p - 1) + index;
    return dat
  }
  hsnshow(subject) {
    return subject ? subject.code : undefined;
  }

  checkigst(ind) {
    let myform = (this.lodgingform.get('data') as FormArray).at(ind).value
    if (myform.igst != 0) {
      return true;
    }
    else {
      return false;
    }
  }
  checkscgst(ind) {
    let myform = (this.lodgingform.get('data') as FormArray).at(ind).value
    if (myform.cgst != 0 || myform.sgst != 0) {
      return true;
    }
    else {
      return false;
    }

  }
  decs(name: HTMLElement, ind, evt) {
    let value = name.getAttribute('formControlName')
    let amt = Number(evt.target.value);
    this.lodgingform.get('data')['controls'].at(ind).get(value).setValue(amt.toFixed(2))
  }

  minselect(ind) {
    this.maximum = this.enddate;
    if (ind == 0) {
      // this.lodgingform.get('data')['controls'][0].get('fromdate').setValue(this.startdate)

      // this.lodgingform.get('data')['controls'][0].get('todate').setValue(this.enddate)
      return this.startdate;
    }
    else if (this.lodgingform.value.data[ind - 1].todate != null) {
      return this.lodgingform.value.data[ind - 1].todate;
    }
    else {
      this.maximum
    }
  }

  maxselect(ind) {
    this.maximum = this.enddate;
    if (this.lodgingform.value.data[ind].fromdate == null) {
      return this.maximum;
    }
    else {
      return this.lodgingform.value.data[ind].fromdate
    }

  }
  entergst_check(ind) {
    let myform = (this.lodgingform.get('data') as FormArray).at(ind).value
    return myform.entergst;
  }
  entergst(event, ind) {
    let myform1 = (this.lodgingform.get('data') as FormArray).at(ind)
    myform1.patchValue({
      bankgstno: event.target.value
    })
  }
  newgst(ind) {
    let myform1 = (this.lodgingform.get('data') as FormArray).at(ind)
    myform1.patchValue({
      entergst: true
    })
  }

  gst_calc(ind) {
    let myform = (this.lodgingform.get('data') as FormArray).at(ind).value
    let myform1 = (this.lodgingform.get('data') as FormArray).at(ind)
    if (myform.bankgstno != myform.vendorgstno
      && myform.hsncode != '' && (myform.bankgstno != 0 && (myform.vendorgstno != '' || myform.vendorgstno != 0))) {
      var bnk_gst = myform.bankgstno.slice(0, 2);
      var lo_gst = myform.vendorgstno.slice(0, 2);
      if (bnk_gst == lo_gst) {
        this.gstshow = true;
        var per = myform.hsncode.igstrate / 2;
        myform1.patchValue({
          "cgst": per,
          "sgst": per,
          "igst": 0,
        })
      }
      else {
        this.gstshow = true;
        myform1.patchValue({
          "igst": myform.hsncode.igstrate,
          "cgst": 0,
          "sgst": 0
        })
      }
    }
    else if ((myform.bankgstno != 0 && myform.hsncode != '' && (myform.vendorgstno != '' || myform.vendorgstno != 0))) {
      this.notification.showInfo("Bank GST and Vendor GST are Same");
      myform1.patchValue({
        vendorgstno: ''
      })
    }
    else {
      return false;
    }
    //   if (e.bankgstno != e.vendorgstno ){
    //     var bnk_gst = e.bankgstno.slice(0,2);
    //     var lo_gst = e.vendorgstno.slice(0,2);
    //     if( bnk_gst == lo_gst ){
    //         $scope.gst_show = true;
    //         var per = e.selectedhsn.hsn_igstrate/2;
    //         $scope.eClaim_lodg[i].cgst = per;
    //         $scope.eClaim_lodg[i].sgst = per;
    //         $scope.eClaim_lodg[i].scgst_show = true;
    //         $scope.eClaim_lodg[i].igst_show = false;
    //     }
    //     else{
    //         $scope.gst_show = true;
    //         $scope.eClaim_lodg[i].igst = e.selectedhsn.hsn_igstrate;
    //         $scope.eClaim_lodg[i].igst_show = true;
    //         $scope.eClaim_lodg[i].scgst_show = false;
    //     }
    // }
    // else{
    //     alert("Bank GST and Vendor GST are Same");
    //     e.vendorgstno = '';
    // }
  }


  createItem() {
    let group = this.formBuilder.group({
      id: 0,
      tour_id: this.expenceid,
      fromtime: null,
      totime: null,
      expensegid: 5,
      city: '',
      claimedamount: null,
      requestercomment: this.comm,
      Lodge_Homestay: 'Lodging',
      metro_nonmetro: 'METRO',
      placeofactualstay: null,
      fromdate: null,
      todate: null,
      // noofdays: 0,
      accbybank: "0",
      acrefno: 0,
      // billavailable: null,
      billno: 0,
      remarks: null,
      Billamountexculdingtax: null,
      hsncode: '',
      taxonly: 0,
      vendorname: '',
      eligibleamount: null,
      approvedamount: 0,


    })

    return group;
  }
  numberOnly(event) {
    return (event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46 || event.charCode == 58)
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 62 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || k == 33 || (k >= 44 && k <= 58));

  }
  citysearch(event) {
    let value = event.target.value
    this.taservice.getcitylist(value, 1)
      .subscribe(result => {
        this.citylist = result['data']
      })
  }

  hsnsearch(ind, event) {
    let formvalue = this.lodgingform.value.data[ind].hsncode
    this.mainind = ind;
    console.log(formvalue.code, event.target.value)
    if (event.target.value != formvalue) {
      this.taservice.gethsncode(event.target.value, 1)
        .subscribe(result => {
          this.hsnList = result['data']
        })
    }
    else {
      this.gethsncode()
    }
  }

  gstsearch(ind, event) {
    let formvalue = this.lodgingform.value.data[ind].bankgstno;
    this.mainind = ind;
    console.log(formvalue, event.target.value)
    if (event.target.value == formvalue) {
      this.taservice.getgstcode(event.target.value, 1)
        .subscribe(result => {
          this.gstList = result['data']
        })
    }
    else {
      this.getgstcode()
    }

  }
  timeclone: any;
  timelist = [];
  totimelist = [];
  createtime() {
    for (var i = 0; i < 24; i++) {
      if (i >= 10) {
        var t00 = { 'name': i + ':00' }
        var t15 = { 'name': i + ':15' }
        var t30 = { 'name': i + ':30' }
        var t45 = { 'name': i + ':45' }
      }
      else {
        var t00 = { 'name': '0' + i + ':00' }
        var t15 = { 'name': '0' + i + ':15' }
        var t30 = { 'name': '0' + i + ':30' }
        var t45 = { 'name': '0' + i + ':45' }
      }


      this.timelist.push(t00)
      this.timelist.push(t15)
      this.timelist.push(t30)
      this.timelist.push(t45)
    }
    this.timeclone = this.timelist;
  }

  timefilter(evt) {
    let value = evt.target.value;
    this.timeclone = this.timelist.filter(function (element) {
      return element.name.includes(value)
    })
  }
  timedropdowncheck(time, ind) {
    ind = this.pagesize * (this.p - 1) + ind;
    let controlname = time.getAttribute('formControlName')
    let found = this.timelist.find(value => value.name == time.value)
    if (!found) {
      // this.notification.showError('Kindly Select Time from the given dropdown')
      this.lodgingform.get('data')['controls'].at(ind).get(controlname).setValue(null)
    }

  }
  totimechange(ind, totime) {
    ind = this.pagesize * (this.p - 1) + ind;
    let myform = this.lodgingform.value.data[ind]
    if (myform.fromdate && myform.todate) {
      if (myform.fromdate < myform.todate) {

      }
      else if (myform.fromdate >= myform.todate) {
        let index = this.timelist.findIndex((item) => item.name === myform.fromtime);
        let index2 = this.timelist.findIndex((item) => item.name === totime.value);
        if (!(index2 > index)) {
          this.notification.showError('Kindly Select Time from the given dropdown')
          this.lodgingform.get('data')['controls'].at(ind).get('totime').setValue(null)
        }
      }
    }


  }
  totimes(ind,totime) {
    ind = this.pageSize * (this.p - 1) + ind;
    this.totimelist = []
    let myform = this.lodgingform.value.data[ind]
    let time = myform.fromtime;
    if (time && myform.fromdate >= myform.todate) {
      let index = this.timelist.findIndex((item) => item.name === time)
      let arr = this.timelist;
      var list = arr.slice(index + 1)
      list = list.filter(function (element) {
        return element.name.includes(totime.value)
      })
      return list;
    }
    else if (myform.fromdate < myform.todate) {
      var timelist = this.timelist
      return timelist.filter(function (element) {
        return element.name.includes(totime.value)
      })
    }
    else {
      return []
    }
  }
  getcityValue() {
    this.taservice.getcitylist('', 1)
      .subscribe(result => {
        this.citylist = result['data']

      })
  }
  getAcc(value, ind) {
    this.acc = value
    console.log("acc", this.acc)
    if (this.acc == "1") {
      // this.lodgingform.controls.data['controls'].at(ind).acrefno.enable();
      // console.log(this.lodgingform.controls['data'].value.at(ind).value)
    }
    else if (this.acc == "0") {
      // this.lodgingform.controls['data'].value.at(ind).acrefno.disable();
    }
  }
  getCenter() {
    this.taservice.getloc_convcenter()
      .subscribe(result => {
        console.log(result)
        this.centerlist = result
      })
  }

  ApproveForm() {
    this.applist = [];
    console.log("form-app", this.lodgingform.value)
    for (var i = 0; i < this.lodgingform.value.data.length; i++) {
      let json = {
        "id": this.lodgingform.value.data[i].id,
        "amount": this.lodgingform.value.data[i].approvedamount,

      }
      this.applist.push(json)
    }
    for (var i = 0; i < this.applist.length; i++) {
      this.applist[i].amount = JSON.parse(this.applist[i].amount)

    }
    console.log("createdlist", this.applist)
    this.taservice.approver_amountupdate(this.expenceid, 5, this.applist)
      .subscribe(res => {
        if (res.status === "success") {
          this.notification.showSuccess("Success....")
          this.onSubmit.emit();
          return true;
        } else {
          this.notification.showError(res.description)
          return false;
        }
      })
  }
  submitForm() {
    let submitForm = this.lodgingform.value.data;


    submitForm.forEach(currentValue => {
      if (currentValue.Lodge_Homestay == null || currentValue.Lodge_Homestay == '') {
        this.notification.showError('Please select Lodge/Homestay')
        throw new Error
      }

      if (currentValue.fromdate == null || currentValue.fromdate == '') {
        this.notification.showError('Please Choose Start Date')
        throw new Error
      }
      if (currentValue.todate == null || currentValue.todate == '') {
        this.notification.showError('Please Choose End Date')
        throw new Error
      }
      if (currentValue.fromtime == null || currentValue.fromtime == '') {
        this.notification.showError('Please Choose From Time')
        throw new Error
      }
      if (currentValue.totime == null || currentValue.totime == '') {
        this.notification.showError('Please Choose To Time')
        throw new Error
      }


      if (currentValue.claimedamount == null || currentValue.claimedamount == '') {
        this.notification.showError('Please Enter Claim Amount')
        throw new Error
      }


      currentValue.claimedamount = Number(currentValue.claimedamount)
      currentValue.Billamountexculdingtax = Number(currentValue.Billamountexculdingtax)
      currentValue.taxonly = Number(currentValue.taxonly)
      currentValue.eligibleamount = Number(currentValue.eligibleamount)

      if (currentValue.claimedamount > currentValue.eligibleamount && (currentValue.remarks == null || currentValue.remarks == '')) {
        this.notification.showError('Please Enter Remarks for Limit Exceeding')
        throw new Error
      }
      delete currentValue.entergst;

      currentValue.fromdate = this.datePipe.transform(currentValue.fromdate, 'yyyy-MM-dd ') + currentValue.fromtime + ':00';
      currentValue.todate = this.datePipe.transform(currentValue.todate, 'yyyy-MM-dd ') + currentValue.totime + ':00';
      // currentValue.lodgcheckoutdate = this.datePipe.transform(currentValue.lodgcheckoutdate, 'yyyy-MM-dd HH:mm:ss');
      // if (currentValue.hsncode) {
      //   currentValue.hsncode = currentValue.hsncode.code;
      // }
      if (currentValue.id == 0) {
        delete currentValue.id;
      }


    });

    console.log("locexp1", submitForm)
    this.SpinnerService.show();
    let payload = {
      "data": submitForm
    }
    this.taservice.LodgingCreate(payload)
      .subscribe(res => {
        console.log("resss", res)
        if (res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success") {
          this.notification.showSuccess("Lodging Created Successfully...")
          // window.location.reload()

          this.SpinnerService.hide();
          this.router.navigateByUrl('ta/exedit')
          this.onSubmit.emit();
          return true;
        }

        else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
          return false;

        }
      }, (error) => {
        this.SpinnerService.hide()

      }
      )

  }
  back() {

    if (this.applevel == 0) {
      this.router.navigateByUrl('ta/exedit')
    }
    else if (this.applevel == 1 && this.report) {
      this.router.navigateByUrl('ta/report')

    }
    else {
      this.router.navigateByUrl('ta/exapprove-edit')
    }


  }

  hsnList: any;
  gstList: any;
  getgstcode() {
    this.taservice.getgstcode('', 1)
      .subscribe(result => {
        this.gstList = result['data']
        console.log("gstList", this.gstList)
      })
  }
  gethsncode() {
    this.taservice.gethsncode('', 1)
      .subscribe(result => {
        this.hsnList = result['data']
        console.log("hsnlist", this.hsnList)
      })
  }
  gst: any;
  selectGst(e) {
    this.gst = e.value
    console.log("gs", this.gst)
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

            if (this.has_nextid) {
              this.taservice.getcitylist(this.inputasset.nativeElement.value, this.has_presentid + 1).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.citylist)
                let pagination = data['pagination'];
                this.citylist = this.citylist.concat(dts);

                if (this.citylist.length > 0) {
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


  autocompletehsnid() {
    setTimeout(() => {
      if (this.hsnidauto && this.autocompletetrigger && this.hsnidauto.panel) {
        fromEvent(this.hsnidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.hsnidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.hsnidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.hsnidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.hsnidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nexthsnid) {
              this.taservice.gethsncode(this.hsncodeset.nativeElement.value, this.has_presenthsnid + 1).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.hsnList)
                let pagination = data['pagination'];
                this.hsnList = this.hsnList.concat(dts);

                if (this.hsnList.length > 0) {
                  this.has_nexthsnid = pagination.has_next;
                  this.has_presenthsnid = pagination.has_previous;
                  this.has_presenthsnid = pagination.index;

                }
              })
            }
          }
        })
      }
    })


  }


  autocompletegstid() {
    setTimeout(() => {
      if (this.gstidauto && this.autocompletetrigger && this.gstidauto.panel) {
        fromEvent(this.gstidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.gstidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.gstidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.gstidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.gstidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextid) {
              this.taservice.getgstcode(this.gstcodeset.nativeElement.value, this.has_presentid + 1).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.gstList)
                let pagination = data['pagination'];
                this.gstList = this.gstList.concat(dts);

                if (this.gstList.length > 0) {
                  this.has_nextgstid = pagination.has_next;
                  this.has_presentgstid = pagination.has_previous;
                  this.has_presentgstid = pagination.index;

                }
              })
            }
          }
        })
      }
    })


  }

  centercheck(ind) {
    let value = this.lodgingform.value.data[ind].Lodge_Homestay
    console.log(value)
    if (value == 'Homestay') {
      this.lodgingform.get('data')['controls'][ind].get('metro_nonmetro').setValue(null)
      return true
    }
    else if (value == 'Lodging') {
      return false
    }
    else {
      this.lodgingform.get('data')['controls'][ind].get('metro_nonmetro').setValue(null)
      return true
    }
  }

  // ngAfterViewInit() {
  //   (this.lodgingform.get('data') as FormArray).at(this.mainind).get('hsncode').valueChanges
  //   .pipe(
  //     debounceTime(100),
  //     distinctUntilChanged(),
  //     tap(() => {
  //       this.isLoading = true;
  //     }),
  //     switchMap(value => this.taservice.gethsncode(value, 1))
  //   )
  //   .subscribe((results: any[]) => {
  //     console.log('hitsthisss')
  //     this.hsnList = results['data']

  //   });
  // }

}