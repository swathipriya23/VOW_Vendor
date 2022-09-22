import { Component, ViewChild, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { DatePipe, formatDate } from "@angular/common";
import { Ap1Service } from "../ap1.service";
import { NotificationService } from "../../service/notification.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ApShareServiceService } from "../ap-share-service.service";
import {
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS,
} from "@angular/material/core";
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { fromEvent, Observable } from "rxjs";
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
const apiurl = environment.apiURL;
export interface Master {
  title: string;
  model: number;
}
export interface supplierListss {
  name: string;
  id: number;
}
export interface branchListss {
  name: string;
  codename: string;
  id: number;
}
export const PICK_FORMATS = {
  parse: { dateInput: { month: "short", year: "numeric", day: "numeric" } },
  display: {
    dateInput: "input",
    monthYearLabel: { year: "numeric", month: "short" },
    dateA11yLabel: { year: "numeric", month: "long", day: "numeric" },
    monthYearA11yLabel: { year: "numeric", month: "long" },
  },
};

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === "input") {
      return formatDate(date, "dd-MMM-yyyy", this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: "app-preparepayment",
  templateUrl: "./preparepayment.component.html",
  styleUrls: ["./preparepayment.component.scss"],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
  ],
})
export class PreparepaymentComponent implements OnInit {
  perpay: any = FormGroup;
  crno: any;
  branch: any = [];
  ischeck = true;
  invoicetype: any = [];
  invtyp: any;
  invoicedate: any;
  apinvoicehdr_id: any;
  raiser_employeename: any = [];
  invdate: any;
  data: any = [];
  has_next = true;
  isLoading = false;
  has_previous = true;
  pageSizeApp = 10;
  absolutedata: any;
  parAppList: any;
  presentpage: any = 1;
  pageNumber: any;
  pageSize: any;
  sup: any;
  raiser: any;
  date: any;
  bank: any;
  invoice_no: any;
  invoice_date: any;
  beni: any;
  ifsc: any;
  acno: any;
  d: any = [];
  incamt: any;
  invoice_amount: any;
  paymode: any;
  latest_date: any;
  apamount: any;
  istrue: boolean = true;
  year: any;
  time: any;
  glno: any;
  payto: any;
  invdet: any = [];
  creditrefno: any;
  apinvHeader_id: any;
  oracalinput: any;
  entryflage: boolean = false;
  creditamount: any;
  dbtamt: any;
  type: any;
  typeinput: any;
  bankdetails_idinput: any;
  apcredit_idid: any;
  headerid: any;
  iserrorflase: boolean;
  rasierbranchid: any;
  rasierbranchcode: any;
  payementsubmitflage: boolean = false;
  datamissingflage: boolean = false;
  TypeList: any = [];
  payinbank: any;
  latest_datee: any;
  timedownaled: any;
  pvnu: any;
  utrno: any;
  Supplierlist: Array<supplierListss>;
  pvlist: any = [];
  dear: any = [];
  bankk: any;
  benii: any;
  des: any;
  ifscc: any;
  acnoo: any;
  select_flag: any;
  overallstatusinput:any=[];
  entryinactivedata:any=[];
  getcototalcount:any;
  @ViewChild("suppliertype") matsuppAutocomplete: MatAutocomplete;
  @ViewChild("suppInput") suppInput: any;
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  // intyp = ["Po", "Non-PO", "Advance,Emp","Emp Claim"];
  intyp: Master[] = [
    { title: "PO", model: 1 },
    { title: "Non PO", model: 2 },
    { title: "ADVANCE", model: 3 },
    { title: "EMP Claim", model: 4 },
    { title: "BRANCH EXP", model: 5 },
    { title: "PETTY CASH", model: 6 },
    { title: "SI", model: 7 },
    { title: "TAF", model: 8 },
    { title: "TCF", model: 9 },
    { title: "EB", model: 10 },
    { title: "RENT", model: 11 },
    { title: "DTPC", model: 12 },
    { title: "SGB", model: 13 },
    { title: "ICR", model: 14 },
  ];
  checknumb: number;
  routeData: any = [];
  RoutingECFValue: any = [];
  newDataRouting: any = [];
  invoiceTypeValue: any = [];
  payemententryinput: any = [];
  invCreditList: any = [];
  invCreditList1: any = [];
  typeid: any;
  dataa: any = [];
  overallstatusinputwithkey:any;
  @ViewChild("payementsubmit") payementsubmit;
  constructor(
    private formbuilder: FormBuilder,
    private service: Ap1Service,
    private router: Router,
    private datepipe: DatePipe,
    private notification: NotificationService,
    private spinner: NgxSpinnerService,
    private shareservice: ApShareServiceService,
    private datePipe: DatePipe
  ) {}

  async ngOnInit() {
    this.routeData = this.shareservice.commonsummary.value;
    this.RoutingECFValue = this.routeData["key"];
    this.newDataRouting = this.routeData["data"];
    this.time = new Date().toLocaleTimeString();
    this.perpay = this.formbuilder.group({
      crno: [""],
      invoicetype: [],
      sup: [],
      bar: [],
      invoice_no: [""],
      inmt: [""],
      invoice_from_date: [""],
      raiser_employeename: [""],
      invoice_to_date: [""],
    });
    this.getdata();
    this.getbranch();
    this.getecftype();
    this.perpay.get("bar").valueChanges.subscribe((value) => {
      this.service.branchget(value).subscribe((data) => {
        console.log("h");
        this.branch = data["data"];
        console.log(this.branch);
      });
    });
  }

  getdata() {
    this.spinner.show();
    // if(this.RoutingECFValue==1){
    //   console.log('santhoshECF',this.newDataRouting)
    //   this.data = this.newDataRouting
    //   this.spinner.hide();
    // }
    // else{
    this.date = new Date();
    this.latest_date = this.datePipe.transform(this.date, "yyyy-MM-dd");
    this.year = this.datePipe.transform(this.date, "yyyy");
    this.service.prepayi({}, this.presentpage).subscribe((data) => {
      if (data?.code == "INVALID_DATA") {
        this.notification.showError(data.description);
        this.spinner.hide();
      } else {
        console.log("payment=", data);
        this.data = data["data"];
        let datapagination = data["pagination"];
        this.getcototalcount = data["pagination"]?.count;
        this.spinner.hide();

        if (this.data.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }
        if (data) {
          this.updatewhilePagination();
        }
      }
    });
    // }
    return true;
  }
  nextClick() {
    if (this.has_next === true) {
      //   this.service.apicallservice({}, this.presentpage+1)
      this.presentpage = this.presentpage + 1;
      //  this.search();
      this.getdata();
    }
  }
  previousClick() {
    if (this.has_previous === true) {
      //       this.service.apicallservice({}, this.presentpage-1)
      this.presentpage = this.presentpage - 1;
      // this.search();
      this.getdata();
    }
  }
  public displayFnbranchn(branchtype?: branchListss): string | undefined {

    return branchtype ? branchtype.name : undefined;
  }
  getbranch() {
    this.service.branchget("").subscribe((data) => {
      console.log("h");
      this.branch = data["data"];
      console.log(this.branch);
    });
  }
  search() {
    let values = this.perpay.value.crno;
    let fill: any = {};
    if (
      this.perpay.get("crno").value != null &&
      this.perpay.get("crno").value != ""
    ) {
      fill["crno"] = this.perpay.get("crno").value;
    }
    if (
      this.perpay.get("invoice_from_date").value != null &&
      this.perpay.get("invoice_from_date").value != ""
    ) {
      fill["invoice_from_date"] = this.datepipe.transform(
        this.perpay.get("invoice_from_date").value,
        "yyyy-MM-dd"
      );
    }
    if (
      this.perpay.get("invoice_to_date").value != null &&
      this.perpay.get("invoice_to_date").value != ""
    ) {
      fill["invoice_to_date"] = this.datepipe.transform(
        this.perpay.get("invoice_to_date").value,
        "yyyy-MM-dd"
      );
    }
    if (
      this.perpay.get("invoice_no").value != null &&
      this.perpay.get("invoice_no").value != ""
    ) {
      fill["invoice_no"] = this.perpay.get("invoice_no").value;
    }
    if (
      this.perpay.get("sup").value != null &&
      this.perpay.get("sup").value != ""
    ) {
      fill["supplier_id"] = this.perpay.get("sup").value?.id;
    }
    if (
      this.perpay.get("bar").value != null &&
      this.perpay.get("bar").value != ""
    ) {
      fill["branch_id"] = this.perpay.get("bar").value.id;
    }
    if (
      this.perpay.get("raiser_employeename").value != null &&
      this.perpay.get("raiser_employeename").value != ""
    ) {
      fill["raisername"] = this.perpay.get("raiser_employeename").value;
    }
    if (
      this.perpay.get("invoicetype").value != null &&
      this.perpay.get("invoicetype").value != ""
    ) {
      fill["invoicetype_id"] = this.invoiceTypeValue;
    }
    if (
      this.perpay.get("inmt").value != null &&
      this.perpay.get("inmt").value != ""
    ) {
      fill["invoice_amount"] =  this.perpay.get("inmt").value;
    }

    let val = this.perpay.value.crno;
    this.crno = this.perpay.value.crno;
    this.service.prepayi(fill, this.presentpage).subscribe((data) => {
      console.log("search=", data);
      this.data = data["data"];
      let datapagination = data["pagination"];
      this.getcototalcount = data["pagination"]?.count;
      if (this.data.length > 0) {
        this.has_next = datapagination?.has_next;
        this.has_previous = datapagination?.has_previous;
        this.presentpage = datapagination?.index;
      }
    });
    console.log("Crno", this.crno);
    console.log("Crno", this.crno);
  }
  cancel() {
    this.spinner.show();
    this.perpay.reset();
    this.invoiceTypeValue = "";
    this.perpay.reset();
    this.service.prepayi({}, this.presentpage).subscribe((data) => {
      console.log("rr=", data);
      this.data = data["data"];
      this.getcototalcount = data["pagination"]?.count;
      this.spinner.hide();
    });
  }
  // numberOnly(event) {
  //   var k;
  //   k = event.charCode;
  //  return ((k > 96 && k < 123) || (k >= 48 && k <= 57));
  // }

  checkboxData = Array(100).fill(false);
  dataToPatch: any;
  compareIdData: any;
  getcredit(data) {
    let creditdata = data.apcredit_data["data"];
    console.log("creditdata", creditdata);
    for (let k = 0; k < creditdata?.length; k++) {
      if (creditdata[k]?.paymode?.gl_flag == "Payable") {
        this.des = creditdata[k]?.description?.toString();
        this.dbtamt = creditdata[k]?.amount;
        let credit = {
          branch_id: data?.raiserbranch_id?.toString(),
          branch_code: data.raiserbranch?.code?.toString(),
          fiscalyear: this.year?.toString(),
          period: "1",
          module: 2,
          screen: 2,
          valuedate: this.latest_date?.toString(),
          valuetime: this.time?.toString(),
          cbsdate: this.latest_date?.toString(),
          localcurrency: "1",
          localexchangerate: "12",
          currency: "1",
          exchangerate: "10",
          isprevyrentry: "1",
          reversalentry: "2",
          refno: creditdata[k]?.creditrefno?.toString(),
          crno: data.crno?.toString(),
          refid: "AP",
          reftableid: data.id?.toString(),
          type: "2",
          gl: "121014",
          apcatno: "500",
          apsubcatno: "352",
          wisefinmap: "12",
          glremarks: "12",
          amount: creditdata[k]?.amount?.toString(),
          fcamount: "13",
          ackrefno: "123",
          entry_status: 1,
          vendor_type: "default",
          description: this.des,
        };
        this.payemententryinput.push(credit);
      }
    }

    let entrydata: any = {
      crno: data.crno?.toString(),
      invoiceheader_id: data.id,
      invoicedetails_id: this.invdet[0]?.id,
      module_name: this.typeinput,
    };

    this.service.payement(entrydata).subscribe((payementresult) => {
      
      for (let i = 0; i < payementresult.apdebit.length; i++) {
        this.service
          .catget(payementresult["apdebit"][i].debitglno)
          .subscribe((result) => {
            let catno = result["data"][0]?.apcat_no;
            let subcatno = result["data"][0]?.subcat_no;
            let debit = {
              branch_id: data?.raiserbranch_id?.toString(),
              branch_code: data.raiserbranch?.code?.toString(),
              fiscalyear: this.year?.toString(),
              period: "1",
              module: 2,
              screen: 2,
              valuedate: this.latest_date?.toString(),
              valuetime: this.time?.toString(),
              cbsdate: this.latest_date?.toString(),
              localcurrency: "1",
              localexchangerate: "12",
              currency: "1",
              exchangerate: "10",
              isprevyrentry: "1",
              reversalentry: "2",
              refno: data.apcredit["data"][0]?.creditrefno?.toString(),
              crno: data.crno?.toString(),
              refid: "AP",
              reftableid: data.id?.toString(),
              type: "1",
              gl: payementresult["apdebit"][i]?.debitglno?.toString(),
              apcatno: catno?.toString(),
              apsubcatno: subcatno?.toString(),
              wisefinmap: "12",
              glremarks: "12",
              amount: this.dbtamt?.toString(),
              fcamount: "13",
              ackrefno: "123",
              entry_status: 1,
              vendor_type: "default",
              description: this.des,
            };
            this.payemententryinput.push(debit);
          });
      }
    });
    // }
    // }
    // error=>{
    //   console.log("Inv Credit Detail data not found")

    // }
    // );
  }
  // checkbox(index, data, e) {
  //   this.datamissingflage=false
  //   console.log("data", data);
  //   this.apinvHeader_id = data?.id;
  //   this.rasierbranchid=data?.raiserbranch_id
  //   this.rasierbranchcode=data?.raiserbranch?.code
  //   this.paymode=data?.credit_paymode?.name
  //   this.service.payementvalidation(this.apinvHeader_id).subscribe((validationresult)=>
  //   {
  //     if(validationresult["status"]=="Success")
  //     {
  //       this.payemententryinput.splice(0, this.payemententryinput.length);
  //       this.crno = data?.crno;
  //       this.type = data?.invoicetype?.text;
  //       this.typeid=data?.invoicetype?.id
  //       console.log("typeid",this.typeid)
  //       if (this.typeid == 8) {
  //         this.typeinput = "TCF PAYMENT";
  //         console.log("this.typeinput",this.typeinput)
  //       }
  //       else if(this.typeid == 3)
  //       {
  //         this.typeinput = "EMP REIMP PAYMENT";
  //       }
  //       else if(this.typeid  ==4)
  //       {
  //         let advancetype=this.crno.slice(0, 3);
  //         console.log("advancetype",advancetype)
  //         if(advancetype == "ADV")
  //         {
  //           this.typeinput = "ADV PAYMENT";
  //         }
  //         else {
  //           this.typeinput = "ADE PAYMENT";
  //         }
  //       }
  //       else {
  //         this.typeinput = "PAYMENT";
  //         console.log("this.typeinput",this.typeinput)
  //       }
  //       // this.invdetdbt();

  //       this.invdet = data?.invoicedetails["data"];
  //       this.getcredit();
  //       console.log("invdet", this.invdet);
  //       this.date = new Date();
  //       this.latest_date = this.datepipe.transform(this.date, "yyyy-MM-dd");
  //       this.ischeck = false;
  //       this.invtyp = data?.invoicetype?.text;
  //       this.sup = data?.supplier?.name;
  //       this.raiser = data?.raiser_employeename;
  //       this.payto = data?.pay_to;
  //       if (this.typeid == 8 || this.typeid == 3) {
  //         if (data.pay_to == "E") {
  //           if(data?.employee_accountdtls["data"]?.length==0)
  //           {
  //             this.datamissingflage=true
  //             this.notification.showError("employee_accountdtls Empty");
  //           }
  //           else
  //           {
  //             this.bank = data?.employee_accountdtls?.bank_name;
  //             this.beni = data?.employee_accountdtls?.beneficiary_name;
  //             this.ifsc = data?.employee_accountdtls?.bankbranch?.ifsccode;
  //             this.acno = data?.employee_accountdtls?.account_number;
  //           }
  //         } else {
  //           this.datamissingflage=true
  //           this.notification.showError("Payement Type MisMatch");
  //         }
  //       }
  //       if (this.typeid == 2) {
  //         if (data.pay_to == "S") {
  //           if (data?.supplierpayment_details["data"]?.length == 0 || data?.supplierpayment_details?.length == 0) {
  //             this.datamissingflage=true
  //             this.notification.showError("Supplierpayment_details Is Empty");
  //           } else {
  //             this.bank = data?.supplierpayment_details["data"][0]?.bank_id?.name;
  //             this.beni = data?.supplierpayment_details["data"][0]?.beneficiary;
  //             this.ifsc =
  //               data?.supplierpayment_details["data"][0]?.branch_id?.ifsccode;
  //             this.acno = data?.supplierpayment_details["data"][0]?.account_no;
  //           }
  //         } else {
  //           this.datamissingflage=true
  //           this.notification.showError("Payement Type MisMatch");
  //         }
  //       }
  //       if(this.typeid == 4)
  //       {
  //         if(data.pay_to == "E")
  //         {
  //           if(data?.employee_accountdtls["data"]?.length==0)
  //           {
  //             this.datamissingflage=true
  //             this.notification.showError("employee_accountdtls Empty");
  //           }
  //           else
  //           {
  //             this.bank = data?.employee_accountdtls?.bank_name;
  //             this.beni = data?.employee_accountdtls?.beneficiary_name;
  //             this.ifsc = data?.employee_accountdtls?.bankbranch?.ifsccode;
  //             this.acno = data?.employee_accountdtls?.account_number;
  //           }
  //         }
  //         else
  //         {
  //           if (data?.supplierpayment_details["data"]?.length == 0 || data?.supplierpayment_details?.length == 0) {
  //             this.datamissingflage=true
  //             this.notification.showError("Supplierpayment_details Is Empty");
  //           }
  //           else
  //           {
  //             this.bank = data?.supplierpayment_details["data"][0]?.bank_id?.name;
  //             this.beni = data?.supplierpayment_details["data"][0]?.beneficiary;
  //             this.ifsc =
  //               data?.supplierpayment_details["data"][0]?.branch_id?.ifsccode;
  //             this.acno = data?.supplierpayment_details["data"][0]?.account_no;
  //           }
  //         }
  //       }
  //       this.invoice_no = data?.invoice_no;
  //       this.invoice_date = data?.invoice_date;
  //       this.invoice_amount = data?.invoice_amount;
  //       this.apamount = data?.apamount;
  //       this.compareIdData = data?.id;
  //       if (data?.apcredit["data"]?.length == 0) {
  //         this.datamissingflage=true
  //         this.notification.showError("Credit Details Is Empty");
  //       } else {
  //         this.incamt = data?.apcredit["data"][0]?.amount;
  //         // this.paymode = data.apcredit["data"][0].paymode.name;
  //         if (data.apcredit["data"][0].creditglno == "null") {
  //           this.notification.showError("GL Number is Empty");
  //         } else {
  //           this.glno = data?.apcredit["data"][0]?.creditglno;
  //         }
  //         this.creditrefno = data?.apcredit["data"][0]?.creditrefno;
  //         if (data.apcredit["data"][0].bankdetails.code == "INVALID_BANK_ID") {
  //           this.notification.showError("INVALID_BANK_ID");
  //         } else {
  //           this.bankdetails_idinput =
  //             data?.apcredit["data"][0]?.bankdetails?.bankbranch?.bank?.id;
  //         }
  //         this.apcredit_idid = data?.apcredit["data"][0]?.id;
  //         this.headerid = data?.apcredit["data"][0]?.apinvoiceheader;
  //       }
  //       this.dataforbank()
  //       let absolutedata = this.data;

  //       for (let idata in absolutedata) {
  //         if (absolutedata[idata].id == data.id) {
  //           this.checkboxData[idata] = !this.checkboxData[idata];

  //           this.d = absolutedata[idata];
  //         } else {
  //           this.checkboxData[idata] = false;
  //         }
  //       }
  //       for (let i in this.checkboxData) {
  //         if (this.checkboxData[i] == true) {
  //           this.istrue = false;
  //           break;
  //         } else {
  //           this.istrue = true;
  //         }
  //       }
  //     }
  //     else
  //     {
  //       this.notification.showError(validationresult["message"])
  //     }
  //   })
  //  console.log(" this.payementsubmitflage", this.payementsubmitflage)

  // }
  checkbox(i, d, e) {
    console.log("d", d);
    console.log(e.target.checked);
    if (d.pay_to == "E") {
      if (d.employee_accountdtls["data"]?.length == 0) {
        this.datamissingflage = true;
        this.notification.showError("employee_accountdtls Empty for" + d.crno);
        return false;
      }
    }
    if (d.pay_to == "S") {
      if (
        d?.supplierpayment_details["data"]?.length == 0 ||
        d.supplierpayment_details?.length == 0
      ) {
        this.datamissingflage = true;
        this.notification.showError("Supplierpayment_details Is Empty");
        return false;
      }
    }
    if (e.target.checked == true) {
      this.invdet = d?.invoicedetails["data"];
      this.crno = d.crno;
      this.typeid = d?.invoicetype?.id;
      console.log("typeid", this.typeid);
      if (this.typeid == 8) {
        this.typeinput = "TCF PAYMENT";
        console.log("this.typeinput", this.typeinput);
      } else if (this.typeid == 3) {
        this.typeinput = "EMP REIMP PAYMENT";
      } else if (this.typeid == 4) {
        let advancetype = this.crno.slice(0, 3);
        console.log("advancetype", advancetype);
        if (advancetype == "ADV") {
          this.typeinput = "ADV PAYMENT";
        } else {
          this.typeinput = "ADE PAYMENT";
        }
      } else {
        this.typeinput = "PAYMENT";
        console.log("this.typeinput", this.typeinput);
      }
      console.log("invdet", this.invdet);
      this.date = new Date();
      this.latest_date = this.datepipe.transform(this.date, "yyyy-MM-dd");
      this.apinvHeader_id = d?.id;
      this.rasierbranchid = d?.raiserbranch_id;
      this.rasierbranchcode = d?.raiserbranch?.code;
      this.creditrefno = d?.apcredit["data"][0]?.creditrefno;
      this.service
        .payementvalidation(this.apinvHeader_id)
        .subscribe((validationresult) => {
          if (validationresult["status"] == "Success") {
            let statusinput = {
              status_id: "11",
              remark: "NA",
              apinvoicehdr_id:
               this.apinvHeader_id,
            };
            this.pvlist.push(d);
            console.log("this.pvlist", this.pvlist);
            this.overallstatusinput.push(statusinput);
            console.log("this.overallstatusinput",this.overallstatusinput)
            this.getcredit(d);
            console.log("payemententryinput", this.payemententryinput);
            let entryinact={
              "ap_type": "AP_PAYMENT","crno": d.crno
            }
            this.entryinactivedata.push(entryinact)
            console.log("this.entryinactivedata", this.entryinactivedata)
          } else {
            this.notification.showError(validationresult["message"]);
          }
        });
    } else {
      let index = this.pvlist.indexOf(d);
      this.pvlist.splice(index, 1);
      console.log("input", this.pvlist);
      for (let l = 0; l < this.payemententryinput.length; l++) {
        if (this.payemententryinput[l].reftableid == d.id) {
          this.payemententryinput.splice(l, 2);
        }
        for(let m=0; m < this.overallstatusinput.length;m++)
        {
          if(this.overallstatusinput[m].apinvoicehdr_id == d.id)
          {
            this.overallstatusinput.splice(m, 1);
          }
        }
      }
      console.log("payemententryinput", this.payemententryinput);
      console.log("this.overallstatusinput",this.overallstatusinput)
    }
  }

  checks(i) {
    if (this.checknumb == i) {
      return false;
    } else {
      return true;
    }
  }

  prepare(absolutedata) {}
  //  paymentsubmit() {
  //     this.payementsubmitflage=true
  //     console.log("paysub", this.d);

  //     // console.log("this.payemententryinput", this.payemententryinput);
  //     this.spinner.show();
  //     this.service.crtdbt(this.payemententryinput).subscribe((entryresult) => {
  //       console.log("entrycrt", entryresult);
  //       if (entryresult.status == "success") {
  //         for(let j=0;j < this.pvlist.length;j++)
  //         {
  //           console.log(this.pvlist[j])
  //           let statusinput = {
  //             status_id: "11",
  //             remark: "NA",
  //             apinvoicehdr_id:  this.pvlist[j].apcredit["data"][0]?.apinvoiceheader.toString(),
  //           };
  //           let datapay=this.pvlist[j]
  //           this.statusap(statusinput,datapay,j);
  //         }
  //       } else {
  //         this.notification.showError(entryresult["description"]);
  //         this.getdata();
  //         this.payementsubmitflage=false
  //         this.datamissingflage=true
  //         this.spinner.hide();
  //       }
  //     });
  //     this.payementsubmit.nativeElement.click();
  //   }

  updatewhilePagination() {
    let absolutedata = this.data;
    for (let idata in absolutedata) {
      if (absolutedata[idata].id == this.compareIdData) {
        this.checkboxData[idata] = !this.checkboxData[idata];
        // this.istrue=false;
      } else {
        this.checkboxData[idata] = false;
      }
    }
  }
  getecftype() {
    this.spinner.show();
    this.service.getecftype().subscribe(
      (result) => {
        this.TypeList = result["data"];
        console.log("TypeList", this.TypeList);
      },
      (error) => {
        this.spinner.hide();
        this.notification.showWarning(error.status + error.statusText);
      }
    );
  }
  selectionChangeType(event) {
    console.log("event", event);
    if (event.isUserInput && event.source.selected == true) {
      this.invoiceTypeValue = event.source.value.id.toString();
    }
  }

  // dataforbank()
  // {

  // }
  getsupplierdd() {
    let parentkeyvalue: String = "";
    this.getsupplierdropdown(parentkeyvalue);
    this.perpay
      .get("sup")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')
        }),

        switchMap((value) =>
          this.service.getsupplierscroll(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Supplierlist = datas;
      });
  }
  private getsupplierdropdown(parentkeyvalue) {
    this.service.getsupplier(parentkeyvalue).subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.Supplierlist = datas;
      },
      (error) => {
        this.spinner.hide();
        this.notification.showWarning(error.status + error.statusText);
      }
    );
  }
  supplierScroll() {
    setTimeout(() => {
      if (
        this.matsuppAutocomplete &&
        this.matsuppAutocomplete &&
        this.matsuppAutocomplete.panel
      ) {
        fromEvent(this.matsuppAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matsuppAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matsuppAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matsuppAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matsuppAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.service
                  .getsupplierscroll(
                    this.suppInput.nativeElement.value,
                    this.presentpage + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Supplierlist.length >= 0) {
                      this.Supplierlist = this.Supplierlist.concat(datas);
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.presentpage = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
  public displayFnsupplier(suppliertype?: supplierListss): string | undefined {
    return suppliertype ? suppliertype.name : undefined;
  }

  get suppliertype() {
    return this.perpay.get("sup");
  }
  nacbankapi() {
    this.service.nacpayementtobank(this.payinbank).subscribe((bankoutput) => {
      if (bankoutput?.paymentTransactionResp?.msgHdr?.rslt == "OK") {
        console.log("bankinput", this.payinbank);
        console.log("bankoutput", bankoutput);
        console.log(
          "resultstatus",
          bankoutput?.paymentTransactionResp?.msgHdr?.rslt
        );
        console.log(
          "UTRNUM",
          bankoutput?.paymentTransactionResp?.msgBdy?.paymentRes?.coreRef
        );
        this.utrno =
          bankoutput?.paymentTransactionResp?.msgBdy?.paymentRes?.coreRef;
        let payinput = {
          paymentpvno_list: [
            {
              "Customer Ref no.": this.pvnu.toString(),
              "UTR RefNo": this.utrno,
            },
          ],
        };
        let file;
        this.service.paid(payinput, file).subscribe((result) => {
          if (result["status"] == "success") {
            this.payementsubmitflage = false;
            this.datamissingflage = true;
            this.getdata();
            this.spinner.hide();
            this.notification.showSuccess(result["message"]);
          } else {
            this.spinner.hide();
            this.payementsubmitflage = false;
            this.datamissingflage = true;
            this.notification.showInfo(result["message"]);
          }
        });
      } else {
        this.spinner.hide();
        this.payementsubmitflage = false;
        this.datamissingflage = true;
        this.notification.showInfo("Automation Payments API Failed");
        console.log("bankoutput", bankoutput);
      }
    });
  }
  async statusap(statusinput, datapay, j) {
    let dat = datapay;
    this.service.bounce(statusinput).subscribe((data) => {
      if (data["status"] == "success") {
        this.incamt = datapay?.apcredit["data"][0]?.amount;
        this.paymode = data?.credit_paymode?.name;
        if (datapay.pay_to == "E") {
          if (datapay?.employee_accountdtls["data"]?.length == 0) {
            this.datamissingflage = true;
            this.notification.showError(
              "employee_accountdtls Empty for" + datapay.crno
            );
          } else {
            this.bank = datapay?.employee_accountdtls?.bank_name;
            this.beni = datapay?.employee_accountdtls?.beneficiary_name;
            this.ifsc = datapay?.employee_accountdtls?.bankbranch?.ifsccode;
            this.acno = datapay?.employee_accountdtls?.account_number;
          }
        }
        if (datapay?.pay_to == "S") {
          if (
            datapay?.supplierpayment_details["data"]?.length == 0 ||
            datapay?.supplierpayment_details?.length == 0
          ) {
            this.datamissingflage = true;
            this.notification.showError("Supplierpayment_details Is Empty");
          } else {
            this.bank =
              datapay?.supplierpayment_details["data"][0]?.bank_id?.name;
            this.beni =
              datapay?.supplierpayment_details["data"][0]?.beneficiary;
            this.ifsc =
              datapay?.supplierpayment_details["data"][0]?.branch_id?.ifsccode;
            this.acno = datapay?.supplierpayment_details["data"][0]?.account_no;
          }
        }
      } else {
        this.payementsubmitflage = false;
        this.datamissingflage = true;
        this.spinner.hide();
        this.notification.showError(data["message"]);
      }
    });
  }
  async pvnogenapi(dat) {
    let pay: any = {
      paymentheader_date: this.latest_date?.toString(),
      paymentheader_amount: this.incamt?.toString(),
      ref_id: "1",
      reftable_id: "2",
      paymode: dat.apcredit["data"][0].paymode.name.toString(),
      bankdetails_id:
        dat.apcredit["data"][0]?.bankdetails?.bankbranch?.bank?.id.toString(),
      beneficiaryname: this.beni?.toString(),
      bankname: this.bank?.toString(),
      ifsc_code: this.ifsc?.toString(),
      pay_to: dat?.pay_to?.toString(),
      accno: this.acno?.toString(),
      remarks: this.d?.remarks?.toString(),
      payment_dtls: [
        {
          apinvhdr_id: dat.apcredit["data"][0]?.apinvoiceheader.toString(),
          apcredit_id: dat.apcredit["data"][0]?.id.toString(),
          paymntdtls_amt: this.incamt?.toString(),
        },
      ],
    };
    this.service.paymentsubmit(pay).subscribe((pvdata) => {
      if (pvdata?.id) {
        this.pvnu = "PV" + pvdata.id;
        console.log("PVNO", "PV" + pvdata.id);
        this.oracalinput = {
          AP_Type: "AP_PAYMENT",
          CR_Number: dat.crno.toString(),
        };
        this.oracalaoi(dat);
      } else {
        this.payementsubmitflage = false;
        this.datamissingflage = true;
        this.spinner.hide();
        this.notification.showError(pvdata["message"]);
      }
    });
  }
  oracalaoi(dat) {
    this.service.oracal(this.oracalinput).subscribe((result) => {
      console.log("oracal", result);
      if (result.Message == "SUCCESS") {
        let paymentini_input: any = {
          apinvoiceheader_id:
            dat.apcredit["data"][0]?.apinvoiceheader.toString(),
          remarks: "ok",
        };
        this.nacbankapi();
      } else {
        this.notification.showError(JSON.stringify(result));
        this.payementsubmitflage = false;
        this.datamissingflage = true;
        this.getdata();
        this.spinner.hide();
      }
    });
  }
  paymentsubmit() {
    this.payementsubmitflage = true;
    console.log("paysub", this.d);
    console.log("this.payemententryinput", this.payemententryinput);
    this.spinner.show();
    this.service.crtdbt(this.payemententryinput).subscribe((entryresult) => {
      console.log("entrycrt", entryresult);
      for (let j = 0; j < this.pvlist.length; j++) {
        if (entryresult.status == "success") {
          let statusinput = {
            status_id: "11",
            remark: "NA",
            apinvoicehdr_id:
              this.pvlist[j].apcredit["data"][0]?.apinvoiceheader.toString(),
          };
          console.log("entryresult", j);
          this.service.bounce(statusinput).subscribe((data) => {
            if (data["status"] == "success") {
              console.log("APIniciate", j);
              this.incamt = this.pvlist[j]?.apcredit["data"][0]?.amount;
              this.paymode = this.pvlist[j]?.credit_paymode?.name;
              if (this.pvlist[j].pay_to == "E") {
                if (this.pvlist[j]?.employee_accountdtls["data"]?.length == 0) {
                  // this.datamissingflage=true
                  this.notification.showError(
                    "employee_accountdtls Empty for" + this.pvlist[j].crno
                  );
                } else {
                  this.bank = this.pvlist[j]?.employee_accountdtls?.bank_name;
                  this.beni =
                    this.pvlist[j]?.employee_accountdtls?.beneficiary_name;
                  this.ifsc =
                    this.pvlist[j]?.employee_accountdtls?.bankbranch?.ifsccode;
                  this.acno =
                    this.pvlist[j]?.employee_accountdtls?.account_number;
                }
              }
              if (this.pvlist[j]?.pay_to == "S") {
                if (
                  this.pvlist[j]?.supplierpayment_details["data"]?.length ==
                    0 ||
                  this.pvlist[j]?.supplierpayment_details?.length == 0
                ) {
                  // this.datamissingflage=true
                  this.notification.showError(
                    "Supplierpayment_details Is Empty"
                  );
                } else {
                  this.bank =
                    this.pvlist[j]?.supplierpayment_details[
                      "data"
                    ][0]?.bank_id?.name;
                  this.beni =
                    this.pvlist[j]?.supplierpayment_details[
                      "data"
                    ][0]?.beneficiary;
                  this.ifsc =
                    this.pvlist[j]?.supplierpayment_details[
                      "data"
                    ][0]?.branch_id?.ifsccode;
                  this.acno =
                    this.pvlist[j]?.supplierpayment_details[
                      "data"
                    ][0]?.account_no;
                }
              }

              let pay: any = {
                paymentheader_date: this.latest_date?.toString(),
                paymentheader_amount: this.incamt?.toString(),
                ref_id: "1",
                reftable_id: "2",
                paymode: this.paymode?.toString(),
                bankdetails_id:
                  this.pvlist[j]?.apcredit[
                    "data"
                  ][0]?.bankdetails?.bankbranch?.bank?.id?.toString(),
                beneficiaryname: this.beni?.toString(),
                bankname: this.bank?.toString(),
                ifsc_code: this.ifsc?.toString(),
                pay_to: this.pvlist[j].pay_to.toString(),
                accno: this.acno?.toString(),
                remarks: "pay",
                payment_dtls: [
                  {
                    apinvhdr_id:
                      this.pvlist[j]?.apcredit[
                        "data"
                      ][0]?.apinvoiceheader.toString(),
                    apcredit_id:
                      this.pvlist[j]?.apcredit["data"][0]?.id.toString(),
                    paymntdtls_amt: this.incamt?.toString(),
                  },
                ],
              };
              this.service.paymentsubmit(pay).subscribe((pvdata) => {
                console.log("paymentsubmit", j);
                if (pvdata?.id) {
                  this.oracalinput = {
                    AP_Type: "AP_PAYMENT",
                    CR_Number: this.pvlist[j].crno?.toString(),
                  };
                  this.pvnu = "PV" + pvdata.id;
                  console.log("PVNO", "PV" + pvdata.id);
                  this.service.oracal(this.oracalinput).subscribe((result) => {
                    console.log("oracal", result);
                    if (result.Message == "SUCCESS") {
                      console.log("oracal", j);
                      let paymentini_input: any = {
                        apinvoiceheader_id:
                          this.pvlist[j].apcredit[
                            "data"
                          ][0]?.apinvoiceheader.toString(),
                        remarks: "ok",
                      };
                      this.service
                        .payementstatusupdate(paymentini_input)
                        .subscribe((payinit) => {
                          if (payinit["status"] == "success") {
                            // this.notification.showSuccess(payinit["message"]);
                            if (apiurl == "http://143.110.244.51:8185/") {
                              // this.dataforbank()
                              console.log("payementstatusupdate", j);
                              const uuidv4 = require("uuid/v4");
                              var uni = uuidv4();
                              this.incamt =
                                this.pvlist[j]?.apcredit["data"][0]?.amount;
                              this.paymode =
                                this.pvlist[j]?.credit_paymode?.name;
                              this.latest_datee = this.datePipe.transform(
                                this.date,
                                "yyyyMMdd"
                              );
                              this.timedownaled =
                                this.date.getHours() +
                                ":" +
                                this.date.getMinutes() +
                                ":" +
                                this.date.getSeconds();
                              let datestm =
                                this.latest_date + " " + this.timedownaled;
                              var currentTimeInMilliseconds =
                                new Date().getUTCMilliseconds();
                              var datewithmili =
                                this.latest_date + currentTimeInMilliseconds;
                              var valdate = this.datePipe.transform(
                                this.date,
                                "dd-MM-yyyy"
                              );
                              if (this.pvlist[j].pay_to == "E") {
                                if (
                                  this.pvlist[j]?.employee_accountdtls["data"]
                                    ?.length == 0
                                ) {
                                  // this.datamissingflage=true
                                  this.notification.showError(
                                    "employee_accountdtls Empty for" +
                                      this.pvlist[j].crno
                                  );
                                } else {
                                  this.bankk =
                                    this.pvlist[
                                      j
                                    ]?.employee_accountdtls?.bank_name;
                                  this.benii =
                                    this.pvlist[
                                      j
                                    ]?.employee_accountdtls?.beneficiary_name;
                                  this.ifscc =
                                    this.pvlist[
                                      j
                                    ]?.employee_accountdtls?.bankbranch?.ifsccode;
                                  this.acnoo =
                                    this.pvlist[
                                      j
                                    ]?.employee_accountdtls?.account_number;
                                }
                              }
                              if (this.pvlist[j]?.pay_to == "S") {
                                if (
                                  this.pvlist[j]?.supplierpayment_details[
                                    "data"
                                  ]?.length == 0 ||
                                  this.pvlist[j]?.supplierpayment_details
                                    ?.length == 0
                                ) {
                                  // this.datamissingflage=true
                                  this.notification.showError(
                                    "Supplierpayment_details Is Empty"
                                  );
                                } else {
                                  this.bankk =
                                    this.pvlist[j]?.supplierpayment_details[
                                      "data"
                                    ][0]?.bank_id?.name;
                                  this.benii =
                                    this.pvlist[j]?.supplierpayment_details[
                                      "data"
                                    ][0]?.beneficiary;
                                  this.ifscc =
                                    this.pvlist[j]?.supplierpayment_details[
                                      "data"
                                    ][0]?.branch_id?.ifsccode;
                                  this.acnoo =
                                    this.pvlist[j]?.supplierpayment_details[
                                      "data"
                                    ][0]?.account_no;
                                }
                              }
                              this.payinbank = {
                                paymentTransactionReq: {
                                  msgHdr: {
                                    msgId:
                                      uni?.toString() /* Unique ID for each transaction */,
                                    cnvId:
                                      uni?.toString() /* Unique ID for each transaction. Can be same as above */,
                                    extRefId:
                                      "VSOLV" /* Any String can be passed. Better to pass as VSOLV */,
                                    bizObjId:
                                      "VSOLV" /* Any String can be passed. Better to pass as VSOLV */,
                                    appId:
                                      "CMSAPI" /* Constant. No changes Required */,
                                    timestamp: datestm /* Timestamp */,
                                  },
                                  msgBdy: {
                                    paymentReq: {
                                      custTxnRef:
                                        datewithmili /* Customer Transaction Reference Number. Unique Number */,
                                      beneAccNo:
                                        this
                                          .acnoo /* Beneficiary Account Number; For UAT use 20011101015042 */,
                                      beneName:
                                        this.beni /* Beneficiary Name */,
                                      beneAddr1:
                                        "INDIA" /* Beneficiary Address */,
                                      beneAddr2: "" /* Beneficiary Address */,
                                      ifsc: this
                                        .ifscc /* Beneficiary Bank IFSC Code; For UAT use, SIMB0002233 */,
                                      valueDate:
                                        this
                                          .latest_datee /* Can be current date or future date. Format: yyyymmdd */,
                                      tranCcy: "INR" /* INR */,
                                      tranAmount:
                                        this.incamt?.toString() /* Transaction Amount */,
                                      purposeCode: "CMS" /* CMS */,
                                      remitInfo1:
                                        "NAC-999040422PA02201" /* Remitter Information 1 */,
                                      remitInfo2:
                                        "NAC-999040422PA02201" /* Remitter Information 2 */,
                                      clientCode: "NACLSUAT" /* NACLSUAT */,
                                      paymentType:
                                        this
                                          .paymode /* Can be IMPS, NEFT and RTGS */,
                                      beneAccType:
                                        "CA" /* Current Account or Saving Account */,
                                      remarks:
                                        "NAC-999040422PA02201" /* Remarks About the Transaction */,
                                      beneMail:
                                        "ganesh.r@northernarc.com" /* Beneficiary Email ID */,
                                      beneMobile:
                                        "917708079993" /* Beneficiary Mobile No */,
                                    },
                                  },
                                },
                              };
                              console.log("this.payinbank", this.payinbank);
                              // this.service.nacpayementtobank(this.payinbank).subscribe((bankoutput)=>
                              // {
                              //   console.log("nacpayementtobank",j)
                              //   if(bankoutput['paymentTransactionResp'])
                              //   {
                              //       if(bankoutput?.paymentTransactionResp?.msgHdr?.rslt=='OK')
                              //       {
                              //         console.log("bankinput",this.payinbank)
                              //         console.log("bankoutput",bankoutput)
                              //         console.log("resultstatus",bankoutput?.paymentTransactionResp?.msgHdr?.rslt)
                              //         console.log("UTRNUM",bankoutput?.paymentTransactionResp?.msgBdy?.paymentRes?.coreRef)
                              //         this.utrno=bankoutput?.paymentTransactionResp?.msgBdy?.paymentRes?.coreRef;
                              //         let payinput={"paymentpvno_list":[{"Customer Ref no.":this.pvnu.toString(),"UTR RefNo":this.utrno}]}
                              //         let file;
                              //         this.service.paid(payinput,file)
                              //         .subscribe(result => {
                              //           if (result["status"] == "success") {
                              //             if(this.pvlist.length == ++j)
                              //             {
                              //                 this.payementsubmitflage=false
                              //                 this.datamissingflage=true
                              //                 this.payemententryinput.splice(0,this.payemententryinput.length)
                              //                 this.pvlist.splice(0,this.pvlist.length)
                              //                 this.getdata();
                              //                 this.spinner.hide();
                              //                 this.notification.showSuccess(result["message"]);
                              //             }
                              //           }
                              //           else
                              //           {
                              //             this.spinner.hide();
                              //             this.payementsubmitflage=false
                              //             this.datamissingflage=true
                              //             this.notification.showInfo(result["message"]);
                              //           }
                              //         })
                              //       }
                              //       else
                              //       {
                              //         this.spinner.hide();
                              //         this.payementsubmitflage=false
                              //         this.datamissingflage=true
                              //         this.notification.showInfo("Automation Payments API Failed")
                              //         console.log("bankoutput",bankoutput)
                              //       }
                              //   }
                              //   else
                              //   {
                              //     this.spinner.hide();
                              //     this.payementsubmitflage=false
                              //     this.datamissingflage=true
                              //     console.log("bankoutput",bankoutput)
                              //   }
                              // })
                            } else if (this.pvlist.length == ++j) {
                              this.payementsubmitflage = false;
                              this.datamissingflage = true;
                              this.payemententryinput.splice(
                                0,
                                this.payemententryinput.length
                              );
                              this.pvlist.splice(0, this.pvlist.length);
                              this.getdata();
                              this.spinner.hide();
                              this.notification.showSuccess(
                                "Successfully Updated"
                              );
                            } else {
                              this.payementsubmitflage = false;
                              this.datamissingflage = true;
                              this.getdata();
                              this.spinner.hide();
                            }
                          } else {
                            this.payementsubmitflage = false;
                            this.datamissingflage = true;
                            this.notification.showError(payinit["message"]);
                            this.getdata();
                            this.spinner.hide();
                          }
                        });
                    } else {
                      this.notification.showError(JSON.stringify(result));
                      this.payementsubmitflage = false;
                      this.datamissingflage = true;
                      this.getdata();
                      this.spinner.hide();
                    }
                  });
                } else {
                  this.payementsubmitflage = false;
                  this.datamissingflage = true;
                  this.spinner.hide();
                  this.notification.showError(pvdata["message"]);
                }
              });
            } else {
              this.payementsubmitflage = false;
              this.datamissingflage = true;
              this.spinner.hide();
              this.notification.showError(data["message"]);
            }
          });
        } else {
          this.notification.showError(entryresult["description"]);
          this.getdata();
          this.payementsubmitflage = false;
          this.datamissingflage = true;
          this.spinner.hide();
        }
      }
    });
    this.payementsubmit.nativeElement.click();
  }
//  paymentsubmitt() {
//       this.payementsubmitflage = true;
//       console.log("paysub", this.d);
//       console.log("this.payemententryinput", this.payemententryinput);
//       this.spinner.show();
//       this.service.crtdbt(this.payemententryinput).subscribe((entryresult) => {
//         console.log("entrycrt", entryresult);
//         if(entryresult.status == "success")
//         {
//           for (let j = 0; j < this.pvlist.length; j++) {
//                 let statusinput = {
//                   status_id: "11",
//                   remark: "NA",
//                   apinvoicehdr_id:
//                     this.pvlist[j].apcredit["data"][0]?.apinvoiceheader.toString(),
//                 };
//                 console.log("entryresult", j);
//                 this.service.bounce(statusinput).subscribe((data) => {
//                   if (data["status"] != "success")
//                   {
//                     this.payementsubmitflage = false;
//                     this.datamissingflage = true;
//                     this.spinner.hide();
//                     this.notification.showError(data["message"]);
//                     return false
//                   }
//                   (error)=>{
//                     this.payementsubmitflage = false;
//                     this.datamissingflage = true;
//                     this.spinner.hide();
//                     this.notification.showError(data["message"]);
//                     return false
//                   } 
//               }) 
//               this.incamt = this.pvlist[j]?.apcredit["data"][0]?.amount;
//               this.paymode = this.pvlist[j]?.credit_paymode?.name;
//               if (this.pvlist[j].pay_to == "E") {
//                 if (this.pvlist[j]?.employee_accountdtls["data"]?.length == 0) {
//                   // this.datamissingflage=true
//                   this.notification.showError(
//                     "employee_accountdtls Empty for" + this.pvlist[j].crno
//                   );
//                 } else {
//                   this.bank = this.pvlist[j]?.employee_accountdtls?.bank_name;
//                   this.beni =
//                     this.pvlist[j]?.employee_accountdtls?.beneficiary_name;
//                   this.ifsc =
//                     this.pvlist[j]?.employee_accountdtls?.bankbranch?.ifsccode;
//                   this.acno =
//                     this.pvlist[j]?.employee_accountdtls?.account_number;
//                 }
//               }
//               if (this.pvlist[j]?.pay_to == "S") {
//                 if (
//                   this.pvlist[j]?.supplierpayment_details["data"]?.length ==
//                     0 ||
//                   this.pvlist[j]?.supplierpayment_details?.length == 0
//                 ) {
//                   // this.datamissingflage=true
//                   this.notification.showError(
//                     "Supplierpayment_details Is Empty"
//                   );
//                 } else {
//                   this.bank =
//                     this.pvlist[j]?.supplierpayment_details[
//                       "data"
//                     ][0]?.bank_id?.name;
//                   this.beni =
//                     this.pvlist[j]?.supplierpayment_details[
//                       "data"
//                     ][0]?.beneficiary;
//                   this.ifsc =
//                     this.pvlist[j]?.supplierpayment_details[
//                       "data"
//                     ][0]?.branch_id?.ifsccode;
//                   this.acno =
//                     this.pvlist[j]?.supplierpayment_details[
//                       "data"
//                     ][0]?.account_no;
//                 }
//               }

//               let pay: any = {
//                 paymentheader_date: this.latest_date?.toString(),
//                 paymentheader_amount: this.incamt?.toString(),
//                 ref_id: "1",
//                 reftable_id: "2",
//                 paymode: this.paymode?.toString(),
//                 bankdetails_id:
//                   this.pvlist[j]?.apcredit[
//                     "data"
//                   ][0]?.bankdetails?.bankbranch?.bank?.id?.toString(),
//                 beneficiaryname: this.beni?.toString(),
//                 bankname: this.bank?.toString(),
//                 ifsc_code: this.ifsc?.toString(),
//                 pay_to: this.pvlist[j].pay_to.toString(),
//                 accno: this.acno?.toString(),
//                 remarks: "pay",
//                 payment_dtls: [
//                   {
//                     apinvhdr_id:
//                       this.pvlist[j]?.apcredit[
//                         "data"
//                       ][0]?.apinvoiceheader.toString(),
//                     apcredit_id:
//                       this.pvlist[j]?.apcredit["data"][0]?.id.toString(),
//                     paymntdtls_amt: this.incamt?.toString(),
//                   },
//                 ],
//               };
//                this.service.paymentsubmit(pay).subscribe((pvdata) => {
//                 console.log("paymentsubmit", j);
//               })
               
//            }
//         }
//         else
//         {
//           this.notification.showError(entryresult["description"]);
//           this.getdata();
//           this.payementsubmitflage = false;
//           this.datamissingflage = true;
//           this.spinner.hide();
//         }
//       })
//   }

  // async function 
 async paymentsubmitts() {
    this.payementsubmitflage = true;
    console.log("paysub", this.d);
    console.log("this.payemententryinput", this.payemententryinput);
    this.spinner.show();
    try
    {
      let entryfaileflage=false
      this.overallstatusinputwithkey =  { "apinvoicehdr_list":this.overallstatusinput}
      console.log("this.overallstatusinput", this.overallstatusinputwithkey);
      let a = await this.service.crtdbt(this.payemententryinput);
      a.subscribe((entryresult) => {
          console.log("entrycrt", entryresult);
          if(entryresult.status == "success")
          {
            entryfaileflage=false
             this.service.multiplestatus(this.overallstatusinputwithkey).subscribe((data) => {
              if (data["status"] != "success")
              {
                console.log("multiplestatusdata",data)
                let entryinactivedatawithkey={ "crno_list":this.entryinactivedata}
                console.log("entryinactivedatawithkey",entryinactivedatawithkey)
                this.service.bulkentryinactive(entryinactivedatawithkey).subscribe((data=>
                  {
                    if (data["status"] != "success")
                    {
                        this.spinner.hide();
                        this.payementsubmitflage = false;
                        this.datamissingflage = true;
                        this.payemententryinput.splice(
                          0,
                          this.payemententryinput.length
                        );
                        this.pvlist.splice(0, this.pvlist.length);
                        this.getdata();
                    }
                    else
                    {
                      // this.notification.showError(data["description"])
                      this.spinner.hide();
                      this.payementsubmitflage = false;
                      this.datamissingflage = true;
                        this.payemententryinput.splice(
                          0,
                          this.payemententryinput.length
                        );
                        this.pvlist.splice(0, this.pvlist.length);
                        this.getdata();
                    }
                  }))
              }
              else
              {
                this.lopforpay();
              }
              (error)=>{
                this.payementsubmitflage = false;
                this.datamissingflage = true;
                this.spinner.hide();
                this.notification.showError(data["description"])
                this.payemententryinput.splice(
                  0,
                  this.payemententryinput.length
                );
                this.pvlist.splice(0, this.pvlist.length);
                this.getdata();
              } 
          })
            
          }
          else
          {
            entryfaileflage=true
            this.payemententryinput.splice(
              0,
              this.payemententryinput.length
            );
            this.pvlist.splice(0, this.pvlist.length);
            this.notification.showError(entryresult["message"]);
            this.getdata();
            this.payementsubmitflage = false;
            this.datamissingflage = true;
            this.spinner.hide(); 
          }
          (error)=>{
            this.payementsubmitflage = false;
            this.datamissingflage = true;
            this.spinner.hide();
            this.notification.showError(entryresult["message"]);
            return false;
          }    
        });
        // if(!entryfaileflage)
        // {
        //     for (let j = 0; j < this.pvlist.length; j++) {
        //       let statusinput = {
        //         status_id: "11",
        //         remark: "NA",
        //         apinvoicehdr_id:
        //           this.pvlist[j].apcredit["data"][0]?.apinvoiceheader.toString(),
        //       };
        //       console.log("entryresult", j);
        //       let payinitflage=false
        //     await this.service.bounce(statusinput).subscribe((data) => {
        //         if (data["status"] != "success")
        //         {
        //           this.payementsubmitflage = false;
        //           this.datamissingflage = true;
        //           this.spinner.hide();
        //           this.notification.showError(data["message"]);
        //           return false;
        //         }
        //         else
        //         {
        //           payinitflage=true
        //         }
        //         (error)=>{
        //           this.payementsubmitflage = false;
        //           this.datamissingflage = true;
        //           this.spinner.hide();
        //           this.notification.showError(data["message"]);
        //           return false;
        //         } 
        //         console.log("bounce", j);
        //     }) 
        //       this.incamt = this.pvlist[j]?.apcredit["data"][0]?.amount;
        //       this.paymode = this.pvlist[j]?.credit_paymode?.name;
        //       if (this.pvlist[j].pay_to == "E") {
        //         if (this.pvlist[j]?.employee_accountdtls["data"]?.length == 0) {
        //           // this.datamissingflage=true
        //           this.notification.showError(
        //             "employee_accountdtls Empty for" + this.pvlist[j].crno
        //           );
        //         } else {
        //           this.bank = this.pvlist[j]?.employee_accountdtls?.bank_name;
        //           this.beni =
        //             this.pvlist[j]?.employee_accountdtls?.beneficiary_name;
        //           this.ifsc =
        //             this.pvlist[j]?.employee_accountdtls?.bankbranch?.ifsccode;
        //           this.acno =
        //             this.pvlist[j]?.employee_accountdtls?.account_number;
        //         }
        //       }
        //       if (this.pvlist[j]?.pay_to == "S") {
        //         if (
        //           this.pvlist[j]?.supplierpayment_details["data"]?.length ==
        //             0 ||
        //           this.pvlist[j]?.supplierpayment_details?.length == 0
        //         ) {
        //           // this.datamissingflage=true
        //           this.notification.showError(
        //             "Supplierpayment_details Is Empty"
        //           );
        //         } else {
        //           this.bank =
        //             this.pvlist[j]?.supplierpayment_details[
        //               "data"
        //             ][0]?.bank_id?.name;
        //           this.beni =
        //             this.pvlist[j]?.supplierpayment_details[
        //               "data"
        //             ][0]?.beneficiary;
        //           this.ifsc =
        //             this.pvlist[j]?.supplierpayment_details[
        //               "data"
        //             ][0]?.branch_id?.ifsccode;
        //           this.acno =
        //             this.pvlist[j]?.supplierpayment_details[
        //               "data"
        //             ][0]?.account_no;
        //         }
        //       }

        //       let pay: any = {
        //         paymentheader_date: this.latest_date?.toString(),
        //         paymentheader_amount: this.incamt?.toString(),
        //         ref_id: "1",
        //         reftable_id: "2",
        //         paymode: this.paymode?.toString(),
        //         bankdetails_id:
        //           this.pvlist[j]?.apcredit[
        //             "data"
        //           ][0]?.bankdetails?.bankbranch?.bank?.id?.toString(),
        //         beneficiaryname: this.beni?.toString(),
        //         bankname: this.bank?.toString(),
        //         ifsc_code: this.ifsc?.toString(),
        //         pay_to: this.pvlist[j].pay_to.toString(),
        //         accno: this.acno?.toString(),
        //         remarks: "pay",
        //         payment_dtls: [
        //           {
        //             apinvhdr_id:
        //               this.pvlist[j]?.apcredit[
        //                 "data"
        //               ][0]?.apinvoiceheader.toString(),
        //             apcredit_id:
        //               this.pvlist[j]?.apcredit["data"][0]?.id.toString(),
        //             paymntdtls_amt: this.incamt?.toString(),
        //           },
        //         ],
        //       };
        //       let pvnumgen=false
        //       if(payinitflage)
        //       {
        //         await this.service.paymentsubmit(pay).subscribe((pvdata) => {
        //           console.log("paymentsubmit", j);
        //           if (pvdata.id==undefined || pvdata.id =="" || pvdata.id==null)
        //           {
        //             this.payementsubmitflage = false;
        //             this.datamissingflage = true;
        //             this.spinner.hide();
        //             this.notification.showError(pvdata["message"]);
        //             return false;
        //           }
        //           else
        //           {
        //             pvnumgen=true
        //           }
        //           (error)=>{
        //             this.payementsubmitflage = false;
        //             this.datamissingflage = true;
        //             this.spinner.hide();
        //             this.notification.showError(pvdata["message"]);
        //             return false;
        //           }
        //           console.log("pvdata", j); 
        //         })
        //       }
        //       this.oracalinput = {
        //         AP_Type: "AP_PAYMENT",
        //         CR_Number: this.pvlist[j].crno?.toString(),
        //       };
        //       let orcalflage=false
        //       if(pvnumgen)
        //       {
        //         await this.service.oracal(this.oracalinput).subscribe((result) => {
        //           console.log("oracal", result);
        //           if (result?.Message != "SUCCESS") {
        //             this.payementsubmitflage = false;
        //             this.datamissingflage = true;
        //             this.spinner.hide();
        //             this.notification.showError(JSON.stringify(result));
        //             return false;
        //           }
        //           else
        //           {
        //             orcalflage=true
        //           }
        //           (error)=>{
        //             this.payementsubmitflage = false;
        //             this.datamissingflage = true;
        //             this.spinner.hide();
        //             this.notification.showError(JSON.stringify(result));
        //             return false;
        //           }
        //           console.log("oracal", j); 
        //         })
        //       }
        //       let paymentini_input: any = {
        //         apinvoiceheader_id:
        //           this.pvlist[j].apcredit[
        //             "data"
        //           ][0]?.apinvoiceheader.toString(),
        //         remarks: "ok",
        //       };
        //     if(orcalflage)
        //     {
        //       await this.service.payementstatusupdate(paymentini_input)
        //                           .subscribe((payinit) => {
        //                             if (payinit["status"] != "success") {
        //                               this.payementsubmitflage = false;
        //                               this.datamissingflage = true;
        //                               this.spinner.hide();
        //                               this.notification.showError(payinit["message"]);
        //                               return false;
        //                             }
        //                             else
        //                             {
        //                               if (this.pvlist?.length == ++j) {
        //                                 this.payementsubmitflage = false;
        //                                 this.datamissingflage = true;
        //                                 this.payemententryinput.splice(
        //                                   0,
        //                                   this.payemententryinput.length
        //                                 );
        //                                 this.pvlist.splice(0, this.pvlist.length);
        //                                 this.getdata();
        //                                 this.spinner.hide();
        //                                 this.notification.showSuccess(
        //                                   "Successfully Updated"
        //                                 );
        //                               }
        //                             }
        //                             (error)=>{
        //                               this.payementsubmitflage = false;
        //                               this.datamissingflage = true;
        //                               this.spinner.hide();
        //                               this.notification.showError(payinit["message"]);
        //                               return false;
        //                             }
        //                           })
        //                         console.log("paymentstatus", j); 
        //     }

        //   }
        // }
    }
    catch(error)
    {
      this.notification.showError(error)
    }
}
async lopforpay()
{
  try
  {
    for (let j = 0; j < this.pvlist.length; j++) {
    console.log("pvlist", j);
    let payinitflage:Boolean
    let payiniterror;
      this.incamt = this.pvlist[j]?.apcredit["data"][0]?.amount;
      this.paymode = this.pvlist[j]?.credit_paymode?.name;
      if (this.pvlist[j].pay_to == "E") {
        if (this.pvlist[j]?.employee_accountdtls["data"]?.length == 0) {
          // this.datamissingflage=true
          this.notification.showError(
            "employee_accountdtls Empty for" + this.pvlist[j].crno
          );
        } else {
          this.bank = this.pvlist[j]?.employee_accountdtls?.bank_name;
          this.beni =
            this.pvlist[j]?.employee_accountdtls?.beneficiary_name;
          this.ifsc =
            this.pvlist[j]?.employee_accountdtls?.bankbranch?.ifsccode;
          this.acno =
            this.pvlist[j]?.employee_accountdtls?.account_number;
        }
      }
      if (this.pvlist[j]?.pay_to == "S") {
        if (
          this.pvlist[j]?.supplierpayment_details["data"]?.length ==
            0 ||
          this.pvlist[j]?.supplierpayment_details?.length == 0
        ) {
          // this.datamissingflage=true
          this.notification.showError(
            "Supplierpayment_details Is Empty"
          );
        } else {
          this.bank =
            this.pvlist[j]?.supplierpayment_details[
              "data"
            ][0]?.bank_id?.name;
          this.beni =
            this.pvlist[j]?.supplierpayment_details[
              "data"
            ][0]?.beneficiary;
          this.ifsc =
            this.pvlist[j]?.supplierpayment_details[
              "data"
            ][0]?.branch_id?.ifsccode;
          this.acno =
            this.pvlist[j]?.supplierpayment_details[
              "data"
            ][0]?.account_no;
        }
      }
  
      let pay: any = {
        paymentheader_date: this.latest_date?.toString(),
        paymentheader_amount: this.incamt?.toString(),
        ref_id: "1",
        reftable_id: "2",
        paymode: this.paymode?.toString(),
        bankdetails_id:
          this.pvlist[j]?.apcredit[
            "data"
          ][0]?.bankdetails?.bankbranch?.bank?.id?.toString(),
        beneficiaryname: this.beni?.toString(),
        bankname: this.bank?.toString(),
        ifsc_code: this.ifsc?.toString(),
        pay_to: this.pvlist[j].pay_to.toString(),
        accno: this.acno?.toString(),
        remarks: "pay",
        payment_dtls: [
          {
            apinvhdr_id:
              this.pvlist[j]?.apcredit[
                "data"
              ][0]?.apinvoiceheader.toString(),
            apcredit_id:
              this.pvlist[j]?.apcredit["data"][0]?.id.toString(),
            paymntdtls_amt: this.incamt?.toString(),
          },
        ],
      };
      let pvnumgen:boolean 
      let pverrodes; 
        await this.service.paymentsubmit(pay).toPromise().then((pvdata) => {
          console.log("paymentsubmit", j);
          if (pvdata.id==undefined || pvdata.id =="" || pvdata.id==null)
          {
            this.payementsubmitflage = false;
            this.datamissingflage = true;
            this.spinner.hide();
            pverrodes=pvdata["message"];
            pvnumgen=false
            this.payemententryinput.splice(
              0,
              this.payemententryinput.length
            );
            this.pvlist.splice(0, this.pvlist.length);
            this.getdata();
          }
          else
          {
            pvnumgen=true
          }
          (error)=>{
            this.payementsubmitflage = false;
            this.datamissingflage = true;
            this.spinner.hide();
            pverrodes=pvdata["message"];
            pvnumgen=false
            this.payemententryinput.splice(
              0,
              this.payemententryinput.length
            );
            this.pvlist.splice(0, this.pvlist.length);
            this.getdata();
          }
          console.log("pvdata", j); 
        })
        if(!pvnumgen)
        {
          throw new Error(payiniterror);
          break; 
        }    
      this.oracalinput = {
        AP_Type: "AP_PAYMENT",
        CR_Number: this.pvlist[j].crno?.toString(),
      };
      let oracalflage:boolean 
      let oracaldes; 
        await this.service.oracal(this.oracalinput).toPromise().then((result) => {
          console.log("oracal", result);
          if (result?.Message != "SUCCESS") {
            this.payementsubmitflage = false;
            this.datamissingflage = true;
            this.spinner.hide();
            oracalflage=false
            oracaldes=JSON.stringify(result);
            this.payemententryinput.splice(
              0,
              this.payemententryinput.length
            );
            this.pvlist.splice(0, this.pvlist.length);
            this.getdata();
          }
          else
          {
            oracalflage=true
          }
          (error)=>{
            this.payementsubmitflage = false;
            this.datamissingflage = true;
            this.spinner.hide();
            oracalflage=false
            oracaldes=JSON.stringify(result);
            this.payemententryinput.splice(
              0,
              this.payemententryinput.length
            );
            this.pvlist.splice(0, this.pvlist.length);
            this.getdata();
          }
          console.log("oracal", j); 
        })
        if(!oracalflage)
        {
          throw new Error(oracaldes);
          break; 
        } 
      let paymentini_input: any = {
        apinvoiceheader_id:
          this.pvlist[j].apcredit[
            "data"
          ][0]?.apinvoiceheader.toString(),
        remarks: "ok",
      };   
      let paystatus;
      let payflage:boolean;
      await this.service.payementstatusupdate(paymentini_input)
                          .toPromise().then((payinit) => {
                            if (payinit["status"] != "success") {
                              payflage=false
                              this.payementsubmitflage = false;
                              this.datamissingflage = true;
                              this.spinner.hide();
                              paystatus=payinit["message"];
                              this.payemententryinput.splice(
                                0,
                                this.payemententryinput.length
                              );
                              this.pvlist.splice(0, this.pvlist.length);
                              this.getdata();
                            }
                            else
                            {
                              payflage=true
                              if (this.pvlist?.length - 1 == j) {
                                this.payementsubmitflage = false;
                                this.datamissingflage = true;
                                this.payemententryinput.splice(
                                  0,
                                  this.payemententryinput.length
                                );
                                this.pvlist.splice(0, this.pvlist.length);
                                this.getdata();
                                this.spinner.hide();
                                this.notification.showSuccess(
                                  "Successfully Updated"
                                );
                              }
                            }
                            (error)=>{
                              payflage=true
                              this.payementsubmitflage = false;
                              this.datamissingflage = true;
                              this.spinner.hide();
                              paystatus=payinit["message"];
                              this.payemententryinput.splice(
                                0,
                                this.payemententryinput.length
                              );
                              this.pvlist.splice(0, this.pvlist.length);
                              this.getdata();
                            }
                          })
                        console.log("paymentstatus", j); 
      if(!payflage)
      {
        throw new Error(paystatus);
        break; 
      } 
    }  
  }
  
catch(err)
{
  console.log("error")
  this.notification.showError(err)
}
this.payementsubmit.nativeElement.click();
}
}


