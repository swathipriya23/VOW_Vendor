import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {  SharedService} from 'src/app/service/shared.service'
​
const isSkipLocationChange = environment.isSkipLocationChange

export interface subcatListss {
  name: string;
  id: number;
}
@Component({
  selector: 'app-report-master',
  templateUrl: './report-master.component.html',
  styleUrls: ['./report-master.component.scss']
})
export class ReportMasterComponent implements OnInit {
  listicons:any={119:"fa fa-newspaper-o",120:"fa fa-chain-broken",154:"fa fa-creative-commons",141:"fa fa-calendar",
    163:"fa fa-newspaper-o",170:"fa fa-pencil-square-o",159:"fa fa-cc-diners-club",160:"fa fa-cc-diners-club",140:"fa fa-calendar",
    174:"fa fa-columns",145:"fa fa-compress",173:'fa fa-code-fork',164:"fa fa-calendar-check-o",171:"fa fa-pencil-square-o",
    172:"fa fa-fire",165:"fa fa-quora",166:"fa fa-pie-chart",167:"fa fa-cog",168:"fa fa-gg",169:"fa fa-balance-scale",
    157:"fa fa-cog",161:"fa fa-users",162:"fa fa-users",158:"fa fa-quora",179:"fa fa-columns",143:"fa fa-balance-scale",142:"fa fa-random",144:"fa fa-snowflake-o",
    146:"fa fa-cc-diners-club",178:"fa fa-fire",185:'fa fa-code-fork'//"fa fa-check-square"
  };
  ​menugrid:any;

  constructor(private router: Router, private apcser:SharedService) { }

  ngOnInit(): void {
    let data: any = this.apcser.submodulesreport.value;
    console.log('fghgi',this.apcser.submodulesreport.value)
    this.menugrid=data
    console.log(this.menugrid)
  }
}
