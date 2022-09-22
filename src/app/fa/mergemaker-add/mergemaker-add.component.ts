import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
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
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
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
  selector: 'app-mergemaker-add',
  templateUrl: './mergemaker-add.component.html',
  styleUrls: ['./mergemaker-add.component.scss']
})
export class MergemakerAddComponent implements OnInit {

  isLoading = false;
  currentpage: number = 1;
  pageSize = 1
  MergeSearchForm: FormGroup;
  MergeCreateForm: FormGroup;
  Mergelist: Array<any>
  MergeUpdatedlist: Array<any>
  checkedValues: boolean[]
  has_nextMerge = true;
  has_previousMerge = true;
  presentpageMerge: number = 1;

  maker: boolean
  checker: boolean


  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;

  @ViewChild('category') matcategoryAutocomplete: MatAutocomplete;
  @ViewChild('categoryInput') categoryInput: any;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  branchList: Array<branchlistss>;
  categoryList: Array<categorylistss>;

  constructor(private errorHandler:ErrorHandlerService,private notification: NotificationService, private router: Router
    , private Faservice: faservice, private shareservice: faShareService, private datePipe: DatePipe,
    private fb: FormBuilder, public Faservice2: Fa2Service, public activatedRoute: ActivatedRoute, private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.MergeSearchForm = this.fb.group({
      assetdetails_id: [''],
      asset_value: [""],
      capdate: [''],
      assetcat_id: [''],
      branch_id: '',
    })
    this.MergeCreateForm = this.fb.group({
      assetdetails_id: [],
      reason: "",
      new_asset_id: [],
      value: 0,
      date: new Date()
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
      this.getMergesummarySearch('');

  }
  resetMerge() {
    this.MergeSearchForm.reset('');
    this.getMergesummarySearch('');
    return false
  }



  ////// summary
  serviceCallMergeSummary(searchMerge, pageno) {
    this.spinner.show();
    this.Faservice2.getassetMergeAddSummarySearch(searchMerge, pageno)
      .subscribe((result) => {
        this.spinner.hide();
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.Mergelist = datass;
        console.log("asset Merge", this.Mergelist)
        if (this.Mergelist.length > 0) {
          this.has_nextMerge = datapagination.has_next;
          this.has_previousMerge = datapagination.has_previous;
          this.presentpageMerge = datapagination.index;
        }
        if (result) {
          this.updatingForMerge();
        }

      },
      (error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.errorHandler.errorHandler(error,'');
      }
      );
  }

  getMergesummarySearch(hint) {
    let searchMerge = this.MergeSearchForm.value;
    if (searchMerge.capdate != "") {
      let capdatedata = searchMerge.capdate
      let dates = this.datePipe.transform(capdatedata, 'yyyy-MM-dd');
      searchMerge.capdate = dates
    }

    for (let i in searchMerge) {
      if (searchMerge[i] == null || searchMerge[i] == "") {
        delete searchMerge[i];
      }
    }
    if (hint == 'next') {
      this.serviceCallMergeSummary(searchMerge, this.presentpageMerge + 1)
    }
    else if (hint == 'previous') {
      this.serviceCallMergeSummary(searchMerge, this.presentpageMerge - 1)
    }
    else {
      this.serviceCallMergeSummary(searchMerge, 1)
    }

  }

  /////////////////////////////////////////////////////// Drag and Drop
  done = [];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.log("event.container.data in if", event.container.data)
      console.log("event.previousIndex in if", event.previousIndex)
      console.log("event.currentIndex in if", event.currentIndex)
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      console.log("event.container.data in else", event.container.data)
      console.log("event.previousIndex in else", event.previousIndex)
      console.log("event.currentIndex in else", event.currentIndex)
    }
    // this.MergedSelectedData()
    console.log("Selected Merge List in drag function ", this.done)
  }

  //////////////////////////////////////////////////////////////// Merged Data

  MergedData = []
  MergedIDData: any
  MergedSelectedData() {
    console.log("Selected Merge List in my function ", this.done)
    let dataID = this.done.map(x => x.id)
    this.MergedIDData = dataID
  }



  UpdatedMerge = []
  updatingForMerge() {
    this.UpdatedMerge = []
    // let dataID = this.done.map(x => x.id)
    let dataID = this.done
    let dataIDMergeList = this.Mergelist
    if (dataID.length == 0) {
      this.UpdatedMerge = dataIDMergeList
    } else {
      for (let i = dataIDMergeList.length - 1; i >= 0; i--) {
        for (let j = 0; j < dataID.length; j++) {
          if (dataIDMergeList[i] && (dataIDMergeList[i].id === dataID[j].id)) {
            dataIDMergeList.splice(i, 1);
          }
        }
      }
      console.log("UpdatedMerge", dataIDMergeList)
    }

  }
  AssetIdArray: any
  BranchArray: any
  PopUpdataToShow() {
    let dataID = this.done.map(x => x.id)
    let dataDetails = this.done.map(x => x.assetdetails_id)
    let dataBranchDetails = this.done.map(x => x.branch_id.name)
    console.log("popup done", this.done)
    console.log("dataID", dataID)
    console.log("dataDetails", dataDetails)
    console.log("dataBranchDetails", dataBranchDetails)
    this.AssetIdArray = dataDetails
    this.BranchArray = dataBranchDetails
  }
  SelectedMainAsset: any; SelectedMainAssetID: any
  getIndexMainAsset(index, dataValue){ 
    let MainAssetindexData = this.done.map(x => x.id)
    console.log("Main asset Id",MainAssetindexData[index])
    this.SelectedMainAssetID = MainAssetindexData[index]
    this.SelectedMainAsset = dataValue
  }

  MergeSubmit() {
    let dataID = this.done.map(x => x.id)
    let dataDetails = this.done.map(x => x.assetdetails_id)
    if( dataID.length == 0 ) {
      this.notification.showWarning("Please Select atleast one")
      return false 
    }
    if( this.MergeCreateForm.value.reason == '' || this.MergeCreateForm.value.reason == null || this.MergeCreateForm.value.reason == undefined ) {
      this.notification.showWarning("Please fill Reason")
      return false 
    }
    if( this.MergeCreateForm.value.value == '' || this.MergeCreateForm.value.value == null || this.MergeCreateForm.value.value == undefined ) {
      this.notification.showWarning("Please fill Asset Value")
      return false 
    }
    


    this.MergeCreateForm.value.date = this.datePipe.transform(this.MergeCreateForm.value.date, 'yyyy-MM-dd');

    let dataTOSubmit = {
      "assetdetails_id": dataID,
      "reason":this.MergeCreateForm.value.reason,  
      "new_asset_id": this.MergeCreateForm.value.new_asset_id,
      "source_id": this.SelectedMainAssetID,
      "value": this.MergeCreateForm.value.value,
      "date": this.MergeCreateForm.value.date
    }
console.log(" dataTOSubmit ", dataTOSubmit)
    this.Faservice2.MergeCreate(dataTOSubmit)
    .subscribe(res => {
      if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
        this.notification.showError("[INVALID_DATA! ...]")
      }
      else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
        this.notification.showWarning("Duplicate Data! ...")
      } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
        this.notification.showError("INVALID_DATA!...")
      }
      else if (res.error === "Error" && res.description === "Please Check the Value") {
        this.notification.showError("Please Check the Value")
      }
       else {
         this.notification.showSuccess("Successfully created!...")
        this.onSubmit.emit();
       }
         console.log(" Form SUBMIT", res)
         return true
       },
       (error:HttpErrorResponse)=>{
        this.errorHandler.errorHandler(error,'');
       }
       ); 
    
  }


  onCancelClick() {
    this.onCancel.emit()
   }











  ///// category

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



  getbranchFK() {
    let branchkeyvalue = '';
    this.Faservice.getassetbranchdata(branchkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
        console.log("branchList", datas)
      })
  }
































}
