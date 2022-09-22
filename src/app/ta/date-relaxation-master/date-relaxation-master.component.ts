import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TaService } from '../ta.service';
import { NotificationService } from '../notification.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-date-relaxation-master',
  templateUrl: './date-relaxation-master.component.html',
  styleUrls: ['./date-relaxation-master.component.scss']
})
export class DateRelaxationMasterComponent implements OnInit {
  tadaterelaxForm: FormGroup
  getdaterelaxationList: any
  tourno: any
  hide: boolean = true
  tournos: any

  has_next = true;
  has_previous = true;
  parAppList: any;
  presentpage: any
  pageNumber: any;
  pageSize: any;

  search_has_next =true;
  search_has_previous = true;
  currentpage:any;


  searchtable_data:any;
  searchtourid:any

  tableshow:boolean=false


  constructor(private taservice: TaService, private notification: NotificationService, private formbuilder: FormBuilder,private SpinerService:NgxSpinnerService) { }

  ngOnInit(): void {
    this.tadaterelaxForm = this.formbuilder.group(
      {
        requestno: ['']
      }
    )
    this.getdaterelax(1);
  }

  getdaterelax(pageNumber = 1) {

    this.SpinerService.show()
    this.taservice.getdaterelaxationdata(pageNumber)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinerService.hide()
        let datapagination = results["pagination"];
        this.getdaterelaxationList = datas;
        if (this.getdaterelaxationList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }
      })


  }

  nextClick() {
    if (this.has_next === true) {
      this.getdaterelax(this.presentpage + 1)
    }
  }


  previousClick() {
    if (this.has_previous === true) {
      this.getdaterelax(this.presentpage - 1)
    }
  }

  firstClick() {
    if (this.has_previous === true) {
      this.getdaterelax(1)
    }
  }


  activedata(data) {
    console.log(data)
    this.taservice.getactivedate(data.id, data.tour_id)
      .subscribe(result => {
        if (result.status === "success") {
          this.notification.showSuccess(result.message)
          // this.getdaterelax(this.presentpage)

        }
        else {
          this.notification.showError(result.message)

        }
      })
      if(this.tableshow){
        for(let  i=0;i < this.searchtable_data.length;i++ ){
          if(this.searchtable_data[i].id  == data.id ){
            this.searchtable_data[i].status =0
          }
        }
      }
      else{
        for (let i = 0; i < this.getdaterelaxationList.length; i++) {
          if (this.getdaterelaxationList[i].id == data.id) {
            this.getdaterelaxationList[i].status = 0
          }
        }
      }
    

  }


  inactivedata(data) {
    this.taservice.getinactivedate(data.id, data.tour_id)
      .subscribe(result => {
        if (result.status === "success") {
          this.notification.showSuccess(result.message)
          // this.getdaterelax(this.presentpage)


        } else {
          this.notification.showError(result.message)
        }
      })
      if(this.tableshow){
        for(let i=0;i < this.searchtable_data.length;i++ ){
          if(this.searchtable_data[i].id == data.id){
            this.searchtable_data[i].status =1
          }
        }
      }
      else{
        for (let i = 0; i < this.getdaterelaxationList.length; i++) {
          if (this.getdaterelaxationList[i].id == data.id) {
            this.getdaterelaxationList[i].status = 1
          }
        }
      }


    
  }


  billSearch() {

    this.tourno = this.tadaterelaxForm.value.requestno

    // this.taservice.getconsolidatereport(this.tourno)
    // .subscribe(result =>{
    //   this.getdaterelaxationList=result
    // })
    this.hide = false

    if (this.tourno != null) {
      this.getbranchValue(this.tourno)
    }
    else {
      this.getdaterelax(1);
      this.hide = true
    }
  }


  reset() {
    this.tadaterelaxForm.reset()
    this.getdaterelax(1)
    this.tableshow=false
  }


  getbranchValue(data) {
    this.tableshow=true
    this.searchtourid=data
    this.searchtour(data,1)
  }

  searchtour(data,pageno) {
    this.SpinerService.show()
    this.taservice.getbranchValuedata(data, pageno)
      .subscribe(result => {
        // console.log(result)
        this.searchtable_data = result['data']
        let datas = result["data"];
        this.SpinerService.hide()
        let datapagination = result["pagination"];
       
        if (this.getdaterelaxationList.length > 0) {
          this.search_has_next = datapagination.has_next;
          this.search_has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
      })
  }

  searchnextpage(){
    if(this.search_has_next==true){
      this.searchtour(this.searchtourid,this.currentpage+1)
    }
  }

  searchpreviouspage(){
    if(this.search_has_previous==true){
      this.searchtour(this.searchtourid,this.currentpage-1)
    }
  }

  searchfirstpage(){
    if(this.search_has_previous==true){
      this.searchtour(this.searchtourid,1)
    }
  }


  // nextClick(){

  //   this.getdaterelax()


  // }
}
