import { Component, OnInit, } from '@angular/core';
import {MatDialog,MatDialogConfig} from '@angular/material/dialog';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import {TaService} from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  selector: 'app-onbehalf-summary',
  templateUrl: './onbehalf-summary.component.html',
  styleUrls: ['./onbehalf-summary.component.scss']
})
export class OnbehalfSummaryComponent implements OnInit {
  onBehalfList:any
  onbehalfemployeeList:any
  onBehalf:any
  has_next=true;
  has_previous=true;
  gettourapproveList:any
  onbehalfsummry:number=1;
  onbehalfsummrypopup:number=1;
  pagesize=10;

  constructor(private  taService:TaService,private sharedService:SharedService,private datePipe: DatePipe,private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.onBehalf={
      branch:'',
      employee:''
    }
    this.getonBehalfsumm();
  }
  getonBehalfsumm(pageNumber = 1, pageSize = 10) {
    this.taService.getonBehalfSummary(pageNumber , pageSize)
    .subscribe(result => {
      console.log("onBehalf", result)
      let datas = result['data'];
      this.onBehalfList = datas;
      let datapagination = result["pagination"];
      this.onBehalfList = datas;
      if (this.onBehalfList.length >= 0) {
      this.has_next = datapagination.has_next;
      this.has_previous = datapagination.has_previous;
      this.onbehalfsummry = datapagination.index;
      }
    })
  }
  getonBehalfpopup(pageNumber = 1, pageSize = 10) {
    this.taService.getonBehalfpopup(pageNumber , pageSize)
    .subscribe(result => {
      console.log("onBehalfpopup", result)
      let datas = result['data'];
      this.onbehalfemployeeList = datas;
      let datapagination = result["pagination"];
      this.onbehalfemployeeList = datas;
      if (this.onbehalfemployeeList.length >= 0) {
      this.has_next = datapagination.has_next;
      this.has_previous = datapagination.has_previous;
      this.onbehalfsummrypopup = datapagination.index;
      }
    })
  }
}
