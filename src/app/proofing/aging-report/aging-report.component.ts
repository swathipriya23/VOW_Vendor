import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProofingService } from '../proofing.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlingService } from 'src/app/ta/error-handling.service';

const datePickerFormat = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

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
  selector: 'app-aging-report',
  templateUrl: './aging-report.component.html',
  styleUrls: ['./aging-report.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: datePickerFormat },
    DatePipe
  ],
})
export class AgingReportComponent implements OnInit {
  from_Date: string;
  public page = 1;
  public pageSize = 10
  knockForm: FormGroup;
  to_Date: string;
  AccountList: any;
  agingdatas: any;
  reportview: any;
  agingsearchdatas: any;
  days: any;
  from_days: number;
  to_days: number;
  binaryData: any[];
  downloadUrl: string;
  pdfSrc: string;
  displayagingvalue: boolean=false;
  accountnohidden:boolean=false;
  fromDatehidden: boolean=false;

  constructor(private errorHandler: ErrorHandlingService,private datePipe: DatePipe,private toastr:ToastrService,private SpinnerService:NgxSpinnerService, private fb: FormBuilder,private proofingService: ProofingService) { }

  ngOnInit(): void {
    this.aging()
    this.knockForm = this.fb.group({
      fromdate:[''],
      todate:[''],
      account_no:['']
    })

  }
  // colorDta=["red","blue"]
  todatemin
  fromDatechange(date: any) {
    let comDate = date
    comDate = this.datePipe.transform(comDate, 'yyyy-MM-dd');
    console.log("comp=>",comDate,this.from_Date)
    console.log(date)
    if(this.from_Date!=date && this.to_Date!=''){
      this.knockForm.controls['todate'].reset('')
    }
    if(date==''|| date==null|| date==undefined){
      console.log("kf=>",this.knockForm )
      this.knockForm.controls['todate'].reset('')
      this.fromDatehidden=false
      this.accountnohidden=false
      
    }else{
     
      this.fromDatehidden=true
      this.accountnohidden=false
    }
    
    const dateStr = date.getFullYear() + '-' + (date.getMonth()+1) +  '-' + (date.getDate()+1);
    this.todatemin = this.datePipe.transform(dateStr, 'yyyy-MM-dd');
    console.log("dateStr=>",this.todatemin)
    this.from_Date = date
    this.from_Date = this.datePipe.transform(this.from_Date, 'yyyy-MM-dd');
    console.log(this.from_Date)
    
   
    return this.from_Date;
  }

  toDatechange(date: string) {
    if(date==''|| date==null){
      this.fromDatehidden=true
      this.accountnohidden=false
    }else{ 
    this.fromDatehidden=true
    this.accountnohidden=true
    }
    
    this.to_Date = date
    this.to_Date = this.datePipe.transform(this.to_Date, 'yyyy-MM-dd');
    
    return this.to_Date;
  }
  getAccountList() {
    this.proofingService.getAccount_List()
      .subscribe((results: any) => {
        let data = results['data'];
        this.AccountList = data;
      })
  }
  agingSearch(){
    console.log(this.knockForm,this.from_Date)
    if ((this.from_Date === undefined) || (this.from_Date === '')|| (this.from_Date===null)) {
      this.toastr.warning('', 'Please Select From Date', { timeOut: 1500 });

      return false;
    }
    if(this.to_Date<=this.from_Date){
      this.toastr.warning('', 'End from date must be greater than to date', { timeOut: 1500 });
      return false;
    }
    if ((this.to_Date === undefined) || (this.to_Date === '')|| (this.to_Date===null)) {
      this.toastr.warning('', 'Please Select To Date', { timeOut: 1500 });

      return false;
    }

    if ((this.knockForm.value.account_no === undefined) || (this.knockForm.value.account_no === '')|| (this.knockForm.value.account_no===null)) {
      this.toastr.warning('', 'Please Select Account Number', { timeOut: 1500 });

      return false;
    }
    
    let agingsearch={
      "from_date":this.from_Date ,
      "to_date":this.to_Date ,
      "account_id": this.knockForm.value.account_no,
    }
    this.SpinnerService.show()
  
    this.proofingService.agingsearch(agingsearch)
      .subscribe((results: any) => {
    this.SpinnerService.hide()

        console.log(results.data)
        let data=results.data
        this.agingsearchdatas=data
        if(this.agingsearchdatas.length==0){
          this.displayagingvalue=false
        }else{
          this.displayagingvalue=true
          
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  aging(){
    console.log(this.knockForm,this.from_Date)
    
    let agingsearch={
      "from_date":"",
      "to_date":"",
      "account_id":"",
    }
    this.SpinnerService.show()
  
    this.proofingService.aging(agingsearch)
      .subscribe((results: any) => {
        this.SpinnerService.hide()
        console.log(results.data)
        let data=results.data
        this.agingsearchdatas=data
        if(this.agingsearchdatas.length==0){
          this.displayagingvalue=false
          
        }else{
          this.displayagingvalue=true
        }

        // for(let agin of this.agingsearchdatas){
        //   if(agin[0] ?.order==1){
        //     console.log("agin")
        //     this.days="0-149 Days"
        //   }
        //   if(agin[0] ?.order==2){
        //     this.days="150-179 Days"
        //   }
        //   if(agin[0] ?.order==3){
        //     this.days="180-189 Days"
        //   }
        //   if(agin[0] ?.order==4){
        //     this.days="190-200 Days"
        //   }
        //   if(agin[0] ?.order==5){
        //     this.days=">200 Days"
        //   }
        // }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  agingreport_view(aging){
    this.reportview=aging
    // for(let aging of this.reportview ){
      console.log(aging[0])
      if(aging[0].order==1){
        this.from_days=0
        this.to_days=149
        
      }
      if(aging[0].order==2){
        this.from_days=150
        this.to_days=179
        

      }
      if(aging[0].order==3){
        this.from_days=180
        this.to_days=189
        

      }
      if(aging[0].order==4){
        this.from_days=190
        this.to_days=200
        

      }
      if(aging[0].order==5){
        this.from_days=200
        this.to_days=1000
        

      }
      
    // }
    console.log("this.days=>",this.from_days,this.to_days)
    if(aging.length==1){
      this.toastr.warning('No Data Found');
      return false;
    }
    console.log(aging)
  }
  agingClear(){
    console.log(this.knockForm)
    
    this.displayagingvalue=true;
    this.accountnohidden=false;
    this.fromDatehidden=false;
    this.knockForm.reset('')
    // this.knockForm.value['to_date'].reset('')
    // this.knockForm.value['account_id'].reset('')
    this.aging()
    
  }
  downloadexl(){
    let name =  'Aging Report'
    let params
    if(this.from_Date !=""){

      params={
        "fromdate":this.from_Date ,
        "todate":this.to_Date ,
        
      }
    }else{
      params={
        
      }
    }
    

    this.proofingService.aging_exceldownload(this.from_days,this.to_days,params)
      .subscribe((data: any) => {
        
        
            let binaryData = [];
            binaryData.push(data)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            link.download = name + ".xlsx";
            link.click();
      })
  }
  downloadexlsearch(){
    let name =  'Aging Report'
    let params={
      "fromdate":this.from_Date ,
      "todate":this.to_Date ,
    
    }
    this.proofingService.transactiondownload(this.knockForm.value.account_no,params)
      .subscribe((data: any) => {
        
        
            let binaryData = [];
            binaryData.push(data)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            link.download = name + ".xlsx";
            link.click();
      })
  }
}
