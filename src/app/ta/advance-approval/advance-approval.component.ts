import { Component, OnInit,Output,EventEmitter,ViewChild } from '@angular/core';
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
  selector: 'app-advance-approval',
  templateUrl: './advance-approval.component.html',
  styleUrls: ['./advance-approval.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
    DatePipe
]
})
export class AdvanceApprovalComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();  
  @ViewChild('closebutton')closebutton;
  taAddForm:FormGroup
  currentDate: any = new Date();
  // date = new Date().toLocaleDateString();
  defaultDate = new FormControl(new Date());
  today = new Date();
  date=new Date();
  latest:any
  overall:any
  isDisabled:boolean;
  days:any
  tourmodel:any
  values=[];
  bisinesslist:Array<any>
  costlist:Array<any>
  tourdata=[];
  data:any
  listBranch:Array<any>
  branchlist:Array<any>
  stratdate:Date;
  enddate:Date;
  endatetemp:Date
  startdatetemp:Date
  starttdate:any
  fileData: File = null;
  previewUrl:any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  totall:number;
  select:any;
  selectto:any;
  request:any
  total:any;
  a:any
  reasonlist:Array<any>
  // showme:boolean=false;
  tourr:any
  datas:any
  datass:any
  isccbsbtn:boolean;
  tourmodell:any
  showme:false
  showhide:boolean
  res:any
  advancee:any
  touremodel:any={}
  isnew:boolean
  istaapprove:any
  employeelist:Array<any>
  status:any
  comment: any;
  advancecancel: any;
  reqamount: any;
  appamount: any;
  id: any;
  getAdvanceapproveList: any;
  dataa: any;
  appr: any;
  branch: any;
  command: any;
  getccbsList: any;
  tourid: any;
  ccid: any;
  bsid: any;
  percentage: any;
  amount: any;
  ccbs: any={}
  end: any;
  strat: any;
  ccbsid: any;
  ccbsccid: any;
  ccbsbsid: any;
  tourapproval: any;
  constructor(private formBuilder: FormBuilder,private datePipe: DatePipe,private http: HttpClient,
    private notification :NotificationService,private taservice:TaService,
    public sharedService:SharedService,private route:Router,private activatedroute :ActivatedRoute,
    private shareservice:ShareService) { }

  ngOnInit(): void {
    let data =this.shareservice.advancesummaryData.value
    this.datass=data;
    console.log("data",data)
    this.dataa=data['id']
    console.log("this.dataa",this.dataa)
    this.tourid=this.datass['tourgid']
    console.log("this.tourid",this.tourid)
    let cancelid =this.sharedService.summaryData.value;
    let cancellid =cancelid['id']
    console.log("cancellid",cancellid)
    let empgrade = this.datass['empgrade']
    if (data['tourgid'] != 0){
      this.taservice.getadvanceEditsummary(data['tourgid'])
        .subscribe((results: any[]) => {
        console.log("Touradvancemaker", results)
        this.tourmodel = results;
        this.tourr=this.tourmodel['tourgid']
        this.tourmodel.approval = this.tourmodel["approver_data"].name
        this.tourapproval = this.tourmodel["approver_data"].id
        // this.appr = app['name']
        // console.log("this.appr",this.appr)
        this.branch = this.touremodel.branch_name
        console.log("this.branch",this.branch)
        this.tourmodel.comment = this.tourmodel.approve[0].comment
        // console.log(" this.command", this.command)
       
        this.tourmodel.startdate = this.datePipe.transform(this.tourmodel.startdate, 'yyyy-MM-dd');
        this.tourmodel.enddate = this.datePipe.transform(this.tourmodel.enddate, 'yyyy-MM-dd');
        this.tourmodel.requestdate = this.datePipe.transform(this.tourmodel.requestdate, 'yyyy-MM-dd');
        
        this.request=this.tourmodel['requestdate']
        console.log("rrr",this.request)
        this.strat=this.tourmodel['startdate']
        this.end=this.tourmodel['enddate']
        this.tourmodel.requestdate=this.request
        this.tourmodel.startdate=this.strat
        this.tourmodel.enddate=this.end
        this.tourmodel.startdate = this.datePipe.transform(this.tourmodel.startdate, 'yyyy-MM-dd');
        this.tourmodel.enddate = this.datePipe.transform(this.tourmodel.enddate, 'yyyy-MM-dd');
        this.tourmodel.requestdate = this.datePipe.transform(this.tourmodel.requestdate, 'yyyy-MM-dd');
        this.status=data['status']
        if(data['status']==1){
          this.showhide=false;
          this.isDisabled=true;
        }
        
    })
    this.isnew = false;
    }
  
    
    else{
      this.tourmodel={
        requestno :'NEW',
        requestdate:this.request,
        reason:'',
        startdate:this.strat,
        enddate :this.end,
        
       
        branch:'',
        approval:'',
        comments:'',
        remarks:'',
        tourgid: this.tourr
       
      };
      this.tourmodel.detail.push({
          reason:'',
          appamount:'',
          reqamount:'',
          status:'',
          
      });
      this.tourmodel.ccbs.push({
        ccid:'',
        bsid:'',
        percentage:'',
        amount:'',
        
    });

      
      this.tourmodel.approve.push({
        approvedby:'',
        apptype:'',
        approveddate:'',
        comment:'',
        status:'',
        
    });
    }
    this.getreasonValue();
    // this.getemployeeValue();
   
    this.getbranchValue();
    this.getadvanceapprovesumm();
    this.getadvanceCCBSsumm();
  }
  index:any
  advance:Array<any>
  approve:any
  addccbs(){
    this.tourmodel.ccbs.push({
      bsid:'',
      ccid:'',
      amount:'',
      percentage:''
    })
  }
  addSection() {
    this.tourmodel.detail.push({
      reason:'',
      appamount:'',
      reqamountt:'',
      status:'',
      // purposeofvisit:'',
    })
    // this.showme=true;
    // this.tourmodel.detail=(this.advance[1])
    this.isDisabled=true;
    this.tourmodel.advance=this.tourmodel.detail;
   
    // advance:any
    let advance=this.tourmodel.approve;
    this.tourmodel.approve=advance[this.tourmodel.advance]

    
    console.log("vvvv", this.tourmodel.approve)
  }
  
  
  removeSection(i){
    this.tourmodel.detail.splice(i,1);
   }
   removeSection1(i){
    this.tourmodel.ccbs.splice(i,1);
   
   
  }
  getadvanceapprovesumm(pageNumber = 1, pageSize = 10) {
    this.taservice.getadvanceEditview(this.dataa)
    .subscribe(result => {
    console.log("Tourmaker", result)
    let datas = result['approve'];
    this.getAdvanceapproveList = datas;
    
   
    
    
    })
    }
    getadvanceCCBSsumm(pageNumber = 1, pageSize = 10) {
      this.taservice.getadvanceccbsEditview(this.dataa)
      .subscribe(result => {
        this.ccbs=result[0]
      console.log("Tourmaker", result)
      this.ccid = this.ccbs.percentage;
      console.log("per",this.ccid)
      this.ccbsbsid= this.ccbs.bs_data.name;
      console.log("ccid", this.ccbsbsid)
      this.ccbsccid= this.ccbs.cc_data.name;
      this.ccbsid = this.ccbs.amount;
      console.log("amount",this.ccbsid)
      this.ccbs.bsid = this.ccbs.cc_data.name;
      this.ccbs.percentage = this.ccbs.percentage
      this.ccbs.amount = this.ccbs.amount
      // this.getccbsList = datas;
      
     
      
      
      })
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
  this.select = new Date(date. getFullYear(), date.getMonth(), date.getDate() )
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
// getemployeeValue() {
//   this.taservice.getemployeeValue()
//     .subscribe(result => {
//       this.employeelist = result['data']
//       console.log("employee", this.employeelist)
//     })
// }
selectBranch(e){
  console.log("e",e.value)
  let branchvalue = e.value
  this.taservice.setemployeeValue('',branchvalue,45)
  .subscribe(result => {
    this.listBranch = result
    console.log("employee", this.listBranch)
  })
}
getbranchValue() {
  this.taservice.getbranchValue()
    .subscribe(result => {
      this.branchlist = result['data']
      console.log("branchlist", this.branchlist)
    })
}

  submitccbs(){
    this.closebutton.nativeElement.click();
    this.notification.showSuccess("CCBS Added Successfully....")
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

submitForm(){
  let advance=this.tourmodel;
  this.approve=advance['approval'];
  console.log("vvvv", this.approve)
  this.res=advance['remarks']
  this.comment=advance['comments']
  let details=this.tourmodel.detail
  for(var i=0;i<details.length;i++){
  this.id=details[i].id
  this.reqamount=details[i].reqamount;
  this.appamount=details[i].appamount;
  console.log("this.appamount",this.appamount)
  console.log("nn", this.tourmodell)
  this.touremodel=details[i].reason;
  console.log("rrr", this.tourmodell)
}
this.advancee={
   
    advance:[{
   "reason":this.touremodel,
   "reqamount":this.reqamount,
   "appamount":this.appamount,
   "invoiceheadergid":"1",
   "remarks":this.tourmodel.comment,
   "tourgid":this.tourr,
   "id":this.id,
   "approval": this.tourapproval,
    }],
    ccbs:[{
      "tourgid":this.tourr,
      "remarks":this.tourmodel.comment,
      "ccid":this.ccbsccid,
      "bsid":this.ccbsbsid,
      "id":this.ccbsid,
      "amount":this.ccbs.amount,
      "status":"1",
      "percentage":this.ccbs.percentage
    }]
    
    // "comments":this.comment,
    

}


 this.taservice.advanceCreate(this.advancee)
  .subscribe(res=>{
    console.log("res",res)
    if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
      this.notification.showWarning("Duplicate! Code Or Name ...")
    } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
      this.notification.showError("INVALID_DATA!...")
    }
    else{
    this.notification.showSuccess("Inserted Successfully....")
    console.log("res", res)
    this.onSubmit.emit();
    return true
    }
  }
  )


  }




onCancelClick() {
  this.onCancel.emit()
  this.data = {index: 3}
  this.sharedService.summaryData.next(this.data)
  this.route.navigateByUrl('ta/advancemaker-summary');

} 
 
  
  
   
  
   
  
 
   
  
}
