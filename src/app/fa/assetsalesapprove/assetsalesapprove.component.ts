import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Fa3Service } from '../fa3.service';
import { NotificationService } from 'src/app/service/notification.service';
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
  selector: 'app-assetsalesapprove',
  templateUrl: './assetsalesapprove.component.html',
  styleUrls: ['./assetsalesapprove.component.scss'],
  providers:[ { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe]
})
export class AssetsalesapproveComponent implements OnInit {
  searchData: any={};
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('BranchInput') BranchInput: any;
  @ViewChild('branch') matAutocomplete: MatAutocomplete;
  
  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('categoryref') categoryAutoComplete: MatAutocomplete;
  
  @ViewChild('AssetInput') AssetInput: any;
  @ViewChild('asset') AssetAutoComplete: MatAutocomplete
  salesSummaryApprove: FormGroup;
  employeeList: Array<Branch>;
  category:Array<Asset>
  assetDetails:Array<AssetDetails>
  isLoading: boolean=false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  isPagination:boolean;
  identificationSize:number=10;
  presentIdentification: number = 1;
  newvalue: any=[];
  assetsalesValue: Array<any>=[];
  data: any;
  newAssetSalesValue: any=[];
  identificationData:any
  isShow=false;
  public isCollapsed=false;
  reasons: string;
  approve: any=[];

  constructor(private errorHandler:ErrorHandlerService,private toastr:ToastrService,private router: Router,private notification: NotificationService,private faService:Fa3Service,private formBuilder:FormBuilder,private datePipe:DatePipe,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    
    this.salesSummaryApprove = this.formBuilder.group({
      category:[''],
      // ,[RequireMatch]
      barcode:[''],
      branch_name: [''],
      capdate_Value:[''],
      asset_value:['']
    });
    this.assetsalesapprove();
    
  }
  assetsalesapprove(pageNumber=1, pageSize=5){
    this.assetsalesValue=[];
    this.searchData={};
    // if(this.salesSummaryApprove){
      let valuechangeadd=this.salesSummaryApprove.value
      if(this.salesSummaryApprove.get('capdate_Value').value != null && this.salesSummaryApprove.get('capdate_Value').value != ''){
        var tranferdate=this.datePipe.transform(this.salesSummaryApprove.get('capdate_Value').value, 'yyyy-MM-dd')
        this.searchData.capdate=tranferdate;
      }
      if(this.salesSummaryApprove.get('asset_value').value != null && this.salesSummaryApprove.get('asset_value').value != ''){
        this.searchData.assetdetails_value=this.salesSummaryApprove.get('asset_value').value;
      }
      if(this.salesSummaryApprove.get('category').value != null && this.salesSummaryApprove.get('category').value != ''){
        this.searchData.assetcat_id = this.salesSummaryApprove.get('category').value.id;
      }
      if(this.salesSummaryApprove.get('barcode').value != null && this.salesSummaryApprove.get('barcode').value != ''){
        this.searchData.barcode = this.salesSummaryApprove.get('barcode').value;
      }
      if(this.salesSummaryApprove.get('branch_name').value != null && this.salesSummaryApprove.get('branch_name').value != ''){
        this.searchData.branch_id = valuechangeadd.branch_name.id;
      }
      // if(valuechangeadd.asset_value !=null ||valuechangeadd.asset_value !=''){
      //     this.searchData.branch_id =this.salesSummaryApprove.get('branch_name').value.id;
  
      // }
      
      // this.searchData.assetcat_id = valuechangeadd.category.id;
      // this.searchData.barcode = valuechangeadd.barcode;
      // this.searchData.branch_id = valuechangeadd.branch_name.id;
      // if(valuechangeadd.barcode.barcode){
      //   console.log("true")
      //   this.searchData.barcode = valuechangeadd.barcode.barcode;
      // }else{
      //   console.log("false")
      //   this.searchData.barcode = valuechangeadd.barcode;
    
      // }
  //  for (let i in this.searchData) {
  //         if (this.searchData[i] === null || this.searchData[i] === "") {
  //           delete this.searchData[i];
  //         }
  //       }
     
      
    //}
    
  
    // else{
    //   this.searchData={}
    // }
    console.log('11')
    this.spinner.show();
    this.faService.assetsalesapprove(pageNumber, pageSize,this.searchData)
    .subscribe(result => {
      this.spinner.hide();
      this.assetsalesValue = result['data']
      this.data = result['data'];
      let dataPagination = result['pagination'];
      if (this.assetsalesValue.length > 0) {
        this.has_next = dataPagination.has_next;
        this.has_previous = dataPagination.has_previous;
        this.presentpage = dataPagination.index;
        this.isPagination = true;
      } if (this.assetsalesValue.length <= 0) {
        this.isPagination = false;
      }
      if(result){
        this.updateWhenUsingPagination()
      }
      for (let i in this.assetsalesValue) {

        this.newAssetSalesValue.push(<any>{
          newvalue: this.assetsalesValue[i].newvalue,


        })
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

  this.assetsalesValue.forEach((row, index) => {
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
clearSearch(){
     
  this.salesSummaryApprove.controls['capdate_Value'].reset('')
  this.salesSummaryApprove.controls['category'].reset('')
  this.salesSummaryApprove.controls['asset_value'].reset('')
  this.salesSummaryApprove.controls['barcode'].reset('')
  this.salesSummaryApprove.controls['branch_name'].reset('')
  
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
      this.salesSummaryApprove.get('category').valueChanges
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
      
      this.salesSummaryApprove.get('branch_name').valueChanges
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
      
      this.salesSummaryApprove.get('barcode').valueChanges
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
     onCheckboxChange(event, value, index) {
    
      if (event.currentTarget.checked) {
        for(let salevalueid of value.sale_details){
        this.newvalue.push({
          // 'assetdetails_id': value['assetdtls_id'],
          'assetdetails_id': salevalueid.assetdetails_id,

          
        });
      }
        // for(let j of value.sale_details){
        // 
        
      }
      else {
        
      
        for(let salevalueid of value.sale_details){
    
        const index = this.newvalue.findIndex(list => list.assetdetails_id == salevalueid.assetdetails_id);//Find the index of stored id
        this.newvalue.splice(index, 1);
        }
      }
      
    
    }

    nextClick() {
      if (this.has_next === true) {
  
        this.currentpage = this.presentpage + 1
        this.assetsalesapprove(this.presentpage + 1, 10)
      }
      for (var i = this.newvalue.length - 1; i >= 0; --i) {
     
        this.newvalue.splice(i,1);
        
    }
    }
  
    previousClick() {
      if (this.has_previous === true) {
  
        this.currentpage = this.presentpage - 1
        this.assetsalesapprove(this.presentpage - 1, 10)
      }
      for (var i = this.newvalue.length - 1; i >= 0; --i) {
     
        this.newvalue.splice(i,1);
        
    }
    }
    approveSummary(){
      this.approve=[];
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
    
      this.faService.assetsaleapprove(this.approve, this.reasons).subscribe(res =>{
        if( res["status"]=="success"){
          this.notification.showSuccess("Approve Successfully!...");
          this.assetsalesapprove();
          this.reset();
        }
        else{
          this.notification.showWarning(res['code']);
          this.notification.showWarning(res['description']);
        }
     
      // this.router.navigate(['/fa/fa'], { skipLocationChange: isSkipLocationChange })
      },
      (error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.errorHandler.errorHandler(error,'');
        

      }
      )     
    
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
    
      this.spinner.show();
      this.faService.assetsaleapprove(this.approve, this.reasons).subscribe(res =>{
      this.notification.showSuccess("Reject Successfully!...");
      this.spinner.hide();
      this.assetsalesapprove(1,5);
      // this.router.navigate(['/fa/fa'], { skipLocationChange: isSkipLocationChange })
      },
      (error)=>{
        this.spinner.hide();
      }
      );
      this.reset();
      console.log('call start');
     
      
     
    }

    reset(){
      // this.salesSummaryApprove.reset()
     
      this.reasons=undefined;
       this.salesSummaryApprove.reset()  
    }
}
