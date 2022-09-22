import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { AtmaService } from '../atma.service'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ShareService } from '../share.service'
import { Router } from '@angular/router'
import { getAllJSDocTagsOfKind } from 'typescript';
import { getMatFormFieldPlaceholderConflictError } from '@angular/material/form-field';
import { NotificationService } from '../notification.service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent,MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
export interface classification {
  id: string;
  text: string;
}
export interface RM {
  id: string;
  full_name: string;
}
export interface Designation {
  id: string;
  name: string;
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

@Injectable()
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
  selector: 'app-vendor-summary',
  templateUrl: './vendor-summary.component.html',
  styleUrls: ['./vendor-summary.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})

export class VendorSummaryComponent implements OnInit {
  vendorSummaryList: any;
  searchValue: any;
  vendorDataLength: any;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  inputGstValue = "";
  inputPanValue = "";
  employeeList: Array<RM>;
  designationList: Array<Designation>;
  isLoading = false;
  classificationList: Array<classification>;
  pageSize = 10;
  isVendorSummaryPagination: boolean;
  vendorSearchForm: FormGroup;
  isRejectRemarks = false;
  rejectedList: any;
  id: number;
  StatusTag: any;
  detailsForm: FormGroup
  
   VendorstatusesList=[{'id':1,'name':'Draft'},{'id':2, 'name':'Pending RM'},{'id':4, 'name':'Pending Header'},{'id':8, 'name':'Pending Compliance'},
   {'id':5, 'name':'Approved'},{'id':0, 'name':'Rejected'}]
  //  VendorstatusesList=[{'id':1,'name':'Draft'},{'id':2, 'name':'Pending RM'},{'id':4, 'name':'Pending Header'},{'id':8, 'name':'Pending Compliance'},
  //  {'id':5, 'name':'Approved'},{'id':6, 'name':'Renewal Approved'},{'id':0, 'name':'Rejected'}]
  //  Vendorstatuslist: string[] = ['All', 'Activation', 'Deactivation', 'Approved', 'Queue', 'Modification', 'Renewal', 'Termination','Pending'];
   Vendorstatuslist: string[] = ['All', 'Activation', 'Deactivation', 'Approved', 'Queue', 'Modification', 'Termination','Pending'];
  @ViewChild('classify') matclassifyAutocomplete: MatAutocomplete;
  @ViewChild('classifyInput') classifyInput: any;
  @ViewChild('rmemp') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('rmInput') rmInput: any;

  constructor(private atmaService: AtmaService,private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService, private fb: FormBuilder,private notification: NotificationService, public datepipe: DatePipe,
    private router: Router,
    private shareService: ShareService) { }


  ngOnInit(): void {
    this.getVendorSummary();
    this.vendorSearchForm = this.fb.group({
      name: [''],
      panno: [''],
      gstno: [''],
      code:[''],
      classification: [''],
      rm_id:[''],
      renewal_date: [''],
      vendor_status: [''],
      vendorstatus: new FormControl(null),
      
      
    })
    this.detailsForm = this.fb.group({
      rm_id:[''],
      supplier_id:['']
    })
  }

  getVendorSummary(pageNumber = 1, pageSize = 10) {
    this.atmaService.getVendorSummary(pageNumber, pageSize)
      .subscribe(result => {
        this.vendorSummaryList = result['data']
        let dataPagination = result['pagination'];
        if (this.vendorSummaryList.length >= 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isVendorSummaryPagination = true;
        } if (this.vendorSummaryList <= 0) {
          this.isVendorSummaryPagination = false;
        }

        console.log("VendorSummary", result)
      })
  }
  nextClick() {
    if (this.has_next === true) {
      if (this.StatusTag === 'Modification') {
        this.currentpage = this.presentpage + 1
        this.getfilterdata(this.id, this.presentpage + 1, 10)
      }
      else if (this.StatusTag === 'Activation') {
        this.currentpage = this.presentpage + 1
        this.getfilterdata(this.id, this.presentpage + 1, 10)
      }
      else if (this.StatusTag === 'Deactivation') {
        this.currentpage = this.presentpage + 1
        this.getfilterdata(this.id, this.presentpage + 1, 10)
      }
      else if (this.StatusTag === 'Termination') {
        this.currentpage = this.presentpage + 1
        this.getfilterdata(this.id, this.presentpage + 1, 10)
      }
      else if (this.StatusTag === 'Renewal') {
        this.currentpage = this.presentpage + 1
        this.getfilterdata(this.id, this.presentpage + 1, 10)
      }
      else if (this.StatusTag === 'Queue') {
        this.currentpage = this.presentpage + 1
        this.getfilterdata(this.id, this.presentpage + 1, 10)
      }
      else if (this.StatusTag === 'Approved') {
        this.currentpage = this.presentpage + 1
        this.getfilterdata(this.id, this.presentpage + 1, 10)
      }
      else if (this.StatusTag === 'Pending') {
        this.currentpage = this.presentpage + 1
        this.getfilterdata(this.id, this.presentpage + 1, 10)
      }
      else if(this.search_flag){
        this.currentpage = this.presentpage + 1
        this.getfilternext_perviousdata(this.presentpage + 1)

      }


      else {
        this.currentpage = this.presentpage + 1
        this.getVendorSummary(this.presentpage + 1, 10)
      }
    }
  }

  previousClick() {
    if (this.has_previous === true) {
      if (this.StatusTag === 'Modification') {
        this.currentpage = this.presentpage - 1
        this.getfilterdata(this.id, this.presentpage - 1, 10)
      }else if (this.StatusTag === 'Activation') {
        this.currentpage = this.presentpage - 1
        this.getfilterdata(this.id, this.presentpage - 1, 10)
      }
      else if (this.StatusTag === 'Deactivation') {
        this.currentpage = this.presentpage - 1
        this.getfilterdata(this.id, this.presentpage - 1, 10)
      }
      else if (this.StatusTag === 'Termination') {
        this.currentpage = this.presentpage - 1
        this.getfilterdata(this.id, this.presentpage - 1, 10)
      }
      else if (this.StatusTag === 'Renewal') {
        this.currentpage = this.presentpage - 1
        this.getfilterdata(this.id, this.presentpage - 1, 10)
      }
      else if (this.StatusTag === 'Queue') {
        this.currentpage = this.presentpage - 1
        this.getfilterdata(this.id, this.presentpage - 1, 10)
      }
      else if (this.StatusTag === 'Approved') {
        this.currentpage = this.presentpage - 1
        this.getfilterdata(this.id, this.presentpage - 1, 10)
      }
      else if (this.StatusTag === 'Pending') {
        this.currentpage = this.presentpage - 1
        this.getfilterdata(this.id, this.presentpage - 1, 10)
      }

      else if(this.search_flag){
        this.currentpage = this.presentpage - 1
        this.getfilternext_perviousdata(this.presentpage - 1)

      }
     

      else {
        this.currentpage = this.presentpage - 1
        this.getVendorSummary(this.presentpage - 1, 10)
      }
    }
  }

  search_flag = false;
  page_number= 1
  vendorSearch() {
    this.page_number =1;
    this.search_flag = true;
    this.SpinnerService.show();
    // this.vendorSearchForm.value.code='su';
    let search = this.vendorSearchForm.value;
  
    // if (search.rm_id == null || search.rm_id == ''|| search.rm_id==undefined) {
    //   this.vendorSearchForm.value.rm_id = ''
    // }
    
    // else{
    //   this.vendorSearchForm.value.rm_id= this.vendorSearchForm.value.rm_id.id
    // }
    if (search.classification == null || search.classification == ''|| search.classification==undefined) {
      // search.classification.id = "''"
      this.vendorSearchForm.value.classification=''
    }else{
      this.vendorSearchForm.value.classification= this.vendorSearchForm.value.classification.id
    }
    // if (search.renewal_date == null || search.renewal_date == '' || search.renewal_date == "''" ) {
    //   this.vendorSearchForm.value.renewal_date== ''
    // }else{
    //   this.vendorSearchForm.value.renewal_date=this.datepipe.transform(this.vendorSearchForm.value.renewal_date, 'yyyy-MM-dd')
    // }
    if (search.vendor_status == null || search.vendor_status == ''|| search.vendor_status==undefined) {
      if(search.vendor_status == '0'){
        this.vendorSearchForm.value.vendor_status= this.vendorSearchForm.value.vendor_status
      } else{
        this.vendorSearchForm.value.vendor_status = ''
      }
    }
    else{
      this.vendorSearchForm.value.vendor_status= this.vendorSearchForm.value.vendor_status
    }
    
    this.atmaService.getVendorSearch(this.vendorSearchForm.value,this.page_number)
      .subscribe(result => {
        console.log("RESULSSS", result)
        if(result.data){
          this.vendorSummaryList = result['data']
          let dataPagination = result['pagination'];
          if (this.vendorSummaryList.length >= 0) {
            this.has_next = dataPagination.has_next;
            this.has_previous = dataPagination.has_previous;
            this.presentpage = dataPagination.index;
            this.isVendorSummaryPagination = true;
          } if (this.vendorSummaryList <= 0) {
            this.isVendorSummaryPagination = false;
          }
          this.SpinnerService.hide();

        }
       

       
      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )

  }


  getfilternext_perviousdata(page_number){
    let search = this.vendorSearchForm.value;
  
    // if (search.rm_id == null || search.rm_id == ''|| search.rm_id==undefined) {
    //   this.vendorSearchForm.value.rm_id = ''
    // }
    
    // else{
    //   this.vendorSearchForm.value.rm_id= this.vendorSearchForm.value.rm_id.id
    // }
    // if (search.classification == null || search.classification == ''|| search.classification==undefined) {
    //   // search.classification.id = "''"
    //   this.vendorSearchForm.value.classification=''
    // }else{
    //   this.vendorSearchForm.value.classification= this.vendorSearchForm.value.classification.id
    // }
    // if (search.renewal_date == null || search.renewal_date == '' || search.renewal_date == "''" ) {
    //   this.vendorSearchForm.value.renewal_date== ''
    // }else{
    //   this.vendorSearchForm.value.renewal_date=this.datepipe.transform(this.vendorSearchForm.value.renewal_date, 'yyyy-MM-dd')
    // }
    if (search.vendor_status == null || search.vendor_status == ''|| search.vendor_status==undefined) {
      if(search.vendor_status == '0'){
        this.vendorSearchForm.value.vendor_status= this.vendorSearchForm.value.vendor_status
      } else{
        this.vendorSearchForm.value.vendor_status = ''
      }
    }
    else{
      this.vendorSearchForm.value.vendor_status= this.vendorSearchForm.value.vendor_status
    }
    this.atmaService.getVendorSearch(this.vendorSearchForm.value,page_number)
    .subscribe(result => {
      console.log("RESULSSS", result)
      if(result.data){
        this.vendorSummaryList = result['data']
        let dataPagination = result['pagination'];
        if (this.vendorSummaryList.length >= 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isVendorSummaryPagination = true;
        } if (this.vendorSummaryList <= 0) {
          this.isVendorSummaryPagination = false;
        }
        this.SpinnerService.hide();

      }
     

     
    },
    error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
    )
  }

  vendorView(vendorViewData) {
    this.shareService.vendorView.next(vendorViewData);
    this.router.navigate(['/atma/vendorView'], { skipLocationChange: true })
  }

  vendorEdit(vendorEditData) {
    this.shareService.vendorEditValue.next(vendorEditData);
    this.router.navigate(['/atma/vendoredit'], { skipLocationChange: true })
  }

  rejectPopup(status, vendorId) {
    if (status === 'REJECTED') {
      this.isRejectRemarks = true;
      this.atmaService.getRejected(vendorId)
        .subscribe(result => {
          let data = result['data'];
          let rejectList = data
          let io = rejectList.length - 1;
          this.rejectedList = rejectList[io].comments;
        })
    } else {
      this.isRejectRemarks = false
    }
  }


  getfilterdata(id, pageNumber, pageSize) {

    this.atmaService.getstatusfilter(id, pageNumber, pageSize)
      .subscribe(result => {
        this.vendorSummaryList = result['data']
        let dataPagination = result['pagination'];
        if (this.vendorSummaryList.length >= 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isVendorSummaryPagination = true;
        } if (this.vendorSummaryList <= 0) {
          this.isVendorSummaryPagination = false;
        }


      })
  }

  Vendorchange(e) {
    if (e.isUserInput == true) {
      this.StatusTag = e.source.value;
      if (this.StatusTag === 'Modification') {

        this.id = 2;
        this.getfilterdata(this.id, 1, 10)

      }
      if (this.StatusTag === 'Activation') {

        this.id = 3;
        this.getfilterdata(this.id, 1, 10)

      }
      if (this.StatusTag === 'Deactivation') {
       
        this.id = 4;
        this.getfilterdata(this.id, 1, 10)

      }
      if (this.StatusTag === 'Termination') {
      
        this.id = 6;
        this.getfilterdata(this.id, 1, 10)

      }
      if (this.StatusTag === 'Renewal') {

     
        this.id = 5;
        this.getfilterdata(this.id, 1, 10)

      }
      if (this.StatusTag == 'Queue') {


        this.id=7;
          this.getfilterdata(this.id, 1, 10)

      }
      if (this.StatusTag == 'Approved') {

        this.id=1
        this.getfilterdata(this.id, 1, 10)

      }
      if (this.StatusTag == 'Pending') {

        this.id=8
        this.getfilterdata(this.id, 1, 10)

      }
      if (this.StatusTag === 'All') {
        this.getVendorSummary(1,10)
      }
    }
  }

  
  validationPAN(e) {
    let panno = e.target.value;
    this.atmaService.getVendorPanNumber(panno).then(res => {
        let result = res.validation_status
        // this.pan_status = result
        if (result === false) {
          this.notification.showWarning("Please Enter a Valid PAN Number")
        } else {
          this.notification.showSuccess("PAN Number validated...")
        }

      })
  }

  validationGstNo(e) {
    let gstno = e.target.value;
    this.atmaService.getVendorGstNumber(gstno)
      .then(res => {
        let result = res.validation_status
        // this.gst_status = result
        if (result === false) {
          this.notification.showWarning("Please Enter a Valid GST Number")
        } else {
          this.notification.showSuccess("GST Number validated...")
        }

      })
  }
  namevalidation(event){
    
    var inp = String.fromCharCode(event.keyCode);
  
    if (/[a-zA-Z0-9-]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  classifyname(){
   
    this.getClassification();

    this.vendorSearchForm.get('classification').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.atmaService.getClassification()
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
            
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.classificationList = datas;

      })
  }

  private getClassification() {
    this.atmaService.getClassification()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.classificationList = datas;
      })
  }
  public displayFnclassify(classify?: classification): string | undefined {
    return classify ? classify.text : undefined;
  }
  
  get classify() {
    return this.vendorSearchForm.get('classification');
  }
  rmname(){
    let rmkeyvalue: String = "";
      this.getRmEmployee(rmkeyvalue);
  
      this.detailsForm.get('rm_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.atmaService.get_EmployeeName(value,1)
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

      private getRmEmployee(rmkeyvalue) {
        this.atmaService.getEmployeeSearchFilter(rmkeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.employeeList = datas;
          })
      }
      public displayFnRm(rmemp?: RM): string | undefined {
        return rmemp ? rmemp.full_name : undefined;
      }
    
      get rmemp() {
        return this.detailsForm.value.get('rm_id');
      }


      designationname(){
        let desgkeyvalue: String = "";
      this.getDesignation(desgkeyvalue);
      this.detailsForm.get('supplier_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.atmaService.get_supplier(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.designationList = datas;
  
        })
      }

      private getDesignation(desgkeyvalue) {
        this.atmaService.getSupplierSearch(desgkeyvalue)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.designationList = datas;
            // console.log("designation", datas)
    
          })
      }

      public displayFnDesg(desg?: Designation): string | undefined {
        return desg ? desg.name : undefined;
      }
    
      get desg() {
        return this.detailsForm.value.get('supplier_id');
      }
}
