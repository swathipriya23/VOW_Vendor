import { Component, OnInit,ViewChild } from '@angular/core';
import { Ap1Service } from '../ap1.service';
import { NotificationService } from '../../service/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router'; 
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { fromEvent, Observable } from 'rxjs';
import { DatePipe, formatDate } from "@angular/common";
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
const d:any=new FormData();
export interface Status {
  id: number;
  text: string;
}
export const PICK_FORMATS = {
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
  selector: 'app-paymentfile',
  templateUrl: './paymentfile.component.html',
  styleUrls: ['./paymentfile.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
  ]
})
export class PaymentfileComponent implements OnInit {
  paymentfile:any= FormGroup;
  has_next = true;
  check:boolean=false;
  UPloadCSVFileData:any;
  isLoading = false;
  fil:any=[];
  has_previous = true;
  pageSizeApp = 10;
  bankselect:boolean=false;
  searchboolean=false;
  parAppList: any;
  presentpage:any=1;
  pageNumber:any;
  pageSize:any;
  dow:any;
  rowselect:boolean=false;
  data:any=[];
  bankbranch_id:any;
  branch:any=[];
  id:any;
  select_flag:any;
  select:boolean=false;
  pvlist:any=[];
  dear:any=[];
  fill:any={};
  downaledflage:boolean;
  bankname:any;
  time:any;
  file:any;
  formData:any=new FormData();
  isfileadd:boolean=false;
  statustyp:any;
  pvnu:any;
  getcototalcount:any;
  utrdisplayflage:boolean=false;
  status:  Observable<Status[]>
  statustype:Status[]=[{'id':6,'text':"PAYMENT INITIATED"},
  {'id':9,'text':"FILE INITIATED"},
  {'id':8,'text':"PAID"},
  {'id':12,'text':"ALL"},
  ];
  paymodetype:Status[]=[{'id':1,'text':"NEFT"},
  {'id':2,'text':"ERA"},
  ];
  date:any;
  latest_date:any;
  timedownaled:any;
  utrno = new FormControl("", Validators.required);
  neftflage:boolean;
  constructor(private service:Ap1Service,private notification: NotificationService,private router:Router,private spinner:NgxSpinnerService,private formbuilder: FormBuilder,private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.paymentfile = this.formbuilder.group(
      {
         bank: [],
         pdte:[],
        pvno: [],
        file:[],
        crno:[],
        status:[],
        paymodetype:[]
        });
        this.paymentget({},this.presentpage);
        this.acnoget();
        this.time = new Date();
        console.log("time",this.time)
        this.date = new Date();
        this.latest_date = this.datePipe.transform(this.date, "dd-MM-yyyy");
        this.timedownaled= this.date.getHours() + ":" +  this.date.getMinutes() + ":" +  this.date.getSeconds();
  }
  paymentget(data:any,page)
  {
    this.spinner.show();
    this.service.paymentfile(data,this.presentpage).subscribe(data=>{
      if(data?.code=="INVALID_DATA")
      {
        this.notification.showError(data?.description)
        this.spinner.hide();
      }
      else
      {
        console.log('File=',data);
        this.data=data['data'];
        let datapagination = data["pagination"];
        this.getcototalcount = data["pagination"]?.count;
        this.spinner.hide();
        
       if (this.data?.length > 0) {
         this.has_next = datapagination?.has_next;
          this.has_previous = datapagination?.has_previous;
          this.presentpage = datapagination?.index;
       }
      }
     
    }
    )
  }
  acnoget()
  {
    // this.select=true; not use
     this.service.acnodet('').subscribe(data => {
       this.branch = data['data']
       console.log(this.branch)
     })
  } 
   nextClick() {
    if (this.has_next === true) {
    this.presentpage=this.presentpage+1;
  this.paymentget(this.fill,this.presentpage);
  console.log("fill",this.fill)
  console.log("page",this.presentpage)
    }
  }
previousClick() {
    if (this.has_previous === true) {
this.presentpage=this.presentpage-1;
this.paymentget(this.fill,this.presentpage)
console.log("fill",this.fill)
console.log("page",this.presentpage)
    }
  }
 
  search( )
  
  {
    this.pvlist.splice(0, this.pvlist.length)
    console.log("this.pvlist",this.pvlist)
    this.rowselect=false
    // if(this.bankselect==false)
    // {
    //   this.notification.showWarning("Please Select Bank");
    // }
    // else{
    this.select=true;
    // this.searchboolean=true;
    
    // this fill:any={};
    if(this.paymentfile.get('bank').value !=null && this.paymentfile.get('bank').value !='' ){
      this.fill['bankdetails_id']=this.bankbranch_id;
    }
    if(this.paymentfile.get('pdte').value !=null && this.paymentfile.get('pdte').value !='' ){
      this.fill['paymentheader_date']=this.datePipe.transform(this.paymentfile.get('pdte').value,"yyyy-MM-dd");
    }
    if(this.paymentfile.get('pvno').value !=null && this.paymentfile.get('pvno').value !='' ){
      this.fill['pvno']=this.paymentfile.get('pvno').value;
    }
    if(this.paymentfile.get('crno').value !=null && this.paymentfile.get('crno').value !='' ){
      this.fill['crno']=this.paymentfile.get('crno').value;
    }
    if(this.paymentfile.get('paymodetype').value !=null && this.paymentfile.get('paymodetype').value !='' ){
      this.fill['paymodetype']=this.paymentfile.get('paymodetype').value;
    }
    console.log("filter",this.fill)

     this.spinner.show();
     this.service.paymentfile(this.fill,this.presentpage).subscribe(data=>{
       console.log('File=',data);
       this.data=data['data'];
       this.fil=data['data']
       let datapagination = data["pagination"];
       this.getcototalcount = data["pagination"]?.count;
       this.spinner.hide();
       
      if (this.data?.length > 0) {
        this.has_next = datapagination?.has_next;
         this.has_previous = datapagination?.has_previous;
         this.presentpage = datapagination?.index;
      }
     }
     )
  // }
}
  cancel()
  {
    this.select=false;
    this.bankselect=false;
    this.rowselect=false
    this.fill={};
  //  this.paymentfile.reset();
   this.paymentget({},1);
   this.paymentfile.reset();
  }
  download()
  {
    if(this.bankselect==false)
      {
        this.notification.showWarning("Please Select Bank");
      }
      else if(this.pvlist.length==0)
      {
        this.notification.showWarning("Please Select Atleast one Row");
      }
    else{
      this.spinner.show();
   this.service.downaled(this.bankbranch_id,this.dear).subscribe(data => {
     if(data?.code=="INVALID_DATA")
     {
      this.notification.showInfo(data?.description)
     }
     else
     {
      let binaryData = [];
      binaryData.push(data)
      console.log("file1",data)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download =this.bankname + " " + this.latest_date + " "  + this.timedownaled +".xlsx"
          link.click();  
        console.log("this.data",this.data)
        this.paymentget({},this.presentpage);
        this.spinner.hide();
     } 
    })
    }
  }
  bank(opt)
  {
    console.log(opt.id);
    this.bankbranch_id=opt?.id;
     this.bankselect=true;
    this.bankname=opt?.bankbranch?.bank?.name;
    console.log("bank", this.bankname)
  }
  checkbox(d,i,e)

  {
    if(d.status.text=="FILE INITIATED")
    {
      this.downaledflage=false
      // this.notification.showWarning("This File Already Downaled");
    }
    else if(this.select==false)
    {
      // this.downaledflage=false
      this.notification.showWarning("Please Select Bank");
    }
    else
    {
      
      this.downaledflage=true
    //particular row
    this.data[i].select_flag=!this.data[i].select_flag
    if(e.target.checked==true){
      // for(let i=0;i<this.data.length;i++){
        this.data[i].select_flag=true
        // if(this.data[i].select_flag==true)
        // {
        //   this.check=true
        //   this.pvlist.push(d.pvno)
        //   this.dear={
        //     "pvno_list":this.pvlist
        //     };
        //   console.log("pvno",this.dear)
        // }
        // else
        // {
        //   let index = this.pvlist.indexOf(e.target.value);
        //   this.pvlist.splice(index, 1);
        // }

      // }
      this.pvlist.push(d.pvno)
      this.dear={
            "pvno_list":this.pvlist
            };
            
            console.log("input",this.dear)
    }
    else {
      let index = this.pvlist.indexOf(d.pvno);
      this.pvlist.splice(index, 1);
    }
    console.log("list",this.dear)
    console.log("length",this.pvlist.length)
    
    }
  }
    // else{
    //   for(let i=0;i<this.data.length;i++){
    //     this.data[i].select_flag=false
    //   }
    // }
    // this.select=!this.select;
    // d.select_flag=!d.select_flag
    // console.log("d",d.select_flag)
    // console.log(this.select)
  // }
  checkselect(e,data){
    if(this.select==false)
    {
      this.notification.showWarning("Please Select Bank");
    }
    else
    {
    //entirecolumn
    this.rowselect=!this.rowselect
    console.log("length",this.fil.length)
    if(this.rowselect==true)
    {
      console.log("length",this.fil.length)
      for(let i=0;i<this.fil.length;i++)
      {
        if(this.fil[i].status.id!=9)
        {
          this.fil[i].select_flag=true
         this.pvlist.push(this.fil[i].pvno)
        }
      
      }
      this.dear={
        "pvno_list":this.pvlist
        };
        console.log("pvno",this.dear);
    }
      else 
      {
        for(let i=0;i<this.fil.length;i++){
          this.fil[i].select_flag=false
          let index = this.pvlist.indexOf(d.pvno);
          this.pvlist.splice(index, 1)
        }
        
      }
      console.log("pvno",this.dear);
   

    // if(e.target.checked==true){
    //   for(let i=0;i<this.data.length;i++){
    //     this.data[i].select_flag=true
    //   }
    // }
    // else{
    //   for(let i=0;i<this.data.length;i++){
    //     this.data[i].select_flag=false
    //   }
      
    // } 
    // console.log("length",this.pvlist.length) 
  }
}
  fileToUpload: File = null;
 
  uploaddata(event:any){
    console.log(event.target.files.length);
    for(let i=0;i<event.target.files.length;i++)
    {
      this.formData.append('file',event.target.files[i])
    }
    this.isfileadd=true;
   
  } 

  onFileSelectedBulkUpload() {
    if(this.isfileadd==false)
    {
      this.notification.showWarning("Please Add File to Upload")
    }
    else
    {
      this.spinner.show();
      this.service.uploadpaymentfile(this.formData).subscribe(data=>{
        if(data['status']=="success")
        {
          this.paymentfile.reset();
          this.paymentget({},this.presentpage);
          this.spinner.hide();
          this.notification.showSuccess(data['message'])
          this.isfileadd=false;
        }
        else
        {
          this.spinner.hide();
          this.paymentfile.reset();
          this.notification.showError(data['description'])
          this.isfileadd=false;
        }
      }
      )
    }
    
  }
  paiddata(data)
  {
    console.log("dtaa",data)
    let paymode=data?.apcredit['data'][0]?.paymode?.name
    if(paymode=="NEFT")
    {
      this.neftflage=true
    }
    else{
      this.neftflage=false
    }
    this.pvnu=data.pvno
  }
  paidfun()
  {
    this.spinner.show();
    let payinput={"paymentpvno_list":[{"Customer Ref no.":this.pvnu.toString(),"UTR RefNo":this.utrno.value}]}
    let file
    // var answer = window.confirm("Are you sure to Paid?");
    // if (!answer) {
    //   return false;
    // }
    console.log("sugu")
    this.service.paid(payinput,file)
    .subscribe(result => {
      if (result["status"] == "success") {
        this.paymentget(this.fill,this.presentpage);
        this.spinner.hide();
        this.notification.showSuccess(result["message"]);
        this.utrno.reset();
      }
      else
      {
        this.spinner.hide();
        this.notification.showError(result["message"]); 
        this.utrno.reset();   
      }
    })
  }
  selectionChangeType(event) {
    console.log("event",event) 
    if(event.isUserInput && event.source.selected == true){
      if(event.source.value.text=='PAYMENT INITIATED'){
        this.fill['status'] = 6 
        this.utrdisplayflage=false;
      }
      if(event.source.value.text=='FILE INITIATED'){
        this.fill['status'] = 9
        this.utrdisplayflage=false;
      }
      if(event.source.value.text=='PAID'){
        this.fill['status'] = 8
        this.utrdisplayflage=true;
      }
      if(event.source.value.text=='ALL'){
        this.fill['status'] = 12
        this.utrdisplayflage=true;
      }
      this.paymentget(this.fill,1)
    } 
    console.log("statustyp",this.data) 
  }
  paymodeType(event) {
    console.log("event",event) 
    if(event.isUserInput && event.source.selected == true){
      if(event.source.value.text=='NEFT'){
        this.fill['paymodetype'] = 6 
      }
      if(event.source.value.text=='ERA'){
        this.fill['paymodetype'] = 9
      }
      
      this.paymentget(this.fill,this.presentpage)
    } 
    console.log("statustyp",this.data) 
  }
}