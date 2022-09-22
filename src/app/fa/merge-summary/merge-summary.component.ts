import { Component, OnInit, Inject } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { faservice } from '../fa.service';
import { faShareService } from '../share.service'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Fa2Service } from '../fa2.service';
import { ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map, first } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, from, fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../error-handler.service';
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
  selector: 'app-merge-summary',
  templateUrl: './merge-summary.component.html',
  styleUrls: ['./merge-summary.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class MergeSummaryComponent implements OnInit {
  isLoading = false;
  currentpage: number = 1;
  pageSize = 10
  MergeSearchForm: FormGroup;
  MergeCheckerSearchForm: FormGroup;

  maker: boolean
  checker: boolean


  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;

  @ViewChild('category') matcategoryAutocomplete: MatAutocomplete;
  @ViewChild('categoryInput') categoryInput: any;


  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  branchList: Array<branchlistss>;
  categoryList: Array<categorylistss>;

  constructor(private errorHandler:ErrorHandlerService,private notification: NotificationService, private router: Router
    , private Faservice: faservice, private shareservice: faShareService, private datePipe: DatePipe,
     private fb: FormBuilder, public Faservice2: Fa2Service, public activatedRoute: ActivatedRoute, private spinner:NgxSpinnerService) { }
 

  ngOnInit(): void {
    this.Dynamic_colors() 

    this.MergeSearchForm = this.fb.group({
      assetdetails_id: [''],
      asset_value: [""],
      capdate: [''],
      assetcat_id: [''],
      branch_id: '',
    })

    this.MergeCheckerSearchForm = this.fb.group({
      assetdetails_id: [''],
      asset_value: [""],
      capdate: [''],
      assetcat_id: [''],
      branch_id: '',
    })


    this.MergeSearchForm.get('branch_id').valueChanges
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


      this.MergeSearchForm.get('assetcat_id').valueChanges
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
      })

      this.activatedRoute.paramMap.subscribe((params: ParamMap)=>{
        let SummaryCall: any = params.get('data')
        console.log("summary call",SummaryCall)
        if( SummaryCall == 'maker'){
          this.maker = true
          this.checker = false;
          this.getAssetMergesummary(1,10);
        }
        if( SummaryCall == 'checker'){
          this.maker = false
          this.checker = true;
          this.getAssetMergeAppsummary()
        }
        

      })

      this.ismerge = true;
    // this.getAssetMergesummary();
    // this.getAssetMergeApprovalsummary()
  }












    ////////////////////////////////////////////////////////////////////Merge Summary
    MergeMakerlist: Array<any>
    has_nextMerge = true;
    has_previousMerge = true;
    presentpageMerge: number = 1
  
    getAssetMergesummary(pageNumber = 1, pageSize = 10) {
      this.spinner.show();
      this.Faservice2.getAssetMergesummary(pageNumber, pageSize)
        .subscribe((result) => {
          console.log("Asset Merge", result)
          this.spinner.hide();
          let datas = result['data'];
          let datapagination = result["pagination"];
          this.MergeMakerlist = datas;
          if (this.MergeMakerlist.length > 0) {
            this.has_nextMerge = datapagination.has_next;
            this.has_previousMerge = datapagination.has_previous;
            this.presentpageMerge = datapagination.index;
          }
        },
        (error:HttpErrorResponse)=>{
          this.errorHandler.errorHandler(error,'');
        }
        );
    }
  
    MergenextClick() {
      if (this.has_nextMerge == true) {
        this.getAssetMergesummary(this.presentpageMerge + 1, 10)
      }
    }
  
    MergepreviousClick() {
      if (this.has_previousMerge == true) {
        this.getAssetMergesummary(this.presentpageMerge - 1, 10)
      }
    }
  
    resetMerge() {
      this.MergeSearchForm.reset();
      this.getAssetMergesummary();
      return false
    }
  
    getMergesummarySearch() {
      let searchMerge = this.MergeSearchForm.value;
      if( searchMerge.capdate != ""){
        let capdatedata = searchMerge.capdate 
        let dates = this.datePipe.transform(capdatedata, 'yyyy-MM-dd');
        searchMerge.capdate = dates
      }
      
      for (let i in searchMerge) {
        if (searchMerge[i] === null || searchMerge[i] === "") {
          delete searchMerge[i];
        }
      }
      this.Faservice2.getMergesummarySearch(searchMerge)
        .subscribe(result => {
          this.MergeMakerlist = result['data']
          return true;
        },
        (error:HttpErrorResponse)=>{
          this.errorHandler.errorHandler(error,'');
        }
        );
    }
  
    barcodeData:any;  ProductNameData: any;   CatagoryData:any;
    CapitalizationDate: any;  AssetValueData:any;  BranchData:any;  LocationData: any;
    ReasonData: any;  StatusData:any
    getAssetMergeIdData(data){
      let id:any = data.id
      this.spinner.show();
      this.Faservice2.getAssetMergeIdData(id)
        .subscribe((results) => {
          this.spinner.hide();
          this.barcodeData = results.barcode
          this.ProductNameData = results.product_id.name
          this.CatagoryData = results.assetcatchange_id.subcatname
          this.CapitalizationDate = results.capdate
          this.AssetValueData = results.assetdetails_value
          this.BranchData = results.branch_id.name
          this.LocationData = results.assetlocation_id.name
          this.ReasonData = results.merge_reason
          this.StatusData = results.assetdetails_status
        },
        (error:HttpErrorResponse)=>{
          this.spinner.hide();
          this.errorHandler.errorHandler(error,'');
        }
        );
    }
    ReasonShow:any
    ReasonMergemaker: boolean
      ReasonShowOff(data){
        this.ReasonShow = data.merge_reason
        this.ReasonMergemaker = true
    
      }
    
      ReasonShowApp:any
      ReasonShowApproval: boolean
      ReasonShowOffApp(data){
        this.ReasonShowApp = data.merge_reason
        this.ReasonShowApproval = true
    
      }  
  
    ////////////////////////////////////////////////////////////////////Merge checker Summary
    MergeApprovallist: Array<any>
    has_nextMergeApp = true;
    has_previousMergeApp = true;
    presentpageMergeApp: number = 1
    MergeSeperatelist : Array<any>
    NonMergeListData = []
    getAssetMergeAppsummary(pageNumber = 1, pageSize = 10) {
      this.spinner.show();
      this.Faservice2.getAssetMergeAppsummary(pageNumber, pageSize)
        .subscribe((result) => {
          console.log("Asset Merge Approval ", result)
          this.spinner.hide();
          let datas = result['data'];
          this.MergeApprovallist = datas;
          let datapagination = result["pagination"];
          let dataMerge = result['asset_merge'];
          this.MergeSeperatelist = dataMerge
          this.NonMergeListData = []
          this.NonMergeListDataSegregation()
          if (this.MergeApprovallist.length > 0) {
            this.has_nextMergeApp = datapagination.has_next;
            this.has_previousMergeApp = datapagination.has_previous;
            this.presentpageMergeApp = datapagination.index;
          }
        },
        (error:HttpErrorResponse)=>{
          this.spinner.hide();
          this.errorHandler.errorHandler(error,'');
        }
        );
        return true;
      }
    
      NonMergeListDataSegregation(){
        let dataMergeArray: any = this.MergeSeperatelist
        for ( let data in dataMergeArray  ){
          if( !dataMergeArray[data].color_id  ){
            continue
           }
           else{
            this.NonMergeListData.push(dataMergeArray[data])
           }
        }
        console.log("data nonMergelistData", this.NonMergeListData)
      }
  
      MergeAppnextClick() {
      if (this.has_nextMergeApp == true) {
        this.getAssetMergeAppsummary(this.presentpageMergeApp + 1, 10)
      }
    }
  
    MergeApppreviousClick() {
      if (this.has_previousMergeApp == true) {
        this.getAssetMergesummary(this.presentpageMergeApp - 1, 10)
      }
    }
  
  
    resetMergeApp() {
      this.MergeCheckerSearchForm.reset('');
      this.getAssetMergeAppsummary();
      this.getAssetMergesummary();
      // this.getAssetMergeAppsummarySearch();
      return false
    }
  
    getAssetMergeAppsummarySearch() {
      let searchMergeApp = this.MergeCheckerSearchForm.value;
      if (searchMergeApp.capdate != "") {
        let capdatedata = searchMergeApp.capdate
        let dates = this.datePipe.transform(capdatedata, 'yyyy-MM-dd');
        searchMergeApp.capdate = dates
      }
      for (let i in searchMergeApp) {
        if (searchMergeApp[i] == null || searchMergeApp[i] == "" || searchMergeApp[i] == undefined) {
          delete searchMergeApp[i];
        }
      }
      this.spinner.show();
      this.Faservice2.getAssetMergeAppsummarySearch(searchMergeApp)
        .subscribe(result => {
          this.spinner.hide();
          let datas = result['data'];
          this.MergeApprovallist = datas;
          let dataMerge = result['asset_merge'];
          this.MergeSeperatelist = dataMerge
          this.NonMergeListData = []
          this.NonMergeListDataSegregation()
          return true
        },
        (error:HttpErrorResponse)=>{
          this.spinner.hide();
          this.errorHandler.errorHandler(error,'');
        }
        );
    }
  
  
    arrayForIds = []
    ReasonShowApprovalSubmit: boolean
    selectedAssetValue(data, event) {
  
      let assetIdPush = data.assetdetailsgid
      console.log(assetIdPush)
      if (event.target.checked) {
        this.arrayForIds.push(assetIdPush)
      }
      else {
        let idarray = this.arrayForIds
        for (let id in idarray) {
  
          if (idarray[id] == assetIdPush) {
            console.log("idarray[id] ", idarray[id])
            console.log("assetIdPush", assetIdPush)
  
            let idAsNumber = Number(id)
            console.log("idAsNumber", idAsNumber)
            this.arrayForIds.splice(idAsNumber, 1)
          }
        }
        console.log(this.arrayForIds)
      }
      if (this.arrayForIds.length > 0) {
        this.ReasonShowApprovalSubmit = true
      }
      else {
        this.ReasonShowApprovalSubmit = false
      }
      // this.autoCheckUpdation()
      console.log(this.arrayForIds)
    }
  
  
  
    updateWhenUsingPagination() {
      let IdSelectedArray = this.arrayForIds
  
      this.MergeApprovallist.forEach((row, index) => {
        IdSelectedArray.forEach((rowarray, index) => {
          if (rowarray == row.assetdetailsgid) {
            console.log("1", rowarray)
            console.log("2", row.assetdetailsgid)
            row.checkbox = true
          }
        })
      })
      // this.autoCheckUpdation()
    }
  
  
    MergeChecker(input, type) {
      let dataToChecker
      if (type == 1) {
        dataToChecker = {
          "assetdetails_id": this.arrayForIds,
          "reason": "",
          "action": 'APPROVE'
        }
  
      }
      if (type == 3) {
        if (input == '' || input == null || input == undefined) {
          this.notification.showWarning('Please Fill Remarks While Reject')
          return false
        }
        dataToChecker = {
          "assetdetails_id": this.arrayForIds,
          "reason": input,
          "action": 'REJECT'
        }
      }
      this.spinner.show();
      this.Faservice2.MergeCheckerSubmit(dataToChecker)
        .subscribe(result => {
          if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
            this.spinner.hide();
            this.notification.showError("Maker Not Allowed To Approve")
            return false
          } else {
            this.getAssetMergeAppsummary()
            this.spinner.hide();
            this.notification.showSuccess("Successfully Updated..")
  
            console.log("Approved", result)
          }
  
          return true;
        },
        (error:HttpErrorResponse)=>{
          this.spinner.hide();
          this.errorHandler.errorHandler(error,'');
        }
        );
  
  
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
  
  
    getbranchFK() {
      let branchkeyvalue = '';
      this.Faservice.getassetbranchdata(branchkeyvalue, 1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchList = datas;
          console.log("branchList", datas)
        })
    }
  
  

    isMergeAdd: boolean = false

    addMerge(){
      this.isMergeAdd = true
      this.maker = false
      this.checker = false
      
    }

    MergeCreateSubmit(){
      this.getAssetMergesummary()
      this.isMergeAdd = false
      this.maker = true
      this.checker = false
    }

    MergeCreateCancel(){
      this.isMergeAdd = false
      this.maker = true
      this.checker = false
    }


    isAsset:boolean 
    ismerge: boolean

    AssetTab() {
      this.isAsset = true
      this.ismerge = false
    }
  
    mergeTab() {
      this.ismerge = true;
      this.isAsset = false;
    }


    colorsData = [];
    Dynamic_colors() {
      for (let i = 1; i < 200; i++) {
        let rColor = Math.floor(Math.random() * 255);
        let gColor = Math.floor(Math.random() * 255);
        let bColor = Math.floor(Math.random() * 255);
        let rgbColor = 'rgb(' + rColor + ',' + gColor + ',' + bColor + ')';
        this.colorsData.push(rgbColor);
      }
      console.log('', this.colorsData);
    }

  

}
