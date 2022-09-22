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
  selector: 'app-impairment-summary',
  templateUrl: './impairment-summary.component.html',
  styleUrls: ['./impairment-summary.component.scss']
})
export class ImpairmentSummaryComponent implements OnInit {
  isLoading = false;
  currentpage: number = 1;
  pageSize = 10
  ImpairSearchForm: FormGroup;
  ImpairCheckerSearchForm: FormGroup;
  ImpairCGUMapSearchForm: FormGroup;
  ImpairMasterForm: FormGroup;
  maker: boolean;
  checker: boolean;


  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;

  @ViewChild('category') matcategoryAutocomplete: MatAutocomplete;
  @ViewChild('categoryInput') categoryInput: any;


  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  branchList: Array<branchlistss>;
  categoryList: Array<categorylistss>;

  constructor(private notification: NotificationService, private router: Router
    , private Faservice: faservice, private shareservice: faShareService, private datePipe: DatePipe,
    private fb: FormBuilder, public Faservice2: Fa2Service, public activatedRoute: ActivatedRoute, private spinner:NgxSpinnerService) { }


  ngOnInit(): void {

    this.ImpairSearchForm = this.fb.group({
      name: [''],
      cgu_value: [""]
    })

    this.ImpairCheckerSearchForm = this.fb.group({
      name: [''],
      cgu_value: [""]
    })



    // this.ImpairCheckerSearchForm.get('branch_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.Faservice.getassetbranchdata(value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.branchList = datas;
    //   })


    // this.ImpairCheckerSearchForm.get('assetcat_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.Faservice.getassetCatdata(value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.categoryList = datas;
    //   })



    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      let SummaryCall: any = params.get('data')
      console.log("summary call", SummaryCall)
      if (SummaryCall == 'maker') {
        this.maker = true
        this.checker = false;
        this.getAssetImpairsummary();
      }
      if (SummaryCall == 'checker') {
        this.maker = false
        this.checker = true;
        this.getAssetImpairApprovalsummary()
      }


    })

  }












  ////////////////////////////////////////////////////////////////////Impair Summary
  ImpairMakerlist: Array<any>
  has_nextImpair = true;
  has_previousImpair = true;
  presentpageImpair: number = 1

  getAssetImpairsummary(pageNumber = 1, pageSize = 10) {
    this.spinner.show();
    this.Faservice2.getAssetImpairsummary(pageNumber, pageSize)
      .subscribe((result) => {
        console.log("Asset Impair", result)
        this.spinner.hide();
        let datas = result['data'];
        let datapagination = result["pagination"];
        this.ImpairMakerlist = datas;
        if (this.ImpairMakerlist.length > 0) {
          this.has_nextImpair = datapagination.has_next;
          this.has_previousImpair = datapagination.has_previous;
          this.presentpageImpair = datapagination.index;
        }
      })
  }

  ImpairnextClick() {
    if (this.has_nextImpair == true) {
      this.getAssetImpairsummary(this.presentpageImpair + 1, 10)
    }
  }

  ImpairpreviousClick() {
    if (this.has_previousImpair == true) {
      this.getAssetImpairsummary(this.presentpageImpair - 1, 10)
    }
  }

  resetImpair() {
    this.ImpairSearchForm.reset();
    this.getAssetImpairsummary();
    return false
  }

  getImpairsummarySearch() {
    let searchImpair = this.ImpairSearchForm.value;


    for (let i in searchImpair) {
      if (searchImpair[i] == null || searchImpair[i] == "") {
        delete searchImpair[i];
      }
    }
    this.spinner.show();
    this.Faservice2.getImpairsummarySearch(searchImpair)
      .subscribe(result => {
        this.spinner.hide();
        this.ImpairMakerlist = result['data']
        return true
      })
  }

  barcodeData: any; ProductNameData: any; CatagoryData: any;
  CapitalizationDate: any; AssetValueData: any; BranchData: any; LocationData: any;
  ReasonData: any; StatusData: any
  getAssetImpairIdData(data) {
    let id: any = data.id
    this.Faservice2.getAssetImpairIdData(id)
      .subscribe((results) => {
        this.barcodeData = results.barcode
        this.ProductNameData = results.product_id.name
        this.CatagoryData = results.assetcatchange_id.subcatname
        this.CapitalizationDate = results.capdate
        this.AssetValueData = results.assetdetails_value
        this.BranchData = results.branch_id.name
        this.LocationData = results.assetlocation_id.name
        this.ReasonData = results.Impair_reason
        this.StatusData = results.assetdetails_status
      })
  }
  ReasonShow: any
  ReasonImpairmaker: boolean
  ReasonShowOff(data) {
    this.ReasonShow = data.Impair_reason
    this.ReasonImpairmaker = true

  }

  ReasonShowApp: any
  ReasonShowApproval: boolean
  ReasonShowOffApp(data) {
    this.ReasonShowApp = data.impair_reason
    this.ReasonShowApproval = true

  }

  ////////////////////////////////////////////////////////////////////Impair checker Summary
  ImpairApprovallist: Array<any>
  has_nextImpairApp = true;
  has_previousImpairApp = true;
  presentpageImpairApp: number = 1

  getAssetImpairApprovalsummary(pageNumber = 1, pageSize = 10) {
    this.spinner.show();
    this.Faservice2.getAssetImpairApprovalsummary(pageNumber, pageSize)
      .subscribe((result) => {
        console.log("Asset Impair Approval ", result)
        this.spinner.hide();
        let datas = result['data'];
        let datapagination = result["pagination"];
        this.ImpairApprovallist = datas;
        if (this.ImpairApprovallist.length > 0) {
          this.has_nextImpairApp = datapagination.has_next;
          this.has_previousImpairApp = datapagination.has_previous;
          this.presentpageImpairApp = datapagination.index;
        }
      })
  }

  ImpairAppnextClick() {
    if (this.has_nextImpairApp == true) {
      this.getAssetImpairApprovalsummary(this.presentpageImpairApp + 1, 10)
    }
  }

  ImpairApppreviousClick() {
    if (this.has_previousImpairApp == true) {
      this.getAssetImpairApprovalsummary(this.presentpageImpairApp - 1, 10)
    }
  }


  resetImpairApp() {
    this.ImpairCheckerSearchForm.reset('');
    this.getAssetImpairApprovalsummary();
    return false
  }

  getImpairAppsummarySearch() {
    let searchImpairApp = this.ImpairCheckerSearchForm.value;
    for (let i in searchImpairApp) {
      if (searchImpairApp[i] == null || searchImpairApp[i] == "" || searchImpairApp[i] == undefined) {
        delete searchImpairApp[i];
      }
    }
    this.spinner.show();
    this.Faservice2.getImpairApprovalsummarySearch(searchImpairApp)
      .subscribe(result => {
        this.spinner.hide();
        this.ImpairApprovallist = result['data']
        return true
      })
  }



  arrayForIds = []
  ReasonShowApprovalSubmit: boolean
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
      console.log(this.arrayForIds)
    }
    if (this.arrayForIds.length > 0) {
      this.ReasonShowApprovalSubmit = true
    }
    else {
      this.ReasonShowApprovalSubmit = false
    }
    // this.autoCheckUpdation()
  }



  updateWhenUsingPagination() {
    let IdSelectedArray = this.arrayForIds

    this.ImpairApprovallist.forEach((row, index) => {
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


  ImpairChecker(input, type) {
    let dataToChecker
    if (type == 1) {
      dataToChecker = {
        "cgu_id": this.arrayForIds,
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
        "cgu_id": this.arrayForIds,
        "reason": input,
        "action": 'REJECT'
      }
    }

    console.log("checker data", dataToChecker)
    this.spinner.show();
    this.Faservice2.ImpairCheckerSubmit(dataToChecker)
      .subscribe(result => {
        this.spinner.hide();
        if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
          this.notification.showError("Maker Not Allowed To Approve")
          this.spinner.hide();
          return false
        }
        if (result.message == 'Approved Successfully') {
          this.notification.showSuccess("Successfully Approved")
          this.spinner.hide();
          this.getAssetImpairApprovalsummary()
        }
        if (result.message == 'Rejected Successfully') {
          this.notification.showSuccess("Successfully Rejected")
          this.spinner.hide();
          this.getAssetImpairApprovalsummary()
        }
        this.ReasonShowApproval = false

        return true
      })








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
    this.Faservice.getassetbranchdata(branchkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
        console.log("branchList", datas)
      })
  }






  isImpairAdd: boolean = false

  addImpair() {
    this.isImpairAdd = true
    this.maker = false
    this.checker = false

  }

  ImpairCreateSubmit() {
    this.getAssetImpairsummary()
    this.isImpairAdd = false
    this.maker = true
    this.checker = false
  }

  ImpairCreateCancel() {
    this.isImpairAdd = false
    this.maker = true
    this.checker = false
  }


  isCGUmap: boolean = false

  addCGUMap() {
    this.isImpairAdd = false
    this.isCGUmap = true
    this.maker = false
    this.checker = false

  }

  CGUmapCreateSubmit() {
    this.isImpairAdd = false
    this.isCGUmap = false
    this.maker = true
    this.checker = false
  }

  CGUmapCreateCancel() {
    this.isImpairAdd = false
    this.isCGUmap = false
    this.maker = true
    this.checker = false
  }







}