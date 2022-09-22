import { Component, OnInit } from '@angular/core';
import { Ap1Service } from '../ap1.service';
import { NotificationService } from '../../service/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router'; 
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ApShareServiceService } from '../ap-share-service.service';
@Component({
  selector: 'app-rejectsummary',
  templateUrl: './rejectsummary.component.html',
  styleUrls: ['./rejectsummary.component.scss']
})
export class RejectsummaryComponent implements OnInit {
data:any[];
rejectsum:any= FormGroup;
reject:any=FormGroup;
crno:any;
branch:any=[];
ischeck=true;
invoicetype:any=[];
invtyp:any
invoicedate:any;
has_next = true;
intp:any;
isLoading = false;
has_previous = true;
pageSizeApp = 10;
presentpage:any=1;
pageNumber:any;
pageSize:any;
typ = ["Courier", "direct"];
editable: boolean = false;
intyp = ["Po", "Non-PO", "Advance,Emp","Emp Claim"];
routeData:any=[]
RoutingECFValue:any=[]
newDataRouting:any=[]
constructor(private service:Ap1Service,private formbuilder: FormBuilder,
  private notification: NotificationService,private router:Router,
  private spinner:NgxSpinnerService,private datepipe:DatePipe, 
  private shareservice:ApShareServiceService) { }

  ngOnInit(): void {
    this.routeData = this.shareservice.commonsummary.value 
    this.RoutingECFValue = this.routeData['key']
    this.newDataRouting = this.routeData['data']

    this.rejectsum = this.formbuilder.group(
      {
        crno: [''],
        intp:this.typ[0],
        sup:[],
        bar:[],
        invoice_num:[''],
        inmt:[''],
        invoice_from_date: [''],
        fro_date: [],
        awb:[],
        raiser_employeename:[''],
        invoice_to_date: ['']
      });
      this.reject = this.formbuilder.group(
        {
           intp:this.typ[0],
          fro_date: [''],
          awb:[''],
          add:[''],
          sta:[''],
          dist:[''],
          city:[''],
          pin:['']
        });
      this.rejectsum.get("bar").valueChanges.subscribe(
        value => {
          this.service.branchget(value).subscribe(data => {
            console.log('h');
             this.branch = data['data']
             console.log(this.branch)
           })
        }
      )
      this.rejectsumd();
      this.getbranch();
    }
    rejectsumd()
    {
      this.spinner.show();
      if(this.RoutingECFValue==1){
        console.log('santhoshECF',this.newDataRouting)
        this.data = this.newDataRouting
        this.spinner.hide();
      }
      else{  
        this.service.rejectsumry({},1).subscribe(data=>{
          console.log('reject=',data);
          this.data=data['data'];
          let datapagination = data["pagination"];
          this.spinner.hide();
          
          if (this.data.length > 0) {
            this.has_next = datapagination.has_next;
            this.has_previous = datapagination.has_previous;
            this.presentpage = datapagination.index;
          }
        })
      }
    }
    search()
    {
      let values=this.rejectsum.value.crno;
      let fill:any={};
     if(this.rejectsum.get('crno').value !=null && this.rejectsum.get('crno').value !='' ){
      fill['crno']=this.rejectsum.get('crno').value;
     }
    if(this.rejectsum.get('invoice_from_date').value !=null && this.rejectsum.get('invoice_from_date').value !='' ){
      fill['invoice_fromdate']=this.datepipe.transform(this.rejectsum.get('invoice_from_date').value,"yyyy-MM-dd");
     }
    if(this.rejectsum.get('invoice_to_date').value !=null && this.rejectsum.get('invoice_to_date').value !='' ){
      fill['invoice_todate']=this.datepipe.transform(this.rejectsum.get('invoice_to_date').value,"yyyy-MM-dd");
     }
     if(this.rejectsum.get('sup').value !=null && this.rejectsum.get('sup').value !='' ){
      fill['sup']=this.rejectsum.get('sup').value;
     }
     if(this.rejectsum.get('invoice_num').value !=null && this.rejectsum.get('invoice_num').value !='' ){
      fill['invoiceno']=this.rejectsum.get('invoice_num').value;
     }
     if(this.rejectsum.get('inmt').value !=null && this.rejectsum.get('inmt').value !='' ){
      fill['invoiceamount']=this.rejectsum.get('inmt').value;
     }
      
      let val=this.rejectsum.value.crno;
      this.crno=this.rejectsum.value.crno;
      this.service.rejectsumry(fill,this.presentpage).subscribe(data=>{
        console.log('search=',data);
        this.data=data['data'];
        let datapagination=data['pagination'];
        if (this.data.length > 0) {
          this.has_next = datapagination.has_next;
           this.has_previous = datapagination.has_previous;
           this.presentpage = datapagination.index;
        }
      });
      console.log("Crno",this.crno)
       console.log("Crno",this.crno)
    }
    cancel()
    {
      this.rejectsum.reset();
      this.service.rejectsumry({},this.presentpage).subscribe(data=>{
        console.log('rr=',data);
        this.data=data['data'];
      //   let datapagination = data["pagination"];
      //     if (this.data.length > 0) {
      //       this.has_next = datapagination.has_next;
      //        this.has_previous = datapagination.has_previous;
      //        this.presentpage = datapagination.index;
      // }
    })
    this.rejectsumd();
  }
  nextClick() {
    if (this.has_next === true) {
    this.presentpage=this.presentpage+1;
  this.rejectsumd();
    }
  }
previousClick() {
    if (this.has_previous === true) {
this.presentpage=this.presentpage-1;
this.rejectsumd()
    }
  }
  getbranch()
  {
     this.service.branchget('').subscribe(data => {
      console.log('h');
       this.branch = data['data']
       console.log(this.branch)
     })
  } 
  context: string

openFile(event: any): void {
  const input = event.target;
  const reader = new FileReader();
  reader.onload = (() => {
    if (reader.result) {
      this.context = JSON.parse(reader.result.toString())
      console.log(JSON.parse(reader.result.toString()));
    }
  });
  reader.readAsText(input.files[0], 'utf-8');
  }
}
