import { Component, OnInit,EventEmitter,Output,ViewChild } from '@angular/core';
import {TaService} from "../ta.service";
import {Router} from "@angular/router";
import {NotificationService} from '../notification.service'
import{FormGroup} from '@angular/forms';
@Component({
  selector: 'app-gradeeligibility-master',
  templateUrl: './gradeeligibility-master.component.html',
  styleUrls: ['./gradeeligibility-master.component.scss']
})
export class GradeeligibilityMasterComponent implements OnInit {
  getgradeeligibleList:any;
  gradeeligiblemodel:any;
  gradeeligibleform:FormGroup;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>(); 
  @ViewChild('closebutton') closebutton; 

  constructor(private taService:TaService,private router:Router,
    private notification:NotificationService) { }

  ngOnInit(): void {
    this.gradeeligiblemodel={
      grade:'',
      gradelevel:'',
      travelclass:'',
      travelmode:'',
      freight1000:'',
      freight1001:'',
      twowheller:'',
      hillyregion:'',
      tonnagefamily:'',
      maxtonnage:''

    }
    this.getgradeeligiblesummary();
  }
  getgradeeligiblesummary(){
    this.taService.getGradeEligibleSummary()
    .subscribe((results: any[]) => {
    let datas = results['data'];
    this.getgradeeligibleList = datas;
    
     })
  }
  deletegrade(id){
    this.taService.deletegradeeligible(id)
    .subscribe(result =>  {
     this.notification.showSuccess(" deleted....")
     this.getgradeeligiblesummary();
     return true

    })
  
  }
  submitForm(){
    this.taService.creategradeeligible([this.gradeeligiblemodel])
    .subscribe(res=>{
      if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
        this.notification.showWarning("Duplicate! Code Or Name ...")
      } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
        this.notification.showError("INVALID_DATA!...")
      }
      else{
      this.notification.showSuccess("Inserted Successfully....")
      this.closebutton.nativeElement.click();
      this.getgradeeligiblesummary();
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
 


