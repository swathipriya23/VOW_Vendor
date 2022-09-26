import { Component, OnInit, ViewChild } from '@angular/core';
import { ShareService } from '../share.service'
import { AtmaService } from '../atma.service'

import { NotificationService } from '../notification.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-activity-view',
  templateUrl: './activity-view.component.html',
  styleUrls: ['./activity-view.component.scss']
})
export class ActivityViewComponent implements OnInit {
  @ViewChild('closebuttoncatelogback') closebuttoncatelogback
  branchId: number;
  isLoading = false;
  activityViewId: number;
  totalData: any;
  testingdata: any;
  presentpage: number = 1;
  pageSize = 10;
  catname:any;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  contractSpend: string;
  rm: string;
  activityStatus: string;
  fidelity: string;
  bidding: string;
  description: string;
  contactName: string;
  contactDesignation: string;
  contactDOB: string;
  contactEmail: string;
  contactType: string;
  contactLine1: string;
  contactLine2: string;
  contacMobile1: string;
  contacMobile2: string;
  activityDetailList: any;
  isActivityDetail = true;
  isActivityDetailForm: boolean;
  isActivityDetailEditForm: boolean;
  getCatalogList: any;
  isCatalog=false;
  isCatalogForm: boolean;
  isCatalogEditForm: boolean;
  // ismakerCheckerButton: boolean;
  has_next = true;
  has_previous = true;
  activity_catddl: any;
  getData: any;
  branchViewId: any;
  isActivityDetailPagination: boolean;
  isCatalogPagination: boolean;
  message = "Are you sure to delete activity?"
  cid:any
  catalogpage = 1;
  catalog_next = true;
  catalog_previous = true;

  vendorId: number;
  modificationactivitydetaildata: any;
  activitydetail_data = [];
  activitydetail_modify = false;
  requestStatusName: string;
  vendorStatusName: string;

  modificationcatalogdata: any;
  catalog_data = [];
  catalog_modify = false;
  catalogTab=false;
  activityUpdateCard = false;
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
  activitydata: any;
  vendor_flag=false;
  mainStatusName: string;
  fidelityBox:any;
  biddingBox: any;
  activeid:any;
  catelog_RMView = false;
  
  

  constructor(private shareService: ShareService, private notification: NotificationService, private router: Router,
    private atamaService: AtmaService) { }


  ngOnInit(): void {
    let data: any = this.shareService.branchView.value;
    console.log("data for branch avticvity view ===============>", data )
    this.vendorId = data.vendor_id;
    console.log("vendorid", this.vendorId)
    this.getActivityView()
    this.getVendorViewDetails();  
    this.getActivityDetail();
    this.getmodificationactivitydetail_vender();
    // this.getmodificationactivitydetail_vender();
   
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
        if(data1.fidelity=='True'){
          this.fidelityBox= "Yes";
        }else{
          this.fidelityBox= "No";
        }
        if(data1.bidding=='True'){
          this.biddingBox= "Yes";
        }else{
          this.biddingBox= "No";
        }
        this.description = data1.description;
        let contact = data1.contact_id;
        this.contactName = contact.name;
        this.contactEmail = contact.email;
        this.contactDOB = contact.dob;
        this.contactLine1 = contact.landline;
        this.contactLine2 = contact.landline2;
        this.contacMobile1 = contact.mobile;
        this.contacMobile2 = contact.mobile2;
        this.contactDesignation = contact.designation_id.name;
        // this.contactType = contact.type_id.name;
      })
  }
  backButton(){
    this.router.navigate(['/atma/branchView'], { skipLocationChange: true })
  }
  activityUpdate() {
    this.shareService.activityEditForm.next(this.getData)
    this.shareService.vendorID.next(this.vendorId)
    this.router.navigate(['/atma/branchActivityEdit'], { skipLocationChange: true })
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
  activityDelete() {
    let data = this.getData
    console.log("deletedata", data)
    let activityID = data.id
    this.branchViewId = data.branch
    this.atamaService.activityDelete(this.branchViewId, activityID)
      .subscribe(result => {
        console.log("deleteactivity", result)
        if (result.code === "UNEXPECTED_ACTIVITYID_ERROR" && result.description === "Cannot delete parent table ID") {
          this.notification.showWarning("Should Not be Delete Activity...")
        } 
        else {
          this.notification.showSuccess("Successfully deleted....")
        this.router.navigate(['/atma/branchView'], { skipLocationChange: true })
        return true
        }
      })
  }

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

  getcatsummary(pageNumber = 1, pageSize = 10) {
    this.activeid=this.totalData[0].id
    this.catname=this.totalData[0].detailname
    this.atamaService.getcatalogsummary(pageNumber, pageSize,  this.cid)
    .subscribe(result => {
    console.log("Catalog", result)
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
  activityDetailBtn() {
    this.isActivityDetail = true;
    this.isActivityDetailForm = false;
    this.isActivityDetailEditForm = false;
    if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft') {
      this.activitydetail_modify = true;
    }

  }
  addActivityDetail() {
    this.isActivityDetail = false;
    this.isActivityDetailForm = true;
    this.shareService.activityView.next(this.activityViewId)
    this.shareService.activityViewDetail.next(this.getData)
  }
  activityDetailEditForm(data) {
    this.isActivityDetail = false;
    this.isActivityDetailEditForm = true;
    this.shareService.activityDetailEditForm.next(data);
    this.shareService.activityView.next(this.activityViewId)
    this.shareService.activityViewDetail.next(this.getData)
  }
  activityDetailCancel() {
    this.isActivityDetailForm = false;
    this.isActivityDetail = true;
  }
  activityDetailSubmit() {
    this.getActivityDetail()
    this.isActivityDetailForm = false;
    this.isActivityDetail = true;
  }
  activityDetailEditCancel() {
    this.isActivityDetailEditForm = false;
    this.isActivityDetail = true;
  }
  activityDetailEditSubmit() {
    this.getActivityDetail();
    this.isActivityDetailEditForm = false;
    this.isActivityDetail = true;
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
  getcatalogsummary(pageNumber = 1, pageSize = 10) {
    let data: any = this.shareService.testingvalue.value;
    // let activityDetailId = data.id
    
    this.atamaService.getcatalogsummary(pageNumber, pageSize, this.cid)
      .subscribe(result => {
        console.log("Catalog", result)
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

  catalogBtn() {
    // this.testingdata = this.testingCat;
    // console.log("get", this.testingdata)
    // this.shareService.testingvalue.next(this.testingdata)
    // this.getcatalogsummary();
    this.isCatalog = false;
    this.isCatalogForm = false;
    this.isActivityDetail=true;
    this.catalogTab=false;
   this. getActivityDetail();
    
    // // this.ismakerCheckerButton = true;
    // if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft') {
    //   this.catalog_modify = true;
    // }
  }
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
    this.getcatalogsummary();
    this.isCatalogForm = false;

    this.isCatalog = true
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
  catalogEditCancel() {
    this.isCatalogEditForm = false;
    // this.ismakerCheckerButton = true;
    this.isCatalog = true;
  }
  catalogEditSubmit() {
    this.getcatalogsummary();
    this.isCatalogEditForm = false;
    // this.ismakerCheckerButton = true;
    this.isCatalog = true;


  }
  async wait(ms: number): Promise<void> {
		return new Promise<void>( resolve => setTimeout( resolve, ms) );
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

  catalogList(data) {
    this.isCatalogForm = false;
    this.isCatalog=true;
    // this.catalogTab=true;
    this.isActivityDetail=false
    this.catname=data.detailname;
    this.cid=data.id;
    this.getcatalogsummary();
    // this.ismakerCheckerButton = true;
    // this.testingCat = data
    this.activity_catddl=data;
    let s = this.shareService.activityDetailList.next(data);
  }

  catalogData(data) {
   
    this.isCatalogForm = false;
    this.isCatalog=true;
    this.catalogTab=false;
    this.isActivityDetail=true
    this.catname=data.detailname;
    this.cid=data.id;
    this.getcatalogsummary();
    // this.ismakerCheckerButton = true;
    // this.testingCat = data
    this.activity_catddl=data;
    let s = this.shareService.activityDetailList.next(data);
    
  }

  catelogbackCancel(){
    this.isCatalog= false
    this.isActivityDetail = true
    this.closebuttoncatelogback.nativeElement.click()
  }
  
  
  
  getVendorViewDetails() {
    this.atamaService.getVendorViewDetails(this.vendorId, "codestatus")
      .subscribe(result => {
        this.requestStatusName = result.requeststatus_name;
        this.vendorStatusName = result.vendor_status_name;
        this.mainStatusName = result.mainstatus_name;
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
          this.activitydetail_modify = true;
          // this.isCatalog=true;
          this.catalog_modify = true;
        }
        if(this.mainStatusName=="Approved"  &&   this.requestStatusName=="Modification"  && this.vendorStatusName == "Rejected" ){
          this.vendor_flag=true;
        }
        if(this.mainStatusName=="Approved"  &&   this.requestStatusName=="Modification"  && this.vendorStatusName == "Returned" ){
          this.vendor_flag=true;
        }
        if (this.requestStatusName == "Modification" && this.vendorStatusName == "Draft") {
          this.vendor_flag = true;
        }
      })
  }


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


  getbtn_status(array) {
    for (let i = 0; i < array.length; i++) {

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

}