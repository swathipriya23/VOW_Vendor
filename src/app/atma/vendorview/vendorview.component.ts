import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ShareService } from '../share.service'
import { AtmaService } from '../atma.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../notification.service'
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { isBoolean } from 'util';
import { confirmationservice } from '../confirmnotification/confirmationservice'
import { DocumentSummaryComponent } from '../document-summary/document-summary.component';
import { DataService } from '../../service/data.service'
import { SharedService } from '../../service/shared.service'
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'
import { DomSanitizer } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';
import { FormGroupDirective } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-vendorview',
  templateUrl: './vendorview.component.html',
  styleUrls: ['./vendorview.component.scss']
})
export class VendorviewComponent implements OnInit {

  @Output() onCancel = new EventEmitter < any > ();
  popupform: FormGroup
  @ViewChild('closebutton') closebutton;
  @ViewChild('closebuttonretn') closebuttonretn;
  @ViewChild('closedeclbutton') closedeclbutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective
  @ViewChild('closebuttonbranch') closebuttonbranch;
  @ViewChild('closebuttonbranchedit') closebuttonbranchedit;
  @ViewChild('closebuttonclient') closebuttonclient;
  @ViewChild('closebuttonclientedit') closebuttonclientedit;
  @ViewChild('closebuttonclientview') closebuttonclientview;
  @ViewChild('closebuttonclientmod_view') closebuttonclientmod_view;
  @ViewChild('closebuttonvendorview') closebuttonvendorview;
  @ViewChild('closebuttoncontractorcreate') closebuttoncontractorcreate;
  @ViewChild('closebuttoncontractoredit') closebuttoncontractoredit;
  @ViewChild('closecontractorCancel') closecontractorCancel;
  @ViewChild('closebuttonproductform') closebuttonproductform;
  @ViewChild('closebuttonproducteditform') closebuttonproducteditform;
  @ViewChild('closebuttonproductview') closebuttonproductview;
  @ViewChild('closebuttonbranchtax') closebuttonbranchtax;
  @ViewChild('closebuttonbranchtaxedit') closebuttonbranchtaxedit;
  @ViewChild('closebuttonbranchtaxview') closebuttonbranchtaxview;
  @ViewChild('closebuttondocumentform') closebuttondocumentform;
  @ViewChild('closebuttondocumentedit') closebuttondocumentedit;
  @ViewChild('closebuttondocumentview') closebuttondocumentview;
  @ViewChild('addBranchpopup') addBranchpopup;
  @ViewChild('closebuttonriskform') closebuttonriskform; 
  @ViewChild('closebuttonriskedit') closebuttonriskedit;
  @ViewChild('closebuttonriskview') closebuttonriskview;
  @ViewChild('closebuttonkycform') closebuttonkycform;
  @ViewChild('closebuttonkycedit') closebuttonkycedit;
  @ViewChild('closebuttonkycview') closebuttonkycview;

  statusTab: any;

  myControl = new FormControl('BRANCH DETAILS');

  dropDownTag = "BRANCH DETAILS";

  tabdata = [{
      "tab_name": "BRANCH DETAILS",
      "tab_id": "6"
    },
    {
      "tab_name": "CLIENT",
      "tab_id": "7"
    },
    {
      "tab_name": "CONTRACTOR",
      "tab_id": "8"
    },
    {
      "tab_name": "PRODUCT",
      "tab_id": "9"
    },
    {
      "tab_name": "DOCUMENT",
      "tab_id": "10"
    },
    {
      "tab_name": "ACTIVITY",
      "tab_id": "13"
    },
    {
      "tab_name": "ACTIVITYDETAIL",
      "tab_id": "14"
    },
    {
      "tab_name": "CATELOG",
      "tab_id": "15"
    },
    {
      "tab_name": "PAYMENT",
      "tab_id": "12"
    },
    {
      "tab_name": "SUPPLIERTAX",
      "tab_id": "11"
    }
  ];
  TabArray: string[] = ['BRANCH DETAILS', 'TAX DETAILS', 'DOCUMENT', 'RISK', 'KYC','TRANSACTION'];
  TabArrayforothers: string[] = ['BRANCH DETAILS', 'TAX DETAILS', 'DOCUMENT', 'RISK', 'TRANSACTION'];
  options: string[] = ['BRANCH DETAILS', 'CLIENT', 'CONTRACTOR','TAX DETAILS', 'PRODUCT', 'DOCUMENT', 'TRANSACTION'];
  filteredOptions: Observable < string[] > ;
  client_RMView = false;
  contractor_RMView = false;
  document_RMView = false;
  risk_RMView = false;
  isKYC = false;
  isKYCForm = false;
  isKYCEditForm = false;
  kyc_RMView = false;
  product_RMView = false;
  client_flag = false;
  tax_modify=false;
  contractor_flag = false;
  branch_flag = false
  payment_flag = false;
  branchSummary = true;
  status: number;
  Fileidd:number;
  vendorId: number;
  modify_changestatus: any;
  rmId: number;
  dialogConfig: any
  createby: number;
  userId: number;
  qId: number;
  activeContract: any;
  actualSpend: number;
  aproxSpend: number;
  emailDays: any;
  code: string;
  companyRegNo: string;
  contractFrom: string;
  contractTo: string;
  gstNo: string;
  mainStatusName: string;
  name: string;
  contractReason: string;
  panNo: string;
  remarks: string;
  renewalDate: string;
  requestStatusName: string;
  vendorStatusName: string;
  website: string;
  SupplierTax: string;
  composite: string
  classification: string;
  group: string;
  customerCategory: string;
  condition:string;
  comflag:any;
  organizationType: string;
  type: string;
  cityName: string;
  districtName: string;
  lineName1: string;
  lineName2: string;
  lineName3: string;
  pinCode: number
  stateName: string
  contactName: string;
  contactTypeName: string;
  contactDesignation: string;
  contactLandline1: string;
  contactLandline2: string;
  contactMobile1: string;
  contactMobile2: string
  contactEmail: string;
  vendorViewDetailList: any;
  profile_Temp_Employee: string;
  profile_Per_Employee: string;
  profile_Tot_Employee: string;
  profileAward: string;
  profileBranch: number;
  profileRemarks: string;
  profileFactory: number;
  profileYear: number;
  isBranch: boolean;
  isClient: boolean;
  isContractor: boolean;
  isProduct: boolean;
  isDocument: boolean;
  isRisk: boolean;
  isRiskForm: boolean;
  isRiskEditForm: boolean;
  branchList: any;
  branchPagination: any;
  clientList: any;
  productList: any;
  contactorList: any;
  documentList: any;
  riskList: any;
  KYCList: any;
  isBranchForm: boolean;
  isClientForm: boolean;
  isContractorForm: boolean;
  isProductForm: boolean;
  isDocumentForm: boolean;
  isBranchEditForm: boolean;
  isClientEditForm: boolean;
  isContactorEditForm: boolean;
  isProductEditForm: boolean;
  isDocumentEditForm: boolean;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  pageSize = 10;

  contractorpage = 1;
  contractor_next = true;
  renewal_flag = false;
  contractor_previous = true;

  clientpage = 1;
  client_next = true;
  client_previous = true;
  branchpage = 1;
  branch_next = true;
  branch_previous = true;
  productpage = 1;
  product_next = true;
  product_previous = true;
  documentpage: number = 1;
  riskpage = 1;
  risk_next = true;
  risk_previous = true;
  kycpage = 1;
  kyc_next = true;
  kyc_previous = true;
  branchtax_id: any;
  vendorData: any;
  rmName: string;
  getbranchLength: number;
  isBranchButton = true;
  rejectFrom: FormGroup
  returnForm: FormGroup;
  declarationForm: FormGroup
  isRejectBtn = false;
  isReturnBtn = false;
  isDraft = false;
  isPendingRM = false;
  isPendingChecker = false;
  isPendingHeader = false;
  isApproved = false;
  ispending = false;
  ismodification = false;
  rm_viewscreen = false;
  isdeactivation = false;
  isactivation = false;
  istermination = false;
  action_flag_branch = true;
  isOwnerflag = false;
  isRmflag = false;
  isHeaderflag = false
  rejectedList: any;
  isContractorPagination: boolean;
  isDocumentPagination: boolean;
  isBranchPagination: boolean;
  isClientPagination: boolean;
  isProductPagination: boolean;
  isRiskPagination: boolean;
  iskycPagination: boolean;
  vendorStatusId: number;
  vendorStatusEmpty = "";
  // ----changeview start----
  changeviewlist: Array < any > ;
  newName: string;
  newPanno: string;
  newRemark: string;
  newAddressCity: string;
  oldName: string;
  oldPanno: string;
  oldRemark: string;
  oldAddressCity: string;
  action1Name: string;
  action1pan: string;
  action1Remarks: string;
  action1Line: string;
  isBranchcv: boolean;
  isClientcv: boolean;
  isContractorcv: boolean;
  isProductcv: boolean;
  gstNobr: string;
  gstNost: string;
  limitdaysbr: number
  limitdaysst: number
  Creditbr: number
  Creditst: number
  contactname: string;
  contactemail: string;
  contactdob: Date;
  contactweding: Date;
  designname: string;
  typename: string;
  contactline1: number;
  contactline2: number;
  contactmob1: number;
  contactmob2: number;
  oldline2: number;
  oldline3: number;
  oldcityname: string;
  oldDistrictname: string;
  oldpincodeno: number;
  staten: string;
  newcontactname: string;
  newcontactemail: string;
  newcontactdob: Date;
  newcontactweding: Date;
  newdesignname: string;
  newtypename: string;
  newcontactline1: number;
  newcontactline2: number;
  newcontactmob1: number;
  newcontactmob2: number;
  newline2: number;
  newline3: number;
  newcityname: string;
  newDistrictname: string;
  newpincodeno: number;
  newstaten: string;
  newgstNo: number;
  newlimitdays: number;
  newCredit: number;
  oldservice: string;
  newservice: string;
  // productcreate
  age: number;
  designation: string;
  dob: Date;
  email: string;
  lanline: number;
  landline2: number;
  mob: number;
  mob2: number;
  c1name: string;
  c1type: string;
  wd: Date;
  c2age: number;
  c2designation: string;
  c2dob: Date;
  c2email: string;
  c2lanline: number;
  c2landline2: number;
  c2mob: number;
  c2mob2: number;
  c2name: string;
  c2type: string;
  c2wd: Date;
  c3age: number;
  c3designation: string;
  c3dob: Date;
  c3email: string;
  c3lanline: number;
  c3landline2: number;
  c3mob: number;
  c3mob2: number;
  c3name: string;
  c3type: string;
  c3wd: Date;
  c4age: number;
  c4designation: string;
  c4dob: Date;
  c4email: string;
  c4lanline: number;
  c4landline2: number;
  c4mob: number;
  c4mob2: number;
  c4name: string;
  c4type: string;
  c4wd: Date;
  Productname: String;
  producttype: string;
  productlist: any;
  // productupdate
  oldage: number;
  olddesignation: string;
  olddob: Date;
  oldemail: string;
  oldlanline: number;
  oldlandline2: number;
  oldmob: number;
  oldmob2: number;
  oldc1name: string;
  oldc1type: string;
  oldwd: Date;
  oldc2age: number;
  oldc2designation: string;
  oldc2dob: Date;
  oldc2email: string;
  oldc2lanline: number;
  oldc2landline2: number;
  oldc2mob: number;
  oldc2mob2: number;
  oldc2name: string;
  oldc2type: string;
  oldc2wd: Date;
  oldc3age: number;
  oldc3designation: string;
  oldc3dob: Date;
  oldc3email: string;
  oldc3lanline: number;
  oldc3landline2: number;
  oldc3mob: number;
  oldc3mob2: number;
  oldc3name: string;
  oldc3type: string;
  oldc3wd: Date;
  oldc4age: number;
  oldc4designation: string;
  oldc4dob: Date;
  oldc4email: string;
  oldc4lanline: number;
  oldc4landline2: number;
  viewarray = [];
  clientcreateview = false;
  oldc4mob: number;
  oldc4mob2: number;
  oldc4name: string;
  oldc4type: string;
  oldc4wd: Date;
  oldProductname: String;
  oldproducttype: string;
  newage: number;
  newdesignation: string;
  newdob: Date;
  newemail: string;
  newlanline: number;
  newlandline2: number;
  newmob: number;
  newmob2: number;
  newc1name: string;
  newc1type: string;
  newwd: Date;
  newc2age: number;
  newc2designation: string;
  newc2dob: Date;
  newc2email: string;
  newc2lanline: number;
  newc2landline2: number;
  newc2mob: number;
  newc2mob2: number;
  newc2name: string;
  newc2type: string;
  newc2wd: Date;
  newc3age: number;
  newc3designation: string;
  newc3dob: Date;
  newc3email: string;
  newc3lanline: number;
  newc3landline2: number;
  newc3mob: number;
  newc3mob2: number;
  newc3name: string;
  newc3type: string;
  newc3wd: Date;
  newc4age: number;
  newc4designation: string;
  newc4dob: Date;
  newc4email: string;
  newc4lanline: number;
  newc4landline2: number;
  newc4mob: number;
  newc4mob2: number;
  newc4name: string;
  newc4type: string;
  newc4wd: Date;
  newProductname: String;
  newproducttype: string;

  // clientupdate
  oldclientname: string;
  oldclientline1: string;
  oldclientline2: string;
  oldclientline3: string;
  oldclientcity: string;
  oldclientdistrict: string;
  oldclientstate: string;
  oldclientpincode: number;
  newclientname: string;
  newclientline1: string;
  newclientline2: string;
  newclientline3: string;
  newclientcity: string;
  newclientdistrict: string;
  newclientstate: string;
  newclientpincode: number;

  // contractupdate
  oldcontractname: string;
  oldcontractservice: string;
  oldcontractremark: string;
  newcontractname: string;
  newcontractservice: string;
  newcontractremark: string;
  // contractcreate
  createcontractname: string;
  createcontractservice: string;
  createcontractremark: string;

  // suppliertax
  oldsupplierattachment: string;
  oldsupplerbranchname: string;
  oldsupplierbranchcredit: string;
  oldsupplierbranchgst: string;
  oldsupplierlimit: number;
  oldsupplierpan: string;
  oldsupplierexfrom: Date;
  oldsupplierexrate: BigInteger;
  oldsupplierexto: Date;
  oldsupplierpanno: string;
  oldsuppliertax: number;
  oldsuppliertaxrate: number;
  oldsuppliersubtax: number;
  oldsupplierexcemis: string;
  oldsupppliermsme: string;
  newsupplierattachment: string;
  newsupplerbranchname: string;
  newsupplierbranchcredit: string;
  newsupplierbranchgst: string;
  newsupplierlimit: number;
  newsupplierpan: string;
  newsupplierexfrom: Date;
  newsupplierexrate: BigInteger;
  newsupplierexto: Date;
  newsupplierpanno: string;
  newsuppliertax: number;
  newsuppliertaxrate: number;
  newsuppliersubtax: number;
  newsupplierexcemis: string;
  newsupppliermsme: string;
  isActivity: boolean;
  isActivityDetail: boolean;
  isCatalog: boolean;
  isTaxDetail: boolean;
  isPaymentDetail: boolean;
  //  payment
  oldsupplieracc: string;
  oldpaymentbranchname: string;
  oldsupplierpaymode: string;
  oldsupplierbank: string;
  oldsupplierbankbranch: string;
  oldsupplierifsc: string;
  oldsupplieracctype: string;
  oldsupplierbenifier: string;
  newsupplieracc: string;
  newpaymentbranchname: string;
  newsupplierpaymode: string;
  newsupplierbank: string;
  newsupplierbankbranch: string;
  newsupplierifsc: string;
  newsupplieracctype: string;
  newsupplierbenifier: string;

  // catalogupdate
  oldcatactivitydtlname: string;
  oldcatalodproductname: string;
  oldcatalogcategory: string;
  oldcatalodsubcat: string;
  oldcatalogname: string;
  oldcatalogremark: string;
  oldcataloguom: string;
  oldcatfromdate: Date;
  oldcattodate: Date;
  oldcatspecification: string;
  oldcatsize: number;
  oldcatunitprice: number;
  oldcatpackingprice: number;
  oldcatdeliverdate: Date;
  oldcatcapacity: number;
  oldcatdirect: string;
  newcatactivitydtlname: string;
  newcatalodproductname: string;
  newcatalogcategory: string;
  newcatalodsubcat: string;
  newcatalogname: string;
  newcatalogremark: string;
  newcataloguom: string;
  newcatfromdate: Date;
  newcattodate: Date;
  newcatspecification: string;
  newcatsize: number;
  newcatunitprice: number;
  newcatpackingprice: number;
  newcatdeliverdate: Date;
  newcatcapacity: number;
  newcatdirect: string;
  getmodList: any;
  // branchcreate--
  branchname: string;
  brpanno: string;
  brgstno: string;
  brlimitday: Date;
  brcredit: string;
  brcontactname: string;
  brcontactmail: string;
  brcontactdob: Date;
  brcontactweding: Date;
  brdesignation: string;
  brtypename: string;
  brcontactline1: string;
  brcontactline2: string;
  brcontactmob: number;
  brcontactmob2: number;
  brcity: string;
  brdistrict: string;
  brstate: string;
  brpincode: number;
  brline1: string;
  brline2: string;
  brline3: string;
  // branchdelete--
  brdltanchname: string;
  brdltpanno: string;
  brdltgstno: string;
  brdltlimitday: Date;
  brdltcredit: string;
  brdltcontactname: string;
  brdltcontactmail: string;
  brdltcontactdob: Date;
  brdltcontactweding: Date;
  brdltdesignation: string;
  brdlttypename: string;
  brdltcontactline1: string;
  brdltcontactline2: string;
  brdltcontactmob: number;
  brdltcontactmob2: number;
  brdltcity: string;
  brdltdistrict: string;
  brdltstate: string;
  brdltpincode: number;
  brdltline1: string;
  brdltline2: string;
  brdltline3: string;
  // suptax--
  remove_actions = false;
  contractid: any
  supbranchname: string;
  supbrcredit: string;
  supbrgst: string;
  supbrpanno: string;
  supbrlimit: string;
  supexcemfrom: Date;
  supexcemto: Date;
  supexcemrate: number;
  suppanno: string;
  suptax: string;
  suptaxrate: number;
  supsubtax: string;
  supexcempis: string;
  supmsme: string;
  // --suptaxdelete--
  supdltbranchname: string;
  supdltbrcredit: string;
  supdltbrgst: string;
  supdltbrpanno: string;
  supdltbrlimit: string;
  supdltexcemfrom: Date;
  supdltexcemto: Date;
  supdltexcemrate: number;
  supdltpanno: string;
  supdlttax: string;
  supdlttaxrate: number;
  supdltsubtax: string;
  supdltexcempis: string;
  supdltmsme: string;
  // catalogcreate--
  catactivitydtl: string;
  catproduct: string;
  catcategory: string;
  catsubcat: string;
  catname: string;
  catremark: string;
  catuom: string;
  catfromdata: Date;
  cattodate: Date;
  catspecification: string;
  catsize: number;
  catunitprice: number;
  catpackingprice: number;
  catdeliverydate: Date;
  catcapacity: number;
  catdirect: string;
  // catalogdelete--
  catdtlactivitydtl: string;
  catdtlproduct: string;
  catdtlcatdtlegory: string;
  catdtlsubcatdtl: string;
  catdtlname: string;
  catdtlremark: string;
  catdtluom: string;
  catdtlfromdata: Date;
  catdtltodate: Date;
  catdtlspecificatdtlion: string;
  catdtlsize: number;
  catdtlunitprice: number;
  catdtlpackingprice: number;
  catdtldeliverydate: Date;
  catdtlcapacity: number;
  catdtldirect: string;
  // productdelete--
  dtlage: number;
  dtldesignation: string;
  dtldob: Date;
  dtlemail: string;
  dtllanline: number;
  dtllandline2: number;
  dtlmob: number;
  dtlmob2: number;
  c1dtlname: string;
  c1dtltype: string;
  dtlwd: Date;
  c2dtlage: number;
  c2dtldesignation: string;
  c2dtldob: Date;
  c2dtlemail: string;
  c2dtllanline: number;
  c2dtllandline2: number;
  c2dtlmob: number;
  c2dtlmob2: number;
  c2dtlname: string;
  c2dtltype: string;
  c2dtlwd: Date;
  c3dtlage: number;
  c3dtldesignation: string;
  c3dtldob: Date;
  c3dtlemail: string;
  c3dtllanline: number;
  c3dtllandline2: number;
  c3dtlmob: number;
  c3dtlmob2: number;
  c3dtlname: string;
  c3dtltype: string;
  c3dtlwd: Date;
  c4dtlage: number;
  c4dtldesignation: string;
  c4dtldob: Date;
  c4dtlemail: string;
  c4dtllanline: number;
  c4dtllandline2: number;
  c4dtlmob: number;
  c4dtlmob2: number;
  c4dtlname: string;
  c4dtltype: string;
  c4dtlwd: Date;
  dtlProductname: String;
  dtlproducttype: string;
  // activity--
  acttype: string;
  actname: string;
  actstartdate: Date;
  actenddate: Date;
  actRM: string;
  actconperson: string;
  actstatus: string;
  actbidding: string;
  actspend: number;
  actfidelity: string;
  actconemail: string;
  actconline1: number;
  actconline2: number;
  actconmob: number;
  actconmob2: number;
  // paymentcreate
  crtsupplieracc: number;
  crtpaymentbranchname: string;
  crtsupplierpaymode: string;
  crtsupplierbank: string;
  crtsupplierbankbranch: string;
  crtsupplierifsc: string;
  crtsupplieracctype: string;
  crtsupplierbenifier: string;
  // paymentdelete--
  delsupplieracc: number;
  delpaymentbranchname: string;
  delsupplierpaymode: string;
  delsupplierbank: string;
  delsupplierbankbranch: string;
  delsupplierifsc: string;
  delsupplieracctype: string;
  delsupplierbenifier: string;
  // client--
  crtclientname: string;
  crtclientline1: string;
  crtclientline2: string;
  crtclientline3: string;
  crtclientcity: string;
  crtclientdistrict: string;
  crtclientstate: string;
  crtclientpincode: string;
  // clientdelete--
  delclientname: string;
  delclientline1: string;
  delclientline2: string;
  delclientline3: string;
  delclientcity: string;
  delclientdistrict: string;
  delclientstate: string;
  delclientpincode: string;
  // actvityupdate--
  oldacttype: string;
  oldactname: string;
  oldactstartdate: Date;
  oldactenddate: Date;
  oldactRM: string;
  oldactconperson: string;
  oldactstatus: string;
  oldactbidding: string;
  oldactspend: number;
  oldactfidelity: string;
  oldactconemail: string;
  oldactconline1: number;
  oldactconline2: number;
  oldactconmob: number;
  oldactconmob2: number;
  newacttype: string;
  newactname: string;
  newactstartdate: Date;
  newactenddate: Date;
  newactRM: string;
  newactconperson: string;
  newactstatus: string;
  newactbidding: string;
  newactspend: number;
  newactfidelity: string;
  newactconemail: string;
  newactconline1: number;
  newactconline2: number;
  newactconmob: number;
  newactconmob2: number;
  // activitydelete
  delacttype: string;
  delactname: string;
  delactstartdate: Date;
  delactenddate: Date;
  delactRM: string;
  delactconperson: string;
  delactstatus: string;
  delactbidding: string;
  delactspend: number;
  delactfidelity: string;
  delactconemail: string;
  delactconline1: number;
  delactconline2: number;
  delactconmob: number;
  delactconmob2: number;

  // activitydtl
  oldactdtlactivityname: string;
  oldactdtlname: string;
  oldactdtlraisor: string;
  oldactdtlapprover: string;
  oldactdtlremarks: string;
  newactdtlactivityname: string;
  newactdtlname: string;
  newactdtlraisor: string;
  newactdtlapprover: string;
  newactdtlremarks: string;

  actdtlactivityname: string;
  actdtlname: string;
  actdtlraisor: string;
  actdtlapprover: string;
  actdtlremarks: string;
  delactdtlactivityname: string;
  delactdtlname: string;
  delactdtlraisor: string;
  delactdtlapprover: string;
  delactdtlremarks: string;

  delcontractname: string;
  delcontractservice: string;
  delcontractremark: string;
  statusid: string;
  modificationdata = [];
  vendor_flag = false;
  contract_data = [];
  document_data = [];
  risk_data = [];
  kyc_data = [];
  payment_data = [];
  tax_data = [];
  catalouge_data = [];
  activity_detail = [];
  activity_data = [];
  document_modify = false;
  risk_modify = false;
  kyc_modify = false;
  client_data = [];
  product_data = [];
  branch_data = [];
  contract_modify = false;
  client_modify = false;
  product_modify = false;
  branch_modify = false;
  getcontractlist: Array < any > ;
  branchnames = [];
  branchstatus: any;
  Branchpopup = false;
  isTransaction: boolean;
  transactionpage: number = 1;
  transactionList: any;
  ismodificationView = false;
  modifyrefid: any;
  updateactiveContract: any;
  updateactualSpend: string;
  updateaproxSpend: string;
  updateEmailDays: any;
  updatecode: string;
  updatecompanyRegNo: string;
  updatecontractFrom: string;
  updatecontractTo: string;
  updategstNo: string;
  updatemainStatusName: string;
  updatename: string;
  updatecontractReason: string;
  updatepanNo: string;
  updateremarks: string;
  updaterenewalDate: string;
  updaterequestStatusName: string;
  updatevendorStatusName: string;
  updatecreateby: string;
  updateuserId: string;
  updateqId: string;
  updatestatusid: string;
  updatewebsite: string;
  updatecomposite: string;
  updateclassification: string;
  updategroup: string;
  updatecustomerCategory: string;
  updateorganizationType: string;
  updatetype: string;
  updatelineName1: string;
  updatelineName2: string;
  updatelineName3: string;
  updatecityName: string;
  updatedistrictName: string;
  updatestateName: string;
  updatepinCode: string;
  updatecontactName: string;
  updatecontactTypeName: string;
  updatecontactDesignation: string;
  updatecontactLandline1: string;
  updatecontactLandline2: string;
  updatecontactMobile1: string;
  updatecontactMobile2: string;
  updatecontactEmail: string;
  updateprofile_Per_Employee: string;
  updateprofile_Temp_Employee: string;
  updateprofile_Tot_Employee: string;
  updateprofileAward: string;
  updateprofileBranch: number;
  updateprofileFactory: string;
  updateprofileRemarks: string;
  updateprofileYear: string;
  updatermName: string;
  updatevendorStatusId: string;
  reqstatus: string;
  button_true = false;
  modifystatus: any;
  vendorid: any;
  vendorIdForEdit: any;
  branch_button = false;
  aadharno: string;
  updateaadharno: string;
  dateofbirth: string;
  updatedateofbirth: string;
  breadcrumbarray = []
  vid: any;
  vendoremail: any;
  docbtn: boolean;
  login_id: any;
  products: [];
  has_next_tax = false;
  has_previous_tax = false;
  Branchtaxadd = false;
  istax: boolean;
  taxedit: boolean;
  branchtax_RMView: boolean;
  branchtax: boolean;
  PANNO_FLAG = true;
  AADHAR_FLAG = true;
  branch_Flag = false;
  doc_Flag= false;
  kycfg= false;
  rm_verify = 'False';
  vendorcode:any;
  constructor(private shareService: ShareService, private atmaService: AtmaService,
    private fb: FormBuilder, private notification: NotificationService,
    private router: Router, private dialog: MatDialog, private confirmationDialogService: confirmationservice, private dataService: DataService, private http: HttpClient,
    
    private activateRoute: ActivatedRoute,
    private sanitizer: DomSanitizer, private route: ActivatedRoute,
    private toastr: ToastrService,private SpinnerService: NgxSpinnerService,) {}

  ngOnInit(): void {
    const sessionData = localStorage.getItem("sessionData")
    let logindata = JSON.parse(sessionData);
    this.vendorcode = logindata.branch_code

    this.login_id = logindata.employee_id;
    this.shareService.loginID.next(logindata)
    this.isBranch = true;
    let data: any = this.shareService.vendorView.value;
 
    
    // this.vendorId = data.id
    // this.rmId = data.rm_id.id;

    this.route.queryParams
      .subscribe(params => {
        // console.log(params); 
        this.vid = params.vid;
        this.vendoremail = params.from;

      });
    
    


    if (this.vendoremail === 'email') {
      // this.getMenuUrl()
      this.vendorId = this.vid;
    }
 
    this.popupform = this.fb.group({

      actividet: [{
        value: false,
        disabled: isBoolean
      }],
      catalog: [{
        value: false,
        disabled: isBoolean
      }],
      suppactivity: [{
        value: false,
        disabled: isBoolean
      }],
      suppbrnch: [{
        value: false,
        disabled: isBoolean
      }],
      supppayment: [{
        value: false,
        disabled: isBoolean
      }],
      suppprod: [{
        value: false,
        disabled: isBoolean
      }],
      supptax: [{
        value: false,
        disabled: isBoolean
      }],
      client: [{
        value: false,
        disabled: isBoolean
      }],
      suppdoc: [{
        value: false,
        disabled: isBoolean
      }],
      suppcont: [{
        value: false,
        disabled: isBoolean
      }],  
      Due_diligence: [{
        value: false,
        disabled: isBoolean
      }],  
      BCP_quest: [{
        value: false,
        disabled: isBoolean
      }],  
      Intermediary: [{
        value: false,
        disabled: isBoolean
      }],   
      Pan: [{
        value: false,
        disabled: isBoolean
      }],   
      Gst: [{
        value: false,
        disabled: isBoolean
      }],   
      Cancel_cheque: [{
        value: false,
        disabled: isBoolean
      }],   
      Board_resolution: [{
        value: false,
        disabled: isBoolean
      }], 
      Contract: [{
        value: false,
        disabled: isBoolean
      }],   
      kyc: [{
        value: false,
        disabled: isBoolean
      }],   
    })
    this.getVendorViewDetails();
    this.rejectFrom = this.fb.group({
      comments: ['', Validators.required]
    })
    this.returnForm = this.fb.group({
      comments: ['', Validators.required]
    })

    this.declarationForm= this.fb.group({
      rm_verify: [''],
    })

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );


    // this.rejectPopup();



    this.breadcrumbarray.push(data.code);


  }

  step = 0;
  setStep(index: number) {
    this.step = index;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  // private getMenuUrl() {

  //   this.shareService.menuUrlData = [];
  //   this.dataService.getMenuUrl()
  //     .subscribe((results: any[]) => {
  //       let data = results['data'];
  //       if (data) {
  //         this.shareService.titleUrl = data[0].url;
  //         this.shareService.menuUrlData = data;
  //       }
  //     })
  // }
  Taxedit(e) {
    this.shareService.branchTaxtEdit.next(e)
    this.taxedit = true;
    this.istax = false;

    // this.router.navigate(['/branchTaxEdit'], { skipLocationChange: true })
  }
  downattach(datas){
    for(var i=0;i<datas.attachment.length;i++){
      this.Fileidd=datas.attachment[i].id;
  
    this.atmaService .downloadfile(this.Fileidd)
     }
    
     
  }

  taxadd() {

    this.Branchtaxadd = true;
    this.isActivity = false;
   
    this.istax = false;
    this.shareService.branchTaxtEdit.next(" ");


  }
  branchtaxaddsbt() {

    this.taxedit = false;
    this.Branchtaxadd = false;

  
    this.branchtax = false;

    this.istax = true;
 
    this.getpagenation();
    this.closebuttonbranchtax.nativeElement.click()
  }
  branchtaxaddcancl() {

    this.taxedit = false;
    this.Branchtaxadd = false;
  
    this.branchtax = false;

    this.istax = true;
    this.branchtax_RMView = false;
    // this.getpagenation();
    this.closebuttonbranchtax.nativeElement.click()
  }
  onCancelClick() {
    this.onCancel.emit()
  }

  taxeditsubt() {
    this.taxedit = false;
    this.Branchtaxadd = false;
    this.isActivity = false;
 
    this.istax = true;
    this.getpagenation();
    this.closebuttonbranchtaxedit.nativeElement.click()
  }
  taxeditcancel() {
    this.taxedit = false;
    this.Branchtaxadd = false;
    this.isActivity = false;

    this.istax = true;
    // this.getpagenation();
    this.closebuttonbranchtaxedit.nativeElement.click()
  }

  RMView_branchtax (data){
    console.log("tax", data)
    this.istax = false;
    this.Branchtaxadd = false;
    this.taxedit = false;
    this.branchtax_RMView = true;
    this.shareService.modification_data.next(data);
  }


  // delete_tax
  delete_tax(id) {
    if (confirm("Delete Tax details?")) {
      this.atmaService.Brachtaxdelete(id, this.vendorData.id)
        .subscribe(result => {
          if (result.message == "Successfully Deleted") {
            this.notification.showSuccess("Deleted")
            // this.ngOnInit();
            this.getpagenation();
          }
          else {
            this.notification.showInfo("Try  Again....")
            this.ngOnInit();
          }
          // this.ngOnInit();
          return true
        })
    }
    else {
      return false
    }
  }
  // ---------------------------------------------------
  getdocumentsummary(pageNumber = 1, pageSize = 10) {
    this.atmaService.getdocumentsummaryy(this.vendorId,pageNumber, pageSize )
      .subscribe((result) => {
        console.log("document", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.documentList = datass;
        console.log("document", this.documentList)
        if (this.documentList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.documentpage = datapagination.index;
          this.isDocumentPagination = true;
        }
        if (this.documentList <= 0) {
          this.isDocumentPagination = false;
        }
      })


    if (this.requestStatusName == "Modification" && this.vendorStatusName == "Draft" || this.requestStatusName == "Renewal Process" && this.vendorStatusName == "Draft") {
      // this.branch_data = [];
      this.getmodification_vender();
      this.document_modify = true;

    }
  }





  nextClick() {

    if (this.has_next === true) {
      this.getdocumentsummary(this.documentpage + 1, 10)

    }
  }

  previousClick() {

    if (this.has_previous === true) {
      this.getdocumentsummary(this.documentpage - 1, 10)

    }
  }



  deletedocument(data) {
    let value = data.id
    // this.docbtn = true;
    console.log("deletedocument", value)
    if (confirm("Delete Document details?")) {
    this.atmaService.deletedocumentform(value, this.vendorId)
      .subscribe(result => {

        if (result['status'] != undefined || result['status'] == 'success') {
          this.notification.showSuccess("Successfully deleted")
          this.getdocumentsummary();
          return true
        } else {
          this.notification.showError(result['code'])
          // this.docbtn = false;
        }



      })}
      else{
        return false;
      }

  }

  deleterisk(data) {
    let value = data.id
    // this.docbtn = true;
    console.log("deleterisk", value)
    if (confirm("Delete risk details?")) {
    this.atmaService.deleteriskform(value, this.vendorId)
      .subscribe(result => {

        if (result['status'] != undefined || result['status'] == 'success') {
          this.notification.showSuccess("Successfully deleted")
          this.getrisksummary();
          return true
        } else {
          this.notification.showError(result['code'])
          // this.docbtn = false;
        }



      })}
      else{
        return false;
      }

  }

  // delete kyc
  deletekyc(data) {
    let value = data.id
    // this.docbtn = true;
    console.log("deletekyc", value)
    if (confirm("Delete kyc details?")) {
    this.atmaService.deletekycform(value, this.vendorId)
      .subscribe(result => {

        if (result['status'] != undefined || result['status'] == 'success') {
          this.notification.showSuccess("Successfully deleted")
          this.getkycsummary();
          return true
        } else {
          this.notification.showError(result['code'])
          // this.docbtn = false;
        }



      })}
      else{
        return false;
      }

  }

// risk summary

  getrisksummary(pageNumber = 1, pageSize = 10) {
    this.atmaService.getRiskSummary(this.vendorId, pageNumber, pageSize)
      .subscribe((result) => {
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.riskList = datass;
        console.log("risk", this.riskList)
        if (this.riskList.length >= 0) {
          this.risk_next = datapagination.has_next;
          this.risk_previous = datapagination.has_previous;
          this.riskpage = datapagination.index;
          this.isRiskPagination = true;
        }
        if (this.riskList <= 0) {
          this.isRiskPagination = false;
        }
      })


    if (this.requestStatusName == "Modification" && this.vendorStatusName == "Draft" || this.requestStatusName == "Renewal Process" && this.vendorStatusName == "Draft") {
      this.getmodification_vender();
      this.risk_modify = true;

    }
  }

  nextriskClick() {

    if (this.risk_next === true) {
      this.getrisksummary(this.riskpage + 1, 10)

    }
  }

  previousriskClick() {

    if (this.risk_previous === true) {
      this.getrisksummary(this.riskpage - 1, 10)

    }
  }

  //kyc
  getkycsummary(pageNumber = 1, pageSize = 10) {
    this.atmaService.getKYCSummary(this.vendorId, pageNumber, pageSize)
      .subscribe((result) => {
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.KYCList = datass;
        console.log("kyc", this.KYCList)
        if (this.KYCList.length >= 0) {
          this.kyc_next = datapagination.has_next;
          this.kyc_previous = datapagination.has_previous;
          this.kycpage = datapagination.index;
          this.iskycPagination = true;
        }
        if (this.KYCList <= 0) {
          this.iskycPagination = false;
        }
      })


    if (this.requestStatusName == "Modification" && this.vendorStatusName == "Draft" || this.requestStatusName == "Renewal Process" && this.vendorStatusName == "Draft") {
      this.getmodification_vender();
      this.kyc_modify = true;

    }
  }

  nextkycClick() {

    if (this.kyc_next === true) {
      this.getkycsummary(this.kycpage + 1, 10)

    }
  }

  previouskycClick() {

    if (this.kyc_previous === true) {
      this.getkycsummary(this.kycpage - 1, 10)

    }
  }



  getVendorViewDetails() {
    this.atmaService.getVendorViewDetails(this.vendorcode)
      .subscribe(result => {
        console.log("paticularvendor", result)
        this.vendorData = result
        // if(result.modify_ref_id<0){
        this.vendorIdForEdit = result.id
      // }
        // else{
        //   this.vendorIdForEdit=result.modify_ref_id
        // }
        this.vendorId = result.id
        this.shareService.vendorDATA.next(this.vendorData)
        this.getBranch();
        this.vendorViewDetailList = result;
        // this.activeContract = result.activecontract;
        if (result.activecontract == 'True') {
          this.activeContract = "Yes";
        } else {
          this.activeContract = "No";
        }
        this.actualSpend = result.actualspend;
        this.aproxSpend = result.aproxspend;
        this.emailDays = result.emaildays;
        this.code = result.code;
        this.companyRegNo = result.comregno;
        this.contractFrom = result?.contractdate_from;
        this.contractTo = result?.contractdate_to;
        this.gstNo = result.gstno;
        this.mainStatusName = result.mainstatus_name;
        this.name = result.name;
        this.contractReason = result.nocontract_reason;
        this.panNo = result.panno;
        this.isOwnerflag = result.isowner
        this.isRmflag = result.is_rm
        this.isHeaderflag= result.is_header
        this.rmId = result.rm_id.id;
        // this.vendor_flag = result.vendor_flag
        if(this.panNo == ""){
         this.PANNO_FLAG = false;
        }
        // this.aadharno = result.adhaarno;
        // if(this.aadharno == ""){
        //   this.AADHAR_FLAG = false;
        // }
        this.remarks = result.remarks;
        this.renewalDate = result.renewal_date;
        this.requestStatusName = result.requeststatus_name;
        this.vendorStatusName = result.vendor_status_name;
        this.createby = result.created_by;
        this.userId = result.user_id;
        this.qId = result.action.q_id;
        this.statusid = result.action.q_status
        this.website = result.website;
        this.composite = result.composite.text;
        this.classification = result.classification.text;
        this.group = result.group.text;
        this.customerCategory = result.custcategory_id.name;
        if(result.compliance_flag == true){
          this.condition = 'Submit to compliance'
        }if(result.compliance_flag == false){
          this.condition = 'Submit to Header'
        }
        this.comflag = result.compliance_flag
        this.organizationType = result.orgtype.text;
        this.type = result.type.text;
        this.lineName1 = result.address.line1;
        this.lineName2 = result.address.line2;
        this.lineName3 = result.address.line3;
        this.cityName = result.address.city_id.name;
        this.districtName = result.address.district_id.name;
        this.stateName = result.address.state_id.name;
        this.pinCode = result.address.pincode_id.no;
        this.contactName = result.contact.name;
        // this.contactTypeName = result.contact.type_id.name;
        this.contactDesignation = result.contact.designation;
        this.contactLandline1 = result.contact.landline;
        this.contactLandline2 = result.contact.landline2;
        this.contactMobile1 = result.contact.mobile;
        this.contactMobile2 = result.contact.mobile2;
        this.contactEmail = result.contact.email;
        this.dateofbirth = result.contact.dob;
        this.profile_Per_Employee = result.profile.permanent_employee;
        this.profile_Temp_Employee = result.profile.temporary_employee;
        this.profile_Tot_Employee = result.profile.total_employee;
        this.profileAward = result.profile.award_details;
        this.profileBranch = result.profile.branch;
        this.profileFactory = result.profile.factory;
        this.profileRemarks = result.profile.remarks;
        this.profileYear = result.profile.year;
        this.rmName = result.rm_id.full_name;
        this.vendorStatusId = result.vendor_status;
        this.modifystatus = result.modify_status;
        this.modifyrefid = result.modify_ref_id;

        console.log("VendorStausid", this.vendorStatusId)
        this.shareService.vendorViewHeaderName.next(result)
        if (this.requestStatusName == "Modification" && this.vendorStatusName != "Draft" && this.vendorStatusName != "Approved") {
          this.rm_viewscreen = true;
        }
        if (this.vendorStatusName == "Approved") {

          this.ismodification = true;
          this.isRejectBtn = false;
          this.isReturnBtn = false;
          this.isDraft = false;
          this.isPendingRM = false;
          this.isPendingChecker = false;
          this.isPendingHeader = false;
          this.ispending = false;
          this.renewal_flag = true;
          this.isdeactivation = true;
          this.isactivation = false;
          this.istermination = true;
        }
        if (this.vendorStatusName === "Rejected") {
          this.isRejectBtn = false;
          this.isReturnBtn = false;
          this.isDraft = false;
          this.isPendingRM = false;
          this.isPendingChecker = false;
          this.isPendingHeader = false;
          this.ispending = false;
          this.vendor_flag = false;
          this.ismodification = true;
          this.renewal_flag = true;
          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;

        }
        if (this.vendorStatusName === "Returned") {
          this.isRejectBtn = false;
          this.isReturnBtn = false;
          this.isDraft = false;
          this.isPendingRM = false;
          this.isPendingChecker = false;
          this.isPendingHeader = false;
          this.ispending = false;
          this.vendor_flag = false;
          this.ismodification = true;
          this.renewal_flag = true;
          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;

        }

        if (this.mainStatusName === "Draft" && this.requestStatusName === "Onboard" && this.vendorStatusName === "Draft") {
          this.vendor_flag = true;

        }

        if (this.mainStatusName == "Draft" && this.requestStatusName == "Onboard" && this.vendorStatusName == "Rejected") {
          this.vendor_flag = true;
          this.isDraft = true;
          this.ismodification = false;
          this.isPendingRM = false;
          this.renewal_flag = false;
          this.isPendingChecker = false;
          this.isPendingHeader = false;
          this.ispending = true;
        }
        if (this.mainStatusName == "Draft" && this.requestStatusName == "Onboard" && this.vendorStatusName == "Returned") {
          this.vendor_flag = true;
          this.isDraft = true;
          this.ismodification = false;
          this.isPendingRM = false;
          this.renewal_flag = false;
          this.isPendingChecker = false;
          this.isPendingHeader = false;
          this.ispending = true;
        }
        if (this.mainStatusName === "Approved" && this.requestStatusName == "Modification" && this.vendorStatusName === "Draft") {
          this.vendor_flag = true;
          this.branch_modify=true;


        }
        if (this.mainStatusName == "Approved" && this.requestStatusName == "Modification" && this.vendorStatusName == "Rejected") {
          this.vendor_flag = false;
          this.branch_modify=true;
          this.ismodification = true;
          this.renewal_flag = true;
        }
        if (this.mainStatusName == "Approved" && this.requestStatusName == "Modification" && this.vendorStatusName == "Returned") {
          this.vendor_flag = false;
          this.branch_modify=true;
          this.ismodification = true;
          this.renewal_flag = true;
        }
        if (this.requestStatusName == "Modification" && this.vendorStatusName == "Draft") {
          this.vendor_flag = true;
        }
        if (this.requestStatusName == "Renewal Process") {
          this.vendor_flag = true;
          // this.ismodification = true;
        }
        if (this.mainStatusName === "Approved" && this.requestStatusName == "Renewal Process" && this.vendorStatusName === "Draft") {
          this.vendor_flag = true;
          this.branch_modify=true;


        }

        if (this.vendorStatusName === "Draft") {
          this.isRejectBtn = false;
          this.isReturnBtn = false;
          this.isDraft = true;
          this.isPendingRM = false;
          this.isPendingChecker = false;
          this.isPendingHeader = false;
          this.ispending = false;

          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        if (this.vendorStatusName === "Approved") {

          this.ismodification = true;
          this.renewal_flag = true;
          this.isRejectBtn = false;
          this.isReturnBtn = false;
          this.isDraft = false;
          this.isPendingRM = false;
          this.isPendingChecker = false;
          this.isPendingHeader = false;
          this.ispending = false;

          this.isdeactivation = true;
          this.isactivation = false;
          this.istermination = true;
        }
        if (this.vendorStatusName === "Pending RM" && this.requestStatusName === "Onboard") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isDraft = false;
          this.isPendingChecker = false;
          this.isPendingHeader = false;
          this.ispending = false;

          this.isPendingRM = true;
          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        if (this.vendorStatusName === "Pending RM" && this.requestStatusName === "Renewal Process") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isDraft = false;
          this.isPendingChecker = false;
          this.isPendingHeader = false;
          this.ispending = false;
          this.rm_viewscreen = true;
          this.isPendingRM = true;
          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        if (this.vendorStatusName === "Pending_Checker" && this.createby != this.login_id    && this.requestStatusName === "Renewal Process") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isDraft = false;
          this.isPendingHeader = false;
          this.isPendingChecker = true;
          this.isApproved = false;
          this.isPendingRM = false;
          this.ispending = false;

          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        if (this.vendorStatusName === "Pending_Checker" && this.createby != this.login_id   && this.requestStatusName === "Onboard") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isDraft = false;
          this.isPendingHeader = false;
          this.isPendingChecker = true;
          this.isApproved = false;
          this.isPendingRM = false;
          this.ispending = false;

          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        if (this.vendorStatusName === "Pending_Header" && this.createby != this.login_id    && this.requestStatusName === "Onboard") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isApproved = false;
          this.isDraft = false;
          this.isPendingChecker = false;
          this.isPendingHeader = true;
          this.isPendingRM = false;
          this.ispending = false;

          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        if (this.vendorStatusName === "pending_compliance" && this.createby != this.login_id    && this.requestStatusName === "Onboard") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isApproved = false;
          this.isDraft = false;
          this.isPendingChecker = false;
          this.isPendingHeader = true;
          this.isPendingRM = false;
          this.ispending = false;

          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }

        if (this.vendorStatusName === "Pending_Header" && this.createby != this.login_id    && this.requestStatusName === "Renewal Process") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isApproved = false;
          this.isDraft = false;
          this.isPendingChecker = false;
          this.isPendingHeader = true;
          this.isPendingRM = false;
          this.ispending = false;

          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        
        if (this.vendorStatusName === "pending_compliance" && this.createby != this.login_id    && this.requestStatusName === "Renewal Process") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isApproved = false;
          this.isDraft = false;
          this.isPendingChecker = false;
          this.isPendingHeader = true;
          this.isPendingRM = false;
          this.ispending = false;

          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        if (this.vendorStatusName === "Pending RM" && this.requestStatusName === "Modification") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isDraft = false;
          this.isPendingChecker = false;
          this.isPendingHeader = false;
          this.ispending = true;

          this.isPendingRM = true;
          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }

        if (this.vendorStatusName === "Pending RM" && this.requestStatusName === "Activation") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isDraft = false;
          this.isPendingChecker = false;
          this.isPendingHeader = false;
          this.ispending = true;

          this.isPendingRM = true;
          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }

        if (this.vendorStatusName === "Pending_Checker" && this.createby !== this.login_id    && this.requestStatusName === "Activation") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isDraft = false;
          this.isPendingHeader = false;
          this.isPendingChecker = true;
          this.isApproved = false;
          this.isPendingRM = false;
          this.ispending = false;

          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        if (this.vendorStatusName === "Pending_Header" && this.createby != this.login_id    && this.requestStatusName === "Activation") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isApproved = false;
          this.isDraft = false;
          this.isPendingChecker = false;
          this.isPendingHeader = true;
          this.isPendingRM = false;
          this.ispending = false;

          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        if (this.vendorStatusName === "pending_compliance" && this.createby != this.login_id    && this.requestStatusName === "Activation") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isApproved = false;
          this.isDraft = false;
          this.isPendingChecker = false;
          this.isPendingHeader = true;
          this.isPendingRM = false;
          this.ispending = false;

          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }

        if (this.vendorStatusName === "Pending_Checker" && this.createby != this.login_id    && this.requestStatusName === "Modification") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isDraft = false;
          this.isPendingHeader = false;
          this.isPendingChecker = true;
          this.isApproved = false;
          this.isPendingRM = false;
          this.ispending = false;

          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        if (this.vendorStatusName === "Pending_Header" && this.createby != this.login_id    && this.requestStatusName === "Modification") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isApproved = false;
          this.isDraft = false;
          this.isPendingChecker = false;
          this.isPendingHeader = true;
          this.isPendingRM = false;
          this.ispending = false;

          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        if (this.vendorStatusName === "pending_compliance" && this.createby != this.login_id    && this.requestStatusName === "Modification") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isApproved = false;
          this.isDraft = false;
          this.isPendingChecker = false;
          this.isPendingHeader = true;
          this.isPendingRM = false;
          this.ispending = false;

          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        if (this.vendorStatusName === "Pending RM" && this.requestStatusName === "Deactivation") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isDraft = false;
          this.isPendingChecker = false;
          this.isPendingHeader = false;
          this.ispending = false;

          this.isPendingRM = true;
          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        if (this.vendorStatusName === "Pending_Checker" && this.createby !=this.login_id     && this.requestStatusName === "Deactivation") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isDraft = false;
          this.isPendingHeader = false;
          this.isPendingChecker = true;
          this.isApproved = false;
          this.isPendingRM = false;
          this.ispending = false;

          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        if (this.vendorStatusName === "Pending_Header" && this.createby != this.login_id    && this.requestStatusName === "Deactivation") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isApproved = false;
          this.isDraft = false;
          this.isPendingChecker = false;
          this.isPendingHeader = true;
          this.isPendingRM = false;
          this.ispending = false;

          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        if (this.vendorStatusName === "pending_compliance" && this.createby != this.login_id    && this.requestStatusName === "Deactivation") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isApproved = false;
          this.isDraft = false;
          this.isPendingChecker = false;
          this.isPendingHeader = true;
          this.isPendingRM = false;
          this.ispending = false;

          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        if (this.vendorStatusName === "Approved" && this.requestStatusName === "Termination") {
          this.ismodification = false;
          this.isRejectBtn = false;
          this.isReturnBtn = false;
          this.isDraft = false;
          this.isPendingRM = false;
          this.isPendingChecker = false;
          this.isPendingHeader = false;
          this.ispending = false;
          this.renewal_flag = false;
          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }

        if (this.vendorStatusName === "Pending RM" && this.requestStatusName === "Termination") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isDraft = false;
          this.isPendingChecker = false;
          this.isPendingHeader = false;
          this.ispending = false;

          this.isPendingRM = true;
          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        if (this.requestStatusName == "Deactivation" && this.vendorStatusName == "Approved") {
          this.isRejectBtn = false;
          this.isReturnBtn = false;
          this.isDraft = false;

          this.ismodification = false;
          this.renewal_flag = false;
          this.ispending = false;

          this.isdeactivation = false;
          this.isactivation = true;
          this.istermination = false;
        }
        if (this.vendorStatusName === "Pending_Checker" && this.createby != this.login_id  && this.requestStatusName === "Termination") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isDraft = false;
          this.isPendingHeader = false;
          this.isPendingChecker = true;
          this.isApproved = false;
          this.isPendingRM = false;
          this.ispending = false;

          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        if (this.vendorStatusName === "Pending_Header" && this.createby != this.login_id  &&this.requestStatusName === "Termination") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isApproved = false;
          this.isDraft = false;
          this.isPendingChecker = false;
          this.isPendingHeader = true;
          this.isPendingRM = false;
          this.ispending = false;

          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        if (this.vendorStatusName === "pending_compliance" && this.createby != this.login_id  &&this.requestStatusName === "Termination") {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
          this.isApproved = false;
          this.isDraft = false;
          this.isPendingChecker = false;
          this.isPendingHeader = true;
          this.isPendingRM = false;
          this.ispending = false;

          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        if(this.requestStatusName === "Onboard"){
          this. action_flag_branch = false;
        }
        if(this.requestStatusName === "Modification"){
          this. action_flag_branch = true;
        }
 









        // ----allow only checker and header
        if (this.vendorStatusName === "Pending RM") {
          this.isRejectBtn = false;
          this.isReturnBtn = false;
        }
        if (this.vendorStatusName === "Pending RM" && (this.isHeaderflag === true || this.isRmflag === true)) {
          this.isRejectBtn = true;
          this.isReturnBtn = true;
        }
        // --------submit to header will hide for maker
        if (this.isRmflag === false && this.vendorStatusName === "Pending RM") {
          this.isPendingRM = false;
        }
        //  ------ submit to header true for rm
        if (this.isRmflag === true && this.vendorStatusName === "Pending RM") {
          this.isPendingRM = true;
        }
        // ----- approver button hide for maker and rm
        if (this.isOwnerflag === true || this.isRmflag === true ) {
          this.isPendingHeader = false;
        }
        // ---- submit button show only header
        if (this.isHeaderflag === true &&  (this.vendorStatusName === "Pending_Header" || this.vendorStatusName === "pending_compliance")) {
          this.isPendingHeader = true;
        }
      
        if ((this.vendorStatusName === "Pending_Header" || this.vendorStatusName === "pending_compliance") && this.isHeaderflag === false) {
          this.isRejectBtn = false;
          this.isReturnBtn = false;
        }
        if(this.isHeaderflag === true){
          this.ismodification = false;
          this.isdeactivation = false;
          this.isactivation = false;
          this.istermination = false;
        }
        this.getmodification_vender();
       




        

      })
  }

  modifyVendorView(modifyData) {

    this.status = modifyData.modify_status
    if (this.status == 1) {
      if (modifyData.activecontract == 'True') {
        this.updateactiveContract = "Yes";
      } else {
        this.updateactiveContract = "No";
      }
      this.updateactualSpend = modifyData.actualspend;
      this.updateaproxSpend = modifyData.aproxspend;
      this.updateEmailDays = modifyData.emaildays;
      this.updatecode = modifyData.code;
      this.updatecompanyRegNo = modifyData.comregno;
      this.updatecontractFrom = modifyData.contractdate_from;
      this.updatecontractTo = modifyData.contractdate_to;
      this.updategstNo = modifyData.gstno;
      // this.updateaadharno = modifyData.adhaarno;
      this.updatemainStatusName = modifyData.mainstatus_name;
      this.vendorIdForEdit = modifyData.id
      this.updatename = modifyData.name;
      this.updatecontractReason = modifyData.nocontract_reason;
      this.updatepanNo = modifyData.panno;
      this.updateremarks = modifyData.remarks;
      this.updaterenewalDate = modifyData.renewal_date;
      this.updaterequestStatusName = modifyData.requeststatus_name;
      this.updatevendorStatusName = modifyData.vendor_status_name;
      this.updatecreateby = modifyData.created_by;
      this.updateuserId = modifyData.user_id;
      this.updateqId = modifyData.action.q_id;
      this.updatestatusid = modifyData.action.q_status
      this.updatewebsite = modifyData.website;
      this.updatecomposite = modifyData.composite.text;
      this.updateclassification = modifyData.classification.text;
      this.updategroup = modifyData.group.text;
      this.updatecustomerCategory = modifyData.custcategory_id.name;
      this.updateorganizationType = modifyData.orgtype.text;
      this.updatetype = modifyData.type.text;
      this.updatelineName1 = modifyData.address.line1;
      this.updatelineName2 = modifyData.address.line2;
      this.updatelineName3 = modifyData.address.line3;
      this.updatecityName = modifyData.address.city_id.name;
      this.updatedistrictName = modifyData.address.district_id.name;
      this.updatestateName = modifyData.address.state_id.name;
      this.updatepinCode = modifyData.address.pincode_id.no;
      this.updatecontactName = modifyData.contact.name;
      // this.updatecontactTypeName = modifyData.contact.type_id.name;
      this.updatecontactDesignation = modifyData.contact.designation;
      this.updatecontactLandline1 = modifyData.contact.landline;
      this.updatecontactLandline2 = modifyData.contact.landline2;
      this.updatecontactMobile1 = modifyData.contact.mobile;
      this.updatecontactMobile2 = modifyData.contact.mobile2;
      this.updatecontactEmail = modifyData.contact.email;
      this.updatedateofbirth = modifyData.contact.dob;
      this.updateprofile_Per_Employee = modifyData.profile.permanent_employee;
      this.updateprofile_Temp_Employee = modifyData.profile.temporary_employee;
      this.updateprofile_Tot_Employee = modifyData.profile.total_employee;
      this.updateprofileAward = modifyData.profile.award_details;
      this.updateprofileBranch = modifyData.profile.branch;
      this.updateprofileFactory = modifyData.profile.factory;
      this.updateprofileRemarks = modifyData.profile.remarks;
      this.updateprofileYear = modifyData.profile.year;
      this.updatermName = modifyData.rm_id.full_name;
      this.updatevendorStatusId = modifyData.vendor_status;
      if(this.ele != ""){
      this.shareService.modification_data.next(this.ele);
      this.save = true
      }
      this.ismodificationView = true;
    }

  }

  // mod(){
  //   this.shareService.modification_data.next(this.ele);
  //   this.router.navigate(['/atma/vendormodification'], { skipLocationChange: true });
  // }


  branch_view(){
    this.branchSummary = true;
        this.isBranch = true;
        this.isBranchForm = false;
        this.isBranchEditForm = false;
        this.isClient = false;
        this.isDocument = false;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.document_RMView = false;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.client_RMView = false;
        this.isContractor = false;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.contractor_RMView = false;
        this.isTransaction = false;
        this.isProduct = false;
        this.isActivity = false;
   
        this.istax = false;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.product_RMView = false;
        this.isRisk = false;
        this.isRiskForm = false;
        this.isRiskEditForm = false;
        this.risk_RMView = false;
        this.isKYC = false;
        this.isKYCForm = false;
        this.isKYCEditForm = false;
        this.kyc_RMView = false;
        this.getBranch();
  }


  client_view(){
    this.branchSummary = false;
        this.isActivity = false;
   
        this.istax = false;
        this.isBranch = false;
        this.isContractor = false;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.isProduct = false;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.isTransaction = false;
        this.isDocument = false;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.isClient = true;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.client_RMView = false;
        this.contractor_RMView = false;
        this.product_RMView = false;
        this.document_RMView = false;
        this.isRisk = false;
        this.isRiskForm = false;
        this.isRiskEditForm = false;
        this.risk_RMView = false;
        this.isKYC = false;
        this.isKYCForm = false;
        this.isKYCEditForm = false;
        this.kyc_RMView = false;
        this.getClient();
  }

  Contract_view(){

    this.isActivity = false;
   
        this.istax = false;
        this.branchSummary = false;
        this.isBranch = false;
        this.isClient = false;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.isProduct = false;
        this.isDocument = false;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.isTransaction = false;
        this.isContractor = true;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.client_RMView = false;
        this.contractor_RMView = false;
        this.product_RMView = false;
        this.document_RMView = false;
        this.isRisk = false;
        this.isRiskForm = false;
        this.isRiskEditForm = false;
        this.risk_RMView = false;
        this.isKYC = false;
        this.isKYCForm = false;
        this.isKYCEditForm = false;
        this.kyc_RMView = false;
        this.getContractor();    

  }

  tax_view(){
    this.istax = true;
        this.Branchtaxadd = false;
        this.taxedit = false;
        this.getpagenation();
        this.branchSummary = false;
        this.isBranch = false;
        this.isClient = false;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.isContractor = false;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.isProduct = false;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.isTransaction = false;
        this.isDocument = false;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.client_RMView = false;
        this.contractor_RMView = false;
        this.product_RMView = false;
        this.document_RMView = false;
        this.isRisk = false;
        this.isRiskForm = false;
        this.isRiskEditForm = false;
        this.risk_RMView = false;
        this.isKYC = false;
        this.isKYCForm = false;
        this.isKYCEditForm = false;
        this.kyc_RMView = false;
  }

  product_view(){
    this.branchSummary = false;
        this.isActivity = false;
   
        this.istax = false;
        this.isBranch = false;
        this.isClient = false;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.isContractor = false;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.isTransaction = false;
        this.isDocument = false;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.isProduct = true;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.client_RMView = false;
        this.contractor_RMView = false;
        this.product_RMView = false;
        this.document_RMView = false;
        this.isRisk = false;
        this.isRiskForm = false;
        this.isRiskEditForm = false;
        this.risk_RMView = false;
        this.isKYC = false;
        this.isKYCForm = false;
        this.isKYCEditForm = false;
        this.kyc_RMView = false;
        this.getProduct();
  }

  document_view(){
    this.branchSummary = false;
        this.isActivity = false;
   
        this.istax = false;
        this.isBranch = false;
        this.isClient = false;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.isContractor = false;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.isProduct = false;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.isTransaction = false;
        this.isDocument = true;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.client_RMView = false;
        this.contractor_RMView = false;
        this.product_RMView = false;
        this.document_RMView = false;
        this.isRisk = false;
        this.isRiskForm = false;
        this.isRiskEditForm = false;
        this.risk_RMView = false;
        this.isKYC = false;
        this.isKYCForm = false;
        this.isKYCEditForm = false;
        this.kyc_RMView = false;
        this.getdocumentsummary();
  }

  risk_view(){
        this.branchSummary = false;
        this.isActivity = false;
        this.istax = false;
        this.isBranch = false;
        this.isClient = false;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.isContractor = false;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.isProduct = false;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.isTransaction = false;
        this.isDocument = false;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.client_RMView = false;
        this.contractor_RMView = false;
        this.product_RMView = false;
        this.document_RMView = false;
        this.isRisk = true;
        this.isRiskForm = false;
        this.isRiskEditForm = false;
        this.risk_RMView = false;
        this.isKYC = false;
        this.isKYCForm = false;
        this.isKYCEditForm = false;
        this.kyc_RMView = false;
        this.getrisksummary();
  }

  kyc_view(){
    this.branchSummary = false;
    this.isActivity = false;
    this.istax = false;
    this.isBranch = false;
    this.isClient = false;
    this.isClientForm = false;
    this.isClientEditForm = false;
    this.isContractor = false;
    this.isContractorForm = false;
    this.isContactorEditForm = false;
    this.isProduct = false;
    this.isProductForm = false;
    this.isProductEditForm = false;
    this.isTransaction = false;
    this.isDocument = false;
    this.isDocumentForm = false;
    this.isDocumentEditForm = false;
    this.client_RMView = false;
    this.contractor_RMView = false;
    this.product_RMView = false;
    this.document_RMView = false;
    this.isRisk = false;
    this.isRiskForm = false;
    this.isRiskEditForm = false;
    this.risk_RMView = false;
    this.isKYC = true;
    this.isKYCForm = false;
    this.isKYCEditForm = false;
    this.kyc_RMView = false;
    this.getkycsummary();
}

  transaction_view(){
    this.branchSummary = false;
        this.isActivity = false;
   
        this.istax = false;
        this.isBranch = false;
        this.isClient = false;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.isContractor = false;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.isProduct = false;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.isTransaction = true;
        this.isDocument = false;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.client_RMView = false;
        this.contractor_RMView = false;
        this.product_RMView = false;
        this.document_RMView = false;
        this.isRisk = false;
        this.isRiskForm = false;
        this.isRiskEditForm = false;
        this.risk_RMView = false;
        this.isKYC = false;
        this.isKYCForm = false;
        this.isKYCEditForm = false;
        this.kyc_RMView = false;
        this.gettransactionsummary();
  }

  tabchange(event) {

    console.log("select", event)

    if (event.isUserInput == true) {
      this.statusTab = event.source.value;
      if (this.statusTab === 'BRANCH DETAILS') {
        this.branchSummary = true;
        this.isBranch = true;
        this.isBranchForm = false;
        this.isBranchEditForm = false;
        this.isClient = false;
        this.isDocument = false;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.document_RMView = false;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.client_RMView = false;
        this.isContractor = false;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.contractor_RMView = false;
        this.isTransaction = false;
        this.isProduct = false;
        this.isActivity = false;
   
        this.istax = false;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.product_RMView = false;
        this.isRisk = false;
        this.isRiskForm = false;
        this.isRiskEditForm = false;
        this.risk_RMView = false;
        this.isKYC = false;
        this.isKYCForm = false;
        this.isKYCEditForm = false;
        this.kyc_RMView = false;
        this.getBranch();
        return false
      } else if (this.statusTab === 'CLIENT') {
        this.branchSummary = false;
        this.isActivity = false;
   
        this.istax = false;
        this.isBranch = false;
        this.isContractor = false;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.isProduct = false;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.isTransaction = false;
        this.isDocument = false;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.isClient = true;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.client_RMView = false;
        this.contractor_RMView = false;
        this.product_RMView = false;
        this.document_RMView = false;
        this.isRisk = false;
        this.isRiskForm = false;
        this.isRiskEditForm = false;
        this.risk_RMView = false;
        this.isKYC = false;
        this.isKYCForm = false;
        this.isKYCEditForm = false;
        this.kyc_RMView = false;
        this.getClient();
        return false
      } else if (this.statusTab === 'CONTRACTOR') {
        this.isActivity = false;
   
        this.istax = false;
        this.branchSummary = false;
        this.isBranch = false;
        this.isClient = false;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.isProduct = false;
        this.isDocument = false;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.isTransaction = false;
        this.isContractor = true;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.client_RMView = false;
        this.contractor_RMView = false;
        this.product_RMView = false;
        this.document_RMView = false;
        this.isRisk = false;
        this.isRiskForm = false;
        this.isRiskEditForm = false;
        this.risk_RMView = false;
        this.isKYC = false;
        this.isKYCForm = false;
        this.isKYCEditForm = false;
        this.kyc_RMView = false;
        this.getContractor();
        return false
      } else if (this.statusTab === 'PRODUCT') {
        this.branchSummary = false;
        this.isActivity = false;
   
        this.istax = false;
        this.isBranch = false;
        this.isClient = false;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.isContractor = false;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.isTransaction = false;
        this.isDocument = false;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.isProduct = true;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.client_RMView = false;
        this.contractor_RMView = false;
        this.product_RMView = false;
        this.document_RMView = false;
        this.isRisk = false;
        this.isRiskForm = false;
        this.isRiskEditForm = false;
        this.risk_RMView = false;
        this.isKYC = false;
        this.isKYCForm = false;
        this.isKYCEditForm = false;
        this.kyc_RMView = false;
        this.getProduct();
        return false
      } else if (this.statusTab === 'TRANSACTION') {
        this.branchSummary = false;
        this.isActivity = false;
   
        this.istax = false;
        this.isBranch = false;
        this.isClient = false;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.isContractor = false;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.isProduct = false;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.isTransaction = true;
        this.isDocument = false;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.client_RMView = false;
        this.contractor_RMView = false;
        this.product_RMView = false;
        this.document_RMView = false;
        this.isRisk = false;
        this.isRiskForm = false;
        this.isRiskEditForm = false;
        this.risk_RMView = false;
        this.isKYC = false;
        this.isKYCForm = false;
        this.isKYCEditForm = false;
        this.kyc_RMView = false;
        this.gettransactionsummary();
        return false
      } else if (this.statusTab === 'DOCUMENT') {
        this.branchSummary = false;
        this.isActivity = false;
   
        this.istax = false;
        this.isBranch = false;
        this.isClient = false;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.isContractor = false;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.isProduct = false;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.isTransaction = false;
        this.isDocument = true;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.client_RMView = false;
        this.contractor_RMView = false;
        this.product_RMView = false;
        this.document_RMView = false;
        this.isRisk = false;
        this.isRiskForm = false;
        this.isRiskEditForm = false;
        this.risk_RMView = false;
        this.isKYC = false;
        this.isKYCForm = false;
        this.isKYCEditForm = false;
        this.kyc_RMView = false;
        this.getdocumentsummary();
        return false
      }else if(this.statusTab=='TAX DETAILS'){
        this.istax = true;
        this.Branchtaxadd = false;
        this.taxedit = false;
        this.getpagenation();
        this.branchSummary = false;
        this.isBranch = false;
        this.isClient = false;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.isContractor = false;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.isProduct = false;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.isTransaction = false;
        this.isDocument = false;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.client_RMView = false;
        this.contractor_RMView = false;
        this.product_RMView = false;
        this.document_RMView = false;
        this.isRisk = false;
        this.isRiskForm = false;
        this.isRiskEditForm = false;
        this.risk_RMView = false;
        this.isKYC = false;
        this.isKYCForm = false;
        this.isKYCEditForm = false;
        this.kyc_RMView = false;
        return false
      } else if(this.statusTab=='RISK'){
        this.isRisk = true;
        this.getrisksummary();
        this.isRiskForm = false;
        this.isRiskEditForm = false;
        this.risk_RMView = false;
        this.istax = false;
        this.Branchtaxadd = false;
        this.taxedit = false;
        this.branchSummary = false;
        this.isBranch = false;
        this.isClient = false;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.isContractor = false;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.isProduct = false;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.isTransaction = false;
        this.isDocument = false;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.client_RMView = false;
        this.contractor_RMView = false;
        this.product_RMView = false;
        this.document_RMView = false;
        return false
      }else if(this.statusTab=='KYC'){
        this.isKYC = true;
        this.getkycsummary();
        this.isKYCForm = false;
        this.isKYCEditForm = false;
        this.kyc_RMView = false;
        this.isRisk = false;
        this.isRiskForm = false;
        this.isRiskEditForm = false;
        this.risk_RMView = false;
        this.istax = false;
        this.Branchtaxadd = false;
        this.taxedit = false;
        this.branchSummary = false;
        this.isBranch = false;
        this.isClient = false;
        this.isClientForm = false;
        this.isClientEditForm = false;
        this.isContractor = false;
        this.isContractorForm = false;
        this.isContactorEditForm = false;
        this.isProduct = false;
        this.isProductForm = false;
        this.isProductEditForm = false;
        this.isTransaction = false;
        this.isDocument = false;
        this.isDocumentForm = false;
        this.isDocumentEditForm = false;
        this.client_RMView = false;
        this.contractor_RMView = false;
        this.product_RMView = false;
        this.document_RMView = false;
        return false
      }


    }
  }
  productBtn() {
    this.getProduct();
    this.isBranch = false;
    this.isClient = false;
    this.isContractor = false;
    this.isClientEditForm = false;
    this.isBranchEditForm = false;
    this.isProductEditForm = false;
    this.isContactorEditForm = false;
    this.isDocumentEditForm = false;
    this.isProduct = true;
    this.isDocument = false;
    this.isContractorForm = false;
    this.isClientForm = false;
    this.isBranchForm = false;
    this.isProductForm = false;
    this.isDocumentForm = false;
  }

  documentBtn() {
    this.getdocumentsummary();
    this.isBranch = false;
    this.isClient = false;
    this.isContractor = false;
    this.isClientEditForm = false;
    this.isBranchEditForm = false;
    this.isProductEditForm = false;
    this.isContactorEditForm = false;
    this.isDocumentEditForm = false;
    this.isProduct = false;
    this.isContractorForm = false;
    this.isClientForm = false;
    this.isBranchForm = false;
    this.isProductForm = false;
    this.isDocumentForm = false;
    // this.isDocumenttt = true;
    this.isDocument = true;
  }
  contractorBtn() {
    this.getContractor();
    this.isBranch = false;
    this.isClient = false;
    this.isContractor = true;
    this.isProduct = false;
    this.isDocument = false;
    this.isContractorForm = false;
    this.isClientForm = false;
    this.isBranchForm = false;
    this.isClientEditForm = false;
    this.isBranchEditForm = false;
    this.isProductEditForm = false;
    this.isContactorEditForm = false;
    this.isDocumentEditForm = false;
    this.isProductForm = false;
    this.isDocumentForm = false;
  }

  clientBtn() {
    this.getClient();
    this.isBranch = false;
    this.isClient = true;
    this.isContractor = false;
    this.isProduct = false;
    this.isDocument = false;
    this.isContractorForm = false;
    this.isClientForm = false;
    this.isBranchForm = false;
    this.isClientEditForm = false;
    this.isBranchEditForm = false;
    this.isProductEditForm = false;
    this.isContactorEditForm = false;
    this.isDocumentEditForm = false;
    this.isProductForm = false;
    this.isDocumentForm = false;
  }

  branchBtn() {
    this.getBranch();
    this.isBranch = true;
    this.isClient = false;
    this.isContractor = false;
    this.isProduct = false;
    this.isDocument = false;
    this.isContractorForm = false;
    this.isClientForm = false;
    this.isBranchForm = false;
    this.isProductForm = false;
    this.isDocumentForm = false;
    this.isClientEditForm = false;
    this.isBranchEditForm = false;
    this.isProductEditForm = false;
    this.isContactorEditForm = false;
    this.isDocumentEditForm = false;

  }
  gettransactionsummary(pageNumber = 1, pageSize = 10) {
    //vendor id dynamic lines
    // let data: any = this.shareService.vendorView.value;
    // let transactionDetail = data.id
    //vendor id dynamic lines ends
    console.log("this.vendorId============================================================>", this.vendorId)
    this.atmaService.gettransactionsummary(this.vendorId, pageNumber, pageSize)
      .subscribe((result) => {
        console.log("tran", result)
        let datas = result['data'];
        this.transactionList = datas;
        console.log("tran", this.transactionList)
        //transaction pagination
        let datapagination = result["pagination"];
        if (this.transactionList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.transactionpage = datapagination.index;
        }
      })
  }
  //transaction
  nextClickLandlordbank() {
    if (this.has_next === true) {

      this.gettransactionsummary(this.transactionpage + 1, 10)
    }
  }
  previousClicklandlordBank() {
    if (this.has_previous === true) {

      this.gettransactionsummary(this.transactionpage - 1, 10)
    }
  }

  getBranch(pageNumber = 1, pageSize = 10) {
    console.log("vendorcode vendorcode vendorcode===>", this.vendorcode)
    this.atmaService.getBranch(this.vendorId, pageNumber, pageSize)
      .subscribe(result => {
        console.log("branchres", result)
        this.getbranchLength = result['data'].length;
        // if (this.getbranchLength == this.profileBranch) {
        //   this.isBranchButton = false
        // }
        let datas = result['data'];
        this.branchList = datas;
        this.branchPagination = result["pagination"];
        this.branchList = datas;

        if (this.branchList.length >= 0) {
          this.breadcrumbarray.push(this.branchList[0]?.name)
          this.branch_next = this.branchPagination.has_next;
          this.branch_previous = this.branchPagination.has_previous;
          this.branchpage = this.branchPagination.index;
          this.isBranchPagination = true;
        }
        if (this.branchList <= 0) {
          this.isBranchPagination = false;

        }

        // if(this.ismodificationView){
          this.atmaService.getBranchCountForModification(this.vendorId)
        .subscribe(result => {
          console.log("modify--branchCount", result)
          if(result.flag){
            // if(modificationdata.new_data.profile.branch!=modificationdata.old_data.profile.branch){
              this.isBranchButton = true;
            // s}
           
          } else {
            this.isBranchButton = false;
          }
        })
  
        // }
        


      })




  }

  nextClickBranch() {
    if (this.branch_next === true) {
      this.getBranch(this.branchpage + 1, 10)
    }
  }

  previousClickBranch() {
    if (this.branch_previous === true) {
      // this.currentpage= this.presentpage - 1
      this.getBranch(this.branchpage - 1, 10)
    }
  }

  getClient(pageNumber = 1, pageSize = 10) {
    this.atmaService.getClient(this.vendorId, pageNumber, pageSize)
      .subscribe(result => {
        let datas = result['data'];
        this.clientList = datas;
        let datapagination = result["pagination"];
        this.clientList = datas;
        if (this.clientList.length >= 0) {
          this.client_next = datapagination.has_next;
          this.client_previous = datapagination.has_previous;
          this.clientpage = datapagination.index;
          this.isClientPagination = true;
        }
        if (this.clientList <= 0) {
          this.isClientPagination = false;
        }
      })

    if (this.requestStatusName == "Modification" && this.vendorStatusName == "Draft" || this.requestStatusName == "Renewal Process" && this.vendorStatusName == "Draft") {
      this.client_modify = true;
      this.getmodification_vender();


    }
  }

  nextClickClient() {
    if (this.client_next === true) {
      this.getClient(this.clientpage + 1, 10)
    }
  }

  previousClickClient() {
    if (this.client_previous === true) {
      this.getClient(this.clientpage - 1, 10)
    }
  }
  getProduct(pageNumber = 1, pageSize = 10) {
    this.atmaService.getProduct(this.vendorId, pageNumber, pageSize)
      .subscribe(result => {
        let datas = result['data'];
        this.productList = datas;
        let datapagination = result["pagination"];
        this.productList = datas;
        if (this.productList.length >= 0) {
          this.product_next = datapagination.has_next;
          this.product_previous = datapagination.has_previous;
          this.productpage = datapagination.index;
          this.isProductPagination = true
        }
        if (this.productList <= 0) {
          this.isProductPagination = false;
        }
      })

    if (this.requestStatusName == "Modification" && this.vendorStatusName == "Draft" || this.requestStatusName == "Renewal Process" && this.vendorStatusName == "Draft") {
      this.getmodification_vender();
      this.product_modify = true;

    }
  }


  nextClickProduct() {
    if (this.product_next === true) {
      this.getProduct(this.productpage + 1, 10)
    }
  }

  previousClickProduct() {
    if (this.product_previous === true) {
      this.getProduct(this.productpage - 1, 10)
    }
  }
  getContractor(pageNumber = 1, pageSize = 10) {
    this.atmaService.getContractor(this.vendorId, pageNumber, pageSize)
      .subscribe(result => {
        let datas = result['data'];
        this.contactorList = datas;
        let datapagination = result["pagination"];
        this.contactorList = datas;
        if (this.contactorList.length >= 0) {
          this.contractor_next = datapagination.has_next;
          this.contractor_previous = datapagination.has_previous;
          this.contractorpage = datapagination.index;
          this.isContractorPagination = true;
        }
        if (this.contactorList <= 0) {
          this.isContractorPagination = false;
        }
      })

    if (this.requestStatusName == "Modification" && this.vendorStatusName == "Draft" || this.requestStatusName == "Renewal Process" && this.vendorStatusName == "Draft") {
      this.getmodification_vender();
      this.contract_modify = true;

    }
  }
  nextClickContractor() {
    if (this.contractor_next === true) {

      this.getContractor(this.contractorpage + 1, 10)
    }
  }

  previousClickContractor() {
    if (this.contractor_previous === true) {

      this.getContractor(this.contractorpage - 1, 10)
    }
  }

  addProduct() {
    this.isProductForm = true;
    this.isProduct = false;
    this.shareService.vendorID.next(this.vendorId)
  }

  addBranch() {
    this.isBranchForm = true;
    this.isBranch = false;
    this.shareService.vendorID.next(this.vendorId)
  }

  onCheckCondition(){
    
    if(this.getbranchLength == this.profileBranch) {
      this.isBranch = true;
      this.toastr.warning('', 'Cannot Add Branch Further ', { timeOut: 1500 })
      return false
    }
    this.isBranch = true;
    this.addBranchpopup.nativeElement.click();
   
  
  }

  addClient() {
    this.isClientForm = true;
    this.isClient = false;
    this.shareService.vendorID.next(this.vendorId)
  }

  addContractor() {
    this.isContractor = false;
    this.isContractorForm = true;
    this.shareService.vendorID.next(this.vendorId)
  }

  adddocument() {
    this.isDocumentForm = true;
    this.isDocument = false;
    console.log("Vendor ID On document Create", this.vendorId)
    let data: any  = this.vendorId
    this.shareService.vendorID.next(data)
  }

  addrisk() {
    this.isRiskForm = true;
    this.isRisk = false;
    this.shareService.vendorID.next(this.vendorId)
  }

  addkyc() {
    this.isKYCForm = true;
    this.isKYC = false;
    this.shareService.vendorID.next(this.vendorId)
  }

  rmVendorViewCancel() {
    this.isBranch = true;
    this.closebuttonvendorview.nativeElement.click();
  }

  branchCancel() {
    this.isBranchForm = false;
    this.isBranch = true;
    this.closebuttonbranch.nativeElement.click();

  }
  branchSubmit() {
    this.getBranch()
    this.getmodification_vender();
    this.isBranchForm = false;
    this.isBranch = true;
    this.closebuttonbranch.nativeElement.click();
  }

  clientCancel() {
    this.isClient = true;
    this.client_RMView = false;
    this.isClientEditForm = false;
    this.isClientForm = false;
    this.client_flag = false;
    this.contractor_flag = false;
    this.branch_flag = false;
    this.payment_flag = false;
    this.onCancel.emit()
    this.closebuttonclient.nativeElement.click();
  }

  clientCancelview() {
    this.isClient = true;
    this.client_RMView = false;
    this.isClientEditForm = false;
    this.isClientForm = false;
    this.client_flag = false;
    this.contractor_flag = false;
    this.branch_flag = false;
    this.payment_flag = false;
    this.onCancel.emit()
    this.closebuttonclientview.nativeElement.click();
  }

  clientCancelmod_view(){
    this.isClient = true;
    this.client_RMView = false;
    this.isClientEditForm = false;
    this.isClientForm = false;
    this.client_flag = false;
    this.contractor_flag = false;
    this.branch_flag = false;
    this.payment_flag = false;
    this.onCancel.emit()
    this.closebuttonclientmod_view.nativeElement.click();
  }

  clientSubmit() {
    this.getClient();
    // this.getmodification_vender();
    this.isClient = true;
    this.isClientForm = false;
    this.closebuttonclient.nativeElement.click();

  }
  contractorCancel() {
    this.isContractor = true;
    this.isContractorForm = false;
    this.isContactorEditForm = false;
    this.contractor_RMView = false;
    this.closebuttoncontractorcreate.nativeElement.click()
        

  }

  contractorrvmCancel(){
    this.isContractor = true;
    this.isContractorForm = false;
    this.isContactorEditForm = false;
    this.contractor_RMView = false;
    this.closecontractorCancel.nativeElement.click()
  }

  contractorSubmit() {

    this.getContractor();
    // this.getmodification_vender();
    this.isContractor = true;
    this.isContractorForm = false;
    this.closebuttoncontractorcreate.nativeElement.click()
  }

  productCancel() {
    this.isProduct = true;
    this.isProductForm = false;
    this.isProductEditForm = false;
    this.product_RMView = false;
    this.closebuttonproductform.nativeElement.click();
    
  }

  productviewclose(){
    this.isProduct = true;
    this.isProductForm = false;
    this.isProductEditForm = false;
    this.product_RMView = false;
    this.closebuttonproductview.nativeElement.click();
  }

  documentviewCancel(){
    this.isDocument = true;
    this.isDocumentForm = false;
    this.isDocumentEditForm = false;
    this.document_RMView = false;
    this.closebuttondocumentview.nativeElement.click();
  }
  riskviewCancel(){
    this.isRisk = true;
    this.isRiskForm = false;
    this.isRiskEditForm = false;
    this.risk_RMView = false;
    this.closebuttonriskview.nativeElement.click();
  }
  kycviewCancel(){
    this.isKYC = true;
    this.isKYCForm = false;
    this.isKYCEditForm = false;
    this.kyc_RMView = false;
    this.closebuttonkycview.nativeElement.click();
  }

  branchtaxviewclosefun(){
    this.taxedit = false;
    this.Branchtaxadd = false;
  
    this.branchtax = false;

    this.istax = true;
    this.branchtax_RMView = false;
    this.getpagenation();
    this.closebuttonbranchtaxview.nativeElement.click()
  }

  productSubmit() {
    this.getProduct();
    // this.getmodification_vender();
    this.isProduct = true;
    this.isProductForm = false;
    this.closebuttonproductform.nativeElement.click()
  }

  documentCancel() {
    this.isDocument = true;
    this.isDocumentForm = false;
    this.isDocumentEditForm = false;
    this.document_RMView = false;
    // this.getdocumentsummary();
    this.closebuttondocumentform.nativeElement.click();
  }

  documentSubmit() {
    this.getdocumentsummary();
    // this.getmodification_vender();
    this.isDocument = true;
    this.isDocumentForm = false;
    this.closebuttondocumentform.nativeElement.click();
  }


  
  riskCancel() {
    this.isRisk = true;
    this.isRiskForm = false;
    this.isRiskEditForm = false;
    // this.document_RMView = false;
    this.closebuttonriskform.nativeElement.click();
  }

  riskSubmit() {
    this.getrisksummary();
    // this.getmodification_vender();
    this.isRisk = true;
    this.isRiskForm = false;
    this.closebuttonriskform.nativeElement.click();
  }


  riskEditSubmit() {
    this.getrisksummary();
    // this.getmodification_vender();
    this.isRiskEditForm = false;
    this.isRisk = true;
    this.closebuttonriskedit.nativeElement.click()
  }

  riskEditCancel() {
    this.isRiskEditForm = false;
    this.isRisk = true;
    this.closebuttonriskedit.nativeElement.click()
  }

  // kyc
  kycCancel() {
    this.isKYC = true;
    this.isKYCForm = false;
    this.isKYCEditForm = false;
    // this.document_RMView = false;
    this.closebuttonkycform.nativeElement.click();
  }

  kycSubmit() {
    this.getkycsummary();
    // this.getmodification_vender();
    this.isKYC = true;
    this.isKYCForm = false;
    this.closebuttonkycform.nativeElement.click();
  }


  kycEditSubmit() {
    this.getkycsummary();
    // this.getmodification_vender();
    this.isKYCEditForm = false;
    this.isKYC = true;
    this.closebuttonkycedit.nativeElement.click()
  }

  kycEditCancel() {
    this.isKYCEditForm = false;
    this.isKYC = true;
    this.closebuttonkycedit.nativeElement.click()
  }


  productEditForm(data) {
    this.isProductEditForm = true;
    this.isProduct = false;
    this.shareService.productEditForm.next(data)
  }

  branchEditForm(data) {
    this.isBranch = false;
    this.isBranchEditForm = true;
    this.shareService.branchEditFrom.next(data);
  }
  RMView_client(data) {

    this.isClient = false;
    this.isClientForm = false;
    this.isClientEditForm = false;
    this.client_RMView = true;
    this.shareService.modification_data.next(data);

  }
  RMView_contractor(data) {

    this.isContractor = false;
    this.isContractorForm = false;
    this.isContactorEditForm = false;
    this.contractor_RMView = true;
    this.shareService.modification_data.next(data);

  }
  RMView_document(data) {

    this.isDocument = false;
    this.isDocumentForm = false;
    this.isDocumentEditForm = false;
    this.document_RMView = true;
    this.shareService.modification_data.next(data);
  }
  RMView_risk(data) {

    this.isRisk = false;
    this.isRiskForm = false;
    this.isRiskEditForm = false;
    this.risk_RMView = true;
    this.shareService.modification_data.next(data);
  }
  KYCView_kyc(data) {

    this.isKYC = false;
    this.isKYCForm = false;
    this.isKYCEditForm = false;
    this.kyc_RMView = true;
    this.shareService.modification_data.next(data);
  }
  RMView_product(data) {

    this.isProduct = false;
    this.isProductForm = false;
    this.isProductEditForm = false;
    this.product_RMView = true;
    this.shareService.modification_data.next(data);
  }

  clientEditForm(data, msg) {
    if (msg == 'modify') {
      data = data.new_data;
    }
    this.isClient = false;
    this.isClientEditForm = true;
    this.shareService.clientEditForm.next(data);
  }
  modify_client(j) {
    this.isClient = false;
    this.isClientEditForm = false;
    this.client_flag = true;
    this.shareService.modification_data.next(j);
  }
  modify_contract(j) {

    this.contractor_flag = true;
    this.shareService.modification_data.next(j);
  }

  modify_branch(data) {
    this.branch_flag = true;
    this.shareService.modification_data.next(data);
  }

  modify_payment(data) {
    this.payment_flag = true;
    this.shareService.modification_data.next(data);
  }
  contractEditForm(data, msg) {
    if (msg == 'modify') {
      data = data.new_data;
    }
    this.contractid = data.id;
    this.isContractor = false;
    this.isContactorEditForm = true;
    this.shareService.contractorEditForm.next(data)
  }

  documentEdit(data: any) {
    this.isDocumentEditForm = true;
    this.isDocument = false;
    this.shareService.documentEdit.next(data)
  }
  riskEdit(data: any) {
    this.isRiskEditForm = true;
    this.isRisk = false;
    this.shareService.riskEdit.next(data)
  }

  //kyc edit
  kycEdit(data: any) {
    this.isKYCEditForm = true;
    this.isKYC = false;
    this.shareService.kycEdit.next(data)
  }


  productEditCancel() {
    this.isProductEditForm = false;
    this.isProduct = true;
    this.closebuttonproducteditform.nativeElement.click()
  }

  productEditSubmit() {
    this.getProduct();
    // this.getmodification_vender();
    this.isProductEditForm = false;
    this.isProduct = true;
    this.closebuttonproducteditform.nativeElement.click()
  }

  contractorEditCancel() {
    this.isContractor = true;
    this.isContactorEditForm = false;
    this.closebuttoncontractoredit.nativeElement.click()
  }

  contractorEditSubmit() {


    this.isContractor = true;
    this.getContractor();
    // this.getmodification_vender();

    this.isContactorEditForm = false;
    this.closebuttoncontractoredit.nativeElement.click()
  }

  documentEditSubmit() {
    this.getdocumentsummary();
    // this.getmodification_vender();
    this.isDocumentEditForm = false;
    this.isDocument = true;
    this.closebuttondocumentedit.nativeElement.click()
  }

  documentEditCancel() {
    this.isDocumentEditForm = false;
    this.isDocument = true;
    this.closebuttondocumentedit.nativeElement.click()
  }



  clientEditCancel() {
    this.isClientEditForm = false;
    this.isClient = true;
    this.closebuttonclientedit.nativeElement.click();
  }
  clientEditSubmit() {
    this.getClient();
    // this.getmodification_vender();
    this.isClientEditForm = false;
    this.isClient = true;
    this.closebuttonclientedit.nativeElement.click();
  }

  branchEditCancel() {
    this.isBranchEditForm = false;
    this.isBranch = true;
    this.closebuttonbranchedit.nativeElement.click();
  }

  branchEditSubmit() {
    this.getBranch();
    this.getmodification_vender();
    this.isBranchEditForm = false;
    this.isBranch = true;
    this.closebuttonbranchedit.nativeElement.click();
  }
  nameClick(data) {
    this.shareService.branchID.next(data)
    this.shareService.vendorDATA.next(this.vendorData)
    this.router.navigate(['/atma/branchactivity'], {
      skipLocationChange: true
    })
  }

  branchView(data) {
    this.shareService.branchView.next(data)
    
    this.router.navigate(['/atma/branchView'], {
      skipLocationChange: true
    })


  }
  rejectRemarks() {
    console.log("abc",this.vendorStatusName)
    var str=this.rejectFrom.value.comments
    var trime=str.trim()
    this.rejectFrom.value.comments=trime
    
    if (this.vendorStatusName == "Pending_Header" || this.vendorStatusName ==  "pending_compliance") {
      this.atmaService.approverreject(this.vendorId, this.rejectFrom.value, this.vendorStatusId = 0,'Header Reject')
        .subscribe(result => {
          if(result.status == "success"){
            this.notification.showSuccess("Rejected...")
          this.rejectFrom.reset()
          this.closebutton.nativeElement.click();
          this.shareService.vendorViewHeaderName.next(result)
          this.router.navigate(["/atma/vendor"], {
            skipLocationChange: true
          })
          } else {
            this.notification.showError(result['description'])

          }
          
        })
    } else {
      this.atmaService.rejectStatus(this.vendorId, this.rejectFrom.value, this.vendorStatusId = 0,' Reject')
        .subscribe(result => {
          if(result.status == "success"){
          this.notification.showSuccess("Rejected...")
          this.rejectFrom.reset()
          this.closebutton.nativeElement.click();
          this.shareService.vendorViewHeaderName.next(result)
          this.router.navigate(["/atma/vendor"], {
            skipLocationChange: true
          })
        }  else {
          this.notification.showError(result['description'])

        }
        })
    }



  }

  returnRemarks() {
    console.log("abc",this.vendorStatusName)
    var str=this.returnForm.value.comments
    var trime=str.trim()
    this.returnForm.value.comments=trime
    
    if (this.vendorStatusName == "Pending_Header"|| this.vendorStatusName == "pending_compliance") {
      this.atmaService.approverreturn(this.vendorId, this.returnForm.value, this.vendorStatusId = 7,'Header Return')
        .subscribe(result => {
          if(result.status == "success"){
            this.notification.showSuccess("Return...")
          this.returnForm.reset()
          this.closebuttonretn.nativeElement.click();
          this.shareService.vendorViewHeaderName.next(result)
          this.router.navigate(["/atma/vendor"], {
            skipLocationChange: true
          })
          } else {
            this.notification.showError(result['description'])

          }
          
        })
    } else {
      this.atmaService.returnStatus(this.vendorId, this.returnForm.value, this.vendorStatusId = 7,' Return')
        .subscribe(result => {
          if(result.status == "success"){
          this.notification.showSuccess("Return...")
          this.returnForm.reset()
          this.closebuttonretn.nativeElement.click();
          this.shareService.vendorViewHeaderName.next(result)
          this.router.navigate(["/atma/vendor"], {
            skipLocationChange: true
          })
        }  else {
          this.notification.showError(result['description'])

        }
        })
      }
  }


  rejectPopup() {
    this.atmaService.getRejected(this.vendorId)
      .subscribe(result => {
        let data = result['data'];
        let rejectList = data
        let io = rejectList.length - 1;
        this.rejectedList = rejectList[io].comments;
      })
  }
  active_inactive(data) {
    if(data.is_active){
      data['is_active']=0
    }else{
      data['is_active']=1

    }
    if(data.contact_id.dob=="None"){
      data.contact_id.dob=null;
    }
    if(data.contact_id.wedding_date=="None"){
      data.contact_id.wedding_date=null
    }
    this.atmaService.branchactive(data)
    .subscribe(result => {
      if(result.id>0||result.id!=undefined){

        if(result.is_active){
        this.notification.showSuccess("Activation Success")}else{
          this.notification.showSuccess("Inactive Success")
        }

        this.getBranch();
        this.getmodification_vender();
        // this.SpinnerService.hide();
          return false;
      }else{
        this.notification.showError('failes')
        this.getmodification_vender();
        // this.SpinnerService.hide();
          return false;
      }
     
    })
    // this.SpinnerService.hide();
  }

  vendorEdit() {
    this.shareService.vendorEditValue.next(this.vendorIdForEdit);
    console.log("vendorEdit-this.vendorIdForEdit", this.vendorIdForEdit)
    this.router.navigate(['/atma/vendoredit'], {
      skipLocationChange: true
    })
  }

  brantaxdetails(e) {
    this.shareService.branchView.next(e)
    this.router.navigate(['/atma/BranchTaxComponent'], {
      skipLocationChange: true
    })
  }
  brantaxpayment(e) {
    this.shareService.branchView.next(e)
    this.router.navigate(['/atma/BranchPaymentComponent'], {
      skipLocationChange: true
    })
  }
  branchpayment(e) {
    this.shareService.branchView.next(e)
    this.router.navigate(['/atma/branchpayment'], {
      skipLocationChange: true
    })

  }

  ele: any;
  save = false
  //Modification data for a particular vendor
  getmodification_vender() {
    this.contract_data = [];
    this.client_data = [];
    this.product_data = [];
    this.branch_data = [];
    this.document_data = [];
    this.risk_data = [];
    this.kyc_data = [];
    this.payment_data = [];
    this.tax_data = [];
    this.catalouge_data = [];
    this.activity_detail = [];
    this.activity_data = [];


    this.atmaService.getmodification(this.vendorId)
      .subscribe(result => {
        this.modificationdata = result['data']
        this.shareService.taxdata.next(this.modificationdata)
        this.modificationdata.forEach(element => {
          if (element.action == 2) //edit
          {
            if (element.type_name == 1) {
              let modifyData = element.new_data
              this.ele = element
              this.modifyVendorView(modifyData);
            }
            if (element.type_name == 8) {
              this.contract_data.push(element)
            }
            if (element.type_name == 7) {
              this.client_data.push(element)
            }
            if (element.type_name == 9) {
              this.product_data.push(element)
            }

            if (element.type_name == 6) {
              this.branch_data.push(element)
            }

            if (element.type_name == 10) {
              this.document_data.push(element)
            }
            if (element.type_name == 19) {
              this.risk_data.push(element)
            }
            if (element.type_name == 20) {
              this.kyc_data.push(element)
            }

            if (element.type_name == 12) {

              this.payment_data.push(element)
            }
            if(element.type_name==11 ){
              this.tax_data.push(element.new_data)
            }

          }
          if(element.action==0)//delete
          {
              if(element.type_name==11){
                this.tax_data.push(element.data)}
             
            
          }
         
          if (element.action == 1) //create
          {
            if (element.type_name == 8) {
              this.contract_data.push({
                "new_data": element.data,
                "action": element.action,
                "type_name": element.type_name
              })
            }
            if (element.type_name == 7) {
              this.client_data.push({
                "new_data": element.data,
                "action": element.action,
                "type_name": element.type_name
              })
            }
            if (element.type_name == 9) {
              this.product_data.push({
                "new_data": element.data,
                "action": element.action,
                "type_name": element.type_name
              })
            }
            if (element.type_name == 6) {
              this.branch_data.push({
                "new_data": element.data,
                "action": element.action,
                "type_name": element.type_name
              })
            }
            if (element.type_name == 10) {
              this.document_data.push({
                "new_data": element.data,
                "action": element.action,
                "type_name": element.type_name
              })
            }
            if (element.type_name == 19) {
              this.risk_data.push({
                "new_data": element.data,
                "action": element.action,
                "type_name": element.type_name
              })
            }
            if (element.type_name == 20) {
              this.kyc_data.push({
                "new_data": element.data,
                "action": element.action,
                "type_name": element.type_name
              })
            }

            if (element.type_name == 12) {

              this.payment_data.push({
                "new_data": element.data,
                "action": element.action,
                "type_name": element.type_name
              })
            }
            
            if(element.type_name==11 ){
              this.tax_data.push(element.data)
            }
          }
          if (element.action == 0) {
            if (element.type_name == 10) {
              this.document_data.push({
                "new_data": element.data,
                "action": element.action,
                "type_name": element.type_name
              })
            }
            if (element.type_name == 19) {
              this.risk_data.push({
                "new_data": element.data,
                "action": element.action,
                "type_name": element.type_name
              })
            }
            if (element.type_name == 20) {
              this.kyc_data.push({
                "new_data": element.data,
                "action": element.action,
                "type_name": element.type_name
              })
            }

            if (element.type_name == 12) {

              this.payment_data.push({
                "new_data": element.data,
                "action": element.action,
                "type_name": element.type_name
              })
            }
            if(element.type_name==11 ){
              this.tax_data.push(element.data)
            }
          }

          if(element.action==3){
            if (element.type_name == 6) {
              this.branch_data.push(element)
            }
          }
        });

        if (this.requestStatusName == "Modification" && this.vendorStatusName == "Draft") {
          if (this.client_data.length > 0) {
            this.client_data = this.getbtn_status(this.client_data)
          }

          if (this.contract_data.length > 0) {
            this.contract_data = this.getbtn_status(this.contract_data)
          }
        }
        if (this.product_data.length > 0) {
          this.product_data = this.getbtn_status(this.product_data)
        }
        if (this.branch_data.length > 0) {
          this.branch_data = this.getbtn_status(this.branch_data)
        }
        if (this.document_data.length > 0) {
          this.document_data = this.getbtn_status(this.document_data)
        }
        if(this.tax_data.length>0)
        {
          this.tax_data= this.getbtn_status(this.tax_data)}

          // if(this.ismodificationView){
          //   this.atmaService.getBranchCountForModification(this.vendorId)
          // .subscribe(result => {
          //   console.log("modify--branchCount", result)
          //   if(result.flag){
          //     // if(modificationdata.new_data.profile.branch!=modificationdata.old_data.profile.branch){
          //       this.isBranchButton = true;
          //     // s}
             
          //   } 
          // })
    
          // }



      })


  }

  Change_view(c) {
    this.viewarray = [c];
    this.clientcreateview = true;
  }
  getbtn_status(array) {
    for (let i = 0; i < array.length; i++) {
      // this.contract_data[i]["remove_actions"]=false;
      if (array.length != i) {

        if (array[i].modify_status == 2) {
          for (let j = 1; j < array.length; j++) {
            if (array[i].id == array[j].modify_ref_id) {

              array[j]["modify_ref_id"] = true;

            }
          }
        }
      }

    }
    return array
  }




  productBtncv() {

    this.isBranchcv = false;
    this.isClientcv = false;
    this.isContractorcv = false;
    this.isProductcv = true;

    this.isActivity = false;
    this.isActivityDetail = false;
    this.isCatalog = false;
    this.isTaxDetail = false;
    this.isPaymentDetail = false;
  }
  contractorBtncv() {

    this.isBranchcv = false;
    this.isClientcv = false;
    this.isContractorcv = true;
    this.isProductcv = false;
    this.isActivity = false;
    this.isActivityDetail = false;
    this.isCatalog = false;
    this.isTaxDetail = false;
    this.isPaymentDetail = false;
  }

  clientBtncv() {

    this.isBranchcv = false;
    this.isClientcv = true;
    this.isContractorcv = false;
    this.isProductcv = false;
    this.isActivity = false;
    this.isActivityDetail = false;
    this.isCatalog = false;
    this.isTaxDetail = false;
    this.isPaymentDetail = false;
  }
  vendordtl() {
    this.isBranchcv = false;
    this.isClientcv = false;
    this.isContractorcv = false;
    this.isProductcv = false;
    this.isActivity = false;
    this.isActivityDetail = false;
    this.isCatalog = false;
    this.isTaxDetail = false;
    this.isPaymentDetail = false;
  }
  branchBtncv() {

    this.isBranchcv = true;
    this.isClientcv = false;
    this.isContractorcv = false;
    this.isProductcv = false;
    this.isActivity = false;
    this.isActivityDetail = false;
    this.isCatalog = false;
    this.isTaxDetail = false;
    this.isPaymentDetail = false;
  }
  activityBtn() {
    this.isActivity = true;
    this.isBranchcv = false;
    this.isClientcv = false;
    this.isContractorcv = false;
    this.isProductcv = false;
    this.isActivityDetail = false;
    this.isCatalog = false;
    this.isTaxDetail = false;
    this.isPaymentDetail = false;
  }
  activitydtlBtn() {
    this.isActivityDetail = true;
    this.isBranchcv = false;
    this.isClientcv = false;
    this.isContractorcv = false;
    this.isProductcv = false;
    this.isActivity = false;
    this.isCatalog = false;
    this.isTaxDetail = false;
    this.isPaymentDetail = false;
  }
  catalogBtn() {
    this.isCatalog = true;
    this.isBranchcv = false;
    this.isClientcv = false;
    this.isContractorcv = false;
    this.isProductcv = false;
    this.isActivity = false;
    this.isActivityDetail = false;
    this.isTaxDetail = false;
    this.isPaymentDetail = false;
  }
  taxBtn() {
    this.isTaxDetail = true;
    this.isBranchcv = false;
    this.isClientcv = false;
    this.isContractorcv = false;
    this.isProductcv = false;
    this.isActivity = false;
    this.isActivityDetail = false;
    this.isCatalog = false;
    this.isPaymentDetail = false;
  }
  paymentBtn() {
    this.isPaymentDetail = true;
    this.isBranchcv = false;
    this.isClientcv = false;
    this.isContractorcv = false;
    this.isProductcv = false;
    this.isActivity = false;
    this.isActivityDetail = false;
    this.isCatalog = false;
    this.isTaxDetail = false;
  }


  modification_sub() {
    
    this.atmaService.modificationrequest(this.vendorId, this.status = 2)
      .subscribe(result => {
        this.notification.showSuccess("Success")
        this.ngOnInit();
        this.vendor_flag = true;
        this.ismodification = false;
        this.renewal_flag = false;
        this.onCancel.emit()
        // this.router.navigate(["/vendorView"], { skipLocationChange: true })

      })
  }
  modificationrequest() {
    if (this.modificationdata.length > 0) {
      if (this.requestStatusName == "Renewal Process" || this.requestStatusName == "Modification" && this.vendorStatusName == "Rejected" || this.vendorStatusName == "Returned") {


        this.confirmationDialogService.confirm('Please confirm..', 'Are you sure you want to discard the changes.?')
          .then((confirmed) => {
              if (confirmed == true) {
                this.atmaService.approverreject(this.vendorId, this.rejectFrom.value, this.vendorStatusId = 0,'reject')
                  .subscribe(result => {
                    if (result.status == 'success') {
                      this.notification.showSuccess("Done")
                      this.atmaService.modificationrequest(this.vendorId, this.status = 2)
                        .subscribe(result => {
                          this.notification.showSuccess("Success")
                          this.ngOnInit();
                          this.vendor_flag = true;
                          this.ismodification = false;
                          this.renewal_flag = false;
                          this.onCancel.emit()
                          // this.router.navigate(["/vendorView"], { skipLocationChange: true })

                        })
                    } else {
                      this.notification.showError("something went wrong try again")
                    }



                  })
              }
            }

          )
          .catch(() => console.log('User dismissed the dialog ')


          );

      }


    } else {


      this.modification_sub();
    }
  }
  deactivaterequest() {
    this.atmaService.modificationrequest(this.vendorId, this.status = 1)
      .subscribe(result => {
        this.notification.showSuccess("Submitted to Approver...")
        this.router.navigate(["/atma/vendor"], {
          skipLocationChange: true
        })
      })



  }
  activaterequest() {
    this.atmaService.modificationrequest(this.vendorId, this.status = 3)
      .subscribe(result => {
        this.notification.showSuccess("Submitted To Approver...")
        this.router.navigate(["/atma/vendor"], {
          skipLocationChange: true
        })
      })
  }

  changes_renewal_sub() {
    this.atmaService.modificationrequest(this.vendorId, this.status = 4)
      .subscribe(result => {
        this.notification.showSuccess("Submitted To Approver...")
        this.router.navigate(["/atma/vendorView"], {
          skipLocationChange: true
        })

      })





  }

  changes_renewal() {
    if (this.modificationdata.length > 0) {
      if (this.requestStatusName == "Renewal Process" || this.requestStatusName == "Modification" && this.vendorStatusName == "Rejected") {


        this.confirmationDialogService.confirm('Please confirm..', 'Are you sure you want to discard the changes.?')
          .then((confirmed) => {
              if (confirmed == true) {
                this.atmaService.approverreject(this.vendorId, this.rejectFrom.value, this.vendorStatusId = 0,'reject')
                  .subscribe(result => {
                    if (result.status == 'success') {
                      this.notification.showSuccess("Done")
                      this.atmaService.modificationrequest(this.vendorId, this.status = 2)
                        .subscribe(result => {
                          this.notification.showSuccess("Success")
                          this.ngOnInit();
                          this.vendor_flag = true;
                          this.ismodification = false;
                          this.renewal_flag = false;
                          this.onCancel.emit()
                      
                        })
                    } else {
                      this.notification.showError("something went wrong try again")
                    }



                  })
              }
            }

          )
          .catch(() => console.log('User dismissed the dialog ')


          );

      }


    } else {


      this.changes_renewal_sub();
    }
  }
  terminationrequest() {
    this.atmaService.modificationrequest(this.vendorId, this.status = 5)
      .subscribe(result => {
        if (result.status == "success") {
          this.notification.showSuccess("Submitted To Approver...")
          this.router.navigate(["/atma/vendor"], {
            skipLocationChange: true
          })
        }else{
          this.notification.showError(result['code'])
        }
      
      })

  }
  changes_view() {
    // modify
    this.shareService.vendorID.next(this.vendorId)
    this.router.navigate(["/atma/modify"], {
      skipLocationChange: true
    })
  }
  // ----ChangesviewEnd---
  // Move to RM start
  vendor_category: any;
  gst_category:any;
  kyc:any;
  movetorm(status = 2) {
    this.SpinnerService.show();
    this.atmaService.Rm(this.vendorId)
      .subscribe(result => {
        this.SpinnerService.hide();
        let supbrnch = result.SupplierBranch
        let supprod = result.SupplierProduct
        let vencli = result.VendorClient
        let vendoc = result.VendorDocument
        let vencont = result.VendorSubContractor
        let due = result.Due_diligence
        let bcp = result.BCP_quest
        let intermediary = result.Intermediary
        this.vendor_category = result.Category
        this.gst_category = result.Composite
        let kyc = result.Kyc
        let pan = result.Pan
        let gst = result.Gst
        let cancq = result.Cancel_cheque
        let brd = result.Board_resolution
        let contmail = result.Contract
        console.log("vendor_category",this.vendor_category)
        this.branch_Flag = supbrnch;
        this.doc_Flag= vendoc
        this.kycfg = kyc
        this.popupform.patchValue({
          suppbrnch: supbrnch,
          // suppprod: supprod,
          // client: vencli,
          suppdoc: vendoc,
          // suppcont: vencont
          Due_diligence:due,
          BCP_quest:bcp,
          Pan:pan,
          Gst:gst,
          Cancel_cheque:cancq,
          Board_resolution:brd,
          Contract:contmail,
          kyc:kyc
          // Intermediary:intermediary

        })

      })
  }

  submitrm(staus = 2) {

   

    // if (this.popupform.value.suppprod == false) {
    //   this.notification.showError("Please Fill The Supplier Product Form")
    //   return false;
    // }

    // if (this.popupform.value.client == false) {
    //   this.notification.showError("Please Fill The Vendor Client Form")
    //   return false;
    // }
    if (this.popupform.value.suppdoc == false) {
      this.notification.showError("Please Fill The Vendor Document Form")
      return false;
    }
    // if (this.popupform.value.suppcont == false) {
    //   this.notification.showError("Please Fill The Vendor Contractor Form")
    //   return false;
    // }

    this.branchstatus = this.popupform.value.suppbrnch
    if (this.branchstatus == false) {
      this.atmaService.branchvalidation(this.vendorId)
        .subscribe(result => {
          this.Branchpopup = true;

          this.branchnames = result.data




        })
    }

    this.atmaService.movetorm(this.vendorId, this.rmId, 2,"To RM")


      .subscribe(result => {


        if (this.popupform.value.suppbrnch == false) {
          this.notification.showError("Please Fill The Supplier Branch Form")
          return false;
        }

        if (result.status == "success") {

          this.notification.showSuccess("Submitted To Approver")
          this.shareService.vendorViewHeaderName.next(result)
          // this.router.navigate(["/atma/vendor"], {
          //   skipLocationChange: true
          // })
          this.vendor_flag = false 
          this.ngOnInit();
        }
        else if (result.code == "INVALID_BRANCH_ID"){
          this.notification.showError("Branch Count and Supplier Branch Not Match...")
        }
        else{
          this.notification.showError(result['code'])
        }
      })

  }


  rm_check(e) {
    if (e.checked) {
      this.rm_verify = 'True'
    } else {
      this.rm_verify = 'False'
    }

  }

  onClickSub_To_CheButton(){
    this.declarationForm.patchValue({
      "rm_verify": ""
    })
  }

  checker(status = 3) {
    if (this.declarationForm.value.rm_verify === "" || this.declarationForm.value.rm_verify === false){
      this.toastr.error('Please Confirm');
      return false;
    }
    this.atmaService.movetorm(this.vendorId, 0, status,"RM Approved")
      .subscribe(result => {
        // console.log(result['code'])
        if (result['status'] != undefined || result['status'] == 'success') {
          this.notification.showSuccess("Submitted To Approver")
          this.formGroupDirective.resetForm();
          this.closedeclbutton.nativeElement.click();
          this.router.navigate(["/atma/vendor"], {
            skipLocationChange: true
          })
          this.onCancel.emit()
          this.ngOnInit();
        } else {
          this.notification.showError(result['code'])
        }
      })
  }

  headapprover(status = 4) {
    if(this.comflag == true){
      status = 8
    }if(this.comflag == false){
      status = 4
    }
    console.log("level",status)
    this.atmaService.movetorm(this.vendorId, 0, status,"Cheker Approved")
      .subscribe(result => {
        if (result['status'] != undefined || result['status'] == 'success') {
          this.notification.showSuccess("Submitted To Approver")
          this.shareService.vendorViewHeaderName.next(result)
          this.router.navigate(["/atma/vendor"], {
            skipLocationChange: true
          })
        } else {
          this.notification.showError(result['code'])
        }
      })
  }
  // // compliance
  // compliance_headapprover(status = 8) {
  //   this.atmaService.movetorm(this.vendorId, this.rmId = 0, status,"Cheker Approved")
  //     .subscribe(result => {
  //       if (result['status'] != undefined || result['status'] == 'success') {
  //         this.notification.showSuccess("Submitted To Approver")
  //         this.router.navigate(["/atma/vendor"], {
  //           skipLocationChange: true
  //         })
  //       } else {
  //         this.notification.showError(result['code'])
  //       }
  //     })
  // }
  approver(status = 5) {
    if (this.requestStatusName == "Modification") {
      this.atmaService.modification_approve(this.vendorId)
        .subscribe(result => {
          // console.log("modification_approve", result)
          if (result['status'] != undefined || result['status'] == 'success') {
            this.notification.showSuccess("Approved Successfully")
            this.shareService.vendorViewHeaderName.next(result)
            this.router.navigate(["/atma/vendor"], {
              skipLocationChange: true
            })
            // window.location.reload()
          } else {
            this.notification.showError(result['code'])
          }

        })
    } else {
      this.atmaService.movetorm(this.vendorId, 0, status,"Header Approved")
        .subscribe(result => {
          if (result['status'] != undefined || result['status'] == 'success') {
            this.notification.showSuccess("Approved Successfully")
            this.shareService.vendorViewHeaderName.next(result)
            this.router.navigate(["/atma/vendor"], {
              skipLocationChange: true
            })
            // window.location.reload()
          } else {
            this.notification.showError(result['code'])
          }

        })
    }

  }


  // tax
  getpagenation(pageNumber = 1, pageSize = 10) {
    this.atmaService.Taxsummary(pageNumber, pageSize, this.vendorData.id)
      .subscribe((results: any[]) => {
        console.log("filterdata", results)
        let datapagination = results["pagination"];
        this.products = results["data"];;
        if (this.products.length >= 0) {
          this.has_next_tax = datapagination.has_next;
          this.has_previous_tax = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }
        if (this.has_next_tax == true) {
          this.has_next_tax = true;
        }
        if (this.has_previous_tax == true) {
          this.has_previous_tax = true;
        }
      })
    if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft' || this.requestStatusName == "Renewal Process" && this.vendorStatusName == "Draft") {
      this.getmodification_vender();
      this.tax_modify = true;
      

    }
  }

}