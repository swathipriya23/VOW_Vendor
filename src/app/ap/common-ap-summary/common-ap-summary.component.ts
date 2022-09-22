import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ApShareServiceService } from '../ap-share-service.service';
import { Ap1Service } from '../ap1.service';
import { ApService } from '../ap.service';
import { AppComponent } from 'src/app/app.component'; 
import { SharedService } from 'src/app/service/shared.service'
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DatePipe, formatDate } from "@angular/common";
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
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

export interface employeeListss {
  full_name: string;
  id: number;
}
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-common-ap-summary',
  templateUrl: './common-ap-summary.component.html',
  styleUrls: ['./common-ap-summary.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
  ]
})
export class CommonApSummaryComponent implements OnInit {
  @ViewChild('suppliertype') matsuppAutocomplete: MatAutocomplete;
  @ViewChild('suppInput') suppInput: any;
  @ViewChild('branchtype') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('emptype') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  newValAP: number;
  
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  
  // filter_options_change:Master[]=[{'title':"ECF created by me",'model':1},
  //                      {'title':"ECF Approved by me",'model':2},
  //                      {'title':"Pending for my Approval",'model':3},
  //                      {'title':"Forwarded by me",'model':4},
  //                      {'title':"Rejected by me",'model':5},
  //                      {'title':"Pending for bounce confirmation",'model':6}];
            

  filteredOptionsChange: Observable<Master[]>;
  // commonMasterChange = new FormControl();
  maker:any= FormGroup;
  data:Array<any>=[]
  invoiceTypeValue:any=[];
  Supplierlist: Array<supplierListss>
  Branchlist: Array<branchListss>;
  Employeelist: Array<employeeListss>;
  iscosummarypage: boolean = true;
  filter_options_change:any=[];
  has_next = true;
  id:any;
  ecfcoSearchForm:FormGroup
  isLoading = false;
  has_previous = true;
  pageSizeApp = 10;
  ecf_cosummary_data: any;
  currentpage: number = 1;
  TypeList: any;
  StatusList: any;
  parAppList: any;
  presentpage:any=1;
  pageNumber:any;
  pageSize:any;
  paymentdata: any;
  APStatusList: any;
  crno:any;
  branch:any=[];
  invoicetype:any=[];
  invoicedate:any;
  apinvoicehdr_id:any;
  raiser_employeename:any=[];
  invdate:any;
  tranrecords:any
  showsearch = false
  showsummary = true
  has_copagenext = true;
  has_copageprevious = true;
  ecfcopresentpage: number = 1;
  pagesizeecfco = 10;
  ecf_cosearch_data:any
  commonMasterChangeData: any;
  mainTransFlag: string;
  ecfinventoryForm: boolean;
  ecfapprovalForm: boolean;
  ecfsummaryForm: boolean;
  ecfcosummaryForm:boolean
  ecfviewForm: boolean;
  showapproverview: boolean;
  showappdtlview: boolean
  ecfcoview:boolean
  commonMasterECFChangeData:any = 0;
  newValECF: number;
  reject: FormGroup;
  typ = ["Courier", "direct"];
  editable: boolean = false;
  rejectFlagRoute:boolean=false
  appover=true;
  dropdown:any;
  getcototalcount:any;
  // intyp = ["Po", "Non-PO", "Advance,Emp","Emp Claim"];
  intyp:Master[]=[{'title':"PO",'model':1},
                       {'title':"Non PO",'model':2},
                       {'title':"ADVANCE",'model':3},
                       {'title':"EMP Claim",'model':4},
                       {'title':"BRANCH EXP",'model':5},
                       {'title':"PETTY CASH",'model':6},
                       {'title':"SI",'model':7},
                       {'title':"TAF",'model':8},
                       {'title':"TCF",'model':9},
                       {'title':"EB",'model':10},
                       {'title':"RENT",'model':11},
                       {'title':"DTPC",'model':12},
                       {'title':"SGB",'model':13},
                       {'title':"ICR",'model':14}];
  constructor(private formbuilder: FormBuilder, private spinner: NgxSpinnerService,
    private router:Router, private service:Ap1Service, private service1:ApService,private datepipe:DatePipe, 
    private toastr:ToastrService, private shareservice:ApShareServiceService, 
    private mainComponent:AppComponent, private commonService:SharedService, private activatedroute : ActivatedRoute) { }

  ngOnInit() {
    if (this.mainComponent.CommonSummaryNavigator == 'AP'){
      this.mainTransFlag = 'AP'
    }
    else if(this.mainComponent.CommonSummaryNavigator == 'ECF'){
      this.mainTransFlag = 'ECF'
    }
    console.log('Transcation',this.mainTransFlag)
    this.maker = this.formbuilder.group(
      {
        date1: [''],
        date2: [''],
        crno: [''],
        invoicetype:[],
        suppilername:[],
        branch:[],
        invoice_amount:[''],
        inmt:[''],
        invoice_from_date: [''],
        raiser_employeename:[''],
        invoice_to_date: [''],
        commonMasterChange:['']
      });

      this.reject = this.formbuilder.group(
        {
           intp:this.typ[0],
          fro_date: [''],
          awb:[''],
          lastName:[''],
          add:[''],
          sta:[''],
          dist:[''],
          city:[''],
          pin:['']
        });

      this.ecfcoSearchForm = this.formbuilder.group({
        crno:[''],
        ecftype:[''],
        invoiceno:[''],
        branch:[''],
        supplier_id:[''],
        // employee_id:[''],
        ecfstatus:[''],
        // apstatus:[''],
        fromdate:[''],
        todate:[''],
        minamount:[''],
        maxamount:['']})
      // this.filteredOptionsChange=this.commonMasterChange.valueChanges.pipe(
      //   startWith(''),
      //   map(value => (typeof value === 'string' ? value : value.title)),
      //   map(title => (title ? this._filter(title) : this.filter_options_change.slice())),
      //   );
  
      this.getApi();
      this.dropDownList();
      this.getbranch();
      this.getecftype();
      this.getecfstatus();
      this.getapstatus();
         
      this.maker.get("branch").valueChanges.subscribe(
        value => {
          this.service.branchget(value).subscribe(data => {
            console.log('h');
            this.branch = data['data']
            console.log(this.branch)
          })
        }
      )

      let branchkeyvalue: String = "";
      this.branchdropdown(branchkeyvalue);
      this.ecfcoSearchForm.get('branch').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            // console.log('inside tap')
  
          }),
  
          switchMap(value => this.service.getbranchscroll(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.Branchlist = datas;
         
        })

      let parentkeyvalue: String = "";
    this.getsupplierdropdown(parentkeyvalue);
    this.ecfcoSearchForm.get('supplier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')

        }),

        switchMap(value => this.service.getsupplierscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Supplierlist = datas;

      })
    }
  // private _filter(name: string): Master[] {
  //   const filterValue = name.toLowerCase();
  //   return this.filter_options_change.filter(option => option.title.toLowerCase().includes(filterValue));
  // }
  nextClick() {
    this.spinner.show();
      if (this.has_next === true) {
      //   this.service.apicallservice({}, this.presentpage+1)
        this.presentpage=this.presentpage+1;
        this.search();
      }
    }
  previousClick() {
    this.spinner.show();
      if (this.has_previous === true) {      
    //       this.service.apicallservice({}, this.presentpage-1)
        this.presentpage=this.presentpage-1;
        this.search();
      }
    }

    nextClickecfco() {
      this.spinner.show()
      if (this.has_copagenext === true) {
        if(this.commonMasterECFChangeData==0){
          this.spinner.show();
          this.service.getecfcoSummaryDetails("", 'asc', this.ecfcopresentpage + 1, 10)
            .subscribe((results: any[]) => {
              if(results['code'] == 'INVALID_DATA'){
                this.toastr.warning('INVALID_DATA')
              }
              else{
                let datas = results["data"];
                this.ecf_cosummary_data = datas;
                this.spinner.hide();
                // console.log("search summary", this.ecf_cosummary_data)
                let datapagination = results["pagination"];
                this.ecf_cosummary_data = datas;
                if (this.ecf_cosummary_data.length > 0) {
                  this.has_copagenext = datapagination.has_next;
                  this.has_copageprevious = datapagination.has_previous;
                  this.ecfcopresentpage = datapagination.index;
                }
              }
            },
            (error)=>{
              this.spinner.hide();
              this.toastr.warning(error.status+error.statusText)
            });
          }
        else{
          this.service.getecfStatusSummary("",'asc',
          this.ecfcopresentpage + 1, this.pageSize = 10, this.commonMasterECFChangeData).subscribe((results: any[]) => {
      
            let datas = results["data"];
      
            this.ecf_cosummary_data = datas;
            this.spinner.hide();
            // console.log("search summary", this.ecf_cosummary_data)
            let datapagination = results["pagination"];
            this.ecf_cosummary_data = datas;
            if (this.ecf_cosummary_data.length > 0) {
              this.has_copagenext = datapagination.has_next;
              this.has_copageprevious = datapagination.has_previous;
              this.ecfcopresentpage = datapagination.index;
            }
          })
        }
      }
    }
  
    previousClickecfco() {
      this.spinner.show()
      if (this.has_copageprevious === true) {
        if(this.commonMasterECFChangeData==0){
          this.spinner.show();
          this.service.getecfcoSummaryDetails("", 'asc', this.ecfcopresentpage + 1, 10)
            .subscribe((results: any[]) => {
              if(results['code'] == 'INVALID_DATA'){
                this.toastr.warning('INVALID_DATA')
              }
              else{
                let datas = results["data"];
                this.ecf_cosummary_data = datas;
                this.spinner.hide();
                // console.log("search summary", this.ecf_cosummary_data)
                let datapagination = results["pagination"];
                this.ecf_cosummary_data = datas;
                if (this.ecf_cosummary_data.length > 0) {
                  this.has_copagenext = datapagination.has_next;
                  this.has_copageprevious = datapagination.has_previous;
                  this.ecfcopresentpage = datapagination.index;
                }
              }
            },
            (error)=>{
              this.spinner.hide();
              this.toastr.warning(error.status+error.statusText)
            });
          }
        // if(this.commonMasterECFChangeData==0){
          // this.getApiECF("", 'asc', this.ecfcopresentpage - 1, 10)
          // this.ecfcopresentpage = this.ecfcopresentpage - 1
          // this.spinner.hide()
        // }
        else{
          this.service.getecfStatusSummary("",'asc',
          this.ecfcopresentpage - 1, this.pageSize = 10, this.commonMasterECFChangeData).subscribe((results: any[]) => {
      
            let datas = results["data"];
      
            this.ecf_cosummary_data = datas;
            this.spinner.hide();
            // console.log("search summary", this.ecf_cosummary_data)
            let datapagination = results["pagination"];
            this.ecf_cosummary_data = datas;
            if (this.ecf_cosummary_data.length > 0) {
              this.has_copagenext = datapagination.has_next;
              this.has_copageprevious = datapagination.has_previous;
              this.ecfcopresentpage = datapagination.index;
            }
          })
        }
      }
    }

  getApi(){
    this.spinner.show();
    if (this.mainTransFlag == 'AP'){  
    //  this.getApiAP();
    }
    else if(this.mainTransFlag == 'ECF'){
     this.getApiECF();
    }
  }

  getApiAP(){
    this.spinner.show();
    this.service.apicallservice({},this.presentpage).subscribe(data=>{
      console.log('rr=',data);
      if(data.code == 'INVALID_DATA'){
        this.toastr.warning('INVALID_DATA')
      }
      else{
        this.data=data['data'];
        this.spinner.hide();
        let datapagination = data["pagination"];
        if (this.data.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }
      }
    },
    (error)=>{
      this.spinner.hide();
      this.toastr.warning(error.status+error.statusText)
    });
  }

  getApiECF(filter = "", sortOrder = 'asc',
  pageNumber = 1, pageSize = 10){
    this.spinner.show();
    this.service.getecfcoSummaryDetails(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        if(results['code'] == 'INVALID_DATA'){
          this.toastr.warning('INVALID_DATA')
        }
        else{
          let datas = results["data"];
          this.ecf_cosummary_data = datas;
          this.spinner.hide();
          // console.log("search summary", this.ecf_cosummary_data)
          let datapagination = results["pagination"];
          this.ecf_cosummary_data = datas;
          if (this.ecf_cosummary_data.length > 0) {
            this.has_copagenext = datapagination.has_next;
            this.has_copageprevious = datapagination.has_previous;
            this.ecfcopresentpage = datapagination.index;
          }
        }
      },
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      });
    }

  getecftype() {
    this.spinner.show();
    this.service.getecftype()
      .subscribe(result => {
        this.TypeList = result["data"]
        console.log("TypeList",this.TypeList)
      },
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      });
  }
  getecfstatus() {
    this.spinner.show()
    this.service.getecfstatus()
      .subscribe(result => {
        this.StatusList = result["data"]
        this.spinner.hide()
      },
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      });
  }
  getapstatus() {
    this.spinner.show();
    this.service.getapstatus()
      .subscribe(result => {
        this.APStatusList = result["data"]
      },
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      });
  }

  getpaystatus(crno){
    this.service.getpaymentstatus(crno)
    .subscribe(result =>{
      this.paymentdata = result['data']
      console.log(result)
      console.log(this.paymentdata)
    },
    (error)=>{
      this.spinner.hide();
      this.toastr.warning(error.status+error.statusText)
    });
  }

  goBack(){
    this.router.navigateByUrl('/ECF/ecf')
  }

  branchScroll() {
    setTimeout(() => {
      if (
        this.matbranchAutocomplete &&
        this.matbranchAutocomplete &&
        this.matbranchAutocomplete.panel
      ) {
        fromEvent(this.matbranchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbranchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.service.getbranchscroll(this.branchInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Branchlist.length >= 0) {
                      this.Branchlist = this.Branchlist.concat(datas);
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  public displayFnbranch(branchtype?: branchListss): string | undefined {

    return branchtype ? branchtype.codename : undefined;
  }

  public displayFnsupplier(suppliertype?: supplierListss): string | undefined {
    return suppliertype ? suppliertype.name : undefined;
  }
  
  get suppliertype() {
    return this.maker.get('suppilername');
  }
  
  private branchdropdown(branchkeyvalue) {
    this.spinner.show();
    this.service.getbranch(branchkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
      },
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      });
  }

  private getsupplierdropdown(parentkeyvalue) {
    this.service.getsupplier(parentkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Supplierlist = datas;
      },
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      });
  }
  

  // supplierScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matsuppAutocomplete &&
  //       this.matsuppAutocomplete &&
  //       this.matsuppAutocomplete.panel
  //     ) {
  //       fromEvent(this.matsuppAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matsuppAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matsuppAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matsuppAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matsuppAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.service.getsupplierscroll(this.suppInput.nativeElement.value, this.currentpage + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   if (this.Supplierlist.length >= 0) {
  //                     this.Supplierlist = this.Supplierlist.concat(datas);
  //                     this.has_next = datapagination.has_next;
  //                     this.has_previous = datapagination.has_previous;
  //                     this.currentpage = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }
  
  ViewData:any
  ecfcoView(data){
    // this.service.getcoview(data.crno)
    // .subscribe(result =>{
    //   this.ViewData = result
    //   this.shareservice.coview.next(this.ViewData)
    //   this.ecfinventoryForm = false
    //   this.ecfapprovalForm = false
    //   this.ecfsummaryForm = false
    //   this.ecfviewForm = false
    //   this.showapproverview = false
    //   this.showappdtlview = false
    //   this.ecfcosummaryForm = false
    //   this.ecfcoview = true
    let setdata = {
      data: [data],
      key: 1
    }
    console.log('santhoshdata',setdata)

      if (this.commonMasterECFChangeData == 2){
        this.shareservice.commonsummary.next(setdata)
        this.commonService.commonsummary.next(setdata)
        console.log(this.shareservice.commonsummary)
        // this.shareservice.coview.next(setdata)
        // this.newValECF = 1
        // this.shareservice.ECFFlagChange.next(this.newValECF)
        this.router.navigate(['ECF/ecfapproval'])
        // return setdata
      }
      else{
        this.shareservice.commonsummary.next(setdata)
        this.commonService.commonsummary.next(setdata)
        console.log(this.shareservice.commonsummary)
        // this.shareservice.coview.next(setdata)
        // this.newValECF = 1
        // this.shareservice.ECFFlagChange.next(this.newValECF)
        this.router.navigate(['ECF/ecfsummary'])
        // return setdata
      }

    // })
  }

  dropDownList(){
    
    if (this.mainTransFlag == 'AP'){
      this.spinner.show();
      
      console.log("this.mainTransFlag",this.mainTransFlag)
     this.service.commonMasterAPChangeList().subscribe(data=>{
       console.log('rr=',data);
       this.filter_options_change=data['data'];
       console.log("this.filter_options_change",this.filter_options_change)
   
       this.activatedroute.queryParams.subscribe(
        params => {
          if(params)
          {  
              console.log("prams",params)
              this.dropdown=params?.dropdownid
               console.log("dropdown",this.dropdown)  
               if(this.dropdown==1) 
               {
                 this.commonMasterChangeData=1
                 this.maker.patchValue({  
                   commonMasterChange: this.filter_options_change[0] 
                 });
                 this.service.commonMasterSearch({status: 1},this.presentpage).subscribe((value) => {
                   if(value.code == 'INVALID_DATA'){
                     this.toastr.warning('No Data');
                     this.toastr.warning(value['description']);
                     this.data=[];
                     this.spinner.hide();
                   }
                   else{
                     this.data = value['data'];
                     this.getcototalcount=value['pagination']?.count;
                     console.log("this.getcototalcount",this.getcototalcount)
                     if(this.commonMasterChangeData==5){
                       this.rejectFlagRoute=true
                     }
                     else{
                       this.rejectFlagRoute=false
                     }
                     if(this.data.length == undefined){
                       console.log(value)
                       this.data = ['No Records']
                       this.toastr.warning('No Records')
                       this.spinner.hide();
                     }
                     let datapagination = value["pagination"];
                     this.spinner.hide();
                     
                     if (this.data.length > 0) {
                       this.has_next = datapagination.has_next;
                       this.has_previous = datapagination.has_previous;
                       this.presentpage = datapagination.index;
                     }
                   }
                  },
                  (error)=>{
                    this.spinner.hide();
                    this.toastr.warning(error.status+error.statusText)
                  }
                  )
               }
              if(this.dropdown==2) 
              {
                this.commonMasterChangeData=2
                this.maker.patchValue({  
                  commonMasterChange: this.filter_options_change[1] 
                });
                this.service.commonMasterSearch({status: 2},this.presentpage).subscribe((value) => {
                  if(value.code == 'INVALID_DATA'){
                    this.toastr.warning('No Data');
                    this.toastr.warning(value['description']);
                    this.data=[];
                    this.spinner.hide();
                  }
                  else{
                    this.data = value['data'];
                    this.getcototalcount=value['pagination']?.count;
                    console.log("this.getcototalcount",this.getcototalcount)
                    if(this.commonMasterChangeData==5){
                      this.rejectFlagRoute=true
                    }
                    else{
                      this.rejectFlagRoute=false
                    }
                    if(this.data.length == undefined){
                      console.log(value)
                      this.data = ['No Records']
                      this.toastr.warning('No Records')
                      this.spinner.hide();
                    }
                    let datapagination = value["pagination"];
                    this.spinner.hide();
                    
                    if (this.data.length > 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.presentpage = datapagination.index;
                    }
                  }
                 },
                 (error)=>{
                   this.spinner.hide();
                   this.toastr.warning(error.status+error.statusText)
                 }
                 )
              }
              if(this.dropdown==6) 
              {
                this.commonMasterChangeData=6
                this.maker.patchValue({  
                  commonMasterChange: this.filter_options_change[5] 
                });
                this.service.commonMasterSearch({status: 6},this.presentpage).subscribe((value) => {
                  if(value.code == 'INVALID_DATA'){
                    this.toastr.warning('No Data');
                    this.toastr.warning(value['description']);
                    this.data=[];
                    this.spinner.hide();
                  }
                  else{
                    this.data = value['data']
                    this.getcototalcount=value['pagination']?.count;
                    console.log("this.getcototalcount",this.getcototalcount)
                    if(this.commonMasterChangeData==5){
                      this.rejectFlagRoute=true
                    }
                    else{
                      this.rejectFlagRoute=false
                    }
                    if(this.data.length == undefined){
                      console.log(value)
                      this.data = ['No Records']
                      this.toastr.warning('No Records')
                      this.spinner.hide();
                    }
                    let datapagination = value["pagination"];
                    this.spinner.hide();
                    
                    if (this.data.length > 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.presentpage = datapagination.index;
                    }
                  }
                 },
                 (error)=>{
                   this.spinner.hide();
                   this.toastr.warning(error.status+error.statusText)
                 }
                 )
              }
              if(this.dropdown==7) 
              {
                this.commonMasterChangeData=7
                this.maker.patchValue({  
                  commonMasterChange: this.filter_options_change[3] 
                });
                this.service.commonMasterSearch({status: 7},this.presentpage).subscribe((value) => {
                  if(value.code == 'INVALID_DATA'){
                    this.toastr.warning('No Data');
                    this.toastr.warning(value['description']);
                    this.data=[];
                    this.spinner.hide();
                  }
                  else{
                    this.data = value['data'];
                    this.getcototalcount=value['pagination']?.count;
                    console.log("this.getcototalcount",this.getcototalcount)
                    if(this.commonMasterChangeData==5){
                      this.rejectFlagRoute=true
                    }
                    else{
                      this.rejectFlagRoute=false
                    }
                    if(this.data.length == undefined){
                      console.log(value)
                      this.data = ['No Records']
                      this.toastr.warning('No Records')
                      this.spinner.hide();
                    }
                    let datapagination = value["pagination"];
                    this.spinner.hide();
                    
                    if (this.data.length > 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.presentpage = datapagination.index;
                    }
                  }
                 },
                 (error)=>{
                   this.spinner.hide();
                   this.toastr.warning(error.status+error.statusText)
                 }
                 )
              }
              if(this.dropdown==9) 
              {
                this.commonMasterChangeData=9
                this.maker.patchValue({  
                  commonMasterChange: this.filter_options_change[6] 
                });
                this.service.commonMasterSearch({status: 9},this.presentpage).subscribe((value) => {
                  if(value.code == 'INVALID_DATA'){
                    this.toastr.warning('No Data');
                    this.toastr.warning(value['description']);
                    this.data=[];
                    this.spinner.hide();
                  }
                  else{
                    this.data = value['data'];
                    this.getcototalcount=value['pagination']?.count;
                    console.log("this.getcototalcount",this.getcototalcount)
                    if(this.commonMasterChangeData==5){
                      this.rejectFlagRoute=true
                    }
                    else{
                      this.rejectFlagRoute=false
                    }
                    if(this.data.length == undefined){
                      console.log(value)
                      this.data = ['No Records']
                      this.toastr.warning('No Records')
                      this.spinner.hide();
                    }
                    let datapagination = value["pagination"];
                    this.spinner.hide();
                    
                    if (this.data.length > 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.presentpage = datapagination.index;
                    }
                  }
                 },
                 (error)=>{
                   this.spinner.hide();
                   this.toastr.warning(error.status+error.statusText)
                 }
                 )
              }
              if(this.dropdown==3) 
              {
                this.commonMasterChangeData=3
                this.maker.patchValue({  
                  commonMasterChange: this.filter_options_change[1] 
                });
                this.service.commonMasterSearch({status: 3},this.presentpage).subscribe((value) => {
                  if(value.code == 'INVALID_DATA'){
                    this.toastr.warning('No Data');
                    this.toastr.warning(value['description']);
                    this.data=[];
                    this.spinner.hide();
                  }
                  else{
                    this.data = value['data'];
                    this.getcototalcount=value['pagination']?.count;
                    console.log("this.getcototalcount",this.getcototalcount)
                    if(this.commonMasterChangeData==5){
                      this.rejectFlagRoute=true
                    }
                    else{
                      this.rejectFlagRoute=false
                    }
                    if(this.data.length == undefined){
                      console.log(value)
                      this.data = ['No Records']
                      this.toastr.warning('No Records')
                      this.spinner.hide();
                    }
                    let datapagination = value["pagination"];
                    this.spinner.hide();
                    
                    if (this.data.length > 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.presentpage = datapagination.index;
                    }
                  }
                 },
                 (error)=>{
                   this.spinner.hide();
                   this.toastr.warning(error.status+error.statusText)
                 }
                 )
              }
              
            }
        })
        if(this.dropdown==undefined || this.dropdown==null)
        {
          this.service.commonMasterSearch({},this.presentpage).subscribe((value) => {
            if(value.code == 'INVALID_DATA'){
              this.toastr.warning('No Data');
              this.toastr.warning(value['description']);
              this.data=[];
              this.spinner.hide();
            }
            else{
              this.data = value['data'];
              this.getcototalcount=value['pagination']?.count;
              console.log("this.getcototalcount",this.getcototalcount)
              if(this.data.length == undefined){
                console.log(value)
                this.data = ['No Records']
                this.toastr.warning('No Records')
                this.spinner.hide();
              }
              let datapagination = value["pagination"];
              this.spinner.hide();
              
              if (this.data.length > 0) {
                this.has_next = datapagination.has_next;
                this.has_previous = datapagination.has_previous;
                this.presentpage = datapagination.index;
              }
            }
         },
         (error)=>{
           this.spinner.hide();
           this.toastr.warning(error.status+error.statusText)
         }
         )
        }
       this.spinner.hide();
     },
     (error)=>{
       this.spinner.hide();
       this.toastr.warning(error.status+error.statusText)
     })
    }
    else if (this.mainTransFlag == 'ECF'){
      this.spinner.show();
     this.service.commonMasterECFChangeList().subscribe(data=>{
       console.log('rr=',data);
       this.filter_options_change=data['data'];
       this.spinner.hide();
     },
     (error)=>{
       this.spinner.hide();
       this.toastr.warning(error.status+error.statusText)
     })
    }
  }

  search()
  {
    this.spinner.show()
    let values=this.maker.value.crno;
    let fill:any={};
    if(this.commonMasterChangeData == null || ''){
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
        if(this.maker.get('suppilername').value !=null && this.maker.get('suppilername').value !='' ){
          fill['supplier_id']=this.maker.get('suppilername').value?.id;
        }
        if(this.maker.get('branch').value !=null && this.maker.get('branch').value !='' ){
          fill['branch_id']=this.maker.get('branch').value.id;
        }
        if(this.maker.get('raiser_employeename').value !=null && this.maker.get('raiser_employeename').value !='' ){
          fill['raisername']=this.maker.get('raiser_employeename').value;
        }
        if(this.maker.get('invoicetype').value !=null && this.maker.get('invoicetype').value !='' ){
          fill['invoicetype_id']=this.invoiceTypeValue;
        }
        if(this.maker.get('commonMasterChange').value !=null && this.maker.get('commonMasterChange').value !='' ){
          let statusid=this.maker.get('commonMasterChange').value;
          fill['status']=statusid.id
          console.log("fill['status']", fill['status'])
        }
        let val=this.maker.value.crno;
        this.crno=this.maker.value.crno;
        this.service.commonMasterSearch(fill,this.presentpage).subscribe(data=>{
          if(data?.code=="INVALID_DATA")
          {
            this.toastr.info(data?.description)
          }
          {
            console.log('rr=',data);
            this.data=data['data'];
            this.getcototalcount=data['pagination']?.count;
            console.log("this.getcototalcount",this.getcototalcount)
            let datapagination=data['pagination'];
            this.spinner.hide()
            if (this.data.length > 0) {
              this.has_next = datapagination.has_next;
              this.has_previous = datapagination.has_previous;
              this.presentpage = datapagination.index;
            }
          }
        },
        (error)=>{
          this.spinner.hide();
          this.toastr.warning(error.status+error.statusText)
        });
        console.log("Crno",this.crno)
        console.log("Crno",this.crno)
      }
      else if(this.commonMasterChangeData != null || ''){
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
          if(this.maker.get('suppilername').value !=null && this.maker.get('suppilername').value !='' ){
            fill['supplier_id']=this.maker.get('suppilername').value?.id
          }
          if(this.maker.get('branch').value !=null && this.maker.get('branch').value !='' ){
            fill['branch_id']=this.maker.get('branch').value.id;
          }
          if(this.maker.get('raiser_employeename').value !=null && this.maker.get('raiser_employeename').value !='' ){
            fill['raisername']=this.maker.get('raiser_employeename').value;
          }
          if(this.maker.get('invoicetype').value !=null && this.maker.get('invoicetype').value !='' ){
            fill['invoicetype_id']=this.invoiceTypeValue;
          }
          if(this.maker.get('commonMasterChange').value !=null && this.maker.get('commonMasterChange').value !='' ){
            let statusid=this.maker.get('commonMasterChange').value;
            fill['status']=statusid.id
            console.log("fill['status']", fill['status'])
          }
          let val=this.maker.value.crno;
          this.crno=this.maker.value.crno;
          this.service.commonMasterSearch(fill,this.presentpage).subscribe(data=>{
            console.log('rr=',data);
            this.data=data['data'];
            let datapagination=data['pagination'];
            this.getcototalcount=data['pagination']?.count;
            console.log("this.getcototalcount",this.getcototalcount)
            this.spinner.hide()
            if (this.data.length > 0) {
              this.has_next = datapagination.has_next;
              this.has_previous = datapagination.has_previous;
              this.presentpage = datapagination.index;
            }
          },
          (error)=>{
            this.spinner.hide();
            this.toastr.warning(error.status+error.statusText)
          });
          console.log("Crno",this.crno)
          console.log("Crno",this.crno)
        }
      } 
  
  cosummarysearch() {
    const searchdata = this.ecfcoSearchForm.value
    if(searchdata.fromdate == null || searchdata.fromdate == undefined || searchdata.fromdate == ""){
     searchdata.fromdate = ""
    }else{
    searchdata.fromdate = this.datepipe.transform(searchdata.fromdate, 'yyyy-MM-dd');
    }
    if(searchdata.todate == null || searchdata.todate == undefined  || searchdata.todate == ""){
     searchdata.todate = ""
    }else{
    searchdata.todate = this.datepipe.transform(searchdata.todate, 'yyyy-MM-dd');
    }
    if(searchdata.branch != ""){
      searchdata.branch = searchdata.branch.id
    }
    if(searchdata.supplier_id != ""){
     searchdata.supplier_id = searchdata.supplier_id.id
    }
    if(searchdata.crno !=null && searchdata.crno !='' ){
      searchdata.crno = searchdata.crno
    }

     this.service.ecfcosummarySearch(searchdata)
       .subscribe(result => {
         this.showsearch = true
         this.showsummary = false
         this.ecf_cosummary_data = result['data']
         // console.log("search result", this.ecf_cosummary_data)
         let datapagination = result["pagination"];
         if (this.ecf_cosummary_data.length === 0) {
           this.iscosummarypage = false
         }
         if (this.ecf_cosummary_data.length > 0) {
           this.has_copagenext = datapagination.has_next;
           this.has_copageprevious = datapagination.has_previous;
           this.ecfcopresentpage = datapagination.index;
           this.iscosummarypage = true
         }
       })
   }

   resetco() {
    this.ecfcoSearchForm.controls['crno'].reset(""),
    this.ecfcoSearchForm.controls['ecftype'].reset(""),
    this.ecfcoSearchForm.controls['invoiceno'].reset(""),
    this.ecfcoSearchForm.controls['ecfstatus'].reset(""),
    this.ecfcoSearchForm.controls['supplier_id'].reset(""),
    // this.ecfcoSearchForm.controls['employee_id'].reset(""),
    this.ecfcoSearchForm.controls['branch'].reset(""),
    // this.ecfcoSearchForm.controls['apstatus'].reset(""),
    this.ecfcoSearchForm.controls['fromdate'].reset(""),
    this.ecfcoSearchForm.controls['todate'].reset(""),
    this.ecfcoSearchForm.controls['minamount'].reset(""),
    this.ecfcoSearchForm.controls['maxamount'].reset(""),
    this.getApi()
  }

  downloadco(){

    this.service.ecfcodownload()
    .subscribe((results) => {
      
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "ECF Report.xlsx";
      link.click();
    })
  
  }
  

  cancel()
  {
    this.spinner.show();
    this.maker.reset();
    this.invoiceTypeValue = '';
    this.commonMasterChangeData=1
   
    this.service.commonMasterSearch({},this.presentpage).subscribe((value) => {
      if(value.code == 'INVALID_DATA'){
        this.toastr.warning('No Data');
        this.toastr.warning(value['description']);
        this.data=[];
        this.spinner.hide();
      }
      else{
        this.data = value['data'];
        this.getcototalcount=value['pagination']?.count;
        console.log("this.getcototalcount",this.getcototalcount)
        if(this.commonMasterChangeData==5){
          this.rejectFlagRoute=true
        }
        else{
          this.rejectFlagRoute=false
        }
        if(this.data.length == undefined){
          console.log(value)
          this.data = ['No Records']
          this.toastr.warning('No Records')
          this.spinner.hide();
        }
        let datapagination = value["pagination"];
        this.spinner.hide();
        
        if (this.data.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }
      }
     },
     (error)=>{
       this.spinner.hide();
       this.toastr.warning(error.status+error.statusText)
     }
     )
  }

  filter_flags_look(event,fg){
    this.spinner.show();
    let val = event.target.id
    this.commonMasterChangeData = fg.id
    let fill:any={};
    console.log(event,fg.id)
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
      if(this.maker.get('suppilername').value !=null && this.maker.get('suppilername').value !='' ){
        fill['supplier_id']=this.maker.get('suppilername').value?.id;
      }
      if(this.maker.get('branch').value !=null && this.maker.get('branch').value !='' ){
        fill['branch_id']=this.maker.get('branch').value.id;
      }
      if(this.maker.get('raiser_employeename').value !=null && this.maker.get('raiser_employeename').value !='' ){
        fill['raisername']=this.maker.get('raiser_employeename').value;
      }
      if(this.maker.get('invoicetype').value !=null && this.maker.get('invoicetype').value !='' ){
        fill['invoicetype_id']=this.invoiceTypeValue;
      }
      if(this.maker.get('commonMasterChange').value !=null && this.maker.get('commonMasterChange').value !='' ){
        let statusid=this.maker.get('commonMasterChange').value;
        fill['status']=statusid.id
        console.log("fill['status']", fill['status'])
      }
    this.service.commonMasterChange(fill).subscribe((value) => {
      if(value.code == 'INVALID_DATA'){
        this.toastr.warning('No Data');
        this.toastr.warning(value['description']);
        this.data=[];
        this.spinner.hide();
      }
      else{
        this.data = value['data']
        this.getcototalcount=value['pagination']?.count;
        console.log("this.getcototalcount",this.getcototalcount)
        if(this.commonMasterChangeData==5){
          this.rejectFlagRoute=true
        }
        else{
          this.rejectFlagRoute=false
        }
        if(this.data.length == undefined){
          console.log(value)
          this.data = ['No Records']
          this.toastr.warning('No Records')
          this.spinner.hide();
        }
        let datapagination = value["pagination"];
        this.spinner.hide();
        
        if (this.data.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }
      }
     },
     (error)=>{
       this.spinner.hide();
       this.toastr.warning(error.status+error.statusText)
     }
     )
  }
  public displayFnbranchn(branchtype?: branchListss): string | undefined {
    return branchtype ? branchtype.name : undefined;
  }

  filter_flags_ECF(event,fg){
    this.spinner.show()
    let val = event.target.id
    this.commonMasterECFChangeData = fg.id
    console.log(event,fg.id)
    this.service.getecfStatusSummary("",'asc',
    this.pageNumber = 1, this.pageSize = 10, this.commonMasterECFChangeData).subscribe((results: any[]) => {

      let datas = results["data"];

      this.ecf_cosummary_data = datas;
      this.spinner.hide();
      // console.log("search summary", this.ecf_cosummary_data)
      let datapagination = results["pagination"];
      this.ecf_cosummary_data = datas;
      if (this.ecf_cosummary_data.length > 0) {
        this.has_copagenext = datapagination.has_next;
        this.has_copageprevious = datapagination.has_previous;
        this.ecfcopresentpage = datapagination.index;
      }
    },
    (error)=>{
      this.spinner.hide();
      this.toastr.warning(error.status+error.statusText)
    });
  }

  
  selectionChangeType(event) {
    console.log("event",event)
   if(event.isUserInput && event.source.selected == true){
        this.invoiceTypeValue = event.source.value.id.toString();
    } 
    console.log("typ",this.invoiceTypeValue) 
  }

  selectionChangeEvent(event){
    console.log(event)
  }

  action(data,i){
    let val = {
      data: [data],
      key: 1,
      route: this.commonMasterChangeData
    }
    this.shareservice.commonsummaryroute.next(false)
    if (this.mainTransFlag == 'AP'){
      if(this.commonMasterChangeData==undefined){
        this.toastr.warning('*Click My Views*')
      }
      if(this.commonMasterChangeData==1){
        if(this.data[i].status.text=="NEW" || this.data[i].status.text=="RE-AUDIT"){
          this.shareservice.commonsummary.next(val)
          console.log("data.....", data)
          this.shareservice.inward_id.next(data.inwarddetails_id);
          this.shareservice.inwardHdrNo.next(data.inwarddetails.no);
          let txt={inward_hdr_no : data.inwarddetails.no}
          
          this.spinner.show();
          
          this.service1.getInwardSummary(1, 5, txt)
          .subscribe(result => {
             this.spinner.hide();
             if(result.code === undefined || result.code === null)
             {
               let res = result.data
               let inwardData = res.filter(x => x.id == data.inwarddetails_id)
               this.shareservice.invoice_count.next(inwardData[0].doccount)
               this.router.navigate(['/ap/apHeader'],  {queryParams:{comefrom : "commonapsummary",apheader_id : data.apheader_id}, skipLocationChange: true });
             }
             else
             {
              this.toastr.warning('Error while fetching Inward Details')   
              this.router.navigate(['/ap/apHeader'],  {queryParams:{comefrom : "commonapsummary",apheader_id : data.apheader_id}, skipLocationChange: true });            
             }
            })
        }
        else{
          this.toastr.warning('Only status as *NEW & RE_AUDIT  will be allowed for action')
        }
      }
      if(this.commonMasterChangeData==2){
        this.shareservice.commonsummary.next(val)
        this.shareservice.hedid.next([data.apheader_id])
        this.router.navigateByUrl('/ap/approvescreen');
        console.log(data)
        this.shareservice.routflag.next(this.appover)
        this.shareservice.headerflag.next(false)
        this.shareservice.paymentflage.next(false)
      }
      if(this.commonMasterChangeData==3){
        this.shareservice.commonsummary.next(val)
        this.router.navigateByUrl('/ap/bouncedetail');
        console.log(data)
      }
      if(this.commonMasterChangeData==4){
        
      }
      if(this.commonMasterChangeData==5){
        this.shareservice.commonsummary.next(val)
        // this.router.navigateByUrl('/ap/rejectsummary')
      }
      if(this.commonMasterChangeData==6){
        this.shareservice.commonsummary.next(val)
        this.shareservice.hedid.next([data.apheader_id])
        this.router.navigateByUrl('/ap/approvescreen');
        console.log(data)
        this.shareservice.routflag.next(false)
        this.shareservice.headerflag.next(false)
        this.shareservice.paymentflage.next(true)
      }
      if(this.commonMasterChangeData==7){
        this.shareservice.commonsummary.next(val)
        this.router.navigateByUrl('/ap/preparepayment');
      }
      if(this.commonMasterChangeData==9){
        this.shareservice.commonsummary.next(val)
        this.shareservice.hedid.next([data.apheader_id])
        this.router.navigateByUrl('/ap/approvescreen');
        console.log(data)
        this.shareservice.routflag.next(false)
        this.shareservice.paymentflage.next(true)
        this.shareservice.headerflag.next(false)
      }
    }
    // else if (this.mainTransFlag == 'ECF'){
    //   console.log('ECF')
    //   if(this.commonMasterChangeData==1){
    //     this.shareservice.commonsummary.next(val)
    //     this.newValECF = 1
    //     this.shareservice.ECFFlagChange.next(this.newValECF)
    //     this.router.navigateByUrl('/ECF/ecfsummary');
    //   }
    //   if(this.commonMasterChangeData==2){
    //     this.shareservice.commonsummary.next(val)
    //     this.newValECF = 1
    //     this.shareservice.ECFFlagChange.next(this.newValECF)
    //     // this.router.navigateByUrl('/ECF/ecfapproval');
    //     this.router.navigateByUrl('/ECF/ecfsummary');
    //   }
    //   if(this.commonMasterChangeData==3){
    //     this.shareservice.commonsummary.next(val)
    //     this.newValECF = 1
    //     this.shareservice.ECFFlagChange.next(this.newValECF)
    //     this.router.navigateByUrl('/ECF/ecfsummary');
    //   }
    //   if(this.commonMasterChangeData==4){
        
    //   }
    //   if(this.commonMasterChangeData==5){
    //     this.shareservice.commonsummary.next(val)
    //     this.newValECF = 1
    //     this.shareservice.ECFFlagChange.next(this.newValECF)
    //     this.router.navigateByUrl('/ECF/ecfsummary');
    //   }
    //   if(this.commonMasterChangeData==6){
        
    //   }
    //   if(this.commonMasterChangeData==7){
    //     this.shareservice.commonsummary.next(val)
    //     this.newValECF = 1
    //     this.shareservice.ECFFlagChange.next(this.newValECF)
    //     this.router.navigateByUrl('/ECF/ecfsummary');
    //   }
    // this.router.navigateByUrl('/ap/checklist');
    this.invoicedate=data.invoice_date;
    this.apinvoicehdr_id=data.id;
    this.id=data.invoicetype.id
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
   },
   (error)=>{
     this.spinner.hide();
     this.toastr.warning(error.status+error.statusText)
   });
}
// getbranch(){
//   // let approverkeyvalue: String = "";
//   // // this.getApproverEmployee(approverkeyvalue);

//   this.maker.get('branch').valueChanges
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
appovrout(data)
{
  console.log("data click",data)
  let val = {
    data: [data],
    key: 1,
    route: this.commonMasterChangeData
  }
  let id
  id=data.apheader_id
  console.log("hai")
  this.router.navigate(['/ap/approvescreen'], { skipLocationChange: true });
  this.shareservice.commonsummary.next(val)
  this.shareservice.dropdownid.next(this.commonMasterChangeData)
  console.log("this.commondata",val)
  console.log("this.commonMasterChangeData",this.commonMasterChangeData)
  this.shareservice.hedid.next(id)
  console.log("hedid",id)
  this.shareservice.headerflag.next(false)
  this.shareservice.routflag.next(false)
  this.shareservice.paymentflage.next(false)
  this.shareservice.commonsummaryroute.next(true)
}
getsupplierdd(){

  let parentkeyvalue: String = "";
  this.getsupplierdropdown(parentkeyvalue);
  this.maker.get('suppilername').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        // console.log('inside tap')

      }),

      switchMap(value => this.service.getsupplierscroll(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.Supplierlist = datas;

    })

}
supplierScroll() {
  setTimeout(() => {
    if (
      this.matsuppAutocomplete &&
      this.matsuppAutocomplete &&
      this.matsuppAutocomplete.panel
    ) {
      fromEvent(this.matsuppAutocomplete.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matsuppAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.matsuppAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight = this.matsuppAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight = this.matsuppAutocomplete.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_next === true) {
              this.service.getsupplierscroll(this.suppInput.nativeElement.value, this.currentpage + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  if (this.Supplierlist.length >= 0) {
                    this.Supplierlist = this.Supplierlist.concat(datas);
                    this.has_next = datapagination.has_next;
                    this.has_previous = datapagination.has_previous;
                    this.currentpage = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });
}

numberOnlyandDot(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}
}
