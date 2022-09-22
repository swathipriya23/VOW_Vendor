import { Component, OnInit } from '@angular/core';
import{FormControl,FormGroup,FormBuilder,Validators,FormArray} from '@angular/forms';
import {isBoolean} from 'util';
// import { formatDate } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import {ShareService} from '../share.service'
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import {TaService} from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-canceladd-summary',
  templateUrl: './canceladd-summary.component.html',
  styleUrls: ['./canceladd-summary.component.scss']
})
export class CanceladdSummaryComponent implements OnInit {

 
  getcanceladdsummList:any
  has_next=true;
  has_previous=true;
  gettourapproveList:any
  tourcancelsummarypage:number=1;
  pagesize=10;
  ismmm:any
  memoSearchForm : FormGroup;
  advancecancelsummarypage:number=1;
  advance:boolean=false
  datas: any;
  tour:boolean=true;
  pageNumber = 1
  getcancelsummList: any;
  tourcancel: { requestno: string; requestdate: string; tour: string; advance: string; };
  claim: any;
  getcanceladvanceList: any;
  date: string;
  select: Date;
  tourupdate: boolean;
  advupdate: boolean;
  value: number;
  onbehalfname: any;
  onbehalfempid: number = 0;
  data: any
  datass: any;
  constructor(private  taService:TaService,private sharedService:SharedService,private shareservice:ShareService,private fb:FormBuilder,private datePipe: DatePipe,private route: ActivatedRoute,
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
  getcanceltoursumm(val,pageNumber = 1, pageSize = 10) {
    if(this.value === 1){
    this.taService.getCancelAddMakerSummary(val,pageNumber)
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
      this.taService.getCancelAddMakeronbehalfSummary(val,pageNumber,this.onbehalfempid)
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
    else{
      return false;
    }
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
  TourcanceladdnextClick() {
    if (this.has_next === true) {
      this.getcanceltoursumm(this.send_value,this.tourcancelsummarypage + 1, 10)
    }
  }
  
  TourcanceladdpreviousClick() {
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
  advancetour(){
    this.advupdate=true
    this.advance=true;
    this.tour=false;
    this.getcanceladvancesumm(this.send_value,this.advancecancelsummarypage,this.pagesize);
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
      this.claim=this.datas[i].claim_status;
      console.log("claim", this.claim)
      if(this.claim==undefined || this.claim==null)
      {
        let onbehalf = {
          'onbename': this.onbehalfname,
          'onbeid':this.onbehalfempid
        }
        this.datass=data
        this.datass.type="AdvanceCancel"
        var datam = JSON.stringify(Object.assign({}, onbehalf));
          localStorage.setItem('onbehalf',datam)
        var datas = JSON.stringify(Object.assign({},  this.datass));
        localStorage.setItem('advancemakersummary',datas)
        this.router.navigateByUrl('ta/advancemaker');
      }
      else{
        let onbehalf = {
          'onbename': this.onbehalfname,
          'onbeid':this.onbehalfempid
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
    this.taService.getCancelAddMakeradvanceSummary(val,pageNumber)
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
      this.taService.getCancelAddMakeradvanceonbehalfSummary(val,pageNumber,this.onbehalfempid)
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
    else{
      return false;
    }
  }
  TourcanceladvancenextClick() {
    if (this.has_next === true) {
      this.getcanceladvancesumm(this.send_value,this.advancecancelsummarypage + 1, 10)
    }
  }
  
  TourcanceladvancepreviousClick() {
    if (this.has_previous === true) {
      this.getcanceladvancesumm(this.send_value,this.advancecancelsummarypage - 1, 10)
    }
  }
}

