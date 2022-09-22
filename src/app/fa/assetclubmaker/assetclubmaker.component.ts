import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { faservice } from '../fa.service';
import { NotificationService } from '../../service/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe, formatDate } from '@angular/common';
import { MatTabGroup } from '@angular/material/tabs';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
export interface BRANCH {
  name: string;
  id: string;
  
}
export interface apcatlistss {
  id: string;
  name: string;
}
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
}
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
  selector: 'app-assetclubmaker',
  templateUrl: './assetclubmaker.component.html',
  styleUrls: ['./assetclubmaker.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class AssetclubmakerComponent implements OnInit {
  @ViewChild("demoTab", { static: false }) demoTab: MatTabGroup;
  fasearchform: any;
  apcategoryList: any;
  isLoading: boolean;
  branchdata: any;
  clubdata_array: any;
  has_next: any;
  has_previous: any;
  page=1;
  selected=-1
  searchflag={}
  movetochecker=[];
  tadid:number=1;
  selectIndex:any=0;
  searchdata = {
    // "barcode": "",
    // "branch": "",
    // "cat":"",
    // "assetvalue":"",
    // "capstart_date":'',
    
    // "id":''
    
  }
  parentarray:any={};
  constructor(private fb: FormBuilder, 
    private router: Router,private SpinnerService: NgxSpinnerService,public datepipe: DatePipe,
    private notification: NotificationService, private Faservice: faservice) { }


  ngOnInit(): void {
   
    this.fasearchform = this.fb.group({
      assetdetails_id: [''],
        cat: ['', ],
        capstart_date: [''],
        branch: [''],
        parentarrayid:[''],
        assetvalue: [''],




    });
    this.getsummary(this.page,'');
  }
  // 
resets(){
  this.searchdata={};
  this.fasearchform.patchValue({'assetdetails_id':'','cat':'','capstart_date':'','branch':'','parentarrayid':'','assetvalue':''})
  if(this.tadid==2){
    this.searchdata['id']=this.parentarray;
    this.getsummary(this.page,'Child');
    
  }
  else{
    this.getsummary(this.page,'');
  }
  
}
// branch
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

}
getbranch(val) {
  this.Faservice.search_employeebranch(val).subscribe((results: any[]) => {
    this.branchdata = results["data"];

  })

}
public displayFnbranch(_branchval ? : BRANCH): string | undefined {
  return _branchval ? _branchval.name : undefined;
}

get _branchval() {
  return this.fasearchform.get('branch');
}
// 

getcat() {
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
      console.log("apcategory", datas)

    })
}

public displayapsscat(autoapcat ? : apcatlistss): string | undefined {
  return autoapcat ? autoapcat.name : undefined;
}


get autoapcat() {
  return this.fasearchform.get('cat');
}
getapcat(apcatkeyvalue) {
  this.Faservice.getapcat(apcatkeyvalue)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.apcategoryList = datas;

    })
}

subModuleData(event){
  if (event.tab.textLabel=="CHOOSE CHILD ASSET"){
    //this.parentarray.id==undefined||''
    this.tadid=2;
    
    if(this.parentarray.id== undefined || ''){
      this.notification.showError(" Please Select a Parent asset ");
      this.selectIndex=0;
      return false
    }
    else{

   
    this.searchflag=this.parentarray
    this.searchdata['id']=this.parentarray.id;
    this.getsummary(this.page,'Child')
  }
  }else{
    this.parentarray={};
    this.tadid=0;
    this.getsummary(this.page,'') 
  }
}

getsummary(page,type){
  // this.faqueryget({"value":this.findcount},1,0,this.count_search)
  console.log(this.fasearchform.value)
  if(this.fasearchform.value.capstart_date!='' && this.fasearchform.value.capstart_date!=null){
    this.searchdata['capstart_date']=this.datepipe.transform(this.fasearchform.value.capstart_date, 'yyyy-MM-dd')
  }
  if(this.fasearchform.value.branch!='' && this.fasearchform.value.branch!=null){
    this.searchdata['branch']=this.fasearchform.value.branch.id
  }
  if(this.fasearchform.value.assetvalue!='' && this.fasearchform.value.assetvalue !=null){
    this.searchdata['assetvalue']=this.fasearchform.value.assetvalue;
    
  }
  if(this.fasearchform.value.cat!='' && this.fasearchform.value.cat!=null){
    this.searchdata['cat']=this.fasearchform.value.cat['id']
    
  }
  if(this.fasearchform.get('assetdetails_id').value!="" && this.fasearchform.get('assetdetails_id').value!=null){
    this.searchdata['asset_id']=this.fasearchform.get('assetdetails_id').value;
  }
  if(this.fasearchform.get('assetdetails_id').value!="" && this.fasearchform.get('assetdetails_id').value!=null){
    this.searchdata['barcode']=this.fasearchform.get('assetdetails_id').value;
  }
  this.SpinnerService.show();
  
  console.log(this.searchdata)
  this.Faservice.Assetparentchildsummary(page,type,this.searchdata)
    .subscribe((result) => {
    if(result['data'].length>0){
      let datass = result;
      this.clubdata_array=result['data'];
      if(this.clubdata_array.length>0){
      let datapagination=result['pagination']
      this.has_next = datapagination.has_next;
      this.has_previous = datapagination.has_previous;
      this.page = datapagination.index;
      
      this.SpinnerService.hide()
      // this.Loadinggrid=false
    }
    }else{
      this.SpinnerService.hide()
      this.clubdata_array=[];
      // this.Loadinggrid=false
    }

    },
    (error)=>{
      this.SpinnerService.hide();
    }
    )
  
}
locnextClick() {

  if (this.has_next === true) {
    
    this.page=this.page + 1;
    
    this.getsummary(this.page,'')

  }
}

locpreviousClick() {

  if (this.has_previous === true) {
    this.page=this.page - 1;
    
    this.getsummary(this.page,'')

  }
}
movetocheckerapi(){
  if(this.movetochecker.length==0){
    this.notification.showWarning('Please Select Any one Check Box');
    return false;
  }
  
  this.Faservice.clubmakerupdate(this.movetochecker,'moveto_checker')
  .subscribe((results: any[]) => {
    let message = results['status'];
    if(message=='success'){
      this.notification.showSuccess(" Success")
      this.getsummary(this.page,'Child')
    }
    else{
      this.notification.showError("Failed")
      this.getsummary(this.page,'Child')
    }

  })

}
getvalue2(i){
  if(i.movetochecker){
    this.parentarray={"id":i.barcode}
    // console.log(this.movetochecker)
  }
  else{
    this.parentarray={}
    // this.movetochecker.splice(this.movetochecker.indexOf({"id":i.id,"barcode":i.barcode}), 1);
}
}

getvalue(i){
  if(i.movetochecker){
    this.movetochecker.push({"id":i.id,"barcode":i.barcode, "parentid":this.parentarray.id})
    console.log(this.movetochecker)
  }
  else{
    this.movetochecker.splice(this.movetochecker.indexOf({"id":i.id,"barcode":i.barcode}), 1);
}

}
fasearch(){
  
  if(this.fasearchform.value.capstart_date!='' && this.fasearchform.value.capstart_date!=null){
    this.searchdata['capstart_date']=this.datepipe.transform(this.fasearchform.value.capstart_date, 'yyyy-MM-dd')
  }
  if(this.fasearchform.value.branch!='' && this.fasearchform.value.branch!=null){
    this.searchdata['branch']=this.fasearchform.value.branch.id
  }
  if(this.fasearchform.value.assetvalue!='' && this.fasearchform.value.assetvalue !=null){
    this.searchdata['assetvalue']=this.fasearchform.value.assetvalue;
    
  }
  if(this.fasearchform.value.cat!='' && this.fasearchform.value.cat!=null){
    this.searchdata['cat']=this.fasearchform.value.cat['id']
    
  }
  if(this.fasearchform.get('assetdetails_id').value!="" && this.fasearchform.get('assetdetails_id').value!=null){
    this.searchdata['asset_id']=this.fasearchform.get('assetdetails_id').value;
  }
  if(this.fasearchform.get('assetdetails_id').value!="" && this.fasearchform.get('assetdetails_id').value!=null){
    this.searchdata['barcode']=this.fasearchform.get('assetdetails_id').value;
  }
  // this.getsummary(this.page,'')
// else{
//     delete this.searchdata.barcode;
    
//   }
 
  if(this.tadid==2){
    this.searchdata['id']=this.parentarray.id
    this.getsummary(this.page,'Child')

  }else{
    this.getsummary(this.page,'')
  }
  // this.searchflag=this.searchdata
}

}
