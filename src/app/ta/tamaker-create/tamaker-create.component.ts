import { Component, OnInit, Output, EventEmitter, ViewChild, HostListener, ElementRef, ɵbypassSanitizationTrustUrl, Sanitizer, HostBinding, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray, Form } from '@angular/forms';
import * as $ from 'jquery';
import 'jqueryui';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType, JsonpClientBackend } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import { TaService } from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from 'src/environments/environment'
import { ShareService } from '../share.service';
import { ErrorHandlingService } from '../error-handling.service';
import { NgxSpinnerService } from "ngx-spinner";


const isSkipLocationChange = environment.isSkipLocationChange

import { finalize, switchMap, debounceTime, distinctUntilChanged, tap, map, takeUntil, filter } from 'rxjs/operators';

import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { DomSanitizer } from '@angular/platform-browser';
import { WHITE_ON_BLACK_CSS_CLASS } from '@angular/cdk/a11y/high-contrast-mode/high-contrast-mode-detector';
import jsPDF from 'jspdf';
import { MatMenuTrigger } from '@angular/material/menu';
export interface approverValue {
  employeeid: number;
  employee_name: string;
  employee_code: string;
}
export interface clientvalue {
  id: number;
  client_name: string;
  client_code: string;
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
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy, EEE', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

interface details {
  id: number
  startdate: any
  enddate: any
  startingpoint: string,
  placeofvisit: string,
  purposeofvisit: string
}


@Component({
  selector: 'app-tamaker-create',
  templateUrl: './tamaker-create.component.html',
  styleUrls: ['./tamaker-create.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
})
export class TamakerCreateComponent implements OnInit, AfterViewInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('closebuttons') closebuttons;
  @ViewChild("outsideElement", { static: true }) outsideElement: ElementRef;
  @ViewChild('modalView', { static: true }) modalView$: ElementRef;
  employeeControl = new FormControl();
  myControl = new FormControl();
  myControl2 = new FormControl();
  myControl1 = new FormControl();
  permitmyControl = new FormControl();
  @ViewChild('employeegid') employeegid: any;
  @ViewChild('assetid') matassetidauto: MatAutocomplete;
  @ViewChild('branchassetid') branchmatassetidauto: MatAutocomplete;
  @ViewChild('cancid') cancidauto: MatAutocomplete;
  @ViewChild('permitassetid') permitmatassetidauto: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger
  @ViewChild('inputassetid') inputasset: any;
  @ViewChild('permitinputassetid') permitinputasset: any;
  @ViewChild('empids') empids: any;
  @ViewChild('employeeid') employeeidauto: any;
  @ViewChild('branchinputassetid') branchinputasset: any;
  @ViewChild('cancinput') cancinput: any;
  @ViewChild('employee_gid') matemployee_gidauto: MatAutocomplete;
  // @ViewChild('chatList') private myScrollContainer: ElementRef;
  @ViewChild('target') myScrollContainer: ElementRef;
  @ViewChild('fromplaceauto') fromplaceauto: any;
  @ViewChild('canceltravelclose') canceltravelclose: any;

  @ViewChild('clientInput') clientInput: any;
  @ViewChild('client') matAutocomplete: MatAutocomplete;

  @ViewChild('fromplace') clientfromplace: any;
  @ViewChild('cityfrom') cityfrommatAutocomplete: MatAutocomplete;

  @ViewChild('toplace') toplace: any;
  @ViewChild('cityto') citytommatAutocomplete: MatAutocomplete;

  @ViewChild('scroll', { static: true }) scroll: any;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  reqcode = null;
  copyreqcode = null;
  //Chat 
  @ViewChild('modalcon') modelContentChat: ElementRef;
  @ViewChild('modalhead') modelHeaderChat: ElementRef;
  @ViewChild('modalBody') modelBody: ElementRef;
  @ViewChild('modalDialog') modelDialogs: ElementRef;


  // @HostBinding('class.card-outline-primary')private ishovering: boolean;


  title = "chat-float";
  response = "";
  message = "";
  // config = {
  //   title: "ChatBot",
  //   subTitle: "New Way of learning"
  // };
  taForm: FormGroup

  currentDate: any = new Date();
  // date = new Date().toLocaleDateString();
  defaultDate = new FormControl(new Date());
  today = new Date();
  date = new Date();
  latest: any
  overall: any
  chatbox: boolean = false
  days: any
  tourmodel: any
  values = [];
  tourdata = [];
  stratdate: Date;
  enddate: Date;
  endatetemp: Date
  startdatetemp: Date
  isbranch: boolean = true
  currentpage: number = 1;
  pagesize = 10;
  starttdate: any
  fileData: File = null;
  previewUrl: any = null;
  uploadList = [];
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  totall: any = 0;
  select: any;
  selectto: any;
  request: any
  isapprove: boolean = true
  total: any;
  a: any
  data: any
  data_final: any
  status: any
  tourid: any
  approverid: any
  tourapprove: any
  ishidden: boolean = false
  reasonlist: Array<any>
  isnew: boolean
  feild_disable: boolean
  show_cancelrejectdiv: boolean
  show_cancelapprovediv: boolean
  show_cancelbtn: boolean
  show_approvebtn: boolean
  istaapprove: any
  pdfUrls: string;
  show_submitbtn = true
  show_approvediv: boolean
  show_rejectdiv: boolean
  show_returndiv: boolean
  show_forwarddiv: boolean
  appr_option: boolean
  showapprovalflow_div: boolean = false
  show_forwarderapprovediv: boolean
  employeelist: any
  detail: details[];
  feilds_disable: boolean
  selectstart: any
  selectend: any
  imageUrl = environment.apiURL;
  jpgUrls: string;
  tourcancel: any;
  approval: any;
  base64textString = [];
  showfunds = false;
  onbehalfname: any;
  feild_reason: boolean = false
  branchlist: any;
  add_button: boolean = true
  InputVar: ElementRef;
  permittedlist: any
  onbehalfid: any = 0
  show_forsubmit: boolean = false
  radiovalue: any
  isLoading = false;
  tourdataas: any
  images: any
  imagesData: any
  permitemployeelist: any
  tapermitForm: FormGroup
  tourpermitmodel: any
  approvalflowlist: any
  showdropdown = true
  showtext = false
  tourforward: any
  forwardbranchlist: any
  forwardemployeelist: any
  showattachment = false
  attachmentlist: any
  fileextension: any
  approvedby_id: any
  frwdapproverid: any
  showDate = false
  appflowtable: boolean = true

  // showdates=true
  tick: boolean = true
  tourfromDate: any
  showemployeeapprover: boolean = false
  showemployee: boolean = true
  appflow: boolean = false
  tourtoDate: any
  // showcurrentdate=true
  // showselecteddate=false
  showselecteddate = false
  comment: any
  showcreatefile = true
  showeditfile = false
  showcreatecount = true
  showeditcount = false
  show_editsubmitbtn = false
  tourdetails: any
  transferList: any
  showtransfer = false
  getapprovername: any
  id: any;
  tourgid: any;
  isaction: boolean = true
  reason: any;
  fileid: any;
  image: any;
  tokenValues: any;
  result: any;
  tour: any;
  ssurl: any;
  externalWindow: Window;
  filesset: any;
  files: any;
  file_length: number = 0;
  list: DataTransfer;
  file_window: Window;
  filesystem_error: boolean;
  file_downloaded: boolean = false;

  name: any;
  tourlist: any[];
  empname: any;
  empgrade: any;
  empcode: any;
  empdesign: any;
  filecheck: boolean;
  fileimg: boolean;
  file_ext: any = ['jpg', 'png', 'JPG', 'JPEG', 'jpeg', 'image'];
  approver: any;
  new: boolean;
  old: boolean;
  public selected: string;
  appedit: boolean = false;
  appeditno: boolean = true;
  endlimit: any;
  startlimit: Date;
  dateedit: boolean;
  tourdatenot: boolean = false;
  minimum: any;
  maximum: any;
  enmaximum: any;
  enminimum: any;
  showsubmit: boolean;
  has_nextid: boolean = true;
  has_presentid: number = 1;
  log_emp: any;
  tourdetails_check: boolean = false;
  permittedupdate: boolean = false;
  tourapproval: any;
  mainbranchid: any;
  employeeid: any;
  listBranch: any;
  branchlists: any;
  approvalid: any;
  permitid: any;
  code: any;
  designation: any;
  full_name: any;
  grade: any;
  empid: any;
  startdate: any;
  enddata: any;
  startingpoint: any;
  placeofvisit: any;
  purposeofvisit: any;
  reasonval: any;
  permittedby: any;
  approver_data: any;
  resonupdate: boolean;
  approveupdate: boolean;
  permitupdatevl: boolean;
  isDisabled: boolean = false;
  isEnable: boolean = false;
  tour_summary: any;
  lastcomment: any = null;
  applevel: any;
  onbehalfchoose: boolean = false
  tourstatus: boolean = true;
  pageSize = 10;
  p = 1;
  value: any;
  tourcanid: any;
  submitbtn: boolean = true;
  tourcancelapp: boolean = false;
  cancelid: any;
  approvalflowcancellist: any;
  app: any;
  showreasonattach: boolean = false;
  selflist: any;
  onbehalfofid: number = null;
  actionlist: any = [];
  cancapplist: any = null;
  onbehalfoption: boolean = false;
  onbehalflist: any;
  approveractionlist: { index: number; name: string; }[];
  approverapplevel: number = 0;
  emplist: any;
  has_nextempid: boolean = true;
  has_presentempid: number = 1;
  cancelform: FormGroup;
  chatform: FormGroup
  has_presentcancid: number = 1;
  has_nextcancid: boolean = true;
  pdfshow: boolean = false;
  imgshow: boolean = false;
  filesrc: any;
  apptype: any;
  tourcanceltype: boolean = false;
  commentDataList: any;

  requirmentdropdowndata: any;
  clientdropdowndata: any;
  maxrequdata: any;
  weekendboolean: boolean = false;
  editcheck: boolean = true;
  intertravel: boolean = false;
  bookedform: FormGroup
  reqirementsdisable: boolean = false;
  traveltypedropdown: any;

  locationreason: boolean = false;
  bookavail: boolean;

  chatboxcurrentpage: number = 1;
  chatboxpagination: boolean = false;

  has_next = true;
  has_previous = true;
  clientcurrentpage = 1
  getviewfilelist: any;
  chatunreadmsg: any;

  citydropdown: any;
  cityhas_next = true;
  cityhas_previous = true;
  citycurrentpage = 1;
  duplicate: boolean = false;

  chattextareaboolean = false;
  contentName: any;
  daterelaxboolean = false;
  showonbe: boolean = false;
  onbeapp: number;
  approvalpage = 1;
  ngreload = true;
  tourend: any;
  checkcredentialdata: void;
  reasonselect: any;
  cabtypesdropdown: any;
  changed = false;
  nonbaselist = [];
  tourcanstatus: any;
  reqname: any;
  reqstatus: string;
  reissueform: FormGroup;
  MAX_VALUE = '';
  MAX_VALUES = '';
  index1: any;
  reissueid = null;
  isShowing: boolean = false;
  isShowingBtn: boolean = true;
  cabsegments: any;
  roomtypes: any;
  nStart: any;
  nEnd: any;
  diffInNights: any;
  Nights: any;
  Time: any;
  dropdownused: boolean = false;
  branchdetail:any;


  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private http: HttpClient,
    private notification: NotificationService, private taservice: TaService, private sanitizer: DomSanitizer,
    public sharedService: SharedService, private shareservice: ShareService, private SpinnerService: NgxSpinnerService,
    private route: Router, private activatedroute: ActivatedRoute, private errorHandler: ErrorHandlingService,
    private _el: ElementRef) { }
  //tourmodel= new Tourmaker(1,'',1,'','',3,'',1modalContent@)
  //Added for Dragggable & Resizeable Chat Box
  ngAfterViewInit(): void {
    let modalContent = $(this.modelContentChat.nativeElement);
    let modalHeader = $(this.modelHeaderChat.nativeElement);
    let modalBodyChat = $(this.modelBody.nativeElement);
    let modalDialogChat = $(this.modelDialogs.nativeElement);
    modalHeader.addClass('cursor-all-scroll');
    //modalContent.draggable({
    //cursor: "all-scroll",
    //handle: modalBodyChat
    //});
    modalDialogChat.draggable({
      cursor: "all-scroll",
      handle: modalHeader
    })
    modalContent.resizable({
      minHeight: 370,
      minWidth: 750,
      handles: 'n, e, s, w, se, ne, sw, nw'
    });


  }

  showcity(subject) {
    return subject ? subject.name : ''
  }

  ngOnInit(): void {


    const params = new URL(window.location.href).searchParams;
    let tourid = params.get('tour_id');
    if (tourid) {
      this.objectassign(tourid);
    }
    this.tour_summary = JSON.parse(localStorage.getItem('tourmakersummary'))
    // this.tour_summary = JSON.parse(localStorage.getItem('tourmakersummary'))
    this.onbeapp = this.tour_summary.onbehalfapp;
    let values = this.shareservice.radiovalue.value
    let employeedata = JSON.parse(localStorage.getItem('sessionData'))
    this.status = this.tour_summary.tour_status_id;
    this.tourcanstatus = this.tour_summary.tour_cancel_status_id;
    this.employeeid = employeedata.employee_id
    this.apptype = this.tour_summary.apptype
    if (this.apptype == "TOUR CANCEL") {
      this.tourcanceltype = true
    }
    this.radiovalue = values
    let datas = this.tour_summary;
    if (this.tour_summary.applevel) {
      this.approverapplevel = this.tour_summary.applevel;
    }
    if (this.approverapplevel >= 1) {
      this.status = this.tour_summary.status
    }

    if (this.approverapplevel == 0 && (this.status == null || this.status == 2)) {
      this.getbranchValue();
    }

    this.tourcanid = datas['id']
    console.log("datas", datas)



    this.selflist = [{
      id: 0,
      name: 'Self'
    },
    {
      id: 1,
      name: 'Onbehalf of'
    }]

    this.chatform = this.formBuilder.group({
      chat: null
    })
    this.cancelform = this.formBuilder.group({
      cancbrnch: null,
      cancapp: null,
      canccomments: null
    })
    this.taForm = this.formBuilder.group({
      requestno: 'NEW',
      requestdate: new Date(),
      selfcheck: 0,
      reason: ['', Validators.required],
      startdate: ['', Validators.required],
      enddate: ['', Validators.required],
      approval: ['', Validators.required],
      durationdays: '',
      accommodation_cost: null,
      other_cost: null,
      air_cost: null,
      ordernoremarks: ['', Validators.required],
      permittedby: ['', Validators.required],
      empbranchgid: ['', Validators.required],
      comments: ['', Validators.required],
      chat: '',
      transfer_on_promotion: 0,
      quantum_of_funds: null,
      opening_balance: null,
      week_end_travel: '',
      onbehalfof: this.onbehalfid,
      sortterm_travel: 0,
      non_base_location: null,
      detail: new FormArray([
        this.createItem(),

      ]),


      // data: new FormArray([]),
    });

    this.bookedform = this.formBuilder.group({
      id: '',
      booking_needed: '',
      comments: '',
      checkin_time: '',
      checkin_date: '',
      checkout_time: '',
      checkout_date: '',
      place_of_stay: '',
      Accomodationkey: '',
      otherkey: '',
      from_time: '',
      from_date: '',
      from_place: '',
      to_place: '',
      to_time: '',
      status: '',
      ticket_amount: '',
    });

    let onbehalf = JSON.parse(localStorage.getItem('onbehalf'))
    if (this.tour_summary.onbehalfof) {
      this.taForm.get('selfcheck').setValue(1);
      this.onbehalfname = onbehalf.onbename;
      this.onbehalfid = this.tour_summary.empgid
      this.app = onbehalf.app
    }
    if (datas['id'] != 0) {
      this.empname = this.tour_summary.employee_name
      this.empgrade = this.tour_summary.empgrade
      this.empcode = this.tour_summary.employee_code
      this.empdesign = this.tour_summary.empdesignation
      this.empid = this.tour_summary.empgid
      this.branchdetail = `(${this.tour_summary.branch_code}) ${this.tour_summary.branch_name}`
      if (this.approverapplevel == 0 && (this.status == null || this.status == 2)) {
        this.getpermitedlist()
        this.getonbehalflist()
      }
    }
    else {
      this.taservice.getemployeesdetails().subscribe((results) => {
        this.tour = results
        this.empcode = results['code']
        this.empdesign = results['designation']
        this.empname = results['full_name']
        this.empgrade = results['grade']
        this.empid = results['id']
        this.branchdetail =`(${results['employee_branch_code']}) ${results['employee_branch_name']}`
        if (this.approverapplevel == 0 && (this.status == null || this.status == 2)) {
          this.getpermitedlist()
          this.getonbehalflist()
        }
      })
    }

    this.tourpermitmodel = {
      empbranchgid: '',
      permittedby: ''
    }

    // this.tourfromDate=new Date()
    // this.tourtoDate=new Date()
    let data = this.tour_summary;

    console.log("data", data['tour_status'])
    if (data['tour_status'] == "APPROVED") {

      this.feild_disable = true
      this.feilds_disable = true
    }
    this.id = data['tourid'] || data['id']
    if (this.id == "0") {
      this.id = "NEW"
      this.new = true;
      this.old = false;
      this.showsubmit = true;
    }

    console.log("id", this.id)
    let approverdata = data['approver_data']
    console.log("approverdata", approverdata)

    // let frwddata=this.shareservice.forwardData.value;
    console.log("data", data)
    console.log("this.id", this.id)

    this.show_approvediv = false;
    this.show_rejectdiv = false;
    this.show_returndiv = false;
    this.show_forwarddiv = false;
    this.appr_option = false;

    this.show_forwarderapprovediv = false;
    // if(data['tour_cancel_status']){
    //   this.cancelid =data['id']
    //    this.getapprovalflowcancel();
    //    this.iscancel=false
    //  }
    if (data['tour_approvedby']) {



      this.ishidden = true;
      this.feild_reason = false
      this.submitbtn = false
      this.cancelid = data['id']
      this.showapprovalflow_div = true
      this.appflow = false;
      this.isbranch = false
    }
    if (data['apptype'] == "TourCancel") {
      this.showapprovalflow_div = true
      this.show_cancelbtn = true
      this.submitbtn = false
      this.feild_reason = false
      this.ishidden = false;
      this.taservice.getapproveflowalllist(this.tourgid || this.tourid)
        .subscribe(res => {
          this.approvalflowlist = res['approve']
        })
    }
    if (data['id'] != 0) {

      if (data['approver_data'] != undefined || data['approver_data'] != null) {
        this.ishidden = false;
      }

      this.tourid = data['id']
      this.tourgid = data['tourid']
      // this.show_editsubmitbtn=true
      // this.show_submitbtn = false
      if (this.id != "NEW") {
        this.SpinnerService.show()
        this.taservice.getTourmakereditSummary(data['tourid'] || data['id'])
          .subscribe((results: any) => {
            this.SpinnerService.hide()
            if (results['employee_name']) {
              this.editcheck = false
            }
            this.show_submitbtn = false;
            this.show_editsubmitbtn = true;
            this.tourlist = results
            let data = results
            this.removeSection(0)
            console.log("this.tourlist", this.tourlist)
            this.name = results['employee_name']
            this.new = false;
            this.old = true;
            this.request = results.id
            let reason = results['reason_data']
            this.tourreasonid = reason.id
            let startDate = results['startdate']
            let startdate1 = this.datePipe.transform(startDate, 'yyyy-MM-dd');
            let endDate = results['enddate']
            let enddate1 = this.datePipe.transform(endDate, 'yyyy-MM-dd');
            let durationdays = results['durationdays']
            let ordernoremarks = results['ordernoremarks']
            let permittedby = results['permitted_by_data']
            let opening_balance = results['opening_balance']
            let quantum_of_funds = results['quantum_of_funds']
            let accommodation_cost = Number(results['accommodation_cost']).toFixed(2)
            let other_cost = Number(results['other_cost']).toFixed(2)
            let air_cost = Number(results['air_cost']).toFixed(2)
            let transfer_on_promotion = results['transfer_on_promotion']
            let sortterm_travel = results['sortterm_travel']
            let nonbasedlocation = results['non_base_location']
            if (results['non_base_location'] != null) {
              this.locationreason = true
            }
            else {
              this.locationreason = false
            }
            let newdict = {
              "full_name": "(" + permittedby.code + ") " + permittedby.full_name,
            }
            this.permittedby = permittedby.id
            // let branch_name = results['branch_data_maker']
            // let approver_data = results['approver_branch_data']
            if (results['onbehalfof']) {
              let onbe = results['onbehalfof']
              this.onbehalfid = results['empgid'];
            }

            // this.approver_data = approver_data.id
            let weekendtravel = results['week_end_travel']
            this.getchatlist(this.chatboxcurrentpage);
            // var branchdetail = '(' + approver_data.branch_code + ') ' + approver_data.branch_name
            // this.taForm.patchValue({ empbranchgid: branchdetail })
            let sec = 0

            if (this.approverapplevel == 1 && (reason.id == 9 || reason.id == 10)) {
              this.intertravel = true
            }

            if (results['week_end_travel'] != null) {
              this.weekendboolean = true
            }

            for (let detail of results.detail) {

              // unarmed
              let id: FormControl = new FormControl('');
              let startdate: FormControl = new FormControl('');
              let enddate: FormControl = new FormControl('');
              let startingpoint: FormControl = new FormControl('');
              let placeofvisit: FormControl = new FormControl('');
              let purposeofvisit: FormControl = new FormControl('');
              let toplace: FormControl = new FormControl('');
              let client: FormControl = new FormControl('');
              let other_client_name: FormControl = new FormControl('');
              // let booking_status:FormControl = new FormControl('');
              // let week_end_travel:  FormControl =  new FormControl('');
              let official: FormControl = new FormControl('');
              let currentdatecheck: FormControl = new FormControl('')
              id.setValue(detail.id);
              startdate.setValue(this.datePipe.transform(detail.startdate, 'yyyy-MM-dd'))
              enddate.setValue(this.datePipe.transform(detail.enddate, 'yyyy-MM-dd'));
              startingpoint.setValue(detail.startingpoint);
              placeofvisit.setValue(detail.placeofvisit);
              purposeofvisit.setValue(detail.purposeofvisit);
              toplace.setValue(detail.toplace);
              // week_end_travel.setValue(detail.week_end_travel)
              other_client_name.setValue(detail.other_client_name)
              client.setValue(detail.client);
              official.setValue(detail.official.toString());
              currentdatecheck.setValue(false);

              // requirement.setValue(detail.requirements);
              // booking_status.setValue(detail.booking_status)

              console.log('check requirements', detail.requirement);





              this.getFormArray().push(new FormGroup({
                id: id,
                startdate: startdate,
                enddate: enddate,
                startingpoint: startingpoint,
                placeofvisit: placeofvisit,
                purposeofvisit: purposeofvisit,
                // toplace:toplace,
                other_client_name: other_client_name,
                client: client,
                official: official,
                currentdatecheck: currentdatecheck,
                requirements: this.requirementsdata(detail.requirement),


              }));
            }
            this.checkcredentialdata = this.taForm.value.detail
            this.taForm.patchValue({
              "reason": reason,
              "startdate": startdate1,
              "enddate": enddate1,
              "durationdays": durationdays,
              "ordernoremarks": ordernoremarks,
              "permittedby": newdict,
              "onbehalfof": this.onbehalfid,
              // "approval": approver_data,
              "quantum_of_funds": quantum_of_funds,
              "opening_balance": opening_balance,
              "transfer_on_promotion": transfer_on_promotion,
              "week_end_travel": weekendtravel,
              "sortterm_travel": sortterm_travel,
              "non_base_location": nonbasedlocation,
              "accommodation_cost": accommodation_cost,
              "air_cost": air_cost,
              "other_cost": other_cost

            })
            this.reasonselect = reason;
            this.totall = durationdays
            // this.approver =results['approver_data'].name
            // console.log("this.approver",this.approver )
            // this.tourmodel.approval=this.approver
            // console.log("this.tourmodel.approver",this.tourmodel.approval)
            console.log("permittedby", permittedby)
            let res = results['approve']
            this.approvedby_id = res[1].approvedby_id
            console.log("this.approvedby_id", this.approvedby_id)
            // this.frwdapproverid=res[2].id
            this.dateedit = true;

            this.showtext = true

            this.showattachment = true
            this.showeditfile = true
            this.showcreatefile = false
            this.showcreatecount = false
            this.showeditcount = true


            this.taservice.getfetchimages(this.tourid)
              .subscribe((results) => {
                // this.resultimage = results[0].url
                this.attachmentlist = results['data']
                console.log("value", this.attachmentlist)
                this.fileData = results['data']
                // this.count = this.attachmentlist.length
                // let stringValue = results[0].file_name.split('.')
                // this.fileextension = stringValue.pop();
                // console.log("file", this.fileextension)

              })



            // tourdata["tour"] = tourjson
            // this.tourdataas = JSON.stringify(Object.assign({}, tourdata));
            // tourdata = results
            // localStorage.setItem("Tourmakerlist", this.tourdataas)
            this.tourmodel = results;
            this.tourmodel.reason = results['reason_id']
            // this.totall = this.tourmodel.durationdays


            // const branchdata = results['approver_branch_data']
            // this.tourmodel.empbranchgid = branchdata.branch_name;
            // this.tourmodel.approval = branchdata.full_name;
            // this.employeeid = branchdata.id;
            // this.mainbranchid = branchdata.branch_id;

            if (this.tourmodel.reason == 6 || this.tourmodel.reason == 7 || this.tourmodel.reason == 8) {
              this.showtransfer = true
              // if (results['transfer_on_promotion'] == 1) {
              //   this.transferList['name'] = 'YES'
              // }
              // else {
              //   this.transferList['name'] = 'NO'
              // }
            }
            // else if (this.tourmodel.reason == 2) {
            //   this.showfunds = true
            //   this.tourmodel.quantum_of_funds = results['quantum_of_funds']
            //   this.tourmodel.opening_balance = results['opening_balance']
            // }
            // // this.tourmodel.permittedby=results['permittedby_id']
            // this.tourmodel.permittedby = results['permittedby']
            // this.tourmodel.permittedby = results['permittedby']


            console.log("this.tour", this.tourmodel)
            const tourresult = localStorage.getItem("Tourmakerlist")
            // if (tourresult) {
            //   let gettourapproverdata = JSON.parse(tourresult);
            //   console.log("value", gettourapproverdata)
            //   this.selected = gettourapproverdata.tour.employee_name;

            //   console.log("APP", this.selected)
            // }


            // this.tourmodel.permittedby_id = results['permittedby_id']

            // this.tourmodel.permittedby = results['permittedby']
            // let approval = results['approver_data']
            // this.tourapproval = results['approver_data'].id
            // let approve = results['approve']
            // console.log(approve)
            // var length = approve.length
            // const login_check = localStorage.getItem("sessionData")
            // if (login_check) {
            //   this.log_emp = JSON.parse(login_check);
            //   if (approve[length - 1].applevel == 2 && this.log_emp.employee_id == "1") {
            //     this.show_approvebtn = false;
            //     this.showsubmit = true;

            //   }
            //   else {
            //     this.showsubmit = false;
            //   }
            // }
            // this.getapprovername = approval.name
            console.log("appname", this.tourmodel.approval)
            this.tourmodel.detail.forEach(currentValue => {
              currentValue.startdate = this.datePipe.transform(currentValue.startdate, 'yyyy-MM-dd');
              currentValue.enddate = this.datePipe.transform(currentValue.enddate, 'yyyy-MM-dd');
            });
            this.tourmodel.startdate = this.datePipe.transform(this.tourmodel.startdate, 'yyyy-MM-dd');
            this.select = new Date(this.tourmodel.startdate);
            this.tourmodel.enddate = this.datePipe.transform(this.tourmodel.enddate, 'yyyy-MM-dd');

            this.tourmodel.requestdate = this.datePipe.transform(this.tourmodel.requestdate, 'yyyy-MM-dd');
            this.tourdetails = results['detail']
            console.log("tourdetail", this.tourdetails)
            this.tourdetails_check = true;
            let datas = this.tour_summary
            let applevel = datas['applevel']
            this.applevel = datas['applevel']

            this.taservice.getapproveflowalllist(this.tourgid || this.tourid)
              .subscribe(res => {
                this.approvalflowlist = res['approve']
                // var logged = this.log_emp.employee_id
                // let apptypelist = this.approvalflowlist.filter(function (element) {
                //   return element.apptype == 'TOUR CREATION'
                // });

                // if (apptypelist[apptypelist.length - 1].status == 3 || apptypelist[apptypelist.length - 1].status == 4) {
                //   this.tourstatus = false;
                // }
                // let commentlist = apptypelist.filter(function (element) {
                //   return element.approver_id === logged
                // });
                // console.log("APPROVAL COMMENT", commentlist);
                // let forwardlist = apptypelist;
                // var fdlength = forwardlist.length
                // if (forwardlist[fdlength - 1].status == 2 && forwardlist[fdlength - 2].status == 6) {
                //   this.isDisabled = true
                //   this.feild_disable = true;
                //   this.feilds_disable = true;
                //   this.taForm.controls['reason'].disable();
                //   this.taForm.controls['durationdays'].disable();
                //   this.taForm.controls['ordernoremarks'].disable();
                //   this.taForm.controls['permittedby'].disable();
                //   this.taForm.controls['transfer_on_promotion'].disable();
                //   this.taForm.controls['quantum_of_funds'].disable();
                //   this.taForm.controls['opening_balance'].disable();

                //   this.isaction = false;
                //   this.isEnable = true
                //   this.add_button = false
                //   let branchdata = forwardlist[fdlength - 1]
                //   var brcode = branchdata.branch_code;
                //   var brname = branchdata.branch_name;
                //   var empcode = branchdata.approver_code;
                //   var empname = branchdata.approvedby;
                //   let finalbrdata = "(" + brcode + ") " + brname;
                //   let finalemployee = {
                //     "code": empcode,
                //     "full_name": empname
                //   }
                //   this.feild_reason = true;
                //   this.taForm.patchValue({ empbranchgid: finalbrdata })
                //   this.taForm.patchValue({ approval: finalemployee })
                // }
                // this.lastcomment = commentlist[commentlist.length - 1].comment;
                // this.taForm.patchValue({ comments: this.lastcomment })
              })

            console.log("applevel", applevel)
            if (datas['applevel'] >= 1) {
              this.showemployeeapprover = true
              this.showemployee = false
              this.feild_reason = true
              this.add_button = false
              this.feild_disable = true;
              this.feilds_disable = true;
              this.show_approvebtn = true;
              this.feilds_disable = true;
              this.isbranch = false
              this.isDisabled = true
              this.taForm.controls['reason'].disable();
              this.taForm.controls['durationdays'].disable();
              this.taForm.controls['ordernoremarks'].disable();
              this.taForm.controls['permittedby'].disable();
              this.taForm.controls['transfer_on_promotion'].disable();
              this.taForm.controls['quantum_of_funds'].disable();
              this.taForm.controls['opening_balance'].disable();

              //   for(var i=0;i<this.taForm.value.detail.length;i++){
              //  (this.taForm.get('detail') as FormArray).at(i).disable();
              //   }


              this.appflow = true;
              this.isaction = false;
              this.show_submitbtn = false;
              this.show_editsubmitbtn = false;
              this.approverid = datas['approverid']
            }
            // else if (datas['applevel'] == 2 && this.log_emp.employee_id == approve[length - 1].approvedby_id) {
            //   this.feild_disable = true;
            //   this.feild_reason = true
            //   this.feilds_disable = true;
            //   this.show_forsubmit = true;
            //   this.add_button = false
            //   this.isbranch = false
            //   this.isDisabled = true
            //   this.taForm.controls['reason'].disable();
            //   this.taForm.controls['durationdays'].disable();
            //   this.taForm.controls['ordernoremarks'].disable();
            //   this.taForm.controls['permittedby'].disable();
            //   this.taForm.controls['transfer_on_promotion'].disable();
            //   this.taForm.controls['quantum_of_funds'].disable();
            //   this.taForm.controls['opening_balance'].disable();

            //   this.appflow = true
            //   this.isaction = false;
            //   this.show_submitbtn = false;
            //   this.show_editsubmitbtn = false;
            //   this.frwdapproverid = datas['approverid']
            // }
            else if (datas['applevel'] == null) {
              this.show_editsubmitbtn = true;
              this.show_submitbtn = false;

            }
            else {
              this.show_editsubmitbtn = false;
              this.show_submitbtn = false;
            }
            if (datas['status'] == 3 || datas['status'] == 4) {
              this.feild_disable = true;
              this.feilds_disable = true;
              this.show_submitbtn = false;
              this.show_approvebtn = false;
              this.show_editsubmitbtn = false;
            }
            this.tourapprove = {
              comments: ''
            }
            this.tourforward = {
              empbranchgid: '',
              approval: '',
              comments: ''
            }

          })
      }
    }
    else {
      this.SpinnerService.show()
      this.show_submitbtn = true;
      this.show_editsubmitbtn = false;
      this.tourmodel = {
        requestno: 'NEW',
        requestdate: new Date(),
        reason: '',
        startdate: '',
        enddate: '',
        approval: '',
        durationdays: '1',
        ordernoremarks: '',
        permittedby: '',
        detail: [],
      }
      // this.addSection();

      this.startlimit = new Date()
      this.startlimit.setDate(this.startlimit.getDate() - 150);
      console.log(this.startlimit)
      this.endlimit = new Date()
      this.endlimit.setMonth(this.endlimit.getMonth() + 3)
      this.select = new Date()
      this.selectto = new Date()


      this.feild_disable = false;
      this.feilds_disable = false;
      this.show_approvebtn = false;
      // this.show_submitbtn = true;

    }

    if (data['tour_approvedby']) {
      this.taForm.enable();
      this.show_submitbtn = false
      this.show_editsubmitbtn = false
      this.taForm.controls['reason'].disable();
      this.taForm.controls['durationdays'].disable();
      this.taForm.controls['ordernoremarks'].disable();
      this.taForm.controls['permittedby'].disable();
      this.taForm.controls['transfer_on_promotion'].disable();
      this.taForm.controls['quantum_of_funds'].disable();
      this.taForm.controls['opening_balance'].disable();
      this.isDisabled = true
      this.add_button = false
      this.isbranch = false


    }
    else {
      if (data['tour_status'] == "APPROVED" || data['tour_status'] == "REJECTED" || data['tour_status'] == "FORWARDED") {
        this.taForm.controls['reason'].disable();
        this.taForm.controls['ordernoremarks'].disable();

        this.isDisabled = true
        this.add_button = false
        this.show_submitbtn = false
        this.show_editsubmitbtn = false
        this.isaction = false
        this.feild_disable = true


      }
    }
    // this.getreasonValue();
    if (this.approverapplevel == 0 && (this.status == null || this.status == 2 || this.status == 5)) {
      // this.getbranchValue();
      this.gettransfer();
      this.getreasonValue();
      this.taForm.get('approval').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taservice.getbranchemployee(value, this.branchid, this.onbehalfid))
        )
        .subscribe((results: any[]) => {
          let datas = results;
          this.employeelist = datas;
          console.log("Employee List", this.employeelist)
        });
      this.taForm.get('reason').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taservice.getreasonValues(value))
        )
        .subscribe((results: any[]) => {
          let datas = results['data'];
          this.reasonlist = datas;
          console.log("Employee List", this.reasonlist)
        });
      // this.myControl2.valueChanges
      // .pipe(
      //   debounceTime(100),
      //   distinctUntilChanged(),
      //   tap(() => {
      //     this.isLoading = true;
      //   }),
      //   switchMap(value => this.taservice.getemployeevaluepermit(value,this.permitbranchid,this.empid))
      // )
      // .subscribe((results: any[]) => {
      //   let datas = results['data'];
      //   this.permitemployeelist = datas;
      //   console.log("permitted List",this.permitemployeelist)
      // });
      this.taForm.get('permittedby').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),

          switchMap(value => this.taservice.getpermittedlist(this.empid, value, 1, this.onbehalfid))
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.permittedlist = datas;
          console.log("permit List", this.permittedlist)
        });
      this.myControl1.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),

          switchMap(value => this.taservice.getUsageCode(value, 1))
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchlist = datas;

          console.log("Branch List", this.branchlist)
        });

      this.taForm.get('empbranchgid').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taservice.getUsageCode(value, 1))
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchlist = datas;

          console.log("Branch List", this.branchlist)
        });
      this.cancelform.get('cancbrnch').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taservice.getUsageCode(value, 1))
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchlist = datas;
          console.log("Branch List", this.branchlist)
        });
      this.cancelform.get('cancapp').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taservice.getbranchemployee(value, this.branchid, this.onbehalfid))
        )
        .subscribe((results: any[]) => {
          let datas = results;
          this.employeelist = datas;
          console.log("Employee List", this.employeelist)
        });
    }

    this.getemployeeValue();

    this.requirementsdropdown()
    // this.clientdropdown()
    this.gettraveltype()

    this.getclientsearch()
    // this.getbasedlocationarea()
    this.getfromtoplacedropdown()

    this.createtime()
    this.getcabtypes()
    this.getnonbaselist();
    this.getcarsegment();
    this.getroomtypes();

    this.reissueform = this.formBuilder.group({
      duplicate_booking_neede: '',
      booking_needed: '',
      comments: '',
      Accomodationkey: '',
      checkin_time: '',
      checkin_date: '',
      checkout_time: '',
      checkout_date: '',
      place_of_stay: '',
      from_time: '',
      from_date: '',
      from_place: '',
      to_place: '',
      to_time: '',
      otherkey: '',
      travel_type_cab: '',
      cab_segment: '',
      instructions: '',

    });

  }//ngOnInit
  getnonbaselist() {
    this.taservice.getnonbaselist().subscribe(res => {
      this.nonbaselist = res;
    })
  }
  objectassign(tour) {
    let data = `&tour_no=${tour}`
    if (this.ngreload) {
      this.ngreload = false;
      this.taservice.getTourApprovalSummary(2, 1, data).subscribe(res => {
        let data = res["data"][0];
        let objects = {
          id: data['tourid'],
          status: data['status'],
          approverid: data['id'],
          approvedby_id: data['approver_id'],
          applevel: data['applevel'],
          employee_name: data['employee_name'],
          employee_code: data['employee_code'],
          empgrade: data['empgrade'],
          empdesignation: data['empdesignation'],
          empgid: data['empgid'],
          apptype: data['apptype'],
          onbehalfapp: null
        }
        var datas = JSON.stringify(Object.assign({}, objects));
        localStorage.setItem('tourmakersummary', datas)
        this.ngOnInit();
      });
    }

    // let date = JSON.parse(localStorage.getItem('tourmakersummary')

  }
  selfonbe(value) {
    if (value == 0) {
      this.taservice.getemployeesdetails().subscribe((results) => {
        this.onbehalfchoose = false;
        this.onbehalfofid = null
        this.onbehalfid = null;
        this.tour = results
        this.empcode = results['code']
        this.empdesign = results['designation']
        this.empname = results['full_name']
        this.empgrade = results['grade']
        this.empid = results['id']
        `(${results['employee_branch_code']}) ${results['employee_branch_name']}`
        this.taForm.patchValue({
          onbehalfof: undefined
        })
        this.getpermitedlist()
      })
    }
    else if (value == 1) {
      this.onbehalfchoose = true;
      this.empname = null
      this.empdesign = null
      this.empgrade = null
      this.empcode = null;
      this.branchdetail = null;
    }
  }
  onbehalfselect(value) {
    this.onbehalfid = value.id

    this.taservice.getemployeedetails(this.onbehalfid).subscribe((results) => {
      this.empdesign = results.designation;
      this.empcode = results.code;
      this.branchdetail = `(${results.employee_branch_code}) ${results.employee_branch_name}`;
    })
    this.taForm.patchValue({
      onbehalfof: this.onbehalfid
    })
  }

  getcall() {
    // this.taservice.getfetchimages1(this.fileid)
    //   .subscribe((results) => {
    //     console.log("results", results)
    //   })
  }
  // empidupdate(ind){

  fieldGlobalIndex(index) {
    let dat = this.pageSize * (this.p - 1) + index;
    return dat
  }
  displayFn(subject) {
    return subject ? '(' + subject.code + ') ' + subject.full_name : undefined
  }
  permittvalue(subject) {
    return subject ? subject.full_name : undefined
  }
  onbehalfvalue(subject) {
    return subject ? subject.employee_name : undefined
  }
  reasonvalue(subject) {
    return subject ? subject.name : undefined;
  }
  branchvalue(subject) {
    return subject ? '(' + (subject.code) + ') ' + (subject.name) : undefined;
  }

  // clientvalue(subject){
  //   return subject? '(' + (subject.client_code) + ') ' + (subject.client_name) : undefined;
  // }
  public clientvalue(subject?: clientvalue): string | undefined {
    return subject ? '(' + (subject.client_code) + ') ' + (subject.client_name) : undefined;
  }

  public cityvalue(subject?: clientvalue): string | undefined {
    return subject ? '(' + (subject.client_code) + ') ' + (subject.client_name) : undefined;
  }

  getpermitedlist() {
    // this.taservice.getpermitlist(this.empid, this.onbehalfid)
    //   .subscribe(result => {
    //     this.permittedlist = result['data']
    //   })

  }

  getchatlist(i) {
    this.taservice.getchatlist(this.request, i)
      .subscribe(result => {
        if (result['data'].length != 0) {
          let data = result['data'].reverse()
          this.chatunreadmsg = result['data'][0]['unread_message']
          console.log('unreadddd', this.chatunreadmsg)
          let chatpagination = result['pagination']['has_next']

          this.chatboxpagination = chatpagination
          if (this.chatunreadmsg == 1) {
            //  const options= { positionClass:'toast-custom' };
            this.notification.showInfo(this.chatunreadmsg + ' Unread message')
            // this.toastr.info(this.chatunreadmsg + ' Unread messages')
          } else if (this.chatunreadmsg != 0 && this.chatunreadmsg != 1) {
            this.notification.showInfo(this.chatunreadmsg + ' Unread messages')
          }
          // console.log('reversed chatbox',data)
          this.commentDataList = result['data']
        }
        setTimeout(() => {
          this.scrollchange()
        }, 1);
        // this.scrollToBottom()
      })
  }



  chatseen() {
    // seenunreadmsg
    this.taservice.seenunreadmsg(this.id)
      .subscribe(result => {
        console.log('result', result)
        this.chatunreadmsg = 0
      })

  }

  nextgetchatlist(i) {
    let numb = i + 1
    this.chatboxcurrentpage = i + 1
    this.taservice.getchatlist(this.request, numb)
      .subscribe(result => {
        let data = result['data']
        let chatpagination = result['pagination']['has_next']

        this.chatboxpagination = chatpagination
        for (let i = 0; i < data.length; i++) {
          this.commentDataList.unshift(data[i])
        }
        // this.commentDataList.unshift(data)
        console.log('this.commentdatalist', this.commentDataList)
      })
  }

  public scrollToBottom() {
    console.log('called');
    const el: HTMLDivElement = this._el.nativeElement;
    el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight);
  }

  permitupdate(e) {
    this.permitid = e
    this.permitupdatevl = true
    console.log("this.permitid", this.permitid)
    this.permittedupdate = true;
  }
  formatDate(obj) {
    // return new Date(obj);
    return this.datePipe.transform(obj, 'dd-MMM-yyyy h:mm')
  }
  setDate(date: string) {
    this.date = new Date();
    this.latest = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    this.currentDate = date
    this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    // console.log("Datttee   " + this.currentDate)
    this.currentDate = this.datePipe.transform(new Date(), "dd-MM-yyyy");
    return this.currentDate;
  }

  reson(e) {
    this.reason = e.target.value
    console.log("this.reason", this.reason)
    if (this.reason != undefined) {
      this.isapprove = false
    }
  }
  removevalues(i) {
    this.values.splice(i, 1);

  }

  totalcount: any
  pdfimgview: any
  pdfSrc: any

  CancelClick() {
    this.route.navigateByUrl('ta/canceladd');
  }


  onFileSelected(evt: any) {
    const file = evt.target.files;
    for (var i = 0; i < file.length; i++) {
      if (this.file_length == 0) {
        this.list = new DataTransfer();
        this.list.items.add(file[i]);
      }
      else {
        this.list.items.add(file[i]);
      }
      if (file[i]) {

        let stringValue = file[i].name.split('.')
        this.fileextension = stringValue.pop();
        const reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file[i]);
        this.file_length = this.file_length + 1;
      }

    }

    let myfilelist = this.list.files
    evt.target.files = myfilelist
    this.images = evt.target.files;
    console.log("this.images", this.images)
    this.totalcount = evt.target.files.length;
    this.fileData = evt.target.files
    if (this.fileData) {
      this.showreasonattach = false
    }
    console.log("fdddd", this.fileData)
    this.pdfimgview = this.fileData[0].name
    console.log("pdffff", this.pdfimgview)

  }
  handleReaderLoaded(e, extension) {
    var conversion = btoa(e.target.result)
    this.file_ext = ['jpg', 'png', 'JPG', 'JPEG', 'jpeg', 'image']
    if (this.file_ext.includes(this.fileextension)) {
      this.base64textString.push('data:image/png;base64,' + conversion);

    }
    else {
      this.base64textString.push('data:application/pdf;base64,' + conversion);
    }
  }
  filetype_check(i: string | number) {
    if (this.images.length == 0) {
      return false
    }
    let stringValue = this.images[i].name.split('.')
    this.fileextension = stringValue.pop();
    if (this.file_ext.includes(this.fileextension)) {
      var msg = 1;
    }
    else {
      var msg = 0;
    }
    return msg


  }
  createCommentform() {

    if (this.chatform.value.chat == '' || this.chatform.value.chat == null) {
      return false
    }
    var chatdata = this.chatform.value.chat
    chatdata = chatdata.replace('border="0"', 'border="2"')
    chatdata = chatdata.replace('cellspacing="0"', 'cellspacing="2"')
    chatdata = chatdata.replace('cellpadding="0"', 'cellpadding="5"')
    this.chatform.get('chat').setValue(chatdata);

    // (document.getElementById('textfield1') as HTMLInputElement).value=''

    this.data_final = {
      "request": this.request,
      "ref_type": 1,
      "approver_id": "1",
      "comment": this.chatform.value.chat,
      "type": 1
    }
    {

    }
    this.chat_service(this.data_final)
    this.chatform.patchValue({ chat: null })
  }

  scrollchange() {
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
    console.log('scrollllllllllllll', this.scroll.nativeElement.scrollTop, this.scroll.nativeElement.scrollHeight)
  }
  // ngAfterViewChecked() {        
  //   this.scrollchange();        
  // }
  chatclickscrollchanges() {
    setTimeout(() => {
      this.scrollchange()
    }, 50);
  }

  chat_service(data) {
    // this.SpinnerService.show()
    this.taservice.tourchat(data)
      .subscribe(res => {
        if (res.status === "success") {
          // this.SpinnerService.hide()
          this.chatboxcurrentpage = 1

          // this.notification.showSuccess("Message Send Successfully....")
          this.getchatlist(this.chatboxcurrentpage);
          this.chatform.value.chat = ''
          this.chatseen()
          return true;
        } else {
          // this.SpinnerService.hide()
          this.notification.showError(res.description)
          return false;
        }
      })

  }

  scrollToElement(el): void {

    this.myScrollContainer.nativeElement.scroll({
      top: this.myScrollContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }
  filetype_check2(i) {
    if (!this.attachmentlist) {
      return false
    }
    console.log(this.attachmentlist[i])
    let stringValue = this.attachmentlist[i].file_name.split('.')
    this.fileextension = stringValue.pop();
    console.log(this.fileextension)
    if (this.file_ext.includes(this.fileextension)) {
      var msg = 1;
    }
    else {
      var msg = 0;
    }
    return msg


  }

  deleteUpload(i) {
    this.base64textString.splice(i, 1);
    this.list.items.remove(i)
    this.totalcount = this.list.items.length;
    // this.fileData.FileList=this.list.files
    (<HTMLInputElement>document.getElementById("uploadFile")).files = this.list.files
    if (this.totalcount === 0) {
      (<HTMLInputElement>document.getElementById("uploadFile")).files = null
      this.showreasonattach = true;
    }
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
      console.log("this.previewUrl", this.previewUrl)

    }
  }
  startDateSelection(event: string, ind) {

    // console.log("startDate", event)
    const date = new Date(event)
    this.selectstart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    this.dateedit = true;
    (this.taForm.get('detail') as FormArray).at(ind).patchValue({
      enddate: null
    })

    let today = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    let startdate = this.datePipe.transform(this.taForm.value.detail[ind].startdate, 'yyyy-MM-dd')
    let enddate = this.datePipe.transform(this.taForm.value.detail[ind].enddate, 'yyyy-MM-dd')
    if (this.taForm.value.detail[ind].startdate != null && this.taForm.value.detail[ind].enddate != null) {
      if ((today > startdate && today > enddate)) {
        if (today == startdate || today == enddate) {
          this.taForm.get("detail")["controls"][ind].get("currentdatecheck").setValue(false)

        }
        else {
          this.taForm.get("detail")["controls"][ind].get("currentdatecheck").setValue(true)

          this.notification.showError('Requirements are not eligible for past date')
          // this.reqirementsdisable = true

        }
      }
      else {
        this.taForm.get("detail")["controls"][ind].get("currentdatecheck").setValue(false)

      }
    }


    // console.log("startttt",this.selectstart)
    // this.minselectreq(ind)
    // this.maxselectreq(ind)

  }
  endDateSelection(event: string, ind) {

    // console.log("endDate", event)
    const date = new Date(event)
    if (this.taForm.value.detail[ind + 1] != null) {
      for (var i = ind + 1; i < this.taForm.value.detail.length; i++) {
        (this.taForm.get('detail') as FormArray).at(i).patchValue({
          "enddate": null,
          "startdate": null
        })
      }
    }

    let today = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    let startdate = this.datePipe.transform(this.taForm.value.detail[ind].startdate, 'yyyy-MM-dd')
    let enddate = this.datePipe.transform(this.taForm.value.detail[ind].enddate, 'yyyy-MM-dd')


    if (this.taForm.value.detail[ind].startdate != null && this.taForm.value.detail[ind].enddate != null) {


      if ((today > startdate && today > enddate)
      ) {
        if (today == startdate || today == enddate) {

          this.taForm.get("detail")["controls"][ind].get("currentdatecheck").setValue(false)

        }
        else {
          this.taForm.get("detail")["controls"][ind].get("currentdatecheck").setValue(true)

          this.notification.showError('Requirements are not eligible for past date')
          // this.reqirementsdisable = true

        }
      }
      else {
        this.taForm.get("detail")["controls"][ind].get("currentdatecheck").setValue(false)

      }
    }


    this.selectend = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    this.dateedit = true;
    // this.minselectreq(ind)
    // this.maxselectreq(ind)

  }



  fromdateSelection(event: string) {
    // this.showdates=false
    // this.showstartdate=true
    // console.log("fromdate", event)

    // if(this.taForm.value.enddate == null || this.taForm.value.enddate =='' ){
    //  this.taForm.patchValue({
    //     enddate: this.datePipe.transform(this.taForm.value.startdate, 'yyyy-MM-dd')
    //  })

    //   this.taForm.get("enddate").setValue(this.datePipe.transform(this.taForm.value.startdate, 'yyyy-MM-dd'))
    //  return false

    // }
    const date = new Date(event)
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    this.selectend = this.select
    this.total = 0
    this.tourdatenot = true;

    this.taForm.patchValue({
      enddate: null
    })
    if (this.dateedit) {
      this.dateedit = false;
      this.notification.showError("Tour Start Date is changed so change the details according to it.");
      // (this.taForm.controls['detail'] as FormArray).clear();
      // this.addSection();
      for (let i = 0; i < this.taForm.value.detail.length; i++) {

        this.taForm.get("detail")["controls"][i].get("startdate").setValue(null)
        this.taForm.get("detail")["controls"][i].get("enddate").setValue(null)

        for (let j = 0; j < this.taForm.value.detail[i].requirements.length; j++) {
          if (this.taForm.value.detail[i].requirements.length != 0) {
            this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("checkin_time").setValue(null)
            this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("checkout_time").setValue(null)
            this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("checkindate").setValue(null)
            this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("checkintime").setValue(null)

            this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("checkoutdate").setValue(null)
            this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("checkouttime").setValue(null)

            this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("from_time").setValue(null)
            this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("fromdate").setValue(null)
            this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("fromtime").setValue(null)
          }
        }

      }
      this.taForm.patchValue({
        week_end_travel: null,

      })

      //   this.tourdetails = []
      //   this.taForm.value.detail.push({startdate:this.select,
      //     enddate:null,
      //     startingpoint:null,
      //     placeofvisit:null,
      //     purposeofvisit:null,
      // });
    }
    else {
      if (this.taForm.value.enddate == null || this.taForm.value.enddate == '') {

        this.taForm.get("enddate").setValue(new Date(this.taForm.value.startdate))
      }
    }

    this.totall = (this.total / (1000 * 60 * 60 * 24)) + 1
    // this.weekenddatecheck()

  }
  todateSelection(event: string) {
    // this.showdates=false
    // this.showstartdate=true
    // console.log("todate", event)


    const date = new Date(event)
    this.selectto = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    if (this.dateedit) {
      // this.taForm.value.detail = []
      // this.tourdetails = []
      // this.taForm.value.detail.push({
      //   startdate: this.select,
      //   enddate: null,
      //   startingpoint: null,
      //   placeofvisit: null,
      //   purposeofvisit: null,
      // });
    }
    this.total = this.selectto - this.select;
    this.totall = (Math.round(this.total) / (1000 * 60 * 60 * 24)) + 1
    if (this.tourdatenot != true) {
      this.totall = Math.round(this.totall)
    }
    console.log("tot1", this.totall)

  }
  // numberOnly(event) {
  //   var k;
  //   k = event.charCode;
  //   return ((k > 96 && k < 123) || (k >= 48 && k <= 57));
  // }
  getreasonValue() {
    this.taservice.getreasonValue()
      .subscribe(result => {
        this.reasonlist = result['data']


      })
  }

  permitbranchid: any
  getbrnchemp(id) {
    this.permitbranchid = id
    console.log("this.permitbranchid", this.permitbranchid)
    this.getemployeepermitlist()

  }
  getemployeepermitlist() {
    this.taservice.getemployeevalue(this.permitbranchid)
      .subscribe(result => {
        let datas = result['data']
        console.log("this.datas", datas)

        this.permitemployeelist = datas
      })
  }
  gettransfer() {
    this.taservice.getyesno()
      .subscribe(res => {
        this.transferList = res
        // console.log("yesnoList",this.boardingList)
      })
  }
  public transfervalueMapper = (value) => {
    let selection = this.transferList.find(e => {
      return e.value == value;
    });
    if (selection) {
      return selection.name;
    }
  };
  permitempname: any
  permitempid: any
  getpermit(data) {
    this.permitempname = data.full_name
    this.permitempid = data.id
    this.taForm.value.permittedby = this.permitempname


  }

  getbranchValue() {
    this.taservice.getbranchValue()
      .subscribe(result => {
        this.branchlist = result['data']
        this.forwardbranchlist = result['data']

      })
  }


  branchid: any = 0;
  getbranch(id) {
    this.branchid = id
    console.log("this.branchid", this.branchid)
    this.taservice.getbranchemployee("", this.branchid, this.onbehalfid)

      .subscribe((results: any[]) => {
        let datas = results;
        this.employeelist = datas;
        console.log("Employee List", this.employeelist)
      });
    // this.taservice.getbranchemployee(this.branchid)
    // .subscribe(result => {
    //   this.listBranch = result
    //   console.log("employee", this.listBranch)
    // })
    this.appeditno = false;
    this.appedit = true;
    // this.getemployeeValue()
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 62 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || k == 33 || (k >= 44 && k <= 58));
  }
  getemployeeValue() {
    // this.taservice.getbranchemployee(this.branchid)
    //   .subscribe(result => {
    //     this.employeelist = result
    //     })
  }
  forwardbranchid: any
  getforwardbranch(id) {
    this.forwardbranchid = id

    // this.taservice.getbranchemployee(this.forwardbranchid)
    //   .subscribe(result => {
    //     this.forwardemployeelist = result

    //   })
  }
  appempid: any
  getfrwdemp(data) {
    this.appempid = data.employeeid

  }
  approvalvalue(e) {
    this.approvalid = e
    this.approveupdate = true
    console.log("approval", e)
  }
  reasonid: any;
  tourreasonid: any;

  cityinter() {
    if (this.tourreasonid == 9 || this.tourreasonid == 10) {
      return
    }
    else {
      return this.citydropdown
    }
  }
  dropdown(data) {
    this.reasonselect = data
    this.reasonid = data.fileupload;
    this.tourreasonid = data.id
    this.resonupdate = true
    console.log("this.tourreasonid", this.tourreasonid)
    // if (data.id === 2) {
    //   this.showfunds = true;
    // }
    // else {
    //   this.showfunds = false;
    // }
    // if (data.id === 7 || data.id === 8 || data.name == "Transfer-Reporting") {
    //   this.showtransfer = true
    // } else {
    //   this.showtransfer = false
    // }
    // if (data.id !== 3 && data.id !== 9 && data.id !== 10) {
    //   this.showreasonattach = true;
    // }
    // else {
    //   this.showreasonattach = false;
    // }

  }
  approverempid: any
  getapprover(data) {
    this.approverempid = data.id
  }
  reasonvals(e) {
    this.value = e.target.value
  }
  cancelapprove() {
    this.data_final = {
      "id": this.tourcanid,
      "tourgid": this.tourgid,
      "apptype": "TourCancel",
      "appcomment": this.value,
      "status": "3",
    }

    this.approve_service(this.data_final)
  }
  cancelreject() {
    this.data_final = {
      "id": this.tourcanid,
      "tour_id": this.tourgid,
      "apptype": "TourCancel",
      "appcomment": this.value,
    }
    this.reject_service(this.data_final)
  }


  advancecancel() {

    if (this.onbehalfid == "") {
      this.tourcancel = {
        "tour_id": this.tourid,
        "appcomment": this.cancelform.value.canccomments,
        "apptype": "TourCancel",
        "status": 1,
        "approval": 6
      }
    }
    else {

      if (this.onbehalfid == this.empid) {
        this.tourcancel = {
          "tour_id": this.tourid,
          "appcomment": this.cancelform.value.canccomments,
          "apptype": "TourCancel",
          "status": 1,
          "approval": 6
        }
      }
      else {
        this.tourcancel = {
          "tour_id": this.tourid,
          "appcomment": this.cancelform.value.canccomments,
          "apptype": "TourCancel",
          "onbehalfof": this.onbehalfid,
          "status": 1,
          "approval": 6,
        }
      }
    }
    this.taservice.tourCancel(this.tourcancel)
      .subscribe(res => {
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Tour Cancel Request submitted Successfully....")
          this.onSubmit.emit();
          this.canceltravelclose.nativeElement.click()
          this.route.navigateByUrl('ta/ta_summary')

          return true;
        } else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
        }
      })
  }


  minselect(ind) {
    this.maximum = this.taForm.value.enddate;
    let today = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    let startdate = this.datePipe.transform(this.taForm.value.detail[ind].startdate, 'yyyy-MM-dd')
    let enddate = this.datePipe.transform(this.taForm.value.detail[ind].enddate, 'yyyy-MM-dd')


    if (this.taForm.value.detail[ind].startdate != null && this.taForm.value.detail[ind].enddate != null) {
      if ((today > startdate && today > enddate)) {
        if (today == startdate || today == enddate) {

          this.taForm.get("detail")["controls"][ind].get("currentdatecheck").setValue(false)

        }
        else {
          this.taForm.get("detail")["controls"][ind].get("currentdatecheck").setValue(true)

          // this.notification.showError('Requirements are not eligible for past date')
          // this.reqirementsdisable = true

        }
      }

      else {
        this.taForm.get("detail")["controls"][ind].get("currentdatecheck").setValue(false)

      }
    }


    if (ind == 0) {
      return this.taForm.value.startdate;
    }
    else {
      return this.taForm.value.detail[ind - 1].enddate;

    }
  }

  maxselect(ind) {
    this.maximum = this.taForm.value.enddate;

    let today = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    let startdate = this.datePipe.transform(this.taForm.value.detail[ind].startdate, 'yyyy-MM-dd')
    let enddate = this.datePipe.transform(this.taForm.value.detail[ind].enddate, 'yyyy-MM-dd')


    if (this.taForm.value.detail[ind].startdate != null && this.taForm.value.detail[ind].enddate != null) {
      if ((today > startdate && today > enddate)) {
        if (today == startdate || today == enddate) {

          this.taForm.get("detail")["controls"][ind].get("currentdatecheck").setValue(false)

        }
        else {
          this.taForm.get("detail")["controls"][ind].get("currentdatecheck").setValue(true)

          // this.notification.showError('Requirements are not eligible for past date')
          // this.reqirementsdisable = true

        }
      }

      else {
        this.taForm.get("detail")["controls"][ind].get("currentdatecheck").setValue(false)

      }
    }

    if (this.taForm.value.detail[ind].startdate == null) {
      return;
    }
    else {
      return this.taForm.value.detail[ind].startdate
    }

  }
  approve() {
    if (this.apptype == "TourCancel") {
      if (this.onbeapp != 0 && this.onbeapp != null) {
        this.data_final = {
          "id": this.approverid,
          "tourgid": this.tourid,
          "apptype": "TourCancel",
          "appcomment": this.reason,
          "status": "3",
          "onbehalf": this.onbeapp
        }
      }
      else {
        this.data_final = {
          "id": this.approverid,
          "tourgid": this.tourid,
          "apptype": "TourCancel",
          "appcomment": this.reason,
          "status": "3",
        }
      }

    }
    else {
      if (this.onbeapp != 0 && this.onbeapp != null) {
        this.data_final = {
          "id": this.approverid,
          "tourgid": this.tourid,
          "apptype": "tour",
          "applevel": "1",
          // "approvedby": this.approvedby_id,
          "appcomment": this.reason,
          "status": "3",
          "onbehalf": this.onbeapp

        }
      }
      else {
        this.data_final = {
          "id": this.approverid,
          "tourgid": this.tourid,
          "apptype": "tour",
          "applevel": "1",
          // "approvedby": this.approvedby_id,
          "appcomment": this.reason,
          "status": "3",

        }
      }
    }

    this.approve_service(this.data_final)
  }


  selectemployee(employeeid) {

    this.employeeid = employeeid['id']
    console.log("EMMMM", this.employeeid)
  }


  reject() {
    if (this.apptype == "TourCancel") {
      if (this.onbeapp != 0 && this.onbeapp != null) {
        this.data_final = {
          "id": this.approverid,
          "tour_id": this.tourid,
          "apptype": "TourCancel",
          "appcomment": this.reason,
          // "status": "3",
          "onbehalf": this.onbeapp
        }
      }
      else {
        this.data_final = {
          "id": this.approverid,
          "tour_id": this.tourid,
          "apptype": "TourCancel",
          "appcomment": this.reason,
          // "status": "3",
        }
      }
    }
    else {
      if (this.onbeapp != 0 && this.onbeapp != null) {
        this.data_final = {
          "id": this.approverid,
          "tour_id": this.tourid,
          "apptype": "tour",
          // "applevel": "1",
          // "approvedby": this.approvedby_id,
          "appcomment": this.reason,
          // "status": "3",
          "onbehalf": this.onbeapp

        }
      }
      else {
        this.data_final = {
          "id": this.approverid,
          "tour_id": this.tourid,
          "apptype": "tour",
          // "applevel": "1",
          // "approvedby": this.approvedby_id,
          "appcomment": this.reason,
          // "status": "3",

        }
      }
    }

    this.reject_service(this.data_final)
  }

  return() {

    if (this.onbeapp != 0 && this.onbeapp != null) {
      this.data_final = {
        "id": this.approverid,
        "tour_id": this.tourid,
        "apptype": "tour",
        "appcomment": this.reason,
        "onbehalf": this.onbeapp
      }
    }
    else {
      this.data_final = {
        "id": this.approverid,
        "tour_id": this.tourid,
        "apptype": "tour",
        "appcomment": this.reason,
      }
    }
    this.return_service(this.data_final)

  }
  cancelback() {
    this.route.navigateByUrl('ta/cancelapprove');
  }
  forward() {
    this.data_final = {
      "id": this.approverid,
      "tour_id": this.tourid,
      "apptype": "tour",
      "applevel": "2",
      "appcomment": this.reason,
      "approvedby": this.approvalid

    }
    this.taForm.patchValue({ empbranchgid: null })
    this.taForm.patchValue({ approval: null })
    this.forward_service(this.data_final)

  }

  frwdapprove() {
    this.data_final = {
      "id": this.frwdapproverid,
      "tour_id": this.tourid,
      "apptype": "tour",
      "applevel": "1",
      "appcomment": this.reason,
      "approvedby": this.approvedby_id

    }
    this.forwardapprove_service(this.data_final)
  }

  close_div(cls) {
    this.show_approvebtn = true;

    this.appflow = true
    this.show_approvediv = false;
    this.show_rejectdiv = false;
    this.show_returndiv = false;
    this.show_forwarddiv = false;
    this.show_forwarderapprovediv = false;
    this.tourapprove.comments = '';
  }

  approve_service(data) {
    this.SpinnerService.show()
    this.taservice.approvetourmaker(data)
      .subscribe(res => {
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Approved Successfully....")
          // this.onSubmit.emit();
          this.route.navigateByUrl('ta/ta_summary');
          // this.route.navigateByUrl('ta/ta_approve');
          return true;
        } else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
          return false;
        }
      })
  }

  reject_service(data) {
    this.SpinnerService.show()
    this.taservice.rejecttourmaker(data)
      .subscribe(res => {
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Rejected Successfully....")
          // this.onSubmit.emit();
          this.route.navigateByUrl('ta/ta_summary');
          // this.route.navigateByUrl('ta/ta_approve');
          return true;
        } else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
          return false;
        }
      })
  }
  return_service(data) {
    this.SpinnerService.show()
    this.taservice.returntourmaker(data)
      .subscribe(res => {
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Returned Successfully....")
          // this.onSubmit.emit();
          this.route.navigateByUrl('ta/ta_summary');
          // this.route.navigateByUrl('ta/ta_approve');
          return true;
        } else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
          return false;
        }
      })
  }
  forward_service(data) {
    this.isbranch = true

    if (this.approveupdate) {
      this.SpinnerService.show()
      this.taservice.forwardtourmaker(data)
        .subscribe(res => {
          if (res.status === "success") {
            this.SpinnerService.hide()
            this.notification.showSuccess("Forwarded Successfully....")
            this.onSubmit.emit();
            this.route.navigateByUrl('ta/ta_summary');
            // this.route.navigateByUrl('ta/ta_approve');
            return true;
          } else {
            this.SpinnerService.hide()
            this.notification.showError(res.description)
            return false;
          }
        })
    }
    else {
      this.notification.showWarning('Select Forwarder');
    }
  }

  forwardapprove_service(data) {
    this.SpinnerService.show()
    this.taservice.forwardtourmaker(data)
      .subscribe(res => {
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Forward Approved Successfully....")
          this.onSubmit.emit();
          this.route.navigateByUrl('ta/ta_summary');
          // this.route.navigateByUrl('ta/ta_approve');
          return true;
        } else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
          return false;
        }
      })


  }

  approve_btn(btn) {
    this.appr_option = true;
    if (btn == 1) {
      this.show_approvebtn = false;
      this.show_approvediv = true;
      // this.taForm.controls['comments'].enable();
      this.show_rejectdiv = false;
      this.show_returndiv = false;
      this.show_forwarddiv = false;
      this.show_forwarderapprovediv = false;
    }
    else if (btn == 2) {
      this.show_approvebtn = false;
      this.show_approvediv = false;
      // this.taForm.controls['comments'].enable();
      this.show_rejectdiv = true;
      this.show_returndiv = false;
      this.show_forwarddiv = false;
      this.show_forwarderapprovediv = false;
    }
    else if (btn == 3) {
      this.show_approvebtn = false;
      this.show_approvediv = false;
      this.show_rejectdiv = false;
      // this.taForm.controls['comments'].enable();
      this.show_returndiv = true;
      this.show_forwarddiv = false;
      this.show_forwarderapprovediv = false;
    }

    else if (btn == 4) {
      this.show_approvebtn = false;
      this.show_approvediv = false;
      this.show_rejectdiv = false;
      this.show_returndiv = false;
      // this.taForm.controls['comments'].enable();
      // this.taForm.controls['empbranchgid'].enable();
      // this.taForm.controls['approval'].enable();
      this.show_forwarddiv = true;
      this.feilds_disable = false;
      this.show_forwarderapprovediv = false;
    }

    else if (btn == 5) {
      this.show_approvebtn = false;
      this.show_approvediv = false;
      this.show_rejectdiv = false;
      // this.taForm.controls['comments'].enable();
      this.show_returndiv = false;
      this.show_forwarddiv = false;
      this.show_forwarderapprovediv = true;
    }
  }
  chat() {
    this.chatbox = true
  }

  back() {
    this.onCancel.emit()
    this.data = 1
    this.sharedService.summaryData.next(this.data)
    this.route.navigateByUrl('ta/ta_summary');
  }
  approveback() {
    this.onCancel.emit()
    if (this.status == 2) {
      this.data = 3
    }
    else if (this.status == 3) {
      this.data = 4
    }
    else if (this.status == 4) {
      this.data = 5
    }
    else {
      this.data = 6
    }
    this.sharedService.summaryData.next(this.data)
    this.route.navigateByUrl('ta/ta_summary');
  }
  resultimage: any
  downloadUrl: any
  attachmenturl: any
  pdffilename: any
  count: any
  viewpdfimageeee: any
  getimages() {
    this.taservice.getfetchimages(this.tourid)
      .subscribe((results) => {
        this.resultimage = results[0].url
        const file_ext = ['pdf', 'jpg', 'png', 'PDF', 'JPG', 'JPEG', 'jpeg', 'image']
        this.attachmentlist = results
        // this.count = this.attachmentlist.length
        console.log("barcode", results)
        for (var i = 0; i < results.length; i++) {

          var downloadUrl = results[i].url;
          let stringValue = results[i].file_name.split('.')
          this.fileextension = stringValue.pop();
          if (file_ext.includes(this.fileextension)) {
            continue
          }
          else if (this.file_downloaded == false) {
            this.viewpdfimageeee = window.open(downloadUrl, '_blank');
            console.log('barcode', downloadUrl)
            this.fileid = results[i].id
            console.log("this.fileid", this.fileid)
            this.getcall()
          }
        }
        this.file_downloaded = true;
      })
  }

  pdfimages: any
  fileextensions: any
  getimagedownload(id, file_name, i) {
    this.taservice.getfetchimagesss(id)
      .subscribe(result => {
        this.pdfimages = result
        let name = file_name.split('.')[0]
        let filetype = file_name.split('.')[1]
        console.log('filetypecheck', filetype)
        console.log('pdfimages', result)
        console.log('result', result)
        let xldata = [];
        xldata.push(result)
        let msg = this.getfiletype_check2(i)

        if (msg == 1) {

          let downloadUrl = window.URL.createObjectURL(new Blob(xldata));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = name + ".jpg";
          link.click();

        }
        else {

          let downloadUrl = window.URL.createObjectURL(new Blob(xldata));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = name + "." + filetype.toString();
          link.click();

        }
        // var file = new Blob([results], { type: 'application/pdf' })
        // var fileURL = window.URL.createObjectURL(file);

        // // window.open(fileURL); 
        // var a = document.createElement('a');
        // a.href = fileURL;
        // a.download = 'claim.pdf';
        // document.body.appendChild(a);
        // a.click();
      }, (error) => {
        console.log('getexcel error: ', error.error.text);
      })

  }

  getreqimagedownload(id, file_name, i) {
    this.taservice.getfetchimagesss(id)
      .subscribe(result => {
        this.pdfimages = result
        console.log('pdfimages', result)
        console.log('result', result)
        let filename = this.getviewfilelist[i]["file_name"]
        let xldata = [];
        xldata.push(result)
        let msg = this.reqfiletype_check2(i)

        if (msg == 1) {

          let downloadUrl = window.URL.createObjectURL(new Blob(xldata));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = filename + ".jpg";
          link.click();

        }
        else {

          let downloadUrl = window.URL.createObjectURL(new Blob(xldata));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = filename + ".pdf";
          link.click();

        }
        // var file = new Blob([results], { type: 'application/pdf' })
        // var fileURL = window.URL.createObjectURL(file);

        // // window.open(fileURL); 
        // var a = document.createElement('a');
        // a.href = fileURL;
        // a.download = 'claim.pdf';
        // document.body.appendChild(a);
        // a.click();
      }, (error) => {
        console.log('getexcel error: ', error.error.text);
      })

  }

  getfiletype_check2(i) {
    if (this.attachmentlist.length == 0) {
      return false
    }
    let stringValue = this.attachmentlist[i].file_name.split('.')
    this.fileextension = stringValue.pop();
    if (this.file_ext.includes(this.fileextension)) {
      var msg = 1;
    }
    else {
      var msg = 0;
    }
    return msg


  }

  submitpermit() {
    this.closebuttons.nativeElement.click();
  }
  aaaa: any
  openpdfimage(url) {
    this.taservice.getviewpdfimages(url)
      .subscribe((results) => {

        this.aaaa = results
        // this.resultimage=results[0].url
        // pdfSrc: string = '/pdf-test.pdf';
        // var fileURL: any ='/ta_210820_052848angularjs_tutorial.pdf';
        // console.log("ri",this.resultimage)
        // var a = document.createElement("a");
        // a.href = fileURL;
        // a.target = '_blank';
        // a.click();

      })
  }
  commentPopup(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    this.filesystem_error = false;
    let id = pdf_id;
    this.fileid = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    this.fileextension = stringValue.pop();
    if (this.fileextension === "pdf") {
      this.filesrc = this.imageUrl + "taserv/download_documents/" + id + "?type=pdf&token=" + token
      // this.file_window = window.open(this.pdfUrls, "_blank", 'width=600,height=400,left=200,top=200')
    }
    else if (this.fileextension.toLowerCase() === "png" || this.fileextension === "jpeg" || this.fileextension === "jpg" || this.fileextension === "JPG" || this.fileextension === "JPEG") {
      // if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {

      this.filesrc = this.imageUrl + "taserv/download_documents/" + id + "?type=" + this.fileextension + "&token=" + token
    }
    else {
      this.filesystem_error = true;
    }
  }


  closefile_window() {
    this.file_window.close()
  }

  fileDelete(fileid, ind) {
    console.log('filedelete', this.attachmentlist)
    this.attachmentlist.splice(ind, 1)
    // delete this.attachmentlist[ind]
    this.taservice.fileDelete(fileid)
      .subscribe((res) => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.notification.showWarning("Duplicate! Code Or Name ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
        }
        else {
          this.notification.showSuccess("Deleted Successfully....")
          console.log("res", res)
          this.onSubmit.emit();
          return true
        }

      })
  }

  getonbehalflist() {
    // this.SpinnerService.show()
    this.taservice.getemployeeSummary('', 1).subscribe(result => {
      console.log(result)

      this.onbehalflist = result['data']
      if (this.onbehalflist.length > 0) {
        this.showonbe = true;
      }
      this.SpinnerService.hide()
    })
  }

  fileview(ind) {
    this.filesrc = this.base64textString[ind]

    console.log(this.filesrc)
    let msg = this.filetype_check(ind);
    if (msg == 1) {
      this.pdfshow = false;
      this.imgshow = true;
    }
    else {
      this.pdfshow = true;
      this.imgshow = false
    }
  }

  fileeditview(ind) {
    let value = this.attachmentlist[ind]
    let fileid = value.id;
    let option = 'view'
    let msg = this.filetype_check2(ind);
    console.log(value, fileid, option)
    // this.commentPopup(value.id, value.file_name)
    this.taservice.viewfile(fileid, option, value).subscribe(results => {
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);

      let token = tokenValue.token;
      if (this.file_ext.includes(this.fileextension)) {
        this.filesrc = this.imageUrl + 'taserv/document_view?doc_option=' + option + '&id=' + fileid + "&type=" + this.fileextension + "&token=" + token;
      }
      else {
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        this.filesrc = downloadUrl
      }
      if (msg == 1) {
        this.pdfshow = false;
        this.imgshow = true;
      }
      else {
        this.pdfshow = true;
        this.imgshow = false
      }
    })

  }

  reqfileview(ind) {
    let value = this.getviewfilelist[ind]
    let fileid = value.id;
    let option = 'view'
    this.filesrc = this.getviewfilelist[ind].url
    console.log(this.filesrc)
    let msg = this.reqfiletype_check2(ind);
    // this.commentPopup(value.id, value.file_name)
    this.taservice.viewfile(fileid, option, value).subscribe(results => {
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);

      let token = tokenValue.token;
      if (this.file_ext.includes(this.fileextension)) {
        this.filesrc = this.imageUrl + 'taserv/document_view?doc_option=' + option + '&id=' + fileid + "&type=" + this.fileextension + "&token=" + token;
      }
      else {
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        this.filesrc = downloadUrl
      }

      if (msg == 1) {
        this.pdfshow = false;
        this.imgshow = true;
      }
      else {
        this.pdfshow = true;
        this.imgshow = false
      }
    })
  }

  reqfiletype_check2(i) {
    if (this.getviewfilelist.length == 0) {
      return false
    }
    let stringValue = this.getviewfilelist[i].file_name.split('.')
    this.fileextension = stringValue.pop();
    console.log(this.fileextension)
    if (this.file_ext.includes(this.fileextension)) {
      var msg = 1;
    }
    else {
      var msg = 0;
    }
    return msg


  }

  permitautocompleteid() {
    setTimeout(() => {
      if (this.permitmatassetidauto && this.autocompletetrigger && this.permitmatassetidauto.panel) {
        fromEvent(this.permitmatassetidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.permitmatassetidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.permitmatassetidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.permitmatassetidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.permitmatassetidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextid) {
              this.taservice.getpermittedlist(this.empid, this.permitinputasset.nativeElement.value, this.has_presentid + 1, this.onbehalfid).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.permittedlist)
                let pagination = data['pagination'];
                this.permittedlist = this.permittedlist.concat(dts);
                if (this.permittedlist.length > 0) {
                  this.has_nextid = pagination.has_next;
                  this.has_presentid = pagination.has_previous;
                  this.has_presentid = pagination.index;

                }
              })
            }
          }
        })
      }
    })

  }
  empautocompleteid() {
    setTimeout(() => {
      if (this.employeeidauto && this.autocompletetrigger && this.employeeidauto.panel) {
        fromEvent(this.employeeidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.employeeidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.employeeidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.employeeidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.employeeidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextempid) {
              this.taservice.getemployeeSummary(this.empids.nativeElement.value, this.has_presentempid + 1,).subscribe(data => {
                let dts = data['data'];
                let pagination = data['pagination'];
                this.onbehalflist = this.onbehalflist.concat(dts);
                if (this.onbehalflist.length > 0) {
                  this.has_nextempid = pagination.has_next;
                  this.has_presentempid = pagination.has_previous;
                  this.has_presentempid = pagination.index;
                }
              })
            }
          }
        })
      }
    })

  }
  branchautocompleteid() {
    setTimeout(() => {
      if (this.branchmatassetidauto && this.autocompletetrigger && this.branchmatassetidauto.panel) {
        fromEvent(this.branchmatassetidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.branchmatassetidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.branchmatassetidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.branchmatassetidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.branchmatassetidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextid) {
              this.taservice.getUsageCode(this.branchinputasset.nativeElement.value, this.has_presentid + 1).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.branchlist)
                let pagination = data['pagination'];
                this.branchlist = this.branchlist.concat(dts);

                if (this.branchlist.length > 0) {
                  this.has_nextid = pagination.has_next;
                  this.has_presentid = pagination.has_previous;
                  this.has_presentid = pagination.index;

                }
              })
            }
          }
        })
      }
    })


  }

  autocompleteid() {
    setTimeout(() => {
      if (this.matassetidauto && this.autocompletetrigger && this.matassetidauto.panel) {
        fromEvent(this.matassetidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.matassetidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.matassetidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.matassetidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.matassetidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextid) {
              this.taservice.getUsageCode(this.inputasset.nativeElement.value, this.has_presentid + 1).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.branchlist)
                let pagination = data['pagination'];
                this.branchlist = this.branchlist.concat(dts);

                if (this.branchlist.length > 0) {
                  this.has_nextid = pagination.has_next;
                  this.has_presentid = pagination.has_previous;
                  this.has_presentid = pagination.index;

                }
                // if(this.branchlists.length>0){
                //   this.has_nextid=pagination.has_next;
                //   this.has_presentid=pagination.has_previous;
                //   this.has_presentid=pagination.index;

                // }
              })
            }
          }
        })
      }
    })

  }

  cancelbrnch() {
    setTimeout(() => {
      if (this.cancidauto && this.autocompletetrigger && this.cancidauto.panel) {
        fromEvent(this.cancidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.cancidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.cancidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.cancidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.cancidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextid) {
              this.taservice.getUsageCode(this.cancinput.nativeElement.value, this.has_presentcancid + 1).subscribe(data => {
                let dts = data['data'];
                let pagination = data['pagination'];
                this.branchlist = this.branchlist.concat(dts);

                if (this.branchlist.length > 0) {
                  this.has_nextcancid = pagination.has_next;
                  this.has_presentcancid = pagination.has_previous;
                  this.has_presentcancid = pagination.index;

                }
                // if(this.branchlists.length>0){
                //   this.has_nextid=pagination.has_next;
                //   this.has_presentid=pagination.has_previous;
                //   this.has_presentid=pagination.index;

                // }
              })
            }
          }
        })
      }
    })


  }

  createItem() {
    // let group = new FormGroup({
    //   expenseid: new FormControl(''),
    //   requestercomment: new FormControl(''),
    //   tourid: new FormControl(''),
    //   same_day_return: new FormControl(''),
    //   single_fare: new FormControl(''),
    //   travel_hours: new FormControl(''),
    //   travel_mode: new FormControl('')
    // });
    let group = this.formBuilder.group({
      startdate: ['', Validators.required],
      enddate: ['', Validators.required],
      startingpoint: ['', Validators.required],
      placeofvisit: ['', Validators.required],
      purposeofvisit: ['', Validators.required],
      toplace: [''],
      client: [''],
      other_client_name: [''],
      official: "1",
      currentdatecheck: false,
      requirements: new FormArray([this.createrequirements()]),

    });

    return group;
  }
  getSections(form) {
    return form.controls.detail.controls;
  }
  addSection() {
    const data = this.taForm.get('detail') as FormArray;
    data.push(this.createItem());
  }

  removeSection(index: number) {

    (<FormArray>this.taForm.get('detail')).removeAt(index);
    this.tablewidthchange(index)
  }
  getFormArray(): FormArray {
    return this.taForm.get('detail') as FormArray;
  }
  submitForm() {

    console.log(this.taForm.value)
    // if (this.taForm.value.selfcheck == 1 && this.taForm.value.onbehalfof == 0) {
    //   this.notification.showError('Please select Onbehalf of Employee')
    //   return false;
    // }
    if (this.tourreasonid == null || this.tourreasonid == '') {
      this.notification.showError("Please select Travel Reason")
      return false;
    }

    if (this.taForm.value.startdate == "") {
      this.notification.showError("Please select Start date")
      return false;
    }
    if (this.taForm.value.enddate == null) {
      this.notification.showError("Please select End date")
      return false;
    }

    if (!this.taForm.value.accommodation_cost || !this.taForm.value.other_cost || !this.taForm.value.air_cost) {
      this.notification.showError('Please enter atleast ZERO "0" for approximate cost of Accommodation, Flight and Other..')
      return false;
    }
    // if (this.taForm.value.permittedby == "") {
    //   this.notification.showError("Please select Permitted by")
    //   return false;
    // }
    // if (this.taForm.value.ordernoremarks == "") {
    //   this.notification.showError("Please enter Remarks ")
    //   return false;
    // }

    if (this.weekendboolean == true) {
      if (this.taForm.value.week_end_travel == '') {
        this.notification.showError("Please enter explanation for weekend travel")
        return false;
      }
    }
    else {
      this.taForm.get('week_end_travel').setValue(null)
    }

    if (this.locationreason == true) {
      if (this.taForm.value.non_base_location == '' || this.taForm.value.non_base_location == null) {
        this.notification.showError("Please select explanation Non based location travel")
        this.taForm.get('non_base_location').setValue(null)
        return false;
      }
    }
    // else{
    //   this.taForm.get('non_base_location').setValue(null)
    // }


    // if (this.taForm.value.onbehalfof == 0){
    //   delete this.taForm.value.onbehalfof
    //   delete this.taForm.value.comments
    // }


    // if (this.tourreasonid == 6 || this.tourreasonid == 7 || this.tourreasonid == 8) {
    //   if (this.taForm.value.transfer_on_promotion == "") {
    //     this.notification.showError("Please Select Transfer On Promotion");
    //   }

    // }

    // if (this.tourreasonid === 2) {
    //   if (this.taForm.value.quantum_of_funds == "") {
    //     this.notification.showError("Please Enter Quantum Of Funds");
    //   }

    // }
    // if (this.tourreasonid === 1 || this.tourreasonid === 2 || this.tourreasonid === 4 || this.tourreasonid === 5 || this.tourreasonid === 6 ||
    //   this.tourreasonid === 7 || this.tourreasonid === 8 || this.tourreasonid === 11) {
    //   if (this.fileData === undefined || this.fileData === null) {
    //     this.notification.showError("Please Choose Files");
    //     throw new Error;
    //   }
    // }

    // this.taForm.value.durationdays = this.totall

    this.taForm.patchValue({
      "durationdays": this.totall
    })

    console.log(this.taForm.value.detail.length - 1)
    // console.log(this.taForm.value.enddate.getDate())
    // console.log(this.taForm.value.detail[this.taForm.value.detail.length -1].enddate.getDate())

    let myform = this.taForm.value
    // if(myform.enddate.getDate() != myform.detail[myform.detail.length -1].enddate.getDate()){
    //   console.log('Saami changes',this.taForm.value.enddate)
    //   console.log('Saami changes detail last date',this.taForm.value.detail[this.taForm.value.detail.length -1].enddate)
    //   this.notification.showError('Invalid date selection')
    //   throw new Error
    // }
    const creditdtlsdatas = this.taForm.value.detail
    for (let i in creditdtlsdatas) {
      if (creditdtlsdatas[i].startdate == '') {
        this.notification.showError('Please Select Travel Itenary Start date')
        throw new Error
      }
      if (creditdtlsdatas[i].enddate == null) {
        this.notification.showError('Please Select Travel Itenary End date')
        throw new Error
      }
      if (creditdtlsdatas[i].startingpoint == '') {
        this.notification.showError('Please Select From Place')
        throw new Error
      }
      creditdtlsdatas[i].startingpoint = creditdtlsdatas[i].startingpoint.trim()
      if (creditdtlsdatas[i].placeofvisit == '') {
        this.notification.showError('Please Select To Place')
        throw new Error
      }
      if (creditdtlsdatas[i].purposeofvisit == '') {
        this.notification.showError('Please Enter Purpose of Visit')
        throw new Error
      }
      // if (creditdtlsdatas[i].toplace == '') {
      //   this.notification.showError('Please Enter To Place')
      //   throw new Error
      // }
      if (creditdtlsdatas[i].client) {
        if (creditdtlsdatas[i].client.id) {
          if (creditdtlsdatas[i].client.client_name == 'OTHERS') {
            if (creditdtlsdatas[i].other_client_name == '') {
              this.notification.showError('Please Enter Client name')
              throw new Error
            }
          }

        }
        else {
          this.notification.showError('Please Select Client')
          throw new Error
        }
      }
      else {
        this.notification.showError('Please Select Client')
        throw new Error
      }

      this.bookavail = true;
      if (creditdtlsdatas[i].requirements.length == 0) {
        creditdtlsdatas[i].requirements = null
        this.bookavail = false;

        // return false;
      } else if (creditdtlsdatas[i].requirements[0].booking_needed == '' || creditdtlsdatas[i].requirements[0].booking_needed == null) {
        creditdtlsdatas[i].requirements = null
        this.bookavail = false;
        // return false;
      }

      var internationalboolean = false
      if (this.bookavail) {
        for (let j = 0; j < creditdtlsdatas[i].requirements.length; j++) {
          if (!creditdtlsdatas[i].requirements[j].reissue) {
            delete creditdtlsdatas[i].requirements[j].reissue;
          }


          if (creditdtlsdatas[i].requirements[j].booking_needed == '5') {
            internationalboolean = true
            console.log(internationalboolean, creditdtlsdatas[i].requirements[j].booking_needed)
          }


          if (creditdtlsdatas[i].requirements[j].Accomodationkey) {

            if (creditdtlsdatas[i].requirements[j].checkindate == '' || creditdtlsdatas[i].requirements[j].checkindate == null) {
              this.notification.showError('Please select Checkin Date')
              throw new Error
            }
            if (creditdtlsdatas[i].requirements[j].checkintime == '' || creditdtlsdatas[i].requirements[j].checkintime == null) {
              this.notification.showError('Please Enter Checkout Time')
              throw new Error
            }
            if (creditdtlsdatas[i].requirements[j].checkoutdate == '' || creditdtlsdatas[i].requirements[j].checkoutdate == null) {
              this.notification.showError('Please select Checkout Date')
              throw new Error
            }
            if (creditdtlsdatas[i].requirements[j].checkouttime == '' || creditdtlsdatas[i].requirements[j].checkouttime == null) {
              this.notification.showError('Please Enter Checkout Time')
              throw new Error
            }

            if (creditdtlsdatas[i].requirements[j].place_of_stay == '') {
              this.notification.showError('Please Enter Place Of Stay')
              throw new Error
            }
            if (creditdtlsdatas[i].requirements[j].room_type == '') {
              this.notification.showError('Please Enter Room Type')
              throw new Error
            }
            // if (creditdtlsdatas[i].requirements[j].no_of_nights == '') {
            //   this.notification.showError('Please Enter number of nights')
            //   throw new Error
            // }
            // if(creditdtlsdatas[i].requirements[j].comments==''){
            //   this.notification.showError('Please Enter To Comments')
            //   throw new Error
            // }


          }

          if (creditdtlsdatas[i].requirements[j].otherkey) {

            if (creditdtlsdatas[i].requirements[j].booking_needed == '2') {
              if (creditdtlsdatas[i].requirements[j].cab_segment == '') {
                this.notification.showError('Please Choose Cab Segment')
                throw new Error
              }
            }

            if (!creditdtlsdatas[i].requirements[j].fromdate) {
              this.notification.showError('Please Enter From Date')
              throw new Error
            }


            if (!creditdtlsdatas[i].requirements[j].fromtime) {
              this.notification.showError('Please Enter From Time')
              throw new Error
            }


            if (creditdtlsdatas[i].requirements[j].from_place == '') {
              this.notification.showError('Please Select From Place')
              throw new Error
            }
            if (creditdtlsdatas[i].requirements[j].to_place == '') {
              this.notification.showError('Please Select To Place')
              throw new Error
            }

            // if(creditdtlsdatas[i].requirements[j].comments==''){
            //   this.notification.showError('Please Enter To Comments')
            //   throw new Error
            // }
          }

        }



        for (let j = 0; j < creditdtlsdatas[i].requirements.length; j++) {

          // if( !creditdtlsdatas[i].requirements[j].Accomodationkey &&  !creditdtlsdatas[i].requirements[j].otherkey){
          //   delete creditdtlsdatas[i].requirements[j]
          //   return false
          // }




          if (creditdtlsdatas[i].requirements[j].Accomodationkey) {
            delete creditdtlsdatas[i].requirements[j].from_time
            delete creditdtlsdatas[i].requirements[j].to_time
            delete creditdtlsdatas[i].requirements[j].from_place
            delete creditdtlsdatas[i].requirements[j].to_place
            delete creditdtlsdatas[i].requirements[j].travel_type_cab
            delete creditdtlsdatas[i].requirements[j].cab_segment



            // delete creditdtlsdatas[i].requirements[j].Accomodationkey
            // delete creditdtlsdatas[i].requirements[j].otherkey

            creditdtlsdatas[i].requirements[j].checkin_time = this.datePipe.transform(creditdtlsdatas[i].requirements[j].checkin_time, 'yyyy-MM-dd HH:mm:ss');
            creditdtlsdatas[i].requirements[j].checkout_time = this.datePipe.transform(creditdtlsdatas[i].requirements[j].checkout_time, 'yyyy-MM-dd HH:mm:ss')
            console.log('DATECHANGED AT', this.datePipe.transform(creditdtlsdatas[i].requirements[j].checkin_time, 'yyyy-MM-dd HH:mm:ss'))
            console.log('DDDDD', this.datePipe.transform(creditdtlsdatas[i].requirements[j].checkout_time, 'yyyy-MM-dd HH:mm:ss')
            )

          }
          if (creditdtlsdatas[i].requirements[j].otherkey) {

            if (creditdtlsdatas[i].requirements[j].booking_needed != '2') {
              delete creditdtlsdatas[i].requirements[j].travel_type_cab
              delete creditdtlsdatas[i].requirements[j].cab_segment
              delete creditdtlsdatas[i].requirements[j].instructions
            }
            else {
              // if (creditdtlsdatas[i].requirements[j].travel_type_cab == '1') {
              //   creditdtlsdatas[i].requirements[j].from_time = null;
              //   creditdtlsdatas[i].requirements[j].from_place = null;
              //   creditdtlsdatas[i].requirements[j].to_place = null;

              // }
            }

            delete creditdtlsdatas[i].requirements[j].checkin_time
            delete creditdtlsdatas[i].requirements[j].checkout_time
            delete creditdtlsdatas[i].requirements[j].place_of_stay
            delete creditdtlsdatas[i].requirements[j].room_type
            delete creditdtlsdatas[i].requirements[j].no_of_nights
            // delete creditdtlsdatas[i].requirements[j].Accomodationkey
            // delete creditdtlsdatas[i].requirements[j].otherkey


            creditdtlsdatas[i].requirements[j].from_time = this.datePipe.transform(creditdtlsdatas[i].requirements[j].from_time, 'yyyy-MM-dd HH:mm:ss');
            creditdtlsdatas[i].requirements[j].to_time = this.datePipe.transform(creditdtlsdatas[i].requirements[j].to_time, 'yyyy-MM-dd HH:mm:ss');
            console.log('DDDDD', creditdtlsdatas[i].requirements[j].from_time)
            console.log('DDDDD', creditdtlsdatas[i].requirements[j].to_time)
          }



        }
      }


      creditdtlsdatas[i].startdate = this.datePipe.transform(creditdtlsdatas[i].startdate, 'yyyy-MM-dd HH:mm:ss.0'),
        creditdtlsdatas[i].enddate = this.datePipe.transform(creditdtlsdatas[i].enddate, 'yyyy-MM-dd HH:mm:ss.0')
    }

    for (let i in creditdtlsdatas) {
      if (creditdtlsdatas[i].client) {
        creditdtlsdatas[i].client = creditdtlsdatas[i].client.id
      }
    }

    // if(this.tourreasonid == 9 || this.tourreasonid == 10 || internationalboolean){
    //   if(this.fileData == null ){
    //     this.notification.showError('Boarding Pass Mandatory for Flight Travel')
    //     throw new Error
    //   }
    //   else if(this.fileData != null && this.fileData['length'] == 0 ){
    //     console.log(this.fileData['length'])
    //     this.notification.showError('Boarding Pass Mandatory for Flight Travel')
    //     throw new Error
    //   }
    // }
    console.log("form", this.taForm.value)
    this.taForm.value.reason = this.tourreasonid
    this.taForm.value.approval = this.approvalid
    // if (this.taForm.value.approval == null || this.taForm.value.approval == "") {
    //   this.notification.showError('Please select Approver')
    //   return false;
    // }
    this.taForm.value.permittedby = this.permitid
    this.taForm.value.accommodation_cost = Number(this.taForm.value.accommodation_cost);
    this.taForm.value.other_cost = Number(this.taForm.value.other_cost);
    this.taForm.value.air_cost = Number(this.taForm.value.air_cost)
    this.taForm.value.startdate = this.datePipe.transform(this.taForm.value.startdate, 'yyyy-MM-dd HH:mm:ss.0');
    this.taForm.value.enddate = this.datePipe.transform(this.taForm.value.enddate, 'yyyy-MM-dd HH:mm:ss.0');
    this.taForm.value.requestdate = this.datePipe.transform(this.taForm.value.requestdate, 'yyyy-MM-dd HH:mm:ss.0');
    this.taForm.value.detail.forEach(currentValue => {
      currentValue.startdate = this.datePipe.transform(currentValue.startdate, 'yyyy-MM-dd HH:mm:ss.0');
      currentValue.enddate = this.datePipe.transform(currentValue.enddate, 'yyyy-MM-dd HH:mm:ss.0');
    })

    if (this.taForm.value.enddate.split(' ')[0] != this.taForm.value.detail[this.taForm.value.detail.length - 1].enddate.split(' ')[0]) {

      console.log('log changes', this.taForm.value.enddate)
      console.log('log changes detail last date', this.taForm.value.detail[this.taForm.value.detail.length - 1].enddate)
      this.notification.showError('Invalid date selection')
      throw new Error
    }

    let deletearray = this.taForm.value;

    if (deletearray.onbehalfof == undefined) {
      delete deletearray.onbehalfof;
    }

    console.log("create", this.taForm.value)
    this.SpinnerService.show()


    if (this.list) {
      if (this.list.items.length == 0) {
        var filesenddata: any = null
      }
      else {
        var filesenddata: any = this.list.files
      }
    }
    else {
      var filesenddata: any = null
    }

    this.taservice.createtourmakers(this.taForm.value, filesenddata)
      .subscribe(res => {
        console.log("incires", res)
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Travel Created Successfully")
          this.onSubmit.emit();
          this.route.navigateByUrl('ta/ta_summary');
          return true;
        } else {
          this.taForm.patchValue({
            reason: this.reasonselect
          })
          this.SpinnerService.hide()
          this.notification.showError(res.description)
          return false;
        }
      })
  }
  EditsubmitForm() {
    // if (this.tourmodel.reason == 6 || this.tourmodel.reason == 7 || this.tourmodel.reason == 8) {
    //   if (this.taForm.value.transfer_on_promotion == "") {
    //     this.notification.showError("Please Select Transfer On Promotion");
    //   }

    // }

    // if (this.tourreasonid === 2) {
    //   if (this.taForm.value.quantum_of_funds == "") {
    //     this.notification.showError("Please Enter Quantum Of Funds");
    //   }

    // }
    // if(this.tourreasonid === 1||this.tourreasonid === 2||this.tourreasonid === 4||this.tourreasonid === 5||this.tourreasonid === 6||
    //   this.tourreasonid === 7||this.tourreasonid === 8||this.tourreasonid === 11){
    //       if(this.fileData === undefined || this.fileData === null){
    //       this.notification.showError("Please Choose Files");
    //       return false;
    //       }
    //     }

    // this.taForm.value.durationdays = this.totall
    if (this.taForm.value.reason.id) {
      if (this.taForm.value.reason == null || this.taForm.value.reason == '') {
        this.notification.showError("Please select Travel Reason")
        return false;
      }
    }
    else {
      this.notification.showError("Please select Travel Reason")
      return false;
    }

    this.taForm.patchValue({
      "durationdays": this.totall
    })
    console.log("form", this.taForm.value)
    // if (this.resonupdate) {
    //   this.taForm.value.reason = this.tourreasonid
    // }
    // else {
    //   this.taForm.value.reason = this.reasonval
    // }
    if (this.approveupdate) {
      this.taForm.value.approval = this.approvalid
    }
    else {
      this.taForm.value.approval = this.approver_data
    }

    // if (this.taForm.value.approval == null || this.taForm.value.approval == "") {
    //   this.notification.showError('Please select Approver')
    //   return false;
    // }
    if (this.permitupdatevl) {
      this.taForm.value.permittedby = this.permitid
    }
    else {
      this.taForm.value.permittedby = this.permittedby
    }



    if (this.weekendboolean == true) {
      if (this.taForm.value.week_end_travel == '') {
        this.notification.showError("Please enter explanation for weekend travel")
        return false;
      }
    }
    else {
      this.taForm.get('week_end_travel').setValue(null)
    }

    if (this.locationreason == true) {
      if (this.taForm.value.non_base_location == '' || this.taForm.value.non_base_location == null) {
        this.notification.showError("Please select explanation for Non based location travel")
        this.taForm.get('non_base_location').setValue(null)

        return false;
      }
    }
    // else{
    //   this.taForm.get('non_base_location').setValue(null)
    // }



    this.taForm.value.startdate = this.datePipe.transform(this.taForm.value.startdate, 'yyyy-MM-dd HH:mm:ss.0');
    this.taForm.value.enddate = this.datePipe.transform(this.taForm.value.enddate, 'yyyy-MM-dd HH:mm:ss.0');
    this.taForm.value.requestdate = this.datePipe.transform(this.taForm.value.requestdate, 'yyyy-MM-dd HH:mm:ss.0');
    if (this.taForm.value.startdate == "") {
      this.notification.showError("Please select Start date")
      return false;
    }
    if (this.taForm.value.enddate == null) {
      this.notification.showError("Please select End date")
      return false;
    }
    if (!this.taForm.value.accommodation_cost || !this.taForm.value.other_cost || !this.taForm.value.air_cost) {
      this.notification.showError('Please enter atleast ZERO "0" for approximate cost of Accommodation, Flight and Other..')
      return false;
    }
    // if (this.taForm.value.permittedby == "") {
    //   this.notification.showError("Please select Permitted by")
    //   return false;
    // }
    let internationalboolean = false
    // if (!this.dropdownused){
    //   this.notification.showError('Please Use city dropdown for Unselected places');
    //   throw new Error;
    // }
    const creditdtlsdatas = this.taForm.value.detail
    for (let i in creditdtlsdatas) {
      if (creditdtlsdatas[i].startdate == '') {
        this.notification.showError('Please Select Travel Itenary Start date')
        throw new Error
      }
      if (creditdtlsdatas[i].enddate == null) {
        this.notification.showError('Please Select Travel Itenary End date')
        throw new Error
      }
      if (creditdtlsdatas[i].startingpoint == '') {
        this.notification.showError('Please Enter Starting Point')
        throw new Error
      }
      if (creditdtlsdatas[i].placeofvisit == '') {
        this.notification.showError('Please Enter To Place')
        throw new Error
      }
      if (creditdtlsdatas[i].client) {
        if (creditdtlsdatas[i].client.id) {
          if (creditdtlsdatas[i].client.client_name == 'OTHERS') {
            if (creditdtlsdatas[i].other_client_name == '') {
              this.notification.showError('Please Enter Client name')
              throw new Error
            }
          }
        }
        else {
          this.notification.showError('Please Select Client')
          throw new Error
        }
      }
      else {
        this.notification.showError('Please Select Client')
        throw new Error
      }
      creditdtlsdatas[i].startingpoint = creditdtlsdatas[i].startingpoint.trim()

      // if (creditdtlsdatas[i].purposeofvisit == '') {
      //   this.notification.showError('Please Enter Purpose of Visit')
      //   throw new Error
      // }


      this.bookavail = true;

      if (creditdtlsdatas[i].requirements.length == 0) {
        creditdtlsdatas[i].requirements = null
        this.bookavail = false;

        // return false;
      } else if (creditdtlsdatas[i].requirements[0].booking_needed == '' || creditdtlsdatas[i].requirements[0].booking_needed == null) {
        creditdtlsdatas[i].requirements = null
        this.bookavail = false;
        // return false;
      }


      if (this.bookavail) {
        let newarray = creditdtlsdatas[i].requirements.filter(element => {
          return element.booking_status == 0
        })
        let length = newarray?.length ? newarray.length : 0;
        let value = creditdtlsdatas[i].requirements[length - 1]
        // console.log('editsubmitform,', value)
        // console.log('check data', this.checkcredentialdata)

        if (this.status == 3) {
          if (JSON.stringify(this.checkcredentialdata) === JSON.stringify(creditdtlsdatas)) {
            this.notification.showError('No new Requirements found')
            throw new Error
          }
        }

        if (this.taForm.value.detail[i].currentdatecheck == true) {
          if (length != 0) {
            this.notification.showError('Please delete Requirement for past date')
            throw new Error
          }
        }



        for (let j = 0; j < creditdtlsdatas[i].requirements.length; j++) {
          if (!creditdtlsdatas[i].requirements[j].reissue) {
            delete creditdtlsdatas[i].requirements[j].reissue;
          }
          if (creditdtlsdatas[i].requirements[j].Accomodationkey) {

            if (creditdtlsdatas[i].requirements[j].checkindate == '' || creditdtlsdatas[i].requirements[j].checkindate == null) {
              this.notification.showError('Please select Checkin Date')
              throw new Error
            }
            if (creditdtlsdatas[i].requirements[j].checkintime == '' || creditdtlsdatas[i].requirements[j].checkintime == null) {
              this.notification.showError('Please Enter Checkout Time')
              throw new Error
            }
            if (creditdtlsdatas[i].requirements[j].checkoutdate == '' || creditdtlsdatas[i].requirements[j].checkoutdate == null) {
              this.notification.showError('Please select Checkout Date')
              throw new Error
            }
            if (creditdtlsdatas[i].requirements[j].checkouttime == '' || creditdtlsdatas[i].requirements[j].checkouttime == null) {
              this.notification.showError('Please Enter Checkout Time')
              throw new Error
            }

            if (creditdtlsdatas[i].requirements[j].place_of_stay == '') {
              this.notification.showError('Please Enter Place Of Stay')
              throw new Error
            }
            if (creditdtlsdatas[i].requirements[j].room_type == '') {
              this.notification.showError('Please Enter Room Type')
              throw new Error
            }
            // if (creditdtlsdatas[i].requirements[j].no_of_nights == '') {
            //   this.notification.showError('Please Enter Number of nights')
            //   throw new Error
            // }


          }

          if (creditdtlsdatas[i].requirements[j].otherkey) {

            if (creditdtlsdatas[i].requirements[j].booking_needed == '2') {
              if (creditdtlsdatas[i].requirements[j].cab_segment == '') {
                this.notification.showError('Please Choose Cab Segment')
                throw new Error
              }
            }




            if (!creditdtlsdatas[i].requirements[j].fromdate) {
              this.notification.showError('Please Enter From Date')
              throw new Error
            }


            if (!creditdtlsdatas[i].requirements[j].fromtime) {
              this.notification.showError('Please Enter From Time')
              throw new Error
            }


            if (creditdtlsdatas[i].requirements[j].from_place == '' || creditdtlsdatas[i].requirements[j].from_place == null) {
              this.notification.showError('Please Enter From Place')
              throw new Error
            }
            if (creditdtlsdatas[i].requirements[j].to_place == '' || creditdtlsdatas[i].requirements[j].to_place == null) {
              this.notification.showError('Please Enter To Place')
              throw new Error
            }
          }



        }

        for (let j = 0; j < creditdtlsdatas[i].requirements.length; j++) {

          // if( !creditdtlsdatas[i].requirements[j].Accomodationkey &&  !creditdtlsdatas[i].requirements[j].otherkey){
          //   delete creditdtlsdatas[i].requirements[j]
          //   return false
          // }
          if (creditdtlsdatas[i].requirements[j].id == 0) {
            delete creditdtlsdatas[i].requirements[j].id

          }




          if (creditdtlsdatas[i].requirements[j].booking_needed == '5') {
            internationalboolean = true
            console.log(internationalboolean, creditdtlsdatas[i].requirements[j].booking_needed)
          }


          if (creditdtlsdatas[i].requirements[j].Accomodationkey) {
            delete creditdtlsdatas[i].requirements[j].from_time
            delete creditdtlsdatas[i].requirements[j].to_time
            delete creditdtlsdatas[i].requirements[j].from_place
            delete creditdtlsdatas[i].requirements[j].to_place

            delete creditdtlsdatas[i].requirements[j].fromtime
            delete creditdtlsdatas[i].requirements[j].fromdate
            delete creditdtlsdatas[i].requirements[j].travel_type_cab
            delete creditdtlsdatas[i].requirements[j].cab_segment
            delete creditdtlsdatas[i].requirements[j].instructions


            creditdtlsdatas[i].requirements[j].checkout_time = this.datePipe.transform(creditdtlsdatas[i].requirements[j].checkout_time, 'yyyy-MM-dd HH:mm:ss');
            creditdtlsdatas[i].requirements[j].checkin_time = this.datePipe.transform(creditdtlsdatas[i].requirements[j].checkin_time, 'yyyy-MM-dd HH:mm:ss');
          }

          if (creditdtlsdatas[i].requirements[j].otherkey) {

            if (creditdtlsdatas[i].requirements[j].booking_needed != '2') {
              delete creditdtlsdatas[i].requirements[j].travel_type_cab
              delete creditdtlsdatas[i].requirements[j].cab_segment
              delete creditdtlsdatas[i].requirements[j].instructions


            }
            else {
              if (creditdtlsdatas[i].requirements[j].travel_type_cab == '1') {
                //  this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("from_time").setValue(null)
                //  this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("from_place").setValue(null)
                //  this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("to_place").setValue(null)
                // creditdtlsdatas[i].requirements[j].from_time = null;
                // creditdtlsdatas[i].requirements[j].from_place = null;
                // creditdtlsdatas[i].requirements[j].to_place = null;


              }
            }


            delete creditdtlsdatas[i].requirements[j].checkin_time
            delete creditdtlsdatas[i].requirements[j].checkout_time
            delete creditdtlsdatas[i].requirements[j].place_of_stay

            delete creditdtlsdatas[i].requirements[j].checkindate
            delete creditdtlsdatas[i].requirements[j].checkintime

            delete creditdtlsdatas[i].requirements[j].checkoutdate
            delete creditdtlsdatas[i].requirements[j].checkouttime
            delete creditdtlsdatas[i].requirements[j].room_type
            delete creditdtlsdatas[i].requirements[j].no_of_nights



            creditdtlsdatas[i].requirements[j].from_time = this.datePipe.transform(creditdtlsdatas[i].requirements[j].from_time, 'yyyy-MM-dd HH:mm:ss');
            creditdtlsdatas[i].requirements[j].to_time = this.datePipe.transform(creditdtlsdatas[i].requirements[j].to_time, 'yyyy-MM-dd HH:mm:ss');

          }


        }
      }

      creditdtlsdatas[i].startdate = this.datePipe.transform(creditdtlsdatas[i].startdate, 'yyyy-MM-dd HH:mm:ss.0'),
        creditdtlsdatas[i].enddate = this.datePipe.transform(creditdtlsdatas[i].enddate, 'yyyy-MM-dd HH:mm:ss.0')


    }
    console.log(this.taForm.value.enddate.split(' ')[0])
    console.log(this.taForm.value.detail[this.taForm.value.detail.length - 1].enddate)
    if (this.taForm.value.enddate.split(' ')[0] != this.taForm.value.detail[this.taForm.value.detail.length - 1].enddate.split(' ')[0]) {


      this.notification.showError('Invalid date selection')
      throw new Error
    }
    let deletearray = this.taForm.value;

    if (deletearray.onbehalfof == undefined) {
      delete deletearray.onbehalfof;
    }

    // if(this.tourreasonid == 9 || this.tourreasonid == 10 || internationalboolean ){
    //   console.log('filedata',this.fileData)

    //   if(this.fileData == null ){
    //     this.notification.showError('Boarding Pass Mandatory for Flight Travel')
    //     throw new Error
    //   }
    //   else if(this.fileData != null && this.fileData['length'] == 0 ){
    //     this.notification.showError('Boarding Pass Mandatory for Flight Travel')
    //     throw new Error
    //   }
    // }
    let myform = this.taForm.value
    this.taForm.patchValue({
      reason: myform.reason.id
    })

    for (let i in creditdtlsdatas) {
      if (creditdtlsdatas[i].client) {
        creditdtlsdatas[i].client = creditdtlsdatas[i].client.id
      }
    }
    console.log('sasdf', this.tourreasonid)


    this.taForm.value.accommodation_cost = Number(this.taForm.value.accommodation_cost);
    this.taForm.value.other_cost = Number(this.taForm.value.other_cost);
    this.taForm.value.air_cost = Number(this.taForm.value.air_cost)
    this.taForm.value.startdate = this.datePipe.transform(this.taForm.value.startdate, 'yyyy-MM-dd HH:mm:ss.0');
    this.taForm.value.enddate = this.datePipe.transform(this.taForm.value.enddate, 'yyyy-MM-dd HH:mm:ss.0');
    this.taForm.value.requestdate = this.datePipe.transform(this.taForm.value.requestdate, 'yyyy-MM-dd HH:mm:ss.0');

    if (this.list) {
      if (this.list.items.length == 0) {
        var filesenddata: any = null
      }
      else {
        var filesenddata: any = this.list.files
      }
    }
    else {
      var filesenddata: any = null
    }



    console.log("create", this.taForm.value)
    this.SpinnerService.show()
    this.taservice.edittourmakers(this.taForm.value, filesenddata, this.id)
      .subscribe(res => {
        console.log("incires", res)
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Travel Updated Successfully")
          this.onSubmit.emit();
          this.route.navigateByUrl('ta/ta_summary');
          return true;
        } else {
          this.taForm.patchValue({
            reason: this.reasonselect
          })
          this.SpinnerService.hide()
          this.notification.showError(res.description)
          return false;
        }
      })
  }

  createrequirements() {
    let group = this.formBuilder.group({
      duplicate_booking_needed: '',
      booking_needed: "",
      comments: "",

      Accomodationkey: false,
      checkin_time: null,
      checkout_time: null,
      place_of_stay: '',
      //
      checkindate: null,
      checkintime: null,
      room_type: 'Single',
      no_of_nights: null,

      checkoutdate: null,
      checkouttime: null,
      //
      otherkey: false,
      cab_segment: '',
      instructions: '',
      travel_type_cab: '1',
      from_time: null,
      //
      fromdate: null,
      fromtime: null,
      //
      from_place: '',
      to_place: '',
      to_time: '',
      reissue: null,
    });
    return group;
  }

  addrequirements(i) {

    const datas = this.taForm.get("detail")["controls"][i].get("requirements") as FormArray;
    datas.push(this.createrequirements())

  }

  fieldGlobalind(i) {
    // let dat = this.pageSize * (this.p - 1) + i;
    return i
  }


  accomodation(i, j) {
    document.getElementById('tablesize').style.width = "227%"

    this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("Accomodationkey").setValue(true)
    this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("otherkey").setValue(false)
    console.log('nice da', this.taForm.value)
  }

  othertravels(i, j) {
    document.getElementById('tablesize').style.width = "227%"
    this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("otherkey").setValue(true)
    this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("Accomodationkey").setValue(false)
  }

  deleterequirement(i, j, data) {
    if (data.value.id) {
      this.particularrequirementdelete(data.value.id, data.value.booking_needed, i, j)
    }
    else {
      (<FormArray>this.taForm.get('detail')['controls'][i].get('requirements')).removeAt(j)
      this.tablewidthchange(i)
    }

    // }

  }

  requirementsdropdown() {


    this.taservice.gettourrequirementdropdown()
      .subscribe(res => {
        this.requirmentdropdowndata = res
        console.log('hello', res)
      })
  }

  optionselected(get, i, j, e, data) {
    console.log(i)
    console.log(j)

    // if (this.changed) {

    //   this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("travel_type_cab").setValue(null)

    //   if (get.value == 1) {
    //     // this.accomodation(i,j)
    //     this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("Accomodationkey").setValue(true)
    //     this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("otherkey").setValue(false)
    //     // this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("travel_type_cab").setValue(null)

    //   }
    //   else {
    //     // this.othertravels(i,j)
    //     this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("otherkey").setValue(true)
    //     this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("Accomodationkey").setValue(false)
    //   }
    //   if(get.value == 2){
    //     this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("travel_type_cab").setValue('1')
    //   }
    // }
  }


  changes() {
    this.changed = true;
  }

  editchange(get, i, j, e) {
    // console.log(i)
    // console.log(j)

    // // if(e.isUserInput == true){

    //   console.log('outer valu id', get.value.id)
    this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("travel_type_cab").setValue(null)

    if (get.value.booking_needed == 1) {
      // this.accomodation(i,j)
      this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("Accomodationkey").setValue(true)
      this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("otherkey").setValue(false)
      // this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("travel_type_cab").setValue(null)

    }
    else {
      // this.othertravels(i,j)
      this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("otherkey").setValue(true)
      this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("Accomodationkey").setValue(false)
    }
    if (get.value.booking_needed == 2) {
      this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("travel_type_cab").setValue('1')

    }


    if (get.value.id != undefined || get.value.id != null) {

      console.log('inner firstvalu id', get.value.id)

      if (get.value.id != 0) {

        let creditdtlsdatas = this.taForm.value.detail
        console.log(creditdtlsdatas[i].requirements[j].id)
        this.taservice.getdeleteparticularrequirement(get.value.id, get.value.duplicate_booking_needed)
          .subscribe(res => {
            if (res.status === "success") {
              this.notification.showSuccess("Success....")
              // delete this.taForm.value.detail[i].requirements[j].id
              // delete creditdtlsdatas[i].requirements[j].id
              // console.log(creditdtlsdatas[i])
              this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("id").setValue(0)
              this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("duplicate_booking_needed").setValue(get.value.booking_needed)
              return true;
            } else {
              this.notification.showError(res.description)
              return false;
            }
          })
      }

    }


  }


  getFormArraytoformarray(val): FormArray {
    return this.taForm.get('detail') as FormArray;
  }




  requirementsdata(data) {

    console.log("data for requirements", data)
    let arr = new FormArray([]);
    let edichecks = false
    if (this.approverapplevel > 0) {
      edichecks = true
    }

    for (let datass of data) {

      let acckey
      let otherkey
      if (datass.booking_needed == '1') {
        acckey = true
        otherkey = false
        document.getElementById('tablesize').style.width = "227%"
      }
      if (datass.booking_needed != '1') {
        acckey = false
        otherkey = true
        document.getElementById('tablesize').style.width = "227%"
      }

      // if(edichecks){
      // var checkintime=this.datePipe.transform(datass.checkin_time, 'dd-MM-yyyy HH:mm')
      // var checkouttime=this.datePipe.transform(datass.checkout_time,'dd-MM-yyyy HH:mm')
      // var fromtime=this.datePipe.transform(datass.from_time, 'dd-MM-yyyy HH:mm')
      // var totime=this.datePipe.transform(datass.to_time, 'dd-MM-yyyy HH:mm')
      if (datass.booking_needed == '2') {
        var travel_type_cab = datass.travel_type_cab.toString()
        var cab_segment = datass.cab_segment ? datass.cab_segment : null;
        var instructions = datass.instructions ? datass.instructions : null;
      } else {
        var travel_type_cab = null
        var cab_segment = null
      }
      var checkintime = datass.checkin_time
      var checkouttime = datass.checkout_time
      var fromtime = datass.from_time
      var totime = datass.to_time
      var no_of_nights = datass.no_of_nights
      var room_type = datass.room_type
      var checkin = new Date(checkintime)
      var checkout = new Date(checkouttime)
      console.log('date', checkin, checkout)
      var check_in_time = String(checkin.getHours()).padStart(2, '0') + ':' + String(checkin.getMinutes()).padStart(2, '0')
      var check_out_time = String(checkout.getHours()).padStart(2, '0') + ':' + String(checkout.getMinutes()).padStart(2, '0')

      var other_fromtime = new Date(fromtime)
      console.log(other_fromtime)
      var otherfromtime = String(other_fromtime.getHours()).padStart(2, '0') + ':' + String(other_fromtime.getMinutes()).padStart(2, '0')

      let dataToPushInner = this.formBuilder.group({
        id: datass.id,
        duplicate_booking_needed: datass.booking_needed.toString(),
        booking_needed: datass.booking_needed.toString(),

        travel_type_cab: travel_type_cab,
        comments: datass.comments,
        cab_segment: cab_segment,
        instructions: instructions,
        checkin_time: checkintime,
        checkout_time: checkouttime,

        checkindate: this.datePipe.transform(checkintime, 'yyyy-MM-dd'),
        checkoutdate: this.datePipe.transform(checkouttime, 'yyyy-MM-dd'),

        checkintime: check_in_time,
        checkouttime: check_out_time,

        place_of_stay: datass.place_of_stay,

        Accomodationkey: acckey,

        otherkey: otherkey,

        from_time: fromtime,


        fromdate: this.datePipe.transform(fromtime, 'yyyy-MM-dd'),
        fromtime: otherfromtime,
        room_type: room_type,
        no_of_nights: no_of_nights,
        from_place: datass.from_place,
        to_place: datass.to_place,
        reissue: datass.reissue ? datass.reissue : null,
        to_time: totime,

        booking_status: datass.booking_status,
      })
      if (acckey) {
        dataToPushInner.patchValue({


          from_time: null,
          to_time: null,
          from_place: null,
          to_place: null,

          fromtime: null,
          fromdate: null,

        })
      }
      else {

        dataToPushInner.patchValue({

          checkin_time: null,
          checkout_time: null,
          place_of_stay: null,

          checkindate: null,
          checkintime: null,

          checkoutdate: null,
          checkouttime: null,

        })

      }


      console.log("DADAF", dataToPushInner.value)
      arr.push(dataToPushInner)




    }
    return arr


  }

  tablewidthchange(i) {
    let count = 0
    let total = this.taForm.value.detail.length
    let val = 0
    let otherval = 0
    for (let l = 0; l < this.taForm.value.detail.length; l++) {
      for (let k = 0; k < this.taForm.value.detail[l].requirements.length; k++) {
        if (this.taForm.value.detail[l].requirements[k].Accomodationkey == false &&
          this.taForm.value.detail[l].requirements[k].otherkey == false) {
          count = count + 1
          // console.log('counteers',count)
        }
        otherval = otherval + 1
      }
      val = val + this.taForm.value.detail[i].requirements.length

    }
    if (count == val) {
      document.getElementById('tablesize').style.width = "156%"
    }
  }


  clientdropdown() {
    this.taservice.gettourclientdropdown()
      .subscribe(res => {
        this.clientdropdowndata = res['data']
        console.log('hello', res)
      })
  }

  particularrequirementdelete(id, type, i, j) {
    // getdeleteparticularrequirement
    this.taservice.getdeleteparticularrequirement(id, type)
      .subscribe(res => {
        if (res.status === "success") {
          this.notification.showSuccess("Success....");
          (<FormArray>this.taForm.get('detail')['controls'][i].get('requirements')).removeAt(j)
          this.tablewidthchange(i)
          return true;
        } else {
          this.notification.showError(res.description)
          return false;
        }
      }
      )
  }
  // getdeleteparticulardelete

  particulardetaildelete(id, i) {
    // getdeleteparticularrequirement
    this.taservice.getdeleteparticulardelete(id)
      .subscribe(res => {
        if (res.status === "success") {
          this.notification.showSuccess("Success....");
          (<FormArray>this.taForm.get('detail')).removeAt(i);

          return true;
        } else {
          this.notification.showError(res.description)
          return false;
        }
      }
      )
  }

  removedata(data, i) {
    console.log('data', data.value.id)
    console.log('index', i)

    if (data.value.id) {
      this.particulardetaildelete(data.value.id, i);
      this.tablewidthchange(i)
    }
    else {
      (<FormArray>this.taForm.get('detail')).removeAt(i);
      this.tablewidthchange(i);

    }

  }


  maxselectreq(i, j) {

    return this.datePipe.transform(this.taForm.value.detail[i].enddate, 'yyyy-MM-dd')


    // let date = this.datePipe.transform(this.taForm.value.detail[i].enddate, 'yyyy-MM-dd')
    // // let date=this.datePipe.transform(this.taForm.value.detail[i].startdate, 'yyyy-MM-ddTHH:mm')
    // let todaydate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    // // console.log('today date',todaydate)

    // // if (!this.feild_disable) {
    //   if (todaydate == date) {

    //     this.reqirementsdisable = false


    //     return this.datePipe.transform(date, 'yyyy-MM-dd')
    //   }
    //   else if (todaydate < date) {

    //     this.reqirementsdisable = false


    //     return this.datePipe.transform(date, 'yyyy-MM-dd')
    //   }
    //   if (todaydate > date) {

    //     this.reqirementsdisable = true

    //   }
    // }

  }

  minselectreq(i, j) {



    // let date = this.datePipe.transform(this.taForm.value.detail[i].startdate, 'yyyy-MM-dd')
    // let todaydate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    // let enddate = this.datePipe.transform(this.taForm.value.detail[i].enddate, 'yyyy-MM-dd')

    if (this.taForm.value.detail[i].requirements[j].Accomodationkey == true) {
      let date = this.datePipe.transform(this.taForm.value.detail[i].startdate, 'yyyy-MM-dd')
      let todaydate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
      let enddate = this.datePipe.transform(this.taForm.value.detail[i].enddate, 'yyyy-MM-dd')
      let checkindate = this.datePipe.transform(this.taForm.value.detail[i].requirements[j].checkindate, 'yyyy-MM-dd')

      if (todaydate > date) {
        if (this.taForm.value.detail[i].requirements[j].checkindate == null) {
          if (todaydate == date) {
            return date
          }
          else {
            return todaydate
          }

        }
        else {
          // console.log(checkindate)
          return checkindate
        }
      }
      else {
        if (this.taForm.value.detail[i].requirements[j].checkindate == null) {
          if (todaydate == date) {
            return date
          }
          else {
            return date
          }

        }
        else {
          // console.log(checkindate)
          return checkindate
        }
      }


    }

    if (this.taForm.value.detail[i].requirements[j].otherkey == true) {
      let date = this.datePipe.transform(this.taForm.value.detail[i].startdate, 'yyyy-MM-dd')
      let todaydate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
      // let enddate = this.datePipe.transform(this.taForm.value.detail[i].requirements[j].checkoutdate, 'yyyy-MM-dd')

      if (todaydate > date) {
        if (todaydate == date) {
          return date
        }
        else {
          return todaydate
        }
      }
      else {
        return date
      }

    }

  }

  maxdetailselect(i) {
    console.log()

    let today = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    let startdate = this.datePipe.transform(this.taForm.value.detail[i].startdate, 'yyyy-MM-dd')
    let enddate = this.datePipe.transform(this.taForm.value.detail[i].enddate, 'yyyy-MM-dd')


    if (this.taForm.value.detail[i].startdate != null && this.taForm.value.detail[i].enddate != null) {
      if ((today > startdate && today > enddate)) {
        if (today == startdate || today == enddate) {

          this.taForm.get("detail")["controls"][i].get("currentdatecheck").setValue(false)

        }
        else {
          this.taForm.get("detail")["controls"][i].get("currentdatecheck").setValue(true)

          // this.notification.showError('Requirements are not eligible for past date')
          // this.reqirementsdisable = true

        }
      }

      else {
        this.taForm.get("detail")["controls"][i].get("currentdatecheck").setValue(false)

      }
    }

    if (i == 0) {
      return this.taForm.value.startdate
    }
    else if (
      this.datePipe.transform(this.taForm.value.detail[i - 1].enddate, 'yyyy-MM-dd') != this.datePipe.transform(this.taForm.value.enddate, 'yyyy-MM-dd')) {
      let datenow = new Date(this.taForm.value.detail[i - 1].enddate)
      // console.log('datenow', datenow)
      let last_date = new Date(datenow.setDate(datenow.getDate() + 1))
      // console.log('datenow', last_date)


      return this.datePipe.transform(last_date, 'yyyy-MM-dd')
    }
    else {
      return this.taForm.value.detail[i - 1].enddate

    }
  }
  // gettravelonweekent

  weekendfalling(startdate, enddate, tourno, onbehalf) {
    if (tourno == 'NEW') {
      tourno = '';
    }
    if (onbehalf == 0 || onbehalf == '') {
      onbehalf = '';
    }
    this.taservice.gettravelonweekend(startdate, enddate, tourno, onbehalf)
      .subscribe(res => {
        console.log('RESULT', res)
        let checkdays = res['data']
        this.daterelaxboolean = res['date_relaxation_required']


        if (this.daterelaxboolean) {
          this.notification.showInfo(" This Travel Needs Special Permission For Date Relaxation")
        }

        if (res.ongoing_tour == false) {
          this.duplicate = false;

        }
        else {
          this.duplicate = true;
          this.notification.showError("Previous Travel Not Completed !!!")

        }

        if (checkdays.length == 0) {
          this.weekendboolean = false
        }
        else {
          this.weekendboolean = true
        }

      })
  }

  weekenddatecheck() {

    if (this.taForm.value.startdate != null && this.taForm.value.enddate != null) {
      this.weekendfalling(this.datePipe.transform(this.taForm.value.startdate, 'yyyy-MM-dd'),
        this.datePipe.transform(this.taForm.value.enddate, 'yyyy-MM-dd'), this.id, this.onbehalfid)
    }
  }

  changedatefun(i, j) {
    if (this.taForm.value.detail[i].requirements[j].checkin_time == null) {
      return false
    }
    let date = this.datePipe.transform(this.taForm.value.detail[i].requirements[j].checkin_time, 'yyyy-MM-ddTHH:mm')

    this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("checkin_time").setValue(date)

  }
  changedatecheckinfun(i, j) {
    if (this.taForm.value.detail[i].requirements[j].checkout_time == null) {
      return false
    }
    let date = this.datePipe.transform(this.taForm.value.detail[i].requirements[j].checkout_time, 'yyyy-MM-ddTHH:mm')

    this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("checkout_time").setValue(date)
  }
  changedatefromtimefun(i, j) {
    if (this.taForm.value.detail[i].requirements[j].from_time == null) {
      return false
    }
    let date = this.datePipe.transform(this.taForm.value.detail[i].requirements[j].from_time, 'yyyy-MM-ddTHH:mm')

    this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("from_time").setValue(date)
  }
  changedatetotimefun(i, j) {
    if (this.taForm.value.detail[i].requirements[j].to_time == null || this.taForm.value.detail[i].requirements[j].to_time == '') {
      return false
    }
    let date = this.datePipe.transform(this.taForm.value.detail[i].requirements[j].to_time, 'yyyy-MM-ddTHH:mm')

    this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("to_time").setValue(date)
  }

  getfileuploaded(id, type) {
    this.taservice.getreqfiles(id, type).subscribe(results => {
      console.log('file', results['data'])
      this.getviewfilelist = results['data']
    })
  }

  bookingshow(data) {
    var datas
    let val = data.value.booking_needed;
    this.reissueid = data.value.id;
    this.reqname = this.requirmentdropdowndata.find((element) =>
      element.value == val
    );
    // if(this.reqname.name == 'Accomodation'){
    //   <HTMLElement>document.getElementById('copyid').style.marginLeft = "30%";
    // }
    this.reqname = `${this.reqname?.name} Status`

    switch (Number(data.value.booking_status)) {
      case 3:
        this.reqstatus = 'Booked';
        break;
      case 2:
        this.reqstatus = 'Cancel Requested';
        break;
      case 4:
        this.reqstatus = 'Cancelled';
        break;
      case 5:
        this.reqstatus = 'Rejected';
        break;
      default:
        console.log('Invalid status');
        break;
    }
    this.SpinnerService.show();
    if (data.value.booking_needed == '1') {
      this.getfileuploaded(data.value.id, data.value.booking_needed)
      this.taservice.getacclist(data.value.id)
        .subscribe(res => {
          this.SpinnerService.hide();
          datas = res.data
          this.bookedform.patchValue({
            "id": data.value.id,

            "booking_needed": data.value.booking_needed,
            "comments": datas[0].comments,
            "checkin_time": this.datePipe.transform(datas[0].checkin_time, 'HH:mm'),
            "checkin_date": this.datePipe.transform(datas[0].checkin_time, 'yyyy-MM-dd'),
            "checkout_time": this.datePipe.transform(datas[0].checkout_time, 'HH:mm'),
            "checkout_date": this.datePipe.transform(datas[0].checkout_time, 'yyyy-MM-dd'),
            "place_of_stay": datas[0].place_of_stay,
            "Accomodationkey": data.value.Accomodationkey,
            "otherkey": data.value.otherkey,
            "from_time": this.datePipe.transform(datas[0].from_time, 'HH:mm'),
            "from_date": this.datePipe.transform(datas[0].from_time, 'yyyy-MM-dd'),
            "from_place": datas[0].from_place,
            "to_place": datas[0].to_place,
            "to_time": this.datePipe.transform(datas[0].to_time, 'yyyy-MM-ddTHH:mm'),
            "status": datas[0].booking_status,
            "ticket_amount": datas[0].ticket_amount
          })
          this.reissueform.patchValue({


            "booking_needed": data.value.booking_needed,
            "comments": datas[0].comments,
            "checkin_time": this.datePipe.transform(datas[0].checkin_time, 'HH:mm'),
            "checkin_date": this.datePipe.transform(datas[0].checkin_time, 'yyyy-MM-dd'),
            "checkout_time": this.datePipe.transform(datas[0].checkout_time, 'HH:mm'),
            "checkout_date": this.datePipe.transform(datas[0].checkout_time, 'yyyy-MM-dd'),
            "place_of_stay": datas[0].place_of_stay,
            "travel_type_cab": data.value.travel_type_cab,
            "Accomodationkey": data.value.Accomodationkey,
            "otherkey": data.value.otherkey,
            "from_time": this.datePipe.transform(datas[0].from_time, 'HH:mm'),
            "from_date": this.datePipe.transform(datas[0].from_time, 'yyyy-MM-dd'),
            "from_place": datas[0].from_place,
            "to_place": datas[0].to_place,
            "to_time": this.datePipe.transform(datas[0].to_time, 'yyyy-MM-ddTHH:mm'),
            "status": datas[0].booking_status,
            "ticket_amount": datas[0].ticket_amount,
            "room_type": datas[0].room_type ? datas[0].room_type : null,



          });


          datas[0]['requirement_code'] ? this.reqcode = datas[0]['requirement_code'] : false;
        })

    }
    else if (data.value.booking_needed == '2') {
      this.getfileuploaded(data.value.id, data.value.booking_needed)

      this.taservice.getcablist(data.value.id)
        .subscribe(res => {
          this.SpinnerService.hide();
          datas = res.data

          this.bookedform.patchValue({
            "id": data.value.id,

            "booking_needed": data.value.booking_needed,
            "comments": datas[0].comments,
            "checkin_time": this.datePipe.transform(datas[0].checkin_time, 'yyyy-MM-ddTHH:mm'),
            "checkout_time": this.datePipe.transform(datas[0].checkout_time, 'yyyy-MM-ddTHH:mm'),
            "place_of_stay": datas[0].place_of_stay,
            "Accomodationkey": data.value.Accomodationkey,
            "otherkey": data.value.otherkey,
            "from_time": this.datePipe.transform(datas[0].from_time, 'HH:mm'),
            "from_date": this.datePipe.transform(datas[0].from_time, 'yyyy-MM-dd'),
            "from_place": datas[0].from_place,
            "to_place": datas[0].to_place,
            "to_time": this.datePipe.transform(datas[0].to_time, 'yyyy-MM-ddTHH:mm'),
            "status": datas[0].booking_status,
            "ticket_amount": datas[0].ticket_amount
          })
          this.reissueform.patchValue({

            "booking_needed": data.value.booking_needed,
            "comments": datas[0].comments,
            "checkin_time": this.datePipe.transform(datas[0].checkin_time, 'yyyy-MM-ddTHH:mm'),
            "checkout_time": this.datePipe.transform(datas[0].checkout_time, 'yyyy-MM-ddTHH:mm'),
            "place_of_stay": datas[0].place_of_stay,
            "Accomodationkey": data.value.Accomodationkey,
            "otherkey": data.value.otherkey,
            "travel_type_cab": data.value.travel_type_cab,
            "from_time": this.datePipe.transform(datas[0].from_time, 'HH:mm'),
            "from_date": this.datePipe.transform(datas[0].from_time, 'yyyy-MM-dd'),
            "from_place": datas[0].from_place,
            "to_place": datas[0].to_place,
            "to_time": this.datePipe.transform(datas[0].to_time, 'yyyy-MM-ddTHH:mm'),
            "status": datas[0].booking_status,
            "ticket_amount": datas[0].ticket_amount,
            "cab_segment": datas[0].cab_segment,
            "instructions": datas[0].instructions,


          })
          datas[0]['requirement_code'] ? this.reqcode = datas[0]['requirement_code'] : false;
        })
    }

    else if (data.value.booking_needed == '3') {
      this.getfileuploaded(data.value.id, data.value.booking_needed)

      this.taservice.getbuslist(data.value.id)
        .subscribe(res => {
          this.SpinnerService.hide();
          datas = res.data

          this.bookedform.patchValue({
            "id": data.value.id,

            "booking_needed": data.value.booking_needed,
            "comments": datas[0].comments,
            "checkin_time": this.datePipe.transform(datas[0].checkin_time, 'yyyy-MM-ddTHH:mm'),
            "checkout_time": this.datePipe.transform(datas[0].checkout_time, 'yyyy-MM-ddTHH:mm'),
            "place_of_stay": datas[0].place_of_stay,

            "Accomodationkey": data.value.Accomodationkey,
            "otherkey": data.value.otherkey,
            "from_time": this.datePipe.transform(datas[0].from_time, 'HH:mm'),
            "from_date": this.datePipe.transform(datas[0].from_time, 'yyyy-MM-dd'),
            "from_place": datas[0].from_place,
            "to_place": datas[0].to_place,
            "to_time": this.datePipe.transform(datas[0].to_time, 'yyyy-MM-ddTHH:mm'),
            "status": datas[0].booking_status,
            "ticket_amount": datas[0].ticket_amount
          })
          this.reissueform.patchValue({

            "booking_needed": data.value.booking_needed,
            "comments": datas[0].comments,
            "checkin_time": this.datePipe.transform(datas[0].checkin_time, 'yyyy-MM-ddTHH:mm'),
            "checkout_time": this.datePipe.transform(datas[0].checkout_time, 'yyyy-MM-ddTHH:mm'),
            "place_of_stay": datas[0].place_of_stay,
            "travel_type_cab": data.value.travel_type_cab,
            "Accomodationkey": data.value.Accomodationkey,
            "otherkey": data.value.otherkey,
            "from_time": this.datePipe.transform(datas[0].from_time, 'HH:mm'),
            "from_date": this.datePipe.transform(datas[0].from_time, 'yyyy-MM-dd'),
            "from_place": datas[0].from_place,
            "to_place": datas[0].to_place,
            "to_time": this.datePipe.transform(datas[0].to_time, 'yyyy-MM-ddTHH:mm'),
            "status": datas[0].booking_status,
            "ticket_amount": datas[0].ticket_amount


          })
          datas[0]['requirement_code'] ? this.reqcode = datas[0]['requirement_code'] : false;
        })
    }

    else if (data.value.booking_needed == '4') {

      this.getfileuploaded(data.value.id, data.value.booking_needed)

      this.taservice.gettrainlist(data.value.id)
        .subscribe(res => {
          datas = res.data
          this.SpinnerService.hide();
          this.bookedform.patchValue({
            "id": data.value.id,
            "booking_needed": data.value.booking_needed,
            "comments": datas[0].comments,
            "checkin_time": this.datePipe.transform(datas[0].checkin_time, 'yyyy-MM-ddTHH:mm'),
            "checkout_time": this.datePipe.transform(datas[0].checkout_time, 'yyyy-MM-ddTHH:mm'),
            "place_of_stay": datas[0].place_of_stay,
            "Accomodationkey": data.value.Accomodationkey,
            "otherkey": data.value.otherkey,
            "from_time": this.datePipe.transform(datas[0].from_time, 'HH:mm'),
            "from_date": this.datePipe.transform(datas[0].from_time, 'yyyy-MM-dd'),
            "from_place": datas[0].from_place,
            "to_place": datas[0].to_place,
            "to_time": this.datePipe.transform(datas[0].to_time, 'yyyy-MM-ddTHH:mm'),
            "status": datas[0].booking_status,
            "ticket_amount": datas[0].ticket_amount
          })
          this.reissueform.patchValue({

            "booking_needed": data.value.booking_needed,
            "comments": datas[0].comments,
            "checkin_time": this.datePipe.transform(datas[0].checkin_time, 'yyyy-MM-ddTHH:mm'),
            "checkout_time": this.datePipe.transform(datas[0].checkout_time, 'yyyy-MM-ddTHH:mm'),
            "place_of_stay": datas[0].place_of_stay,
            "travel_type_cab": data.value.travel_type_cab,
            "Accomodationkey": data.value.Accomodationkey,
            "otherkey": data.value.otherkey,
            "from_time": this.datePipe.transform(datas[0].from_time, 'HH:mm'),
            "from_date": this.datePipe.transform(datas[0].from_time, 'yyyy-MM-dd'),
            "from_place": datas[0].from_place,
            "to_place": datas[0].to_place,
            "to_time": this.datePipe.transform(datas[0].to_time, 'yyyy-MM-ddTHH:mm'),
            "status": datas[0].booking_status,
            "ticket_amount": datas[0].ticket_amount


          })
          datas[0]['requirement_code'] ? this.reqcode = datas[0]['requirement_code'] : false;
        })
    }
    else if (data.value.booking_needed == '5') {
      this.getfileuploaded(data.value.id, data.value.booking_needed)

      this.taservice.getairlist(data.value.id)
        .subscribe(res => {
          datas = res.data
          this.SpinnerService.hide();
          this.bookedform.patchValue({
            "id": data.value.id,

            "booking_needed": data.value.booking_needed,
            "comments": datas[0].comments,
            "checkin_time": this.datePipe.transform(datas[0].checkin_time, 'yyyy-MM-ddTHH:mm'),
            "checkout_time": this.datePipe.transform(datas[0].checkout_time, 'yyyy-MM-ddTHH:mm'),
            "place_of_stay": datas[0].place_of_stay,
            "Accomodationkey": data.value.Accomodationkey,
            "otherkey": data.value.otherkey,
            "from_time": this.datePipe.transform(datas[0].from_time, 'HH:mm'),
            "from_date": this.datePipe.transform(datas[0].from_time, 'yyyy-MM-dd'),
            "from_place": datas[0].from_place,
            "to_place": datas[0].to_place,
            "to_time": this.datePipe.transform(datas[0].to_time, 'yyyy-MM-ddTHH:mm'),
            "status": datas[0].booking_status,
            "ticket_amount": datas[0].ticket_amount
          })
          this.reissueform.patchValue({

            "booking_needed": data.value.booking_needed,
            "comments": datas[0].comments,
            "checkin_time": this.datePipe.transform(datas[0].checkin_time, 'yyyy-MM-ddTHH:mm'),
            "checkout_time": this.datePipe.transform(datas[0].checkout_time, 'yyyy-MM-ddTHH:mm'),
            "place_of_stay": datas[0].place_of_stay,
            "travel_type_cab": data.value.travel_type_cab,
            "Accomodationkey": data.value.Accomodationkey,
            "otherkey": data.value.otherkey,
            "from_time": this.datePipe.transform(datas[0].from_time, 'HH:mm'),
            "from_date": this.datePipe.transform(datas[0].from_time, 'yyyy-MM-dd'),
            "from_place": datas[0].from_place,
            "to_place": datas[0].to_place,
            "to_time": this.datePipe.transform(datas[0].to_time, 'yyyy-MM-ddTHH:mm'),
            "status": datas[0].booking_status,
            "ticket_amount": datas[0].ticket_amount


          })
          datas[0]['requirement_code'] ? this.reqcode = datas[0]['requirement_code'] : false;
        })
    }


    this.isShowingBtn = true;
    document.getElementById('reissueDiv').style.display = "none";




    // this.bookedform.disable()
  }



  getresetbooked() {
    this.bookedform.reset()
    this.reqcode = null;
    this.copyreqcode = null;
  }

  shorttermadd(e) {
    if (e.target.checked) {
      // this.taForm.value.sortterm_travel=1
      this.taForm.get("sortterm_travel").setValue(1)

    }
    else {
      this.taForm.get("sortterm_travel").setValue(0)

      // this.taForm.value.sortterm_travel=0
    }

  }

  gettraveltype() {
    this.taservice.gettravletypedropdown()
      .subscribe(res => {
        console.log('travel type', res)
        this.traveltypedropdown = res
      })
  }

  // nonbasedlocation

  getbasedlocationarea() {
    this.taservice.nonbasedlocation(this.onbehalfid)
      .subscribe(res => {
        // console.log('employee location', res)
      })
  }

  copycode() {
    if (this.copyreqcode == this.reqcode) {
      return 'Requirement code copied';
    }
    else {
      return 'Copy requirement code'
    }

  }
  checktravelplace(e) {

    let location

    this.taservice.nonbasedlocation(this.onbehalfid)
      .subscribe(res => {
        // console.log('employee location', res)
        location = res.name


        if (e.target.value.toLowerCase() == location.toLowerCase()) {
          this.locationreason = false
          this.taForm.get("non_base_location").setValue(null)
          console.log('user travel in current location')
        }
        else {
          this.locationreason = true
          console.log('user travel in nonbased location')

        }
      })
  }

  bookingcancelation(data) {
    // getbookingcancellation
    console.log('data', data)

    this.taservice.getbookingcancellation(data.value.booking_needed, data.value.id)
      .subscribe(res => {
        console.log("incires", res)
        if (res.status === "success") {

          this.notification.showSuccess("Booking Cancel request Successfully Submitted")
          this.onSubmit.emit();

          return true;
        } else {

          this.notification.showError(res.description)
          return false;
        }
      })

  }

  getclientsearch() {
    this.taservice.getclientsearch('', 1, this.onbehalfid).subscribe(result => {
      console.log(result)
      this.clientdropdowndata = result['data']
      // console.log(this.onbehalflist)
      let datapagination = result["pagination"];

      if (this.clientdropdowndata.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.clientcurrentpage = datapagination.index;
      }
    })
  }



  clientsearch(ind, event) {
    let i = this.pageSize * (this.p - 1) + ind;

    this.clientcurrentpage = 1
    let present = this.taForm.value.detail[i].client
    console.log('present', present)
    if (present) {
      var formvalue = this.taForm.value.detail[i].client
      console.log('present && formvalue are true', present)

    }
    else {
      var formvalue = null
      console.log('null', present)

    }

    let value = event.target.value
    if (value != formvalue) {
      this.getclientsearch()

    }

    else {
      this.taservice.getclientsearch(value, 1, this.onbehalfid)
        .subscribe(result => {
          this.clientdropdowndata = result['data']
          let datapagination = result["pagination"];

          if (this.clientdropdowndata.length >= 0) {
            this.has_next = datapagination.has_next;
            this.has_previous = datapagination.has_previous;
            this.clientcurrentpage = datapagination.index;
          }
        })

    }

    // (this.taForm.get('detail') as FormArray).at(i).get('client').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       // this.isLoading = true;
    //     }),
    //     switchMap(value => this.taservice.getclientsearch(value,1))
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results['data'];
    //     this.clientdropdowndata = datas;
    //     let datapagination = results["pagination"];

    //    if (this.clientdropdowndata.length >= 0) {
    //       this.has_next = datapagination.has_next;     
    //       this.has_previous = datapagination.has_previous;
    //       this.clientcurrentpage = datapagination.index;
    //     }
    //   });

  }

  getdefaultclientsearch(e) {
    this.taservice.getclientsearch(e.target.value, 1, this.onbehalfid).subscribe(result => {
      console.log(result)
      this.clientdropdowndata = result['data']
      console.log(this.onbehalflist)
    })
  }


  autocompleteclientScroll() {
    setTimeout(() => {
      if (
        this.matAutocomplete &&
        this.autocompletetrigger &&
        this.matAutocomplete.panel
      ) {
        fromEvent(this.matAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompletetrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              console.log('autocomplete', this.has_next)
              if (this.has_next === true) {
                this.taservice.getclientsearch(this.clientInput.nativeElement.value, this.clientcurrentpage + 1, this.onbehalfid)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.clientdropdowndata = this.clientdropdowndata.concat(datas);
                    if (this.clientdropdowndata.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.clientcurrentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });

  }

  getfromtoplacedropdown() {

    this.taservice.getfromtoplace('', 1, this.onbehalfid).subscribe(result => {
      // console.log('from place to place', result)
      this.citydropdown = result['data']
      let datapagination = result['pagination']
      if (this.citydropdown.length >= 0) {
        this.cityhas_next = datapagination.has_next;
        this.cityhas_previous = datapagination.has_previous;
        this.citycurrentpage = datapagination.index;
      }
    })
  }

  getfromtoplacedropdowncheck(e) {
    if (this.tourreasonid != 9 && this.tourreasonid != 10) {
      this.taservice.getfromtoplace(e.target.value, 1, this.onbehalfid).subscribe(result => {
        // console.log('from place to place', result)
        this.citydropdown = result['data']
        let datapagination = result['pagination']
        if (this.citydropdown.length >= 0) {
          this.cityhas_next = datapagination.has_next;
          this.cityhas_previous = datapagination.has_previous;
          this.citycurrentpage = datapagination.index;
        }
      })
    }
  }

  getfromtoplacedropdownchecks(e) {
    if (this.tourreasonid != 9 && this.tourreasonid != 10) {
      this.taservice.getfromtoplaces(e.target.value, 1, this.onbehalfid).subscribe(result => {
        // console.log('from place to place', result)
        this.citydropdown = result['data']
        let datapagination = result['pagination']
        if (this.citydropdown.length >= 0) {
          this.cityhas_next = datapagination.has_next;
          this.cityhas_previous = datapagination.has_previous;
          this.citycurrentpage = datapagination.index;
        }
      })
    }
  }

  cityfromtosearch(ind, event) {
    let i = this.pageSize * (this.p - 1) + ind;

    if (this.tourreasonid != 9 && this.tourreasonid != 10) {
      this.citycurrentpage = 1
      let present = this.taForm.value.detail[i].startingpoint
      // console.log('present', present)
      if (present) {

        var formvalue = this.taForm.value.detail[i].startingpoint
        // console.log('present && formvalue are true', present)

      }
      else {
        var formvalue = null
        console.log('null', present)

      }

      let value = event.target.value
      if (value != formvalue) {
        this.getfromtoplacedropdown()

      }

      else {
        this.taservice.getfromtoplace(value, 1, this.onbehalfid)
          .subscribe(result => {
            this.citydropdown = result['data']
            let datapagination = result["pagination"];

            if (this.citydropdown.length >= 0) {
              this.cityhas_next = datapagination.has_next;
              this.cityhas_previous = datapagination.has_previous;
              this.citycurrentpage = datapagination.index;
            }
          })
      }
    }

  }
  decimalconversion(field) {
    let amt = Number(field.value).toFixed(2)
    field = field.getAttribute('formControlName')
    this.taForm.get(field).setValue(amt)
  }
  citytosearch(ind, event) {
    let i = this.pageSize * (this.p - 1) + ind;

    if (this.tourreasonid != 9 && this.tourreasonid != 10) {
      this.citycurrentpage = 1
      let present = this.taForm.value.detail[i].placeofvisit
      console.log('present', present)
      if (present) {
        var formvalue = this.taForm.value.detail[i].placeofvisit
        console.log('present && formvalue are true', present)

      }
      else {
        var formvalue = null
        console.log('null', present)

      }

      let value = event.target.value
      if (value != formvalue) {
        this.getfromtoplacedropdown()

      }

      else {
        this.taservice.getfromtoplace(value, 1, this.onbehalfid)
          .subscribe(result => {
            this.citydropdown = result['data']
            let datapagination = result["pagination"];

            if (this.citydropdown.length >= 0) {
              this.cityhas_next = datapagination.has_next;
              this.cityhas_previous = datapagination.has_previous;
              this.citycurrentpage = datapagination.index;
            }
          })
      }

      // (this.taForm.get('detail') as FormArray).at(i).get('placeofvisit').valueChanges
      //   .pipe(
      //     debounceTime(100),
      //     distinctUntilChanged(),
      //     tap(() => {
      //       // this.isLoading = true;
      //     }),
      //     switchMap(value => this.taservice.getfromtoplace(value,1))
      //   )
      //   .subscribe((results: any[]) => {
      //     let datas = results['data'];
      //     this.citydropdown = datas;
      //     let datapagination = results["pagination"];

      //    if (this.clientdropdowndata.length >= 0) {
      //     this.cityhas_next = datapagination.has_next;     
      //     this.cityhas_previous = datapagination.has_previous;
      //     this.citycurrentpage = datapagination.index;
      //     }
      //   });
    }
  }

  // @ViewChild('fromplace') clientfromplace: any;
  // @ViewChild('cityfrom') cityfrommatAutocomplete: MatAutocomplete;

  autocompletecityfromScroll() {
    setTimeout(() => {
      if (
        this.cityfrommatAutocomplete &&
        this.autocompletetrigger &&
        this.cityfrommatAutocomplete.panel
      ) {
        fromEvent(this.cityfrommatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.cityfrommatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompletetrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.cityfrommatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.cityfrommatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.cityfrommatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              console.log('autocomplete', this.cityhas_next)
              if (this.cityhas_next === true) {
                this.taservice.getfromtoplace(this.clientfromplace.nativeElement.value, this.citycurrentpage + 1, this.onbehalfid)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.citydropdown = this.citydropdown.concat(datas);
                    if (this.citydropdown.length >= 0) {
                      this.cityhas_next = datapagination.has_next;
                      this.cityhas_previous = datapagination.has_previous;
                      this.citycurrentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });

  }

  autocompletecitytoScroll() {
    // @ViewChild('toplace') toplace: any;
    // @ViewChild('cityto') citytommatAutocomplete: MatAutocomplete;
    setTimeout(() => {
      if (
        this.citytommatAutocomplete &&
        this.autocompletetrigger &&
        this.citytommatAutocomplete.panel
      ) {
        fromEvent(this.citytommatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.citytommatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompletetrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.citytommatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.citytommatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.citytommatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              console.log('autocomplete', this.cityhas_next)
              if (this.cityhas_next === true) {
                this.taservice.getfromtoplace(this.toplace.nativeElement.value, this.citycurrentpage + 1, this.onbehalfid)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.citydropdown = this.citydropdown.concat(datas);
                    if (this.citydropdown.length >= 0) {
                      this.cityhas_next = datapagination.has_next;
                      this.cityhas_previous = datapagination.has_previous;
                      this.citycurrentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });

  }

  settodropdown(ind, control) {

    let fieldname = control.getAttribute('formControlName')
    let value = this.taForm.value.detail[ind][fieldname];
    let success = false;
    this.citydropdown.forEach(element => {
      if (element.name == value || !value) {
        success = true;
      }
    })
    if (!success) {
      console.log(this.dropdownused);
      (this.taForm.get('detail') as FormArray).at(ind).get(fieldname).setValue('')
      this.notification.showWarning('Please use the given dropdown for city selection.');
    }
    else {
      this.dropdownused = false;
    }


  }
  checknonbaselocation(evt) {
    let val = this.taForm.value.detail
    this.taservice.nonbasedlocation(this.onbehalfid)
      .subscribe(res => {
        // console.log('employee location', res)
        let nonbase = res.name.toLowerCase().trim()
        if (val[0].startingpoint.toLowerCase().trim() == nonbase) {


          this.locationreason = false
          this.taForm.get("non_base_location").setValue(null)

        }
        else {
          this.locationreason = true

        }

      })

  }

  config: any = {
    airMode: false,
    tabDisable: true,
    toolbar: false,
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
      ],
      link: [['link', ['linkDialogShow', 'unlink']]],
      air: [
        [
          'font',
          [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'clear',
          ],
        ],
      ],
    },
    height: '150',
    width: '625',
    inheritPlaceholder: true,
    dialogsInBody: true,
    overflow: 'hidden',
    disableDragAndDrop: true,

    // border:false,
    // uploadImagePath: '/api/upload',
    // toolbar: [
    //   ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
    //   [
    //     'font',
    //     [
    //       'bold',
    //       'italic',
    //       'underline',
    //       'strikethrough',
    //       'superscript',
    //       'subscript',
    //       'clear',
    //     ],
    //   ],
    //   ['fontsize', ['fontname', 'fontsize', 'color']],
    //   ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
    //   ['insert', ['table', 'picture', 'link', 'video', 'hr']],
    // ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };
  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.chatform.get('chat').value);
  }

  entersendfunction(e) {
    console.log(e.target.value)
  }

  flightcitydropdown(i, j) {
    if (this.taForm.value.detail[i].requirements[j].booking_needed == '5') {
      return this.citydropdown
    }
    else {
      return
    }
  }
  flightcityvaluechanges(ind, j, event) {
    let i = this.pageSize * (this.p - 1) + ind;

    if (this.taForm.value.detail[i].requirements[j].booking_needed == '5') {
      this.citycurrentpage = 1
      let present = this.taForm.value.detail[i].requirements[j].from_place
      console.log('present', present)
      if (present) {
        var formvalue = this.taForm.value.detail[i].requirements[j].from_place
        console.log('present && formvalue are true', present)

      }
      else {
        var formvalue = null
        console.log('null', present)

      }

      let value = event.target.value
      if (value != formvalue) {
        this.getfromtoplacedropdown()

      }

      else {
        this.taservice.getfromtoplace(value, 1, this.onbehalfid)
          .subscribe(result => {
            this.citydropdown = result['data']
            let datapagination = result["pagination"];

            if (this.citydropdown.length >= 0) {
              this.cityhas_next = datapagination.has_next;
              this.cityhas_previous = datapagination.has_previous;
              this.citycurrentpage = datapagination.index;
            }
          })
      }
    }
  }


  flightcitytovaluechanges(ind, j, event) {
    let i = this.pageSize * (this.p - 1) + ind;

    if (this.taForm.value.detail[i].requirements[j].booking_needed == '5') {
      this.citycurrentpage = 1
      let present = this.taForm.value.detail[i].requirements[j].to_place
      console.log('present', present)
      if (present) {
        var formvalue = this.taForm.value.detail[i].requirements[j].to_place
        console.log('present && formvalue are true', present)

      }
      else {
        var formvalue = null
        console.log('null', present)

      }

      let value = event.target.value
      if (value != formvalue) {
        this.getfromtoplacedropdown()

      }

      else {
        this.taservice.getfromtoplace(value, 1, this.onbehalfid)
          .subscribe(result => {
            this.citydropdown = result['data']
            let datapagination = result["pagination"];

            if (this.citydropdown.length >= 0) {
              this.cityhas_next = datapagination.has_next;
              this.cityhas_previous = datapagination.has_previous;
              this.citycurrentpage = datapagination.index;
            }
          })
      }
    }
  }

  bookingneeded() {
    // console.log(this.tourreasonid)
    if (this.tourreasonid == 11) {
      // let arr=[]
      // arr.push()
      return [this.requirmentdropdowndata.find(({ name }) => name === 'Cab')]
    }
    else {
      return this.requirmentdropdowndata
    }
  }

  timeclone: any;
  timelist = [];
  totimelist = [];
  createtime() {
    for (var i = 0; i < 24; i++) {

      if (i >= 10) {
        var t00 = { 'name': i + ':00' }
        var t15 = { 'name': i + ':15' }
        var t30 = { 'name': i + ':30' }
        var t45 = { 'name': i + ':45' }
      }
      else {
        var t00 = { 'name': '0' + i + ':00' }
        var t15 = { 'name': '0' + i + ':15' }
        var t30 = { 'name': '0' + i + ':30' }
        var t45 = { 'name': '0' + i + ':45' }
      }

      this.timelist.push(t00)
      this.timelist.push(t15)
      this.timelist.push(t30)
      this.timelist.push(t45)
    }
    this.timeclone = this.timelist;
  }

  timefilter(evt) {
    let value = evt.target.value;
    this.timeclone = this.timelist.filter(function (element) {
      return element.name.includes(value)
    })
  }

  patchcheckindate(i, j) {
    const detailframe = this.taForm.value.detail[i].requirements[j]
    // this.detailframe.fromdate = this.datePipe.transform(detailframe.fromdate, 'yyyy-MM-dd ') + detailframe.fromtime + ':00'
    // this.taForm.value.detail[i].requirements[j].patchValue({
    //   checkin_time: this.datePipe.transform(this.taForm.value.detail[i].requirements[j].checkindate, 'yyyy-MM-dd ') + this.taForm.value.detail[i].requirements[j].checkintime + ':00'
    // })
    if (this.taForm.value.detail[i].requirements[j].checkintime == null || this.taForm.value.detail[i].requirements[j].checkintime == '') {
      this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("checkin_time").setValue(this.datePipe.transform(this.taForm.value.detail[i].requirements[j].checkindate, 'yyyy-MM-dd'))

    }
    else {
      this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("checkin_time").setValue(this.datePipe.transform(this.taForm.value.detail[i].requirements[j].checkindate, 'yyyy-MM-dd ') + this.taForm.value.detail[i].requirements[j].checkintime + ':00')
    }

  }

  patchcheckoutdate(i, j) {
    if (this.taForm.value.detail[i].requirements[j].checkouttime == null || this.taForm.value.detail[i].requirements[j].checkouttime == '') {
      this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("checkout_time").setValue(this.datePipe.transform(this.taForm.value.detail[i].requirements[j].checkoutdate, 'yyyy-MM-dd'))

    }
    else {
      this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("checkout_time").setValue(this.datePipe.transform(this.taForm.value.detail[i].requirements[j].checkoutdate, 'yyyy-MM-dd ') + this.taForm.value.detail[i].requirements[j].checkouttime + ':00')
    }
  }

  patchfromdate(i, j) {
    if (this.taForm.value.detail[i].requirements[j].fromtime == null || this.taForm.value.detail[i].requirements[j].fromtime == '') {
      this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("from_time").setValue(this.datePipe.transform(this.taForm.value.detail[i].requirements[j].fromdate, 'yyyy-MM-dd'))

    }
    else {
      this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("from_time").setValue(this.datePipe.transform(this.taForm.value.detail[i].requirements[j].fromdate, 'yyyy-MM-dd ') + this.taForm.value.detail[i].requirements[j].fromtime + ':00')
    }
  }


  patchcheckintime(i, j) {
    console.log(this.taForm.value.detail[i].requirements[j].checkintime)
    if (this.taForm.value.detail[i].requirements[j].checkindate == null || this.taForm.value.detail[i].requirements[j].checkindate == '') {
      this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("checkin_time").setValue(this.taForm.value.detail[i].requirements[j].checkintime + ':00')

    }
    else {
      this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("checkin_time").setValue(this.datePipe.transform(this.taForm.value.detail[i].requirements[j].checkindate, 'yyyy-MM-dd ') + this.taForm.value.detail[i].requirements[j].checkintime + ':00')
    }

  }

  patchcheckouttime(i, j) {
    if (this.taForm.value.detail[i].requirements[j].checkoutdate == null || this.taForm.value.detail[i].requirements[j].checkoutdate == '') {
      this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("checkout_time").setValue(this.taForm.value.detail[i].requirements[j].checkouttime + ':00')

    }
    else {
      this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("checkout_time").setValue(this.datePipe.transform(this.taForm.value.detail[i].requirements[j].checkoutdate, 'yyyy-MM-dd ') + this.taForm.value.detail[i].requirements[j].checkouttime + ':00')
    }
  }

  patchfromtime(i, j) {
    if (this.taForm.value.detail[i].requirements[j].fromdate == null || this.taForm.value.detail[i].requirements[j].fromdate == '') {
      this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("from_time").setValue(this.taForm.value.detail[i].requirements[j].fromtime + ':00')
    }
    else {
      this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("from_time").setValue(this.datePipe.transform(this.taForm.value.detail[i].requirements[j].fromdate, 'yyyy-MM-dd ') + this.taForm.value.detail[i].requirements[j].fromtime + ':00')
    }
  }

  totimes(i, j) {

    this.totimelist = []
    let myform = this.taForm.value.detail[i].requirements[j]
    let time = myform.checkintime;
    if (time && myform.checkindate >= myform.checkoutdate) {
      let index = this.timelist.findIndex((item) => item.name === time)
      let arr = this.timelist;
      this.totimelist = arr.slice(index + 1)
      console.log(this.totimelist)
    }
    else if (myform.checkindate < myform.checkoutdate) {
      this.totimelist = this.timelist
    }
    else {
      this.totimelist = []
    }
  }

  timedropdowncheck(ind1, ind2, time) {
    // ind = this.pagesize * (this.p - 1) + ind;
    let controlname = time.getAttribute('formControlName')
    let found = this.timelist.find(value => value.name == time.value)
    if (!found) {
      // this.notification.showError('Kindly Select Time from the given dropdown')
      this.taForm.get("detail")["controls"][ind1].get("requirements")["controls"][ind2].get(controlname).setValue(null)
    }

  }
  totimefil(evt) {
    let value = evt.target.value;
    this.totimelist = this.totimelist.filter(function (element) {
      return element.name.includes(value)
    })
  }

  numberOnly(event) {
    return Number(event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46 || event.charCode == 58);
  }

  skiprm() {
    this.taservice.skiprmapproval(this.id).subscribe(res => {
      if (res.status == 'success') {
        this.notification.showSuccess(res.message || res.description);
        this.route.navigateByUrl('ta/ta_summary')
      }
      else {
        this.notification.showError(res.description)
      }
    })
  }

  employeesearch(e) {
    this.has_presentempid = 1
    if (e.target.value == '') {
      this.empcode = null
      this.empdesign = null;
    }
    this.taservice.getemployeeSummary(e.target.value, this.has_presentempid).subscribe(data => {
      let dts = data['data'];
      let pagination = data['pagination'];
      this.onbehalflist = dts;
      if (this.onbehalflist.length > 0) {
        this.has_nextempid = pagination.has_next;
        this.has_presentempid = pagination.has_previous;
        this.has_presentempid = pagination.index;
      }
    })
  }

  nextchatsummary(i) {

    if (this.scroll.nativeElement.scrollTop == 0) {
      if (this.chatboxpagination == true) {
        console.log('you are on top')
        let numb = i + 1
        this.chatboxcurrentpage = i + 1
        this.taservice.getchatlist(this.request, numb)
          .subscribe(result => {
            let data = result['data']
            let chatpagination = result['pagination']['has_next']

            this.chatboxpagination = chatpagination
            for (let i = 0; i < data.length; i++) {
              this.commentDataList.unshift(data[i])
            }
            // this.commentDataList.unshift(data)
            console.log('this.commentdatalist', this.commentDataList)
          })
      }
    }
  }

  getcabtypes() {
    // getcabtypes
    this.taservice.getcabtypes()
      .subscribe(res => {
        console.log('travel type', res)
        this.cabtypesdropdown = res
      })
  }



  gettourdelete(chatid, tourid, i) {
    console.log('chatid', chatid, 'tourid', tourid)

    this.taservice.getdeletechatmessage(chatid, tourid)
      .subscribe(res => {
        if (res.status === "success") {
          this.notification.showSuccess("Success....")
          // this.notification.showSuccess("Comment deleted")
          this.commentDataList[i].comment = 'This message was deleted'
          this.commentDataList[i].status = 0
          return true;
        } else {
          this.notification.showError(res.description)
          return false;
        }
      }
      )
  }

  otherclientchoose(value, i) {
    if (value.client_name == 'OTHERS') {
      this.taForm.get("detail")["controls"][i].get("other_client_name").setValue('')
    }
  }


  getundomessage(chatid, tourid, i) {

    this.taservice.getundochatmessage(chatid, tourid)
      .subscribe(res => {

        if (res.data.length != 0) {
          this.commentDataList.splice(i, 1)
          this.commentDataList.splice(i, 0, res.data[0])

          console.log(res)
        }


      }
      )

  }

  showissuedata() {
    this.isShowingBtn = false;
    document.getElementById('reissueDiv').style.display = "block";
  }

  fieldGIndex(index) {
    let dat = this.pageSize * (this.p - 1) + index;
    return dat
  }

  numbersOnly(event) {
    return (event.charCode >= 48 && event.charCode <= 58 || event.charCode == 46)
  }

  startDateSelectionReissue(event: string) {

  }
  minselectreissue() {


  }





  submitdata() {

  }


  maxselectreissue() {

  }

  checkValues() {
    let fValue = this.reissueform.get('checkin_time');
    let sValue = this.reissueform.get('checkout_time');
    if (sValue < fValue) {
      console.log(fValue.value + sValue.value);
      this.notification.showError("CheckOut time is greater than CheckIn Time");
    }

  }

  getid(ind) {
    this.index1 = ind;
  }

  reissuess() {
    var num = this.index1;
    let chekarray = this.taForm.value.detail[num].requirements;
    chekarray.forEach(element => {
      if (element.reissue == this.reissueid) {
        this.notification.showError('Reissue already created for ' + this.reqcode + ' kindly submit it');
        throw new Error;
      }
    });

    this.addrequirements(num);

    let length = this.taForm.value.detail[num].requirements.length;
    let myform = this.reissueform.value;

    (this.taForm.get('detail') as FormArray).at(num).get("requirements")["controls"][length - 1].patchValue({
      booking_needed: myform.booking_needed,
      comments: myform.comments,
      Accomodationkey: myform.Accomodationkey,
      place_of_stay: myform.place_of_stay ? myform.place_of_stay : null,
      checkindate: myform.checkin_date ? myform.checkin_date : null,
      checkintime: myform.checkin_time ? myform.checkin_time : null,
      checkoutdate: myform.checkout_date ? myform.checkout_date : null,
      checkouttime: myform.checkout_time ? myform.checkout_time : null,
      room_type: myform.room_type ? myform.room_type : null,
      checkin_time: myform.checkin_date && myform.checkin_time ? this.datePipe.transform(myform.checkin_date + ' ' + myform.checkin_time, 'yyyy-MM-dd HH:mm:ss') : null,
      checkout_time: myform.checkout_date && myform.checkout_time ? this.datePipe.transform(myform.checkout_date + ' ' + myform.checkout_time, 'yyyy-MM-dd HH:mm:ss') : null,

      otherkey: myform.otherkey ? myform.otherkey : null,
      travel_type_cab: myform.travel_type_cab ? myform.travel_type_cab : null,
      // from_time: myform.from_time ? myform.from_time:null,
      fromdate: myform.from_date ? myform.from_date : null,
      from_time: myform.from_date && myform.from_time ? this.datePipe.transform(myform.from_date + ' ' + myform.from_time, 'yyyy-MM-dd HH:mm:ss') : null,
      fromtime: myform.from_time ? myform.from_time : null,
      from_place: myform.from_place ? myform.from_place : null,
      to_place: myform.to_place ? myform.to_place : null,
      reissue: this.reissueid,
      cab_segment: myform.cab_segment ? myform.cab_segment : null,
      instructions: myform.instructions ? myform.instructions : null,

      // reissue: this.reissueid ? this.reissueid :null,
    })
    this.notification.showSuccess('Reissue requirement created successfully for ' + this.reqcode);
  }

  getcarsegment() {

    this.taservice.getcabsegment()
      .subscribe(res => {
        console.log('car Segment', res)
        this.cabsegments = res
      })
  }
  // roomtypes
  getroomtypes() {

    this.taservice.getroomtype()
      .subscribe(res => {
        console.log('Room Type', res)
        this.roomtypes = res
      })
  }

  nightDiff(ind, j) {
    let i = this.pageSize * (this.p - 1) + ind;

    if (this.taForm.value.detail[i].requirements[j].booking_needed == '1') {
      this.nStart = new Date(this.datePipe.transform(this.taForm.value.detail[i].requirements[j].checkin_date + ' ' + this.taForm.value.detail[i].requirements[j].checkin_time, 'yyyy-MM-dd HH:mm:ss'));
      this.nEnd = new Date(this.datePipe.transform(this.taForm.value.detail[i].requirements[j].checkout_date + ' ' + this.taForm.value.detail[i].requirements[j].checkout_time, 'yyyy-MM-dd HH:mm:ss'));

      this.Time = this.nEnd - this.nStart;
      this.Nights = Math.floor(this.Time / (1000 * 3600 * 24)); //Diference in Days
      (this.taForm.get('detail') as FormArray).at(i).get('requirements')['controls'][j].patchValue({
        no_of_nights: this.Nights
      });
    }


  }
  cabseg(val) {
    if (val) {
      let array = this.cabsegments.slice(0);
      array = array.filter(element => {
        return element.value.includes(val);
      })
      return array
    }
    else if (val == '') {
      return this.cabsegments;
    }
    else {
      return []
    }
  }

}