import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {TaService} from "../ta.service";
import {ShareService} from '../share.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const isSkipLocationChange = environment.isSkipLocationChange

@Component({
  selector: 'app-tour-report',
  templateUrl: './tour-report.component.html',
  styleUrls: ['./tour-report.component.scss']
})
export class TourReportComponent implements OnInit {
  tourreportmodal:any;
  tareportForm:FormGroup;
  branchlist:any;
  employeelist:any;
  gettourreportList:any;
  branchid:any;

  presentpage: number = 1;
  pageSize = 10;
  has_next = true;
  has_previous = true;
  image:any
  tourno:any;
  empgid:any;
  
  taUrl = environment.apiURL

  constructor(private taservice:TaService,private shareservice:ShareService,
    private router:Router) { }

  ngOnInit(): void {
    this.tourreportmodal={
      requestno:'',
      branch:'',
      employee:''
    }
    this.getbranchlist()
    }
  
  getbranchlist(){
    this.taservice.getbranchValue()
    .subscribe(result => {
      let datas=result['data']
      this.branchlist= datas
      
    })
  }
  getbrnch(id){
    this.branchid=id
    this.getemployeelist()
    
  }
  getemployeelist(){
    this.taservice.getemployeevalue(this.branchid)
    .subscribe(result => {
      let datas=result
      this.employeelist= datas
    }) 
  }
  
  tourSearch(){
    let search=this.tourreportmodal;
    this.tourno=this.tourreportmodal.requestno;
    this.empgid=this.tourreportmodal.employee;
    this.taservice.gettoursearch( this.tourno,this.empgid)
    .subscribe(result=> {
     
     this.gettourreportList=result
     let datapagination = result["pagination"];
     this.shareservice.tourData.next(this.tourno)
      // if (this.gettourreportList.length >= 0) {
      //   this.has_next = datapagination.has_next;
      //   this.has_previous = datapagination.has_previous;
      //   this.presentpage = datapagination.index;
      // }
    })
  

  }
  // nextClick() {
  //   if (this.has_next === true) {
  //     this.tourSearch(this.presentpage + 1, 10)
  //   }
  // }
  
  // previousClick() {
  //   if (this.has_previous === true) {
  //     this.tourSearch(this.presentpage - 1, 10)
  //   }
  // }
  reset(){
    this.tourreportmodal.requestno = "";
    this.tourreportmodal.branch = "";
    this.tourreportmodal.employee = "";
  }
  
tourdownload(){
  
          this.taservice.gettouriddownload( this.tourno, this.empgid)
          .subscribe((results) => {
            let binaryData = [];
            binaryData.push(results)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'Tour Report'+".xlsx";
            link.click();
            })
          
}
gettourdetail(id){
  
  this.shareservice.tourreasonid.next(id)
  this.router.navigateByUrl("ta/reporttourdetail")
}
gettourexpense(tourid){
  this.shareservice.expensetourid.next(tourid)
  this.router.navigateByUrl("ta/reporttourexpense")
}
}
