import { Component, ElementRef, OnInit, ViewChild, Directive, HostListener, TemplateRef, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { faservice } from '../fa.service';
import { faShareService } from '../share.service';
import {ToastrService} from 'ngx-toastr';
import { Observable,fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap, timeout } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { DatePipe, formatDate } from '@angular/common';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { ErrorHandlerService } from '../error-handler.service';

export interface BRANCH {
  name: string;
  code: string;
  id: string;
  
}
export interface empdata{
  id:string;
  full_name:string;
  // code:string;
}
export interface assetid{
  id:any;
  barcode:string;
}
interface condition {
  value: string;
  viewValue: string;
}

interface status {
  value: string;
  viewValue: string;
}
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


@Component({
  selector: 'app-fa-pv',
  templateUrl: './fa-pv.component.html',
  styleUrls: ['./fa-pv.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
// @Injectable({
//   providedIn: 'root'
// })
export class FaPvComponent implements OnInit {

  @ViewChild('fileInput') frmdata:FormData;
  @ViewChild('exampleModal') public exampleModal: ElementRef;
  @ViewChild('exampleModals') public exampleModals: ElementRef;

  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild( MatAutocompleteTrigger ) autocompletetrigger: MatAutocompleteTrigger;
  @ViewChild('Asset_id') matassetAutocomplete: MatAutocomplete;
  @ViewChild('assetidInput') Inputassetid: any;

  @ViewChild('exampleModal') refmodalclose:ElementRef<any>;
  @ViewChild('Asset_edit') matasseteditAutocomplete: MatAutocomplete;
  @ViewChild('assetideditInput') Inputasseteditid: any;

  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchidInput') branchidInput: any;
  @ViewChild('emprefid') matasstisAutocomplete:MatAutocomplete;
  // @ViewChild('inputid') inputid:any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('dialogdata') dialogopen:TemplateRef<any>;
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  showModal: boolean;
  assetcatlist=[]

  conditions: condition[] = [
    {value: 'In use', viewValue: 'In use'},
    {value: 'Not in use', viewValue: 'Not in use'},
    {value: 'In need of repair', viewValue: 'In need of repair'}
  ];

  status: status[] = [
    {value: 'Available', viewValue: 'Available '},
    {value: 'Not available', viewValue: 'Not available'},
    {value: 'Transferred (if transferred enter branch name)', viewValue: 'Transferred (if transferred enter branch name)'}
  ];

  d1:any;
  d2:any;
  data:any;
  as_assetcat=[];
  as_product=[];
  as_Asset_id=[];
  booleancondition = true;
  searchdata = {
    "barcode": "",
    "branch": "",
    "Asset_edit":""
  }
  ctrl_branch_id: any;
  search_mod = false;
  images:any;
  currentElement:any;
  Asset_id:number;
  branch:number;
  pageLength_popup:any;
  isLoading = false;
  has_nextbuk = true;
  has_previousbuk = true;
  assetsave:any= FormGroup;
  frmData :any= new FormData();
  assetgroupform:any= FormGroup;
  asset_details:any={}
  factor: number;
  pageNumber:number = 1;
  currentpagecom_branch=1;
  as_branchname=[];
  has_nextcom_branch=true;
  has_previouscom=true;
  selectedPersonId: number;
  presentpagebuk: number = 1;
  pageSize = 10;
  data_save: {};
  listcomments:Array<any>=[];
  datapagination:any=[];
  notEmptyPost = true;
  notScrolly = true;
  totalRecords: string;
  currentPage: number = 1;  
  config: any;
  hideBranch = true;
  flag = false;
  addRowOnce = false;
  statusCheck = false;
  newFlag = false;
  readOnly = true;
  displayedFields:string[] = ["S.No","Asset ID","Product Name","Branch Code","Branch Name","Asset Cost","Asset Value","Status","Asset Tag","Make","Serial no","Condition","Remarks","Add Row","Image Upload","Save"];
  branchdata: any=[];
  branch_id: any;
  branch_names: any;
  branch_codes: any;
  id: any;
  addRowDisable=false;
  addrowRemove = true;
  addrowCheck = true;
  saveCheck = false;
  ctrl_branch:any;
  save_btn = false;
  // private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  // private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  // get images(): string[] {
  //   const selectedPerson = this.assetcatlist.find(person => person.id === this.selectedPersonId);
  //   if (selectedPerson?.images.length) {
  //     return selectedPerson.images;
  //   }

  //   return [];
  // }

  empmapform:any=FormGroup;
  empmapformsearch:any=FormGroup;
  empmappingDetails:Array<any>=[];
  empdrpdwndata:Array<any>=[];
  has_empnext:boolean=false;
  has_empprevious:boolean=false;
  emppresentpage:number=1;
  cpdateidlist:Array<any>=[];
  pagesize:10;
  has_nextid:boolean=true;
  has_previousid:boolean=true;
  has_presentid:number=1;
  dateform:any=FormGroup;
  constructor(private errorHandler:ErrorHandlerService,private datepipe:DatePipe,private matdialog:MatDialog, private router: Router, private share: faShareService, private http: HttpClient,
     private Faservice: faservice, private toastr:ToastrService, private spinner: NgxSpinnerService,
      private fb: FormBuilder, route:ActivatedRoute, private el: ElementRef ) { }


  ngOnInit(): void {
  this.data = this.share.regular.value;
  this.dateform=this.fb.group({
    'warfrom':[''],
    'warend':['']
  });
  this.empmapform=this.fb.group({
    'empname':new FormControl(''),
    'assetbarcode':new FormControl(''),
    'capdate':new FormControl(''),
    'todate':new FormControl('')
  });
  this.empmapformsearch=this.fb.group({
    'empname':new FormControl(''),
    'assetbarcode':new FormControl('')
  });
  this.assetsave =this.fb.group({
    "listproduct":this.fb.array([
      this.fb.group({
      'id':'',
      'barcode':new FormControl(),
      'product_name':new FormControl(),
      'branch_code':new FormControl(),
      'branch_name':new FormControl(),
      'asset_cost':new FormControl(),
      'asset_value':new FormControl(),
      'asset_tag':new FormControl(),
      'make':new FormControl(),
      'condition':new FormControl(),
      'status':new FormControl(),
      'serial_no': new FormControl(),
      'crnum':new FormControl(),
      'kvb_asset_id':new FormControl(),
      'images': new FormControl(),
      'remarks' : new FormControl(),
      'warenb':new FormControl(false),
      'warfrom':new FormControl(''),
      'warend':new FormControl(''),
      'it_configuration':new FormControl('')
      })
    ])
      
    });

  if (this.data = "REGULAR") {
    console.log('condition1=',this.data);
    this.assetgroupform =this.fb.group({
      'Asset_id':new FormControl(),
      'branch':new FormControl(),
      'Asset_edit':new FormControl()
    });

    // this.assetgroupform = this.fb.group({
    //     Asset_id: [''],
    //     branch: [''],
    // })

    console.log(this.flag)


  this.getdata();

  // checkVisibility() {
  //   let columnCheck: boolean = true;
  //   for (var i = 0; i < this.listcomments.length; i++) {
  //     if (this.listcomments[i].id === this.as_assetcat[i].id) {
  //       return false;
  //     }
  //   }
  //   return columnCheck;
  // }

    // this.assetgroupform.get('Asset_id').valueChanges.pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(()=>{
    //     this.isLoading=true;
    //   }),
    //   switchMap((value:any) => this.Faservice.getassetsearch(value).pipe(
    //     finalize(()=>{
    //       this.isLoading=false;
    //     })
    //   ))
    // ).
    //   subscribe((results: any[]) => {
    //       this.listcomments=results['data']
    //       console.log('asset_id=',results)
    //   });
    this.Faservice.getemployeedropdown('',1).subscribe(data=>{
      this.empdrpdwndata=data['data'];
    });
    this.empmapform.get('empname').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.Faservice.getemployeedropdown(this.empmapform.get('empname').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.empdrpdwndata=data['data'];
    })
    this.empmapformsearch.get('empname').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.Faservice.getemployeedropdown(this.empmapformsearch.get('empname').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.empdrpdwndata=data['data'];
    });
    this.Faservice.getcpdatecheckerassetid('',1).subscribe(data=>{
      this.cpdateidlist=data['data'];
    });
    this.empmapform.get('assetbarcode').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.Faservice.getcpdatecheckerassetid(this.empmapform.get('assetbarcode').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.cpdateidlist=data['data'];
    });
    this.empmapformsearch.get('assetbarcode').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.Faservice.getcpdatecheckerassetid(this.empmapformsearch.get('assetbarcode').value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.cpdateidlist=data['data'];
    });
      this.Faservice.getbranchsearch('',1).subscribe(data=>{
        this.branchdata=data['data'];
      })
      this.assetgroupform.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
  
        }),
        switchMap(value => this.Faservice.getbranchsearch(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
  
      .subscribe((results: any[]) => {
        this.branchdata = results["data"];
        console.log('branch_id=',results)
        console.log('branch_data=',this.branchdata)
  
      });
      this.getemploueemapdetails();

  }}
  patchwarrantydata(data:any,i:any){
    let warstart:any=this.dateform.get('warfrom').value;
    let warend:any=this.dateform.get('warend').value;
    (this.assetsave.get('listproduct') as FormArray).at(i).patchValue({'warfrom':warstart,'warend':warend,'warenb':true});
    this.dateform.reset('');
  }
  patchwarrantydisable(i:any){
    (this.assetsave.get('listproduct') as FormArray).at(i).patchValue({'warenb':false});
  }
  getdata(){
    (this.assetsave.get('listproduct') as FormArray).clear()
    let search:string="";
    console.log(this.assetgroupform.value)
    if(this.assetgroupform.get('branch').value!='' && this.assetgroupform.get('branch').value!=null){
      console.log('hi')
      // this.searchdata.branch=this.assetgroupform.value.branch
      search=search+"&branch="+this.branch_id;
    }
    
    if(this.assetgroupform.get('Asset_id').value!='' && this.assetgroupform.get('Asset_id').value!=null){
      console.log('hii')
      // this.searchdata.barcode=this.assetgroupform.value.barcode
      search=search+"&barcode="+this.assetgroupform.get('Asset_id').value;
    }
    this.spinner.show();
    console.log(search)
    this.Faservice.getassetdata1(this.pageNumber = 1, this.pageSize = 10,search).subscribe((data) => {
      if(data.description == 'Invalid Branch Id'){
        this.toastr.error('No Branch ID Assigned')
        this.addRowDisable = true;
      }
      else if(data.code == "Header ID Not Matched"){
        this.toastr.error('Header ID Not Matched')
        this.spinner.hide()
        this.pageLength_popup = 0
        this.addRowDisable = true;
      }
      else if(data['data'].length == 0){
        this.toastr.error('No Data')
        this.spinner.hide()
        this.pageLength_popup = 0
      }
      else{
      // if(data['data']['desp_startswith']==false){
      //   delete data['data']['description']
      // }
      this.listcomments = data['data'];
      this.addRowDisable = false;
        setTimeout(() => {
          /** spinner ends after 3 seconds */
          this.spinner.hide();
        }, 3000);
      console.log( data);
      this.spinner.hide();
      if(data['data'].length==0){
        this.toastr.warning('Matching data Not Found');
      }
      for (let i=0; i<this.listcomments.length; i++){
        this.listcomments[i]['is_Checked']=false;    
        this.listcomments[i]['images'] = [];
        this.listcomments[i]['image'] = [];
        this.listcomments[i]['files'] = [];
        this.listcomments[i]['control_office_branch'] = this.listcomments[i].branch_id?.control_office_branch
        this.branch_names = this.listcomments[0].branch_id?.name
        this.branch_codes = this.listcomments[0].branch_id?.code
        if(this.listcomments[0].branch_id?.control_office_branch == null){
          this.ctrl_branch_id = this.listcomments[0].branch_id?.code  
        }
        else{
          this.ctrl_branch_id = this.listcomments[0].branch_id?.control_office_branch
        }
      }
      this.datapagination = data['pagination'];
      this.pageLength_popup = data['count'];
      console.log('total ', this.pageLength_popup)
      console.log('d-',data['data']);
      console.log('page',this.datapagination)
      if (this.listcomments.length >= 0) {
        this.has_nextbuk = this.datapagination.has_next;
        this.has_previousbuk = this.datapagination.has_previous;
        this.presentpagebuk = this.datapagination.index;
      }
      console.log(this.listcomments.length);
      for(let i=0;i<this.listcomments.length;i++){
        console.log('hiii');
    (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({


      'id':new FormControl(),
      'barcode':new FormControl(),
      'product_name':new FormControl(),
      'branch_code':new FormControl(),
      'branch_name':new FormControl(),
      'asset_cost':new FormControl(),
      'asset_value':new FormControl(),
      'asset_tag':new FormControl(),
      'make':new FormControl(),
      'condition':new FormControl(),
      'status':new FormControl(),
      'serial_no': new FormControl(),
      'crnum':new FormControl(),
      'kvb_asset_id':new FormControl(),
      'images': new FormControl(),
      'remarks' : new FormControl(),
      'warenb':new FormControl(false),
      'warfrom':new FormControl(''),
      'warend':new FormControl(''),
      'it_configuration':new FormControl('')
    }));
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('id').patchValue(this.listcomments[i].id);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('barcode').patchValue(this.listcomments[i].barcode);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_name').patchValue(this.listcomments[i].product_id);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_code').patchValue(this.listcomments[i].branch_id?.code);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_name').patchValue(this.listcomments[i].branch_id?.name);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_cost').patchValue(this.listcomments[i].assetdetails_cost);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_value').patchValue(this.listcomments[i].assetdetails_value);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_tag').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('make').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('condition').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('status').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serial_no').patchValue(this.listcomments[i].serial_no);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i].invoice_id?.ecfnum);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('kvb_asset_id').patchValue(this.listcomments[i].description.slice(1,15));
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('images').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('remarks').patchValue(this.listcomments[i].remarks);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('warenb').patchValue(this.listcomments[i].warenb);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('warfrom').patchValue(this.listcomments[i].warrenty_startdate);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('warend').patchValue(this.listcomments[i].warrenty_enddate);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('it_configuration').patchValue(this.listcomments[i].it_configuration ? this.listcomments[i].it_configuration:'');
    
    
      }
      // let i:any=((this.assetsave.get('listproduct') as FormArray).length);
      // ((this.assetsave.get('listproduct') as FormArray).removeAt(i[11]-1));
      }},
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      }
      )
      
  }

  getdata1(){
    (this.assetsave.get('listproduct') as FormArray).clear()
    let search:string="";
    console.log(this.assetgroupform.value)
    if(this.assetgroupform.get('branch').value!='' && this.assetgroupform.get('branch').value!=null){
      console.log('hi')
      // this.searchdata.branch=this.assetgroupform.value.branch
      search=search+"&branch="+this.branch_id;
    }
    
    if(this.assetgroupform.get('Asset_id').value!='' && this.assetgroupform.get('Asset_id').value!=null){
      console.log('hii')
      // this.searchdata.barcode=this.assetgroupform.value.barcode
      search=search+"&barcode="+this.assetgroupform.get('Asset_id').value;
    }
    this.spinner.show();
    console.log(search)
    this.Faservice.getassetdata2(this.pageNumber = 1, this.pageSize = 10,search).subscribe((data) => {
      if(data.description == 'Invalid Branch Id'){
        this.toastr.error('No Branch ID Assigned')
        this.addRowDisable = true;
      }
      else if(data.code == "Header ID Not Matched"){
        this.toastr.error('Header ID Not Matched')
        this.spinner.hide()
        this.pageLength_popup = 0
        this.addRowDisable = true;
      }
      else if(data['data'].length == 0){
        this.toastr.error('No Data')
        this.spinner.hide()
        this.pageLength_popup = 0
        this.addRowDisable = true;
      }
      else{
      this.listcomments = data['data'];
      this.addRowDisable = false;
        setTimeout(() => {
          /** spinner ends after 3 seconds */
          this.spinner.hide();
        }, 3000);
      console.log( data);
      for (let i=0; i<this.listcomments.length; i++){
        this.listcomments[i]['is_Checked']=false;    
        this.listcomments[i]['images'] = [];
        this.listcomments[i]['image'] = [];
        this.listcomments[i]['files'] = [];
        this.listcomments[i]['control_office_branch'] = this.listcomments[0].branch_id?.control_office_branch
        this.branch_names = this.listcomments[0].branch_id?.name
        this.branch_codes = this.listcomments[0].branch_id?.code
        if(this.listcomments[0].branch_id?.control_office_branch == null){
          this.ctrl_branch_id = this.listcomments[0].branch_id?.code  
        }
        else{
          this.ctrl_branch_id = this.listcomments[0].branch_id?.control_office_branch
        }
      }
      this.datapagination = data['pagination'];
      this.pageLength_popup = data['count'];
      console.log('total ', this.pageLength_popup)
      console.log('d-',data['data']);
      console.log('page',this.datapagination)
      if (this.listcomments.length >= 0) {
        this.has_nextbuk = this.datapagination.has_next;
        this.has_previousbuk = this.datapagination.has_previous;
        this.presentpagebuk = this.datapagination.index;
      }
      console.log(this.listcomments.length);
      for(let i=0;i<this.listcomments.length;i++){
        console.log('hiii');
    (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({


      'id':new FormControl(),
      'barcode':new FormControl(),
      'product_name':new FormControl(),
      'branch_code':new FormControl(),
      'branch_name':new FormControl(),
      'asset_cost':new FormControl(),
      'asset_value':new FormControl(),
      'asset_tag':new FormControl(),
      'make':new FormControl(),
      'condition':new FormControl(),
      'status':new FormControl(),
      'serial_no': new FormControl(),
      'crnum':new FormControl(),
      'kvb_asset_id':new FormControl(),
      'images': new FormControl(),
      'remarks' : new FormControl(),
      'warenb':new FormControl(false),
      'warfrom':new FormControl(''),
      'warend':new FormControl(''),
      'it_configuration':new FormControl('')
    }));
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('id').patchValue(this.listcomments[i].id);

    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('barcode').patchValue(this.listcomments[i].barcode);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i].crnum);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_name').patchValue(this.listcomments[i].product_id);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_code').patchValue(this.listcomments[i].branch_id?.code);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_name').patchValue(this.listcomments[i].branch_id?.name);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_cost').patchValue(this.listcomments[i].assetdetails_cost);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_value').patchValue(this.listcomments[i].assetdetails_value);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_tag').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('make').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('condition').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('status').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serial_no').patchValue(this.listcomments[i].serial_no);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i].invoice_id?.ecfnum);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('kvb_asset_id').patchValue(this.listcomments[i].description.slice(1,15));
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('images').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('remarks').patchValue(this.listcomments[i].remarks);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('warenb').patchValue(this.listcomments[i].warenb);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('warfrom').patchValue(this.listcomments[i].warrenty_startdate);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('warend').patchValue(this.listcomments[i].warrenty_enddate);
    ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('it_configuration').patchValue(this.listcomments[i].it_configuration ? this.listcomments[i].it_configuration:'');
    
    
      }
      // let i:any=((this.assetsave.get('listproduct') as FormArray).length);
      // ((this.assetsave.get('listproduct') as FormArray).removeAt(i[11]-1));
      }},
      (error)=>{
        this.spinner.hide();
        this.toastr.warning(error.status+error.statusText)
      }
      )
    }

    getdata_edit(){
      (this.assetsave.get('listproduct') as FormArray).clear()
      let search:string="";
      console.log(this.assetgroupform.value)
      
      if(this.assetgroupform.get('Asset_edit').value!='' && this.assetgroupform.get('Asset_edit').value!=null){
        console.log('hii')
        // this.searchdata.barcode=this.assetgroupform.value.barcode
        search=search+"&Asset_edit="+this.assetgroupform.get('Asset_edit').value;
      }
      this.spinner.show();
      console.log(search)
      this.Faservice.getassetdataedit(this.pageNumber = 1, this.pageSize = 10,search).subscribe((data) => {
        console.log(data)
        if(data['code'] == 'Not Available'){
          this.toastr.error('Maker Already Approved')
          this.spinner.hide()
          this.pageLength_popup = 0
          this.addRowDisable = true;
        }
        else if(data['data'].length==0){
          this.toastr.warning('Matching data Not Found');
          this.addRowDisable = true;
        }
        else{
          this.toastr.warning('Maker Already Done')
          this.listcomments = data['data'];
          this.addRowDisable = false;
            setTimeout(() => {
              /** spinner ends after 3 seconds */
              this.spinner.hide();
            }, 3000);
          console.log( data);
          for (let i=0; i<this.listcomments.length; i++){
            this.listcomments[i]['is_Checked']=false;    
            this.listcomments[i]['images'] = [];
            this.listcomments[i]['image'] = [];
            this.listcomments[i]['files'] = [];
            this.listcomments[i]['control_office_branch'] = this.listcomments[i].branch_id?.control_office_branch
            this.branch_names = this.listcomments[0].branch_id?.name
            this.branch_codes = this.listcomments[0].branch_id?.code
            if(this.listcomments[0].branch_id?.control_office_branch == null){
              this.ctrl_branch_id = this.listcomments[0].branch_id?.code  
            }
            else{
              this.ctrl_branch_id = this.listcomments[0].branch_id?.control_office_branch
            }
          }
          this.datapagination = data['pagination'];
          this.pageLength_popup = data['count'];
          console.log('total ', this.pageLength_popup)
          console.log('d-',data['data']);
          console.log('page',this.datapagination)
          if (this.listcomments.length >= 0) {
            this.has_nextbuk = this.datapagination.has_next;
            this.has_previousbuk = this.datapagination.has_previous;
            this.presentpagebuk = this.datapagination.index;
          }
          console.log(this.listcomments.length);
          for(let i=0;i<this.listcomments.length;i++){
            console.log('hiii');
        (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({
    
    
          'id':new FormControl(),
          'barcode':new FormControl(),
          'product_name':new FormControl(),
          'branch_code':new FormControl(),
          'branch_name':new FormControl(),
          'asset_cost':new FormControl(),
          'asset_value':new FormControl(),
          'asset_tag':new FormControl(),
          'make':new FormControl(),
          'condition':new FormControl(),
          'status':new FormControl(),
          'serial_no': new FormControl(),
          'crnum':new FormControl(),
          'kvb_asset_id':new FormControl(),
          'images': new FormControl(),
          'remarks' : new FormControl(),
          'warenb':new FormControl(false),
          'warfrom':new FormControl(''),
          'warend':new FormControl(''),
          'it_configuration':new FormControl('')
        }));
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('id').patchValue(this.listcomments[i].id);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('barcode').patchValue(this.listcomments[i].barcode);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_name').patchValue(this.listcomments[i].product_id);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_code').patchValue(this.listcomments[i].branch_code);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_name').patchValue(this.listcomments[i].branch_name);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_cost').patchValue(this.listcomments[i].assetdetails_cost);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_value').patchValue(this.listcomments[i].assetdetails_value);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_tag').patchValue(this.listcomments[i].asset_tag);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('make').patchValue(this.listcomments[i].make);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('condition').patchValue(this.listcomments[i].condition);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('status').patchValue(this.listcomments[i].status);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serial_no').patchValue(this.listcomments[i].serial_no);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i].invoice_id);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('kvb_asset_id').patchValue(this.listcomments[i].description);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('images').patchValue('');
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('remarks').patchValue(this.listcomments[i].remarks);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('warenb').patchValue(this.listcomments[i].warenb);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('warfrom').patchValue(this.listcomments[i].warrenty_startdate);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('warend').patchValue(this.listcomments[i].warrenty_enddate);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('it_configuration').patchValue(this.listcomments[i].it_configuration ? this.listcomments[i].it_configuration:'');
        
        
          }
          // let i:any=((this.assetsave.get('listproduct') as FormArray).length);
          // ((this.assetsave.get('listproduct') as FormArray).removeAt(i[11]-1));
          }},
          (error)=>{
            this.spinner.hide();
            this.toastr.warning(error.status+error.statusText)
          }
          )
          
      }
  
    assetSearch(){
      this.search_mod = false
      console.log('false_edit',this.search_mod)
    }

    assetEditSearch(){
      this.search_mod = true
      console.log('true_edit',this.search_mod)
    }

  getassetcategorysummary(d){
    this.Faservice.getbranchpv(d,this.pageNumber)
         .subscribe((result:any) => {
          // this.spinner.hide();
           console.log("landlord-1", result);
           let datass = result['data'];
           this.listcomments = result['data'];
           for (let i=0; i<this.listcomments.length; i++){
            this.listcomments[i]['is_Checked']=false;    
            this.listcomments[i]['images'] = [];
            this.listcomments[i]['image'] = [];
            this.listcomments[i]['files'] = [];
            this.branch_names = this.listcomments[0].branch_id?.name
            this.branch_codes = this.listcomments[0].branch_id?.code
          }
           this.datapagination = result['pagination'];
           this.pageLength_popup = result['count'];
          if (this.listcomments.length >= 0) {
            this.has_nextbuk = this.datapagination.has_next;
            this.has_previousbuk = this.datapagination.has_previous;
            this.presentpagebuk = this.datapagination.index;
          }
          else{
            this.toastr.warning('No Branch Data')
          }
           for(let i=0;i<this.listcomments.length;i++){
            console.log('hiii');
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('barcode').patchValue(this.listcomments[i].barcode);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i].crnum);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_name').patchValue(this.listcomments[i].product_id);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_code').patchValue(this.listcomments[i].branch_id?.code);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_name').patchValue(this.listcomments[i].branch_id?.name);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_cost').patchValue(this.listcomments[i].assetdetails_cost);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_value').patchValue(this.listcomments[i].assetdetails_value);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_tag').patchValue('');
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('make').patchValue('');
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('condition').patchValue('');
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('status').patchValue('');
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serial_no').patchValue(this.listcomments[i].serial_no);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i].invoice_id?.ecfnum);
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('kvb_asset_id').patchValue(this.listcomments[i].description.slice(1,15));
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('images').patchValue('');
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('remarks').patchValue('');
          ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('it_configuration').patchValue('');
          }
           this.spinner.hide();
           console.log("landlord", this.listcomments)   
         },
         (error:any)=>{
           console.log(error);
            
           this.spinner.hide();
         }
         );
        }

  autocompleteScroll_asset() {
    // setTimeout(() => {
    //   if (
    //     this.matassetAutocomplete &&
    //     this.autocompleteTrigger &&
    //     this.matassetAutocomplete.panel
    //   ) {
    //     fromEvent(this.matassetAutocomplete.panel.nativeElement, 'scroll')
    //       .pipe(
    //         map(x => this.matassetAutocomplete.panel.nativeElement.scrollTop),
    //         takeUntil(this.autocompleteTrigger.panelClosingActions)
    //       )
    //       .subscribe(x => {
    //         const scrollTop = this.matassetAutocomplete.panel.nativeElement.scrollTop;
    //         const scrollHeight = this.matassetAutocomplete.panel.nativeElement.scrollHeight;
    //         const elementHeight = this.matassetAutocomplete.panel.nativeElement.clientHeight;
    //         const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    //         if (atBottom) {
    //           if (this.has_nextcom_branch === true) {
    //             this.Faservice.getassetsearch( this.Inputassetid.nativeElement.value)
    //               .subscribe((results: any[]) => {
    //                 let datas = results["data"];
    //                 console.log('asset=',results)
    //                 let datapagination = results["pagination"];
    //                 this.listcomments = this.listcomments.concat(datas);
    //                 if (this.listcomments.length >= 0) {
    //                   this.has_nextcom_branch = datapagination.has_next;
    //                   this.has_previouscom = datapagination.has_previous;
    //                   this.currentpagecom_branch = datapagination.index;
    //                 }
    //               })
    //           }
    //         }
    //       });
    //   }
    // });
  }

  autocompleteScroll_branch() {
    setTimeout(() => {
      if (this.matbranchAutocomplete && this.autocompleteTrigger && this.matbranchAutocomplete.panel) {
        fromEvent(this.matbranchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbranchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)).subscribe(x => {
            const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_branch === true) {
                this.Faservice.getbranchsearchscroll( this.branchidInput.nativeElement.value, this.currentpagecom_branch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('branch=',results)
                    let datapagination = results["pagination"];
                    this.branchdata = this.branchdata.concat(datas);
                    if (this.branchdata.length >= 0) {
                      this.has_nextcom_branch = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom_branch = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
 
  branchget() {
    let boo: String = "";
    this.getbranch(boo);
  
    this.assetgroupform.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')
  
        }),
        switchMap(value => this.Faservice.getbranchsearch(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
  
      .subscribe((results: any[]) => {
        this.branchdata = results["data"];
        if (results.length == 0){
          this.toastr.warning('No Branch Data')
          this.spinner.hide();
        }
      })
  
  }
  getbranch(val) {
    this.Faservice.getbranchsearch(val,1).subscribe((results: any[]) => {
      this.branchdata = results["data"];
      if (results.length == 0){
        this.toastr.warning('No Branch Data')
        this.spinner.hide();
      }
    })
  
  }
  public displaybranch(_branchval ? : BRANCH): string | undefined {
    return _branchval ? _branchval.name : undefined;
  }
  
  get _branchval() {
    return this.assetgroupform.get('branch');
  }

  savesub(){

  }

  checker_branchs(data){
    this.branch_id=data.id;
    this.branch_names=data.name;
    this.branch_codes=data.code;
    this.getassetcategorysummary(this.branch_id);

 };
 
  resetbranchData() {
    this.assetgroupform.reset('')
    // this.impairmentAdd.patchValue({
    //   data: new Date()
    // })
  }

  finalSubmitted(){
    // let j:number=0;
    // console.log(this.d1,this.d2);
    // let search:string="";
    // if(this.assetgroupform.value.branch!='' && this.assetgroupform.value.branch!=null){
    //   this.searchdata.branch=this.assetgroupform.value.branch.id
    //   search=search+"&branch="+this.assetgroupform.value.branch;
    // }
    
    // if(this.assetgroupform.value.barcode!='' && this.assetgroupform.value.barcode!=null){
    //   this.searchdata.barcode=this.assetgroupform.value.barcode
    //   search=search+"&barcode="+this.assetgroupform.value.barcode;
    // }
     
    // this.Faservice.getassetdata1(this.pageNumber = 1, this.pageSize = 10,'').subscribe(data=>{

    // })
    
  
  }

  search(){
    if(this.search_mod==false){
      this.getdata1();
      this.save_btn = false;
      this.addRowDisable = false;
    }
    else if(this.search_mod==true){
      this.getdata_edit();
      this.save_btn = true;
      this.addRowDisable = true;
    }
    this.assetgroupform.get('Asset_id').patchValue('');
    this.assetgroupform.get('branch').patchValue('');
    this.assetgroupform.get('Asset_edit').patchValue('');
  }

  asset_tag_remove(e:any){
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('asset_tag').patchValue('');
  }
  make_remove(e:any){
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('make').patchValue('');
  }
  serial_no_remove(e:any){
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('serial_no').patchValue('');
  }
  itconfigurartion_remove(e:any){
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('it_configuration').patchValue('');
  }
  remarks_remove(e:any){
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('remarks').patchValue('');
  }
  crnum_remove(e:any){
  ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('crnum').patchValue('');
  }
  kvb_asset_id_remove(e:any){
  ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('kvb_asset_id').patchValue('');
  }

  assetgrps_assetid(e:any){
    this.d1 = e.bracode
    // let obj:string = event.target.value;
    let dear:any={'asset_id':e.barcode}
    // this.Faservice.getassetsearch(dear).subscribe(results => {
    //   console.log(results);
    //   for (let i=0; i<results.length; i++) {
    //     console.log(i);
    //     this.listcomments = results
    //   }
    // })
  }

  assetgrps_ddlbranch(e:any){
    // this.d2 = e.branch_id.id
    // // let obj:string = event.target.value;
    // let dear1:any = {'branch_name':e.branch_id.name};
    // console.log(dear1)
    // this.Faservice.getbranchsearch(dear1,1).subscribe(results => {
    //   console.log(results);
    //   for (let i=0; i<results.length; i++) {
    //     console.log(i);
    //     this.listcomments = results
    //     console.log(this.listcomments);
    //   }
    // })
    if(this.assetgroupform.value.branch!=''||undefined){
      this.searchdata.branch=this.assetgroupform.value.branch.id
      
    }else{
      delete this.searchdata.branch;
  }      
}

  files: any
  myFiles: Array<any> = [];
  getFileDetails(index, e:any,data:any) {
    console.log('q=',data);
    const d:any=new FormData();
    this.listcomments[index] = [{'files':[],'images':[],'image':[]}]
    console.log(this.listcomments)
    for (var i = 0; i < e.target.files.length; i++) {
      this.listcomments[index].files = []
      this.listcomments[index].images = [];
      this.listcomments[index].image = []

      this.listcomments[index].files.push(e.target.files[i].name);
      const reader :any= new FileReader();
      reader.readAsDataURL(e.target.files[i]);
      reader.onload = (_event) => {
      this.listcomments[index].images.push(reader.result);
      }
      this.frmData.append('file',e.target.files[i])
    }
    this.saveCheck=true;
    console.log('form=',this.frmData)
    this.listcomments[index].image.push(d);
    console.log(this.listcomments[index])
  }

  goBack(){
    this.getdata();
    this.save_btn=false
  }


  uploadFiles() {
    const frmData = new FormData();

    for (var i = 0; i < this.myFiles.length; i++) {
      frmData.append("fileUpload", this.myFiles[i]);
    }
    console.log(frmData)
  }

  imagess(e:any){
    this.images=e;
  }

  deleteRow(listIndex: number, fileIndex: number) {
    console.log("files", this.listcomments[listIndex].files);
    this.listcomments[listIndex].files.splice(fileIndex, 1);
    this.listcomments[listIndex].images.splice(fileIndex, 1);

    console.log("filess", this.listcomments[listIndex].files);
  }

  buknextClick() {
    // let c = (this.assetsave.get('listproduct')).length
    // console.log('length',c)
    // for(let i=0;i<=c;i++){
    //   ((this.assetsave.get('listproduct') as FormArray).removeAt(i))
    // }
    ((this.assetsave.get('listproduct') as FormArray).clear())
    console.log(this.has_nextbuk,this.has_previousbuk,this.presentpagebuk)
    if (this.has_nextbuk === true) {
      this.spinner.show();
      this.Faservice.getassetdata1(this.pageNumber = this.presentpagebuk + 1, 10,'').subscribe(data => {
        console.log(data)
        this.listcomments = data['data'];
        this.spinner.hide();
        for (let i=0; i<this.listcomments.length; i++){
          this.listcomments[i]['is_Checked']=false;    
          this.listcomments[i]['images'] = [];
          this.listcomments[i]['image'] = [];
          this.listcomments[i]['files'] = [];
          this.branch_names = this.listcomments[0].branch_id?.name
          this.branch_codes = this.listcomments[0].branch_id?.code
        }
        this.datapagination = data['pagination'];
        console.log('d-',data['data']);
        console.log('page',this.datapagination)
        if (this.listcomments.length >= 0) {
          this.has_nextbuk = this.datapagination.has_next;
          this.has_previousbuk = this.datapagination.has_previous;
          this.presentpagebuk = this.datapagination.index;
        }
        for(let i=0;i<this.listcomments.length;i++){
          console.log('hiii');
      (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({
  
  
        'id':new FormControl(),
        'barcode':new FormControl(),
        'product_name':new FormControl(),
        'branch_code':new FormControl(),
        'branch_name':new FormControl(),
        'asset_cost':new FormControl(),
        'asset_value':new FormControl(),
        'asset_tag':new FormControl(),
        'make':new FormControl(),
        'condition':new FormControl(),
        'status':new FormControl(),
        'serial_no': new FormControl(),
        'crnum':new FormControl(),
        'kvb_asset_id':new FormControl(),
        'images': new FormControl(),
        'remarks' : new FormControl(),
        'warenb':new FormControl(false),
        'warfrom':new FormControl(''),
        'warend':new FormControl(''),
        'it_configuration':new FormControl('')
      }));
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('id').patchValue(this.listcomments[i].id);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('barcode').patchValue(this.listcomments[i].barcode);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i].crnum);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_name').patchValue(this.listcomments[i].product_id);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_code').patchValue(this.listcomments[i].branch_id?.code);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_name').patchValue(this.listcomments[i].branch_id?.name);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_cost').patchValue(this.listcomments[i].assetdetails_cost);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_value').patchValue(this.listcomments[i].assetdetails_value);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_tag').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('make').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('condition').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('status').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serial_no').patchValue(this.listcomments[i].serial_no);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i].invoice_id?.ecfnum);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('kvb_asset_id').patchValue(this.listcomments[i].description.slice(1,15));
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('images').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('remarks').patchValue(this.listcomments[i].remarks);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('warenb').patchValue(this.listcomments[i].warenb);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('warfrom').patchValue(this.listcomments[i].warrenty_startdate);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('warend').patchValue(this.listcomments[i].warrenty_enddate);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('it_configuration').patchValue(this.listcomments[i].it_configuration ? this.listcomments[i].it_configuration:'');
      
      
        }
        // let i:any=((this.assetsave.get('listproduct') as FormArray).length);
        // ((this.assetsave.get('listproduct') as FormArray).removeAt(i[11]-1));
        },
        (error)=>{
          this.spinner.hide();
          this.toastr.warning(error.status+error.statusText)
        }
        )
      }}
  
  bukpreviousClick() {
    ((this.assetsave.get('listproduct') as FormArray).clear())
    if (this.has_previousbuk === true) {
      this.spinner.show();
      this.Faservice.getassetdata1(this.pageNumber = this.presentpagebuk - 1, 10,'').subscribe(data => {
        console.log(data)
        this.listcomments = data['data'];
        this.spinner.hide();
        for (let i=0; i<this.listcomments.length; i++){
          this.listcomments[i]['is_Checked']=false;    
          this.listcomments[i]['images'] = [];
          this.listcomments[i]['image'] = [];
          this.listcomments[i]['files'] = [];
          this.branch_names = this.listcomments[0].branch_id?.name
          this.branch_codes = this.listcomments[0].branch_id?.code
        }
        this.datapagination = data['pagination'];
        console.log('d-',data['data']);
        console.log('page',this.datapagination)
        if (this.listcomments.length >= 0) {
          this.has_nextbuk = this.datapagination.has_next;
          this.has_previousbuk = this.datapagination.has_previous;
          this.presentpagebuk = this.datapagination.index;
        }
        for(let i=0;i<this.listcomments.length;i++){
          console.log('hiii');
      (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({
  
  
        'id':new FormControl(),
        'barcode':new FormControl(),
        'product_name':new FormControl(),
        'branch_code':new FormControl(),
        'branch_name':new FormControl(),
        'asset_cost':new FormControl(),
        'asset_value':new FormControl(),
        'asset_tag':new FormControl(),
        'make':new FormControl(),
        'condition':new FormControl(),
        'status':new FormControl(),
        'serial_no': new FormControl(),
        'crnum':new FormControl(),
        'kvb_asset_id':new FormControl(),
        'images': new FormControl(),
        'remarks' : new FormControl(),
        'warenb':new FormControl(false),
        'warfrom':new FormControl(''),
        'warend':new FormControl(''),
        'it_configuration':new FormControl('')
      }));
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('id').patchValue(this.listcomments[i].id);
  
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('barcode').patchValue(this.listcomments[i].barcode);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i].crnum);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('product_name').patchValue(this.listcomments[i].product_id);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_code').patchValue(this.listcomments[i].branch_id?.code);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('branch_name').patchValue(this.listcomments[i].branch_id?.name);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_cost').patchValue(this.listcomments[i].assetdetails_cost);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_value').patchValue(this.listcomments[i].assetdetails_value);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('asset_tag').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('make').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('condition').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('status').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('serial_no').patchValue(this.listcomments[i].serial_no);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('crnum').patchValue(this.listcomments[i].invoice_id?.ecfnum);
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('kvb_asset_id').patchValue(this.listcomments[i].description.slice(1,15));
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('images').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('remarks').patchValue(this.listcomments[i].remarks);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('warenb').patchValue(this.listcomments[i].warenb);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('warfrom').patchValue(this.listcomments[i].warrenty_startdate);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('warend').patchValue(this.listcomments[i].warrenty_enddate);
        ((this.assetsave.get('listproduct') as FormArray).at(i) as FormGroup).get('it_configuration').patchValue(this.listcomments[i].it_configuration ? this.listcomments[i].it_configuration:'');
      
      
        }
        // let i:any=((this.assetsave.get('listproduct') as FormArray).length);
        // ((this.assetsave.get('listproduct') as FormArray).removeAt(i[11]-1));
        },
        (error)=>{
          this.spinner.hide();
          this.toastr.warning(error.status+error.statusText)
        }
        )
      }}
  // Example: 
  //     form = new FormGroup({
  //       first: new FormControl({value: 'Nancy', disabled: true}, Validators.required),
  //       last: new FormControl('Drew', Validators.required)
  //     });

  dummyboolean:any=true
  addItem() {
    this.toastr.success('Row Added To Last Field')
    this.toastr.warning('Save The Added Row First','',{timeOut:40000})
    this.addrowRemove = false
    this.addrowCheck = false
    this.saveCheck = true;
    this.dummyboolean=false;
    this.addRowOnce = true;
    let max:number = 10;
    let id = Math.floor(Math.random() * (max + 1));
    (this.assetsave.get('listproduct') as FormArray).push(this.fb.group({
      'id': null,
      'barcode':new FormControl(),
      'product_name':new FormControl(),
      'branch_code':new FormControl(this.branch_codes),
      'branch_name':new FormControl(this.branch_names),
      'asset_cost':new FormControl(),
      'asset_value':new FormControl(),
      'asset_tag':new FormControl(),
      'make':new FormControl(),
      'condition':new FormControl(),
      'status':new FormControl(),
      'serial_no': new FormControl(),
      'crnum': new FormControl(),
      'kvb_asset_id': new FormControl(),
      'images': new FormControl(),
      'remarks' : new FormControl(),
    }));    
    this.readOnly = false
    this.flag = true;
    // this.listcomments.push(this.addItem());
    // const newGroup=new FormGroup({});
    // this.displayedFields.forEach(x=>{
    //   newGroup.addControl(x,new FormControl())
    // })
    // this.listcomments.push(newGroup)
    // this.currentElement = this.listcomments[9];
    // this.listcomments.push(obj)
    // this.currentElement = this.listcomments[index];
    // this.listcomments.splice(index, 0, this.currentElement);
    // this.flag = true;
    // for(let i=0;i<this.listcomments.length;i++){
    //   if(this.listcomments[i].id==data.id){
    //     this.listcomments[i].is_Checked = true;
    //   }
    // }
    // this.listcomments.style.color = "red";  
    // index.style.fontWeight = "bold"; 
 }

 make1(){
   if(this.assetsave.valid){
     this.statusCheck = true
   }
 }

 serial(){
  if(this.assetsave.valid){
    this.statusCheck = true
  }
}

condition(){
  if(this.assetsave.valid){
    this.statusCheck = true
  }
}

remarks1(){
  if(this.assetsave.valid){
    this.statusCheck = true
  }
}

product1(){
  if(this.assetsave.valid){
    this.statusCheck = true
  }
}

crnum1(){
  if(this.assetsave.valid){
    this.statusCheck = true
  }
}

kvb_asset_id1(){
  if(this.assetsave.valid){
    this.statusCheck = true
  }
}

 edit(value){
   console.log(value)
  if(value == 'Not available'){
    this.statusCheck = true
  }
  else if(value == 'Transferred (if transferred enter branch name)'){
    this.statusCheck = true
  }
  else{
    this.statusCheck=false
  }
 }

valueCheck(){
  if(this.assetsave.valid && this.statusCheck==true){
    this.newFlag = false
  }
  else{
    this.newFlag = true
  }
}

  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
 
    if (!reg.test(input)) {
      this.toastr.warning('Please Give Value As Decimal');
        event.preventDefault();
    }
 }

  onScroll(){
    console.log("Scrolled");  
    // this.page = this.page + 1;  
    // if(this.notScrolly && this.notEmptyPost) {
    //   this.spinner.show();
    //   // this.notScrolly = false;
    //   // this.loadNextPost();
    // setTimeout(() => {
    //   /** spinner ends after 3 seconds */
    //   this.spinner.hide();
    // }, 3000);
    }
    // }

    // loadNextPost() {
    
    //   // return last post from the array
    //   const lastPost = this.listcomments[this.listcomments.length - 1];
    //   // get id of last post
    //   const lastPostId = lastPost.id;
    //   // sent this id as key value parse using formdata()
    //   const dataToSend = new FormData();
    //   dataToSend.append('id',lastPostId);
    //   // call http request
    //   this.http.post(url, dataToSend).subscribe((data:any) => {
    //     const newPost = data[0];
    //     this.spinner.hide();
    //     if(newPost.length === 0) {
    //       this.notEmptyPost = false;
    //     }
    //     // add newly fetched posts to the existing post 
    //     this.listcomments = this.listcomments.concat(newPost);
    //     this.notScrolly = true;
    //   })
    // }
  remove(form: any,e:number){
    let i:any=((this.assetsave.get('listproduct') as FormArray).length);
    ((this.assetsave.get('listproduct') as FormArray).removeAt(i-1));
    this.flag = false;
    this.addrowCheck = true
    this.toastr.error('Row Deleted')
    this.dummyboolean=true;
    this.addRowOnce = false;
  }
    
  save(form: any,e:number) {
    let data_val=[]
      if(this.flag==false){
        let data_val=[];
        if (this.statusCheck==false){
        if(this.addrowCheck == false){
          this.toastr.error('Save The Added Row First')
        }
        if((this.assetsave.get('listproduct') as FormArray).at(e).get('status').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('status').value ==""){
          this.toastr.warning('Please Select Valid Status');
          return false;
        }
        else if((this.assetsave.get('listproduct') as FormArray).at(e).get('asset_tag').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('asset_tag').value ==""){
          this.toastr.warning('Please Select Valid Asset Tag');
          return false;
        }
        else if((this.assetsave.get('listproduct') as FormArray).at(e).get('make').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('make').value ==""){
          this.toastr.warning('Please Select Valid Make');
          return false;
        }
        else if((this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==""){
          this.toastr.warning('Please Select Valid Remarks');
          return false;
        }
        else if((this.assetsave.get('listproduct') as FormArray).at(e).get('serial_no').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('serial_no').value ==""){
          this.toastr.warning('Please Select Valid Serial No');
          return false;
        }
        // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('crnum').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('crnum').value ==""){
        //   this.toastr.warning('Please Select Valid CR Number');
        //   return false;
        // }
        // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('kvb_asset_id').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('kvb_asset_id').value ==""){
        //   this.toastr.warning('Please Select Valid KVB Asset ID');
        //   return false;
        // }
        else if((this.assetsave.get('listproduct') as FormArray).at(e).get('condition').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('condition').value ==""){
          this.toastr.warning('Please Select Valid Condition');
          return false;
        }
        // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('images').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('images').value ==""){
        //   this.toastr.warning('Please Select Valid images');
        //   return false;
        // }
        console.log('h=',(this.assetsave.get('listproduct') as FormArray).at(e).value)
        let h=(this.assetsave.get('listproduct') as FormArray).at(e).value;
        h['control_office_branch']=this.branch_codes
        console.log('index',e)
        // h['id']=this.listcomments[e].id
        // h['asset_details_id']=parseInt(this.listcomments[e].assetdetails_id)  
        // h['asset_details_id']=this.listcomments[e].ass
        // data_val.push(h);
        this.frmData.append('data',JSON.stringify(h))
        // console.log('ee=',data_val);
        // console.log('frmdata=',this.frmData)
      this.spinner.show();
      if(this.saveCheck==false){
      this.Faservice.getassetsave(this.frmData).subscribe(result=>{
        console.log(result);
        this.toastr.success('success');
        setTimeout(() => {
          /** spinner ends after 3 seconds */
          this.spinner.hide();
        }, 3000);
      });
      }
      else if(this.saveCheck==true){
      this.Faservice.getassetsave1(this.frmData).subscribe(result=>{
        console.log(result);
        this.toastr.success('success');
        setTimeout(() => {
          /** spinner ends after 3 seconds */
          this.spinner.hide();
        }, 3000);
      });
      }
      // this.assetsave.reset();
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('asset_tag').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('make').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('condition').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('status').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('serial_no').patchValue('');
      // ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('crnum').patchValue('');
      // ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('kvb_asset_id').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('images').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('remarks').patchValue('');
      ((this.assetsave.get('listproduct') as FormArray).removeAt(e));
      // let index = this.listcomments.findIndex(d => d.id === form.id); //find index in your array
      // this.listcomments.splice(index, 1);
      // this.pageLength_popup = this.listcomments.length
      // console.log(e)
      // console.log(this.as_assetcat)
      this.readOnly = true;
      this.addrowRemove = true
      this.saveCheck=false;
      this.dummyboolean=true;
      if (this.listcomments[e].files>0) {
        this.listcomments[e].files = []
        this.listcomments[e].images = [];
        this.listcomments[e].image = []
        }
      
    }
    if (this.statusCheck==true){
      if(this.addrowCheck == false){
        this.toastr.error('Save The Added Row First')
      }
      if((this.assetsave.get('listproduct') as FormArray).at(e).get('status').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('status').value ==""){
        this.toastr.warning('Please Select Valid Status');
        return false;
      }
      else if((this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==""){
        this.toastr.warning('Please Select Valid Remarks');
        return false;
      }
      // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('images').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('images').value ==""){
      //   this.toastr.warning('Please Select Valid images');
      //   return false;
      // }
      console.log('h=',(this.assetsave.get('listproduct') as FormArray).at(e).value)
      let h=(this.assetsave.get('listproduct') as FormArray).at(e).value;
      // data_val.push(h);
      h['control_office_branch']=this.branch_codes
      console.log('index',e)
      // h['id']=this.listcomments[e].id
      // h['asset_details_id']=parseInt(this.listcomments[e].assetdetails_id)
    this.frmData.append('data',JSON.stringify(h))
        // console.log('ee=',data_val);
        // console.log('frmdata=',this.frmData)
    this.spinner.show();
    if(this.saveCheck==false){
    this.Faservice.getassetsave(this.frmData).subscribe(result=>{
      console.log(result);
      this.toastr.success('success');
      setTimeout(() => {
        /** spinner ends after 3 seconds */
        this.spinner.hide();
      }, 3000);
    });
    }
    else if(this.saveCheck==true){
    this.Faservice.getassetsave(this.frmData).subscribe(result=>{
      console.log(result);
      this.toastr.success('success');
      setTimeout(() => {
        /** spinner ends after 3 seconds */
        this.spinner.hide();
      }, 3000);
    });
    }
    // this.assetsave.reset();
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('asset_tag').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('make').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('condition').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('status').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('serial_no').patchValue('');
    // ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('crnum').patchValue('');
    // ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('kvb_asset_id').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('images').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('remarks').patchValue('');
    ((this.assetsave.get('listproduct') as FormArray).removeAt(e));
    // let index = this.listcomments.findIndex(d => d.id === form.id); //find index in your array
    // this.listcomments.splice(index, 1);
    // this.pageLength_popup = this.listcomments.length
    // console.log(e)
    // console.log(this.as_assetcat)
    this.readOnly = true;
    this.addrowRemove = true
    this.saveCheck=false;
    this.dummyboolean=true;
    if (this.listcomments[e].files>0) {
      this.listcomments[e].files = []
      this.listcomments[e].images = [];
      this.listcomments[e].image = []
      }
  }
}
     
    else if(this.flag==true){
    if((this.assetsave.get('listproduct') as FormArray).at(e).get('barcode').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('barcode').value ==""){
      this.toastr.warning('Please Select Valid Barcode');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('product_name').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('product_name').value ==""){
      this.toastr.warning('Please Select Valid Product Name');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('branch_code').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('branch_code').value ==""){
      this.toastr.warning('Please Select Valid Branch Code');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('branch_name').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('branch_name').value ==""){
      this.toastr.warning('Please Select Valid Branch Name');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('asset_cost').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('asset_cost').value ==""){
      this.toastr.warning('Please Select Valid Asset Cost');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('asset_value').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('asset_value').value ==""){
      this.toastr.warning('Please Select Valid Asset Value');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('status').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('status').value ==""){
      this.toastr.warning('Please Select Valid Status');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('asset_tag').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('asset_tag').value ==""){
      this.toastr.warning('Please Select Valid Asset Tag');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('make').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('make').value ==""){
      this.toastr.warning('Please Select Valid Make');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('serial_no').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('serial_no').value ==""){
      this.toastr.warning('Please Select Valid Serial No');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('crnum').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('crnum').value ==""){
      this.toastr.warning('Please Select Valid CR Number');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('kvb_asset_id').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('kvb_asset_id').value ==""){
      this.toastr.warning('Please Select Valid KVB Asset ID');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('condition').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('condition').value ==""){
      this.toastr.warning('Please Select Valid Condition');
      return false;
    }
    else if((this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==""){
      this.toastr.warning('Please Select Valid Remarks');
      return false;
    }
    // else if((this.assetsave.get('listproduct') as FormArray).at(e).get('images').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('images').value ==""){
    //   this.toastr.warning('Please Select Valid images');
    //   return false;
    // }
    ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('id').patchValue('');
    console.log('h=',(this.assetsave.get('listproduct') as FormArray).at(e).value)
    let h=(this.assetsave.get('listproduct') as FormArray).at(e).value;
    // data_val.push(h);
    h['control_office_branch']=this.ctrl_branch_id
    this.frmData.append('data',JSON.stringify(h))
        // console.log('ee=',data_val);
        // console.log('frmdata=',this.frmData)
    
    if(this.saveCheck==false){
    this.Faservice.getassetrowsave(this.frmData).subscribe(result=>{
      console.log(result);
      if(result.description == 'INVALID_ASSETID_ID'){
        this.toastr.error('Barcode Already in Data')
      }
      else{
        this.toastr.success('Success');
      }
      this.spinner.show();
      setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
      }, 3000);
    })
    }
    else if(this.saveCheck==true){
      this.Faservice.getassetrowsave1(this.frmData).subscribe(result=>{
        console.log(result);
        if(result.description == 'INVALID_ASSETID_ID'){
          this.toastr.error('Barcode Already in Data')
        }
        else{
          this.toastr.success('Success');
        }
        this.spinner.show();
        setTimeout(() => {
        /** spinner ends after 3 seconds */
        this.spinner.hide();
        }, 3000);
      })
    }
    // this.assetsave.reset();
    ((this.assetsave.get('listproduct') as FormArray).removeAt(e));
    
    // this.listcomments = this.listcomments.show();
    // let index = this.listcomments.findIndex(d => d.id === form.id); //find index in your array
    // this.listcomments.splice(index, 1);
    // this.pageLength_popup = this.listcomments.length
    // console.log(e)
    // console.log(this.as_assetcat)
    this.flag = false;
    this.readOnly = true;
    this.addrowRemove = true;
    this.addrowCheck = true;
    this.id = ''
    this.saveCheck=false;
    this.dummyboolean=true;
    this.addRowOnce = false;
    if (this.listcomments[e].files>0) {
      this.listcomments[e].files = []
      this.listcomments[e].images = [];
      this.listcomments[e].image = []
      }
    let i:any=((this.assetsave.get('listproduct') as FormArray).length);
  ((this.assetsave.get('listproduct') as FormArray).removeAt(i-1));
  }
    // let max:number = 5;
    // form['asset_master_code_id']=Math.floor(Math.random() * (max + 1));
//     if(this.flag==false){
//       let data_val=[];
//       form['asset_tag']=this.assetsave.get('asset_tag').value;
//       form['make']=this.assetsave.get('make').value;
//       form['condition']=this.assetsave.get('condition').value;
//       form['status']=this.assetsave.get('status').value;    
//       form['serial_no']=this.assetsave.get('serial_no').value;
//       form['remarks']=this.assetsave.get('remarks').value;
//       data_val.push(form);
//       // this.frmData.append('data_val',JSON.stringify(this.listcomments))
//       // console.log(form);
//       console.log('ee=',data_val);
//       // console.log('frmdata=',this.frmData)
//       this.toastr.success('success');
//       this.spinner.show();
//       setTimeout(() => {
//         /** spinner ends after 3 seconds */
//         this.spinner.hide();
//       }, 3000);
//       this.Faservice.getassetsave(data_val).subscribe(result=>{
//         console.log(result);
//       })
//       this.assetsave.reset();
//       // this.listcomments = this.listcomments.show();
//       let index = this.listcomments.findIndex(d => d.id === form.id); //find index in your array
//       this.listcomments.splice(index, 1);
//       this.pageLength_popup = this.listcomments.length
//       console.log(e)
//       console.log(this.as_assetcat)
//   }
//   else if(this.flag==true){
//     let data_val=[]
//     form['barcode']=this.assetsave.get('barcode').value;
//     form['product_name']=this.assetsave.get('product_name').value;
//     form['branch_code']=this.assetsave.get('branch_code').value;
//     form['branch_name']=this.assetsave.get('branch_name').value;    
//     form['asset_cost']=this.assetsave.get('asset_cost').value;
//     form['asset_value']=this.assetsave.get('asset_value').value;
//     form['asset_tag']=this.assetsave.get('asset_tag').value;
//     form['make']=this.assetsave.get('make').value;
//     form['condition']=this.assetsave.get('condition').value;
//     form['status']=this.assetsave.get('status').value;    
//     form['serial_no']=this.assetsave.get('serial_no').value;
//     form['remarks']=this.assetsave.get('remarks').value;
//     data_val.push(form);
//     this.frmData.append('data_val',JSON.stringify(this.listcomments))
//     console.log(form);
//     console.log('ee=',data_val);
//     console.log('frmdata=',this.frmData)
//     this.toastr.success('success');
//     this.spinner.show();
//     setTimeout(() => {
//       /** spinner ends after 3 seconds */
//       this.spinner.hide();
//     }, 3000);
//     this.Faservice.getassetrowsave(this.frmData).subscribe(result=>{
//       console.log(result);
//     })
//     this.assetsave.reset();
//     // this.listcomments = this.listcomments.show();
//     let index = this.listcomments.findIndex(d => d.id === form.id); //find index in your array
//     this.listcomments.splice(index, 1);
//     this.pageLength_popup = this.listcomments.length
//     console.log(e)
//     console.log(this.as_assetcat)
//   }
//   this.flag = false;
}
  assetheaderupdate(data:any,i:any){
    console.log((this.assetsave.get('listproduct') as FormArray).at(i).get('warend').value);
    if((this.assetsave.get('listproduct') as FormArray).at(i).get('serial_no').value==undefined || (this.assetsave.get('listproduct') as FormArray).at(i).get('serial_no').value==null || (this.assetsave.get('listproduct') as FormArray).at(i).get('serial_no').value==''){
      this.toastr.error('Please Enter The Serial No:');
      return false;
    }
    // if((this.assetsave.get('listproduct') as FormArray).at(i).get('remarks').value==undefined || (this.assetsave.get('listproduct') as FormArray).at(i).get('remarks').value==null || (this.assetsave.get('listproduct') as FormArray).at(i).get('remarks').value==''){
    //   this.toastr.error('Please Enter The Remarks');
    //   return false;
    // }
    if((this.assetsave.get('listproduct') as FormArray).at(i).get('warfrom').value==undefined || (this.assetsave.get('listproduct') as FormArray).at(i).get('warfrom').value==null || (this.assetsave.get('listproduct') as FormArray).at(i).get('warfrom').value==''){
      this.toastr.error('Please Select The Warranty From date:');
      return false;
    }
    if((this.assetsave.get('listproduct') as FormArray).at(i).get('warend').value==undefined || (this.assetsave.get('listproduct') as FormArray).at(i).get('warend').value==null || (this.assetsave.get('listproduct') as FormArray).at(i).get('warend').value==''){
      this.toastr.error('Please Enter The Warranty To date:');
      return false;
    }
    let serial_no:any=(this.assetsave.get('listproduct') as FormArray).at(i).get('serial_no').value;
    let remarks:any=(this.assetsave.get('listproduct') as FormArray).at(i).get('remarks').value;
    let warrenty_startdate:any=this.datepipe.transform((this.assetsave.get('listproduct') as FormArray).at(i).get('warfrom').value,'yyyy-MM-dd');
    let warrenty_enddate:any=this.datepipe.transform((this.assetsave.get('listproduct') as FormArray).at(i).get('warend').value,'yyyy-MM-dd');
    let it_configuration:any=(this.assetsave.get('listproduct') as FormArray).at(i).get('it_configuration').value ? (this.assetsave.get('listproduct') as FormArray).at(i).get('it_configuration').value:'';
    let d:any= {"serial_no":serial_no,
   "remarks":remarks,
   "warrenty_startdate":warrenty_startdate,
   "warrenty_enddate":warrenty_enddate,
   'it_configuration':it_configuration
  };
  let id:any=data['value']['id'];
  this.spinner.show();
  this.Faservice.assetheaderupdate(id,d).subscribe(res=>{
    this.spinner.hide();
    if(res['status']=='success'){
      this.toastr.success(res['message']);
      this.getdata();
    }
    else{
      this.toastr.success(res['description']);
    }
  },
  (error:HttpErrorResponse)=>{
    this.spinner.hide();
    this.errorHandler.errorHandler(error,'');
  });
}
update(form: any,e:number) {
    if((this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==null || (this.assetsave.get('listproduct') as FormArray).at(e).get('remarks').value ==""){
      this.toastr.warning('Please Select Valid Remarks');
      return false;
    }
    console.log('h=',(this.assetsave.get('listproduct') as FormArray).at(e).value)
    let h=(this.assetsave.get('listproduct') as FormArray).at(e).value;
    h['control_office_branch']=this.branch_codes
    // h['id']=this.listcomments[e].id
    this.frmData.append('data',JSON.stringify(h))
    // console.log('ee=',data_val);
    // console.log('frmdata=',this.frmData)
  this.spinner.show();
  if(this.saveCheck==false){
  this.Faservice.getassetrowupdate(this.frmData).subscribe(result=>{
    console.log(result);
    this.toastr.success('success');
    setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
    }, 3000);
  });
  }
  else if(this.saveCheck==true){
  this.Faservice.getassetrowupdate1(this.frmData).subscribe(result=>{
    console.log(result);
    this.toastr.success('success');
    setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
    }, 3000);
  });
  }
  // this.assetsave.reset();
  ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('asset_tag').patchValue('');
  ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('make').patchValue('');
  ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('condition').patchValue('');
  ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('status').patchValue('');
  ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('serial_no').patchValue('');
  ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('images').patchValue('');
  ((this.assetsave.get('listproduct') as FormArray).at(e) as FormGroup).get('remarks').patchValue('');
  ((this.assetsave.get('listproduct') as FormArray).removeAt(e));
  
  this.readOnly = true;
  this.addrowRemove = true
  this.saveCheck=false;
  this.dummyboolean=true;
  if (this.listcomments[e].files>0) {
    this.listcomments[e].files = []
    this.listcomments[e].images = [];
    this.listcomments[e].image = []
    }
  }
  public empdataintreface(data?:empdata):string | undefined{
    return data?data.full_name:undefined;
  }
  public empdatainterfaceassetid(data?:assetid):string | undefined{
    return data?data.barcode:undefined;
  }
  dialogopen_new(){
   const dialogConfig = new MatDialogConfig();
       dialogConfig.disableClose = true;
       dialogConfig.autoFocus = true;
       dialogConfig.position = {
         top:  '0'  ,
         // right: '0'
       };
       dialogConfig.width = '70%' ;
       dialogConfig.height = '700px' ;
       dialogConfig.hasBackdrop=true;
       
       console.log(dialogConfig);
     this.matdialog.open(this.dialogopen,{width:'70%',disableClose:true,autoFocus:true,position:{top:'0'},height:'700px'});
  }
  closedialog(){
    this.matdialog.closeAll();
  }
  getemploueemapdetails(){
    
    this.Faservice.getemployeemappingpv(this.emppresentpage).subscribe(data=>{
      this.empmappingDetails=data['data'];
      let pagination:any=data['pagination'];
      this.has_empnext=pagination.has_next;
      this.has_empprevious=pagination.has_previous;
      this.emppresentpage=pagination.index;
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.errorHandler.errorHandler(error,'');
    }
    );
    
    // catch(error){
    //   if(error instanceof HttpErrorResponse){
    //     this.toastr.error(error.message);
    //     this.toastr.error(Strinf(error.status);
    //     this.toastr.error(error.statusText);
    //   }
    // }
  
  }
  clickprevious(){
    if(this.has_empprevious){
      this.emppresentpage -=1;
      this.getemploueemapdetails();
    }
  }
  clicknext(){
    if(this.has_empnext){
      this.emppresentpage +=1;
      this.getemploueemapdetails();
    }
  }
  getemploueemapdetails_search(){
    let page='?page=1';
    if(this.empmapformsearch.get('empname').value !='' && this.empmapformsearch.get('empname').value !=undefined && this.empmapformsearch.get('empname').value !=null && this.empmapformsearch.get('empname').value.id !=null && this.empmapformsearch.get('empname').value.id !=undefined){
      page=page+'&emp='+this.empmapformsearch.get('empname').value.id;
    }
    if(this.empmapformsearch.get('assetbarcode').value !='' && this.empmapformsearch.get('assetbarcode').value !=undefined && this.empmapformsearch.get('assetbarcode').value !=null && this.empmapformsearch.get('assetbarcode').value.barcode !=undefined){
      page=page+'&query='+this.empmapformsearch.get('assetbarcode').value.barcode;
    }
    this.Faservice.getemployeemappingpv_search(page).subscribe(data=>{
      this.empmappingDetails=data['data'];
      let pagination:any=data['pagination'];
      // this.has_empnext=pagination.has_next;
      // this.has_empprevious=pagination.has_previous;
      // this.emppresentpage=pagination.index;
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.errorHandler.errorHandler(error,'');
    }
    )
  }
  getemploueemapdetailscreate(){
    if(this.empmapform.get('empname').value =='' || this.empmapform.get('empname').value ==undefined || this.empmapform.get('empname').value ==null){
      this.toastr.error('Please Select Emp Name');
      return false;
    }
    if(this.empmapform.get('assetbarcode').value =='' || this.empmapform.get('assetbarcode').value.id ==undefined || this.empmapform.get('assetbarcode').value ==null){
      this.toastr.error('Please Select Asset Barcode');
      return false;
    }
    if(this.empmapform.get('capdate').value =='' || this.empmapform.get('capdate').value ==undefined || this.empmapform.get('capdate').value ==null){
      this.toastr.error('Please Enter The From Date');
      return false;
    }
    if(this.empmapform.get('todate').value =='' || this.empmapform.get('todate').value ==undefined || this.empmapform.get('todate').value ==null){
      this.toastr.error('Please Enter The To Date');
      return false;
    }
    let data:any={
      'emp_id':this.empmapform.get('empname').value.id,
      'asset_barcode':this.empmapform.get('assetbarcode').value.barcode,
      'status':1,
      "from_date":this.datepipe.transform(this.empmapform.get('capdate').value,'yyyy-MM-dd'),
      "to_date":this.datepipe.transform(this.empmapform.get('todate').value,'yyyy-MM-dd')
    };
    this.Faservice.getemployeemappingpvcreate(data).subscribe(data=>{
      if(data['status']=='success'){
        this.toastr.success(data['message']);
        this.empmapform.reset('');
      }
      else{
        this.toastr.error(data['code']);
        this.toastr.error(data['description']);

      }
    },
    (error:HttpErrorResponse)=>{
      this.errorHandler.errorHandler(error,'');
    }
    );
  

  }
  getemployeeactiveinactive(data:any){
    let d:any={
      'id':data.id,
      'status':data.status
    };
    this.Faservice.getemployeemappingpvactive(d).subscribe(data=>{
      if(data['status']=='success'){
        this.toastr.success(data['message']);
        this.getemploueemapdetails();
      }
      else{
        this.toastr.success(data['code']);
        this.toastr.success(data['description']);

      }
    },
    (error:HttpErrorResponse)=>{
      this.errorHandler.errorHandler(error,'');
    }
    )
  }
  dismisspopupdata(){
    this.refmodalclose.nativeElement.click();
    this.empmapform.reset('');
    this.empmapformsearch.reset('');
  }
  autocompleteassetid(){
    setTimeout(()=>{
      if(this.matasstisAutocomplete && this.autocompletetrigger && this.matasstisAutocomplete.panel){
        fromEvent(this.matasstisAutocomplete.panel.nativeElement,'scroll').pipe(
          map(x=> this.matasstisAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(x=>{
          const scrollTop=this.matasstisAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight=this.matasstisAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight=this.matasstisAutocomplete.panel.nativeElement.clientHeight;
          const atBottom=scrollHeight - 1<=scrollTop+elementHeight;
          if(atBottom){
            if(this.has_nextid){
              this.Faservice.getcpdatecheckerassetid(this.empmapform.get('assetbarcode').value,this.has_presentid+1).subscribe(data=>{
                console.log('hii=',data);
                let f=data['data'];
                let dts=data['pagination'];
                this.cpdateidlist=this.cpdateidlist.concat(f);
                if(this.cpdateidlist.length>0){
                  this.has_nextid=dts.has_next;
                  this.has_previousid=dts.has_previous;
                  this.has_presentid=dts.index;
                }
              })
            }
          }
        })
      }
    })

  }
  }