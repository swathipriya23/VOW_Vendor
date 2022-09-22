import { DatePipe,formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { faservice } from '../fa.service';
import { NotificationService } from '../../service/notification.service';
import{ErrorHandlingServiceService} from '../../service/error-handling-service.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
const isSkipLocationChange = environment.isSkipLocationChange

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
  selector: 'app-assetclubsummary',
  templateUrl: './assetclubsummary.component.html',
  styleUrls: ['./assetclubsummary.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class AssetclubsummaryComponent implements OnInit {
clubdata_array=[]
childarray=[]
fasearchform:FormGroup;
page=1;
  has_next=false;
  has_previous=false;
  branchdata: any;
  isLoading: boolean;
  apcategoryList: any;
  searchdata = {
    "barcode": "",
    "branch": "",
    "cat":"",
    "assetvalue":"",
    "capstart_date":''
    
  }
  constructor(private fb: FormBuilder, private router: Router,public datepipe: DatePipe,
    private errorHandler: ErrorHandlingServiceService,private SpinnerService: NgxSpinnerService,
    private notification: NotificationService, private Faservice: faservice) { }


  ngOnInit(): void {

    this.fasearchform = this.fb.group({
      barcode: [''],
        cat: ['', ],
        capstart_date: [''],
        branch: [''],
        
        assetvalue: [''],




    })

    this.getsummary({},1);
  }
  getsummary(data,page){
    // this.faqueryget({"value":this.findcount},1,0,this.count_search)
    this.SpinnerService.show();
  
    this.Faservice.clubmakerget(data,page)
      .subscribe((result) => {
      if(result){
        let datass = result;
        this.clubdata_array=result['data'];
        if(this.clubdata_array.length>0){
        let datapagination=result['pagination']
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.page = datapagination.index;}
        
        this.SpinnerService.hide()
        // this.Loadinggrid=false
      }else{
        this.SpinnerService.hide()
      
        // this.Loadinggrid=false
      }
  
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    
  }
  locnextClick() {

    if (this.has_next === true) {
      
      this.page=this.page + 1;
      
      this.getsummary({},this.page)
  
    }
  }
  
  locpreviousClick() {
  
    if (this.has_previous === true) {
      this.page=this.page - 1;
      
      this.getsummary({},this.page)
  
    }
  }


childget(i){
  this.Faservice.getchilddetails(this.page,i.parent_id)
      .then((result) => {
      if(result.data){
        let datass = result;
        this.childarray=result['data'];

        
        // this.SpinnerService.hide()
        // this.Loadinggrid=false
      }else{
        // this.SpinnerService.hide()
      
        // this.Loadinggrid=false
      }
  
      })
  
}

// branch
branchget(){
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
// 


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
          console.log("apcategory", datas)
  
        })}
  
        public displayapsscat(autoapcat?: apcatlistss): string | undefined {
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
      
            })}
//search
fasearch(){
  if(this.fasearchform.value.capstart_date!=""||undefined){
    this.searchdata.capstart_date=this.datepipe.transform(this.fasearchform.value.capstart_date, 'yyyy-MM-dd')
    // this.searchdata.capend_date=this.datepipe.transform(this.fasearchform.value.capend_date, 'yyyy-MM-dd')
  
  }
  else{
    delete this.searchdata.capstart_date;
  }
  if(this.fasearchform.value.branch!=''||undefined){
    this.searchdata.branch=this.fasearchform.value.branch.id
    
  }else{
    delete this.searchdata.branch;
    
  }
  if(this.fasearchform.value.assetvalue!=''||undefined){
    this.searchdata.assetvalue=this.fasearchform.value.assetvalue
    
  }else{
    delete this.searchdata.assetvalue;
    
  }
  if(this.fasearchform.value.cat!=''||undefined){
    this.searchdata.cat=this.fasearchform.value.cat
    
  }else{
    delete this.searchdata.cat;
    
  }
  if(this.fasearchform.value.barcode!=''||undefined){
    this.searchdata.barcode=this.fasearchform.value.barcode
    
  }else{
    delete this.searchdata.barcode;
    
  }
  this.getsummary(this.searchdata,this.page)
}
}