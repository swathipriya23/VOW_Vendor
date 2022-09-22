import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder, FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { PICK_FORMATS } from '../tamaker-create/tamaker-create.component';
import { TaService } from '../ta.service';
import { NotificationService } from '../notification.service';
import { error } from 'console';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-holidaymaster',
  templateUrl: './holidaymaster.component.html',
  styleUrls: ['./holidaymaster.component.scss'],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
})
export class HolidaymasterComponent implements OnInit {

  @ViewChild('holidayeditclose') holidayeditclose;
  @ViewChild('holidayaddclose') holidayaddclose;
  @ViewChild('holidayinput') holidayinput: any;
  @ViewChild('closefilepopup')closefilepopup;

  holidaysummary: any;
  previousholidaysummary : any;
  nextholidaysummary : any;
  has_next=true;
  has_previous=true;
  currentpage=1;
  holidayform : FormGroup;
  holidayeditform: FormGroup;
  list: DataTransfer;
  fileData: File = null;
  fileName = '';
  file: File = null;
  currentYear: number = new Date().getFullYear();
  holidaySearchForm : FormGroup;
  searchyear: any;
  searchtable_data:any;

  constructor(private taservice: TaService,private SpinerService:NgxSpinnerService, private formBuilder:FormBuilder, private notification: NotificationService, private http: HttpClient) { }

  ngOnInit(): void {
    
    this.holidayform=this.formBuilder.group({
      date: null,
      holidayname: null,
      file: null,
      

    })
    this.holidayeditform=this.formBuilder.group({
      datess: null,
      holidayname: null,
      id: null,
   
    })
    this.holidaySearchForm = this.formBuilder.group(
      {
        searchyear: ['']
      }
    )

    this.getholidaysummary(this.currentYear,this.currentpage)
   

  }
  submitform(){
    if(this.holidayform.value.date == '' || this.holidayform.value.date == null){
      console.log('show error in Date')
      this.notification.showError('Please Choose Date')
      throw new Error;
    }

    if(this.holidayform.value.holidayname == '' || this.holidayform.value.holidayname == null){
      console.log('show error in name')
      this.notification.showError('Please Enter Name')

      throw new Error;

    }



    this.taservice.holidayadd(this.holidayform.value).subscribe(res => {
      console.log(res)
      if (res.status === "success") {
        this.notification.showSuccess('Holiday Added Successfully')
        this.holidayaddclose.nativeElement.click()
        return true;
      } else {
        this.notification.showError(res.description)
        return false;
      }
    })

  }

  yearSearch()
  {
    this.searchyear = this.holidaySearchForm.value.searchyear;

    if (this.searchyear != null) {
      this.getSearch(this.searchyear)
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
        this.taservice.getholidaydetails(data, pageNo).subscribe(res => {
        this.searchtable_data = res['data']
        let datas = res["data"];
        this.holidaysummary = datas;
        this.SpinerService.hide();
        })

       
   
  }

  

  getholidaysummary(date, page){
    this.taservice.getholidaydetails(date, page).subscribe(result => {
      console.log('from place to place', result)
      this.holidaysummary = result['data']
      let datapagination = result['pagination']
      if (this.holidaysummary.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.currentpage = datapagination.index;
      }
    })
  }
  resetform(){
    this.holidayform.reset()
    
  }
  previousClick(){
    if(this.has_previous == true){
      this.getholidaysummary(this.currentYear,this.currentpage -1)
    }
  }

  nextClick(){
    if(this.has_next == true){
      this.getholidaysummary(this.currentYear,this.currentpage +1)
    }
  }
  editholiday(data){
    this.holidayeditform.patchValue({
      datess:data.datess,
      holidayname:data.holidayname,
      id:data.id,
    })
  }

  
  editsubmitform(){
    console.log("Entering Edit Section", this.holidayeditform.value.datess + this.holidayeditform.value.holidayname)
    if(this.holidayeditform.value.datess == '' || this.holidayeditform.value.datess == null){
      console.log(this.holidayeditform.value.datess)
      console.log('show error in date')
      this.notification.showError('Please Choose Date')
      throw new Error;
    }

    if(this.holidayeditform.value.holidayname == '' || this.holidayeditform.value.holidayname == null){
      console.log('show error in name')
      console.log("Value is",  this.holidayeditform.value.holidayname)
      this.notification.showError('Please Enter Holiday Name')

      throw new Error;

    }
    this.taservice.holidayedit(this.holidayeditform.value).subscribe(res => {
      console.log("ERRORS")
      console.log(res)
      if (res.status === "success") {
        this.notification.showSuccess('Holiday updated Successfully')
        this.holidayeditclose.nativeElement.click()
        return true;
      } else {
        this.notification.showError(res.description)
        return false;
      }
    })

  }
  
  deleteholiday(val){

    console.log(val)
    // return false

    this.taservice.holidaydelete(val).subscribe(res => {
      console.log(res)
      if (res.status === "success") {
        this.notification.showSuccess('Holiday deleted Successfully')
        
        return true;
      } else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }
  
  onFileSelected(event) {

      this.file = event.target.files[0];

  }
  onUpload()
  {
    if (this.file) {

      this.fileName = this.file.name;
  
      const formData = new FormData();
  
      formData.append("file", this.file);
      
  
      this.taservice.uploadholiday(formData)
    .subscribe((results) => {
      if (results.status == 'success') {
        this.notification.showSuccess("File Uploaded Successfully")
        this.closefilepopup.nativeElement.click()
      }
      else {
        this.notification.showError(results.description)
      }
    })
  }

}
//previous

getpreviousholidaysummary(date, page){
  this.taservice.getholidaydetails(date, page).subscribe(result => {
    console.log('from place to place', result)
    this.previousholidaysummary = result['data']
    let datapagination = result['pagination']
    if (this.previousholidaysummary.length >= 0) {
      this.has_next = datapagination.has_next;
      this.has_previous = datapagination.has_previous;
      this.currentpage = datapagination.index;
    }
  })
}

getnextholidaysummary(date, page){
  this.taservice.getholidaydetails(date, page).subscribe(result => {
    console.log('from place to place', result)
    this.nextholidaysummary = result['data']
    let datapagination = result['pagination']
    if (this.nextholidaysummary.length >= 0) {
      this.has_next = datapagination.has_next;
      this.has_previous = datapagination.has_previous;
      this.currentpage = datapagination.index;
    }
  })
}

  }

 


  





