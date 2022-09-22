import { Component, OnInit, Inject } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { faservice } from '../fa.service';

@Component({
  selector: 'app-transfermaker-add',
  templateUrl: './transfermaker-add.component.html',
  styleUrls: ['./transfermaker-add.component.scss']
})
export class TransfermakerAddComponent implements OnInit {
  assetcatlist: Array<any>


  has_next = true;
  has_previous = true;
  isimpmakeradd: boolean;
  ismakerCheckerButton: boolean;
  // ischeck:boolean=false;
  has_nexttra = true;
  has_previoustra = true;
  presentpagetra: number = 1;

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
          this.has_nexttra = datapagination.has_next;
          this.has_previoustra = datapagination.has_previous;
          this.presentpagetra = datapagination.index;
        }

      })

  }



  get ischeck() {
    return this.checkedValues.some(b => b);
  }





  nextClick() {

    if (this.has_nexttra === true) {

      this.getassetcategorysummary(this.presentpagetra + 1, 10)

    }
  }

  previousClick() {

    if (this.has_previoustra === true) {

      this.getassetcategorysummary(this.presentpagetra - 1, 10)

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
