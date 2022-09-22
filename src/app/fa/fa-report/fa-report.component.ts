import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { masterService } from 'src/app/Master/master.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ErrorHandlerService } from '../error-handler.service';
import { faservice } from '../fa.service';

@Component({
  selector: 'app-fa-report',
  templateUrl: './fa-report.component.html',
  styleUrls: ['./fa-report.component.scss']
})
export class FaReportComponent implements OnInit {
  first:boolean=false;
  constructor(private router:Router,private notification:NotificationService,private fa_service:faservice,private Errohandler:ErrorHandlerService) { }

  ngOnInit(): void {
  }
  getempbranchdownload(){
    if(this.first==true){
      this.notification.showWarning('Already Running')
      return true
    }
    this.first=true;
    this.fa_service.getalldownloadfarepotrs()
    .subscribe(fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'Fa-Reports'+ date +".xlsx";
      link.click();
      this.first = false;
      // this.notification.showSuccess('SUCCESS')
    },
    (error:HttpErrorResponse)=>{
      this.first=false;
      this.Errohandler.errorHandler(error,'file');
      // this.notification.showWarning(error.status+error.statusText)
    })
  }
  BackBtn() {
    this.router.navigate(['/fa/fa'], { skipLocationChange: true })


  }
}
