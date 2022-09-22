import { Component, OnInit,Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import {ShareService} from "../share.service";
import { TaService } from '../ta.service';
import { Router } from '@angular/router';

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

@Injectable()
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'app-report-tour-advance',
  templateUrl: './report-tour-advance.component.html',
  styleUrls: ['./report-tour-advance.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class ReportTourAdvanceComponent implements OnInit {
  taForm:FormGroup
  touradvancemodel:any
  reasonlist:any
  touradvance:any
  employeelist:any
  id:any
  emptourid:any
  datas:any
  reportindex:any
  tourreportid:any
  emptourreportid:any
  constructor(private shareservice:ShareService,private taservice:TaService,
  private router:Router,private datepipe:DatePipe) { }
  ngOnInit(): void {
    this.id=this.shareservice.tourData.value
    this.emptourid=this.shareservice.empData.value
    this.datas=this.shareservice.report.value
    this.reportindex=this.datas.index
    console.log("indexes",this.datas)
    this.tourreportid=this.shareservice.tourreasonid.value
    this.emptourreportid=this.shareservice.emptourreasonid.value
    
    this.touradvancemodel={
      requestno:'',
      requestdate:'',
      reason:'',
      startdate:'',
      enddate:'',
      bank:'',
      approval:''
    }
    this.gettouradvance()
  }
  tourrequestno:any
  gettouradvance(){
    if(this.reportindex === 1){
      this.tourrequestno=this.tourreportid
    }
    if(this.reportindex === 3){
      this.tourrequestno =this.emptourreportid
    }

    this.taservice.gettouradvancereport(this.tourrequestno)
    .subscribe(res =>{
      console.log("advanceres",res)
      // this.tourmodel.detail.forEach(currentValue => {
      //   currentValue.startdate = this.datePipe.transform(currentValue.startdate, 'yyyy-MM-dd');
      //   currentValue.enddate = this.datePipe.transform(currentValue.enddate, 'yyyy-MM-dd');
      // });
      this.touradvance=res['detail']
      this.touradvancemodel={
        requestno:res.requestno,
        requestdate:this.datepipe.transform(res.requestdate, 'yyyy-MM-dd'),
        reason:res.reason,
        // startdate:res.startdate,
        startdate:this.datepipe.transform(res.startdate, 'yyyy-MM-dd'),
        enddate:this.datepipe.transform(res.enddate, 'yyyy-MM-dd'),
        approvedby:res.approvedby,
        branch_name:res.branch_name
      }
      
    })
  
    
}
  onCancelClick(){
    this.router.navigateByUrl("/reporttourdetail")
  }
}
