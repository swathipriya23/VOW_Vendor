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
import { ToastrService } from 'ngx-toastr';

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

export interface Status {
  id: string;
  text: string;
}

@Component({
  selector: 'app-inwardsummary',
  templateUrl: './inwardsummary.component.html',
  styleUrls: ['./inwardsummary.component.scss'],
  providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe]
})
export class InwardsummaryComponent implements OnInit {
  inwardHeaderNo : any
  searchData: any;
  inwardSummary: any;
  has_next: any;
  has_previous: any;
  currentpage: number = 1;
  presentpage: number = 1;

  identificationSize: number = 10;
  presentIdentification: number = 1;
  
  status: Array<Status>

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('statusInput') statusInput: any;
  @ViewChild('statusAutoComplete') statusAutocomplete: MatAutocomplete;

  inwardSummarySearch: FormGroup;
  isLoading: boolean;
  isSummaryPagination: boolean;

  apsummary : any
  inward_completed : number

  constructor(private service: ApService, private formBuilder: FormBuilder,private router: Router,  
    private shareservice: ApShareServiceService,private toastr: ToastrService, private datePipe: DatePipe,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.getInward()
    this.inwardSummarySearch = this.formBuilder.group({
      inwardHdrNo: [''],
      airwayNo: [''],
      inwardDate: [''],
      inwardStatus: ['']
    })
  }

  getInward(pageNumber = 1, pageSize = 5) {
    if(this.inwardSummarySearch){
      let inward_search=this.inwardSummarySearch.value
      if((inward_search.inwardDate != null || inward_search.inwardDate != '')  ){
        var inwardDate=this.datePipe.transform(inward_search.inwardDate, 'yyyy-MM-dd')
        this.searchData.inward_date=inwardDate
      }
      this.searchData.inward_hdr_no = inward_search.inwardHdrNo;
      this.searchData.airway_no = inward_search.airwayNo;
      this.searchData.inward_status = inward_search.inwardStatus.id;

      for (let i in this.searchData) 
      {
          if (this.searchData[i] === null || this.searchData[i] === "") {
            delete this.searchData[i];
          }
        }    
      }
    else{
      this.searchData={}
    }

    // this.spinner.show();
    console.log("  searchData  "+this.searchData)
    this.spinner.show();
  
    this.service.getInwardSummary(pageNumber, pageSize, this.searchData)
      .subscribe(result => {
        this.spinner.hide();
  
        this.inwardSummary = result['data']
        console.log("Inward Summary",this.inwardSummary)
        let dataPagination = result['pagination'];
        if (this.inwardSummary.length >= 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isSummaryPagination = true;
        } if (this.inwardSummary <= 0) {
          this.isSummaryPagination = false;
        }        
      },error=>{
        console.log("No data found")
      }            
      )
  }
  private getinward_status(keyvalue) {
    this.service.getInwardStatus(keyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.status = datas;

      })
  }

  public displayFnStatus(Status?: Status): string | undefined {
    return Status ? Status.text : undefined;
  }
  inward_status() {
    let keyvalue: String = "";
    this.getinward_status(keyvalue);
    this.inwardSummarySearch.get('inwardStatus').valueChanges
      .pipe(
        startWith(""),
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),

        switchMap(value => this.service.getInwardStatus(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.status = datas;

      })

  }


  autocompleteScrollStatus() {
    setTimeout(() => {
      if (
        this.statusAutocomplete &&
        this.autocompleteTrigger &&
        this.statusAutocomplete.panel
      ) {
        fromEvent(this.statusAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.statusAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.statusAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.statusAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.statusAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.service.getInwardStatus(this.statusInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.status = this.status.concat(datas);
                    if (this.status.length >= 0) {
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
  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  nextClick() {
    if (this.has_next === true) {

      this.currentpage = this.presentpage + 1
      this.getInward(this.presentpage + 1, 10)
    }
  }

  previousClick() {
    if (this.has_previous === true) {

      this.currentpage = this.presentpage - 1
      this.getInward(this.presentpage - 1, 10)
    }
  }
  
  clearSearch(){
   
    this.inwardSummarySearch.controls['inwardHdrNo'].reset('')
    this.inwardSummarySearch.controls['airwayNo'].reset('')
    this.inwardSummarySearch.controls['inwardDate'].reset('')
    this.inwardSummarySearch.controls['inwardStatus'].reset('')
  }

  ecfHeader(id:any,count:any,inwHdrno: any){
   
    this.shareservice.invoice_count.next(count);
    this.shareservice.inward_id.next(id);
    this.shareservice.inwardHdrNo.next(inwHdrno);
    this.spinner.show();
  
    this.service.getECFSummary(id)
    .subscribe(result => {
      this.spinner.hide();
      if(result.code=="INVALID_DATA")
      {
        this.toastr.error(result.description);
        return false;
      }
      if (result)
      {
        this.apsummary=result["data"]
        this.inward_completed=this.apsummary.length  
        
        if (this.inward_completed > 0)
        {
          this.router.navigate(['/ap/apHeaderSummary'], { skipLocationChange: true });
        }
        else
        {
          this.router.navigate(['/ap/apHeader'], {queryParams:{comefrom : "apsummary",  apheader_id : "", inward_completed : this.inward_completed}, skipLocationChange: true });
        }

      }
      
      }
    )


    
  }

}

