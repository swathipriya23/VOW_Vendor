import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { isBoolean } from 'util';
// import { formatDate } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import { TaService } from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import { ActivatedRoute, Router } from "@angular/router";
import { ShareService } from 'src/app/ta/share.service';
import { E } from '@angular/cdk/keycodes';
import { timeStamp } from 'console';
import { NgxSpinnerService } from "ngx-spinner";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

// interface details {
//   id:number
// 	startdate: any
// 	enddate: any
//   startingpoint:string,
//   placeofvisit:string,
//   purposeofvisit:string
// }
interface onward {
  id: number;
  Name: string;
}
interface sub {
  id: number;
  Name: string;
}
interface center {
  id: number;
  Name: string;
}
interface onwardd {
  id: number;
  Name: string;
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
      return formatDate(date, 'dd-MMM-yyyy, EEE', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-localconveyance-expense',
  templateUrl: './localconveyance-expense.component.html',
  styleUrls: ['./localconveyance-expense.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
})
export class LocalconveyanceExpenseComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  localexp: any
  // showonwardcreate=true
  // showonwardedit=false
  showsubcatcreate = true
  showsubcatedit = false

  expenseid: any
  exptype: any
  comm: any
  localid: any
  tourno: any
  trvlmodeList: any
  subcatList: any
  centerList: any
  onwardLists: any
  // showlocal=false
  tourdatas: any
  employeename: any
  employeegrade: any
  employeedesignation: any
  claimreqid: any
  getlocalexpid: any
  expenseeditid: any
  subcatroadList: any
  subcattrainList: any
  abc: any
  currentpage: number = 1;
  pagesize = 10;
  localform: FormGroup
  expensedetails: any
  expensevalues: any;
  pageSize: number = 10;
  p: any = 1

  roadlist: any;
  trainlist: any;
  emptyarray: any = []
  data: any = []
  maker: any
  makerboolean: boolean = false;
  approveamountarray: any = []
  isonbehalf: boolean = false
  onbehalf_empName: any;
  tournumb: any;

  applevel: any = 0;
  approver: boolean = false;
  report: any;
  statusid: any;
  startdate: any;
  enddate: any;
  employeecode: any;


  constructor(private formBuilder: FormBuilder, private taservice: TaService, private spinnerservice: NgxSpinnerService, private shareservice: ShareService, private notification: NotificationService, private router: Router, private datePipe: DatePipe) { }

  ngOnInit(): void {

    let expense_edit = JSON.parse(localStorage.getItem("expense_edit"))
    this.expensevalues = expense_edit
    let expensedetails = JSON.parse(localStorage.getItem("expense_details"))
    this.report = expensedetails.report

    this.expensedetails = expensedetails
    this.startdate = new Date(expensedetails.startdate)
    this.enddate = new Date(expensedetails.enddate)

    this.maker = expensedetails['applevel']
    this.tournumb = expensedetails['tourid']

    this.statusid = expensedetails.claim_status_id;

    if (expensedetails.applevel) {
      this.applevel = expensedetails.applevel
    }

    this.tournumb = expensedetails.id


    if (expensedetails.onbehalfof) {
      this.isonbehalf = true;
      this.onbehalf_empName = '(' + expensedetails.employee_code + ') ' + expensedetails.employee_name
      console.log("onbehalf_empName", this.onbehalf_empName)
    } else {
      this.isonbehalf = false;
    }
    if (expensedetails.applevel >0) {
      this.isonbehalf = false;
      this.tournumb = expensedetails['tourid']
      this.approver = true;
    }

    if (expensedetails.claim_status_id == 2 || expensedetails.claim_status_id == 3 || expensedetails.claim_status_id == 4) {
      this.approver = true;
    }



    this.localform = this.formBuilder.group({
      tourno: this.tournumb,
      employeename: expensedetails.employee_name,
      designation: expensedetails['empdesignation'],
      employeegrade: expensedetails['empgrade'],
      data: new FormArray([])



    })
    console.log(this.expensedetails)

    console.log('localform', this.localform.value)



    // let expensedetails = JSON.parse(localStorage.getItem("expense_details"))

    let expensetype = this.shareservice.dropdownvalue.value;
    console.log("mmm", expensetype)

    this.exptype = expensedetails['expenseid']
    console.log("sf", this.exptype)
    this.comm = expensedetails['requestercomment']
    console.log("cc", this.comm)
    this.tourdatas = this.shareservice.expensesummaryData.value;
    console.log("tddddd", this.tourdatas)
    this.employeename = expensedetails['employee_name']
    this.employeecode=expensedetails['employee_code']
    this.employeegrade = expensedetails['empgrade']
    this.employeedesignation = expensedetails['empdesignation']
    let data = this.shareservice.expenseedit.value;
    let datavalue = this.shareservice.expensesummaryData.value;
    console.log("exedit", data)
    this.expenseeditid = expensedetails['id']
    this.expenseid = expensedetails['id']
    console.log("eeid", this.expenseeditid)
    if (datavalue['requestno'] != 0) {
      this.tourno = datavalue['requestno']
      // console.log("id",this.tourno)

      // this.taservice.getlocaleditSummary(datavalue['id'])
      //   .subscribe((results: any[]) => {

      //     console.log("Tourmaker", results)
      //     this.localexp = results;
      //     this.localexp.data.forEach(currentValue => {
      //       currentValue.onwardreturn = currentValue.onwardreturn.value
      //        public valueMappers = (value) => {
      //         let selection = this.onwardLists.find(e => {
      //           return e.value == value;
      //         });
      //         if (selection){
      //           return selection.name;
      //         }
      //       }

      //       }
      //     })




      // });
    }
    this.localexp = {

      data: [],
    }

    this.localexp.data.push({

      tour_id: JSON.parse(this.expenseid),
      expensegid: 4,
      requestercomment: this.comm,
      modeoftravel: '',
      // subcatogory: '',
      // center: '',
      fromplace: '',
      toplace: '',
      date: '',
      eligibleamount: '',
      distance: '',
      // onwardreturn: '',
      claimedamount: '',
      // remarks: '',
    });
    this.gettravelmode()
    // this.gettravelmodebytrain()
    // this.gettravelmodebybus()
    // this.getconvcenter()
    // this.getonwardreturn()

    //myforms
    // this.gettravelmodebus()
    // this.gettravelmodetrain()
    this.localconveyanceedit()



  }

  gettravelmode() {
    this.taservice.getloc_convtravelmode()
      .subscribe(res => {
        this.trvlmodeList = res
        // this.trvlmodeList.forEach(element => {
        //   element.name = element.name.toUpperCase( )
        // });
        // console.log("trvlmodeList",this.trvlmodeList)
      })

  }
  subcatindex: any
  subcatname: any
  getsubcat(data, i) {
    // this.showsubcatcreate=false
    // this.showsubcatedit=true
    console.log("subcatdata", data)
    console.log("subcatind", i)
    this.subcatindex = i
    this.subcatname = data.name
  }
  gettraveldata: any
  gettrvl(data, i, dtl) {
    let a = dtl.id
    console.log("index", i)
    console.log("dataaaaa", data)
    console.log("dtlll", dtl)
    // this.gettraveldata=data.value
    // for(var j=0;j<this.localexp.data.length;i++){
    //  if(dtl.id > this.localexp.data.length){
    if (data.value === "Road") {
      this.gettravelmodebybus()
    }
    //   if(data.value === "Train"){
    //     this.gettravelmodebybus() 
    //  }
    // }
    else {
      this.gettravelmodebytrain()
    }
    // }
    // else{
    //   if(data.value === "Road"){
    //     this.gettravelmodebybus() 
    //  }
    //  else{
    //   this.gettravelmodebytrain() 
    //  }

    // }
    // }

  }

  // showsubcat(){
  //   this.showsubcatcreate=true
  //   this.showsubcatedit=false
  // 


  fromdatemin(i){
    let ind = this.pageSize * (this.p - 1) + i;
    if (ind ==  0){
      return this.startdate
    }
    else{
      let form = this.localform.value.data[ind-1]
      return form.fromdate
    }
  }

  gettravelmodebytrain() {
    this.taservice.getloc_convtrain()
      .subscribe(res => {
        this.subcattrainList = res

      })

  }

  gettravelmodebybus() {
    this.taservice.getloc_convroad()
      .subscribe(res => {
        this.subcatroadList = res


      })

  }


  getconvcenter() {

    this.taservice.getloc_convcenter()
      .subscribe(res => {
        this.centerList = res

      })

  }

  getonwardreturn() {
    this.taservice.getloc_convonward()
      .subscribe(res => {
        this.onwardLists = res

      })

  }
  public valueMappers = (value) => {
    let selection = this.onwardLists.find(e => {
      return e.value == value;
    });
    if (selection) {
      return selection.name;
    }
  };

  // showonward(i){
  //   this.showonwardcreate=true
  //   this.showonwardedit=false

  // }
  // localexp:any=[]
  addSection() {
    // this.showlocal=true


    this.localexp.data.push({

      ids: this.localexp.data.length + 1,
      tour_id: JSON.parse(this.expenseid),
      expensegid: 4,
      requestercomment: this.comm,
      modeoftravel: '',
      // subcatogory: '',
      // center: '',
      fromplace: '',
      toplace: '',
      fromdate: '',
      eligibleamount: '',
      distance: '',
      // onwardreturn: '',
      claimedamount: '',
      remarks: '',
    })
    // this.adddata()
    //  this.localexp.data.push(data)
    // this.localexp.data.forEach(elm=>delete elm.id)

  }
  removeSection(i, data) {
    console.log("dtldata", data)
    console.log("index", i)
    let localexpid = data.id
    // this.taservice.deletelocal(localexpid)
    //   .subscribe(res => {
    //     if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
    //       this.notification.showWarning("Duplicate! Code Or Name ...")
    //     } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
    //       this.notification.showError("INVALID_DATA!...")
    //     }
    //     else {
    //       this.notification.showSuccess("Deleted Successfully....")
    //       console.log("res", res)
    //       this.onSubmit.emit();
    //       return true
    //     }
    //   }
    //   )



    this.localexp.data.splice(i, 1);
  }
  eligibleamt: any

  numberOnly(event) {
    return (event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46)
  }

  limitcheck(i) {
    let ind = this.pageSize * (this.p - 1) + i;
    let myform = this.localform.value.data[ind]
    let cabauto = true;
    if (myform.modeoftravel == 'Cab' || myform.modeoftravel == 'Auto') {
      cabauto = false;
    }
    if (myform.claimedamount > myform.eligibleamount && cabauto) {
      return true;
    }
    else {
      return false;
    }
  }

  exceednot(i) {
    let ind = this.pageSize * (this.p - 1) + i;
    let myform = this.localform.value.data[ind]
    let cabauoto = true;
    if (myform.modeoftravel == 'Cab' || myform.modeoftravel == 'Auto') {
      cabauoto = false;
    }

    if (myform.claimedamount > myform.eligibleamount && cabauoto) {
      this.notification.showWarning('You are exceeding the eligible amount, please enter your remarks')
    }
  }

  eligcheck(ind) {
    ind = this.pageSize * (this.p - 1) + ind;
    let myform = this.localform.value.data[ind]
    let cabauoto = true;
    if (myform.modeoftravel == 'Cab' || myform.modeoftravel == 'Auto') {
      cabauoto = false;
    }
    if (myform.eligibleamount > 0) {
      return false;
    }
    else if (!cabauoto) {
      return false;
    }
    else {
      return true
    }
  }

  submitForm() {
    console.log("localexp", this.localexp)

    // const index = this.localexp.data.findIndex(fromdept => fromdept.status === undefined);
    // console.log("constindex",index)
    // console.log("locexp",this.localexp)
    // for(var i=0;i<this.localexp.data.length;i++){
    //   let reqid=this.localexp.data[i].claimreqid
    //   let id=this.localexp.data[i].id
    //   delete this.localexp.data[i].tourid
    //   this.localexp.data[i].tourgid=this.expenseid
    //   this.localexp.data[i].expense_id=4
    //   delete this.localexp.data[i].eligibleamount
    //   if(reqid === undefined && id != undefined){
    //     delete this.localexp.data[i].id
    //    delete this.localexp.data[i].eligibleamount
    //    let data=this.shareservice.expenseedit.value;
    //    console.log("exeeeedit",data)
    //    let comm=data['requestercomment']
    //    this.localexp.data[i].requestercomment = comm
    //    console.log("commmmmmm",comm)

    //   }
    // }
    let data = this.shareservice.expenseedit.value;
    let comm = data['requestercomment']
    for (var i = 0; i < this.localexp.data.length; i++) {
      if (this.localexp.data[i].claimreqid != undefined) {
        delete this.localexp.data[i].tourid
        this.localexp.data[i].tourgid = JSON.parse(this.expenseid)
        this.localexp.data[i].expense_id = 4
        delete this.localexp.data[i].eligibleamount
        delete this.localexp.data[i].approvedamount
        this.localexp.data[i].requestercomment = comm
      }
      if (this.localexp.data[i].ids != undefined && this.localexp.data[i].claimreqid == undefined) {
        delete this.localexp.data[i].ids
        delete this.localexp.data[i].eligibleamount
        this.localexp.data[i].requestercomment = comm
        this.localexp.data[i].claimedamount = JSON.parse(this.localexp.data[i].claimedamount)
        this.localexp.data[i].onwardreturn = JSON.parse(this.localexp.data[i].onwardreturn)
      }
    }


    console.log("locexp1", this.localexp)
    // this.taservice.LocalconveyanceCreate(this.localexp)
    //   .subscribe(res => {
    //     console.log("resss", res)
    //     if (res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success") {
    //       this.notification.showSuccess("Success....")
    //       this.onSubmit.emit();
    //       return true;
    //     }

    //     else {
    //       this.notification.showError(res.description)
    //       return false;

    //     }
    //   }
    //   )

  }
  back() {
    this.spinnerservice.show()
    if (this.applevel == 0) {
      this.spinnerservice.hide()
      this.router.navigateByUrl('ta/exedit')
    }
    else if (this.applevel == 1 && this.report) {
      this.router.navigateByUrl('ta/report')

    }
    else {
      this.spinnerservice.hide()
      this.router.navigateByUrl('ta/exapprove-edit')
    }

  }

  localconveyanceedit() {
    this.spinnerservice.show()
    this.taservice.getlocaleditSummary(this.localform.value.tourno).subscribe(
      x => {
        console.log('x', x)
        let datas = x['data']
        let variable = x['requestercomment']
        for (let i = 0; i < datas.length; i++) {
          let array = this.formBuilder.group({
            id: datas[i]['id'],
            tour_id: datas[i]['tour_id'],
            // expensegid:4,
            expensegid: datas[i]['exp_id'],
            eligibleamount: datas[i]['eligibleamount'],
            // center: datas[i]['center']['value'],
            claimedamount: datas[i]['claimedamount'].toFixed(2),
            requestercomment: variable,
            fromdate: new Date(datas[i].fromdate),
            distance: datas[i]['distance'],
            // requestercomment: this.expensevalues['requestercomment'],
            // modeoftravel: datas[i]['modeoftravel']['value'],
            modeoftravel: datas[i]['modeoftravel'],
            // subcatogory: datas[i]['subcatogory']['value'],
            fromplace: datas[i]['fromplace'],
            billno: datas[i]['billno'],
            toplace: datas[i]['toplace'],
            // onwardreturn: datas[i]['onwardreturn']['value'].toString(),
            remarks: datas[i]['remarks'],
            // approvedamount: datas[i]['approvedamount'],
          })

          const docu = this.localform.get('data') as FormArray;
          docu.push(array)
        }

        if (this.localform.value.data.length == 0) {
          this.adddata()
        }
        this.spinnerservice.hide()
      }
    )




  }


  createnewitem(): FormGroup {



    let datasarray = this.formBuilder.group({
      tour_id: this.localform.value.tourno,
      expensegid: 4,
      eligibleamount: null,
      claimedamount: null,
      requestercomment: this.expensevalues['requestercomment'],
      modeoftravel: null,
      billno: null,
      remarks: null,
      fromplace: null,
      toplace: null,
      fromdate: null,
      distance: '',
      // onwardreturn: null,
      // remarks: null,
    });

    return datasarray;
  }

  adddata() {
    const data = this.localform.get('data') as FormArray;
    data.push(this.createnewitem());
    console.log(this.localform.value.data)
  }

  GlobalIndex(i) {
    let dat = this.pageSize * (this.p - 1) + i;
    return dat
  }

  gettravelmodebus() {
    this.taservice.getloc_convroad()
      .subscribe(res => {
        this.subcatroadList = res
        this.roadlist = res
      })

  }

  gettravelmodetrain() {
    this.taservice.getloc_convtrain()
      .subscribe(res => {
        this.subcatroadList = res
        this.trainlist = res
      })

  }

  getsubcatogorychange(i) {
    let index = this.pageSize * (this.p - 1) + i;
    console.log(this.localform.value.data[index])
    // if(this.localform.value.data[index]['modeoftravel']=="Train"){
    //   this.gettravelmodetrain()
    // }
    // else if(this.localform.value.data[index]['modeoftravel']=="Road" ){
    //   this.gettravelmodebus()
    // }
    // else{
    //   this.subcatroadList.splice(0,this.subcatroadList.length)
    // }

  }



  modeoftravel(v) {
    console.log('modeoftravel', v)
    // if(v.name=="Train"){
    //   this.gettravelmodetrain()
    // }
    // else{
    //   this.gettravelmodebus()
    // }
  }

  getdelete(i) {
    let index = this.pageSize * (this.p - 1) + i;
    const control = <FormArray>this.localform.controls['data'];
    control.removeAt(index)
  }

  centerselect(i) {

    let index = this.pageSize * (this.p - 1) + i;
    let obj = {
      modeoftravel: this.localform.value.data[index].modeoftravel,
      expensegid: 4,
      distance: Number(this.localform.value.data[index].distance)
    }
    if (obj.modeoftravel && obj.distance && obj.modeoftravel != 'Cab' && obj.modeoftravel != 'Auto') {
      // this.spinnerservice.show()
      this.taservice.localconveligibleamt(obj)
        .subscribe(res => {
          // this.localform.value.data[index].eligibleamount.setValue(res['Eligible_amount'])
          this.localform.get('data')['controls'][index].get('eligibleamount').setValue(res['Eligible_amount'])
          // this.spinnerservice.hide()
        })
    }
  }

  submit(value) {
    this.spinnerservice.show()
    this.taservice.LocalconveyanceCreate(value)
      .subscribe(res => {
        console.log("resss", res)
        this.spinnerservice.hide()
        if (res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success") {
          this.notification.showSuccess("Success....")
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



  submitcall() {

    // tourgid: this.localform.value.tourno,
    //   expense_id: this.expensevalues['expenseid'],
    //   eligibleamount: new FormControl({value:null,disabled:true}),
    //   claimedamount: null,
    //   requestercomment: this.expensevalues['requestercomment'],
    //   modeoftravel: null,
    //   subcatogory: null,
    //   center: null,
    //   fromplace: null,
    //   toplace: null,
    //   onwardreturn: null,
    //   remarks: null,


    for (let i = 0; i < this.localform.value.data.length; i++) {
      if (this.localform.value.data[i].modeoftravel == null || this.localform.value.data[i].modeoftravel == '') {
        this.notification.showError('Please select Mode of Travel')
        throw new Error
      }
      // if (this.localform.value.data[i].subcatogory == null || this.localform.value.data[i].subcatogory == '') {
      //   this.notification.showError('Please select Subcateogry')
      //   throw new Error
      // }
      // if (this.localform.value.data[i].center == null || this.localform.value.data[i].center == '') {
      //   this.notification.showError('Please select Center')
      //   throw new Error
      // }
      if (this.localform.value.data[i].fromplace == null || this.localform.value.data[i].fromplace == '') {
        this.notification.showError('Please enter From Place')
        throw new Error
      }
      if (this.localform.value.data[i].toplace == null || this.localform.value.data[i].toplace == '') {
        this.notification.showError('Please enter To Place')
        throw new Error
      }
      // if (this.localform.value.data[i].date == null || this.localform.value.data[i].date == '') {
      //   this.notification.showError('Please enter Date')
      //   throw new Error
      // }
      if (this.localform.value.data[i].distance == null || this.localform.value.data[i].distance == '') {
        this.notification.showError('Please select Distance')
        throw new Error
      }
      if (this.localform.value.data[i].claimedamount == null || this.localform.value.data[i].claimedamount == '') {
        this.notification.showError('Please enter Claim Amount')
        throw new Error
      }

      if (this.localform.value.data[i].claimedamount) {
        this.localform.value.data[i].claimedamount = JSON.parse(this.localform.value.data[i].claimedamount)
      }
      if (Number(this.localform.value.data[i].claimedamount) > Number(this.localform.value.data[i].eligibleamount) &&
       this.localform.value.data[i].remarks == null && 
       (this.localform.value.data[i].modeoftravel != 'Cab' && this.localform.value.data[i].modeoftravel != 'Auto')) {
        this.notification.showError('Please Enter Remarks for Limit Exceeding')
        throw new Error
      }

    }


    console.log('finaldata', this.localform.value.data)
    for (var i = 0; i < this.localform.value.data.length; i++) {
      this.localform.value.data[i].fromdate = this.datePipe.transform(this.localform.value.data[i].fromdate, 'yyyy-MM-dd');
    }
    this.data = this.localform.value.data
    console.log('data', this.data)
    let obj = {
      data: this.data
    }
    console.log('apiobj', obj)

    this.submit(obj)
  }

  center_check(i) {
    let index = this.pageSize * (this.p - 1) + i;
    let myform = this.localform.value.data.at(index).subcatogory
    if (myform == null) {
      return true
    }
    else {
      return false
    }
  }

  getmaker() {
    if (this.maker == 1) {
      return true
    }
    else {
      return false
    }
  }
  decs(name: HTMLElement,ind,evt){
    let value = name.getAttribute('formControlName')
    let amt =Number(evt.target.value);
    this.localform.get('data')['controls'].at(ind).get(value).setValue(amt.toFixed(2))
  }
  // incidentalApproveButton(){
  //   this.applist=[];
  //   console.log("form-app",this.incidentalform.value)
  //   for(var i=0;i<this.incidentalform.value.data.length;i++){
  //     // this.incidentalform.value.data[i].same_day_return = JSON.parse(this.incidentalform.value.data[i].same_day_return)
  //     // this.incidentalform.value.data[i].travel_hours = JSON.parse( this.incidentalform.value.data[i].travel_hours)
  //     // this.incidentalform.value.data[i].single_fare = JSON.parse( this.incidentalform.value.data[i].single_fare)
  //     // if (this.incidentalform.value.data[i].id == 0){
  //     //   delete this.incidentalform.value.data[i].id;
  //     // }
  //     let json = {
  //       "id": this.incidentalform.value.data[i].id,
  //       "amount": this.incidentalform.value.data[i].amount,

  //     }
  //     this.applist.push(json)
  //   }
  //   for(var i=0;i<this.applist.length;i++){
  //     this.applist[i].amount = JSON.parse(this.applist[i].amount)

  //   }
  //   console.log("createdlist",this.applist)
  //   this.taservice.approver_Incidental(this.applist,this.expenseid)
  //       .subscribe(res => {
  //         console.log("incires", res)
  //         if (res.status === "success") {
  //           this.notification.showSuccess("Success....")
  //           this.onSubmit.emit();
  //           return true;
  //         }else {
  //           this.notification.showError(res.description)
  //           return false;
  //         }
  //       })

  //   }

  approverupdate(tourno, expenseid, approvearray) {
    this.taservice.approver_amountupdate(tourno, expenseid, approvearray)
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


  localconveyance() {
    this.approveamountarray.splice(0, this.approveamountarray.length)
    for (let i = 0; i < this.localform.value.data.length; i++) {
      let json = {
        "id": this.localform.value.data[i].id,
        "amount": JSON.parse(this.localform.value.data[i].approvedamount),
      }
      this.approveamountarray.push(json)
    }



    console.log('approveamountchange', this.approveamountarray)
    this.approverupdate(this.localform.value.tourno, 4, this.approveamountarray)

  }

  backchecker() {
    this.router.navigateByUrl('ta/exapprove-edit')
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

  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 62 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || k== 33 || (k >= 44 && k <= 58));
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


}
