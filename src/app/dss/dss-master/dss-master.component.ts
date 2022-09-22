import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dss-master',
  templateUrl: './dss-master.component.html',
  styleUrls: ['./dss-master.component.scss']
})
export class DssMasterComponent implements OnInit {
  nameroutertab: any;
  labelnames=['Source','Head Group','Sub Group','GL-Sub Group']
  numberofind: Number=0;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  routerchange(e){
   this.numberofind=e
 }
  source(e){
    this.router.navigate(['/dssreport']);
  }
}
