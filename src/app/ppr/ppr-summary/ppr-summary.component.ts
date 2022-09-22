import { Component, OnInit,ViewChild } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PprService } from '../ppr.service';
import { NgxSpinnerService } from "ngx-spinner";
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent,MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { ErrorhandlingService } from '../errorhandling.service';


export interface branchList{
  id:number
  name:string
}
export interface bsList{
  id:number
  name:string
}
export interface ccList{
  id:number
  name:string
}
export interface finyearList{
  finyer:string
}
export interface sectorList{
  id:number
  name:string
}
export interface businessList{
  id:number
  name:string
}
export interface expensegrpList{
  id:number
  name:string
}
export interface iDeptList {
  name: string;
  id: number;
}
@Component({
  selector: 'app-ppr-summary',
  templateUrl: './ppr-summary.component.html',
  styleUrls: ['./ppr-summary.component.scss']
})
export class PprSummaryComponent implements OnInit {
  panelOpenState = false;
  // branch dropdown
  @ViewChild('branchContactInput') branchContactInput:any;
  @ViewChild('branch') matAutocompletebrach: MatAutocomplete;

  //bs
  
  @ViewChild('bsInput') bsInput:any;
  @ViewChild('bs') matAutocompletebs: MatAutocomplete;

  //cc
  @ViewChild('ccInput') ccInput:any;
  @ViewChild('cc_name') matAutocompletecc: MatAutocomplete;

  //  finyear
  @ViewChild('finyearInput') finyearInput:any;
  @ViewChild('fin_year') fin_yearauto:MatAutocomplete;

  //sector
  @ViewChild('sectornameInput') sectornameInput:any;

  //business
  @ViewChild('businessInput') businessInput:any;
  @ViewChild('business_name') business_nameauto:MatAutocomplete;

  //expense_grp
  @ViewChild('expenseInput') expenseInput:any;

  @ViewChild('bsclear_nameInput') bsclear_name;

//   @ViewChild("template1") template1: TemplateRef<any>;
//  @ViewChild("template2") template2: TemplateRef<any>;
//  selectedTemplate: TemplateRef<any>;

readonly separatorKeysCodes: number[] = [ENTER, COMMA];
@ViewChild('employeeDeptInput') employeeDeptInput: any;
@ViewChild('autodept') matAutocompleteDept: MatAutocomplete;
public chipSelectedEmployeeDept: iDeptList[] = [];
public chipSelectedEmployeeDeptid = [];
expensegrpList: iDeptList[]; 

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  stateList: Array<any>
  aa:any;
  year:any;
  Apr:string;
  May:string;
  Jun:string;
  Jul:string;
  Aug:string;
  Sep:string;
  Oct:string;
  Nov:string;
  Dec:string;
  Jan:string;
  Feb:string;
  Mar:string;
  nextyear:any;
  headercheckone:any;
  summarydata:any;
  qsummarydata:any;
  headercheck:any;
  pprSearchForm: FormGroup;
  branchList: Array<branchList>;
  isLoading = false;
  bsList:Array<bsList>;
  ccList:Array<ccList>;
  finyearList:Array<finyearList>;
  sectorList:Array<sectorList>;
  businessList:Array<businessList>;
  // expensegrpList:Array<expensegrpList>;
  tabcheck_ppr:boolean = false;  
  pprclient:boolean=true;
  tabcheck_pprbuilder:boolean = false; 
  tabcheck_pprreviewer:boolean=false; 
  tabcheck_pprapprover:boolean=false;
  tabcheck_pprreport:boolean=false;
  variance_analysis:boolean=false;
  cost_allocation:boolean=false
  budgetreviewer:boolean=false
  budgetapprover:boolean=false
  amount_type:any; 
  amountval_type:any; 
  exampleModalCenter:any;
  supplierList:any;
  supplieramountList:any;
  emp_bs_mapping: boolean;
  expense_budget_mgmt: boolean;
  ca_technology: any;
  ecfval: any;
  binaryData: any[];
  downloadUrl: string;
  pdfSrc: string;
  input_ecf: { apexpense_id: any; apsubcat_id: any; apinvoicesupplier_id: any; apinvoicebranch_id: any; transactionmonth: any; quarter: any; masterbusinesssegment_name: any; sectorname: string; yearterm: any; divAmount: any; finyear: any; bs_name: any; cc_name: any; };
  crno: any;
  branch_name: any;
  supplierpopup: boolean;
  branch_code: any;
  invoiceno: any;
  invoiceheader_amount: any;
  has_previous: boolean;
  has_next: boolean;
  tabcheck_pprchecker: boolean;
  supplier_name: any;
  supplier_code: any;
  supplier_branchname: any;
  getcc: any;
  currentpage: number=1;
  filename: any;
  index_cat: any;
  dssreport: boolean;
  expgrplevel_mapping: boolean=false;

  
  
  constructor(private errorHandler: ErrorhandlingService,private formBuilder: FormBuilder, private dataService: PprService, private shareService: SharedService,private SpinnerService: NgxSpinnerService,
    public dialog: MatDialog,private toastr:ToastrService,) { }
  PPRMenuList
  ngOnInit(): void {
    // this.SpinnerService.show();
    
    let datas = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "PPR Report") {
        this.PPRMenuList = subModule;
        

        console.log("pprmenuList", this.PPRMenuList)
      }
    })
   
    // this.SpinnerService.hide();

    this.getEmployeeList();
    this.headercheckone=false;
    this.headercheck=true;
    this.pprSearchForm = this.formBuilder.group({
      finyear: [""],
      branch_id: [""],
      year_term:[""],
      divAmount:[""],
      sectorname:[""],
      businesscontrol:[""],
      bs_id:[""],
      cc_id:[""],
      supplier_check:[""]
      // expensegrp:[""],
    })
      
  }
  
  
  getState() {
    this.dataService.getState()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
        console.log("statenameeeee", datas)
  
      })
  }

  // private getState() {
  //   this.dataService.getState()
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.stateList = datas;
  //       console.log("statenameeeee", datas)
  
  //     })
  // }

  private getEmployeeList() {
    
    this.aa='hg'
    console.log(this.aa);
    this.year=new Date().getFullYear().toString().substr(-2);
    this.Apr="Apr-"+this.year;
    this.May="May-"+this.year
    this.Jun="Jun-"+this.year
    this.Jul="Jul-"+this.year
    this.Aug="Aug-"+this.year
    this.Sep="Sep-"+this.year
    this.Oct="Oct-"+this.year
    this.Nov="Nov-"+this.year
    this.Dec="Dec-"+this.year
    this.nextyear=parseInt(new Date().getFullYear().toString().substr(-2))+1
    this.Jan="Jan-"+this.nextyear
    this.Feb="Feb-"+this.nextyear
    this.Mar="Mar-"+this.nextyear
    
    
  }
  // branch dropdown start
  branchname(){
    let prokeyvalue: String = "";
      this.getbranchid(prokeyvalue);
      this.pprSearchForm.get('branch_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.dataService.getbranchdropdown(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchList = datas;
  
        })
  }

  private getbranchid(prokeyvalue){
    this.dataService.getbranchdropdown(prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
  
      })
  }

  currentpagebra:any=1
  has_nextbra:boolean=true
  has_previousbra:boolean=true
  autocompletebranchnameScroll() {
    this.currentpagebra=1
    this.has_nextbra=true
    this.has_previousbra=true
    setTimeout(() => {
      if (
        this.matAutocompletebrach &&
        this.autocompleteTrigger &&
        this.matAutocompletebrach.panel
      ) {
        fromEvent(this.matAutocompletebrach.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletebrach.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.matAutocompletebrach.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebrach.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebrach.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true) {
                this.dataService.getbranchdropdown(this.branchContactInput.nativeElement.value, this.currentpagebra+ 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchList = this.branchList.concat(datas);
                    if (this.branchList.length >= 0) {
                      this.has_nextbra = datapagination.has_next;
                      this.has_previousbra = datapagination.has_previous;
                      this.currentpagebra = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  public displayfnbranch(branch?: branchList): string | undefined {
    return branch ? branch.name : undefined;
    
  }
  // branch dropdown end
  // bs dropdown start
  
  bsname_dropdown(){
    let prokeyvalue: String = "";
      this.getbsid(prokeyvalue);
      this.pprSearchForm.get('bs_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.dataService.getbsdropdown(this.business_id,value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.bsList = datas;
          this.pprSearchForm.controls['cc_id'].reset('')
        })
  }

  private getbsid(prokeyvalue){
    this.dataService.getbsdropdown(this.business_id,prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsList = datas;
  
      })
  }

  cc_bs_id=0
  currentpagebs:any=1
  has_nextbs:boolean=true
  has_previousbs:boolean=true
  autocompletebsnameScroll() {
    this.currentpagebs=1
  this.has_nextbs=true
  this.has_previousbs=true
    setTimeout(() => {
      if (
        this.matAutocompletebs &&
        this.autocompleteTrigger &&
        this.matAutocompletebs.panel
      ) {
        fromEvent(this.matAutocompletebs.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletebs.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.matAutocompletebs.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebs.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebs.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbs === true) {
                this.dataService.getbsdropdown(this.business_id,this.bsInput.nativeElement.value, this.currentpagebs+ 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.bsList = this.bsList.concat(datas);
                    if (this.bsList.length >= 0) {
                      this.has_nextbs = datapagination.has_next;
                      this.has_previousbs = datapagination.has_previous;
                      this.currentpagebs = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  public displayfnbs(bs?: bsList): string | undefined {
    return bs ? bs.name : undefined;
    
  }

  selectbsSection(data){
    this.cc_bs_id=data.id
  }

  bs_cc_clear(){
    this.pprSearchForm.controls['cc_id'].reset('')
  }
  // bs dropdown end
  // cc dropdown start

  ccname_dropdown(){
    let prokeyvalue: String = "";
      this.getccid(prokeyvalue);
      this.pprSearchForm.get('cc_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.dataService.getccdropdown(this.cc_bs_id,value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.ccList = datas;
  
        })
  }



  private getccid(prokeyvalue){
    this.dataService.getccdropdown(this.cc_bs_id,prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccList = datas;
  
      })
  }

  currentpagecc:any=1
  has_nextcc:boolean=true
  has_previouscc:boolean=true
  autocompletccnameScroll() {
    this.currentpagecc=1
    this.has_nextcc=true
    this.has_previouscc=true
    setTimeout(() => {
      if (
        this.matAutocompletecc &&
        this.autocompleteTrigger &&
        this.matAutocompletecc.panel
      ) {
        fromEvent(this.matAutocompletecc.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletecc.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.matAutocompletecc.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletecc.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletecc.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcc === true) {
                this.dataService.getccdropdown(this.cc_bs_id,this.ccInput.nativeElement.value, this.currentpagecc+ 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.ccList = this.ccList.concat(datas);
                    if (this.ccList.length >= 0) {
                      this.has_nextcc = datapagination.has_next;
                      this.has_previouscc = datapagination.has_previous;
                      this.currentpagecc = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


  public displayfncc(cc_name?: ccList): string | undefined {
    return cc_name ? cc_name.name : undefined;
    
  }
  // cc dropdown end
  // finyear dropdown start
  sector_id=0;
  finyear_dropdown(){
    let prokeyvalue: String = "";
      this.getfinyear(prokeyvalue);
      this.pprSearchForm.get('finyear').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.dataService.getfinyeardropdown(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.finyearList = datas;
  
        })
  }


  autocompletefin_yearScroll() {
    this.currentpage=1
    this.has_next=true
    this.has_previous=true
    setTimeout(() => {
      if (
        this.fin_yearauto &&
        this.autocompleteTrigger &&
        this.fin_yearauto.panel
      ) {
        fromEvent(this.fin_yearauto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.fin_yearauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.fin_yearauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.fin_yearauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.fin_yearauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcc === true) {
                this.dataService.getfinyeardropdown(this.finyearInput.nativeElement.value, this.currentpage+ 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.finyearList = this.finyearList.concat(datas);
                    if (this.finyearList.length >= 0) {
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
  private getfinyear(prokeyvalue){
    this.dataService.getfinyeardropdown(prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.finyearList = datas;
  
      })
  }
  public displayfnfinyear(fin_year?: finyearList): string | undefined {
    return fin_year ? fin_year.finyer : undefined;
    
  }

  // finyear dropdown end
  // sector dropdown start

  Sector_dropdown(){
    let prokeyvalue: String = "";
      this.getsector(prokeyvalue);
      this.pprSearchForm.get('sectorname').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.dataService.getsectordropdown(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.sectorList = datas;
  
        })
  }
  
  @ViewChild('sector_name') sectorAutoComplete:MatAutocomplete;
    autocompletesectorScroll(){
      this.has_next =true;
      this.has_previous = true;
      this.currentpage = 1;
      setTimeout(() => {
        if (
          this.sectorAutoComplete &&
          this.autocompleteTrigger &&
          this.sectorAutoComplete.panel
        ) {
          fromEvent(this.sectorAutoComplete.panel.nativeElement, 'scroll')
            .pipe(
              map(() => this.sectorAutoComplete.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(() => {
              const scrollTop = this.sectorAutoComplete.panel.nativeElement.scrollTop;
              const scrollHeight = this.sectorAutoComplete.panel.nativeElement.scrollHeight;
              const elementHeight = this.sectorAutoComplete.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextbra === true) {
                  this.dataService.getsectordropdown(this.sectornameInput.nativeElement.value, this.currentpage + 1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.sectorList = this.sectorList.concat(datas);
                      if (this.sectorList.length >= 0) {
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

  private getsector(prokeyvalue){
    this.dataService.getsectordropdown(prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.sectorList = datas;
  
      })
  }

  public displayfnsectorname(sector_name?: sectorList): string | undefined {
    return sector_name ? sector_name.name : undefined;
    
  }

  selectsectorSection(name){
    this.sector_id=name.id
  }

  secotralldata_clear(){
    this.pprSearchForm.controls['bs_id'].reset('')
    this.pprSearchForm.controls['businesscontrol'].reset('')
    this.pprSearchForm.controls['cc_id'].reset('')
  }
  // sector dropdown end
  // business dropdown start
  Business_dropdown(){
    let prokeyvalue: String = "";
      this.getbusiness(prokeyvalue);
      this.pprSearchForm.get('businesscontrol').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.dataService.getbusinessdropdown(this.sector_id,value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.businessList = datas;
          this.pprSearchForm.controls['bs_id'].reset('')
          this.pprSearchForm.controls['cc_id'].reset('')
        })
  }


  business_id=0;
  private getbusiness(prokeyvalue){
    this.dataService.getbusinessdropdown(this.sector_id,prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businessList = datas;
  
      })
  }
  autocompletebusinessnameScroll() {
    this.currentpagebra=1
    this.has_nextbra=true
    this.has_previousbra=true
    setTimeout(() => {
      if (
        this.business_nameauto &&
        this.autocompleteTrigger &&
        this.business_nameauto.panel
      ) {
        fromEvent(this.business_nameauto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.business_nameauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.business_nameauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.business_nameauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.business_nameauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true) {
                this.dataService.getbusinessdropdown(this.sector_id, this.businessInput.nativeElement.value, this.currentpagebra + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.businessList = this.businessList.concat(datas);
                    if (this.businessList.length >= 0) {
                      this.has_nextbra = datapagination.has_next;
                      this.has_previousbra = datapagination.has_previous;
                      this.currentpagebra = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  public displayfnbusiness(business_name?: businessList): string | undefined {
    return business_name ? business_name.name : undefined;
    
  }

  selectbusinessSection(data){
    this.business_id=data.id
    if (this.business_id==undefined){
      this.pprSearchForm.value.bs_id = ' ';
    }
  }

  business_bs_clear(){
    this.pprSearchForm.controls['bs_id'].reset('')
    this.pprSearchForm.controls['cc_id'].reset('')
  }
  // business dropdown end
  // expensegrp dropdown start

  Expensegrp_dropdown(){
    let prokeyvalue: String = "";
      this.getexpensegrp(prokeyvalue);
      // this.pprSearchForm.get('expensegrp').valueChanges
        this.expensegrp.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.dataService.getexpensegrpdropdown(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          // this.expensegrpList = datas;
          this.expenseList = datas
  
        })
  }

  autocompletexpenseScroll() {
    this.currentpage=1
    this.has_next=true
    this.has_previous=true
    setTimeout(() => {
      if (
        this.matprodAutocomplete &&
        this.autocompleteTrigger &&
        this.matprodAutocomplete.panel
      ) {
        fromEvent(this.matprodAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matprodAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.matprodAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matprodAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matprodAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getexpensegrpdropdown(this.expInput.nativeElement.value, this.currentpage+ 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.expenseList = this.expenseList.concat(datas);
                    if (this.expenseList.length >= 0) {
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
  private getexpensegrp(prokeyvalue){
    this.dataService.getexpensegrpdropdown(prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        // this.expensegrpList = datas;
        this.expenseList = datas
  
      })
  }

  public displayfnexpense(expense_name?: expensegrpList): string | undefined {
    return expense_name ? expense_name.name : undefined;
    
  }
  
  public removeEmployeeDept(dept: iDeptList): void {
    const index = this.chipSelectedEmployeeDept.indexOf(dept);
    if (index >= 0) {
      this.chipSelectedEmployeeDept.splice(index, 1);
      this.chipSelectedEmployeeDeptid.splice(index, 1);
      this.employeeDeptInput.nativeElement.value = '';
    }
  }

  public employeeDeptSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectEmployeeDeptByName(event.option.value.name);
    this.employeeDeptInput.nativeElement.value = '';
  }
  private selectEmployeeDeptByName(dept) {
    let foundEmployeeDept1 = this.chipSelectedEmployeeDept.filter(employeedept => employeedept.name == dept);
    if (foundEmployeeDept1.length) {
      return;
    }
    let foundEmployeeDept = this.expensegrpList.filter(employeedept => employeedept.name == dept);
    if (foundEmployeeDept.length) {
      this.chipSelectedEmployeeDept.push(foundEmployeeDept[0]);
      this.chipSelectedEmployeeDeptid.push(foundEmployeeDept[0].id)
    }
  }
  // expensegrp dropdown end
  type:any
  supplier_chkval:any;
  fyer:String;
  pprsearech_click(data) {
    
    // let search = data.finyear;
    if(data.supplier_check==true){
    this.supplier_chkval="Y"
    }else{
      this.supplier_chkval="N"
    }
    if ((this.pprSearchForm.value.finyear === undefined) || (this.pprSearchForm.value.finyear === '')) {
      
      this.toastr.warning('', 'Please Select Finyear', { timeOut: 1500 });
      return false;
    }else{
      if(this.pprSearchForm.value.finyear.finyer==undefined){
        this.fyer= this.pprSearchForm.value.finyear
        this.pprSearchForm.value.finyear=this.pprSearchForm.value.finyear
      }else{
        this.fyer= this.pprSearchForm.value.finyear.finyer
        this.pprSearchForm.value.finyear=this.pprSearchForm.value.finyear.finyer
      }
      // let fyer= this.pprSearchForm.value.finyear.finyer
      let  myArr = this.fyer.toString().split("-");
      let a=myArr[0]
      this.Apr="Apr-"+(parseInt(myArr[1])-1)
    this.May="May-"+(parseInt(myArr[1])-1)
    this.Jun="Jun-"+(parseInt(myArr[1])-1)
    this.Jul="Jul-"+(parseInt(myArr[1])-1)
    this.Aug="Aug-"+(parseInt(myArr[1])-1)
    this.Sep="Sep-"+(parseInt(myArr[1])-1)
    this.Oct="Oct-"+(parseInt(myArr[1])-1)
    this.Nov="Nov-"+(parseInt(myArr[1])-1)
    this.Dec="Dec-"+(parseInt(myArr[1])-1)
    // this.nextyear=parseInt(new Date().getFullYear().toString().substr(-2))+1
    this.Jan="Jan-"+myArr[1]
    this.Feb="Feb-"+myArr[1]
    this.Mar="Mar-"+myArr[1]
    }




    if (this.pprSearchForm.value.year_term === '') {
      this.toastr.warning('', 'Please Select Quarterly or Monthly', { timeOut: 1500 });
      return false;
    }
    if (this.pprSearchForm.value.divAmount === '') {
      this.toastr.warning('', 'Please Select Amount', { timeOut: 1500 });
      return false;
    }
    if (data.year_term=='Quarterly'){
      this.headercheck=false;
      this.type='Quarterly'
      this.headercheckone=true;
      
    }
    else if(data.year_term=='Monthly'){
      this.type='Monthly'
      this.headercheckone=false;
      this.headercheck=true
    }
    if (data.divAmount=='L'){
      this.amountval_type='L'
      this.amount_type='Amount In Lakhs'
    }
    if (data.divAmount=='T'){
      this.amountval_type='K'
      this.amount_type='Amount In Thousands'
    }
    // "sectorname":this.pprSearchForm.value.sectorname
    if((data.sectorname==undefined) || (data.sectorname=='')){
      
      
      this.toastr.warning('', 'Please Select Sector', { timeOut: 1500 });
      return false;
      
    }else{
      let sector1_name=data.sectorname
      this.pprSearchForm.value.sectorname=this.pprSearchForm.value.sectorname.name
      if(this.pprSearchForm.value.sectorname==undefined){
        this.pprSearchForm.value.sectorname=sector1_name
      }
    }
   
    if((data.businesscontrol==undefined) || (data.businesscontrol=='')){
      // this.toastr.warning('', 'Please Select Business', { timeOut: 1500 });
      // return false;
      this.pprSearchForm.value.masterbusinesssegment_name=''
    }
    else{
      this.pprSearchForm.value.masterbusinesssegment_name=this.pprSearchForm.value.businesscontrol.name
    }
    if((data.bs_id==undefined)||(data.bs_id=='')){
      this.pprSearchForm.value.bs_name=''
    }else{
      this.pprSearchForm.value.bs_name=this.pprSearchForm.value.bs_id.name
    }
    if((data.cc_id==undefined)||(data.cc_id=='')){
      this.pprSearchForm.value.cc_name=''
    }else{
      this.pprSearchForm.value.cc_name=this.pprSearchForm.value.cc_id.name
    }
    if(this.chipSelectedprodid.length==0){
      this.pprSearchForm.value.expensegrp_name_arr=''
    }else{
    this.pprSearchForm.value.expensegrp_name_arr=this.chipSelectedprodid}
    
    // this.pprSearchForm.value.sectorname=this.pprSearchForm.value.sectorname
    if ((data.branch_id==undefined)||(data.branch_id=='')){
      this.pprSearchForm.value.branch_id=''
    }else{
      this.pprSearchForm.value.branch_id=this.pprSearchForm.value.branch_id.id
    }
    this.SpinnerService.show();
    this.dataService.getpprsummary(this.pprSearchForm.value)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        if (this.type=='Quarterly'){
          for (let i=0;i<datas.length;i++){
            datas['tree_flag']='Y'
          }
          this.summarydata=datas;
        }
        if (this.type=='Monthly'){
          for (let i=0;i<datas.length;i++){
            datas[i]['tree_flag']='Y'
            
          }
          this.summarydata = datas;
        }
        
        console.log("statenameeeee", datas)
  
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    

    // console.log("search",search);
    
    }
    
    dialogRef: any
    // openpopup_fn(){
    //   this.exampleModalCenter.show()
    //   this.tabcheck_supplier=true;
    //   this.tabcheck_ccbs=false;
    //   this.tabcheck_ecf=false;
    // }
    data_input:any;
    tabvales:any;
    masterbusinesssegment_name_params:any; 
    tabcheck_supplier:boolean = true;  
    tabcheck_ccbs:boolean = false; 
    tabcheck_ecf:boolean=false;
    
    treelevel_click(ind,data,data1){
      let a=[]
      let a2=ind+1 
      if (data.tree_flag=='N'){
        if(data.Padding_left=='10px'){
      for (let i = a2; i < data1.length; i++) {
        let a1=data1[i]
        a.push(i) 
        if (a1.Padding_left=='10px') { break; }
        console.log ("Block statement execution no." + i);
      }}
      if(data.Padding_left=='50px'){
        for (let i = a2; i < data1.length; i++) {
          let a1=data1[i]
          a.push(i) 
          if ((a1.Padding_left=='50px')||(a1.Padding_left=='10px')) { break; }
          console.log ("Block statement execution no." + i);
        }}
        if(data.Padding_left=='75px'){
          for (let i = a2; i < data1.length; i++) {
            let a1=data1[i]
            a.push(i) 
            if ((a1.Padding_left=='75px')||(a1.Padding_left=='50px')) { break; }
            console.log ("Block statement execution no." + i);
          }}
        if(data.Padding_left=='100px'){
          for (let i = a2; i < data1.length; i++) {
            let a1=data1[i]
            a.push(i) 
            if ((a1.Padding_left=='100px')||(a1.Padding_left=='75px')) { break; }
            console.log ("Block statement execution no." + i);
          }}
      a.pop()
      const indexSet = new Set(a);

    const arrayWithValuesRemoved = data1.filter((value, i) => !indexSet.has(i));
    arrayWithValuesRemoved[ind].tree_flag='Y'
    this.summarydata=arrayWithValuesRemoved;
    console.log(arrayWithValuesRemoved);
      }else{
       
      if (data.Padding_left=='10px'){
        if(this.pprSearchForm.value.masterbusinesssegment_name==undefined){
          this.masterbusinesssegment_name_params=""
         }else{
          this.masterbusinesssegment_name_params=this.pprSearchForm.value.masterbusinesssegment_name
         }
        let input_params={
          
          "branch_id":this.pprSearchForm.value.branch_id,
          "finyear": this.pprSearchForm.value.finyear,
          "year_term": this.type,
          "divAmount": this.amountval_type,
          "sectorname":this.pprSearchForm.value.sectorname,
          "masterbusinesssegment_name":this.masterbusinesssegment_name_params,
          "bs_name":this.pprSearchForm.value.bs_name,
          "cc_name":this.pprSearchForm.value.cc_name,
          "expensegrp_name_arr":data.name
      }
      this.new_expense_list(ind,input_params,data1,1)
    
      }
      if ((data.Padding_left=='100px') && (this.supplier_chkval=='Y')){
        if(this.pprSearchForm.value.masterbusinesssegment_name==undefined){
          this.masterbusinesssegment_name_params=""
         }else{
          this.masterbusinesssegment_name_params=this.pprSearchForm.value.masterbusinesssegment_name
         }
         let input_params={ 
         "apinvoicebranch_id": this.pprSearchForm.value.branch_id,

          "divAmount":this.amountval_type,
          "apexpense_id": data.expense_id,
          "apsubcat_id": data.subcat_id,
          "masterbusinesssegment_name": this.pprSearchForm.value.masterbusinesssegment_name,
          "sectorname": this.pprSearchForm.value.sectorname,
          "yearterm": this.type,
          "finyear":this.pprSearchForm.value.finyear,
          "bs_name":this.pprSearchForm.value.bs_name,
          "cc_name":this.pprSearchForm.value.cc_name,
      }
      this.getsupplieramountdetails(ind,input_params,data1);
    
      }
    if(data.Padding_left=='50px'){
      if(this.pprSearchForm.value.masterbusinesssegment_name==undefined){
        this.masterbusinesssegment_name_params=""
       }else{
        this.masterbusinesssegment_name_params=this.pprSearchForm.value.masterbusinesssegment_name
       }
      let input_params={
        "branch_id":this.pprSearchForm.value.branch_id,
        "finyear": this.pprSearchForm.value.finyear,
        "year_term": this.type,
        "divAmount": this.amountval_type,
        "sectorname":this.pprSearchForm.value.sectorname,
        "businesscontrol":this.masterbusinesssegment_name_params,
        "bs_name":this.pprSearchForm.value.bs_name,
        "cc_name":this.pprSearchForm.value.cc_name,
        "expense_id":data.expense_id
    }
      this.new_cat_list(ind,input_params,data1)
    }
    if(data.Padding_left=='75px'){
      if(this.pprSearchForm.value.masterbusinesssegment_name==undefined){
        this.masterbusinesssegment_name_params=""
       }else{
        this.masterbusinesssegment_name_params=this.pprSearchForm.value.masterbusinesssegment_name
       }
      let input_params={
        "branch_id":this.pprSearchForm.value.branch_id,
        "finyear": this.pprSearchForm.value.finyear,
        "year_term": this.type,
        "divAmount": this.amountval_type,
        "sectorname":this.pprSearchForm.value.sectorname,
        "businesscontrol":this.masterbusinesssegment_name_params,
        "bs_name":this.pprSearchForm.value.bs_name,
        "cc_name":this.pprSearchForm.value.cc_name,
        "category_id":data.cat_id
    }
      this.new_subcat_list(ind,input_params,data1)
    }
  }
}

// treelevel_more_click(ind,data,data1){
//   if (data.Padding_left=='50px'){
//     if(this.pprSearchForm.value.masterbusinesssegment_name==undefined){
//       this.masterbusinesssegment_name_params=""
//      }else{
//       this.masterbusinesssegment_name_params=this.pprSearchForm.value.masterbusinesssegment_name
//      }
//     let a2=ind-1
//     let a11=[]
//      for (let i = a2; i < data1.length; i--) {
//       let a1=data1[i]
      
//       if (a1.Padding_left=='10px')  {a11.push(i); break; }
//       console.log ("Block statement execution no." + i);
//     }   
//     let input_params={
      
//       "branch_id":"",
//       "finyear": "FY21-22",
//       "year_term": this.type,
//       "divAmount": this.amountval_type,
//       "sectorname":this.pprSearchForm.value.sectorname,
//       "masterbusinesssegment_name":this.masterbusinesssegment_name_params,
//       "bs_name":"",
//       "cc_name":"",
//       "expensegrp_name_arr":data.name
//   }
//   let a=this.currentpage_expence+1
//   this.new_expense_list(ind,input_params,data1,a)

//   }

// }
// new_cat_list(ind,data,data1,pageNumber){

// }
has_next_expence = true;
has_previous_expence = true;
currentpage_expence: number = 1;
presentpage_expence:number = 1;
index_expense:any;
    private new_expense_list(ind,data,data1,pageNumber){
      this.index_expense=ind+1
this.SpinnerService.show()

      this.dataService.new_expenselist(data,pageNumber)
        .subscribe((results: any[]) => {
this.SpinnerService.hide()

          let datas = results["data"];
          
          if (datas.length==0){
            this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
          }else{
            
          for (var val of datas) {
            let a=data
            
            data1.splice(this.index_expense, 0, val);
            this.index_expense=this.index_expense+1
          }
          data1[ind].tree_flag='N'
          this.summarydata=data1
          this.supplierList = datas;}
          
    
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    }
    index_subcat:any;
    private new_cat_list(ind,data,data1){
    this.index_cat=ind+1
this.SpinnerService.show()

      this.dataService.new_cat_list(data)
        .subscribe((results: any[]) => {
this.SpinnerService.hide()

          let datas = results["data"];
          if (datas.length==0){
            this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
          }else{
            
          for (var val of datas) {
            let a=data
            data1.splice(this.index_cat, 0, val);
            this.index_cat=this.index_cat+1
          }
          data1[ind].tree_flag='N'
          this.summarydata=data1
          this.supplierList = datas;}
          
    
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    }
    private new_subcat_list(ind,data,data1){
      this.index_subcat=ind+1
  this.SpinnerService.show()

        this.dataService.new_subcatlist(data)
          .subscribe((results: any[]) => {
  this.SpinnerService.hide()

            let datas = results["data"];
            if (datas.length==0){
              this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
            }else{
              
            for (var val of datas) {
              let a=data
              data1.splice(this.index_subcat, 0, val);
              this.index_subcat=this.index_subcat+1
            }
            data1[ind].tree_flag='N'
            this.summarydata=data1
            this.supplierList = datas;}
            
      
          }, error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          })
      }
    tranmonth_cunt:any
    qtr_cnt:any
    openpopup_fn(data,tmonth,quarter) {
      this.tabcheck_supplier=true;
      this.tabcheck_ccbs=false;
      this.tabcheck_ecf=false;
      this.tranmonth_cunt=tmonth
      this.qtr_cnt=quarter
      this.data_input={
        "apexpense_id": data.expense_id,
        "apsubcat_id": data.subcat_id,
        "transactionmonth": tmonth,
        "quarter": quarter,
        // "masterbusinesssegment_name": 'PBLG',
        "masterbusinesssegment_name": this.pprSearchForm.value.masterbusinesssegment_name,
        "sectorname": this.pprSearchForm.value.sectorname,
        "apinvoicesupplier_id": "",
        // "apinvoicesupplier_id": 1,
        "yearterm": this.type,
        "finyear":this.pprSearchForm.value.finyear,
        "bs_name":this.pprSearchForm.value.bs_name,
        "cc_name":this.pprSearchForm.value.cc_name,
        "divAmount":this.amountval_type,
    }
      this.getsupplierdetails(this.data_input);
      // this.dialogRef = this.dialog.open(templateRef, {
      //   width: '100%',
      //   height:'100%'
      // });
      // this.dialogRef.afterClosed().subscribe(result => {
      //   //console.log('The dialog was closed');
      // });
    }
    // closedialog(): void {
    //   this.dialogRef.close();
    // }
    
    
    // supplieropenpopup_fn(data,suppliermytemplate) {
    //   this.tabcheck_supplier=true;
    //   this.tabcheck_ccbs=false;
    //   this.tabcheck_ecf=false;
    //   let data1={   
    //     "divAmount":this.amountval_type,
    //     "apexpense_id": data.expense_id,
    //     "apsubcat_id": data.subcat_id,
    //     "masterbusinesssegment_name": this.pprSearchForm.value.masterbusinesssegment_name,
    //     "sectorname": this.pprSearchForm.value.sectorname,
    //     "yearterm": this.type,
    // }
      // this.getsupplieramountdetails(data1);
    //   this.dialogRef = this.dialog.open(suppliermytemplate, {
    //     width: '100%',
    //     height:'100%'
    //   });
    //   this.dialogRef.afterClosed().subscribe(result => {
    //     //console.log('The dialog was closed');
    //   });
    // }
    // closedialog_supplier(): void {
    //   this.dialogRef.close();
    // }
    
  
  popuptab_click(data){
    this.tabvales=data;
    if (this.tabvales=='supplier'){
      this.tabcheck_supplier=true;
      this.tabcheck_ccbs=false;
      this.tabcheck_ecf=false;
    }
    if (this.tabvales=='ccbs'){
      this.tabcheck_supplier=false;
      this.tabcheck_ccbs=true;
      this.tabcheck_ecf=false
    }
    if(this.tabvales=='ccbs'){
      this.getccbsdetails(this.data_input)
      
    }

  }
  pecfhide=false
  ecf_show(supplier_obj){
    this.supplier_name=supplier_obj.supplier_name
    this.supplier_code=supplier_obj.supplier_code
    this.supplier_branchname=supplier_obj.supplier_branchname
    this.input_ecf={
      "apexpense_id":supplier_obj.apexpense_id ,
      "apsubcat_id": supplier_obj.apsubcat_id,
      "apinvoicesupplier_id":supplier_obj.supplier_id,
      "apinvoicebranch_id":this.pprSearchForm.value.branch_id,
      "transactionmonth": this.tranmonth_cunt,
      "quarter": this.qtr_cnt,
      "masterbusinesssegment_name": this.pprSearchForm.value.masterbusinesssegment_name,
      "sectorname": this.pprSearchForm.value.sectorname,
      "yearterm": this.type,
      "divAmount": this.amountval_type,
      "finyear":this.pprSearchForm.value.finyear,
      "bs_name":this.pprSearchForm.value.bs_name,
      "cc_name":this.pprSearchForm.value.cc_name
  }
 
    this.getecfdetails(this.input_ecf)
  }
  // suppliergetapi start
  
  private getsupplierdetails(data,pageNumber = 1,pageSize=10){
this.SpinnerService.show()
    
    this.dataService.getsupplierdetail(data,pageNumber,pageSize)
      .subscribe((results: any[]) => {
this.SpinnerService.hide()

        let datas = results["data"];
        this.supplierList = datas;
        let datapagination = results["pagination"];
  
  
  if (this.supplierList.length >= 0) {
    this.has_next = datapagination.has_next;
    this.has_previous = datapagination.has_previous;
    this.presentpage = datapagination.index;
  }
        
  
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
   ecfgetsupplierdetails(supplier_obj,tmonth,quarter){
    this.supplierpopup=false
    this.SpinnerService.show()
    this.tranmonth_cunt=tmonth
      this.qtr_cnt=quarter
    let input_ecf={
      "apexpense_id":supplier_obj.apexpense_id ,
      "apsubcat_id": supplier_obj.apsubcat_id,
      "apinvoicesupplier_id":supplier_obj.supplier_id,
      "apinvoicebranch_id":this.pprSearchForm.value.branch_id,
      "transactionmonth":this.qtr_cnt ,
      "quarter": '',
      "masterbusinesssegment_name": this.pprSearchForm.value.masterbusinesssegment_name,
      "sectorname": this.pprSearchForm.value.sectorname,
      "yearterm": this.type,
      "divAmount": this.amountval_type,
      "finyear":this.pprSearchForm.value.finyear,
      "bs_name":this.pprSearchForm.value.bs_name,
      "cc_name":this.pprSearchForm.value.cc_name
  }
        this.dataService.getecfdetails(input_ecf)
          .subscribe((results: any[]) => {
    this.SpinnerService.hide()

            let datas = results["data"];
            this.ecfval = datas;
            console.log("supplierList=>",this.supplierList)
            
      
          }, error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          })
      }

  supplierccbsList:any;
  private getccbsdetails(data,pageNumber=1,pageSize=10){
    this.getcc=data
    this.dataService.getccbsdetails(data,pageNumber,pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierccbsList = datas;
        let datapagination = results["pagination"];
  
  
        if (this.supplierList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }
        
  
      })
  }
  supplierecfList:any;
  private getecfdetails(data,pageNumber = 1, pageSize = 10){
    
this.SpinnerService.show()
this.tabcheck_ecf=true
this.pecfhide=false
    this.dataService.getecfdetails(data)
      .subscribe((results: any[]) => {
this.SpinnerService.hide()

        let datas = results["data"];
        this.supplierecfList = datas;
        
  
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  private getsupplieramountdetails(ind,data,data1){
this.SpinnerService.show()
    
    this.dataService.getsupplieramountdetails(data)
      .subscribe((results: any[]) => {
this.SpinnerService.hide()

        let datas = results["data"];
        if (datas.length==0){
          this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        }else{
          
        for (var val of datas) {
          let a=data
          data1.splice(ind+1, 0, val);
          
        }
        data1[ind].tree_flag='N'
        this.summarydata=data1
        this.supplierList = datas;}
        
  
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  // suppliergetapi end

  clear_budgetdata(){
    this.chipSelectedprod=[]   
    this.chipSelectedprodid=[]   
    this.expInput.nativeElement.value = '';
    this.pprSearchForm.reset();
    this.chipSelectedprodid=[]
    this.summarydata=[]
    this.qsummarydata=[]
    this.expenseList=[]
    this.amount_type=''
    
  }
  
  pprsubModuleData(data){
    console.log("data=>",data)
    if (data.name=='Budget Builder'){
      this.tabcheck_ppr=false;
      this.tabcheck_pprchecker=false
      this.pprclient=false;
      this.tabcheck_pprreport=false;
      this.tabcheck_pprbuilder=true;
      this.tabcheck_pprreviewer=false;
      this.variance_analysis=false
      this.budgetreviewer=false
      this.budgetapprover=false
      this.cost_allocation=false
      this.emp_bs_mapping=false
      this.ca_technology=false
      this.expense_budget_mgmt=false
      this.dssreport=false
      this.expgrplevel_mapping=false
    }
    if (data.name=="Budget Checker"){
      this.tabcheck_ppr=false;
      this.pprclient=false
      this.tabcheck_pprreport=false;
      this.tabcheck_pprbuilder=false;
      this.tabcheck_pprreviewer=false;
      this.variance_analysis=false
      this.budgetreviewer=false
      this.budgetapprover=false
      this.cost_allocation=false
      this.emp_bs_mapping=false
      this.ca_technology=false
      this.expense_budget_mgmt=false
      this.tabcheck_pprchecker=true
      this.dssreport=false
      this.expgrplevel_mapping=false
    }
    if (data.name=='Budget Reviewer'){
      this.tabcheck_pprreviewer=true;
      this.tabcheck_pprreport=false;
      this.tabcheck_pprchecker=false

      this.tabcheck_ppr=false
      this.budgetreviewer=false
      this.budgetapprover=false
      this.pprclient=false
      this.tabcheck_pprbuilder=false
      this.variance_analysis=false
      this.cost_allocation=false
      this.emp_bs_mapping=false
      this.ca_technology=false
      this.expense_budget_mgmt=false
      this.dssreport=false
      this.expgrplevel_mapping=false

    }
    if (data.name=='PPR Report'){
      this.tabcheck_pprreviewer=false;
      this.tabcheck_pprreport=false;
      this.tabcheck_ppr=true;
      this.budgetreviewer=false
      this.budgetapprover=false
      this.tabcheck_pprchecker=false
      this.pprclient=false
      this.tabcheck_pprbuilder=false
      this.variance_analysis=false
      this.cost_allocation=false
      this.emp_bs_mapping=false
      this.ca_technology=false
      this.expense_budget_mgmt=false
      this.dssreport=false
      this.expgrplevel_mapping=false
    }
    // Variance Analysis
    if (data.name=='Variance Analysis'){
      this.tabcheck_pprreviewer=false;
      this.tabcheck_pprreport=false;
      this.tabcheck_ppr=false
      this.budgetreviewer=false
      this.tabcheck_pprchecker=false
      this.pprclient=false
      this.budgetapprover=false
      this.tabcheck_pprbuilder=false
      this.variance_analysis=true
      this.cost_allocation=false
      this.emp_bs_mapping=false
      this.ca_technology=false
      this.expense_budget_mgmt=false
      this.dssreport=false
      this.expgrplevel_mapping=false

    }
    // cost_allocation
    if(data.name=='Cost Allocation'){
      this.tabcheck_pprreviewer=false;
      this.tabcheck_pprreport=false;
      this.tabcheck_ppr=false
      this.budgetreviewer=false
      this.budgetapprover=false
      this.tabcheck_pprchecker=false
      this.pprclient=false
      this.tabcheck_pprbuilder=false
      this.variance_analysis=false
      this.cost_allocation=true
      this.emp_bs_mapping=false
      this.ca_technology=false
      this.expense_budget_mgmt=false
      this.dssreport=false
      this.expgrplevel_mapping=false
    }
    if(data.name=="Budget Reviewer"){
      this.tabcheck_pprreviewer=false;
      this.tabcheck_pprreport=false;
      this.tabcheck_ppr=false
      this.budgetreviewer=true
      this.budgetapprover=false
      this.tabcheck_pprbuilder=false
      this.variance_analysis=false
      this.cost_allocation=false
      this.emp_bs_mapping=false
      this.ca_technology=false
      this.expense_budget_mgmt=false
      this.tabcheck_pprchecker=false
      this.pprclient=false
      this.dssreport=false
      this.expgrplevel_mapping=false
    }
    if(data.name=="Budget Approver"){
      this.tabcheck_pprreviewer=false;
      this.tabcheck_pprreport=false;
      this.tabcheck_ppr=false
      this.budgetreviewer=false
      this.budgetapprover=true
      this.tabcheck_pprbuilder=false
      this.variance_analysis=false
      this.cost_allocation=false
      this.emp_bs_mapping=false
      this.ca_technology=false
      this.expense_budget_mgmt=false
      this.tabcheck_pprchecker=false
      this.pprclient=false
      this.dssreport=false
      this.expgrplevel_mapping=false

    }
    if(data.name=="Emp BS Mapping"){
      this.tabcheck_pprreviewer=false;
      this.tabcheck_pprreport=false;
      this.tabcheck_ppr=false
      this.budgetreviewer=false
      this.budgetapprover=false
      this.tabcheck_pprbuilder=false
      this.variance_analysis=false
      this.cost_allocation=false
      this.emp_bs_mapping=true
      this.ca_technology=false
      this.expense_budget_mgmt=false
      this.tabcheck_pprchecker=false
      this.pprclient=false
      this.dssreport=false
      this.expgrplevel_mapping=false
    }
    if(data.name=="Expense Budget Mgmt"){
      this.tabcheck_pprreviewer=false;
      this.tabcheck_pprreport=false;
      this.tabcheck_ppr=false
      this.budgetreviewer=false
      this.budgetapprover=false
      this.tabcheck_pprbuilder=false
      this.variance_analysis=false
      this.cost_allocation=false
      this.emp_bs_mapping=false
      this.expense_budget_mgmt=true
      this.ca_technology=false
      this.tabcheck_pprchecker=false
      this.pprclient=false
      this.dssreport=false
      this.expgrplevel_mapping=false
    }
    if(data.name=="CA-Technology"){
      this.tabcheck_pprreviewer=false;
      this.tabcheck_pprreport=false;
      this.tabcheck_ppr=false
      this.budgetreviewer=false
      this.budgetapprover=false
      this.tabcheck_pprbuilder=false
      this.variance_analysis=false
      this.cost_allocation=false
      this.emp_bs_mapping=false
      this.ca_technology=true
      this.expense_budget_mgmt=false
      this.tabcheck_pprchecker=false
      this.pprclient=false
      this.dssreport=false
      this.expgrplevel_mapping=false
    }
    if (data.name=='DSS Report'){
      this.tabcheck_ppr=false;
      this.tabcheck_pprchecker=false
      this.pprclient=false;
      this.tabcheck_pprreport=false;
      this.tabcheck_pprbuilder=false;
      this.tabcheck_pprreviewer=false;
      this.variance_analysis=false
      this.budgetreviewer=false
      this.budgetapprover=false
      this.cost_allocation=false
      this.emp_bs_mapping=false
      this.ca_technology=false
      this.expense_budget_mgmt=false
      this.dssreport=true
      this.expgrplevel_mapping=false
    }
    if (data.name=='PPR master'){
      this.tabcheck_ppr=false;
      this.tabcheck_pprchecker=false
      this.pprclient=false;
      this.tabcheck_pprreport=false;
      this.tabcheck_pprbuilder=false;
      this.tabcheck_pprreviewer=false;
      this.variance_analysis=false
      this.budgetreviewer=false
      this.budgetapprover=false
      this.cost_allocation=false
      this.emp_bs_mapping=false
      this.ca_technology=false
      this.expense_budget_mgmt=false
      this.dssreport=false
      this.expgrplevel_mapping=true
    }
  }

  expenseList: expenseListss[];
  public chipSelectedprod: expenseListss[] = [];
  public chipSelectedprodid = [];
  expensegrp = new FormControl();

  @ViewChild('exp') matprodAutocomplete: MatAutocomplete;
  @ViewChild('expInput') expInput: any;
  public removedprod(pro: expenseListss): void {
    const index = this.chipSelectedprod.indexOf(pro);
    if (index >= 0) {
      this.chipSelectedprod.splice(index, 1);
      console.log(this.chipSelectedprod);
      this.chipSelectedprodid.splice(index, 1);
      console.log(this.chipSelectedprodid);
      this.expInput.nativeElement.value = '';
    }
  }
  public prodSelected(event: MatAutocompleteSelectedEvent): void {
    console.log('event.option.value',event.option.value)
    this.selectprodByName(event.option.value.name);
    this.expInput.nativeElement.value = '';
    console.log('chipSelectedprodid',this.chipSelectedprodid)
  }
  private selectprodByName(prod) {
    let foundprod1 = this.chipSelectedprod.filter(pro => pro.name == prod);
    if (foundprod1.length) {
      return;}
    let foundprod = this.expenseList.filter(pro => pro.name == prod);
    if (foundprod.length) {
      this.chipSelectedprod.push(foundprod[0]);
      // this.chipSelectedprodid.push(foundprod[0].id)
      this.chipSelectedprodid.push(foundprod[0].name)
    }
  }

  ecfdata

  ecfpopup(data){
    this.tabcheck_ecf=true
    this.pecfhide=true
    this.supplierpopup=true
    console.log("data=>",data)
    
    let gcf= {"invoiceheader_gid": data.invoiceheader_gid, "cr_no":data.invoiceheader_crno}
    // { "invoiceheader_gid": 73484, "cr_no":"NPO2103290021"}
    console.log(data.invoiceheader_crno,data.branch_name)
    this.crno=data.invoiceheader_crno
    this.branch_name=data.branch_name
    this.branch_code=data.branch_code
    this.invoiceno=data.invoiceheader_invoiceno
    this.invoiceheader_amount=data.invoiceheader_amount
    this.SpinnerService.show()

    this.dataService.getecf(gcf)
    .subscribe((results: any[]) => {
this.SpinnerService.hide()

      console.log("resu=>",results)
      this.ecfdata=results['data']
      
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  download(data){


this.filename=data.file_name
let cr_no=data.cr_no
let file_gid=data.file_gid
let invoiceheaderid=data.invoiceheaderid
let name="ECF"
this.SpinnerService.show();

this.dataService.ecfdownload(this.filename,cr_no,invoiceheaderid,file_gid)
.subscribe((data:any) => { 
this.SpinnerService.hide();

let binaryData = [];
console.log(binaryData)

binaryData.push(data)
console.log("data",data)
console.log("binaryData",binaryData)
this.downloadUrl = window.URL.createObjectURL(new Blob([data], {type: 'application/pdf'}));
let link = document.createElement('a');
console.log(link)
link.href = this.downloadUrl;
this.pdfSrc = this.downloadUrl;
console.log("url",this.pdfSrc)
}, error => {
this.errorHandler.handleError(error);
this.SpinnerService.hide();
})
this.pdfSrc=undefined
  
}
moveonback(){
    this.getecfdetails(this.input_ecf)
    // this.getsupplierdetails(this.data_input);
}
@ViewChild('close_popup') close_popup:any
closepopup_supplier(){
  // $('#close_popup').trigger('click.dismiss.examplepoppdf.modal')

  this.close_popup.nativeElement.click()
}
presentpage=1
previousClick() {
  if (this.has_previous === true) {

    // *(this.pageSize);
    this.getsupplierdetails(this.data_input,this.presentpage - 1, 10);

    
  }
}
nextClick() {

  if (this.has_next === true) {

    // *(this.pageSize);
    this.getsupplierdetails(this.data_input,this.presentpage + 1, 10)
  }
}
previousccbsClick(){
  if (this.has_previous === true) {
  this.getccbsdetails(this.getcc,this.presentpage - 1, 10)
  }
}
nextccbsClick(){
  if (this.has_next === true) {
  this.getccbsdetails(this.getcc,this.presentpage + 1, 10)

  }

}
counting=1
ppr_mono(counting){
  console.log("start",counting)
  this.SpinnerService.show();
  this.dataService.ppr_nac(this.counting)
  .subscribe((data:any) => { 
    let message=data['MESSAGE']
    this.SpinnerService.hide();
    this.toastr.success(message.message,'', { timeOut: 1500 });

  }, error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })

  

}
}
export interface expenseListss {
  id: string;
  name: any;
}