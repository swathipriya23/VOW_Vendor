import { Component, OnInit, Output, EventEmitter, ViewChild, HostListener, ElementRef, ɵbypassSanitizationTrustUrl, Sanitizer, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray, Form } from '@angular/forms';
// import domtoimage from 'dom-to-image';s
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import { TaService } from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from 'src/environments/environment'
import { ShareService } from '../share.service';
import { ErrorHandlingService } from '../error-handling.service';
import { NgxSpinnerService } from "ngx-spinner";

const isSkipLocationChange = environment.isSkipLocationChange

import { finalize, switchMap, debounceTime, distinctUntilChanged, tap, map, takeUntil } from 'rxjs/operators';
import * as $ from 'jquery';
import 'jqueryui';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MY_FORMATS } from 'src/app/ppr/ppr-active-client/ppr-active-client.component';
import { NullTemplateVisitor } from '@angular/compiler';
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
  selector: 'app-tamaker-edit',
  templateUrl: './tamaker-edit.component.html',
  styleUrls: ['./tamaker-edit.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
})

export class TamakerEditComponent implements OnInit, AfterViewInit {
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
  @ViewChild('accbook') accbook: any;
  @ViewChild('trainbook') trainbook: any;
  @ViewChild('busbook') busbook: any;
  @ViewChild('cabbook') cabbook: any;
  @ViewChild('airbook') airbook: any;
  @ViewChild('bookstatus') bookings: any;
  @ViewChild('employee_gid') matemployee_gidauto: MatAutocomplete;

  @ViewChild('clientInput') clientInput: any;
  @ViewChild('client') matAutocomplete: MatAutocomplete;

  @ViewChild('scroll', { static: true }) scroll: any;
  //bookingspopups

  //Drag Resize Chat Window started
  @ViewChild('modalcon') modalContentChat: ElementRef;
  @ViewChild('modalhead') modalHeaderChat: ElementRef;
  @ViewChild('modalbody') modelBody: ElementRef;
  @ViewChild('modaldialog') modelDialogs: ElementRef;
  //Drag Resize Chat Window ended
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
  fileData: File;
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
  feild_disable: boolean = true
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
  loadover = false;

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
  isaction: boolean = false
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
  ngreload = true;

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
  acccancel: boolean = false;
  cabcancel: boolean = false;
  aircancel: boolean = false;
  traincancel: boolean = false;
  buscancel: boolean = false;
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
  cabtravels: FormControl;

  requirmentdropdowndata: any;
  bookingstatus: any;
  statusselected: any;
  clientdropdowndata: any;
  trainForm: FormGroup
  accomodationForm: FormGroup
  busForm: FormGroup
  airForm: FormGroup
  cabForm: FormGroup
  getaccom: any;
  accbtn: boolean
  trainbtn: boolean
  busbtn: boolean
  airbtn: boolean
  cabbtn: boolean
  bookid: any;
  checkDate: string;
  checkoutDate: string;
  fromdate: string;
  todate: string;
  bookstatus: any;
  createacc: boolean
  createtrain: boolean
  createair: boolean
  createbus: boolean
  createcab: boolean
  bookdata: any;
  book: any;
  getcablist: any;
  getairlist: any;
  gettrainlist: any;
  getbuslist: any;
  cancelstatus: any;
  bookedstatus: any;
  showpopup: boolean = false;

  intertravel: boolean = false;
  weekendboolean: boolean = false;
  bookbtn: boolean = false;
  updatebtn: boolean = false;
  cancelbtn: boolean = false;
  cancelupdbtn: boolean = false;
  index1: any;
  index2: any;
  detailcopy: any
  currentstatus: any;
  mindate: any;
  maxdate: any;
  reqfile: any;
  traveltypedropdown: any;
  clupcab: boolean = false;
  grouptour: any;
  chatboxpagination: boolean = false;
  chatboxcurrentpage: number = 1;
  getviewfilelist = [];
  buscanForm: FormGroup;
  aicanrForm: FormGroup;
  cabcanForm: FormGroup;
  traincanForm: FormGroup;
  acccanForm: FormGroup;
  aircanForm: FormGroup;
  afboooked: { key: string; value: number; }[];

  has_next = true;
  has_previous = true;
  clientcurrentpage = 1
  chatunreadmsg: any = null;
  acc_inp: any = null;
  cab_inp: any = null;
  train_inp: any = null;
  bus_inp: any = null;
  flight_inp: any = null;
  acc_inpid: any = null;
  cab_inpid: any = null;
  train_inpid: any = null;
  bus_inpid: any = null;
  flight_inpid: any = null;
  yesnoList = [{ name: 'YES', value: 1 }, { name: 'NO', value: 0 }];
  currentof: any;
  locationreason = false;
  reqid: string;
  cancelreqid: any;
  hideonbe: boolean = false;
  filename: any;
  showtravelfiles: boolean = false;
  bookinpstatus: { key: string; value: number; }[];
  copyvalue: any;
  cabtypesdropdown: any;
  showpersonal = false;
  showofficial = false;
  showperoff = false;
  // showcabdtls: boolean;
  isMaximize: boolean = false;
  cancellimit: Date;
  bookedamount: number;
  nonbaselist: any;
  reqcode = null;
  copyreqcode: string;
  reissuecode: any;
  cabsegment: any;
  roomtype: any;
  nStart: any;
  nEnd: any;
  Time: number;
  Nights: number;
  branchdetail=null;


  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private http: HttpClient,
    private notification: NotificationService, private taservice: TaService,
    public sharedService: SharedService, private shareservice: ShareService, private SpinnerService: NgxSpinnerService,
    private route: Router, private activatedroute: ActivatedRoute, private errorHandler: ErrorHandlingService,) { }
  //tourmodel= new Tourmaker(1,'',1,'','',3,'',1)

  //Drag Resize , Min Max Window  Chat Window Started
  ngAfterViewInit(): void {
    let modalContent = $(this.modalContentChat.nativeElement);
    let modalHeader = $(this.modalHeaderChat.nativeElement);
    let modalBody1 = $(this.modelBody.nativeElement);
    let modalDialogg = $(this.modelDialogs.nativeElement);
    modalHeader.addClass('cursor-all-scroll');
    //modalContent.draggable({
    // cursor: "all-scroll",
    // handle: modalHeader
    //});
    modalDialogg.draggable({
      cursor: "all-scroll",
      handle: modalHeader
    })
    modalContent.resizable({
      minHeight: 370,
      minWidth: 750,
      handles: 'n, e, s, w, se, ne, sw, nw'
    });

  }
  minimize() {
    document.getElementById('modal-dialog1').style.width = "40px";
    document.getElementById('modal-body1').style.height = "130px";
    document.getElementById('modal-body1').style.width = "";
    document.getElementById('modal-body1').style.display = "flex";



  }
  maximize() {
    this.isMaximize = !this.isMaximize;
    document.getElementById('modal-dialog1').style.width = "fit-content";
    document.getElementById('modal-body1').style.height = "70vh";
    document.getElementById('modal-body1').style.width = "1200px";
    document.getElementById('modal-body1').style.padding = "0";
    document.getElementById('modal-body1').style.display = "flex";
    //document.getElementById('chatbox1').style.width = "1300px";
    document.getElementById('modal-dialog1').style.top = "0px";

  }

  restore() {
    this.isMaximize = !this.isMaximize;
    document.getElementById('modal-dialog1').style.width = "50vw";
    document.getElementById('modal-body1').style.height = "50vh";
    document.getElementById('modal-body1').style.width = "";
    document.getElementById('modal-body1').style.display = "flex";
  }


  //Drag Resize Min Max Window Chat Window Ended

  ngOnInit(): void {
    this.SpinnerService.show()
    const params = new URL(window.location.href).searchParams;
    let tourid = params.get('tour_id');
    if (tourid) {
      this.objectassign(tourid);
    }
    this.tour_summary = JSON.parse(localStorage.getItem('tourmakersummary'))
    // status=  tour_id= && statuschangeid=
    let values = this.shareservice.radiovalue.value
    let employeedata = JSON.parse(localStorage.getItem('sessionData'))
    this.status = this.tour_summary.tour_status_id
    this.employeeid = employeedata.employee_id
    this.apptype = this.tour_summary.apptype
    // this.statusselected = 1
    this.bookingstatus = [{
      key: 'Not Booked',
      value: 0
    }, {
      key: 'Booked',
      value: 3
    }, {
      key: 'Inprogress',
      value: -1
    },
    {
      key: 'Rejected',
      value: 5
    }
    ]
    // this.bookinpstatus = [{
    //   key: 'Not Booked',
    //   value: 0
    // }, {
    //   key: 'Booked',
    //   value: 3
    // }, {
    //   key: 'Inprogress',
    //   value: -1
    // }]

    this.afboooked = [
      {
        key: 'Booked',
        value: 2
      },
      {
        key: 'Cancelled',
        value: 4
      },
      {
        key: 'View',
        value: 5
      }]
    this.bookedstatus = [
      {
        key: 'Booked',
        value: 3
      },
      {
        key: 'Cancelled',
        value: 4
      },
      {
        key: 'View',
        value: 5
      }]

    this.cancelstatus = [
      {
        key: 'Cancelled',
        value: 4
      },
      {
        key: 'View',
        value: 5
      }]
    if (this.apptype == "TOUR CANCEL") {
      this.tourcanceltype = true
    }
    this.radiovalue = values
    let datas = this.tour_summary;
    const logindata = JSON.parse(localStorage.getItem("sessionData"))
    if (logindata) {
      this.log_emp = logindata.employee_id;
    }
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
    this.selflist = [{
      id: 0,
      name: 'Self'
    },
    {
      id: 1,
      name: 'Onbehalf of'
    }]
    this.accomodationForm = this.formBuilder.group({
      requirement_code: null,
      checkin_time: null,
      fromtime: null,
      checkout_time: null,
      totime: null,
      place_of_stay: null,
      ticket_amount: null,
      ticket_amount_personal: null,
      comments: null,
      admin_paid: 0,
      total_a: null,
      vendor_name: null,
      total_b: null,
      amount_saved: null,
      room_type: null,
      ticket_no: null,
      nac_rate: null,
      rack_rate_night: null,
      no_of_nights: null,
      PNR: null,
      website: 'via.com',
      room_number: null,
      reissue: null,
    })
    this.trainForm = this.formBuilder.group({
      requirement_code: null,
      from_time: null,
      frtime: null,
      ttime: null,
      to_time: null,
      from_place: null,
      to_place: null,
      ticket_amount: null,
      ticket_amount_personal: null,
      comments: null,
      admin_paid: 1,
      difference_inamount: null,
      vendor_name: null,
      fare_quoted: null,
      cost_per_head: null,
      issuance_type: null,
      ticket_no: null,
      PNR: null,
      website: 'via.com',
      train_number: null,
      reissue: null,

    })
    this.cabForm = this.formBuilder.group({
      requirement_code: null,
      cabtravels: [],
      from_time: null,
      frtime: null,
      ttime: null,
      to_time: null,
      from_place: null,
      to_place: null,
      ticket_amount: null,
      ticket_amount_personal: null,
      comments: null,
      admin_paid: 1,
      vendor_name: null,
      ticket_no: null,
      cab_number: null,
      difference_inamount: null,
      travel_type_cab: null,
      fare_quoted: null,
      cost_per_head: null,
      issuance_type: null,
      PNR: null,
      invoice_date: null,
      website: 'via.com',
      reissue: null,
      cab_segment: null,
    })
    this.airForm = this.formBuilder.group({
      requirement_code: null,
      vendor_name: null,
      from_time: null,
      frtime: null,
      ttime: null,
      to_time: null,
      from_place: null,
      to_place: null,
      ticket_amount: null,
      ticket_amount_personal: null,
      comments: null,
      admin_paid: 1,
      difference_inamount: null,
      fare_quoted: null,
      cost_per_head: null,
      issuance_type: null,
      ticket_no: null,
      PNR: null,
      website: 'via.com',
      flight_number: null,
      ref_no: null,
      reissue: null,
    })
    this.busForm = this.formBuilder.group({
      requirement_code: null,
      from_time: null,
      to_time: null,
      frtime: null,
      ttime: null,
      from_place: null,
      to_place: null,
      ticket_amount: null,
      ticket_amount_personal: null,
      comments: null,
      admin_paid: 1,
      bus_number: null,
      seat_number: null,
      vendor_name: null,
      ticket_no: null,
      difference_inamount: null,
      fare_quoted: null,
      cost_per_head: null,
      issuance_type: null,
      PNR: null,
      website: 'via.com',
      reissue: null,
    })
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
      ordernoremarks: ['', Validators.required],
      permittedby: ['', Validators.required],
      empbranchgid: ['', Validators.required],
      comments: ['', Validators.required],
      chat: '',
      transfer_on_promotion: 0,
      quantum_of_funds: null,
      opening_balance: null,
      onbehalfof: this.onbehalfid,
      week_end_travel: null,
      non_base_location: null,
      accommodation_cost: null,
      other_cost: null,
      air_cost: null,

      detail: new FormArray([
        this.createItem(),

      ]),
      // data: new FormArray([]),
    });
    let onbehalf = JSON.parse(localStorage.getItem('onbehalf'))
    // if (this.tour_summary.onbehalfof) {
    //   this.taForm.get('selfcheck').setValue(1);
    //   this.onbehalfname = onbehalf.onbename;
    //   this.onbehalfid = this.tour_summary.empgid
    //   this.app = onbehalf.app
    // }
    if (datas['id'] != 0) {
      // this.empname = "(" + this.tour_summary.employee_code + ") " + this.tour_summary.employee_name
      // this.empgrade = this.tour_summary.empgrade
      // this.empcode = this.tour_summary.employee_code
      // this.empdesign = this.tour_summary.empdesignation
      // this.empid = this.tour_summary.empgid
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
        this.empname = "(" + results['code'] + ") " + results['full_name']
        this.empgrade = results['grade']
        this.empid = results['id']
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
        this.tourmakersummary(data['tourid'], data['id']);
        this.request = data['tourid'] | data['id']
        this.getchatlist(1);
        this.getappflow(this.request);

        this.travelfiles(this.request);
      }

    }
    else {
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


      this.feild_disable = true;
      this.feilds_disable = true;
      this.show_approvebtn = false;
      // this.show_submitbtn = true;

    }
    // this.taForm.controls['reason'].disable();
    this.taForm.controls['detail'].disable();
    // this.taForm.disable();
    // this.getreasonValue();
    if (this.approverapplevel == 0 && (this.status == null || this.status == 2 || this.status == 3)) {
      // this.getbranchValue();
      this.gettransfer();
      this.getreasonValue();
    }

    // this.getemployeeValue();
    this.getnonbaselist();
    this.createtime();
    this.requirementsdropdown()
    // this.clientdropdown()
    this.gettraveltype()
    this.getcabseg();
    this.getroomtype();
    this.cancelforms()
    this.getcabtypes();

    // this.loadover = false;
  }//ngOnInit

  getcabtypes() {
    // getcabtypes
    this.taservice.getcabtypes()
      .subscribe(res => {
        // console.log('travel type', res)
        this.cabtypesdropdown = res
      })
  }
  cancelforms() {
    this.acccanForm = this.formBuilder.group({
      requirement_id: null,
      booking_type: 1,
      cancel_reschedule: null,
      cancel_reason: null,
      refund_amount: null,
      fare_difference: null,
      loss_of_cancelation: null,
      refund_date: null,
      cancelled_date: null
    })
    this.traincanForm = this.formBuilder.group({
      requirement_id: null,
      booking_type: 4,
      cancel_reschedule: null,
      cancel_reason: null,
      refund_amount: null,
      fare_difference: null,
      loss_of_cancelation: null,
      refund_date: null,
      cancelled_date: null
    })
    this.cabcanForm = this.formBuilder.group({
      requirement_id: null,
      booking_type: 2,
      cancel_reschedule: null,
      cancel_reason: null,
      refund_amount: null,
      fare_difference: null,
      loss_of_cancelation: null,
      refund_date: null,
      cancelled_date: null
    })
    this.aircanForm = this.formBuilder.group({

      requirement_id: null,
      booking_type: 5,
      cancel_reschedule: null,
      cancel_reason: null,
      refund_amount: null,
      fare_difference: null,
      loss_of_cancelation: null,
      refund_date: null,
      cancelled_date: null
    })
    this.buscanForm = this.formBuilder.group({
      requirement_id: null,
      booking_type: 3,
      cancel_reschedule: null,
      cancel_reason: null,
      refund_amount: null,
      fare_difference: null,
      loss_of_cancelation: null,
      refund_date: null,
      cancelled_date: null
    })

    // this.SpinnerService.hide()
  }

  copyInputMessage(inputElement) {
    this.copyvalue = inputElement.value;
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }



  getappflow(id) {
    this.taservice.getapproveflowalllist(id)
      .subscribe(res => {
        this.approvalflowlist = res['approve']


      });
  }
  travelfiles(id) {
    this.taservice.getfetchimages(id)
      .subscribe((results) => {
        if (results['data']) {
          this.attachmentlist = results['data']

          if (this.attachmentlist.length > 0) {
            this.showtravelfiles = true;
          }
          else {
            this.showtravelfiles = false;
          }
        }
      })
  }

  currentsts(ind1, ind2) {
    this.currentstatus = this.taForm.value.detail[ind1].requirements[ind2].booking_status
  }

  copytext(copy) {
    if (this.copyvalue == copy.value) {
      return 'Text copied';
    }
    else {
      return 'Copy Text'
    }

  }

  copycode() {
    if (this.copyreqcode == this.reqcode) {
      return 'Requirement code copied';
    }
    else {
      return 'Copy requirement code'
    }

  }

  showvalue(val) {
    return val.value
  }
  accBook(evt) {
    this.checkDate = this.datePipe.transform(this.accomodationForm.value.checkin_time, 'yyyy-MM-dd ') + this.accomodationForm.value.fromtime + ':00'
    this.checkoutDate = this.datePipe.transform(this.accomodationForm.value.checkout_time, 'yyyy-MM-dd ') + this.accomodationForm.value.totime + ':00'

    this.data_final = {
      "requirement_id": this.bookid,
      "checkin_time": this.checkDate,
      "checkout_time": this.checkoutDate,
      "place_of_stay": this.accomodationForm.value.place_of_stay,
      "ref_no": null,
      "booking_status": 3,
      "travel_detail": 1,
      "ticket_amount": Number(this.accomodationForm.value.ticket_amount),
      "ticket_amount_personal": Number(this.accomodationForm.value.ticket_amount_personal),
      "comments": this.accomodationForm.value.comments,
      "admin_paid": this.accomodationForm.value.admin_paid,
      "vendor_name": this.accomodationForm.value.vendor_name,
      "amount_saved": Number(this.accomodationForm.value.amount_saved),
      "nac_rate": Number(this.accomodationForm.value.nac_rate),
      "rack_rate_night": Number(this.accomodationForm.value.rack_rate_night),
      "room_type": this.accomodationForm.value.room_type,
      "total_a": Number(this.accomodationForm.value.total_a),
      "total_b": Number(this.accomodationForm.value.total_b),
      "no_of_nights": Number(this.accomodationForm.value.no_of_nights),
  
      "website": this.accomodationForm.value.website,
      "ticket_no": this.accomodationForm.value.ticket_no,
      "PNR": this.accomodationForm.value.PNR,
      "requirement_code": this.reqcode,
    }
    this.acc_Book(this.data_final, this.index1, this.index2, evt)
  }

  acc_Book(data, ind1, ind2, evt) {
    // this.SpinnerService.show()
    if (this.list) {
      var files = this.list.files
    }
    else {
      files = null
    }
    this.taservice.acc_Book(data, files, evt)
      .subscribe(res => {
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.statusok(ind1, ind2);
          this.notification.showSuccess("Accomodation Booked Successfully....");
          (this.taForm.controls['detail'] as FormArray).clear();
          this.tourmakersummary(this.id, this.tourid)
          this.accbook.nativeElement.click();
          this.onSubmit.emit();
          // this.resetbookingfiles(evt)
          return true;
        } else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
          return false;
        }
      })




  }

  resetbookingfiles(evt) {
    this.copyreqcode = null;
    this.reqcode = null;
    this.fileData = null;
    this.list = evt.target.files
    this.file_length = 0
    this.base64textString.splice(0, this.base64textString.length);
    this.getviewfilelist.splice(0, this.getviewfilelist.length);
    (<HTMLInputElement>document.getElementById("uploadFile1")).value = null

  }

  statusfail(ind1, ind2) {
    this.taForm.get("detail")["controls"][ind1].get("requirements")["controls"][ind2].get("booking_status").setValue(this.currentstatus)
  }
  statusok(ind1, ind2) {
    this.taForm.get("detail")["controls"][ind1].get("requirements")["controls"][ind2].get("booking_status").setValue(3)
  }
  statuscanok(ind1, ind2) {
    this.taForm.get("detail")["controls"][ind1].get("requirements")["controls"][ind2].get("booking_status").setValue(4)
  }

  reqsenable() {
    this.accomodationForm.enable()
    this.cabForm.enable()
    this.busForm.enable()
    this.trainForm.enable()
    this.airForm.enable()
  }
  trainBook(e) {
    this.fromdate = this.datePipe.transform(this.trainForm.value.from_time, 'yyyy-MM-dd ') + this.trainForm.value.frtime + ':00'
    this.todate = this.datePipe.transform(this.trainForm.value.to_time, 'yyyy-MM-dd ') + this.trainForm.value.ttime + ':00'
    let bookamt = Number(this.trainForm.value.ticket_amount);
    // if (bookamt == null || bookamt == 0) {
    //   this.notification.showError("Please Enter Booking Amount")
    //   throw new Error()
    // }
    this.data_final = {
      "requirement_id": this.bookid,
      "from_time": this.fromdate,
      "to_time": null,
      "from_place": this.trainForm.value.from_place,
      "to_place": this.trainForm.value.to_place,
      "ref_no": null,
      "ref_type": 2,
      "booking_status": 3,
      "travel_detail": 1,
      "pnr_no": "good",
      "train_number":this.trainForm.value.train_number,
      "ticket_amount": Number(this.trainForm.value.ticket_amount),
      "ticket_amount_personal": Number(this.trainForm.value.ticket_amount_personal),
      "vendor_name": this.trainForm.value.vendor_name,
      "comments": this.trainForm.value.comments,
      "admin_paid": this.trainForm.value.admin_paid,
      "cost_per_head": Number(this.trainForm.value.cost_per_head),
      "issuance_type": this.trainForm.value.issuance_type,
      "difference_inamount": Number(this.trainForm.value.difference_inamount),
      "fare_quoted": Number(this.trainForm.value.fare_quoted),
      "website": this.trainForm.value.website,
      "ticket_no": this.trainForm.value.ticket_no,
      "PNR": this.trainForm.value.PNR,
      "requirement_code": this.reqcode,
    }
    this.train_Book(this.data_final, this.index1, this.index2, e)
  }

  train_Book(data, ind1, ind2, e) {
    if (this.list) {
      var files = this.list.files
    }
    else {
      files = null
    }
    // this.SpinnerService.show()
    this.taservice.train_Book(data, files)
      .subscribe(res => {
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.statusok(ind1, ind2);
          this.notification.showSuccess("Train Booked Successfully....");
          (this.taForm.controls['detail'] as FormArray).clear();
          this.tourmakersummary(this.id, this.tourid)
          this.trainbook.nativeElement.click()
          this.onSubmit.emit();
          // this.resetbookingfiles(e)
          return true;
        } else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
          return false;
        }
      })



  }
  busBook(e) {
    this.fromdate = this.datePipe.transform(this.busForm.value.from_time, 'yyyy-MM-dd ') + this.busForm.value.frtime + ':00'
    this.todate = this.datePipe.transform(this.busForm.value.to_time, 'yyyy-MM-dd ') + this.busForm.value.ttime + ':00'
    let bookamt = Number(this.busForm.value.ticket_amount)
    // if (bookamt == null || bookamt == 0) {
    //   this.notification.showError("Please Enter Booking Amount")
    //   throw new Error()
    // }
    this.data_final = {
      "requirement_id": this.bookid,
      "from_time": this.fromdate,
      "to_time": null,
      "from_place": this.busForm.value.from_place,
      "to_place": this.busForm.value.to_place,
      "ref_no": null,
      "ref_type": 2,
      "booking_status": 3,
      "tour": 1,
      "ticket_amount": Number(this.busForm.value.ticket_amount),
      "ticket_amount_personal": Number(this.busForm.value.ticket_amount_personal),
      "comments": this.busForm.value.comments,
      "admin_paid": this.busForm.value.admin_paid,
      "vendor_name": this.busForm.value.vendor_name,
      "seat_number": this.busForm.value.seat_number,
      "ticket_no": this.busForm.value.ticket_no,
      "bus_number": this.busForm.value.bus_number,
      "cost_per_head": Number(this.busForm.value.cost_per_head),
      "issuance_type": this.busForm.value.issuance_type,
      "difference_inamount": Number(this.busForm.value.difference_inamount),
      "fare_quoted": Number(this.busForm.value.fare_quoted),
      "website": this.busForm.value.website,
      // "ticket_no": this.accomodationForm.value.ticket_no,
      "PNR": this.busForm.value.PNR,
      "requirement_code": this.reqcode,
    }
    this.bus_Book(this.data_final, this.index1, this.index2, e)
  }
  bus_Book(data, ind1, ind2, e) {

    if (this.list) {
      var files = this.list.files
    }
    else {
      files = null
    }
    this.taservice.bus_Book(data, files)
      .subscribe(res => {
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.statusok(ind1, ind2);
          this.notification.showSuccess("Bus Booked Successfully....");
          (this.taForm.controls['detail'] as FormArray).clear();
          this.tourmakersummary(this.id, this.tourid)
          this.busbook.nativeElement.click()
          this.onSubmit.emit();
          // this.resetbookingfiles(e)
          return true;
        } else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
          return false;
        }
      })



  }
  cabBook(e) {
    this.fromdate = this.datePipe.transform(this.cabForm.value.from_time, 'yyyy-MM-dd ') + this.cabForm.value.frtime + ':00'
    this.todate = this.datePipe.transform(this.cabForm.value.to_time, 'yyyy-MM-dd ') + this.cabForm.value.ttime + ':00'
    let myform = this.cabForm.value.cabtravels
    let idarray = null;
    if (myform) {
      idarray = this.cabForm.value.cabtravels.concat(this.bookid)
    }
    else {
      idarray = [this.bookid]
    }
    // if (this.showcabdtls == false) {
    //   this.fromdate = null;
    //   this.todate = null;
    // }
    this.data_final = {
      "requirement_id": idarray,
      "from_time": this.fromdate,
      "to_time": null,
      "from_place": this.cabForm.value.from_place,
      "to_place": this.cabForm.value.to_place,
      "ref_no": null,
      "ref_type": 2,
      "booking_status": 3,
      "tour": 1,
      "ticket_amount": Number(this.cabForm.value.ticket_amount),
      "ticket_amount_personal": Number(this.cabForm.value.ticket_amount_personal),
      "comments": this.cabForm.value.comments,
      "admin_paid": this.cabForm.value.admin_paid,
      "vendor_name": this.cabForm.value.vendor_name,
      "travel_type_cab": this.cabForm.value.travel_type_cab,
      "cab_segment": this.cabForm.value.cab_segment,
      "ticket_no": this.cabForm.value.ticket_no,
      "cab_number": this.cabForm.value.cab_number,
      "cost_per_head": Number(this.cabForm.value.cost_per_head),
      "invoice_date": this.datePipe.transform(this.cabForm.value.invoice_date, 'yyyy-MM-dd HH:mm:ss'),
      "issuance_type": this.cabForm.value.issuance_type,
      "difference_inamount": Number(this.cabForm.value.difference_inamount),
      "fare_quoted": Number(this.cabForm.value.fare_quoted),
      "website": this.cabForm.value.website,
      // "ticket_no": this.accomodationForm.value.ticket_no,
      "PNR": this.cabForm.value.PNR,
      "requirement_code": this.reqcode,
    }
    this.cab_Book(this.data_final, this.index1, this.index2, e)
  }

  cab_Book(data, ind1, ind2, e) {
    if (this.list) {
      var files = this.list.files
    }
    else {
      files = null
    }
    // this.SpinnerService.show()
    this.taservice.cab_Book(data, files)
      .subscribe(res => {
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.statusok(ind1, ind2);
          this.notification.showSuccess("Cab Booked Successfully....");
          (this.taForm.controls['detail'] as FormArray).clear();
          this.tourmakersummary(this.id, this.tourid)
          this.cabbook.nativeElement.click()
          this.onSubmit.emit();
          // this.resetbookingfiles(e);
          return true;
        } else {
          this.SpinnerService.hide()

          this.notification.showError(res.description)
          return false;
        }
      })



  }
  airBook(e) {
    this.fromdate = this.datePipe.transform(this.airForm.value.from_time, 'yyyy-MM-dd ') + this.airForm.value.frtime + ':00'
    this.todate = this.datePipe.transform(this.airForm.value.to_time, 'yyyy-MM-dd ') + this.airForm.value.ttime + ':00'
    let bookamt = Number(this.airForm.value.ticket_amount)
    let form =  this.airForm.value;
    if (!form.ref_no){
      this.notification.showError('Please Enter Reference Number');
      return false;
    }
    if (!form.vendor_name){
      this.notification.showError('Please Enter Vendor Name');
      return false;
    }
    if (!form.PNR){
      this.notification.showError('Please Enter PNR Number');
      return false;
    }
    if (!form.ticket_no){
      this.notification.showError('Please Enter Ticket Number');
      return false;
    }
    
    // if (bookamt == null || bookamt == 0) {
    //   this.notification.showError("Please Enter Booking Amount")
    //   throw new Error()
    // }
    this.data_final = {
      "requirement_id": this.bookid,
      "from_time": this.fromdate,
      "to_time": null,
      "from_place": this.airForm.value.from_place,
      "to_place": this.airForm.value.to_place,
      "ref_no": this.airForm.value.ref_no,
      "ref_type": null,
      "booking_status": 3,
      "tour": 1,
      "boarding_no": null,
      "ticket_amount": Number(this.airForm.value.ticket_amount),
      "ticket_amount_personal": Number(this.airForm.value.ticket_amount_personal),
      "vendor_name": this.airForm.value.vendor_name,
      "comments": this.airForm.value.comments,
      "admin_paid": this.airForm.value.admin_paid,
      "cost_per_head": Number(this.airForm.value.cost_per_head),
      "issuance_type": this.airForm.value.issuance_type,
      "difference_inamount": Number(this.airForm.value.difference_inamount),
      "fare_quoted": Number(this.airForm.value.fare_quoted),
      "website": this.airForm.value.website,
      "ticket_no": this.airForm.value.ticket_no,
      "PNR": this.airForm.value.PNR,
      "flight_number": this.airForm.value.flight_number,
      "requirement_code": this.reqcode,
    }
    this.air_Book(this.data_final, this.index1, this.index2, e)
  }
  reqcancel(e) {
    let reqtype = this.taForm.value.detail[this.index1].requirements[this.index2].booking_needed;
    var payloads = null
    console.log("DAFAFDAS", reqtype)
    switch (Number(reqtype)) {
      case 1:
        this.acccanForm.value.refund_amount = Number(this.acccanForm.value.refund_amount);
        this.acccanForm.value.loss_of_cancelation = Number(this.acccanForm.value.loss_of_cancelation);
        payloads = this.acccanForm.value;
        break;
      case 2:
        this.cabcanForm.value.refund_amount = Number(this.cabcanForm.value.refund_amount);
        this.cabcanForm.value.loss_of_cancelation = Number(this.cabcanForm.value.loss_of_cancelation);
        payloads = this.cabcanForm.value;
        break;
      case 3:
        this.buscanForm.value.refund_amount = Number(this.buscanForm.value.refund_amount);
        this.buscanForm.value.loss_of_cancelation = Number(this.buscanForm.value.loss_of_cancelation);
        payloads = this.buscanForm.value;
        break;
      case 4:
        this.traincanForm.value.refund_amount = Number(this.traincanForm.value.refund_amount);
        this.traincanForm.value.loss_of_cancelation = Number(this.traincanForm.value.loss_of_cancelation);
        payloads = this.traincanForm.value;
        break;
      case 5:
        this.aircanForm.value.refund_amount = Number(this.aircanForm.value.refund_amount);
        this.aircanForm.value.loss_of_cancelation = Number(this.aircanForm.value.loss_of_cancelation);
        payloads = this.aircanForm.value;
        break;
      default:
        console.log("No such data exists!");
        break;
    }
    this.cancelreq(payloads, this.index1, this.index2, e)
  }
  air_Book(data, ind1, ind2, e) {
    if (this.list) {
      var files = this.list.files
    }
    else {
      files = null
    }
    // this.SpinnerService.show()
    this.taservice.air_Book(data, files)
      .subscribe(res => {
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.statusok(ind1, ind2);
          this.notification.showSuccess("Air Booked Successfully....");
          (this.taForm.controls['detail'] as FormArray).clear();
          this.tourmakersummary(this.id, this.tourid)
          this.airbook.nativeElement.click();
          this.onSubmit.emit();
          // this.resetbookingfiles(e)
          return true;
        } else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
          return false;
        }
      })



  }
  selfonbe(value) {
    if (value == 0) {
      this.taservice.getemployeesdetails().subscribe((results) => {
        this.onbehalfchoose = false;
        this.onbehalfofid = null
        this.tour = results
        this.empcode = results['code']
        this.empdesign = results['designation']
        this.empname = "(" + results['code'] + ") " + results['full_name']
        this.empgrade = results['grade']
        this.empid = results['id']
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

    }
  }
  onbehalfselect(value) {
    this.onbehalfid = value.id
    this.taForm.patchValue({
      onbehalfof: this.onbehalfid
    })
  }

  cancelreq(data, ind1, ind2, e) {
    if (this.list) {
      var files = this.list.files
    }
    else {
      files = null
    }
    // this.SpinnerService.show()
    data.requirement_id = this.bookid
    data.refund_date = this.datePipe.transform(data.refund_date, 'yyyy-MM-dd HH:mm:ss')
    data.cancelled_date = this.datePipe.transform(data.cancelled_date, 'yyyy-MM-dd HH:mm:ss')
    data.loss_of_cancelation = Number(data.loss_of_cancelation)
    this.taservice.cancelreq(data, files)
      .subscribe(res => {
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.statuscanok(ind1, ind2);
          this.notification.showSuccess("Cancelled Successfully....")
          this.onSubmit.emit();
          this.resetbookingfiles(e)
          return true;
        } else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
          return false;
        }
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
    return subject ? '(' + subject.employee_code + ') ' + subject.employee_name : undefined
  }
  reasonvalue(subject) {
    return subject ? subject.name : undefined;
  }
  branchvalue(subject) {
    return subject ? '(' + (subject.code) + ') ' + (subject.name) : undefined;
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
        let data = result['data'].reverse()

        let chatpagination = result['pagination']['has_next']

        this.chatboxpagination = chatpagination

        // console.log('reversed chatbox',data)
        this.commentDataList = result['data']
        if (this.commentDataList.length > 0) {
          this.chatunreadmsg = result['data'][0]['unread_message']
        }
        if (this.chatunreadmsg) {
          this.notification.showInfo(this.chatunreadmsg + ' Unread message')
        }

        setTimeout(() => {
          this.scrollchange()
        }, 10);
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
    if (this.chatboxpagination == true) {
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

  decimalconversion(field) {
    let amt = Number(field.value).toFixed(2)
    field = field.getAttribute('formControlName')

    switch (Number(this.cancelreqid)) {
      case 1:
        this.accomodationForm.get(field).setValue(amt);
        break;
      case 2:
        this.cabForm.get(field).setValue(amt)
        break;
      case 3:
        this.busForm.get(field).setValue(amt)
        break;
      case 4:
        this.trainForm.get(field).setValue(amt)
        break;
      case 5:
        this.airForm.get(field).setValue(amt)
        break;

      default:
        break;
    }
  }

  decimalcanconversion(field) {
    let amt = Number(field.value).toFixed(2)
    field = field.getAttribute('formControlName')

    switch (Number(this.cancelreqid)) {
      case 1:
        this.acccanForm.get(field).setValue(amt);
        break;
      case 2:
        this.cabcanForm.get(field).setValue(amt)
        break;
      case 3:
        this.buscanForm.get(field).setValue(amt)
        break;
      case 4:
        this.traincanForm.get(field).setValue(amt)
        break;
      case 5:
        this.aircanForm.get(field).setValue(amt)
        break;

      default:
        break;
    }
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

  msgformat(value) {
    console.log(value)
    if (value.includes('<table>')) {
      return true;
    }
    else {
      return false;
    }

  }

  msgdelete(chatid, tourid, i) {
    console.log('chatid', chatid, 'tourid', tourid)

    this.taservice.getdeletechatmessage(chatid, tourid)
      .subscribe(res => {
        if (res.status === "success") {
          this.notification.showSuccess("Message Deleted Successfully")
          // this.commentDataList.splice(i, 1)
          this.commentDataList[i].comment = 'THIS MESSAGE WAS DELETED'
          this.commentDataList[i].status = 0
          return true;
        } else {
          this.notification.showError(res.description)
          return false;
        }
      }
      )
  }
  createCommentform() {

    if (this.chatform.value.chat == '' || this.chatform.value.chat == null) {
      return false
    }

    var chatdata = this.chatform.value.chat
    console.log("before", this.chatform.value.chat)
    chatdata = chatdata.replace('border="0"', 'border="2"')
    chatdata = chatdata.replace('cellspacing="0"', 'cellspacing="2"')
    chatdata = chatdata.replace('cellspacing="1"', 'cellspacing="2"')
    chatdata = chatdata.replace('cellpadding="0"', 'cellpadding="5"')
    chatdata = chatdata.replace('cellpadding="1"', 'cellpadding="5"')
    chatdata = chatdata.replace('cellpadding="2"', 'cellpadding="5"')
    // if(chatdata.includes('data:image')){
    //  chatdata= chatdata.replace('<img', '<img style="width:500px;"')
    // }
    this.chatform.get('chat').setValue(chatdata);
    console.log("after", this.chatform.value.chat)
    this.data_final = {
      "request": this.request,
      "ref_type": 1,
      "approver_id": '',
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
    this.taservice.tourchat(data)
      .subscribe(res => {
        if (res.status === "success") {
          this.SpinnerService.hide()
          // this.notification.showSuccess("Message Send Successfully....")
          this.chatboxcurrentpage = 1

          this.getchatlist(this.chatboxcurrentpage);
          this.chatseen()

          this.chatform.value.chat = ''
          return true;
        } else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
          return false;
        }
      })
  }
  filetype_check2(i) {
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

  deleteUpload(i) {
    this.base64textString.splice(i, 1);
    this.list.items.remove(i)
    console.log('ssssss', this.list)
    console.log('filedata', this.list.files)
    this.totalcount = this.list.items.length;
    if (this.totalcount === 0) {
      (<HTMLInputElement>document.getElementById("uploadFile1")).value = null
      // this.showreasonattach = true;
    }
    else {
      (<HTMLInputElement>document.getElementById("uploadFile1")).files = this.list.files

    }
    // console.log('loggggs',(<HTMLInputElement>document.getElementById("uploadFile1")));

    // (<HTMLInputElement>document.getElementById("uploadFile1")).value=this.totalcount
    // console.log('slice',this.fileData[i])
    // this.fileData[i]=null
    // // this.fileData[i]
    // // this.fileData.splice(i,1)
    // console.log('slice',this.fileData[i])
    // console.log('after filedata',this.fileData)


  }

  tourmakersummary(tourid, id) {
    this.SpinnerService.show()
    this.taservice.getTourmakereditSummary(tourid || id)
      .subscribe((results: any) => {
        this.SpinnerService.hide();

        // this.acc_inp = null;
        // this.cab_inp = null;
        // this.train_inp = null;
        // this.bus_inp = null;
        // this.flight_inp = null;
        // this.acc_inpid = null;
        // this.cab_inpid = null;
        // this.train_inpid = null;
        // this.bus_inpid = null;
        // this.flight_inpid = null;
        this.approverid = this.tour_summary.approverid
        this.branchdetail = `(${this.tour_summary.branch_code}) ${this.tour_summary.branch_name}`
        this.show_submitbtn = false;
        this.show_editsubmitbtn = true;
        this.tourlist = results
        let reqdate = this.datePipe.transform(results['requestdate'], 'yyyy-MM-dd');
        this.empname = results['employee_name']
        
        this.empgrade = results['empgrade']
        this.empcode = results['employee_code']
        this.empdesign = results['empdesignation']
        this.empid = results['empgid']
        this.removeSection(0)
        console.log("this.tourlist", this.tourlist)

        this.name = results['employee_name']
        this.new = false;
        this.old = true;
        this.request = results.id
        let reason = results['reason_data']
        this.reasonval = reason.id
        let startDate = results['startdate']
        let startdate1 = this.datePipe.transform(startDate, 'yyyy-MM-dd');
        let endDate = results['enddate']
        let enddate1 = this.datePipe.transform(endDate, 'yyyy-MM-dd');
        let accommodation_cost = Number(results['accommodation_cost']).toFixed(2)
        let other_cost = Number(results['other_cost']).toFixed(2)
        let air_cost = Number(results['air_cost']).toFixed(2)
        let durationdays = results['durationdays']
        let ordernoremarks = results['ordernoremarks']
        let permittedby = results['permitted_by_data']
        let opening_balance = results['opening_balance']
        let quantum_of_funds = results['quantum_of_funds']
        let transfer_on_promotion = results['transfer_on_promotion']
        let nonbasedlocation = results['non_base_location']

        // let newdict = {
        //   "full_name": "(" + permittedby.code + ") " + permittedby.full_name,
        // }
        // this.permittedby = permittedby.id
        // let branch_name = results['branch_data_maker']
        // let approver_data = results['approver_branch_data']
        // this.approver_data = approver_data.id
        let weekendtravel = results['week_end_travel']


        // var branchdetail = '(' + approver_data.branch_code + ') ' + approver_data.branch_name
        // this.taForm.patchValue({ empbranchgid: branchdetail })
        let sec = 0

        if (results['non_base_location'] != null) {
          this.locationreason = true
        }
        else {
          this.locationreason = false
        }

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
          let requirement: FormControl = new FormControl('');
          let official: FormControl = new FormControl('');



          id.setValue(detail.id);
          startdate.setValue(this.datePipe.transform(detail.startdate, 'yyyy-MM-dd'))
          enddate.setValue(this.datePipe.transform(detail.enddate, 'yyyy-MM-dd'));
          startingpoint.setValue(detail.startingpoint);
          placeofvisit.setValue(detail.placeofvisit);
          purposeofvisit.setValue(detail.purposeofvisit);
          toplace.setValue(detail.toplace);
          client.setValue(detail.client);
          // requirement.setValue(detail.requirements);
          other_client_name.setValue(detail.other_client_name)
          official.setValue(detail.official.toString());

          console.log('check requirements', detail.requirement);




          this.getFormArray().push(new FormGroup({
            id: id,
            startdate: startdate,
            enddate: enddate,
            startingpoint: startingpoint,
            placeofvisit: placeofvisit,
            purposeofvisit: purposeofvisit,
            toplace: toplace,
            client: client,
            other_client_name: other_client_name,
            official: official,
            requirements: this.requirementsdata(detail.requirement),

          }));
        }
        this.taForm.patchValue({
          "requestdate": reqdate,
          "reason": reason,
          "startdate": startdate1,
          "enddate": enddate1,
          "durationdays": durationdays,
          "ordernoremarks": ordernoremarks,
          // "permittedby": newdict,
          // "approval": approver_data,
          "quantum_of_funds": quantum_of_funds,
          "opening_balance": opening_balance,
          "transfer_on_promotion": transfer_on_promotion,
          "week_end_travel": weekendtravel,
          "non_base_location": nonbasedlocation,
          "accommodation_cost": accommodation_cost,
          "other_cost": other_cost,
          "air_cost": air_cost
        })

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

        // this.SpinnerService.hide();


        // let tourdata: any = []
        // let tourjson: any = []
        // tourjson = {
        //   "employeeid": results['approver_data'].id,
        //   "employee_name": results['approver_data'].name,
        //   "employee_code": results['approver_data'].code,
        //   "employee_grade": results['approver_data'].grade,
        //   "employee_designation": results['approver_data'].designation

        // }

        // tourdata["tour"] = tourjson
        // this.tourdataas = JSON.stringify(Object.assign({}, tourdata));
        // tourdata = results
        // localStorage.setItem("Tourmakerlist", this.tourdataas)
        this.tourmodel = results;
        this.tourmodel.reason = results['reason_id']
        this.totall = this.tourmodel.durationdays


        // const branchdata = results['approver_branch_data']
        // this.tourmodel.empbranchgid = branchdata.branch_name;
        // this.tourmodel.approval = branchdata.full_name;
        // this.employeeid = branchdata.id;
        // this.mainbranchid = branchdata.branch_id;
        // this.tourmodel.permittedby = results['permittedby']
        // this.tourmodel.permittedby = results['permittedby']


        console.log("this.tour", this.tourmodel)
        const tourresult = localStorage.getItem("Tourmakerlist")
        if (tourresult) {

          let gettourapproverdata = JSON.parse(tourresult);
          console.log("value", gettourapproverdata)
          this.selected = gettourapproverdata.tour.employee_name;
          console.log("APP", this.selected)
        }

        this.tourmodel.detail.forEach(currentValue => {
          currentValue.startdate = this.datePipe.transform(currentValue.startdate, 'yyyy-MM-dd');
          currentValue.enddate = this.datePipe.transform(currentValue.enddate, 'yyyy-MM-dd');
        });
        this.tourmodel.startdate = this.datePipe.transform(this.tourmodel.startdate, 'yyyy-MM-dd');
        this.select = new Date(this.tourmodel.startdate);
        this.tourmodel.enddate = this.datePipe.transform(this.tourmodel.enddate, 'yyyy-MM-dd');

        // this.tourmodel.requestdate = this.datePipe.transform(new Date(this.tourmodel.requestdate), 'yyyy-MM-dd');
        this.tourdetails = results['detail']
        console.log("tourdetail", this.tourdetails)
        this.tourdetails_check = true;
        // let datas = this.tour_summary
        // let applevel = datas['applevel']
        // this.applevel = datas['applevel']


        this.loadover = true;

      })


  }

  objectassign(tour) {
    let data = `&type=Travel_3&tour_no=${tour}&booking_status=-6`
    if (this.ngreload) {
      this.ngreload = false;
      this.taservice.getTourAdminSummary(1, data, 0).subscribe(res => {
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
        }
        var datas = JSON.stringify(Object.assign({}, objects));
        localStorage.setItem('tourmakersummary', datas)
        this.ngOnInit();
      });
    }

    // let date = JSON.parse(localStorage.getItem('tourmakersummary')

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

    // console.log("startttt",this.selectstart)

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
    this.selectend = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    this.dateedit = true;

  }



  fromdateSelection(event: string) {
    // this.showdates=false
    // this.showstartdate=true
    // console.log("fromdate", event)
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
      (this.taForm.controls['detail'] as FormArray).clear();
      this.addSection();
      //   this.tourdetails = []
      //   this.taForm.value.detail.push({startdate:this.select,
      //     enddate:null,
      //     startingpoint:null,
      //     placeofvisit:null,
      //     purposeofvisit:null,
      // });
    }
    this.totall = (this.total / (1000 * 60 * 60 * 24)) + 1
  }
  // clientdropdown() {
  //   this.taservice.gettourclientdropdown()
  //     .subscribe(res => {
  //       this.clientdropdowndata = res['data']
  //       console.log('hello', res)
  //     })
  // }
  todateSelection(event: string) {
    // this.showdates=false
    // this.showstartdate=true
    // console.log("todate", event)
    const date = new Date(event)
    this.selectto = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    if (this.dateedit) {
      this.taForm.value.detail = []
      this.tourdetails = []
      this.taForm.value.detail.push({
        startdate: this.select,
        enddate: null,
        startingpoint: null,
        placeofvisit: null,
        purposeofvisit: null,
      });
    }
    this.total = this.selectto - this.select;
    this.totall = (Math.round(this.total) / (1000 * 60 * 60 * 24)) + 1
    if (this.tourdatenot != true) {
      this.totall = Math.round(this.totall)
    }
    console.log("tot1", this.totall)

  }
  numberOnly(event) {
    return (event.charCode >= 48 && event.charCode <= 58 || event.charCode == 46)
  }
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

  // tabletoimg() {
  //   var node = document.getElementById('tablesize');
  //   console.log(node)
  //   domtoimage.toJpeg(node)
  //     .then(function (data) {
  //       let downloadUrl = data
  //       // this.filesrc = downloadUrl
  //       let link = document.createElement('a');
  //       link.href = downloadUrl;
  //       link.download = 'tableexport'
  //       link.click();
  //     })
  //     .catch(function (error) {
  //       console.error('oops, something went wrong!', error);
  //     });
  // }

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
  dropdown(data) {
    this.reasonid = data.fileupload;
    this.tourreasonid = data.id
    this.resonupdate = true
    console.log("this.tourreasonid", this.tourreasonid)
    if (data.id === 2) {
      this.showfunds = true;
    }
    else {
      this.showfunds = false;
    }
    if (data.id === 7 || data.id === 8 || data.name == "Transfer-Reporting") {
      this.showtransfer = true
    } else {
      this.showtransfer = false
    }
    if (data.id !== 3 && data.id !== 9 && data.id !== 10) {
      this.showreasonattach = true;
    }
    else {
      this.showreasonattach = false;
    }

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
        "approval": this.approvalid
      }
    }
    else {
      this.tourcancel = {
        "tour_id": this.tourid,
        "appcomment": this.cancelform.value.canccomments,
        "apptype": "TourCancel",
        "onbehalfof": this.onbehalfid,
        "status": 1,
        "approval": this.approvalid
      }
    }
    this.taservice.tourCancel(this.tourcancel)
      .subscribe(res => {
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Tour Cancel Request submitted Successfully....")
          this.onSubmit.emit();
          this.route.navigateByUrl('ta/ta_summary')
          return true;
        } else {
          this.SpinnerService.hide()
          this.notification.showError(res.description)
        }
      })
  }


  reqcheck(ind1) {

    let myform = this.taForm.value.detail[ind1].requirements

    // console.log("DASFAS",myform)
    if (myform.length == 0) {
      return false;
    }
    else {
      return true
    }
  }
  minselect(ind) {
    this.maximum = this.taForm.value.enddate;
    if (ind == 0) {
      return this.taForm.value.startdate;
    }
    else {
      return this.taForm.value.detail[ind - 1].enddate;

    }
  }

  maxselect(ind) {
    this.maximum = this.taForm.value.enddate;
    if (this.taForm.value.detail[ind].startdate == null) {
      return;
    }
    else {
      return this.taForm.value.detail[ind].startdate
    }

  }
  approve() {
    if (this.lastcomment) {
      this.reason = this.lastcomment
    }
    if (this.apptype == "TourCancel") {
      this.data_final = {
        "id": this.approverid,
        "tourgid": this.tourid,
        "apptype": "TourCancel",
        "appcomment": this.reason,
        "status": "3",
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

    this.approve_service(this.data_final)
  }


  selectemployee(employeeid) {

    this.employeeid = employeeid['id']
    console.log("EMMMM", this.employeeid)
  }


  reject() {
    if (this.lastcomment) {
      this.reason = this.lastcomment
    }
    this.data_final = {
      "id": this.approverid,
      "tour_id": this.tourid,
      "apptype": "tour",
      "appcomment": this.reason,

    }
    this.reject_service(this.data_final)
  }

  return() {
    if (this.lastcomment) {
      this.reason = this.lastcomment
    }
    this.data_final = {
      "id": this.approverid,
      "tour_id": this.tourid,
      "apptype": "tour",
      "appcomment": this.reason,

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

  fileselect(evt) {
    this.reqfile = evt.target.files
    console.log(this.reqfile)
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
    if (this.approverapplevel == 2) {

    }
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
  getsdownload(ind) {
    let value = this.attachmentlist[ind]
    let fileid = value.id;
    let option = 'view'
    // console.log(this.filesrc)
    // let msg = this.filetype_check2(ind);
    // this.commentPopup(value.id, value.file_name)
    this.SpinnerService.show()
    this.taservice.viewfile(fileid, option, value).subscribe(results => {
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      this.filesrc = downloadUrl
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = value.file_name;
      link.click();
      console.log(this.filesrc)
      // if (msg == 1) {
      //   this.pdfshow = false;
      //   this.imgshow = true;
      // }
      // else {
      //   this.pdfshow = true;
      //   this.imgshow = false
      // }
    })
  }
  getimagedownload(id, file_name, i) {
    this.filename = file_name;
    this.taservice.getfetchimagesss(id)
      .subscribe(result => {
        console.log('result', result)
        let xldata = [];
        xldata.push(result)
        let msg = this.getfiletype_check2(i)

        if (msg == 1) {

          let downloadUrl = window.URL.createObjectURL(new Blob(xldata));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = this.filename
          link.click();

        }
        else {

          let downloadUrl = window.URL.createObjectURL(new Blob(xldata));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = this.filename
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
    else if (this.fileextension === "png" || this.fileextension === "jpeg" || this.fileextension === "jpg" || this.fileextension === "JPG" || this.fileextension === "JPEG") {
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

  reqfileDelete(ind1, ind2, ind3, filearray) {
    let list = this.taForm.value.detail[ind1].requirements[ind2].filedetail
    let value = list[ind3]

    this.taservice.fileDelete(value.id)
      .subscribe((res) => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.notification.showWarning("Duplicate! Code Or Name ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
        }
        else {
          this.notification.showSuccess("Deleted Successfully....")
          filearray.splice(ind3, 1)
          this.taForm.get("detail")["controls"][ind1].get("requirements")["controls"][ind2].get("filedetail").setValue(filearray)
          // console.log("res", res)
          // this.onSubmit.emit();
          return true
        }

      })
  }

  fileDelete(fileid, ind) {
    console.log(fileid, ind)
    this.taservice.fileDelete(fileid)
      .subscribe((res) => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.notification.showWarning("Duplicate! Code Or Name ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
        }
        else {
          this.notification.showSuccess("Deleted Successfully....")
          this.getviewfilelist.splice(ind, 1)

          console.log("res", res)
          this.onSubmit.emit();
          return true
        }

      })
  }

  getonbehalflist() {
    this.taservice.getemployeeSummary(0, 1).subscribe(result => {
      console.log(result)
      this.onbehalflist = result['data']
      // if (this.onbehalflist.length == 0){
      //   this.hideonbe = true;
      // }
      console.log(this.onbehalflist)
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
    // this.filesrc = this.attachmentlist[ind].url
    console.log(this.filesrc)
    let msg = this.filetype_check2(ind);
    // this.commentPopup(value.id, value.file_name)
    this.taservice.viewfile(fileid, option, value).subscribe(results => {
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);

      let token = tokenValue.token;
      if (this.file_ext.includes(this.fileextension.toLowerCase())) {
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
      official: "1",
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
  }
  getFormArray(): FormArray {
    return this.taForm.get('detail') as FormArray;
  }


  createrequirements() {
    let group = this.formBuilder.group({
      booking_needed: "",
      comments: "",
      travel_type_cab: null,
      // from_time:"",



      checkin_time: '',
      checkout_time: '',
      // to_time:"",
      place_of_stay: '',
      Accomodationkey: false,

      otherkey: false,
      from_time: '',
      from_place: '',
      to_place: '',
      to_time: '',




    });
    return group;
  }
  addrequirements(i) {

    const datas = this.taForm.get("detail")["controls"][i].get("requirements") as FormArray;
    datas.push(this.createrequirements())

  }

  fieldGlobalind(i) {
    let dat = this.pageSize * (this.p - 1) + i;
    return dat
  }


  accomodation(i, j) {
    document.getElementById('tablesize').style.width = "230%"

    this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("Accomodationkey").setValue(true)
    this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("otherkey").setValue(false)
    console.log('nice da', this.taForm.value)
  }

  othertravels(i, j) {
    document.getElementById('tablesize').style.width = "230%"
    this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("otherkey").setValue(true)
    this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("Accomodationkey").setValue(false)
  }

  deleterequirement(i, j) {
    // (<FormArray>this.taForm.get('detail')['controls'][i].get('requirements')).removeAt(j)
    // if(this.taForm.get("detail")["controls"][i].get("requirements").length==1){
    //   document.getElementById('tablesize').style.width="156%"
    // }

    if (this.taForm.value.detail[i].requirements.length == 1) {
      // if(this.taForm.value.detail.length==1 && this.taForm.value.detail[0].requirements.length==0 )
      this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("booking_needed").setValue('')
      this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("otherkey").setValue(false)
      this.taForm.get("detail")["controls"][i].get("requirements")["controls"][j].get("Accomodationkey").setValue(false)
      return false
    }
    else {
      (<FormArray>this.taForm.get('detail')['controls'][i].get('requirements')).removeAt(j)
    }



    // let count=0
    // for(let i=0;i<this.taForm.value.detail.length;i++){
    //   for(let j=0;j<this.taForm.value.detail[i].requirements.length;j++){
    //     if(this.taForm.get("detail")["controls"][i].get("requirements")['controls'][j].get('Accomodationkey')  == false
    //      && this.taForm.get("detail")["controls"][i].get("requirements")['controls'][j].get('otherkey') == false){
    //     count=count+1;
    //   }
    //   }

    // }

    // if(count==this.taForm.value.detail[i].requirements.length){
    //   document.getElementById('tablesize').style.width="156%"
    // }

  }
  booksstatus(ind, ind2) {
    this.acccancel = false;
    this.cabcancel = false;
    this.traincancel = false;
    this.buscancel = false;
    this.aircancel = false;
    let reqid = this.taForm.value.detail[ind].requirements[ind2].booking_status;
    console.log(reqid)
    this.showpopup = false;
    if (reqid == 1 || reqid == 3 || reqid == 2) {
      this.showpopup = true;
    }
  }
  mintime: any;
  maxtime: any;

  booking(e, i, j) {
    this.reqsenable();
    this.bookbtn = false;
    this.updatebtn = false;
    this.cancelbtn = false;
    this.cancelupdbtn = false;
    this.cabcancel = false;
    this.acccancel = false;
    this.buscancel = false;
    this.traincancel = false;
    this.aircancel = false;
    this.index1 = i;
    this.index2 = j;
    // this.showcabdtls = true;
    let myform = this.taForm.value.detail[i].requirements[j]
    myform.requirement_code ? this.reqcode = myform.requirement_code : false;
    this.reissuecode = myform.reissue_requirement_code;
    // this.reissuecode = 'CAB22060001';
    let offvalue = this.taForm.value.detail[i].official
    let cabtypeval = myform.travel_type_cab
    // if (cabtypeval == '1') {
    //   this.showcabdtls = false;
    // }
    this.showpersonal = false;
    this.showofficial = false;
    this.showperoff = false;
    if (offvalue == '0') {
      this.showpersonal = true;
    }
    else if (offvalue == '1') {
      this.showofficial = true;
    }
    else {
      this.showperoff = true;
      // this.showofficial  = true;
      // this.showpersonal = true;
    }

    this.bookid = myform.id;
    let bid = this.bookid
    this.bookstatus = e
    let reqid = myform.booking_needed;
    this.cancelreqid = reqid;
    let someid = myform.id;
    var statuschange = true;
    this.mindate = myform.fromtime ? new Date(myform.from_time) : null;
    this.maxdate = new Date(this.taForm.value.detail[i].enddate);
    this.mintime = String(this.mindate?.getHours()).padStart(2, '0') + ':' + String(this.mindate?.getMinutes()).padStart(2, '0')
    if (this.mindate) {

    }
    else {
      this.mintime = null
    }
    this.maxtime = null
    this.getfileuploaded(this.bookid, reqid)
    if (this.currentstatus == 4 && this.bookstatus == 'View') {
      this.updatebtn = false;
      this.bookbtn = false;
      this.cancelupdbtn = true;
      this.accomodationForm.disable();
      this.cabForm.disable()
      this.trainForm.disable()
      this.busForm.disable()
      this.airForm.disable()
      this.cancelbtn = false;
    }
    if (reqid == '1' && this.bookstatus == "Booked" && (this.currentstatus == 0 || this.currentstatus == -1)) {
      this.bookbtn = true;
      this.mindate = new Date(myform.checkin_time)
      this.maxdate = new Date(myform.checkout_time);
      this.mintime = String(this.mindate.getHours()).padStart(2, '0') + ':' + String(this.mindate.getMinutes()).padStart(2, '0')
      this.maxtime = String(this.maxdate.getHours()).padStart(2, '0') + ':' + String(this.maxdate.getMinutes()).padStart(2, '0')
      this.accomodationForm.patchValue({
        checkin_time: this.mindate,
        fromtime: this.mintime,
        totime: this.maxtime,
        checkout_time: this.maxdate,
        place_of_stay: myform.place_of_stay,
        ticket_amount: null,
        no_of_nights:null,
        comments: myform.comments,
        room_type: myform.room_type,
        total_a: null,
        total_b: null,
        nac_rate: null,
        rack_rate_night: null,
      })
      this.nightDiff(myform);
      this.createacc = true
      this.createtrain = false
      this.createair = false
      this.createcab = false
      this.createbus = false
      this.showpopup = true;
      this.maxdate = new Date(this.taForm.value.detail[i].enddate);

    }
    else if (reqid == '4' && this.bookstatus == "Booked" && (this.currentstatus == 0 || this.currentstatus == -1)) {
      this.bookbtn = true;
      this.trainForm.patchValue({
        from_time: this.mindate,
        to_time: this.maxdate,
        frtime: this.mintime,
        ttime: this.maxtime,
        from_place: myform.from_place,
        to_place: myform.to_place,
        ticket_amount: null,
        comments: myform.comments,

      })

      this.createtrain = true
      this.createacc = false
      this.createair = false
      this.createcab = false
      this.createbus = false
      this.showpopup = true;

    }
    else if (reqid == '5' && this.bookstatus == "Booked" && (this.currentstatus == 0 || this.currentstatus == -1)) {
      this.bookbtn = true;
      this.airForm.patchValue({
        from_time: this.mindate,
        to_time: this.maxdate,
        frtime: this.mintime,
        ttime: this.maxtime,
        from_place: myform.from_place,
        to_place: myform.to_place,
        ticket_amount: null,
        comments: myform.comments,

      })
      this.createair = true
      this.createacc = false
      this.createtrain = false
      this.createcab = false
      this.createbus = false
      this.showpopup = true;

    }
    else if (reqid == '2' && this.bookstatus == "Booked" && (this.currentstatus == 0 || this.currentstatus == -1)) {
      this.bookbtn = true;
      this.clupcab = true;
      this.cabForm.patchValue({
        from_time: this.mindate,
        to_time: this.maxdate,
        frtime: this.mintime,
        ttime: this.maxtime,
        from_place: myform.from_place,
        to_place: myform.to_place,
        ticket_amount: null,
        comments: myform.comments,
        travel_type_cab: myform.travel_type_cab,
        cab_segment: myform.cab_segment,
        cabtravels: []
      })
      let fromtime = this.datePipe.transform(this.mindate, 'yyyy-MM-dd HH:mm:ss')
      this.taservice.samebooking(reqid, fromtime, myform.from_place, myform.to_place, bid)
        .subscribe((result) => {
          this.grouptour = result['data']
          this.grouptour = this.grouptour.filter(function (record) { return record.id != bid; });

          if (this.grouptour.length == 0) {
            this.clupcab = false;
          }
        })
      this.createcab = true
      this.createair = false
      this.createacc = false
      this.createtrain = false
      this.createbus = false
      this.showpopup = true;

    }
    else if (reqid == '3' && this.bookstatus == "Booked" && (this.currentstatus == 0 || this.currentstatus == -1)) {
      this.bookbtn = true;
      this.busForm.patchValue({
        from_time: this.mindate,
        to_time: this.maxdate,
        frtime: this.mintime,
        ttime: this.maxtime,
        from_place: myform.from_place,
        to_place: myform.to_place,
        ticket_amount: null,
        comments: myform.comments,

      })
      this.createacc = false
      this.createcab = false
      this.createair = false
      this.createbus = true
      this.createtrain = false
      this.showpopup = true;

    }

    else if (reqid == '1' && this.bookstatus == "View") {
      this.mindate = new Date(myform.checkin_time)
      this.maxdate = new Date(myform.checkout_time);
      this.maxdate = new Date(this.taForm.value.detail[i].enddate);
      this.acc(someid);
      this.createacc = true
      this.createcab = false
      this.createair = false
      this.createbus = false
      this.createtrain = false
      this.showpopup = true;
      this.updatebtn = true;
    }
    else if (reqid == '4' && this.bookstatus == "View") {
      this.train(someid);
      this.createacc = false
      this.createcab = false
      this.createair = false
      this.createbus = false
      this.createtrain = true
      this.showpopup = true;
      this.updatebtn = true;

    }
    else if (reqid == '3' && this.bookstatus == "View") {
      this.bus(someid);
      this.createacc = false
      this.createcab = false
      this.createair = false
      this.createbus = true
      this.createtrain = false
      this.showpopup = true;
      this.updatebtn = true;

    }
    else if (reqid == '5' && this.bookstatus == "View") {
      this.air(someid);
      this.createair = true
      this.createacc = false
      this.createtrain = false
      this.createcab = false
      this.createbus = false
      this.showpopup = true;
      this.updatebtn = true;

    }
    else if (reqid == '2' && this.bookstatus == "View") {
      this.cab(someid);
      this.createcab = true
      this.createair = false
      this.createacc = false
      this.createtrain = false
      this.createbus = false
      this.showpopup = true;
      this.updatebtn = true;
    }

    else if (reqid == '1' && this.bookstatus == "Cancelled" && this.currentstatus != 4) {
      this.mindate = myform.checkin_time;
      this.maxdate = myform.checkout_time;
      this.acc(someid);
      this.createacc = false;
      this.createcab = false
      this.createair = false
      this.createbus = false
      this.createtrain = false
      this.showpopup = true;
      this.acccancel = true;
      this.cancelbtn = true;
      this.accomodationForm.disable()
    }
    else if (reqid == '4' && this.bookstatus == "Cancelled" && this.currentstatus != 4) {
      this.train(someid);
      this.createacc = false
      this.createcab = false
      this.createair = false
      this.createbus = false
      this.createtrain = false
      this.showpopup = true;
      this.traincancel = true;
      this.cancelbtn = true;
      this.trainForm.disable();

    }
    else if (reqid == '3' && this.bookstatus == "Cancelled" && this.currentstatus != 4) {
      this.bus(someid);
      this.createacc = false
      this.createcab = false
      this.createair = false
      this.createbus = false
      this.createtrain = false
      this.showpopup = true;
      this.buscancel = true;
      this.cancelbtn = true;
      this.busForm.disable()
    }
    else if (reqid == '5' && this.bookstatus == "Cancelled" && this.currentstatus != 4) {
      this.air(someid);
      this.createair = false
      this.createacc = false
      this.createtrain = false
      this.createcab = false
      this.createbus = false
      this.showpopup = true;
      this.aircancel = true;
      this.cancelbtn = true;
      this.airForm.disable()

    }
    else if (reqid == '2' && this.bookstatus == "Cancelled" && this.currentstatus != 4) {
      this.cab(someid);
      this.createcab = false
      this.createair = false
      this.createacc = false
      this.createtrain = false
      this.createbus = false
      this.showpopup = true;
      this.cabcancel = true;
      this.cancelbtn = true;
      this.cabForm.disable()
    }
    else {
      this.createacc = false
      this.createcab = false
      this.createair = false
      this.createbus = false
      this.createtrain = false
      this.showpopup = false;
    }
    if (this.bookstatus == "Rejected") {
      let payload = { "requirement_type": Number(this.cancelreqid), "requirement_id": this.bookid }
      statuschange = false;
      this.reqreject(payload)
    }

    if ((this.currentstatus == 0 && this.bookstatus == "Inprogress") || (this.currentstatus == -1 && this.bookstatus == "Not Booked")) {
      let payload = { "requirement_type": Number(this.cancelreqid), "reserv_status": 1, "requirement_id": this.bookid }
      if (this.bookstatus == "Not Booked") {
        payload.reserv_status = 0
      }
      this.inprogress(payload)
    }
    if (statuschange) {
      this.statusfail(this.index1, this.index2)
    }

  }
  cancheck(ind, ind2) {
    let myform = this.taForm.value.detail[ind].requirements[ind2]
    return true;
  }

  reqreject(payload) {
    this.taservice.reqreject(payload).subscribe((res) => {
      if (res.status === "success") {
        this.notification.showSuccess(`Rejected Successfully`)
        // return true;
      } else {
        this.notification.showError(res.description)
        this.statusfail(this.index1, this.index2)
        // this.ngOnInit()
        return false;
      }

    })
  }
  instatus(ind1, ind2) {
    let myform = this.taForm.value.detail[ind1].requirements[ind2]
    let reqid = Number(myform.booking_needed)
    switch (Number(reqid)) {
      case 1:
        if (this.log_emp == this.acc_inpid) {
          return this.bookinpstatus
        }
        else {
          return this.bookingstatus
        }
      case 2:
        if (this.log_emp == this.cab_inpid) {
          return this.bookinpstatus
        }
        else {
          return this.bookingstatus
        }
      case 3:
        if (this.log_emp == this.bus_inpid) {
          return this.bookinpstatus
        }
        else {
          return this.bookingstatus
        }

      case 4:
        if (this.log_emp == this.train_inpid) {
          return this.bookinpstatus
        }
        else {
          return this.bookingstatus
        }
      case 5:
        if (this.log_emp == this.flight_inpid) {
          return this.bookinpstatus
        }
        else {
          return this.bookingstatus
        }
      default:
        console.log("No such data exists..........................!");
        break;
    }

  }
  getnonbaselist() {
    this.taservice.getnonbaselist().subscribe(res => {
      this.nonbaselist = res;
    })
  }
  expand() {
    this.bookings.open()
  }
  close() {
    this.bookings.close()
  }
  inpstatus(ind1, ind2) {
    let myform = this.taForm.value.detail[ind1].requirements[ind2]
    var returns = false;
    if (myform.takenbyid) {
      if (this.log_emp != myform.takenbyid) {
        returns = true;
      }
    }

    // if(myform.booking_status == 5){
    //   returns = true;
    // }
    if (returns) {
      return true;
    }
    else {
      return false;
    }
  }
  inptooltip(ind1, ind2) {
    let myform = this.taForm.value.detail[ind1].requirements[ind2]
    if (myform.takenby) {
      if (myform.booking_status == 3) {
        return `Booked By ${myform.takenby}`
      }
      else if (myform.booking_status == -1) {
        return `Processing By ${myform.takenby}`
      }


    }
    else {
      return ""
    }
  }
  inprogress(payload) {
    this.SpinnerService.show()
    this.taservice.inprogress(payload).subscribe((res) => {
      if (res.status === "success") {
        // this.taForm.value.clear();
        (this.taForm.controls['detail'] as FormArray).clear();
        this.tourmakersummary(this.id, '');
        this.notification.showSuccess(`Inprogress Status ${res.message}`)
        this.route.navigateByUrl('ta/touradmin');
        this.SpinnerService.show()

        // return true;
      } else {
        this.notification.showError(res.description)
        this.statusfail(this.index1, this.index2)
        this.SpinnerService.hide()

        return false;
      }

    })
  }
  acc(e) {
    this.bookid = e
    this.taservice.getacclist(this.bookid)
      .subscribe((result) => {
  
        this.getaccom = result['data']
        let results = result['data'][0]
        let checkin = results['checkin_time']

        let checkout = results['checkout_time']
        let ftime = new Date(checkin)
        let fromtime = String(ftime.getHours()).padStart(2, '0') + ':' + String(ftime.getMinutes()).padStart(2, '0')
        let ttime = new Date(checkout)
        let totime = String(ttime.getHours()).padStart(2, '0') + ':' + String(ttime.getMinutes()).padStart(2, '0')
        let place = results['place_of_stay']
        let offamt = results['ticket_amount'] ? results['ticket_amount'].toFixed(2) : null
        let peramt = results['ticket_amount_personal'] ? results['ticket_amount_personal'].toFixed(2) : null
        this.accomodationForm.patchValue({
          "checkin_time": this.datePipe.transform(checkin, 'yyyy-MM-dd'),
          "fromtime": fromtime,
          "totime": totime,
          "checkout_time": this.datePipe.transform(checkout, 'yyyy-MM-dd'),
          "place_of_stay": place,
          "ticket_amount": offamt,
          "ticket_amount_personal": peramt,
          "comments": results['comments'],
          "admin_paid": results['admin_paid'],
          "amount_saved": results["amount_saved"],
          "room_type": results['room_type'],
          "total_a": results['total_a'],
          "vendor_name": results['vendor_name'],
          "total_b": results['total_b'],
          "website": results['website'],
          "ticket_no": results['ticket_no'],
          "PNR": results['PNR'],
          "no_of_nights": results['no_of_nights'],
          "nac_rate": results['nac_rate'] ? results['nac_rate'].toFixed(2) : null,
          "rack_rate_night": results['rack_rate_night'] ? results['rack_rate_night'].toFixed(2) : null

        })

        this.cancellimit = new Date(results['booking_date']);
        let amt1 = results['ticket_amount'] ? Number(results['ticket_amount']) : 0
        let amt2 = results['ticket_amount_personal'] ? Number(results['ticket_amount_personal']) : 0
        this.bookedamount = amt1 + amt2;
        results['requirement_code'] ? this.reqcode = results['requirement_code'] : false;
        if (this.cancelupdbtn) {
          let canceldata = results['cancel_data'][0];
          let lossofcancelation = canceldata.loss_of_cancelation ? canceldata.loss_of_cancelation.toFixed(2) : null
          let refund_amount = canceldata.refund_amount ? canceldata.refund_amount.toFixed(2) : null
          let canceldate = canceldata.cancelled_date ? new Date(canceldata.cancelled_date) : null
          let refunddate = canceldata.refund_date ? new Date(canceldata.refund_date) : null
          this.acccanForm.patchValue({
            booking_type: 1,
            cancel_reschedule: canceldata.cancel_reschedule,
            cancel_reason: canceldata.cancel_reason,
            refund_amount: refund_amount,
            fare_difference: Number(canceldata.fare_difference),
            loss_of_cancelation: lossofcancelation,
            refund_date: refunddate,
            cancelled_date: canceldate
          })

        }
      })
  }

  penaltychange(value) {
    if (this.bookedamount < Number(value)) {
      this.notification.showError("Booked Amount Can't be Lesser than the Penalty Amount")
      return false;
    }
    var amt = (this.bookedamount - Number(value)).toFixed(2)

    switch (Number(this.cancelreqid)) {
      case 1:
        this.acccanForm.get('refund_amount').setValue(amt);
        break;
      case 2:
        this.cabcanForm.get('refund_amount').setValue(amt)
        break;
      case 3:
        this.buscanForm.get('refund_amount').setValue(amt)
        break;
      case 4:
        this.traincanForm.get('refund_amount').setValue(amt)
        break;
      case 5:
        this.aircanForm.get('refund_amount').setValue(amt)
        break;

      default:
        break;
    }
  }

  refundchange(value) {
    if (this.bookedamount < Number(value)) {
      this.notification.showError("Booked Amount Can't be Lesser than the Refund Amount")
      return false;
    }
    var amt = (this.bookedamount - Number(value)).toFixed(2)

    switch (Number(this.cancelreqid)) {
      case 1:
        this.acccanForm.get('loss_of_cancelation').setValue(amt);
        break;
      case 2:
        this.cabcanForm.get('loss_of_cancelation').setValue(amt)
        break;
      case 3:
        this.buscanForm.get('loss_of_cancelation').setValue(amt)
        break;
      case 4:
        this.traincanForm.get('loss_of_cancelation').setValue(amt)
        break;
      case 5:
        this.aircanForm.get('loss_of_cancelation').setValue(amt)
        break;

      default:
        break;
    }
  }
  train(e) {
    this.bookid = e
    this.taservice.gettrainlist(this.bookid)
      .subscribe((result) => {
        this.getaccom = result['data']
        let results = result['data'][0]
        let checkin = results['from_time']
        let checkout = results['to_time']
        let ftime = new Date(checkin)
        let fromtime = String(ftime.getHours()).padStart(2, '0') + ':' + String(ftime.getMinutes()).padStart(2, '0')
        let ttime = new Date(checkout)
        let totime = String(ttime.getHours()).padStart(2, '0') + ':' + String(ttime.getMinutes()).padStart(2, '0')
        let fromplace = results['from_place']
        let toplace = results['to_place']
        let offamt = results['ticket_amount'] ? results['ticket_amount'].toFixed(2) : null
        let peramt = results['ticket_amount_personal'] ? results['ticket_amount_personal'].toFixed(2) : null
        this.trainForm.patchValue({
          "from_time": this.datePipe.transform(checkin, 'yyyy-MM-dd'),
          "to_time": this.datePipe.transform(checkout, 'yyyy-MM-dd'),
          "frtime": fromtime,
          "ttime": totime,
          "from_place": fromplace,
          "to_place": toplace,
          "ticket_amount": offamt,
          "ticket_amount_personal": peramt,
          "comments": results['comments'],
          "admin_paid": results['admin_paid'],
          "cost_per_head": results["cost_per_head"],
          "issuance_type": results['issuance_type'],
          "difference_inamount": results['difference_inamount'],
          "vendor_name": results['vendor_name'],
          "fare_quoted": results['fare_quoted'],
          "website": results['website'],
          "ticket_no": results['ticket_no'],
          "PNR": results['PNR'],
          "train_number": results['train_number']
        })

        this.cancellimit = new Date(results['booking_date']);
        let amt1 = results['ticket_amount'] ? Number(results['ticket_amount']) : 0
        let amt2 = results['ticket_amount_personal'] ? Number(results['ticket_amount_personal']) : 0
        this.bookedamount = amt1 + amt2;
        results['requirement_code'] ? this.reqcode = results['requirement_code'] : false;
        if (this.cancelupdbtn) {
          let canceldata = results['cancel_data'][0];
          let lossofcancelation = canceldata.loss_of_cancelation ? canceldata.loss_of_cancelation.toFixed(2) : null
          let refund_amount = canceldata.refund_amount ? canceldata.refund_amount.toFixed(2) : null
          let canceldate = canceldata.cancelled_date ? new Date(canceldata.cancelled_date) : null
          let refunddate = canceldata.refund_date ? new Date(canceldata.refund_date) : null
          this.traincanForm.patchValue({
            booking_type: 4,
            cancel_reschedule: canceldata.cancel_reschedule,
            cancel_reason: canceldata.cancel_reason,
            refund_amount: refund_amount,
            fare_difference: Number(canceldata.fare_difference),
            loss_of_cancelation: lossofcancelation,
            refund_date: refunddate,
            cancelled_date: canceldate
          })

        }

      })
  }
  bus(e) {
    this.bookid = e
    this.taservice.getbuslist(this.bookid)
      .subscribe((result) => {
        this.getaccom = result['data']
        let results = result['data'][0]
        let checkin = results['from_time']
        let checkout = results['to_time']
        let ftime = new Date(checkin)
        let fromtime = String(ftime.getHours()).padStart(2, '0') + ':' + String(ftime.getMinutes()).padStart(2, '0')
        let ttime = new Date(checkout)
        let totime = String(ttime.getHours()).padStart(2, '0') + ':' + String(ttime.getMinutes()).padStart(2, '0')
        let fromplace = results['from_place']
        let toplace = results['to_place']
        let offamt = results['ticket_amount'] ? results['ticket_amount'].toFixed(2) : null
        let peramt = results['ticket_amount_personal'] ? results['ticket_amount_personal'].toFixed(2) : null
        this.busForm.patchValue({
          "from_time": this.datePipe.transform(checkin, 'yyyy-MM-dd'),
          "to_time": this.datePipe.transform(checkout, 'yyyy-MM-dd'),
          "frtime": fromtime,
          "ttime": totime,
          "from_place": fromplace,
          "to_place": toplace,
          "ticket_amount": offamt,
          "ticket_amount_personal": peramt,
          "comments": results['comments'],
          "admin_paid": results['admin_paid'],
          "ticket_no": results['ticket_no'],
          "bus_number": results['bus_number'],
          "vendor_name": results['vendor_name'],
          "seat_number": results['seat_number'],
          "cost_per_head": results["cost_per_head"],
          "issuance_type": results['issuance_type'],
          "difference_inamount": results['difference_inamount'],

          "fare_quoted": results['fare_quoted'],
          "website": results['website'],
          // "ticket_no": results['ticket_no'],
          "PNR": results['PNR'],
        })
        console.log("results", this.cancelupdbtn)
        this.cancellimit = new Date(results['booking_date']);
        let amt1 = results['ticket_amount'] ? Number(results['ticket_amount']) : 0
        let amt2 = results['ticket_amount_personal'] ? Number(results['ticket_amount_personal']) : 0
        this.bookedamount = amt1 + amt2;
        results['requirement_code'] ? this.reqcode = results['requirement_code'] : false;
        if (this.cancelupdbtn) {
          let canceldata = results['cancel_data'][0];
          let lossofcancelation = canceldata.loss_of_cancelation ? canceldata.loss_of_cancelation.toFixed(2) : null
          let refund_amount = canceldata.refund_amount ? canceldata.refund_amount.toFixed(2) : null
          let canceldate = canceldata.cancelled_date ? new Date(canceldata.cancelled_date) : null
          let refunddate = canceldata.refund_date ? new Date(canceldata.refund_date) : null

          this.buscanForm.patchValue({
            booking_type: 3,
            cancel_reschedule: canceldata.cancel_reschedule,
            cancel_reason: canceldata.cancel_reason,
            refund_amount: refund_amount,
            fare_difference: Number(canceldata.fare_difference),
            loss_of_cancelation: lossofcancelation,
            refund_date: refunddate,
            cancelled_date: canceldate
          })

        }
      })
  }
  air(e) {
    this.bookid = e
    this.taservice.getairlist(this.bookid)
      .subscribe((result) => {
        this.getaccom = result['data']
        let results = result['data'][0]
        let checkin = results['from_time']
        let checkout = results['to_time']
        let ftime = new Date(checkin)
        let fromtime = String(ftime.getHours()).padStart(2, '0') + ':' + String(ftime.getMinutes()).padStart(2, '0')
        let ttime = new Date(checkout)
        let totime = String(ttime.getHours()).padStart(2, '0') + ':' + String(ttime.getMinutes()).padStart(2, '0')
        let fromplace = results['from_place']
        let toplace = results['to_place']
        let offamt = results['ticket_amount'] ? results['ticket_amount'].toFixed(2) : null
        let peramt = results['ticket_amount_personal'] ? results['ticket_amount_personal'].toFixed(2) : null
        this.airForm.patchValue({
          "from_time": this.datePipe.transform(checkin, 'yyyy-MM-dd'),
          "to_time": this.datePipe.transform(checkout, 'yyyy-MM-dd'),
          "frtime": fromtime,
          "ttime": totime,
          "from_place": fromplace,
          "to_place": toplace,
          "ticket_amount": offamt,
          "ticket_amount_personal": peramt,
          "comments": results['comments'],
          "admin_paid": results['admin_paid'],
          "cost_per_head": results["cost_per_head"],
          "issuance_type": results['issuance_type'],
          "difference_inamount": results['difference_inamount'],
          "vendor_name": results['vendor_name'],
          "fare_quoted": results['fare_quoted'],
          "website": results['website'],
          "ticket_no": results['ticket_no'],
          "PNR": results['PNR'],
          "flight_number": results['flight_number'],
          "ref_no": results['ref_no'],
        })

        this.cancellimit = new Date(results['booking_date']);
        let amt1 = results['ticket_amount'] ? Number(results['ticket_amount']) : 0
        let amt2 = results['ticket_amount_personal'] ? Number(results['ticket_amount_personal']) : 0
        this.bookedamount = amt1 + amt2;
        results['requirement_code'] ? this.reqcode = results['requirement_code'] : false;
        if (this.cancelupdbtn) {
          let canceldata = results['cancel_data'][0];
          let lossofcancelation = canceldata.loss_of_cancelation ? canceldata.loss_of_cancelation.toFixed(2) : null
          let refund_amount = canceldata.refund_amount ? canceldata.refund_amount.toFixed(2) : null
          let canceldate = canceldata.cancelled_date ? new Date(canceldata.cancelled_date) : null
          let refunddate = canceldata.refund_date ? new Date(canceldata.refund_date) : null
          this.aircanForm.patchValue({
            booking_type: 5,
            cancel_reschedule: canceldata.cancel_reschedule,
            cancel_reason: canceldata.cancel_reason,
            refund_amount: refund_amount,
            fare_difference: Number(canceldata.fare_difference),
            loss_of_cancelation: lossofcancelation,
            refund_date: refunddate,
            cancelled_date: canceldate
          })

        }
      })
  }
  cab(e) {
    this.bookid = e
    this.taservice.getcablist(this.bookid)
      .subscribe((result) => {
        this.getaccom = result['data']
        let results = result['data'][0]
        let checkin = results['from_time']
        let checkout = results['to_time']
        let ftime = new Date(checkin)
        let fromtime = String(ftime.getHours()).padStart(2, '0') + ':' + String(ftime.getMinutes()).padStart(2, '0')
        let ttime = new Date(checkout)
        let totime = String(ttime.getHours()).padStart(2, '0') + ':' + String(ttime.getMinutes()).padStart(2, '0')
        let fromplace = results['from_place']
        let toplace = results['to_place']
        let offamt = results['ticket_amount'] ? results['ticket_amount'].toFixed(2) : null
        let peramt = results['ticket_amount_personal'] ? results['ticket_amount_personal'].toFixed(2) : null
        this.cabForm.patchValue({
          "from_time": this.datePipe.transform(checkin, 'yyyy-MM-dd'),
          "to_time": this.datePipe.transform(checkout, 'yyyy-MM-dd'),
          "frtime": fromtime,
          "ttime": totime,
          "from_place": fromplace,
          "invoice_date": results['invoice_date'] ? this.datePipe.transform(results['invoice_date'], 'yyyy-MM-dd') : null,
          "to_place": toplace,
          "ticket_amount": offamt,
          "ticket_amount_personal": peramt,
          "comments": results['comments'],
          "cabtravels": [],
          "admin_paid": results['admin_paid'],
          "vendor_name": results['vendor_name'],
          "cab_number": results['cab_number'],
          "cab_segment": results['cab_segment'] ? results['cab_segment'] : null,
          "ticket_no": results['ticket_no'],
          "cost_per_head": results["cost_per_head"],
          "travel_type_cab": results['travel_type_cab'].toString(),
          "issuance_type": results['issuance_type'],
          "difference_inamount": results['difference_inamount'],
          "fare_quoted": results['fare_quoted'],
          "website": results['website'],
          // "ticket_no": results['ticket_no'],
          "PNR": results['PNR'],
        })

        this.cancellimit = new Date(results['booking_date']);
        let amt1 = results['ticket_amount'] ? Number(results['ticket_amount']) : 0
        let amt2 = results['ticket_amount_personal'] ? Number(results['ticket_amount_personal']) : 0
        this.bookedamount = amt1 + amt2;
        results['requirement_code'] ? this.reqcode = results['requirement_code'] : false;

        if (this.cancelupdbtn) {
          let canceldata = results['cancel_data'][0];
          let lossofcancelation = canceldata.loss_of_cancelation ? canceldata.loss_of_cancelation.toFixed(2) : null
          let refund_amount = canceldata.refund_amount ? canceldata.refund_amount.toFixed(2) : null
          let canceldate = canceldata.cancelled_date ? new Date(canceldata.cancelled_date) : null
          let refunddate = canceldata.refund_date ? new Date(canceldata.refund_date) : null
          this.cabcanForm.patchValue({
            booking_type: 2,
            cancel_reschedule: canceldata.cancel_reschedule,
            cancel_reason: canceldata.cancel_reason,
            refund_amount: refund_amount,
            fare_difference: Number(canceldata.fare_difference),
            loss_of_cancelation: lossofcancelation,
            refund_date: refunddate,
            cancelled_date: canceldate
          })

        }
      })
  }
  getbus() {
    this.taservice.getbus()
      .subscribe((results) => {
        this.getbuslist = results['data']
        console.log("results", results)
      })
  }
  getacc() {
    this.taservice.getacc()
      .subscribe((results) => {
        this.getaccom = results['data']
        console.log("results", results)
      })
  }
  getcab() {
    this.taservice.getcab()
      .subscribe((results) => {
        this.getcablist = results['data']
        console.log("results", results)
      })
  }
  getair() {
    this.taservice.getair()
      .subscribe((results) => {
        this.getairlist = results['data']
        console.log("results", results)
      })
  }
  gettrain() {
    this.taservice.gettrain()
      .subscribe((results) => {
        this.gettrainlist = results['data']
        console.log("results", results)
      })
  }
  requirementsdropdown() {

    this.taservice.gettourrequirementdropdown()
      .subscribe(res => {
        this.requirmentdropdowndata = res
        this.bookdata = res['name']
        console.log('hello', res)
      })
  }

  offcurrent(ind) {
    let status = this.taForm.value.detail[ind].official
    this.currentof = status
  }

  officialchange(ind) {
    let myform = this.taForm.value.detail[ind]
    let payload = {
      "type": 0,
      "id": myform.id,
      "official": Number(myform.official)
    }
    this.taservice.officialchange(payload)
      .subscribe(res => {
        if (res.status === "success") {
          this.notification.showSuccess("Travel Type Changed Successfully..")

          // this.onSubmit.emit();
          // this.route.navigateByUrl('ta/ta_summary');
          return true;
        } else {
          this.notification.showError(res.description)
          this.taForm.get('detail')['controls'][ind].get('official').setValue(this.currentof);
          return false;
        }
      })


  }
  timeclone: any;
  timelist = [];
  totimelist = [];
  createtime() {
    for (var j = 0; j < 24; j++) {
      let i = String(j).padStart(2, '0')
      var t00 = { 'name': i + ':00' }
      var t15 = { 'name': i + ':15' }
      var t30 = { 'name': i + ':30' }
      var t45 = { 'name': i + ':45' }
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
  totimefil(evt) {
    this.totimelist = this.timelist
    let value = evt.target.value;
    this.totimelist = this.totimelist.filter(function (element) {
      return element.name.includes(value)
    })
  }
  totimes() {
    this.totimelist = []
    let form = this.taForm.value.detail[this.index1].requirements[this.index2]
    if (form.booking_needed == "1") {
      let myform = this.accomodationForm.value;
      myform.checkin_time = new Date(myform.checkin_time)
      let time = myform.fromtime
      myform.checkout_time = new Date(myform.checkout_time)
      if (myform.checkin_time >= myform.checkout_time) {
        let index = this.timelist.findIndex((item) => item.name === time)
        let arr = this.timelist;
        this.totimelist = arr.slice(index + 1)
      }
      else if (myform.checkin_time < myform.checkout_time) {
        this.totimelist = this.timelist
      }
      else {
        this.totimelist = []
      }
    }
    else {
      let myform = this.cabForm.value
      myform.from_time = new Date(myform.from_time)
      myform.to_time = new Date(myform.to_time)
      let time = myform.frtime
      if (time && myform.from_time >= myform.to_time) {
        let index = this.timelist.findIndex((item) => item.name === time)
        let arr = this.timelist;
        this.totimelist = arr.slice(index + 1)
      }
      else if (myform.from_time < myform.to_time) {
        this.totimelist = this.timelist
      }
      else {
        this.totimelist = []
      }
    }

  }

  cablimit() {
    // console.log(this.cabtravels.value)
    let myform = this.cabForm.value.cabtravels
    if (myform.length < 3) {
      return false
    } else {
      return true
    }

  }



  getFormArraytoformarray(val): FormArray {
    return this.taForm.get('detail') as FormArray;
  }

  getattfiletype(value) {
    let stringValue = value.file_name.split('.')
    this.fileextension = stringValue.pop();
    if (this.file_ext.includes(this.fileextension)) {
      var msg = 1;
    }
    else {
      var msg = 0;
    }
    return msg
  }

  getattview(file) {

    let value = file
    let fileid = value.id;
    let option = 'view'
    // this.filesrc = this.getviewfilelist[ind].url
    console.log(this.filesrc)
    let msg = this.getattfiletype(value);
    // this.commentPopup(value.id, value.file_name)
    this.taservice.viewfile(fileid, option, value).subscribe(results => {
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);

      let token = tokenValue.token;
      if (this.file_ext.includes(this.fileextension.toLowerCase())) {
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
  getattdown(file) {
    let value = file
    let fileid = value.id;
    let option = 'view'

    this.SpinnerService.show()
    this.taservice.viewfile(fileid, option, value).subscribe(results => {
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      this.filesrc = downloadUrl
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = value.file_name;
      link.click();
      console.log(this.filesrc)
    })
  }

  requirementsdata(data) {

    console.log("data for requirements", data)
    let arr = new FormArray([]);
    this.book = data
    console.log("this.book", this.book)
    for (let datass of data) {

      let acckey
      let otherkey
      if (datass.booking_needed == '1') {
        acckey = true
        otherkey = false
        document.getElementById('tablesize').style.width = "230%"
      }
      if (datass.booking_needed != '1') {
        acckey = false
        otherkey = true
        document.getElementById('tablesize').style.width = "230%"
      }

      var checkintime = datass.checkin_time
      var checkouttime = datass.checkout_time
      var fromtime = datass.from_time
      var totime = datass.to_time
      var checkin = new Date(checkintime)
      var checkout = new Date(checkouttime)
      console.log('date', checkin, checkout)
      var check_in_time = String(checkin.getHours()).padStart(2, '0') + ':' + String(checkin.getMinutes()).padStart(2, '0')
      var check_out_time = String(checkout.getHours()).padStart(2, '0') + ':' + String(checkout.getMinutes()).padStart(2, '0')
      if (fromtime) {

        var other_fromtime = new Date(fromtime)
        // console.log(other_fromtime)
        var otherfromtime = String(other_fromtime.getHours()).padStart(2, '0') + ':' + String(other_fromtime.getMinutes()).padStart(2, '0')
        // if(datass.booking_needed == '1'){z
        fromtime = other_fromtime
      }
      else {
        other_fromtime = null;
        otherfromtime = null;
        fromtime = null;
      }

      let dataToPushInner = this.formBuilder.group({
        id: datass.id,
        booking_needed: datass.booking_needed.toString(),
        comments: datass.comments,
        checkin_time: new Date(checkintime),
        checkout_time: new Date(checkouttime),
        checkintime: check_in_time,
        checkouttime: check_out_time,
        place_of_stay: datass.place_of_stay,
        room_type: datass.room_type ? datass.room_type : null,
        no_of_nights: datass.no_of_nights ? datass.no_of_nights : null,
        Accomodationkey: acckey,
        otherkey: otherkey,
        // from_time: this.datePipe.transform(datass.from_time, 'yyyy-MM-ddTHH:mm'),
        from_time: fromtime,
        fromdate: fromtime,
        fromtime: otherfromtime,
        from_place: datass.from_place,
        to_place: datass.to_place,
        // to_time: this.datePipe.transform(datass.to_time, 'yyyy-MM-ddTHH:mm'),
        booking_status: datass.booking_status,
        takenby: datass.booked_by.code ? `(${datass.booked_by.code}) ${datass.booked_by.full_name}` : null,
        takenbyid: datass.booked_by.code ? datass.booked_by.id : null,
        travel_type_cab: datass.travel_type_cab ? String(datass.travel_type_cab) : null,
        filedetail: datass.file_detail ? [datass.file_detail] : [],
        requirement_code: datass.requirement_code ? datass.requirement_code : null,
        reissue_requirement_code: datass.reissue_requirement_code ? datass.reissue_requirement_code : null,
        cab_segment: datass.cab_segment ? datass.cab_segment : null,
        instructions: datass.instructions ? datass.instructions : null,


      })

      arr.push(dataToPushInner)




    }
    return arr


  }

  gettraveltype() {
    this.taservice.gettravletypedropdown()
      .subscribe(res => {
        console.log('travel type', res)
        this.traveltypedropdown = res
      })
  }

  getcabseg() {
    this.taservice.getcabsegment().subscribe(results => {
      this.cabsegment = results;
    })
  }

  getroomtype() {
    this.taservice.getroomtype().subscribe(results => {
      this.roomtype = results;
    })
  }


  getfileuploaded(id, type) {
    this.taservice.getreqfiles(id, type).subscribe(results => {
      console.log('file', results['data'])
      this.getviewfilelist = results['data']
    })
  }

  getfileview(ind) {
    let value = this.getviewfilelist[ind]
    let fileid = value.id;
    let option = 'view'
    this.filesrc = this.getviewfilelist[ind].url
    console.log(this.filesrc)
    let msg = this.getfiletype_check2(ind);
    // this.commentPopup(value.id, value.file_name)
    this.taservice.viewfile(fileid, option, value).subscribe(results => {
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);

      let token = tokenValue.token;
      if (this.file_ext.includes(this.fileextension.toLowerCase())) {
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

  getfiletype_check2(i) {
    let stringValue = this.getviewfilelist[i].file_name.split('.')
    this.fileextension = stringValue.pop();
    if (this.file_ext.includes(this.fileextension)) {
      var msg = 1;
    }
    else {
      var msg = 0;
    }
    return msg


  }

  approve_cancellation() {
    // booking_cancel_approve
    this.taservice.booking_cancel_approve(this.taForm.value, this.fileData)
      .subscribe(res => {
        console.log("incires", res)
        if (res.status === "success") {
          this.SpinnerService.hide()
          this.notification.showSuccess("Success....")
          // this.onSubmit.emit();
          // this.route.navigateByUrl('ta/ta_summary');
          return true;
        } else {
          this.SpinnerService.hide()
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


  public clientvalue(subject?: clientvalue): string | undefined {
    return subject ? '(' + (subject.client_code) + ') ' + (subject.client_name) : undefined;
  }

  clientsearch(i, event) {
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

    else {
      this.getclientsearch()

    }
    let ind = this.pageSize * (this.p - 1) + i;

    (this.taForm.get('detail') as FormArray).at(i).get('client').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          // this.isLoading = true;
        }),
        switchMap(value => this.taservice.getclientsearch(value, 1, this.onbehalfid))
      )
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.clientdropdowndata = datas;
        let datapagination = results["pagination"];

        if (this.clientdropdowndata.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.clientcurrentpage = datapagination.index;
        }
      });

  }

  getdefaultclientsearch(e) {
    this.taservice.getclientsearch(e.target.value, 1, this.onbehalfid).subscribe(result => {
      console.log(result)
      this.clientdropdowndata = result['data']

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

  typeaupdate() {
    let myform = this.accomodationForm.value;
    var rackrate: number = myform.no_of_nights * myform.rack_rate_night;
    this.accomodationForm.patchValue({
      total_a: rackrate
    })
    this.totalcost();
  }
  typebupdate() {
    let myform = this.accomodationForm.value;
    var rackrate: number = myform.no_of_nights * myform.nac_rate;
    this.accomodationForm.patchValue({
      total_b: rackrate
    });
    this.totalcost();

  }
  totalcost() {
    let myform = this.accomodationForm.value;
    var costsaved = myform.total_a - myform.total_b;
    this.accomodationForm.patchValue({
      amount_saved: costsaved
    })
  }

  
  nightDiff(form) {
    

    if (form.booking_needed == '1') {
      this.nStart = new Date(this.datePipe.transform(form.checkin_time, 'yyyy-MM-dd HH:mm:ss'));
      this.nEnd = new Date(this.datePipe.transform(form.checkout_time, 'yyyy-MM-dd HH:mm:ss'));

      this.Time = this.nEnd - this.nStart;
      this.Nights = Math.floor(this.Time / (1000 * 3600 * 24)); //Diference in Days
      this.accomodationForm.patchValue({
        no_of_nights:this.Nights,
      })
    }


  }

}

