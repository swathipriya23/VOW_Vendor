import { Component, OnInit } from '@angular/core';
import {TaService} from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import {ActivatedRoute, Router} from "@angular/router";
import {ShareService} from '../share.service'
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import {AfterViewInit,  ElementRef,  ViewChild} from '@angular/core';
import {merge, fromEvent, Observable} from "rxjs";
import { DataService } from '../../service/data.service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import {map, startWith, finalize, switchMap, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent,  MatAutocomplete} from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-tamaker-summary',
  templateUrl: './tamaker-summary.component.html',
  styleUrls: ['./tamaker-summary.component.scss']
})
export class TamakerSummaryComponent implements OnInit {
  istaAddForm:boolean
  isTA:boolean
  istaViewForm:boolean
  istaapprove:boolean
  istaadvancemaker:boolean
  istaadvanceForm:boolean
  istaadvanceeditForm:boolean
  isadvanceapprove:boolean
  isadvanceviewForm:boolean
  isexpencemaker:boolean
  isexpenceviewForm:boolean
  isexpenceapprover:boolean
  isexpenceapproveviewForm:boolean
  istaEditForm:boolean
  getTourmakerList:any
  has_next = true;
  has_previous = true;
  toursummarypage:number=1;
  pagesize = 10;
  touradvancesummarypage:number=1;
  getTouradvanceList:any
  gettourapproveList:any
  tourapprovesummarypage:number=1;
  getTouradvanceapproveList:any
  touradvanceappsummarypage:number=1;
  landlordViewId:any
  overallre:any
  summ:any
  toursearch:any
  taSearchForm : FormGroup;
  data:any
  tourmaker = '/tourmaker'
  onbehalfname:any
  onbehalfempid=0
  getTourmakeronbehalfList:any
  datas:any;
  
  constructor(private taService:TaService,private sharedService:SharedService,
    private route: ActivatedRoute,private shareservice:ShareService,
    private router: Router 
    )  { }

  ngOnInit(): void {
    
    this.datas = this.shareservice.fetchData.value;
    this.onbehalfname=this.datas.employee_name
    this.onbehalfempid=this.datas.employeegid
    
    if(this.datas.employee_name !=""){
      this.getonbehalfdata();
    }
    else{
        this.taService.getTourmakerSummary()
        .subscribe((results: any[]) => {
       
        let datas = results['data'];
        this.getTourmakerList = datas;
        let overall=datas;
        // this.tashareservice.TourMakerEditId.next(datas)
        // console.log("overal",datas);
    })
  }
    const heroId = this.route.snapshot.paramMap.get('id');

    
    this.toursearch={
      requestno :'',
      requestdate:''   
    };

   
  }
  getonbehalfdata(){
  // this.taService.getTourmakeronbehalfSummary(this.onbehalfempid)
  //   .subscribe((results: any[]) => {
  //   console.log("Tourmakeronbehalf", results)
  //   let datas = results['data'];
  //   this.getTourmakerList= datas;
    
// })
}
  TourmakernextClick() {
    // if (this.has_next === true) {
    //   // this.currentpage= this.presentpage + 1
    //   this.gettourmakersumm(this.toursummarypage + 1, 10)
    // }
  }

  TourmakerpreviousClick() {
    // if (this.has_previous === true) {
    //   // this.currentpage= this.presentpage - 1
    //   this.gettourmakersumm(this.toursummarypage - 1, 10)
    // }
  }
  tourEdit(data){
  
    this.sharedService.summaryData.next(data)
    this.router.navigateByUrl('ta/tourmaker');
  }

  createtour(){
    this.data = {id:0}
    this.sharedService.summaryData.next(this.data)
    this.router.navigateByUrl('ta/tourmaker');
  }
  searchClick(){

  }
  clearclick(){
    this.toursearch.requestno='',
    this.toursearch.requestdate=''
  }

}