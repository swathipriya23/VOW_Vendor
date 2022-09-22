import { Component, ComponentFactoryResolver, OnInit, QueryList, ViewChildren,ViewChild,ViewContainerRef} from '@angular/core';
import {ShareService} from '../share.service';
import { SharedService } from 'src/app/service/shared.service';
import {AssignApproverComponent}from'../assign-approver/assign-approver.component';
import { HolidaydiemSummaryComponent } from '../holidaydiem-summary/holidaydiem-summary.component';
import { GradeeligibilityMasterComponent } from '../gradeeligibility-master/gradeeligibility-master.component'
import { CommondropdownMasterComponent } from '../commondropdown-master/commondropdown-master.component'
import { DateRelaxationMasterComponent } from '../date-relaxation-master/date-relaxation-master.component'
import { OnbehalfSummaryComponent } from '../onbehalf-summary/onbehalf-summary.component';
import { OnbehalfMasterComponent } from '../onbehalf-master/onbehalf-master.component';
import { ClaimAllowanceMasterComponent } from '../claim-allowance-master/claim-allowance-master.component';
import { MasterComponent } from 'src/app/Master/master/master.component';
import { CityMasterComponent } from '../city-master/city-master.component';
//Holiday Master Code Starts 13-May-22
import { HolidaymasterComponent } from '../holidaymaster/holidaymaster.component';
import { TravelreasonexpenseComponent } from '../travelreasonexpense/travelreasonexpense.component';

//Holiday Master Code Ends 13-May-22
@Component({
  selector: 'app-ta-master',
  templateUrl: './ta-master.component.html',
  styleUrls: ['./ta-master.component.scss']
})
export class TaMasterComponent implements OnInit {

  isassignaprover:boolean
  isholidaydeim:boolean
  isgradeeligible:boolean
  iscommondropdown:boolean
  isdaterelaxation:boolean
  isonbehalf:boolean
  isclaimallowance:boolean

  // vendorMasterList = [];
  vendorMasterList = [
  // {name: "Holiday Deim",index:2,component:HolidaydiemSummaryComponent},
     // {name: "Grade Eligibility",index:3,component:GradeeligibilityMasterComponent},
      {name: "Common Dropdown",index:4,component:CommondropdownMasterComponent},
    //  {name: "Date Relaxation",index:5,component:DateRelaxationMasterComponent},
     {name: "Onbehalf Of",index:6,component:OnbehalfMasterComponent},
     {name: 'Claim Allowance',index:7,component:ClaimAllowanceMasterComponent},
     {name:'City Master',index:8,component:CityMasterComponent},
     //Holiday Master Code Starts 13-May-22
     {name:'Holiday Master', index:10,Component: HolidaymasterComponent},
     //Holiday Master Code Ends 13-May-22
     //Travel Reason Expense Starts 18-May-22
     {name:'Travel Reason', index:11, Component: TravelreasonexpenseComponent}
     //Travel Reson Expense Ends 18-May-22
  ];

  activeItem: string;
  activeComponent: any;
  tabs=[];  
  citymaster: boolean;
  //Holiday Master Code Starts 13-May-22
  holidaymaster : boolean;
  //Holiday Master Code Ends 13-May-22
  travelreasonexpense: boolean;


  constructor(private componentFactoryResolver: ComponentFactoryResolver,public sharedService:ShareService,public SharedService:SharedService)
  {
  }
  ngOnInit(): void {
    let data =this.SharedService.summaryData.value;
   
    this.subModuleData(data)
  } ///endof ngOnInit

  subModuleData(data) {

    this.sharedService.TourMakerEditId.next(data)
    // return data;
    
    if(data.index=== 1){
    this.citymaster=false

      this.isassignaprover=true
      this.isholidaydeim=false 
      this.isgradeeligible=false
      this.iscommondropdown=false
      this.isdaterelaxation=false
      this.isonbehalf=false
      this.isclaimallowance=false
      //Holiday Master Code Starts 13-May-22
      this.holidaymaster = false
      //Holiday Master Code Starts 13-May-22
      this.travelreasonexpense = false
     
    }
    if(data.index=== 2){
    this.citymaster=false

      this.isassignaprover=false
      this.isholidaydeim=true 
      this.isgradeeligible=false
      this.iscommondropdown=false
      this.isdaterelaxation=false
      this.isonbehalf=false
      this.isclaimallowance=false
      //Holiday Master Code Starts 13-May-22
      this.holidaymaster = false
      //Holiday Master Code Starts 13-May-22
      this.travelreasonexpense = false
     
    }
    if(data.index=== 3){
    this.citymaster=false

      this.isassignaprover=false
      this.isholidaydeim=false
      this.isgradeeligible=true
      this.iscommondropdown=false
      this.isdaterelaxation=false
      this.isonbehalf=false
      this.isclaimallowance=false
      //Holiday Master Code Starts 13-May-22
      this.holidaymaster = false
      //Holiday Master Code Starts 13-May-22
      this.travelreasonexpense = false
     
    }
    if(data.index=== 4){
    this.citymaster=false

      this.isassignaprover=false
      this.isholidaydeim=false
      this.isgradeeligible=false
      this.iscommondropdown=true
      this.isonbehalf=false
      this.isdaterelaxation=false
      this.isclaimallowance=false
      //Holiday Master Code Starts 13-May-22
      this.holidaymaster = false
      //Holiday Master Code Starts 13-May-22
      this.travelreasonexpense = false
         }
    if(data.index=== 5){
    this.citymaster=false

      this.isassignaprover=false
      this.isholidaydeim=false
      this.isgradeeligible=false
      this.iscommondropdown=false
      this.isdaterelaxation=true
      this.isonbehalf=false
      this.isclaimallowance=false
      //Holiday Master Code Starts 13-May-22
      this.holidaymaster = false
      //Holiday Master Code Starts 13-May-22
      this.travelreasonexpense = false
      
    }
   
   if(data.index == 9){
     
      this.isassignaprover=true

    }
   if(data.index == 6 ){
    this.citymaster=false

    this.isonbehalf=true
    this.isassignaprover=false
    this.isholidaydeim=false
    this.isgradeeligible=false
    this.iscommondropdown=false
    this.isdaterelaxation=false
    this.isclaimallowance=false
    //Holiday Master Code Starts 13-May-22
    this.holidaymaster = false
    //Holiday Master Code Starts 13-May-22
    this.travelreasonexpense = false
       }
   if(data.index == 7){
    this.citymaster=false

    this.isonbehalf=false
    this.isassignaprover=false
    this.isholidaydeim=false
    this.isgradeeligible=false
    this.iscommondropdown=false
    this.isdaterelaxation=false
    this.isclaimallowance=true
    //Holiday Master Code Starts 13-May-22
    this.holidaymaster = false
    //Holiday Master Code Starts 13-May-22
    this.travelreasonexpense = false
      }
   if(data.index == 8){
    this.isonbehalf=false
    this.isassignaprover=false
    this.isholidaydeim=false
    this.isgradeeligible=false
    this.iscommondropdown=false
    this.isdaterelaxation=false
    this.isclaimallowance=false
    this.citymaster=true
    //Holiday Master Code Starts 13-May-22
    this.holidaymaster = false
    //Holiday Master Code Starts 13-May-22
    this.travelreasonexpense = false
    
   }
   if(data.index == 10){
    this.isonbehalf=false
    this.isassignaprover=false
    this.isholidaydeim=false
    this.isgradeeligible=false
    this.iscommondropdown=false
    this.isdaterelaxation=false
    this.isclaimallowance=false
    this.citymaster=false
    //Holiday Master Code Starts 13-May-22
    this.holidaymaster = true
    //Holiday Master Code Starts 13-May-22
    this.travelreasonexpense = false
    
   }
   if(data.index == 11){
    this.isonbehalf=false
    this.isassignaprover=false
    this.isholidaydeim=false
    this.isgradeeligible=false
    this.iscommondropdown=false
    this.isdaterelaxation=false
    this.isclaimallowance=false
    this.citymaster=false
    //Holiday Master Code Starts 13-May-22
    this.holidaymaster = false
    //Holiday Master Code Starts 13-May-22
    this.travelreasonexpense = true
     
   }
   /*if(data.index == 12){
    this.isonbehalf=false
    this.isassignaprover=false
    this.isholidaydeim=false
    this.isgradeeligible=false
    this.iscommondropdown=false
    this.isdaterelaxation=false
    this.isclaimallowance=false
    this.citymaster=false
    //Holiday Master Code Starts 13-May-22
    this.holidaymaster = false
    //Holiday Master Code Starts 13-May-22
    this.travelreasonexpense = false
    this.travelexpense = true
  
   }*/
   
  }

}