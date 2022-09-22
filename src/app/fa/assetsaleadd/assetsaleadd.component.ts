import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
// import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Fa3Service } from '../fa3.service';
import { NotificationService } from 'src/app/service/notification.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
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
export interface sales{
  id:string;
  name:string;
}
export interface state{
  name:string;
  id:string;
}
@Component({
  selector: 'app-assetsaleadd',
  templateUrl: './assetsaleadd.component.html',
  styleUrls: ['./assetsaleadd.component.scss'],
  providers:[ { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe]
})
export class AssetsaleaddComponent implements OnInit {

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('BranchInput') BranchInput: any;
  @ViewChild('branch') matAutocomplete: MatAutocomplete;
  
  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('categoryref') categoryAutoComplete: MatAutocomplete;
  
  @ViewChild('CustomerValueInput') CustomerValueInput: any;
  @ViewChild('CustomerAutoCompleteref') CustomerAutoCompleteref: MatAutocomplete;

  @ViewChild('CustomerStateInput') CustomerStateInput: any;

  @ViewChild('AssetInput') AssetInput: any;
  @ViewChild('asset') AssetAutoComplete: MatAutocomplete;
  @ViewChild('CustomerStateAutoCompleteref') matStatelist:MatAutocomplete;
  salesSummaryAdd: FormGroup;
  searchData: any={};
  @ViewChild('closebutton2') closebutton;
  
  // customarDetails:FormGroup;
  employeeList: Array<Branch>;
  category:Array<Asset>
  CustomerValueDetails:Array<sales>
  CustomerValueState:Array<state>=null
  assetDetails:Array<AssetDetails>
  isLoading: boolean=false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  isPagination:boolean;
  identificationSize:number=10;
  presentIdentification: number = 1;
  assetsalesValue: any;
  data: any;
  newAssetSalesValue=[]
  newvalue = []
  sale_date=[]
  min_Date
  identificationData: any;
  reasons:any
  date: any = "";
  dates: string;
  minDate: any;
  today = new Date();
  sale_rate:number;
  CustomerValue= new FormControl()
  customerState=new FormControl()
  customerid: any;
  closeResult: string;
  customer_Name:any;
  has_statenxt:boolean=true;
  has_statepre:boolean=false;
  has_statepage:number=1;
  reg:any=new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
      gstno:any;
      contactno:any;
      customertype:any;
      customeraddress:any; 
      customercode:any;
  CustomerDetails: any=[];
  sateid: any;
  selectedsale: any;
  SaleNote=1;
  invoice=0;
  
  popupRef: Promise<void>;
  asset: any;
       constructor(private errorHandler:ErrorHandlerService,private toastr: ToastrService,private modalService: NgbModal,private faService:Fa3Service,private formBuilder:FormBuilder,private datePipe:DatePipe,private router:Router,private notification:NotificationService,private spinner:NgxSpinnerService) { 
        // this.invoice = 1;
       }

  ngOnInit(): void {
   
    
    this.salesSummaryAdd = this.formBuilder.group({
      category:[''],
      barcode:[''],
      branch_name: [''],
      capdate_Value:[''],
      asset_value:['']
    });
    this.assetsalesadd();
   
  }
 
  assetsalesadd(pageNumber=1, pageSize=5){
    
    if(this.salesSummaryAdd){
      let assetsaleadd=this.salesSummaryAdd.value
      if((assetsaleadd.capdate_Value != null || assetsaleadd.capdate_Value != '')  ){
        var tranferdate=this.datePipe.transform(assetsaleadd.capdate_Value, 'yyyy-MM-dd')
        this.searchData['capdate']=tranferdate
      }
      if(assetsaleadd.asset_value !=null ||assetsaleadd.asset_value !=''){
          this.searchData['assetdetails_value'] = assetsaleadd.asset_value;
  
      }
      this.searchData['assetcat_id'] = assetsaleadd.category.id;
      // this.searchData.assetdetails_id = assetsaleadd.barcode.id;
      this.searchData['barcode'] = assetsaleadd.barcode;

      this.searchData['branch_id'] = assetsaleadd.branch_name.id;
      // if(assetsaleadd.barcode.barcode){
      //   console.log("true")
      //   this.searchData.barcode = assetsaleadd.barcode.barcode;
      // }else{
      //   console.log("false")
      //   this.searchData.barcode = assetsaleadd.barcode;
    
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
       this.faService.assetsalesadd(pageNumber, pageSize,this.searchData)
    .subscribe(result => {
      this.spinner.hide();
      this.assetsalesValue = result['data']
      this.data = result['data'];
      for(let i=0;i<this.assetsalesValue.length;i++){
        this.assetsalesValue[i]['con']=false;
      }
      let dataPagination = result['pagination'];
      if (this.assetsalesValue.length >= 0) {
        this.has_next = dataPagination.has_next;
        this.has_previous = dataPagination.has_previous;
        this.presentpage = dataPagination.index;
        this.isPagination = true;
      } if (this.assetsalesValue <= 0) {
        this.isPagination = false;
      }
      
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.errorHandler.errorHandler(error,'');
    }
    );
}
clearSearch(){
     
  this.salesSummaryAdd.controls['capdate_Value'].reset('')
  this.salesSummaryAdd.controls['category'].reset('')
  this.salesSummaryAdd.controls['asset_value'].reset('')
  this.salesSummaryAdd.controls['barcode'].reset('')
  this.salesSummaryAdd.controls['branch_name'].reset('')
  this.assetsalesadd();
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
      this.salesSummaryAdd.get('category').valueChanges
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
      
      this.salesSummaryAdd.get('branch_name').valueChanges
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
      
      this.salesSummaryAdd.get('barcode').valueChanges
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
     nextClick() {
      if (this.has_next === true) {
  
        this.currentpage = this.presentpage + 1
        this.assetsalesadd(this.presentpage + 1, 10)
      }
      for (var i = this.newvalue.length - 1; i >= 0; --i) {
     
        this.newvalue.splice(i,1);
        
    }
  
    }
  
    previousClick() {
      if (this.has_previous === true) {
  
        this.currentpage = this.presentpage - 1
        this.assetsalesadd(this.presentpage - 1, 10)
      }
      for (var i = this.newvalue.length - 1; i >= 0; --i) {
     
        this.newvalue.splice(i,1);
        
    }
  
    }


    onCheckboxChange(event, value, index) {
      if (event.currentTarget.checked) {
        for(let i=0;i<this.assetsalesValue.length;i++){
          if(this.assetsalesValue[i]['assetdetails_id']==value.assetdetails_id){
            this.assetsalesValue[i]['con']=true;
          }
          else{
            this.assetsalesValue[i]['con']=false;
          }
        }
        this.newvalue=[{
          'assetdetails_id': value['assetdtls_id'],
          "branch_id": value['branch_id'],
          "sale_rate":value['sale_rate'],
          "hsn_code":value.hsn_details['code'],
          "sgst_rate":value.hsn_details['sgstrate'],
          "cgst_rate":value.hsn_details['cgstrate'],
          "igst_rate":value.hsn_details['igstrate']  
        }];
        
        this.sale_date.push({
          "date":value['capdate']
        })
        // if(this.sale_rate===undefined){
        //   this.toastr.error("please give the sale rate ");
        //   
        //   return false;
        // }
        
      }
      else {
        
        const date_index= this.sale_date.findIndex(date=>date.date == value.capdate)
        this.sale_date.splice(date_index,1)
        for(let i=0;i<this.assetsalesValue.length;i++){
          if(this.assetsalesValue[i]['id']==value.id){
            this.assetsalesValue[i]['con']=false;
          }
        }
    
        // const index = this.newvalue.findIndex(list => list.assetdetails_id == value.assetdtls_id);//Find the index of stored id
        // this.newvalue.splice(index, 1);
      }
      
      
     
    }
    mindatefind(){
      this.min_Date=new Date(Math.max.apply(null, this.sale_date.map((e:any) => new Date(e.date))))
      // this.min_Date=new Date(Math.max.apply(...this.catalog_date.map((x:any) => new Date(x.date))));
  
      // for (let mindate of this.sale_date)
      //     {
      //       let datemax
      //      this.dates = this.datePipe.transform(this.minDate, 'yyyy-MM-dd')
      //       if(mindate.date>this.dates ||this.minDate===undefined){
      //         this.min_Date = new Date(mindate.date)
      //         datemax=this.min_Date
      //       
      //       
      //       
      //       }
      //     }
    }


    private getAssetCustomer(keyvalue) {
      this.faService.getCustomerFilter(keyvalue,1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.CustomerValueDetails = datas;
         
        })
    }
    
    public displayFnCustomerAssest(sales?: sales): string | undefined {
      return sales ? sales.name : undefined;
    }
    assetCustomer(){
        let keyvalue: String = "";
          this.getAssetCustomer(keyvalue);
          this.CustomerValue.valueChanges
            .pipe(
              startWith(""),
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
               
      
              }),
             
              switchMap(value => this.faService.getCustomerFilter(value,1)
                .pipe(
                  finalize(() => {
                    this.isLoading = false
                    
                    this.customerid=value.id
                    
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.CustomerValueDetails = datas;
      
            })
      
      }
    
    
      autocompleteScrollCustomerValue() {
        setTimeout(() => {
          if (
            this.CustomerAutoCompleteref &&
            this.autocompleteTrigger &&
            this.CustomerAutoCompleteref.panel
          ) {
            fromEvent(this.CustomerAutoCompleteref.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.CustomerAutoCompleteref.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.CustomerAutoCompleteref.panel.nativeElement.scrollTop;
                const scrollHeight = this.CustomerAutoCompleteref.panel.nativeElement.scrollHeight;
                const elementHeight = this.CustomerAutoCompleteref.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_next === true) {
                    this.faService.getEmployeeBranchSearchFilter(this.CustomerValueInput.nativeElement.value, this.currentpage + 1)
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
      autocompleteScrollCustomerState() {
        setTimeout(() => {
          if (
            this.matStatelist &&
            this.autocompleteTrigger &&
            this.matStatelist.panel
          ) {
            fromEvent(this.matStatelist.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.matStatelist.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.matStatelist.panel.nativeElement.scrollTop;
                const scrollHeight = this.matStatelist.panel.nativeElement.scrollHeight;
                const elementHeight = this.matStatelist.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if ( this.has_statenxt === true) {
                    this.faService.getCustomerStateFilter(this.has_statepage+1,this.CustomerStateInput.nativeElement.value)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        this.CustomerValueState = this.CustomerValueState.concat(datas);
                        if (this.CustomerValueState.length >= 0) {
                          this.has_statenxt = datapagination.has_next;
                          this.has_statepre = datapagination.has_previous;
                          this.has_statepage = datapagination.index;
                        }
                      })
                  }
                }
              });
          }
        });
      }
      onChangeSaleValue($event) {
        
        this.selectedsale = $event.value;
      }
    // end asset _Customer
    
    submit(){
      
     
      let formatdate=this.datePipe.transform(this.date, 'yyyy-MM-dd')
      if (this.newvalue.length == 0) {
        this.toastr.error('Please Select Any checkbox ');
        return false;
      } 
      if(this.reasons===undefined){
        this.toastr.error('Please Give The Sale Reason');
        return false; 
      }
      if(this.selectedsale===undefined || this.selectedsale ==='' || this.selectedsale=== null){
        this.toastr.error('Please Select the Invoice or Sale Note')
        return false;
      }
      if(this.customerid===undefined){
        this.toastr.error('please Select the  Customer Name')
        return false;
      }
    if(formatdate===null){
      this.toastr.error('please Choose the Sale Date')
      return false;
    }
      let dataConfirm = confirm("Are you sure, Do you want to SUBMIT?")
    if (dataConfirm == false) {
      return false;
    }
  


      this.spinner.show();
      this.faService.assetchange(this.newvalue, this.reasons, formatdate,this.customerid,this.selectedsale).subscribe(res => {
        if(res.code==='INVALID_DATA'){
          this.toastr.error('Kindly change the asset value');
          this.spinner.hide();
        }else if(res.status==='success'){
        this.notification.showSuccess("Successfully Updated!...")
          this.spinner.hide();
        
        this.router.navigate(['/fa/Assetsalesummary'], { skipLocationChange: isSkipLocationChange })
        }
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.errorHandler.errorHandler(error,'');
    }
      );
    }

    private getAssetCustomerState(keyvalue) {
    
      this.faService.getCustomerStateFilter(1,'')
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.CustomerValueState = datas;
         
        })
    }
    
    public displayFnState(state?: state): string | undefined {
      return state ? state.name : undefined;
    }
    CustomerState(){
        let keyvalue: String = "";
          this.getAssetCustomerState(keyvalue);
          this.customerState.valueChanges
            .pipe(
              startWith(""),
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
               
      
              }),
             
              switchMap(value => this.faService.getCustomerStateFilter(1,value)
                .pipe(
                  finalize(() => {
                    this.isLoading = false
                    
                    this.sateid=value.id
                    
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.CustomerValueState = datas;
      
            })
      
      }
    
    

    onCancelClick(){
      this.router.navigate(['/fa/Assetsalesummary'], { skipLocationChange: isSkipLocationChange })
    }
    
    addCustomer(){
      if(this.customer_Name===undefined || this.customer_Name==='' ){
        this.toastr.error('Please Enter The Name');
        return false;
      }
      if(this.reg.test(this.gstno)){
        console.log('exe');
      }
      else{
        this.toastr.warning('Please Check GST No');
        this.toastr.warning('It Must Contain 15 Digits:')
        return false;
      }
      
     
      if(this.gstno===undefined || this.gstno===''){
        this.toastr.error('Please Enter The Gst No');
        return false;
      }
      if(this.customeraddress===undefined || this.customeraddress===''){
        this.toastr.error('Please Enter The Address')
        return false;
      }
      if(this.customerState.value===undefined || this.customerState.value ==='' || this.customerState.value ===null || this.customerState.value ===""){
        this.toastr.error('Please Choose The Sate');
        return false;
      }
      if(this.contactno==undefined || this.contactno=='' || this.contactno==null){
        this.notification.showError('Please Enter The Contact No');
        return false;
      }
     
     
      
      
      this.CustomerDetails=({"customer_name":this.customer_Name,"customer_GSTNO":this.gstno,"address":{"line1":this.customeraddress,"state_id":this.sateid},
      "contact":{"mobile": this.contactno}})
      
      
       
        this.faService.assetsaleadd(this.CustomerDetails).subscribe(res => {
          // this.show = !this.show;
          console.log(res)
          this.closebutton.nativeElement.click();
          this.reset()
          // this.router.navigate(['/fa/Assetsalesummary'], { skipLocationChange: isSkipLocationChange })
        }
          
          
          
          
        )}
        public onCancel() {
          this.reset()
          this.closebutton.nativeElement.click();
          // this.reset()
        }
        reset(){
          this.customer_Name=''
        this.gstno='';
        this.contactno='';
        this.customertype='';
        this.customeraddress=''; 
        this.sateid=''
        // this.CustomerValueState.values.name;
        this.CustomerStateInput.nativeElement.value=''
        
        }
        numberOnly(event): boolean {
          const charCode = (event.which) ? event.which : event.keyCode;
          if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 123)) {
            return false;
          }
          return true;
        }
        numberOnlys(event): boolean {
          const charCode = (event.which) ? event.which : event.keyCode;
          if (charCode > 31 && (charCode < 48 || charCode > 57) ) {
            return false;
          }
          return true;
        }
  }   
