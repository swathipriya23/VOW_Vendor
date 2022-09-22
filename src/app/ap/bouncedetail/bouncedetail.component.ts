import { Component, OnInit } from '@angular/core';
import { Ap1Service } from '../ap1.service';
import { ApService } from '../ap.service';
import { NotificationService } from '../../service/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router'; 
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { data } from 'jquery';
import { ApShareServiceService } from '../ap-share-service.service';
@Component({
  selector: 'app-bouncedetail',
  templateUrl: './bouncedetail.component.html',
  styleUrls: ['./bouncedetail.component.scss']
})
export class BouncedetailComponent implements OnInit {
  dt=this.service.dat.value
  rem = new FormControl('', Validators.required);
  RoutingECFValue: any;
  newDataRouting: any;
  constructor(private servce:ApService, private service:Ap1Service,private notification: NotificationService,
    private router:Router,private spinner:NgxSpinnerService, private shareservice:ApShareServiceService,private service1:ApService
    ) { }
  remark:any;
  sta=4;
  stat=5;
  bo:any=[];
  data:any=[]
  star=true;
  com=true;
  routeData:any=[];
  fileData: any;
  filename:any;
  presentpage: number = 1;
  identificationSize: number = 10;
  type=['exact',
        'supplier',
        'invoice_amount', 
        'invoiceno',
        'invoice_date']
  detflag=false
  exactList: any;
  withoutSuppList: any;
  withoutInvAmtList: any;
  withoutInvNoList: any;
  withoutInvDtList: any;
  viewtrnlist:any=[]
btnDisabled =false;
name:any;
designation:any;
branch:any;
apinvoicehdr_id:any;
invHdrID=this.service.inhed.value;
apHdrSummarydt:any=[]
bounceflage=false;
file:any;
fileid:any;
fileflage:boolean;
statusid:any;
ngOnInit(): void {
this.apinvoicehdr_id=this.service.inhed.value;
  this.routeData = this.shareservice.commonsummary.value 
  console.log("common",this.routeData)
  this.RoutingECFValue = this.routeData['key']
  this.newDataRouting = this.routeData['data'][0]
  this.getheader();
  console.log('santhosh',this.newDataRouting)
  console.log("bounceSummary",this.dt) 
  console.log("invhd",this.newDataRouting.apheader_id) 
  this.bounceflage=true;
  }

 crno : any
 getheader()
 {
   this.spinner.show()
   
   this.service1.getHdrSummary(this.newDataRouting.apheader_id)
    .subscribe(result => {
      console.log("data",result)
      this.apHdrSummarydt = result
      this.crno =this.apHdrSummarydt.crno
      this.statusid=this.apHdrSummarydt?.apinvoiceheader[0]?.status?.id
      console.log("status", this.statusid)
      if(this.apHdrSummarydt.apinvoiceheader[0].apfile.length!=0)
      {
        this.fileflage=true
        this.detflag=true
        this.fileid=this.apHdrSummarydt.apinvoiceheader[0].apfile[0].file_id   
        this.file=this.apHdrSummarydt.apinvoiceheader[0].apfile[0].filename
        console.log("flage", this.fileflage)
      }
      else
      {
        this.fileflage=false
        this.detflag=true      
        this.file="NO"
      }
      // 
      // this.filename=this.apHdrSummarydt.apinvoiceheader[0].apfile[0].filename
      console.log("det",this.apHdrSummarydt)      
      console.log("fileid",this.fileid)
    
      this.spinner.hide();
    })
   }
 //dedupe for type(exact)
  dedup()
  {  
this.service.getInwDedupeChk(this.apinvoicehdr_id,this.type[0])
.subscribe(result => {
  this.exactList = result['data']
  console.log("exactList",this.exactList)

  // let dataPagination = result['pagination'];
  // if (this.exactList.length >= 0) {
  //   this.has_next = dataPagination.has_next;
  //   this.has_previous = dataPagination.has_previous;
  //   this.presentpage = dataPagination.index;
  //   this.isSummaryPagination = true;
  // } if (this.exactList <= 0) {
  //   this.isSummaryPagination = false;
  // }        
},error=>{
  console.log("No data found")
}            
)
//dedupe for type(WITHOUT_SUPPLIER)
this.service.getInwDedupeChk(this.apinvoicehdr_id,this.type[1])
.subscribe(result => {
this.withoutSuppList = result['data']
console.log("WITHOUT_SUPPLIER List",this.withoutSuppList)
// let dataPagination = result['pagination'];
// if (this.exactList.length >= 0) {
//   this.has_next = dataPagination.has_next;
//   this.has_previous = dataPagination.has_previous;
//   this.presentpage = dataPagination.index;
//   this.isSummaryPagination = true;
// } if (this.exactList <= 0) {
//   this.isSummaryPagination = false;
// }        
},error=>{
console.log("No data found")
}            
)

//dedupe for type(WITHOUT_INVOICE_AMOUNT)
this.service.getInwDedupeChk(this.apinvoicehdr_id,this.type[2])
.subscribe(result => {
  this.withoutInvAmtList = result['data']
  console.log("WITHOUT_INVOICE_AMOUNT List",this.withoutInvAmtList)
  // let dataPagination = result['pagination'];
  // if (this.exactList.length >= 0) {
  //   this.has_next = dataPagination.has_next;
  //   this.has_previous = dataPagination.has_previous;
  //   this.presentpage = dataPagination.index;
  //   this.isSummaryPagination = true;
  // } if (this.exactList <= 0) {
  //   this.isSummaryPagination = false;
  // }        
},error=>{
  console.log("No data found")
}             
)

//dedupe for type(WITHOUT_INVOICE_NUMBER)
this.service.getInwDedupeChk(this.apinvoicehdr_id,this.type[3])
.subscribe(result => {
this.withoutInvNoList = result['data']
console.log("WITHOUT_INVOICE_NUMBER List",this.withoutInvNoList)
//   let dataPagination = result['pagination'];fileflage
//   if (this.exactList.length >= 0) {
//     this.has_next = dataPagination.has_next;
//     this.has_previous = dataPagination.has_previous;
//     this.presentpage = dataPagination.index;
//     this.isSummaryPagination = true;
//   } if (this.exactList <= 0) {
//    this.isSummaryPagination = false;
//   }        
},error=>{
console.log("No data found")
}            
)

//dedupe for type(WITHOUT_INVOICE_DATE)
this.service.getInwDedupeChk(this.apinvoicehdr_id,this.type[4])
.subscribe(result => {
  this.withoutInvDtList = result['data']
  console.log("WITHOUT_INVOICE_DATE List",this.withoutInvDtList)
  // let dataPagination = result['pagination'];
  // if (this.exactList.length >= 0) {
  //   this.has_next = dataPagination.has_next;
  //   this.has_previous = dataPagination.has_previous;
  //   this.presentpage = dataPagination.index;
  //   this.isSummaryPagination = true;
  // } if (this.exactList <= 0) {
  //   this.isSummaryPagination = false;
  // }        
},error=>{
  console.log("No data found")
} )           
  }
  audit()
  {
    this.service.bounceauditchecklist(this.apinvoicehdr_id).subscribe(data=>{
      this.data=data['data'];
      console.log(data)
    })
  }
  reaudit()
  {
    this.remark=this.rem.value
    console.log(this.invHdrID)
    let boui:any={
      "status_id":this.sta.toString(),
      "apinvoicehdr_id":this.invHdrID.toString(),
      "remark":this.remark.toString()
    }
    console.log(boui)
    this.spinner.show();
      this.service.bounce(boui).subscribe(data=>{
        this.spinner.hide();
        console.log(data)
       //  if(data['message']=="success"){
         this.notification.showSuccess(data['message']);
           this.router.navigateByUrl('/ap/commonsummary');
     
       //  }
       //  else{
       //   this.notification.showError(data['description']);
       //  }
       }
      )
  }
  reject()
  {
    this.remark=this.rem.value
    // this.apinvoicehdr_id=this.newDataRouting.id;
    // console.log(this.apinvoicehdr_id)
    let boui:any={
      "status_id":this.stat.toString(),
      "apinvoicehdr_id":this.invHdrID.toString(),
      "remark":this.remark.toString()
    }
    console.log(boui)
    
    this.spinner.show();
    this.service.bounce(boui).subscribe(data=>{
         this.spinner.hide();         
        this.notification.showSuccess(data['message']);

        this.router.navigateByUrl('/ap/commonsummary');     
       })
  }

  goBack(){
    this.router.navigate(['/ap/commonsummary'], {queryParams:{dropdownid: this.statusid}, skipLocationChange: true });  
  }
  selectFile(event) {
    this.fileData = event.target.files[0];

    // if (this.fileData.type == 'image/jpeg' || this.fileData.type == 'application/pdf') {

    // } else {
    //   alert("file type should be image of pdf")
    //   return;
    // }

  }
  viewtrn()
  {
    console.log("id",this.apinvoicehdr_id)
    this.service.viewtracation(this.apinvoicehdr_id).subscribe(data=>
     {
       this.viewtrnlist = data['data']
       console.log("trnDt",this.viewtrnlist)
     })
  }
  view(dt){
    this.name=dt.from_user.name
  //  this.designation=dt.from_user.designation
   this.branch=dt.from_user_branch.name
  }
  viewto(dt)
 {
  this.name=dt.to_user.name
  //  this.designation=dt.to_user.designation
   this.branch=dt.to_user_branch.name
 }
 getfiles() {
  if (this.fileflage==false)
  {
    this.notification.showWarning("No file Available")
  }
  else{
  this.service1.downloadfileapp(this.fileid)
    .subscribe((data) => {
      console.log("file",data)
      let binaryData = [];
      this.spinner.hide();
      binaryData.push(data)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          console.log("link",link)
          link.download =this.file
          link.click();  

    })
  }
}
 }


