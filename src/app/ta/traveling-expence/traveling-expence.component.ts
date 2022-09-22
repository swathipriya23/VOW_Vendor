import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray, NgForm } from '@angular/forms';
import { map, takeUntil, startWith, debounceTime, distinctUntilChanged, tap, switchMap, finalize } from 'rxjs/operators';
import { Observable, fromEvent } from 'rxjs';
import { filter, } from 'rxjs/operators';
import { isBoolean } from 'util';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
// import { formatDate } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { ShareService } from 'src/app/ta/share.service';
import { TaService } from "../ta.service";
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { flattenDiagnosticMessageText } from 'typescript';

import { COMMA, E, ENTER } from '@angular/cdk/keycodes';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
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
interface permission {
  id: number;
  Name: string;
}
interface reason {
  id: number;
  Name: string;
}
interface ticketby {
  id: number;
  Name: string;
}








@Component({
  selector: 'app-traveling-expence',
  templateUrl: './traveling-expence.component.html',
  styleUrls: ['./traveling-expence.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
})
export class TravelingExpenceComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger
  @ViewChild('hsncodeid') hsncodeset: any;
  @ViewChild('hsnid') hsnidauto: MatAutocomplete;
  @ViewChild('gstcodetid') gstcodeset: any;
  @ViewChild('gstid') gstidauto: MatAutocomplete;
  has_nextid: boolean = true;
  has_presentid: number = 1;
  has_nexthsnid: boolean = true;
  has_presenthsnid: number = 1;
  has_nextgstid: boolean = true;
  has_presentgstid: number = 1;


  gstList: any
  myControl = new FormControl();
  form: FormGroup;
  // options: string[] = [this.gstList];
  filteredOptions: Observable<string[]>;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  traveling: any
  travelingform: FormGroup
  expenseid: any
  exptype: any
  applevel: number = 0;
  comm: any
  fromdate: any
  offcurrentpage: number = 1;
  enddate: any
  p = 1;
  currentpage: number = 1;
  pagesize = 10;
  pageSize = 10
  datecopy: any
  travelmodelist: Array<any>
  Travelfromdate: any
  Traveltodate: any
  dailyid: any
  tourno: any
  classtravelmodelist: any;
  road: any;
  air: any;
  train: any;
  sea: any;
  classtravel: any;
  tourdatas: string;
  show_gstpercent: boolean = false
  show_gstpercentage: boolean = false
  gstshow: boolean = false
  approver: boolean = false;
  employeename: any;
  employeegrade: any;
  employeedesignation: any;
  id: any;
  dependencies: any = []
  claimid: any;
  expenceid: string;
  approveamount: any;
  fromplace: any;
  toplace: any
  totaltkttamt: number
  tktbybank: any
  actualtravel: any
  highermodereason: any
  priorpermission: any
  highermodeopted: any
  classoftravel: any
  dependentgid: any
  eligibletravel: any
  noofdependents: any
  claimedamount: number
  vendorname: any
  vendorcode: any
  hsnList: any;
  ishidden: boolean = false
  has_offnext = true;
  gst: any;
  vendor: any;
  yesnoList: any;
  tktrefno: any;
  show_button: boolean = true
  ttime: any;
  fdt: string;
  tdt: string;
  dependList: any;
  appamount: any;
  vendorgstno: any;
  cgst: Number
  igst: number
  sgst: number
  value: any;
  gstdata: any;
  newvalue: string;
  todate: any;
  array: any = [];
  paginationedit: boolean = false;
  isLoading: boolean;
  branchdata: any;
  formChangesSubscription: any;
  results: Observable<any>;
  reason: any;
  maximum: any;
  startdate: any;
  isonbehalf: boolean = false;
  onbehalf_empName: string;
  newform: boolean;
  eligibleclass: void;
  onbehalfid: Number = 0;
  approvedamount: Number = 0;
  airtravellist: any;
  roadtravellist: any;
  seatravellist: any;
  traintravellist: any;
  dependentavailable: boolean = false;
  dependentcheck: boolean = false;
  applist: any[];
  statusid: any;
  dependent: FormControl
  report: any;
  traveldependent: any = []
  dp = 1
  acttravellist: any;
  employeecode: any;


  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private http: HttpClient, private shareservice: ShareService,
    private taservice: TaService, private notification: NotificationService, private router: Router, private SpinnerService: NgxSpinnerService) {

  }


  ngOnInit(): void {

    let expensetype = JSON.parse(localStorage.getItem('expense_edit'));
    let expensedetails = JSON.parse(localStorage.getItem('expense_details'));
    this.report = expensedetails.report
    this.employeename = expensedetails.employee_name
    this.employeecode = expensedetails.employee_code
    this.employeegrade = expensedetails.empgrade
    this.employeedesignation = expensedetails.empdesignation
    this.comm = expensetype.requestercomment;
    this.exptype = expensetype.expenseid
    this.reason = expensedetails.reason_id;
    this.startdate = new Date(expensedetails.startdate)
    // console.log("from date",this.startdate)
    this.enddate = new Date(expensedetails.enddate)
    this.statusid = expensedetails.claim_status_id;
    if (expensedetails.applevel) {
      this.applevel = expensedetails.applevel
    }

    this.expenseid = expensedetails.id
    if (expensedetails.onbehalfof) {
      this.isonbehalf = true;
      this.onbehalfid = expensedetails.empgid;
      this.onbehalf_empName = '(' + expensedetails.employee_code + ') ' + expensedetails.employee_name
      console.log("onbehalf_empName", this.onbehalf_empName)

    } else {
      this.isonbehalf = false;
    }
    if (expensedetails.applevel > 0) {
      this.isonbehalf = false;
      this.expenseid = expensedetails['tourid']
      this.approver = true;
    }

    if (expensetype.status == 'REQUESTED') {
      this.newform = false;
    }
    if (this.statusid == 3 || this.statusid == 4 || this.statusid == 2) {
      this.approver = true;
    }
    this.SpinnerService.show()
    this.taservice.gettravelingeditSummary(this.expenseid).subscribe(res => {
      this.SpinnerService.hide()
      let travellist = res['data'];
      var length = travellist.length;
      for (var i = 0; i < length; i++) {
        delete travellist[i].claimreqid;
        delete travellist[i].exp_name;
        delete travellist[i].exp_id
        if (i > 0) {
          this.addSection();
        }
        let value1 = new Date(travellist[i].fromdate)
        let value2 = new Date(travellist[i].todate)
        travellist[i].fromtime = String(value1.getHours()).padStart(2, '0') + ':' + String(value1.getMinutes()).padStart(2, '0')
        travellist[i].totime = String(value2.getHours()).padStart(2, '0') + ':' + String(value2.getMinutes()).padStart(2, '0')
        // travellist[i].tktbybank = String(travellist[i].tktbybank.value)
        // travellist[i].actualtravel = String(travellist[i].actualtravel.value)
        // travellist[i].travelclass = String(travellist[i].travelclass.value)
        // travellist[i].priorpermission = String(travellist[i].priorpermission.value)
        travellist[i].fromdate = value1;
        travellist[i].todate = value2;
        travellist[i].totaltkttamt = Number(travellist[i].totaltkttamt).toFixed(2);

        // this.traveldependent = this.traveldependent.concat(travellist[i].dependencies)


      }
      if (travellist.length != 0) {
        // console.log(this.traveldependent[0].dependentname)
        this.gstshow = true;
        this.travelingform.patchValue({
          data: travellist
        })

      }
    })

    this.travelingform = this.formBuilder.group({
      data: new FormArray([
        this.createItem(),


      ]),
      // data: new FormArray([]),

    })

    this.createtime();
    this.gettravelMode();
    this.getbustravel();
    this.gettrainitravel();
    this.getairtravel();
    // this.getseatravel();
    // this.gethsncode();
    // this.getgstcode();
    this.getyesno();
    // this.getdepend()
    this.getacttravel();

  }
  hsnsearch(ind) {
    ind = ((this.p - 1) * this.pageSize) + ind
      (this.travelingform.get('data') as FormArray).at(ind).get('hsncode').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.gethsncode(value, 1))
      )
      .subscribe((results: any[]) => {
        this.hsnList = results['data']

      });

  }

  gstsearch(ind) {
    ind = ((this.p - 1) * this.pageSize) + ind
      (this.travelingform.get('data') as FormArray).at(ind).get('bankgstno').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taservice.getgstcode(value, 1))
      )
      .subscribe((results: any[]) => {
        this.gstList = results['data']
      });

  }
  boardingnotify(name){
    name = this.travelingform.value.data[name].actualmode;
    if (name.toLowerCase()=='air'){
      this.notification.showInfo('Boarding Pass is Mandatory For Air Travel Expense ')
    }
  }

  numberOnly(event) {
    return (event.charCode >= 48 && event.charCode <= 58 || event.charCode == 46)
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 62 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || k == 33 || (k >= 44 && k <= 58));
  }
  fieldGlobalIndex(index) {
    let dat = this.pageSize * (this.p - 1) + index;
    return dat
  }

  entergst_check(ind) {
    ind = ((this.p - 1) * this.pageSize) + ind
    let myform = (this.travelingform.get('data') as FormArray).at(ind).value
    return myform.entergst;
  }
  entergst(event, ind) {
    ind = ((this.p - 1) * this.pageSize) + ind
    let myform1 = (this.travelingform.get('data') as FormArray).at(ind)
    myform1.patchValue({
      bankgstno: event.target.value
    })
  }
  newgst(ind) {
    ind = ((this.p - 1) * this.pageSize) + ind
    let myform1 = (this.travelingform.get('data') as FormArray).at(ind)
    myform1.patchValue({
      entergst: true
    })
  }

  gst_calc(ind) {
    ind = ((this.p - 1) * this.pageSize) + ind
    let myform = (this.travelingform.get('data') as FormArray).at(ind).value
    let myform1 = (this.travelingform.get('data') as FormArray).at(ind)
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
  }

  dependents(ind) {
    ind = ((this.p - 1) * this.pageSize) + ind

    let myform = this.travelingform.value.data[ind].dependencies
    return myform
  }
  onToppingRemoved(topping: string, ind) {
    ind = ((this.p - 1) * this.pageSize) + ind
    const toppings = this.travelingform.value.data[ind].dependencies as string[];
    this.removeFirst(toppings, topping);

    const myform = (this.travelingform.get('data') as FormArray).at(ind)
    myform.patchValue({
      dependencies: toppings
    }) // To trigger change detection
  }
  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }


  hsnshow(subject) {
    return subject ? subject.code : undefined;
  }

  checkigst(ind) {
    ind = ((this.p - 1) * this.pageSize) + ind
    let myform = (this.travelingform.get('data') as FormArray).at(ind).value
    if (myform.igst != 0) {
      return true;
    }
    else {
      return false;
    }
  }
  checkscgst(ind) {
    ind = ((this.p - 1) * this.pageSize) + ind
    let myform = (this.travelingform.get('data') as FormArray).at(ind).value
    if (myform.cgst != 0 || myform.sgst != 0) {
      return true;
    }
    else {
      return false;
    }

  }

  dependshow() {
    this.dependentcheck = true
  }
  datechange(ind) {
    ind = ((this.p - 1) * this.pageSize) + ind
    let myform = this.travelingform.value.data[ind];
    let expform = (this.travelingform.get('data') as FormArray).at(ind)
    if (myform.fromdate.getDate() == myform.todate.getDate()) {
      expform.patchValue({
        totime: null
      })
    }
    // this.invaliddatestart(ind);
  }
  minselect(ind) {
    ind = ((this.p - 1) * this.pageSize) + ind
    this.maximum = this.enddate;
    if (ind == 0) {
      return this.startdate;
    }
    else if (this.travelingform.value.data[ind - 1].todate != null) {
      return this.travelingform.value.data[ind - 1].todate;
    }
    else {
      return this.maximum;
    }
  }
  invaliddatestart(ind) {
    var length = this.travelingform.value.data.length
    let myform = (this.travelingform.get('data') as FormArray).at(ind)
    myform.patchValue({
      todate: null
    })
    if (length > ind) {
      for (var i = ind + 1; i < length; i++) {
        let valuecheck = (this.travelingform.get('data') as FormArray).at(i).value;
        let changeform = (this.travelingform.get('data') as FormArray).at(i)
        if (valuecheck.fromdate != null || valuecheck.todate != null) {
          this.notification.showError('Invalid Dates in table row at ' + (i + 1))
          changeform.patchValue({
            "fromdate": null,
            "todate": null,

          })
        }

      }
    }
  }
  maxselect(ind) {
    ind = ((this.p - 1) * this.pageSize) + ind
    this.maximum = this.enddate;
    if (this.travelingform.value.data[ind].fromdate == null) {
      return this.maximum;
    }
    else {
      return this.travelingform.value.data[ind].fromdate;
    }

  }

  tktcheck(ind) {
    ind = ((this.p - 1) * this.pageSize) + ind
    let bill = this.travelingform.value.data.at(ind).tktbybank;
    if (bill == '1') {
      return true;
    }
    else {
      this.travelingform.value.data.at(ind).tktrefno = 0;
      return false;
    }
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


  createItem() {
    let group = this.formBuilder.group({
      requestercomment: this.comm,
      expensegid: 1,
      tour_id: this.expenseid,
      id: 0,
      // claimedamount:null,
      fromdate: null,
      fromtime: null,
      fromplace: null,
      todate: null,
      totime: null,
      toplace: null,
      totaltkttamt: 0,
      // tktrefno: 0,
      // tktby: '0',
      traveltype: 'Domestic',
      actualmode: null,
      eligiblemodeoftravel: "something",
      remarks: null,
      billno: null,
      // eligiblemodeoftravel: new FormControl({value:this.eligibleclass, disabled:true}),
      highermodereason: "NO",
      prior_permission: "NO",
      highermodeopted: "0",
      travelclass: null,
      // hsncode: '',
      vendorname: '',
      // vendorcode: '',
      // bankgstno: 0,
      // vendorgstno: '',
      // igst: 0,
      // cgst: 0,
      // sgst: 0,
      // entergst: false,
      // approvedamount: 0,
    });

    return group;
  }
  addSection() {
    const data = this.travelingform.get('data') as FormArray;
    data.push(this.createItem());
  }
  ticket(e) {
    this.value = e
    console.log("e", this.value)
    if (this.value == "yes") {
      this.ishidden = true
    }
    else if (this.value == "no") {
      this.ishidden = false
    }
  }
  getdepend() {
    this.taservice.eligibletravel(this.expenseid).subscribe(res => {
      this.eligibleclass = res.travelclass
      console.log(res.travelclass)
    });
    this.taservice.getdepend(this.onbehalfid)
      .subscribe(res => {
        this.dependList = res['DATA']
        if (this.dependList.length > 0) [
          this.dependentavailable = true
        ]
        console.log("dependentlist", this.dependList)
      })
  }
  getyesno() {
    this.taservice.getyesno()
      .subscribe(res => {
        this.yesnoList = res
        console.log("yesnoList", this.yesnoList)
      })
  }
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

  decs(name: HTMLElement, ind, evt) {
    let value = name.getAttribute('formControlName')
    let amt = Number(evt.target.value);
    this.travelingform.get('data')['controls'].at(ind).get(value).setValue(amt.toFixed(2))
  }

  gettravelMode() {
    this.taservice.gettravelMode()
      .subscribe(result => {
        this.travelmodelist = result
        console.log("travelmodelist", this.travelmodelist)
      })
  }

  getacttravel() {
    this.taservice.getacttravel()
      .subscribe(result => {
        // this.travelmodelist = result
        this.acttravellist = result
        console.log("VALUESS", result)
      })
  }

  classt(ind) {
    ind = ((this.p - 1) * this.pageSize) + ind
    let myform = this.travelingform.value.data[ind].actualmode

    if (myform == 'Air') {
      return this.airtravellist;
    }
    else if (myform == 'Road') {
      return this.roadtravellist;
    }
    else if (myform == 'Train') {
      return this.traintravellist;
    }
    else if (myform == 'Sea') {
      return this.seatravellist;
    }
    else {
      return []
    }

  }

  getairtravel() {
    this.taservice.getairtravelMode()
      .subscribe(result => {
        this.airtravellist = result
      })
  }
  getseatravel() {
    this.taservice.getseatravelMode()
      .subscribe(result => {
        this.seatravellist = result

      })
  }
  gettrainitravel() {
    this.taservice.gettraintravelMode()
      .subscribe(result => {
        this.traintravellist = result
      })
  }
  getbustravel() {
    this.taservice.getroadtravelMode()
      .subscribe(result => {
        this.roadtravellist = result
      })
  }

  removeSection(ind) {
    (<FormArray>this.travelingform.get('data')).removeAt(ind);
  }

  submitForm() {

    let travellist = this.travelingform.value.data

    travellist.forEach(element => {
      delete element.entergst
      // var checkfromtime = this.timelist.find(value => value.name == element.fromtime)
      // if (!checkfromtime) {
      //   this.notification.showError('Please Select Valid Departure Time')
      //   throw new Error
      // }
      // var checktotime = this.timelist.find(value => value.name == element.totime)
      // if (!checktotime) {
      //   this.notification.showError('Please Select Valid Arrival Time')
      //   throw new Error
      // }
      // element.prior_permission = element.priorpermission
      element.fromdate = this.datePipe.transform(element.fromdate, 'yyyy-MM-dd ') + element.fromtime + ':00';
      element.todate = this.datePipe.transform(element.todate, 'yyyy-MM-dd ') + element.totime + ':00';
      if (element.fromdate == null || element.fromdate == '') {
        this.notification.showError("Please select Departure Date")
        throw new Error
      }
      if (element.fromplace == null || element.fromplace == '') {
        this.notification.showError("Please Enter Depature place")
        throw new Error
      }
      if (element.toplace == null || element.toplace == '') {
        this.notification.showError("Please Enter To place")
        throw new Error
      }
      if (element.todate == null || element.todate == '') {
        this.notification.showError("Please select Arrival Date")
        throw new Error
      }
      if (element.fromtime == null || element.fromtime == '') {
        this.notification.showError("Please Select From Time")
        throw new Error
      }
      if (element.totime == null || element.totime == '') {
        this.notification.showError("Please Select To Time")
        throw new Error
      }


      element.totaltkttamt = Number(element.totaltkttamt)
      if (element.totaltkttamt == '') {
        this.notification.showError("Please Enter Claim Amount")
        throw new Error
      }
      element.fromdate = this.datePipe.transform(element.fromdate, 'yyyy-MM-dd ') + element.fromtime + ':00';
      element.todate = this.datePipe.transform(element.todate, 'yyyy-MM-dd ') + element.totime + ':00';
      if (element.id == 0) {
        delete element.id
      }
      if (element.hsncode) {
        element.hsncode = element.hsncode.code
      }
    });

    let payload = {
      "data": travellist
    }
    this.SpinnerService.show()
    this.taservice.TravelingCreate(payload)
      .subscribe(res => {
        console.log("resss", res)
        if (res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success") {
          this.notification.showSuccess("Travelling Expense Created Successfully")
          this.onSubmit.emit();
          this.SpinnerService.hide()
          // window.location.reload()
          // this.router.navigateByUrl('ta/travel');
          return true;
        }
        else {
          this.notification.showError(res.description)
          this.SpinnerService.hide()
        }
      }
      )

  }
  ApproveForm() {
    this.applist = [];
    console.log("form-app", this.travelingform.value)
    for (var i = 0; i < this.travelingform.value.data.length; i++) {
      let json = {
        "id": this.travelingform.value.data[i].id,
        "amount": this.travelingform.value.data[i].approvedamount,

      }
      this.applist.push(json)
    }
    for (var i = 0; i < this.applist.length; i++) {
      this.applist[i].amount = JSON.parse(this.applist[i].amount)

    }
    console.log("createdlist", this.applist)
    this.taservice.approver_amountupdate(this.expenseid, 1, this.applist)
      .subscribe(res => {
        console.log("incires", res)
        if (res.status === "success") {
          this.notification.showSuccess("Success....")
          this.onSubmit.emit();
          return true;
        } else {
          this.notification.showError(res.description)

        }
      })
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
  timeclone: any;
  timelist = [];
  totimelist = [];
  createtime() {
    for (var j = 0; j < 24; j++) {
      let i = String(j).padStart(2, '0')
      var t00 = { 'name': i + ':00' }
      var t15 = { 'name': i + ':15' }
      var t30 = { 'name': i + ':30' }
      var t45 = { 'name': i + ':45' }
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
      this.travelingform.get('data')['controls'].at(ind).get(controlname).setValue(null)
    }

  }
  totimechange(ind, totime) {
    ind = this.pagesize * (this.p - 1) + ind;
    let myform = this.travelingform.value.data[ind]
    if (myform.fromdate && myform.todate) {
      if (myform.fromdate < myform.todate) {

      }
      else if (myform.fromdate >= myform.todate) {
        let index = this.timelist.findIndex((item) => item.name === myform.fromtime);
        let index2 = this.timelist.findIndex((item) => item.name === totime.value);
        if (!(index2 > index)) {
          this.notification.showError('Kindly Select Time from the given dropdown')
          this.travelingform.get('data')['controls'].at(ind).get('totime').setValue(null)
        }
      }
    }


  }
  totimes(ind, totime) {
    ind = this.pageSize * (this.p - 1) + ind;
    this.totimelist = []
    let myform = this.travelingform.value.data[ind]
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



















}

