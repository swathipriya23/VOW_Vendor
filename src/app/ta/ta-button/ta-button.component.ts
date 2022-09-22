import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import{FormControl,FormGroup,FormBuilder,Validators,FormArray} from '@angular/forms';
import { NotificationService } from '../notification.service'
import {TaService} from "../ta.service";
import {ShareService}from '../share.service'

@Component({
  selector: 'app-ta-button',
  templateUrl: './ta-button.component.html',
  styleUrls: ['./ta-button.component.scss']
})
export class TaButtonComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();  
  tabuttonForm:FormGroup
  summ:any
  approveddate:any
  applevel:any
  approvedby:any
  onbehalfof:any
  status:any
  tourgid:any
  id:any
  apptype:any
  
  constructor(private formBuilder: FormBuilder,private taservice:TaService,private notification:NotificationService,private tashareservice:ShareService) { }

  ngOnInit(): void {
    this.tabuttonForm = this.formBuilder.group({
      appcomment:['',Validators.required],
      apptype:this.apptype,
      approveddate:"2020-11-10",
      applevel:this.applevel,
      tourgid:this.tourgid,
      approvedby:this.approvedby,
      onbehalfof:this.onbehalfof,
      status:this.status,

      
    })
this.gettourmakersumm();
  }
  gettourmakersumm() {
    let data: any = this.tashareservice.TourapproveviewId.value;
    console.log("tourmakerEditttt",data);
     this.summ=data
    this.taservice.getTourmakereditSummary(this.summ)
    .subscribe((results: any[]) => {
     console.log("Tourmakeredittest", results)
     let datasss=results;
     console.log("ff",datasss)
     this.id=datasss['id']
     console.log("ss",this.id)


     let datas = results['approve'];
     let overall=datas;
      console.log("hhh",overall)
     for(var i=0;i<overall.length;i++){
      this.applevel=overall[i].applevel;
      console.log("jj", this.applevel)
      this.approvedby=overall[i].approvedby;
      console.log("jj", this.approvedby)
      this.approveddate=overall[i].approveddate;
      console.log("llll", this.approveddate)
      this.apptype=overall[i].apptype;

      this.onbehalfof=overall[i].onbehalfof;
      this.tourgid=overall[i].id;
      this.status=overall[i].status;
      this.tabuttonForm.patchValue({
       
        applevel:this.applevel,
        approvedby:this.approvedby,
        approveddate:"2020-11-10",
        apptype:this.apptype,
        onbehalfof:this.onbehalfof,
        tourgid:this.tourgid,
        status:this.status,
    
    
    
      })
    }
    
     })
     }
  
 

  
  
    
    
   

  
  createFormate() {
    
    
    let data = this.tabuttonForm.controls;
    let objTourmaker = new TourMaker();
    
    
    objTourmaker.appcomment = data['appcomment'].value;
    objTourmaker.apptype=data['apptype'].value;
    objTourmaker.approveddate=data['approveddate'].value;
    objTourmaker.applevel=data['applevel'].value;
    objTourmaker.tourgid=data['tourgid'].value;
    objTourmaker.approvedby=data['approvedby'].value;
    objTourmaker.onbehalfof=data['onbehalfof'].value;
    objTourmaker.status=data['status'].value;
    
    console.log(" objTourmaker",  objTourmaker)
    return  objTourmaker;
  }
 
  

  approvelevel(){
   this.taservice.approvetourmaker(this.createFormate())
    .subscribe(res=>{
      if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
        this.notification.showWarning("Duplicate! Code Or Name ...")
      } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
        this.notification.showError("INVALID_DATA!...")
      }
      else{
      this.notification.showSuccess("Updated Successfully....")
      console.log("res", res)
      this.onSubmit.emit();
      return true
      }
    }
    )
    }
submitForm(){

}

  

  onCancelClick() {
    // this.istaForm=false;
    this.onCancel.emit()
  }
 
  

}
class TourMaker{
  appcomment:string;
  apptype:string;
  approveddate:string;
  applevel:string;
  tourgid:string;
  approvedby:string;
  onbehalfof:string;
  status:string;

}
