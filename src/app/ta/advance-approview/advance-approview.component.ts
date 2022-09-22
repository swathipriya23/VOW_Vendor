// import { Component, OnInit } from '@angular/core';
import { Component, OnInit ,Output,EventEmitter} from '@angular/core';
import{FormControl,FormGroup,FormBuilder,Validators,FormArray} from '@angular/forms';
import {isBoolean} from 'util';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import {TaService} from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import {ActivatedRoute, Router} from "@angular/router";
import{ShareService} from 'src/app/ta/share.service';
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
  selector: 'app-advance-approview',
  templateUrl: './advance-approview.component.html',
  styleUrls: ['./advance-approview.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
    DatePipe
]
})
export class AdvanceApproviewComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();  
   
  taAddForm:FormGroup
  currentDate: any = new Date();
  // date = new Date().toLocaleDateString();
  defaultDate = new FormControl(new Date());
  today = new Date();
  date=new Date();
  latest:any
  employeelist:Array<any>
  overall:any
  isDisabled:true;
  show_cancelrejectdiv:boolean
  show_cancelapprovediv:boolean
  show_cancelbtn:boolean
  show_rejectdiv:boolean
  show_returndiv:boolean
  days:any
  tourmodel:any
  values=[];
  tourdata=[];
  stratdate:Date;
  enddate:Date;
  endatetemp:Date
  ishidden:boolean = true;
  ishide:boolean = false;
  isshow:boolean = true;
  startdatetemp:Date
  starttdate:any
  fileData: File = null;
  previewUrl:any = null;
  tourapprove:any
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  totall:number;
  select:any;
  selectto:any;
  request:any
  total:any;
  a:any
  feild_disable:any
  show_approvebtn:any
  show_submitbtn:any
  status:any
  approverid:any
  reasonlist:Array<any>
  approveid:any
  isnew:boolean
  istaapprove:any
  show_approvediv:boolean
  comments:any
  data_final:any
  datass: any;
  advancecancel: any
  cancellid: any;
  comment: any;
  approval: any;
  id: any;
  appamount: any;
  allowamount: any;
  appamount1: any;
  reqamount: any;
  amount: any;
  appid: void;
  advanceapprove: any;
  approvalid: any;
  ad_status: any;
  tourgid: any;
  getAdvanceapproveList: any;
  dataa: any;
  statusvalue: any;
  statusval: any;
  ccbs: any;
  ccbsval: any;
  amountval: any;
  bsidval: any;
  percentage: any;
  percentageval: any;
  reqamount1: any;
  constructor(private formBuilder: FormBuilder,private datePipe: DatePipe,private http: HttpClient,
    private notification :NotificationService,private taservice:TaService,
    public sharedService:SharedService,private route:Router,private activatedroute :ActivatedRoute,
    private shareservice:ShareService) { }

  ngOnInit(): void {
    let data =this.sharedService.summaryData.value;
    console.log("data",data)
    this.dataa=data['tourid']
    console.log("this.dataa",this.dataa)
    this.ad_status= data['advance_cancel_status']
    console.log("ad_status",this.ad_status)
    this.cancellid =data['id']
    console.log("cancellid",this.cancellid)
    this.id = data['reason']
    this.appid = data['approver_id']
    console.log("this.appid",this.appid)
    if (data['id'] != 0){
      if(data['reason'] !=undefined || data['reason'] !=null){
        this.ishidden = false;
        this.show_approvebtn = true
      }else{
        this.ishidden = true;
        this.show_approvebtn = false
      }
      if(data['apptype']=="AdvanceCancel"){
        this.show_cancelbtn = true
        this.ishidden = false;
        this.show_approvebtn = false
      }
      if(data['advance_status']=="APPROVE"||data['advance_status']=="REJECT"){
         this.show_approvebtn = false
      }
      // if(data['advance_cancel_status'] != undefined || data['advance_cancel_status'] !=null){
      //   this.isshow = false;
      //   this.ishidden = true;
      // }
      // else{
      //   this.isshow = true;
      //   this.ishidden = false;
      // }
      this.tourid=data['tourid']
      this.tourgid=data['tourgid']
      this.taservice.getadvanceEditsummary(data['tourid']||data['tourgid'])
        .subscribe((results: any[]) => {
        console.log("Tourapppppmaker", results)
        this.tourmodel = results;
        this.approvalid= this.tourmodel["approver_data"].id
        console.log("this.tourmodel",this.tourmodel)
        this.appamount1 = this.tourmodel.detail[0].appamount
        this.reqamount1 = this.tourmodel.detail[0].reqamount
        console.log("this.appamount1",this.appamount1)
        this.statusvalue = this.tourmodel.approve[1].status
        if(this.statusvalue==2){
          this.statusval = "Tour Advance Pending"
        }
        else if(this.statusvalue==3){
          this.statusval = "Tour Advance Approved"
        }
        else if(this.statusvalue==4){
          this.statusval = "Tour Advance Rejected"
        }
        else{
          this.statusval = "Tour Advance Returned"
        }
        console.log("status",this.statusvalue)
        this.reqamount = this.tourmodel.detail['reqamount']
        this.tourmodel.detail.forEach(currentValue => {
          currentValue.startdate = this.datePipe.transform(currentValue.startdate, 'yyyy-MM-dd');
          currentValue.enddate = this.datePipe.transform(currentValue.enddate, 'yyyy-MM-dd');
        });
        this.tourmodel.startdate = this.datePipe.transform(this.tourmodel.startdate, 'yyyy-MM-dd');
        this.tourmodel.enddate = this.datePipe.transform(this.tourmodel.enddate, 'yyyy-MM-dd');
        this.tourmodel.requestdate = this.datePipe.transform(this.tourmodel.requestdate, 'yyyy-MM-dd');
        this.status=data['status']
        this.approveid=data['approvedby']
        console.log("apppp", this.approveid)
        
        
    })
    this.isnew = false;
    this.tourapprove= {
      comments:''
    }
    }

    else{
      this.tourmodel={
        requestno :'NEW',
        requestdate:Date.now(),
        reason:'',
        approvedby:'',
        branch_name:'',
        startdate:'',
        enddate :'',
        
        detail:[],
        branch:'',
        approval:'',
        comments:'',
      };
      this.tourmodel.detail.push({
          reason:'',
          appamount:'',
          reqamountt:'',
          status:'',
          purposeofvisit:'',
      });

    }
    
    this.getreasonValue();
    this.getemployeeValue();
    this.getadvanceapprovesumm();
    this.datasums();
    this.getadvanceCCBSsumm();

  }
  index:any
  advance:Array<any>
  getadvanceCCBSsumm(pageNumber = 1, pageSize = 10) {
    this.taservice.getadvanceccbsEditview(this.dataa)
    .subscribe(result => {
      this.ccbs=result[0]
    console.log("Tourmaker", result)
  this.ccbsval = this.ccbs.cc_data.name;
  this.bsidval = this.ccbs.bs_data.name;
  this.percentageval = this.ccbs.percentage
  this.amountval = this.ccbs.amount
    // this.getccbsList = datas;
    
   
    
    
    })
    }
  getadvanceapprovesumm(pageNumber = 1, pageSize = 10) {
    let data =this.sharedService.summaryData.value;

    if(data['apptype']=="AdvanceCancel"){
      this.taservice.getadvancecancelflowlist(this.dataa)
    .subscribe(result => {
    console.log("Tourmaker", result)
    let datas = result['approve'];
    this.getAdvanceapproveList = datas;
    this.getadvanceCCBSsumm();
       
      }) 
     }
     else{
      this.taservice.getapproveflowalllist(this.dataa)
      .subscribe(result => {
      console.log("Tourmaker", result)
      let datas = result['approve'];
      this.getAdvanceapproveList = datas;
         
        }) 
     }
   }
  // approve:any
  addSection() {
    this.tourmodel.detail.push({
      reason:'',
      appamount:'',
      reqamountt:'',
      status:'',
      purposeofvisit:'',
    })
    // this.tourmodel.detail=(this.advance[1])
    // this.isDisabled=true;
    this.tourmodel.advance=this.tourmodel.detail;
    // advance:any
    let advance=this.tourmodel.approve;
    this.tourmodel.approve=advance[this.tourmodel.advance]

    
    console.log("vvvv", this.tourmodel.approve)
  }
  req(e){
    this.amount = e.target.value
    console.log("this.amount",this.amount)
    if(this.amount!=this.appamount1){
      this.ishidden = false;
    }else{
      this.ishidden = true;
    }
  }
  
  allowAmount(){
    this.appamount= this.tourmodel.detail.appamount;
    console.log("this.appamount",this.appamount);
    this.allowamount = {
      "id":this.tourid,
      "appamount":this.amount
    }
    this.taservice.setallowamount(this.allowamount)
    .subscribe(res=>{
      if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
        this.notification.showWarning("Duplicate! Code Or Name ...")
      } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
        this.notification.showError("INVALID_DATA!...")
      }
      else{
      this.notification.showSuccess("Appamount Updated Successfully....")
      console.log("res",res)
      this.onSubmit.emit();
      return true
      }
    })
  }
 
  getemployeeValue() {
    this.taservice.getemployeeValue()
      .subscribe(result => {
        this.employeelist = result['data']
        console.log("employee", this.employeelist)
      })
  }
  removeSection(i){
    this.tourmodel.detail.splice(i,1);
   }
  setDate(date: string) {
    this.date=new Date();
    this.latest=this.datePipe.transform(this.date, 'yyyy-MM-dd');
    this.currentDate = date
    this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    console.log("Datttee   " + this.currentDate)
    this.currentDate= this.datePipe.transform(new Date(),"dd-MM-yyyy");
    return this.currentDate;
  }
  
 
  removevalues(i){
    this.values.splice(i,1);

  }
 
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
}

preview() {
  // Show preview 
  var mimeType = this.fileData.type;
  if (mimeType.match(/image\/*/) == null) {
    return;
  }

  var reader = new FileReader();      
  reader.readAsDataURL(this.fileData); 
  reader.onload = (_event) => { 
    this.previewUrl = reader.result; 
  }
}
fromDateSelection(event: string) {
  console.log("fromdate", event)
  const date = new Date(event)
  this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate() )
}
toDateSelection(event: string) {
  console.log("todate", event)
  const date = new Date(event)
  this.selectto = new Date(date.getFullYear(), date.getMonth(), date.getDate() )
  this.total=this.selectto-this.select;
  this.totall =this.total/(1000 * 60 * 60 * 24)
   console.log("baba",this.totall)
}
numberOnly(event) {
  var k;
  k = event.charCode;
  return ((k > 96 && k < 123) || (k >= 48 && k <= 57));
}
getreasonValue() {
  this.taservice.getreasonValue()
    .subscribe(result => {
      this.reasonlist = result['data']
      console.log("Reason", this.reasonlist)
    })
}
// isDisabled(item) : boolean {
//   return item ;
//  }
amt:any
sum:any
datasums(){
  this.amt = this.tourmodel.detail.map(x => x.appamount);;
   console.log('data check amt', this.amt);
    this.sum = this.amt.reduce((a, b) => a + b, 0);
       console.log('sum of total ', this.sum);
}
amtt:any
summ:any
dataasums(){
  this.amtt = this.tourmodel.detail.map(x => x.reqamountt);;
   console.log('data check amt', this.amtt);
    this.summ = this.amtt.reduce((a, b) => a + b, 0);
       console.log('sum of total ', this.summ);
}
submitApprove(){
  let advance=this.tourmodel;
  this.comment=advance['comments']
  this.approval=advance['approval']
  this.show_approvediv=true;
  this.advanceapprove={
    "id":this.cancellid,
    "tourgid":this.tourid,
    "appcomment":this.comment,
    "apptype":"AdvanceCancel",
    "status":"3",
    "applevel":"1"
  }
  this.taservice.approvetourmaker(this.advanceapprove)
  .subscribe(res=>{
    if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
      this.notification.showWarning("Duplicate! Code Or Name ...")
    } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
      this.notification.showError("INVALID_DATA!...")
    }
    else{
    this.notification.showSuccess("Advance Cancel Approved Successfully....")
    console.log("res",res)
    // this.show_approvediv=false;
    // this.data = {index: 4}
    // this.sharedService.summaryData.next(this.data)
    // this.route.navigateByUrl('ta/tamaster');
    this.onSubmit.emit();
    return true
    }
  })
  }
submitForm(){
  let advance=this.tourmodel;
  this.comment=advance['comments']
  this.approval=advance['approval']
  this.show_approvediv=true;
  this.advancecancel={
    "tour_id":this.tourid,
    "appcomment":this.comment,
    "apptype":"AdvanceCancel",
    "status":"4",
    "approval":this.approvalid
  }
  this.taservice.advanceCancel(this.advancecancel)
  .subscribe(res=>{
    if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
      this.notification.showWarning("Duplicate! Code Or Name ...")
    } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
      this.notification.showError("INVALID_DATA!...")
    }
    else{
    this.notification.showSuccess("Advance Cancelled Successfully....")
    console.log("res",res)
    // this.show_approvediv=false;
    // this.data = {index: 4}
    // this.sharedService.summaryData.next(this.data)
    // this.route.navigateByUrl('ta/tamaster');
    this.onSubmit.emit();
    return true
    }
  })
  }

  data:any
  approby:any
  tourid:any
  tourmodelapp:any
  cancelapprove(){
    this.data_final={   
    "id":this.cancellid,
    "tourgid":this.tourid,
    "apptype":"AdvanceCancel",
    "applevel":"1",
    "appcomment":this.tourapprove.comments,
    "status":"3",
    // "approvedby":this.appid
    }

    this.approve_service(this.data_final)
  }
  approve(){
    this.data_final={   
    "id":this.cancellid,
    "tourgid":this.tourid,
    "apptype":"advance",
    "applevel":"1",
    "appcomment":this.tourapprove.comments,
    "status":"3",
    // "approvedby":this.appid
    }

    this.approve_service(this.data_final)
  }
  cancelreject() {
    this.data_final={   
      "id":this.cancellid,
      "tour_id":this.tourid,
      "apptype":"AdvanceCancel",
      "appcomment":this.tourapprove.comments,
      
      
      }
      this.reject_service(this.data_final)
    }
  reject() {
    this.data_final={   
      "id":this.cancellid,
      "tour_id":this.tourid,
      "apptype":"advance",
      "appcomment":this.tourapprove.comments,
      
      
      }
      this.reject_service(this.data_final)
    }
    return() {
      this.data_final={   
        "id":this.cancellid,
        "tour_id":this.tourid,
        "apptype":"advance",
        "appcomment":this.tourapprove.comments,
        }
        this.return_service(this.data_final)
      }
  approve_service(data){
    this.taservice.approvetourmaker(data)
    .subscribe(res=>{
      if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
        this.notification.showWarning("Duplicate! Code Or Name ...")
      } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
        this.notification.showError("INVALID_DATA!...")
      }
      else{
      this.notification.showSuccess("Approve Successfully....")
      console.log("res",res)
      this.show_approvediv=false;
      // this.data = {index: 4}
      // this.sharedService.summaryData.next(this.data)
      // this.route.navigateByUrl('ta/tamaster');
      this.onSubmit.emit();
      return true
      }
    })
  }
  reject_service(data){
    this.taservice.rejecttourmaker(data)
    .subscribe(res=>{
      if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
        this.notification.showWarning("Duplicate! Code Or Name ...")
      } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
        this.notification.showError("INVALID_DATA!...")
      }
      else{
      this.notification.showSuccess("Reject Successfully....")
      console.log("res",res)
      this.show_rejectdiv=false;
      // this.data = {index: 4}
      // this.sharedService.summaryData.next(this.data)
      // this.route.navigateByUrl('ta/tamaster');
      this.onSubmit.emit();
      return true
      }
    })
  }
  return_service(data){
    this.taservice.returntourmaker(data)
    .subscribe(res=>{
      if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
        this.notification.showWarning("Duplicate! Code Or Name ...")
      } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
        this.notification.showError("INVALID_DATA!...")
      }
      else{
      this.notification.showSuccess("Return Successfully....")
      console.log("res",res)
      this.show_returndiv=false;
      // this.data = {index: 4}
      // this.sharedService.summaryData.next(this.data)
      // this.route.navigateByUrl('ta/tamaster');
      this.onSubmit.emit();
      return true
      }
    })
  }
  close_div(){
   this.show_approvediv=false;
  }
  
  

 
  
  
  
  cancelApprove(){
    this.show_cancelapprovediv = true
  }

  cancelReject(){
    this.show_cancelrejectdiv = true
  }
 
 
Reject(){
  this.show_rejectdiv=true;
}
Approve(){
  this.show_approvediv=true;
}
Return(){
  this.show_returndiv=true;
}
cancel(){
this.show_approvediv=false;
}
onCancelClick(){
  this.onCancel.emit()
  this.data = {index: 4}
  this.sharedService.summaryData.next(this.data)
  this.route.navigateByUrl('ta/approve-summary');
}
 
  
  
   
  
   
  
 
   
  
}

 