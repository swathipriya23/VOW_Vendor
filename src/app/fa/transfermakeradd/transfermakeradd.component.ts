import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/service/notification.service';
import { Fa3Service } from '../fa3.service';
import { I } from '@angular/cdk/keycodes';
import { NgxSpinnerService } from 'ngx-spinner';
import { faservice } from '../fa.service';
import { ErrorHandlerService } from '../error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

const isSkipLocationChange = environment.isSkipLocationChange

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
export interface businessFilter{
  id:string;
  name:string;
  no: number,
}
export interface costcentre{
  id:string;
  name:string;
}
export interface location{
  id:string;
  name:string;
}
// branch_name



@Component({
  selector: 'app-transfermakeradd',
  templateUrl: './transfermakeradd.component.html',
  styleUrls: ['./transfermakeradd.component.scss'],
  providers:[ { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe]
})
export class TransfermakeraddComponent implements OnInit {
  @ViewChild('emprefid') matasstisAutocomplete:MatAutocomplete;
  @ViewChild('emprefids') matasstisAutocompleteadd:MatAutocomplete;
  Approve:any
  transfer=[]
  searchData: any;
  fetchAssetTransfer:any
  has_next: any;
  has_previous: any;
  isLoading: boolean;
  isSummaryPagination: boolean;
  identificationSize:number=10;
  presentIdentification: number = 1;
  currentpage: number = 1;
  presentpage: number = 1;
  employeeList: Array<Branch>;
  branchList:Array<Branch>
  category:Array<Asset>
  location:Array<location>
  assetDetails:Array<AssetDetails>
  businesssegment:Array<businessFilter>
  Costcentre:Array<costcentre>
  fetchassetTransfer:FormGroup
  transferaddsearch:FormGroup
  newvalue: any=[];
  empdrpdwndata:Array<any>=[];
  empdrpdwndatas:Array<any>=[];
  reasons:any
  business_id: any;
  minDate: any;
  has_previousemp:boolean=false;
  has_nextemp :boolean=true
  currentpageemp:number=1;
  today = new Date();
  firtDate: string;
  branchid: any;
  costcenter_id: any;
  dates: string;
  format: any="";
  catId: any;
  disableTextbox = true;
  dateCap: any
  returnDate: any; 
  branchshort=[]
  
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('BranchInput') BranchInput: any;
  @ViewChild('branch') matAutocomplete: MatAutocomplete;
  
  @ViewChild('inputval') ccInput: any;
  @ViewChild('locationInput') locationInput: any;
  


  @ViewChild('branchInput') branchInput: any;
  @ViewChild('BranchAuto') matAutocompleteBranch: MatAutocomplete;

  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('categoryref') categoryAutoComplete: MatAutocomplete;
  
  @ViewChild('AssetInput') AssetInput: any;
  @ViewChild('asset') AssetAutoComplete: MatAutocomplete
  transfer_date: any=[];
  min_Date: Date;


  
  
  constructor(private errorHandler:ErrorHandlerService,private Faservice:faservice,private toastr: ToastrService,private notification: NotificationService,
    private router:Router,private faService: Fa3Service,private datePipe:DatePipe,
    private formBuilder:FormBuilder,private spinner:NgxSpinnerService) { 

  }

  ngOnInit(): void {
    
    this.fetch_assettransfer();
    this.transferaddsearch = this.formBuilder.group({
      category:[''],
      // ,[RequireMatch]
      barcode:[''],
      branch_name: [''],
      capdate_Value:[''],
      asset_value:[''],
      empname:['']
    })
    this.fetchassetTransfer=this.formBuilder.group({
      businessSegment:[''],
      costcentre:[''],
      branchname:[''],
      location:[''],
      empname:['']
    });
    this.transferaddsearch.get('empname').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.Faservice.getemployeeFKdd(this.transferaddsearch.get('empname').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.empdrpdwndata=data['data'];
    });
    this.fetchassetTransfer.get('empname').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.Faservice.getemployeeFKdd(this.fetchassetTransfer.get('empname').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.empdrpdwndatas=data['data'];
    });
  }
  public empdataintreface(data?:empdata):string | undefined{
    return data?data.full_name:undefined;
  }
  fetch_assettransfer(pageNumber=1, pageSize=5) {
    if(this.transferaddsearch){
      let transfermakeradd=this.transferaddsearch.value
      if((transfermakeradd.capdate_Value != null || transfermakeradd.capdate_Value != '')  ){
        var tranferdate=this.datePipe.transform(transfermakeradd.capdate_Value, 'yyyy-MM-dd')
        this.searchData.capdate=tranferdate
      }
      if(transfermakeradd.asset_value !=null ||transfermakeradd.asset_value !=''){
          this.searchData.assetdetails_value = transfermakeradd.asset_value;
  
      }
      if(transfermakeradd.empname.id !=null ||transfermakeradd.empname.id !='' || transfermakeradd.empname.id !=undefined){
        this.searchData.empid = transfermakeradd.empname.id;

    }
      this.searchData.assetcat_id = transfermakeradd.category.id;
      this.searchData.barcode = transfermakeradd.barcode;
      this.searchData.branch_id = transfermakeradd.branch_name.id;
      // if(transfermakeradd.barcode.barcode){
      //   console.log("true")
      //   this.searchData.barcode = transfermakeradd.barcode.barcode;
      // }else{
      //   console.log("false")
      //   this.searchData.barcode = transfermakeradd.barcode;
    
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
  this.faService.fetch_assettransfer(pageNumber, pageSize,this.searchData)
  .subscribe(result => {
    this.spinner.hide();
    if(result['code'] !=undefined && result['code'] !=null){
      this.notification.showWarning(result['code']);
      this.notification.showWarning(result['description']);
    }
    else{
    this.fetchAssetTransfer = result['data'];
    // this.newvalue.reset()
    // this.newvalue.reset()
    let dataPagination = result['pagination'];
    if (this.fetchAssetTransfer.length >= 0) {
      this.has_next = dataPagination.has_next;
      this.has_previous = dataPagination.has_previous;
      this.presentpage = dataPagination.index;
      this.isSummaryPagination = true;
    } if (this.fetchAssetTransfer <= 0) {
      this.isSummaryPagination = false;
    }
    if(result){
      this.updateWhenUsingPagination()
    }
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

  this.fetchAssetTransfer.forEach((row, index) => {
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
      this.fetch_assettransfer(this.presentpage + 1, 10)
    }
    for (var i = this.newvalue.length - 1; i >= 0; --i) {
     
      this.newvalue.splice(i,1);
      
  }
  for(var j= this.branchshort.length-1;j>=0;j--){
    this.branchshort.splice(j,1)
  }
  for(var k=this.transfer_date.length-1;k>=0;k--){
    this.transfer_date.splice(k,1)
  }
  }

previousClick() {
  if (this.has_previous === true) {
    this.currentpage = this.presentpage - 1
    this.fetch_assettransfer(this.presentpage - 1, 10)
  }
  for (var i = this.newvalue.length - 1; i >= 0; --i) {
     
    this.newvalue.splice(i,1);
    
}
for(var j= this.branchshort.length-1;j>=0;j--){
  this.branchshort.splice(j,1)
}
for(var k=this.transfer_date.length-1;k>=0;k--){
  this.transfer_date.splice(k,1)
}
}

datefilter(){

  this.transferaddsearch.get('capdate').valueChanges
    .pipe(
      startWith(""),
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
       

      }),
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.returnDate = datas;

    })
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
      this.transferaddsearch.get('category').valueChanges
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

onFocusoutEvent(event){
  

}
  Branch(){
    let keyvalue: String = "";
      this.getEmployee(keyvalue);
      
      this.transferaddsearch.get('branch_name').valueChanges
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
      
      this.transferaddsearch.get('barcode').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            
  
          }),
          switchMap(value => this.faService.getAssetIdSearchFilter( this.transferaddsearch.get('barcode').value,1)
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


    
     onCheckboxChange(event,value){
      
      if (event.currentTarget.checked) {
        this.branchshort.push({
          "branchid":value['branch_id']})
        this.newvalue.push({
          // h'id':event.target.value,
          "assetdetails_id": value['assetdtls_id'],
          "create_date":this.datePipe.transform(value['created_date'],"yyyy-MM-dd"),
          "barcode":value['barcode'],
          'capdate':value['capdate']
          
        }); 
        
        this.transfer_date.push({
          "date":value['capdate']
        })
      } 
      else {
        const branchindex= this.branchshort.findIndex(brid=>brid.branchid==value.branch_id)
        this.branchshort.splice(branchindex,1)
        const date_index= this.transfer_date.findIndex(date=>date.date==value.capdate)
        this.transfer_date.splice(date_index,1)
        const index = this.newvalue.findIndex(list => list.assetdetails_id == value.assetdtls_id);//Find the index of stored id
        this.newvalue.splice(index, 1);
    }
  
   console.log("newvalue=>",this.newvalue)
   
    
       }




   
      
      public displayFnbusinessSegment(businessFilter?: businessFilter): string | undefined {
        return businessFilter ? businessFilter.name  : undefined
      }
      businessSegment(){
        
            this.fetchassetTransfer.get('businessSegment').valueChanges
              .pipe(
                startWith(""),
                debounceTime(100),
                distinctUntilChanged(),
                tap(() => {
                  this.isLoading = true;
                
        
                }),
               
                switchMap(value => this.faService.getbusinesssegmentfilter(value,1)
                  .pipe(
                    finalize(() => {
                      this.isLoading = false
                      this.business_id=value.id
                      
                    }),
                  )
                )
              )
              .subscribe((results: any[]) => {
                let datas = results["data"];
                this.businesssegment = datas;
                
                this.ccInput.nativeElement.value = '';
                
              })
        
        }
   
        
public displayFnCostCentre(costcentre?: costcentre): string | undefined {
  return costcentre ? costcentre.name : undefined
}       
costCentre  (){

  
  if(this.business_id===undefined){
    this.toastr.error('Please Select Business Segment..');
  }else{
  this.fetchassetTransfer.get('costcentre').valueChanges
  .pipe(
    startWith(""),
    debounceTime(100),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading = true;
    //  

    }),
   
    switchMap((value) =>  this.faService.getcostcentrefilter(this.business_id,value)
      .pipe(
        finalize(() => {
        
          
          this.isLoading = false
          this.costcenter_id=value.id
          
          
        }),
      )
    )
  )
  .subscribe((results: any[]) => {
    let datas = results["data"];
    this.Costcentre = datas;
    

  })
  }
}  

// branch
onFocusOutEvent(event){
  

}
branchnamechange(event) {
  this.branchid = event.source.value.id;
}
branchSearch(){
    let keyvalue: String = "";
      this.getEmployeeSearch(keyvalue);
      
      this.fetchassetTransfer.get('branchname').valueChanges
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
                this.branchid=value.id
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
         
         let datas = results["data"];
         this.branchList = datas;
         
         
         for (let value of this.branchshort){
             let filterdata=this.branchList.findIndex(brid=>brid.id===value)
             this.branchList.splice(filterdata,1)
             
         
           }
         
       
       })
      }
      
    
      private getEmployeeSearch(keyvalue) {
        this.faService.getEmployeeBranchSearchFilter(keyvalue,1)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.branchList = datas;
            
            
            for (let value of this.branchshort){
                let filterdata=this.branchList.findIndex(brid=>brid.id===value)
                this.branchList.splice(filterdata,1)
                
            
              }
            
          
          })
      }

      public displayFnbranch(branch?: Branch): string | undefined {
        return branch ? branch.name : undefined;
      }
    
      
      autocompleteScrollBranch() {
        setTimeout(() => {
          if (
            this.matAutocompleteBranch &&
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
                    this.faService.getEmployeeBranchSearchFilter(this.branchInput.nativeElement.value, this.currentpage + 1)
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
// location
public displayFnlocation(location?: location): string | undefined {
  return location ? location.name  : undefined;
}       
locationsearch(){
  if(this.branchid===undefined){
    this.toastr.error('Please Select Branch Segment..');
    return false;
  }else{
  
  this.fetchassetTransfer.get('location').valueChanges
  .pipe(
    startWith(""),
    debounceTime(100),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading = true;
    }),   
    switchMap((value) =>  this.faService.getlocationfilter(1,this.branchid)
      .pipe(
        finalize(() => {
          this.isLoading = false
        }),
      )
    )
  )
  .subscribe((results: any[]) => {
    let datas = results["data"];
    this.location = datas;
    // this.locationInput.nativeElement.value = '';
    

  })
  }
} 
// end location 

submit(){
  this.transfer=[];
  let dateformat=this.datePipe.transform(this.format, 'yyyy-MM-dd');
  console.log(this.reasons);
  console.log(this.business_id);
  console.log(this.costcenter_id);
  console.log(this.reasons);

  if(this.newvalue.length == 0){
    this.toastr.error('Please Select Any checkbox ');
    return false;
    
  }
  if(this.reasons===undefined){
    
    this.toastr.error('please Fille The Reason');
    return false; 
  }
  if(dateformat===null){
    
    this.toastr.error('please choose Date');
    return false;
   
  }   
  if(this.business_id===undefined ){
    
    this.toastr.error('please choose the correct option in business Segment');
    return false;
    
  } 
  if(this.costcenter_id===undefined){
    
    this.toastr.error('please choose the correct option in Cost Center');
    return false;
    
  }
 
   if(this.branchid===undefined){
    
    this.toastr.error('please choose the correct option in branch');
    return false;
   
  }  
  if(this.fetchassetTransfer.get('location').value.id ==undefined || this.fetchassetTransfer.get('location').value.id=='' || this.fetchassetTransfer.get('location').value.id==null){
    this.toastr.error('Please Select the Location');
    return false;
  }
  console.log(this.newvalue.length);
  for(let i=0;i<this.newvalue.length;i++){
    if(this.newvalue[i]['capdate']>dateformat){
      // console.log(this.newvalue[i].created_date < dateformat)
      this.toastr.warning('Transfer Date Must be Greater Than  Capitalization Date');
      this.toastr.warning('Check The Barcode: '+this.newvalue[i].barcode);
      return false;
    }
    else{
      // console.log(this.newvalue[i].create_date);
      // console.log(dateformat)
      console.log(this.newvalue[i].created_date>dateformat);
    }
   
  } 
  // return false;
  let dataConfirm = confirm("Are you sure, Do you want to SUBMIT?")
  if (dataConfirm == false) {
    return false;
  }
 
 
  
  for(let i of this.newvalue){
    this.Approve = Object.assign(i, { branch_id:this.branchid, cc_id: this.costcenter_id,bs_id: this.business_id,'location_id':this.fetchassetTransfer.get('location').value.id });
    this.transfer.push(this.Approve)
    
  
  }
  console.log(this.transfer);

  
  this.faService.assettranfer(this.transfer, this.reasons,dateformat,this.fetchassetTransfer.get('empname').value.id?this.fetchassetTransfer.get('empname').value.id:0).subscribe(res =>{
    if(res.code==='INVALID_DATA'){
      this.toastr.error(res.description);
    }else if(res.status==='success'){
    
    this.notification.showSuccess("Successfully Updated!...")
    this.router.navigate(['/fa/transfermakersummary'], { skipLocationChange: isSkipLocationChange })
    }
    },
    (error:HttpErrorResponse)=>{
      this.errorHandler.errorHandler(error,'');
    }
    )
  
}

back(){
  this.router.navigate(['/fa/transfermakersummary'], { skipLocationChange: isSkipLocationChange })
}

focussubCategory(e) {
  if (this.ccInput.nativeElement.value === '' && this.business_id !== undefined) {
    this.faService.getcostcentrefilter(this.business_id,'')
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Costcentre = datas;
        this.ccInput.nativeElement.value = '';
      });}
}
focuslocation($event){  
  if (this.locationInput.nativeElement.value === '' && this.branchid === undefined) {
    this.faService.getlocationfilter(1,this.branchid)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.location = datas;
      this.locationInput.nativeElement.value = '';
    });}}
    mindatefind(){
      this.min_Date=new Date(Math.max.apply(null, this.transfer_date.map((e:any) => new Date(e.date))))
    
    }


    clearSearch(){
     
      this.transferaddsearch.controls['capdate_Value'].reset('')
      this.transferaddsearch.controls['category'].reset('')
      this.transferaddsearch.controls['asset_value'].reset('')
      this.transferaddsearch.controls['barcode'].reset('')
      this.transferaddsearch.controls['branch_name'].reset('')
      this.transferaddsearch.controls['empname'].reset('');
      
    }
    autocompleteScrollemployee() {
      setTimeout(() => {
        if (
          this.matasstisAutocomplete &&
          this.autocompleteTrigger &&
          this.matasstisAutocomplete.panel
        ) {
          fromEvent(this.matasstisAutocomplete.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matasstisAutocomplete.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matasstisAutocomplete.panel.nativeElement.scrollTop;
              const scrollHeight = this.matasstisAutocomplete.panel.nativeElement.scrollHeight;
              const elementHeight = this.matasstisAutocomplete.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextemp === true) {
                  this.Faservice.getemployeeFKdd(this.transferaddsearch.get('empname').value,1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.empdrpdwndata = this.empdrpdwndata.concat(datas);
                      if (this.empdrpdwndata.length >= 0) {
                        this.has_nextemp = datapagination.has_next;
                        this.has_previousemp = datapagination.has_previous;
                        this.currentpageemp = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
  
}
