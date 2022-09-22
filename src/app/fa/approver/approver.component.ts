import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable,fromEvent } from 'rxjs';
import { DatePipe } from '@angular/common';
import { faservice } from '../fa.service';
import { faShareService } from '../share.service';
import { MatPaginator } from '@angular/material/paginator';
// import FileSaver from 'file-saver';
import { jsPDF } from 'jspdf';
import { ErrorHandlerService } from '../error-handler.service';

// "node_modules/jspdf/dist/jspdf.min.js",
// "node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.js"

interface pv_done {
  value: string;
  viewValue: string;
}
export interface category{
  id:string,
  code:string,
  name:string
};

@Component({
  selector: 'app-approver',
  templateUrl: './approver.component.html',
  styleUrls: ['./approver.component.scss']
})
export class ApproverComponent implements OnInit {

  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchidInput') branchidInput: any;

  @ViewChild('branch_do') matbranchdoAutocomplete: MatAutocomplete;
  @ViewChild('branchdoidInput') branchdoidInput: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  
  head:any=[{
    "s_no":"S.No",
    "branch_code":"Branch Code",
    "branch_name":"Branch Name",
    "pv_done":"PV Done",
    "pv_date":"PV Date"
  }];
  
  head1:any=[
    {
    "s_no":"S.No",
    "asset_id":"NAC Asset ID",
    "product_name":"Product Name",
    "branch_code":"Branch Code",
    "branch_name":"Branch Name",
    "asset_tag":"Asset Details",
    "make":"Make",
    "serial_no":"Serial No",
    "cr_number":"CR Number",
    "kvb_asset_id":"NAC Asset ID",
    "condition":"Condition",
    "status":"Status",
    "remarks":"Remarks",
    "asset_tag1":"Asset Details",
    "make1":"Make",
    "serial_no1":"Serial No",
    "condition1":"Condition",
  }
];

  listcomments:any=[];
  listcomments1:any=[];

  d2:any;
  data:any;
  branchname:number;
  changeText:any;
  changeText1:any;
  changeTexthover:any;
  changeTexthover1:any;
  isLoading = false;
  assetsave:any = FormGroup;
  assetgroupform:any= FormGroup;
  has_nextcom_branch=true;
  currentpagecom_branch=1;
  has_previouscom=true;
  has_nextbuk = true;
  has_previousbuk = true;
  pageNumber:number = 1;
  pageSize = 10;
  presentpagebuk: number = 1;
  datapagination:any=[];
  totalRecords: string;
  page: number = 1;  
  date_asset:any = "";
  branchdata:any=[];
  flagSearch = true;
  flag=false;
  doBranch = true;
  goBack_new = false;
  searchFlag = false;

  pv_done: pv_done[] = [
    {value: 'YES', viewValue: 'YES'},
    {value: 'NO', viewValue: 'NO'},
  ];
  branch_id: any;
  flagSearchVar: string;
  branchdata_do: any;
  flag_ctrl=false;
  categoryform:any=FormGroup;
  categoryList: Array<any>=[];
  branchDO:any=[];

  constructor( private errorHandler:ErrorHandlerService,private router: Router, private share: faShareService, private http: HttpClient,
    private Faservice: faservice, private toastr:ToastrService, private spinner: NgxSpinnerService, 
    private fb: FormBuilder, private datePipe: DatePipe ) { }

  ngOnInit(): void {
    // this.getApi();
    this.data = this.share.regular.value;
  
  if (this.data = "REGULAR") {
    console.log('condition1=',this.data);
    this.assetgroupform =new FormGroup({
      'branch':new FormControl(),
      'branch_do':new FormControl(),
    })
    this.assetsave =new FormGroup({
      'pv_done':new FormControl(''),
    });
   
    
  }
  this.categoryform=new FormGroup({
    'category':new FormControl('')
  });
  this.categoryform.get('category').valueChanges
  .pipe(
    debounceTime(100),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading = true;

    }),
    switchMap(value => this.Faservice.getcategotysearch(value,1)
      .pipe(
        finalize(() => {
          this.isLoading = false
        }),
      )
    )
  ).subscribe((results: any[]) => {
    this.categoryList = results["data"];
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

  })

  this.Faservice.getbranchdosearch('',1).subscribe(data=>{
    this.branchdata_do=data['data'];
  })
  this.assetgroupform.get('branch_do').valueChanges
  .pipe(
    debounceTime(100),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading = true;

    }),
    switchMap(value => this.Faservice.getbranchdosearch(value,1)
      .pipe(
        finalize(() => {
          this.isLoading = false
        }),
      )
    )
  )

  .subscribe((results: any[]) => {
    this.branchdata_do = results["data"];
    console.log('branch_id=',results)
    console.log('branch_data=',this.branchdata_do)

  })


      // this.getApi();
      this.getApi1();
     
     console.log('true', this.flagSearch)
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 10 seconds */
      this.spinner.hide();
    }, 3000);
      
    this.listcomments.paginator = this.paginator;

    var date = new Date();
   console.log(this.datePipe.transform(date,"yyyy-MM-dd"));
   this.date_asset = this.datePipe.transform(date,"yyyy-MM-dd");
  }
  public displaycategory(data?:category): string | undefined{
    return data?data.name:undefined;
  }

      autocompleteScroll_branch() {
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
                  if (this.has_nextcom_branch === true) {
                    this.Faservice.getbranchdosearchscroll( this.branchidInput.nativeElement.value, this.currentpagecom_branch+1 )
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        console.log('branch_branch=',results)
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

      autocompleteScroll_branchdo() {
        setTimeout(() => {
          if (
            this.matbranchdoAutocomplete &&
            this.autocompleteTrigger &&
            this.matbranchdoAutocomplete.panel
          ) {
            fromEvent(this.matbranchdoAutocomplete.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.matbranchdoAutocomplete.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.matbranchdoAutocomplete.panel.nativeElement.scrollTop;
                const scrollHeight = this.matbranchdoAutocomplete.panel.nativeElement.scrollHeight;
                const elementHeight = this.matbranchdoAutocomplete.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_nextcom_branch === true) {
                    this.Faservice.getbranchdosearchscroll( this.branchidInput.nativeElement.value, this.currentpagecom_branch+1 )
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        console.log('branch_branch=',results)
                        let datapagination = results["pagination"];
                        this.branchdata_do = this.branchdata_do.concat(datas);
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


      checker_branchs(data){
        this.flag_ctrl=false;
        this.branch_id=data.code;
        this.getassetcategorysummary1(this.branch_id);
        this.getassetcategorysummary(this.branch_id);
    
     };

     checker_branchs_do(data){
      console.log('new branch',data)
      this.flag=true
      this.flag_ctrl=true;
      this.branch_id=data.control_office_branch.code;
      this.getassetcategorysummary3(this.branch_id);
      this.getassetcategorysummary2(this.branch_id);
     }

     checker_branchdo_filter(data){
      this.getassetsearchsummary3(data.branch_code);
     }

     getassetcategorysummary1(d){
     this.Faservice.getbranchsearchapprover1(d,this.pageNumber)
           .subscribe((result:any) => {
            // this.spinner.hide();
             console.log("landlord-1", result);
             let datass = result['data'];
             this.listcomments1 = result['data'];
             this.datapagination = result['pagination'];
             this.spinner.hide();
             console.log("landlord", this.listcomments1)   
             if (this.listcomments1.length >= 0) {
              this.has_nextbuk = this.datapagination.has_next;
              this.has_previousbuk = this.datapagination.has_previous;
              this.presentpagebuk = this.datapagination.index;
            }
           },
           (error:HttpErrorResponse)=>{
             console.log(error);
              
             this.spinner.hide();
             this.errorHandler.errorHandler(error,'');
           }
           );
          }

     getassetcategorysummary(d){
      this.Faservice.getbranchsearchapprover(d,this.pageNumber)
           .subscribe((result:any) => {
            // this.spinner.hide();
             console.log("landlord-1", result);
             let datass = result['data'];
             this.listcomments = result['data'];
             this.datapagination = result['pagination'];
             this.spinner.hide();
             console.log("landlord", this.listcomments)  
             if (this.listcomments.length >= 0) {
              this.has_nextbuk = this.datapagination.has_next;
              this.has_previousbuk = this.datapagination.has_previous;
              this.presentpagebuk = this.datapagination.index;
            } 
           },
           (error:HttpErrorResponse)=>{
             console.log(error);
              
             this.spinner.hide();
             this.errorHandler.errorHandler(error,'');
           }
           );
          }

          getassetcategorysummary3(d){
            this.Faservice.getbranchsearchapprover3(d,this.pageNumber)
                  .subscribe((result:any) => {
                   // this.spinner.hide();
                    console.log("landlord-1", result);
                    let datass = result['data'];
                    this.listcomments1 = result['data'];
                    this.datapagination = result['pagination'];
                    this.spinner.hide();
                    console.log("landlord", this.listcomments1)  
                    for(let i=0;i<this.listcomments1.length;i++){
                      console.log('new',this.listcomments1)
                      this.branchDO=this.listcomments1
                    }
                    if (this.listcomments1.length >= 0) {
                      this.has_nextbuk = this.datapagination.has_next;
                      this.has_previousbuk = this.datapagination.has_previous;
                      this.presentpagebuk = this.datapagination.index;
                    }
                    console.log('brn_new',this.branchDO) 
                  },
                  (error:HttpErrorResponse)=>{
                    console.log(error);
                     this.errorHandler.errorHandler(error,'');
                    this.spinner.hide();
                  }
                  );
                 }
       
            getassetcategorysummary2(d){
             this.Faservice.getbranchsearchapprover2(d,this.pageNumber)
                  .subscribe((result:any) => {
                   // this.spinner.hide();
                    console.log("landlord-1", result);
                    let datass = result['data'];
                    this.listcomments = result['data'];
                    this.datapagination = result['pagination'];
                    this.spinner.hide();
                    console.log("landlord", this.listcomments) 
                    if (this.listcomments.length >= 0) {
                      this.has_nextbuk = this.datapagination.has_next;
                      this.has_previousbuk = this.datapagination.has_previous;
                      this.presentpagebuk = this.datapagination.index;
                    }  
                  },
                  (error:HttpErrorResponse)=>{
                    console.log(error);
                     
                    this.spinner.hide();
                    this.errorHandler.errorHandler(error,'');
                  }
                  );
                 }
            
            getassetsearchsummary3(d){
              this.Faservice.getbranchsearchselect(d,this.pageNumber)
                .subscribe((result:any) => {
                  // this.spinner.hide();
                  console.log("landlord_DO Branch", result);
                  let datass = result['data'];
                  this.listcomments = result['data'];
                  this.datapagination = result['pagination'];
                  this.spinner.hide();
                  console.log("landlord", this.listcomments)   
                  if (this.listcomments.length >= 0) {
                    this.has_nextbuk = this.datapagination.has_next;
                    this.has_previousbuk = this.datapagination.has_previous;
                    this.presentpagebuk = this.datapagination.index;
                  }
                },
                (error:HttpErrorResponse)=>{
                  console.log(error);
                    
                  this.spinner.hide();
                  this.errorHandler.errorHandler(error,'');
                }
                );
            }
         
  
    
      assetgrps_ddlbranch(e:any){
        this.d2 = e.branch_code
        // let obj:string = event.target.value;
        let dear1:any = {'branch_code':e.branch_code};
        this.Faservice.getbranchsearch(dear1,1).subscribe(results => {
          console.log(results);
          for (let i=0; i<results.length; i++) {
            console.log(i);
            this.listcomments = results
            console.log(this.listcomments);
          }
        })
      }

      search(){
        if(this.flagSearchVar=='YES'){
        // #this.getApi();
        this.getApi1();
        this.flag_ctrl=false
        }
        else if(this.flagSearchVar=='NO'){
          this.getApi2();
          this.getApi3();
          this.flag_ctrl=true
        }
      }

      finalSubmitted(){
        // for(let i=0;i<this.listcomments.length;i++){
        //   if(this.listcomments[i].branch_code == this.d2) {
        //     this.listcomments[j] = this.listcomments[i]
        //     // console.log(this.listcomments)
        //     j++;
        //   }
       
        // }
      }
    
      getApi1(){
        let search:string="";
        console.log(this.assetgroupform.value)
        if(this.assetgroupform.get('branch').value!='' && this.assetgroupform.get('branch').value!=null){
          console.log('hi')
          // this.searchdata.branch=this.assetgroupform.value.branch
          search=search+"&branch="+this.branch_id;
        }
        if(this.assetgroupform.get('branch_do').value!='' && this.assetgroupform.get('branch_do').value!=null){
          console.log('hi')
          // this.searchdata.branch=this.assetgroupform.value.branch
          search=search+"&branch="+this.branch_id;
        }
        this.Faservice.getapprover1(this.pageNumber,search).subscribe((data) => {
          console.log('santhosh',data)
          if(data.description == 'Invalid Branch Id'){
            this.toastr.error('No Branch ID Assigned')
            this.flagSearch = false;
            this.doBranch = false;
            this.flagSearchVar = 'NO'
            console.log('search_value',this.flagSearch)
          }
          else if(data[0].error == 'INVALID_BRANCH_DO'){
            this.flagSearch = true;
            this.doBranch = true;
            this.goBack_new = true
            this.searchFlag = true;
            this.listcomments1 = data[0]['data'];
            if(this.listcomments1.length === 0){
              this.toastr.warning('No Maker Done For The Branch ID')
            }
            // this.datapagination = data[0]['pagination'];
            // if (this.listcomments1.length >= 0) {
            //   this.has_nextbuk = this.datapagination.has_next;
            //   this.has_previousbuk = this.datapagination.has_previous;
            //   this.presentpagebuk = this.datapagination.index;
            //   }
          }
          else{
            console.log( data);
            this.flagSearchVar = 'YES'
            this.doBranch = true;
            this.goBack_new = false;
            this.searchFlag = false;
            this.listcomments1 = data[0]['data'];
            if(this.listcomments1.length == 0){
              this.toastr.warning('No Maker Done For The Branch ID')
            }
            // this.datapagination = data[0]['pagination'];
            // if (this.listcomments1.length >= 0) {
            //   this.has_nextbuk = this.datapagination.has_next;
            //   this.has_previousbuk = this.datapagination.has_previous;
            //   this.presentpagebuk = this.datapagination.index;
            //   }
            // console.log('d-',data[0]['data']);
            // console.log('page',this.datapagination)
          }
      },
      (error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.errorHandler.errorHandler(error,'');
        // this.toastr.warning(error.status+error.statusText)
      })}

      getApi(data:any){
        if(data.id ==undefined || data.id=='' || data.id==null){
          this.toastr.warning('Please Select The Valid Category');
          return  false;
        }
        let cat_id=data.id;
        let search:string="";
        console.log(this.assetgroupform.value)
        if(this.assetgroupform.get('branch').value!='' && this.assetgroupform.get('branch').value!=null){
          console.log('hi')
          // this.searchdata.branch=this.assetgroupform.value.branch
          search=search+"&branch="+this.branch_id;
        }
        if(this.assetgroupform.get('branch_do').value!='' && this.assetgroupform.get('branch_do').value!=null){
          console.log('hi')
          // this.searchdata.branch=this.assetgroupform.value.branch
          search=search+"&branch="+this.branch_id;
        }
        this.spinner.show();
        this.Faservice.getapprover(this.pageNumber,search,cat_id).subscribe((data) => {
          this.spinner.hide();
          console.log('santhosh1',data)
          if(data.description == 'Invalid Branch Id'){
            this.toastr.error('No Branch ID Assigned')
            this.flagSearch = false;
            this.doBranch = false;
            this.flagSearchVar = 'NO'
            console.log('search_value',this.flagSearch)
          }
          else if(data[0].error == 'INVALID_BRANCH_DO'){
            this.flagSearch = true;
            this.doBranch = true;
            this.goBack_new = true;
            this.searchFlag = true;
            this.listcomments = data[0]['data'];
            this.datapagination = data[0]['pagination'];
            if (this.listcomments.length >= 0) {
              this.has_nextbuk = this.datapagination.has_next;
              this.has_previousbuk = this.datapagination.has_previous;
              this.presentpagebuk = this.datapagination.index;
              }
            if(this.listcomments.length <= 0){
              this.toastr.warning('No Maker Done For The Branch ID')
            }
            
          }
          else{
          console.log( data);
          this.flagSearchVar = 'YES'
          this.doBranch = true;
          this.goBack_new = false;
          this.searchFlag = false;
            this.listcomments = data[0]['data'];
            if(this.listcomments.length === 0){
              this.toastr.warning('No Maker Done For The Branch ID')
            }
            this.datapagination = data[0]['pagination'];
            console.log('d-',data[0]['data']);
            console.log('page',this.datapagination)
            if (this.listcomments.length >= 0) {
            this.has_nextbuk = this.datapagination.has_next;
            this.has_previousbuk = this.datapagination.has_previous;
            this.presentpagebuk = this.datapagination.index;
            }
          }
      },
      (error:HttpErrorResponse)=>{
        this.spinner.hide();
        this.errorHandler.errorHandler(error,'');
        // this.toastr.warning(error.status+error.statusText)
      })}

        getApi3(){
          let search:string="";
          console.log(this.assetgroupform.value)
          if(this.assetgroupform.get('branch').value!='' && this.assetgroupform.get('branch').value!=null){
            console.log('hi')
            // this.searchdata.branch=this.assetgroupform.value.branch
            search=search+"&branch="+this.branch_id;
          }
          if(this.assetgroupform.get('branch_do').value!='' && this.assetgroupform.get('branch_do').value!=null){
            console.log('hi')
            // this.searchdata.branch=this.assetgroupform.value.branch
            search=search+"&branch="+this.branch_id;
          }
          this.Faservice.getbranchsearchapproverbranch1(search,this.pageNumber).subscribe((data) => {
              this.listcomments1 = data['data'];
              if(this.listcomments1.length === 0){
                this.toastr.warning('No Maker Done For The Branch ID')
              }
              // this.datapagination = data['pagination'];
              // if (this.listcomments1.length >= 0) {
              //   this.has_nextbuk = this.datapagination.has_next;
              //   this.has_previousbuk = this.datapagination.has_previous;
              //   this.presentpagebuk = this.datapagination.index;
              //   }
              // console.log('d-',data['data']);
              // console.log('page',this.datapagination)
            },
            (error:HttpErrorResponse)=>{
              this.spinner.hide();
              this.errorHandler.errorHandler(error,'');
              // this.toastr.warning(error.status+error.statusText)
            })}
  
        getApi2(){
          let search:string="";
          console.log(this.assetgroupform.value)
          if(this.assetgroupform.get('branch').value!='' && this.assetgroupform.get('branch').value!=null){
            console.log('hi')
            // this.searchdata.branch=this.assetgroupform.value.branch
            search=search+"&branch="+this.branch_id;
          }
          if(this.assetgroupform.get('branch_do').value!='' && this.assetgroupform.get('branch_do').value!=null){
            console.log('hi')
            // this.searchdata.branch=this.assetgroupform.value.branch
            search=search+"&branch="+this.branch_id;
          }
          this.Faservice.getbranchsearchapproverfull1(search,this.pageNumber).subscribe((data) => {
              this.listcomments = data['data'];
              this.datapagination = data['pagination'];
              if (this.listcomments.length >= 0) {
                this.has_nextbuk = this.datapagination.has_next;
                this.has_previousbuk = this.datapagination.has_previous;
                this.presentpagebuk = this.datapagination.index;
                }
              if(this.listcomments.length === 0){
                this.toastr.warning('No Maker Done For The Branch ID')
              }
              console.log('d-',data['data']);
              console.log('page',this.datapagination)
            },
            (error:HttpErrorResponse)=>{
              this.spinner.hide();
              this.errorHandler.errorHandler(error,'');
              // this.toastr.warning(error.status+error.statusText)
            })}

      // getApi2(){
      //   let search:string="";
      //   console.log(this.assetgroupform.value)
      //   this.Faservice.getbranchsearchapproverfull1(search,this.pageNumber).subscribe((data) => {
      //       console.log( data);
      //       this.listcomments = data['data'];
      //       this.datapagination = data['pagination'];
      //       console.log('d-',data['data']);
      //       console.log('page',this.datapagination)
      //       // if (this.listcomments.length >= 0) {
      //       // this.has_nextbuk = this.datapagination.has_next;
      //       // this.has_previousbuk = this.datapagination.has_previous;
      //       // this.presentpagebuk = this.datapagination.index;
      //       // }
      //     }
      // )}

      // getApi3(){
      //   let search:string="";
      //   console.log(this.assetgroupform.value)
      //   this.Faservice.getbranchsearchapproverbranch1(search,this.pageNumber).subscribe((data) => {
      //       console.log( data);
      //       this.listcomments1 = data['data'];
      //       this.datapagination = data['pagination'];
      //       console.log('d-',data['data']);
      //       console.log('page',this.datapagination)
      //       if (this.listcomments.length >= 0) {
      //       this.has_nextbuk = this.datapagination.has_next;
      //       this.has_previousbuk = this.datapagination.has_previous;
      //       this.presentpagebuk = this.datapagination.index;
      //       }
      //     }
      // )}

      // createPdf() {
      //   var doc = new jsPDF();
    
      //   doc.setFontSize(18);
      //   doc.text('My Team Detail', 11, 8);
      //   doc.setFontSize(11);
      //   doc.setTextColor(100);
    
      //   (doc as any).autoTable({
      //     head: this.head,
      //     body: this.listcomments,
      //     theme: 'plain',
      //     didDrawCell: data => {
      //       console.log(data.column.index)
      //     }
      //   })
        // below line for Open PDF document in new tab
        // doc.output('dataurlnewwindow')

        // below line for Download PDF document  
        // doc.save('myteamdetail.pdf');
        // }

        createBranchXLS(){
          if(this.flag_ctrl==false){
          this.spinner.show()
          this.Faservice.getApproverBranchDownload()
          .subscribe(branchXLS=>{
            console.log(branchXLS);
            let binaryData = [];
            binaryData.push(branchXLS)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            let date: Date = new Date();
            link.download = 'PVSummaryReport'+ date +".xlsx";
            link.click();
            this.spinner.hide()
            // FileSaver.saveAs(branchXLS, `Summary_report.xlsx`)
          },
          (error:HttpErrorResponse)=>{
            this.spinner.hide();
            this.errorHandler.errorHandler(error,'');
            // this.toastr.warning(error.status+error.statusText)
          })
        }
        else if(this.flag_ctrl==true){
          this.spinner.show()
          this.Faservice.getApproverBranchDownload1(this.branch_id)
          .subscribe(fullXLS=>{
            console.log(fullXLS);
            let binaryData = [];
            binaryData.push(fullXLS)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            let date: Date = new Date();
            link.download = 'PVDetailedReport'+ date +".xlsx";
            link.click();
            this.spinner.hide()
          },
          (error:HttpErrorResponse)=>{
            this.spinner.hide();
            this.errorHandler.errorHandler(error,'file');
            // this.toastr.warning(error.status+error.statusText)
          })
          }
        }

        createFullXLS(){
          if(this.flag_ctrl==false){
          this.spinner.show()
          this.Faservice.getApproverFullDownload()
          .subscribe(fullXLS=>{
            console.log(fullXLS);
            let binaryData = [];
            binaryData.push(fullXLS)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            let date: Date = new Date();
            link.download = 'PVDetailedReport'+ date +".xlsx";
            link.click();
            this.spinner.hide()
            // FileSaver.saveAs(fullXLS, `Detailed_report.xlsx`)
          },
          (error:HttpErrorResponse)=>{
            this.spinner.hide();
            this.errorHandler.errorHandler(error,'file');
            // this.toastr.warning(error.status+error.statusText)
          })
        }
        else if(this.flag_ctrl==true){
          this.spinner.show()
          this.Faservice.getApproverFullDownload1(this.branch_id)
          .subscribe(fullXLS=>{
            console.log(fullXLS);
            let binaryData = [];
            binaryData.push(fullXLS)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement('a');
            link.href = downloadUrl;
            let date: Date = new Date();
            link.download = 'PVDetailedReport'+ date +".xlsx";
            link.click();
            this.spinner.hide()
          },
          (error:HttpErrorResponse)=>{
            this.spinner.hide();
            this.errorHandler.errorHandler(error,'file');
            // this.toastr.warning(error.status+error.statusText)
          })
        }
      }


  //       createPdf1() {
  //         var doc = new jsPDF();
      
  //         doc.setFontSize(18);
  //         doc.text('My Team Detail', 11, 8);
  //         doc.setFontSize(11);
  //         doc.setTextColor(100);
      
  //         (doc as any).autoTable({
  //           head: this.head1,
  //           body: this.listcomments,
  //           theme: 'plain',
  //           didDrawCell: data => {
  //             console.log(data.column.index)
  //           }
  //         })
  //         // below line for Open PDF document in new tab
  //         doc.output('dataurlnewwindow')
  
  //         // below line for Download PDF document  
  //         doc.save('myteamdetail.pdf');
  // }

  goBack(){
    if(this.categoryform.get('category').value.id ==undefined || this.categoryform.get('category').value.id =="" || this.categoryform.get('category').value.id ==null){
      this.toastr.warning('Please Select The Valid Category');
      return false;
    }
    let cat_id=this.categoryform.get('category').value.id;
    this.Faservice.getapprover(this.pageNumber,'',cat_id).subscribe((data) => {
      console.log( data);
        this.listcomments = data['data'];
        this.datapagination = data['pagination'];
        console.log('d-',data['data']);
        console.log('page',this.datapagination)
        if (this.listcomments.length >= 0) {
        this.has_nextbuk = this.datapagination.has_next;
        this.has_previousbuk = this.datapagination.has_previous;
        this.presentpagebuk = this.datapagination.index;
        }
    },
    (error)=>{
      this.spinner.hide();
      this.toastr.warning(error.status+error.statusText)
    })

    this.Faservice.getapprover1(this.pageNumber,'').subscribe((data) => {
        console.log( data);
        this.listcomments1 = data['data'];
        this.datapagination = data['pagination'];
        console.log('d-',data['data']);
        console.log('page',this.datapagination)
        if (this.listcomments1.length >= 0) {
          this.has_nextbuk = this.datapagination.has_next;
          this.has_previousbuk = this.datapagination.has_previous;
          this.presentpagebuk = this.datapagination.index;
          }
      },
      (error:HttpErrorResponse)=>{
        this.errorHandler.errorHandler(error,'');
      }
      );
  }

  buknextClick() {
    if(this.categoryform.get('category').value.id ==undefined || this.categoryform.get('category').value.id =="" || this.categoryform.get('category').value.id ==null){
      this.toastr.warning('Please Select The Valid Category');
      return false;
    }
    let data:any=this.categoryform.get('category').value.id;
    console.log(this.has_nextbuk,this.has_previousbuk,this.presentpagebuk)
    if (this.has_nextbuk === true) {
      this.spinner.show();
      if(this.doBranch == true){
      this.Faservice.getbackin_pv(this.pageNumber = this.presentpagebuk + 1, 10,'',data).subscribe(data => {
        console.log(data)
        this.listcomments = data[0]['data'];
        this.datapagination = data[0]['pagination'];
        this.spinner.hide();
        console.log('d-',data['data']);
        console.log('page',this.datapagination)
        if (this.listcomments.length >= 0) {
          this.has_nextbuk = this.datapagination.has_next;
          this.has_previousbuk = this.datapagination.has_previous;
          this.presentpagebuk = this.datapagination.index;
        }
        },
        (error:HttpErrorResponse)=>{
          console.log(error);
           
          this.spinner.hide();
          this.errorHandler.errorHandler(error,'');
        })
      }
      else if(this.doBranch == false){
        this.Faservice.getbackin_DoPV(this.pageNumber = this.presentpagebuk + 1, 10,this.branch_id).subscribe(data => {
          console.log(data)
          this.listcomments = data[0]['data'];
          this.datapagination = data[0]['pagination'];
          this.spinner.hide();
          console.log('d-',data['data']);
          console.log('page',this.datapagination)
          if (this.listcomments.length >= 0) {
            this.has_nextbuk = this.datapagination.has_next;
            this.has_previousbuk = this.datapagination.has_previous;
            this.presentpagebuk = this.datapagination.index;
          }
          },
          (error:HttpErrorResponse)=>{
            console.log(error);
             
            this.spinner.hide();
            this.errorHandler.errorHandler(error,'');
          })
      }
    }
  }

  bukpreviousClick() {
    if(this.categoryform.get('category').value.id ==undefined || this.categoryform.get('category').value.id =="" || this.categoryform.get('category').value.id ==null){
      this.toastr.warning('Please Select The Valid Category');
      return false;
    }
    let data:any=this.categoryform.get('category').value.id;
    if (this.has_previousbuk === true) {
      this.spinner.show();
      if(this.doBranch == true){
      this.Faservice.getbackin_pv(this.pageNumber = this.presentpagebuk - 1, 10,'',data).subscribe(data => {
        console.log(data)
        this.listcomments = data[0]['data'];
        this.datapagination = data[0]['pagination'];
        this.spinner.hide();
        console.log('d-',data['data']);
        console.log('page',this.datapagination)
        if (this.listcomments.length >= 0) {
          this.has_nextbuk = this.datapagination.has_next;
          this.has_previousbuk = this.datapagination.has_previous;
          this.presentpagebuk = this.datapagination.index;
        }
        },
        (error:any)=>{
          console.log(error);
           
          this.spinner.hide();
        })
      }
      else if(this.doBranch == false){
        this.Faservice.getbackin_DoPV(this.pageNumber = this.presentpagebuk - 1, 10,this.branch_id).subscribe(data => {
          console.log(data)
          this.listcomments = data[0]['data'];
          this.datapagination = data[0]['pagination'];
          this.spinner.hide();
          console.log('d-',data['data']);
          console.log('page',this.datapagination)
          if (this.listcomments.length >= 0) {
            this.has_nextbuk = this.datapagination.has_next;
            this.has_previousbuk = this.datapagination.has_previous;
            this.presentpagebuk = this.datapagination.index;
          }
          },
          (error:any)=>{
            console.log(error);
             
            this.spinner.hide();
          })
      }
    }
  }

  savesub(){

  }

  save(form:any,e){
    // let e = {};
    // e['pv_done']= this.assetsave.get('pv_done').value;
    // e['checker_date']=this.date_asset;
    // e['completed_date']=this.date_asset;
    // console.log(e);
    // let d = this.assetsave.get('pv_done').value;
    // form['pv_done']='yes';
    console.log(this.categoryform.value);
    if(this.categoryform.get('category').value.id ==undefined || this.categoryform.get('category').value.id=="" || this.categoryform.get('category').value.id==null){
      this.toastr.warning('Please Select The Valid Category');
      return false;
    }
    form['asset_details_id']=this.listcomments[e].id
    form['branch_code']=this.listcomments[e].branch_code
    form['pv_done']=this.assetsave.get('pv_done').value;
    form['checker_date']=this.date_asset;
    form['completed_date']=this.date_asset;
    form['cat_id']=this.categoryform.get('category').value.id;
    console.log("form ",form)
    console.log("formdate ",this.date_asset)
    console.log(this.assetsave.get('pv_done').value)
    this.toastr.success('success');
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
    }, 3000);
    console.log("form ",form)
    this.Faservice.getapprover_data(form).subscribe(result=>{
      console.log(result);
    },
    (error:HttpErrorResponse)=>{
      this.errorHandler.errorHandler(error,'');
    }
    )
    this.assetsave.reset();
    // this.listcomments = this.listcomments.show();
  }
}
