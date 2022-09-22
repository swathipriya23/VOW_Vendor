import { Component, OnInit, Inject } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { faservice } from '../fa.service';

@Component({
  selector: 'app-valuereduction-add',
  templateUrl: './valuereduction-add.component.html',
  styleUrls: ['./valuereduction-add.component.scss']
})
export class ValuereductionAddComponent implements OnInit {
  assetcatlist: Array<any>


  has_next = true;
  has_previous = true;
  isvalmakeradd: boolean;
  ismakerCheckerButton: boolean;
  // ischeck:boolean=false;
  // has_nexti = true;
  // has_previousimp = true;
  presentpage: number = 1;

  checkedValues: boolean[]


  pageSize = 10;

  constructor(private notification: NotificationService, private router: Router
    , private Faservice: faservice, ) { }

  ngOnInit(): void {
    this.getassetcategorysummary();

  }


  getassetcategorysummary(pageNumber = 1, pageSize = 10) {
    this.Faservice.getassetcategorysummary(pageNumber, pageSize)
      .subscribe((result) => {
        console.log("landlord", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.assetcatlist = datass;
        this.checkedValues = this.assetcatlist.map(() => false);
        console.log("landlord", this.assetcatlist)
        if (this.assetcatlist.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }

      })

  }



  get ischeck() {
    return this.checkedValues.some(b => b);
  }





  nextClick() {

    if (this.has_next === true) {

      this.getassetcategorysummary(this.presentpage + 1, 10)

    }
  }

  previousClick() {

    if (this.has_previous === true) {

      this.getassetcategorysummary(this.presentpage - 1, 10)

    }
  }


  trade = [
    { label: ' Check', selected: false },

  ];

  allTrades(event) {
    const checked = event.target.checked;
    this.trade.forEach(item => item.selected = checked);
  }





}


