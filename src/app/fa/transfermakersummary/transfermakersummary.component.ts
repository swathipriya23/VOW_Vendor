import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Fa3Service } from '../fa3.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { faservice } from '../fa.service';
import { ErrorHandlerService } from '../error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

const isSkipLocationChange = environment.isSkipLocationChange;
export interface empdata{
  id:string;
  full_name:string;
  // code:string;
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

export interface Branch {
  id: string;
  name: string;
  code: number;
}
export interface Asset {
  id: string;
  subcatname: string;
}
export interface AssetDetails {
  id: string;
  barcode: string
}


@Component({
  selector: 'app-transfermakersummary',
  templateUrl: './transfermakersummary.component.html',
  styleUrls: ['./transfermakersummary.component.scss'],
  providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe]
})
export class TransfermakersummaryComponent implements OnInit {
  listofcolumns: string[] = ['S.No', 'Asset Barcode ID', 'Asset Sub-Category', 'Asset Value',
  'Capitalisation Date','Branch From','Branch To','Product Name',
  'Employee Name','Location','Reason','Transfer Status','Status'
];
  dataList:any = [];
  searchData: any;
  assetTransfer: any;
  has_next: any;
  identificationSize: number = 10;
  presentIdentification: number = 1;
  currentpage: number = 1;
  presentpage: number = 1;

  employeeList: Array<Branch>;
  category: Array<Asset>
  assetDetails: Array<AssetDetails>

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('BranchInput') BranchInput: any;
  @ViewChild('branch') matAutocomplete: MatAutocomplete;

  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('categoryref') categoryAutoComplete: MatAutocomplete;

  @ViewChild('AssetInput') AssetInput: any;
  @ViewChild('asset') AssetAutoComplete: MatAutocomplete
  transfermarkersearch: FormGroup;
  isLoading: boolean;
  has_previous: any;
  isSummaryPagination: boolean;
  empdrpdwndata:Array<any>=[];

  constructor(private errorHandler:ErrorHandlerService,private faService: Fa3Service, private formBuilder: FormBuilder,private Faservice:faservice,
    private datePipe: DatePipe,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.getAssetTransfer();
    this.transfermarkersearch = this.formBuilder.group({
      category: [''],
      // ,[RequireMatch]
      barcode: [''],
      branch_name: [''],
      capdate_Value: [''],
      asset_value: [''],
      empname:['']
    });
    this.transfermarkersearch.get('empname').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.Faservice.getemployeeFKdd(this.transfermarkersearch.get('empname').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.empdrpdwndata=data['data'];
    });
  }
  public empdataintreface(data?:empdata):string | undefined{
    return data?data.full_name:undefined;
  }
  getAssetTransfer(pageNumber = 1, pageSize = 5) {
    if(this.transfermarkersearch){
      let transfermaker_search=this.transfermarkersearch.value
      if((transfermaker_search.capdate_Value != null || transfermaker_search.capdate_Value != '')  ){
        var tranferdate=this.datePipe.transform(transfermaker_search.capdate_Value, 'yyyy-MM-dd')
        this.searchData.capdate=tranferdate
      }
      if(transfermaker_search.asset_value !=null ||transfermaker_search.asset_value !=''){
          this.searchData.assetdetails_value = transfermaker_search.asset_value;
  
      }
      if(transfermaker_search.empname.id !=null || transfermaker_search.empname.id !=undefined || transfermaker_search.empname.id !=''){
        this.searchData.empid=transfermaker_search.empname.id;
      }
      this.searchData.assetcat_id = transfermaker_search.category.id;
      this.searchData.barcode = transfermaker_search.barcode;
      this.searchData.branch_id = transfermaker_search.branch_name.id;
      // if(transfermaker_search.barcode.barcode){
      //   console.log("true")
      //   this.searchData.barcode = transfermaker_search.barcode.barcode;
      // }else{
      //   console.log("false")
      //   this.searchData.barcode = transfermaker_search.barcode;
    
      // }
  
   for (let i in this.searchData) {
          if (this.searchData[i] === null || this.searchData[i] === "") {
            delete this.searchData[i];
          }
        }
     
      
    }
    
  
    else{
      this.searchData={}
    }
    this.spinner.show();
    this.faService.getAssetTransfer(pageNumber, pageSize, this.searchData)
      .subscribe(result => {

        // 
        this.assetTransfer = result['data'];
        this.dataList=result['data'];
        let dataPagination = result['pagination'];
        this.spinner.hide();
        if (this.assetTransfer.length >= 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isSummaryPagination = true;
        } if (this.assetTransfer <= 0) {
          this.isSummaryPagination = false;
        }

        
      },
      (error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.errorHandler.errorHandler(error,'');
      }
      )
  }
  private getasset_category(keyvalue) {
    this.faService.getAssetSearchFilter(keyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.category = datas;

      })
  }

  public displayFnAssest(Asset?: Asset): string | undefined {
    return Asset ? Asset.subcatname : undefined;
  }
  asset_category() {
    let keyvalue: String = "";
    this.getasset_category(keyvalue);
    this.transfermarkersearch.get('category').valueChanges
      .pipe(
        startWith(""),
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),

        switchMap(value => this.faService.getAssetSearchFilter(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.category = datas;

      })

  }


  autocompleteScrollcategory() {
    setTimeout(() => {
      if (
        this.categoryAutoComplete &&
        this.autocompleteTrigger &&
        this.categoryAutoComplete.panel
      ) {
        fromEvent(this.categoryAutoComplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.categoryAutoComplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.categoryAutoComplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.categoryAutoComplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.categoryAutoComplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.faService.getEmployeeBranchSearchFilter(this.categoryInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList = this.employeeList.concat(datas);
                    if (this.employeeList.length >= 0) {
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

  // end asset _category



  // branch

  onFocusOutEvent(event) {
    

  }
  Branch() {
    let keyvalue: String = "";
    this.getEmployee(keyvalue);

    this.transfermarkersearch.get('branch_name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.faService.getEmployeeBranchSearchFilter(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;

      })

  }

  private getEmployee(keyvalue) {
    this.faService.getEmployeeBranchSearchFilter(keyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
      })
  }

  public displayFn(branch?: Branch): string | undefined {
    return branch ? branch.name : undefined;
  }


  autocompleteScroll() {
    setTimeout(() => {
      if (
        this.matAutocomplete &&
        this.autocompleteTrigger &&
        this.matAutocomplete.panel
      ) {
        fromEvent(this.matAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.faService.getEmployeeBranchSearchFilter(this.BranchInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList = this.employeeList.concat(datas);
                    if (this.employeeList.length >= 0) {
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

  // end branch

  // assest barcode

  public displayFnAssestId(AssetDetails?: AssetDetails): string | undefined {
    return AssetDetails ? AssetDetails.barcode : undefined;
  }

  private getassetbarcode(keyvalue) {
    this.faService.getAssetIdSearchFilter(keyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.assetDetails = datas;
        // assetDetails:Array<AssetDetails>
      })
  }

  Assetbarcode() {
    let keyvalue: String = "";
    this.getassetbarcode(keyvalue);

    this.transfermarkersearch.get('barcode').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.faService.getAssetIdSearchFilter(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.assetDetails = datas;

      })

  }

  autocompleteScrollAssetId() {
    setTimeout(() => {
      if (
        this.AssetAutoComplete &&
        this.autocompleteTrigger &&
        this.AssetAutoComplete.panel
      ) {
        fromEvent(this.AssetAutoComplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.AssetAutoComplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.AssetAutoComplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.AssetAutoComplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.AssetAutoComplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.faService.getAssetIdSearchFilter(this.AssetInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.assetDetails = this.assetDetails.concat(datas);
                    if (this.assetDetails.length >= 0) {
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
      this.getAssetTransfer(this.presentpage + 1, 10)
    }

  }

  previousClick() {
    if (this.has_previous === true) {

      this.currentpage = this.presentpage - 1
      this.getAssetTransfer(this.presentpage - 1, 10)
    }
  }
  
  clearSearch(){
   
    this.transfermarkersearch.controls['capdate_Value'].reset('')
    this.transfermarkersearch.controls['category'].reset('')
    this.transfermarkersearch.controls['asset_value'].reset('')
    this.transfermarkersearch.controls['barcode'].reset('')
    this.transfermarkersearch.controls['branch_name'].reset('')
    
  }
}
