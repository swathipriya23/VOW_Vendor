import { DatePipe, formatDate } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { WindowInterruptSource } from '@ng-idle/core';
// import { event } from 'jquery';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from '../error-handler.service';
import { faservice } from '../fa.service';
import { faShareService } from '../share.service';
// const moment = _rollupMoment || _moment;

import { NativeDateAdapter } from '@angular/material/core';
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
}
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'app-fa-depreciation-cal',
  templateUrl: './fa-depreciation-cal.component.html',
  styleUrls: ['./fa-depreciation-cal.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ],
})

export class FaDepreciationCalComponent {
  hideFlag: boolean = false;
  
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  
  month:any = {'Jan':1,'Feb':2,'Mar':3,'Apr':4,'May':5,'Jun':6,'Jul':7,'Aug':8,'Sep':9,'Oct':10,'Nov':11,'Dec':12}
  datearray: Array<any>=[];
  startDate: any;
  endDate: any;
  itDate: any;
  date1: any;
  str1:any;
  str2:any;
  listcomments: any = [];
  totalRecords: any = [];
  selected: string;
  filter: any;
  array = ['IT','Regular','Forecasting'];
  has_nextbuk = true;
  has_previousbuk = true;
  presentpagebuk: number = 1;
  datapagination:any=[];
  pageSize = 10;
  radioFlag:any = '4'
  statusCheck = false
  downloadForecastFlag = true
  downloadRegularFlag = true

  floatLabelControl = new FormControl('auto');
  // date = new FormControl(moment());
  m1: number;
  m2: number;
  valid_date=new Date();
  mo1: any;
  mo2:any;
  da1:any;
  da2:any;
  yr1:any;
  yr2:any;
  pageNumber: number;
  depreciationform:any= FormGroup;
  fromdate = new FormControl(new Date());
  todate = new FormControl(new Date());
  itdate = new FormControl(new Date());
  latest_date: string;
  description = "INVALID_DATE"
  first:boolean=false;
 
  constructor(private errorHandler:ErrorHandlerService, private router: Router, private share: faShareService, private http: HttpClient,
    private Faservice: faservice, public datepipe: DatePipe, private toastr:ToastrService, private spinner: NgxSpinnerService, private fb: FormBuilder ) { }


  ngOnInit(): void {
    this.depreciationform =new FormGroup({
      'fromdate':new FormControl(),
      'todate':new FormControl(),
      'itdate':new FormControl(),
      'regdate':new FormControl('')
    });

    this.latest_date =this.datepipe.transform(this.valid_date, 'yyyy-MM-dd');


    this.getApi();
  }

  getApi(){
      this.spinner.show()
      this.Faservice.getdepreciation().subscribe((data) => {
        console.log( data);
          // this.spinner.show();
          this.listcomments = data['data'];
          this.datapagination = data['pagination'];
          console.log('d-',data['data']);
          if (this.listcomments.length >= 0) {
            this.has_nextbuk = this.datapagination.has_next;
            this.has_previousbuk = this.datapagination.has_previous;
            this.presentpagebuk = this.datapagination.index;
          }
          this.spinner.hide()
          },
          (error:HttpErrorResponse)=>{
            console.log(error);
            this.errorHandler.errorHandler(error,'');
            this.spinner.hide();
          }) 
          // setTimeout(() => {
          // /** spinner ends after 3 seconds */
          // this.spinner.hide();
          // }, 3000);
        }

  // chosenYearHandler(normalizedYear: Moment) {
  //   const ctrlValue = this.date.value;
  //   ctrlValue.year(normalizedYear.year());
  //   this.date.setValue(ctrlValue);
  // }

  // chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
  //   const ctrlValue = this.date.value;
  //   ctrlValue.month(normalizedMonth.month());
  //   this.date.setValue(ctrlValue);
  //   datepicker.close();
  // }

  // chosenDateHandler(normalizedDate: Moment) {
  //   const ctrlValue = this.date.value;
  //   ctrlValue.date(normalizedDate.date() - this.date1.getdate());
  //   this.date.setValue(ctrlValue);
  // }

  onsubmit(){
    
}

radioChange(event: MatRadioChange) {
  console.log(event.value);
  if(event.value == 'Regular'){
    this.radioFlag = '1'
    this.hideFlag = false
  }
  else if(event.value == 'Forecasting'){
    this.radioFlag = '4'
    this.hideFlag = false
  }
  else if(event.value == 'IT'){
    this.radioFlag = '5'
    this.hideFlag = true
  }
  console.log('radio_flag ',this.radioFlag);
}

searchFor(){
  if(this.radioFlag == '5'){
    this.datearray.push(this.itDate.toString().split(" ")[1]);  //month
    this.datearray.push(this.itDate.toString().split(" ")[2]);  //day
    this.datearray.push(this.itDate.toString().split(" ")[3]);  //year
    console.log(this.datearray)
    const month1 = this.datearray[0].toString(); //month convert string
    this.da1 = this.datearray[1]
    this.mo1 = this.month[month1]
    this.yr1 = this.datearray[2]
    this.str1 = `${this.yr1}-${this.mo1}-${this.da1}`;
    this.calSearch();
  }
  else{
    this.datearray.push(this.startDate.toString().split(" ")[1]);  //month
    this.datearray.push(this.startDate.toString().split(" ")[2]);  //day
    this.datearray.push(this.startDate.toString().split(" ")[3]);  //year
    this.datearray.push(this.endDate.toString().split(" ")[1]);  //month
    this.datearray.push(this.endDate.toString().split(" ")[2]);  //day
    this.datearray.push(this.endDate.toString().split(" ")[3]);  //year
    console.log(this.datearray)
    const month1 = this.datearray[0].toString(); //month convert string
    const month2 = this.datearray[3].toString();
    this.da1 = this.datearray[1]
    this.mo1 = this.month[month1]
    console.log('month1', this.mo1);
    this.yr1 = this.datearray[2]
    this.da2 = this.datearray[4]
    this.mo2 = this.month[month2]
    this.yr2 = this.datearray[5]
    this.str1 = `${this.yr1}-${this.mo1}-${this.da1}`;
    console.log('month1', this.str1);
    this.str2 = `${this.yr2}-${this.mo2}-${this.da2}`;
    this.calSearch();
  }
}

buknextClick() {
  console.log(this.has_nextbuk,this.has_previousbuk,this.presentpagebuk)
  if (this.has_nextbuk === true) {
    this.spinner.show();
      setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
      }, 3000);
    this.Faservice.getdepreciation(this.pageNumber = this.presentpagebuk + 1, 30).subscribe(data => {
      console.log(data)
      this.listcomments = data['data'];
      this.datapagination = data['pagination'];
      console.log('d-',data['data']);
      console.log('page',this.datapagination)
      if (this.listcomments.length >= 0) {
        this.has_nextbuk = this.datapagination.has_next;
        this.has_previousbuk = this.datapagination.has_previous;
        this.presentpagebuk = this.datapagination.index;
      }
      },
      (error:HttpErrorResponse)=>{
        this.errorHandler.errorHandler(error,'');
      }
      ) 

  }
}

bukpreviousClick() {
  if (this.has_previousbuk === true) {
    this.spinner.show();
      setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
      }, 3000);
    this.Faservice.getdepreciation(this.pageNumber = this.presentpagebuk - 1, 30).subscribe(data => {
      console.log(data)
      this.listcomments = data['data'];
      this.datapagination = data['pagination'];
      console.log('d-',data['data']);
      console.log('page',this.datapagination)
      if (this.listcomments.length >= 0) {
        this.has_nextbuk = this.datapagination.has_next;
        this.has_previousbuk = this.datapagination.has_previous;
        this.presentpagebuk = this.datapagination.index;
      }
      },
      (error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.errorHandler.errorHandler(error,'');
      }
      ) 


  }
}


calSearch(){
  this.spinner.show();
  if(this.radioFlag == '5'){
    this.toastr.warning('Wait for 7 Mins');
    this.Faservice.getDepreciationCalIT(this.str1).subscribe(result=>{
      console.log(result);
      this.spinner.hide();
      if(result.description == this.description){
        this.toastr.error('ALREADY DEPRECIATION RUN FOR THE ASSET.')
      }
      else if(result['status']=='success'){
      this.toastr.success('success');
      }
      else{
        this.toastr.warning(result['code']);
        this.toastr.warning(result['description']);
      }
    },
    (error:HttpErrorResponse)=>{
      console.log(error);
      this.spinner.hide();
      this.errorHandler.errorHandler(error,'');
    })
  }
  else{
    this.toastr.warning('Wait for 7 Mins');
    this.Faservice.getDepreciationCal(this.str1,this.str2,this.radioFlag).subscribe(result=>{
      console.log(result);
      this.spinner.hide();
      if(result.description == this.description){
        this.toastr.error('ALREADY DEPRECIATION RUN FOR THE ASSET.')
      }
      else if(result['status']=='success'){
        this.toastr.success('success');
        }
        else{
          this.toastr.warning(result['code']);
          this.toastr.warning(result['description']);
        }
    },
    (error:HttpErrorResponse)=>{
      console.log(error);
      this.errorHandler.errorHandler(error,'');
      this.spinner.hide();
    })
  }
  this.depreciationform.reset()
  this.datearray.length = 0;

}

regularPrepare(){
  //#endregionif(this.date)
  if(this.depreciationform.get('regdate').value ==undefined || this.depreciationform.get('regdate').value =='' || this.depreciationform.get('regdate').value ==null){
    this.toastr.warning('Please Select The Valid Date');
    return false;
  }
  console.log(this.depreciationform.value)
  // console.log(this.date);
  // console.log(this.date.value)
  let date_valied=this.depreciationform.get('regdate').value;
  let data={'year':date_valied.getFullYear(),'month':date_valied.getMonth()}
  this.spinner.show();
  this.toastr.show('Wait for 7 Mins');
  this.Faservice.getDepreciationRegularPrepare(date_valied.getFullYear(),date_valied.getMonth()+1).subscribe(result=>{
    console.log(result);
    setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
      }, 3000);
    if(result['code'] !=undefined && result['code'] !=""){
      this.toastr.warning(result['code']);
      this.toastr.warning(result['description']);
    }
    else{
      alert('Success');
      this.downloadRegularFlag = false
    }
   
  },
  (error:HttpErrorResponse)=>{
    console.log(error);
    this.errorHandler.errorHandler(error,'');
    this.spinner.hide();
  })
}

forecastPrepare(){
  console.log(this.depreciationform.value);
  if(this.depreciationform.get('regdate').value ==undefined || this.depreciationform.get('regdate').value =='' || this.depreciationform.get('regdate').value ==null){
    this.toastr.warning('Please Select The Valid Date');
    return false;
  }
  let date_valied=this.depreciationform.get('regdate').value;
  this.spinner.show();
  this.toastr.show('Wait for 7 Mins');
  this.Faservice.getDepreciationForecastPrepare(date_valied.getFullYear(),date_valied.getMonth()+1).subscribe(result=>{
    this.spinner.hide();
    console.log(result);
    if(result['status']=='success'){
      setTimeout(() => {
        /** spinner ends after 3 seconds */
        this.spinner.hide();
        }, 3000);
      alert('Success');
      this.downloadForecastFlag = false
    }
    else{
      this.toastr.warning(result['code']);
      this.toastr.warning(result['description']);
    }
   
  },
  (error:HttpErrorResponse)=>{
    console.log(error);
   this.errorHandler.errorHandler(error,'');
    this.spinner.hide();
  })
}

tempDownload(){
  this.spinner.show();
  this.Faservice.getDepreciationTempForecastPrepare().subscribe(result=>{
    let binaryData = [];
    binaryData.push(result)
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    let date: Date = new Date();
    link.download = 'DetailedReport'+ date +".xlsx";
    link.click();
    this.toastr.success('Success');
    setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
      }, 3000);
      },
      (error:HttpErrorResponse)=>{
        console.log(error);
        this.errorHandler.errorHandler(error,'file');
        this.spinner.hide();
      })}

tempRegularDownload(){
  this.spinner.show();
  this.Faservice.getDepreciationTempRegularPrepare().subscribe(result=>{
    let binaryData = [];
    binaryData.push(result)
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    let date: Date = new Date();
    link.download = 'RegularReport'+ date +".xlsx";
    link.click();
    this.toastr.success('Success');
    setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
      }, 3000);
      },
      (error:HttpErrorResponse)=>{
        console.log(error);
        this.errorHandler.errorHandler(error,'file');
        this.spinner.hide();
      })}


forecastDownload(){
  this.Faservice.getDepreciationForecastDownload().subscribe(result=>{
    let binaryData = [];
    binaryData.push(result)
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    let date: Date = new Date();
    link.download = 'DetailedReport'+ date +".xlsx";
    link.click();
    this.toastr.success('Success');
  },
  (error:HttpErrorResponse)=>{
    console.log(error);
    this.spinner.hide();
    this.errorHandler.errorHandler(error,'');
  })
}

regularDownload(){
  this.Faservice.getDepreciationRegularDownload().subscribe(result=>{
    let binaryData = [];
    binaryData.push(result)
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    let date: Date = new Date();
    link.download = 'RegularReport'+ date +".xlsx";
    link.click();
    this.toastr.success('Success');
  },
  (error:HttpErrorResponse)=>{
    console.log(error);
    this.spinner.hide();
    this.errorHandler.errorHandler(error,'file');
  })
}
download_file(){
  if(this.first==true){
    this.toastr.warning('Already Work In Progress Please Wait..');
    return true;
  }
  else{
    this.first=true;
    this.Faservice.downloadfile_depreciation().subscribe(
      (response: any) =>{
          this.first=false;
          let filename:any='document';
          let dataType = response.type;
          let binaryData = [];
          binaryData.push(response);
          let downloadLink:any = document.createElement('a');
          console.log()
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
          
          downloadLink.setAttribute('download',filename);
          document.body.appendChild(downloadLink);
          downloadLink.click();
      },
      (error:HttpErrorResponse)=>{
        this.first=false;
        this.errorHandler.errorHandler(error,'file');
      }
  )
  }
  
}
}