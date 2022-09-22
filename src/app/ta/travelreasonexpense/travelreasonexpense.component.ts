import { Component, OnInit, ViewChild } from '@angular/core';
import { TaService } from '../ta.service';
import { NotificationService } from '../notification.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-travelreasonexpense',
  templateUrl: './travelreasonexpense.component.html',
  styleUrls: ['./travelreasonexpense.component.scss']
})
export class TravelreasonexpenseComponent implements OnInit {

  
  travelexpenses: any;
  expenseeditform : FormGroup;
  expenseform: FormGroup;
  expenseSearchForm: FormGroup;
  searchtable_data:any;
  @ViewChild('travelexpenseeditclose') travelexpenseeditclose;
  @ViewChild('travelexpenseaddclose') travelexpenseaddclose;
  @ViewChild('travelreasonaddclose') travelreasonaddclose;
  travelreasons: any;
  expname: any;
  has_next=true;
  has_previous=true;
  currentpage=1;
  reasoneditform : FormGroup;
  reasonform : FormGroup;
  reasonSearchForm: FormGroup;
 
  @ViewChild('travelreasoneditclose') travelreasoneditclose;

  inttraveldropdown=[{name:'Yes',id:1 },{name:'No',id:0}]

  constructor(private taservice: TaService, private SpinerService:NgxSpinnerService, private notification: NotificationService, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.expenseSearchForm = this.formBuilder.group(
      {
        expname: ['']
      }
    )

    this.expenseeditform =this.formBuilder.group({
      name:  null,
      code: null,
      id: null,
   
    })
    this.expenseform = this.formBuilder.group({
      name: null,
      code : null,
    })

    
    this.reasonSearchForm = this.formBuilder.group(
      {
        expname: ['']
      }
    )

    this.reasoneditform =this.formBuilder.group({
      name:  null,
      international_travel: null,
      id: null,
   
    })
    this.reasonform = this.formBuilder.group({
      name:  null,
      international_travel: null,
      
     })
    this.gettravelreasons();
    this.gettravelexpenses();   
   
  }
  
  gettravelreasons()
  {
    
      this.taservice.gettravelreasondetails().subscribe(result => {
        console.log('from place to place', result)
        this.travelreasons = result['data'];
        })
           
    
  }
  resetform(){
   // this.reasoneditform.reset()
    
  }
  previousClick(){
    if(this.has_previous == true){
      this.travelreasons(this.currentpage -1)
    }
  }

  nextClick(){
    if(this.has_next == true){
      this.travelreasons(this.currentpage +1)
    }
  }
  edittravelreasons(data)
  {
 
      this.reasoneditform.patchValue({
        name:data.name,
        international_travel:data.international_travel,
        id:data.id,
      })
    }
  

  deletereason(val){

    console.log(val)
    

    this.taservice.travelreasondelete(val).subscribe(res => {
      console.log(res)
      if (res.status === "success") {
        this.notification.showSuccess('Reason deleted Successfully')
        this.gettravelreasons();
        return true;
      } else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }

  submitForm()
  {
    console.log("Entering Edit Section", this.reasoneditform.value.name + this.reasoneditform.value.international_travel)
    if(this.reasoneditform.value.name == '' || this.reasoneditform.value.name == null){
      console.log("Name VALUE ", this.reasoneditform.value.name)
      console.log('show error in date')
      this.notification.showError('Please Enter Name')
      throw new Error;
    }

    this.taservice.travelreasonedit(this.reasoneditform.value).subscribe(res => {
      console.log("ERRORS")
      console.log(res)
      if (res.status === "success") {
        this.notification.showSuccess('Travel Reason updated Successfully')
        this.travelreasoneditclose.nativeElement.click()
        this.gettravelreasons();
        return true;
      } else {
        this.notification.showError(res.description)
        return false;
      }
    })

  }
  addsubmitForm()
  {
    console.log("Entering Add Section", this.reasonform.value.name + this.reasonform.value.international_travel)
    if(this.reasonform.value.name == '' || this.reasonform.value.name == null){
      console.log("Name VALUE ", this.reasonform.value.name)
      console.log('show error in date')
      this.notification.showError('Please Enter Name')
      throw new Error;
    }

    this.taservice.travelreasonadd(this.reasonform.value).subscribe(res => {
      console.log("ERRORS")
      console.log(res)
      if (res.status === "success") {
        this.notification.showSuccess('Travel Reason updated Successfully')
        this.travelreasonaddclose.nativeElement.click();
        this.gettravelreasons();
        return true;
      } else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }
  reasonSearch()
  {
    this.expname = this.reasonSearchForm.value.expname;

    if (this.expname != null) {
      this.getSearch(this.expname)
    }

  }
  getSearch(data)
  {
    this.searchName(data,1)
  }
  searchName(data, pageNo)
  {
    console.log("Search Data")
    this.SpinerService.show()
        this.taservice.getreasonsearches(data, pageNo).subscribe(res => {
        this.searchtable_data = res['data']
        let datas = res["data"];
        this.travelreasons = datas;
        this.SpinerService.hide();
        })

       
   
  }
  gettravelexpenses()
  {
    
      this.taservice.gettravelexpensedetails().subscribe(result => {
        console.log('from place to place', result)
        this.travelexpenses = result['data']
        })
           
    
  }
  resetforms(){
  //  this.expenseeditform.reset()
    
  }
  previousClicks(){
    if(this.has_previous == true){
      this.travelexpenses(this.currentpage -1)
    }
  }

  nextClicks(){
    if(this.has_next == true){
      this.travelexpenses(this.currentpage +1)
    }
  }  

  edittravelexpense(data)
  {
    this.expenseeditform.patchValue({
      name:data.name,
      code:data.code,
      id:data.id,
    })
  }
  editsubmitForm()
  {
    console.log("Entering Edit Section", this.expenseeditform.value.name + this.expenseeditform.value.international_travel)
    if(this.expenseeditform.value.name == '' || this.expenseeditform.value.name == null){
      console.log("Name VALUE ", this.expenseeditform.value.name)
      console.log('show error in name')
      this.notification.showError('Please Enter Name')
      throw new Error;
    }
    if(this.expenseeditform.value.code == '' || this.expenseeditform.value.code == null){
      console.log("Code VALUE ", this.expenseeditform.value.name)
      console.log('show error in code')
      this.notification.showError('Please Enter Code')
      throw new Error;
    }
    this.taservice.travelexpenseedit(this.expenseeditform.value).subscribe(res => {
      console.log("ERRORS")
      console.log(res)
      if (res.status === "success") {
        this.notification.showSuccess('Travel Reason updated Successfully')
        this.expenseSearch();
        this.travelexpenseeditclose.nativeElement.click()
        return true;
      } else {
        this.notification.showError(res.description)
        return false;
      }
    })

  }
  deleteexpense(val)
  {
    console.log(val)
    

    this.taservice.travelexpensedelete(val).subscribe(res => {
      console.log(res)
      if (res.status === "success") {
        this.notification.showSuccess('Expense deleted Successfully')
        this.expenseSearch();
        return true;
      } else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }
  addsubmitForms()
  {
    console.log("Entering Edit Section", this.expenseform.value.name + this.expenseform.value.international_travel)
    if(this.expenseform.value.name == '' || this.expenseform.value.name == null){
      console.log("Name VALUE ", this.expenseform.value.name)
      console.log('show error in name')
      this.notification.showError('Please Enter Name')
      throw new Error;
    }
    if(this.expenseform.value.code == '' || this.expenseform.value.code == null){
      console.log("Code VALUE ", this.expenseform.value.name)
      console.log('show error in code')
      this.notification.showError('Please Enter Code')
      throw new Error;
    }
    this.taservice.travelexpenseadd(this.expenseform.value).subscribe(res => {
      if (res.status === "success") {
        this.notification.showSuccess('Travel Reason updated Successfully')
        this.travelexpenseaddclose.nativeElement.click()
        this.expenseSearch();
        return true;
      } else {
        this.notification.showError(res.description)
        return false;
      }
    })


  }
  expenseSearch()
  {
   this.expname = this.expenseSearchForm.value.expname;

    if (this.expname != null) {
      this.getSearchs(this.expname)
    }

  }
  getSearchs(data)
  {
    this.searchNames(data,1)
  }
  searchNames(data, pageNo)
  {
    console.log("Search Data")
    this.SpinerService.show()
        this.taservice.getSearchdatas(data, pageNo).subscribe(res => {
        this.searchtable_data = res['data']
        let datas = res["data"];
        this.travelexpenses = datas;
        this.SpinerService.hide();
        })

       
   
  }


  }
    

