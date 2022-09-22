import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router, RouterLinkWithHref } from '@angular/router';
import { faservice } from '../fa.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Fa2Service } from '../fa2.service';
import { ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map, first } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, from, fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../error-handler.service';
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
}
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
export interface branchlistss {
  id: any;
  code: string;
  name: string;
}
export interface categorylistss {
  id: any;
  subcatname: string;
}
@Component({
  selector: 'app-writeoffmaker-add',
  templateUrl: './writeoffmaker-add.component.html',
  styleUrls: ['./writeoffmaker-add.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class WriteoffmakerAddComponent implements OnInit {
  WriteOfflist: Array<any>
  checkedValues: boolean[]
  has_nextWriteOff = true;
  has_previousWriteOff = true;
  presentpageWriteOff: number = 1;
  pageSize = 10;
  writeOffSearchForm: FormGroup;
  writeOffCreateForm: FormGroup;

  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;

  @ViewChild('category') matcategoryAutocomplete: MatAutocomplete;
  @ViewChild('categoryInput') categoryInput: any;


  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  
  branchList: Array<branchlistss>;
  categoryList: Array<categorylistss>;
  isLoading = false;
  currentpage: number = 1;
  maxDate = new Date();
  constructor(private errorHandler:ErrorHandlerService,private notification: NotificationService, private router: Router
    , private Faservice: faservice, private datePipe: DatePipe, private fb: FormBuilder, public Faservice2: Fa2Service, private spinner:NgxSpinnerService) { }

  ngOnInit(): void {

    this.writeOffSearchForm = this.fb.group({
      assetdetails_id: [''],
      asset_value: [""],
      capdate: [''],
      assetcat_id: [''],
      branch_id: '',
    })

    this.writeOffCreateForm= this.fb.group({
      assetdetails_id :[],
      reason :"",
      date:""
    })

    this.writeOffSearchForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.Faservice.getassetbranchdata(value, 1)
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


      this.writeOffSearchForm.get('assetcat_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.Faservice.getassetCatdata(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryList = datas;
      })
    this.serviceCallWriteoffSummary({},1);

  }

  resetWriteOff() {
    this.writeOffSearchForm.reset('');
    this.getwriteOffsummarySearch('');
    return false
  }


////// summary
serviceCallWriteoffSummary(searchWriteoff,pageno){
  this.spinner.show();
  this.Faservice2.getassetWriteOffAddSummarySearch(searchWriteoff,pageno)
    .subscribe((result) => {
      this.spinner.hide();
      let datass = result['data'];
      let datapagination = result["pagination"];
      this.WriteOfflist = datass;
      // this.checkedValues = this.WriteOfflist.map(() => false);
      console.log("asset Writeoff", this.WriteOfflist)
      if (this.WriteOfflist.length > 0) {
        this.has_nextWriteOff = datapagination.has_next;
        this.has_previousWriteOff = datapagination.has_previous;
        this.presentpageWriteOff = datapagination.index;
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

getwriteOffsummarySearch(hint) {
  let searchWriteoff = this.writeOffSearchForm.value;
    if( searchWriteoff.capdate != ""){
      let capdatedata = searchWriteoff.capdate 
      let dates = this.datePipe.transform(capdatedata, 'yyyy-MM-dd');
      searchWriteoff.capdate = dates
    }
    
    for (let i in searchWriteoff) {
      if (searchWriteoff[i] == null || searchWriteoff[i] == "") {
        delete searchWriteoff[i];
      }
    }
  if(hint == 'next'){
    this.serviceCallWriteoffSummary(searchWriteoff, this.presentpageWriteOff + 1)
  }
  else if(hint == 'previous'){
    this.serviceCallWriteoffSummary(searchWriteoff, this.presentpageWriteOff - 1)
  }
  else{
    this.serviceCallWriteoffSummary(searchWriteoff,1)
  }

}



  arrayForIds = []
  selectedAssetValue(data, event){
    
    let assetIdPush = data.id
    console.log(assetIdPush)
    if( event.target.checked ){
      this.arrayForIds.push(assetIdPush)
    }
    else{
      let idarray = this.arrayForIds
      for( let id in idarray){

        if(idarray[id] == assetIdPush){
        console.log("idarray[id] ",idarray[id])
        console.log("assetIdPush", assetIdPush)
        
        let idAsNumber = Number(id)
        console.log("idAsNumber", idAsNumber)
        this.arrayForIds.splice(idAsNumber, 1)
        }
      }
      console.log(this.arrayForIds)
    }
    // this.autoCheckUpdation()
  }
  
  

  updateWhenUsingPagination(){
   let IdSelectedArray = this.arrayForIds

   this.WriteOfflist.forEach((row, index) => {
    IdSelectedArray.forEach((rowarray, index) => {
      if (rowarray == row.id) {
        console.log("1",rowarray)
        console.log("2",row.id)
        row.checkbox = true
      }
    })
  })
  // this.autoCheckUpdation()
  }

  HeaderCheckBox: boolean = false

  allCheckBox(event){
    if(event.target.checked){
    this.WriteOfflist.forEach((row, index) => {
      row.checkbox = true
    })
  }else{
    this.WriteOfflist.forEach((row, index) => {
      row.checkbox = false
    })
  }
  }

  autoCheckUpdation(){
    this.WriteOfflist.forEach((row, index) => {
      if( row.checkbox == false){
        
      }
      else{
        this.HeaderCheckBox = false
      }
     
    })

  }








submitWriteOff(){
  if(this.arrayForIds.length == 0){
    this.notification.showWarning("Please Choose atleast One")
    return false
  }
  let submitdata = this.writeOffCreateForm.value
  submitdata.assetdetails_id = this.arrayForIds

  let datedata = submitdata.date 
      let dates = this.datePipe.transform(datedata, 'yyyy-MM-dd');
      submitdata.date = dates

  console.log("Final Data Submit", submitdata)
  this.spinner.show();
  this.Faservice2.WriteOffCreate(submitdata)
  .subscribe(res => {
    if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
      this.spinner.hide();
      this.notification.showError("[INVALID_DATA! ...]")
    }
    else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
      this.spinner.hide();
      this.notification.showWarning("Duplicate Data! ...")
    } else if (res.code === "WRITEOFF DATE CANNOT BE LESS THAN CAPDATE" && res.description === "WRITEOFF DATE CANNOT BE LESS THAN CAPDATE") {
      this.spinner.hide();
      this.notification.showWarning("WRITEOFF DATE CANNOT BE LESS THAN CAPDATE ...")
    }
     else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
      this.spinner.hide();
      this.notification.showError("INVALID_DATA!...")
    }
     else {
       this.notification.showSuccess("Successfully created!...")
       this.spinner.hide();
      //  this.router.navigate(['/fa/prmaster'], { skipLocationChange: true });
      this.onSubmit.emit();
     }
       console.log(" Form SUBMIT", res)
       return true
     },
     (error:HttpErrorResponse)=>{
       this.spinner.hide();
       this.errorHandler.errorHandler(error,'');
     }
     ) 
  }

  ///// category

  currentpagecategory: number = 1;
  has_nextcategory = true;
  has_previouscategory = true;
  autocompletecategoryScroll() {
    setTimeout(() => {
      if (
        this.matcategoryAutocomplete &&
        this.autocompleteTrigger &&
        this.matcategoryAutocomplete.panel
      ) {
        fromEvent(this.matcategoryAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcategoryAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcategoryAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcategoryAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcategoryAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbranch === true) {
                this.Faservice.getassetCatdata(this.categoryInput.nativeElement.value, this.currentpagecategory + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.categoryList = this.categoryList.concat(datas);
                    if (this.categoryList.length >= 0) {
                      this.has_nextcategory = datapagination.has_next;
                      this.has_previouscategory = datapagination.has_previous;
                      this.currentpagecategory = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


  public displayFncategory(category?: any) {
    return category ? this.categoryList.find(_ => _.id === category).subcatname : undefined;
  }

  // public displayFncategory(category?: categorylistss): string | undefined {
  //   return category ? category.subcatname : undefined;
  // }


  getCategoryFK() {
    let categorykeyvalue = '';
    this.spinner.show();
    this.Faservice.getassetCatdata(categorykeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.spinner.hide();
        this.categoryList = datas;
        console.log("categoryList", datas)
      })
  }


  /////  branch

  currentpagebranch: number = 1;
  has_nextbranch = true;
  has_previousbranch = true;
  autocompletebranchScroll() {
    setTimeout(() => {
      if (
        this.matbranchAutocomplete &&
        this.autocompleteTrigger &&
        this.matbranchAutocomplete.panel
      ) {
        fromEvent(this.matbranchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbranchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbranch === true) {
                this.Faservice.getassetbranchdata(this.branchInput.nativeElement.value, this.currentpagebranch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchList = this.branchList.concat(datas);
                    if (this.branchList.length >= 0) {
                      this.has_nextbranch = datapagination.has_next;
                      this.has_previousbranch = datapagination.has_previous;
                      this.currentpagebranch = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  public displayFnbranch (branch?: any) {
      return branch ? this.branchList.find(_ => _.id === branch).name : undefined;
    }
    //return branch ? branch.code : undefined;
  


  // public displayFnbranch(branch?: branchlistss): string | undefined {
  //   let code = branch ? branch.code : undefined;
  //   let name = branch ? branch.name : undefined;
  //   return branch ? code + "-" + name : undefined;
  //   //return branch ? branch.code : undefined;
  // }


  getbranchFK() {
    let branchkeyvalue = '';
    this.spinner.show();
    this.Faservice.getassetbranchdata(branchkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.spinner.hide();
        this.branchList = datas;
        console.log("branchList", datas)
      })
  }








  onCancelClick() {
    this.onCancel.emit()
   }

  


}
