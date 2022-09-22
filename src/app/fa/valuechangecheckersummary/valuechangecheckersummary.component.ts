import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
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
  selector: 'app-valuechangecheckersummary',
  templateUrl: './valuechangecheckersummary.component.html',
  styleUrls: ['./valuechangecheckersummary.component.scss'],
  providers:[ { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe]
})
export class ValuechangecheckersummaryComponent implements OnInit {

  searchData: any={};
  checkersummary:any
  has_next :boolean= false;
  has_previous:boolean= false;
  currentpage: number = 1;
  presentpage: number = 1;
  isSummaryPagination:boolean;
  identificationSize:number=10;
  presentIdentification: number = 1;
  newvalue: any=[];
  summaryCheckerForm: FormGroup;
  employeeList: Array<Branch>;
  category:Array<Asset>
  assetDetails:Array<AssetDetails>
  isLoading=false;
  reasons:any='';

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('BranchInput') BranchInput: any;
  @ViewChild('branch') matAutocomplete: MatAutocomplete;
  
  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('categoryref') categoryAutoComplete: MatAutocomplete;
  
  @ViewChild('AssetInput') AssetInput: any;
  @ViewChild('asset') AssetAutoComplete: MatAutocomplete
  approve: any=[];

  constructor(private errorHandler:ErrorHandlerService,private toastr:ToastrService,private router: Router,
    private faService: Fa3Service,private notification: NotificationService,
    private formBuilder:FormBuilder,private datePipe:DatePipe,private spinner:NgxSpinnerService) { 
    
    }


 
  ngOnInit(): void {
    
   
    this.summaryCheckerForm = this.formBuilder.group({
        category:[''],
        // ,[RequireMatch]
        barcode:[''],
        branch_name: [''],
        capdate_Value:[''],
        asset_value:['']
      });
      this.getCheckerSummary(1,5);
  }
  getCheckerSummary(pageNumber=1, pageSize=5) {
    this.searchData={};
    
      // let valuechangesummary=this.summaryCheckerForm.value;
      if((this.summaryCheckerForm.get('capdate_Value').value != null && this.summaryCheckerForm.get('capdate_Value').value != '')  ){
        var tranferdate=this.datePipe.transform(this.summaryCheckerForm.get('capdate_Value').value, 'yyyy-MM-dd')
        this.searchData['capdate']=tranferdate
      }
      if(this.summaryCheckerForm.get('asset_value').value !=null && this.summaryCheckerForm.get('asset_value').value !=''){
          this.searchData['assetdetails_value'] = this.summaryCheckerForm.get('asset_value').value;
  
      }
      if(this.summaryCheckerForm.get('category').value !=null && this.summaryCheckerForm.get('category').value !=''){
        this.searchData['assetcat_id'] = this.summaryCheckerForm.get('category').value .id;

    }
    if(this.summaryCheckerForm.get('barcode').value  !=null && this.summaryCheckerForm.get('barcode').value  !=''){
      this.searchData['barcode'] = this.summaryCheckerForm.get('barcode').value;

  }
  if(this.summaryCheckerForm.get('branch_name').value !=null && this.summaryCheckerForm.get('branch_name').value !=''){
    this.searchData['branch_id'] = this.summaryCheckerForm.get('branch_name').value.id;

}
  
    
    this.spinner.show();
    this.faService.getCheckerSummary(pageNumber, pageSize,this.searchData)
      .subscribe(result => {
        this.spinner.hide();
        //
        this.checkersummary = result['data']
        let dataPagination = result['pagination'];
        if (this.checkersummary.length >= 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isSummaryPagination = true;
        } if (this.checkersummary <= 0) {
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
      );
  }
  updateWhenUsingPagination(){
    let IdSelectedArray = this.newvalue

    this.checkersummary.forEach((row, index) => {
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
        'id':event.target.value,
        'new_value':value['assetvalue'],
        "barcode": value['barcode'],
               
      });
    
      
    } 
    else {
    
      const index = this.newvalue.findIndex(list => list.id == event.target.value);//Find the index of stored id
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
          this.summaryCheckerForm.get('category').valueChanges
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
          
          this.summaryCheckerForm.get('branch_name').valueChanges
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
          
          this.summaryCheckerForm.get('barcode').valueChanges
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

  

  this.spinner.show();
  this.faService.valuechange_approve(this.approve, this.reasons).subscribe(res =>{
    if(res['status']=='success'){
      this.spinner.hide();
      this.notification.showSuccess("Approve Successfully!...");
    }
    else{
      this.spinner.hide();
      this.notification.showError(res['description']);
    }
 
  // this.router.navigate(['/fa/fa'], { skipLocationChange: isSkipLocationChange })
  this.approve=[];
  this.newvalue=[];
  this.reset()
  this.getCheckerSummary()
  
  // return true;
  },
  (error)=>{
    this.spinner.hide();
    this.errorHandler.errorHandler(error,'');
    
  }
  )     
  
}
gethover(){
  this.toastr.warning('Same Use Cannot Be Approve');
}
rejectSummary(){
  if(this.newvalue.length == 0){
    this.toastr.error('Please Select Any checkbox ');
    return false;
  }
  if(this.reasons===undefined || this.reasons==''){
    this.toastr.error('Please Give The Reject Reason ');
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
  this.faService.valuechange_reject(this.approve, this.reasons).subscribe(res =>{
    this.spinner.hide();
  this.notification.showSuccess("Reject Successfully!...")
  // this.router.navigate(['/fa/fa'], { skipLocationChange: isSkipLocationChange })
  this.newvalue=[];
  this.approve=[];
  this.reset();
  this.getCheckerSummary()
  
  },
  (error:HttpErrorResponse)=>{
    this.spinner.hide();
    this.errorHandler.errorHandler(error,'');
  }  
  );

}
reset(){
  this.summaryCheckerForm.reset()
 
  this.reasons=undefined;  
}
clearSearch(){
  this.summaryCheckerForm.controls['capdate_Value'].reset('');
  this.summaryCheckerForm.controls['category'].reset('');
  this.summaryCheckerForm.controls['asset_value'].reset('');
  this.summaryCheckerForm.controls['barcode'].reset('');
  this.summaryCheckerForm.controls['branch_name'].reset('');
  this.getCheckerSummary(1,5);
}
}
