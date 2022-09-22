import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ApShareServiceService } from '../ap-share-service.service';
import { Ap1Service } from '../ap1.service';
import { AppComponent } from 'src/app/app.component'; 
import { SharedService } from 'src/app/service/shared.service'
import { NotificationService } from "../../service/notification.service";
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-failed-transaction',
  templateUrl: './failed-transaction.component.html',
  styleUrls: ['./failed-transaction.component.scss']
})
export class FailedTransactionComponent implements OnInit {
  failtrn:FormGroup;
  data:any;
  isLoading = false;
  has_previous = true;
  pageSizeApp = 10;
  has_next = true;
  presentpage:any=1;
  pageNumber:any;
  pageSize:any;
  id:any;
  invdate:any;
  crno:any;
  entrylist:any;
  cbsdate:any;
  trandate:any;
  status_id:any;
  oracalinput:any;
  statusinput:any;
  crnofilter:any;
  groupid:any;
errordes:any;
reauditdata:any;
reauditflage:boolean=false
entryinactive:any;
getcototalcount:any;
modelid:any;
  constructor(private formbuilder: FormBuilder, private spinner: NgxSpinnerService,
    private router:Router, private service:Ap1Service, private datepipe:DatePipe, 
    private toastr:ToastrService, private shareservice:ApShareServiceService, 
    private mainComponent:AppComponent, private commonService:SharedService,private notification: NotificationService,) { }

  ngOnInit(): void {
    this.failtrn = this.formbuilder.group(
      {
        crno: [''],
      });
      this.getfailedtrndata();
  }
  getfailedtrndata()
  {
    this.spinner.show();
    this.service.failtrnget({"status":"10"},this.presentpage).subscribe(data=>{
      console.log('rr=',data);
      this.data=data['data'];
      console.log("faildata", this.data)
      let datapagination=data['pagination'];
      this.getcototalcount = data["pagination"]?.count;
      this.spinner.hide()
      if (this.data.length > 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.presentpage = datapagination.index;
      }
    }
    // (error)=>{
    //   this.spinner.hide();
    //   this.toastr.warning(error.status+error.statusText)
    // }
    );
  }
  search()
  {
    // let fill:any={};
    if(this.failtrn.get('crno').value !=null && this.failtrn.get('crno').value !='' ){
      this.crnofilter=this.failtrn.get('crno').value;
    }
    let fill:any={
      "crno": this.crnofilter,
      "status":"10" 
    }
    console.log("fill",fill)
    this.spinner.show();
    this.service.failtrnget(fill,this.presentpage).subscribe(data=>{
      console.log('rr=',data);
      this.data=data['data'];
      console.log("faildata", this.data)
      let datapagination=data['pagination'];
      this.getcototalcount = data["pagination"]?.count;
      this.spinner.hide()
      if (this.data.length > 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.presentpage = datapagination.index;
      }
    })
  }
  cancel()
  {
    this.spinner.show();
    this.failtrn.reset();
   this.getfailedtrndata()
  }
  nextClick() {
    this.spinner.show();
      if (this.has_next === true) {
        this.presentpage=this.presentpage+1;
        this.getfailedtrndata();
      }
    }
  previousClick() {
    this.spinner.show();
      if (this.has_previous === true) {      
        this.presentpage=this.presentpage-1;
        this.getfailedtrndata();
      }
    }
    action(data)
    {
      this.reauditflage=false
      this.spinner.show();
      console.log("data",data)
      this.status_id=data.status.id;
     this.id=data.id
      this.invdate=data.invoice_date
      this.crno=data.crno 
      if(this.status_id==11)
      {
        this.oracalinput = {
          AP_Type: "AP_PAYMENT",
          CR_Number: this.crno.toString(),
        };
        this.statusinput=
          { "apinvoiceheader_id":  this.id.toString(),"remarks":"ok"}
      } 
  
        this.reauditdata = {
          status_id: "4",
          apinvoicehdr_id: this.id.toString(),
          remark: "reaudit",
      }
      this.spinner.hide();
        this.getentrydet(data);
          
    }
    getentrydet(data) {
      this.spinner.show();
      let statuswherefailed;
      statuswherefailed=data?.status?.id
      this.service.entrydet(this.crno).subscribe((data) => {
        this.entrylist = data["data"];
        this.cbsdate = this.entrylist[0]?.cbsdate;
      this.trandate = this.entrylist[0]?.transactiondate;
      this.groupid=this.entrylist[0]?.group_id
      this.modelid=this.entrylist[0]?.module
      if(statuswherefailed==10)
      {
        this.reauditflage=true
        this.reauditflage=true
        this.oracalinput = {
          AP_Type:  this.modelid,
          CR_Number: this.crno.toString(),
        };
        this.statusinput={
          "status_id":"7",
          "remark":"NA",
          "apinvoicehdr_id":this.id.toString()
        }
        this.entryinactive={
          "crno":this.crno.toString(),"ap_type":"AP_APPROVED"   
        }
      } 
        console.log("entry", this.entrylist);
        console.log("this.statusinput",this.statusinput)
        console.log("this.oracalinput",this.oracalinput)
        this.spinner.hide();
      });
    }
    viewerror(entry,i)
    {
      console.log("entrylist",entry)
      console.log("i",i)
      this.errordes=this.entrylist[i]?.errordescription
    }
  
    repush()
    {
      var answer = window.confirm("Are you Sure to Repush?");
      if (!answer) {
        return false;
      }
      this.spinner.show();
      if(this.status_id==10)
      {
        this.service.approvervalidation(this.id).subscribe((validationresult)=>
        {
          if(validationresult["status"]=="Success")
          {
            this.service.oracal(this.oracalinput).subscribe((result) => {
              console.log("oracal", result);
              if (result.Message == "SUCCESS") 
              {
                this.service.bounce(this.statusinput).subscribe((data) => {
                  console.log("data", data);
                  if (data["status"] == "success") {
                     this.notification.showSuccess(data["message"]);
                     this.getfailedtrndata();
                    this.spinner.hide();  
                  }
                  else{
                    this.spinner.hide();
                    this.notification.showError(data["description"]);
                  }
                });
                this.spinner.hide();
              } 
              else 
              {
                this.notification.showError(JSON.stringify(result));
                this.spinner.hide();
              }
            });
          }
          else
          {
            this.notification.showError(validationresult["message"])
          this.spinner.hide();
          }})
      }
      if(this.status_id==11)
      {
        this.service.payementvalidation(this.id).subscribe((validationresult)=>
        {
          if(validationresult["status"]=="Success")
          {
            this.service.oracal(this.oracalinput).subscribe((result) => {
              console.log("oracal", result);
              if (result.Message == "SUCCESS") 
              {
                this.service.payementstatusupdate(this.statusinput).subscribe((data) => {
                  console.log("data", data);
                  if (data["status"] == "success") {
                     this.notification.showSuccess(data["message"]);
                     this.getfailedtrndata();
                    this.spinner.hide();  
                  }
                  else{
                    this.spinner.hide();
                    this.notification.showError(data["description"]);
                  }
                });
                this.spinner.hide();
              } 
              else 
              {
                this.notification.showError(JSON.stringify(result));
                this.spinner.hide();
              }
            }
            );
          }
          else
          {
            this.notification.showError(validationresult["message"])
          this.spinner.hide();
          }})
      }  
    }
    reaudit()
    {
      var ans = window.confirm("Are you Sure to Re-Audit?");
      if (!ans) {
        return false;
      }
      this.spinner.show();
      this.service.entryinactive(this.entryinactive).subscribe((entryresult)=>   
      {
        if (entryresult["status"] == "success")
        {
          this.service.bounce(this.reauditdata).subscribe((data) => {
            if (data["status"] == "success") {
              this.getfailedtrndata();
              this.spinner.hide();  
              this.notification.showSuccess(data["message"]); 
           }
           else{
             this.spinner.hide();
             this.notification.showError(data["description"]);
           }
          });
        }
        else{
          this.notification.showError(entryresult["description"]);
        }
      }
      )
  
      
    }
   
}
