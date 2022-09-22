import { Component, HostListener, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from '../../service/shared.service';

@Component({
  selector: 'app-ap',
  templateUrl: './ap.component.html',
  styleUrls: ['./ap.component.scss']
})
export class ApComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  
  AP_Sub_Menu_List: any;
  sub_module_url: any;

  inwardsummary: any;
  apheader: any;
  empquery: any;
  commonAPSummary:any;
  bounce:any;
  inwardsummaryPath: any;
  apheaderPath: any;
  empqueryPath: any;
  bouncePath: any;
  makerpath:any;
  rejectpath:any;
  prepapath:any;
  payfilepath:any;
  inwardsummaryForm: boolean;
  apheaderForm: boolean;
  empqueryForm: boolean;
  bouncesummaryForm:boolean;
  makerform:boolean;
  rejectform:boolean;
  preparepaymentform:boolean;
  paymentfileform:boolean;
  sftpForm :boolean
  maker:any;
  reject:any;
  prepa:any;
  payfile:any;
  commonAPPath: any;
  commonAPSummaryForm: boolean;
  failedtrnpath:any;
  sftpPath : any;
  failetrn:any;
  sftp : boolean
  failedtranform:boolean;
  
  constructor( private sharedService: SharedService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    let datas = this.sharedService.menuUrlData;
    if(datas != undefined)
    {
      datas.forEach((element) => {
        console.log(element)
        let subModule = element.submodule;
        if (element.name === "AP") {
          this.AP_Sub_Menu_List = subModule;
          console.log("AP_Sub_Menu_List", this.AP_Sub_Menu_List)
        }
      });
    }
  }

  APSubModule(data) {

    this.sub_module_url = data.url;
    console.log(this.sub_module_url )
    this.inwardsummary = "/apsummary"
    this.apheader = "/apheader"
    this.empquery = "/ap_employeequery"
    this.prepa="/ap_preparepayment"
    this.payfile="/ap_paymentfile"
    this.commonAPPath = "/commonsummary"
    this.failedtrnpath="/failed_transaction"
    this.sftpPath="/sftp"

    this.inwardsummaryPath = this.inwardsummary === this.sub_module_url ? true : false;
    this.apheaderPath = this.apheader === this.sub_module_url ? true : false;
    this.empqueryPath = this.empquery === this.sub_module_url ? true : false;
    // this.bouncePath=this.bounce=== this.sub_module_url ? true : false;
    this.prepapath=this.prepa=== this.sub_module_url ? true : false;
    this.payfilepath=this.payfile=== this.sub_module_url ? true : false;
    // this.rejectpath=this.reject=== this.sub_module_url ? true : false;
    // this.makerpath=this.maker=== this.sub_module_url ? true : false;
    this.commonAPSummary=this.commonAPPath === this.sub_module_url ? true : false;
    this.failetrn=this.failedtrnpath===this.sub_module_url ? true : false;
    this.sftp=this.sftpPath===this.sub_module_url ? true : false;
    console.log(this.commonAPPath, this.commonAPSummary)

    this.inwardsummaryForm = false
    this.apheaderForm = false
    this.empqueryForm = false
    this.commonAPSummaryForm = false
    this.failedtranform=false;
    // this.bouncesummaryForm=false
    // this.makerform=false
    // this.rejectform=false
    this.preparepaymentform=false
    this.paymentfileform=false
    this.sftpForm = false

    if (this.inwardsummaryPath) {
      this.inwardsummaryForm = true
    }
    else if (this.apheaderPath) {
      this.apheaderForm = true
    }
    else if (this.empqueryPath) {
      this.empqueryForm = true
    }
    // else if (this.bouncePath)
    // {
    //   this.bouncesummaryForm=true
    // }
    else if (this.prepapath)
    {
      this.preparepaymentform=true
    }
    // else if (this.makerpath)
    // {
    //   this.makerform=true
    // }
    else if (this.payfilepath)
    {
      this.paymentfileform=true
    }
    else if (this.failetrn)
    {
      this.failedtranform=true;
      console.log("failed", this.failedtranform)
    }
    else if (this.commonAPSummary)
    {
      console.log(this.commonAPPath, this.commonAPSummary)
      this.commonAPSummaryForm = true;
    }
    else if (this.sftp)
    {
      this.sftpForm = true;
    }
    
    // else if (this.rejectpath)
    // {
    //   this.rejectform=true
    // }
  }

  inwardsummarySubmit() {
    this.inwardsummaryForm = true
    this.apheaderForm = false
    this.empqueryForm = false
    // this.bouncesummaryForm=false
  }

  inwardsummaryCancel() {
    this.inwardsummaryForm = true
    this.apheaderForm = false
    this.empqueryForm = false
    // this.bouncesummaryForm=false
  }

  apheaderSubmit() {
    this.inwardsummaryForm = true
    this.apheaderForm = false
    this.empqueryForm = false
    // this.bouncesummaryForm=false
  }

  apheaderCancel() {
    this.inwardsummaryForm = true
    this.apheaderForm = false
    this.empqueryForm = false
    // this.bouncesummaryForm=false
  }

  empquerySubmit() {
    this.inwardsummaryForm = true
    this.apheaderForm = false
    this.empqueryForm = false
    // this.bouncesummaryForm=false
  }

  empqueryCancel() {
    this.inwardsummaryForm = true
    this.apheaderForm = false
    this.empqueryForm = false
    // this.bouncesummaryForm=false
  }
  // bouncesummary()
  // {
  //   this.inwardsummaryForm = false
  //   this.apheaderForm = false
  //   this.empqueryForm = false
  //   this.bouncesummaryForm=true
  // }

}
