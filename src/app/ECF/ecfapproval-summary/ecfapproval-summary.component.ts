import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { EcfService } from '../ecf.service';
import { ShareService } from '../share.service';
import { NotificationService } from '../notification.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';


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
  selector: 'app-ecfapproval-summary',
  templateUrl: './ecfapproval-summary.component.html',
  styleUrls: ['./ecfapproval-summary.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class EcfapprovalSummaryComponent implements OnInit {
  ecfapprovalSearchForm: FormGroup
  tomorrow = new Date()
  TypeList: any

  approvalList: any
  has_pagenext = true;
  has_pageprevious = true;
  isapprovalpage: boolean = true;
  approvalpresentpage: number = 1;
  approvalpagesize = 10;

  Supplierlist: Array<supplierListss>
  Branchlist: Array<branchListss>;
  Employeelist: Array<employeeListss>;
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;

  @ViewChild('suppliertype') matsuppAutocomplete: MatAutocomplete;
  @ViewChild('suppInput') suppInput: any;
  @ViewChild('branchtype') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('emptype') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;


  constructor(private fb: FormBuilder, private ecfservice: EcfService, private shareservice: ShareService,
    private notification: NotificationService, private toastr: ToastrService, private router: Router,
    private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.ecfapprovalSearchForm = this.fb.group({
      crno: [''],
      ecftype: [''],
      invno: [''],
      supplier_id: [''],
      employee_id: [''],
      branch_id: [''],
      fromdate: [''],
      todate: [''],
      minamt: [''],
      maxamt: ['']
    })
    this.getapprovalsummary();
    this.getecftype();

    let parentkeyvalue: String = "";
    this.getsupplierdropdown(parentkeyvalue);
    this.ecfapprovalSearchForm.get('supplier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')

        }),

        switchMap(value => this.ecfservice.getsupplierscroll(value, 1)
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

    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.ecfapprovalSearchForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')

        }),

        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
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

    let empkeyvalue: String = "";
    this.employeedropdown(empkeyvalue);
    this.ecfapprovalSearchForm.get('employee_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
         

        }),

        switchMap(value => this.ecfservice.getemployeescroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Employeelist = datas;
        
      })
  }

  getecftype() {
    this.ecfservice.getecftype()
      .subscribe(result => {
        this.TypeList = result["data"]
      })


  }

  public displayFnsupplier(suppliertype?: supplierListss): string | undefined {

    return suppliertype ? suppliertype.name : undefined;
  }

  get suppliertype() {
    return this.ecfapprovalSearchForm.get('supplier_id');
  }

  private getsupplierdropdown(parentkeyvalue) {
    this.ecfservice.getsupplier(parentkeyvalue)
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
                this.ecfservice.getsupplierscroll(this.suppInput.nativeElement.value, this.currentpage + 1)
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

  public displayFnbranch(branchtype?: branchListss): string | undefined {

    return branchtype ? branchtype.codename : undefined;
  }

  get branchtype() {
    return this.ecfapprovalSearchForm.get('branch_id');
  }

  private branchdropdown(branchkeyvalue) {
    this.ecfservice.getbranch(branchkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
       

      })
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
                this.ecfservice.getbranchscroll(this.branchInput.nativeElement.value, this.currentpage + 1)
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

  public displayFnemployee(emptype?: employeeListss): string | undefined {

    return emptype ? emptype.full_name : undefined;
  }

  get emptype() {
    return this.ecfapprovalSearchForm.get('employee_id');
  }

  private employeedropdown(empkeyvalue) {
    this.ecfservice.getemployee(empkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Employeelist = datas;
       

      })
  }

  employeeScroll() {
    setTimeout(() => {
      if (
        this.matempAutocomplete &&
        this.matempAutocomplete &&
        this.matempAutocomplete.panel
      ) {
        fromEvent(this.matempAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matempAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matempAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matempAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matempAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.getemployeescroll(this.empInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Employeelist.length >= 0) {
                      this.Employeelist = this.Employeelist.concat(datas);
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




  getapprovalsummary() {
    this.ecfservice.getapproversummary()
      .subscribe(result => {
        let datas = result["data"]
        this.approvalList = datas;
       

      })
  }



  approversearch() {
    this.ecfservice.approvalsummarySearch(this.ecfapprovalSearchForm.value,1)
      .subscribe(result => {
        this.approvalList = result["data"]
       
      })
  }


  reset() {
    this.ecfapprovalSearchForm.controls['crno'].reset(""),
      this.ecfapprovalSearchForm.controls['ecftype'].reset(""),
      this.ecfapprovalSearchForm.controls['invno'].reset(""),
      this.ecfapprovalSearchForm.controls['supplier_id'].reset(""),
      this.ecfapprovalSearchForm.controls['employee_id'].reset(""),
      this.ecfapprovalSearchForm.controls['branch_id'].reset(""),
      this.ecfapprovalSearchForm.controls['fromdate'].reset(""),
      this.ecfapprovalSearchForm.controls['todate'].reset(""),
      this.ecfapprovalSearchForm.controls['minamt'].reset(""),
      this.ecfapprovalSearchForm.controls['maxamt'].reset(""),
      this.getapprovalsummary()

  }

  ecfheaderid: any
  showapproveview(data) {
    this.ecfheaderid = data.id
    this.shareservice.ecfapproveheader.next(this.ecfheaderid)
    this.router.navigate(['ECF/headerview'])
  }

}
