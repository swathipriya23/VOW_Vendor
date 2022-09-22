import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Fa3Service } from '../fa3.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlerService } from '../error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
export interface Branch {
  id: string;
  name: string;
  code:number;
}
export interface Asset{
  id:string;
  subcatname:string;
}
export interface AssetDetails{
  id:string;
  barcode:string
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
  selector: 'app-categorychangesummary',
  templateUrl: './categorychangesummary.component.html',
  styleUrls: ['./categorychangesummary.component.scss'],
  providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
      DatePipe]
})
export class CategorychangesummaryComponent implements OnInit {
  reason:any='';
  categorychangesearch: FormGroup;
  employeeList: Array<Branch>;
  Category:Array<Asset>
  assetDetails:Array<AssetDetails>
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  isLoading=false;
  identificationData: any;
  categoryadd:any;
  presentpage: number = 1;
  isVendorSummaryPagination:boolean;
  pageSize: number=5;
  identificationSize:number=10;
  presentIdentification: number = 1;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('BranchInput') BranchInput: any;
  @ViewChild('branch') matAutocomplete: MatAutocomplete;
  
  @ViewChild('CategoryInput') CategoryInput: any;
  @ViewChild('Categoryref') CategoryAutoComplete: MatAutocomplete;
  
  @ViewChild('AssetInput') AssetInput: any;
  @ViewChild('asset') AssetAutoComplete: MatAutocomplete;
  searchData: any;
  constructor(private errorHandler:ErrorHandlerService,private datePipe:DatePipe,private router: Router,private formBuilder: FormBuilder,private faService: Fa3Service,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.getCategoryChange()
    this.categorychangesearch = this.formBuilder.group({
      category:[''],
      // ,[RequireMatch]
      capdate_Value:[''],
      barcode:[''],
      branch_name: [''],
      asset_value:[''],
      
  })
  }

// summary 

getCategoryChange(pageNumber=1, pageSize=5) {
  if(this.categorychangesearch){
    let categorychangechangesearch=this.categorychangesearch.value
    if((categorychangechangesearch.capdate_Value != null || categorychangechangesearch.capdate_Value != '')  ){
      var tranferdate=this.datePipe.transform(categorychangechangesearch.capdate_Value, 'yyyy-MM-dd')
      this.searchData.capdate=tranferdate
    }
    if(categorychangechangesearch.asset_value !=null ||categorychangechangesearch.asset_value !=''){
        this.searchData.assetdetails_value = categorychangechangesearch.asset_value;

    }
    this.searchData.assetcat_id = categorychangechangesearch.category.id;
    this.searchData.barcode = categorychangechangesearch.barcode;
    this.searchData.branch_id = categorychangechangesearch.branch_name.id;
    // if(categorychangechangesearch.barcode.barcode){
    //   console.log("true")
    //   this.searchData.barcode = categorychangechangesearch.barcode.barcode;
    // }else{
    //   console.log("false")
    //   this.searchData.barcode = categorychangechangesearch.barcode;
  
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

  // asset_value
  this.spinner.show()
  this.faService.getCategoryChange(pageNumber, pageSize,this.searchData)
    .subscribe(result => {
      
      this.spinner.hide()
      this.categoryadd = result['data']
      let dataPagination = result['pagination'];
      if (this.categoryadd.length >= 0) {
        this.has_next = dataPagination.has_next;
        this.has_previous = dataPagination.has_previous;
        this.presentpage = dataPagination.index;
        this.isVendorSummaryPagination = true;
      } if (this.categoryadd <= 0) {
        this.isVendorSummaryPagination = false;
      }


    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.errorHandler.errorHandler(error,'');
    }
    );
}



nextClick() {
  if (this.has_next === true) {
    
      this.currentpage = this.presentpage + 1
      this.getCategoryChange(this.presentpage + 1, 10)
    }
  }


previousClick() {
  if (this.has_previous === true) {
    
      this.currentpage = this.presentpage - 1
      this.getCategoryChange(this.presentpage - 1, 10)
    }
  }

// search 
  private getasset_Category(keyvalue) {
    this.faService.getAssetSearchFilter(keyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Category = datas;
       
      })
  }
  
  public displayFnAssest(Asset?: Asset): string | undefined {
    return Asset ? Asset.subcatname : undefined;
  }
    asset_Category(){
      let keyvalue: String = "";
        this.getasset_Category(keyvalue);
        this.categorychangesearch.get('category').valueChanges
          .pipe(
            startWith(""),
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
             
    
            }),
           
            switchMap(value => this.faService.getAssetSearchFilter(value,1)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
              )
            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.Category = datas;
    
          })
    
    }
  
  
    autocompleteScrollcategory() {
      setTimeout(() => {
        if (
          this.CategoryAutoComplete &&
          this.autocompleteTrigger &&
          this.CategoryAutoComplete.panel
        ) {
          fromEvent(this.CategoryAutoComplete.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.CategoryAutoComplete.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.CategoryAutoComplete.panel.nativeElement.scrollTop;
              const scrollHeight = this.CategoryAutoComplete.panel.nativeElement.scrollHeight;
              const elementHeight = this.CategoryAutoComplete.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_next === true) {
                  this.faService.getEmployeeBranchSearchFilter(this.CategoryInput.nativeElement.value, this.currentpage + 1)
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
  
  // end asset _Category
  
  
  
  // branch
  
  onFocusOutEvent(event){
    
  
  }
    Branch(){
      let keyvalue: String = "";
        this.getEmployee(keyvalue);
        
        this.categorychangesearch.get('branch_name').valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
             
    
            }),
            switchMap(value => this.faService.getEmployeeBranchSearchFilter(value,1)
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
          this.faService.getEmployeeBranchSearchFilter(keyvalue,1)
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
    this.faService.getAssetIdSearchFilter(keyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.assetDetails = datas;
        // assetDetails:Array<AssetDetails>
      })
  }
  
  Assetbarcode(){
    let keyvalue: String = "";
        this.getassetbarcode(keyvalue);
        
        this.categorychangesearch.get('barcode').valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
              
    
            }),
            switchMap(value => this.faService.getAssetIdSearchFilter(value,1)
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
  
        autocompleteScrollAssetId(){
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

        clearSearch(){
     
          this.categorychangesearch.controls['capdate_Value'].reset('')
          this.categorychangesearch.controls['category'].reset('')
          this.categorychangesearch.controls['asset_value'].reset('')
          this.categorychangesearch.controls['barcode'].reset('')
          this.categorychangesearch.controls['branch_name'].reset('')
          
        }
        clickreason(data:any){
          this.reason=data.reason;
        }
   }
  // end assest barcode

