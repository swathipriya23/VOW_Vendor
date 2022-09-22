import { ChangeDetectorRef, Component, ElementRef, HostBinding, Input, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName, NgControl } from '@angular/forms';
import { PprService } from '../ppr.service';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent, Observable, Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ToastrService } from 'ngx-toastr';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
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
export interface statusList {
  status: any
  id: any
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
export class SupplierList {
  constructor(public item: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}

@Component({
  selector: 'app-budget-builder',
  templateUrl: './budget-builder.component.html',
  styleUrls: ['./budget-builder.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: BudgetBuilderComponent }]

})
export class BudgetBuilderComponent implements OnInit {

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  // branch dropdown
  @ViewChild('branchContactInput') branchContactInput: any;
  @ViewChild('branch') matAutocompletebrach: MatAutocomplete;
  //bs
  @ViewChild('bsInput') bsInput: any;
  @ViewChild('bs') matAutocompletebs: MatAutocomplete;
  //cc
  @ViewChild('ccInput') ccInput: any;
  @ViewChild('cc_name') matAutocompletecc: MatAutocomplete;
  //expense_grp
  @ViewChild('expenseInput') expenseInput: any;

  @ViewChild('bsclear_nameInput') bsclear_name;
  // business
  @ViewChild('business_name') business_name: MatAutocomplete;
  @ViewChild('businessInput') businessInput: any
  lastFilter: any;
  branchid: any = 0;
  branchcode: any = 0;
  branchName: any;
  selectAll: Boolean = false
  selectsupplier:Boolean=false
  selecteditems: ItemList[];
  pprname: any;
  // isCheckedval=false
  has_next: boolean = true;
  has_previous: any = true;
  levels4a2datas: any
  currentpage: any = 1;
  bbname: any;
  branchdetails: any;
  levelsdatas: any
  expance: boolean = true
  levels5adatas: any[];
  expand: boolean;
  levels4a3datas: any[];
  levels4adatas: any[];
  data4aexp: boolean;
  levelstwodatas: any[];
  levelsonedatas: any[];
  dataaexp: boolean;
  dataaexpone: boolean;
  title: string;
  levelsdatavalueone: any;
  newrowlen: number = 0;
  statusrow: any;
  supplierid: any;
  hiddenrow: any = 0;
  headerchecker: boolean;
  finy: any;
  startyear;
  headerchecksearch = true;
  searchDatas: any;
  index_cat: any;
  branchcodelable: any;
  branchnamelable: any;
  supplier_id: any;
  supplierother_task: any;
  supplierFilter: any;


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
  @ViewChild('finyearInput') finyearInput: any;
  @ViewChild('fin_year') fin_yearauto: MatAutocomplete
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
  newrow: number = 0
  ngOnInit(): void {
    // this.isChecked=true
    this.headerchecker = false
    // this.supplierall.valueChanges.pipe(
    //   startWith<string | SupplierList[]>(''),
    //   map(value => typeof value === 'string' ? value : this.lastFilter),
    //   map(filter => this.filter(filter))
    // ).subscribe(data => {
    //   this.supplierAllLists = data
    //   this.isAllSelected = false
    // });
    // supplier_val
    this.supplier_val.valueChanges.pipe(
      startWith<string | SupplierList[]>(''),
      map(value => typeof value === 'string' ? value : this.supplierFilter),
      map(filter => this.supplierfilter(filter))
    ).subscribe(data => {
      this.supplierLists = data
      this.isAllSelected = false
    });


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
      status_id: [""],
      checkval:['',Validators.requiredTrue]

    })
    // this.year_term=1;
    this.buildermonthForm = this.formBuilder.group({

    })
    this.buildermonthForm1 = this.formBuilder.group({

    })
    this.approverForm = this.formBuilder.group({
      approvercontrol: [""],
      remarks: [""]

    })
  }
  filter(filter: string): SupplierList[] {
    this.lastFilter = filter;
    if (filter) {
      return this.supplierAlldata.filter(option => {
        return option.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
      })
    } else {
      return this.supplierAlldata.slice();
    }
  }
  supplierfilter(filter: string): ItemList[] {
    this.supplierFilter = filter;
    if (filter) {
      return this.supplierdata.filter(option => {
        return option.supplier_name.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
      })
    } else {
      return this.supplierdata.slice();
    }
  }
  taggle_val(event){
    console.log(event)
  }
  apr_name_2: any;
  month_amt: any;
  amount_change_month(i, data, formvalue, total_data, Month_val) {
    let a = data
    if (Month_val == 'YTD') {
      if (formvalue == '') {
        this.month_amt = "0.00"
        formvalue = "0.00"

        return false;
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
      // this.amount_format(total_data[i])
      // this.summarydata = total_data
    } else {
      let a21 = total_data[i][Month_val][2]
      let b = ((parseFloat(total_data[i]['YTD'][2]) - parseFloat(a21)) + parseFloat(formvalue)).toFixed(2);
      total_data[i]['YTD'][2] = b
      if (b == 'NaN') {
        b = parseFloat(formvalue).toFixed(2);
      }

      total_data[i]['YTD'][2] = b
      total_data[i][Month_val][2] = parseFloat(formvalue).toFixed(2);
      total_data[i]['change_flag'] = 'Y'

      // this.summarydata = total_data

    }
    this.amount_format(total_data[i],total_data)

    // this.apr_name=formvalue.ytd_name_2
    // this.buildermonthForm.value.apr_name[i]=formvalue.ytd_name_2

  }
  amount_format(data,totalData){
    console.log("amount",data)
      let ytd_value=parseFloat(data['YTD'][2])
      let total_data:string=(parseFloat(data['Apr'][2])+parseFloat(data['May'][2])+parseFloat(data['Jun'][2])+parseFloat(data['Jul'][2])+parseFloat(data['Aug'][2])+parseFloat(data['Sep'][2])+parseFloat(data['Oct'][2])+parseFloat(data['Nov'][2])+parseFloat(data['Dec'][2])+parseFloat(data['Jan'][2])+parseFloat(data['Feb'][2])+parseFloat(data['Mar'][2])).toFixed(2)
      let format_convert=(parseFloat(total_data))
      console.log("total=>",total_data,format_convert)
      if(ytd_value<format_convert){
        console.log("com=>",ytd_value,total_data)
        let apr_value=format_convert-ytd_value
        console.log("apr_value=>",apr_value)
        let values=(parseFloat(data['Apr'][2])-apr_value).toFixed(2)
        data['Apr'][2]=values
        console.log("apr=>",data['Apr'][2])
        this.summarydata = totalData
        console.log("total_data=>",this.summarydata)

      }if(ytd_value>format_convert){
        console.log("com=>",ytd_value,total_data)
        let apr_value=ytd_value-format_convert
        console.log("apr_value=>",apr_value)
        let values=(parseFloat(data['Apr'][2])+apr_value).toFixed(2)
        data['Apr'][2]=values
        console.log("apr=>",data['Apr'][2])
        this.summarydata = totalData
        console.log("total_data=>",this.summarydata)

      }
    // if()
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

    // if(oat.value=="Others"){
    //   data.name="Others"
    //   data.status = 0


    // }
    // if(oat.value=="Task"){
    //   data.name="Task"
    //   data.status = -1
    // }
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
  status_idval(val) {

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
              this.finy = value.finyear

              // if (this.finy == undefined) {
              //   this.startyear = ''
              //   this.lastyear = ''
              // } else {
              //   this.startyear = this.finy.slice(2, 4)
              //   this.lastyear = this.finy.slice(5, 9)
              // }
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.finyearList = datas;


      })
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
              this.branchName = value.name
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
    this.has_nextbra = true;
    this.has_previousbra = true;
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
              // this.businessname=value.
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

  autocompletebusinessnameScroll() {
    this.has_nextbra = true;
    this.has_previousbra = true;
    this.currentpagebra = 1;
    setTimeout(() => {
      if (
        this.business_name &&
        this.autocompleteTrigger &&
        this.business_name.panel
      ) {
        fromEvent(this.business_name.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.business_name.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.business_name.panel.nativeElement.scrollTop;
            const scrollHeight = this.business_name.panel.nativeElement.scrollHeight;
            const elementHeight = this.business_name.panel.nativeElement.clientHeight;
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
  business_id = 0;
  private getbusiness(prokeyvalue) {

    this.dataService.getbusinessbudgetdropdown(this.sector_id, this.branchid, this.branchcode, prokeyvalue, 1)
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
    this.has_nextbs = true;
    this.has_previousbs = true;
    this.currentpagebs = 1;
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
    this.has_nextcc = true;
    this.has_previouscc = true;
    this.currentpagecc = 1;
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


  private getexpensegrp(prokeyvalue) {
    this.dataService.getexpensegrpdropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        // this.expensegrpList = datas;
        this.expenseList = datas

      })
  }
  autocompletexpenseScroll() {
    this.currentpagecc = 1
    this.has_nextcc = true
    this.has_previouscc = true
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
                this.dataService.getexpensegrpdropdown(this.expInput.nativeElement.value, this.currentpagecc + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.expenseList = this.expenseList.concat(datas);
                    if (this.expenseList.length >= 0) {
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
  @ViewChild('popup_eve') popup_eve;
  @ViewChild('popupbb') popupbb;
  budgetbuildersearech_click(data) {



    this.SpinnerService.show();
    this.dataService.getbudgetsearchsummary(this.searchDatas)
      .subscribe((results: any[]) => {

        this.SpinnerService.hide();
        // closepopup


        let datas = results["data"];



        if (datas.length != 0) {
          this.popupbb.nativeElement.click();


          this.headercheckone = false;
          this.headercheck = true
          this.submit_div = false;


          if (data.year_term == 'Monthly') {
            this.summarydata = datas
          }
          else {
            this.qsummarydata = datas
          }
        }
        else {
          this.headercheckone = true;
          this.headercheck = true
          this.submit_div = true;


          this.amount_type = ''
          this.summarydata = []

          this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });

          return false;
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })

  }
  budgetbuildersearechclick(data) {
    console.log("pprSearchForm=>",this.pprSearchForm.value)
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
      this.pprSearchForm.value.branchid = ''

    } else if (this.pprSearchForm.value.branchid.code == '9999') {
      this.pprSearchForm.value.branchid = ''

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

    if ((data.status_id == null) || (data.status_id == "") || (data.status_id == undefined)) {
      this.pprSearchForm.value.status_id = ""

    } else {

      this.pprSearchForm.value.status_id = this.pprSearchForm.value.status_id

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
    this.branchcodelable = this.pprSearchForm.value.branchid.code
    this.branchnamelable = this.pprSearchForm.value.branchid.name
    // this.branchnamelable=this.pprSearchForm.value.branchid.name
    this.SpinnerService.show()
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
    // this.pprSearchForm.value.sectorname=this.pprSearchForm.value.sectorname.name
    // this.searchDatas= this.pprSearchForm.value
    this.headerchecksearch = false
    // this.levelslist
    for (let exp of this.levelslist) {
      exp['expanded'] = false
    }
    if (this.finy == undefined) {
      this.startyear = ''
      this.lastyear = ''
    } else {
      this.startyear = this.finy.slice(2, 4)
      this.lastyear = this.finy.slice(5, 9)
    }
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.SpinnerService.hide();
    }, 500);

  }
  //   tree level start
  masterbusinesssegment_name_params: any;
  overall_expense_id: any;
  overall_subcat_id: any;
  treelevel_click(ind, data, data1, mon_type) {
    let a = []
    let a2 = ind + 1
    this.newrowlen = 0
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
        if (data.status_id != null || data.status_id != "" || data.status_id != undefined) {

          this.pprSearchForm.value.status_id = this.pprSearchForm.value.status_id
        } else {

          this.pprSearchForm.value.status_id = ""
        }
        let input_params
        // if()
        input_params = {
          "status_id": this.searchDatas.status_id,
          "branch_id": this.searchDatas.branch_id,
          "finyear": this.searchDatas.finyear,
          "year_term": this.type,
          "divAmount": this.amountval_type,
          "sectorname": this.searchDatas.sectorname,
          "masterbusinesssegment_name": this.searchDatas.masterbusinesssegment_name,
          "bs_name": this.searchDatas.bs_name,
          "cc_name": this.searchDatas.cc_name,
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
        if (data.status_id != null || data.status_id != "" || data.status_id != undefined) {

          this.pprSearchForm.value.status_id = this.pprSearchForm.value.status_id
        } else {

          this.pprSearchForm.value.status_id = ""
        }
        // this.exid=
        let input_params = {
          "status_id": this.searchDatas.status_id,
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
        this.ind_val = ind
        // this.getsupplier()

        this.popupsummary(ind, data, data1)
        // this.getsupplieramountdetails(ind, input_params, data1, mon_type);

      }
      if (data.Padding_left == '50px') {
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
          "status_id": this.searchDatas.status_id,
          "branch_id": this.searchDatas.branch_id,
          "finyear": this.searchDatas.finyear,
          "year_term": this.type,
          "divAmount": this.amountval_type,
          "sectorname": this.searchDatas.sectorname,
          "masterbusinesssegment_name": this.searchDatas.masterbusinesssegment_name,
          "bs_name": this.searchDatas.bs_name,
          "cc_name": this.searchDatas.cc_name,
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
          "status_id": this.searchDatas.status_id,
          "branch_id": this.searchDatas.branch_id,
          "finyear": this.searchDatas.finyear,
          "year_term": this.type,
          "divAmount": this.amountval_type,
          "sectorname": this.searchDatas.sectorname,
          "masterbusinesssegment_name": this.searchDatas.masterbusinesssegment_name,
          "bs_name": this.searchDatas.bs_name,
          "cc_name": this.searchDatas.cc_name,
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

    this.dataService.new_builderexpense_listsearch(data)
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

    this.dataService.buildersubcat_list(data)
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
  private new_buildercat_list(ind, data, data1, mon_type) {
    this.index_cat = ind + 1
    this.SpinnerService.show()

    this.dataService.new_buildercat_list(data)
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

  private getsupplieramountdetails(ind, data, data1, mon_type) {
    this.SpinnerService.show()

    this.dataService.budget_getsupplieramountdetails(data)
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
            this.summarydata = data1
          }
          if (mon_type == 'qtr') {
            this.qsummarydata = data1
          }
          this.supplierList = datas;
        }


      })
  }
  // suppliergetapi end

  //   tree level end
  headercol: any;
  headerlevel = false
  private getEmployeeList() {
    this.headercheckone = true;
    this.headercheck = true;
    // this.headerchecksearch=false;
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
  a11: any[] = []
  status_id
  sub_name
  clickCount = 0
  otherandtask = [{ value: 'Others' },
  { value: 'Task' }
  ]
  other_and_task(oat, data) {
    if (oat.value == "Others") {
      data.name = "Others"
      data.status = 0


    }
    if (oat.value == "Task") {
      data.name = "Task"
      data.status = -1
    }

  }

  supplier_other_task(row_index, pprdata, pprtotaldata) {


    let expense_id = pprdata['expense_id']
    let subcat_id = pprdata['subcat_id']


    var supplier = {
      "apinvoicebranch_id": this.searchDatas.branch_id,

      // "status_id": this.pprSearchForm.value.status_id,
      "apexpense_id": expense_id,
      "apsubcat_id": subcat_id,
      "masterbusinesssegment_name": this.searchDatas.masterbusinesssegment_name,
      "sectorname": this.searchDatas.sectorname,
      "finyear": this.searchDatas.finyear,
      "bs_name": this.searchDatas.bs_name,
      "cc_name": this.searchDatas.cc_name
    }
    this.SpinnerService.show()


    this.dataService.ppr_supplier(1, supplier)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide()
        this.supplierother_task = datas
        this.addrow_monthly(row_index, pprdata, pprtotaldata, this.supplierother_task)


      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })

  }
  addrow_monthly(row_index, pprdata, pprtotaldata, supplierother_task) {
    // this.supplier_other_task(pprdata)
    // 


    let subcat = pprdata['subcat_id']
    let subcatname
    let oatv = true
    let taov = true
    let onratechangecon = true
    subcatname = 'Others'
    this.status_id = 0
    this.supplier_id = 0
    for (let othertask of supplierother_task) {

      if (othertask['supplier_id'] == 0) {
        oatv = false
        // taov=false
      } if (othertask['supplier_id'] == -1) {
        taov = false
      }
    }

    if (oatv != false && taov != false) {


      subcatname = 'Others'
      this.status_id = 0
      this.supplier_id = 0
    } if (oatv == false && taov != false) {


      subcatname = 'Task'
      this.status_id = -1
      this.supplier_id = -1
    } if (oatv != false && taov == false) {


      subcatname = 'Others'
      this.status_id = 0
      this.supplier_id = 0
    } if (oatv == false && taov == false) {

      this.toastr.warning('', 'Task and Others has already exist', { timeOut: 1500 });
      return false;
    }





    let ppr_data = []
    for (let ppr of pprtotaldata) {

      if (ppr['apsubcat_id'] == subcat && ppr.Padding_left == '120px' && ppr['oat'] == true) {
        if (oatv == false && taov != false) {
          // if(oatv==false){

          this.toastr.warning('', "Others already exist", { timeOut: 1500 });
          return false;
        }
        if (oatv != false && taov == false) {
          // if(taov==false){

          this.toastr.warning('', 'Task already exist', { timeOut: 1500 });
          return false;
        }

        ppr_data.push(ppr)


      }

      if (ppr['apsubcat_id'] == subcat && ppr.Padding_left == '120px' && ppr['oat'] == true) {


        if (ppr['name'] == 'Others') {
          subcatname = 'Task'
          this.status_id = -1
          this.supplier_id = -1
        } else {
          subcatname = 'Others'
          this.status_id = 0
          this.supplier_id = 0
        }
      }


    }
    if (ppr_data.length > 1) {
      this.toastr.warning('', "'oops',You are allowed to add only Task and Others", { timeOut: 1500 });
      return false;
    }



    let a = {
      "Padding_left": "120px",
      "Padding": "10px",
      "new_data": "Y",
      "name": subcatname,
      "status": this.status_id,
      "apsubcat_id": pprdata['subcat_id'],
      "apexpense_id": pprdata['expense_id'],
      "oat": onratechangecon,
      "YTD": ["0.00", "0.00", "0.00"],
      "Apr": ["0.00", "0.00", "0.00"],
      "May": ["0.00", "0.00", "0.00"],
      "Jun": ["0.00", "0.00", "0.00"],
      "Jul": ["0.00", "0.00", "0.00"],
      "Aug": ["0.00", "0.00", "0.00"],
      "Sep": ["0.00", "0.00", "0.00"],
      "Oct": ["0.00", "0.00", "0.00"],
      "Nov": ["0.00", "0.00", "0.00"],
      "Dec": ["0.00", "0.00", "0.00"],
      "Jan": ["0.00", "0.00", "0.00"],
      "Feb": ["0.00", "0.00", "0.00"],
      "Mar": ["0.00", "0.00", "0.00"]
    }

    let newObj = {}
    // let countdata=0

    let a11 = []
    let val = []
    val.push(a)
    let a2 = row_index + 1


    if (pprdata.Padding_left == '100px') {
      for (let i = a2; i < pprtotaldata.length; i++) {
        let a1 = pprtotaldata[i]

        a11.push(i)

        if ((a1.Padding_left == '50px') || (a1.Padding_left == '75px') || (a1.Padding_left == '10px') || ((a1.Padding_left == '100px'))) { break; }

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
    // this.count++
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
    const arrayWithValuesRemoved1 = qdata.filter((value, i) => !indexSet1.has(i)
    );

    this.qsummarydata = arrayWithValuesRemoved1

  }
  delete_month(idex, qdata) {
    let a = []
    this.newrowlen = this.newrowlen - 1

    a.push(idex)
    const indexSet1 = new Set(a);
    const arrayWithValuesRemoved1 = qdata.filter((value, i) => !indexSet1.has(i)
    );



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
  save_draft(data, data1, status, keyvalues) {

    if (this.type == 'Quarterly') {
      let a11 = []
      for (let i = 0; i < data1.length; i++) {
        let a1 = data1[i]
        if ((data1[i].Padding_left == '120px') && (data1[i].change_flag == 'Y'))
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
            "branch_id": this.searchDatas.branch_id,
            "supplier_id": supplier_id,
            "sectorname": this.searchDatas.sectorname,
            "masterbusinesssegment_name": this.masterbusinesssegment_name_params,
            "bs_name": this.searchDatas.bs_name,
            "cc_name": this.searchDatas.cc_name,
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
      this.set_budgetbuiler(ae1,keyvalues)
    }


    if (this.type == 'Monthly') {
      let a11 = []
      for (let i = 0; i < data.length; i++) {
        let a1 = data[i]
        // change_flag
        if((data[i].Padding_left == '120px') && ((data[i].status==6) || (data[i].status==1))){
          a11.push(a1)

        }
        if ((data[i].Padding_left == '120px') && ((data[i].status==0) || (data[i].status==-1)) && (data[i].change_flag == 'Y')){
          a11.push(a1)

        }


      }
      console.log("change value status 0=>",a11)

      let input_ary = []

      for (let i = 0; i < a11.length; i++) {
        let tran_month = 4

        let month_ary = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
        for (let j = 0; j < 12; j++) {
          let myArr = this.fyer.toString().split("-");
          let traninput_yr = "20" + (parseInt(myArr[1]))
          // let mfinyr = "FY" + (parseInt(myArr[1])) + "-" + (parseInt(myArr[1]) + 1)
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
            if (a11[i].status == -1) {


              supplier_id = '-1'
              subcat_id = a11[i].apsubcat_id
              expence_id = a11[i].apexpense_id
            } else {
              supplier_id = '0'
              subcat_id = a11[i].apsubcat_id
              expence_id = a11[i].apexpense_id
            }

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
            "finyear": this.searchDatas.finyear,
            "quarter": qtr_count,
            "transactionmonth": tran_month,
            "transactionyear": traninput_yr,
            "branch_id": this.searchDatas.branch_id,
            "supplier_id": supplier_id,
            "sectorname": this.searchDatas.sectorname,
            "masterbusinesssegment_name": this.searchDatas.masterbusinesssegment_name,
            "bs_name": this.searchDatas.bs_name,
            "cc_name": this.searchDatas.cc_name,
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
      console.log("ae1=>",ae1)
      this.set_budgetbuiler(ae1,keyvalues)
    }

  }
  @ViewChild('closepopup') closebutton;

  private set_budgetbuiler(prokeyvalue,keyvalues) {

    if (this.branchdetails.code == '9999') {
      this.pprSearchForm.value.branchid = this.branchdetails


    }
    // 
    // if (prokeyvalue.data.length == 0) {
    //   this.toastr.warning('', 'Please Fill Supplier For Any Subcat And Then Submit', { timeOut: 1500 });
    //   return false;
    // }
    if (this.approverForm.value.remarks == "" && prokeyvalue.data[0].status != 0) {
      this.toastr.warning('', 'Please Filled The Remarks', { timeOut: 1500 });
      return false;


    }

    // status change
    let draft_set={
      "branch_id": this.searchDatas.branch_id,
      "finyear": this.searchDatas.finyear,
      "year_term": this.type,
      "divAmount": this.amountval_type,
      "sectorname": this.searchDatas.sectorname,
      "masterbusinesssegment_name": this.searchDatas.masterbusinesssegment_name,
      "bs_name": this.searchDatas.bs_name,
      "cc_name": this.searchDatas.cc_name
    }
  

    this.SpinnerService.show()
    this.dataService.set_Budgetbuilder(prokeyvalue, this.amountval_type)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["message"];
        this.approverForm.controls['remarks'].reset('')

        if (datas == 'CREATED SUCCESS') {
          if (keyvalues=='created') {
            this.dataService.budget_draft_set(draft_set)
              .subscribe((results: any[]) => {
                let datas = results["message"];
                console.log("message=>",datas)
              })
            this.toastr.success('', 'Successfully Created', { timeOut: 1500 });
            this.closebutton.nativeElement.click();
            return false;

          } if(keyvalues=='draft') {
            this.toastr.success('', 'Save As Draft', { timeOut: 1500 });
            this.closebutton.nativeElement.click();
            return false;


          }
        } if (results["status"] == 'Failed') {
          this.toastr.warning('', datas, { timeOut: 1500 });
          return false;
        }


      },
        error => {
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
    this.pprSearchForm.controls['status_id'].reset('')
    for (let exp of this.levelslist) {
      exp['expanded'] = false
    }
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
  ind_val
  popupsummary(ind, data, summarydata) {
    this.newrowlen = 0

    this.ind_val = ind
    this.bbname = data.name
    this.expid = data.expense_id
    this.subid = data.subcat_id
    this.supplierdata = []
    // summarydata[ind].tree_flag = 'N'
    this.supplierall.reset('')
    this.supplier_val.reset('')
    // this.getsupplier()

    this.popupsuplier.nativeElement.click()


  }


  text
  filtersipplier() {

    let prokeyvalue: String = "";
    this.get_all_supplier(prokeyvalue);
    this.supplierall.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.ppr_getall_supplier(1, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierAllLists = results['data'];

      })
  }
  exid
  suid
  @ViewChild('popupsuplier') popupsuplier;
  @ViewChild('supplierAuto') supplierAuto: any;
  @ViewChild('autoComplete') autoComplete: MatAutocomplete;
  getsupplier() {



    this.exid
    this.suid

    var supplier = {
      "apinvoicebranch_id": this.searchDatas.branch_id,

      // "status_id": this.pprSearchForm.value.status_id,
      "apexpense_id": this.expid,
      "apsubcat_id": this.subid,
      "masterbusinesssegment_name": this.searchDatas.masterbusinesssegment_name,
      "sectorname": this.searchDatas.sectorname,
      "finyear": this.searchDatas.finyear,
      "bs_name": this.searchDatas.bs_name,
      "cc_name": this.searchDatas.cc_name
    }

    if (this.supplierdata.length === 0) {
      this.SpinnerService.show()
      this.dataService.ppr_supplier(1, supplier)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.SpinnerService.hide()
          this.supplierLists = results["data"];
          this.supplierdata = results['data'];
          if (this.supplierdata.length != 0) {
            // this.popupsuplier.nativeElement.click()

          } else {

            this.toastr.warning('', 'data not found! ', { timeOut: 1500 });
            return false;
          }
          this.exid = this.expid
          this.suid = this.subid

        },
          error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          })
    }

  }
  @ViewChild('supplierAll') supplierAll: any;
  @ViewChild('supplierautoComplete') supplierautoComplete: MatAutocomplete;

  autocompletsupplierScroll() {
    this.currentpage = 1
    this.has_next = true
    this.has_previous = true
    setTimeout(() => {
      if (
        this.supplierautoComplete &&
        this.autocompleteTrigger &&
        this.supplierautoComplete.panel
      ) {
        fromEvent(this.supplierautoComplete.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.supplierautoComplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.supplierautoComplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.supplierautoComplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.supplierautoComplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.ppr_getall_supplier(this.currentpage + 1, this.supplierAll.nativeElement.value)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.supplierAllLists = this.supplierAllLists.concat(datas);
                    // this.supplierAllLists = results["data"];
                    // 
                    if (this.supplierAllLists.length >= 0) {
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
  supplierdata: any[] = []
  supplierLists: ItemList[] = []

  selectedItems: ItemList[] = new Array<ItemList>();
  supplierall = new FormControl()
  focused = false;
  isAllSelected = false;

  supplier_data: any[] = []
  supplier_Lists: SupplierList[] = []
  supplier_val = new FormControl()
  totalval = []
  selectedAllItems: SupplierList[] = new Array<SupplierList>();
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
    // }
  }

  optionClicked(event: Event, item: ItemList) {
    event.stopPropagation();
    this.toggleSelection(item);
  }
  selectedid = []
  toggleSelection(item: ItemList) {

    this.isAllSelected = item.selected
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedItems.push(item);
      // this.selectedid.push
      if (this.supplierLists.length == this.selectedItems.length) {

        this.isAllSelected = true
      }
    } else {
      this.isAllSelected = false

      var indselect = this.selectedItems.findIndex(value => value['supplier_id'] === item['supplier_id']);

      this.selectedItems.splice(indselect, 1);
    }
  }
  toggleSelectionselect(event) {
    // this.selectAll=!this.selectAll
    this.selectAll = event.checked


  }
  selectallsupplier(event){
    this.selectsupplier = event.checked
    console.log(event)
    this.selectedItems = []
    if (this.selectsupplier == true) {
      this.selecteditems = this.supplierLists;
      // this.supplierLists = [...this.supplierLists];
      console.log("true", this.selectsupplier, this.supplierLists)

    } else {
      console.log("false", this.selectsupplier, this.supplierLists)
      this.supplierLists = []
      this.selectedItems = []
      this.selecteditems = [];

    }
  }
  // all supplier
  supplierAlldata: any[] = []
  supplierAllLists: SupplierList[] = []
  supplierdatafilter: any[] = []
  selectAllItems: SupplierList[] = new Array<SupplierList>();

  get_all_supplier(prokeyvalue) {


    // if (this.supplierAlldata.length == 0) {
      // let prokeyvalue = ''
      this.SpinnerService.show()
      this.dataService.ppr_getall_supplier(1, prokeyvalue)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.SpinnerService.hide()
          this.supplierAllLists = results["data"];
          this.supplierAlldata = results['data'];
          this.supplierdatafilter = results['data']
          if (this.supplierAlldata.length != 0) {
            // this.popupsuplier.nativeElement.click()

          } else {

            this.toastr.warning('', 'data not found! ', { timeOut: 1500 });
            return false;
          }
          this.exid = this.expid
          this.suid = this.subid

        },
          error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          })
    // }

  }
  public removedSupplierselect(pro: SupplierList): void {
    this.AllSupplierSelection(pro)
  }

  optionSupplierClicked(event: Event, item: SupplierList) {
    event.stopPropagation();
    this.AllSupplierSelection(item);
  }


  AllSupplierSelection(item: ItemList) {

    this.isAllSelected = item.selected
    item.selected = !item.selected;
    if (item.selected) {
      this.selectAllItems.push(item);
      // this.selectedid.push
      if (this.supplierAllLists.length == this.selectAllItems.length) {

        this.isAllSelected = true
      }
    } else {
      this.isAllSelected = false

      var indselect = this.selectAllItems.findIndex(value => value['id'] === item['id']);

      this.selectAllItems.splice(indselect, 1);
    }
  }
  closePopup() {
    this.selectedid=[]
    this.supplierAlldata = []
    this.supplierAllLists = []
    this.selectAllItems = []
    this.selectedItems = []
    this.isAllSelected = false
    this.selectAll = false
    this.selectsupplier=false
    this.supplierLists = []
  }
  closesearchPopup() {
    if (this.branchdetails.code == '9999') {
      this.pprSearchForm.value.branchid = this.branchdetails


    }
    // this.pprSearchForm.value.branchid=this.branchid
    // 
    // 


    this.approverForm.controls['remarks'].reset('')


  }
  closesearchpopup() {
    if (this.branchdetails.code == '9999') {
      this.pprSearchForm.value.branchid = this.branchdetails


    }
    // this.pprSearchForm.value.branchid=this.branchid







  }
  @ViewChild('closepop') closepop;

  submit_subcat(pprSearch, data, e) {

    if (this.selecteditems != undefined) {
      this.selectedItems = this.selecteditems
    }







    for (let selectedItems of this.selectedItems) {

      this.selectedid.push(selectedItems['supplier_id'])

    }
    for (let supplier of this.selectAllItems) {
      this.selectedid.push(supplier['id'])
    }
    // if(this.supplierdata.length==0){
    //   this.toastr.warning('', 'data not found! ', { timeOut: 1500 });
    //   return false;
    // }
    if (this.selectedid.length == 0) {
      this.toastr.warning('', 'Please Select The Supplier  ', { timeOut: 1500 });
      return false;

    }
    let subcatdata = {
      // "branch_id": this.pprSearchForm.value.branch_id,
      "apinvoicebranch_id": this.searchDatas.branch_id,
      "status_id": this.searchDatas.status_id,
      "divAmount": this.searchDatas.divAmount,
      "apexpense_id": this.expid,
      "apsubcat_id": this.subid,
      "masterbusinesssegment_name": this.searchDatas.masterbusinesssegment_name,
      "sectorname": this.searchDatas.sectorname,
      "yearterm": this.searchDatas.year_term,
      "finyear": this.searchDatas.finyear,
      "bs_name": this.searchDatas.bs_name,
      "cc_name": this.searchDatas.cc_name,
      "supplier_id": this.selectedid

    }
    this.SpinnerService.show()
    this.dataService.submit_subcat(subcatdata)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()


        let summary = results['data']
        var datas

        for (var val of summary) {
          val['expand'] = true


          val['subid'] = this.subid

          data.splice(this.ind_val + 1, 0, val);



        }


        datas = this.summarydata.filter((value, index, array) =>
          !array.filter((v, i) =>
            JSON.stringify(value['supplier_id']) == JSON.stringify(v['supplier_id']) && value.Padding_left == "120px" && value['apsubcat_id'] == v['apsubcat_id'] && v['expand'] == true && i < index
          ).length);



        this.selectedid = []
        data[this.ind_val + 1].tree_flag = 'N'


        this.closepop.nativeElement.click();
        this.selectedItems = []
        this.isAllSelected = false
        this.selectAll = false
        this.selectsupplier=false
        this.supplierLists = []
        this.supplierAlldata = []
        this.supplierAllLists = []
        this.selectAllItems = []
        this.summarydata = datas

      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
  }
  statusVal: any = []
  status_droup() {
    this.dataService.status_filter()
      .subscribe((results: any[]) => {

        let data = results['data']
        this.statusVal = data
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
  }
  public displayfnstatus(status?: statusList): string | undefined {
    return status ? status.status : undefined;

  }
  remarks_val
  @ViewChild("popupreview") popupreview: any
  exampleremarks: boolean
  remarks(val) {
    this.pprname = val.name

    var remaks_key = { "remark_key": val.remark_key }
    this.SpinnerService.show();


    this.dataService.budgetremarks(remaks_key)
      .subscribe((results: any[]) => {
        this.exampleremarks = true
        this.SpinnerService.hide();


        let data = results['data']
        this.remarks_val = data
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })

  }
  levelslist = [
    { name: "Level 0-Income", expanded: false },
    { name: "Level 1-HR Cost", expanded: false },
    { name: "Level 2", expanded: false },

  ]
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

        }
      }
      if (leveldata.Padding_left == '100px') {
        for (let i = a2; i < levelsonedatas.length; i++) {
          let a1 = levelsonedatas[i]
          if (levelsonedatas[i].title == "Main Category" || levelsonedatas[i].title == "Sub Category") {
            a.push(i)

          }

          // a.push(i) 

          if ((a1.Padding_left == '100px') || (a1.Padding_left == '50px') || (a1.Padding_left == '10px')) { break; }

        }
      }
      if (leveldata.Padding_left == '150px') {
        for (let i = a2; i < levelsonedatas.length; i++) {
          let a1 = levelsonedatas[i]
          // a.push(i) 
          if (levelsonedatas[i].title == "Sub Category") {
            a.push(i)

          }
          if ((a1.Padding_left == '150px') || (a1.Padding_left == '100px') || (a1.Padding_left == '50px') || (a1.Padding_left == '10px')) { break; }

        }
      }
      // a.pop()



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


        this.levelsonedatas = arrayWithValuesRemoved;


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
      // 
    } else {

      if (leveldata.Padding_left == '50px') {

        let alldatas = levelsonedatas



        // 

        var level4a = {
          branch_id: "",
          bs_code: "",
          cc_code: "",
          level_id: leveldata.level_id,
          expense_id: leveldata.expense_id,
          divAmount: this.searchDatas.divAmount,
          expensegrp_individual: leveldata.name,
          finyear: this.searchDatas.finyear,
          bizname: "",
          sectorname: this.searchDatas.sectorname.name,
          yearterm: this.searchDatas.year_term
        }

        // 
        // if(this.dataaexpone===true){


        // let e=j+1

        if (leveldata.re == undefined) {

        } else {

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


                // 
                // this.levelsdatavalueone.push({title:'expance group'})

                // this.aindex.push(i+1)
                // i+1
              }
              // let datasValue = alldatas.filter((value, index, array) =>
              //   !array.filter((v, i) => JSON.stringify(value['expense_id']) == JSON.stringify(v['expense_id']) && value.Padding_left == "100px" && i < index).length);
              // 
              // this.summarydata = datasValue

              levelsonedatas = alldatas

              // this.title="expance group"

            }
            if (results['data'].length == 0) {
              this.toastr.warning('', 'No Data Found', { timeOut: 1500 });

            }
          },
            error => {
              this.errorHandler.handleError(error);
              this.SpinnerService.hide();
            })







      }
      if ((leveldata.Padding_left == '100px')) {

        this.levelscategory(level_index, ind, leveldata, levelsonedatas)

      }
      if (leveldata.Padding_left == '150px') {

        this.levelssubcat(level_index, ind, leveldata, levelsonedatas)
      }
    }

  }

  levelssubcat(level_index, levelexp_index, leveldata, levelsonedatas) {
    var sub_category = {

      branch_id: "",
      bs_code: "",
      cc_code: "",
      level_id: leveldata.level_id,
      expense_id: leveldata.expense_id,
      divAmount: this.searchDatas.divAmount,
      finyear: this.searchDatas.finyear,
      bizname: "",
      sectorname: this.searchDatas.sectorname.name,
      yearterm: this.searchDatas.year_term,
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


        this.dataaexpone = false
        levelsonedatas[levelexp_index].tree_flag = 'N'
        let levelsdatavalue
        levelsdatavalue = results['data']
        if (results['data'].length == 0) {
          this.toastr.warning('', 'No Data Found', { timeOut: 1500 });

        }

        for (let re of levelsdatavalue) {
          levelsonedatas.splice(levelexp_index + 1, 0, re);
          re['title'] = "Sub Category"

          // this.aindex.push(levelexp_index+1)

        }


      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })

  }

  levelscategory(i, expand_index, leveldata, levelsonedatas) {

    var cat_json = {
      branch_id: "",
      bs_code: "",
      cc_code: "",
      level_id: leveldata.level_id,
      expense_id: leveldata.expense_id,
      divAmount: this.searchDatas.divAmount,
      finyear: this.searchDatas.finyear,
      bizname: "",
      sectorname: this.searchDatas.sectorname.name,
      yearterm: this.searchDatas.year_term
    }

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

      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })


  }
  expant_level(i, level) {

    this.expand = level.expanded

    if ((this.pprSearchForm.value.finyear === undefined) || (this.pprSearchForm.value.finyear === '')) {

      this.toastr.warning('', 'Please Select Finyear', { timeOut: 1500 });
      return false;
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
        finyear: this.searchDatas.finyear,
        yearterm: this.searchDatas.year_term,
        divAmount: this.amountval_type,
        // divAmount: this.searchDatas.divAmount,
        branch_id: "",
        sectorname: this.searchDatas.sectorname.name,
        bizname: "",
        bs_code: "",
        cc_code: "",
        expensegrp: []
      }


      this.SpinnerService.show()

      this.dataService.getdata_level(levelzero).pipe(
        debounceTime(450)
      )
        .subscribe((results: any[]) => {
          this.SpinnerService.hide()

          this.dataaexp = true
          this.levelsdatas = results['data']


          if (results['data'].length == 0) {
            this.toastr.warning('', 'No Data Found', { timeOut: 1500 });

          }
          for (let level of this.levelsdatas) {
            level['title'] = "Expense Group"
          }
          // this.levelshow=false
        },
          error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          })
      // this.levelval()
      // this.levedisplay()

      // this.levelshow=false
    }
    if (i == 1) {
      var levelone = {
        level_id: i + 2,
        finyear: this.searchDatas.finyear,
        yearterm: this.searchDatas.year_term,
        divAmount: this.amountval_type,
        branch_id: "",
        // branch_id: this.searchDatas.branch_id.id,
        sectorname: this.searchDatas.sectorname.name,
        bizname: "",
        bs_code: "",
        // bs_code: this.searchDatas.bs_id.id,
        cc_code: "",
        // cc_code: this.searchDatas.cc_id.id,
        expensegrp: []
      }

      if (this.expand == false) {
        this.SpinnerService.show()

        this.dataService.getdata_level(levelone)
          .subscribe((results: any[]) => {
            this.SpinnerService.hide()

            this.levelsonedatas = results['data']

            // this.leveloneshow = false
            if (results['data'].length == 0) {
              this.toastr.warning('', 'No Data Found', { timeOut: 1500 });

            }
            for (let indexlevel of this.levelsonedatas) {
              indexlevel['title'] = "Expense Group"
            }
          },
            error => {
              this.errorHandler.handleError(error);
              this.SpinnerService.hide();
            })

      }
      else {
        this.levelsonedatas = []

      }



    }
    if (i == 2) {


      leveltwo = {
        level_id: i,
        finyear: this.searchDatas.finyear,
        yearterm: this.searchDatas.year_term,
        divAmount: this.searchDatas.divAmount,
        branch_id: this.searchDatas.branch_id.id,
        sectorname: this.searchDatas.sectorname.name,
        bizname: this.searchDatas.businesscontrol.name,
        bs_code: this.searchDatas.bs_id.id,
        cc_code: this.searchDatas.cc_id.id,
        expensegrp: []
      }
      if (this.expand == false) {


        this.SpinnerService.show()

        this.dataService.getdata_level(leveltwo)
          .subscribe((results: any[]) => {
            this.SpinnerService.hide()

            this.levelstwodatas = results['data']

            if (results['data'].length == 0) {
              this.toastr.warning('', 'No Data Found', { timeOut: 1500 });

            }
            // this.leveltwoshow = false
            for (let levelstwodatas of this.levelstwodatas) {
              levelstwodatas['title'] = "Expense Group"
            }
          })
      } else {
        this.levelstwodatas = []
      }

    }

    if (this.type == 'Monthly') {

      this.headercheckone = false;
      this.headercheck = true
    }
    else {


      this.headercheckone = true;
      this.headercheck = false
    }
  }

}
