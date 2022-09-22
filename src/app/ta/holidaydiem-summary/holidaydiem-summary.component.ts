import { Component, OnInit,EventEmitter,Output,ViewChild } from '@angular/core';
import {TaService} from "../ta.service";
import {Router} from "@angular/router";
import {NotificationService} from '../notification.service'
import{FormGroup} from '@angular/forms';

@Component({
  selector: 'app-holidaydiem-summary',
  templateUrl: './holidaydiem-summary.component.html',
  styleUrls: ['./holidaydiem-summary.component.scss']
})
export class HolidaydiemSummaryComponent implements OnInit {
  getHolidayDiemList:any;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>(); 
  @ViewChild('closebutton') closebutton; 
  holidaydiemmodel:any;
  holidaydiemform:FormGroup;
  
  constructor(private taService:TaService,private router:Router,
    private notification:NotificationService) { }

  ngOnInit(): void {
    this.holidaydiemmodel={
      salarygrade:'',
      city:'',
      amount:'',
      applicableto:'',
      entity:1
    }
    this.getholidaydiemsummary();
  }

  getholidaydiemsummary(){
    this.taService.getHolidaydiemSummary()
    .subscribe((results: any[]) => {
    let datas = results['data'];
    this.getHolidayDiemList = datas;
    
  })
  }  
  deletediem(id){
     this.taService.deleteholidaydiem(id)
    .subscribe(result =>  {
     this.notification.showSuccess(" deleted....")
     this.getholidaydiemsummary();
     return true

    })
  
  }
  
  submitForm(){
    this.taService.createholidaydiem([this.holidaydiemmodel])
    .subscribe(res=>{
      if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
        this.notification.showWarning("Duplicate! Code Or Name ...")
      } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
        this.notification.showError("INVALID_DATA!...")
      }
      else{
      this.notification.showSuccess("Inserted Successfully....")
      this.closebutton.nativeElement.click();
      this.getholidaydiemsummary();
      this.onSubmit.emit();
      return true
      }
    })
  }
  OnCancelclick(){
    this.onCancel.emit()
    this.router.navigateByUrl('ta/ta_master');
  }
}
