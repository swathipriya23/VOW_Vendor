import { Component, OnInit, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { faservice } from '../fa.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import {Observable, range} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogConfig } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedService } from '../../service/shared.service';
import { ErrorHandlerService } from '../error-handler.service';
export interface User {
  title: string;
  model:string
}
export interface BRANCH {
  name: string;
  id: string;
  
}
export interface apcatlistss {
  id: string;
  name: string;
}
@Component({
  selector: 'app-faquery',
  templateUrl: './faquery.component.html',
  styleUrls: ['./faquery.component.scss']
})


export class FaqueryComponent implements OnInit {
  @ViewChild('refclose') refsdatapopdata:ElementRef;
accountingarray = [];
sumofcredit:number=0;
sumofdebit:number=0;
cp_date = false;
transfer_branch = false;
asset_enddate = false;
ins_date = false;
asset_leasedate = false;
asset_value = false;
po_no_enter = false;
invoice_no_enter = false;
mep_no_enter = false;
invoice_amt_enter = false;
vendor_name_enter = false;
dep_hold_enter = false;
asset_source=false;
Loadinggrid = false;
first:boolean=false;
countdata = {
  "cap_count": '',
  "writeoff_count": '',
  "impair_count": "",
  "assetvalue_count": "",
  "merge_count": "",
  "transfer_count": "",
  "split_count": '',
  "cat_count": 0,
  "sale_count": ''
}
Datas = [{'title':"Cap date",'value' :1 },
         {'title':"WriteOff",'value' :2} ,
         {'title':"Impairment",'value' :3} ,
         {'title':"Value Change",'value' :4},
         {'title':"Merge",'value' :5},
         {'title':"Split",'value' :6},
         {'title':"Transfer",'value' :7},
         {'title':"Category",'value' :8},
         {'title':"Sale",'value' :9}];
pagesize=10;
filter_options:User[]=[{'title':"CP Date",'model':"cp_date"},
                       {'title':"Transfer Branch",'model':"transfer_branch"},
                       {'title':"Asset EndDate",'model':"asset_enddate"},
                       {'title':"Invoice Date",'model':"ins_date"},
                       {'title':"Asset Lease Date",'model':"asset_leasedate"},
                       {'title':"Asset Value",'model':"asset_value"},
                       {'title':"PO No",'model':"po_no_enter"},
                       {'title':"MEP No",'model':"mep_no_enter"},
                       {'title':"Invoice No",'model':"invoice_no_enter"},
                       {'title':"Taxable Amount",'model':"invoice_amt_enter"},
                       {'title':"Vendor Name",'model':"vendor_name_enter"},
                       {'title':"Depreciation Hold",'model':"dep_hold_enter"},
                       {'title':"Asset Source",'model':"asset_source"}
                      ]
depreciation_options = [{'title':"Yes",'value' :1 },
                        {'title':"No",'value' :0}]
assetsource=[]

fasearchform:FormGroup;
  branchdata: any;
  apcategoryList: any;
  selectedValues: any;
  faquerygrid=[];
  has_nextloc=false;
  has_previousloc=false;
  presentpageloc=1;
  count: any;
  findcount=[]
  count_search='1';
  options: string[] = ["10", "20", "50","100","200","250"];
  depselectionvalue: string;
  version: any;
  asst_source_id:any=[];
  constructor(private errorsHandler:ErrorHandlerService,private sharedService:SharedService,private fb: FormBuilder, private router: Router,
    private notification: NotificationService,public datepipe: DatePipe, private toastr: ToastrService, private Faservice: faservice,private SpinnerService: NgxSpinnerService) { }

  myControl = new FormControl();
  accountDetailslist:Array<any>=[];
  filteredOptions: Observable<User[]>;
  isLoading=false;
  searchdata = {
    "asstsrc":"",
    "assetdetails_id": "",
    "assetgroup_id": "",
    "barcode": "",
    "branch": "",
    "capend_date": "",
    "capstart_date": "",
    "cat": "",
    "crnum": "",
    "enddate": "",
    "enddatefrom": "",
    "enddateto": "",
    "lease_enddate": "",
    "lease_startdate": "",
    "ponum": "",
    "mepno": "",
    "subcat": "",
    "vendorname": "",
    "invoicedate": "",
    "amount": "",
    "invoiceno": "",
    "assetto_value": "",
    "assetfrom_value": "",
    "branchfrom": "",
    "branchto": "",
    "deponhold":""
  }
  ngOnInit() {
    this.Faservice.getassetsource().subscribe(
      data=>{
        this.assetsource=data
        console.log(this.assetsource)
      },
      (error:HttpErrorResponse)=>{
        this.errorsHandler.errorHandler(error,'');
      }  
    );

    this.fasearchform = this.fb.group({
      asstsrc:[''],
      assetdetails_id: ['' ],
      barcode: ['' ],
      invoicedate:['' ],
      amount:[''],
      invoiceno: [""],
      assetgroup_id: [''],
      cat: ['', ],
      subcat: ['', ],
      lease_startdate: ['' ],
      lease_enddate: ['' ],
      enddate: [''],
      vendorname: ['' ],
      crnum: ['' ],
      ponum: ['' ],
      deponhold:[''],
      capstart_date: ['' ],
      capend_date: [''],
      branch: [''],
      enddatefrom: [''],
      enddateto: ['' ],
      branchfrom:[''],
      branchto:[''],
      assetfrom_value:[''],
      assetto_value:[''],
      mepno:[''],




    })
    this.faqueryget({},1,10,'')
    this.faqueryversion();
    // console.log('do')
    this.filteredOptions=this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.title)),
      map(title => (title ? this._filter(title) : this.filter_options.slice())),
    );

    // this.Faservice.querycount(10)

    // .subscribe((result) => {
    // if(result){
    //   let datass = result['data'];
    //   // this.countdata=result;
    //   this.faquerygrid = datass;
    //   // console.log("landlord", this.faquerygrid)
    //   if (datass.length>0) {
    //     let datapagination = result["pagination"];
    //     this.count=result['count']
    //   }}})      
  }

  displayFn(user: User): string {
    return user && user.title ? user.title : '';
  }
  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.filter_options.filter(option => option.title.toLowerCase().includes(filterValue));
}

branchget() {
  let bs: String = "";
  this.getbranch(bs);

  this.fasearchform.get('branch').valueChanges
  .pipe(
    debounceTime(100),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading = true;
      // console.log('inside tap')

    }),
    switchMap(value => this.Faservice.search_employeebranch(value)
      .pipe(
        finalize(() => {
          this.isLoading = false
        }),
      )
    )
  )

    .subscribe((results: any[]) => {
      this.branchdata = results["data"];
     
    })
    this.fasearchform.get('branchfrom').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        // console.log('inside tap')
  
      }),
      switchMap(value => this.Faservice.search_employeebranch(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
  
      .subscribe((results: any[]) => {
        this.branchdata = results["data"];
       
      })
      this.fasearchform.get('branchto').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')
    
        }),
        switchMap(value => this.Faservice.search_employeebranch(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
    
        .subscribe((results: any[]) => {
          this.branchdata = results["data"];
         
        })    
}

getbranch(val){
  this.Faservice.search_employeebranch(val).subscribe((results: any[]) => {
    this.branchdata = results["data"];
   
  })

}
public displayFnbranch(_branchval?: BRANCH): string | undefined {
  return _branchval ? _branchval.name : undefined;
}

get _branchval() {
  return this.fasearchform.get('branch');
}
get _branchvalfrom() {
  return this.fasearchform.get('branchfrom');
}
get _branchvalto() {
  return this.fasearchform.get('branchto');
}
public displayFnbranchfrom(_branchvalfrom?: BRANCH): string | undefined {
  return _branchvalfrom ? _branchvalfrom.name : undefined;
}

public displayFnbranchto(_branchvalto?: BRANCH): string | undefined {
  return _branchvalto ? _branchvalto.name : undefined;
}



getcat(){
let apcatkeyvalue: String = "";
    this.getapcat(apcatkeyvalue);
    // this.getsubcatid();


    this.fasearchform.get('cat').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.Faservice.getapcat(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.apcategoryList = datas;
        console.log("cat", datas)

      })}

      public displayapsscat(autoapcat?: apcatlistss): string | undefined {
        return autoapcat ? autoapcat.name : undefined;
      }
      
    
      get autocit() {
        return this.fasearchform.get('cat');
      }
    
     getapcat(apcatkeyvalue) {
        this.Faservice.getapcat(apcatkeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.apcategoryList = datas;
    
          })}
    

filter_flags(ev,fg){
  console.log(fg)
}

edit(d:number){
  console.log(d)
   this.depselectionvalue = d.toString()
 console.log(this.depselectionvalue)
}
sourceget(event,asst_src_data){
  console.log(event)
  console.log(asst_src_data)

  if (event.isUserInput && event.source.selected == false) {
    if(asst_src_data=='1'){
      delete this.asst_source_id[0];
    }
    if(asst_src_data=='2'){
      delete this.asst_source_id[1];
    }
    if(asst_src_data=='3'){
      delete this.asst_source_id[2];
    }
    if(asst_src_data=='4'){
      delete this.asst_source_id[3];
    }
    if(asst_src_data=='5'){
      delete this.asst_source_id[4];
    }
    if(asst_src_data=='6'){
      delete this.asst_source_id[5];
    }
    if(asst_src_data=='7'){
      delete this.asst_source_id[6];
    }
    if(asst_src_data=='8'){
      delete this.asst_source_id[7];
    }
    if(asst_src_data=='9'){
      delete this.asst_source_id[8];
    }
    if(asst_src_data=='10'){
      delete this.asst_source_id[9];
    }
    if(asst_src_data=='11'){
      delete this.asst_source_id[10];
    }
    if(asst_src_data=='12'){
      delete this.asst_source_id[11];
    }
    if(asst_src_data=='13'){
      delete this.asst_source_id[12];
    }
    if(asst_src_data=='14'){
      delete this.asst_source_id[13];
    }
  }
  if (event.isUserInput && event.source.selected == true) {
    if(asst_src_data=='1'){
      this.asst_source_id[0]='1';
    }
    if(asst_src_data=='2'){
      this.asst_source_id[1]='2';
    }
    if(asst_src_data=='3'){
      this.asst_source_id[2]='3';
    }
    if(asst_src_data=='4'){
      this.asst_source_id[3]='4';
    }
    if(asst_src_data=='5'){
      this.asst_source_id[4]='5';
    }
    if(asst_src_data=='6'){
      this.asst_source_id[5]='6';
    }
    if(asst_src_data=='7'){
      this.asst_source_id[6]=7;
    }
    if(asst_src_data=='8'){
      this.asst_source_id[7]='8';
    }
    if(asst_src_data=='9'){
      this.asst_source_id[8]='9';
    }
    if(asst_src_data=='10'){
      this.asst_source_id[9]='10';
    }
    if(asst_src_data=='11'){
      this.asst_source_id[10]='11';
    }
    if(asst_src_data=='12'){
      this.asst_source_id[11]='12';
    }
    if(asst_src_data=='13'){
      this.asst_source_id[12]='13';
    }
    if(asst_src_data=='14'){
      this.asst_source_id[13]='14';
    }
  }
}

selectionChange(event) {
  if (event.isUserInput && event.source.selected == false) {
    // let index = this.selectedValues.indexOf(event.source.value);
    // this.selectedValues.splice(index, 1)
    if(event.source.value.model=='cp_date'){
      this.cp_date=false;
      this.fasearchform.value.capstart_date='';
    }
    if(event.source.value.model=='transfer_branch'){
      this.transfer_branch=false;
      this.fasearchform.value.branchfrom=''
    }
    if(event.source.value.model=='asset_enddate'){
      this.asset_enddate=false;
      this.fasearchform.value.enddatefrom='';
    }
    if(event.source.value.model=='ins_date'){
      this.ins_date=false;
      // this.fasearchform.value.in='';
    }
    if(event.source.value.model=='asset_leasedate'){
      this.asset_leasedate=false;
      this.fasearchform.value.lease_startdate=''
    }
    if(event.source.value.model=='asset_value'){
      this.asset_value=false;
      this.fasearchform.value.assetfrom_value=''
    }
    if(event.source.value.model=='po_no_enter'){
      this.po_no_enter=false;
      this.fasearchform.value.ponum=''
    }
    if(event.source.value.model=='invoice_no_enter'){
      this.invoice_no_enter=false;
    }
    if(event.source.value.model=='mep_no_enter'){
      this.mep_no_enter=false;

      this.fasearchform.value.mepno=''
    }
    if(event.source.value.model=='invoice_amt_enter'){
      this.invoice_amt_enter=false;
    }
    if(event.source.value.model=='vendor_name_enter'){
      this.vendor_name_enter=false;
      this.fasearchform.value.vendorname=''
    }
    if(event.source.value.model=='dep_hold_enter'){
      this.dep_hold_enter=false;
    }
    if(event.source.value.model=='asset_source'){
      this.asset_source=false;
    }
  
  }
  else if(event.isUserInput && event.source.selected == true){

    if(event.source.value.model=='cp_date'){
      this.cp_date=true;
    }
    if(event.source.value.model=='transfer_branch'){
      this.transfer_branch=true;
    }
    if(event.source.value.model=='asset_enddate'){
      this.asset_enddate=true;
    }
    if(event.source.value.model=='ins_date'){
      this.ins_date=true;
    }
    if(event.source.value.model=='asset_leasedate'){
      this.asset_leasedate=true;
    }
    if(event.source.value.model=='asset_value'){
      this.asset_value=true;
    }
    if(event.source.value.model=='po_no_enter'){
      this.po_no_enter=true;
    }
    if(event.source.value.model=='invoice_no_enter'){
      this.invoice_no_enter=true;
    }
    if(event.source.value.model=='mep_no_enter'){
      this.mep_no_enter=true;
    }
    if(event.source.value.model=='invoice_amt_enter'){
      this.invoice_amt_enter=true;
    }
    if(event.source.value.model=='vendor_name_enter'){
      this.vendor_name_enter=true;
    }
    if(event.source.value.model=='dep_hold_enter'){
      this.dep_hold_enter=true;}
    
    if(event.source.value.model=='asset_source'){
        this.asset_source=true;
        console.log(this.asset_source)
      }
  }



}
totalcount(event,type){
  
  if(event.isUserInput && event.source.selected == true){
this.findcount.push(event.source.value.value)

  }
  else if(event.isUserInput && event.source.selected == false){
    
  this.deleteMsg(event.source.value.value)
}

if(!this.findcount?.length){
  this.count_search='1';

}else{

this.count_search=type
}
}
deleteMsg(msg:any) {
  const index: number = this.findcount.indexOf(msg);
  if (index !== -1) {
      this.findcount.splice(index, 1);
  }        
}
FA_Countarray(){
  // this.faqueryget({"value":this.findcount},1,0,this.count_search)
  this.SpinnerService.show();

  this.Faservice.queryget({"value":this.findcount},1,0,this.count_search)
    .subscribe((result) => {
    if(result){
      console.log('FilterCount',result)
      let datass = result;
      this.countdata=result;
      
      this.SpinnerService.hide()
      this.Loadinggrid=false
    }else{this.SpinnerService.hide()
    
      this.Loadinggrid=false
    }

    },
    (error:HttpErrorResponse)=>{
      this.SpinnerService.hide();
      // this.toastr.warning(error.status+error.statusText)
      this.errorHandler(error,'');
    }
    )
  
}

faqueryversion(){
  this.Faservice.queryverisonget().subscribe((data)=>{
    console.log('version',data)
    this.version = data['data']
  })
}

faqueryget(data,page,size,type) {
  // this.SpinnerService.show();
  this.Loadinggrid=true
  this.SpinnerService.show()
  this.Faservice.queryget(data,page,size,type)
    .subscribe((result) => {
    if(result){
      let datass = result['data'];

      this.faquerygrid = datass;
      console.log('datass',datass)
      console.log("landlord", this.faquerygrid)
      let datapagination = result["pagination"];
      this.count=result['count']
      console.log('count',this.count)
      this.has_nextloc = datapagination.has_next;
      this.has_previousloc = datapagination.has_previous;
      this.presentpageloc = datapagination.index;
      
      this.SpinnerService.hide()
      this.Loadinggrid=false
    }
    else{
      this.SpinnerService.hide()
      this.Loadinggrid=false
    }

    },
    (error:HttpErrorResponse)=>{
      this.SpinnerService.hide();
      this.errorHandler(error,'');
    }
    )
  

}


fasearch(a,b){


  this.SpinnerService.show();
  this.Loadinggrid=true
if(a=='count'){
  this.pagesize=b
  this.presentpageloc=1;
}



if(this.fasearchform.value.capstart_date!=""||undefined){
  this.searchdata.capstart_date=this.datepipe.transform(this.fasearchform.value.capstart_date, 'yyyy-MM-dd')
  this.searchdata.capend_date=this.datepipe.transform(this.fasearchform.value.capend_date, 'yyyy-MM-dd')

}
else{
  delete this.searchdata.capstart_date;
}
if(this.fasearchform.value.branchfrom!=''||undefined){
  this.searchdata.branchfrom=this.fasearchform.value.branchfrom.id
  this.searchdata.branchto=this.fasearchform.value.branchto.id
}else{
  delete this.searchdata.branchfrom;
  delete this.searchdata.branchto;
}
if(this.fasearchform.value.assetfrom_value!=''||undefined){
  this.searchdata.assetfrom_value=this.fasearchform.value.assetfrom_value
  this.searchdata.assetto_value=this.fasearchform.value.assetto_value
}else{
  delete this.searchdata.assetfrom_value;
  delete this.searchdata.assetto_value;
}
if(this.fasearchform.value.lease_startdate!=""||undefined){
  this.searchdata.lease_startdate=this.datepipe.transform(this.fasearchform.value.lease_startdate, 'yyyy-MM-dd')
  this.searchdata.lease_enddate=this.datepipe.transform(this.fasearchform.value.lease_enddate, 'yyyy-MM-dd')

}
else{
  delete this.searchdata.lease_startdate;
  
}
if(this.fasearchform.value.enddatefrom!=""||undefined){
  this.searchdata.enddatefrom=this.datepipe.transform(this.fasearchform.value.enddatefrom, 'yyyy-MM-dd')
  this.searchdata.enddateto=this.datepipe.transform(this.fasearchform.value.enddateto, 'yyyy-MM-dd')

  
}else{
  delete this.searchdata.enddatefrom; 
}
if(this.fasearchform.value.deponhold!=""||undefined ){
  this.searchdata.deponhold=this.depselectionvalue
  console.log('deponhold',this.searchdata.deponhold)
}else{
  delete this.searchdata.deponhold;
}
if(this.fasearchform.value.asstsrc!=""||undefined ){
  this.searchdata.asstsrc=this.asst_source_id;
}else{
  delete this.searchdata.deponhold;
}
if(this.fasearchform.value.amount!=""||undefined ){
  this.searchdata.amount=this.fasearchform.value.amount
}else{
  delete this.searchdata.amount;
}
if(this.fasearchform.value.invoicedate!=""||undefined ){
  this.searchdata.invoicedate=this.datepipe.transform(this.fasearchform.value.invoicedate, 'yyyy-MM-dd')
  
}else{
  delete this.searchdata.invoicedate;
}

if(this.fasearchform.value.invoiceno!=""||undefined ){
  this.searchdata.invoiceno=this.fasearchform.value.invoiceno  
  
}else{
  delete this.searchdata.invoiceno;
}

if(this.fasearchform.value.cat!=""||undefined){
  this.searchdata.cat=this.fasearchform.value.cat.id
}else{
  delete this.searchdata.cat;
}
 if(this.fasearchform.value.branch!=""||undefined){
  this.searchdata.branch=this.fasearchform.value.branch.id
}else{
  delete this.searchdata.branch;
}
if(this.fasearchform.value.vendorname!=""||undefined){
  this.searchdata.vendorname=this.fasearchform.value.vendorname
}else{
  delete this.searchdata.vendorname;
}
if(this.fasearchform.value.assetdetails_id!=""||undefined){
  this.searchdata.assetdetails_id=this.fasearchform.value.assetdetails_id
}else{
  delete this.searchdata.assetdetails_id;
}

if(this.fasearchform.value.ponum!=""||undefined){
  this.searchdata.ponum=this.fasearchform.value.ponum
}else{
  delete this.searchdata.ponum;
}
if(this.fasearchform.value.mepno!=""||undefined){
  this.searchdata.mepno=this.fasearchform.value.mepno
}else{
  delete this.searchdata.mepno;
}
if(this.fasearchform.value.crnum!=""||undefined){
  this.searchdata.crnum=this.fasearchform.value.crnum
}else{
  delete this.searchdata.crnum;
}


  this.Faservice.queryget(this.searchdata,this.presentpageloc,this.pagesize,this.count_search)

    .subscribe((result) => {
    if(result){
      let datass = result['data'];
      // this.countdata=result;
      this.faquerygrid = datass;
      // console.log("landlord", this.faquerygrid)
      if (datass.length>0) {
        let datapagination = result["pagination"];
        this.count=result['count']
        this.has_nextloc = datapagination.has_next;
        this.has_previousloc = datapagination.has_previous;
        this.presentpageloc = datapagination.index;
      }
      this.Loadinggrid=false
      this.SpinnerService.hide();
    }
      else{
        this.SpinnerService.hide();
        this.Loadinggrid=false
        this.faquerygrid =[];
      }

    },
    (error:HttpErrorResponse)=>{
      this.SpinnerService.hide();
      this.errorHandler(error,'');
    }
    )
    // this.SpinnerService.hide();

}
download_file(){
  
  this.Loadinggrid=true;
if(this.fasearchform.value.capstart_date!=""||undefined){
  this.searchdata.capstart_date=this.datepipe.transform(this.fasearchform.value.capstart_date, 'yyyy-MM-dd')
  this.searchdata.capend_date=this.datepipe.transform(this.fasearchform.value.capend_date, 'yyyy-MM-dd')

}
else{
  delete this.searchdata.capstart_date;
}
if(this.fasearchform.value.branchfrom!=''||undefined){
  this.searchdata.branchfrom=this.fasearchform.value.branchfrom.id
  this.searchdata.branchto=this.fasearchform.value.branchto.id
}else{
  delete this.searchdata.branchfrom;
  delete this.searchdata.branchto;
}
if(this.fasearchform.value.assetfrom_value!=''||undefined){
  this.searchdata.assetfrom_value=this.fasearchform.value.assetfrom_value
  this.searchdata.assetto_value=this.fasearchform.value.assetto_value
}else{
  delete this.searchdata.assetfrom_value;
  delete this.searchdata.assetto_value;
}
if(this.fasearchform.value.lease_startdate!=""||undefined){
  this.searchdata.lease_startdate=this.datepipe.transform(this.fasearchform.value.lease_startdate, 'yyyy-MM-dd')
  this.searchdata.lease_enddate=this.datepipe.transform(this.fasearchform.value.lease_enddate, 'yyyy-MM-dd')

}
else{
  delete this.searchdata.lease_startdate;
  
}
if(this.fasearchform.value.enddatefrom!=""||undefined){
  this.searchdata.enddatefrom=this.datepipe.transform(this.fasearchform.value.enddatefrom, 'yyyy-MM-dd')
  this.searchdata.enddateto=this.datepipe.transform(this.fasearchform.value.enddateto, 'yyyy-MM-dd')

  
}else{
  delete this.searchdata.enddatefrom; 
}
if(this.fasearchform.value.deponhold!=""||undefined ){
  this.searchdata.deponhold=this.depselectionvalue
  console.log('deponhold',this.searchdata.deponhold)
}else{
  delete this.searchdata.deponhold;
}
if(this.fasearchform.value.asstsrc!=""||undefined ){
  this.searchdata.asstsrc=this.asst_source_id;
}else{
  delete this.searchdata.deponhold;
}
if(this.fasearchform.value.amount!=""||undefined ){
  this.searchdata.amount=this.fasearchform.value.amount
}else{
  delete this.searchdata.amount;
}
if(this.fasearchform.value.invoicedate!=""||undefined ){
  this.searchdata.invoicedate=this.datepipe.transform(this.fasearchform.value.invoicedate, 'yyyy-MM-dd')
  
}else{
  delete this.searchdata.invoicedate;
}

if(this.fasearchform.value.invoiceno!=""||undefined ){
  this.searchdata.invoiceno=this.fasearchform.value.invoiceno  
  
}else{
  delete this.searchdata.invoiceno;
}

if(this.fasearchform.value.cat!=""||undefined){
  this.searchdata.cat=this.fasearchform.value.cat.id
}else{
  delete this.searchdata.cat;
}
 if(this.fasearchform.value.branch!=""||undefined){
  this.searchdata.branch=this.fasearchform.value.branch.id
}else{
  delete this.searchdata.branch;
}
if(this.fasearchform.value.vendorname!=""||undefined){
  this.searchdata.vendorname=this.fasearchform.value.vendorname
}else{
  delete this.searchdata.vendorname;
}
if(this.fasearchform.value.assetdetails_id!=""||undefined){
  this.searchdata.assetdetails_id=this.fasearchform.value.assetdetails_id
}else{
  delete this.searchdata.assetdetails_id;
}

if(this.fasearchform.value.ponum!=""||undefined){
  this.searchdata.ponum=this.fasearchform.value.ponum
}else{
  delete this.searchdata.ponum;
}
if(this.fasearchform.value.mepno!=""||undefined){
  this.searchdata.mepno=this.fasearchform.value.mepno
}else{
  delete this.searchdata.mepno;
}
if(this.fasearchform.value.crnum!=""||undefined){
  this.searchdata.crnum=this.fasearchform.value.crnum
}else{
  delete this.searchdata.crnum;
}


  // this.Faservice.queryget(this.searchdata,this.presentpageloc,this.pagesize,this.count_search)

  //   .subscribe((result) => {
  //   if(result){
  //     let datass = result['data'];
  //     // this.countdata=result;
  //     this.faquerygrid = datass;
  //     // console.log("landlord", this.faquerygrid)
  //     if (datass.length>0) {
  //       let datapagination = result["pagination"];
  //       this.count=result['count']
  //       this.has_nextloc = datapagination.has_next;
  //       this.has_previousloc = datapagination.has_previous;
  //       this.presentpageloc = datapagination.index;
  //     }
  //     this.Loadinggrid=false
  //     this.SpinnerService.hide();
  //   }
  //     else{
  //       this.SpinnerService.hide();
  //       this.Loadinggrid=false
  //       this.faquerygrid =[];
  //     }

  //   })
  if(this.first==true){
    this.notification.showWarning('Already Work In Progress Please Wait..');
    return true;
  }
  else{
    this.first=true;
    this.Faservice.downloadfile(this.searchdata,this.presentpageloc,this.pagesize,this.count_search).subscribe(
      (response: any) =>{
          this.first=false;
          let filename:any='document';
          let dataType = response.type;
          let binaryData = [];
          binaryData.push(response);
          let downloadLink:any = document.createElement('a');
          console.log()
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
          
          downloadLink.setAttribute('download',filename);
          document.body.appendChild(downloadLink);
          downloadLink.click();
      },
      (error:HttpErrorResponse)=>{
        this.first=false;
        this.errorHandler(error,'file');
        // this.toastr.error(error.status+'-'+error.statusText,'',{timeOut: 5000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
       
        //   error.error.text().then(text => {
        //     let d:any=text.split('\n');
        //     this.toastr.error(d[1],'',{timeOut: 10000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
        //   });
      }
  )
    }


}
locnextClick() {

  if (this.has_nextloc === true) {
    
    this.presentpageloc=this.presentpageloc + 1;
    this.pagesize=10
    this.fasearch('', '')

  }
}

locpreviousClick() {

  if (this.has_previousloc === true) {
    this.presentpageloc=this.presentpageloc - 1;
    this.pagesize=10
    this.fasearch('', '')

  }
}

// Accountdetails(i){
//  console.log(i)

//  this.Faservice.accounting_ddl(i.barcode)

//  .subscribe((result) => {
//  if(result){
//    this.accountingarray = result['data'];}
  
  
//   })
// }
Accountdetails(i){
  this.sumofcredit=0;
  this.sumofdebit=0;
  // const dialogConfig = new MatDialogConfig();
  //      dialogConfig.disableClose = true;
  //      dialogConfig.autoFocus = true;
  //      dialogConfig.position = {
  //        top:  '0'  ,
  //        // right: '0'
  //      };
  //      dialogConfig.width = '70%' ;
  //      dialogConfig.height = '500px' ;
       
  //      dialogConfig.hasBackdrop=true;
       
  //      console.log(dialogConfig);
  //    this.matdialog.open(this.opendialogdata,dialogConfig);
    console.log(i)
    this.SpinnerService.show();
    this.Faservice.accounting_ddl(i.barcode)

    .subscribe((result) => {
    if(result){
      this.SpinnerService.hide();
      this.accountDetailslist = result['data'];
      if(this.accountDetailslist.length>0){
        for(let i=0;i<this.accountDetailslist.length;i++){
          if(this.accountDetailslist[i]["type"]=="DEBIT"){
            this.sumofdebit=this.sumofdebit+Number(this.accountDetailslist[i]['amount']);
          }
          if(this.accountDetailslist[i]["type"]=="CREDIT"){
            this.sumofcredit=this.sumofcredit+Number(this.accountDetailslist[i]['amount']);
          }
        }
      }
      else{
        this.notification.showWarning('No Data Available');
      }
    }
      
      
      },
      (error)=>{
        this.SpinnerService.hide();
        this.sumofcredit=0;
        this.sumofdebit=0;
        this.accountDetailslist=[];
      }
      )
}
opendialognew(){
  const dialogConfig = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.autoFocus = true;
       dialogConfig.position = {
         top:  '0'  ,
         // right: '0'
       };
       dialogConfig.width = '70%' ;
       dialogConfig.height = '700px' ;
       dialogConfig.hasBackdrop=true;
       
       console.log(dialogConfig);
    //  this.matdialog.open(this.opendialogdata,dialogConfig);
}
closenewdialog(){
  console.log('h');
  // this.matdialog.closeAll();
  this.refsdatapopdata.nativeElement.click();
  this.accountDetailslist=[];
}
  public errorHandler(error:HttpErrorResponse,type:any){
    {
      if (error instanceof HttpErrorResponse)
      {
        if (error.status == 401 || error.status == 403 || error.status == 400)
        {
          this.toastr.error(error.status+'-'+error.statusText,'',{timeOut: 10000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
          localStorage.removeItem("sessionData");
          this.sharedService.isLoggedin=false;
          this.sharedService.Loginname='';
          this.router.navigateByUrl('/verify');
        }
        else{
          this.toastr.error(error.status+'-'+error.statusText,'',{timeOut: 10000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
          if(error.status !=0){
            if(type=='file'){
              error.error.text().then(text => {
                let d:any=text.split('\n');
                this.toastr.error(d[1],'',{timeOut: 10000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
              });
            }
            else{
              console.log(error.error);
              let d:any=(error.error).toString().split('\n');
              // error.error.then(text => {
              //   let d:any=text.split('\n');
                this.toastr.error(d[1],'',{timeOut: 10000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
              // });
            }
            
          }
          else{
            this.toastr.error(error.status+'-'+error.statusText,'Server Issues',{timeOut: 10000,closeButton	:true,progressBar:true,progressAnimation:'decreasing'});
          }
          
        }
      }
    }
  }
}