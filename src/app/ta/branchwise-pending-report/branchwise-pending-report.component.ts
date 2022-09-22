import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TaTransactionSummaryComponent } from '../ta-transaction-summary/ta-transaction-summary.component';
import { TaService } from '../ta.service';

@Component({
  selector: 'app-branchwise-pending-report',
  templateUrl: './branchwise-pending-report.component.html',
  styleUrls: ['./branchwise-pending-report.component.scss']
})
export class BranchwisePendingReportComponent implements OnInit {
  tabranchwiseForm:FormGroup;
  getbranchwiseList:any;
  branchwisemodal:any;
  value:any
  radiocheck: any[] = [
    { value: 1, display: 'Self' },
    { value: 0, display: 'Other' }
  ]
  constructor(private taservice:TaService) { }

  ngOnInit(): void {
    this.branchwisemodal={
      status:''
    }
  }
  getdata(data){
    this.value=data.value
    this.taservice.getbranchwisereport(this.value)
    .subscribe(result=>{
      this.getbranchwiseList=result
     
    })
  }
}
