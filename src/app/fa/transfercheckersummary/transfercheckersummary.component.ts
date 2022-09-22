import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/service/notification.service';
import { Fa3Service } from '../fa3.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlerService } from '../error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
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
  selector: 'app-transfercheckersummary',
  templateUrl: './transfercheckersummary.component.html',
  styleUrls: ['./transfercheckersummary.component.scss'],
  providers: [{ provide: DateAdapter, useClass: PickDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe]
})
export class TransfercheckersummaryComponent implements OnInit {
  transfercheckersearch:any= FormGroup;
  employeeList: Array<Branch>;
  category: Array<Asset>
  assetDetails: Array<AssetDetails>
  isLoading: boolean;
  assetApprove: any
  identificationSize: number = 10;
  presentIdentification: number = 1;
  newvalue: any = [];
  approve: any = [];
  has_next: boolean=false;
  has_previous: boolean=false;
  currentpage: any=1;
  searchData: any={};
  isVendorSummaryPagination: boolean;
  presentpage: any;
  reasons: any;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('BranchInput') BranchInput: any;
  @ViewChild('branch') matAutocomplete: MatAutocomplete;

  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('categoryref') categoryAutoComplete: MatAutocomplete;

  @ViewChild('AssetInput') AssetInput: any;
  @ViewChild('asset') AssetAutoComplete: MatAutocomplete


  constructor(private errorHandler:ErrorHandlerService,private router: Router, private toastr: ToastrService,
    private faService: Fa3Service, private notification: NotificationService, private formBuilder: FormBuilder, private datePipe: DatePipe,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    
    
    this.transfercheckersearch = this.formBuilder.group({
      'category':new FormControl(''),
      // ,[RequireMatch]
      'barcode':new FormControl(''),
      'branch_name': new FormControl(''),
      'capdate_Value': new FormControl(''),
      'asset_value': new FormControl('')
    });
    this.assettranfersummary();
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
    this.transfercheckersearch.get('category').valueChanges
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

    this.transfercheckersearch.get('branch_name').valueChanges
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

    this.transfercheckersearch.get('barcode').valueChanges
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


  //Assettransfer approve summary
  assettranfersummary(pageNumber = 1, pageSize = 5) {
    // this.transfercheckersearch = this.formBuilder.group({
    //   'category':new FormControl(''),
    //   // ,[RequireMatch]
    //   'barcode':new FormControl(''),
    //   'branch_name': new FormControl(''),
    //   'capdate_Value': new FormControl(''),
    //   'asset_value': new FormControl('')
    // })
    console.log(this.transfercheckersearch.value);
    this.searchData={}
      // let transfercheckerSearch=this.transfercheckersearch.value
      if(this.transfercheckersearch.get('capdate_Value').value != null && this.transfercheckersearch.get('capdate_Value').value != ''){
        var tranferdate=this.datePipe.transform(this.transfercheckersearch.get('capdate_Value').value, 'yyyy-MM-dd')
        this.searchData.capdate=tranferdate;
      }
      if(this.transfercheckersearch.get('asset_value').value !=null && this.transfercheckersearch.get('asset_value').value !=''){
          this.searchData.assetdetails_value = this.transfercheckersearch.get('asset_value').value;
  
      }
      if(this.transfercheckersearch.get('category').value !=null && this.transfercheckersearch.get('category').value !=''){
        this.searchData.assetcat_id = this.transfercheckersearch.get('category').value.id;
      }
      if(this.transfercheckersearch.get('barcode').value !=null && this.transfercheckersearch.get('barcode').value !=''){
        this.searchData.barcode = this.transfercheckersearch.get('barcode').value;
      }
      if(this.transfercheckersearch.get('branch_name').value !=null && this.transfercheckersearch.get('branch_name').value !=''){
        this.searchData.branch_id = this.transfercheckersearch.get('branch_name').value.id;
      }
      
      // if(transfercheckerSearch.barcode.barcode){
      //   console.log("true")
      //   this.searchData.barcode = transfercheckerSearch.barcode.barcode;
      // }else{
      //   console.log("false")
      //   this.searchData.barcode = transfercheckerSearch.barcode;
    
      // }
  //  for (let i in this.searchData) {
  //         if (this.searchData[i] === null || this.searchData[i] === "") {
  //           delete this.searchData[i];
  //         }
  //       }
     
      
  //   

    
  
    
     
    
    console.log(this.searchData)
    this.spinner.show();
    this.faService.assettranfersummary(pageNumber, pageSize, this.searchData)
      .subscribe(result => {
        // 
        this.assetApprove = result['data'];
        let dataPagination = result['pagination'];
        this.spinner.hide();

        if (result['data'].length >= 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isVendorSummaryPagination = true;
        } if (this.assetApprove <= 0) {
          this.isVendorSummaryPagination = false;
        }
        if(result){
          this.updateWhenUsingPagination()
        }
        
      },
      (error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.errorHandler.errorHandler(error,'');
      }
      );
  }
  updateWhenUsingPagination(){
    let IdSelectedArray = this.newvalue

  this.assetApprove.forEach((row, index) => {
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
  onCheckboxChange(event, value) {

    if (event.currentTarget.checked) {

      this.newvalue.push({

        "assetdetails_id": value['assetdtls_id'],

      });
      

    }
    else {

      const index = this.newvalue.findIndex(list => list.assetdetails_id == value.assetdtls_id);//Find the index of stored id
      this.newvalue.splice(index, 1);
    }

  }

  approveSummary() {

    if (this.newvalue.length == 0) {
      this.toastr.error('Please Select Any checkbox ');
      return false;
    }
    let dataApprove = confirm("Are you sure, Do you want to APPROVE?")
    if (dataApprove == false) {
      return false;
    }
    
      for (let i of this.newvalue) {
        let Approve = Object.assign(i, { status: "1" });
        this.approve.push(Approve)
        
      }
      
      this.faService.assettransfer_approve(this.approve, this.reasons).subscribe(res => {
        if(res['code'] !=undefined || res['code'] !=null){
          this.notification.showError(res['code']);
          this.notification.showError(res['description']);
        }
        else{
          this.notification.showSuccess("Approve Successfully!...")
          this.assettranfersummary()
          this.reload()
          // this.router.navigate(['/fa/fa'], { skipLocationChange: isSkipLocationChange })
        }
        
      },
      (error:HttpErrorResponse)=>{
        this.errorHandler.errorHandler(error,'');
      }
      );
    
  }
  rejectSummary() {
    if (this.newvalue.length == 0) {
      this.toastr.error('Please Select Any checkbox ');
      return false;
    }
    if(this.reasons===undefined || this.reasons==='' || this.reasons===null){
      this.toastr.error('please enter the valid reason for reject..');
      return false;
    } 
    let dataReject = confirm("Are you sure, Do you want to REJECT?")
    if (dataReject == false) {
      return false;
    }
    for (let i of this.newvalue) {
        let Approve = Object.assign(i, { status: "3" });
        this.approve.push(Approve)
        
      }
      
      this.faService.assettransfer_approve(this.approve, this.reasons).subscribe(res => {
        if(res['code'] !=undefined && res['code'] !=null){
          this.notification.showError(res['code']);
          this.notification.showError(res['description']);
        }
        else{
          this.notification.showSuccess("Reject Successfully!...");
        this.assettranfersummary();
        // window.location.reload()
        this.reload();
        }
        
        
      },
      (error:HttpErrorResponse)=>{
        this.errorHandler.errorHandler(error,'');
      }
      );
    
  }
  onCancelClick() {
    this.router.navigate(['/fa/fa'], { skipLocationChange: isSkipLocationChange });

  }
  reload(){
    this.reasons=undefined;
    this.transfercheckersearch.reset()
    

  }


  nextClick() {
    if (this.has_next === true) {
         
        this.currentpage = this.presentpage + 1
        this.assettranfersummary(this.presentpage + 1, 10)
      }
      for (var i = this.newvalue.length - 1; i >= 0; --i) {
     
        this.newvalue.splice(i,1);
        
    }
    }
  
  previousClick() {
    if (this.has_previous === true) {
      
      this.currentpage = this.presentpage - 1
      this.assettranfersummary(this.presentpage - 1, 10)
    }
    for (var i = this.newvalue.length - 1; i >= 0; --i) {
     
      this.newvalue.splice(i,1);
      
  }
  }

  clearSearch(){
     
    this.transfercheckersearch.controls['capdate_Value'].reset('')
    this.transfercheckersearch.controls['category'].reset('')
    this.transfercheckersearch.controls['asset_value'].reset('')
    this.transfercheckersearch.controls['barcode'].reset('')
    this.transfercheckersearch.controls['branch_name'].reset('')
    this.assettranfersummary();
  }
}
