import { Component, ComponentFactoryResolver, OnInit, QueryList, ViewChildren,ViewChild,ViewContainerRef} from '@angular/core';
import {ShareService} from '../share.service';
import {TourmakerSummaryComponent} from '../tourmaker-summary/tourmaker-summary.component'
import { TourReportComponent } from '../tour-report/tour-report.component'
import { EmployeeTourReportComponent } from '../employee-tour-report/employee-tour-report.component'
import { EclaimBillConsolidateComponent } from '../eclaim-bill-consolidate/eclaim-bill-consolidate.component'
import { BranchwisePendingReportComponent } from '../branchwise-pending-report/branchwise-pending-report.component'

import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-ta-report',
  templateUrl: './ta-report.component.html',
  styleUrls: ['./ta-report.component.scss']
})
export class TaReportComponent implements OnInit {

  istourreports:boolean
  istourreport:boolean
  isbranchwisereport:boolean
  isemployeereport:boolean
  istaconsolidate:boolean


  vendorMasterList = [
    { name: "Tour Report", index: 1, component: TourReportComponent },
    { name: "Branch Wise Pending", index: 2, component: EmployeeTourReportComponent },
    { name: "Employee Report", index: 3, component: EclaimBillConsolidateComponent },
    { name: "TA Consolidate", index: 4, component: BranchwisePendingReportComponent },
  ];

  activeItem: string;
  activeComponent: any;
  tabs=[];  

  constructor(private componentFactoryResolver: ComponentFactoryResolver,public sharedService:ShareService,public SharedService:SharedService) { }

  ngOnInit(): void {
    let data =this.SharedService.summaryData.value;
    this.subModuleData(data)
  }

  subModuleData(data) {
    
    if(data.index == 1){
     
      this.istourreport=true
      this.isbranchwisereport=false
      this.isemployeereport=false
      this.istaconsolidate=false
      
    }
    if(data.index == 2){
     
      this.istourreport=false
      this.isbranchwisereport=true
      this.isemployeereport=false
      this.istaconsolidate=false
      
    }
    if(data.index == 3){
      
      this.istourreport=false
      this.isbranchwisereport=false
      this.isemployeereport=true
      this.istaconsolidate=false
      
    }
    if(data.index == 4){
    
      this.istourreport=false
      this.isbranchwisereport=false
      this.isemployeereport=false
      this.istaconsolidate=true
      
    }
    this.sharedService.report.next(data)
    return data;
  }

}
