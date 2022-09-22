import { Component, OnInit } from '@angular/core';
import{FormControl,FormGroup,FormBuilder,Validators,FormArray} from '@angular/forms';
import {isBoolean} from 'util';
// import { formatDate } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {ShareService} from '../share.service'
import { NotificationService } from '../notification.service'
import {TaService} from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import {ActivatedRoute, Router} from "@angular/router";
export const PICK_FORMATS = {
  parse: {dateInput: {month: 'short', year: 'numeric', day: 'numeric'}},
  display: {
      dateInput: 'input',
      monthYearLabel: {year: 'numeric', month: 'short'},
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'}
  }
};
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
          return formatDate(date,'dd-MMM-yyyy',this.locale);
      } else {
          return date.toDateString();
      }
  }
}

@Component({
  selector: 'app-cancelmaker-summary',
  templateUrl: './cancelmaker-summary.component.html',
  styleUrls: ['./cancelmaker-summary.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
    DatePipe
]
})
export class CancelmakerSummaryComponent implements OnInit {
  tourcancel:any
  getcancelsummList:any
  has_next=true;
  has_previous=true;
  gettourapproveList:any
  tourcancelsummarypage:number=1;
  pagesize=10;
  ismmm:any
  advance:boolean=false
  tour:boolean=true;
  getcanceladvanceList:any
  advancecancelsummarypage:number=1;
  claim: any;
  datas: any;
  memoSearchForm: FormGroup;
  date: string;
  select: Date;
  advupdate: boolean;
  onbehalfname:any
  onbehalfempid:any
  tourupdate: boolean;
  data: any
  value: any;
  constructor(private  taService:TaService,private fb:FormBuilder,private shareservice:ShareService,private sharedService:SharedService,private datePipe: DatePipe,private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    let values:any =this.shareservice.radiovalue.value
    if (values === ''){
      this.value = null
    }
    else if (values === 0){
      this.value=0
    }
    else if(values === 1){
      this.value = 1
    }
    else if (values === "1"){
      this.value = 1
    }
    this.memoSearchForm = this.fb.group({
      tourno:[''],
      requestdate:[''],
    })
   
    let datas: any = this.shareservice.fetchData.value;
    console.log("datas",datas)
    if(datas){
      this.onbehalfname=datas.employee_name
      this.onbehalfempid =datas.employeegid
    }
    this.getcanceltoursumm(this.send_value,this.tourcancelsummarypage,this.pagesize);
  }
  
  tourno(e){
    this.tour = e.target.value
    console.log("this.tour",this.tour)
  }
  fromDateSelection(event: string) {
    let latest= event
    this.date =this.datePipe.transform(latest, 'dd-MMM-yyyy');
    console.log("this.date", this.date)
    console.log("fromdate", event)
    const date = new Date(event)
    this.select = new Date(date. getFullYear(), date.getMonth(), date.getDate() )
  }
  send_value:String=""
  tourMakerSearch(){
    let form_value = this.memoSearchForm.value;
    if(form_value.tourno != "")
    {
      this.send_value=this.send_value+"&tour_no="+form_value.tourno
    }
    if(form_value.requestdate != "")
    {
      let date=this.datePipe.transform(form_value.requestdate,"dd-MMM-yyyy");
      this.send_value=this.send_value+"&request_date="+date
    }
    if(this.tourupdate){
    this.tour=true;
    this.advance=false;
    this.getcanceltoursumm(this.send_value,this.tourcancelsummarypage,this.pagesize)
    }
    else if(this.advupdate){
    this.advance=true;
    this.tour=false;
    this.getcanceladvancesumm(this.send_value,this.advancecancelsummarypage,this.pagesize);
    }
    else{
    this.getcanceltoursumm(this.send_value,this.tourcancelsummarypage,this.pagesize)
    }
  }
  searchClick(){
  }
  getcanceltoursumm(val,pageNumber = 1, pageSize = 10) {
  if(this.value === 1){
    this.taService.getCancelMakerSummary(val,pageNumber)
    .subscribe(result => {
      console.log("cancelmkrtour", result)
      this.datas = result['data'];
      console.log("this.datas",this.datas)
      this.getcancelsummList = this.datas;
      let datapagination = result["pagination"];
      this.getcancelsummList = this.datas;
      if (this.getcancelsummList.length >= 0) {
      this.has_next = datapagination.has_next;
      this.has_previous = datapagination.has_previous;
      this.tourcancelsummarypage = datapagination.index;
      }
    })
  }
    else if (this.value === 0){
      this.taService.getCancelMakeronbehalfSummary(val,pageNumber,this.onbehalfempid)
      .subscribe(result => {
        this.datas = result['data'];
        console.log("this.datas",this.datas)
        this.getcancelsummList = this.datas;
        let datapagination = result["pagination"];
        this.getcancelsummList = this.datas;
        if (this.getcancelsummList.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.tourcancelsummarypage = datapagination.index;
        }
      })
    }
    else{
      return false;
    }
  }
  
  TourcancelnextClick() {
    if (this.has_next === true) {
      this.getcanceltoursumm(this.send_value,this.tourcancelsummarypage + 1, 10)
    }
  }
  
  TourcancelpreviousClick() {
    if (this.has_previous === true) {
      this.getcanceltoursumm(this.send_value,this.tourcancelsummarypage - 1, 10)
    }
  }
  clearclick(){
    this.send_value=""
    this.memoSearchForm = this.fb.group({
      tourno:[''],
      requestdate:[''],
    })
    if(this.tourupdate){
      this.tour=true;
      this.advance=false;
      this.getcanceltoursumm(this.send_value,this.tourcancelsummarypage,this.pagesize)
      }
      if(this.advupdate){
      this.advance=true;
      this.tour=false;
      this.getcanceladvancesumm(this.send_value,this.advancecancelsummarypage,this.pagesize);
      }
      else{
        this.getcanceltoursumm(this.send_value,this.tourcancelsummarypage,this.pagesize)
        }
  }
  canceladd(){
    let onbehalf = {
      'onbename': this.onbehalfname,
      'onbeid':this.onbehalfempid
    }
    var datass = JSON.stringify(Object.assign({}, onbehalf));
      localStorage.setItem('onbehalf',datass)
    this.router.navigateByUrl('ta/canceladd');
  }
  advancetour(){
  this.advupdate=true
    this.advance=true;
    this.tour=false;
    this.getcanceladvancesumm(this.send_value,this.tourcancelsummarypage,this.pagesize);
  }
  tourcancell(){
  this.tourupdate=true
   this.advance=false;
   this.tour=true;
   this.getcanceltoursumm(this.send_value,this.tourcancelsummarypage,this.pagesize);
  }
  canceledit(data){
    console.log("this.datas",this.datas)
    for(var i=0;i<this.datas.length;i++){
      this.claim=this.datas[i].type;
      console.log("claim", this.claim)
      if(this.claim=="AdvanceCancel")
      {
        let onbehalf = {
          'onbename': this.onbehalfname,
          'onbeid':this.onbehalfempid
        }
        var datam = JSON.stringify(Object.assign({}, onbehalf));
          localStorage.setItem('onbehalf',datam)
        var datass = JSON.stringify(Object.assign({}, data));
        localStorage.setItem('advancemakersummary',datass)
        this.router.navigateByUrl('ta/advancemaker');
      }
      else{
        let onbehalf = {
          'onbename': this.onbehalfname,
          'onbeid':this.onbehalfempid,
          'app':1
        }
        var datam = JSON.stringify(Object.assign({}, onbehalf));
          localStorage.setItem('onbehalf',datam)
       
        var datass = JSON.stringify(Object.assign({}, data));
        localStorage.setItem('tourmakersummary',datass)
        this.router.navigateByUrl('ta/tourmaker');
      }
}
  }
  getcanceladvancesumm(val,pageNumber = 1, pageSize = 10) {
    if(this.value === 1){
    this.taService.getCancelMakeradvanceSummary(val,pageNumber)
    .subscribe(result => {
      console.log("cancelmkrtour", result)
      this.datas = result['data'];
      this.getcanceladvanceList = this.datas;
      let datapagination = result["pagination"];
      this.getcanceladvanceList = this.datas;
      if (this.getcanceladvanceList.length >= 0) {
      this.has_next = datapagination.has_next;
      this.has_previous = datapagination.has_previous;
      this.advancecancelsummarypage = datapagination.index;
      }
    })
  }
    else if (this.value === 0){
      this.taService.getCancelMakeradvanceonbehalfSummary(val,pageNumber,this.onbehalfempid)
      .subscribe(result => {
        this.datas = result['data'];
        console.log("this.datas",this.datas)
        this.getcancelsummList = this.datas;
        let datapagination = result["pagination"];
        this.getcancelsummList = this.datas;
        if (this.getcancelsummList.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.tourcancelsummarypage = datapagination.index;
        }
      })
    }
    else{
      return false;
    }
  }
  TourcanceladvancenextClick() {
    if (this.has_next === true) {
      this.getcanceltoursumm(this.send_value,this.advancecancelsummarypage + 1, 10)
    }
  }
  
  TourcanceladvancepreviousClick() {
    if (this.has_previous === true) {
      this.getcanceltoursumm(this.send_value,this.advancecancelsummarypage - 1, 10)
    }
  }
}
