import { Component, OnInit } from '@angular/core';
import { EcfService } from '../ecf.service';
import { ShareService } from '../share.service'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { NotificationService } from '../notification.service';
import { NgxSpinnerService } from "ngx-spinner";

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
  selector: 'app-ecf-summary',
  templateUrl: './ecf-summary.component.html',
  styleUrls: ['./ecf-summary.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class EcfSummaryComponent implements OnInit {
  ecfSearchForm: FormGroup;
  TypeList: any
  StatusList: any

  ecf_summary_data: any;
  has_pagenext = true;
  has_pageprevious = true;
  issummarypage: boolean = true;
  ecfpresentpage: number = 1;
  pagesizeecf = 10;

  crnum: any
  ecftype: any
  supplier: any
  status: any
  minamount: any
  maxamount: any

  tranrecords:any

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: NgxSpinnerService, private ecfservice: EcfService, private shareservice: ShareService
    , private toastr: ToastrService, private datePipe: DatePipe, private sanitizer: DomSanitizer, private notification: NotificationService) { }

  ngOnInit(): void {
    this.ecfSearchForm = this.fb.group({
      crno: [''],
      ecftype: [''],
      ecfstatus: [''],
      minamt: [''],
      maxamt: [''],

    })
    this.getecfSummaryList();
    this.getecftype();
    this.getecfstatus();
  }

  getecftype() {
    this.ecfservice.getecftype()
      .subscribe(result => {
        this.TypeList = result["data"]
      })
  }
  getecfstatus() {
    this.ecfservice.getecfstatus()
      .subscribe(result => {
        this.StatusList = result["data"]
      })
  }
  getecfSummaryList(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
    this.ecfservice.getecfSummaryDetails(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        
        let datas = results["data"];
        this.ecf_summary_data = datas;
        let datapagination = results["pagination"];
        this.ecf_summary_data = datas;
        if (this.ecf_summary_data.length === 0) {
          this.issummarypage = false
        }
        if (this.ecf_summary_data.length > 0) {
          this.has_pagenext = datapagination.has_next;
          this.has_pageprevious = datapagination.has_previous;
          this.ecfpresentpage = datapagination.index;
          this.issummarypage = true
        }
      })
  }

  nextClickPayment() {
    if (this.has_pagenext === true) {
      this.getecfSummaryList("", 'asc', this.ecfpresentpage + 1, 10)
    }
  }

  previousClickPayment() {
    if (this.has_pageprevious === true) {
      this.getecfSummaryList("", 'asc', this.ecfpresentpage - 1, 10)
    }
  }

  summarysearch() {

    this.ecfservice.ecfsummarySearch(this.ecfSearchForm.value,1)
      .subscribe(result => {

        this.ecf_summary_data = result['data']
      })
  }
  Resetecfinventory() {
    this.ecfSearchForm.controls['crno'].reset(""),
      this.ecfSearchForm.controls['ecftype'].reset(""),
      this.ecfSearchForm.controls['ecfstatus'].reset(""),
      this.ecfSearchForm.controls['minamt'].reset(""),
      this.ecfSearchForm.controls['maxamt'].reset(""),
      this.getecfSummaryList();

  }
  ecfheaderid: any
  showview(data) {
    this.ecfheaderid = data.id
    this.shareservice.ecfheader.next(this.ecfheaderid)
    this.router.navigate(['ECF/summaryview'])
  }
  showedit(data) {
    this.shareservice.ecfheaderedit.next(data.id)
    this.router.navigate(['ECF/inventory'])
  }

  showadd() {
    let data = ''

    this.shareservice.ecfheaderedit.next(data)
    this.router.navigate(['ECF/inventory'])
    return data
  }
  delete(id) {
    this.ecfservice.ecfhdrdelete(id)
      .subscribe(result => {
        this.notification.showSuccess("Deleted Successfully")
        this.getecfSummaryList()
      })

  }

  coverNotedownload(id) {
    this.ecfservice.coverNotedownload(id)
      .subscribe((results) => {
      
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "ExpenseClaimForm.pdf";
        link.click();
      })
  }

}
