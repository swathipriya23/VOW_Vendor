import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { threadId } from 'worker_threads';
import { ErrorhandlingService } from '../errorhandling.service';
import { PprService } from '../ppr.service';
export interface sourceList {
  code: string,
  id:number,
  name:string
}
export interface headgrpname {
  code: string,
  id:number,
  name:string
}
@Component({
  selector: 'app-head-groups',
  templateUrl: './head-groups.component.html',
  styleUrls: ['./head-groups.component.scss']
})
export class HeadGroupsComponent implements OnInit {
  // source=new FormControl()
  isLoading: boolean;
  source_data: any;
  head_groupsummary:FormGroup;
  headergroup:FormGroup;
  headgrp_data: any;
  headgrp_summary: any;
  has_next: boolean;
  presentpage: number;
  currentpage: number;
  has_previous: any;
  isSummaryPagination: boolean;
  @ViewChild('closepopadd') closepopadd
  @ViewChild('closepopedit') closepopedit
  sourcedata: any;
  code: any;
  constructor(private errorHandler: ErrorhandlingService,  private dataService: PprService,private formBuilder: FormBuilder,private toastr: ToastrService, private SpinnerService: NgxSpinnerService) { }
  

  ngOnInit(): void {
    this.head_groupsummary=this.formBuilder.group({
      source:[''],
      headgrp:['']
    })
    this.headergroup=this.formBuilder.group({
      headgrpname:[''],
      description:[''],
      source:['']
    })
  
    this.headgrp_summary_search(this.head_groupsummary.value)
  }
  source_dropdown() {
    let prokeyvalue: String = "";
    this.getsource_dropdown(prokeyvalue);
    this.head_groupsummary.get('source').valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.get_source_dropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.source_data = datas;


      })
  }



  private getsource_dropdown(prokeyvalue) {
    this.dataService.get_source_dropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.source_data = datas;

      })
  }


  public displayfnsource(source?: sourceList): string | undefined {
    return source ? source.name : undefined;

  }

  headgrp_dropdown() {
    let prokeyvalue: String = "";
    this.getheadgrp_dropdown(prokeyvalue);
    this.head_groupsummary.get('headgrp').valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.get_headgrp_dropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.headgrp_data = datas;


      })
  }



  private getheadgrp_dropdown(prokeyvalue) {
    this.dataService.get_headgrp_dropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.headgrp_data = datas;

      })
  }


  public displayfnheadgrp(head?: headgrpname): string | undefined {
    return head ? head.name : undefined;

  }

  headgrp_summary_search(headgrpdata,pageNumber=1, pageSize=10){
    console.log(headgrpdata)
    if((headgrpdata.headgrp=='') || (headgrpdata.headgrp==undefined) || (headgrpdata.headgrp==null) ){
      headgrpdata.name=''
      headgrpdata.code=''
    }else{
      headgrpdata.name=headgrpdata.headgrp.name
      headgrpdata.name=headgrpdata.headgrp.name
    }
    if((headgrpdata.source=='')|| (headgrpdata.source==undefined || (headgrpdata.source==null))){
      headgrpdata.id=''
    }else{
      headgrpdata.id=headgrpdata.source.id
    }
    let headgrp_param={
      "name":headgrpdata.name,
      "code":headgrpdata.code,
      "source":headgrpdata.id
    }
    console.log(headgrp_param)

    this.dataService.summary_headgrp_view(headgrp_param,pageNumber,pageSize).subscribe((results:any)=>{
      console.log("result=>",results)
      this.headgrp_summary=results['data']
      let dataPagination = results['pagination'];
      
      if (this.headgrp_summary.length >= 0) {
        console.log("val")
        this.has_next = dataPagination.has_next;
        this.has_previous = dataPagination.has_previous;
        this.presentpage = dataPagination.index;
        this.isSummaryPagination = true;
      } if (this.headgrp_summary.length <= 0) {
        console.log("val1")

        this.isSummaryPagination = false;
      }
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  previousClick(head_groupsummary){
    if (this.has_previous === true) {
         
      this.currentpage = this.presentpage + 1
      this.headgrp_summary_search(head_groupsummary,this.presentpage - 1, 10)
    }
  }
  nextClickhead_groupsummary(head_groupsummary){
    if (this.has_next === true) {
         
      this.currentpage = this.presentpage + 1
      this.headgrp_summary_search(head_groupsummary,this.presentpage + 1, 10)
    }
  }
  clearheadergrp(){
    this.headergroup.controls['headgrpname'].reset('')
    this.headergroup.controls['description'].reset('')
    this.headergroup.controls['source'].reset('')
  }
  addsource_dropdown() {
    let prokeyvalue: String = "";
    this.get_source_dropdown(prokeyvalue);
    this.headergroup.get('source').valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.get_source_dropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.sourcedata = datas;


      })
  }



  private get_source_dropdown(prokeyvalue) {
    this.dataService.get_source_dropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.sourcedata = datas;

      })
  }


  public displayfnsourceadd(source?: sourceList): string | undefined {
    return source ? source.name : undefined;

  }
  editview_headgrp(headgrpsummary){
    console.log(headgrpsummary)
    this.code=headgrpsummary.id
    this.headergroup.patchValue({
      headgrpname:headgrpsummary.name,
      description:headgrpsummary.description,
      // source:headgrpsummary.
    })
  }
  save_source(headgrpdata,paramfilter){
    if(headgrpdata.headgrpname==''){
      this.toastr.warning('', 'Please Fill The Header Group Name', { timeOut: 1500 });
      return false;
    }
    if(headgrpdata.description==''){
      this.toastr.warning('', 'Please Fill The Description', { timeOut: 1500 });
      return false;
    }  
    if(headgrpdata.source==''){
      this.toastr.warning('', 'Please Select  Source', { timeOut: 1500 });
      return false;
    }
    let headval
    if(paramfilter==1){
      headval={
        "name":headgrpdata.headgrpname,
        "description":headgrpdata.description,
        "source":headgrpdata.source.id,
        "code":0
      }
    }
    if(paramfilter==2){
      headval={
        "name":headgrpdata.headgrpname,
        "description":headgrpdata.description,
        "source":headgrpdata.source.id,
        "id":this.code
      }
     }
        console.log("code",headgrpdata.code)
    this.dataService.set_headgrp(headval)
      .subscribe((results: any[]) => {

     this.SpinnerService.hide();

      if (results['status'] == 'success') {
        this.closepopadd.nativeElement.click();
        this.closepopedit.nativeElement.click();
        this.toastr.success("",results['message'],{timeOut:1500});
        this.headergroup.controls['headgrpname'].reset('')
        this.headergroup.controls['description'].reset('')
        this.headergroup.controls['source'].reset('')
        this.headgrp_summary_search(this.head_groupsummary.value)

      }else{
        this.closepopadd.nativeElement.click();
        this.closepopedit.nativeElement.click();
        this.toastr.warning("",results['message'],{timeOut:1500}); 
        this.headergroup.controls['headgrpname'].reset('')
        this.headergroup.controls['description'].reset('')
        this.headergroup.controls['source'].reset('')
        this.headgrp_summary_search(this.head_groupsummary.value)

      }
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
}
