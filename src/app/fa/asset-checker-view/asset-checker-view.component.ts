import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { faservice } from '../fa.service';
import { faShareService } from '../share.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../error-handler.service';


@Component({
  selector: 'app-asset-checker-view',
  templateUrl: './asset-checker-view.component.html',
  styleUrls: ['./asset-checker-view.component.scss']
})
export class AssetCheckerViewComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  assetreject:Array<any>=[];
  assetcatlist: Array<any>=[];
  isassetmaker: boolean
  isassetbuk: boolean
  isinvoice: boolean=true;
  isexpense: boolean
  isassetwbuk: boolean
  view: String = "sa"
  ismakerCheckerButton: boolean;
  has_nextwbuk = true;
  has_previouswbuk = true;
  presentpagewbuk: number = 1;

  has_nextbuk = false;
  has_previousbuk = false;
  presentpagebuk: number = 1;
  pageSize = 10;
  presentpageloc=1;
  images:any='';
  // pageSize=10;
  btn_enabled:boolean=true;
  is_reject:boolean=true;
  imagearray=[];
  view_id:number=1;

  constructor(private errorHandler:ErrorHandlerService,private toast:ToastrService,private notification: NotificationService, private router: Router
    , private Faservice: faservice, private shareservice: faShareService,private spinner:NgxSpinnerService ) { }
  data1: any
  ngOnInit(): void {
    this.data1 = this.shareservice.checkerlist.value;
    console.log(this.data1);
    this.view_id=this.shareservice.asset_id.value;
    this.getassetmakerbsummary();
  }
  getassetmakerbsummary(pageNumber = 1, pageSize = 10) {

    this.spinner.show();
    if(this.view_id){
      this.assetcatlist=[];
    this.Faservice.getassetcategorysummaryadd(this.data1,this.presentpagebuk)
      .subscribe((result) => {
        this.spinner.hide();
        console.log("landlord", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.assetcatlist = datass;
        console.log("landlord", this.assetcatlist);
       
        for(let i=0;i<this.assetcatlist.length;i++){
          this.assetcatlist[i]['is_approved']=false;
        }
        if (this.assetcatlist.length >= 0) {
          this.has_nextbuk = datapagination.has_next;
          this.has_previousbuk = datapagination.has_previous;
          this.presentpagebuk = datapagination.index;
        }

      },
      (error:HttpErrorResponse)=>{
        
        this.spinner.hide();
        this.errorHandler.errorHandler(error,'');
      }
      )
    }
    else{
      this.assetcatlist=[];
      this.Faservice.getassetcategorysummaryaddgrp(this.data1)
      .subscribe((result) => {
        this.spinner.hide();
        console.log("landlord1=", result)
        let datass = result['data'];
        // let datapagination = result["pagination"];
        this.assetcatlist=datass;
        console.log("nongrp=", this.assetcatlist);
        // this.spinner.hide();
        for(let i=0;i<this.assetcatlist.length;i++){
          this.assetcatlist[i]['is_approved']=false;
        }
        if (this.assetcatlist.length >= 0) {
          // this.has_nextbuk = datapagination.has_next;
          // this.has_previousbuk = datapagination.has_previous;
          // this.presentpagebuk = datapagination.index;
        }

      },
      (error:HttpErrorResponse)=>{
        
        this.spinner.hide();
        this.errorHandler.errorHandler(error,'');
      }
      );

    }

  }
  approveall(e:any){
    if(e.currentTarget.checked){
    for(let i=0;i<this.assetcatlist.length;i++){
      this.assetcatlist[i]['is_approved']=true;
      this.btn_enabled=false;
    }
  }
  else{
    for(let i=0;i<this.assetcatlist.length;i++){
      this.assetcatlist[i]['is_approved']=false;
      this.btn_enabled=true;
    }
  }
  }
  approvedata(data:any,event){
    console.log(event.currentTarget.checked);
    if(event.currentTarget.checked){
    for(let i=0;i<this.assetcatlist.length;i++){
      if(this.assetcatlist[i].assetdetails_id==data.assetdetails_id){
        if(this.assetcatlist[i].assetdetails_status == 'PENDING'){
          // this.assetcatlist[i].is_approved=true;
          this.btn_enabled=false;
          this.is_reject=true;
        }
        if(Number(this.assetcatlist[i].assetgroup_id) == Number(0)){
          console.log('enter');
          this.assetreject.push(this.assetcatlist[i]['id']);
          this.is_reject=false;
          this.btn_enabled=false;
        }
        // else{
        //   this.is_reject=true;
        //   this.btn_enabled=false;
        // }
        this.assetcatlist[i].is_approved=true;
        
        
      }
     
    }
  }
  else{
    for(let i=0;i<this.assetcatlist.length;i++){
      if(this.assetcatlist[i].assetdetails_id==data.assetdetails_id){
        this.assetcatlist[i].is_approved=false;
        this.is_reject=true;
        this.btn_enabled=true;
        if(Number(this.assetcatlist[i].assetgroup_id) == Number(0)){
          this.is_reject=false;
          this.btn_enabled=true;
          let d:any=this.assetreject.indexOf(this.assetcatlist[i]['id'])
          this.assetreject.splice(d,1);
        }
      }
     
    }
  }
  for(let i of this.assetcatlist){
    if(i.is_approved){
      this.btn_enabled=false;
      break;
    }
  }

  }

  invoiceBtn() {
    this.isinvoice = true;
    this.isexpense = false;
  }

  expenseBtn() {
    this.isexpense = true;
    this.isinvoice = false;


  }
  imagepload(){
    console.log('enter')
  }
  assetView() {
    this.router.navigate(['/fa/assetmakeradd'], { skipLocationChange: true })
  }

  assetsplitView() {
    this.router.navigate(['/fa/assetmakersplit'], { skipLocationChange: true })


  }
  BackBtn() {
    this.router.navigate(['fa/assetcheckersummary'], { skipLocationChange: true });


  }


  buknextClick() {

    if (this.has_nextbuk === true) {
      this.presentpagebuk=this.presentpagebuk+1;
      this.getassetmakerbsummary(this.presentpagebuk + 1, 10)

    }
  }

  bukpreviousClick() {

    if (this.has_previousbuk === true) {
      this.presentpagebuk=this.presentpagebuk-1;
      this.getassetmakerbsummary(this.presentpagebuk - 1, 10)

    }
  }
  buttonclick: boolean
  dataBtn() {
    let data:any={'assetdetails_id':[]};
    for(let i=0;i<this.assetcatlist.length;i++){
      if(this,this.assetcatlist[i].is_approved){
      // console.log(this.assetcatlist[i]);
      data['assetdetails_id'].push(this.assetcatlist[i].id)

      }
    }
    this.buttonclick = true
    this.shareservice.button.next(this.buttonclick)
    console.log('buttonclick', data);
    this.spinner.show();
    this.Faservice.getcheckerapprover(data).subscribe((data:any)=>{
      console.log('welcome=',data);
      this.spinner.hide();

      // if(data['CbsStatus'][0].Status=="Success"){
      if(data.status=='success'){
        this.spinner.hide();
        this.toast.success('Approved Successfully');
        this.router.navigate(['fa/assetcheckersummary'], { skipLocationChange: false })
      }
      else{
        this.toast.warning(data.code)
        this.spinner.hide();
      }
      this.router.navigate(['fa/assetcheckersummary'], { skipLocationChange: false })
      
    },
    (error:HttpErrorResponse)=>{
      this.errorHandler.errorHandler(error,'');
      this.router.navigate(['fa/assetcheckersummary'], { skipLocationChange: false })
      // console.log(error);
      this.spinner.hide();
      // this.toast.warning(error.status +error.statusText)
    }
    )


  }
  imageview(i:number,data:any){
    this.imagearray=[];
    console.log('hii');

    let uint8array = new TextEncoder().encode(this.assetcatlist[i]['imagepath'][1]);
    let string = new TextDecoder().decode(uint8array);
    let dear=string.replace("b'",'').replace("'",'');
    this.images='data:image/png;base64,'+dear;
    console.log(Number(this.images));
    for(let i=0;i<data['imagepath'].length;i++){
      let uint8array = new TextEncoder().encode(data['imagepath'][i]);
      let string = new TextDecoder().decode(uint8array);
      let dear=string.replace("b'",'').replace("'",'');
      this.images='data:image/png;base64,'+dear;
      this.imagearray.push('data:image/png;base64,'+dear)
    }
    console.log(this.imagearray)
    // console.log(decode(this.images=this.assetcatlist[0]['imagepath'][0]));
    // this.images=decode(this.assetcatlist[0]['imagepath'][0]);
  }
  assetcheckerreject(){
   
    if(this.assetreject.length==0){
      this.toast.warning("Please Select Any Data:");
      return false;
    };
    console.log(this.assetreject);
    this.spinner.show();
  this.Faservice.getcheckerreject(this.assetreject[0],'').subscribe((data:any)=>{
    console.log('after=',data);
    if(data.status=="success"){
      this.spinner.hide();
      
      this.toast.success('Successfully Rejected');
      this.getassetmakerbsummary();
    }
    else{
      this.spinner.hide();
      console.log(data);
      this.toast.warning(data.code,"",{timeOut: 5000});
      this.toast.warning(data.description,"",{timeOut: 5000})
    }
   
  },
  (error:HttpErrorResponse)=>{
    // console.log(error);
    this.spinner.hide();
    this.errorHandler.errorHandler(error,'');
    // this.toast.error(error.status+error.statusText);
  }
  );
  }

}
