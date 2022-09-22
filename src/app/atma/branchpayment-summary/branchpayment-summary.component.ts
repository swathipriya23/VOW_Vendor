import { Component, OnInit } from '@angular/core';
import {AtmaService} from '../atma.service';
import {NotificationService} from '../notification.service'
import { ShareService } from '../share.service'
import {Router} from '@angular/router'

@Component({
  selector: 'app-branchpayment-summary',
  templateUrl: './branchpayment-summary.component.html',
  styleUrls: ['./branchpayment-summary.component.scss']
})
export class BranchpaymentSummaryComponent implements OnInit {
  getBranchList:Array<any>;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage:number = 1;
  pageSize = 10;

  mainbid:any;
  constructor(private atmaservice :AtmaService,
    private notification:NotificationService,private shareService: ShareService,private router:Router,) { }


  ngOnInit(): void {
    this.branchdetails();
    this.getpaymentsummary();
 
  }
  getpaymentsummary(pageNumber = 1,pageSize = 10){

    let data:any =this.shareService.branchView.value;
    let branchid=data.id
    console.log("res",branchid)
    this.atmaservice.getpaymentsummary (pageNumber,pageSize,branchid )
    this.atmaservice.getpaymentsummary (pageNumber,pageSize,this.mainbid)

    .subscribe((result)=> {
      console.log("pay",result)
      let datass =result['data'];
      let datapagination = result["pagination"];
      this.getBranchList =datass;
      console.log("pay",this.getBranchList)
      
      if (this.getBranchList.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.presentpage = datapagination.index;
      }
      if(this.has_next==true){
        this.has_next=true;
      }
      if(this.has_previous==true){
        this.has_previous=true;
      }
    })
   
    }
   
      deletebranchpay(data){
        let paymentid = data.id
        console.log("deletebranchpay", paymentid)
        this.atmaservice.deletebranchform(paymentid,this.mainbid)
        .subscribe(result =>  {
         this.notification.showSuccess(" deleted....")
         this.getpaymentsummary();
         return true
    
        })
      
      }
    nextClickbranch () {
    if (this.has_next === true) {
      this.currentpage= this.presentpage + 1
    this.getpaymentsummary( this.presentpage + 1,10)
    }
    }
    
    previousClickbranch() {
    if (this.has_previous === true) {
    this.currentpage= this.presentpage - 1
    this.getpaymentsummary( this.presentpage - 1,10)
    }
    }

    branchdetails() {
      let data :any= this.shareService.branchView.value;
    //  this.branch_id=data.id;
      console.log("branchget", data)
  
     this.mainbid=data.id;
  
  }
    editbranch(e){
      this.shareService.paymenteditid.next(e)
      this.router.navigate(['/atma/PaymenteditComponent'], { skipLocationChange: true })
    }
    
    }
  


  
  
    

  