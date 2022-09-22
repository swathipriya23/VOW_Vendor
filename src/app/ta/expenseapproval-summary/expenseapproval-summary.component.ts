import { Component, OnInit } from '@angular/core';
import {TaService} from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import {ActivatedRoute, Router} from "@angular/router";
import{ShareService} from 'src/app/ta/share.service';
import { FormGroup,FormBuilder } from '@angular/forms';
import { formatDate, DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-expenseapproval-summary',
  templateUrl: './expenseapproval-summary.component.html',
  styleUrls: ['./expenseapproval-summary.component.scss']
})
export class ExpenseapprovalSummaryComponent implements OnInit {
  has_next=true;
  has_previous=true;
  getapprovexpenceList:any
  approvexpencesummarypage:number=1;
  pagesize=10;

  gettourapproveList:any
  memoSearchForm : FormGroup;
  tourapprovesummarypage:number=1;
  send_value:String=""
  currentpage: number = 1;
  presentpage: number = 1;
  tourApprovalSearchForm:FormGroup;
  expenseapprovesearch:any
  status: any;
  statusList: any;
  isTourChecker: boolean;
 
  statusId: any = 2;
  statusselected: any='PENDING';
  onbehalf: number = 0;
  

  constructor(private  taService:TaService,private sharedService:SharedService,private route: ActivatedRoute,private router: Router,
    private shareservice:ShareService,private sharedservice:SharedService,private datePipe: DatePipe,private fb:FormBuilder,
    private SpinnerService : NgxSpinnerService) { }

  

  ngOnInit(): void {
    this.statusId=this.shareservice.statusvalue.value;
    let tourno = this.shareservice.tourno.value;
    let request_date= this.shareservice.requestdate.value;
    let employee=this.shareservice.expemployee.value;
    let branchid= this.shareservice.expbranchid.value;
    let onbehalf= this.shareservice.exponbehalf.value;
    console.log('statusid',this.statusId)
    console.log('tourno',tourno)
    console.log('request_date',request_date)
    console.log('employeename',employee)
    console.log('branchid',branchid)
    this.send_value = ''
    request_date = this.datePipe.transform(request_date,"dd-MMM-yyyy");
    if (tourno){
      this.send_value = this.send_value+"&tour_no="+tourno
    }
    if (tourno && request_date){

      console.log(request_date)
      this.send_value = this.send_value+"&request_date="+request_date
    }
    else if(request_date){
      this.send_value = "&request_date="+request_date
    }
    if (branchid){
      this.send_value = this.send_value+"&branch_id="+branchid
    }
    if(employee != '' && employee != null){
      this.send_value = this.send_value+"&makerid="+employee
    }

    if(onbehalf){
      this.onbehalf = onbehalf;
      this.send_value = this.send_value +"&onbehalf="+onbehalf;
    }
    
    this.tourApprovalSearchForm = this.fb.group({
      tourno:[''],
      requestdate:[''],
      
    })


    // if (tourno){
    //   this.send_value = this.send_value+"&tour_no="+tourno
    // }
    // if (tourno && request_date){
    //   console.log(request_date)
    //   this.send_value = this.send_value+"&request_date="+request_date
    // }
    // else if(request_date){
    //   this.send_value = "&request_date="+request_date
    // }
    // if (reqsts != ""){
    //   this.send_value = this.send_value+"&booking_status="+reqsts
    // }
    // if (branchid){
    //   this.send_value = this.send_value+"&branch_id="+branchid
    // }
    // if(employee != '' && employee != null){
    //   this.send_value = this.send_value+"&makerid="+employee
    // }

    this.getapprovesumm(this.send_value,1);
    this.getstatusvalue();
  }
    getstatusvalue(){
      this.taService.getstatus()
      .subscribe(res=>{
        this.statusList=res
        const exp_list = this.statusList.filter(function(record){ return record.name != "FORWARD"});
        this.statusList=exp_list
        console.log("statusList",this.statusList)
      })
    }

    
  tourApproverSearch(){
    this.send_value=""
    let form_value = this.tourApprovalSearchForm.value;

    if(form_value.tourno != "")
    {
      this.send_value=this.send_value+"&tour_no="+form_value.tourno
    }
    if(form_value.requestdate != "")
    {
      let date=this.datePipe.transform(form_value.requestdate,"dd-MMM-yyyy");
      this.send_value=this.send_value+"&request_date="+date
    }

    this.getapprovesumm(this.send_value,this.currentpage)

  }

  oddeven(i){
    if (Number(i) % 2 == 0){
      return false;
    }
    else{
      return true;
    }
  }

  getapprovesumm(val,
    pageNumber) {
      this.SpinnerService.show()
    this.taService.getapprovexpenceSummary(this.statusId,pageNumber,val)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        this.getapprovexpenceList = datas;
        let datapagination = results["pagination"];
        this.getapprovexpenceList = datas;
        if (this.getapprovexpenceList.length === 0) {
          this.isTourChecker = false
        }
        if (this.getapprovexpenceList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
          this.isTourChecker = true
        }
      })
  
  }
  reset(){
    this.send_value=""
    this.tourApprovalSearchForm = this.fb.group({ 
      tourno:[''],
      requestdate:[''],
      
    })
    this.getapprovesumm(this.send_value,this.currentpage)
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
    if(status_name=="RETURN"){
      this.statusId= 5
    }
    if(status_name=="FORWARD"){
      this.statusId= 6
    }

    this.getapprovesumm(this.send_value,this.currentpage)
  }
  TourapprovenextClick() {
    if (this.has_next === true) {
      this.getapprovesumm(this.send_value,this.currentpage + 1)
    }
  }
  
  TourapprovepreviousClick() {
    if (this.has_previous === true) {
      this.getapprovesumm(this.send_value,this.currentpage - 1)
    }
  
  
  }
  getapprovexpencesumm(val,
    pageNumber) {
    this.taService.getapprovexpenceSummary(this.statusId,pageNumber,val)
    .subscribe(result => {
    console.log("Tourmaker", result)
    let datas = result['data'];
    this.getapprovexpenceList = datas;
    let datapagination = result["pagination"];
    this.getapprovexpenceList = datas;
    if (this.getapprovexpenceList.length >= 0) {
    this.has_next = datapagination.has_next;
    this.has_previous = datapagination.has_previous;
    this.approvexpencesummarypage = datapagination.index;
    }
    })
    }
    approvexpencenextClick() {
      if (this.has_next === true) {
        this.getapprovexpencesumm(this.approvexpencesummarypage + 1, 10)
      }
    }
  
    approvexpencepreviousClick() {
      if (this.has_previous === true) {
        this.getapprovexpencesumm(this.approvexpencesummarypage - 1, 10)
      }
    }
    approveexpenceEdit(data){
      delete data.onbehalfof
      this.shareservice.expensesummaryData.next(data)
      data.onbehalfapp = this.onbehalf
      var datas = JSON.stringify(Object.assign({}, data));
      localStorage.setItem("expense_details",datas) 
      this.router.navigateByUrl('ta/exapprove-edit');
    }
    searchClick(){

    }
    clearclick(){
      this.expenseapprovesearch.requestno='',
      this.expenseapprovesearch.requestdate=''
    }

}
