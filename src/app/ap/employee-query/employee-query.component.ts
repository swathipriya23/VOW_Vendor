import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApService } from '../ap.service';
import { ApShareServiceService } from '../ap-share-service.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

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

export interface Type {
  id: string;
  text: string;
}

export interface Branch {
  code: string;
  codename: string;
  id: string;
  name: string;
}
@Component({
  selector: 'app-employee-query',
  templateUrl: './employee-query.component.html',
  styleUrls: ['./employee-query.component.scss'],
  providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe]
})
export class EmployeeQueryComponent implements OnInit {
  searchData: any={}
  empQuery: any;
  has_next: any;
  has_previous: any;
  currentpage: number = 1;
  presentpage: number = 1;

  identificationSize: number = 10;
  presentIdentification: number = 1;

  type: Array<Type>
  branchList: Array<Branch>
  
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('typeInput') typeInput: any;
  @ViewChild('typeAutoComplete') typeAutocomplete: MatAutocomplete;

  @ViewChild('branchInput') branchInput: any;
  @ViewChild('branchAutoComplete') branchAutoComplete: MatAutocomplete;

  frmEmp: FormGroup;
  isLoading: boolean;
  isSummaryPagination: boolean;

  constructor(private service: ApService, private formBuilder: FormBuilder,private router: Router,  
    private shareservice: ApShareServiceService, private datePipe: DatePipe,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.frmEmp = this.formBuilder.group({
      crNo: [''],
      invType: [''],
      supName: [''],
      branch: [''],

      invNo: [''],
      invAmt: [''],
      fromDate: [''],
      toDate: [''],
      airwayNo: ['']
    })

    this.service.getempQuery(1,10)
      .subscribe(result => {
        this.empQuery = result['data']
        console.log("Employee Query",this.empQuery)
        let dataPagination = result['pagination'];
        if (this.empQuery.length >= 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isSummaryPagination = true;
        } if (this.empQuery <= 0) {
          this.isSummaryPagination = false;
        }        
      },error=>{
        console.log("No data found")
      }            
      )
  }

  getQuery(pageNumber = 1, pageSize = 10) {
    if(this.frmEmp){
      let qrysearch=this.frmEmp.value
      if((qrysearch.fromDate != null && qrysearch.fromDate !='')  ){
        var date1=this.datePipe.transform(qrysearch.fromDate, 'yyyy-MM-dd')
        this.searchData.fromdate= date1;
      }

      if((qrysearch.toDate != null && qrysearch.toDate !='')  ){
        var date2=this.datePipe.transform(qrysearch.toDate, 'yyyy-MM-dd')
        this.searchData.todate= date2;
      }
      
      if (qrysearch.crNo!='')
        this.searchData.crno= qrysearch.crNo ;

      if (qrysearch.invType!='')
        this.searchData.aptype= qrysearch.invType;
      
      if (qrysearch.supName!='')
        this.searchData.suppliername= qrysearch.supName;
      
      if (qrysearch.invNo!='')
        this.searchData.invoiceno= qrysearch.invNo;
      
      if (qrysearch.invAmt!='')
        this.searchData.invoiceamount= qrysearch.invAmt;  

        for (let i in this.searchData) {
          if (this.searchData[i] === null || this.searchData[i] === "") {
            delete this.searchData[i];
          }
        }
    }
    else{
      this.searchData={}
    }
    console.log("  searchData  "+this.searchData)
    this.service.getempQuerySrch(pageNumber, pageSize,this.searchData)
      .subscribe(result => {
        this.empQuery = result['data']
        console.log("Employee Query",this.empQuery)
        let dataPagination = result['pagination'];
        if (this.empQuery.length >= 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isSummaryPagination = true;
        } if (this.empQuery <= 0) {
          this.isSummaryPagination = false;
        }        
      },error=>{
        console.log("No data found")
      }            
      )
  }

  private get_type(keyvalue) {
    this.service.getType(keyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.type = datas;

      })
  }

  public displayFnType(Type?: Type): string | undefined {
    return Type ? Type.text : undefined;
  }

  inward_type() {
    let keyvalue: String = "";
    this.get_type(keyvalue);
    this.frmEmp.get('invType').valueChanges
      .pipe(
        startWith(""),
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),

        switchMap(value => this.service.getType(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.type = datas;
      })
  }

  autocompleteScrollType() {
    setTimeout(() => {
      if (
        this.typeAutocomplete &&
        this.autocompleteTrigger &&
        this.typeAutocomplete.panel
      ) {
        fromEvent(this.typeAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.typeAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.typeAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.typeAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.typeAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.service.getType(this.typeInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.type = this.type.concat(datas);
                    if (this.type.length >= 0) {
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
  
   private get_branch(keyvalue) {
    this.service.getBranch(keyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;

      })
  }

  public displayFnBranch(Branch?: Branch): string | undefined {
    return Branch ? Branch.name : undefined;
  }
  
  inward_branch() {
    let keyvalue: String = "";
    this.get_branch(keyvalue);
    this.frmEmp.get('branch').valueChanges
      .pipe(
        startWith(""),
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.service.getBranch(value, 1)
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

  autocompleteScrollBranch() {
    setTimeout(() => {
      if (
        this.branchAutoComplete &&
        this.autocompleteTrigger &&
        this.branchAutoComplete.panel
      ) {
        fromEvent(this.branchAutoComplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.branchAutoComplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.branchAutoComplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.branchAutoComplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.branchAutoComplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.service.getBranch(this.branchInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchList = this.branchList.concat(datas);
                    if (this.branchList.length >= 0) {
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
  
  nextClick() {
    if (this.has_next === true) {

      this.currentpage = this.presentpage + 1
      this.getQuery(this.presentpage + 1, 10)
    }
  }

  previousClick() {
    if (this.has_previous === true) {

      this.currentpage = this.presentpage - 1
      this.getQuery(this.presentpage - 1, 10)
    }
  }
  
  clearSearch(){   
    this.frmEmp.controls['crNo'].reset('')
    this.frmEmp.controls['invType'].reset('')
    this.frmEmp.controls['supName'].reset('')
    this.frmEmp.controls['branch'].reset('')
    this.frmEmp.controls['invNo'].reset('')
    this.frmEmp.controls['invAmt'].reset('')
    this.frmEmp.controls['fromDate'].reset('')
    this.frmEmp.controls['toDate'].reset('')
    this.frmEmp.controls['airwayNo'].reset('')
  }

  invView(crno){
    // setTimeout(()=>{
      
    //   this.spinner.show();
      
    // });
    this.shareservice.crNo.next(crno);
    
    this.router.navigate(['/ap/empqryinv'], { skipLocationChange: true });
  }

}
