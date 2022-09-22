import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { isBoolean } from 'util';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import { TaService } from "../ta.service";
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/service/shared.service';
import { ActivatedRoute, Router } from "@angular/router";
import { ShareService } from 'src/app/ta/share.service';
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
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'app-incidental-expence',
  templateUrl: './incidental-expence.component.html',
  styleUrls: ['./incidental-expence.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class IncidentalExpenceComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  incidental: any
  expenseid: any
  exptype: any
  comm: any
  comm1: any
  expID: any;
  incigeid: any
  tourno: any
  ModeOFList: any
  onwardList: any
  geteligibleamt: any
  tourdatas: any
  employeename: any
  employeegrade: any
  employeedesignation: any
  getelgamt: any
  single_fare: any
  gettravelmodes: any
  getreturnchange: any
  travelhours: any
  getlocalexpid: any
  onwardreturn: any
  getincidentaldata: any
  getsamedayreturn: any
  indexid: any
  getreturn: any
  currentpage: number = 1;
  pagesize = 10;
  acc: any;
  event: any;
  incidentalform: FormGroup
  reason: any;
  onbehalf_empName: any;
  isonbehalf = false;
  isApprovedAmt = false;
  isApproveButton = false;
  isSumbitButton = true;
  addIncidentalButton = false
  isMakerAction = true;
  eligibleamount: any;
  is_modetrvl = false;
  is_onwdretn = false;
  is_travelhr = false;
  is_singlefare = false;
  tourid: any
  applevel: Number = 0;
  report: any;
  statuid: any;
  // applevel=0;

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private http: HttpClient,
    private notification: NotificationService, private taservice: TaService, private SpinnerService: NgxSpinnerService,
    public sharedService: SharedService, private route: Router, private activatedroute: ActivatedRoute,
    private shareservice: ShareService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    let expensetype = JSON.parse(localStorage.getItem('expense_edit'));
    let expensedetails = JSON.parse(localStorage.getItem('expense_details'));
    this.statuid = expensedetails.claim_status_id
    this.report =expensedetails.report

    let list: any = expensedetails
    let data_reqcom: any = expensetype
    if (expensedetails.onbehalfof) {
      this.isonbehalf = true;
      this.onbehalf_empName = '(' + expensedetails.employee_code + ') ' + expensedetails.employee_name
      console.log("onbehalf_empName", this.onbehalf_empName)
    } else {
      this.isonbehalf = false;
    }

    if (expensedetails.applevel == 2 || expensedetails.applevel == 1) {
      this.isonbehalf = false;
      this.tourid = expensedetails['tourid']
    }
    this.applevel = list.applevel;
    if (list.applevel == 2 || list.applevel == 1) {
      this.isApproveButton = true
      this.isApprovedAmt = true;
      this.isSumbitButton = false
      this.addIncidentalButton = true
      this.isMakerAction = false
      this.is_modetrvl = true;
      this.is_onwdretn = true;
      this.is_travelhr = true;
      this.is_singlefare = true;
      this.isonbehalf = false;


      this.employeename = '(' + list.employee_code + ') ' + list.employee_name
      this.employeegrade = list.empgrade
      this.employeedesignation = list.empdesignation
      this.comm1 = data_reqcom.requestercomment;
      // this.exptype=expensetype.expenseid
      this.tourid = list.tourid
      this.expenseid = this.tourid
      // this.reason = list.reason_id;




      this.taservice.getincidentaleditSummary(this.tourid).subscribe(res => {
        let incidentallist = res['data'];
        console.log("incidental list", incidentallist)
        var length = incidentallist.length;
        for (var i = 0; i < length; i++) {
          if (i > 0) {
            this.addSet();
          }
          incidentallist[i].travel_mode = String(incidentallist[i].travel_mode.value)
          incidentallist[i].same_day_return = String(incidentallist[i].same_day_return.value)
          incidentallist[i].amount = String(incidentallist[i].approvedamount)
        }
        if (incidentallist.length != 0) {
          this.incidentalform.patchValue({
            data: incidentallist
          })
        }
      })
    } else {
      this.employeename = '(' + expensedetails.employee_code + ') ' + expensedetails.employee_name
      this.employeegrade = expensedetails.empgrade
      this.employeedesignation = expensedetails.empdesignation
      this.comm1 = expensetype.requestercomment;
      this.exptype = expensetype.expenseid
      this.expenseid = expensedetails.id
      this.reason = expensedetails.reason_id;




      this.taservice.getincidentaleditSummary(this.expenseid).subscribe(res => {
        let incidentallist = res['data'];
        console.log("incidental list", incidentallist)
        var length = incidentallist.length;
        for (var i = 0; i < length; i++) {
          if (i > 0) {
            this.addSet();
          }
          incidentallist[i].travel_mode = String(incidentallist[i].travel_mode.value)
          incidentallist[i].same_day_return = String(incidentallist[i].same_day_return.value)
          incidentallist[i].amount = Number(incidentallist[i].approvedamount)
        }
        if (incidentallist.length != 0) {
          this.incidentalform.patchValue({
            data: incidentallist
          })
        }
      })
    }
    if(list.applevel == 1){
      this.isApproveButton = false;
      this.isApprovedAmt = false;
      this.isSumbitButton = false
      this.addIncidentalButton = true;
      this.isMakerAction = false
      this.is_modetrvl = true;
      this.is_onwdretn = true;
      this.is_travelhr = true;
      this.is_singlefare = true;
      this.isonbehalf = false;
    }

    this.incidentalform = this.formBuilder.group({
      data: new FormArray([
        this.createItem(),

      ]),
      // data: new FormArray([]),
    });

    this.gettravelmode()
    this.getonwardreturn()

  }
  //   onKeypressEvent(value){

  //     console.log(value);
  //     if(this.acc=="YES"){
  //       if(value<24){

  //       }
  //       else{
  //         value=""
  //       }
  //      }


  //  }
  //   getAcc(value){
  //     this.acc = value
  //     console.log("acc",this.acc)
  //   }

  gettravelmode() {
    this.taservice.getincidentaltravelmode()
      .subscribe(res => {
        this.ModeOFList =  res;
        this.ModeOFList.forEach(element => {
          element.name = element.name.toUpperCase( )
        });
      })

  }

  getonwardreturn() {
    this.taservice.getyesno()
      .subscribe(res => {
        this.onwardList = res
        console.log("onwlist", this.onwardList)

      })
  }
  getValue: any;
  onwardReturnChange(e) {
    this.getValue = e
    console.log("getValue", this.getValue)
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
  pageSize = 10;
  presentpage = 1;
  fieldGlobalIndex(index) {
    let dat = this.pageSize * (this.presentpage - 1) + index;
    return dat
  }

  detailsframe: any;
  modeoftravelchange(ind) {
    console.log("INDDD", ind)
    const detailframe = this.incidentalform.value.data[ind]
    if (detailframe.travel_mode && detailframe.same_day_return && detailframe.travel_hours && detailframe.single_fare) {
      this.detailsframe = {
        expense_id: 3,
        travel_mode: detailframe.travel_mode,
        same_day_return: detailframe.same_day_return,
        travel_hours: detailframe.travel_hours,
        single_fare: detailframe.single_fare
      }
    }
    else {
      return false;
    }

    this.SpinnerService.show()
    this.taservice.Incidentaleligibleamt(this.detailsframe)
      .subscribe(result => {
        console.log("res", result)
        const myform = (this.incidentalform.get('data') as FormArray).at(ind)
        console.log("new", myform)
        this.SpinnerService.hide()
        // if (myform.value.accbybank == 1){
        //   var elgamt = 0;
        // }
        // else{
        //   var elgamt = Number(result['Eligible_amount'])
        // }

        // var noofday = result['noofdays']
        // this.maxdayslimit = noofday
        myform.patchValue({
          "eligibleamount": result.elgibleamount,

        })
      })
  }


  onwardreturnchange(ind) {

    if (this.incidentalform.value.data[ind].same_day_return == '1') {
      if(this.incidentalform.value.data[ind].travel_hours > 24 ){
        const myform=(this.incidentalform.get('data') as FormArray).at(ind)
        myform.patchValue({
          "travel_hours":null
        })
      }
     
    }

    console.log("INDDD", ind)
    const detailframe = this.incidentalform.value.data[ind]
    if (detailframe.travel_mode && detailframe.same_day_return && detailframe.travel_hours && detailframe.single_fare) {
      this.detailsframe = {
        expense_id: 3,
        travel_mode: detailframe.travel_mode,
        same_day_return: detailframe.same_day_return,
        travel_hours: detailframe.travel_hours,
        single_fare: detailframe.single_fare
      }
    }
    else {
      return false;
    }

    this.SpinnerService.show()
    this.taservice.Incidentaleligibleamt(this.detailsframe)
      .subscribe(result => {
        console.log("res", result)
        const myform = (this.incidentalform.get('data') as FormArray).at(ind)
        this.SpinnerService.hide()
        // if (myform.value.accbybank == 1){
        //   var elgamt = 0;
        // }
        // else{
        //   var elgamt = Number(result['Eligible_amount'])
        // }

        // var noofday = result['noofdays']
        // this.maxdayslimit = noofday
        myform.patchValue({
          "eligibleamount": result.elgibleamount,

        })
      })
      


  }


  traveltimechange(ind) {
    console.log("INDDD", ind)
    const detailframe = this.incidentalform.value.data[ind]
    if (detailframe.travel_mode && detailframe.same_day_return && detailframe.travel_hours && detailframe.single_fare) {
      this.detailsframe = {
        expense_id: 3,
        travel_mode: detailframe.travel_mode,
        same_day_return: detailframe.same_day_return,
        travel_hours: detailframe.travel_hours,
        single_fare: detailframe.single_fare
      }
    }
    else {
      return false;
    }

    this.SpinnerService.show()
    this.taservice.Incidentaleligibleamt(this.detailsframe)
      .subscribe(result => {
        console.log("res", result)
        const myform = (this.incidentalform.get('data') as FormArray).at(ind)
        this.SpinnerService.hide()
        // if (myform.value.accbybank == 1){
        //   var elgamt = 0;
        // }
        // else{
        //   var elgamt = Number(result['Eligible_amount'])
        // }

        // var noofday = result['noofdays']
        // this.maxdayslimit = noofday
        myform.patchValue({
          "eligibleamount": result.elgibleamount,

        })
      })
  }



  singlefarechange(ind) {
    console.log("INDDD", ind)
    const detailframe = this.incidentalform.value.data[ind]
    if (detailframe.travel_mode && detailframe.same_day_return && detailframe.travel_hours && detailframe.single_fare) {
      this.detailsframe = {
        expense_id: 3,
        travel_mode: detailframe.travel_mode,
        same_day_return: detailframe.same_day_return,
        travel_hours: detailframe.travel_hours,
        single_fare: detailframe.single_fare
      }
    }
    else {
      return false;
    }

    this.SpinnerService.show()
    this.taservice.Incidentaleligibleamt(this.detailsframe)
      .subscribe(result => {
        console.log("res", result)
        const myform = (this.incidentalform.get('data') as FormArray).at(ind)
        this.SpinnerService.hide()
        // if (myform.value.accbybank == 1){
        //   var elgamt = 0;
        // }
        // else{
        //   var elgamt = Number(result['Eligible_amount'])
        // }

        // var noofday = result['noofdays']
        // this.maxdayslimit = noofday
        myform.patchValue({
          "eligibleamount": result.elgibleamount,

        })
      })
  }

  applist = [];
  incidentalApproveButton() {
    this.applist = [];
    console.log("form-app", this.incidentalform.value)
    for (var i = 0; i < this.incidentalform.value.data.length; i++) {
      // this.incidentalform.value.data[i].same_day_return = JSON.parse(this.incidentalform.value.data[i].same_day_return)
      // this.incidentalform.value.data[i].travel_hours = JSON.parse( this.incidentalform.value.data[i].travel_hours)
      // this.incidentalform.value.data[i].single_fare = JSON.parse( this.incidentalform.value.data[i].single_fare)
      // if (this.incidentalform.value.data[i].id == 0){
      //   delete this.incidentalform.value.data[i].id;
      // }
      let json = {
        "id": this.incidentalform.value.data[i].id,
        "amount": this.incidentalform.value.data[i].amount,

      }
      this.applist.push(json)
    }
    for (var i = 0; i < this.applist.length; i++) {
      this.applist[i].amount = JSON.parse(this.applist[i].amount)

    }
    console.log("createdlist", this.applist)
    this.taservice.approver_Incidental(this.applist, this.expenseid)
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
  //   public valueMapper = (value) => {
  //     let selection = this.onwardList.find(e => {
  //       return e.value == value;
  //     });
  //     if (selection){
  //       return selection.name;
  //     }
  //   };

  //   ontravelChange(e, index) {
  //     let indexid = index.id
  //     const indexx = this.incidental.data.findIndex(fromdata => fromdata.id === indexid)
  //     this.gettravelmodes = e
  //     this.geteligibleamt = {
  //       expense_id: 3,
  //       travel_mode: this.gettravelmodes,
  //       travel_hours: this.travelhours,
  //       same_day_return: this.getsamedayreturn,
  //       single_fare: this.single_fare
  //     }

  //     if (this.gettravelmodes === undefined) {
  //       this.geteligibleamt.travel_mode = this.incidental.data[indexx].travel_mode
  //     } else {
  //       this.geteligibleamt.travel_mode = this.gettravelmodes
  //     }
  //     if (this.travelhours === undefined) {
  //       this.geteligibleamt.travel_hours = this.incidental.data[indexx].travel_hours
  //     } else {
  //       this.geteligibleamt.travel_hours = this.travelhours
  //     }
  //     if (this.single_fare === undefined) {
  //       this.geteligibleamt.single_fare = this.incidental.data[indexx].single_fare
  //     } else {
  //       this.geteligibleamt.single_fare = this.single_fare
  //     }
  //     if (this.getsamedayreturn === undefined) {
  //       this.geteligibleamt.same_day_return = this.incidental.data[indexx].same_day_return
  //     }
  //     else {
  //       this.geteligibleamt.same_day_return = this.getsamedayreturn
  //     }

  //     if (indexid != undefined) {
  //       if (this.geteligibleamt.expense_id != undefined && this.geteligibleamt.travel_mode != undefined && this.geteligibleamt.travel_hours != undefined
  //         && this.geteligibleamt.same_day_return != undefined && this.geteligibleamt.single_fare != undefined) {
  //         this.taservice.Incidentaleligibleamt(this.geteligibleamt)
  //           .subscribe(res => {
  //             this.getelgamt = res['elgibleamount']
  //             this.incidental.data[indexx].eligibleamount = this.getelgamt


  //           }
  //           )
  //       }
  //     }

  //     else {
  //       if ((this.geteligibleamt.expense_id != undefined && this.geteligibleamt.expense_id != "") &&
  //         (this.geteligibleamt.travel_mode != undefined && this.geteligibleamt.travel_mode != "") &&
  //         (this.geteligibleamt.travel_hours != undefined && this.geteligibleamt.travel_hours != "") &&
  //         (this.geteligibleamt.same_day_return != undefined && this.geteligibleamt.same_day_return != "") &&
  //         (this.geteligibleamt.single_fare != undefined && this.geteligibleamt.single_fare != "")) {
  //         this.taservice.Incidentaleligibleamt(this.geteligibleamt)
  //           .subscribe(res => {
  //             this.getelgamt = res['elgibleamount']
  //             const indexes = this.incidental.data.findIndex(fromdata => fromdata.ids === index.ids)
  //             this.incidental.data[indexes].eligibleamount = this.getelgamt

  //           }
  //           )
  //       }

  //     }
  //   }

  //   onreturnChange(data, index) {
  //     let indexid = index.id
  //     this.getsamedayreturn = JSON.parse(data)
  //     const indexx = this.incidental.data.findIndex(fromdata => fromdata.id === indexid)
  //     this.geteligibleamt = {

  //       expense_id: 3,
  //       travel_mode: this.gettravelmodes,
  //       travel_hours: this.travelhours,
  //       same_day_return: this.getsamedayreturn,
  //       single_fare: this.single_fare
  //     }
  //     if (this.gettravelmodes === undefined) {
  //       this.geteligibleamt.travel_mode = this.incidental.data[indexx].travel_mode
  //     } else {
  //       this.geteligibleamt.travel_mode = this.gettravelmodes
  //     }
  //     if (this.travelhours === undefined) {
  //       this.geteligibleamt.travel_hours = this.incidental.data[indexx].travel_hours
  //     } else {
  //       this.geteligibleamt.travel_hours = this.travelhours
  //     }
  //     if (this.single_fare === undefined) {
  //       this.geteligibleamt.single_fare = this.incidental.data[indexx].single_fare
  //     } else {
  //       this.geteligibleamt.single_fare = this.single_fare
  //     }
  //     if (this.getsamedayreturn === undefined) {
  //       this.geteligibleamt.same_day_return = this.incidental.data[indexx].same_day_return
  //     }
  //     else {
  //       this.geteligibleamt.same_day_return = this.getsamedayreturn
  //     }
  //     if (indexid != undefined) {
  //       if (this.geteligibleamt.expense_id != undefined && this.geteligibleamt.travel_mode != undefined && this.geteligibleamt.travel_hours != undefined
  //         && this.geteligibleamt.same_day_return != undefined && this.geteligibleamt.single_fare != undefined) {
  //         this.taservice.Incidentaleligibleamt(this.geteligibleamt)
  //           .subscribe(res => {
  //             this.getelgamt = res['elgibleamount']
  //             this.incidental.data[indexx].eligibleamount = this.getelgamt


  //           }
  //           )
  //       }
  //     }

  //     else {
  //       if ((this.geteligibleamt.expense_id != undefined && this.geteligibleamt.expense_id != "") &&
  //         (this.geteligibleamt.travel_mode != undefined && this.geteligibleamt.travel_mode != "") &&
  //         (this.geteligibleamt.travel_hours != undefined && this.geteligibleamt.travel_hours != "") &&
  //         (this.geteligibleamt.same_day_return != undefined && this.geteligibleamt.same_day_return != "") &&
  //         (this.geteligibleamt.single_fare != undefined && this.geteligibleamt.single_fare != "")) {
  //         this.taservice.Incidentaleligibleamt(this.geteligibleamt)
  //           .subscribe(res => {
  //             this.getelgamt = res['elgibleamount']
  //             const indexes = this.incidental.data.findIndex(fromdata => fromdata.ids === index.ids)
  //             this.incidental.data[indexes].eligibleamount = this.getelgamt

  //           }
  //           )
  //       }
  //     }

  //   }


  //   gettraveltime(e, index) {
  //     let indexid = index.id
  //     this.travelhours = JSON.parse(e)
  //     const indexx = this.incidental.data.findIndex(fromdata => fromdata.id === indexid)
  //     this.geteligibleamt = {
  //       expense_id: 3,
  //       travel_mode: this.gettravelmodes,
  //       travel_hours: this.travelhours,
  //       same_day_return: this.getsamedayreturn,
  //       single_fare: this.single_fare
  //     }
  //     if (this.gettravelmodes === undefined) {
  //       this.geteligibleamt.travel_mode = this.incidental.data[indexx].travel_mode
  //     } else {
  //       this.geteligibleamt.travel_mode = this.gettravelmodes
  //     }
  //     if (this.travelhours === undefined) {
  //       this.geteligibleamt.travel_hours = this.incidental.data[indexx].travel_hours
  //     } else {
  //       this.geteligibleamt.travel_hours = this.travelhours
  //     }
  //     if (this.single_fare === undefined) {
  //       this.geteligibleamt.single_fare = this.incidental.data[indexx].single_fare
  //     } else {
  //       this.geteligibleamt.single_fare = this.single_fare
  //     }
  //     if (this.getsamedayreturn === undefined) {
  //       this.geteligibleamt.same_day_return = this.incidental.data[indexx].same_day_return
  //     }
  //     else {
  //       this.geteligibleamt.same_day_return = this.getsamedayreturn
  //     }
  //     if (indexid != undefined) {
  //       if (this.geteligibleamt.expense_id != undefined && this.geteligibleamt.travel_mode != undefined && this.geteligibleamt.travel_hours != undefined
  //         && this.geteligibleamt.same_day_return != undefined && this.geteligibleamt.single_fare != undefined) {
  //         this.taservice.Incidentaleligibleamt(this.geteligibleamt)
  //           .subscribe(res => {
  //             this.getelgamt = res['elgibleamount']
  //             this.incidental.data[indexx].eligibleamount = this.getelgamt
  //           }
  //           )
  //       }
  //     }
  //     else {
  //       if ((this.geteligibleamt.expense_id != undefined && this.geteligibleamt.expense_id != "") &&
  //         (this.geteligibleamt.travel_mode != undefined && this.geteligibleamt.travel_mode != "") &&
  //         (this.geteligibleamt.travel_hours != undefined && this.geteligibleamt.travel_hours != "") &&
  //         (this.geteligibleamt.same_day_return != undefined && this.geteligibleamt.same_day_return != "") &&
  //         (this.geteligibleamt.single_fare != undefined && this.geteligibleamt.single_fare != "")) {
  //         this.taservice.Incidentaleligibleamt(this.geteligibleamt)
  //           .subscribe(res => {
  //             this.getelgamt = res['elgibleamount']
  //             const indexes = this.incidental.data.findIndex(fromdata => fromdata.ids === index.ids)
  //             this.incidental.data[indexes].eligibleamount = this.getelgamt

  //           }
  //           )
  //       }

  //     }
  //   }
  //   geteligibleamount(e, index) {
  //     let indexid = index.id
  //     this.single_fare = JSON.parse(e)
  //     const indexes = this.incidental.data.findIndex(fromdatasss => fromdatasss.ids === index.ids)
  //     console.log("iiiii",indexes)
  //     const indexx = this.incidental.data.findIndex(fromdata => fromdata.id === indexid)

  //     this.geteligibleamt = {
  //       expense_id: 3,
  //       travel_mode: this.gettravelmodes,
  //       travel_hours: this.travelhours,
  //       same_day_return: this.getsamedayreturn,
  //       single_fare: this.single_fare
  //     }


  //     if (this.gettravelmodes === undefined) {

  //       this.geteligibleamt.travel_mode = this.incidental.data[indexx].travel_mode
  //     } else {
  //       this.geteligibleamt.travel_mode = this.gettravelmodes
  //     }
  //     if (this.travelhours === undefined) {
  //       this.geteligibleamt.travel_hours = this.incidental.data[indexx].travel_hours
  //     } else {
  //       this.geteligibleamt.travel_hours = this.travelhours
  //     }
  //     if (this.single_fare === undefined) {
  //       this.geteligibleamt.single_fare = this.incidental.data[indexx].single_fare
  //     } else {
  //       this.geteligibleamt.single_fare = this.single_fare
  //     }
  //     if (this.getsamedayreturn === undefined) {
  //       this.geteligibleamt.same_day_return = this.incidental.data[indexx].same_day_return
  //     }
  //     else {
  //       this.geteligibleamt.same_day_return = this.getsamedayreturn
  //     }
  //     if(indexid === undefined){
  //     // if(this.geteligibleamt.expense_id != undefined&&this.geteligibleamt.expense_id != ""&&this.geteligibleamt.travel_mode != undefined&&this.geteligibleamt.travel_mode != ""&&this.geteligibleamt.travel_hours != undefined&&this.geteligibleamt.travel_hours != "" 
  //     // &&this.geteligibleamt.same_day_return != undefined&&this.geteligibleamt.same_day_return != ""&&this.geteligibleamt.single_fare != undefined&&this.geteligibleamt.single_fare != "") {
  //       this.taservice.Incidentaleligibleamt(this.geteligibleamt)
  //         .subscribe(res => {
  //           const indexes = this.incidental.data.findIndex(fromdata => fromdata.ids === index.ids)
  //           // for(let i=0;i<this.incidental.data.length;i++){
  //           // this.incidental.data[indexes].eligibleamount = res['elgibleamount']
  //           if(this.incidental.data[indexes].ids === index.ids ){
  //             this.incidental.data[indexes].eligibleamount= res['elgibleamount']
  //             // break;
  //           }
  //         // }
  //           console.log("iiii1",indexes)
  //           console.log("iiii11",indexes+1)
  //           console.log("iiii12",this.incidental.data[indexes])
  //           console.log("iiii13",this.incidental.data[indexes+1])
  //           // let count=false;
  //           // this.incidental.data.every(currentValue => {
  //           //   currentValue.eligibleamount = this.getelgamt
  //           //   return false;

  //           // delete this.incidental.data[indexes+1].eligibleamount
  //           // })
  //           // for(var i=0;i< this.incidental.data.length;i++){
  //           // this.incidental.data[indexes].eligibleamount=this.getelgamt
  //           // this.incidental.data.splice(indexes + 1, this.incidental.data.length - (indexes + 1).eligibleamount );
  //           // }
  //         }
  //         )
  //     // }
  //   }

  //     if (indexid != undefined) {
  //       if (this.geteligibleamt.expense_id != undefined && this.geteligibleamt.travel_mode != undefined && this.geteligibleamt.travel_hours != undefined
  //         && this.geteligibleamt.same_day_return != undefined && this.geteligibleamt.single_fare != undefined) {
  //         this.taservice.Incidentaleligibleamt(this.geteligibleamt)
  //           .subscribe(res => {
  //             this.getelgamt = res['elgibleamount']
  //             this.incidental.data[indexx].eligibleamount = this.getelgamt

  //           }
  //           )
  //       }
  //     } 



  //   }


  //   addSection() {

  //     this.incidental.data.push({
  //       ids: this.incidental.data.length + 1,
  //       tourid: JSON.parse(this.expenseid),
  //       expenseid: 3,
  //       requestercomment: this.comm,
  //       travel_mode: '',
  //       same_day_return: '',
  //       travel_hours: '',
  //       single_fare: '',

  //     })

  //   }
  //   removeSection(i, data) {
  //     let getlocalexpid = data.id
  //     this.taservice.deleteincidental(getlocalexpid)
  //     .subscribe(res=>{
  //       if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
  //         this.notification.showWarning("Duplicate! Code Or Name ...")
  //       } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
  //         this.notification.showError("INVALID_DATA!...")
  //       }
  //       else{
  //       this.notification.showSuccess("Deleted Successfully....")
  //       console.log("res", res)
  //       this.onSubmit.emit();
  //       return true
  //       }
  //     }
  //     )
  //     this.incidental.data.splice(i,1);
  //   }

  //   submitForm() {

  //    for(var i=0;i<this.incidental.data.length;i++){
  //     if(this.incidental.data[i].ids != undefined){
  //       delete this.incidental.data[i].ids
  //       delete this.incidental.data[i].eligibleamount
  //       this.incidental.data[i].expenseid = 3
  //       let data=this.shareservice.expenseedit.value;
  //       let comm=data['requestercomment']
  //       this.incidental.data[i].requestercomment = comm
  //       this.incidental.data[i].same_day_return = JSON.parse(this.incidental.data[i].same_day_return)
  //       this.incidental.data[i].travel_hours = JSON.parse( this.incidental.data[i].travel_hours)
  //       this.incidental.data[i].single_fare = JSON.parse( this.incidental.data[i].single_fare)
  //     }
  //   }

  //     console.log("incidental", this.incidental)
  //     this.taservice.IncidentalCreate(this.incidental)
  //       .subscribe(res => {
  //         console.log("incires", res)
  //         if (res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success") {
  //           this.notification.showSuccess("Success....")
  //           this.onSubmit.emit();
  //           return true;
  //         }

  //         else {
  //           this.notification.showError(res.description)
  //           return false;
  //         }
  //       }
  //       )

  //   }


  createItem() {
    let group = this.formBuilder.group({
      expenseid: 3,
      requestercomment: this.comm1,
      tourid: this.expenseid,
      same_day_return: '',
      single_fare: '',
      travel_hours: '',
      travel_mode: '',
      id: 0,
      amount: 0,
      eligibleamount: new FormControl({ value: 0, disabled: true }),
    });

    return group;
  }

  addSet() {
    const data = this.incidentalform.get('data') as FormArray;
    data.push(this.createItem());
  }

  deleteArray(index: number) {
    (<FormArray>this.incidentalform.get('data')).removeAt(index);
  }
  submitForm() {
    console.log("form", this.incidentalform.value)
    for (var i = 0; i < this.incidentalform.value.data.length; i++) {
      // delete  this.incidentalform.value.data[i].amount
      this.incidentalform.value.data[i].same_day_return = JSON.parse(this.incidentalform.value.data[i].same_day_return)
      this.incidentalform.value.data[i].travel_hours = JSON.parse(this.incidentalform.value.data[i].travel_hours)
      this.incidentalform.value.data[i].single_fare = JSON.parse(this.incidentalform.value.data[i].single_fare)
      if (this.incidentalform.value.data[i].id == 0) {
        delete this.incidentalform.value.data[i].id;
      }
    }
    console.log("create", this.incidentalform.value)
    this.taservice.IncidentalCreate(this.incidentalform.value)
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

  back() {
    if (this.isApproveButton) {
      this.router.navigateByUrl('ta/exapprove-edit')
    }
    else if(this.applevel==1 && this.report){
      this.router.navigateByUrl('ta/report')

    }
    else {
      this.router.navigateByUrl('ta/exedit')
    }


  }

  limit(e, i) {
    // let ind = this.pageSize * (this.presentpage - 1) + i;
    let val = e.target.value
    if (this.incidentalform.value.data[i].same_day_return == '1') {
      if (Number(val) > 24) {
        e.target.value = ''
      }
    }

  }

}
