import { Component, OnInit,EventEmitter,Output,ViewChild } from '@angular/core';
import {TaService} from "../ta.service";
import {Router} from "@angular/router";
import {NotificationService} from '../notification.service'
import{FormGroup} from '@angular/forms';

@Component({
  selector: 'app-commondropdowndetail-master',
  templateUrl: './commondropdowndetail-master.component.html',
  styleUrls: ['./commondropdowndetail-master.component.scss']
})
export class CommondropdowndetailMasterComponent implements OnInit {
  dropdowndetailmodel:any;
  getcommondropdowndetailList:any;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>(); 
  @ViewChild('closebutton') closebutton; 
  dropdowndetailForm:FormGroup;
  dropdownlist:any;
  has_next=true;
  has_previous=true;
  currentpage=1;
  constructor(private taService:TaService,private router:Router,
    private notification:NotificationService) { }

  ngOnInit(): void {
    this.dropdowndetailmodel={
      name:'',
      entity:'',
      reason:'',
      common_drop_down_id:''
     
    }
    this.getcommondropdowndetailsummary();
    this.getcommondropdownsummary(this.currentpage);
  }
  getcommondropdownsummary(page){
    this.taService.getCommondropdownSummary(page)
    .subscribe((results: any[]) => {
    let datas = results['data'];
    this.dropdownlist = datas;
   
    
  })
  }
  getcommondropdowndetailsummary(){
    this.taService.getCommondropdowndetailSummary()
    .subscribe((results: any[]) => {
    let datas = results['data'];
    this.getcommondropdowndetailList = datas;
    
  })
  }
  deletedetail(id){
    this.taService.deletecommondropdowndetail(id)
   .subscribe(result =>  {
    this.notification.showSuccess(" deleted....")
    this.getcommondropdowndetailsummary();
    return true

   })
 
 }
 
 submitForm(){
   this.taService.createCommondropdowndetail([this.dropdowndetailmodel])
   .subscribe(res=>{
     if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
       this.notification.showWarning("Duplicate! Code Or Name ...")
     } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
       this.notification.showError("INVALID_DATA!...")
     }
     else{
     this.notification.showSuccess("Inserted Successfully....")
     this.closebutton.nativeElement.click();
     this.getcommondropdowndetailsummary();
     this.onSubmit.emit();
     return true
     }
   })
 }
 OnCancelclick(){
   this.onCancel.emit()
   this.router.navigateByUrl('ta/commondropdowndetail');
 }


}
