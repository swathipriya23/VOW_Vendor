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
import { NgxSpinnerService } from 'ngx-spinner';
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
export interface cgunamelistss {
  id: any;
  code: string;
  name: string;
}

@Component({
  selector: 'app-impairment-mapping',
  templateUrl: './impairment-mapping.component.html',
  styleUrls: ['./impairment-mapping.component.scss']
})
export class ImpairmentMappingComponent implements OnInit {
  isLoading = false;
  currentpage: number = 1;
  pageSize = 10
  ImpairCGUMapSearchForm: FormGroup;
  ImpairMasterForm: FormGroup;
  ImpairMappingForm: FormGroup;
  maker: boolean;
  checker: boolean;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;

  @ViewChild('category') matcategoryAutocomplete: MatAutocomplete;
  @ViewChild('categoryInput') categoryInput: any;

  @ViewChild('cguname') matcguAutocomplete: MatAutocomplete;
  @ViewChild('cgunameInput') cgunameInput: any;
  cguname = new FormControl();
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  branchList: Array<branchlistss>;
  categoryList: Array<categorylistss>;
  cgunameList: Array<cgunamelistss>;

  constructor(private notification: NotificationService, private router: Router
    , private Faservice: faservice, private shareservice: faShareService, private datePipe: DatePipe,
    private fb: FormBuilder, public Faservice2: Fa2Service, public activatedRoute: ActivatedRoute, private spinner:NgxSpinnerService) { }




  ngOnInit(): void {
    this.ImpairCGUMapSearchForm = this.fb.group({
      assetdetails_id: [''],
      capdate: [''],
      branch_id: '',
    })
    this.ImpairMasterForm = this.fb.group({
      name: ['']
    })
    this.ImpairMappingForm = this.fb.group({
      name: ['']
    })

    this.ImpairCGUMapSearchForm.get('branch_id').valueChanges
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



    this.ImpairMappingForm.get('name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.Faservice2.getcgunamedata(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cgunameList = datas;
      })

  }


  //////////////////////////////////////////////////////////////// Asset DATA FOR MAPPING
  AssetDataList: Array<any>
  has_nextAssetData = true;
  has_previousAssetData = true;
  presentpageAssetData: number = 1

  ////// summary
  serviceCallCGUMapSummary(searchCGUMap, pageno) {
    this.spinner.show();
    this.Faservice2.getAssetDataCGUmapSummarySearch(searchCGUMap, pageno)
      .subscribe((result) => {
        this.spinner.hide();
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.AssetDataList = datass;
        // this.checkedValues = this.AssetDataList.map(() => false);
        console.log("asset CGUMap", this.AssetDataList)
        if (this.AssetDataList.length > 0) {
          this.has_nextAssetData = datapagination.has_next;
          this.has_previousAssetData = datapagination.has_previous;
          this.presentpageAssetData = datapagination.index;
        }
        if (result) {
          this.updateWhenUsingPagination()
        }

      })
  }

  getCGUMapsummarySearch(hint) {
    let searchCGUMap = this.ImpairCGUMapSearchForm.value;
    if (searchCGUMap.capdate != "") {
      let capdatedata = searchCGUMap.capdate
      let dates = this.datePipe.transform(capdatedata, 'yyyy-MM-dd');
      searchCGUMap.capdate = dates
    }

    for (let i in searchCGUMap) {
      if (searchCGUMap[i] == null || searchCGUMap[i] == "") {
        delete searchCGUMap[i];
      }
    }
    if (hint == 'next') {
      this.serviceCallCGUMapSummary(searchCGUMap, this.presentpageAssetData + 1)
    }
    else if (hint == 'previous') {
      this.serviceCallCGUMapSummary(searchCGUMap, this.presentpageAssetData - 1)
    }
    else {
      this.serviceCallCGUMapSummary(searchCGUMap, 1)
    }

  }



  arrayForIds = []
  selectedAssetValue(data, event) {

    let assetIdPush = data.id
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
      console.log('data check', this.arrayForIds)
    }
    // this.autoCheckUpdation()
    console.log('data check', this.arrayForIds)
  }



  updateWhenUsingPagination() {
    let IdSelectedArray = this.arrayForIds

    this.AssetDataList.forEach((row, index) => {
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

  resetAssetData() {
    this.ImpairCGUMapSearchForm.reset();
    this.getCGUMapsummarySearch('');
    return false
  }



  ///////////////////////////////Map Submit

  CGUmapSubmit() {
    let SubmitData = this.ImpairMappingForm.value
    if(!SubmitData.name){ this.notification.showWarning("Please Fill CGU Name"); return false }
    if(this.arrayForIds.length == 0 ){ this.notification.showWarning("Please Select atleast one "); return false   }
    console.log("need to pass data",this.arrayForIds)
    let dataToSubmit = {
      "assetdetails_id": this.arrayForIds,
      "name": SubmitData.name
    }
    this.spinner.show();
    this.Faservice2.ImpairMappingSubmit(dataToSubmit)
      .subscribe(res => {
        this.spinner.hide();
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("[INVALID_DATA! ...]")
          this.spinner.hide();
        }
        else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.spinner.hide();
          this.notification.showWarning("Duplicate Data! ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.spinner.hide();
          this.notification.showError("INVALID_DATA!...")
        }
        else {
          this.notification.showSuccess("Successfully created!...")
          this.spinner.hide();
          this.onSubmit.emit();
        }
        console.log("CGU MAP Form SUBMIT", res)
        return true
      })


  }















  ///////////////////////////////Master Submit

  masterSubmit() {

    if (this.ImpairCGUMapSearchForm.value.name == "") {
      this.notification.showWarning('Add fill Name Field');
      return false;
    }
    let SubmitData = this.ImpairMasterForm.value
    this.Faservice2.ImpairMasterSubmit(SubmitData)
      .subscribe(res => {
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("[INVALID_DATA! ...]")
        }
        else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.notification.showWarning("Duplicate Data! ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
        }
        else {
          this.notification.showSuccess("Successfully created!...")
          // this.onSubmit.emit();
        }
        console.log("master Form SUBMIT", res)
        return true
      })


  }


  onCancelClick() {
    this.onCancel.emit()
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



  getbranchFK() {
    let branchkeyvalue = '';
    this.Faservice.getassetbranchdata(branchkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
        console.log("branchList", datas)
      })
  }










  /////  cgu name

  currentpagecgu: number = 1;
  has_nextcgu = true;
  has_previouscgu = true;
  autocompletecguScroll() {
    setTimeout(() => {
      if (
        this.matcguAutocomplete &&
        this.autocompleteTrigger &&
        this.matcguAutocomplete.panel
      ) {
        fromEvent(this.matcguAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcguAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcguAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcguAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcguAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcgu === true) {
                this.Faservice2.getcgunamedata(this.cgunameInput.nativeElement.value, this.currentpagecgu + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.cgunameList = this.cgunameList.concat(datas);
                    if (this.cgunameList.length >= 0) {
                      this.has_nextcgu = datapagination.has_next;
                      this.has_previouscgu = datapagination.has_previous;
                      this.currentpagecgu = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }



  public displayFncguname(cgu?: any) {
    return cgu ? this.cgunameList.find(_ => _.name === cgu).name : undefined;
  }



  getCGUNameFK() {
    let keyvalue = '';
    this.Faservice2.getcgunamedata(keyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cgunameList = datas;
        console.log("cgunameList", datas)
      })
  }











}
