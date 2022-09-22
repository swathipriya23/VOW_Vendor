import { Component, OnInit } from '@angular/core';
import{FormControl,FormGroup,FormBuilder,Validators,FormArray} from '@angular/forms';
import {isBoolean} from 'util';
// import { formatDate } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import {TaService} from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-cancelapproval-summary',
  templateUrl: './cancelapproval-summary.component.html',
  styleUrls: ['./cancelapproval-summary.component.scss']
})
export class CancelapprovalSummaryComponent implements OnInit {

  tourcancelapproval:any
  gettourcancelappsummList:any
  has_next=true;
  memoSearchForm: FormGroup;
  tour:boolean=true;
  statusId: number = 2
  advance:boolean=false;
  has_previous=true;
  gettourapproveList:any
  tourcancelappsummarypage:number=1;
  advancecancelsummarypage:number=1;
  pagesize=10;
  getadvancecancelappsummList: any;
  datas: any;
  claim: any;
  date: string;
  select: Date;
  advupdate: boolean;
  tourupdate: boolean;
  status: any;
  statusList: any;
  constructor(private  taService:TaService,private sharedService:SharedService,private fb:FormBuilder,private datePipe: DatePipe,private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.memoSearchForm = this.fb.group({
      tourno:[''],
      requestdate:[''],
    })
    this.gettourcancelappsumm(this.send_value,this.tourcancelappsummarypage,this.pagesize);
    this.getstatusvalue();
  }
  getstatus(value){
    this.status = value
    console.log("this.status",this.status)
    }
    getstatusvalue(){
      this.taService.getstatus()
      .subscribe(res=>{
        this.statusList=res
        const exp_list = this.statusList.filter(function(record){ return record.name != "FORWARD"&&record.name != "RETURN"});
      this.statusList=exp_list
        console.log("statusList",this.statusList)
      })
    }
  canceledit(data){
    console.log("this.datas",this.datas)
    for(var i=0;i<this.datas.length;i++){
      this.claim=this.datas[i].apptype;
      console.log("claim", this.claim)
      if(this.claim=="TourCancel")
      {
        let onbehalf = {
          'onbename': null,
          'onbeid':0
        }
        var datam = JSON.stringify(Object.assign({}, onbehalf));
          localStorage.setItem('onbehalf',datam)
        var datass = JSON.stringify(Object.assign({}, data));
        localStorage.setItem('tourmakersummary',datass)
        this.router.navigateByUrl('ta/tourmaker');
      }
      else{
        let onbehalf = {
          'onbename': null,
          'onbeid':0
        }
        var datam = JSON.stringify(Object.assign({}, onbehalf));
          localStorage.setItem('onbehalf',datam)
        var datass = JSON.stringify(Object.assign({}, data));
        localStorage.setItem('advancemakersummary',datass)
        this.router.navigateByUrl('ta/advancemaker');
      }
}
  }
  advancetour(){
  this.advupdate=true
    this.advance=true;
    this.tour=false;
    this.getadvancecancelappsumm(this.send_value,this.tourcancelappsummarypage,this.pagesize);
  }
  tourcancell(){
  this.tourupdate=true
   this.advance=false;
   this.tour=true;
   this.gettourcancelappsumm(this.send_value,this.tourcancelappsummarypage,this.pagesize);
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
    this.gettourcancelappsumm(this.send_value,this.tourcancelappsummarypage,this.pagesize)
    }
    else if(this.advupdate){
    this.advance=true;
    this.tour=false;
    this.getadvancecancelappsumm(this.send_value,this.advancecancelsummarypage,this.pagesize);
    }
    else{
    this.gettourcancelappsumm(this.send_value,this.tourcancelappsummarypage,this.pagesize)
    }
  }
  searchClick(){
  }
  gettourcancelappsumm(val,pageNumber = 1, pageSize = 10) {
    this.taService.getCancelapproveSummary(this.statusId,pageNumber,val)
    .subscribe(result => {
      console.log("Tourapprover", result)
      this.datas = result['data'];
      this.gettourcancelappsummList = this.datas;
      let datapagination = result["pagination"];
      this.gettourcancelappsummList = this.datas;
      if (this.gettourcancelappsummList.length >= 0) {
      this.has_next = datapagination.has_next;
      this.has_previous = datapagination.has_previous;
      this.tourcancelappsummarypage = datapagination.index;
      }
    })
  }
  getadvancecancelappsumm(val,pageNumber = 1, pageSize = 10) {
    this.taService.getCancelapproveadvanceSummary(this.statusId,pageNumber,val)
    .subscribe(result => {
      console.log("Tourapprover", result)
      this.datas = result['data'];
      this.getadvancecancelappsummList = this.datas;
      let datapagination = result["pagination"];
      this.getadvancecancelappsummList = this.datas;
      if (this.getadvancecancelappsummList.length >= 0) {
      this.has_next = datapagination.has_next;
      this.has_previous = datapagination.has_previous;
      this.advancecancelsummarypage = datapagination.index;
      }
    })
  }
  TourcancelnextClick() {
    if (this.has_next === true) {
      this.gettourcancelappsumm(this.tourcancelappsummarypage + 1, 10)
    }
  }
  
  TourcancelpreviousClick() {
    if (this.has_previous === true) {
      this.gettourcancelappsumm(this.tourcancelappsummarypage - 1, 10)
    }
  }
  TourcanceladvancenextClick() {
    if (this.has_next === true) {
      this.getadvancecancelappsumm(this.advancecancelsummarypage + 1, 10)
    }
  }
  
  TourcanceladvancepreviousClick() {
    if (this.has_previous === true) {
      this.getadvancecancelappsumm(this.advancecancelsummarypage - 1, 10)
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
      this.gettourcancelappsumm(this.send_value,this.tourcancelappsummarypage,this.pagesize)
      }
      if(this.advupdate){
      this.advance=true;
      this.tour=false;
      this.getadvancecancelappsumm(this.send_value,this.advancecancelsummarypage,this.pagesize);
      }
      else{
        this.gettourcancelappsumm(this.send_value,this.tourcancelappsummarypage,this.pagesize)
        }
  }
  onStatusChange(e) {
    let status_name:any  = e
    if(status_name=="APPROVED"){
      this.statusId= 3
    }
    if(status_name=="PENDING"){
      this.statusId= 2
    }
    if(status_name=="REJECTED"){
      this.statusId= 4
    }
   

    if(this.tourupdate){
      this.tour=true;
      this.advance=false;
      this.gettourcancelappsumm(this.send_value,this.tourcancelappsummarypage,this.pagesize)
      }
      else if(this.advupdate){
      this.advance=true;
      this.tour=false;
      this.getadvancecancelappsumm(this.send_value,this.advancecancelsummarypage,this.pagesize);
      }
      else{
      this.gettourcancelappsumm(this.send_value,this.tourcancelappsummarypage,this.pagesize)
      }
  }
}
