import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
@Component({
  selector: 'app-branchtaxtab',
  templateUrl: './branchtaxtab.component.html',
  styleUrls: ['./branchtaxtab.component.scss']
})
export class BranchtaxtabComponent implements OnInit {
  tabdata=['Branch Tax','Branch Payment']
  testsub='';

  constructor(private router:Router) { }
  subdata(sub){
   
    // this.router.navigate(['/BranchTaxsummaryComponent'], { skipLocationChange: true })}
    this.testsub=sub;
  }
  ngOnInit(): void {
  }
  branchayment(){

  }
  branchtax(){
    
  }
}
