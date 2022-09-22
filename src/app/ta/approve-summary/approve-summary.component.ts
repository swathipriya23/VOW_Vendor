import { Component, OnInit } from '@angular/core';
import {TaService} from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import {ActivatedRoute, Router} from "@angular/router";
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-approve-summary',
  templateUrl: './approve-summary.component.html',
  styleUrls: ['./approve-summary.component.scss']
})
export class ApproveSummaryComponent implements OnInit {
  has_next=true;
  has_previous=true;
  getapproveList:any
  tourapprovepage:number=1;
  currentpage: number = 1;
  presentpage: number = 1;
  pagesize=10;
  advanceapprovesearch:any
  memoSearchForm: any;
  value: any;
  onbehalfname: any;
  onbehalfempid: number = 0;
  tour: any;
  date: string;
  select: Date;
  getTourmakerList: any;
  isTourMakerpage: boolean;
  isAddbtn: boolean;
  datas: number;


  constructor(private  taService:TaService,private sharedService:SharedService,private route: ActivatedRoute,
    private fb:FormBuilder,private datePipe: DatePipe,
    private router: Router) { }

  ngOnInit(): void {
    let values = JSON.parse(localStorage.getItem('onbehalf'));
    if(values.onbename){
      this.value=0
      this.onbehalfname=values.onbename
      this.onbehalfempid =values.onbeid
    }
    else{
      this.value = 1
    }
    
    this.memoSearchForm = this.fb.group({
      tourno:[''],
      requestdate:[''],
    })
    const heroId = this.route.snapshot.paramMap.get('id');
    this.gettourmakersummary(this.send_value,this.currentpage,this.pagesize)
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

gettourmakersummary(val,
pageNumber,pageSize) {
if(this.value === 1){
this.taService.getAdvancemakerSummary(val,pageNumber)
  .subscribe((results: any[]) => {
    let datas = results["data"];
    this.getTourmakerList = datas;
    let datapagination = results["pagination"];
    this.getapproveList = datas;
    if (this.getTourmakerList.length === 0) {
      this.isTourMakerpage = false
    }
    if (this.getTourmakerList.length > 0) {
      this.has_next = datapagination.has_next;
      this.has_previous = datapagination.has_previous;
      this.currentpage = datapagination.index;
      this.isTourMakerpage = true
    }
  })
}
else{
  this.taService.getAdvancemakerSummaryonbehalf(val,pageNumber,this.onbehalfempid)
  .subscribe((results: any[]) => {
  // console.log("Tourmakerresult",results)
  let datas = results['data'];
  this.getapproveList= datas;
  })
}
}
TourmakernextClick() {
if (this.has_next === true) {
  this.gettourmakersummary(this.send_value,this.currentpage + 1,this.pagesize)
}
}
TourmakerpreviousClick() {
if (this.has_previous === true) {
  this.gettourmakersummary(this.send_value,this.currentpage - 1,this.pagesize)
}
}
approveEdit(data){
  let onbehalf = {
    'onbename': this.onbehalfname,
    'onbeid':this.onbehalfempid
  }
  var datass = JSON.stringify(Object.assign({}, onbehalf));
    localStorage.setItem('onbehalf',datass)
 
  var datas = JSON.stringify(Object.assign({}, data));
    localStorage.setItem('advancemakersummary',datas)
      this.sharedService.summaryData.next(data)
      this.router.navigateByUrl('ta/advancemaker');
}
searchClick(){
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
  this.gettourmakersummary(this.send_value,this.currentpage,this.pagesize)
}
reset(){
  this.send_value=""
  this.memoSearchForm = this.fb.group({
    tourno:[''],
    requestdate:[''],
  })
  this.gettourmakersummary(this.send_value,this.currentpage,this.pagesize)
}
}