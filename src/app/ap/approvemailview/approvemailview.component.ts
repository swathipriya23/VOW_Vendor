import { Component, OnInit } from '@angular/core';
import { DatePipe, formatDate } from "@angular/common";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
} from "@angular/forms";
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  NativeDateAdapter,
} from "@angular/material/core";
import { fromEvent } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import { environment } from "src/environments/environment";
import { ApShareServiceService } from "../ap-share-service.service";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ApService } from "../ap.service";
import { Ap1Service } from "../ap1.service";
import { NotificationService } from "../../service/notification.service";
import { I } from "@angular/cdk/keycodes";
import { getMatIconFailedToSanitizeLiteralError } from "@angular/material/icon";
import { flattenDiagnosticMessageText } from "typescript";
@Component({
  selector: 'app-approvemailview',
  templateUrl: './approvemailview.component.html',
  styleUrls: ['./approvemailview.component.scss']
})
export class ApprovemailviewComponent implements OnInit {

  constructor(
    private service: ApService,
    private service1: Ap1Service,
    private formBuilder: FormBuilder,
    private router: Router,
    private notification: NotificationService,
    private shareservice: ApShareServiceService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService
  ) { }
  hedid: any;
  apHdrSummarydt: any = [];
  apHdrSummary: any = [];
  frmECFNoHdr: FormGroup;
  rem = new FormControl("", Validators.required);
  remark: any;
  sta = 7;
  dbt: any;
  apinvid: any;
  fileid: any;
  filename: any;
  detflag = false;
  fileflage: boolean;
  file: any;
  latest_date: any;
  date: any;
  pay: any;
  year: any;
  s: any;
  entrylist: any;
  time: any;
  routflage: boolean;
  debit: any;
  crtlist: any = [];
  creditdebit: any = [];
  creditcatno: any = [];
  subcatno: any = [];
  cbsdate: any;
  trandate: any;
  oracalinput: any;
  invoicedetail: any = [];
  debitbank: any;
  debitaccno: any;
  ifsccode: any;
  beneficiaryname: any;
  dropdownid:any
  headerflage:boolean;
  paymentflage:boolean;
  statusid:any;
  groupid:any;
  roundoffInput:any=[];
  eraflage:boolean;
  inwardHdrNo:any;
  routeData:any;
  newDataRouting:any;
  invno:any;
  entrybuttonflage:boolean;
  commonsumflg:boolean;
  dropdownstatusid:any;
  crttot=0;
  dbttot=0;
  details:any;
  dataforfa:any;
  detailsfa:any;
  dbtfadet:any=[];
  datadbtdet=[];
  fadatainsertflage:boolean;
  approverbuttonflage:boolean=true
  advancenotflage:boolean=true
  debitvendortyp:any;
  creditvendortyp:any;
  beforeentry:any=[];
  bankname:any;
  branch:any;
  branchgst:any;
  apheader:any;
  ngOnInit(): void {
    const params = new URL(window.location.href).searchParams;
    console.log("params",params)
    this.apheader = params.get('aphed_id');
    this.time = new Date().toLocaleTimeString();
    this.getheaderdata();
  }
  getheaderdata() {
    console.log("apheaderid",this.hedid )
    this.date = new Date();
    this.latest_date = this.datePipe.transform(this.date, "yyyy-MM-dd");
    this.year = this.datePipe.transform(this.date, "yyyy");
    let data: any = this.shareservice?.hedid?.value;
    console.log("invid", this.hedid);
    this.service.getHdrSummary( this.apheader).subscribe((result) => {
      console.log(result);
      if(result?.code=="INVALID_DATA")
      {
        this.notification.showError(result["description"])
        this.spinner.hide();
      }
      else
      {
        this.apHdrSummarydt = result;
        this.statusid= this.apHdrSummarydt?.apinvoiceheader[0]?.status?.id
        if(this.apHdrSummarydt?.raiserchoose_branch!=null)
        {
          this.branch=this.apHdrSummarydt?.raiserchoose_branch?.name
          this.branchgst=this.apHdrSummarydt?.raiserchoose_branch?.gstin
        }
        else
        {
          this.branch=this.apHdrSummarydt?.raiserbranch?.name
          this.branchgst=this.apHdrSummarydt?.raiserbranch?.gstin
        }
        console.log("statusid",this.statusid)
        if(this.apHdrSummarydt?.aptype?.id == 3)
        {
          this.eraflage=false
        }
        else
        {
          this.eraflage=true;
        }
        if(this.apHdrSummarydt?.aptype?.id == 4)
        {
          this.advancenotflage=false
          let advancetype=this.apHdrSummarydt.crno.slice(0, 3);
          if(advancetype == "ADV")
          {
            this.eraflage=true;
          }
          else {
            this.eraflage=false;
          }
        }
        if(this.statusid==1 ||this.statusid==2 || this.statusid==3 || this.statusid==4 || this.statusid==5)
        {
          this.entrybuttonflage=false
        }
        else
        {
          this.entrybuttonflage=true;
        }
        if (this.apHdrSummarydt?.apinvoiceheader[0]?.apinvoicedetails?.length != 0) {
          this.invoicedetail =
            this.apHdrSummarydt?.apinvoiceheader[0]?.apinvoicedetails;
          console.log("invdet", this.invoicedetail);
          this.dbt =
            this.apHdrSummarydt?.apinvoiceheader[0]?.apinvoicedetails[0]?.apdebit;
          if (
            this.apHdrSummarydt?.apinvoiceheader[0]?.debit_bankdetails?.code ==
            "INVALID_BANK_ID"
          ) {
            this.debitbank = "";
            this.debitaccno = "Bank Details Empty";
            console.log("Accdata", this.debitbank);
            console.log("Accno", this.debitaccno);
          } else {
            this.debitbank =
              this.apHdrSummarydt?.apinvoiceheader[0]?.debit_bankdetails?.bankbranch?.bank?.name;
            this.debitaccno =
              this.apHdrSummarydt?.apinvoiceheader[0]?.debit_bankdetails?.account_no;
            console.log("Accdata", this.debitbank);
            console.log("Accno", this.debitaccno);
          }
        }
        this.oracalinput = {
          AP_Type: "AP_APPROVED",
          CR_Number: this.apHdrSummarydt.crno.toString(),
        };
        this.crtlist = this.apHdrSummarydt.apinvoiceheader[0]?.apcredit;
        this.getdata();
        this.apinvid = this.apHdrSummarydt.apinvoiceheader[0]?.id;
        console.log(
          "length",
          this.apHdrSummarydt?.apinvoiceheader[0]?.apfile?.length
        );
        if (this.apHdrSummarydt?.apinvoiceheader[0]?.apfile?.length != 0) {
          this.fileflage = true;
          this.fileid = this.apHdrSummarydt?.apinvoiceheader[0]?.apfile[0]?.file_id;
          this.file = this.apHdrSummarydt?.apinvoiceheader[0]?.apfile[0]?.filename;
          this.detflag = true;
          console.log("flage", this.fileflage);
        } else {
          this.fileflage = false;
          this.file = "NO";
          this.detflag = true;
        }
        //
        // this.filename=this.apHdrSummarydt.apinvoiceheader[0].apfile[0].filename
        console.log("apHdrSummarydt", this.apHdrSummarydt);
        
        if (this.apHdrSummarydt?.payto?.id == "S") {
          for(let i=0;i< this.crtlist?.length;i++)
          {
            if(this.crtlist[i]?.paymode?.name=="NEFT" || this.crtlist[i]?.paymode?.name=="ERA")
            {
              if (this.crtlist[i]?.supplierpayment_details?.data?.length != 0 && this.crtlist[i]?.supplierpayment_details != null && this.crtlist[0]?.supplierpayment_details != "") {
                this.beneficiaryname =
                  this.crtlist[i]?.supplierpayment_details["data"][0]?.beneficiary;
                this.ifsccode =
                  this.crtlist[i]?.supplierpayment_details[
                    "data"
                  ][0]?.branch_id?.ifsccode;
                  this.bankname=this.crtlist[i]?.supplierpayment_details["data"][0]?.branch_id?.bank?.name
              } else {
                this.beneficiaryname = "0";
                this.ifsccode = "0";
                this.notification.showWarning("supplierpayment_details is Empty")
              }
            }
           
          }   
        }
        if (this.apHdrSummarydt.payto?.id == "E") {
          if(this.apHdrSummarydt?.apinvoiceheader[0]?.employee_accountdtls?.data?.length==0)
          {
            this.notification.showWarning("Employee_accountdtls is Empty")
          }
          else if(this.apHdrSummarydt?.apinvoiceheader[0]?.employee_accountdtls?.bankbranch?.code=="INVALID_BANKBRANCH_ID")
          {
            this.notification.showWarning("Employee Bank Details is Empty")
          }
          else
          {
            this.beneficiaryname =
            this.apHdrSummarydt.apinvoiceheader[0]?.employee_accountdtls?.beneficiary_name;
          this.ifsccode =
            this.apHdrSummarydt.apinvoiceheader[0]?.employee_accountdtls?.bankbranch?.ifsccode;
            this.bankname=this.apHdrSummarydt?.apinvoiceheader[0]?.employee_accountdtls?.bankbranch?.bank?.name
          }
          
        }
        console.log("hedid", this.apinvid);
        console.log("fileid", this.fileid);
      }
      this.fadata()
      this.spinner.hide();
    });
  }
  getdata() {
    let time = new Date().toLocaleTimeString();
    console.log("crtlist", this.crtlist);
    for (let i = 0; i < this.crtlist?.length; i++) {
      this.service1.gldesget(this.crtlist[i]?.creditglno).subscribe((glresult=>{
        let gldescription=glresult["data"][0]?.gl_description
        this.service1.catget(this.crtlist[i]?.creditglno).subscribe((result=>{
          let catno=result["data"][0]?.apcat_no
          let subcatno=result["data"][0]?.subcat_no
          if (this.crtlist[i]?.paymode?.gl_flag != "Payable") {
            if(this.crtlist[i]?.amount!=0)
            {
              let credit = {
                branch_id:this.apHdrSummarydt?.raiserbranch?.id.toString(),
                branch_code:this.apHdrSummarydt?.raiserbranch?.code.toString(),
                fiscalyear: this.year.toString(),
                period: "1",
                module: 1,
                screen: 2,
                valuedate: this.latest_date.toString(),
                valuetime: this.time.toString(),
                cbsdate: this.latest_date.toString(),
                localcurrency: "1",
                localexchangerate: "12",
                currency: "1",
                exchangerate: "10",
                isprevyrentry: "1",
                reversalentry: "2",
                refno: "CTOOO9087",
                crno: this.apHdrSummarydt.crno.toString(),
                refid: "AP",
                reftableid: this.apHdrSummarydt.apinvoiceheader[0].id.toString(),
                type: "2",
                gl: this.crtlist[i].creditglno.toString(),
                apcatno: catno.toString(),
                apsubcatno: subcatno.toString(),
                wisefinmap: "12",
                glremarks: "12",
                amount: this.crtlist[i]?.amount.toString(),
                fcamount: "13",
                ackrefno: "123",
                entry_status: 1,
                // vendor_type:"DO"
                vendor_type:this.crtlist[i]?.vendor_type
              };
              this.creditdebit.push(credit);
              this.crttot=this.crttot+this.crtlist[i]?.amount
              let befcrtdata={
                type: "2",
                gl: this.crtlist[i]?.creditglno,
                amount: this.crtlist[i]?.amount,
                gldec:gldescription
              }
              this.beforeentry.push(befcrtdata) 
            }
          
          }

        })) 
      }))
    }
    console.log("this.crttot",this.crttot)
    if (this.apHdrSummarydt.apinvoiceheader[0]?.apinvoicedetails?.length != 0) {
      for (let k = 0; k < this.invoicedetail.length; k++) {
        console.log(
          "this.invoicedetail[k].apdebit",
          this.invoicedetail[k]?.apdebit
        );
        for (let i = 0; i < this.invoicedetail[k]?.apdebit["data"]?.length; i++) {
          if(this.invoicedetail[k]?.apdebit['data'][i]?.amount!=0)
          {
          this.debit = {
            branch_id: this.apHdrSummarydt?.raiserbranch?.id.toString(),
            branch_code:this.apHdrSummarydt?.raiserbranch?.code.toString(),
            fiscalyear: this.year.toString(),
            period: "1",
            module: 1,
            screen: 2,
            valuedate: this.latest_date.toString(),
            valuetime: this.time.toString(),
            cbsdate: this.latest_date.toString(),
            localcurrency: "1",
            localexchangerate: "12",
            currency: "1",
            exchangerate: "10",
            isprevyrentry: "1",
            reversalentry: "2",
            refno: "CTOOO9087",
            crno: this.apHdrSummarydt.crno.toString(),
            refid: "AP",
            reftableid: this.apHdrSummarydt.apinvoiceheader[0].id.toString(),
            type: "1",
            gl: this.invoicedetail[k]?.apdebit["data"][i]?.debitglno.toString(),
            apcatno: this.invoicedetail[k]?.apdebit["data"][i]?.category_code?.no,
            apsubcatno:
              this.invoicedetail[k]?.apdebit["data"][
                i
              ]?.subcategory_code?.no?.toString(),
            wisefinmap: "12",
            glremarks: "12",
            amount: this.invoicedetail[k]?.apdebit["data"][i]?.amount.toString(),
            fcamount: "13",
            ackrefno: "123",
            entry_status: 1,
            // vendor_type:"DO"
            vendor_type: this.invoicedetail[k]?.apdebit["data"][i]?.vendor_type
          };
          this.creditdebit.push(this.debit);
          this.dbttot=this.dbttot+ this.invoicedetail[k]?.apdebit["data"][i]?.amount;
          let befdbtdata={
            type: "1",
            gl: this.invoicedetail[k]?.apdebit["data"][i]?.debitglno,
            amount: this.invoicedetail[k]?.apdebit["data"][i]?.amount,
            gldec:this.invoicedetail[k]?.apdebit["data"][i]?.glno_description["data"][0]?.gl_description
          }
          this.beforeentry.push(befdbtdata) 
          }
        }
      }
      console.log("this.dbttot",this.dbttot)
    }
    if(this.apHdrSummarydt.apinvoiceheader[0].roundoffamt!=0)
    {
      if(this.apHdrSummarydt.apinvoiceheader[0].roundoffamt > 0)
      {
        this.roundoffInput = {
          branch_id: this.apHdrSummarydt?.raiserbranch?.id.toString(),
          branch_code:this.apHdrSummarydt?.raiserbranch?.code.toString(),
          fiscalyear: this.year.toString(),
          period: "1",
          module: 1,
          screen: 2,
          valuedate: this.latest_date.toString(),
          valuetime: this.time.toString(),
          cbsdate: this.latest_date.toString(),
          localcurrency: "1",
          localexchangerate: "12",
          currency: "1",
          exchangerate: "10",
          isprevyrentry: "1",
          reversalentry: "2",
          refno: "CTOOO9087",
          crno: this.apHdrSummarydt.crno.toString(),
          refid: "AP",
          reftableid: this.apHdrSummarydt.apinvoiceheader[0].id.toString(),
          type: "1",
          gl: "447110",
          apcatno: "236",
          apsubcatno:
           "330",
          wisefinmap: "12",
          glremarks: "12",
          amount: this.apHdrSummarydt.apinvoiceheader[0]?.roundoffamt.toString(),
          fcamount: "13",
          ackrefno: "123",
          entry_status: 1,
          vendor_type:"default"
        };
        this.creditdebit.push(this.roundoffInput);
        this.dbttot=this.dbttot+this.apHdrSummarydt.apinvoiceheader[0]?.roundoffamt
        let roundofct={
          type: "1",
          gl: "447110",
          amount:this.apHdrSummarydt.apinvoiceheader[0]?.roundoffamt,
          gldec :"Rounding off"
        }
        this.beforeentry.push(roundofct) 
      }
      else     
      {
        let rountoffamt=Math.abs(this.apHdrSummarydt.apinvoiceheader[0]?.roundoffamt)
        console.log("rountoffamt",rountoffamt)
        this.roundoffInput = {
          branch_id: this.apHdrSummarydt?.raiserbranch?.id.toString(),
          branch_code:this.apHdrSummarydt?.raiserbranch?.code.toString(),
          fiscalyear: this.year.toString(),
          period: "1",
          module: 1,
          screen: 2,
          valuedate: this.latest_date.toString(),
          valuetime: this.time.toString(),
          cbsdate: this.latest_date.toString(),
          localcurrency: "1",
          localexchangerate: "12",
          currency: "1",
          exchangerate: "10",
          isprevyrentry: "1",
          reversalentry: "2",
          refno: "CTOOO9087",
          crno: this.apHdrSummarydt.crno.toString(),
          refid: "AP",
          reftableid: this.apHdrSummarydt.apinvoiceheader[0].id.toString(),
          type: "2",
          gl: "447110",
          apcatno: "236",
          apsubcatno:
           "330",
          wisefinmap: "12",
          glremarks: "12",
          amount: rountoffamt.toString(),
          fcamount: "13",
          ackrefno: "123",
          entry_status: 1,
          vendor_type:"default"
        };
        this.creditdebit.push(this.roundoffInput);
        this.crttot=this.crttot+rountoffamt
        let roundofdt={
          type: "2",
          gl: "447110",
          amount:this.apHdrSummarydt.apinvoiceheader[0]?.roundoffamt,
          gldec :"Rounding off"
        }
        this.beforeentry.push(roundofdt) 
      }
      console.log("whith roundoff",this.creditdebit)
    }  
    console.log("entry input", this.creditdebit);  
  this.dbttot=Math.round(this.dbttot * 100) / 100
  this.crttot=Math.round(this.crttot * 100) / 100
  
  }
  findDetails(data) {
    console.log("data", data);
    console.log("data.apinvoicedetails", data?.apinvoicedetails);
    return data?.apinvoicedetails;
  }
  approve() {
    this.approverbuttonflage=false
    console.log("creditdebit", this.creditdebit);
    this.remark = this.rem.value;
    let boui: any = {
      status_id: this.sta.toString(),
      apinvoicehdr_id: this.apinvid.toString(),
      remark: this.remark.toString(),
    };
    console.log(boui);
    this.spinner.show();
    this.service1.approvervalidation(this.apinvid).subscribe((validationresult)=>
    {
      if(validationresult["status"]=="Success")
      {
        if( this.dbttot == this.crttot)
          {
            this.service1.crtdbt(this.creditdebit).subscribe((dataentry) => {
              if (dataentry.status == "success") {
                let statusinput={
                  "status_id":"10",
                  "remark":"NA",
                  "apinvoicehdr_id":this.apinvid.toString(),
                }
                this.service.bounce(statusinput).subscribe((data) => {
                  if (data["status"] == "success")
                  {
                    this.service1.oracal(this.oracalinput).subscribe((result) => {
                      console.log("oracal", result);
                      if (result.Message == "SUCCESS") 
                      {
                        this.service.bounce(boui).subscribe((data) => {
                          console.log("data", data);
                          if (data["status"] == "success") {
                            if(this.fadatainsertflage==true)
                            {
                              this.service1.aptofa(this.dataforfa).subscribe((data)=>{
                                if(data["status"]=="success")
                                {
                                  this.approverbuttonflage=true
                                  this.notification.showSuccess(data["message"]);
                                  this.spinner.hide();  
                                  this.router.navigate(['/ap/commonsummary'], {queryParams:{dropdownid: 2}, skipLocationChange: true });     
                                }
                                else
                                {
                                  this.approverbuttonflage=true
                                  this.notification.showWarning(data["description"]);
                                  this.spinner.hide();  
                                  this.router.navigate(['/ap/commonsummary'], {queryParams:{dropdownid: 2}, skipLocationChange: true });   
                                }
                              })
                            }
                            else
                            {
                            this.approverbuttonflage=true
                            this.notification.showSuccess(data["message"]);
                            this.spinner.hide();  
                            this.router.navigate(['/ap/commonsummary'], {queryParams:{dropdownid: 2}, skipLocationChange: true });     
                            }
                          }
                          else{
                            this.approverbuttonflage=true
                            this.spinner.hide();
                            this.notification.showError(data["message"]);
                            this.router.navigate(['/ap/commonsummary'], {queryParams:{dropdownid: 2}, skipLocationChange: true });  
                          }
                        });
                        this.spinner.hide();
                      } 
                      else 
                      {
                        this.approverbuttonflage=true
                        this.notification.showError(JSON.stringify(result));
                        this.spinner.hide();
                        this.router.navigate(['/ap/commonsummary'], {queryParams:{dropdownid: 2}, skipLocationChange: true });  
                      }
                    });
                  }
                  else{
                    this.approverbuttonflage=true
                    this.spinner.hide();
                    this.notification.showError(data["message"]);
                    this.router.navigate(['/ap/commonsummary'], {queryParams:{dropdownid: 2}, skipLocationChange: true });  
                  }
                })
        
                
              } 
              else 
              {
                this.notification.showError(dataentry["description"]);
                this.approverbuttonflage=true
                this.router.navigate(['/ap/commonsummary'], {queryParams:{dropdownid: 2}, skipLocationChange: true });  
                this.spinner.hide();
              }
            });
          }
          else
          {
            this.notification.showError("Debit Amount & Credit Amount MisMatch");
            this.approverbuttonflage=true
            this.spinner.hide();
          }
        
      }
      else
      {
        this.notification.showError(validationresult["message"])
        this.approverbuttonflage=true
        this.spinner.hide();
      }
    })
   
  }
  reaudit() {
    this.remark = this.rem.value;
    console.log(this.hedid);
    let boui: any = {
      status_id: "4",
      apinvoicehdr_id: this.apinvid.toString(),
      remark: this.remark.toString(),
    };
    console.log(boui);
    this.spinner.show();
    this.service.bounce(boui).subscribe((data) => {
      if (data["status"] == "success") {
        this.spinner.hide();  
        this.notification.showSuccess(data["message"]); 
        this.router.navigate(['/ap/commonsummary'], {queryParams:{dropdownid: 2}, skipLocationChange: true });    
     }
     else{
       this.spinner.hide();
       this.notification.showError(data["message"]);
       this.router.navigate(['/ap/commonsummary'], {queryParams:{dropdownid: 2}, skipLocationChange: true });  
     }
    });
  }
  getfiles(file) {
    if (this.fileflage == false) {
      this.notification.showWarning("No file Available");
    } else {
      let fid=file?.file_id
      this.service1.downaledfile(fid).subscribe((results) => {
        this.spinner.show()
            let binaryData = [];
            binaryData.push(results)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            link.download = file.filename;
            link.click();
            this.spinner.hide()
          })
         
      };
    }
  
  
  tokenValues: any
  showimageHeaderAPI: boolean
  showimagepdf: boolean
  pdfurl: any;
  jpgUrlsAPI: any
  imageUrl = environment.apiURL
  data(datas) {
    let id = datas.file_id
    let filename = datas.filename
    // this.ecfservice.downloadfile(id)




    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = filename.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg"||
    stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {

        this.showimageHeaderAPI = true
        this.showimagepdf = false
        this.jpgUrlsAPI = this.imageUrl + "apserv/apfiledownload/" + id + "?token=" + token;
      }
      if (stringValue[1] === "pdf"|| stringValue[1] === "PDF") {
        this.showimagepdf = true
        this.showimageHeaderAPI = false
        this.service1.downaledfile(id)
          .subscribe((data) => {
            let binaryData = [];
            binaryData.push(data)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            this.pdfurl = downloadUrl
          }, (error) => {
            this.showimagepdf = false
            this.showimageHeaderAPI = false
            this.spinner.hide();
          })
      }
      if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt"||
      stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
        this.showimagepdf = false
        this.showimageHeaderAPI = false
      }
  
  
  
  
      }
  getentrydet() {
    this.service1.entrydet(this.apHdrSummarydt.crno).subscribe((data) => {
      this.entrylist = data["data"];
      console.log("entry", this.entrylist);
      this.cbsdate = this.entrylist[0]?.cbsdate;
      this.trandate = this.entrylist[0]?.transactiondate;
      this.groupid=this.entrylist[0]?.group_id
    });
  }
  goback()
  {
    this.router.navigate(['/ap/commonsummary'], {queryParams:{dropdownid: this.statusid}, skipLocationChange: true });  
  }
  fadata()
  {
    if(this.apHdrSummarydt?.payto?.id=="S")
    {
      if (this.apHdrSummarydt?.apinvoiceheader[0]?.apinvoicedetails?.length != 0) 
      {
      
        for (let k = 0; k < this.apHdrSummarydt?.apinvoiceheader[0]?.apinvoicedetails?.length; k++) {
         if(this.apHdrSummarydt?.apinvoiceheader[0]?.apinvoicedetails[k]?.is_capitalized==1)
         {
          for (let i = 0; i < this.apHdrSummarydt?.apinvoiceheader[0]?.apinvoicedetails[k]?.apdebit["data"]?.length; i++) 
          {
            if(this.apHdrSummarydt?.apinvoiceheader[0]?.apinvoicedetails[k]?.apdebit["data"][i]?.subcategory_code?.code=="REGULAR" || this.apHdrSummarydt?.apinvoiceheader[0]?.apinvoicedetails[k]?.apdebit["data"][i]?.subcategory_code?.code=="BUC" ||this.apHdrSummarydt?.apinvoiceheader[0]?.apinvoicedetails[k]?.apdebit["data"][i]?.subcategory_code?.code=="CWIP" )
            {
              this.fadatainsertflage=true
              this.detailsfa={'qty':this.apHdrSummarydt.apinvoiceheader[0].apinvoicedetails[k].quantity,'mepno':'0','ponum':'0','amount':this.apHdrSummarydt.apinvoiceheader[0].apinvoicedetails[k].amount,'ecfnum':this.apHdrSummarydt.crno,
              'Doc_Type':1,'markedup':1,'invoiceno':this.apHdrSummarydt.apinvoiceheader[0].invoiceno,'taxamount':this.apHdrSummarydt.apinvoiceheader[0].apinvoicedetails[k].taxamount,'totamount':this.apHdrSummarydt.apinvoiceheader[0].apinvoicedetails[k].totalamount,
              'apcat_code':this.apHdrSummarydt?.apinvoiceheader[0]?.apinvoicedetails[k]?.apdebit["data"][0]?.category_code?.code,'balanceqty':this.apHdrSummarydt.apinvoiceheader[0].apinvoicedetails[k].quantity,'invoice_id':this.apHdrSummarydt.apinvoiceheader[0].id,'branch_code':this.apHdrSummarydt?.raiserbranch?.code,
              'invoicedate':this.apHdrSummarydt.apinvoiceheader[0].invoicedate,'otheramount':this.apHdrSummarydt.apinvoiceheader[0].apinvoicedetails[k].otheramount,'productname':this.apHdrSummarydt.apinvoiceheader[0].apinvoicedetails[k].productname,
              'product_code':this.apHdrSummarydt.apinvoiceheader[0].apinvoicedetails[k].productcode,'apsubcat_code':this.apHdrSummarydt.apinvoiceheader[0]?.apinvoicedetails[k]?.apdebit["data"][0]?.subcategory_code?.code,'inv_debit_tax':this.apHdrSummarydt.apinvoiceheader[0].apinvoicedetails[k].taxamount,
              'supplier_code':this.apHdrSummarydt.apinvoiceheader[0]?.supplier?.code,'invoicedtails_id':this.apHdrSummarydt.apinvoiceheader[0].apinvoicedetails[k].id};  
              this.dbtfadet.push(this.detailsfa) 
              break; 
            }
          }   
         }        
        }         
      }
      else
      {
        this.notification.showError("Invoice Detail Empty")
      }
    }
    else
    {
      if (this.apHdrSummarydt?.apinvoiceheader[0]?.apinvoicedetails?.length != 0) 
      {
        for (let k = 0; k < this.apHdrSummarydt.apinvoiceheader[0].apinvoicedetails.length; k++) {
          if(this.apHdrSummarydt?.apinvoiceheader[0]?.apinvoicedetails[k]?.is_capitalized==1)
          {
            for (let i = 0; i < this.apHdrSummarydt?.apinvoiceheader[0]?.apinvoicedetails[k]?.apdebit["data"]?.length; i++) 
            {
              if(this.apHdrSummarydt?.apinvoiceheader[0]?.apinvoicedetails[k]?.apdebit["data"][i]?.subcategory_code.code=="REGULAR" || this.apHdrSummarydt?.apinvoiceheader[0]?.apinvoicedetails[k]?.apdebit["data"][i]?.subcategory_code?.code=="CWIP"  ||this.apHdrSummarydt?.apinvoiceheader[0]?.apinvoicedetails[k]?.apdebit["data"][i]?.subcategory_code?.code=="BUC" )
              {
                  this.fadatainsertflage=true
                  this.detailsfa={'qty':this.apHdrSummarydt.apinvoiceheader[0].apinvoicedetails[k].quantity,'mepno':'0','ponum':'0','amount':this.apHdrSummarydt.apinvoiceheader[0].apinvoicedetails[k].amount,'ecfnum':this.apHdrSummarydt.crno,
                    'Doc_Type':1,'markedup':1,'invoiceno':this.apHdrSummarydt.apinvoiceheader[0].invoiceno,'taxamount':this.apHdrSummarydt.apinvoiceheader[0].apinvoicedetails[k].taxamount,'totamount':this.apHdrSummarydt.apinvoiceheader[0].apinvoicedetails[k].totalamount,
                    'apcat_code':this.apHdrSummarydt.apinvoiceheader[0]?.apinvoicedetails[k]?.apdebit["data"][0]?.category_code?.code,'balanceqty':this.apHdrSummarydt.apinvoiceheader[0].apinvoicedetails[k].quantity,'invoice_id':this.apHdrSummarydt.apinvoiceheader[0].id,'branch_code':this.apHdrSummarydt?.raiserbranch?.code,
                    'invoicedate':this.apHdrSummarydt.apinvoiceheader[0].invoicedate,'otheramount':this.apHdrSummarydt.apinvoiceheader[0].apinvoicedetails[k].otheramount,'productname':this.apHdrSummarydt.apinvoiceheader[0].apinvoicedetails[k].productname,
                    'product_code':this.apHdrSummarydt.apinvoiceheader[0].apinvoicedetails[k].productcode,'apsubcat_code':this.apHdrSummarydt.apinvoiceheader[0]?.apinvoicedetails[k]?.apdebit["data"][0]?.subcategory_code?.code,'inv_debit_tax':this.apHdrSummarydt.apinvoiceheader[0].apinvoicedetails[k].taxamount,
                    'invoicedtails_id':this.apHdrSummarydt.apinvoiceheader[0].apinvoicedetails[k].id};  
                    this.dbtfadet.push(this.detailsfa)
                    break; 
              }
            }
          }     
        }       
      }
      else
      {
        this.notification.showError("Invoice Detail Empty")
      }
    }  
    if(this.fadatainsertflage==true)
    {
      this.dataforfa=
      {
        "details":JSON.stringify(this.dbtfadet).toString(),
        "groupno": 0,
        "remarks": this.apHdrSummarydt.remark?.toString(),
        "assettype": this.apHdrSummarydt.aptype.text.toString(),
        "totamount": this.apHdrSummarydt.apinvoiceheader[0].totalamount,
        "invoicecount": 1,
        "tottaxamount": this.apHdrSummarydt.apinvoiceheader[0].taxamount,
        "balanceamount": 0,
        "totinvoiceamount": this.apHdrSummarydt.apinvoiceheader[0].invoiceamount,
        "capitalizedamount": 0
      } 
      console.log("fadata",this.dataforfa)
    } 
  }
}
