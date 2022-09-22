import { ChangeDetectorRef, Component, ElementRef, HostBinding, Input, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName, NgControl } from '@angular/forms';
import { PprService } from '../ppr.service';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { fromEvent, Observable, Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';
import { ErrorhandlingService } from '../errorhandling.service';

export interface finyearList {
  finyear: string
}
export interface branchList {
  id: number
  name: string
}
export interface sectorList {
  id: number
  name: string
}
export interface businessList {
  id: number
  name: string
}
export interface approverList {
  id: number
  full_name: string
}
export interface bsList {
  id: number
  name: string
}
export interface ccList {
  id: number
  name: string
}
export interface suplier {
  id: number
  supplier_name: string
}
export interface expensegrpList {
  id: number
  name: string
}
export interface iDeptList {
  name: string;
  id: number;
}
export interface expenseListss {
  id: string;
  name: any;
}
export class ItemList {
  constructor(public item: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}

@Component({
  selector: 'app-budget-builder-approve',
  templateUrl: './budget-builder-approve.component.html',
  styleUrls: ['./budget-builder-approve.component.scss']
})
export class BudgetBuilderApproveComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  // branch dropdown
  @ViewChild('branchContactInput') branchContactInput: any;
  @ViewChild('branch') matAutocompletebrach: MatAutocomplete;
  //bs
  // businessInput
  @ViewChild('businessInput') businessInput: any
  @ViewChild('business_name') business_nameautocomplete: MatAutocomplete;
  @ViewChild('bsInput') bsInput: any;
  @ViewChild('bs') matAutocompletebs: MatAutocomplete;
  //cc
  @ViewChild('ccInput') ccInput: any;
  @ViewChild('cc_name') matAutocompletecc: MatAutocomplete;
  //expense_grp
  @ViewChild('expenseInput') expenseInput: any;

  @ViewChild('bsclear_nameInput') bsclear_name;
  branchid: any = 0;
  branchcode: any = 0;
  branchName: any;
  branchdetails: any;
  has_next: boolean;
  has_previous: boolean;
  currentpage: number;
  pprname: any;
  searchDatas: { finyear: any; year_term: any; sectorname: any; divAmount: any; masterbusinesssegment_name: any; bs_name: any; cc_name: any; status_id: any; branch_id: any; expensegrp_name_arr: any; };

  constructor(private errorHandler: ErrorhandlingService, private formBuilder: FormBuilder, private dataService: PprService, private toastr: ToastrService, private SpinnerService: NgxSpinnerService,) {

  }
  pprSearchForm: FormGroup;
  buildermonthForm: FormGroup;
  buildermonthForm1: FormGroup;
  approverForm: FormGroup;
  summarydata: any;
  qsummarydata: any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('employeeDeptInput') employeeDeptInput: any;
  @ViewChild('autodept') matAutocompleteDept: MatAutocomplete;
  public chipSelectedEmployeeDept: iDeptList[] = [];
  public chipSelectedEmployeeDeptid = [];
  expensegrpList: iDeptList[];
  year: any;
  Apr: string;
  Apr_Act: String;
  Apr_Bgt: String;
  May: string;
  May_Act: String;
  May_Bgt: String;
  Jun: string;
  Jun_Act: String;
  Jun_Bgt: String
  Jul: string;
  Aug: string;
  Sep: string;
  Oct: string;
  Nov: string;
  Dec: string;
  Jan: string;
  Feb: string;
  Mar: string;
  finyearList: Array<finyearList>;
  branchList: Array<branchList>;
  sectorList: Array<sectorList>;
  businessList: Array<businessList>;
  approverList: Array<approverList>;
  bsList: Array<bsList>;
  ccList: Array<ccList>;
  isLoading = false;
  nextyear: any;
  disableMessage: boolean = true;
  ngOnInit(): void {
    this.disableMessage = true;
    this.getEmployeeList();
    this.pprSearchForm = this.formBuilder.group({
      finyear: [""],
      year_term: ["Monthly"],
      divAmount: [""],
      branchid: [""],
      sectorname: [""],
      businesscontrol: [""],
      bs_id: [""],
      cc_id: [""],


    })
    // this.year_term=1;
    this.buildermonthForm = this.formBuilder.group({

    })
    this.buildermonthForm1 = this.formBuilder.group({

    })
    this.approverForm = this.formBuilder.group({
      approvercontrol: [""],
      remarks: ['']

    })
  }


  apr_name_2: any;
  month_amt: any;
  amount_change_month(i, data, formvalue, total_data, Month_val) {
    let a = data
    if (Month_val == 'YTD') {
      if (formvalue == '') {
        this.month_amt = "0.00"
        formvalue = "0.00"
      } else {
        // this.month_amt = (parseFloat(formvalue) / 12).toFixed(4);
        this.month_amt = (parseFloat(formvalue) / 12).toFixed(2);

      }
      let b = (parseFloat(formvalue) / 12).toFixed(4);
      total_data[i]['YTD'][2] = formvalue
      total_data[i]['Apr'][2] = this.month_amt
      total_data[i]['May'][2] = this.month_amt
      total_data[i]['Jun'][2] = this.month_amt
      total_data[i]['Jul'][2] = this.month_amt
      total_data[i]['Aug'][2] = this.month_amt
      total_data[i]['Sep'][2] = this.month_amt
      total_data[i]['Oct'][2] = this.month_amt
      total_data[i]['Nov'][2] = this.month_amt
      total_data[i]['Dec'][2] = this.month_amt
      total_data[i]['Jan'][2] = this.month_amt
      total_data[i]['Feb'][2] = this.month_amt
      total_data[i]['Mar'][2] = this.month_amt
      total_data[i]['change_flag'] = 'Y'

      this.summarydata = total_data
    } else {
      let a21 = total_data[i][Month_val][2]
      let b = ((parseFloat(total_data[i]['YTD'][2]) - parseFloat(a21)) + parseFloat(formvalue)).toFixed(2);
      total_data[i]['YTD'][2] = b
      if (b == 'NaN') {
        b = parseFloat(formvalue).toFixed(2);
      }

      total_data[i]['YTD'][2] = b
      total_data[i][Month_val][2] = parseFloat(formvalue).toFixed(2);

      this.summarydata = total_data
    }
    // this.apr_name=formvalue.ytd_name_2
    // this.buildermonthForm.value.apr_name[i]=formvalue.ytd_name_2

  }
  qttly_amount: any;
  amount_change_qtr(i, data, formvalue, total_data, Month_val) {
    let a = data
    if (Month_val == 'YTD') {
      if (formvalue == '') {
        this.qttly_amount = "0.00"
        formvalue = "0.00"
      } else {
        this.qttly_amount = (parseFloat(formvalue) / 12).toFixed(2);
      }

      total_data[i]['YTD'][2] = formvalue
      total_data[i]['Quarterly_1'][2] = this.qttly_amount
      total_data[i]['Quarterly_2'][2] = this.qttly_amount
      total_data[i]['Quarterly_3'][2] = this.qttly_amount
      total_data[i]['Quarterly_4'][2] = this.qttly_amount

      this.qsummarydata = total_data
    } else {
      let a21 = total_data[i][Month_val][2]
      let b = ((parseFloat(total_data[i]['YTD'][2]) - parseFloat(a21)) + parseFloat(formvalue)).toFixed(2);
      total_data[i]['YTD'][2] = b
      if (b == 'NaN') {
        b = parseFloat(formvalue).toFixed(2);
      }

      total_data[i]['YTD'][2] = b
      total_data[i][Month_val][2] = parseFloat(formvalue).toFixed(2);

      this.qsummarydata = total_data
    }
  }

  amount_change_name(i, data, formvalue, total_data, Month_val) {
    if (Month_val == 'mon') {
      total_data[i]['name'] = formvalue
      // total_data[i]['new_data']='N'
      total_data[i]['change_flag'] = 'Y'
      this.summarydata = total_data
    } else {
      total_data[i]['name'] = formvalue
      this.qsummarydata = total_data
    }


  }
  // finyear dropdown start
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
        switchMap(value => this.dataService.getbbfinyeardropdown(value, 1)
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
  @ViewChild('fin_year') fin_yearauto: MatAutocomplete;
  @ViewChild('finyearInput') finyearInput: any;
  autocompletefinyearScroll() {
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1;
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
    this.dataService.getbbfinyeardropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.finyearList = datas;

      })
  }
  public displayfnfinyear(fin_year?: finyearList): string | undefined {
    return fin_year ? fin_year.finyear : undefined;

  }

  // fin year dropdown end
  // branch dropdown start
  // branch dropdown start
  branchname() {
    let prokeyvalue: String = "";
    this.getbranchid(prokeyvalue);
    this.pprSearchForm.get('branchid').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getpprbranchdropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
              this.branchdetails = value
              this.branchid = value.id
              this.branchcode = value.code

            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
        this.pprSearchForm.controls['bs_id'].reset('')
        this.pprSearchForm.controls['cc_id'].reset('')
        this.pprSearchForm.controls['sectorname'].reset('')
        this.pprSearchForm.controls['businesscontrol'].reset('')

      })
  }

  private getbranchid(prokeyvalue) {
    this.dataService.getpprbranchdropdown(prokeyvalue, 1)
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
                this.dataService.getpprbranchdropdown(this.branchContactInput.nativeElement.value, this.currentpagebra + 1)
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
  // sector dropdown start
  sector_id = 0
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
        this.pprSearchForm.controls['cc_id'].reset('')

        this.pprSearchForm.controls['businesscontrol'].reset('')

      })
  }

  @ViewChild('sectornameInput') sectornameInput: any
  @ViewChild('sector_name') sectorAutoComplete: MatAutocomplete;
  autocompletesectorScroll() {
    this.has_next = true;
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
  private getsector(prokeyvalue) {
    this.dataService.getsectordropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.sectorList = datas;

      })
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
        switchMap(value => this.dataService.getbusinessbudgetdropdown(this.sector_id, this.branchid, this.branchcode, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
              this.branchName = value.name
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


  business_id = 0;
  private getbusiness(prokeyvalue) {
    this.dataService.getbusinessbudgetdropdown(this.sector_id, this.branchid, this.branchcode, prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businessList = datas;

      })
  }
  autocompletebusinessnameScroll() {
    this.has_nextbra = true
    this.has_previousbra = true
    this.currentpagebra = 1
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
                this.dataService.getbusinessbudgetdropdown(this.sector_id, this.branchid, this.branchcode, this.businessInput.nativeElement.value, this.currentpagebra + 1)
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

  selectbusinessSection(data) {
    this.business_id = data.id
    if (this.business_id == undefined) {
      this.pprSearchForm.value.bs_id = ' ';
    }
  }

  business_bs_clear() {
    this.pprSearchForm.controls['bs_id'].reset('')
    this.pprSearchForm.controls['cc_id'].reset('')
  }
  // business dropdown end
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
        switchMap(value => this.dataService.getbsbudgetdropdown(this.business_id, this.branchid, this.branchcode, value, 1)
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

  private getbsid(prokeyvalue) {
    this.dataService.getbsbudgetdropdown(this.business_id, this.branchid, this.branchcode, prokeyvalue, 1)
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
                this.dataService.getbsbudgetdropdown(this.business_id, this.branchid, this.branchcode, this.bsInput.nativeElement.value, this.currentpagebs + 1)
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
  }

  bs_cc_clear() {
    this.pprSearchForm.controls['cc_id'].reset('')
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
  autocompletexpenseScroll() {
    this.currentpage = 1
    this.has_next = true
    this.has_previous = true
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
          .subscribe(() => {
            const scrollTop = this.matprodAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matprodAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matprodAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcc === true) {
                this.dataService.getexpensegrpdropdown(this.expInput.nativeElement.value, this.currentpage + 1)
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

  private getexpensegrp(prokeyvalue) {
    this.dataService.getexpensegrpdropdown(prokeyvalue, 1)
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

      this.chipSelectedprodid.splice(index, 1);

      this.expInput.nativeElement.value = '';
    }
  }
  public removedselect(pro1: ItemList): void {
    this.toggleSelection(pro1)
    // 
    // const index = this.selectedItems.indexOf(pro1);
    // if (index >= 0) {
    //   this.selectedItems.splice(index, 1);
    //   
    // //   // this.chipSelectedprodid.splice(index, 1);
    // //   // 
    // //   this.expInput.nativeElement.value = '';
    // }
  }
  public prodSelected(event: MatAutocompleteSelectedEvent): void {

    this.selectprodByName(event.option.value.name);
    this.expInput.nativeElement.value = '';

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
  // expensegrp dropdown end







  supplier_chkval: any;
  headercheck: any;
  headercheckone: boolean = true;
  fyer: String;
  type: any;
  amountval_type: any;
  amount_type: any;
  firstyear: any;
  lastyear: any;
  budnext_yr: any;
  addyear: any;
  submit_div: boolean = true;
  display: boolean = true
  approverscreen: boolean = true
  @ViewChild('popup_eve') popup_eve;

  budgetbuildersearech_click(data) {


    this.supplier_chkval = "N"
    if ((this.pprSearchForm.value.finyear === undefined) || (this.pprSearchForm.value.finyear === '')) {
      this.toastr.warning('', 'Please Select Finyear', { timeOut: 1500 });

      return false;
    } else {
      if (this.pprSearchForm.value.finyear.finyear == undefined) {
        this.fyer = this.pprSearchForm.value.finyear
        this.pprSearchForm.value.finyear = this.pprSearchForm.value.finyear
      } else {
        this.fyer = this.pprSearchForm.value.finyear.finyear
        this.pprSearchForm.value.finyear = this.pprSearchForm.value.finyear.finyear
      }
    }
    let myArr = this.fyer.toString().split("-");
    this.firstyear = (parseInt(myArr[1]) - 1)
    this.lastyear = Number(myArr[1])

    this.addyear = (parseInt(myArr[1]) + 1)
    this.budnext_yr = (parseInt(myArr[1]) + 2)
    if (this.pprSearchForm.value.year_term === '') {
      this.toastr.warning('', 'Please Select Quarterly or Monthly', { timeOut: 1500 });


      return false;
    }
    if (this.pprSearchForm.value.divAmount === '') {
      this.toastr.warning('', 'Please Select Amount', { timeOut: 1500 });


      return false;
    }

    if ((data.branchid == undefined) || (data.branchid == '')) {
      this.toastr.warning('', 'Please Select Branch ', { timeOut: 1500 });
      return false;
      this.pprSearchForm.value.branch_id = ''
    } else {
      this.pprSearchForm.value.branch_id = this.pprSearchForm.value.branchid.id
    }

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
      this.toastr.warning('', 'Please Select Business', { timeOut: 1500 });


      return false;
      this.pprSearchForm.value.masterbusinesssegment_name = ''
    }
    else {
      this.pprSearchForm.value.masterbusinesssegment_name = this.pprSearchForm.value.businesscontrol.name
    }
    if ((data.bs_id == undefined) || (data.bs_id == '')) {
      this.toastr.warning('', 'Please Select BS Name', { timeOut: 1500 });


      return false;
      this.pprSearchForm.value.bs_name = ''
    } else {
      this.pprSearchForm.value.bs_name = this.pprSearchForm.value.bs_id.name
    }
    if ((data.cc_id == undefined) || (data.cc_id == '')) {
      this.toastr.warning('', 'Please Select CC Name', { timeOut: 1500 });


      return false;
      this.pprSearchForm.value.cc_name = ''
    } else {
      this.pprSearchForm.value.cc_name = this.pprSearchForm.value.cc_id.name
    }
    if (data.year_term == 'Quarterly') {
      this.headercheck = false;
      this.type = 'Quarterly'
      this.headercheckone = true;

    }
    else if (data.year_term == 'Monthly') {
      this.type = 'Monthly'

    }

    if (this.chipSelectedprodid.length == 0) {
      this.pprSearchForm.value.expensegrp_name_arr = ''
    } else {
      this.pprSearchForm.value.expensegrp_name_arr = this.chipSelectedprodid
    }
    // this.pprSearchForm.value.sectorname=this.pprSearchForm.value.sectorname.name

    if (data.divAmount == 'L') {
      this.amountval_type = 'L'
      this.amount_type = 'Amount In Lakhs'
    }
    if (data.divAmount == 'T') {
      this.amountval_type = 'K'
      this.amount_type = 'Amount In Thousands'
    }
    this.searchDatas = {
      "finyear": this.pprSearchForm.value.finyear,
      "year_term": this.type,
      "sectorname": this.pprSearchForm.value.sectorname,
      "divAmount": this.amountval_type,
      "masterbusinesssegment_name": this.pprSearchForm.value.masterbusinesssegment_name,
      "bs_name": this.pprSearchForm.value.bs_name,
      "cc_name": this.pprSearchForm.value.cc_name,
      "status_id": this.pprSearchForm.value.status_id,
      "branch_id": this.pprSearchForm.value.branch_id,
      "expensegrp_name_arr": this.pprSearchForm.value.expensegrp_name_arr
    }

    this.SpinnerService.show();
    this.dataService.getbudgetapprovesummary(this.searchDatas)
      .subscribe((results: any[]) => {

        this.SpinnerService.hide();

        let datas = results["data"];

        // if(datas.length == 0){
        //   this.approverscreen = false
        // }
        // else{
        //   this.approverscreen = true
        // }

        if (datas.length > 0) {
          this.popup_eve.nativeElement.click();

          // if (data.divAmount == 'L') {
          //   this.amountval_type = 'L'
          //   this.amount_type = 'Amount In Lakhs'
          // }
          // if (data.divAmount == 'T') {
          //   this.amountval_type = 'K'
          //   this.amount_type = 'Amount In Thousands'
          // }
          this.headercheckone = false;
          this.headercheck = true
          this.submit_div = false;

          if (data.year_term == 'Monthly') {
            this.summarydata = datas

          }
          else {
            this.qsummarydata = datas
          }
          this.approverscreen = true

        }
        else {

          this.approverscreen = false


          this.headercheckone = true;
          this.headercheck = true
          this.submit_div = true;

          this.amount_type = ''
          this.summarydata = []
          // this.closeall.nativeElement.click();
          // this.closebutton.nativeElement.click();

          this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });


          return false;
        }
        // }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  //   tree level start
  masterbusinesssegment_name_params: any;
  overall_expense_id: any;
  overall_subcat_id: any;
  treelevel_click(ind, data, data1, mon_type) {
    let a = []
    let a2 = ind + 1
    if (data.tree_flag == 'N') {
      if (data.Padding_left == '10px') {
        for (let i = a2; i < data1.length; i++) {
          let a1 = data1[i]
          a.push(i)
          if (a1.Padding_left == '10px') { break; }

        }
      }
      if (data.Padding_left == '50px') {
        for (let i = a2; i < data1.length; i++) {
          let a1 = data1[i]
          a.push(i)
          if ((a1.Padding_left == '50px') || (a1.Padding_left == '10px')) { break; }

        }
      }
      if (data.Padding_left == '75px') {
        for (let i = a2; i < data1.length; i++) {
          let a1 = data1[i]
          a.push(i)
          if ((a1.Padding_left == '75px') || (a1.Padding_left == '50px') || (a1.Padding_left == '10px')) { break; }

        }
      }
      if (data.Padding_left == '100px') {
        for (let i = a2; i < data1.length; i++) {
          let a1 = data1[i]
          a.push(i)
          if ((a1.Padding_left == '100px') || (a1.Padding_left == '75px') || (a1.Padding_left == '50px') || (a1.Padding_left == '10px')) { break; }

        }
      }
      a.pop()
      const indexSet = new Set(a);

      const arrayWithValuesRemoved = data1.filter((value, i) => !indexSet.has(i));
      arrayWithValuesRemoved[ind].tree_flag = 'Y'
      if (mon_type == 'mon') {
        this.summarydata = arrayWithValuesRemoved;
      }
      if (mon_type == 'qtr') {
        this.qsummarydata = arrayWithValuesRemoved;
      }


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
          // "expensegrp_name_arr": data.name
          "expense_grp_id": data.expensegrp_id

        }
        this.new_expense_list(ind, input_params, data1, 1, mon_type)

      }
      if (data.Padding_left == '100px') {
        this.overall_expense_id = data.expense_id
        this.overall_subcat_id = data.subcat_id

        if (this.pprSearchForm.value.masterbusinesssegment_name == undefined) {
          this.masterbusinesssegment_name_params = ""
        } else {
          this.masterbusinesssegment_name_params = this.pprSearchForm.value.masterbusinesssegment_name
        }
        // this.exid=
        let input_params = {
          "apinvoicebranch_id": this.pprSearchForm.value.branch_id,

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
        this.getsupplieramountdetails(ind, input_params, data1, mon_type);

      }
      if (data.Padding_left == '50px') {
        if (this.pprSearchForm.value.masterbusinesssegment_name == undefined) {
          this.masterbusinesssegment_name_params = ""
        } else {
          this.masterbusinesssegment_name_params = this.pprSearchForm.value.masterbusinesssegment_name
        }
        let input_params = {
          "branch_id": this.pprSearchForm.value.branch_id,
          // "apinvoicebranch_id": this.pprSearchForm.value.branch_id,

          "finyear": this.pprSearchForm.value.finyear,
          "year_term": this.type,
          "divAmount": this.amountval_type,
          "sectorname": this.pprSearchForm.value.sectorname,
          "masterbusinesssegment_name": this.masterbusinesssegment_name_params,
          "bs_name": this.pprSearchForm.value.bs_name,
          "cc_name": this.pprSearchForm.value.cc_name,
          "expense_id": data.expense_id
        }
        this.new_buildercat_list(ind, input_params, data1, mon_type)
      }

      if (data.Padding_left == '75px') {
        if (this.pprSearchForm.value.masterbusinesssegment_name == undefined) {
          this.masterbusinesssegment_name_params = ""
        } else {
          this.masterbusinesssegment_name_params = this.pprSearchForm.value.masterbusinesssegment_name
        }
        if (data.status_id != null || data.status_id != "" || data.status_id != undefined) {

          this.pprSearchForm.value.status_id = this.pprSearchForm.value.status_id
        } else {

          this.pprSearchForm.value.status_id = ""
        }
        let input_params = {
          "status_id": this.pprSearchForm.value.status_id,
          "branch_id": this.pprSearchForm.value.branch_id,
          "finyear": this.pprSearchForm.value.finyear,
          "year_term": this.type,
          "divAmount": this.amountval_type,
          "sectorname": this.pprSearchForm.value.sectorname,
          "masterbusinesssegment_name": this.pprSearchForm.value.masterbusinesssegment_name,
          "bs_name": this.pprSearchForm.value.bs_name,
          "cc_name": this.pprSearchForm.value.cc_name,
          "expense_id": data.expense_id,
          "category_id": data.cat_id
        }
        this.new_buildersubcat_list(ind, input_params, data1, mon_type)
      }
    }
  }
  index_expense: any;
  private new_expense_list(ind, data, data1, pageNumber, mon_type) {
    this.index_expense = ind + 1
    this.SpinnerService.show()

    this.dataService.new_builderexpense_approve_list(data)
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
          if (mon_type == 'mon') {
            // let datasValue = data1.filter((value, index, array) =>
            //   !array.filter((v, i) => JSON.stringify(value['expense_id']) == JSON.stringify(v['expense_id']) && value.Padding_left == "50px" && i < index).length);
            // 
            // this.summarydata = datasValue
            this.summarydata = data1
          }
          if (mon_type == 'qtr') {
            this.qsummarydata = data1
          }
          this.supplierList = datas;
        }


      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  index_cat: any
  private new_buildercat_list(ind, data, data1, mon_type) {
    this.index_cat = ind + 1
    this.SpinnerService.show()

    this.dataService.new_buildercat_approver_list(data)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()

        let datas = results["data"];
        if (datas.length == 0) {
          this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        } else {

          for (var val of datas) {
            let a = data
            data1.splice(this.index_cat, 0, val);
            this.index_cat = this.index_cat + 1
          }
          data1[ind].tree_flag = 'N'
          if (mon_type == 'mon') {
            // let datasValue = data1.filter((value, index, array) =>
            //   !array.filter((v, i) => JSON.stringify(value['cat_id']) == JSON.stringify(v['cat_id']) && value.Padding_left == "75px" && i < index).length);
            // 
            // this.summarydata = datasValue
            this.summarydata = data1
          }
          if (mon_type == 'qtr') {
            this.qsummarydata = data1
          }
          this.supplierList = datas;
        }


      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
  }
  index_subcat: any;
  supplierList: any;
  private new_buildersubcat_list(ind, data, data1, mon_type) {
    this.index_subcat = ind + 1
    this.SpinnerService.show()

    this.dataService.new_buildersubcat_approve_list(data)
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
          if (mon_type == 'mon') {
            // let datasValue = data1.filter((value, index, array) =>
            //   !array.filter((v, i) => JSON.stringify(value['subcat_id']) == JSON.stringify(v['subcat_id']) && value.Padding_left == "100px" && i < index).length);
            // 
            // // this.summarydata = datasValue
            this.summarydata = data1
          }
          if (mon_type == 'qtr') {
            this.qsummarydata = data1
          }
          this.supplierList = datas;
        }


      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  private getsupplieramountdetails(ind, data, data1, mon_type) {
    this.SpinnerService.show()

    this.dataService.budgetapprove_getsupplieramountdetails(data)
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
          if (mon_type == 'mon') {
            // let datasValue = data1.filter((value, index, array) =>
            //   !array.filter((v, i) => JSON.stringify(value['supplier_id']) == JSON.stringify(v['supplier_id']) && value.Padding_left == "120px" && i < index).length);
            // 
            this.summarydata = data1
          }
          if (mon_type == 'qtr') {
            this.qsummarydata = data1
          }
          this.supplierList = datas;
        }


      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  // suppliergetapi end

  //   tree level end
  headercol: any;
  private getEmployeeList() {
    this.headercheckone = true;
    this.headercheck = true;
    this.headercol = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

    this.year = new Date().getFullYear().toString().substr(-2);
    this.Apr = "Apr-" + this.year;
    // this.Apr_Act="Apr Act-"+this.year;
    // this.Apr_Bgt="Apr Bgt-"+(this.year+1);
    this.May = "May-" + this.year
    // this.May_Act="May Act-"+this.year
    // this.May_Bgt="May Bgt-"+(this.year+1)
    this.Jun = "Jun-" + this.year
    // this.Jun_Act="Jun Act-"+this.year
    // this.Jun_Bgt="Jun Bgt-"+(this.year+1)
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


  }
  addrow_monthly(row_index, pprdata, pprtotaldata) {
    let a = {
      "Padding_left": "120px",
      "Padding": "10px",
      "new_data": "Y",
      "name": "",
      "YTD": ["", "", ""],
      "Apr": ["", "", ""],
      "May": ["", "", ""],
      "Jun": ["", "", ""],
      "Jul": ["", "", ""],
      "Aug": ["", "", ""],
      "Sep": ["", "", ""],
      "Oct": ["", "", ""],
      "Nov": ["", "", ""],
      "Dec": ["", "", ""],
      "Jan": ["", "", ""],
      "Feb": ["", "", ""],
      "Mar": ["", "", ""]
    }
    let a11 = []
    let a2 = row_index + 1
    if (pprdata.Padding_left == '100px') {
      for (let i = a2; i < pprtotaldata.length; i++) {
        let a1 = pprtotaldata[i]
        a11.push(i)
        if ((a1.Padding_left == '50px') || (a1.Padding_left == '10px') || ((a1.Padding_left == '100px'))) { break; }

      }
    }
    a11.pop
    let a12 = a11.length
    let a13 = a12 - 1
    let b = a11[a13]

    pprtotaldata.splice(b, 0, a);
    this.summarydata = pprtotaldata

  }
  addrow_qtr(row_index, pprdata, pprtotaldata) {
    let a = {
      "Padding_left": "120px",
      "Padding": "10px",
      "new_data": "Y",
      "name": "",
      "YTD": ["", "", ""],
      "Quarterly_1": ["", "", ""],
      "Quarterly_2": ["", "", ""],
      "Quarterly_3": ["", "", ""],
      "Quarterly_4": ["", "", ""],

    }
    let a11 = []
    let a2 = row_index + 1
    if (pprdata.Padding_left == '100px') {
      for (let i = a2; i < pprtotaldata.length; i++) {
        let a1 = pprtotaldata[i]
        a11.push(i)
        if ((a1.Padding_left == '100px') || (a1.Padding_left == '50px') || (a1.Padding_left == '10px')) { break; }

      }
    }
    a11.pop
    let a12 = a11.length
    let a13 = a12 - 1
    let b = a11[a13]
    pprtotaldata.splice(b, 0, a);
    this.qsummarydata = pprtotaldata

  }

  delete_qty(idex, qdata) {
    let a = []
    a.push(idex)
    const indexSet1 = new Set(a);
    const arrayWithValuesRemoved1 = qdata.filter((value, i) => !indexSet1.has(i));
    this.qsummarydata = arrayWithValuesRemoved1

  }
  delete_month(idex, qdata) {
    let a = []
    a.push(idex)
    const indexSet1 = new Set(a);
    const arrayWithValuesRemoved1 = qdata.filter((value, i) => !indexSet1.has(i));
    this.summarydata = arrayWithValuesRemoved1

  }

  // employee search start

  Approver_dropdown() {
    let prokeyvalue: String = "";
    this.getapprover(prokeyvalue);
    this.approverForm.get('approvercontrol').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getapproverdropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.approverList = datas;

      })
  }



  private getapprover(prokeyvalue) {
    this.dataService.getapproverdropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.approverList = datas;

      })
  }
  public displayfnapprover(approver_name?: approverList): string | undefined {
    return approver_name ? approver_name.full_name : undefined;

  }
  draft_ary: any;
  save_draft(data, data1, status) {

    if (this.type == 'Quarterly') {
      let a11 = []
      for (let i = 0; i < data1.length; i++) {
        let a1 = data1[i]
        if ((data1[i].Padding_left == '120px'))
          a11.push(a1)

      }


      let input_ary = []
      for (let i = 0; i < a11.length; i++) {
        let tran_month = 1

        let month_ary = ['Quarterly_1', 'Quarterly_1', 'Quarterly_1', 'Quarterly_1']
        for (let j = 0; j < 4; j++) {
          let myArr = this.fyer.toString().split("-");
          let traninput_yr = "20" + (parseInt(myArr[1]))
          if (tran_month == 4) {

            traninput_yr = "20" + (parseInt(myArr[1]) + 1)
          }

          let supplier_id = '0';
          let subcat_id = '0';
          let expence_id = '0'
          let new_data11 = a11[i]['new_data']
          if (new_data11 == undefined) {
            supplier_id = a11[i].supplier_id
            subcat_id = a11[i].apsubcat_id
            expence_id = a11[i].apexpense_id
          } else {
            supplier_id = '0'
            subcat_id = this.overall_subcat_id
            expence_id = this.overall_expense_id
          }
          // "new_data" in a11[i] ? supplier_id='' : supplier_id=a11[i].supplier_id

          let month_name = month_ary[i]
          let params_data = {
            "finyear": this.fyer,
            "quarter": tran_month,
            "transactionmonth": 0,
            "transactionyear": traninput_yr,
            "branch_id": this.pprSearchForm.value.branch_id,
            "supplier_id": supplier_id,
            "sectorname": this.pprSearchForm.value.sectorname,
            "masterbusinesssegment_name": this.masterbusinesssegment_name_params,
            "bs_name": this.pprSearchForm.value.bs_name,
            "cc_name": this.pprSearchForm.value.cc_name,
            "subcat_id": subcat_id,
            "expense_id": expence_id,
            "future_bgtamount": a11[i][month_name][2],
            "status": status
          }
          tran_month = tran_month + 1
          input_ary.push(params_data)

        }



      }
      let ae1 = { "data": input_ary }
      this.set_budgetbuiler(ae1)
    }


    if (this.type == 'Monthly') {
      let a11 = []
      for (let i = 0; i < data.length; i++) {
        let a1 = data[i]
        if ((data[i].Padding_left == '120px'))
          a11.push(a1)


      }


      let input_ary = []
      let month_val

      for (let i = 0; i < a11.length; i++) {
        let tran_month = 4

        let month_ary = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']


        if (month_ary[0]) {
          month_val = 0
        }

        for (let j = 0; j < month_ary.length; j++) {
          let myArr = this.fyer.toString().split("-");
          let traninput_yr = "20" + (parseInt(myArr[1]))
          let mfinyr = "FY" + (parseInt(myArr[1])) + "-" + (parseInt(myArr[1]) + 1)
          if (tran_month == 13) {
            tran_month = 1
            traninput_yr = "20" + (parseInt(myArr[1]) + 1)
          }
          if (tran_month == 2) {
            traninput_yr = "20" + (parseInt(myArr[1]) + 1)

          }
          if (tran_month == 3) {
            traninput_yr = "20" + (parseInt(myArr[1]) + 1)

          }
          let supplier_id = '0';
          let subcat_id = '0';
          let expence_id = '0'
          let new_data11 = a11[i]['new_data']
          if (new_data11 == 'N') {
            supplier_id = a11[i].supplier_id
            subcat_id = a11[i].apsubcat_id
            expence_id = a11[i].apexpense_id
          } else {
            supplier_id = '0'
            subcat_id = this.overall_subcat_id
            expence_id = this.overall_expense_id
          }
          // "new_data" in a11[i] ? supplier_id='' : supplier_id=a11[i].supplier_id

          let month_name = month_ary[i]

          let month_name1 = month_ary[j]
          let qty1 = ['Apr', 'May', 'Jun']
          let qty2 = ['Jul', 'Aug', 'Sep']
          let qty3 = ['Oct', 'Nov', 'Dec']
          let qty4 = ['Jan', 'Feb', 'Mar']
          let qty11 = qty1.includes(month_name1);
          let qty22 = qty2.includes(month_name1);
          let qty33 = qty3.includes(month_name1);
          let qty44 = qty4.includes(month_name1);
          let qtr_count = 0;
          if (qty11 == true) {
            qtr_count = 1
          }
          if (qty22 == true) {
            qtr_count = 2
          }
          if (qty33 == true) {
            qtr_count = 3
          }
          if (qty44 == true) {
            qtr_count = 4
          }





          let params_data = {
            "finyear": this.pprSearchForm.value.finyear,
            "quarter": qtr_count,
            "transactionmonth": tran_month,
            "transactionyear": traninput_yr,
            "branch_id": this.pprSearchForm.value.branch_id,
            "supplier_id": supplier_id,
            "sectorname": this.pprSearchForm.value.sectorname,
            "masterbusinesssegment_name": this.masterbusinesssegment_name_params,
            "bs_name": this.pprSearchForm.value.bs_name,
            "cc_name": this.pprSearchForm.value.cc_name,
            "subcat_id": subcat_id,
            "expense_id": expence_id,
            "future_bgtamount": a11[i][month_name1][2],
            "status": status
          }
          tran_month = tran_month + 1
          input_ary.push(params_data)

        }



      }

      let ae1 = { "data": input_ary, "remark": this.approverForm.value.remarks }
      this.set_budgetbuiler(ae1)
    }

  }
  budget_status_set(status,status_val){
    if (this.branchdetails.code == '9999') {
      this.pprSearchForm.value.branchid = this.branchdetails


    }
  
    if (this.approverForm.value.remarks == "") {
      this.toastr.warning('', 'Please Filled The Remarks', { timeOut: 1500 });
      return false;



    }
    
     let params_data = {
      "branch_id": this.pprSearchForm.value.branch_id,
      "finyear": this.pprSearchForm.value.finyear,
      "year_term": this.type,
      "divAmount": this.amountval_type,
      "sectorname": this.pprSearchForm.value.sectorname,
      "masterbusinesssegment_name": this.masterbusinesssegment_name_params,
      "bs_name": this.pprSearchForm.value.bs_name,
      "cc_name": this.pprSearchForm.value.cc_name,
      // "remark_val":this.approverForm.value.remarks
    }
  // let status=4
  let type=status_val
  let remark=this.approverForm.value.remarks

    this.SpinnerService.show()
    this.dataService.budget_status_set(status,params_data,type,remark)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        console.log("message=>",results['data'])
        if(results['message']=='CREATED SUCCESS'){
          if(status==4){
            this.toastr.success('', 'Approved Successfully', { timeOut: 1500 });
            this.closebutton.nativeElement.click();
            return false;
          }
          if(status==6){
            this.toastr.success('', 'Budegt Returned Successfully', { timeOut: 1500 });
            this.closebutton.nativeElement.click();
            return false;
          }
          if(status==7){
            this.toastr.success('', 'Budegt Reject Successfully', { timeOut: 1500 });
            this.closebutton.nativeElement.click();
            return false;
          }
        
        }
        
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  @ViewChild('closepopup') closebutton;
  @ViewChild('closeAll') closeall;

  private set_budgetbuiler(prokeyvalue) {
    if (this.branchdetails.code == '9999') {
      this.pprSearchForm.value.branchid = this.branchdetails


    }
    // if (prokeyvalue.data.length == 0) {
    //   this.toastr.warning('', 'Please View  Supplier For Any Subcat And Then Submit', { timeOut: 1500 });
    //   return false;
    // }
    if (this.approverForm.value.remarks == "") {
      this.toastr.warning('', 'Please Filled The Remarks', { timeOut: 1500 });
      return false;



    }


    this.SpinnerService.show()



    this.dataService.set_Budgetbuilder_Approve(prokeyvalue, this.amountval_type)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        

        let datas = results["message"];
        this.approverForm.controls['remarks'].reset('')

        if (datas == 'CREATED SUCCESS') {
          if (prokeyvalue.data[0].status === 6) {
            this.toastr.success('', 'Return Successfully', { timeOut: 1500 });
            this.closebutton.nativeElement.click();
            return false;

          } else {
            this.toastr.success('', 'Approved Successfully', { timeOut: 1500 });
            this.closebutton.nativeElement.click();
            return false;



          }
        } else {
          this.toastr.warning('', 'Failed Data', { timeOut: 1500 });
          return false;
        }


      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  // employee search end
  clear_budgetdata() {
    this.chipSelectedprod = []
    this.chipSelectedprodid = []
    this.expInput.nativeElement.value = '';
    this.pprSearchForm.reset();
    this.chipSelectedprodid = []
    this.summarydata = []
    this.expenseList = []
    this.headercheckone = true;
    this.headercheck = true
    this.submit_div = true;
    this.amount_type = ''
  }
  // this.overall_expense_id = data.expense_id
  //       this.overall_subcat_id = data.subcat_id
  expid
  subid
  popupsummary(data) {
    this.expid = data.expense_id
    this.subid = data.subcat_id


  }

  supplierdata: any[] = []
  supplierLists: ItemList[] = []
  totalval = []
  selectedItems: ItemList[] = new Array<ItemList>();
  expensegroup = new FormControl()
  focused = false;
  isAllSelected = false;

  toggleSelectAll() {
    this.isAllSelected = !this.isAllSelected;
    let len = this.supplierLists.length;
    if (this.isAllSelected) {

      for (let i = 0; i < this.supplierLists.length; i++)
        this.supplierLists[i].selected = true;
      this.selectedItems = this.supplierLists;

      this.supplierLists = [...this.supplierLists];

    } else {
      for (let i = 0; i < len; i++)
        this.supplierLists[i].selected = false;
      this.selectedItems = [];
    }
  }

  optionClicked(event: Event, item: ItemList) {
    event.stopPropagation();
    this.toggleSelection(item);
  }

  toggleSelection(item: ItemList) {
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedItems.push(item);
      if (this.supplierLists.length == this.selectedItems.length) {

        this.isAllSelected = true
      }
    } else {
      this.isAllSelected = false

      var indselect = this.selectedItems.findIndex(value => value['supplier_code'] === item['supplier_code']);

      this.selectedItems.splice(indselect, 1);
    }
  }

  closePopup() {
    this.selectedItems = []
    this.isAllSelected = false
    this.supplierLists = []
  }
  closepopupbb() {
    if (this.branchdetails.code == '9999') {
      this.pprSearchForm.value.branchid = this.branchdetails


    }
    this.approverForm.controls['remarks'].reset('')

  }
  remarks_val
  remarks(val) {

    this.pprname = val.name

    var remaks_key = { "remark_key": val.remark_key }

    this.SpinnerService.show();

    this.dataService.budgetremarks(remaks_key)
      .subscribe((results: any[]) => {

        this.SpinnerService.hide();

        let data = results['data']
        this.remarks_val = data
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
}
