import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApShareServiceService } from '../ap-share-service.service'
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
  selector: 'app-ap-header-summary',
  templateUrl: './ap-header-summary.component.html',
  styleUrls: ['./ap-header-summary.component.scss'],
  providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe]
})

export class ApHeaderSummaryComponent implements OnInit {
  inward_id=this.shareservice.inward_id.value;
  inward_completed : number
  invoice_count=this.shareservice.invoice_count.value;
  apHdrSummary : any
  inwardHdrNo =this.shareservice.inwardHdrNo.value
  presentpage: number = 1;
  identificationSize: number = 10;
  constructor(private service: ApService, private formBuilder: FormBuilder,private router: Router,  
    private shareservice: ApShareServiceService, private datePipe: DatePipe,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {

    this.ecfSummary()
  }
  ecfSummary()
  {
    this.spinner.show();
  
    this.service.getECFSummary(this.inward_id)
    .subscribe(result => {
      this.spinner.hide();
  
      console.log(result);
      this.apHdrSummary=result["data"]
      console.log("inv Id",this.inward_id)
      console.log("ECF summary details", this.inward_id," + " ,this.apHdrSummary) 
      for(let i =0; i< this.apHdrSummary.length; i++)
      {
        let num: number = +this.apHdrSummary[i].apamount
        let temp = new Intl.NumberFormat("en-GB").format(num); 
        temp = temp ? temp.toString() : '';
        this.apHdrSummary[i].apamount = temp
      }
      this.inward_completed = this.apHdrSummary.length
    })
  }

  addSection()
  { 
    this.router.navigate(['/ap/apHeader'], {queryParams:{routeflag : 1, apheader_id : "", inward_completed : this.inward_completed}, skipLocationChange: true });
  }

  invHdrView(id,amt)
  {
    this.shareservice.apAmount.next(amt);
    this.router.navigate(['/ap/apHeader'],  {queryParams:{comefrom : "apsummary", apheader_id : id, inward_completed : this.inward_completed}, skipLocationChange: true });
  }

  backform() {
    this.router.navigate(['/ap/apsummary'], { skipLocationChange: true });
    
  }
 


























































  appovrout(id)
  {
    console.log("hai")
    this.router.navigate(['/ap/approvescreen'], { skipLocationChange: true });
    this.shareservice.hedid.next(id)
    this.shareservice.headerflag.next(true)
    this.shareservice.routflag.next(false)
    this.shareservice.paymentflage.next(false)
    this.shareservice.commonsummaryroute.next(false)
  }



  approve(id)
  {
    console.log("approve");
    this.router.navigate(['/ap/approvescreen'], { skipLocationChange: true });
    this.shareservice.hedid.next(id)
  }
}
