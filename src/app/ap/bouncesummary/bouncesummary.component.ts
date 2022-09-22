import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Ap1Service } from '../ap1.service';
import { Router } from '@angular/router'; 
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApShareServiceService } from '../ap-share-service.service';
@Component({
  selector: 'app-bouncesummary',
  templateUrl: './bouncesummary.component.html',
  styleUrls: ['./bouncesummary.component.scss']
})
export class BouncesummaryComponent implements OnInit {
  bounceform:any= FormGroup;
  crno:any;
  branch:any=[];
  ischeck=true;
  invoicetype:any=[];
  invtyp:any
  invoicedate:any;
  data:any=[];
  has_next = true;
  isLoading = false;
  has_previous = true;
  pageSizeApp = 10;
  da:any=[];
  presentpage:any=1;
  pageNumber:any;
  pageSize:any;
  intyp = ["Po", "Non-PO", "Advance,Emp","Emp Claim"];
  checknumb:number;
  routeData:any=[]
  RoutingECFValue:any=[]
  newDataRouting:any=[]
  constructor(private formbuilder: FormBuilder,private spinner:NgxSpinnerService,
    private service:Ap1Service,private router:Router,private datepipe:DatePipe,
    private shareservice:ApShareServiceService) { }

  ngOnInit(): void 
  {
    this.routeData = this.shareservice.commonsummary.value 
    this.RoutingECFValue = this.routeData['key']
    this.newDataRouting = this.routeData['data']

      this.bounceform = this.formbuilder.group(
        {
          crno: [''],
          intp:[],
          sup:[],
          bar:[],
          invoice_num:[''],
          inmt:[''],
          invoice_from_date: [''],
          raiser_employeename:[''],
          invoice_to_date: ['']
        });
        this.getbouncdet();
        this.getbranch();


        this.bounceform.get("bar").valueChanges.subscribe(
          value => {
            this.service.branchget(value).subscribe(data => {
              console.log('h');
               this.branch = data['data']
               console.log(this.branch)
             })
          }
        )
      
      }
      getbouncdet(){
        this.spinner.show();
        if(this.RoutingECFValue==1){
          console.log('santhoshECF',this.newDataRouting)
          this.data = this.newDataRouting
          this.spinner.hide();
        }
        else{        
          this.service.bouncedet({},this.presentpage).subscribe(data=>{
            console.log('Bounce=',data);
            this.data=data['data'];
            let datapagination = data["pagination"];
            this.spinner.hide();
            if (this.data.length > 0) {
              this.has_next = datapagination.has_next;
              this.has_previous = datapagination.has_previous;
              this.presentpage = datapagination.index;
            }
          })
        this.spinner.hide();
        return true;
        }
      }
      nextClick() {
        if (this.has_next === true) {
        this.presentpage=this.presentpage+1;
      this.getbouncdet();
        }
      }
    previousClick() {
        if (this.has_previous === true) {
    this.presentpage=this.presentpage-1;
    this.getbouncdet()
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
    search()
    {
      let values=this.bounceform.value.crno;
      let fill:any={};
     if(this.bounceform.get('crno').value !=null && this.bounceform.get('crno').value !='' ){
      fill['crno']=this.bounceform.get('crno').value;
     }
    if(this.bounceform.get('invoice_from_date').value !=null && this.bounceform.get('invoice_from_date').value !='' ){
      fill['update_fromdate']=this.datepipe.transform(this.bounceform.get('invoice_from_date').value,"yyyy-MM-dd");
     }
    if(this.bounceform.get('invoice_to_date').value !=null && this.bounceform.get('invoice_to_date').value !='' ){
      fill['update_todate']=this.datepipe.transform(this.bounceform.get('invoice_to_date').value,"yyyy-MM-dd");
     }
     if(this.bounceform.get('sup').value !=null && this.bounceform.get('sup').value !='' ){
      fill['sup']=this.bounceform.get('sup').value;
     }
     if(this.bounceform.get('invoice_num').value !=null && this.bounceform.get('invoice_num').value !='' ){
      fill['invoiceno']=this.bounceform.get('invoice_num').value;
     }
     if(this.bounceform.get('inmt').value !=null && this.bounceform.get('inmt').value !='' ){
      fill['invoiceamount']=this.bounceform.get('inmt').value;
     }
      
      let val=this.bounceform.value.crno;
      this.crno=this.bounceform.value.crno;
      this.service.bouncedet(fill,this.presentpage).subscribe(data=>{
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
      this.bounceform.reset();
      this.service.bouncedet({},this.presentpage).subscribe(data=>{
        console.log('rr=',data);
        this.data=data['data'];
      //   let datapagination = data["pagination"];
      //     if (this.data.length > 0) {
      //       this.has_next = datapagination.has_next;
      //        this.has_previous = datapagination.has_previous;
      //        this.presentpage = datapagination.index;
      // }
    })
    this.getbouncdet();
  }
  action(d)
  {
    this.router.navigateByUrl('/ap/bouncedetail');
    this.da=d;
    // console.log(d);
    this.service.dat.next(this.da);
  }
}
