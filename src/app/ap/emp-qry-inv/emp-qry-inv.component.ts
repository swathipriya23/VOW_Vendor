import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApShareServiceService } from '../ap-share-service.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApService } from '../ap.service';

const isSkipLocationChange = environment.isSkipLocationChange

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
  selector: 'app-emp-qry-inv',
  templateUrl: './emp-qry-inv.component.html',
  styleUrls: ['./emp-qry-inv.component.scss'],
  providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe]
})

export class EmpQryInvComponent implements OnInit {
  has_next: any;
  has_previous: any;
  currentpage: number = 1;
  presentpage: number = 1;

  identificationSize: number = 10;
  presentIdentification: number = 1;

  isLoading: boolean;
  isSummaryPagination: boolean;

  isInv: boolean
  isDebit: boolean
  isCredit: boolean

  invHdr:any;
  invDetailList:any;
  invDebitList:any;
  invCreditList:any;
  invDebitTot:number;
  invCreditTot:number;

  crNo=this.shareservice.crNo.value;

  constructor(private service: ApService, private formBuilder: FormBuilder,private router: Router,  
    private shareservice: ApShareServiceService, private datePipe: DatePipe,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.service.getEmpQryCrno(this.crNo)
      .subscribe(result => {
        this.invHdr =result;
        this.invDetailList= result['apinvoiceheader'][0]['apinvoicedetails'];
        this.invDebitList= result['apinvoiceheader'][0]['apdebit'];
        this.invCreditList= result['apinvoiceheader'][0]['apcredit'];

      })
    
  }

  invDet() {
    this.isInv = true
    this.isDebit = false
    this.isCredit=false
  }
  debitDet() {
    this.isInv = false
    this.isDebit = true
    this.isCredit=false
  }
  creditDet() {
    this.isInv = false
    this.isDebit = false
    this.isCredit=true
  }

}
