import { DatePipe, formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';
import { environment } from 'src/environments/environment';
import { Fa3Service } from '../fa3.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../error-handler.service';
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
  selector: 'app-valuechangemakeradd',
  templateUrl: './valuechangemakeradd.component.html',
  styleUrls: ['./valuechangemakeradd.component.scss'],
  providers:[ { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe]
})
export class ValuechangemakeraddComponent implements OnInit {

  assetValue: any=[];
  reasons: any = "";
  date: any = "";
  employeeList: Array<Branch>;
  category: Array<Asset>
  assetDetails: Array<AssetDetails>
  public user1 = Array<any>();
  identificationSize: number = 10;
  presentIdentification: number = 1;
  identificationData: any;
  has_next: boolean=false;
  has_previous: boolean=false;
  presentpage: any=1;
  isSummaryPagination: boolean;
  currentpage: any;
  // @ViewChild('val') val: ElementRef;
  newAssetDetailValue = [];
  newAssetObj = {}
  isLoading = false;
  data: any;
  catalog_date = []
  newvalue = []
  
  minDate: any;
  today = new Date();
  
  dates: string;
  // firtDate: any;
  min_Date: any;
  // obj: any = {}
  modificationactivitydetaildata: any;
  valueChangeAddSearch: FormGroup;
  searchData: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('BranchInput') BranchInput: any;
  @ViewChild('branch') matAutocomplete: MatAutocomplete;

  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('categoryref') categoryAutoComplete: MatAutocomplete;

  @ViewChild('AssetInput') AssetInput: any;
  @ViewChild('asset') AssetAutoComplete: MatAutocomplete;
 
  constructor(private errorHandler:ErrorHandlerService,private toastr: ToastrService, private router: Router,
    private notification: NotificationService, private faService: Fa3Service,
    private formBuilder: FormBuilder, private datePipe: DatePipe,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {

    
    this.getAssetDetailsValueChange()
    this.valueChangeAddSearch = this.formBuilder.group({
      category: [''],
      barcode: [''],
      branch_name: [''],
      capdate_Value: [''],
      asset_value: ['']
    })
    
  }
  getAssetDetailsValueChange(pageNumber = 1, pageSize = 5) {

    if(this.valueChangeAddSearch){
      let valuechangeadd=this.valueChangeAddSearch.value
      if((valuechangeadd.capdate_Value != null || valuechangeadd.capdate_Value != '')  ){
        var tranferdate=this.datePipe.transform(valuechangeadd.capdate_Value, 'yyyy-MM-dd')
        this.searchData.capdate=tranferdate
      }
      if(valuechangeadd.asset_value !=null ||valuechangeadd.asset_value !=''){
          this.searchData.assetdetails_value = valuechangeadd.asset_value;
  
      }
      this.searchData.assetcat_id = valuechangeadd.category.id;
      this.searchData.barcode = valuechangeadd.barcode;
      this.searchData.branch_id = valuechangeadd.branch_name.id;
      // if(valuechangeadd.barcode.barcode){
      //   console.log("true")
      //   this.searchData.barcode = valuechangeadd.barcode.barcode;
      // }else{
      //   console.log("false")
      //   this.searchData.barcode = valuechangeadd.barcode;
    
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
    this.faService.getAssetDetailsValueChange(pageNumber, pageSize, this.searchData)
      .subscribe(result => {
        this.spinner.hide()
        
        this.assetValue = result['data']
        this.data = result['data'];
        let dataPagination = result['pagination'];
        if (this.assetValue.length >= 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isSummaryPagination = true;
        } if (this.assetValue <= 0) {
          this.isSummaryPagination = false;
        }
        if(result){
          this.updateWhenUsingPagination()
        }
        
      },
      (error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.errorHandler.errorHandler(error,'');
      }
      )
      
  }
  updateWhenUsingPagination(){
    let IdSelectedArray = this.newvalue

    this.assetValue.forEach((row, index) => {
      console.log(row)
     IdSelectedArray.forEach((rowarray, index) => {
       console.log(rowarray)
       if (rowarray.barcode == row.barcode) {
         console.log("1",rowarray.barcode)
         console.log("2",row.barcode)
         row.checkbox = true
       }
     })
   })
  }
  nextClick() {
    if (this.has_next === true) {

      this.currentpage = this.presentpage + 1
      this.getAssetDetailsValueChange(this.presentpage + 1, 10)
    }
    for (var i = this.newvalue.length - 1; i >= 0; --i) {
     
      this.newvalue.splice(i,1);
      
  }
  for(var j=this.catalog_date.length-1;j >=0;j--){
    this.catalog_date.splice(j,1)
  }
  }

  previousClick() {
    if (this.has_previous === true) {

      this.currentpage = this.presentpage - 1
      this.getAssetDetailsValueChange(this.presentpage - 1, 10)
    }
    for (var i = this.newvalue.length - 1; i >= 0; --i) {
      this.newvalue.splice(i,1);   
  }
  for(var j=this.catalog_date.length-1;j >=0;j--){
    this.catalog_date.splice(j,1)
  }
  }

  onCheckboxChange(event, value, index) {

    if (event.currentTarget.checked) {

      this.newvalue.push({
        // 'id': event.target.value,
        'new_value': value['newvalue'],
        "barcode": value['barcode'],
        

      });
      this.catalog_date.push({
        "date":value['capdate']
      })
       
    }
    else {
      
      const indexcat = this.catalog_date.findIndex(date => date.date == value.capdate);//Find the index of stored id
      this.catalog_date.splice(indexcat, 1);
      
  
      const index = this.newvalue.findIndex(newvalues => newvalues.barcode == value.barcode);//Find the index of stored id
      this.newvalue.splice(index, 1);
    }
    
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
    this.valueChangeAddSearch.get('category').valueChanges
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
    console.log(event.target.value);

  }
  Branch() {
    let keyvalue: String = "";
    this.getEmployee(keyvalue);

    this.valueChangeAddSearch.get('branch_name').valueChanges
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

    this.valueChangeAddSearch.get('barcode').valueChanges
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

  datefilter(){
    this.min_Date=new Date(Math.max.apply(null, this.catalog_date.map((e:any) => new Date(e.date))))
    
  
}


submit() {
    
  let dates = this.datePipe.transform(this.date, 'yyyy-MM-dd');
  if (this.newvalue.length == 0) {
    this.toastr.error('Please Select Any checkbox');
    return false;
  }
  if(this.reasons===''){
    this.toastr.error('Please Give The Reason');
    return false;
  } 
 
  if(dates===null){
    this.toastr.error('Please Choose The Date');
    return false;
  }
  let dataConfirm = confirm("Are you sure, Do you want to SUBMIT?")
    if (dataConfirm == false) {
      return false;
    }
    this.spinner.show();
    this.faService.assetValuChange(this.newvalue, this.reasons, dates).subscribe(res => {
      this.spinner.hide();
      if(res.code==='INVALID_DATA'){
        this.toastr.error(res.description);
      }else if(res.status==='success'){
      this.notification.showSuccess("Successfully Updated!...")
        this.newvalue=[];
      
      this.router.navigate(['/fa/valuechangemakersummary'], { skipLocationChange: isSkipLocationChange })
      }
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.errorHandler.errorHandler(error,'');
    }
    );
  }

  clearSearch(){
     
    this.valueChangeAddSearch.controls['capdate_Value'].reset('')
    this.valueChangeAddSearch.controls['category'].reset('')
    this.valueChangeAddSearch.controls['asset_value'].reset('')
    this.valueChangeAddSearch.controls['barcode'].reset('')
    this.valueChangeAddSearch.controls['branch_name'].reset('');
    this.searchData={};
    this.getAssetDetailsValueChange();
  }

}
