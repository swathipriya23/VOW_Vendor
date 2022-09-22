import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { isBoolean } from 'util';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import { TaService } from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import { ActivatedRoute, Router } from "@angular/router";
import { ShareService } from 'src/app/ta/share.service';
import { join } from 'path';
import { delay } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { PICK_FORMATS } from '../tamaker-create/tamaker-create.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

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
  selector: 'app-miscellaneous-expence',
  templateUrl: './miscellaneous-expence.component.html',
  styleUrls: ['./miscellaneous-expence.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' }}
    
  ]
})
export class MiscellaneousExpenceComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  miscellaneousexpence: FormGroup
  miscellaneous: any
  expenseid: any
  reasonlist: Array<any>
  centerlist: Array<any>
  exptype: any
  comm: any
  tourno: any
  reason: any;
  currentpage: number = 1;
  pagesize = 10;
  detailsframe: any;
  feild_disable: boolean = true
  shiftreason: any;
  center: any;
  eligibleamount: any;
  tourdatas: string;
  employeename: any;
  employeegrade: any;
  employeedesignation: any;
  datas: any
  id: any;
  claimid: any;
  expenceid: string;
  approvedamount: any;
  miscellaneousform: FormGroup
  miscellaneoustableform: FormGroup
  p: any = 1;
  pageSize = 10;
  arrays: any;
  length: any;
  commenter: any
  expenseids: any
  isonbehalf: boolean = false;
  onbehalf_empName: any;

  makercheck: any;
  maker: boolean = false;
  approverarray: any = []
  tourid: any

  applevel:any=0;
  approver:boolean=false;
  report: any;
  startdate: any;
  enddate: any;
  hidelandry: boolean;
  employeecode: any;
  total: number;


  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private http: HttpClient,
    private notification: NotificationService, private taservice: TaService,
    public sharedService: SharedService, private router: Router, private SpinnerService: NgxSpinnerService, private activatedroute: ActivatedRoute,
    private shareservice: ShareService) { }
  ngOnInit(): void {

    let expense_edit = JSON.parse(localStorage.getItem("expense_edit"))
    console.log('expense__edit', expense_edit)

    let expensetype = JSON.parse(localStorage.getItem("expense_details"))
    this.report =expensetype.report

    console.log("expense__types", expensetype)

    // this.tourid = expense_edit['tourid']
    this.makercheck = 1




    // if (expensetype.onbehalfof) {
    //   this.isonbehalf = true;
    //   this.tourid = expensetype['id']
    //   this.onbehalf_empName = '(' + expensetype.employee_code + ') ' + expensetype.employee_name
    //   console.log("onbehalf_empName", this.onbehalf_empName)
    // } else {
    //   this.tourid = expensetype['id']
    //   this.isonbehalf = false;
    // }
    // if (expensetype.applevel == 2 || expensetype.applevel == 1) {
    //   this.isonbehalf = false;
    //   this.maker = true
    //   this.tourid = expensetype['tourid']
    // }

    if(expensetype.applevel){
      this.applevel = expensetype.applevel
    }
    this.startdate = new Date(expensetype.startdate)
    this.enddate = new Date(expensetype.enddate)
    this.tourid = expensetype.id
    if(expensetype.onbehalfof){
      this.isonbehalf = true;
      this.onbehalf_empName= '('+expensetype.employee_code+') '+expensetype.employee_name
      console.log("onbehalf_empName",this.onbehalf_empName)
    } else {
      this.isonbehalf = false;
    }
    if(expensetype.applevel>0){
      this.isonbehalf = false;
      this.tourid=expensetype['tourid']
      this.approver = true;
     }

     if(expensetype.claim_status_id==2 || expensetype.claim_status_id==3 || expensetype.claim_status_id==4 ){
      this.approver = true;
    }



    this.miscellaneousform = this.formBuilder.group({
      tourno: this.tourid,
      employeename: expensetype.employee_name,
      designation: expensetype['empdesignation'],
      employeegrade: expensetype['empgrade'],
      tablerowdata: new FormArray([])



    })





    this.exptype = expensetype['expenseid']
    console.log("sf", this.exptype)
    this.comm = expensetype['requestercomment']
    console.log("cc", this.comm)
    this.datas = expensetype
    this.expenseid = this.datas['id']
    // this.miscellaneousform.get('tourno').setValue(this.tourid)
    console.log("datas", this.datas)
    this.reason = this.datas['reason']
    // if (this.reason == 'Transfer with family') {
    //   this.taservice.getexpreasonValue()
    //     .subscribe(result => {
    //       this.shiftreason = result[2].name
    //       console.log("Reason", this.reasonlist)
    //     })
    // }


    this.taservice.getexpreasonValueshifting()
      .subscribe(result => {
        this.hidelandry = false;
        this.reasonlist = result
        if (this.startdate != this.enddate){
          this.total = this.enddate - this.startdate;
          this.total =  (Math.round(this.total) / (1000 * 60 * 60 * 24)) + 1
        }
        else{
          this.total = 1;
        }
        if(this.total < 5){
          this.hidelandry = true;
          this.reasonlist.splice(0,1)
        }
        // for (let i = 0; i < this.reasonlist.length; i++) {
        //   if (this.reasonlist[i].name == 'Shifting Expenses' && this.reason != 'Transfer with family') {
        //     this.reasonlist.splice(i, 1)
        //   }
        //   // else {
        //   //   this.taservice.getexpreasonValue()
        //   //     .subscribe(result => {
        //   //       this.shiftreason = result
        //   //       console.log("Reason", this.shiftreason)
        //   //     })
        //   // }
        // }
        console.log("Reason", this.reasonlist)
      })


    this.tourdatas = expensetype;
    console.log("tddddd", this.tourdatas)
    this.employeename = this.tourdatas['employee_name']
    this.employeecode=this.tourdatas['employee_code']
    // this.miscellaneousform.get('employeename').setValue(this.employeename)

    this.employeegrade = this.tourdatas['empgrade']
    // this.miscellaneousform.get('employeegrade').setValue(this.employeegrade)

    this.employeedesignation = this.tourdatas['empdesignation']
    // this.miscellaneousform.get('designation').setValue(this.employeedesignation)

    let data = expense_edit;
    let datavalue = expensetype;
    console.log("data111", data)
    console.log("datavalue111", datavalue)
    this.expenceid = data['expenseid']
    this.commenter = data['requestercomment']
    this.expenseids = data['expenseid']
    if (datavalue['requestno'] != 0) {
      this.tourno = datavalue['requestno']
      console.log("id", this.tourno)
      this.existingdata(this.miscellaneousform.value.tourno)
      // this.taservice.getmisceditSummary(datas['id'])
      //   .subscribe((results: any[]) => {
      //     console.log("Tourmaker", results)
      //     let val = results['data']
      //     let varible = results['requestercomment']

      //     for (let i = 0; i < val.length; i++) {
      //       this.arrays = this.formBuilder.group({
      //         id: val[i]['id'],
      //         tourgid: val[i]['tourgid'],
      //         expense_id: val[i]['exp_id'],
      //         description: val[i]['description'],
      //         eligibleamount: val[i]['eligibleamount'],
      //         expreason: val[i]['expreason'],
      //         center: val[i]['center'],
      //         claimedamount: val[i]['claimedamount'],
      //         requestercomment: varible
      //       });
      //       const docu = this.miscellaneousform.get('tablerowdata') as FormArray;
      //       docu.push(this.arrays)
      //       console.log(this.arrays)
      //     }


      // this.miscellaneous = results;
      // this.approvedamount = results['approvedamount']
      // this.id = this.miscellaneous.id;
      // console.log("id", this.id)
      // this.claimid = this.miscellaneous.claimreqid;
      // console.log("claimid", this.claimid)
      // this.miscellaneous.tourid = this.tourno
      // });
    }
    // this.centrecall()



  }
  // addSection() {
  //   this.miscellaneous.data.push({
  //     ids: this.miscellaneous.data.length + 1,
  //     requestercomment: this.comm,
  //     expense_id: 6,
  //     tourgid: this.expenseid,
  //     description: '',
  //     expreason: '',
  //     claimedamount: '',
  //     center: ''
  //   })
  // }
  // removeSection(i) {
  //   this.miscellaneous.data.splice(i, 1);
  // }

  fromdatemin(i){
    let ind = this.pageSize * (this.p - 1) + i;
    if (ind ==  0){
      return this.startdate
    }
    else{
      let form = this.miscellaneousform.value.tablerowdata[ind-1]
      return form.fromdate
    }
  }

  check(i){
    let value = this.miscellaneousform.value.tablerowdata[i].fromdate
    console.log('CDSc',value)
  }

  centrecall() {
    this.taservice.getshiftCenter()
      .subscribe(result => {
        this.centerlist = result
        console.log("centerlist", this.centerlist)
      })
  }



  selectReason(e, ind) {
    console.log("e", e.value)
    let reason = e.value
    let myform = (this.miscellaneousform.get('tablerowdata') as FormArray).at(ind)
    myform.patchValue({
      center: 0
    })
    if (reason == 'shifting') {
      this.feild_disable = false
      this.taservice.getshiftCenter()
        .subscribe(result => {
          this.centerlist = result
          console.log("centerlist", this.centerlist)
        })
    }
    else {
      this.feild_disable = true
    }
  }
  center_check(i) {
    let ind = this.pageSize * (this.p - 1) + i;
    let myform = this.miscellaneousform.value.tablerowdata.at(ind).expreason;
    if (myform != 'shifting') {
      return true
    }
    else {
      return false
    }

  }
  getPosts(e) {
    this.center = e.value
    console.log(this.center);
    this.detailsframe = {
      "tourgid": this.expenseid,
      "center": this.center,
      "expense_id": this.expenseids,
    };

    this.taservice.getmisceligibleAmount(this.detailsframe)
      .subscribe(result => {
        this.eligibleamount = result['Eligible_amount']
        console.log("eligibleamount", this.eligibleamount)
        for (var i = 0; i < this.miscellaneousform.value.tablerowdata.length; i++) {
          this.miscellaneousform.value.tablerowdata[i]['eligibleamount'] = this.eligibleamount

        }
      })

  }
 

  
  existingdata(datas) {
    this.SpinnerService.show()
    this.taservice.getmisceditSummary(datas,this.report)
      .subscribe((results: any[]) => {
        console.log("Tourmaker", results)
        let val = results['data']
        let varible = results['requestercomment']

        for (let i = 0; i < val.length; i++) {
          this.arrays = this.formBuilder.group({
            id: val[i]['id'],
            tour_id: val[i]['tour_id'],
            expensegid: 9,
            // expensegid: val[i]['exp_id'],
            // expense: val[i]['expreason']['value'],
            // expense: val[i]['expreason']['value'],
            expense: val[i]['expense'],
            remarks: val[i]['remarks'],
            fromdate: this.datePipe.transform(val[i]['fromdate'], 'yyyy-MM-dd'),
            // this.datePipe.transform(value.data[i].date, 'yyyy-MM-dd')
            // center: val[i]['center']['value'],
            billno: val[i]['billno'],
            claimedamount: val[i]['claimedamount'].toFixed(2),
            // requestercomment: varible,
            requestercomment: this.commenter,
            approvedamount: val[i]['approvedamount'],
            eligibleamount: val[i]['eligibleamount']
          });
          // if (this.maker) {
          //   delete this.arrays['approvedamount']
          // }

          const docu = this.miscellaneousform.get('tablerowdata') as FormArray;
          docu.push(this.arrays)
          console.log('arrays', this.arrays.value)
        }

        if (this.miscellaneousform.value.tablerowdata.length == 0) {
        
          this.addSet()
        
        }
        this.SpinnerService.hide()
      });
      this.notification.showInfo(" CEO's approval email attachment - is mandatory if Alcohol / Tobacco is included in the bill.");
  }



  back() {
    // this.SpinnerService.show()
    this.router.navigateByUrl('ta/exedit')
    // this.SpinnerService.hide()
  }

  miscellaneouscreatecall(value) {
    
    for (let i = 0; i < value.data.length; i++) {
      value.data[i].fromdate = this.datePipe.transform(value.data[i].fromdate, 'yyyy-MM-dd');
    }
    console.log("ass json", value)
    this.SpinnerService.show()
    this.taservice.miscellaneousCreate(value)
      .subscribe(res => {
        console.log("resss", res)
        if (res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success") {
          this.notification.showSuccess("Success....")
          this.SpinnerService.hide()
          this.onSubmit.emit();
          return true;
        }
        else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
          return false;

        }
      }
      )

  }


  createnewitem(): FormGroup {


    let dataArraySet = this.formBuilder.group({
      tour_id: this.miscellaneousform.value.tourno,
      expensegid: 9,
      remarks: null,
      eligibleamount: null,
      expense: null,
      fromdate: null,
      // center: 0,
      billno: null,
      claimedamount: null,
      requestercomment: this.commenter
    })
    return dataArraySet;
  }

  addSet() {
    const data = this.miscellaneousform.get('tablerowdata') as FormArray;
    data.push(this.createnewitem());
    console.log(this.miscellaneousform.value)
    this.length = this.miscellaneousform.value.tablerowdata.length
  }
  formarraydatadelete(i) {

    let dat = this.pageSize * (this.p - 1) + i;
    const control = <FormArray>this.miscellaneousform.controls['tablerowdata'];
    control.removeAt(dat)
  }
  sub(val) {
    let datas

    let value = this.miscellaneousform.value.tablerowdata;
    console.log('values', value)

    for (let i = 0; i < value.length; i++) {
      console.log(value[i].center)
      // if (value[i].center == "" || value[i].center == null) {
      //   delete value[i]['center'];
      // }
      if (value[i]['eligibleamount'] == "" || value[i]['eligibleamount'] == null) {

        delete value[i]['eligibleamount'];
      }

      if (value[i]['expense'] == "" || value[i]['expense'] == null) {
        value[i]['expense'] = null
        this.notification.showError('Please Select Sub Category')
        throw new Error
      }

      if (value[i]['fromdate'] == "" || value[i]['fromdate'] == null) {
        value[i]['fromdate'] = null
        this.notification.showError('Please Select Date')
        throw new Error
      }

      // if (value[i]['remarks'] == "" || value[i]['remarks'] == null) {
      //   value[i]['remarks'] = null
      //   this.notification.showError('Please enter Description')
      //   throw new Error
      // }

      
      // if (value[i]['billno'] == "" || value[i]['billno'] == null) {
      //   value[i]['billno'] = null
      //   this.notification.showError('Please Enter Bill No')
      //   throw new Error
      // }
      if (value[i]['claimedamount'] == "" || value[i]['claimedamount'] == null) {
        value[i]['claimedamount'] = null
        this.notification.showError('Please enter Total Amount')
        throw new Error
      }
      if (value[i]['claimedamount']) {
        value[i]['claimedamount'] = JSON.parse(value[i]['claimedamount'])
      }
      
    }

    let obj = {
      data: value
    }

    console.log("obbbb", obj)
    this.miscellaneouscreatecall(obj);

    
    // const control = <FormArray>this.miscellaneousform.controls['tablerowdata'];
    // control.clear()

    // this.SpinnerService.show()

    // setTimeout(() => {

    //   this.existingdata(this.miscellaneousform.value.tourno);
    //   this.SpinnerService.hide();
    // }, 1000);
    // this.back()


  }

  fieldGlobalIndex(index) {
    let dat = this.pageSize * (this.p - 1) + index;
    return dat
  }

  space(e) {
    if (e.target.selectionStart === 0 && e.code === 'Space') {
      e.preventDefault();
    }
    
  }
  minus(e) {
    if (e.charCode >= 48 && e.charCode <= 57) {
      e.preventDefault();
    }
    else if (e.charCode == 190) {
      e.preventDefault();
    }
    else {
      return
    }
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

  getupdateapprove() {
    this.approverarray.splice(0, this.approverarray.length)

    for (let i = 0; i < this.miscellaneousform.value.tablerowdata.length; i++) {
      let json = {
        "id": this.miscellaneousform.value.tablerowdata[i].id,
        "amount": JSON.parse(this.miscellaneousform.value.tablerowdata[i].approvedamount),
      }
      this.approverarray.push(json)

    }

    console.log('approveamountchange', this.approverarray)
    console.log('expid', this.expenseids)
    this.approverupdate(this.miscellaneousform.value.tourno, 9, this.approverarray)


  }

  backchecker() {
    if(this.applevel == 0){
      this.router.navigateByUrl('ta/exedit')
    }
    else if(this.applevel==1 && this.report){
      this.router.navigateByUrl('ta/report')

    }
    else{
      this.router.navigateByUrl('ta/exapprove-edit')
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

  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 62 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || k== 33 || (k >= 44 && k <= 58));
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
  decs(name: HTMLElement,ind,evt){
    let value = name.getAttribute('formControlName')
    let amt =Number(evt.target.value)
    this.miscellaneousform.get('tablerowdata')['controls'].at(ind).get(value).setValue(amt.toFixed(2))
  }

  nospace(e) {
    if ( e.code === 'Space') {
      e.preventDefault();
    }
    
  }

}   