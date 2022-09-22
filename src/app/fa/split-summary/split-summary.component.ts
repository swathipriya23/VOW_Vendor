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
  selector: 'app-split-summary',
  templateUrl: './split-summary.component.html',
  styleUrls: ['./split-summary.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class SplitSummaryComponent implements OnInit {
  isLoading = false;
  currentpage: number = 1;
  pageSize = 10
  SplitSearchForm: FormGroup;
  SplitCheckerSearchForm: FormGroup;

  maker: boolean
  checker: boolean


  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;

  @ViewChild('category') matcategoryAutocomplete: MatAutocomplete;
  @ViewChild('categoryInput') categoryInput: any;


  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  branchList: Array<branchlistss>;
  categoryList: Array<categorylistss>;

  issource: boolean=true;
  issplitlist: boolean;
  colorDta:Array<any>=['rgba(255, 99, 71, 0.5)','rgb(255, 99, 71)','hsl(13, 86%, 73%)','hsl(213, 32%, 86%)',
  'rgb(178, 228, 178)','rgba(255, 102, 114, 0.8)','rgba(255, 226, 114, 0.8)','rgba(7, 91, 236, 0.4)',
  'rgba(7, 240, 179, 0.2)','rgba(183, 226, 179, 0.2)'
];

  constructor(private errorHandler:ErrorHandlerService,private notification: NotificationService, private router: Router
    , private Faservice: faservice, private shareservice: faShareService, private datePipe: DatePipe,
    private fb: FormBuilder, public Faservice2: Fa2Service, public activatedRoute: ActivatedRoute, private spinner:NgxSpinnerService) { }


  ngOnInit(): void {
    this.Dynamic_colors();
    this.SplitSearchForm = this.fb.group({
      assetdetails_id: [''],
      asset_value: [""],
      capdate: [''],
      assetcat_id: [''],
      branch_id: '',
    })

    this.SplitCheckerSearchForm = this.fb.group({
      assetdetails_id: [''],
      asset_value: [""],
      capdate: [''],
      assetcat_id: [''],
      branch_id: '',
    })


    this.SplitSearchForm.get('branch_id').valueChanges
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


    this.SplitSearchForm.get('assetcat_id').valueChanges
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

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      let SummaryCall: any = params.get('data')
      console.log("summary call", SummaryCall)
      if (SummaryCall == 'maker') {
        this.maker = true
        this.checker = false;
        this.getAssetSplitsummary();
      }
      if (SummaryCall == 'checker') {
        this.maker = false
        this.checker = true;
        this.getAssetSplitSourcesummary()
      }


    })

  }












  ////////////////////////////////////////////////////////////////////Split Summary
  SplitMakerlist: Array<any>
  SplitSeperatelist: Array<any>
  has_nextSplit = true;
  has_previousSplit = true;
  presentpageSplit: number = 1

  getAssetSplitsummary(pageNumber = 1, pageSize = 10) {
  this.spinner.show();
    this.Faservice2.getAssetSplitsummary(pageNumber, pageSize)
      .subscribe((result) => {
        console.log("Asset Split", result);
        if(result['code']=="INVALID_DATA"){
          this.notification.showWarning("INVALID_DATA");
          this.spinner.hide();
          return false;
        }
        this.spinner.hide();
        let datas = result['data'];
        let datapagination = result["pagination"];
        this.SplitMakerlist = datas;
        if (this.SplitMakerlist.length > 0) {
          this.has_nextSplit = datapagination.has_next;
          this.has_previousSplit = datapagination.has_previous;
          this.presentpageSplit = datapagination.index;
        }
      },
      (error)=>{
        this.spinner.hide();
        this.errorHandler.errorHandler(error,'');

      }
      )
    }

  nextClickSplit() {
    if (this.has_nextSplit == true) {
      this.getAssetSplitsummary(this.presentpageSplit + 1, 10)
    }
  }

  previousClickSplit() {
    if (this.has_previousSplit == true) {
      this.getAssetSplitsummary(this.presentpageSplit - 1, 10)
    }
  }

  resetSplit() {
    this.SplitSearchForm.reset();
    this.getAssetSplitsummary();
    return false
  }

  getAssetSplitsummarySearch() {
    let searchSplit = this.SplitSearchForm.value;
    if (searchSplit.capdate != "") {
      let capdatedata = searchSplit.capdate
      let dates = this.datePipe.transform(capdatedata, 'yyyy-MM-dd');
      searchSplit.capdate = dates
    }

    for (let i in searchSplit) {
      if (searchSplit[i] === null || searchSplit[i] === "") {
        delete searchSplit[i];
      }
    }
    this.spinner.show();
    this.Faservice2.getAssetSplitsummarySearch(searchSplit)
      .subscribe(result => {
        this.spinner.hide();
        this.SplitMakerlist = result['data']
        return true;
      },
      (error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.errorHandler.errorHandler(error,'');
      }
      )
  }

  barcodeData: any; ProductNameData: any; CatagoryData: any;
  CapitalizationDate: any; AssetValueData: any; BranchData: any; LocationData: any;
  ReasonData: any; StatusData: any
  getAssetSplitIdData(data) {
    let id: any = data.new_asset_id
    this.spinner.show();
    this.Faservice2.getAssetSplitIdData(id)
      .subscribe((results) => {
        this.spinner.hide();
        this.barcodeData = results.assettran_id
        this.ProductNameData = results.product_id.name
        this.CatagoryData = results.assetcatchange_id.subcatname
        this.CapitalizationDate = results.capdate
        this.AssetValueData = results.assetdetails_value
        this.BranchData = results.branch_id.name
        this.LocationData = results.assetlocation_id.name
        this.ReasonData = results.split_reason
        this.StatusData = results.assetdetails_status
      },
      (error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.errorHandler.errorHandler(error,'');
      }
      );
  }
  ReasonShow: any
  ReasonSplitmaker: boolean
  ReasonShowOff(data) {
    this.ReasonShow = data.split_reason
    this.ReasonSplitmaker = true

  }

  ReasonShowApp: any
  ReasonShowApproval: boolean
  ReasonShowOffApp(data) {
    this.ReasonShowApp = data.split_reason
    this.ReasonShowApproval = true

  }
  
  ////////////////////////////////////////////////////////////////////Split checker Summary
  SplitApprovallist: Array<any>
  has_nextSplitApp = true;
  has_previousSplitApp = true;
  presentpageSplitApp: number = 1
  NonSplitListData = []
  getAssetSplitSourcesummary(pageNumber = 1, pageSize = 10) {
    this.spinner.show();
    this.Faservice2.getAssetSplitSourcesummary(pageNumber, pageSize)
      .subscribe((result) => {
        console.log("Asset Split Approval ", result)
        this.spinner.hide();
        let datas = result['data'];
        this.SplitApprovallist = datas;
        let datapagination = result["pagination"];
        let datasplit = result['asset_split'];
        this.SplitSeperatelist = datasplit
        this.NonSplitListData = []
        this.NonSplitListDataSegregation()
        if (this.SplitApprovallist.length > 0) {
          this.has_nextSplitApp = datapagination.has_next;
          this.has_previousSplitApp = datapagination.has_previous;
          this.presentpageSplitApp = datapagination.index;
        }
      },
      (error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.errorHandler.errorHandler(error,'');
      }
      );
      
    }
  
    NonSplitListDataSegregation(){
      let dataSplitArray: any = this.SplitSeperatelist
      for ( let data in dataSplitArray  ){
        if( !dataSplitArray[data].color_id  ){
          continue
         }
         else{
          this.NonSplitListData.push(dataSplitArray[data])
         }
      }
      console.log("data nonsplitlistData", this.NonSplitListData)
    }

  SplitAppnextClick() {
    if (this.has_nextSplitApp == true) {
      this.getAssetSplitSourcesummary(this.presentpageSplitApp + 1, 10)
    }
  }

  SplitApppreviousClick() {
    if (this.has_previousSplitApp == true) {
      this.getAssetSplitSourcesummary(this.presentpageSplitApp - 1, 10)
    }
  }


  resetSplitApp() {
    this.SplitCheckerSearchForm.reset('');
    this.getAssetSplitSourcesummary();
    return false
  }

  getAssetSplitSourcesummarySearch() {
    let searchSplitApp = this.SplitCheckerSearchForm.value;
    if (searchSplitApp.capdate != "") {
      let capdatedata = searchSplitApp.capdate
      let dates = this.datePipe.transform(capdatedata, 'yyyy-MM-dd');
      searchSplitApp.capdate = dates
    }
    for (let i in searchSplitApp) {
      if (searchSplitApp[i] == null || searchSplitApp[i] == "" || searchSplitApp[i] == undefined) {
        delete searchSplitApp[i];
      }
    }
    this.spinner.show();
    this.Faservice2.getAssetSplitSourcesummarySearch(searchSplitApp)
      .subscribe(result => {
        this.spinner.hide();
        let datas = result['data'];
        this.SplitApprovallist = datas;
        let datasplit = result['asset_split'];
        this.SplitSeperatelist = datasplit
        this.NonSplitListData = []
        this.NonSplitListDataSegregation()
        return true;
      },
      (error:HttpErrorResponse)=>{
        this.errorHandler.errorHandler(error,'');
      }
      );
  }

  source() {
    this.issource = true
    this.issplitlist = false
  }

  split() {
    this.issplitlist = true;
    this.issource = false;
  }

  arrayForIds = []
  ReasonShowApprovalSubmit: boolean
  selectedAssetValue(data, event) {

    let assetIdPush = data.split_id;
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

    this.SplitApprovallist.forEach((row, index) => {
      IdSelectedArray.forEach((rowarray, index) => {
        if (rowarray == row.id) {
          console.log("1", rowarray)
          console.log("2", row.id)
          row.checkbox = true
        }
      })
    })
    // this.autoCheckUpdation()
  }


  SplitChecker(input, type) {
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
    this.Faservice2.SplitCheckerSubmit(dataToChecker)
      .subscribe(result => {
        if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
          this.spinner.hide();
          this.notification.showError("Maker Not Allowed To Approve")
          return false
        } 
        if(result.message == 'Approved Successfully'){
          this.spinner.hide();
          this.notification.showSuccess("Successfully Approved")
          this.getAssetSplitSourcesummary()
        }
        if(result.message == 'Rejected Successfully'){
          this.spinner.hide();
          this.notification.showSuccess("Successfully Rejected")
          this.getAssetSplitSourcesummary()
        }

        return true;
      },
      (error)=>{
        this.spinner.hide();
        this.errorHandler.errorHandler(error,'');
      }
      )








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



  public displayFnbranch(branch?: any) {
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






  isSplitAdd: boolean = false

  addSplit() {
    this.isSplitAdd = true
    this.maker = false
    this.checker = false

  }

  SplitCreateSubmit() {
    this.getAssetSplitsummary()
    this.isSplitAdd = false
    this.maker = true
    this.checker = false
  }

  SplitCreateCancel() {
    this.isSplitAdd = false
    this.maker = true
    this.checker = false
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