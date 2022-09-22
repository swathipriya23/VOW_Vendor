import { Component, ViewChild, ElementRef } from '@angular/core';
import { OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';

import { DataService } from '../service/data.service'
import { SharedService } from '../service/shared.service'
import { ThrowStmt } from '@angular/compiler';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  public currentlyClickedCardIndex: number = 0;
  transactionUrl: any;

  constructor(private dataService: DataService, public sharedService: SharedService, private router: Router) { }
  ngOnInit() {
    let currentUrl = window.location.href;
    let tmpVar = currentUrl.includes('/about');
    if (currentUrl.includes('/about')) {
      window.onpopstate = function (event) {
        history.go(1);
      }
    }

    this.getMenuUrl()

  }


  private getMenuUrl() {
    // console.log('getMenuUrl1')
    this.sharedService.menuUrlData = [];
    this.dataService.getMenuUrl(this.sharedService.portal_id)
      .subscribe((results: any[]) => {
        let data = results['data'];
        if (data) {
          this.sharedService.titleUrl = data[0].url;
          this.sharedService.menuUrlData = data;
          // console.log("this.sharedService.isSideNav2",this.sharedService.isSideNav);
          // this.menurlList = this.sharedService.menuUrlData;
          // this.titleUrls = this.sharedService.titleUrl;
          //this.router.navigateByUrl(this.titleUrls, { skipLocationChange: false });
          this.sharedService.transactionList = [];
          this.sharedService.masterList = [];
          this.sharedService.menuUrlData.forEach(element => {
            if (element.type === "transaction") {
              this.sharedService.transactionList.push(element);
            } else if (element.type === "master") {
              this.sharedService.masterList.push(element);
            }
          })
          // this.currentlyClickedCardIndex=0;
          let datas = this.sharedService.transactionList;
          this.transactionUrl = datas[this.currentlyClickedCardIndex].url
          this.sharedService.MyModuleName = datas[this.currentlyClickedCardIndex].name;
          // this.router.navigateByUrl(this.transactionUrl, { skipLocationChange: isSkipLocationChange });
          // this.isTransactionList = true;
          // this.isMasterList = false;
          // this.headerName = '';

          let modrow = this.transactionUrl
          // Navigation for return URL
          let returnurl = JSON.parse(localStorage.getItem('returnURL'))
          if (returnurl) {
            this.router.navigateByUrl(returnurl);
            localStorage.removeItem("returnURL");
            return true;
          }
          // Navigation for return URL
          if (modrow === "/memosummary") {
            console.log("call1")
            this.router.navigate(['ememo', 'memosummary']);
            return true;
          }
          if (modrow === "/rems") {
            this.router.navigate(['rems/rems']);
            return true;
          }
          if (modrow === "/rcn") {
            this.router.navigate(['prpo/rcn']);
            return true;
          }
          if (modrow === "/bpa") {
            this.router.navigate(['prpo/bpa']);
            return true;
          }
          if (modrow === "/pca") {
            this.router.navigate(['prpo/pca']);
            return true;
          }
          if (modrow === "/pr") {
            this.router.navigate(['prpo/pr']);
            return true;
          }
          if (modrow === "/po") {
            this.router.navigate(['prpo/po']);
            return true;
          }
          if (modrow === "/grn") {
            this.router.navigate(['prpo/grn']);
            return true;
          }
          if (modrow === "/procurementmaster") {
            this.router.navigate(['prpo/procurementmaster']);
            return true;
          }
          if (modrow === "/vendor") {
            this.router.navigate(['atma/vendorView']);
            return true;
          }
          if (modrow === "/vendormaster") {
            this.router.navigate(['atma/vendormaster']);
            return true;
          }
          if (modrow === "/usersummary") {
            this.router.navigate(['usercreation/usersummary']);
            return true;
          }
          if (modrow === "/master") {
            this.router.navigate(['master/master']);
            return true;
          }
          if (modrow === "/pprreport") {
            this.router.navigate(['ppr/pprreport']);
            return true;
          }
          if (modrow === "/inwardSummary") {
            this.router.navigate(['inwardd/inwardSummary']);
            return true;
          }
          if (modrow === "/inwardMaster") {
            this.router.navigate(['inward/inwardMaster']);
            return true;
          }
          if (modrow === "/inward") {
            this.router.navigate(['inward/inward']);
            return true;
          }
          if (modrow === "/securityguard") {
            this.router.navigate(['SGmodule/securityguardpayment']);
            return true;
          }
          if (modrow === "/securityguardmaster") {
            this.router.navigate(['SGmodule/sgmaster']);
            return true;
          }
          if (modrow === "/fa") {
            //console.log(modrow.submodule);
            this.sharedService.submodulesfa.next(datas[0].submodule);
            this.router.navigate(['fa/fa']);
            return true;
          }
          if (modrow === "/ta_summary") {
            this.router.navigate(['ta/ta_summary']);
            return true;
          }
          if (modrow === "/tamaster") {
            this.router.navigate(['ta/ta_master']);
            return true;
          }
          if (modrow === "/documentation") {
            this.router.navigate(['documentation/documentation']);
            return true;
          }
          if (modrow === "/los") {
            this.router.navigate(['dtpc/los']);
            return true;
          }
          if (modrow === "/ecf") {
            this.router.navigate(['ECF/ecf']);
            return true;
          }

          this.openNav();
        }
      });


  }

  openNav() {
    if (this.sharedService.isSideNav) {
      document.getElementById("mySidenav").style.width = "200px";
      document.getElementById("main").style.marginLeft = "12rem";
      this.sharedService.isSideNav = false;
    }
  }
}