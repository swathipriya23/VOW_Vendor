import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {TaService} from '../ta.service';
import {ShareService} from '../share.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-tour-expense',
  templateUrl: './report-tour-expense.component.html',
  styleUrls: ['./report-tour-expense.component.scss']
})
export class ReportTourExpenseComponent implements OnInit {
  gettourexpensereportList:any
  reporttourexpenseForm:FormGroup
  id:any
  emptourid:any
  datas:any
  reportindex:any
  tourreportid:any
  emptourreportid:any
  expensetourid:any
  constructor(private taservice:TaService,private shareservice:ShareService,
    private router:Router) { }

  ngOnInit(): void {
    this.id=this.shareservice.tourData.value
    this.emptourid=this.shareservice.empData.value
    this.datas=this.shareservice.report.value
    this.reportindex=this.datas.index
    this.tourreportid=this.shareservice.tourreasonid.value
    this.emptourreportid=this.shareservice.emptourreasonid.value
    this.expensetourid=this.shareservice.expensetourid.value
    
    this.gettourexpense()
  }
  tourrequestno:any
  gettourexpense(){
  if(this.reportindex=== 1){
    this.tourrequestno=this.expensetourid
  }
  if(this.reportindex=== 3){
    this.tourrequestno=this.emptourreportid
  }
  this.taservice.gettourexpensereport(this.tourrequestno)
  .subscribe(result =>{
    this.gettourexpensereportList=result['data']
    
  })
}

download(){
    if(this.reportindex=== 1){
  
        this.taservice.gettourexpensedownload( this.expensetourid)
        .subscribe((results) => {
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'Tour Expense Report'+".xlsx";
          link.click();
          })
      }
      if(this.reportindex=== 3){
        this.taservice.gettourexpensedownload( this.emptourreportid)
        .subscribe((results) => {
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'Tour Expense Report'+".xlsx";
          link.click();
          })
          }
  }
  onCancelClick(){
    this.router.navigateByUrl("/ta_report")
  }
}
