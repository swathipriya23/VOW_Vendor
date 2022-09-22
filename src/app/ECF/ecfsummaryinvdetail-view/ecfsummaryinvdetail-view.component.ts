import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
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

export interface branchListss {
  name: string;
  codename: string;
  id: number;
}
export interface approverListss {
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
  selector: 'app-ecfsummaryinvdetail-view',
  templateUrl: './ecfsummaryinvdetail-view.component.html',
  styleUrls: ['./ecfsummaryinvdetail-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class EcfsummaryinvdetailViewComponent implements OnInit {

  invheaderdata: any
  creditdetail: any
  debitdetail: any
  invoiceheaderdetailForm: FormGroup
  SubmitApproverForm: FormGroup
  radiocheck: any[] = [
    { value: 1, display: 'Yes' },
    { value: 0, display: 'No' }
  ]
  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  Branchlist: Array<branchListss>;
  Approverlist: Array<approverListss>;
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;

  @ViewChild('branchtype') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('approvertype') matappAutocomplete: MatAutocomplete;
  @ViewChild('approverInput') approverInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  echheaderid: any

  constructor(private fb: FormBuilder, private ecfservice: EcfService, private shareservice: ShareService,
    private notification: NotificationService, private toastr: ToastrService, private router: Router,
    private datepipe: DatePipe) { }

  ngOnInit(): void {
    let data = this.shareservice.ecfheader.value
    this.echheaderid = data
    this.invoiceheaderdetailForm = this.fb.group({
      raisorcode: [''],
      raisorname: [''],
      transbranch: [''],
      gst: [''],
      suppcode: [''],
      suppname: [''],
      suppbranch: [''],
      suppgst: [''],
      invoiceno: [''],
      invoicedate: [''],
      taxableamt: [''],
      invoiceamt: ['']

    })

    this.SubmitApproverForm = this.fb.group({
      id: this.echheaderid,
      branch_id: [''],
      approver_id: [''],
      remarks: ['']

    })
    this.getinvoicedetails();

    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.SubmitApproverForm.get('branch_id').valueChanges
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

  //   let approverkeyvalue: String = "";
  //   this.approverdropdown(approverkeyvalue);
  //   this.SubmitApproverForm.get('approver_id').valueChanges
  //     .pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //         // console.log('inside tap')

  //       }),

  //       switchMap(value => this.ecfservice.getapproverscroll(value, 1)
  //         .pipe(
  //           finalize(() => {
  //             this.isLoading = false
  //           }),
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.Approverlist = datas;
       
  //     })
  }


  public displayFnbranch(branchtype?: branchListss): string | undefined {

    return branchtype ? branchtype.codename : undefined;
  }

  get branchtype() {
    return this.SubmitApproverForm.get('branch_id');
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


  public displayFnapprover(approvertype?: approverListss): string | undefined {

    return approvertype ? approvertype.full_name : undefined;
  }

  get approvertype() {
    return this.SubmitApproverForm.get('approver_id');
  }

  // private approverdropdown(approverkeyvalue) {
  //   this.ecfservice.getapprover(approverkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.Approverlist = datas;
       

  //     })
  // }

  // approverScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matappAutocomplete &&
  //       this.matappAutocomplete &&
  //       this.matappAutocomplete.panel
  //     ) {
  //       fromEvent(this.matappAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matappAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matappAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matappAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matappAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.ecfservice.getapproverscroll(this.approverInput.nativeElement.value, this.currentpage + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   if (this.Approverlist.length >= 0) {
  //                     this.Approverlist = this.Approverlist.concat(datas);
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

  invamount: any
  getinvoicedetails() {
    this.ecfservice.getinvoicedetailsummary(this.echheaderid)
      .subscribe(result => {
        let datas = result
        this.invheaderdata = result["Invheader"]


        let test = this.invheaderdata
        for (var i = 0; i < test.length; i++) {
          let overallinvoicedtl = test[i].invoicedtl

          for (var j = 0; j < overallinvoicedtl.length; j++) {
            this.invamount = overallinvoicedtl[j].totalamount

          }
        }


        this.invoiceheaderdetailForm.patchValue({
          raisorcode: datas.raiserbranch.code,
          raisorname: datas.raisername,
          gst: this.invheaderdata[0].invoicegst,
          suppcode: this.invheaderdata[0].supplier_id.code,
          suppname: this.invheaderdata[0].supplier_id.name,
          suppgst: this.invheaderdata[0].supplier_id.gstno,
          invoiceno: this.invheaderdata[0].invoiceno,
          invoicedate: this.invheaderdata[0].invoicedate,
          taxableamt: this.invheaderdata[0].invoiceamount,
          invoiceamt: this.invheaderdata[0].totalamount

        })
      })
  }
  SubmitForm() {
    if (this.SubmitApproverForm.value.remarks === "") {
      this.toastr.error('Please Enter Purpose');
      return false;
    }
    this.ecfservice.ecfapprove(this.SubmitApproverForm.value)
      .subscribe(result => {
        if (result.status) {
          this.notification.showSuccess('Approved Successfully')
          this.router.navigate(['ECF/ecfapproval'])
          this.onSubmit.emit();
        } else {
          return false;
        }
      })

  }
  rejectForm() {
    if (this.SubmitApproverForm.value.remarks === "") {
      this.toastr.error('Please Enter Purpose');
      return false;
    }
    this.ecfservice.ecfreject(this.SubmitApproverForm.value)
      .subscribe(result => {
        if (result.status) {
          this.notification.showSuccess('Rejected Successfully')
          this.router.navigate(['ECF/ecfapproval'])
          this.onSubmit.emit();
        } else {
          return false;
        }
      })

  }

  back() {
    this.onCancel.emit()
  }
  debitrecords: any
  getinvdtlid(id) {

    this.ecfservice.getinvdetailsrecords(id)
      .subscribe(results => {
        this.debitrecords = results['debit']

      })
  }
}
