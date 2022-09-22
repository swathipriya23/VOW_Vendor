import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import{FormControl,FormGroup,FormBuilder,Validators,FormArray} from '@angular/forms';
import {isBoolean} from 'util';
// import { formatDate } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import {TaService} from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import {ActivatedRoute, Router} from "@angular/router";
// import {Tourmaker} from '../tourmaker';

export const PICK_FORMATS = {
  parse: {dateInput: {month: 'short', year: 'numeric', day: 'numeric'}},
  display: {
      dateInput: 'input',
      monthYearLabel: {year: 'numeric', month: 'short'},
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'}
  }
};
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
          return formatDate(date,'dd-MMM-yyyy',this.locale);
      } else {
          return date.toDateString();
      }
  }
}

@Component({
  selector: 'app-tourapproval-view',
  templateUrl: './tourapproval-view.component.html',
  styleUrls: ['./tourapproval-view.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
    DatePipe
]
})

export class TourapprovalViewComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();  
   
  taAddForm:FormGroup
  currentDate: any = new Date();
  // date = new Date().toLocaleDateString();
  defaultDate = new FormControl(new Date());
  today = new Date();
  date=new Date();
  latest:any
  overall:any
 
  days:any
  tourmodel:any
  values=[];
  tourdata=[];
  stratdate:Date;
  enddate:Date;
  endatetemp:Date
  startdatetemp:Date
  starttdate:any
  fileData: File = null;
  previewUrl:any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  totall:number;
  select:any;
  selectto:any;
  total:any;
  a:any
  reasonlist:Array<any>
  isnew:boolean
  istaapprove:any
  
  

  constructor(private formBuilder: FormBuilder,private datePipe: DatePipe,private http: HttpClient,
    private notification :NotificationService,private taservice:TaService,
    public sharedService:SharedService,private route:Router,private activatedroute :ActivatedRoute) { 
    
  }
  //tourmodel= new Tourmaker(1,'',1,'','',3,'',1)
  ngOnInit(): void {
    let data =this.sharedService.summaryData.value
    if (data['id'] != 0){
      this.taservice.getTourmakereditSummary(data['id'])
        .subscribe((results: any[]) => {
        console.log("Tourmaker", results)
        this.tourmodel = results;
        
        
    })
    this.isnew = false;
   
    }
    else{
      this.tourmodel={
        requestno :'NEW',
        requestdate:Date.now(),
        reason:'',
        startdate:'',
        enddate :'',
        approval:'',
        durationdays:'7',
        ordernoremarks:'',
        permittedby:'',
        detail:[],
        // bank:'',
       
      };
      this.tourmodel.detail.push({
          startdate:'',
          enddate:'',
          startingpoint:'',
          placeofvisit:'',
          purposeofvisit:'',
      });

    }
    this.getreasonValue();
    
  }

  addSection() {
    this.tourmodel.detail.push({
        startdate:'',
        enddate:'',
        startingpoint:'',
        placeofvisit:'',
        purposeofvisit:''
    })
  }
  
  removeSection(i){
    this.tourmodel.detail.splice(i,1);
   }
  setDate(date: string) {
    this.date=new Date();
    this.latest=this.datePipe.transform(this.date, 'yyyy-MM-dd');
    this.currentDate = date
    this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    console.log("Datttee   " + this.currentDate)
    this.currentDate= this.datePipe.transform(new Date(),"dd-MM-yyyy");
    return this.currentDate;
  }
  
 
  removevalues(i){
    this.values.splice(i,1);

  }
  
  
   
  
   
  fileProgress(fileInput: any) {
      this.fileData = <File>fileInput.target.files[0];
      this.preview();
  }
 
  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
 
    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => { 
      this.previewUrl = reader.result; 
    }
  }
  fromDateSelection(event: string) {
    console.log("fromdate", event)
    const date = new Date(event)
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate() )
  }
  toDateSelection(event: string) {
    console.log("todate", event)
    const date = new Date(event)
    this.selectto = new Date(date.getFullYear(), date.getMonth(), date.getDate() )
    this.total=this.selectto-this.select;
    this.totall =this.total/(1000 * 60 * 60 * 24)
     console.log("baba",this.totall)
  }
  numberOnly(event) {
    var k;
    k = event.charCode;
    return ((k > 96 && k < 123) || (k >= 48 && k <= 57));
  }
  getreasonValue() {
    this.taservice.getreasonValue()
      .subscribe(result => {
        this.reasonlist = result['data']
        console.log("Reason", this.reasonlist)
      })
  }


  submitForm(){
    this.tourmodel.detail.forEach(currentValue => {
      currentValue.startdate = this.datePipe.transform(currentValue.startdate, 'yyyy-MM-dd');
      currentValue.enddate = this.datePipe.transform(currentValue.enddate, 'yyyy-MM-dd');
    });
    this.tourmodel.startdate = this.datePipe.transform(this.tourmodel.startdate, 'yyyy-MM-dd');
    this.tourmodel.enddate = this.datePipe.transform(this.tourmodel.enddate, 'yyyy-MM-dd');
    this.tourmodel.requestdate = this.datePipe.transform(this.tourmodel.requestdate, 'yyyy-MM-dd');
   this.taservice.createtourmaker(this.tourmodel)
    .subscribe(res=>{
      if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
        this.notification.showWarning("Duplicate! Code Or Name ...")
      } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
        this.notification.showError("INVALID_DATA!...")
      }
      else{
      this.notification.showSuccess("Inserted Successfully....")
      console.log("res", res)
      this.onSubmit.emit();
      return true
      }
    }
    )
    }


  

  onCancelClick() {
    this.onCancel.emit()
    this.route.navigateByUrl('ta/summary');
  
  }
  approve(){
    this.route.navigateByUrl('ta/approve');
  }
 
  
}
