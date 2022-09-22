import { Component, ComponentFactoryResolver, OnInit, QueryList, ViewChildren, ViewChild, ViewContainerRef, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/service/shared.service';
import { ShareService } from 'src/app/ta/share.service';
import { TaService } from "../ta.service";
import { NotificationService } from '../notification.service'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { TourmakerSummaryComponent } from '../tourmaker-summary/tourmaker-summary.component'
import { TourapprovalSummaryComponent } from '../tourapproval-summary/tourapproval-summary.component'
import { AdvancemakerSummaryComponent } from '../advancemaker-summary/advancemaker-summary.component'
import { AdvanceapprovalSummaryComponent } from '../advanceapproval-summary/advanceapproval-summary.component'
import { ExpensemakerSummaryComponent } from '../expensemaker-summary/expensemaker-summary.component'
import { ExpenseapprovalSummaryComponent } from '../expenseapproval-summary/expenseapproval-summary.component'
import { CancelmakerSummaryComponent } from '../cancelmaker-summary/cancelmaker-summary.component'
import { ActivatedRoute, Router } from "@angular/router";
import { CancelapprovalSummaryComponent } from '../cancelapproval-summary/cancelapproval-summary.component'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Observable, fromEvent } from 'rxjs';
import { filter, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { AssignApproverComponent } from '../assign-approver/assign-approver.component';
import { TaRecoveryComponent } from '../ta-recovery/ta-recovery.component';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe, formatDate } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { E } from '@angular/cdk/keycodes';
import { flatten } from '@angular/compiler';
import { ReportTourDetailComponent } from '../report-tour-detail/report-tour-detail.component';
import { ChatComponent } from '../chat/chat.component';
import { AlltoursummaryComponent } from '../alltoursummary/alltoursummary.component';
import { DateRelaxationMasterComponent } from '../date-relaxation-master/date-relaxation-master.component';


export interface controllingOffice {
  id: string;
  name: string;
  code: string;
}

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy, EEE', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

@Component({
  selector: 'app-ta-transaction-summary',
  templateUrl: './ta-transaction-summary.component.html',
  styleUrls: ['./ta-transaction-summary.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,

  ]

})

export class TaTransactionSummaryComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  @ViewChild('tourmaker') tourmakecomp: TourmakerSummaryComponent;
  @ViewChild('tourchecker') tourcheckercomp: TourapprovalSummaryComponent;
  @ViewChild('expmaker') expmakercomp: ExpensemakerSummaryComponent;
  @ViewChild('expchecker') expcheckercomp: ExpenseapprovalSummaryComponent;
  @ViewChild('tour_report') tourreportsummmary: ReportTourDetailComponent;
  @ViewChild('chat_screen') chatsummary: ChatComponent;
  @ViewChild('alltoursummary') alltoursummary: AlltoursummaryComponent;
  @ViewChild('daterelaxation') daterelaxation: DateRelaxationMasterComponent;



  @ViewChild('permitassetid') permitmatassetidauto: MatAutocomplete;
  @ViewChild('permitinputassetid') permitinputasset: any;
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger
  transactcomp: TaTransactionSummaryComponent;
  istourmakersmry: boolean
  istouraprlsmry: boolean
  isadvancemakersmry: boolean
  isadvanceaprlsmry: boolean
  isexpensemakersmry: boolean
  isexpesneaprlsmry: boolean
  iscancelmakersmry: boolean
  iscancelaprlsmry: boolean
  taonbehalfForm: FormGroup

  isonbehalfsmry: boolean = false;
  istourapprovesmry: boolean = false;
  istourreturnsmry: boolean = false;
  istourrejectsmry: boolean = false;
  istourpendingsmry: boolean = false;
  showdaterelaxation: boolean = false;

  // vendorMasterList = [
  //   { name: "eClaim Tour Maker", index: 1, component: TourmakerSummaryComponent },
  //   { name: "eClaim Tour Checker", index: 2, component: TourapprovalSummaryComponent },
  //   { name: "eClaim Advance Maker", index: 3, component: AdvancemakerSummaryComponent },
  //   { name: "eClaim Advance Checker", index: 4, component: AdvanceapprovalSummaryComponent },
  //   { name: "eClaim Expense Maker", index: 5, component: ExpensemakerSummaryComponent },
  //   { name: "eClaim Expense Checker", index: 6,component: ExpenseapprovalSummaryComponent },
  //   { name: "eclaim Tour Cancel Maker",index:7,component:CancelmakerSummaryComponent},
  //   {name: "eClaim Tour Cancel Checker",index:8,component:CancelapprovalSummaryComponent},
  //   {name: "eClaim Assign Approver",index:9,component:AssignApproverComponent},
  //   {name:"Recovery",index:10, component:TaRecoveryComponent}
  // ];

  vendorMasterList = [
    { name: "Tour", index: 11 },
    { name: 'Expense', index: 12 }
  ]
  radiocheck: any[] = [
    { value: 1, display: 'Self' },
    { value: 0, display: 'Onbehalf' }
  ]
  showradiobtn = false;
  activeItem: string;
  closeResult: string;
  activeComponent: any;
  tabs = [];
  showpopup: boolean = true;
  tourform: FormGroup;
  expenseform: FormGroup;
  touradminform: FormGroup
  onbehalf: any;
  ishidden: boolean = false;
  listBranch: Array<any>
  branchlist: Array<any>;
  statuslist: any;
  isassignapprover: boolean;
  isrecovery: boolean;
  showpage: boolean = false;
  radiovalue: any
  tourset: boolean = true;
  touradminset: boolean
  expenseset: boolean;
  date: any;
  select: Date;
  index: any;
  addbutton: boolean = false;
  istourforwardsmry: boolean;
  expensepermission: any;
  isexpmakersmry: boolean;
  has_nextid: boolean = true;
  has_presentid: number = 1;
  isexpapprovesmry: boolean;
  isexppendingsmry: boolean;
  isexpreturnsmry: boolean;
  isexprejectnsmry: boolean;
  isexprejectsmry: boolean;
  onbehalfdata: { id: number; onbehalf: string; name: string; };
  expactionlist = [];
  statusnum: any = 1;
  permittedlist: any;
  empid: any;
  requirementdata: any;
  reqstatuslist: any;
  tourreport: boolean = false;
  travel: boolean = false;
  expense: boolean = false;
  travelrole: any;
  expenserole: any;
  executed: boolean;
  admin: boolean = false;
  recentchat = false;
  alltour = false;
  showonbehalf: boolean = false;
  reqlist: any;
  travelreportdropdown: any;
  expenseroleshow: boolean = false;
  showemponbehalf: boolean = false;
  onbehalflist: any;
  navindex: any;
  navalue: number;
  tour_status: any;
  showinvoiceup: boolean;
  invoicefile=null;
  reportreqdata: any;


  constructor(private shareservice: ShareService,private notification: NotificationService,
    private componentFactoryResolver: ComponentFactoryResolver, private taservice: TaService, private SpinnerService: NgxSpinnerService,
    private modalService: NgbModal, private router: Router,
    public SharedService: SharedService, private fb: FormBuilder, private datePipe: DatePipe) { }




  branchdata: Array<controllingOffice>;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('conoffice') matofficeAutocomplete: MatAutocomplete;
  @ViewChild('touraction') mattouractionAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('expenseclick') expinput: ElementRef<HTMLElement>;
  @ViewChild('myDiv') myDiv: ElementRef<HTMLElement>;


  // @ViewChild('closebutton') closebutton; 
  today: any;
  onbehalfmodel: any;
  has_offnext = true;
  has_offprevious = true;
  offcurrentpage: number = 1;
  defaultind = null;
  isLoading = false;
  empList: any
  showdisabled = true;
  branchList: any;
  branchid: any;
  permisssionlist: any = []
  currentstatus = 1;
  currentstatusname: any = {
    index: 1,
    name: 'Created by me'
  }
  currentstate: any = { navindex: null, actindex: null };
  useraccess: any;
  tourreportform: FormGroup;
  alltourform: FormGroup
  repreq:null;
  ngOnInit(): void {
    console.log('VersionNO month year------V2072022')
    this.today = new Date()
    let userdata = this.SharedService.transactionList
    userdata.forEach(element => {
      if (element.name == 'TA e-Claim') {
        this.useraccess = element.submodule
      }
    })
    if (this.useraccess) {
      this.useraccess.forEach(element => {
        if (element.name == 'Travel') {

          this.travelrole = element.role;
        }
        else if (element.name == 'Expense') {
          this.expense = true;
          this.tabs.push({ ind: 2, index: 2, name: 'Expense' })
          this.expenserole = element.role;
        }
      });
    }
    if (this.travelrole) {
      this.travelrole.forEach(element => {
        if (element.name == 'Maker') {
          this.tabs.push({ ind: 1, index: 1, name: 'Travel' })
          this.travel = true;
          this.permisssionlist.push({
            index: 1,
            name: 'Created by me'
          },
            {
              index: 2,
              name: 'Created for others'
            })
        }
        else if (element.name == 'Checker') {

          this.tabs.push({ ind: 1, index: 1, name: 'Travel' })
          this.tabs.push({ ind: 5, index: 7, name: 'Date Relaxation' })
          this.travel = true;
          this.permisssionlist.push({
            index: 3,
            name: 'Pending for Approval'
          },
            {
              index: 4,
              name: 'Approved by me'
            },
            {
              index: 5,
              name: 'Rejected by me'
            },
            {
              index: 6,
              name: 'Returned by me'
            })
        }

        else if (element.name.toLowerCase() == 'admin') {
          this.admin = true;
          // this.travel = false;
          this.tabs.push({ ind: 3, index: 3, name: 'Admin' });
          this.tabs.push({ ind: 6, index: 4, name: 'Reports' });
          this.tabs.push({ ind: 7, index: 6, name: 'Invoice Upload' });
        }

      })
    }

    this.tabs.push({ ind: 4, index: 5, name: 'Recent Comments' });


    if (this.permisssionlist) {
      this.permisssionlist = this.permisssionlist.sort((key1, key2) => (key1.index < key2.index) ? -1 : 1);
    }
    if (this.expenserole) {
      this.executed = false;
      this.expactionlist = [];
      this.expenserole.forEach(element => {
        if (element.name == 'Maker') {
          this.expactionlist.push({
            index: 1,
            name: 'Created by me'
          },
            {
              index: 2,
              name: 'Created for others'
            })
        }
        else if ((element.name == 'Checker' || element.name.toLowerCase() == 'admin') && !this.executed) {
          this.executed = true;
          this.expactionlist.push({
            index: 3,
            name: 'Pending for Approval'
          },
            {
              index: 4,
              name: 'Approved by me'
            },
            {
              index: 5,
              name: 'Rejected by me'
            },
            {
              index: 6,
              name: 'Returned by me'
            })
        }
        if (element.name.toLowerCase() == 'admin') {
          this.expenseroleshow = true
          this.expactionlist.push({
            index: 7,
            name: 'Approved by All'
          })
        }
      })
    }
    if (this.expactionlist) {
      this.expactionlist = this.expactionlist.sort((key1, key2) => (key1.index < key2.index) ? -1 : 1);
    }
    // Unique tabs
    this.tabs = [...new Map(this.tabs.map(index => [JSON.stringify(index), index])).values()];
    if (this.tabs) {
      this.tabs = this.tabs.sort((key1, key2) => (key1.ind < key2.ind) ? -1 : 1);
    }
    this.shareservice.radiovalue.next('')
    let datas = this.SharedService.menuUrlData;
    // this.requirementstatus();

    this.statuslist = [{
      index: 1,
      name: 'PENDING'
    },
    {
      index: 2,
      name: 'APPROVED'
    },
    {
      index: 3,
      name: 'REJECTED'
    },
    {
      index: 4,
      name: 'RETURN'
    }
    ]

    this.tourform = this.fb.group({
      tourno: [''],
      requestdate: [''],
      action: 1,
      onbehalf: null,
      emponbehalf: null
    })
    this.touradminform = this.fb.group({
      tourno: [''],
      requestdate: [''],
      permittedby: [''],
      action: 2,
      booking: "0",
      booking_status: "-5",
      travel_status: 'Travel_3',
      branch: null,
      employee: null,
      empcode: null,
      reference_no: null,
    })
    this.expenseform = this.fb.group({
      tourexpno: [''],
      exprequestdate: [''],
      expaction: 1,
      permittedby: [''],
      booking: "0",
      booking_status: "-5",
      onbehalf: null,
      branch: null,
      employee: null,
      empcode: null,
      emponbehalf: null
    })

    this.tourreportform = this.fb.group({
      tourno: null,
      startdate: null,
      enddate: null,
      requirement: '1',
      reportdropdown: "Travel",
    })

    this.tourform.get('onbehalf').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.taservice.app_onbehalf(value))
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.permittedlist = datas;
      });

    this.expenseform.get('onbehalf').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.taservice.app_onbehalf(value))
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.permittedlist = datas;
      });
    this.getmakeonbehalf();
    // this.requirementstatus();
    this.requirementsdropdown();
    this.tourstatus();
  }

  tourstatus() {
    this.SpinnerService.show()
    this.taservice.tourstatusdropdown()
      .subscribe(res => {
        this.SpinnerService.hide()
        this.tour_status = res;
      })
  }
  makeronbhealfsearch(evt) {
    let val = evt.target.value;
    this.taservice.getemployeeSummary(val, 1).subscribe(result => {
      this.onbehalflist = result['data']
    })
  }

  getmakeonbehalf() {
    this.taservice.getemployeeSummary('', 1).subscribe(result => {
      console.log(result)
      this.onbehalflist = result['data']
      if (this.onbehalflist.length == 0) {
        if (this.permisssionlist.length > 0) {
          this.permisssionlist = this.permisssionlist.filter(function (element) {
            return element.index !== 2;
          })
        }
        if (this.expactionlist.length > 0) {
          this.expactionlist = this.expactionlist.filter(function (element) {
            return element.index !== 2;
          })
        }

      }

    })
  }
  permittvalue(subject) {
    return subject ? subject.full_name : undefined
  }
  empvalue(val) {
    return val ? val.employee_name : undefined
  }
  getpermitedlist() {
    this.taservice.app_onbehalf('')
      .subscribe(result => {
        this.permittedlist = result['data']
        if (this.permittedlist.length <= 0) {
          this.showonbehalf = false;

        }
        else {
          this.showonbehalf = true;
        }
      })
  }

  public displayfnbranch(conoffice?: controllingOffice): string | undefined {
    return conoffice ? "(" + conoffice.code + ") " + conoffice.name : undefined;
  }


  get conoffice() {
    return this.taonbehalfForm.value.get('branch');
  }


  brsearch(val) {
    val = val.target.value;
    this.taservice.getbranch(val).subscribe((results) => {
      let data = results['data']
      this.branchlist = data;
    })
  }

  brvalue(subject) {
    return subject ? subject.branch : undefined
  }
  datesrch() {
    let statusvalue = this.tourform.value.action
    this.enteraction(statusvalue)
  }
  onbehalfsrch() {
    let statusvalue = this.tourform.value.action
    this.enteraction(statusvalue)
  }
  dateadminsrch() {
    // let statusvalue = this.touradminform.value.action
    this.enterapproveaction()
  }
  touradminnosrch() {
    // let statusvalue = this.touradminform.value.action
    this.enterapproveaction()
  }
  tournosrch() {
    let statusvalue = this.tourform.value.action
    this.enteraction(statusvalue)
  }
  expdatesrch() {
    let statusvalue = this.expenseform.value.expaction
    this.enterexpaction(statusvalue)
  }

  exptoursrch() {
    let statusvalue = this.expenseform.value.expaction
    this.enterexpaction(statusvalue)
  }
  branchScroll() {
    setTimeout(() => {
      if (
        this.matofficeAutocomplete &&
        this.autocompleteTrigger &&
        this.matofficeAutocomplete.panel
      ) {
        fromEvent(this.matofficeAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matofficeAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matofficeAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matofficeAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matofficeAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_offnext === true) {
                this.taservice.getUsageCode(this.branchInput.nativeElement.value, this.offcurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchdata = this.branchdata.concat(datas);
                    // if (this.branchdata.length >= 0) {
                    //   this.has_offnext = datapagination.has_next;
                    //   this.has_offprevious = datapagination.has_previous;
                    //   this.offcurrentpage = datapagination.index;
                    // }
                  })
              }
            }
          });
      }
    });
  }

  //Navigation for Admin
  enterapproveaction() {
    this.shareservice.TourMakerEditId.next('')
    this.SharedService.summaryData.next('')
    let value = this.touradminform.value;
    let tourno = value.tourno;
    let date = value.requestdate
    let booking = value.booking
    let bookingsts = value.booking_status
    let branchid = value.branch
    let travel_status = value.travel_status
    let reference_no = value.reference_no
    var employee = value.employee;
    if (value.empcode) {
      employee = value.empcode;
    }
    this.shareservice.tourno.next(tourno);
    this.shareservice.requestdate.next(date);
    this.shareservice.booking.next(booking)
    this.shareservice.booking_sts.next(bookingsts)
    this.shareservice.employee.next(employee)
    this.shareservice.reference_no.next(reference_no)

    this.currentstate.actindex = booking;
    this.currentstate.reqindex = bookingsts;
    this.currentstate.actname = 'admin';
    this.currentstate.travelsts = travel_status;
    sessionStorage.setItem('pagestate', btoa(JSON.stringify(Object.assign({}, this.currentstate))))
    if (branchid) {
      this.shareservice.branchid.next(branchid.id)
    }
    else {
      this.shareservice.branchid.next(null)
    }
    this.istouraprlsmry = false;
    this.shareservice.statusvalue.next(travel_status);
    this.addbutton = false;
    this.istourmakersmry = false;
    this.istourapprovesmry = true;
    this.tourcheckercomp.ngOnInit()

  }
  //Navigation For Travel
  enteraction(index) {
    // this.permissionlist
    this.currentstate.actindex = this.permisssionlist.findIndex(x => x.index == index);
    this.currentstate.actname = 'travel';
    sessionStorage.setItem('pagestate', btoa(JSON.stringify(Object.assign({}, this.currentstate))))
    this.shareservice.TourMakerEditId.next('')
    // this.showonbehalf = false;
    this.SharedService.summaryData.next('')
    let value = this.tourform.value;
    let tourno = value.tourno;
    let date = value.requestdate;
    let onbehalf = value.onbehalf;
    let makeonbehalf = value.emponbehalf;
    this.shareservice.tourno.next(tourno);
    this.shareservice.requestdate.next(date);
    if (onbehalf) {
      this.shareservice.onbehalf.next(onbehalf.id);
    }
    else {
      this.shareservice.onbehalf.next(null)
    }
    this.index = index;
    if (makeonbehalf && this.index == 2) {
      this.shareservice.tourmakeonbehalf.next(makeonbehalf.id)
    }
    else if (this.index == 2) {
      this.shareservice.tourmakeonbehalf.next(0)
    }
    else {
      this.shareservice.tourmakeonbehalf.next(null)
    }

    if (this.index > 2) {
      this.getpermitedlist();
    }
    if (index == 1) {
      this.shareservice.radiovalue.next('1')
      this.addbutton = true;
      this.istourmakersmry = true;
      this.istourapprovesmry = false;
      this.istourpendingsmry = false;
      this.istourreturnsmry = false;
      this.istourrejectsmry = false;
      this.istourforwardsmry = false;

      this.tourmakecomp.ngOnInit();

    }
    else if (index == 2) {
      this.shareservice.radiovalue.next('0')
      console.log(this.shareservice.radiovalue.value)
      this.istourmakersmry = true;
      this.addbutton = false;
      this.istourapprovesmry = false;
      this.istourpendingsmry = false;
      this.istourreturnsmry = false;
      this.istourrejectsmry = false;
      this.istourforwardsmry = false;
      this.tourmakecomp.ngOnInit()
    }
    else if (index == 3) {
      let status = '2';
      this.shareservice.statusvalue.next(status);
      this.addbutton = false;
      this.istourmakersmry = false;
      this.istourapprovesmry = true;
      // this.istourpendingsmry = true;
      // this.istourreturnsmry = false;
      // this.istourrejectsmry = false;
      // this.istourforwardsmry = false;

      this.tourcheckercomp.ngOnInit()
    }
    else if (index == 4) {
      this.istouraprlsmry = false;
      let status = '3'
      this.shareservice.statusvalue.next(status);
      this.addbutton = false;
      this.istourmakersmry = false;
      this.istourapprovesmry = true;
      // this.istourpendingsmry = false;
      // this.istourreturnsmry = false;
      // this.istourrejectsmry = false;
      // this.istourforwardsmry = false;

      this.tourcheckercomp.ngOnInit()

    }
    else if (index == 5) {
      this.istouraprlsmry = false;
      let status = '4'
      this.shareservice.statusvalue.next(status);
      this.addbutton = false;
      this.istourmakersmry = false;
      this.istourapprovesmry = true;
      // this.istourpendingsmry = false;
      // this.istourreturnsmry = false;
      // this.istourrejectsmry = true;
      // this.istourforwardsmry = false;

      this.tourcheckercomp.ngOnInit()

    }
    else if (index == 6) {
      this.istouraprlsmry = false;
      let status = '5'
      this.shareservice.statusvalue.next(status);
      this.addbutton = false;
      this.istourmakersmry = false;
      this.istourapprovesmry = true;
      // this.istourpendingsmry = false;
      // this.istourreturnsmry = true;
      // this.istourrejectsmry = false;
      // this.istourforwardsmry = false;

      this.tourcheckercomp.ngOnInit()

    }
    else if (index == 7) {
      this.istouraprlsmry = false;
      let status = '6'
      this.shareservice.statusvalue.next(status);
      this.addbutton = false;
      this.istourmakersmry = false;
      this.istourapprovesmry = true;
      // this.istourpendingsmry = false;
      // this.istourreturnsmry = false;
      // this.istourrejectsmry = false;
      // this.istourforwardsmry = true;

      this.tourcheckercomp.ngOnInit()

    }
  }
  //Navigation For Expense
  enterexpaction(index) {
    // this.expactionlist
    this.currentstate.actindex = this.expactionlist.findIndex(x => x.index == index);
    this.currentstate.actname = 'expense';
    sessionStorage.setItem('pagestate', btoa(JSON.stringify(Object.assign({}, this.currentstate))))
    // this.showonbehalf = false;
    let value = this.expenseform.value;
    let tourno = value.tourexpno;
    let date = value.exprequestdate;
    // let bookingsts = value.booking_status
    let branchid = value.branch
    let onbehalf = value.onbehalf
    var employee = value.employee;
    let makeonbehalf = value.emponbehalf;
    if (value.empcode) {
      employee = value.empcode;
    }

    if (this.expenseroleshow && this.expenseform.value.expaction > 2) {
      this.shareservice.expemployee.next(employee)
      if (branchid) {
        this.shareservice.expbranchid.next(branchid.id)
      }
      else {
        this.shareservice.expbranchid.next(null)
      }
    }
    else {
      this.shareservice.expemployee.next(null)
      this.shareservice.expbranchid.next(null)
    }
    this.shareservice.tourno.next(tourno);
    this.shareservice.requestdate.next(date);

    // this.shareservice.expemployee.next(employee)
    // if(branchid){
    //   this.shareservice.expbranchid.next(branchid.id)
    // }
    // else{
    //   this.shareservice.expbranchid.next(null)
    // }


    this.index = index;

    if (makeonbehalf && this.index == 2) {
      this.shareservice.expmakeonbehalf.next(makeonbehalf.id)
    }
    else if (this.index == 2) {
      this.shareservice.expmakeonbehalf.next(0)
    }
    else {
      this.shareservice.expmakeonbehalf.next(null)
    }

    if (this.index > 2) {
      this.getpermitedlist();
    }

    if (onbehalf) {
      this.shareservice.exponbehalf.next(onbehalf.id);
    }
    else {
      this.shareservice.exponbehalf.next(null)
    }
    if (index == 1) {
      this.shareservice.radiovalue.next('1')
      this.addbutton = true;
      this.isexpmakersmry = true;
      this.isexpapprovesmry = false;
      this.expmakercomp.ngOnInit()
    }
    else if (index == 2) {
      this.shareservice.radiovalue.next('0')
      this.addbutton = false;
      this.isexpmakersmry = true;
      this.isexpapprovesmry = false;
      this.expmakercomp.ngOnInit()
    }
    else if (index == 3) {
      let status = '2';
      this.shareservice.statusvalue.next(status);
      this.addbutton = false;

      this.isexpmakersmry = false;
      this.isexpapprovesmry = true;
      this.expcheckercomp.ngOnInit()
    }
    else if (index == 4) {
      this.istouraprlsmry = false;
      let status = '3'
      this.shareservice.statusvalue.next(status);

      this.addbutton = false;
      this.isexpmakersmry = false;
      this.isexpapprovesmry = true;
      this.expcheckercomp.ngOnInit()


    }
    else if (index == 5) {
      this.istouraprlsmry = false;
      let status = '4'
      this.shareservice.statusvalue.next(status);

      this.addbutton = false;

      this.isexpmakersmry = false;
      this.isexpapprovesmry = true;
      this.expcheckercomp.ngOnInit()

    }
    else if (index == 6) {
      this.istouraprlsmry = false;
      let status = '5'
      this.shareservice.statusvalue.next(status);

      this.addbutton = false;
      this.isexpmakersmry = false;
      this.isexpapprovesmry = true;
      this.expcheckercomp.ngOnInit()

    }
    else if (index == 7) {
      this.istouraprlsmry = false;
      let status = '7'
      this.shareservice.statusvalue.next(status);

      this.addbutton = false;
      this.isexpmakersmry = false;
      this.isexpapprovesmry = true;
      this.expcheckercomp.ngOnInit()

    }

  }
  createtour() {
    this.onbehalfdata = { id: 0, onbehalf: '', name: '' }
    var datas = JSON.stringify(Object.assign({}, this.onbehalfdata));
    localStorage.setItem('tourmakersummary', datas)
    this.router.navigateByUrl('ta/tourmaker');
  }

  clearsearch() {
    this.tourform.patchValue({
      tourno: '',
      requestdate: '',
      onbehalf: null,
      emponbehalf: null,
    })
    let value = this.tourform.value.action
    this.enteraction(value)
  }
  clearadminsearch() {
    this.touradminform.patchValue({
      tourno: '',
      requestdate: '',
      permittedby: '',
      empcode: null,
      employee: null,
      branch: null,
      reference_no:null
    })
    // let value = this.touradminform.value.action
    this.enterapproveaction()
  }
  expclear() {
    this.expenseform.patchValue({
      tourexpno: '',
      exprequestdate: '',
      branch: null,
      employee: null,
      empcode: null,
      onbehalf: null,
      emponbehalf: null,
      
    })
    let value = this.expenseform.value.expaction
    this.enterexpaction(value)
  }

  subModuleData(data, defind) {
    this.navindex = data;
    this.showdaterelaxation = false;
    this.istourmakersmry = false;
    this.istourapprovesmry = false;
    this.istourpendingsmry = false;
    this.istourforwardsmry = false;
    this.istourrejectsmry = false;
    this.istourreturnsmry = false;
    this.isexpmakersmry = false;
    this.isexpapprovesmry = false;
    this.isexppendingsmry = false;
    this.isexpreturnsmry = false;
    this.isexpreturnsmry = false;
    this.recentchat = false;
    this.alltour = false;
    this.showinvoiceup = false;
    this.currentstate.navindex = data.index;
    localStorage.removeItem('tourmakersummary')
    localStorage.removeItem('onbehalf')
    localStorage.removeItem('advancemakersummary')
    localStorage.removeItem('expense_details')
    localStorage.removeItem('tour_details')
    this.showpage = false;
    if (data) {
      if (data.index == 1) {
        this.tourform.patchValue({
          action: this.permisssionlist[defind].index
        })
        this.istourmakersmry = false
        this.tourreport = false;
        this.istouraprlsmry = false
        this.isadvancemakersmry = false
        this.isadvanceaprlsmry = false
        this.isexpensemakersmry = false
        this.isexpesneaprlsmry = false
        this.iscancelmakersmry = false
        this.iscancelaprlsmry = false
        this.isassignapprover = false
        this.isrecovery = false;
        this.tourset = true;
        this.touradminset = false
        this.expenseset = false;
        this.enteraction(this.permisssionlist[defind].index);
      }

      else if (data.index == 2) {
        this.expenseform.patchValue({
          expaction: this.expactionlist[defind].index
        })
        this.istourmakersmry = false
        this.istouraprlsmry = false
        this.tourreport = false;
        this.isadvancemakersmry = false
        this.isadvanceaprlsmry = false
        this.touradminset = false
        this.isexpensemakersmry = false
        this.isexpesneaprlsmry = false
        this.iscancelmakersmry = false
        this.iscancelaprlsmry = false
        this.isassignapprover = false
        this.isrecovery = false;
        this.tourset = false;
        this.expenseset = true;
        this.enterexpaction(this.expactionlist[defind].index);
      }
      else if (data.index == 3) {
        this.istourmakersmry = false
        this.istouraprlsmry = false
        this.tourreport = false;
        this.isadvancemakersmry = false
        this.isadvanceaprlsmry = false
        this.isexpensemakersmry = false
        this.isexpesneaprlsmry = false
        this.iscancelmakersmry = false
        this.iscancelaprlsmry = false
        this.isassignapprover = false
        this.isrecovery = false;
        this.tourset = false;
        this.touradminset = true
        this.expenseset = false;
        this.enterapproveaction();
      }
      else if (data.index == 4) {
        this.gettraveldropdown()
        this.gettraveltype()
        this.istourmakersmry = false
        this.istouraprlsmry = false
        this.isadvancemakersmry = false
        this.isadvanceaprlsmry = false
        this.isexpensemakersmry = false
        this.isexpesneaprlsmry = false
        this.iscancelmakersmry = false
        this.iscancelaprlsmry = false
        this.isassignapprover = false
        this.isrecovery = false;
        this.tourset = false;
        this.touradminset = false;
        this.expenseset = false;
        this.tourreport = true;
        this.searchreportsummary();
      }
      else if (data.index == 7) {
        this.istourmakersmry = false
        this.istouraprlsmry = false
        this.isadvancemakersmry = false
        this.isadvanceaprlsmry = false
        this.isexpensemakersmry = false
        this.isexpesneaprlsmry = false
        this.iscancelmakersmry = false
        this.iscancelaprlsmry = false
        this.isassignapprover = false
        this.isrecovery = false;
        this.tourset = false;
        this.touradminset = false;
        this.expenseset = false;
        this.tourreport = false;
        this.recentchat = false;
        this.alltour = false;
        this.showdaterelaxation = true;
      }
      else if (data.index == 5) {

        this.istourmakersmry = false
        this.istouraprlsmry = false
        this.isadvancemakersmry = false
        this.isadvanceaprlsmry = false
        this.isexpensemakersmry = false
        this.isexpesneaprlsmry = false
        this.iscancelmakersmry = false
        this.iscancelaprlsmry = false
        this.isassignapprover = false
        this.isrecovery = false;
        this.tourset = false;
        this.touradminset = false;
        this.expenseset = false;
        this.tourreport = false;
        this.recentchat = true

      }//need to remove index == 6 
      else if (data.index == 6) {
        this.istourmakersmry = false
        this.istouraprlsmry = false
        this.isadvancemakersmry = false
        this.isadvanceaprlsmry = false
        this.isexpensemakersmry = false
        this.isexpesneaprlsmry = false
        this.iscancelmakersmry = false
        this.iscancelaprlsmry = false
        this.isassignapprover = false
        this.isrecovery = false;
        this.tourset = false;
        this.touradminset = false;
        this.expenseset = false;
        this.tourreport = false;
        this.recentchat = false;
        this.showinvoiceup = true;
        this.repreq = null;
      }
    }


  }

  displayFn(subject) {
    // return subject? '('+subject.onbehalf_employee_code+') '+subject.onbehalf_employee_name:undefined
    return subject ? "(" + subject.employee_code + ") " + subject.employee_name : undefined
  }
  // getbranchValue() {
  //   this.taservice.getbranchValue()
  //     .subscribe(result => {
  //       this.branchlist = result['data']
  //       console.log("branchlist", this.branchlist)
  //     })
  // }
  selectBranch(e) {
    console.log("e", e.value)
    let branchvalue = e.value
    this.taservice.setemployee(branchvalue)
      .subscribe(result => {
        this.listBranch = result
        console.log("employee", this.listBranch)
      })
  }

  navcheck() {
    return this.navalue;
  }
  radioButtonChanged($event) {
    let radioValue = event.target['value'];
    if (radioValue == 0) {
      this.ishidden = true;
    } else {
      this.shareservice.fetchValue.next(this.onbehalf);
      this.closebutton.nativeElement.click();
      // this.router.navigateByUrl('ta/advancemaker-summary');
      this.ishidden = false;
    }
  }
  submitAdvanceForm() {
    this.shareservice.fetchValue.next(this.onbehalf);
    this.closebutton.nativeElement.click();
    // this.router.navigateByUrl('ta/advancemaker-summary');
  }
  value: any
  data(n) {
    this.value = n.value
    this.shareservice.radiovalue.next(this.value)
    if (n.value === 1) {
      this.showradiobtn = false;
      this.showdisabled = true;
      this.closebutton.nativeElement.click();
      this.router.navigateByUrl('ta/toursummary');

    }
    else {
      this.showradiobtn = true;
      this.showdisabled = false;
    }
  }

  fromDateSelection(event: string) {
    let latest = event
    this.date = this.datePipe.transform(latest, 'dd-MMM-yyyy');
    const date = new Date(event)
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }
  canceldata(n) {
    this.value = n.value
    this.shareservice.radiovalue.next(this.value)
    if (n.value === 1) {
      this.showradiobtn = false;
      this.showdisabled = true;
      this.closebutton.nativeElement.click();
      this.router.navigateByUrl('ta/cancelmaker');

    }
    else {
      this.showradiobtn = true;
      this.showdisabled = false;
    }
  }
  datas(n) {
    this.value = n.value
    this.shareservice.radiovalue.next(this.value)
    if (n.value === 1) {
      this.showradiobtn = false;
      this.showdisabled = true;
      this.closebutton.nativeElement.click();
      this.router.navigateByUrl('ta/expense-summary');

    }
    else {
      this.showradiobtn = true;
      this.showdisabled = false;
    }
  }
  dataadvance(n, event) {

    this.value = n.value
    this.shareservice.radiovalue.next(this.value)
    if (n.value === 1) {
      this.radiovalue = null;
      this.showradiobtn = false;
      this.showdisabled = true;
      this.closebutton.nativeElement.click();
      this.showpage = true;
    }
    else {
      this.showradiobtn = true;
      this.showdisabled = false;
    }
  }
  // getbranches() {
  //   this.taservice.getbranchSummary()
  //     .subscribe((results: any[]) => {
  //       let datas = results['data'];
  //       this.branchList = datas;


  //     })
  // }

  branchclick(id) {
    this.branchid = id
    console.log("this.branchid", this.branchid)
    this.taservice.getonbehalfemployee("", this.branchid)
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.empList = datas;
        console.log("Employee List", this.empList)
      });
  }


  name: any;
  id: any;
  result: any
  clickemp(id, name, emp) {
    this.name = name;
    this.id = id;
    this.result = emp;

    let employeejson: any = []
    employeejson = {
      "id": this.id,
      "name": this.name
    }
    console.log("employeejson", employeejson)
  }

  requirementsdropdown() {
    this.SpinnerService.show();
    this.taservice.gettourrequirementdropdown()
      .subscribe(res => {
        this.reportreqdata = res.slice(0);
        this.requirementdata = res;
        this.requirementdata.push({
          name: "All",
          value: "0"
        });
        this.taservice.reqstatuslist()
          .subscribe(res => {

            this.reqstatuslist = res
            var value = sessionStorage.getItem('pagestate');
            if (value) {
              var pagestate = JSON.parse(atob(value));
            }
            this.SpinnerService.hide()
            if (pagestate) {
              this.navalue = Number(pagestate.navindex) - 1;
              this.defaultind = Number(pagestate.actindex);
              if (pagestate.actname == 'admin') {

                this.touradminform.patchValue({
                  'booking': String(this.defaultind),
                  'booking_status': String(pagestate.reqindex),
                  'travel_status': String(pagestate.travelsts)
                })
              }
              this.subModuleData(this.tabs[this.navalue], this.defaultind)
            }
            else {
              this.navalue = 0;
              this.subModuleData(this.tabs[this.navalue], 0)
            }
          })
        // console.log("calfdsanj", this.requirementdata)
      })
  }

  submitForm() {
    if (this.value === 0) {
      this.router.navigateByUrl('ta/toursummary');
      this.shareservice.fetchData.next(this.result);
      this.closebutton.nativeElement.click();
      this.taonbehalfForm.reset();
    }

  }
  submitForms() {
    if (this.value === 0) {
      this.router.navigateByUrl('ta/expense-summary');
      this.shareservice.fetchData.next(this.result);
      this.closebutton.nativeElement.click();
      this.taonbehalfForm.reset();
    }

  }
  submitcancel() {
    if (this.value === 0) {
      this.router.navigateByUrl('ta/cancelmaker');
      this.shareservice.fetchData.next(this.result);
      this.closebutton.nativeElement.click();
      this.taonbehalfForm.reset();
    }

  }
  advanceForm() {
    if (this.value === 0) {
      this.router.navigateByUrl('ta/advancemaker-summary');
      this.shareservice.fetchData.next(this.result);
      this.closebutton.nativeElement.click();
      this.taonbehalfForm.reset();
    }
  }

  clearreportpage() {
    this.tourreportform.patchValue({
      startdate:null,
      enddate:null,
      tourno:null,
    })
    this.searchreportsummary()
  }

  tourreportsearch() {
    // if(this.tourreportform.value.tourno == '' ){
    //   this.shareservice.report_tournumb.next(null)
    // }
    // else{
    // this.shareservice.report_tournumb.next(this.tourreportform.value.tourno)
    // }
    // this.tourreportsummmary.ngOnInit()
  }

  reportrequirementchange() {
    this.searchreportsummary()
  }
  reportstartdate() {
    // this.shareservice.report_startdate.next(this.datePipe.transform(this.tourreportform.value.startdate, 'dd-MMM-yyyy'));

  }
  reportenddate() {
    // this.shareservice.report_enddate.next(this.datePipe.transform(this.tourreportform.value.enddate, 'dd-MMM-yyyy'));

  }
  searchreportsummary() {
    let val = JSON.stringify(this.tourreportform.value)
    this.shareservice.reportvalue.next(val);
    this.tourreportsummmary.ngOnInit()
  }

  gettraveltype() {
    this.taservice.getreportreq()
      .subscribe(res => {
        this.reqlist = res
      })
  }

  gettraveldropdown() {
    this.SpinnerService.show()
    this.taservice.gettravelreportdropdown()
      .subscribe(res => {
        this.SpinnerService.hide();
        this.travelreportdropdown = res
      })
  }

  invoicechoose(evt){
    this.invoicefile= evt.target.files[0];
  }
  invoiceupload(){
    if(!this.repreq){
      this.notification.showError('Please Select Requirement Type');
      return false;
    }
    if(!this.invoicefile){
      this.notification.showError('Please Select Invoice File');
      return false;
    }
    this.taservice.invoicevalidation(this.invoicefile,this.repreq)
        .subscribe((results) => {
          if(results.status == 'success'){
            this.invoicesuccess()
          }
          else{
            this.notification.showError(results.description)
          }
        })

  }
  invoicesuccess(){
    this.SpinnerService.show();
    this.taservice.invoiceupload(this.invoicefile,this.repreq)
        .subscribe((results) => {
          this.SpinnerService.hide();
          if(results.status == 'success'){
            this.notification.showSuccess(results.message)
          }
          else{
            this.notification.showError(results.description)
          }
        })
  }
  reqformatdownload(){
    // this.SpinnerService.show();
    this.taservice.getexcelformat()
        .subscribe((results) => {
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'SampleFormat' + ".xlsx";
          link.click();
        })
  }

}



