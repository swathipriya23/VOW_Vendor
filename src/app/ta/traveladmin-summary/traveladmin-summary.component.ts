import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import{FormControl,FormGroup,FormBuilder,Validators,FormArray} from '@angular/forms';

import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import {TaService} from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import {ShareService} from "../share.service"
import {ActivatedRoute, Router} from "@angular/router";
import { analyzeAndValidateNgModules } from '@angular/compiler';
export const PICK_FORMATS = {
  parse: {dateInput: {month: 'short', year: 'numeric', day: 'numeric'}},
  display: {
      dateInput: 'input',
      monthYearLabel: {year: 'numeric', month: 'short'},
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'}
  }
};
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
          return formatDate(date,'dd-MMM-yyyy',this.locale);
      } else {
          return date.toDateString();
      }
  }
}

@Component({
  selector: 'app-traveladmin-summary',
  templateUrl: './traveladmin-summary.component.html',
  styleUrls: ['./traveladmin-summary.component.scss']
})


export class TraveladminSummaryComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();  
   
  
  currentDate: any = new Date();
  // date = new Date().toLocaleDateString();
  defaultDate = new FormControl(new Date());
  today = new Date();
  date=new Date();
  has_next=true;
  has_previous=true;
  gettourapproveList:any
  memoSearchForm : FormGroup;
  tourapprovesummarypage:number=1;
  pagesize=10;
  currentpage: number = 1;
  presentpage: number = 1;
  istourappSummaryPagination:boolean;
  data:any;
  toursearch:any;
  latest:any;
  statusList: any;
  status: any;
  tourApprovalSearchForm : FormGroup;
  isTourChecker:boolean=true
  statusId: any = 2
  booktype: any;
  
    dataObj=  [
        {
            "accommodation_count": {
                "booked": 1,
                "cancel requested": 2,
                "cancelled": 2,
                "not booked": 1,
                "rejected": 1
            },
            "accomodation_status_id": 3,
            "accomodation_status_name": "BOOKED",
            "air_count": {
                "booked": 1,
                "cancel requested": 2,
                "cancelled": 1,
                "not booked": 3,
                "rejected": 1
            },
            "air_status_id": 1,
            "air_status_name": "NOT APPLICABLE",
            "appcomment": "",
            "applevel": 3,
            "approvedby": null,
            "approveddate": "10-May-2022",
            "approveddate_ms": 1652203745000,
            "approver_code": null,
            "approver_id": -1,
            "apptype": "TOUR",
            "branch_code": "101",
            "branch_name": "Chennai Head Office",
            "bus_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "bus_status_id": 1,
            "bus_status_name": "NOT APPLICABLE",
            "cab_count": {
                "booked": 2,
                "cancel requested": 0,
                "cancelled": 1,
                "not booked": 1,
                "rejected": 0
            },
            "cab_status_id": -2,
            "cab_status_name": "IN PROGRESS",
            "claim_status": "DEFAULT",
            "claim_status_id": -1,
            "empbranchgid": 1,
            "empdesignation": "OFFICER",
            "empgid": 3,
            "empgrade": "S3",
            "employee_code": "EMP003",
            "employee_name": "Raj",
            "enddate": "27-May-2022",
            "enddate_ms": 1653609600000,
            "id": 2794,
            "no_of_cancel_request_pending": 0,
            "opening_balance": 0.0,
            "quantum_of_funds": 0.0,
            "reason": "TRAVEL BUSINESS DOMESTIC",
            "requestdate": "09-May-2022",
            "requestdate_ms": 1652119383000,
            "startdate": "25-May-2022",
            "startdate_ms": 1653436800000,
            "status": 3,
            "status_name": "APPROVED",
            "tour_cancel_status": "DEFAULT",
            "tour_cancel_status_id": -1,
            "tour_status": "APPROVED",
            "tour_status_id": 3,
            "tourid": 949,
            "train_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "train_status_id": 1,
            "train_status_name": "NOT APPLICABLE"
        },
        {
            "accommodation_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "accomodation_status_id": 1,
            "accomodation_status_name": "NOT APPLICABLE",
            "air_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 1,
                "rejected": 0
            },
            "air_status_id": 0,
            "air_status_name": "NOT BOOKED",
            "appcomment": "",
            "applevel": 3,
            "approvedby": null,
            "approveddate": "10-May-2022",
            "approveddate_ms": 1652199999000,
            "approver_code": null,
            "approver_id": -1,
            "apptype": "TOUR",
            "branch_code": "101",
            "branch_name": "Chennai Head Office",
            "bus_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "bus_status_id": 1,
            "bus_status_name": "NOT APPLICABLE",
            "cab_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "cab_status_id": 1,
            "cab_status_name": "NOT APPLICABLE",
            "claim_status": "DEFAULT",
            "claim_status_id": -1,
            "empbranchgid": 1,
            "empdesignation": "OFFICER",
            "empgid": 2,
            "empgrade": "S3",
            "employee_code": "EMP002",
            "employee_name": "SowMIyA S",
            "enddate": "20-Jul-2022",
            "enddate_ms": 1658275200000,
            "id": 2781,
            "no_of_cancel_request_pending": 0,
            "opening_balance": 0.0,
            "quantum_of_funds": 0.0,
            "reason": "TRAVEL BUSINESS INTERNATIONAL",
            "requestdate": "10-May-2022",
            "requestdate_ms": 1652194443000,
            "startdate": "20-Jul-2022",
            "startdate_ms": 1658275200000,
            "status": 3,
            "status_name": "APPROVED",
            "tour_cancel_status": "DEFAULT",
            "tour_cancel_status_id": -1,
            "tour_status": "APPROVED",
            "tour_status_id": 3,
            "tourid": 961,
            "train_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "train_status_id": 1,
            "train_status_name": "NOT APPLICABLE"
        },
        {
            "accommodation_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 1,
                "not booked": 0,
                "rejected": 0
            },
            "accomodation_status_id": 4,
            "accomodation_status_name": "CANCELLED",
            "air_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "air_status_id": 1,
            "air_status_name": "NOT APPLICABLE",
            "appcomment": "",
            "applevel": 3,
            "approvedby": null,
            "approveddate": "07-May-2022",
            "approveddate_ms": 1651942343000,
            "approver_code": null,
            "approver_id": -1,
            "apptype": "TOUR",
            "branch_code": "101",
            "branch_name": "Chennai Head Office",
            "bus_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 1,
                "rejected": 0
            },
            "bus_status_id": 0,
            "bus_status_name": "NOT BOOKED",
            "cab_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "cab_status_id": 1,
            "cab_status_name": "NOT APPLICABLE",
            "claim_status": "REQUESTED",
            "claim_status_id": 1,
            "empbranchgid": 1,
            "empdesignation": "MANAGER",
            "empgid": 368,
            "empgrade": null,
            "employee_code": "EMP049",
            "employee_name": "mannar mannan",
            "enddate": "07-May-2022",
            "enddate_ms": 1651881600000,
            "id": 2639,
            "no_of_cancel_request_pending": 0,
            "opening_balance": 0.0,
            "quantum_of_funds": 0.0,
            "reason": "TRAVEL BUSINESS DOMESTIC",
            "requestdate": "07-May-2022",
            "requestdate_ms": 1651941937000,
            "startdate": "07-May-2022",
            "startdate_ms": 1651881600000,
            "status": 3,
            "status_name": "APPROVED",
            "tour_cancel_status": "DEFAULT",
            "tour_cancel_status_id": -1,
            "tour_status": "APPROVED",
            "tour_status_id": 3,
            "tourid": 929,
            "train_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "train_status_id": 1,
            "train_status_name": "NOT APPLICABLE"
        },
        {
            "accommodation_count": {
                "booked": 1,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 1
            },
            "accomodation_status_id": 3,
            "accomodation_status_name": "BOOKED",
            "air_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 1
            },
            "air_status_id": 7,
            "air_status_name": "REJECTED",
            "appcomment": "",
            "applevel": 3,
            "approvedby": null,
            "approveddate": "07-May-2022",
            "approveddate_ms": 1651926401000,
            "approver_code": null,
            "approver_id": -1,
            "apptype": "TOUR",
            "branch_code": "101",
            "branch_name": "Chennai Head Office",
            "bus_count": {
                "booked": 1,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 1
            },
            "bus_status_id": 3,
            "bus_status_name": "BOOKED",
            "cab_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "cab_status_id": 1,
            "cab_status_name": "NOT APPLICABLE",
            "claim_status": "DEFAULT",
            "claim_status_id": -1,
            "empbranchgid": 1,
            "empdesignation": "OFFICER",
            "empgid": 25,
            "empgrade": "S3",
            "employee_code": "EMP025",
            "employee_name": "Ste2",
            "enddate": "20-May-2022",
            "enddate_ms": 1653004800000,
            "id": 2615,
            "no_of_cancel_request_pending": 0,
            "opening_balance": 0.0,
            "quantum_of_funds": 0.0,
            "reason": "TRAVEL BUSINESS DOMESTIC",
            "requestdate": "07-May-2022",
            "requestdate_ms": 1651926312000,
            "startdate": "20-May-2022",
            "startdate_ms": 1653004800000,
            "status": 3,
            "status_name": "APPROVED",
            "tour_cancel_status": "DEFAULT",
            "tour_cancel_status_id": -1,
            "tour_status": "APPROVED",
            "tour_status_id": 3,
            "tourid": 924,
            "train_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 1,
                "rejected": 1
            },
            "train_status_id": -2,
            "train_status_name": "IN PROGRESS"
        },
        {
            "accommodation_count": {
                "booked": 1,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 1
            },
            "accomodation_status_id": 3,
            "accomodation_status_name": "BOOKED",
            "air_count": {
                "booked": 1,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 1,
                "rejected": 0
            },
            "air_status_id": -2,
            "air_status_name": "IN PROGRESS",
            "appcomment": "",
            "applevel": 3,
            "approvedby": null,
            "approveddate": "05-May-2022",
            "approveddate_ms": 1651761978000,
            "approver_code": null,
            "approver_id": -1,
            "apptype": "TOUR",
            "branch_code": "101",
            "branch_name": "Chennai Head Office",
            "bus_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 1,
                "rejected": 1
            },
            "bus_status_id": 7,
            "bus_status_name": "REJECTED",
            "cab_count": {
                "booked": 1,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 1
            },
            "cab_status_id": 7,
            "cab_status_name": "REJECTED",
            "claim_status": "DEFAULT",
            "claim_status_id": -1,
            "empbranchgid": 1,
            "empdesignation": "OFFICER",
            "empgid": 25,
            "empgrade": "S3",
            "employee_code": "EMP025",
            "employee_name": "Ste2",
            "enddate": "05-May-2022",
            "enddate_ms": 1651708800000,
            "id": 2493,
            "no_of_cancel_request_pending": 0,
            "opening_balance": 0.0,
            "quantum_of_funds": 0.0,
            "reason": "TRAVEL BUSINESS DOMESTIC",
            "requestdate": "05-May-2022",
            "requestdate_ms": 1651761815000,
            "startdate": "05-May-2022",
            "startdate_ms": 1651708800000,
            "status": 3,
            "status_name": "APPROVED",
            "tour_cancel_status": "DEFAULT",
            "tour_cancel_status_id": -1,
            "tour_status": "APPROVED",
            "tour_status_id": 3,
            "tourid": 880,
            "train_count": {
                "booked": 1,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 1,
                "rejected": 0
            },
            "train_status_id": -2,
            "train_status_name": "IN PROGRESS"
        },
        {
            "accommodation_count": {
                "booked": 1,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 1
            },
            "accomodation_status_id": -2,
            "accomodation_status_name": "IN PROGRESS",
            "air_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 1
            },
            "air_status_id": 7,
            "air_status_name": "REJECTED",
            "appcomment": "",
            "applevel": 3,
            "approvedby": null,
            "approveddate": "05-May-2022",
            "approveddate_ms": 1651751361000,
            "approver_code": null,
            "approver_id": -1,
            "apptype": "TOUR",
            "branch_code": "101",
            "branch_name": "Chennai Head Office",
            "bus_count": {
                "booked": 1,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 1
            },
            "bus_status_id": 3,
            "bus_status_name": "BOOKED",
            "cab_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "cab_status_id": 1,
            "cab_status_name": "NOT APPLICABLE",
            "claim_status": "DEFAULT",
            "claim_status_id": -1,
            "empbranchgid": 1,
            "empdesignation": "OFFICER",
            "empgid": 25,
            "empgrade": "S3",
            "employee_code": "EMP025",
            "employee_name": "Ste2",
            "enddate": "05-May-2022",
            "enddate_ms": 1651708800000,
            "id": 2469,
            "no_of_cancel_request_pending": 0,
            "opening_balance": 0.0,
            "quantum_of_funds": 0.0,
            "reason": "TRAVEL BUSINESS DOMESTIC",
            "requestdate": "05-May-2022",
            "requestdate_ms": 1651751334000,
            "startdate": "05-May-2022",
            "startdate_ms": 1651708800000,
            "status": 3,
            "status_name": "APPROVED",
            "tour_cancel_status": "DEFAULT",
            "tour_cancel_status_id": -1,
            "tour_status": "APPROVED",
            "tour_status_id": 3,
            "tourid": 878,
            "train_count": {
                "booked": 1,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 1
            },
            "train_status_id": -2,
            "train_status_name": "IN PROGRESS"
        },
        {
            "accommodation_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "accomodation_status_id": 1,
            "accomodation_status_name": "NOT APPLICABLE",
            "air_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "air_status_id": 1,
            "air_status_name": "NOT APPLICABLE",
            "appcomment": "",
            "applevel": 3,
            "approvedby": null,
            "approveddate": "05-May-2022",
            "approveddate_ms": 1651747641000,
            "approver_code": null,
            "approver_id": -1,
            "apptype": "TOUR",
            "branch_code": null,
            "branch_name": null,
            "bus_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "bus_status_id": 1,
            "bus_status_name": "NOT APPLICABLE",
            "cab_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 1,
                "rejected": 0
            },
            "cab_status_id": 0,
            "cab_status_name": "NOT BOOKED",
            "claim_status": "DEFAULT",
            "claim_status_id": -1,
            "empbranchgid": 12,
            "empdesignation": "OFFICER",
            "empgid": 25,
            "empgrade": "S3",
            "employee_code": "EMP025",
            "employee_name": "Ste2",
            "enddate": "30-Apr-2022",
            "enddate_ms": 1651276800000,
            "id": 2458,
            "no_of_cancel_request_pending": 0,
            "opening_balance": 0.0,
            "quantum_of_funds": 0.0,
            "reason": "TRAVEL BUSINESS DOMESTIC",
            "requestdate": "30-Apr-2022",
            "requestdate_ms": 1651348903000,
            "startdate": "30-Apr-2022",
            "startdate_ms": 1651276800000,
            "status": 3,
            "status_name": "APPROVED",
            "tour_cancel_status": "DEFAULT",
            "tour_cancel_status_id": -1,
            "tour_status": "APPROVED",
            "tour_status_id": 3,
            "tourid": 858,
            "train_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "train_status_id": 1,
            "train_status_name": "NOT APPLICABLE"
        },
        {
            "accommodation_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "accomodation_status_id": 1,
            "accomodation_status_name": "NOT APPLICABLE",
            "air_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "air_status_id": 1,
            "air_status_name": "NOT APPLICABLE",
            "appcomment": "",
            "applevel": 3,
            "approvedby": null,
            "approveddate": "04-May-2022",
            "approveddate_ms": 1651677329000,
            "approver_code": null,
            "approver_id": -1,
            "apptype": "TOUR",
            "branch_code": "101",
            "branch_name": "Chennai Head Office",
            "bus_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "bus_status_id": 1,
            "bus_status_name": "NOT APPLICABLE",
            "cab_count": {
                "booked": 1,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 1
            },
            "cab_status_id": -2,
            "cab_status_name": "IN PROGRESS",
            "claim_status": "DEFAULT",
            "claim_status_id": -1,
            "empbranchgid": 1,
            "empdesignation": "OFFICER",
            "empgid": 25,
            "empgrade": "S3",
            "employee_code": "EMP025",
            "employee_name": "Ste2",
            "enddate": "04-May-2022",
            "enddate_ms": 1651622400000,
            "id": 2440,
            "no_of_cancel_request_pending": 0,
            "opening_balance": 0.0,
            "quantum_of_funds": 0.0,
            "reason": "TRAVEL BUSINESS DOMESTIC",
            "requestdate": "04-May-2022",
            "requestdate_ms": 1651676830000,
            "startdate": "04-May-2022",
            "startdate_ms": 1651622400000,
            "status": 3,
            "status_name": "APPROVED",
            "tour_cancel_status": "DEFAULT",
            "tour_cancel_status_id": -1,
            "tour_status": "APPROVED",
            "tour_status_id": 3,
            "tourid": 871,
            "train_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "train_status_id": 1,
            "train_status_name": "NOT APPLICABLE"
        },
        {
            "accommodation_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "accomodation_status_id": 1,
            "accomodation_status_name": "NOT APPLICABLE",
            "air_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "air_status_id": 1,
            "air_status_name": "NOT APPLICABLE",
            "appcomment": "",
            "applevel": 3,
            "approvedby": null,
            "approveddate": "02-May-2022",
            "approveddate_ms": 1651497208000,
            "approver_code": null,
            "approver_id": -1,
            "apptype": "TOUR",
            "branch_code": "101",
            "branch_name": "Chennai Head Office",
            "bus_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 1,
                "rejected": 0
            },
            "bus_status_id": 0,
            "bus_status_name": "NOT BOOKED",
            "cab_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "cab_status_id": 1,
            "cab_status_name": "NOT APPLICABLE",
            "claim_status": "DEFAULT",
            "claim_status_id": -1,
            "empbranchgid": 1,
            "empdesignation": "OFFICER",
            "empgid": 2,
            "empgrade": "S3",
            "employee_code": "EMP002",
            "employee_name": "SowMIyA S",
            "enddate": "20-Jul-2022",
            "enddate_ms": 1658275200000,
            "id": 2407,
            "no_of_cancel_request_pending": 0,
            "opening_balance": 0.0,
            "quantum_of_funds": 0.0,
            "reason": "TRAVEL BUSINESS DOMESTIC",
            "requestdate": "02-May-2022",
            "requestdate_ms": 1651496318000,
            "startdate": "20-Jul-2022",
            "startdate_ms": 1658275200000,
            "status": 3,
            "status_name": "APPROVED",
            "tour_cancel_status": "DEFAULT",
            "tour_cancel_status_id": -1,
            "tour_status": "APPROVED",
            "tour_status_id": 3,
            "tourid": 861,
            "train_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "train_status_id": 1,
            "train_status_name": "NOT APPLICABLE"
        },
        {
            "accommodation_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "accomodation_status_id": 1,
            "accomodation_status_name": "NOT APPLICABLE",
            "air_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "air_status_id": 1,
            "air_status_name": "NOT APPLICABLE",
            "appcomment": "",
            "applevel": 3,
            "approvedby": null,
            "approveddate": "30-Apr-2022",
            "approveddate_ms": 1651335533000,
            "approver_code": null,
            "approver_id": -1,
            "apptype": "TOUR",
            "branch_code": "101",
            "branch_name": "Chennai Head Office",
            "bus_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 1,
                "rejected": 0
            },
            "bus_status_id": 0,
            "bus_status_name": "NOT BOOKED",
            "cab_count": {
                "booked": 1,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "cab_status_id": 3,
            "cab_status_name": "BOOKED",
            "claim_status": "DEFAULT",
            "claim_status_id": -1,
            "empbranchgid": 1,
            "empdesignation": "OFFICER",
            "empgid": 7,
            "empgrade": null,
            "employee_code": "EMP007",
            "employee_name": "monesh",
            "enddate": "30-Apr-2022",
            "enddate_ms": 1651276800000,
            "id": 2388,
            "no_of_cancel_request_pending": 0,
            "opening_balance": 0.0,
            "quantum_of_funds": 0.0,
            "reason": "TRAVEL BUSINESS DOMESTIC",
            "requestdate": "30-Apr-2022",
            "requestdate_ms": 1651334724000,
            "startdate": "30-Apr-2022",
            "startdate_ms": 1651276800000,
            "status": 3,
            "status_name": "APPROVED",
            "tour_cancel_status": "DEFAULT",
            "tour_cancel_status_id": -1,
            "tour_status": "APPROVED",
            "tour_status_id": 3,
            "tourid": 856,
            "train_count": {
                "booked": 0,
                "cancel requested": 0,
                "cancelled": 0,
                "not booked": 0,
                "rejected": 0
            },
            "train_status_id": 1,
            "train_status_name": "NOT APPLICABLE"
        }
    ];

  constructor(private  taService:TaService,private sharedService:SharedService,private datePipe: DatePipe,private route: ActivatedRoute,
    private router: Router,private shareservice:ShareService,private fb:FormBuilder,
    private SpinnerService :NgxSpinnerService) { }
  
  ngOnInit(): void {
    const heroId = this.route.snapshot.paramMap.get('id');
    // this.toursearch={
    //   requestno :'',
    //   requestdate:''   
    let travel_status=this.shareservice.statusvalue.value;
    this.booktype = this.shareservice.booking.value;
    let tourno = this.shareservice.tourno.value;
    let request_date= this.shareservice.requestdate.value;
    let reqsts = this.shareservice.booking_sts.value
    let branchid = this.shareservice.branchid.value;
    let employee  = this.shareservice.employee.value;
    let reference_no = this.shareservice.reference_no.value;
    console.log("VALUESSSs",reference_no)
    this.send_value = ''
    request_date = this.datePipe.transform(request_date,"dd-MMM-yyyy");
    if (tourno){
      this.send_value = this.send_value+"&tour_no="+tourno
    }
    if (tourno && request_date){
      console.log(request_date)
      this.send_value = this.send_value+"&request_date="+request_date
    }
    else if(request_date){
      this.send_value = "&request_date="+request_date
    }
    if (reqsts != ""){
      this.send_value = this.send_value+"&booking_status="+reqsts
    }
    if (branchid){
      this.send_value = this.send_value+"&branch_id="+branchid
    }
    if(employee != '' && employee != null){
      this.send_value = this.send_value+"&makerid="+employee
    }
    if (reference_no){
      this.send_value = this.send_value+"&reference_no="+reference_no
    }
    this.send_value = `&type=${travel_status}${this.send_value}`
    console.log(tourno);
    console.log(request_date);
    this.tourApprovalSearchForm = this.fb.group({
      tourno:[''],
      requestdate:[''],
      
    })
    this.getapprovesumm(this.send_value,1);
    this.getstatusvalue();
  }
  getstatus(value){
  this.status = value
  console.log("this.status",this.status)
  }
  
  getstatusvalue(){
    // this.taService.getstatus()
    // .subscribe(res=>{
    //   this.statusList=res
    //   console.log("statusList",this.statusList)
    // })
  }

  

  tourview(data){
    this.data = {
      id:data['tourid'],
      status:data['status'],
      approverid:data['id'],
      approvedby_id:data['approver_id'],
      applevel:data['applevel'],
      employee_name:data['employee_name'],
      employee_code:data['employee_code'],
      empgrade:data['empgrade'],
      empdesignation:data['empdesignation'],
      empgid:data['empgid'],
      apptype:data['apptype'],
      branch_code:data['branch_code'],
      branch_name:data['branch_name'],

    }
    var datas = JSON.stringify(Object.assign({}, this.data));
      localStorage.setItem('tourmakersummary',datas)
    // this.sharedService.summaryData.next(this.data)
   
    this.router.navigateByUrl('ta/touradmin');
  }
  searchClick(){
    
  }
  clearclick(){
    this.toursearch.requestno ='',
    this.toursearch.requestdate='' 
    this.toursearch.status='' 

  }


  
// tour maker summary

getapprovesumm(val,
  pageNumber) {
  this.SpinnerService.show();
  this.taService.getTourAdminSummary(pageNumber,val,this.booktype)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.gettourapproveList = datas;
      let datapagination = results["pagination"];
      this.gettourapproveList = datas;
      if (this.gettourapproveList.length === 0) {
        this.isTourChecker = false
      }
      if (this.gettourapproveList.length > 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.currentpage = datapagination.index;
        this.isTourChecker = true
      }
      this.SpinnerService.hide()
    })
   

}

TourapprovenextClick() {
  if (this.has_next === true) {
    this.getapprovesumm(this.send_value,this.currentpage + 1)
  }
}

TourapprovepreviousClick() {
  if (this.has_previous === true) {
    this.getapprovesumm(this.send_value,this.currentpage - 1)
  }


}




  send_value:String=""
  tourApproverSearch(){
    let form_value = this.tourApprovalSearchForm.value;

    if(form_value.tourno != "")
    {
      this.send_value=this.send_value+"&tour_no="+form_value.tourno
    }
    if(form_value.requestdate != "")
    {
      let date=this.datePipe.transform(form_value.requestdate,"dd-MMM-yyyy");
      this.send_value=this.send_value+"&request_date="+date
    }

    this.getapprovesumm(this.send_value,this.currentpage)

  }


  reset(){
    this.send_value=""
    this.tourApprovalSearchForm = this.fb.group({ 
      tourno:[''],
      requestdate:[''],
      
    })
    this.getapprovesumm(this.send_value,this.currentpage)
  }


  onStatusChange(e) {
    let status_name:any  = e
    if(status_name=="APPROVED"){
      this.statusId= 3
    }
    if(status_name=="PENDING"){
      this.statusId= 2
    }
    if(status_name=="REJECTED"){
      this.statusId= 4
    }
    if(status_name=="RETURN"){
      this.statusId= 5
    }
    if(status_name=="FORWARD"){
      this.statusId= 6
    }

    this.getapprovesumm(this.send_value,this.currentpage)
  }
}
