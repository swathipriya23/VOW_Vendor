import { Component, OnInit, ViewChild} from '@angular/core';
import { ShareService } from '../share.service'
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { Router } from '@angular/router'
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import {MatDialog} from '@angular/material/dialog';
@Component({
  selector: 'app-branch-view',
  templateUrl: './branch-view.component.html',
  styleUrls: ['./branch-view.component.scss']
})
export class BranchViewComponent implements OnInit {
  @ViewChild('closebuttonactivity') closebuttonactivity;
  @ViewChild('closebuttonbranchPayment') closebuttonbranchPayment;
  @ViewChild('closebuttonbranchPaymentedit') closebuttonbranchPaymentedit;
  @ViewChild('closebuttonbranchPaymentvieew') closebuttonbranchPaymentvieew;
  @ViewChild('closebuttonactivityDetail') closebuttonactivityDetail;
  @ViewChild('closebuttonactivityDetailedit') closebuttonactivityDetailedit;
  @ViewChild('closebuttoncatelog') closebuttoncatelog;
  @ViewChild('closebuttoncatelogedit') closebuttoncatelogedit;
  @ViewChild('closebuttoncatelogview') closebuttoncatelogview
  // tabList: string[] = ['ACTIVITY','BRANCH TAX DETAILS','BRANCH PAYMENT DETAILS'];
  statusTab: any;
  activitySummary=true;
  myControl = new FormControl('ACTIVITY');
  options: string[] = ['ACTIVITY', 'BRANCH PAYMENT DETAILS'];
  dropDownTag = "ACTIVITY";
  TabArray: string[] = ['ACTIVITY', 'BRANCH PAYMENT DETAILS'];
  filteredOptions: Observable<string[]>;
  vendorId: number;
  Fileidd:number
  branchViewId: number;
  panNumber: string;
  creditTerms: string
  gstNumber: string;
  limitDays: number;
  products: [];
  has_next_tax = false;
  has_previous_tax = false;
  Branchtaxadd = false;
  branchcode='';
  name: string;
  remarks: string
  contactName: string;
  contactDesignation: string;
  contactDOB: string
  contactEmail: string;
  // contactType: string;
  contactLine1: string;
  contactLine2: string;
  contacMobile1: string;
  contacMobile2: string;
  contactWeddingDate: string;
  addressCity: string;
  addressDistrict: string;
  addressState: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  ispayment = false;
  istax = false;
  taxedit = false;
  addressPincode: string;
  isActivity = true;
  isActivityForm: boolean;
  isActivityEditForm: boolean;
  activityList: any;
  has_next = true;
  has_previous = true;
  paymenteditform = false;
  currentpage: number = 1;
  presentpage: number = 1;
  has_next_payment = false;
  has_previous_payment = false;
  currentpage_payment: number = 1;
  presentpage_payment: number = 1;
  pageSize = 10;
  branchtax = false;

  branchID: any;
  mainbid = 0;
  paymentaddform = false;
  vendorDetail: any;
  isActivityPagination: boolean;
  // getBranchList=[];
  getBranchList: any;
  displayedColumns: any;
  modificationdata: any;
  payment_data = [];
  payment_modify = false;
  requestStatusName: string;
  vendorStatusName: string;
  mainStatusName: string;
  isPaymentPagination:boolean;
  vendor_flag=false;
  
  modificationactivitydata: any;
  activity_data = [];
  activity_modify = false;

  tax_modify = false;
  tax_data = [];
  modificationtaxdata: any;
  branchtax_RMView = false;
  payment_RMView = false;
  docbtn: boolean;
  hide:false;


  constructor(private shareService: ShareService,private SpinnerService: NgxSpinnerService, private notification: NotificationService, private router: Router,
    private atamaService: AtmaService,public dialog: MatDialog) { }

  ngOnInit(): void {
    let data = this.shareService.vendorDATA.value
    this.vendorDetail = data
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.getBranchView()
    this.getVendorViewDetails();
    this.getActivity();
    this.getmodification_vender();
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


  activity_view(){
      this.activitySummary = true;
      this.isActivity = true;
      this.isActivityForm = false;
      this.istax = false;
      this.Branchtaxadd = false;
      this.taxedit = false;
      this.ispayment = false;
      this.paymentaddform = false;
      this.paymenteditform = false;
      this.isActivityDetail = false
      this.isCatalog = false
      this.getActivity();
  }
  payment_view(){
        this.activitySummary = false;
        this.isActivity = false;
        this.istax = false;
        this.Branchtaxadd = false;
        this.taxedit = false;
        this.ispayment = true;
        this.paymentaddform = false;
        this.paymenteditform = false;
        this.isActivityDetail = false
        this.isCatalog = false
        this.getpaymentsummary();
}

ActDetail_view(){
  this.isCatalog = false
  this.isActivityDetail = true
  this.activitySummary = false;
  this.isActivity = false;
  this.istax = false;
  this.Branchtaxadd = false;
  this.taxedit = false;
  this.ispayment = false;
  this.paymentaddform = false;
  this.paymenteditform = false;
}

catelog_view(){
  this.isCatalog = true
  this.isActivityDetail = false
  this.activitySummary = false;
  this.isActivity = false;
  this.istax = false;
  this.Branchtaxadd = false;
  this.taxedit = false;
  this.ispayment = false;
  this.paymentaddform = false;
  this.paymenteditform = false;
}
  tabchange(event) {
    console.log("tab", event)
    if (event.isUserInput == true) {
      this.statusTab = event.source.value;
      if (this.statusTab === 'ACTIVITY') {
        this.activitySummary = true;
        this.isActivity = true;
        this.isActivityForm = false;
        this.istax = false;
        this.Branchtaxadd = false;
        this.taxedit = false;
        this.ispayment = false;
        this.paymentaddform = false;
        this.paymenteditform = false;
        this.isActivityDetail = false
        this.isCatalog = false
        this.getActivity();
        return false
      }
      else if (this.statusTab === 'BRANCH TAX DETAILS') {
        this.istax = true;
        this.Branchtaxadd = false;
        this.taxedit = false;
        this.getpagenation();
        this.activitySummary = false;
        this.isActivity = false;
        this.ispayment = false;
        this.paymentaddform = false;
        this.paymenteditform = false;
        return false
      }
      else if (this.statusTab === 'BRANCH PAYMENT DETAILS') {
        this.activitySummary = false;
        this.isActivity = false;
        this.istax = false;
        this.Branchtaxadd = false;
        this.taxedit = false;
        this.ispayment = true;
        this.paymentaddform = false;
        this.paymenteditform = false;
        this.isActivityDetail = false
        this.isCatalog = false
        this.getpaymentsummary();
        return false
      }
      // else if (this.statusTab === 'ACTIVITY DETAILS') {
      //   this.isActivityDetail = true
      //   this.activitySummary = false;
      //   this.isActivity = false;
      //   this.istax = false;
      //   this.Branchtaxadd = false;
      //   this.taxedit = false;
      //   this.ispayment = false;
      //   this.paymentaddform = false;
      //   this.paymenteditform = false;
      //   this.isCatalog = false
      //   // this.getpaymentsummary();
      //   return false
      // }
      // else if (this.statusTab === 'CATELOG') {
      //   this.isActivityDetail = false
      //   this.isCatalog = true
      //   this.activitySummary = false;
      //   this.isActivity = false;
      //   this.istax = false;
      //   this.Branchtaxadd = false;
      //   this.taxedit = false;
      //   this.ispayment = false;
      //   this.paymentaddform = false;
      //   this.paymenteditform = false;
      //   // this.getpaymentsummary();
      //   return false
      // }
    }
  }
  paymentaddcancel() {
    this.ispayment = true;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.payment_RMView = false;
    this.istax = false;
    // this.getpaymentsummary();
    this.closebuttonbranchPayment.nativeElement.click();
  }
  paymentrmviewcancel(){
      this.ispayment = true;
      this.paymentaddform = false;
      this.paymenteditform = false;
      this.payment_RMView = false;
      this.istax = false;
      // this.getpaymentsummary();
      this.closebuttonbranchPaymentvieew.nativeElement.click();
  }
  paymentaddsumbmit() {
    this.ispayment = true;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.istax = false;
    this.getpaymentsummary();
    this.closebuttonbranchPayment.nativeElement.click();

  }
  taxeditsubt() {
    this.taxedit = false;
    this.Branchtaxadd = false;
    this.isActivity = false;
    this.ispayment = false;
    this.isActivityForm = false;
    this.isActivityEditForm = false;
    this.branchtax = false;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.istax = true;
    this.getpagenation();
  }
  taxeditcancel() {
    this.taxedit = false;
    this.Branchtaxadd = false;
    this.isActivity = false;
    this.ispayment = false;
    this.isActivityForm = false;
    this.isActivityEditForm = false;
    this.branchtax = false;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.istax = true;
    this.getpagenation();
  }
  taxadd() {

    this.Branchtaxadd = true;
    this.isActivity = false;
    this.ispayment = false;
    this.isActivityForm = false;
    this.isActivityEditForm = false;
    this.branchtax = false;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.istax = false;
    this.shareService.branchTaxtEdit.next(" ")

  }
  branchayment() {
    this.isActivity = false;
    this.ispayment = true;
    this.isActivityForm = false;
    this.isActivityEditForm = false;
    this.branchtax = false;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.istax = false;

    this.getpaymentsummary();

    this.taxedit = false;
    this.Branchtaxadd = false;
    this.isActivityEditForm = false;





  }
  // branchpayRef:any;
  // openDialog(branchpayRef) {
  //   const dialogRef = this.dialog.open(branchpayRef, {
  //     height: '500px',
  //     width: '100%',
    
      
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }
  // bpayform =false
  branchpayadd() {
    this.ispayment = false;
    this.paymentaddform = true;
    this.paymenteditform = false;
    // this.bpayform = true;



  }
  branchtaxaddsbt() {

    this.taxedit = false;
    this.Branchtaxadd = false;
    this.isActivity = false;
    this.ispayment = false;
    this.isActivityForm = false;
    this.isActivityEditForm = false;
    this.branchtax = false;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.istax = true;
    this.shareService.vendorDATA.next(this.vendorDetail)
    this.getpagenation();
  }
  branchtaxaddcancl() {

    this.taxedit = false;
    this.Branchtaxadd = false;
    this.isActivity = false;
    this.ispayment = false;
    this.isActivityForm = false;
    this.isActivityEditForm = false;
    this.branchtax = false;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.istax = true;
    this.branchtax_RMView = false;
    this.getpagenation();
  }
  RMView_branchpayment (data){
    console.log("payment", data)
    this.ispayment = false;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.payment_RMView = true;
    this.shareService.modification_data.next(data);
  }
  RMView_branchtax (data){
    console.log("tax", data)
    this.istax = false;
    this.Branchtaxadd = false;
    this.taxedit = false;
    this.branchtax_RMView = true;
    this.shareService.modification_data.next(data);
  }

  paymentcancel() {
    this.ispayment = true;
    this.paymentaddform = false;
    this.paymenteditform = false;
    // this.getpaymentsummary();
    this.closebuttonbranchPaymentedit.nativeElement.click();
  }
  paymentsumbmit() {

    this.ispayment = true;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.getpaymentsummary();
    this.closebuttonbranchPaymentedit.nativeElement.click();
  }
  // tax  start
  getpaymentsummary(pageNumber = 1, pageSize = 10) {
    this.atamaService.getpaymentsummary(pageNumber, pageSize, this.branchViewId)
      .subscribe((result) => {
        console.log("pay", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.getBranchList = datass;
        console.log("pay", this.getBranchList)

        if (this.getBranchList.length > 0) {
          this.has_next_payment = datapagination.has_next;
          this.has_previous_payment = datapagination.has_previous;
          this.presentpage_payment = datapagination.index;
          this.isPaymentPagination = true;
        }
        if (this.getBranchList <= 0) {
          this.isPaymentPagination = false;
        }
        if (this.has_next_payment == true) {
          this.has_next_payment = true;
        }
        if (this.has_previous_payment == true) {
          this.has_previous_payment = true;
        }
      })
    if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft'|| this.requestStatusName == "Renewal Process" && this.vendorStatusName == "Draft" ) {
      this.getmodification_vender();
      this.payment_modify = true;

    }

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


  deletebranchpay(data) {
    // this.docbtn=true;
    
    let paymentid = data.id
    console.log("deletebranchpay", paymentid)
    if (confirm("Delete Payment details?")) {
    this.atamaService.deletebranchform(paymentid, this.branchViewId)
      .subscribe(result => {
        this.notification.showSuccess(" deleted....")
        this.getpaymentsummary();
        return true

      })}
      else{
        return false
      }

  }
  nextClickbranch() {
    if (this.has_next_payment === true) {

      this.getpaymentsummary(this.presentpage_payment + 1, 10)
    }
  }

  previousClickbranch() {
    if (this.has_previous_payment === true) {

      this.getpaymentsummary(this.presentpage_payment - 1, 10)
    }
  }


  editbranch(e) {
    this.ispayment = false;
    this.paymentaddform = false;
    this.paymenteditform = true;
    this.shareService.paymenteditid.next(e)
    // this.router.navigate(['/PaymenteditComponent'], { skipLocationChange: true })
  }
  // tax end

  getBranchView() {
    let data: any = this.shareService.branchView.value;
    this.branchID = data
    this.branchViewId = data.id;
    this.shareService.pre_branch.next(this.branchViewId)
    this.vendorId = data.vendor_id;

    this.atamaService.branchViewDetails(this.vendorId, this.branchViewId)
      .subscribe(data => {
        this.name = data.name;
        this.branchcode=data.code;
        this.panNumber = data.panno;
        this.gstNumber = data.gstno;
        this.creditTerms = data.creditterms;
        this.limitDays = data.limitdays;
        this.remarks = data.remarks;
        let address = data.address_id;
        this.addressCity = address.city_id.name;
        this.addressDistrict = address.district_id.name;
        this.addressState = address.state_id.name;
        this.addressPincode = address.pincode_id.no;
        this.addressLine1 = address.line1;
        this.addressLine2 = address.line2;
        this.addressLine3 = address.line3;
        let contact = data.contact_id;
        this.contactName = contact.name;
        this.contactEmail = contact.email;
        this.contactDOB = contact.dob;
        this.contactWeddingDate = contact.wedding_date;
        this.contactLine1 = contact.landline;
        this.contactLine2 = contact.landline2;
        this.contacMobile1 = contact.mobile;
        this.contacMobile2 = contact.mobile2;
        this.contactDesignation = contact.designation;
        // this.contactType = contact.type_id.name;
        console.log("BRANCHVIEWDETAILS", data)
      })
  }
  getActivity(pageNumber = 1, pageSize = 10) {
    this.atamaService.getActivityList(this.branchViewId, pageNumber, pageSize)
      .subscribe(result => {
        console.log("activity", result)
        let datas = result['data'];
        this.activityList = datas;
        let datapagination = result["pagination"];
        this.activityList = datas;
        if (this.activityList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.isActivityPagination = true;
        } if (this.activityList <= 0) {
          this.isActivityPagination = false;
        }
      })

    if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft' ||this.requestStatusName == "Renewal Process" && this.vendorStatusName == "Draft") {
      this.getmodification_vender();
      this.activity_modify = true;

    }

  }
  nextClickActivity() {
    if (this.has_next === true) {
      this.getActivity(this.presentpage + 1, 10)
    }
  }

  previousClickActivity() {
    if (this.has_previous === true) {
      this.getActivity(this.presentpage - 1, 10)
    }
  }
  activityBtn() {
    this.isActivity = true;
    this.isActivityForm = false;
    this.isActivityEditForm = false;
    this.ispayment = false;
    this.branchtax = false;
    this.istax = false;
    this.taxedit = false;
    this.Branchtaxadd = false;
    this.isActivityEditForm = false;
    this.branchtax = false;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.istax = false;
    this.taxedit = false;


  }
  addActivity() {
    this.isActivity = false;
    this.isActivityForm = true;
    this.shareService.branchID.next(this.branchID)
    this.shareService.vendorDATA.next(this.vendorDetail)
  }
  activityEditForm(data) {
    this.isActivity = false;
    this.isActivityEditForm = true;
    this.shareService.activityEditForm.next(data);
    this.shareService.branchID.next(this.branchID)
  }
  activityCancel() {
    this.isActivityForm = false;
    this.isActivity = true;
    this.closebuttonactivity.nativeElement.click();
  }
  activitySubmit() {
    this.getActivity()
    this.isActivityForm = false;
    this.isActivity = true;
    this.closebuttonactivity.nativeElement.click();
  }
  actiyyy_id:any
  acti_details:any
  activityView(data) {
    this.acti_details = data;
    this.activityViewId = data.id
    this.shareService.activityView.next(data)
    this.router.navigate(['/atma/activityView'], { skipLocationChange: true })
  }

  taxsummary() {
    this.istax = true;
    this.getpagenation();
    this.isActivity = false;
    this.isActivityForm = false;
    this.isActivityEditForm = false;
    this.ispayment = false;
    this.branchtax = false;
    this.taxedit = false;
    this.Branchtaxadd = false;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.taxedit = false;

  }
  //tax section

  getpagenation(pageNumber = 1, pageSize = 10) {
    this.atamaService.Taxsummary(pageNumber, pageSize, this.vendorDetail.id)
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
  previousClick() {
    if (this.has_previous_tax === true) {

      // *(this.pageSize);
      this.getpagenation(this.presentpage - 1, 10)
    }
  }
  nextClick() {

    if (this.has_next_tax === true) {

      // *(this.pageSize);
      this.getpagenation(this.presentpage + 1, 10)
    }
  }
  // delete_tax
  delete_tax(id) {
    if (confirm("Delete Tax details?")) {
      this.atamaService.Brachtaxdelete(id, this.branchViewId)
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
  Taxedit(e) {
    this.shareService.branchTaxtEdit.next(e)
    this.taxedit = true;
    this.istax = false;

    // this.router.navigate(['/branchTaxEdit'], { skipLocationChange: true })
  }

  activeto_inactive(data){
    this.SpinnerService.show();
    if(data.paymode_id.name=='DD'){
      data['paymode_id']=data.paymode_id.id
      data['bank_id']=0
      data['branch_id']=0

    }else{
      data['paymode_id']=data.paymode_id.id
      data['bank_id']=data.bank_id.id
      data['branch_id']=data.branch_id.id
    }
    if(data.is_active){
      data['is_active']=0
    }else{
      data['is_active']=1

    }
    this.atamaService.paymentactive(data)
    .subscribe(result => {
      if(result.id>0||result.id!=undefined){
        this.notification.showSuccess("Success")
        this.getpaymentsummary();
        this.SpinnerService.hide();
          return false;
      }else{
        this.notification.showError('failes')
        this.SpinnerService.hide();
          return false;
      }
     
    })
    this.SpinnerService.hide();
  }

  getVendorViewDetails() {
    this.atamaService.getVendorViewDetails(this.vendorId)
      .subscribe(result => {
        this.requestStatusName = result.requeststatus_name;
        this.vendorStatusName = result.vendor_status_name;
        this.mainStatusName = result.mainstatus_name;
        if (this.requestStatusName == "Modification" && this.vendorStatusName == "Draft") {
          this.vendor_flag = true;
        }
        if(this.mainStatusName=="Draft"  &&   this.requestStatusName=="Onboard"  && this.vendorStatusName == "Draft" ){
          this.vendor_flag=true;
        }
        if(this.mainStatusName=="Draft"  &&   this.requestStatusName=="Onboard"  && this.vendorStatusName == "Rejected" ){
          this.vendor_flag=true;
        }
        if(this.mainStatusName=="Draft"  &&   this.requestStatusName=="Onboard"  && this.vendorStatusName == "Returned" ){
          this.vendor_flag=true;
        }
        if(this.mainStatusName=="Approved"  &&   this.requestStatusName=="Modification"  && this.vendorStatusName == "Draft" ){
          this.vendor_flag=true;
          this.activity_modify=true;
        }
        if(this.mainStatusName=="Approved"  &&   this.requestStatusName=="Modification"  && this.vendorStatusName == "Rejected" ){
          this.vendor_flag=true;
        }
        if(this.mainStatusName=="Approved"  &&   this.requestStatusName=="Modification"  && this.vendorStatusName == "Returned" ){
          this.vendor_flag=true;
        }
        if(this.mainStatusName=="Approved"  &&   this.requestStatusName=="Renewal Process"  && this.vendorStatusName == "Draft" ){
          this.vendor_flag=true;
        } 
     
      })
  }

  //Modification data for a particular vendor
getmodification_vender(){
  this.activity_data=[];
  this.tax_data=[];
  this.payment_data=[];

  this.atamaService.getmodification(this.vendorId)
      .subscribe(result => {
        this.modificationdata = result['data']
        // console.log("modifysummary",this.modificationdata)
        this.modificationdata.forEach(element => {
          if(element.action==2)//edit
          {
          if(element.type_name==13 && element.new_data.branch==this.branchViewId){
            this.activity_data.push(element.new_data) 
          }
          if(element.type_name==11 && element.new_data.branch_id.id==this.branchViewId ){
            this.tax_data.push(element.new_data )
          }
          if(element.type_name==12 && element.new_data.supplierbranch_id.id==this.branchViewId){
            this.payment_data.push(element.new_data)
          }

        }
        if(element.action==1)//create
        {
          if(element.type_name==13 && element.data.branch==this.branchViewId){
            this.activity_data.push(element.data)
          }
            if(element.type_name==11 && element.data.branch_id.id===this.branchViewId){
              console.log(element.data.branch_id.id)
              this.tax_data.push(element.data)
            }
            if(element.type_name==12 && element.data.supplierbranch_id.id===this.branchViewId){
              console.log("payment create",element.data.branch_id.id)
              this.payment_data.push(element.data)
          }
          
        }
        if(element.action==0)//delete
        {
          if(element.type_name==13 && element.data.branch==this.branchViewId){
            this.activity_data.push(element.data)
          }
            if(element.type_name==11  && element.data.branch_id.id==this.branchViewId){
              this.tax_data.push(element.data)
            }
            if(element.type_name==12 && element.data.supplierbranch_id.id==this.branchViewId){
              this.payment_data.push(element.data)
          }
          
        }
        if(element.action==3){
          if(element.type_name==12 && element.new_data.supplierbranch_id.id==this.branchViewId){
            this.payment_data.push(element.new_data)
          }
        }
        });

        if( this.requestStatusName=="Modification" && this.vendorStatusName=='Draft'){
          if(this.activity_data.length>0)
          {
            this.activity_data= this.getbtn_status(this.activity_data)}
          if(this.tax_data.length>0)
            {
              this.tax_data= this.getbtn_status(this.tax_data)}
          if(this.payment_data.length>0)
              {
                this.payment_data= this.getbtn_status(this.payment_data)}       
        }
            

   
      })

    console.log('cv',this.tax_data)
}
downattach(datas){
  for(var i=0;i<datas.attachment.length;i++){
    this.Fileidd=datas.attachment[i].id;

  this.atamaService .downloadfile(this.Fileidd)
   }
  

}



// activity detail

getActivityDetail(pageNumber = 1, pageSize = 10) {
  this.atamaService.getActivityDetailList(this.activityViewId, pageNumber, pageSize)
    .subscribe(result => {
      console.log("activitydetail", result)
      let datas = result['data'];
      this.totalData = datas;
      // console.log("ss", this.totalData)
      this.activityDetailList = datas;
      let datapagination = result["pagination"];
      this.activityDetailList = datas;
      if (this.activityDetailList.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.presentpage = datapagination.index;
        this.isActivityDetailPagination = true;
      } if (this.activityDetailList <= 0) {
        this.isActivityDetailPagination = false;
      }
      // if(this.totalData.length>0){
      //   this.getcatsummary();
      //   }
     
    })

  if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft' || this.requestStatusName == "Renewal Process" && this.vendorStatusName == "Draft") {
    this.getmodificationactivitydetail_vender();
    this.activitydetail_modify = true;

  }
  
}


nextClickActivityDetail() {
  if (this.has_next === true) {
    this.getActivityDetail(this.presentpage + 1, 10)
  }
}

previousClickActivityDetail() {
  if (this.has_previous === true) {
    this.getActivityDetail(this.presentpage - 1, 10)
  }
}

isCatalog:boolean
isCatalogForm:boolean
catelog_RMView:boolean
isCatalogEditForm:boolean
isActivityDetail: boolean;
isActivityDetailForm: boolean;
activityViewId: number;
branchId: number;
getData:any;
  type: string;
  startDate: string;
  endDate: string;
  contractSpend: string;
  rm: string;
  activityStatus: string;
  fidelity: string;
  bidding: string;
  description: string;
  updatename: string;
  updatetype: string;
  updatestartDate: string;
  updateendDate: string;
  updatecontractSpend: string;
  updaterm: string;
  updateactivityStatus: string;
  updatefidelity: any;
  updatebidding: any;
  updatedescription: string;
  activityUpdateCard = false;
  totalData: any;
  activityDetailList: any;
  activitydetail_modify = false;
  isActivityDetailPagination: boolean;
  isActivityDetailEditForm:boolean
  
  activityDetailBtn() {
    this.isActivityDetail = true;
    this.isActivityDetailForm = false;
    // this.isActivityDetailEditForm = false;
    if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft') {
      this.activitydetail_modify = true;
    }

  }

addActivityDetail() {
  this.isActivityDetail = false;
  this.isActivityDetailForm = true;
  this.shareService.activityView.next(this.activityViewId)
  this.shareService.activityViewDetail.next(this.acti_details)
}

activityDetailCancel() {
  this.isActivityDetailForm = false;
  this.isActivityDetail = true;
  this.closebuttonactivityDetail.nativeElement.click()
}
activityDetailSubmit() {
  this.activityViewId =  this.shareService.add_submit_preActivityID.value
  this.getActivityDetail()
  this.isActivityDetailForm = false;
  this.isActivityDetail = true;
  this.isActivity = false
  this.ispayment = false
  this.closebuttonactivityDetail.nativeElement.click()
}

activityDetailEditForm(data) {
  this.isActivityDetail = false;
  this.isActivityDetailEditForm = true;
  this.shareService.activityDetailEditForm.next(data);
  this.shareService.activityView.next(this.activityViewId)
  this.shareService.activityViewDetail.next(this.acti_details)
}

activityDetailEditCancel() {
  this.isActivityDetailEditForm = false;
  this.isActivityDetail = true;
  this.closebuttonactivityDetailedit.nativeElement.click()
}
activityDetailEditSubmit() {
  this.getActivityDetail();
  this.isActivityDetailEditForm = false;
  this.isActivityDetail = true;
  this.closebuttonactivityDetailedit.nativeElement.click()
}


deleteActivityDetail(data) {
  let supplierId = data.id
  if (confirm("Delete ACtivity details?")) {
  this.atamaService.activityDetailDelete(this.activityViewId, supplierId)
    .subscribe(result => {
      console.log("deleteactivityDetail", result)
      if (result.code === "UNEXPECTED_ACTIVITYID_ERROR" && result.description === "Cannot delete parent table ID") {
        this.notification.showWarning("Should Not be Delete ActivityDetail...")
      } 
      else {
        this.notification.showSuccess("Successfully deleted....")
        this.getActivityDetail();
        return true
      }
    })}
    else{
      return false
    }
}


getActivityView() {
  let data: any = this.shareService.activityView.value;
  console.log("activityrow",data)
  this.branchId = data.branch
  this.activityViewId = data.id;

  this.atamaService.activityViewDetails(this.branchId, this.activityViewId)
    .subscribe(data1 => {
      console.log("seperateactivitydetail",data1)
      let status = data1.modify_status;
      let ref_id = data1.modify_ref_id

      if (status == 2) {
        this.atamaService.activityViewDetails(this.branchId, ref_id)
          .subscribe(res => {
            console.log("res", res)
            this.branchActivityEdit(res, status);
          })
      } else {
        this.branchActivityEdit(data1, status);
      }
      this.getData = data1
      this.name = data1.name;
      this.type = data1.type;
      this.startDate = data1.start_date;
      this.endDate = data1.end_date;
      this.contractSpend = data1.contract_spend;
      this.rm = data1.rm;
      this.activityStatus = data1.activity_status;
      // if(data1.fidelity=='True'){
      //   this.fidelityBox= "Yes";
      // }else{
      //   this.fidelityBox= "No";
      // }
      // if(data1.bidding=='True'){
      //   this.biddingBox= "Yes";
      // }else{
      //   this.biddingBox= "No";
      // }
      this.description = data1.description;
      let contact = data1.contact_id;
      this.contactName = contact.name;
      this.contactEmail = contact.email;
      this.contactDOB = contact.dob;
      this.contactLine1 = contact.landline;
      this.contactLine2 = contact.landline2;
      this.contacMobile1 = contact.mobile;
      this.contacMobile2 = contact.mobile2;
      this.contactDesignation = contact.designation;
      // this.contactType = contact.type_id.name;
    })
}


branchActivityEdit(data, status) {
  if (status != 2) {
    this.activityUpdateCard = false;
  } else {
    this.updatename = data.name;
    this.updatetype = data.type;
    this.updatestartDate = data.start_date;
    this.updateendDate = data.end_date;
    this.updatecontractSpend = data.contract_spend;
    this.updaterm = data.rm;
    this.updateactivityStatus = data.activity_status;
    if(data.fidelity=='True'){
      this.updatefidelity= "Yes";
    }else{
      this.updatefidelity= "No";
    } 
    if(data.bidding=='True'){
      this.updatebidding= "Yes";
    }else{
      this.updatebidding= "No";
    }
    this.updatedescription = data.description;
  }

}


activitydetail_data = [];
catalog_data = [];
modificationactivitydetaildata: any;
cid:any
 //Modification data for a particular vendor
 getmodificationactivitydetail_vender() {
  this.activitydetail_data = [];
  this.catalog_data=[];
  this.atamaService.getmodification(this.vendorId)
    .subscribe(result => {
      
      this.modificationactivitydetaildata = result['data']
      this.modificationactivitydetaildata.forEach(element => {
        if (element.action == 2)//edit
        {
          if (element.type_name== 14 && element.new_data.activity_id.id==this.activityViewId) {
            this.activitydetail_data.push(element.new_data)
          }
          if (element.type_name== 15 && element.new_data.activitydetail_id.id==this.cid) {
            this.catalog_data.push(element.new_data)
          }
        }
        //create and delete
        else {
          if (element.type_name== 14 && element.data.activity_id.id==this.activityViewId) {
            this.activitydetail_data.push(element.data)
          }
          if (element.type_name== 15 && element.data.activitydetail_id.id==this.cid) {
            this.catalog_data.push(element.data)

          }
        }
      });
      if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft') {
        if (this.activitydetail_data.length > 0) {
          this.activitydetail_data = this.getbtn_status(this.activitydetail_data)
        }
        if (this.catalog_data.length > 0) {
          this.catalog_data = this.getbtn_status(this.catalog_data)
        }

      }
    })

}

activity_catddl:any
getCatalogList:any
isCatalogPagination: boolean;
catalogpage = 1;
catalog_next = true;
catalog_previous = true;
catalog_modify = false;
// catalogData(data){
//   this.activity_catddl =  data

// }


addCatalog() {
  this.isCatalog = false;
  this.isCatalogForm = true;
  // this.testingdata = this.testingCat;
  // console.log(">>S>ScatgLOGVALUE", this.testingdata)
  this.shareService.testingvalue.next(this.activity_catddl)
}
onCancelClick() {
  this.isCatalogForm = false;
  this.catelog_RMView = false;
  this.isCatalog = true
  this.closebuttoncatelog.nativeElement.click()
}
onCancelRMClick(){
  this.isCatalogForm = false;
  this.catelog_RMView = false;
  this.isCatalog = true
  this.closebuttoncatelogview.nativeElement.click()

}
RMView_catelog(data) {
  console.log("catelog", data)
  this.isCatalog = false;
  this.isCatalogForm = false;
  this.catelog_RMView = true;
  this.isCatalogEditForm = false;
  this.shareService.modification_data.next(data);
}

catalogSubmit() {
  this.cid = this.shareService.add_submit_preActivityDetailID.value
  this.getcatalogsummary();
  this.isCatalogForm = false;
  this.isCatalog = true
  this.closebuttoncatelog.nativeElement.click()
}

catalogEditCancel() {
  this.isCatalogEditForm = false;
  // this.ismakerCheckerButton = true;
  this.isCatalog = true;
  this.closebuttoncatelogedit.nativeElement.click()
}
catalogEditSubmit() {
  this.getcatalogsummary();
  this.isCatalogEditForm = false;
  // this.ismakerCheckerButton = true;
  this.isCatalog = true;
  this.closebuttoncatelogedit.nativeElement.click()


}
catalogEdit(data) {
  this.isCatalogEditForm = true;
  this.isCatalog = false;
  // this.ismakerCheckerButton = false;
  this.shareService.catalogEdit.next(data)
  // console.log("catalog", data);
  // this.shareService.testingvalue.next(this.testingdata)
  return data;
}



getcatalogsummary(pageNumber = 1, pageSize = 10) {
  let data: any = this.shareService.testingvalue.value;
  // let activityDetailId = data.id
  
  this.atamaService.getcatalogsummary(pageNumber, pageSize, this.cid)
    .subscribe(result => {
      console.log("Catalog-summary", result)
      let datas = result['data'];
      this.getCatalogList = datas;
      let datapagination = result["pagination"];
      this.getCatalogList = datas;
      if (this.getCatalogList.length >= 0) {
        this.catalog_next = datapagination.has_next;
        this.catalog_previous = datapagination.has_previous;
        this.catalogpage = datapagination.index;
        this.isCatalogPagination = true;
      } if (this.getCatalogList <= 0) {
        this.isCatalogPagination = false;
      }
    })

  if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft' || this.requestStatusName == "Renewal Process" && this.vendorStatusName == "Draft") {
    this.getmodificationactivitydetail_vender();
    this.catalog_modify = true;

  }
}

nextClickCatalog() {
  if (this.catalog_next === true) {
    this.getcatalogsummary(this.catalogpage + 1, 10)
  }
}
previousClickCatalog() {
  if (this.catalog_previous === true) {
    this.getcatalogsummary(this.catalogpage - 1, 10)
  }
}

deleteCatalog(data,index) {
  //  this.getCatalogList[index].catbtn=true;
  // this.isLoading = true;
  // this.wait(2000).then( () => this.isLoading = false );

    // let datas: any = this.shareService.testingvalue.value;
    let activityDetailId = data.activitydetail_id.id
    let value = data.id
    console.log("deleteCatalog", value)
    if (confirm("Delete Catalog details?")) {
    this.atamaService.deleteCatalogForm(value, activityDetailId)
      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        this.getcatalogsummary();
        return true
      })}else{
        return false
      }
  }

}