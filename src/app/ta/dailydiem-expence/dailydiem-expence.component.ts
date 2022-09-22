import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { isBoolean } from 'util';
// import { formatDate } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { ShareService } from 'src/app/ta/share.service';
import { TaService } from "../ta.service";
import { NotificationService } from '../notification.service'
import { Router } from '@angular/router';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
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






@Component({
  selector: 'app-dailydiem-expence',
  templateUrl: './dailydiem-expence.component.html',
  styleUrls: ['./dailydiem-expence.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }

  ]
})
export class DailydiemExpenceComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  dailydiem: any
  Dailydiemfromdate: any
  DailydiemTodate: any
  fromdate: any
  todate: any
  expense: any
  startdate: any
  enddate: any
  sss: any
  mindatecopy: any
  expenseid: any
  exptype: any
  comm: any
  show: boolean = true
  touridd: any
  dailyid: any
  currentpage: number = 1;
  pagesize = 10;
  depdatetime: any
  daily: any
  dd: any
  tourid = 0;
  time = '6:00 am';
  defaultValue = '6:00 am';
  citylist: any
  yesnoList: any
  // showdailydiem=true
  geteligibleamt: any
  tourdatas: any
  employeename: any
  employeegrade: any
  employeedesignation: any
  accomdation: any
  boardingbybank: any
  declaration: any
  noofleavedays: any
  enddateee: any
  startdateeee: any
  fromtimes: any
  selectedcity: any
  eligibleamount: any
  syshours: any
  //  showaccomcreate=true
  //  showaccomedit=false
  //  showboardingcreate=true
  //  showboardingedit=false
  //  showdeclarationcreate=true
  //  showdeclarationedit=false
  //  showfromtimecreate=true
  //  showfromtimeedit=false
  //  showtotimecreate=true
  //  showtotimeedit=false
  FromTimes: any
  totime: any
  getlocalexpid: any
  declareList: any
  boardingList: any
  reason: any;
  id: any;
  maximum: any;

  dailydiemform: FormGroup;
  expense_edit: any;
  expense_details: any;
  tournumb: any;
  requestercomment: any;

  isonbehalf: boolean = false;
  onbehalf_empName: any;
  maker: any;
  makerboolean: any;
  pageSize: any = 10;
  p: any = 1;
  expname: any;
  employee_grade: any;

  has_nextid: boolean = true;
  has_presentid: number = 1;
  has_previousid: boolean = false;

  start_date: any;
  end_date: any;

  centerarray: any = []
  submitarray: any = []
  approverarray: any = []
  typelist: any = []

  applevel: number = 0;
  delcareval: any = 0

  approver: boolean = false;
  newform: boolean = false;
  transferreason: boolean = false;

  statusid: any;


  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger
  @ViewChild('inputassetid') inputasset: any;
  @ViewChild('assetid') matassetidauto: MatAutocomplete;
  report: any;
  subcat: any;
  total: number;
  datelist = [];
  employeecode: any;


  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private http: HttpClient, private spinnerservice: NgxSpinnerService,
    private shareservice: ShareService, private taservice: TaService, private notification: NotificationService, private router: Router) { }
  datecopy: any
  ngOnInit(): void {

    this.expense_edit = JSON.parse(localStorage.getItem('expense_edit'));
    this.expense_details = JSON.parse(localStorage.getItem('expense_details'));

    this.report = this.expense_details.report
    this.employeecode=this.expense_details.employee_code

    this.requestercomment = this.expense_edit['requestercomment']
    this.expname = 'Daily Diem';
    this.employee_grade = this.expense_details['empgrade']

    this.start_date = this.datePipe.transform(new Date(this.expense_details.startdate), 'yyyy-MM-dd');
    this.end_date = this.datePipe.transform(new Date(this.expense_details.enddate), 'yyyy-MM-dd'); 
    this.statusid = this.expense_details.claim_status_id;
    if (this.start_date != this.end_date){
      this.start_date = new Date(this.start_date)
      
      this.end_date = new Date(this.end_date)
      this.total = this.end_date - this.start_date;
      this.total =  (Math.round(this.total) / (1000 * 60 * 60 * 24)) + 1
    }
    else{
      this.total = 1;
    }
    

    console.log(this.datelist.length)
    if (this.expense_details.applevel) {
      this.applevel = this.expense_details.applevel
    }

    this.tournumb = this.expense_details.id
    if (this.expense_details.onbehalfof) {
      this.isonbehalf = true;
      this.onbehalf_empName = '(' + this.expense_details.employee_code + ') ' + this.expense_details.employee_name
      console.log("onbehalf_empName", this.onbehalf_empName)
    } else {
      this.isonbehalf = false;
    }
    if (this.expense_details.applevel > 0) {
      this.isonbehalf = false;
      this.tournumb = this.expense_details['tourid']
      this.approver = true;
    }



    if (this.expense_details.status == 'REQUESTED') {
      this.newform = false;
    }
    // this.exptype = expensetype.expenseid

    if (this.expense_details['reason_id'] == 6 || this.expense_details['reason_id'] == 7 || this.expense_details['reason_id'] == 8) {
      this.transferreason = true;
      console.log('this.reasonid', this.expense_details['reason_id'])
    }

    if (this.expense_details.claim_status_id == 2 || this.expense_details.claim_status_id == 3 || this.expense_details.claim_status_id == 4) {
      this.approver = true;
    }




    this.dailydiemform = this.formBuilder.group({
      tourno: this.tournumb,
      employeename:this.expense_details.employee_name,
      designation: this.expense_details['empdesignation'],
      employeegrade: this.expense_details['empgrade'],
      data: new FormArray([])
    })


    this.getcityValue();
    this.getcitylist();
    // this.getsubcat();
    this.getaccomodation();
    this.createtime();
    // this.getdeclarations();
    this.getboardings();
    this.existingdata(this.tournumb);
  }

  getcitylist() {

    // this.taservice.getcitylist('', 1, '', '')
    //   .subscribe(result => {
    //     this.citylist = result['data']

    //   })

  }

  getsubcat() {
    this.taservice.getsubcat().subscribe(result => {
      this.subcat = result
    })
  }

  getaccomodation() {
    // this.taservice.getyesno()
    //   .subscribe(res => {
    //     this.yesnoList = res
    //     console.log("yesnoList", this.yesnoList)
    //   })
  }
  public accomvalueMapper = (value) => {
    let selection = this.yesnoList.find(e => {
      return e.value == value;
    });
    if (selection) {
      return selection.name;
    }
  };
  getdeclarations() {
    // this.taservice.getyesno()
    //   .subscribe(res => {
    //     this.declareList = res
    //     // console.log("yesnoList",this.declareList)
    //   })
  }
  public declarevalueMapper = (value) => {
    let selection = this.declareList.find(e => {
      return e.value == value;
    });
    if (selection) {
      return selection.name;
    }
  };
  getboardings() {
    this.taservice.getyesno()
      .subscribe(res => {
        this.boardingList = res
        // console.log("yesnoList",this.boardingList)
      })
  }
  public boardingvalueMapper = (value) => {
    let selection = this.boardingList.find(e => {
      return e.value == value;
    });
    if (selection) {
      return selection.name;
    }
  };
  removeSection(i, data) {
    this.taservice.deletedailydeim(data.id)
      .subscribe(res => {
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
      }
      )

    this.dailydiem.data.splice(i, 1);
    // console.log("bb",this.fromdate)
  }



  ftime: any
  ttime: any
  dt: any
  td: any
  tt: any
  fdt: any
  tdt: any
  aa: any
 
  minselects(ind) {

    if (ind == 0) {
      return this.Dailydiemfromdate;
    }
    else {
      return this.dailydiem.data[ind - 1].todate;

    }
  }
  maxselects(ind) {

    if (this.dailydiem.data[ind].fromdate == null) {
      return;
    }
    else {
      return this.dailydiem.data[ind].fromdate
    }

  }

  eligcheck(ind) {
    ind = this.pageSize * (this.p - 1) + ind;
    let amount = this.dailydiemform.value.data[ind].eligibleamount
    if (amount > 0) {
      return false
    }
    else {
      return true
    }
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

  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 62 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || k== 33 || (k >= 44 && k <= 58));
  }


  GlobalIndex(i) {
    let dat = this.pageSize * (this.p - 1) + i;
    return dat
  }


  createnewitem(): FormGroup {



    let datasarray = this.formBuilder.group({
      tour_id: this.tournumb,
      claimedamount: 0,
      requestercomment: this.requestercomment,
      city: null,
      fromdate: null,
      fromtime:null,
      totime:null,
      todate: null,
      syshours: 5,
      noofhours: new FormControl({ value: 10, disabled: true }),
      expensegid: 2,
      eligibleamount: null,
      boardingbyorganiser: "NO",
      billno: null,
      remarks: null,
      visitcity: null,
      noofdays: new FormControl({ value: null, disabled: true }),
      citytype: 'Domestic',
      foodallowance: 0,
      medicalexpense: 0,

    });

    return datasarray;
  }

  createnewitemarray(): FormGroup {
    let datasarray1 = this.formBuilder.group({
      tour_id: this.tournumb,
      claimedamount: null,
      subcat: "",
      requestercomment: this.requestercomment,
      city: null,
      fromdate: this.start_date,
      boardingbyorganiser: "0",
      todate: this.start_date,
      syshours: null,
      noofhours: null,
      foodallowance: null,
      medicalexpense: null,
      // isleave: 0,
      // accbybank: "0",
      // boardingbybank: "0",
      declaration: "0",
      expensegid: 2,
      billno: null,
      remarks: null,
      eligibleamount: null,
      citytype: null,
    });

    return datasarray1;
  }

  adddata() {
    const data = this.dailydiemform.get('data') as FormArray;
    data.push(this.createnewitem());
    console.log(this.dailydiemform.value.data)
  }

  adddata1() {
    const data = this.dailydiemform.get('data') as FormArray;
    data.push(this.createnewitemarray());
    console.log(this.dailydiemform.value.data)
  }

  indexdelete(i) {
    let ind = this.pageSize * (this.p - 1) + i;
    const control = <FormArray>this.dailydiemform.controls['data'];
    control.removeAt(ind)
  }

  getcityValue() {
    this.taservice.getcitytype().subscribe(result => {
      this.typelist = result
    })

    this.taservice.getcitylist('', 1)
      .subscribe(result => {
        this.citylist = result['data']

      })

  }
  checkcity(ind) {
    ind = this.pageSize * (this.p - 1) + ind
    let value = this.dailydiemform.value.data[ind].citytype
    if (value == 'Domestic') {
      return this.citylist
    }
    else {
      return []
    }
  }

  citysearch(ind, event) {
    // let present = this.dailydiemform.value.visitcity
    // if (present) {
    //   var formvalue = this.dailydiemform.value.visitcity
    // }
    // else {
    //   var formvalue = null
    // }

    let value = event.target.value
    this.taservice.getcitylist(value, 1)
      .subscribe(result => {
        this.citylist = result['data']
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

            if (this.has_nextid) {
              this.taservice.getcitylist(this.inputasset.nativeElement.value, this.has_presentid + 1).subscribe(data => {
                let dts = data['data'];
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


  minselect(ind) {
    
    return  this.datePipe.transform( this.datelist[ind], 'yyyy-MM-ddThh:mm');
  }

  maxselect(ind) {
    let date = this.datePipe.transform(this.datelist[ind],'yyyy-MM-ddTHH:mm')
    return date
  }
  invaliddatestart(ind) {
    var length = this.dailydiemform.value.data.length
    let myform = (this.dailydiemform.get('data') as FormArray).at(ind)
    myform.patchValue({
      todate: null
    })
    if (length > ind) {
      for (var i = ind + 1; i < length; i++) {
        let valuecheck = (this.dailydiemform.get('data') as FormArray).at(i).value;
        let changeform = (this.dailydiemform.get('data') as FormArray).at(i)
        if (valuecheck.fromdate != null || valuecheck.todate != null) {
          this.notification.showError('Invalid Dates in table row at ' + (i + 1))
          changeform.patchValue({
            "lodgcheckoutdate": null,
            "fromdate": null,
            "todate": null,
            'eligibleamount': null,
            'noofday': null
          })
        }

      }
    }
  }

  datechange(ind) {
    ind = this.pageSize * (this.p - 1) + ind;
    let myform = this.dailydiemform.value.data[ind];
    let expform = (this.dailydiemform.get('data') as FormArray).at(ind)
    if(myform.fromdate.getDate() == myform.todate.getDate()){
      expform.patchValue({
        totime:null
      })
    }
    this.invaliddateend(ind);
  }

  invaliddateend(ind) {
    var length = this.dailydiemform.value.data.length
    if (length > ind) {

      for (var i = ind + 1; i < length; i++) {
        let valuecheck = (this.dailydiemform.get('data') as FormArray).at(i).value;
        let changeform = (this.dailydiemform.get('data') as FormArray).at(i)
        if (valuecheck.fromdate != null || valuecheck.todate != null) {
          this.notification.showError('Invalid Dates in table row at ' + (i + 1))
          changeform.patchValue({
            "lodgcheckoutdate": null,
            "fromdate": null,
            "todate": null,
            'eligibleamount': null,
            'noofday': null
          })
        }
      }
    }
  }

  exceednot(i) {
    let ind = this.pageSize * (this.p - 1) + i;
    let myform = this.dailydiemform.value.data[ind]
    if (Number(myform.claimedamount) > Number(myform.eligibleamount)) {
      this.notification.showWarning('You are exceeding the eligible amount, please enter your remarks')
    }
  }

  limitcheck(i) {
    let ind = this.pageSize * (this.p - 1) + i;
    let myform = this.dailydiemform.value.data[ind]
    // console.log(myform)
    if (myform.claimedamount > myform.eligibleamount) {

      return true;
    }
    else {

      return false;
    }

  }

  geteligibleamount(i) {
    if (this.centerarray.length >= 1) {
      this.centerarray.splice(0, this.centerarray.length)
    }
    let ind = this.pageSize * (this.p - 1) + i;
    const detailframe = this.dailydiemform.value.data[ind]
    if (detailframe.tour_id && detailframe.fromtime && detailframe.totime && detailframe.citytype) {
      this.centerarray = {
        citytype: detailframe.citytype,
        // accbybank: detailframe.accbybank,
        boardingbyorganiser: detailframe.boardingbyorganiser,
        // declaration: detailframe.declaration,
        // isleave: detailframe.isleave,
        fromdate: detailframe.fromdate,
        todate: detailframe.todate,
        tourgid: detailframe.tour_id,
        expensegid: 2,
      }
      console.log('ecnterarray', this.centerarray)
    }
    else {
      return false;

    }
    // this.spinnerservice.show()
    this.centerarray.fromdate = this.datePipe.transform(detailframe.fromdate, 'yyyy-MM-dd ') + detailframe.fromtime + ':00';
    this.centerarray.todate = this.datePipe.transform(detailframe.todate, 'yyyy-MM-dd ') + detailframe.totime + ':00';
    console.log("eligible", this.centerarray)
    let value1 = new Date(this.centerarray.fromdate)
    let value2 = new Date(this.centerarray.todate)
    if (value2 <= value1) {
      return false;
    }
    if (detailframe.tour_id && detailframe.fromdate && detailframe.todate && detailframe.citytype) {
     
      this.taservice.dailydeimligibleamt(this.centerarray)
        .subscribe(result => {
          console.log("resutl", result)
          let eligible = result['Eligible_amount']
          let sys_hours = result['noofhours']
          let days = result['noofdays']
          const myform = (this.dailydiemform.get('data') as FormArray).at(ind)
          myform.patchValue({
            "eligibleamount": eligible,
            "noofhours": sys_hours,
            "noofdays": days,

          })
          if (sys_hours < 9) {
            this.notification.showError("Minimum 9 Hours Required For Eligible")
          }
          this.exceednot(ind)
        })

    }
  }

  submitapi(data) {
    this.spinnerservice.show()
    this.taservice.DailydiemCreate(data)
      .subscribe(res => {
        console.log("dailydeimres", res)
        this.spinnerservice.hide()
        if (res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success") {
          this.notification.showSuccess("Daily Reimbursment Created Successfully...")
          
          this.router.navigateByUrl('ta/exedit')
          this.onSubmit.emit();
          return true;
        }

        else {
          this.notification.showError(res.description)
          return false;
        }
      }
      )
  }

  submitfunction() {
    if (this.submitarray.length >= 1) {
      // this.submitarray.splice(0, this.submitarray.length)
      this.submitarray = []
    }
    console.log('array before', this.submitarray)


    this.submitarray = this.dailydiemform.value.data

    console.log('array after', this.submitarray)



    for (let i = 0; i < this.submitarray.length; i++) {

      // if (this.submitarray[i].city == null || this.submitarray[i].city == '') {
      //   this.notification.showError('Please select City')
      //   throw new Error
      // }

      if (this.submitarray[i].fromdate == null || this.submitarray[i].fromdate == '') {
        this.notification.showError('Please choose Start Date')
        throw new Error
      }
      if (this.submitarray[i].todate == null || this.submitarray[i].todate == '') {
        this.notification.showError('Please choose End Date')
        throw new Error
      }
      if (this.submitarray[i].fromtime == null || this.submitarray[i].fromtime ==''  ) {
        this.notification.showError('Please Choose From Time')
        throw new Error

      }

      if (this.submitarray[i].totime == null ||  this.submitarray[i].totime =='' ) {

        this.notification.showError('Please Chooese To Time')
        throw new Error

      }
      // if (this.submitarray[i].claimedamount == null || this.submitarray[i].claimedamount == '') {
      //   this.notification.showError('Please enter Claimed Amount')
      //   throw new Error
      // }
      if (Number(this.submitarray[i].claimedamount) > Number(this.submitarray[i].eligibleamount) && this.submitarray[i].remarks == null) {
        this.notification.showError('Please Enter Remarks for Limit Exceeding')
        throw new Error
      }
      // if (this.submitarray[i].accbybank == null || this.submitarray[i].accbybank == '') {
      //   this.notification.showError('Please select Accomodation provided by Bank')
      //   throw new Error
      // }
      // if (this.submitarray[i].boardingbybank == null || this.submitarray[i].boardingbybank == '') {
      //   this.notification.showError('Please select Boarding provided by Bank')
      //   throw new Error
      // }
      // if (this.submitarray[i].declaration == null || this.submitarray[i].declaration == '') {
      //   this.notification.showError('Please enter Declaration')
      //   throw new Error
      // }



      //validation over
      this.submitarray[i].noofdays = this.submitarray[i].noofhours
      if (this.submitarray[i].claimedamount) {
        this.submitarray[i].claimedamount = JSON.parse(this.submitarray[i].claimedamount)
        this.submitarray[i].medicalexpense = Number(this.submitarray[i].medicalexpense)
        this.submitarray[i].foodallowance = Number(this.submitarray[i].foodallowance)
      }
      if (this.submitarray[i].fromdate) {
        this.submitarray[i].fromdate = this.datePipe.transform(this.submitarray[i].fromdate, 'yyyy-MM-dd ') + this.submitarray[i].fromtime + ':00';
      }
      if (this.submitarray[i].todate) {
        this.submitarray[i].todate = this.datePipe.transform(this.submitarray[i].todate, 'yyyy-MM-dd ') + this.submitarray[i].totime + ':00';
      }
    }

    let obj = {
      data: this.submitarray
    }
    console.log('apiobj', obj)


    this.submitapi(obj)



  }

  decs(name: HTMLElement,ind,evt){
    let value = name.getAttribute('formControlName')
    let amt =Number(evt.target.value);
    this.dailydiemform.get('data')['controls'].at(ind).get(value).setValue(amt.toFixed(2))
  }

  getpatchdeclare(i) {
    let ind = this.pageSize * (this.p - 1) + i;

    if (this.dailydiemform.value.data[ind].accbybank == '1' && this.dailydiemform.value.data[ind].boardingbybank == '1') {

      this.dailydiemform.get('data')['controls'][ind].get('declaration').setValue('0')

    }




  }

  claimpatch(i) {
    let ind = this.pageSize * (this.p - 1) + i;
    let myform = this.dailydiemform.value.data[ind]
    let food = Number(myform.foodallowance)
    let med = Number(myform.medicalexpense)
    let value = med + food
    this.dailydiemform.get('data')['controls'][i].patchValue({
      claimedamount: value.toFixed(2)
    })
    this.exceednot(i)
  }

  existingdata(data) {

    this.spinnerservice.show()
    this.taservice.getdailydiemeditSummary(data)
      .subscribe(results => {
        this.spinnerservice.hide()
        

        console.log('existing data', results)
        let datas = results['data']
        let variable = results['requestercomment']
        console.log(results)
        for (let i = 0; i < datas.length; i++) {
          let value1 = new Date(datas[i].fromdate)
        let value2 = new Date(datas[i].todate)
        datas[i].fromtime = String(value1.getHours()).padStart(2, '0') + ':' + String(value1.getMinutes()).padStart(2, '0')
        datas[i].totime = String(value2.getHours()).padStart(2, '0') + ':' + String(value2.getMinutes()).padStart(2, '0')
          let array = this.formBuilder.group({
            id: datas[i]['id'],
            tour_id: datas[i]['tour_id'],
            expensegid: 2,
            city: datas[i]['city'],
            fromdate: this.datePipe.transform(datas[i].fromdate, 'yyyy-MM-dd'),
            todate: this.datePipe.transform(datas[i].todate, 'yyyy-MM-dd'),
            noofdays: datas[i]['noofdays'],
            noofhours: datas[i]['noofhours'],
            isleave: datas[i]['isleave'],
            eligibleamount: datas[i]['eligibleamount'],
            fromtime:datas[i].fromtime,
            totime:datas[i].totime,
            claimedamount: datas[i]['claimedamount'].toFixed(2),
            visitcity: datas[i]['visitcity'],
            citytype: datas[i]['citytype'],
            billno: datas[i]['billno'],
            remarks: datas[i]['remarks'],
            foodallowance: datas[i]['foodallowance'].toFixed(2),
            medicalexpense: datas[i]['medicalexpense'].toFixed(2),
            // accbybank: datas[i]['accbybank']['value'].toString(),
            // boardingbybank: datas[i]['boardingbybank']['value'].toString(),
            // declaration: datas[i]['declaration']['value'].toString(),
            requestercomment: variable,
            boardingbyorganiser: datas[i]['boardingbyorganiser'],
          })
          // if (this.maker) {
          //   delete array['approvedamount']
          // }
          const docu = this.dailydiemform.get('data') as FormArray;
          docu.push(array)

        }
        for (var i = 0; i < this.total; i++) {
          let date = new Date(this.start_date)
          let second = new Date(date.setDate(date.getDate() + i));
          var seconds = this.datePipe.transform(second, 'yyyy-MM-dd')
          this.datelist.push(second)
        }


        // if (!this.transferreason) {
        if (this.dailydiemform.value.data.length == 0) {
          this.adddata()
          this.datelist =[];
          for (var i = 0; i < this.total; i++) {
            if(i>0){
              this.adddata()
            }
            let date = new Date(this.start_date)
            let second = new Date(date.setDate(date.getDate() + i));
            var seconds = this.datePipe.transform(second, 'yyyy-MM-dd')
            let myform = (this.dailydiemform.get('data') as FormArray).at(i)
            myform.patchValue({
              fromdate:second,
              todate: second,
              fromtime:this.timelist[0].name,
              totime:this.timelist[40].name
            })
            this.datelist.push(seconds)
          }
        }
        // }
        // else {
        //   if (this.dailydiemform.value.data.length == 0) {
        //     this.adddata1()
        //   }
        // }
        
      });
    this.notification.showInfo(" CEO's approval email attachment - is mandatory if Alcohol / Tobacco is included in the bill.");
  }


  numberOnly(event) {
    return (event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46 ||event.charCode == 58 )
  }
  approverupdate(tourno, expid, approvearray) {
    this.taservice.approver_amountupdate(tourno, expid, approvearray)
      .subscribe(res => {
        console.log("incires", res)
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

  Approve() {
    this.approverarray.splice(0, this.approverarray.length)

    for (let i = 0; i < this.dailydiemform.value.data.length; i++) {
      let json = {
        "id": this.dailydiemform.value.data[i].id,
        "amount": JSON.parse(this.dailydiemform.value.data[i].approvedamount),
      }
      this.approverarray.push(json)

    }
    this.approverupdate(this.dailydiemform.value.tourno, 2, this.approverarray)
  }

  limit(e, i) {
    // let ind = this.pageSize * (this.p - 1) + i;
    // let val=e.target.value
    // let check=this.dailydiemform.value.data[ind].syshours
    // if (Number(val) > Number(check)) {
    //   e.target.value = ''
    // }
  }

  keyPressAmounts(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[0-9.]/.test(inp) || event.keyCode == 32) {
      return true;
    }
    else {
      event.preventDefault();
      return false;

    }
  }

  space(e) {
    if (e.target.selectionStart === 0 && e.code === 'Space') {
      e.preventDefault();
    }
  }

  nospace(e) {
    if (e.code === 'Space') {
      e.preventDefault();
    }
  }

  zero(e) {
    let a = ''
    if (e.code == 'Digit0') {
      a = a + e.target.value
      if (a == "0") {
        e.preventDefault();
        console.log('hello')
      }

    }
    if (e.code == 'Period') {
      a = a + e.target.value
      if (a.includes(".")) {
        e.preventDefault()
      }
    }
  }
  timeclone: any;
  timelist = [];
  totimelist = [];
  createtime() {
    for (var j = 0; j < 24; j++) {
        let i  = String(j).padStart(2, '0')
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
      this.dailydiemform.get('data')['controls'].at(ind).get(controlname).setValue(null)
    }

  }
  totimechange(ind, totime) {
    ind = this.pagesize * (this.p - 1) + ind;
    let myform = this.dailydiemform.value.data[ind]
    if (myform.fromdate && myform.todate) {
      if (myform.fromdate < myform.todate) {

      }
      else if (myform.fromdate >= myform.todate) {
        let index = this.timelist.findIndex((item) => item.name === myform.fromtime);
        let index2 = this.timelist.findIndex((item) => item.name === totime.value);
        if (!(index2 > index)) {
          this.notification.showError('Kindly Select Time from the given dropdown')
          this.dailydiemform.get('data')['controls'].at(ind).get('totime').setValue(null)
        }
      }
    }


  }
  totimes(ind,totime) {
    ind = this.pageSize * (this.p - 1) + ind;
    this.totimelist  = []
    let myform = this.dailydiemform.value.data[ind]
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
