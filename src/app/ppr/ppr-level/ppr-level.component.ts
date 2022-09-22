import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PprService } from '../ppr.service';
import { NgxSpinnerService } from "ngx-spinner";
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map, debounce } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { ErrorhandlingService } from '../errorhandling.service';


export interface branchList {
  id: number
  name: string
}
export interface bsList {
  id: number
  name: string
}
export interface ccList {
  id: number
  name: string
}
export interface finyearList {
  finyer: string
}
export interface sectorList {
  id: number
  name: string
}
export interface businessList {
  id: number
  name: string
}
export interface expensegrpList {
  id: number
  name: string
}
export interface iDeptList {
  name: string;
  id: number;
}

@Component({
  selector: 'app-ppr-level',
  templateUrl: './ppr-level.component.html',
  styleUrls: ['./ppr-level.component.scss']
})
export class PprLevelComponent implements OnInit {

  panelOpenState = false;
  // branch dropdown
  @ViewChild('branchContactInput') branchContactInput: any;
  @ViewChild('branch') matAutocompletebrach: MatAutocomplete;

  //bs

  @ViewChild('bsInput') bsInput: any;
  @ViewChild('bs') matAutocompletebs: MatAutocomplete;

  //cc
  @ViewChild('ccInput') ccInput: any;
  @ViewChild('cc_name') matAutocompletecc: MatAutocomplete;

  //  finyear
  @ViewChild('finyearInput') finyearInput: any;

  //sector
  @ViewChild('sectornameInput') sectornameInput: any;

  //business
  @ViewChild('businessInput') businessInput: any;
  @ViewChild('business_name') business_nameautocomplete:MatAutocomplete;

  //expense_grp
  @ViewChild('expenseInput') expenseInput: any;

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
  aa: any;
  year: any;
  Apr: string;
  May: string;
  Jun: string;
  Jul: string;
  Aug: string;
  Sep: string;
  Oct: string;
  Nov: string;
  Dec: string;
  Jan: string;
  Feb: string;
  Mar: string;
  nextyear: any;
  headercheckone: any;
  summarydata: any;
  qsummarydata: any;
  headercheck: any;
  pprSearchForm: FormGroup;
  branchList: Array<branchList>;
  isLoading = false;
  bsList: Array<bsList>;
  ccList: Array<ccList>;
  finyearList: Array<finyearList>;
  sectorList: Array<sectorList>;
  businessList: Array<businessList>;
  // expensegrpList:Array<expensegrpList>;
  tabcheck_ppr: boolean = true;
  tabcheck_pprbuilder: boolean = false;
  tabcheck_pprreviewer: boolean = false;
  tabcheck_pprapprover: boolean = false;
  tabcheck_pprreport: boolean = false;
  variance_analysis: boolean = false;
  cost_allocation: boolean = false
  amount_type: any;
  amountval_type: any;
  exampleModalCenter: any;
  supplierList: any;
  supplieramountList: any;
  levelsdatas: any
  levelsdatavalueexp: any;
  leveltwo: any;
  level4a: { level_id: any; finyear: any; yearterm: any; divAmount: any; branch_id: any; sectorname: any; bizname: any; bs_code: any; cc_code: any; expensegrp: any[]; };
  level4avalue: any;
  levels5adatas: any;
  levelsdatavalueoneexp: any;
  dataaexp: boolean = true;
  levelsdatavalueone: any;
  dataaexpone: boolean = true;
  aindex: any = [];
  amount: any
  levels4a2datas: any;
  levels4a3datas: any;
  finy: any;
  has_next: boolean;
  has_previous: any;
  currentpage: any;

  constructor(private errorHandler: ErrorhandlingService,private formBuilder: FormBuilder, private dataService: PprService, private shareService: SharedService, private SpinnerService: NgxSpinnerService,
    public dialog: MatDialog, private toastr: ToastrService,) { }
  PPRMenuList
  ngOnInit(): void {
    // this.SpinnerService.show();

    // let datas = this.shareService.menuUrlData;
    // datas.forEach((element) => {
    //   console.log("ele=>",element)
    //   let subModule = element.submodule;
    //   if (element.name === "PPR Report") {
    //     this.PPRMenuList = subModule;
    //     console.log("pprmenuList", this.PPRMenuList)
    //   }
    // })

    // this.SpinnerService.hide();

    this.getEmployeeList();
    this.headercheckone = false;
    this.headercheck = true;

    this.pprSearchForm = this.formBuilder.group({
      finyear: [""],
      branch_id: [""],
      year_term: [""],
      divAmount: [""],
      sectorname: [""],
      businesscontrol: [""],
      bs_id: [""],
      cc_id: [""],
      supplier_check: [""]
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
  getEmployeeList() {

    this.aa = 'hg'
    console.log(this.aa);
    if (this.startyear === undefined || this.startyear === null || this.startyear === '') {
      
      console.log("false", this.startyear)
      this.year = new Date().getFullYear().toString().substr(-2);
      this.Apr = "Apr-" + this.year;
      this.May = "May-" + this.year
      this.Jun = "Jun-" + this.year
      this.Jul = "Jul-" + this.year
      this.Aug = "Aug-" + this.year
      this.Sep = "Sep-" + this.year
      this.Oct = "Oct-" + this.year
      this.Nov = "Nov-" + this.year
      this.Dec = "Dec-" + this.year
      this.nextyear = parseInt(new Date().getFullYear().toString().substr(-2)) + 1
      this.Jan = "Jan-" + this.nextyear
      this.Feb = "Feb-" + this.nextyear
      this.Mar = "Mar-" + this.nextyear
    } else {
      console.log("true")
      this.year = new Date().getFullYear().toString().substr(-2);
      this.Apr = "Apr-" + this.startyear;
      this.May = "May-" + this.startyear
      this.Jun = "Jun-" + this.startyear
      this.Jul = "Jul-" + this.startyear
      this.Aug = "Aug-" + this.startyear
      this.Sep = "Sep-" + this.startyear
      this.Oct = "Oct-" + this.startyear
      this.Nov = "Nov-" + this.startyear
      this.Dec = "Dec-" + this.startyear
      this.nextyear = parseInt(new Date().getFullYear().toString().substr(-2)) + 1
      this.Jan = "Jan-" + this.lastyear
      this.Feb = "Feb-" + this.lastyear
      this.Mar = "Mar-" + this.lastyear
    }

  }
  // branch dropdown start
  branchname() {
    let prokeyvalue: String = "";
    this.getbranchid(prokeyvalue);
    this.pprSearchForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbranchdropdown(value, 1)
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
        for (let levelslist of this.levelslist) {

          levelslist.expanded = false
        }
        this.data4aexp = true
        this.dataaexp = true
        this.dataaexpone = true
        this.levelsdatavalueoneexp = ''
        this.levels4adatas = ''
        this.levelstwodatas = ''
        this.levelsonedatas = ''
        this.levelsdatas = ''
        this.levels5adatas = ''

      })
  }

  private getbranchid(prokeyvalue) {
    this.dataService.getbranchdropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;

      })
  }

  currentpagebra: any = 1
  has_nextbra: boolean = true
  has_previousbra: boolean = true
  autocompletebranchnameScroll() {
    this.has_nextbra = true
    this.has_previousbra = true
    this.currentpagebra = 1
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
          .subscribe(() => {
            const scrollTop = this.matAutocompletebrach.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebrach.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebrach.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true) {
                this.dataService.getbranchdropdown(this.branchContactInput.nativeElement.value, this.currentpagebra + 1)
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

  bsname_dropdown() {
    let prokeyvalue: String = "";
    this.getbsid(prokeyvalue);
    this.pprSearchForm.get('bs_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbsdropdown(this.business_id, value, 1)
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
        // this.expand=false
        this.bsclear_name.nativeElement.value = ''

      })
  }

  private getbsid(prokeyvalue) {
    this.dataService.getbsdropdown(this.business_id, prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsList = datas;

      })
  }

  cc_bs_id = 0
  currentpagebs: any = 1
  has_nextbs: boolean = true
  has_previousbs: boolean = true
  autocompletebsnameScroll() {
    this.has_nextbs = true
    this.has_previousbs = true
    this.currentpagebs = 1
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
          .subscribe(() => {
            const scrollTop = this.matAutocompletebs.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebs.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebs.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbs === true) {
                this.dataService.getbsdropdown(this.business_id, this.bsInput.nativeElement.value, this.currentpagebs + 1)
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

  selectbsSection(data) {
    this.cc_bs_id = data.id
    for (let levelslist of this.levelslist) {

      levelslist.expanded = false
    }

    this.levels4adatas = ''
    this.levelstwodatas = ''
    this.levelsonedatas = ''
    this.levelsdatas = ''
    this.levels5adatas = ''

  }

  bs_cc_clear() {
    this.pprSearchForm.controls['cc_id'].reset('')
    for (let levelslist of this.levelslist) {

      levelslist.expanded = false
    }
    this.data4aexp = true
    this.dataaexp = true
    this.dataaexpone = true
    this.levelsdatavalueoneexp = ''
    this.levels4adatas = ''
    this.levelstwodatas = ''
    this.levelsonedatas = ''
    this.levelsdatas = ''
    this.levels5adatas = ''
  }
  // bs dropdown end
  // cc dropdown start

  ccname_dropdown() {
    let prokeyvalue: String = "";
    this.getccid(prokeyvalue);
    this.pprSearchForm.get('cc_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getccdropdown(this.cc_bs_id, value, 1)
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
        for (let levelslist of this.levelslist) {

          levelslist.expanded = false
        }
        this.data4aexp = true
        this.dataaexp = true
        this.dataaexpone = true
        this.levelsdatavalueoneexp = ''
        this.levels4adatas = ''
        this.levelstwodatas = ''
        this.levelsonedatas = ''
        this.levelsdatas = ''
        this.levels5adatas = ''
      })
  }



  private getccid(prokeyvalue) {
    this.dataService.getccdropdown(this.cc_bs_id, prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccList = datas;

      })
  }

  currentpagecc: any = 1
  has_nextcc: boolean = true
  has_previouscc: boolean = true
  autocompletccnameScroll() {
    this.has_nextcc = true
    this.has_previouscc = true
    this.currentpagecc = 1
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
          .subscribe(() => {
            const scrollTop = this.matAutocompletecc.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletecc.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletecc.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcc === true) {
                this.dataService.getccdropdown(this.cc_bs_id, this.ccInput.nativeElement.value, this.currentpagecc + 1)
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
  sector_id = 0;
  startyear
  lastyear
  finyear_dropdown() {
    let prokeyvalue: String = "";
    this.getfinyear(prokeyvalue);
    this.pprSearchForm.get('finyear').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getfinyeardropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
              console.log(value.finyer)
              this.finy = value.finyer
              if (this.finy == undefined) {
                this.startyear = ''
                this.lastyear = ''
              } else {
                this.startyear = this.finy.slice(2, 4)
                this.lastyear = this.finy.slice(5, 9)
              }
              this.getEmployeeList()

              console.log("year=>", this.startyear, this.finy, this.lastyear)
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.finyearList = datas;
        for (let levelslist of this.levelslist) {

          levelslist.expanded = false
        }
        this.data4aexp = true
        this.dataaexp = true
        this.dataaexpone = true
        this.levelsdatavalueoneexp = ''
        this.levels4adatas = ''
        this.levelstwodatas = ''
        this.levelsonedatas = ''
        this.levelsdatas = ''
        this.levels5adatas = ''

      })
  }
  
  @ViewChild('fin_year')fin_yearauto:MatAutocomplete
  autocompletefinyearScroll(){
    this.has_next=true;
  this.has_previous=true;
  this.currentpage=1;
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
          .subscribe(() => {
            const scrollTop = this.fin_yearauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.fin_yearauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.fin_yearauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getbbfinyeardropdown(this.finyearInput.nativeElement.value, this.currentpage + 1)
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

  private getfinyear(prokeyvalue) {
    this.dataService.getfinyeardropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.finyearList = datas;
        console.log(this.finyearList)

      })
  }
  public displayfnfinyear(fin_year?: finyearList): string | undefined {
    return fin_year ? fin_year.finyer : undefined;

  }

  // finyear dropdown end
  // sector dropdown start

  Sector_dropdown() {
    let prokeyvalue: String = "";
    this.getsector(prokeyvalue);
    this.pprSearchForm.get('sectorname').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getsectordropdown(value, 1)
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
        this.pprSearchForm.controls['bs_id'].reset('')
        this.pprSearchForm.controls['businesscontrol'].reset('')
        this.pprSearchForm.controls['cc_id'].reset('')

      })
  }


  private getsector(prokeyvalue) {
    this.dataService.getsectordropdown(prokeyvalue, 1)
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
  public displayfnsectorname(sector_name?: sectorList): string | undefined {
    return sector_name ? sector_name.name : undefined;

  }

  selectsectorSection(name) {
    this.sector_id = name.id
  }

  secotralldata_clear() {
    this.pprSearchForm.controls['bs_id'].reset('')
    this.pprSearchForm.controls['businesscontrol'].reset('')
    this.pprSearchForm.controls['cc_id'].reset('')
    for (let levelslist of this.levelslist) {

      levelslist.expanded = false
    }
    this.data4aexp = true
    this.dataaexp = true
    this.dataaexpone = true
    this.levelsdatavalueoneexp = ''
    this.levels4adatas = ''
    this.levelstwodatas = ''
    this.levelsonedatas = ''
    this.levelsdatas = ''
    this.levels5adatas = ''

  }
  // sector dropdown end
  // business dropdown start
  Business_dropdown() {
    let prokeyvalue: String = "";
    this.getbusiness(prokeyvalue);
    this.pprSearchForm.get('businesscontrol').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbusinessdropdown(this.sector_id, value, 1)
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
  bs_clear() {
    this.pprSearchForm.controls['bs_id'].reset('')
    this.pprSearchForm.controls['cc_id'].reset('')
  }
  autocompletebusinessnameScroll() {
    this.has_nextbra =true
    this.has_previousbra =true
    this.currentpagebra =1
    setTimeout(() => {
      if (
        this.business_nameautocomplete &&
        this.autocompleteTrigger &&
        this.business_nameautocomplete.panel
      ) {
        fromEvent(this.business_nameautocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.business_nameautocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.business_nameautocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.business_nameautocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.business_nameautocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true) {
                this.dataService.getbusinessdropdown(this.sector_id,this.businessInput.nativeElement.value, this.currentpagebra + 1)
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
  business_id = 0;
  private getbusiness(prokeyvalue) {
    this.dataService.getbusinessdropdown(this.sector_id, prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businessList = datas;

      })
  }

  public displayfnbusiness(business_name?: businessList): string | undefined {
    return business_name ? business_name.name : undefined;

  }

  selectbusinessSection(data) {
    this.business_id = data.id
    this.level4avalue = ''
    this.leveltwo = ''
    this.levelone = ''
    this.levelzero = ''

    if (this.business_id == undefined) {
      this.pprSearchForm.value.bs_id = ' ';
    }

  }

  business_bs_clear() {
    this.pprSearchForm.controls['bs_id'].reset('')
    this.pprSearchForm.controls['cc_id'].reset('')

    for (let levelslist of this.levelslist) {

      levelslist.expanded = false
    }
    this.data4aexp = true
    this.dataaexp = true
    this.dataaexpone = true
    this.levelsdatavalueoneexp = ''
    this.levels4adatas = ''
    this.levelstwodatas = ''
    this.levelsonedatas = ''
    this.levelsdatas = ''
    this.levels5adatas = ''

  }
  // business dropdown end
  // expensegrp dropdown start

  Expensegrp_dropdown() {
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
        switchMap(value => this.dataService.getexpensegrpdropdown(value, 1)
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


  private getexpensegrp(prokeyvalue) {
    this.dataService.getexpensegrpdropdown(prokeyvalue, 1)
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
  type: any
  supplier_chkval: any;
  fyer: String;
  pprsearech_click(data) {

    // let search = data.finyear;
    if (data.supplier_check == true) {
      this.supplier_chkval = "Y"
    } else {
      this.supplier_chkval = "N"
    }
    if ((this.pprSearchForm.value.finyear === undefined) || (this.pprSearchForm.value.finyear === '')) {

      this.toastr.warning('', 'Please Select Finyear', { timeOut: 1500 });
      return false;
    } else {
      if (this.pprSearchForm.value.finyear.finyer == undefined) {
        this.fyer = this.pprSearchForm.value.finyear
        this.pprSearchForm.value.finyear = this.pprSearchForm.value.finyear
      } else {
        this.fyer = this.pprSearchForm.value.finyear.finyer
        this.pprSearchForm.value.finyear = this.pprSearchForm.value.finyear.finyer
      }
      // let fyer= this.pprSearchForm.value.finyear.finyer
      let myArr = this.fyer.toString().split("-");
      let a = myArr[0]
      this.Apr = "Apr-" + (parseInt(myArr[1]) - 1)
      this.May = "May-" + (parseInt(myArr[1]) - 1)
      this.Jun = "Jun-" + (parseInt(myArr[1]) - 1)
      this.Jul = "Jul-" + (parseInt(myArr[1]) - 1)
      this.Aug = "Aug-" + (parseInt(myArr[1]) - 1)
      this.Sep = "Sep-" + (parseInt(myArr[1]) - 1)
      this.Oct = "Oct-" + (parseInt(myArr[1]) - 1)
      this.Nov = "Nov-" + (parseInt(myArr[1]) - 1)
      this.Dec = "Dec-" + (parseInt(myArr[1]) - 1)
      // this.nextyear=parseInt(new Date().getFullYear().toString().substr(-2))+1
      this.Jan = "Jan-" + myArr[1]
      this.Feb = "Feb-" + myArr[1]
      this.Mar = "Mar-" + myArr[1]
    }




    if (this.pprSearchForm.value.year_term === '') {
      this.toastr.warning('', 'Please Select Quarterly or Monthly', { timeOut: 1500 });
      return false;
    }
    if (this.pprSearchForm.value.divAmount === '') {
      this.toastr.warning('', 'Please Select Amount', { timeOut: 1500 });
      return false;
    }
    if (data.year_term == 'Quarterly') {
      this.headercheck = false;
      this.type = 'Quarterly'
      this.headercheckone = true;

    }
    else if (data.year_term == 'Monthly') {
      this.type = 'Monthly'
      this.headercheckone = false;
      this.headercheck = true
    }
    if (data.divAmount == 'L') {
      this.amountval_type = 'L'
      this.amount_type = 'Amount In Lakhs'
    }
    if (data.divAmount == 'T') {
      this.amountval_type = 'K'
      this.amount_type = 'Amount In Thousands'
    }
    // "sectorname":this.pprSearchForm.value.sectorname
    if ((data.sectorname == undefined) || (data.sectorname == '')) {


      this.toastr.warning('', 'Please Select Sector', { timeOut: 1500 });
      return false;

    } else {
      let sector1_name = data.sectorname
      this.pprSearchForm.value.sectorname = this.pprSearchForm.value.sectorname.name
      if (this.pprSearchForm.value.sectorname == undefined) {
        this.pprSearchForm.value.sectorname = sector1_name
      }
    }

    if ((data.businesscontrol == undefined) || (data.businesscontrol == '')) {
      // this.toastr.warning('', 'Please Select Business', { timeOut: 1500 });
      // return false;
      this.pprSearchForm.value.masterbusinesssegment_name = ''
    }
    else {
      this.pprSearchForm.value.masterbusinesssegment_name = this.pprSearchForm.value.businesscontrol.name
    }
    if ((data.bs_id == undefined) || (data.bs_id == '')) {
      this.pprSearchForm.value.bs_name = ''
    } else {
      this.pprSearchForm.value.bs_name = this.pprSearchForm.value.bs_id.name
    }
    if ((data.cc_id == undefined) || (data.cc_id == '')) {
      this.pprSearchForm.value.cc_name = ''
    } else {
      this.pprSearchForm.value.cc_name = this.pprSearchForm.value.cc_id.name
    }
    if (this.chipSelectedprodid.length == 0) {
      this.pprSearchForm.value.expensegrp_name_arr = ''
    } else {
      this.pprSearchForm.value.expensegrp_name_arr = this.chipSelectedprodid
    }

    // this.pprSearchForm.value.sectorname=this.pprSearchForm.value.sectorname
    if ((data.branch_id == undefined) || (data.branch_id == '')) {
      this.pprSearchForm.value.branch_id = ''
    } else {
      this.pprSearchForm.value.branch_id = this.pprSearchForm.value.branch_id.id
    }
    this.SpinnerService.show();
    this.dataService.getPprsummary(this.pprSearchForm.value)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        if (this.type == 'Quarterly') {
          for (let i = 0; i < datas.length; i++) {
            datas['tree_flag'] = 'Y'
          }
          this.summarydata = datas;
        }
        if (this.type == 'Monthly') {
          for (let i = 0; i < datas.length; i++) {
            datas[i]['tree_flag'] = 'Y'

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
  data_input: any;
  tabvales: any;
  masterbusinesssegment_name_params: any;
  tabcheck_supplier: boolean = true;
  tabcheck_ccbs: boolean = false;
  tabcheck_ecf: boolean = false;

  treelevel_click(ind, data, data1) {
    let a = []
    let a2 = ind + 1
    if (data.tree_flag == 'N') {
      if (data.Padding_left == '10px') {
        for (let i = a2; i < data1.length; i++) {
          let a1 = data1[i]
          a.push(i)
          if (a1.Padding_left == '10px') { break; }
          console.log("Block statement execution no." + i);
        }
      }
      if (data.Padding_left == '50px') {
        for (let i = a2; i < data1.length; i++) {
          let a1 = data1[i]
          a.push(i)
          if ((a1.Padding_left == '50px') || (a1.Padding_left == '10px')) { break; }
          console.log("Block statement execution no." + i);
        }
      }
      if (data.Padding_left == '100px') {
        for (let i = a2; i < data1.length; i++) {
          let a1 = data1[i]
          a.push(i)
          if ((a1.Padding_left == '100px') || (a1.Padding_left == '50px')) { break; }
          console.log("Block statement execution no." + i);
        }
        a.pop()

      }

      const indexSet = new Set(a);

      const arrayWithValuesRemoved = data1.filter((value, i) => !indexSet.has(i));
      arrayWithValuesRemoved[ind].tree_flag = 'Y'
      this.summarydata = arrayWithValuesRemoved;
      console.log(arrayWithValuesRemoved);
    } else {

      if (data.Padding_left == '10px') {
        if (this.pprSearchForm.value.masterbusinesssegment_name == undefined) {
          this.masterbusinesssegment_name_params = ""
        } else {
          this.masterbusinesssegment_name_params = this.pprSearchForm.value.masterbusinesssegment_name
        }
        let input_params = {

          "branch_id": this.pprSearchForm.value.branch_id,
          "finyear": this.pprSearchForm.value.finyear,
          "year_term": this.type,
          "divAmount": this.amountval_type,
          "sectorname": this.pprSearchForm.value.sectorname,
          "masterbusinesssegment_name": this.masterbusinesssegment_name_params,
          "bs_name": this.pprSearchForm.value.bs_name,
          "cc_name": this.pprSearchForm.value.cc_name,
          "expensegrp_name_arr": data.name
        }
        this.new_expense_list(ind, input_params, data1, 1)

      }
      if ((data.Padding_left == '100px') && (this.supplier_chkval == 'Y')) {
        if (this.pprSearchForm.value.masterbusinesssegment_name == undefined) {
          this.masterbusinesssegment_name_params = ""
        } else {
          this.masterbusinesssegment_name_params = this.pprSearchForm.value.masterbusinesssegment_name
        }
        let input_params = {
          "divAmount": this.amountval_type,
          "apexpense_id": data.expense_id,
          "apsubcat_id": data.subcat_id,
          "masterbusinesssegment_name": this.pprSearchForm.value.masterbusinesssegment_name,
          "sectorname": this.pprSearchForm.value.sectorname,
          "yearterm": this.type,
          "finyear": this.pprSearchForm.value.finyear,
          "bs_name": this.pprSearchForm.value.bs_name,
          "cc_name": this.pprSearchForm.value.cc_name,
        }
        this.getsupplieramountdetails(ind, input_params, data1);

      }
      if (data.Padding_left == '50px') {
        if (this.pprSearchForm.value.masterbusinesssegment_name == undefined) {
          this.masterbusinesssegment_name_params = ""
        } else {
          this.masterbusinesssegment_name_params = this.pprSearchForm.value.masterbusinesssegment_name
        }
        let input_params = {
          "branch_id": this.pprSearchForm.value.branch_id,
          "finyear": this.pprSearchForm.value.finyear,
          "year_term": this.type,
          "divAmount": this.amountval_type,
          "sectorname": this.pprSearchForm.value.sectorname,
          "masterbusinesssegment_name": this.masterbusinesssegment_name_params,
          "bs_name": this.pprSearchForm.value.bs_name,
          "cc_name": this.pprSearchForm.value.cc_name,
          "expense_id": data.expense_id
        }
        this.new_subcat_list(ind, input_params, data1)
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
  has_next_expence = true;
  has_previous_expence = true;
  currentpage_expence: number = 1;
  presentpage_expence: number = 1;
  index_expense: any;
  private new_expense_list(ind, data, data1, pageNumber) {
    this.index_expense = ind + 1
    this.SpinnerService.show()

    this.dataService.new_expense_list(data, pageNumber)
      .subscribe((results: any[]) => {
    this.SpinnerService.hide()

        let datas = results["data"];

        if (datas.length == 0) {
          this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        } else {

          for (var val of datas) {
            let a = data

            data1.splice(this.index_expense, 0, val);
            this.index_expense = this.index_expense + 1
          }
          data1[ind].tree_flag = 'N'
          this.summarydata = data1
          this.supplierList = datas;
        }


      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  index_subcat: any;
  private new_subcat_list(ind, data, data1) {
    this.index_subcat = ind + 1
    this.SpinnerService.show()

    this.dataService.new_subcat_list(data)
      .subscribe((results: any[]) => {
    this.SpinnerService.hide()

        let datas = results["data"];
        if (datas.length == 0) {
          this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        } else {

          for (var val of datas) {
            let a = data
            data1.splice(this.index_subcat, 0, val);
            this.index_subcat = this.index_subcat + 1
          }
          data1[ind].tree_flag = 'N'
          this.summarydata = data1
          this.supplierList = datas;
        }


      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  tranmonth_cunt: any
  qtr_cnt: any
  openpopup_fn(data, templateRef, tmonth, quarter) {
    this.tabcheck_supplier = true;
    this.tabcheck_ccbs = false;
    this.tabcheck_ecf = false;
    this.tranmonth_cunt = tmonth
    this.qtr_cnt = quarter
    this.data_input = {
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
      "finyear": this.pprSearchForm.value.finyear,
      "bs_name": this.pprSearchForm.value.bs_name,
      "cc_name": this.pprSearchForm.value.cc_name,
      "divAmount": this.amountval_type,
    }
    this.getsupplierdetails(this.data_input);
    this.dialogRef = this.dialog.open(templateRef, {
      width: '100%',
      height: '100%'
    });
    this.dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
    });
  }
  closedialog(): void {
    this.dialogRef.close();
  }


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
  closedialog_supplier(): void {
    this.dialogRef.close();
  }


  popuptab_click(data) {
    this.tabvales = data;
    if (this.tabvales == 'supplier') {
      this.tabcheck_supplier = true;
      this.tabcheck_ccbs = false;
      this.tabcheck_ecf = false;
    }
    if (this.tabvales == 'ccbs') {
      this.tabcheck_supplier = false;
      this.tabcheck_ccbs = true;
      this.tabcheck_ecf = false
    }
    if (this.tabvales == 'ccbs') {
      this.getccbsdetails(this.data_input)

    }

  }

  ecf_show(supplier_obj) {

    let input_ecf = {
      "apexpense_id": supplier_obj.apexpense_id,
      "apsubcat_id": supplier_obj.apsubcat_id,
      "apinvoicesupplier_id": supplier_obj.supplier_id,
      "apinvoicebranch_id": this.pprSearchForm.value.branch_id,
      "transactionmonth": this.tranmonth_cunt,
      "quarter": this.qtr_cnt,
      "masterbusinesssegment_name": this.pprSearchForm.value.masterbusinesssegment_name,
      "sectorname": this.pprSearchForm.value.sectorname,
      "yearterm": this.type,
      "divAmount": this.amountval_type,
      "finyear": this.pprSearchForm.value.finyear,
      "bs_name": this.pprSearchForm.value.bs_name,
      "cc_name": this.pprSearchForm.value.cc_name
    }
    this.tabcheck_ecf = true
    this.getecfdetails(input_ecf)
  }
  // suppliergetapi start

  private getsupplierdetails(data) {

    this.dataService.getsupplierdetails(data)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;


      })
  }
  supplierccbsList: any;
  private getccbsdetails(data,pageNumber=1,pageSize=10) {

    this.dataService.getccbsdetails(data,pageNumber,pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierccbsList = datas;


      })
  }
  supplierecfList: any;
  private getecfdetails(data) {

    this.dataService.getecfdetails(data)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierecfList = datas;


      })
  }

  private getsupplieramountdetails(ind, data, data1) {
    this.SpinnerService.show()

    this.dataService.getsupplieramountdetails(data)
      .subscribe((results: any[]) => {
    this.SpinnerService.hide()

        let datas = results["data"];
        if (datas.length == 0) {
          this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        } else {

          for (var val of datas) {
            let a = data
            data1.splice(ind + 1, 0, val);

          }
          data1[ind].tree_flag = 'N'
          this.summarydata = data1
          this.supplierList = datas;
        }


      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  // suppliergetapi end

  clear_budgetdata() {
    this.chipSelectedprod = []
    this.chipSelectedprodid = []
    this.expInput.nativeElement.value = '';
    this.pprSearchForm.reset();
    this.pprSearchForm.controls['finyear'].reset('')
    this.pprSearchForm.controls['year_term'].reset('')
    this.pprSearchForm.controls['divAmount'].reset('')
    this.pprSearchForm.controls['branch_id'].reset('')
    this.pprSearchForm.controls['sectorname'].reset('')
    this.pprSearchForm.controls['businesscontrol'].reset('')
    this.pprSearchForm.controls['bs_id'].reset('')
    this.pprSearchForm.controls['cc_id'].reset('')
    // this.pprSearchForm.reset()
    // this.levelslist
    for (let levelslist of this.levelslist) {
      levelslist.expanded = false
    }
    this.data4aexp = true
    this.dataaexp = true
    this.dataaexpone = true
    this.levelsdatavalueoneexp = ''
    this.levels4adatas = ''
    this.levelstwodatas = ''
    this.levelsonedatas = ''
    this.levelsdatas = ''
    this.levels5adatas = ''

    this.chipSelectedprodid = []
    this.summarydata = []
    this.qsummarydata = []
    this.expenseList = []
    this.amount_type = ''


  }

  pprsubModuleData(data) {
    console.log("data=>", data)
    if (data.name == 'Budget Builder') {
      this.tabcheck_ppr = false;
      this.tabcheck_pprreport = false;
      this.tabcheck_pprbuilder = true;
      this.tabcheck_pprreviewer = false;
      this.variance_analysis = false
      this.cost_allocation = false
    }
    if (data.name == 'Budget Reviewer') {
      this.tabcheck_pprreviewer = true;
      this.tabcheck_pprreport = false;
      this.tabcheck_ppr = false
      this.tabcheck_pprbuilder = false
      this.variance_analysis = false
      this.cost_allocation = false
    }
    if (data.name == 'PPR Report') {
      this.tabcheck_pprreviewer = false;
      this.tabcheck_pprreport = false;
      this.tabcheck_ppr = false
      this.tabcheck_pprbuilder = false
      this.variance_analysis = false
      this.cost_allocation = false
    }
    // Variance Analysis
    if (data.name == 'Variance Analysis') {
      this.tabcheck_pprreviewer = false;
      this.tabcheck_pprreport = false;
      this.tabcheck_ppr = false
      this.tabcheck_pprbuilder = false
      this.variance_analysis = true
      this.cost_allocation = false
    }
    // cost_allocation
    if (data.name == 'Cost Allocation') {
      this.tabcheck_pprreviewer = false;
      this.tabcheck_pprreport = false;
      this.tabcheck_ppr = false
      this.tabcheck_pprbuilder = false
      this.variance_analysis = false
      this.cost_allocation = true
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
    console.log('event.option.value', event.option.value)
    this.selectprodByName(event.option.value.name);
    this.expInput.nativeElement.value = '';
    console.log('chipSelectedprodid', this.chipSelectedprodid)
  }
  private selectprodByName(prod) {
    let foundprod1 = this.chipSelectedprod.filter(pro => pro.name == prod);
    if (foundprod1.length) {
      return;
    }
    let foundprod = this.expenseList.filter(pro => pro.name == prod);
    if (foundprod.length) {
      this.chipSelectedprod.push(foundprod[0]);
      // this.chipSelectedprodid.push(foundprod[0].id)
      this.chipSelectedprodid.push(foundprod[0].name)
    }
  }

  levelslist = [
    { name: "Level 0-Income", expanded: false },
    { name: "Level 1-HR Cost", expanded: false },
    { name: "Level 2", expanded: false },
    { name: "Level 3", expanded: false },
    { name: "Level 4.A.1-Rentals", expanded: false },
    { name: "Level 4.A.2-Electricity", extends: false },
    { name: "Level 4.A.3-Security", extends: false },
    { name: "Level 4(B)-Technology", expanded: false }
  ]
  list: any[] = []
  expand: boolean
  levelone
  expant_level(i, level) {

    this.expand = level.expanded
    console.log("expand=>", this.type)
    if ((this.pprSearchForm.value.finyear === undefined) || (this.pprSearchForm.value.finyear === '')) {

      this.toastr.warning('', 'Please Select Finyear', { timeOut: 1500 });
      return false;
    }else{
      // this.pprSearchForm.value.finyear.finyer='FY22-23'
    }
    if (this.pprSearchForm.value.year_term === '') {
      this.toastr.warning('', 'Please Select Quarterly or Monthly', { timeOut: 1500 });
      return false;
    }
    if (this.pprSearchForm.value.divAmount === '') {
      this.toastr.warning('', 'Please Select Amount', { timeOut: 1500 });
      return false;
    }
    if ((this.pprSearchForm.value.sectorname == undefined) || (this.pprSearchForm.value.sectorname == '')) {


      this.toastr.warning('', 'Please Select Sector', { timeOut: 1500 });
      return false;

    }
    // if ((this.pprSearchForm.value.businesscontrol == undefined) || (this.pprSearchForm.value.businesscontrol == '')) {
    //   this.toastr.warning('', 'Please Select Business', { timeOut: 1500 });
    //   return false;

    // }
    var levelzero
    // var levelone
    var leveltwo

    if (i == 0) {
      levelzero = {
        level_id: i + 1,
        finyear: this.pprSearchForm.value.finyear.finyer,
        yearterm: this.pprSearchForm.value.year_term,
        divAmount: this.pprSearchForm.value.divAmount,
        branch_id: this.pprSearchForm.value.branch_id.id,
        sectorname: this.pprSearchForm.value.sectorname.name,
        bizname: this.pprSearchForm.value.businesscontrol.name,
        bs_code: this.pprSearchForm.value.bs_id.id,
        cc_code: this.pprSearchForm.value.cc_id.id,
        expensegrp: []
      }
      console.log("summarydata=>", levelzero)
      console.log(this.levelslist)
    this.SpinnerService.show()
      
      this.dataService.getdata_level(levelzero).pipe(
        debounceTime(450)
      )
        .subscribe((results: any[]) => {
    this.SpinnerService.hide()

          this.dataaexp = true
          this.levelsdatas = results['data']

          console.log(results)
          if (results['data'].length == 0) {
            this.toastr.warning('', 'No Data Found', { timeOut: 1500 });

          }
          for (let level of this.levelsdatas) {
            level['title'] = "Expense Group"
          }
          // this.levelshow=false
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
      // this.levelval()
      // this.levedisplay()
      console.log("data zero")
      // this.levelshow=false
    }
    if (i == 1) {
      var levelone = {
        level_id: i + 2,
        finyear: this.pprSearchForm.value.finyear.finyer,
        yearterm: this.pprSearchForm.value.year_term,
        divAmount: this.pprSearchForm.value.divAmount,
        branch_id: this.pprSearchForm.value.branch_id.id,
        sectorname: this.pprSearchForm.value.sectorname.name,
        bizname: this.pprSearchForm.value.businesscontrol.name,
        bs_code: this.pprSearchForm.value.bs_id.id,
        cc_code: this.pprSearchForm.value.cc_id.id,
        expensegrp: []
      }
      console.log("level",this.levelsonedatas)
      if(this.expand==false){
    this.SpinnerService.show()
        
        this.dataService.getdata_level(levelone)
        .subscribe((results: any[]) => {
    this.SpinnerService.hide()

          this.levelsonedatas = results['data']
          console.log(results)
          // this.leveloneshow = false
          if (results['data'].length == 0) {
            this.toastr.warning('', 'No Data Found', { timeOut: 1500 });

          }
          for (let indexlevel of this.levelsonedatas) {
            indexlevel['title'] = "Expense Group"
          }
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
        console.log("expance")
      }
      else{
        this.levelsonedatas=[]
        console.log("close")
      }
     
      console.log("one")

    }
    if (i == 2) {
      console.log("two")

      leveltwo = {
        level_id: i,
        finyear: this.pprSearchForm.value.finyear.finyer,
        yearterm: this.pprSearchForm.value.year_term,
        divAmount: this.pprSearchForm.value.divAmount,
        branch_id: this.pprSearchForm.value.branch_id.id,
        sectorname: this.pprSearchForm.value.sectorname.name,
        bizname: this.pprSearchForm.value.businesscontrol.name,
        bs_code: this.pprSearchForm.value.bs_id.id,
        cc_code: this.pprSearchForm.value.cc_id.id,
        expensegrp: []
      }
      if(this.expand==false){

      console.log("leveltwo=>", leveltwo)
    this.SpinnerService.show()

      this.dataService.getdata_level(leveltwo)
        .subscribe((results: any[]) => {
    this.SpinnerService.hide()

          this.levelstwodatas = results['data']
          console.log(results)
          if (results['data'].length == 0) {
            this.toastr.warning('', 'No Data Found', { timeOut: 1500 });

          }
          // this.leveltwoshow = false
          for (let levelstwodatas of this.levelstwodatas) {
            levelstwodatas['title'] = "Expense Group"
          }
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
      }else{
        this.levelstwodatas=[]
      }
      console.log("this.levelstwodatas=>", this.levelstwodatas)
    }
    if (i == 4) {
      this.data4aexp = true
      var level4avalue = {
        level_id: i,
        finyear: this.pprSearchForm.value.finyear.finyer,
        yearterm: this.pprSearchForm.value.year_term,
        divAmount: this.pprSearchForm.value.divAmount,
        branch_id: this.pprSearchForm.value.branch_id.id,
        sectorname: this.pprSearchForm.value.sectorname.name,
        bizname: this.pprSearchForm.value.businesscontrol.name,
        bs_code: this.pprSearchForm.value.bs_id.id,
        cc_code: this.pprSearchForm.value.cc_id.id,
        expensegrp: []
      }
      if(this.expand==false){
        this.SpinnerService.show()

      this.dataService.getdata_level4(level4avalue)
        .subscribe((results: any[]) => {
    this.SpinnerService.hide()

          this.levels4adatas = results['data']

          console.log(results)
          // this.level4ashow = false
          if (results['data'].length == 0) {
            this.toastr.warning('', 'No Data Found', { timeOut: 1500 });

          }
          for (let levels4adatas of this.levels4adatas) {
            levels4adatas['title'] = "Expense Group"
          }
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
      }else{
        this.levels4adatas=[]
      }
      // this.leve4adisplay()
    }
    if (i == 5) {
      this.data4aexp = true
      var level4avalue = {
        level_id: i,
        finyear: this.pprSearchForm.value.finyear.finyer,
        yearterm: this.pprSearchForm.value.year_term,
        divAmount: this.pprSearchForm.value.divAmount,
        branch_id: this.pprSearchForm.value.branch_id.id,
        sectorname: this.pprSearchForm.value.sectorname.name,
        bizname: this.pprSearchForm.value.businesscontrol.name,
        bs_code: this.pprSearchForm.value.bs_id.id,
        cc_code: this.pprSearchForm.value.cc_id.id,
        expensegrp: []
      }
      // this.dataService.getdata_level(level4avalue)
      //   .subscribe((results: any[]) => {
      //     this.levels4a2datas = results['data']

      //     console.log(results)
      //     // this.level4ashow = false
      //     if (results['data'].length == 0) {
      //       this.toastr.warning('', 'No Data Found', { timeOut: 1500 });

      //     }
      //     for(let levels4adatas of this.levels4adatas){
      //       levels4adatas['title']="Expense Group"
      //     }
      //   })

      // this.leve4adisplay()
    }
    if (i == 6) {
      var level4a3value = {
        level_id: 5,
        finyear: this.pprSearchForm.value.finyear.finyer,
        yearterm: this.pprSearchForm.value.year_term,
        divAmount: this.pprSearchForm.value.divAmount,
        branch_id: this.pprSearchForm.value.branch_id.id,
        sectorname: this.pprSearchForm.value.sectorname.name,
        bizname: this.pprSearchForm.value.businesscontrol.name,
        bs_code: this.pprSearchForm.value.bs_id.id,
        cc_code: this.pprSearchForm.value.cc_id.id,
        expensegrp: []
      }
      if(this.expand==false){
        this.SpinnerService.show()

      this.dataService.getdata_level4(level4a3value)
        .subscribe((results: any[]) => {
    this.SpinnerService.hide()

          this.levels4a3datas = results['data']


          console.log(results)

          if (results['data'].length == 0) {
            this.toastr.warning('', 'No Data Found', { timeOut: 1500 });

          }
          for (let levels4a3datas of this.levels4a3datas) {
            levels4a3datas['title'] = "Expense Group"
          }
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
      }
      else{
        this.levels4a3datas=[]
      }
    }
    if (i == 7) {
      var level5avalue = {
        level_id: i,
        finyear: this.pprSearchForm.value.finyear.finyer,
        yearterm: this.pprSearchForm.value.year_term,
        divAmount: this.pprSearchForm.value.divAmount,
        branch_id: this.pprSearchForm.value.branch_id.id,
        sectorname: this.pprSearchForm.value.sectorname.name,
        bizname: this.pprSearchForm.value.businesscontrol.name,
        bs_code: this.pprSearchForm.value.bs_id.id,
        cc_code: this.pprSearchForm.value.cc_id.id,
        expensegrp: []
      }
      if(this.expand==false){
        this.SpinnerService.show()

      this.dataService.getdata_level(level5avalue)
        .subscribe((results: any[]) => {
    this.SpinnerService.hide()

          this.levels5adatas = results['data']


          console.log(results)

          if (results['data'].length == 0) {
            this.toastr.warning('', 'No Data Found', { timeOut: 1500 });

          }
          for (let levels5adatas of this.levels5adatas) {
            levels5adatas['title'] = "Expense Group"
          }
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    }
    else{
      this.levels5adatas=[]
    }
  }
  if(this.type=='Monthly'){
    console.log("type=>",this.type)
    this.headercheckone = false;
    this.headercheck = true
  }
  else{
    console.log("type else=>",this.type)
    
    this.headercheckone = true;
    this.headercheck = false
  }
  }
 


  levelzero: any
  expance:boolean=true


  levelsonedatas: any


  levelstwodatas: any


  levelsthreedatas: any


  levels4adatas: any

  data4aexp = true
  title: any
  treelevelsDatas(level_index, ind, leveldata, levelsonedatas) {
    let a = []
    let a2 = ind + 1
    if (leveldata.tree_flag == 'N') {

      if (leveldata.Padding_left == '50px') {
        for (let i = a2; i < levelsonedatas.length; i++) {
          let a1 = levelsonedatas[i]
          if (levelsonedatas[i].title == "Expense" || levelsonedatas[i].title == "Main Category" || levelsonedatas[i].title == "Sub Category") {
            a.push(i)

          }
          if ((a1.Padding_left == '50px') || (a1.Padding_left == '10px')) { break; }
          console.log("Block statement execution no." + i);
        }
      }
      if (leveldata.Padding_left == '100px') {
        for (let i = a2; i < levelsonedatas.length; i++) {
          let a1 = levelsonedatas[i]
          if (levelsonedatas[i].title == "Main Category" || levelsonedatas[i].title == "Sub Category") {
            a.push(i)

          }
          console.log("i value=>", i)
          // a.push(i) 
          console.log("a value=>", a)
          if ((a1.Padding_left == '100px') || (a1.Padding_left == '50px') || (a1.Padding_left == '10px')) { break; }
          console.log("Block statement execution no." + i);
        }
      }
      if (leveldata.Padding_left == '150px') {
        for (let i = a2; i < levelsonedatas.length; i++) {
          let a1 = levelsonedatas[i]
          // a.push(i) 
          if (levelsonedatas[i].title == "Sub Category") {
            a.push(i)

          }
          if ((a1.Padding_left == '150px') || (a1.Padding_left == '150px') || (a1.Padding_left == '50px') || (a1.Padding_left == '10px')) { break; }
          console.log("Block statement execution no." + i);
        }
      }
      // a.pop()


      console.log("a val=>", a)
      const indexSet = new Set(a);



      // a.pop()

      if (level_index == 0) {
        
        const arrayWithValuesRemoved = levelsonedatas.filter((value, v) => !a.includes(v));
        arrayWithValuesRemoved[ind].tree_flag = 'Y'

        this.levelsdatas = arrayWithValuesRemoved;

        // this.levelsdatas = arrayWithValuesRemoved;


      }
      if (level_index == 1) {
        // a.pop()

        const arrayWithValuesRemoved = levelsonedatas.filter((value, v) => !a.includes(v));
        arrayWithValuesRemoved[ind].tree_flag = 'Y'
        console.log("index", indexSet)

        this.levelsonedatas = arrayWithValuesRemoved;
        console.log("arrayWithValuesRemoved", arrayWithValuesRemoved)

      }
      if (level_index == 2) {

        const arrayWithValuesRemoved = levelsonedatas.filter((value, i) => !indexSet.has(i));
        arrayWithValuesRemoved[ind].tree_flag = 'Y'

        this.levelstwodatas = arrayWithValuesRemoved;


      }
      if (level_index == 4) {
        const arrayWithValuesRemoved = levelsonedatas.filter((value, i) => !indexSet.has(i));
        arrayWithValuesRemoved[ind].tree_flag = 'Y'

        this.levels4adatas = arrayWithValuesRemoved;

      }
      if (level_index == 6) {
        const arrayWithValuesRemoved = levelsonedatas.filter((value, i) => !indexSet.has(i));
        arrayWithValuesRemoved[ind].tree_flag = 'Y'

        this.levels4a3datas = arrayWithValuesRemoved;

      }
      // console.log(arrayWithValuesRemoved);
    } else {

      if (leveldata.Padding_left == '50px') {
        
        let alldatas=levelsonedatas

        console.log("data=->",alldatas)
        // console.log(levelsonedatas,leveldata,i)
        var level4a = {
          branch_id: this.pprSearchForm.value.branch_id.id,
          bs_code: this.pprSearchForm.value.bs_id.id,
          cc_code: this.pprSearchForm.value.cc_id.id,
          level_id: leveldata.level_id,
          expense_id: leveldata.expense_id,
          divAmount: this.pprSearchForm.value.divAmount,
          expensegrp_individual: leveldata.name,
          finyear: this.pprSearchForm.value.finyear.finyer,
          bizname: this.pprSearchForm.value.businesscontrol.name,
          sectorname: this.pprSearchForm.value.sectorname.name,
          yearterm: this.pprSearchForm.value.year_term
        }

        // console.log(this.dataaexpone)
        // if(this.dataaexpone===true){


        // let e=j+1
        console.log("expant=>",leveldata.re)
        if(leveldata.re==undefined){
          console.log("true")
        }else{
          console.log("false  ")
        }
    this.SpinnerService.show()

        this.dataService.expense_list(level4a, 1)
          .subscribe((results: any[]) => {
    
            this.SpinnerService.hide()

            if (results.length != 0) {
              this.expance = false
              levelsonedatas[ind].tree_flag = 'N'
              this.levelsdatavalueone = results['data']

              for (let re of this.levelsdatavalueone) {
                re['title'] = "Expense"
                alldatas.splice(ind + 1, 0, re);

              
                // console.log("add=>",i+1)
                // this.levelsdatavalueone.push({title:'expance group'})

                // this.aindex.push(i+1)
                // i+1
              }
              let datasValue = alldatas.filter((value, index, array) =>
              !array.filter((v, i) => JSON.stringify(value['expense_id']) == JSON.stringify(v['expense_id']) && value.Padding_left == "100px" && i < index).length);
            console.log("outlook=>", datasValue)
              // this.summarydata = datasValue
  
                  levelsonedatas=datasValue
                  console.log(levelsonedatas)
              // this.title="expance group"

            }
            if (results['data'].length == 0) {
              this.toastr.warning('', 'No Data Found', { timeOut: 1500 });

            }
          }, error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          })

        




        console.log("leveldata", this.levelsonedatas)
      }
      if ((leveldata.Padding_left == '100px')) {
        console.log("cat")
        this.levelscategory(level_index, ind, leveldata, levelsonedatas)

      }
      if (leveldata.Padding_left == '150px') {
        console.log("sub_cat")
        this.levelssubcat(level_index, ind, leveldata, levelsonedatas)
      }
    }

  }

  levelssubcat(level_index, levelexp_index, leveldata, levelsonedatas) {
    var sub_category = {

      branch_id: this.pprSearchForm.value.branch_id.id,
      bs_code: this.pprSearchForm.value.bs_id.id,
      cc_code: this.pprSearchForm.value.cc_id.id,
      level_id: leveldata.level_id,
      expense_id: leveldata.expense_id,
      divAmount: this.pprSearchForm.value.divAmount,
      finyear: this.pprSearchForm.value.finyear.finyer,
      bizname: this.pprSearchForm.value.businesscontrol.name,
      sectorname: this.pprSearchForm.value.sectorname.name,
      yearterm: this.pprSearchForm.value.year_term,
      cat_id: leveldata.cat_id

    }
    // let sub_category={
    //   "finyear": "FY20-21",
    //   "yearterm": "Monthly",
    //   "divAmount": "L",
    //   "branch_id": "",
    //   "sectorname": this.pprSearchForm.value.sectorname,
    //   "bizname": "",
    //   "bs_code": "",
    //   "cc_code": "",
    //   "level_id":2,
    //   "expense_id":56,
    //   "cat_id":56
    // }
    this.SpinnerService.show()

    this.dataService.subexpense_list(sub_category, 1)
      .subscribe((results: any[]) => {
    this.SpinnerService.hide()

        console.log("res=>", results)
        this.dataaexpone = false
        levelsonedatas[levelexp_index].tree_flag = 'N'
        let levelsdatavalue
        levelsdatavalue = results['data']
        if (results['data'].length == 0) {
          this.toastr.warning('', 'No Data Found', { timeOut: 1500 });

        }
        console.log("level=>", levelsdatavalue)
        for (let re of levelsdatavalue) {
          levelsonedatas.splice(levelexp_index + 1, 0, re);
          re['title'] = "Sub Category"

          // this.aindex.push(levelexp_index+1)

        }

        console.log(results)
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    console.log("final data", levelsonedatas)
  }

  levelscategory(i, expand_index, leveldata, levelsonedatas) {
    console.log("sub cat")
    var cat_json = {
      branch_id: this.pprSearchForm.value.branch_id.id,
      bs_code: this.pprSearchForm.value.bs_id.id,
      cc_code: this.pprSearchForm.value.cc_id.id,
      level_id: leveldata.level_id,
      expense_id: leveldata.expense_id,
      divAmount: this.pprSearchForm.value.divAmount,
      finyear: this.pprSearchForm.value.finyear.finyer,
      bizname: this.pprSearchForm.value.businesscontrol.name,
      sectorname: this.pprSearchForm.value.sectorname.name,
      yearterm: this.pprSearchForm.value.year_term
    }
    console.log("cat=>", cat_json)
    // var cat_json={
    //   "finyear": "FY20-21",
    //   "yearterm": "Monthly",
    //   "divAmount": "L",
    //   "branch_id": "",
    //   "sectorname": this.pprSearchForm.value.sectorname,
    //   "bizname": "",
    //   "bs_code": "",
    //   "cc_code": "",
    //   "level_id":2,
    //   "expense_id":56
    // }
   
    this.SpinnerService.show()

    this.dataService.category_list(cat_json, 1)
      .subscribe((results: any[]) => {
    this.SpinnerService.hide()

        if (results.length != 0) {
          this.dataaexpone = false
          levelsonedatas[expand_index].tree_flag = 'N'
          let levelsdatavalueone
          levelsdatavalueone = results['data']

          for (let re of levelsdatavalueone) {
            
            re['title'] = "Main Category"
            levelsonedatas.splice(expand_index + 1, 0, re);
            // this.aindex.push(i+1)

          }
          this.title = "expance "

          if (results['data'].length == 0) {
            this.toastr.warning('', 'No Data Found', { timeOut: 1500 });

          }
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    console.log("levelsonedatas=>", levelsonedatas)
  }



  level4bshow: boolean = true
  levels4bdatas: any

  Quarterly() {
    this.headercheck = false;
    this.type = 'Quarterly'
    this.headercheckone = true;
    for (let levelslist of this.levelslist) {

      levelslist.expanded = false
    }
    this.data4aexp = true
    this.dataaexp = true
    this.dataaexpone = true
    this.levelsdatavalueoneexp = ''
    this.levels4adatas = ''
    this.levelstwodatas = ''
    this.levelsonedatas = ''
    this.levelsdatas = ''
  }
  Monthly() {
    this.type = 'Monthly'
    this.headercheckone = false;
    this.headercheck = true
    for (let levelslist of this.levelslist) {

      levelslist.expanded = false
    }
    this.data4aexp = true
    this.dataaexp = true
    this.dataaexpone = true
    this.levelsdatavalueoneexp = ''
    this.levels4adatas = ''
    this.levelstwodatas = ''
    this.levelsonedatas = ''
    this.levelsdatas = ''
  }
  lakhs() {
    this.amount_type = "Amount In Lakhs"
    for (let levelslist of this.levelslist) {

      levelslist.expanded = false
    }
    this.data4aexp = true
    this.dataaexp = true
    this.dataaexpone = true
    this.levelsdatavalueoneexp = ''
    this.levels4adatas = ''
    this.levelstwodatas = ''
    this.levelsonedatas = ''
    this.levelsdatas = ''
  }
  thousands() {
    this.amount_type = "Amount In Thousands"
    for (let levelslist of this.levelslist) {

      levelslist.expanded = false
    }
    this.data4aexp = true
    this.dataaexp = true
    this.dataaexpone = true
    this.levelsdatavalueoneexp = ''
    this.levels4adatas = ''
    this.levelstwodatas = ''
    this.levelsonedatas = ''
    this.levelsdatas = ''
  }
}

export interface expenseListss {
  id: string;
  name: any;
}