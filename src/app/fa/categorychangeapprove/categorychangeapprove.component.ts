import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

@Component({
  selector: 'app-categorychangeapprove',
  templateUrl: './categorychangeapprove.component.html',
  styleUrls: ['./categorychangeapprove.component.scss'],
  providers:[ { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe]
})
export class CategorychangeapproveComponent implements OnInit {

  searchData: any;
  checkersummary:any
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  isummaryPagination:boolean;
  identificationSize:number=10;
  presentIdentification: number = 1;
  newvalue: any=[];
  categoryCheckerSearch: FormGroup;
  employeeList: Array<Branch>;
  category:Array<Asset>
  assetDetails:Array<AssetDetails>
  isLoading=false;
  reasons:any;
  approve: any=[];
  reason:any='';
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('BranchInput') BranchInput: any;
  @ViewChild('branch') matAutocomplete: MatAutocomplete;
  
  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('categoryref') categoryAutoComplete: MatAutocomplete;
  
  @ViewChild('AssetInput') AssetInput: any;
  @ViewChild('asset') AssetAutoComplete: MatAutocomplete
  

  constructor(private errorHandler:ErrorHandlerService,private toastr:ToastrService,private router: Router,
    private faService: Fa3Service,private notification: NotificationService,
    private formBuilder:FormBuilder,private datePipe:DatePipe,private spinner:NgxSpinnerService ) { }


 
  ngOnInit(): void {
    this.getCheckerSummary()
    this.categoryCheckerSearch = this.formBuilder.group({
        category:[''],
        // ,[RequireMatch]
        barcode:[''],
        branch_name: [''],
        capdate_Value:[''],
        asset_value:['']
      })
  }
  getCheckerSummary(pageNumber=1, pageSize=5) {

    if(this.categoryCheckerSearch){
      let valuechangeadd=this.categoryCheckerSearch.value
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
    this.spinner.show()

    this.faService.getCheckerChangeApproveSummary(pageNumber, pageSize,this.searchData)
      .subscribe(result => {
        this.spinner.hide()
        // 
        this.checkersummary = result['data']
        let dataPagination = result['pagination'];
        if (this.checkersummary.length >= 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isummaryPagination = true;
        } if (this.checkersummary <= 0) {
          this.isummaryPagination = false;
        }


      },
      (error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.errorHandler.errorHandler(error,'');
      }
      );
  }
  clearSearch(){
     
    this.categoryCheckerSearch.controls['capdate_Value'].reset('')
    this.categoryCheckerSearch.controls['category'].reset('')
    this.categoryCheckerSearch.controls['asset_value'].reset('')
    this.categoryCheckerSearch.controls['barcode'].reset('')
    this.categoryCheckerSearch.controls['branch_name'].reset('')
    
  }

  nextClick() {
    if (this.has_next === true) {
         
        this.currentpage = this.presentpage + 1
        this.getCheckerSummary(this.presentpage + 1, 10)
      }
      for (var i = this.newvalue.length - 1; i >= 0; --i) {
     
        this.newvalue.splice(i,1);
        
    }
    }

  previousClick() {
    if (this.has_previous === true) {
      
      this.currentpage = this.presentpage - 1
      this.getCheckerSummary(this.presentpage - 1, 10)
    }
    for (var i = this.newvalue.length - 1; i >= 0; --i) {
     
      this.newvalue.splice(i,1);
      
  }
  }

  onCheckboxChange(event,value){
      
    if (event.currentTarget.checked) {

      this.newvalue.push({
        
        "assetdetails_id": value['assetdtls_id'],
        // "status":value['assetdetails_status']        
      });
      
      
    } 
    else {
    
      const index = this.newvalue.findIndex(list => list.assetdetails_id == value.assetdtls_id);//Find the index of stored id
      this.newvalue.splice(index, 1);
  }
  
     }

     private getasset_category(keyvalue) {
      this.faService.getAssetSearchFilter(keyvalue,1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.category = datas;
         
        })
    }
    
    public displayFnAssest(Asset?: Asset): string | undefined {
      return Asset ? Asset.subcatname : undefined;
    }
      asset_category(){
        let keyvalue: String = "";
          this.getasset_category(keyvalue);
          this.categoryCheckerSearch.get('category').valueChanges
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
    
    onFocusOutEvent(event){
      
    
    }
      Branch(){
        let keyvalue: String = "";
          this.getEmployee(keyvalue);
          
          this.categoryCheckerSearch.get('branch_name').valueChanges
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
          
          this.categoryCheckerSearch.get('barcode').valueChanges
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

approveSummary(){
  if(this.newvalue.length == 0){
    this.toastr.error('Please Select Any checkbox ');
    return false;
  }
  let dataApprove = confirm("Are you sure, Do you want to APPROVE?")
  if (dataApprove == false) {
    return false;
  }
  
  for(let i of this.newvalue){
    let Approve = Object.assign(i, { status: "1" });
    this.approve.push(Approve)
    
  }
  this.spinner.show();
  this.faService.categorychangeapprove(this.approve, this.reasons).subscribe(res =>{
    this.spinner.hide();
    if(res['code'] !=undefined && res['code'] !=''){
      this.newvalue=[];
      this.notification.showWarning(res['code']);
      this.notification.showWarning(res['description']);
    }
    else{
      this.notification.showSuccess("Approve Successfully!...")
    }
  
  this.getCheckerSummary();
  this.reset();
  // this.router.navigate(['/fa/fa'], { skipLocationChange: isSkipLocationChange })
  },
  (error:HttpErrorResponse)=>{
    this.spinner.hide();
    this.errorHandler.errorHandler(error,'');
  }
  );     

}
rejectSummary(){
  if(this.newvalue.length == 0){
    this.toastr.error('Please Select Any checkbox ');
    return false;
  }
  if(this.reasons==='' || this.reasons===null||this.reasons===undefined){
    this.toastr.error('Please Give The Reject Reason');
    return false;
  }
  let dataReject = confirm("Are you sure, Do you want to REJECT?")
  if (dataReject == false) {
    return false;
  }

  for(let i of this.newvalue){
    let Approve = Object.assign(i, { status: "3" });
    this.approve.push(Approve)
    
  }
  
  
  this.faService.categorychangeapprove(this.approve, this.reasons).subscribe(res =>{
  this.notification.showSuccess("Reject Successfully!...")
  this.getCheckerSummary()
  this.reset()
  // this.router.navigate(['/fa/fa'], { skipLocationChange: isSkipLocationChange })
  },
  (error)=>{
    this.spinner.hide();
    this.notification.showError(error.status+error.statusText);
   
  }
  )

}
reset(){
  this.categoryCheckerSearch.reset()
 
  this.reasons=undefined;  
}
onCancelClick() {
  this.router.navigate(['/fa/fa'], { skipLocationChange: isSkipLocationChange });
      
 }
 clickreasons(data:any){
   this.reason=data.reason;
 }
  
}
