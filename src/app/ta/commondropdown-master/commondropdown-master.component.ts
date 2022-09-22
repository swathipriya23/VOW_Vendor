import { Component, OnInit,EventEmitter,Output,ViewChild } from '@angular/core';
import {TaService} from "../ta.service";
import {Router} from "@angular/router";
import {NotificationService} from '../notification.service'
import{FormBuilder, FormGroup} from '@angular/forms';
@Component({
  selector: 'app-commondropdown-master',
  templateUrl: './commondropdown-master.component.html',
  styleUrls: ['./commondropdown-master.component.scss']
})
export class CommondropdownMasterComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>(); 
  @ViewChild('closebutton') closebutton; 
  getcommondropdownList:any;
  getcommondropdowndetailList:any;
  commondropdownForm:FormGroup;
  
  dropdownmodel:any;
  dropdowndetailmodel:any;
  showdropdown =false;
  showdropdowndetail=false;
  dropdown=false;
  dropdowndetail=true;
  name:any;
 dropdownid:any;
 has_next=true;
  has_previous=true;
  currentpage=1;
  commondropeditform: FormGroup;
  commondropdetaileditform: FormGroup;
  commondropdetailform: FormGroup;
  constructor(private taService:TaService,private router:Router,private formBuilder:FormBuilder,
    private notification:NotificationService) { }

  ngOnInit(): void {
    this.dropdownmodel={
      name:'',
      entity:'',
      code:'',
     
    }
    this.dropdowndetailmodel={
      name:'',
      entity:'',
      value:'',
      common_drop_down_id:''
     
    }
    //commondropeditform

    this.commondropeditform=this.formBuilder.group({
      name: null,
      code: null,
      entity:null,
      id: null,
   
    })
    //commondropdetaileditform
    this.commondropdetaileditform=this.formBuilder.group({
      name: null,
      value: null,
      common_drop_down_id:null,
      id: null,
   
    })
    this.commondropdetailform = this.formBuilder.group({
      name:null,
      value: null,
      common_drop_down_id:null,
    })
    
    this.getcommondropdownsummary(this.currentpage);
  }
  getcommondropdownsummary(page){
    this.taService.getCommondropdownSummary(page)
    .subscribe((results: any[]) => {
    let datas = results['data'];
    this.getcommondropdownList = datas;
    let datapagination = results['pagination']
    if (this.getcommondropdownList.length >= 0) {
      this.has_next = datapagination.has_next;
      this.has_previous = datapagination.has_previous;
      this.currentpage = datapagination.index;
   
    }  
  })
  }
  resetform(){
    this.dropdownmodel.reset()
    
  }
  previousClick(){
    if(this.has_previous == true){
      this.getcommondropdownsummary(this.currentpage -1)
    }
  }

  nextClick(){
    if(this.has_next == true){
      this.getcommondropdownsummary(this.currentpage +1)
    }
  }
 
  deletedata(id){
    this.taService.deletecommondropdown(id)
   .subscribe(result =>  {
    this.notification.showSuccess(" deleted....")
    //this.getcommondropdownsummary();
    return true

   })
 
 }
 
 submitForm(){
   this.taService.createCommondropdown([this.dropdownmodel])
   .subscribe(res=>{
     if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
       this.notification.showWarning("Duplicate! Code Or Name ...")
     } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
       this.notification.showError("INVALID_DATA!...")
     }
     else{
     this.notification.showSuccess("Inserted Successfully....")
     this.closebutton.nativeElement.click();
     //this.getcommondropdownsummary();
     this.onSubmit.emit();
     return true
     }
   })
 }
 OnCancelclick(){
   this.onCancel.emit()
   this.router.navigateByUrl('ta/ta_master');
 }
 
 getdata(e,id,name){
  this.name=name;
  if(e.target.checked){
   
    this.dropdown=true;
    this.dropdowndetail=false;
    this.showdropdowndetail=true
    this.dropdownid=id;
   
  }
  else{
    this.dropdown=false;
    this.dropdowndetail=false;
    this.showdropdowndetail=false
  }
  
  this.taService.getCommondropdownselectedSummary(id, this.currentpage)
  .subscribe((results: any[]) => {
  let datas = results['data'];
  this.getcommondropdowndetailList = datas;
  
  
  })
 }
 
 updateForm()
 {
  console.log("Entering Edit Section", this.commondropeditform.value.date + this.commondropeditform.value.holidayname)
  if(this.commondropeditform.value.name == '' || this.commondropeditform.value.name == null){
    console.log(this.commondropeditform.value.name)
    console.log('show error in name')
    this.notification.showError('Please Enter name')
    throw new Error;
  }

  if(this.commondropeditform.value.code == '' || this.commondropeditform.value.code == null){
    console.log('show error in code')
    console.log("Value is",  this.commondropeditform.value.code)
    this.notification.showError('Please Enter Code')

    throw new Error;

  }
  if(this.commondropeditform.value.entity == '' || this.commondropeditform.value.entity == null){
    console.log('show error in entity')
    console.log("Value is",  this.commondropeditform.value.entity)
    this.notification.showError('Please Enter entity')

    throw new Error;

  }
  this.taService.commondropdownedit(this.commondropeditform.value).subscribe(res => {
    console.log("ERRORS")
    console.log(res)
    if (res.status === "success") {
      this.notification.showSuccess('Common DropDown updated Successfully')
      
      return true;
    } else {
      this.notification.showError(res.description)
      return false;
    }
  })
 }

 editcommondropdowndetail(data)
 {
  this.commondropdetaileditform.patchValue({
    name:data.name,
    value:data.value,
    common_drop_down_id: data.common_drop_down_id,
    id:data.id,
  })

 }
 updateDetailForm()
 {
  console.log("Entering Edit Section", this.commondropeditform.value.date + this.commondropeditform.value.holidayname)
  if(this.commondropdetaileditform.value.name == '' || this.commondropdetaileditform.value.name == null){
    console.log(this.commondropdetaileditform.value.name)
    console.log('show error in name')
    this.notification.showError('Please Enter name')
    throw new Error;
  }

  if(this.commondropdetaileditform.value.value == '' || this.commondropdetaileditform.value.value == null){
    console.log('show error in value')
    console.log("Value is",  this.commondropdetaileditform.value.value)
    this.notification.showError('Please Enter value')

    throw new Error;

  }
  if(this.commondropdetaileditform.value.common_drop_down_id == '' || this.commondropdetaileditform.value.common_drop_down_id == null){
    console.log('show error in common drop down id')
    console.log("Value is",  this.commondropdetaileditform.value.common_drop_down_id)
    this.notification.showError('Please Enter Id')

    throw new Error;

  }
  this.taService.commondropdowndetailedit([this.commondropdetaileditform.value]).subscribe(res => {
    console.log("ERRORS")
    console.log(res)
    if (res.status === "success") {
      this.notification.showSuccess('Common DropDown updated Successfully')
      
      return true;
    } else {
      this.notification.showError(res.description)
      return false;
    }
  })


 }

 editcommondropdown(data)
 {

  this.commondropeditform.patchValue({
    name:data.name,
    code:data.code,
    entity: data.entity,
    id:data.id,
  })

 }
 
 deletedetail(id){
  this.taService.deletecommondropdowndetail(id)
  .subscribe(result =>  {
   this.notification.showSuccess(" deleted....")
   //this.getcommondropdownsummary();
   return true

  })

 }
 reset(){
  this.dropdowndetailmodel.common_drop_down_id
 }
 
 submitdetailForm(){
  this.dropdowndetailmodel.common_drop_down_id = this.dropdownid;
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
    //this.getcommondropdownsummary();
    this.onSubmit.emit();
    return true
    }
  })
}
OnCanceldetailclick(){
  this.onCancel.emit()
  this.router.navigateByUrl('ta/ta_master');
}


  }


