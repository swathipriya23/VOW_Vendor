import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router, RouterLinkWithHref } from '@angular/router';
import { faservice } from '../fa.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Fa2Service } from '../fa2.service';
import { ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map, first } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, from, fromEvent } from 'rxjs';
import { faShareService } from '../share.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlerService } from '../error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
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
export interface branchlistss {
  id: any;
  code: string;
  name: string;
}
export interface categorylistss {
  id: any;
  subcatname: string;
}
@Component({
  selector: 'app-splitmaker-add',
  templateUrl: './splitmaker-add.component.html',
  styleUrls: ['./splitmaker-add.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class SplitmakerAddComponent implements OnInit {

  
  splitSearchForm:FormGroup;
  splitlist: Array<any>
  has_next = true;
  has_previous = true;
  issplitmakeradd: boolean
  ismakerCheckerButton: boolean;
  checkedValues: boolean[]

  has_nextsplit = true;
  has_previoussplit = true;
  presentpagesplit: number = 1;

  pageSize = 10;
  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;

  @ViewChild('category') matcategoryAutocomplete: MatAutocomplete;
  @ViewChild('categoryInput') categoryInput: any;


  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  isLoading = false;
  branchList: Array<branchlistss>;
  categoryList: Array<categorylistss>;
  currentpage: number = 1;
  maxDate = new Date();
  splitsearch:any={};
  isSplitAddScreen:boolean = false
  isSplitAddSummaryScreen: boolean = true

  constructor(private errorHandler:ErrorHandlerService,private notification: NotificationService, private router: Router
    , private Faservice: faservice, public Faservice2: Fa2Service, 
    private datePipe: DatePipe, private fb: FormBuilder,private shareservice: faShareService, private spinner:NgxSpinnerService) { }
  ngOnInit(): void {
    this.splitSearchForm = this.fb.group({
      assetdetails_id: [''],
      asset_value: [""],
      capdate: [''],
      assetcat_id: [''],
      branch_id: '',
    })


    this.splitSearchForm.get('branch_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.Faservice.getassetbranchdata(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.branchList = datas;
    })


    this.splitSearchForm.get('assetcat_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.Faservice.getassetCatdata(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.categoryList = datas;
    });
    this.serviceCallsplitSummary({},1,10);
  }
////// reset  
resetSplit() {
  this.splitSearchForm.reset('');
  this.getassetSplitsummary('reset');
  return false
}

////// summary
// assetdetails_id: [''],
// asset_value: [""],
// capdate: [''],
// assetcat_id: [''],
// branch_id: '',
serviceCallsplitSummary(searchsplit,pageno,pageSize){
  this.splitsearch={};
  
  if(this.splitSearchForm.get('assetdetails_id').value !=null && this.splitSearchForm.get('assetdetails_id').value !=''){
    this.splitsearch['assetdetails_id']=this.splitSearchForm.get('assetdetails_id').value;
  }
  if(this.splitSearchForm.get('asset_value').value !=null && this.splitSearchForm.get('asset_value').value !=''){
    this.splitsearch['asset_value']=this.splitSearchForm.get('asset_value').value;
    
  }
  if(this.splitSearchForm.get('capdate').value !=null && this.splitSearchForm.get('capdate').value !=''){
    let date:any=this.splitSearchForm.get('capdate').value;
    this.splitsearch['capdate']=this.datePipe.transform(this.splitSearchForm.get('capdate').value,'yyyy-MM-dd');
  }
  if(this.splitSearchForm.get('assetcat_id').value !=null && this.splitSearchForm.get('assetcat_id').value !=''){
    this.splitsearch['assetcat_id']=this.splitSearchForm.get('assetcat_id').value;
  }
  if(this.splitSearchForm.get('branch_id').value !=null && this.splitSearchForm.get('branch_id').value !=''){
    this.splitsearch['branch_id']=this.splitSearchForm.get('branch_id').value;
  };
  console.log(this.splitSearchForm.value);


  this.spinner.show();
  this.Faservice2.getAssetsplitAddsummarySearch(this.splitsearch,pageno,pageSize)
    .subscribe((result) => {
      console.log("asset split", result)
      this.spinner.hide();
      let datass = result['data'];
      let datapagination = result["pagination"];
      this.splitlist = datass;
      console.log("asset split", this.splitlist)
      if (this.splitlist.length >= 0) {
        this.has_nextsplit = datapagination.has_next;
        this.has_previoussplit = datapagination.has_previous;
        this.presentpagesplit = datapagination.index;
      }
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.errorHandler.errorHandler(error,'');
    }
    );
}

getassetSplitsummary(hint) {
  let searchsplit = this.splitSearchForm.value
  for (let i in searchsplit) {
    if (searchsplit[i] == null || searchsplit[i] == "" || searchsplit[i] == undefined) {
      delete searchsplit[i];
    }
  }
  if(hint == 'next'){
    this.serviceCallsplitSummary(searchsplit, this.presentpagesplit + 1, 10)
  }
  else if(hint == 'previous'){
    this.serviceCallsplitSummary(searchsplit, this.presentpagesplit - 1, 10)
  }
  else{
    this.serviceCallsplitSummary(searchsplit,1, 10)
  }

}


  spliyyView(data) {
    // this.router.navigate(['/splitmakerview' ], { skipLocationChange: true })
    this.shareservice.splitData.next(data)
    this.isSplitAddScreen = true
    this.isSplitAddSummaryScreen = false
    return data
  }

  
  SplitCreateSubmit(){
    this.isSplitAddScreen = false
    this.isSplitAddSummaryScreen = true
  }

  SplitCreateCancel(){
    this.isSplitAddScreen = false
    this.isSplitAddSummaryScreen = true
  }


  currentpagecategory: number = 1;
  has_nextcategory = true;
  has_previouscategory = true;
  autocompletecategoryScroll() {
    setTimeout(() => {
      if (
        this.matcategoryAutocomplete &&
        this.autocompleteTrigger &&
        this.matcategoryAutocomplete.panel
      ) {
        fromEvent(this.matcategoryAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcategoryAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcategoryAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcategoryAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcategoryAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbranch === true) {
                this.Faservice.getassetCatdata(this.categoryInput.nativeElement.value, this.currentpagecategory + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.categoryList = this.categoryList.concat(datas);
                    if (this.categoryList.length >= 0) {
                      this.has_nextcategory = datapagination.has_next;
                      this.has_previouscategory = datapagination.has_previous;
                      this.currentpagecategory = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


  public displayFncategory(category?: any) {
    return category ? this.categoryList.find(_ => _.id === category).subcatname : undefined;
  }

  // public displayFncategory(category?: categorylistss): string | undefined {
  //   return category ? category.subcatname : undefined;
  // }


  getCategoryFK() {
    let categorykeyvalue = '';
    this.Faservice.getassetCatdata(categorykeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryList = datas;
        console.log("categoryList", datas)
      })
  }


  /////  branch

  currentpagebranch: number = 1;
  has_nextbranch = true;
  has_previousbranch = true;
  autocompletebranchScroll() {
    setTimeout(() => {
      if (
        this.matbranchAutocomplete &&
        this.autocompleteTrigger &&
        this.matbranchAutocomplete.panel
      ) {
        fromEvent(this.matbranchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbranchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbranch === true) {
                this.Faservice.getassetbranchdata(this.branchInput.nativeElement.value, this.currentpagebranch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchList = this.branchList.concat(datas);
                    if (this.branchList.length >= 0) {
                      this.has_nextbranch = datapagination.has_next;
                      this.has_previousbranch = datapagination.has_previous;
                      this.currentpagebranch = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  public displayFnbranch (branch?: any) {
      return branch ? this.branchList.find(_ => _.id === branch).name : undefined;
    }
    //return branch ? branch.code : undefined;
  


  // public displayFnbranch(branch?: branchlistss): string | undefined {
  //   let code = branch ? branch.code : undefined;
  //   let name = branch ? branch.name : undefined;
  //   return branch ? code + "-" + name : undefined;
  //   //return branch ? branch.code : undefined;
  // }


  getbranchFK() {
    let branchkeyvalue = '';
    this.spinner.show();
    this.Faservice.getassetbranchdata(branchkeyvalue, 1)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        this.branchList = datas;
        console.log("branchList", datas)
      })
  }







}
