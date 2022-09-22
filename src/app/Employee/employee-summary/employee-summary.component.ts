import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { Observable, from } from 'rxjs'
import { masterService } from "../../Master/master.service";
import { ShareService } from '../../Master/share.service'
import {NotificationService} from '../../service/notification.service'
import { MemoService } from "../../service/memo.service";
import { SharedService } from '../../service/shared.service'
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-employee-summary',
  templateUrl: './employee-summary.component.html',
  styleUrls: ['./employee-summary.component.scss']
})
export class EmployeeSummaryComponent implements OnInit {
  employeeList: Array<any>
  costCentreList: Array<any>
  businessSegmentList: Array<any>
  ccbsList: Array<any>
  hierarchyList: Array<any>
  contactList: Array<any>
  designationList: Array<any>
  countryList: Array<any>
  stateList: Array<any>
  districtList: Array<any>
  cityList: Array<any>
  pincodeList: Array<any>
  has_next = true;
  has_previous = true;
  currentpage: number = 1;

  isShownEmpToDeptMap: boolean
  isShownCostcentre: boolean
  isShownBusinesssegment: boolean
  isShownCCBS: boolean
  isShownHierarchy: boolean
  isShownContact: boolean
  isShownDesignation: boolean
  isShownCountry: boolean
  isShownState: boolean
  isShownDistrict: boolean
  isShownCity: boolean
  isShownPincode: boolean
  apcform:FormGroup;
  pinform:FormGroup;

  constructor(private sharedService: SharedService,private memoService: MemoService,
    private router: Router, private notification:NotificationService,private fb: FormBuilder, 

     public dataService: masterService, private shareService: ShareService) { }

  ngOnInit(): void {  this.pinform = this.fb.group({
    name: ['']

  })

    // this.getCostCentreList();
    // this.getBusinessSegmentList();
    // this.getCCBSList();
    // this.getHierarchyList();
    // this.getContactList();
    // this.getDesignationList();
    // this.getCountryList();
    // this.getStateList();
    // this.getDistrictList();
    // this.getCityList();
    // this.getPincodeList();
    // console.log('coming from on init',this.dataService.ComingFrom)
  }

  private getEmployee(filter = "", sortOrder = 'asc',
  pageNumber = 1, pageSize = 10) {
    this.memoService.getEmployee(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
        // console.log("employeee", datas)
        let datapagination = results["pagination"];
        this.employeeList = datas;
        if (this.employeeList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }

      })
  }
  nextClickEmployee(){
    if (this.has_next === true) {
    this.getEmployee("", 'asc', this.currentpage + 1, 10)
    }
  }

  previousClickEmployee(){
    if (this.has_previous === true) {
    this.getEmployee("", 'asc', this.currentpage - 1, 10)
    }
  }

  employeeView(data) {
    // console.log("employeeViee", data)
    this.sharedService.employeeView.next(data)
    this.router.navigateByUrl('/employeeView',{ skipLocationChange: true })

  }

  private getCostCentreList(filter = "", sortOrder = 'asc',
  pageNumber = 1, pageSize = 10) {
    this.dataService.getCostCentreList(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.costCentreList = datas;
        let datapagination = results["pagination"];
        this.costCentreList = datas;
        if (this.costCentreList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }

      })
  }
  costCentreEdit(data: any) {
    this.shareService.costCentreEditValue.next(data)
    this.router.navigateByUrl('/costcentreEdit',{ skipLocationChange: true })
    return data;
  }
  nextClick3(){
    if (this.has_next === true) {
    this.getCostCentreList("", 'asc', this.currentpage + 1, 10)
  }
  }

  previousClick3(){
    if (this.has_previous === true) {
    this.getCostCentreList("", 'asc', this.currentpage - 1, 10)
    }
  }

  

  private getBusinessSegmentList(filter = "", sortOrder = 'asc',
  pageNumber = 1, pageSize = 10) {
    this.dataService.getBusinessSegmentList(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businessSegmentList = datas;
        let datapagination = results["pagination"];
        this.businessSegmentList = datas;
        if (this.businessSegmentList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }

      })
  }
  businessSegmentEdit(data: any) {
    this.shareService.businessSegmentEditValue.next(data)
    this.router.navigateByUrl('/businesssegmentEdit',{ skipLocationChange: true })
    return data;
  }
  nextClick2(){
    if (this.has_next === true) {
    this.getBusinessSegmentList("", 'asc', this.currentpage + 1, 10)
  }
  }

  previousClick2(){
    if (this.has_previous === true) {
    this.getBusinessSegmentList("", 'asc', this.currentpage - 1, 10)
    }
  }

  private getCCBSList(filter = "", sortOrder = 'asc',
  pageNumber = 1, pageSize = 10) {
    this.dataService.getCCBSList(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccbsList = datas;
        for (let i = 0; i < this.ccbsList.length; i++) {
          let cc =this.ccbsList[i].costcentre
          let bs = this.ccbsList[i].businesssegment
          if(cc==undefined){
            this.ccbsList[i].cc_name=''
          }else{
            this.ccbsList[i].cc_name=cc.name
          };
          if(bs==undefined){
            this.ccbsList[i].bs_name=''
          }else{
            this.ccbsList[i].bs_name=bs.name
          };
        }
        let datapagination = results["pagination"];
        this.ccbsList = datas;
        if (this.ccbsList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
        // console.log('getccbslist',datas )
        
      })
  }
  ccbsEdit(data: any) {
    this.shareService.ccbsMappingEditValue.next(data)
    this.router.navigateByUrl('/ccbsEdit',{ skipLocationChange: true })
    return data;
  }
  
  nextClickMapping(){
      if (this.has_next === true) {
      this.getCCBSList("", 'asc', this.currentpage + 1, 10)
    }
  }

  previousClickMapping(){
      if (this.has_previous === true) {
      this.getCCBSList("", 'asc', this.currentpage - 1, 10)
      }
  }

  private getHierarchyList(filter = "", sortOrder = 'asc',
  pageNumber = 1, pageSize = 10) {
    this.dataService.getHierarchyList(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.hierarchyList = datas;
        let datapagination = results["pagination"];
        this.hierarchyList = datas;
        if (this.hierarchyList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
      })
  }
  nextClickHierarchy(){
    if (this.has_next === true) {
    this.getHierarchyList("", 'asc', this.currentpage + 1, 10)
    }
  }

  previousClickHierarchy(){
    if (this.has_previous === true) {
    this.getHierarchyList("", 'asc', this.currentpage - 1, 10)
    }
  }
  hierarchyEdit(data: any) {
    this.shareService.hierarchyEditValue.next(data)
    this.router.navigateByUrl('/hierarchyEdit',{ skipLocationChange: true })
    return data;
  }

  private getContactList(filter = "", sortOrder = 'asc',
  pageNumber = 1, pageSize = 10) {
    this.dataService.getContactList(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.contactList = datas;
        let datapagination = results["pagination"];
        this.contactList = datas;
        if (this.contactList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }

      })
  }
  nextClickContact(){
    if (this.has_next === true) {
    this.getContactList("", 'asc', this.currentpage + 1, 10)
    }
  }

  previousClickContact(){
    if (this.has_previous === true) {
    this.getContactList("", 'asc', this.currentpage - 1, 10)
    }
  }
  contactEdit(data: any) {
    this.shareService.contactEditValue.next(data)
    this.router.navigateByUrl('/contactEdit',{ skipLocationChange: true })
    return data;
  }
  deleteContact(data){
    let value = data.id
    // console.log("deletecontact", value)
    this.dataService.contactDeleteForm(value)
    .subscribe(result =>  {
     this.notification.showSuccess("Successfully deleted....")
     return true

    })
  }

  private getDesignationList(filter = "", sortOrder = 'asc',
  pageNumber = 1, pageSize = 10) {
    this.dataService.getDesignationList(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.designationList = datas;
        let datapagination = results["pagination"];
        this.designationList = datas;
        if (this.designationList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }

      })
  }
  nextClickDesignation(){
    if (this.has_next === true) {
    this.getDesignationList("", 'asc', this.currentpage + 1, 10)
    }
  }

  previousClickDesignation(){
    if (this.has_previous === true) {
    this.getDesignationList("", 'asc', this.currentpage - 1, 10)
    }
  }
  designationEdit(data: any) {
    this.shareService.designationEditValue.next(data)
    this.router.navigateByUrl('/designationEdit',{ skipLocationChange: true })
    return data;
  }
  deleteDesignation(data){
    let value = data.id
    // console.log("deletedesignation", value)
    this.dataService.designationDeleteForm(value)
    .subscribe(result =>  {
     this.notification.showSuccess("Successfully deleted....")
     return true

    })
  }

  private getCountryList(filter = "", sortOrder = 'asc',
  pageNumber = 1, pageSize = 10) {
    this.dataService.getCountryList(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.countryList = datas;
        let datapagination = results["pagination"];
        this.countryList = datas;
        if (this.countryList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }

      })
  }
  nextClickCountry(){
    if (this.has_next === true) {
    this.getCountryList("", 'asc', this.currentpage + 1, 10)
    }
  }

  previousClickCountry(){
    if (this.has_previous === true) {
    this.getCountryList("", 'asc', this.currentpage - 1, 10)
    }
  }
  countryEdit(data: any) {
    this.shareService.countryEditValue.next(data)
    this.router.navigateByUrl('/countryEdit',{ skipLocationChange: true })
    return data;
  }
  deleteCountry(data){
    let value = data.id
    // console.log("deletecountry", value)
    this.dataService.countryDeleteForm(value)
    .subscribe(result =>  {
     this.notification.showSuccess("Successfully deleted....")
     return true

    })
  }

  private getStateList(filter = "", sortOrder = 'asc',
  pageNumber = 1, pageSize = 10) {
    this.dataService.getStateList(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
        for (let i = 0; i < this.stateList.length; i++) {
          let ci =this.stateList[i].country_id
          if(ci==undefined){
            this.stateList[i].country_name=''
          }else{
            this.stateList[i].country_name=ci.name
          };
        }
        let datapagination = results["pagination"];
        this.stateList = datas;
        if (this.stateList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
        
      })
  }
  nextClickState(){
    if (this.has_next === true) {
    this.getStateList("", 'asc', this.currentpage + 1, 10)
    }
  }

  previousClickState(){
    if (this.has_previous === true) {
    this.getStateList("", 'asc', this.currentpage - 1, 10)
    }
  }
  stateEdit(data: any) {
    this.shareService.stateEditValue.next(data)
    this.router.navigateByUrl('/stateEdit',{ skipLocationChange: true })
    return data;
  }
  deleteState(data){
    let value = data.id
    // console.log("deletestate", value)
    this.dataService.stateDeleteForm(value)
    .subscribe(result =>  {
     this.notification.showSuccess("Successfully deleted....")
     return true

    })
  }

  private getDistrictList(filter = "", sortOrder = 'asc',
  pageNumber = 1, pageSize = 10) {
    this.dataService.getDistrictList(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList = datas;
        for (let i = 0; i < this.districtList.length; i++) {
          let si =this.districtList[i].state_id
          if(si==undefined){
            this.districtList[i].state_name=''
          }else{
            this.districtList[i].state_name=si.name
          };
        }
        let datapagination = results["pagination"];
        this.districtList = datas;
        if (this.districtList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
        
      })
  }
  nextClickDistrict(){
    if (this.has_next === true) {
    this.getDistrictList("", 'asc', this.currentpage + 1, 10)
    }
  }

  previousClickDistrict(){
    if (this.has_previous === true) {
    this.getDistrictList("", 'asc', this.currentpage - 1, 10)
    }
  }
  districtEdit(data: any) {
    this.shareService.districtEditValue.next(data)
    this.router.navigateByUrl('/districtEdit',{ skipLocationChange: true })
    return data;
  }
  deleteDistrict(data){
    let value = data.id
    // console.log("deletedistrict", value)
    this.dataService.districtDeleteForm(value)
    .subscribe(result =>  {
     this.notification.showSuccess("Successfully deleted....")
     return true

    })
  }

  private getCityList(filter = "", sortOrder = 'asc',
  pageNumber = 1, pageSize = 10) {
    this.dataService.getCityList(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList = datas;
        for (let i = 0; i < this.cityList.length; i++) {
          let si =this.cityList[i].state_id
          if(si==undefined){
            this.cityList[i].state_name=''
          }else{
            this.cityList[i].state_name=si.name
          };
        }
        let datapagination = results["pagination"];
        this.cityList = datas;
        if (this.cityList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
        
      })
  }
  nextClickCity(){
    if (this.has_next === true) {
    this.getCityList("", 'asc', this.currentpage + 1, 10)
    }
  }

  previousClickCity(){
    if (this.has_previous === true) {
    this.getCityList("", 'asc', this.currentpage - 1, 10)
    }
  }
  cityEdit(data: any) {
    this.shareService.cityEditValue.next(data)
    this.router.navigateByUrl('/cityEdit',{ skipLocationChange: true })
    return data;
  }
  deleteCity(data){
    let value = data.id
    // console.log("deletecity", value)
    this.dataService.cityDeleteForm(value)
    .subscribe(result =>  {
     this.notification.showSuccess("Successfully deleted....")
     return true

    })
  }

  private getPincodeList(filter = "", sortOrder = 'asc',
  pageNumber = 1, pageSize = 10) {
    this.dataService.getPincodeList(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pincodeList = datas;
        for (let i = 0; i < this.pincodeList.length; i++) {
          let ci =this.pincodeList[i].city_id
          let di =this.pincodeList[i].district_id
          if(ci==undefined){
            this.pincodeList[i].city_name=''
          }else{
            this.pincodeList[i].city_name=ci.name
          };
          if(di==undefined){
            this.pincodeList[i].district_name=''
          }else{
            this.pincodeList[i].district_name=di.name
          };
        }
        let datapagination = results["pagination"];
        this.pincodeList = datas;
        if (this.pincodeList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
        
      })
  }
  nextClickPincode(){
    if (this.has_next === true) {
    this.getPincodeList("", 'asc', this.currentpage + 1, 10)
    }
  }

  previousClickPincode(){
    if (this.has_previous === true) {
    this.getPincodeList("", 'asc', this.currentpage - 1, 10)
    }
  }
  pincodeEdit(data: any) {
    this.shareService.pincodeEditValue.next(data)
    this.router.navigateByUrl('/pincodeEdit',{ skipLocationChange: true })
    return data;
  }
  deletePincode(data){
    let value = data.id
    // console.log("deletepincode", value)
    this.dataService.pincodeDeleteForm(value)
    .subscribe(result =>  {
     this.notification.showSuccess("Successfully deleted....")
     return true

    })
  }


  



  empToDeptMapBtn() {
    this.isShownEmpToDeptMap= true;
    this.isShownCostcentre = false;   
    this.isShownBusinesssegment = false;
    this.isShownCCBS = false;
    this.isShownHierarchy = false;
    this.isShownContact = false;
    this.isShownDesignation = false;
    this.isShownCountry = false;
    this.isShownState = false;
    this.isShownDistrict = false;
    this.isShownCity = false;
    this.isShownPincode = false;
    this.getEmployee();
    this.dataService.ComingFrom = 'employee';
    // console.log('coming from employee ',this.dataService.ComingFrom)
  }
  costCentreBtn() {
    this.isShownEmpToDeptMap= false;
    this.isShownCostcentre = true;   
    this.isShownBusinesssegment = false;
    this.isShownCCBS = false;
    this.isShownHierarchy = false;
    this.isShownContact = false;
    this.isShownDesignation = false;
    this.isShownCountry = false;
    this.isShownState = false;
    this.isShownDistrict = false;
    this.isShownCity = false;
    this.isShownPincode = false;
    this.getCostCentreList();
    this.dataService.ComingFrom = 'costcentre';
    // console.log('coming from costcentre ',this.dataService.ComingFrom)
  }
  businessSegmentBtn() {
    this.isShownEmpToDeptMap= false;
    this.isShownCostcentre = false;
    this.isShownBusinesssegment = true;
    this.isShownCCBS = false;
    this.isShownHierarchy = false;
    this.isShownContact = false;
    this.isShownDesignation = false;
    this.isShownCountry = false;
    this.isShownState = false;
    this.isShownDistrict = false;
    this.isShownCity = false;
    this.isShownPincode = false;
    this.getBusinessSegmentList();
    this.dataService.ComingFrom = 'businesssegment';
    // console.log('coming from businesssegment ',this.dataService.ComingFrom)
  }
  ccbsBtn() {
    this.isShownEmpToDeptMap= false;
    this.isShownCostcentre = false;
    this.isShownBusinesssegment = false;
    this.isShownCCBS = true;
    this.isShownHierarchy = false;
    this.isShownContact = false;
    this.isShownDesignation = false;
    this.isShownCountry = false;
    this.isShownState = false;
    this.isShownDistrict = false;
    this.isShownCity = false;
    this.isShownPincode = false;
    this.getCCBSList();
    this.dataService.ComingFrom = 'ccbsmapping';
    // console.log('coming from ccbsmapping ',this.dataService.ComingFrom)
  }
  hierarchyBtn() {
    this.isShownEmpToDeptMap= false;
    this.isShownCostcentre = false;
    this.isShownBusinesssegment = false;
    this.isShownCCBS = false;
    this.isShownHierarchy = true;
    this.isShownContact = false;
    this.isShownDesignation = false;
    this.isShownCountry = false;
    this.isShownState = false;
    this.isShownDistrict = false;
    this.isShownCity = false;
    this.isShownPincode = false;
    this.getHierarchyList();
  }
  contactBtn() {
    this.isShownEmpToDeptMap= false;
    this.isShownCostcentre = false;
    this.isShownBusinesssegment = false;
    this.isShownCCBS = false;
    this.isShownHierarchy = false;
    this.isShownContact = true;
    this.isShownDesignation = false;
    this.isShownCountry = false;
    this.isShownState = false;
    this.isShownDistrict = false;
    this.isShownCity = false;
    this.isShownPincode = false;
    this.getContactList();
  }
  designationBtn() {
    this.isShownEmpToDeptMap= false;
    this.isShownCostcentre = false;
    this.isShownBusinesssegment = false;
    this.isShownCCBS = false;
    this.isShownHierarchy = false;
    this.isShownContact = false;
    this.isShownDesignation = true;
    this.isShownCountry = false;
    this.isShownState = false;
    this.isShownDistrict = false;
    this.isShownCity = false;
    this.isShownPincode = false;
    this.getDesignationList();
  }
  countryBtn() {
    this.isShownEmpToDeptMap= false;
    this.isShownCostcentre = false;
    this.isShownBusinesssegment = false;
    this.isShownCCBS = false;
    this.isShownHierarchy = false;
    this.isShownContact = false;
    this.isShownDesignation = false;
    this.isShownCountry = true;
    this.isShownState = false;
    this.isShownDistrict = false;
    this.isShownCity = false;
    this.isShownPincode = false;
    this.getCountryList();
  }
  stateBtn() {
    this.isShownEmpToDeptMap= false;
    this.isShownCostcentre = false;
    this.isShownBusinesssegment = false;
    this.isShownCCBS = false;
    this.isShownHierarchy = false;
    this.isShownContact = false;
    this.isShownDesignation = false;
    this.isShownCountry = false;
    this.isShownState = true;
    this.isShownDistrict = false;
    this.isShownCity = false;
    this.isShownPincode = false;
    this.getStateList();
  }
  districtBtn() {
    this.isShownEmpToDeptMap= false;
    this.isShownCostcentre = false;
    this.isShownBusinesssegment = false;
    this.isShownCCBS = false;
    this.isShownHierarchy = false;
    this.isShownContact = false;
    this.isShownDesignation = false;
    this.isShownCountry = false;
    this.isShownState = false;
    this.isShownDistrict = true;
    this.isShownCity = false;
    this.isShownPincode = false;
    this.getDistrictList();
  }
  cityBtn() {
    this.isShownEmpToDeptMap= false;
    this.isShownCostcentre = false;
    this.isShownBusinesssegment = false;
    this.isShownCCBS = false;
    this.isShownHierarchy = false;
    this.isShownContact = false;
    this.isShownDesignation = false;
    this.isShownCountry = false;
    this.isShownState = false;
    this.isShownDistrict = false;
    this.isShownCity = true;
    this.isShownPincode = false;
    this.getCityList();

  }
  pincodeBtn() {
    this.isShownEmpToDeptMap= false;
    this.isShownCostcentre = false;
    this.isShownBusinesssegment = false;
    this.isShownCCBS = false;
    this.isShownHierarchy = false;
    this.isShownContact = false;
    this.isShownDesignation = false;
    this.isShownCountry = false;
    this.isShownState = false;
    this.isShownDistrict = false;
    this.isShownCity = false;
    this.isShownPincode = true;
    this.getPincodeList();

  }
  
  pinsearch(){
    this.dataService.getPinCodeSearch(this.pinform.value.name)
    .subscribe(result => {
      let datas = result['data'];
      this.pincodeList = datas;
      // for (let i = 0; i < this.pincodeList.length; i++) {
      //   let ci =this.pincodeList[i].city_id
      //   let di =this.pincodeList[i].district_id
      //   if(ci==undefined){
      //     this.pincodeList[i].city_name=''
      //   }else{
      //     this.pincodeList[i].city_name=ci.name
      //   };
      //   if(di==undefined){
      //     this.pincodeList[i].district_name=''
      //   }else{
      //     this.pincodeList[i].district_name=di.name
      //   };
      // }
      let datapagination = result["pagination"];
      this.pincodeList = datas;
      if (this.pincodeList.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.currentpage = datapagination.index;
      }
     
    })
  }
}
