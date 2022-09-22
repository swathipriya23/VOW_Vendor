import { Component, OnInit } from '@angular/core';
import{FormControl,FormGroup,FormBuilder,Validators,FormArray} from '@angular/forms';
import {isBoolean} from 'util';
// import { formatDate } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import {TaService} from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-expence-view',
  templateUrl: './expence-view.component.html',
  styleUrls: ['./expence-view.component.scss']
})
export class ExpenceViewComponent implements OnInit {
  gettourexpenseList:any
  has_next=true;
  has_previous=true;
  gettourapproveList:any
  tourexpensepage:number=1;
  pagesize=10;
  data:any;
  toursearch:any;
  latest:any
  id:any
  expense:any

  constructor(private formBuilder: FormBuilder,private datePipe: DatePipe,private http: HttpClient,
    private taService:TaService) { }

  ngOnInit(): void {
    this.expense={
      bank:'',
      approval:'',
      comments:''
    }
     
       
  }
  
  getapprovesumm(pageNumber = 1, pageSize = 10) {
    this.taService.getclaimrequestsummary(this.id)
    .subscribe(result => {
      console.log("Tourapprover", result)
      let datas = result['data'];
      this.gettourexpenseList = datas;
      let datapagination = result["pagination"];
      this.gettourexpenseList = datas;
      if (this.gettourexpenseList.length >= 0) {
      this.has_next = datapagination.has_next;
      this.has_previous = datapagination.has_previous;
      this.tourexpensepage = datapagination.index;
      }
    })
  }
  TourexpensenextClick() {
    if (this.has_next === true) {
      this.getapprovesumm(this.tourexpensepage + 1, 10)
    }
  }
  
  TourexpensepreviousClick() {
    if (this.has_previous === true) {
      this.getapprovesumm(this.tourexpensepage - 1, 10)
    }
  }
}
