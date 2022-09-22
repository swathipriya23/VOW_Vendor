import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Ap1Service } from '../ap1.service';
import { Router } from '@angular/router'; 
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-makersummary',
  templateUrl: './makersummary.component.html',
  styleUrls: ['./makersummary.component.scss']
})
export class MakersummaryComponent implements OnInit {
  maker:any= FormGroup;
  data:any=[];
  has_next = true;
  id:any;
  isLoading = false;
  has_previous = true;
  pageSizeApp = 10;
  parAppList: any;
  presentpage:any=1;
  pageNumber:any;
  pageSize:any;
  crno:any;
  branch:any=[];
  invoicetype:any=[];
  invoicedate:any;
  apinvoicehdr_id:any;
  raiser_employeename:any=[];
  invdate:any;
  intyp = ["Po", "Non-PO", "Advance,Emp","Emp Claim"];
  constructor(private formbuilder: FormBuilder,private spinner: NgxSpinnerService,private router:Router,private service:Ap1Service,private datepipe:DatePipe) { }

  ngOnInit() {
    this.maker = this.formbuilder.group(
      {
         date1: [''],
         date2: [''],
        crno: [''],
        intp:[],
        sup:[],
        bar:[],
        invoice_amount:[''],
        inmt:[''],
        invoice_from_date: [''],
        raiser_employeename:[''],
        invoice_to_date: ['']
      });
      this.spinner.show();
     this.service.apicallservice({},this.presentpage).subscribe(data=>{
       console.log('rr=',data);
       this.data=data['data'];
       let datapagination = data["pagination"];
       this.spinner.hide();
       
      if (this.data.length > 0) {
        this.has_next = datapagination.has_next;
         this.has_previous = datapagination.has_previous;
         this.presentpage = datapagination.index;
      }
     }
     )
      this.getbranch();
    this.maker.get("bar").valueChanges.subscribe(
      value => {
        this.service.branchget(value).subscribe(data => {
          console.log('h');
           this.branch = data['data']
           console.log(this.branch)
         })
      }
    )
  }
nextClick() {
    if (this.has_next === true) {
    //   this.service.apicallservice({}, this.presentpage+1)
    this.presentpage=this.presentpage+1;
       this.search();
    }
  }
previousClick() {
    if (this.has_previous === true) {
//       this.service.apicallservice({}, this.presentpage-1)
this.presentpage=this.presentpage-1;
this.search();
    }
  }
  search()
  {
    let values=this.maker.value.crno;
    let fill:any={};
   if(this.maker.get('crno').value !=null && this.maker.get('crno').value !='' ){
    fill['crno']=this.maker.get('crno').value;
   }
  if(this.maker.get('invoice_from_date').value !=null && this.maker.get('invoice_from_date').value !='' ){
    fill['invoice_from_date']=this.datepipe.transform(this.maker.get('invoice_from_date').value,"yyyy-MM-dd");
   }
  if(this.maker.get('invoice_to_date').value !=null && this.maker.get('invoice_to_date').value !='' ){
    fill['invoice_to_date']=this.datepipe.transform(this.maker.get('invoice_to_date').value,"yyyy-MM-dd");
    // let value=this.maker.value.sup;
    // let fil={
    //   "sup":value,
       
    }
    let val=this.maker.value.crno;
    this.crno=this.maker.value.crno;
    this.service.apicallservice(fill,this.presentpage).subscribe(data=>{
      console.log('rr=',data);
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
    this.maker.reset();
    this.service.apicallservice({},this.presentpage).subscribe(data=>{
      console.log('rr=',data);
      this.data=data['data'];
    })
    
  }
  action(d){
    this.router.navigateByUrl('/ap/checklist');
    this.invoicedate=d.invoice_date;
    this.apinvoicehdr_id=d.id;
    this.id=d.invoicetype.id
    console.log("ID",this.apinvoicehdr_id)
    console.log("Date=",this.invoicedate);
    this.service.inhed.next(this.apinvoicehdr_id);
    this.service.invdate.next(this.invoicedate);
    this.service.typid.next(this.id);
}
getbranch()
{
   this.service.branchget('').subscribe(data => {
    console.log('h');
     this.branch = data['data']
     console.log(this.branch)
   })
}
// getbranch(){
//   // let approverkeyvalue: String = "";
//   // // this.getApproverEmployee(approverkeyvalue);

//   this.maker.get('bar').valueChanges
//     .pipe(
//       debounceTime(100),
//       distinctUntilChanged(),
//       tap(() => {
//         this.isLoading = true;
       

//       }),
//       switchMap(value => this.service.branchget('')
//         .pipe(
//           finalize(() => {
//             this.isLoading = false
//           }),
//         )
//       )
//     )
//     .subscribe((results: any[]) => {
//       let datas = results["data"];
//       this.branch = datas;
//      console.log("branch",this.branch)

//     })

// }
}
