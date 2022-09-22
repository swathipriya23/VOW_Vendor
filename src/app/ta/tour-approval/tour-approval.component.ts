import { Component, OnInit } from '@angular/core';
import {TaService} from "../ta.service";

@Component({
  selector: 'app-tour-approval',
  templateUrl: './tour-approval.component.html',
  styleUrls: ['./tour-approval.component.scss']
})
export class TourApprovalComponent implements OnInit {
  getViewadvanceList:any
  has_next=true;
  has_previous=true;
  viewadvancesummarypage:number=1;
  pageSize=10;
  pagesize=10;


  constructor(private taService:TaService) { }

  ngOnInit(): void {

  }
  getviewadvancesumm(pageNumber = 1, pageSize = 10) {
    this.taService.getViewadvancesummary(pageNumber , pageSize)
    .subscribe(result => {
    console.log("Tourmaker", result)
    let datas = result['data'];
    this.getViewadvanceList = datas;
    let datapagination = result["pagination"];
    this.getViewadvanceList = datas;
    if (this.getViewadvanceList.length >= 0) {
    this.has_next = datapagination.has_next;
    this.has_previous = datapagination.has_previous;
    this.viewadvancesummarypage = datapagination.index;
    }
    })
    }
    viewadvancenextClick() {
      if (this.has_next === true) {
        // this.currentpage= this.presentpage + 1
        this.getviewadvancesumm(this.viewadvancesummarypage + 1, 10)
      }
    }
  
    viewadvancepreviousClick() {
      if (this.has_previous === true) {
        // this.currentpage= this.presentpage - 1
        this.getviewadvancesumm(this.viewadvancesummarypage - 1, 10)
      }
    } 
 

}
