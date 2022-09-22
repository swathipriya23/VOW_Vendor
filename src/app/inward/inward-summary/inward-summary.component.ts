import { Component, OnInit } from '@angular/core';
import { DataService } from '../inward.service'
import { Router } from '@angular/router'
import { ShareService } from '../share.service'
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { ViewChild } from '@angular/core';
import { takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { NotificationService } from '../notification.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorExceptionService } from '../error-exception.service';
import { SharedService } from '../../service/shared.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
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
export interface channelListss {
  id: any;
  name: string;
}
export interface courierListss {
  id: any;
  name: string;
}
export interface branchlistss {
  id: any;
  code: string;
  name: string;
}
@Component({
  selector: 'app-inward-summary',
  templateUrl: './inward-summary.component.html',
  styleUrls: ['./inward-summary.component.css'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
})
export class InwardSummaryComponent implements OnInit {

  InwardMenuList: any
  urls: string;
  urlinwardSummary;
  urlinwarddetailsSummary;
  isinwardsummary: boolean
  isinwarddetailsummary: boolean
  ismakerCheckerButton: boolean;
  roleValues: string;
  addFormBtn: any;
  isinwardAdd: boolean;
  isinwarddetail: boolean;

  InwardDetailSummarySearchForm: FormGroup
  inwardSummaryList: Array<any>
  InwardDetailSummaryList: any
  InwardsummarySearchForm: FormGroup
  has_next = true;
  has_previous = true;
  has_nextdet = true;
  has_previousdet = true;
  currentpage: number = 1;
  currentpagedet: number = 1;
  isLoading: boolean
  ChannelList: any
  CourierList: any
  branchList: Array<branchlistss>;
  pageSize = 10

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild('Channel') matChannelAutocomplete: MatAutocomplete;
  @ViewChild('channelInput') channelInput: any;

  @ViewChild('Courier') matCourierAutocomplete: MatAutocomplete;
  @ViewChild('CourierInput') CourierInput: any;

  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;

  constructor(private dataService: DataService, private MainshareService: SharedService, private router: Router, private shareService: ShareService, private fb: FormBuilder, private datePipe: DatePipe,
    private notification: NotificationService, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorExceptionService) { }

  ngOnInit(): void {

    let datas = this.MainshareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "Inward") {
        this.InwardMenuList = subModule;
        console.log("InwardMenuList", this.InwardMenuList)
      }
    })

    this.InwardsummarySearchForm = this.fb.group({
      fromdate: [''],
      todate: [''],
      channel_id: [''],
      courier_id: [''],
      awb_no: [''],
      inward_no: '',	
      docnumber: ''
    })

    this.InwardDetailSummarySearchForm = this.fb.group({
      fromdate: [''],
      todate: [''],
      channel_id: [''],
      branch_id: [''],
      inward_no: '',	
      docnumber: ''
    })





    this.InwardsummarySearchForm.get('courier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getCourierFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.CourierList = datas;

      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


    


    this.InwardDetailSummarySearchForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getbranchFK(value, 1)
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
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    this.getChannelFK();
    this.getCourierFK();
    this.getbranchFK();
  }



  subModuleData(data) {
    this.urls = data.url;
    this.urlinwardSummary = "/inwardsummary";
    this.urlinwarddetailsSummary = "/inwarddetail";

    this.isinwardsummary = this.urlinwardSummary === this.urls ? true : false;
    this.isinwarddetailsummary = this.urlinwarddetailsSummary === this.urls ? true : false;
    this.roleValues = data.role[0].name;
    this.addFormBtn = data.name;

    if (this.roleValues === "Maker") {
      this.ismakerCheckerButton = true;
    } else if (this.roleValues === "Checker") {
      this.ismakerCheckerButton = false;
    }

    if (this.isinwardsummary) {
      this.isinwardsummary = true;
      this.isinwarddetailsummary = false;
      this.ismakerCheckerButton = true;

      this.isinwardAdd = false;
      this.isinwarddetail = false;
      this.getInwardsummary('');
    } else if (this.isinwarddetailsummary) {
      this.isinwardsummary = false;
      this.isinwarddetailsummary = true;
      this.ismakerCheckerButton = false;

      this.isinwardAdd = false;
      this.isinwarddetail = false;
      this.getInwardDetailsummary('');
    }

  }


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Inward Summary

  ////// summary
  serviceCallInwardSummary(searchInwardSummary, pageno, pageSize) {
    this.dataService.getInwardSummarySearch(searchInwardSummary, pageno)
      .subscribe((result) => {
        console.log(" InwardSummary", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.inwardSummaryList = datass;
        console.log(" serviceCallInwardSummary", this.inwardSummaryList)
        if (this.inwardSummaryList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  getInwardsummary(hint) {
    let searchInward = this.InwardsummarySearchForm.value
    if (searchInward.fromdate !== '' && searchInward.todate === '') {
      this.notification.showError("Please enter 'To date' ")
      return false
    }
    else if (searchInward.todate !== '' && searchInward.fromdate === '') {
      this.notification.showError("Please enter 'From date' ")
      return false
    }
    if (searchInward.fromdate != '' || searchInward.fromdate != null || searchInward.fromdate != undefined ) {	
      searchInward.fromdate = this.datePipe.transform(searchInward.fromdate, 'yyyy-MM-dd')	
      searchInward.todate = this.datePipe.transform(searchInward.todate, 'yyyy-MM-dd')	
    }
    for (let i in searchInward) {
      if (searchInward[i] === null || searchInward[i] === "") {
        delete searchInward[i];
      }
    }
    console.log("search inward data", searchInward)

    if (hint == 'next') {
      this.serviceCallInwardSummary(searchInward, this.currentpage + 1, 10)
    }
    else if (hint == 'previous') {
      this.serviceCallInwardSummary(searchInward, this.currentpage - 1, 10)
    }
    else {
      this.serviceCallInwardSummary(searchInward, 1, 10)
    }

  }

  inwardRoute() {
    let dataToShare = ''
    this.shareService.inwardData.next(dataToShare)
    // this.router.navigate(['inward/inwardForm'])
    this.isinwardsummary = false;
    this.isinwarddetailsummary = false;
    this.isinwardAdd = true;
    this.isinwarddetail = false;
    return dataToShare
  }


  resetInward() {
    this.InwardsummarySearchForm.reset()
    this.getInwardsummary('');
  }


  editInwardMaker(dataToShare) {
    this.shareService.inwardData.next(dataToShare)
    // this.router.navigate(['inward/inwardForm'])
    this.isinwardsummary = false;
    this.isinwarddetailsummary = false;
    this.isinwardAdd = true;
    this.isinwarddetail = false;
    return dataToShare
  }


  inwardCreateEditSubmit() {
    this.getInwardsummary('')
    this.isinwardsummary = true;
    this.isinwarddetailsummary = false;

    this.isinwardAdd = false
    this.isinwarddetail = false
  }

  inwardCreateEditCancel() {
    this.isinwardAdd = false;
    this.isinwarddetail = false;

    this.isinwardsummary = true;
    this.isinwarddetailsummary = false;
  }

  resetInwardDetail() {
    this.InwardDetailSummarySearchForm.controls['fromdate'].reset("")
    this.InwardDetailSummarySearchForm.controls['todate'].reset("")
    this.InwardDetailSummarySearchForm.controls['channel_id'].reset("")
    this.InwardDetailSummarySearchForm.controls['branch_id'].reset("")
    this.InwardDetailSummarySearchForm.controls['inward_no'].reset("")	
    this.InwardDetailSummarySearchForm.controls['docnumber'].reset("")
    this.getInwardDetailsummary('')
  }

  ////// summary detail
  serviceCallInwardDetailSummary(searchInwardDetail, pageno, pageSize) {
    this.dataService.getInwardDetailsearch(searchInwardDetail, pageno)
      .subscribe((result) => {
        console.log(" InwardDetailSummaryList full list", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.InwardDetailSummaryList = datass;
        console.log(" InwardDetailSummaryList", this.InwardDetailSummaryList)
        if (this.InwardDetailSummaryList.length > 0) {
          this.has_nextdet = datapagination.has_next;
          this.has_previousdet = datapagination.has_previous;
          this.currentpagedet = datapagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  getInwardDetailsummary(hint) {
    let searchInwardDetail = this.InwardDetailSummarySearchForm.value

    if (searchInwardDetail.fromdate !== '' && searchInwardDetail.todate === '') {
      this.notification.showError("Please enter 'To date' ")
      return false
    }
    else if (searchInwardDetail.todate !== '' && searchInwardDetail.fromdate === '') {
      this.notification.showError("Please enter 'From date' ")
      return false
    }

    if(searchInwardDetail['branch_id']){
      searchInwardDetail['branch_id']=searchInwardDetail['branch_id']['id']  
    }
    if (searchInwardDetail.fromdate != '' || searchInwardDetail.fromdate != null || searchInwardDetail.fromdate != undefined ) {	
      searchInwardDetail.fromdate = this.datePipe.transform(searchInwardDetail.fromdate, 'yyyy-MM-dd')	
      searchInwardDetail.todate = this.datePipe.transform(searchInwardDetail.todate, 'yyyy-MM-dd')
    }

    for (let i in searchInwardDetail) {
      if (searchInwardDetail[i] === null || searchInwardDetail[i] === "") {
        delete searchInwardDetail[i];
      }
      
    }

    if (hint == 'next') {
      this.serviceCallInwardDetailSummary(searchInwardDetail, this.currentpagedet + 1, 10)
    }
    else if (hint == 'previous') {
      this.serviceCallInwardDetailSummary(searchInwardDetail, this.currentpagedet - 1, 10)
    }
    else {
      this.serviceCallInwardDetailSummary(searchInwardDetail, 1, 10)
    }

  }


  detailView(data) {
    data = this.shareService.inwardDetailViews.next(data)
    // this.router.navigateByUrl("inward/inwardDetailView", { skipLocationChange: true });
    this.isinwardsummary = false;
    this.isinwarddetailsummary = false;
    this.isinwardAdd = false;
    this.isinwarddetail = true;
  }

  InwardDetailCancel() {
    this.isinwardAdd = false;
    this.isinwarddetail = false;

    this.isinwardsummary = false;
    this.isinwarddetailsummary = true;
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////GEt and Auto completes

  getChannelFK() {
    this.dataService.getChannelFKdd("", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ChannelList = datas;
        console.log("channel list", datas)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  currentpageCourier: number = 1;
  has_nextCourier = true;
  has_previousCourier = true;
  autocompleteCourierScroll() {
    setTimeout(() => {
      if (
        this.matCourierAutocomplete &&
        this.autocompleteTrigger &&
        this.matCourierAutocomplete.panel
      ) {
        fromEvent(this.matCourierAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matCourierAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matCourierAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matCourierAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matCourierAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextCourier === true) {
                this.dataService.getCourierFKdd(this.CourierInput.nativeElement.value, this.currentpageCourier + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.CourierList = this.CourierList.concat(datas);
                    // console.log("emp", datas)
                    if (this.CourierList.length > 0) {
                      this.has_nextCourier = datapagination.has_nextCourier;
                      this.has_previousCourier = datapagination.has_previousCourier;
                      this.currentpageCourier = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }


  displayFnCourier(courier?: any) {
    return courier ? this.CourierList.find(_ => _.id == courier).name : undefined;
  }

  getCourierFK() {
    this.dataService.getCourierFKdd("", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.CourierList = datas;
        console.log("CourierList list", datas)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  //////////////////////////////////////////branch scroll

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
                this.dataService.getbranchFK(this.branchInput.nativeElement.value, this.currentpagebranch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchList = this.branchList.concat(datas);
                    if (this.branchList.length > 0) {
                      this.has_nextbranch = datapagination.has_next;
                      this.has_previousbranch = datapagination.has_previous;
                      this.currentpagebranch = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }

  public displayFnbranch(branch?: branchlistss): string | undefined {
    // let code = branch ? branch.code : undefined;	
    // let name = branch ? branch.name : undefined;	
    // return branch ? code + "-" + name : undefined;	
    return branch ? this.branchList.find(_ => _.id === branch).name : undefined;

  }

  getbranchFK() {
    this.dataService.getbranchFK('', 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
        console.log("branchList", datas)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  only_numalpha(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getChannel() {
    this.dataService.getChannel()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ChannelList = datas;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
}
