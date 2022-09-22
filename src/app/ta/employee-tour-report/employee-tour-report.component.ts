import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {TaService} from "../ta.service";
import {ShareService} from "../share.service";


@Component({
  selector: 'app-employee-tour-report',
  templateUrl: './employee-tour-report.component.html',
  styleUrls: ['./employee-tour-report.component.scss']
})
export class EmployeeTourReportComponent implements OnInit {
  taempreportForm:FormGroup;
  empreportmodal:any;
  getempreportList:any;
  id:any
  empname:any
  
  constructor(private taservice:TaService,private router:Router,
    private shareservice:ShareService) { }

  ngOnInit(): void {
    this.empreportmodal={
      requestno:''
    }
  }
  
  empreportSearch(){
    let search = this.empreportmodal
    let tourno = this.empreportmodal.requestno
    this.id=tourno
    this.taservice.getemptourreport( tourno)
    .subscribe(result=> {
     this.getempreportList=result
    
   
  })
  
  this.shareservice.empData.next( this.id)
}
  reset(){
    this.empreportmodal.requestno=""
  }
  download(){
    
        this.taservice.getempreportdownload( this.id)
        .subscribe((results) => {
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'Employee Tour Report'+".xlsx";
          link.click();
          })
  }
  gettourdetail(id){
    
    this.shareservice.emptourreasonid.next(id)
    this.router.navigateByUrl("ta/reporttourdetail")
  }
  gettourexpense(){
    this.router.navigateByUrl("ta/reporttourexpense")
  }

}
