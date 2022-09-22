import { Component, OnInit,Output,EventEmitter, ViewChild } from '@angular/core';
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
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { NgxSpinnerService } from "ngx-spinner";
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { E } from '@angular/cdk/keycodes';

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
// interface wheeler{
//   id:number;
//   Name:string;
// }
// interface transport{
//   id:number;
//   Name:string;
// }
// interface house{
//   id:number;
//   Name:string;
// }


@Component({
  selector: 'app-packing-expence',
  templateUrl: './packing-expence.component.html',
  styleUrls: ['./packing-expence.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
    DatePipe
]
})
export class PackingExpenceComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();  
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger
  @ViewChild('hsncodeid') hsncodeset:any;
  @ViewChild('hsnid') hsnidauto:MatAutocomplete;
  @ViewChild('gstcodetid') gstcodeset:any;
  @ViewChild('gstid') gstidauto:MatAutocomplete;
  has_nextid: boolean = true;
  has_presentid: number = 1;
  has_nexthsnid: boolean = true;
  has_presenthsnid: number = 1;
  has_nextgstid: boolean = true;
  has_presentgstid: number = 1;

  

  packingform : FormGroup;
  currentpage:number=1;
  pagesize = 10;
  packingexp:any
  expenseid:any
  exptype:any
  comm:any
  packid:any
  yesnoList:any
  transportList:any
  tourdatas:any
  employeename:any
  employeegrade:any
  employeedesignation:any
  applevel:number = 0;
  gstshow:boolean = false;
  approver : boolean= false;
  approvedamount: number = 0;
  cgst:number = 0;
  igst:number =0;
  vendorgstno:any;
  sgst: number =0;
  eligtransamt: number;
  daysdrivereng :number;
  driverbatta:number;
  eligbreakagecharge:number;
  eligibleamount:number;
  distinhilly:number;
  tonnagehhgood:number;
  traveltime:number;
  packingexpp:any
  maxeligibletonnage:any
  pageSize: number = 10;
  p: number = 1;
  isLoading: boolean;
  hsnList: any;
  gstList: any;
  reason: any;
  default: any;
  totaldisttrans:Number;
  drivesnlist: any;
  receipsnlist: any;
  isonbehalf: boolean;
  onbehalf_empName: string;
  applist: any[];
  statusid: any;
  report: any;

  constructor(private formBuilder: FormBuilder,private datePipe: DatePipe,private http: HttpClient,
    private notification :NotificationService,private taservice:TaService,
    public sharedService:SharedService,private route:Router,private activatedroute :ActivatedRoute,private SpinnerService: NgxSpinnerService,
    private shareservice:ShareService,private router:Router) { }

  ngOnInit(): void {
    // console.log("mmm",expensetype)
    let expensetype = JSON.parse(localStorage.getItem('expense_edit'));
    let expensedetails = JSON.parse(localStorage.getItem('expense_details'));
    this.report =expensedetails.report

    this.employeename= '('+expensedetails.employee_code+') '+expensedetails.employee_name
    this.employeegrade=expensedetails.empgrade
    this.expenseid = expensedetails.id
    this.employeedesignation=expensedetails.empdesignation
    this.exptype=expensetype.expenseid
    this.reason = expensedetails.reason_id;
    this.statusid = expensedetails.claim_status_id;
    if(expensedetails.applevel){
      this.applevel = expensedetails.applevel
    }
 
    this.comm=expensetype.requestercomment
  this.taservice.getmaxtonnage(this.expenseid)
  .subscribe(res=>{
    console.log("tonnage",res)
    if (this.reason == 7){
      this.maxeligibletonnage = res.tonnagefamily;
    }
    else{
      this.maxeligibletonnage=res.maxtonnage
    }
    
  })
  if (expensedetails.onbehalfof ) {
      this.isonbehalf = true;
      this.expenseid=expensedetails['id']
      this.onbehalf_empName = '(' + expensedetails.employee_code + ') ' + expensedetails.employee_name
      console.log("onbehalf_empName", this.onbehalf_empName)
    } else {
      this.expenseid=expensedetails['id']
      this.isonbehalf = false;
    }
     if(expensedetails.applevel==2 ||  expensedetails.applevel == 1){
      this.isonbehalf = false;
      this.expenseid=expensedetails['tourid']
      this.approver = true;
     }
     if(this.statusid == 3 || this.statusid == 4 || this.statusid == 2){
      this.approver = true;
     }
   
  this.taservice.getpackingeditSummary(this.expenseid).subscribe(res =>{
    let packagelist = res['data'];
    var length = packagelist.length;
    for (var i =0;i<length ;i++){
      // delete packagelist[i].claimreqid;
      // delete  packagelist[i].exp_name;
      // delete packagelist[i].exp_id
      if (i >0){
        this.addSection();
      }
      packagelist[i].hhgoodstrans= String(packagelist[i].hhgoodstrans.value);
      packagelist[i].transtwowheelerby = String(packagelist[i].transtwowheelerby.value)
      packagelist[i].twowheelertrans = String(packagelist[i].twowheelertrans.value)
      packagelist[i].vehicletransbydriver = String(packagelist[i].vehicletransbydriver.value);
      packagelist[i].receipt_loss = String(packagelist[i].receipt_loss.value);
      // packagelist[i].hsncode = packagelist[i].hsncode.value;
    }
    if(packagelist.length != 0){
      this.gstshow = true;
    this.packingform.patchValue({
      data: packagelist
    })

    console.log("Expenselist",this.packingform.value.data)
  }
  })
  this.packingform = this.formBuilder.group({
    data: new FormArray([
      this.createItem(),
    ]),
    // data: new FormArray([]),
  });
  this.getyesno();
  // this.getpackingtwo();
  // this.getgstcode();
  // this.gethsncode();
    
  }
  hsnsearch(ind){
    (this.packingform.get('data') as FormArray).at(ind).get('hsncode').valueChanges
  .pipe(
    debounceTime(100),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading = true;
    }),
    switchMap(value => this.taservice.gethsncode(value,1))
  )
  .subscribe((results: any[]) => {
    this.hsnList = results['data']
   
  });

  }

  gstsearch(ind){
    (this.packingform.get('data') as FormArray).at(ind).get('bankgstno').valueChanges
  .pipe(
    debounceTime(100),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading = true;
    }),
    switchMap(value => this.taservice.getgstcode(value,1))
  )
  .subscribe((results: any[]) => {
    this.gstList = results['data']
  });

  }

  getyesno(){
    this.taservice.getyesno()
    .subscribe(res=>{
      this.yesnoList=res
      this.drivesnlist = res
      this.receipsnlist = res
      console.log("yesnoList",this.yesnoList)
    })
  }
  
  getpackingtwo(){
    this.taservice.getpacking_twowheeler()
      .subscribe(res=>{
        this.transportList=res
        // console.log("transportList",this.transportList)
      })
  }

  getgstcode(){
    this.taservice.getgstcode('',1)
    .subscribe(result => {
      this.gstList = result['data']
      console.log("gstList",this.gstList)
      })
  }
  gethsncode(){
    this.taservice.gethsncode('',1)
    .subscribe(result => {
      this.hsnList = result['data']
      console.log("hsnlist",this.hsnList)
      })
  }


  trans_check(ind){
    let element = (this.packingform.get('data') as FormArray).at(ind).value
    if (element.twowheelertrans == '0' && element.hhgoodstrans == '0'){
      return true;
    }
    else{
      return false;
    }
  }
  numberOnly(event) {
    return (event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46)
  }
  
    omit_special_char(event)
  {   
     var k;  
     k = event.charCode;  //         k = event.keyCode;  (Both can be used)
     return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }
  fieldGlobalIndex(index) {
    let dat = this.pageSize * (this.p - 1) + index;
    return dat
  }
  entergst_check(ind){
    let myform = (this.packingform.get('data') as FormArray).at(ind).value
    return myform.entergst;
  }
  entergst(event,ind){
    let myform1 = (this.packingform.get('data') as FormArray).at(ind)
    myform1.patchValue({
      bankgstno:event.target.value
    })
  }
  newgst(ind){
    let myform1 = (this.packingform.get('data') as FormArray).at(ind)
    myform1.patchValue({
      entergst:true
    })
  }

  gst_calc(ind){
    let myform = (this.packingform.get('data') as FormArray).at(ind).value
    let myform1 = (this.packingform.get('data') as FormArray).at(ind)
    if(myform.bankgstno != myform.vendorgstno 
      && myform.hsncode != '' && (myform.bankgstno != 0 && (myform.vendorgstno != '' || myform.vendorgstno != 0 ))){
      var bnk_gst = myform.bankgstno.slice(0,2);
      var lo_gst = myform.vendorgstno.slice(0,2);
      if(bnk_gst == lo_gst){
        this.gstshow = true;
        var per = myform.hsncode.igstrate/2;
        myform1.patchValue({
          "cgst":per,
          "sgst":per,
          "igst":0,
        })
      }
      else{
        this.gstshow = true;
        myform1.patchValue({
          "igst":myform.hsncode.igstrate,
          "cgst":0,
          "sgst":0
        })
      }
    }
    else if((myform.bankgstno != 0 && myform.hsncode != '' && (myform.vendorgstno != '' || myform.vendorgstno != 0 ))) {
      this.notification.showInfo("Bank GST and Vendor GST are Same");
      myform1.patchValue({
       vendorgstno:''
      })
    }
    else{
      return false;
    }
  }
  hsnshow(subject){
    return subject?subject.code:undefined;
  }

  checkigst(ind){
    let myform = (this.packingform.get('data') as FormArray).at(ind).value
    if(myform.igst != 0){
      return true;
    }
    else{
      return false;
    }
  }
  checkscgst(ind){
    let myform = (this.packingform.get('data') as FormArray).at(ind).value
    if(myform.cgst != 0 || myform.sgst != 0){
      return true;
    }
    else{
      return false;
    }

  }
  
  
  
  autocompletehsnid(){
    setTimeout(()=>{
      if(this.hsnidauto && this.autocompletetrigger && this.hsnidauto.panel){
        fromEvent(this.hsnidauto.panel.nativeElement,'scroll').pipe(
          map(x=> this.hsnidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data=>{
          const scrollTop=this.hsnidauto.panel.nativeElement.scrollTop;
          const scrollHeight=this.hsnidauto.panel.nativeElement.scrollHeight;
          const elementHeight=this.hsnidauto.panel.nativeElement.clientHeight;
          const atBottom=scrollHeight-1<=scrollTop +elementHeight;
          console.log("CALLLLL",atBottom)
          if(atBottom){
  
            if(this.has_nexthsnid){
              this.taservice.gethsncode(this.hsncodeset.nativeElement.value,this.has_presenthsnid+1).subscribe(data=>{
                let dts=data['data'];
                console.log('h--=',data);
                console.log("SS",dts)
                console.log("GGGgst",this.hsnList)
                let pagination=data['pagination'];
                this.hsnList=this.hsnList.concat(dts);
                
                if(this.hsnList.length>0){
                  this.has_nexthsnid=pagination.has_next;
                  this.has_presenthsnid=pagination.has_previous;
                  this.has_presenthsnid=pagination.index;
                  
                }
              })
            }
          }
        })
      }
    })
   
    
  }
  
   
  autocompletegstid(){
    setTimeout(()=>{
      if(this.gstidauto && this.autocompletetrigger && this.gstidauto.panel){
        fromEvent(this.gstidauto.panel.nativeElement,'scroll').pipe(
          map(x=> this.gstidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data=>{
          const scrollTop=this.gstidauto.panel.nativeElement.scrollTop;
          const scrollHeight=this.gstidauto.panel.nativeElement.scrollHeight;
          const elementHeight=this.gstidauto.panel.nativeElement.clientHeight;
          const atBottom=scrollHeight-1<=scrollTop +elementHeight;
          console.log("CALLLLL",atBottom)
          if(atBottom){
  
            if(this.has_nextid){
              this.taservice.getgstcode(this.gstcodeset.nativeElement.value,this.has_presentid+1).subscribe(data=>{
                let dts=data['data'];
                console.log('h--=',data);
                console.log("SS",dts)
                console.log("GGGgst",this.gstList)
                let pagination=data['pagination'];
                this.gstList=this.gstList.concat(dts);
                
                if(this.gstList.length>0){
                  this.has_nextgstid=pagination.has_next;
                  this.has_presentgstid=pagination.has_previous;
                  this.has_presentgstid=pagination.index;
                  
                }
              })
            }
          }
        })
      }
    })
   
    
  }

  twowheel(ind){
    let myform = (this.packingform.get('data') as FormArray).at(ind).value
    if(myform.twowheelertrans == "0"){
      return true;
    }
    else{
      return false;
    } 
  }

  goodshh(ind){
    let myform = (this.packingform.get('data') as FormArray).at(ind).value
    if(myform.hhgoodstrans == "0"){
      return true;
    }
    else{
      return false;
    }
  }

addSection(){
  const data = this.packingform.get('data') as FormArray
  data.push(this.createItem());
}
 createItem(){
   let group = this.formBuilder.group({
    id:0,
    tourgid:this.expenseid,
    expense_id:7,
    claimedamount:'',
    requestercomment:this.comm,
    twowheelertrans:'0',
    hhgoodstrans:'0',
    transtwowheelerby:'',
    ibaappvendor:'',
    totaldisttrans:null,
    distinhilly:null,
    daysdrivereng:0,
    driverbatta:0,
    tonnagehhgood:0,
    maxeligton:'',
    billedamthhgoodstrans:0,
    eligtransamt:'',
    maxeligibletonnage:'',
    transchargesvehicle:'',
    vehicletransbydriver:'0',
    traveltime:0,
    octroivehicle:'',
    breakagecharges:'',
    receipt_loss:'0',
    eligbreakagecharge: 0,
    eligibleamount:0,
    hsncode:'',
    vendorname:'',
    vendortype:'',
    vendorcode:'',
    bankgstno:0,
    vendorgstno:'',
    igst:0,
    cgst:0,
    sgst:0,
    entergst:false,
    approvedamount:0,
    })
    return group
  }

   removeSection(ind){
    (<FormArray>this.packingform.get('data')).removeAt(ind);
   } 
 

   calc_eligble(ind){
    const detailframe = this.packingform.value.data[ind]
    if(detailframe.totaldisttrans!= null && detailframe.twowheelertrans && detailframe.tonnagehhgood != null&&
      detailframe.receipt_loss && detailframe.distinhilly != null && detailframe.tourgid){
        
        let payload = {
          totaldisttrans:Number(detailframe.totaldisttrans),
      twowheelertrans:detailframe.twowheelertrans,
      tonnagehhgood:Number(detailframe.tonnagehhgood),
      receipt_loss: detailframe.receipt_loss,
      distinhilly:Number(detailframe.distinhilly),
      tourgid:Number(detailframe.tourgid),
      traveltime:Number(detailframe.traveltime),
      vehicletransbydriver:detailframe.vehicletransbydriver,
      expense_id:7,
        }
      this.SpinnerService.show()
        this.taservice.packingeligibleamt(payload)
     .subscribe(res=>{
      this.SpinnerService.hide()
       const eligible = (this.packingform.get('data') as FormArray).at(ind)
       eligible.patchValue({"eligtransamt":Number(res['transportation_amount']),
       "eligibleamount":Number(res['Eligible_amount']),
       "driverbatta":Number(res['driverbatta']),
       "daysdrivereng":Number(res['daysdrivereng']),
       "eligbreakagecharge":Number(res['breakagecharge'])
      })
       
      
     })

      }
   }
   
  
    
  
   submitForm(){
    let packlist = this.packingform.value.data;
    packlist.forEach(element => {
    delete element.entergst
    if (element.transtwowheelerby == ''){
      this.notification.showError("Please select Transport of 2 Wheeler by")
      throw new Error
    }
    if (element.ibaappvendor == ''){
      this.notification.showError("Please enter IBA Approved Vendor Name")
      throw new Error
    }
    if (element.totaldisttrans == 0){
      this.notification.showError("Please select Total Distance(KM) For Transport (Including Hilly Terrain)")
      throw new Error
    }
    if (element.distinhilly == ''){
      this.notification.showError("Please enter Distance in Hilly Terrain")
      throw new Error
    }
    if (element.tonnagehhgood == 0){
      this.notification.showError("Please enter Tonnoge of Household Goods")
      throw new Error
    }
    element.billedamthhgoodstrans = Number(element.billedamthhgoodstrans)
    if (element.billedamthhgoodstrans == null){
      this.notification.showError("Please enter Billed Amount")
      throw new Error
    }
    if (element.transchargesvehicle == ''){
      this.notification.showError("Please enter Transport Charges For Vehicle")
      throw new Error
    }
    if (element.vehicletransbydriver == ''){
      this.notification.showError("Please select Vehicle Transported By Driver")
      throw new Error
    }
    if (element.traveltime == 0){
      this.notification.showError("Please enter Travel Time in Hours")
      throw new Error
    }
    if (element.daysdrivereng == ''){
      this.notification.showError("Please enter No of Days Driver Engaged")
      throw new Error
    }
    // if (element.octroivehicle == ''){
    //   this.notification.showError("Please enter Octroi Charges")
    //   throw new Error
    // }
    // if (element.breakagecharges == ''){
    //   this.notification.showError("Please enter Breakage/Lumpsum Charge")
    //   throw new Error
    // }
    element.claimedamount =Number(element.claimedamount)
    if (element.claimedamount == ''){
      this.notification.showError("Please enter Claim Amount")
      throw new Error
    }
    if(element.id == 0){
      delete element.id
    }
    if (element.hsncode){
      element.hsncode = element.hsncode.code
    }
    });
   
    let payload = {
      "data":packlist
    }
    this.SpinnerService.show()
   this.taservice.packingCreate(payload)
    .subscribe(res=>{
      console.log("resss",res)
      if(res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success"){
        this.SpinnerService.hide()
        this.notification.showSuccess("Success....") 
        this.onSubmit.emit();
        return true;
      }
      else{
        this.SpinnerService.hide()
        this.notification.showError(res.description)
        return false;
      }
    }
    )
    }
    ApproveForm(){
      this.applist=[];
  console.log("form-app",this.packingform.value)
  for(var i=0;i<this.packingform.value.data.length;i++){
    let json = {
      "id": this.packingform.value.data[i].id,
      "amount": this.packingform.value.data[i].approvedamount,
       
    }
    this.applist.push(json)
  }
  for(var i=0;i<this.applist.length;i++){
    this.applist[i].amount = JSON.parse(this.applist[i].amount)
    
  }
  console.log("createdlist",this.applist)
  this.taservice.approver_amountupdate(this.expenseid,7,this.applist)
      .subscribe(res => {
        console.log("incires", res)
        if (res.status === "success") {
          this.notification.showSuccess("Success....")
          this.onSubmit.emit();
          return true;
        }else {
          this.notification.showError(res.description)
          return false;
        }
      })
    }
  back(){
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
   
}
