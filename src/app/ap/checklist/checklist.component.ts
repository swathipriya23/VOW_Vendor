import { Component, OnInit,ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Ap1Service } from '../ap1.service';

import { NotificationService } from '../../service/notification.service';
// import { ToasterService } from './toaster.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { count } from 'console';
import { ApShareServiceService } from '../ap-share-service.service';

const isSkipLocationChange = environment.isSkipLocationChange

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
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
  providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
      DatePipe]
})
export class ChecklistComponent implements OnInit {
data:any[];
// rem:any;
dt:any[];
@ViewChild('auditclose') auditclose;
sta=3;
cli:boolean=false;
remark:any;
count:number=0;
changevalue:any;
array:any=[{"auditchecklist":[]}];
auditchecklist:any[];
check:any= FormGroup;
a:any[];
has_previous:any;
isSummaryPagination:any;
invHdrID=this.service.inhed.value;
id=this.service.typid.value;
// invHdrID=25;
isLoading: boolean;
presentpage: number = 1;
identificationSize: number = 10;
has_next:any;
bo:any=[];
boi:any=[{"auditchecklist":[]}];
okey:boolean=false;
not_ok:boolean=false;
na:boolean=false
viewtrnlist:any=[]
btnDisabled =false;
name:any;
designation:any;
branch:any;
// btnDis :boolean;
// boun:any[];


type=['exact',
        'supplier',
        'invoice_amount',
        'invoiceno',
        'invoice_date']

  exactList: any;
  withoutSuppList: any;
  withoutInvAmtList: any;
  withoutInvNoList: any;
  withoutInvDtList: any;
  rem = new FormControl('', Validators.required);
  newDataRouting: any;
  routeData:any=[];
  statustype:any;
  statusflage=true;
  constructor(private formbuilder: FormBuilder,private notification: NotificationService,private service:Ap1Service,private datePipe: DatePipe,private spinner:NgxSpinnerService,private shareservice:ApShareServiceService,) { }  
  ngOnInit() 
  {
    
    // this.check = this.formbuilder.group(
    //   {
    //      rem: ['', Validators.required]
    //   })
    
      // Audit service
      this.routeData = this.shareservice.commonsummary.value 
      this.newDataRouting = this.routeData['data'][0]
      console.log('santhosh',this.newDataRouting)
      this.statustype=this.newDataRouting.status.text
      console.log(this.statustype)
      if(this.statustype=="REJECTED")
      {
        this.statusflage=false
      }
    this.service.audicservie(this.id).subscribe(data=>{
      this.data=data['data'];
      for(let i=0;i<this.data.length;i++){
        this.data[i]['clk']=false;
        this.data[i]['value']=0;       
      }
      console.log('check=',data);
  })
   //dedupe for type(exact)
  this.service.getInwDedupeChk(this.invHdrID,this.type[0])
  .subscribe(result => {
    this.exactList = result['data']
    console.log("exactList",this.exactList)

    // let dataPagination = result['pagination'];
    // if (this.exactList.length >= 0) {
    //   this.has_next = dataPagination.has_next;
    //   this.has_previous = dataPagination.has_previous;
    //   this.presentpage = dataPagination.index;
    //   this.isSummaryPagination = true;
    // } if (this.exactList <= 0) {
    //   this.isSummaryPagination = false;
    // }        
  },error=>{
    console.log("No data found")
  }            
  )
//dedupe for type(WITHOUT_SUPPLIER)
  this.service.getInwDedupeChk(this.invHdrID,this.type[1])
.subscribe(result => {
  this.withoutSuppList = result['data']
  console.log("WITHOUT_SUPPLIER List",this.withoutSuppList)
  // let dataPagination = result['pagination'];
  // if (this.exactList.length >= 0) {
  //   this.has_next = dataPagination.has_next;
  //   this.has_previous = dataPagination.has_previous;
  //   this.presentpage = dataPagination.index;
  //   this.isSummaryPagination = true;
  // } if (this.exactList <= 0) {
  //   this.isSummaryPagination = false;
  // }        
},error=>{
  console.log("No data found")
}            
)

//dedupe for type(WITHOUT_INVOICE_AMOUNT)
this.service.getInwDedupeChk(this.invHdrID,this.type[2])
  .subscribe(result => {
    this.withoutInvAmtList = result['data']
    console.log("WITHOUT_INVOICE_AMOUNT List",this.withoutInvAmtList)
    // let dataPagination = result['pagination'];
    // if (this.exactList.length >= 0) {
    //   this.has_next = dataPagination.has_next;
    //   this.has_previous = dataPagination.has_previous;
    //   this.presentpage = dataPagination.index;
    //   this.isSummaryPagination = true;
    // } if (this.exactList <= 0) {
    //   this.isSummaryPagination = false;
    // }        
  },error=>{
    console.log("No data found")
  }             
  )

  //dedupe for type(WITHOUT_INVOICE_NUMBER)
this.service.getInwDedupeChk(this.invHdrID,this.type[3])
.subscribe(result => {
  this.withoutInvNoList = result['data']
  console.log("WITHOUT_INVOICE_NUMBER List",this.withoutInvNoList)
//   let dataPagination = result['pagination'];
//   if (this.exactList.length >= 0) {
//     this.has_next = dataPagination.has_next;
//     this.has_previous = dataPagination.has_previous;
//     this.presentpage = dataPagination.index;
//     this.isSummaryPagination = true;
//   } if (this.exactList <= 0) {
//    this.isSummaryPagination = false;
//   }        
},error=>{
  console.log("No data found")
}            
)

//dedupe for type(WITHOUT_INVOICE_DATE)
this.service.getInwDedupeChk(this.invHdrID,this.type[4])
  .subscribe(result => {
    this.withoutInvDtList = result['data']
    console.log("WITHOUT_INVOICE_DATE List",this.withoutInvDtList)
    // let dataPagination = result['pagination'];
    // if (this.exactList.length >= 0) {
    //   this.has_next = dataPagination.has_next;
    //   this.has_previous = dataPagination.has_previous;
    //   this.presentpage = dataPagination.index;
    //   this.isSummaryPagination = true;
    // } if (this.exactList <= 0) {
    //   this.isSummaryPagination = false;
    // }        
  },error=>{
    console.log("No data found")
  }            
  )
  this.spinner.hide();
  }



submitted(){
  this.statusflage=false
  this.array=[{"auditchecklist":[]}]
  console.log(this.data);
  for(let i=0;i<this.data.length;i++){
    if(this.data[i]['clk']){
      let dear:any={
        'apauditchecklist_id':this.data[i]['id'],
        'apinvoiceheader_id':this.invHdrID,
        'value':this.data[i]['value']
      };
      
      // this.array[0]['auditchecklist'].push(dear); 
       }
  }
let obj={
    'auditchecklist':this.bo
  }
  console.log('obj', obj);
  this.service.audiokservie(obj).subscribe(data=>{
    this.notification.showSuccess(data['status'])
   },
   (error)=>{
   alert(error.status+error.statusText);
  }
  )
  this.auditclose.nativeElement.click();
}
ok(i:any,val,dt,e)
{
  this.count=this.count+1;
  console.log("count",this.count)
  this.btnDisabled = false;
  for(let i=0;i<this.data.length;i++){
    if(this.data[i]['id']==dt['id']){
      this.data[i]['clk']=true;
      this.data[i]['value']=val;
    }
  }
  let dear:any={
    "apauditchecklist_id":dt.id,
    "apinvoiceheader_id":this.invHdrID,
    "value":val}; 
  // this.array[0]['auditchecklist'].push(dear);
  console.log(dear)
  this.bo.push(dear)
  for(let i=0;i<this.bo.length;i++){
    if(this.bo[i].apauditchecklist_id==dt.id && this.bo[i].value!=val ){
      this.bo.splice(i,1)
    }
  }
  // this.boi[0]['auditchecklist'].push(this.bo);
  // console.log("check bounce",this.boi)
//   this.bo.push(dear)
//  console.log("check bounce",this.bo)
//  this.array[0]['auditchecklist'].push(this.bo);
//  console.log(this.array)
  // Audit finish
 }
 notok(i:any,dt,changevalue)
 {
  this.btnDisabled = true;
  console.log(this.btnDisabled)
  // this.count=this.count-1;
  let d=this.changevalue
  console.log(d)
  for(let i=0;i<this.data.length;i++){
    if(this.data[i]['id']==dt['id']){
      this.data[i]['clk']=true;
      this.data[i]['value']=d;
    }
    
  }
  let dear:any={
    "apauditchecklist_id":dt.id,
    "apinvoiceheader_id":this.invHdrID,
    "value":d};  
  // this.array[0]['auditchecklist'].push(dear);
   console.log("check bounce",dear)
this.bo.push(dear)

 for(let i=0;i<this.bo.length;i++){
  if(this.bo[i].apauditchecklist_id==dt.id && this.bo[i].value!=d ){
    this.bo.splice(i,1)
  }
 }
//  this.bo.push(dear)
//  console.log("check bounce",this.bo)
//  this.array[0]['auditchecklist'].push(this.bo);
//  console.log(this.array)
// this.boi[0]['auditchecklist'].push(this.bo);
//  console.log("check bounce",this.boi)



}
 nap(i:any,dt,changevalue)
 {
  this.btnDisabled = true;
  let d=this.changevalue
 for(let i=0;i<this.data.length;i++){
    if(this.data[i]['id']==dt['id']){
      this.data[i]['clk']=true;
      this.data[i]['value']=d;
    }
  }
  let dear:any={
    "apauditchecklist_id":dt.id,
    "apinvoiceheader_id":this.invHdrID,
    "value":d};
    this.bo.push(dear)  
  for(let i=0;i<this.bo.length;i++){
  if(this.bo[i].apauditchecklist_id==dt.id && this.bo[i].value!=d ){
    this.bo.splice(i,1)
  }
}
// this.bo.push(dear)
//  this.boi[0]['auditchecklist'].push(this.bo);
//  console.log("check bounce",this.boi)
 }
 bounce()
 {
  this.statusflage=false
  this.cli=true;
    // this.service.bounce(this.data).subscribe(data=>{
    //  this.data=data['data']});
  this.remark=this.rem.value;
  
  // console.log("service",this.service.inhed.value);
  console.log("service",this.service.invdate.value)
  console.log("Hai",this.remark)
  let bouio:any={
    "status_id":this.sta.toString(),
    "apinvoicehdr_id":this.invHdrID.toString(),
    "invoicedate":this.service.invdate.value.toString(),
    "remark":this.remark.toString()
  };
// this.data['type'].id

let obj={
  'auditchecklist':this.bo
}
 this.service.audiokservie(obj).subscribe(data=>{
   console.log(data)
    if(data['status']=="success"){
    this.notification.showSuccess(data['message']);

    }
  //   else{
  //   this.notification.showError(data['description']);
  //  }
  }
 )

 this.service.bounce(bouio).subscribe(data=>{
  console.log(data)
  // if(data['message']=="success"){
  //   }
  // else{
  //  this.notification.showError(data['description']);
  // }
 }
)
 console.log("check bounce",obj)
 this.auditclose.nativeElement.click();
  //  this.notification.showSuccess('status');
//   this.service.bounce(this.array[0]).subscribe(data=>{
//     this.notification.showSuccess(data['status'])
//  })
 }
 //view tran
 viewtrn()
 {
   console.log("id",this.invHdrID)
   this.service.viewtracation(this.invHdrID).subscribe(data=>
    {
      this.viewtrnlist = data['data']
      console.log("trnDt",this.viewtrnlist)
    })
 }
 view(dt){
  this.name=dt.from_user.name
  this.designation=dt.from_user.designation
  this.branch=dt.from_user.branch.name
 }
 viewto(dt)
{
  this.name=dt.to_user.name
  this.designation=dt.to_user.designation
  this.branch=dt.to_user.branch.name
}
}



