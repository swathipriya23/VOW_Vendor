import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PprService } from 'src/app/ppr/ppr.service';
import { threadId } from 'worker_threads';
import { DssService } from '../dss.service';
import { ErrorhandlingService } from '../errorhandling.service';

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
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('sourceauto') sourceauto:MatAutocomplete;
  @ViewChild('sourceinput') sourceinput:any
  @ViewChild('headauto') headauto:MatAutocomplete
  @ViewChild('headinput') headinput:any
  @ViewChild('addsourceauto') addsourceauto:MatAutocomplete
  @ViewChild('sourceinputto') sourceinputto:any
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
  dss_headgroup:FormGroup
  headergroups:FormArray
  identificationSize=10
  headgrp_param: { name: any; code: any; source: any; };
  has_next_summary: any;
  has_previous_summary: any;
  constructor(private errorHandler: ErrorhandlingService,  private dataService: DssService,private formBuilder: FormBuilder,private toastr: ToastrService, private SpinnerService: NgxSpinnerService) { }
  

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
    this.dss_headgroup=this.formBuilder.group({
      headergroups:new FormArray([this.creatheadergroup()])
    })
    this.headgrp_param={
      "name":'',
      "code":'',
      "source":''
    }
    this.headgrp_summary_search(this.headgrp_param)
  }
  creatheadergroup(){
    let headergroup=new FormGroup({
      headerstatus:new FormControl(2),
      headerid:new FormControl(''),
      headercode:new FormControl(''),
      headername:new FormControl(''),
      isEditable: new FormControl(false),
      headersource:new FormControl(''),
      headerdescription:new FormControl('')
    }) 
    return headergroup;
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


   autocompletesourceScroll(){
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1
  
    setTimeout(() => {
      if (
        this.sourceauto &&
        this.autocompleteTrigger &&
        this.sourceauto.panel
      ) {
        fromEvent(this.sourceauto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.sourceauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.sourceauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.sourceauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.sourceauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.get_source_dropdown(this.sourceinput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.source_data = this.source_data.concat(datas);
                    if (this.source_data.length >= 0) {
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

  autocompleteheadgrbScroll(){
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1
  
    setTimeout(() => {
      if (
        this.headauto &&
        this.autocompleteTrigger &&
        this.headauto.panel
      ) {
        fromEvent(this.headauto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.headauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.headauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.headauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.headauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.get_headgrp_dropdown(this.headinput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.headgrp_data = this.headgrp_data.concat(datas);
                    if (this.headgrp_data.length >= 0) {
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
  public displayfnheadgrp(head?: headgrpname): string | undefined {
    return head ? head.name : undefined;

  }
  headgrp_summary_clear(){
    this.head_groupsummary.controls['source'].reset('')
    this.head_groupsummary.controls['headgrp'].reset('')
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
    this.headgrp_param={
      "name":headgrpdata.name,
      "code":headgrpdata.code,
      "source":headgrpdata.id
    }
    console.log(this.headgrp_param)
    this.SpinnerService.show()
    this.dataService.summary_headgrp_view(this.headgrp_param,pageNumber,pageSize).subscribe((results:any)=>{
      console.log("result=>",results)
      this.SpinnerService.hide()
      this.headgrp_summary=results['data']
      let dataPagination = results['pagination'];
      
      if (this.headgrp_summary.length >= 0) {
        console.log("val")
        this.dss_headgroup = this.formBuilder.group({
          headergroups: this.formBuilder.array(
            this.headgrp_summary.map(val =>
              this.formBuilder.group({
                headerstatus:new FormControl(val.status),
                headerid:new FormControl(val.id),
                headercode:new FormControl(val.code),
                headername:new FormControl(val.name),
                headersource:new FormControl(val.source_id),
                isEditable: new FormControl(true),
                headerdescription:new FormControl(val.description)
              })
            )
          ) //end of fb array
        });
        this.has_next_summary = dataPagination.has_next;
        this.has_previous_summary = dataPagination.has_previous;
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
  previousClick(){
    
    if (this.has_previous_summary === true) {
         
      this.currentpage = this.presentpage + 1
      this.headgrp_summary_search(this.headgrp_param,this.presentpage - 1, 10)
    }
  }
  nextClickhead_groupsummary(){
    if (this.has_next_summary === true) {
         
      this.currentpage = this.presentpage + 1
      this.headgrp_summary_search(this.headgrp_param,this.presentpage + 1, 10)
    }
  }
  headergroupsnewrowAdd(){
    const form = <FormArray> this.dss_headgroup.get('headergroups')
    for(let valheader of form.value){
      console.log("edit",valheader.isEditable)
      if(valheader.isEditable==false){
        console.log(valheader.isEditable)
        this.toastr.warning("","New Row Can Be Added Or Edited After Only Submitting Or Canceling The Line Entered Already",{timeOut:1500})
        return false;
      }
    }
  form.insert(0, this.creatheadergroup());
  }

  Cancelheaderdetails(headers,i){
  if(headers.value.headergroups[i].headercode  != ""){
    console.log('true')
    headers.get('headergroups')
    .at(i)
    .get('isEditable')
    .patchValue(true);
    

  }  if(headers.value.headergroups[i].headercode  == "" || headers.value.headergroups[i].headercode == undefined  || headers.value.headergroups[i].headercode ==null)
    {
    const control = <FormArray>headers.controls['headergroups'];
    control.removeAt(i)   
    console.log('false')

  }
}
EditSource(editheader,i){
  for(let valheader of editheader.value.headergroups){
    console.log("edit",valheader.isEditable)
    if(valheader.isEditable==false){
      console.log(valheader.isEditable)
      this.toastr.warning("","New Row Can Be Added Or Edited After Only Submitting Or Canceling The Line Entered Already",{timeOut:1500})
      return false;
    }
  }
  editheader.get('headergroups')
    .at(i)
    .get('isEditable')
    .patchValue(false);
}
savesource(saveheader,i){
  let headervalues=saveheader.value.headergroups[i]
if(headervalues.headersource=='' || (typeof headervalues.headersource!='object')){
    this.toastr.warning('', 'Please Select  Source', { timeOut: 1500 });
    return false;
  }
  if(headervalues.headername==''){
    this.toastr.warning('', 'Please Fill The Header Group Name', { timeOut: 1500 });
    return false;
  }
  if(headervalues.headerdescription==''){
    this.toastr.warning('', 'Please Fill The Description', { timeOut: 1500 });
    return false;
  }  
  
  console.log("headercode=>",headervalues.headercode)
  let headval
  if(headervalues.headercode==''){
    headval={
      "name":headervalues.headername,
      "description":headervalues.headerdescription,
      "source":headervalues.headersource.id,
      "code":0
    }
  }
  if(headervalues.headercode !=''){
    headval={
      "name":headervalues.headername,
      "description":headervalues.headerdescription,
      "source":headervalues.headersource.id,
      "id":headervalues.headerid
    }
   }
   var headerconfirm=window.confirm("Do You Want To Save And Continue?")
   console.log(headerconfirm)
   if(!headerconfirm){
     console.log("True")
     return false;
   }else{
   this.SpinnerService.show();
    console.log("code",headervalues.code)
   this.dataService.set_headgrp(headval)
    .subscribe((results: any[]) => {

   this.SpinnerService.hide();
   this.headgrp_param={
    "name":'',
    "code":'',
    "source":''
  }
    if (results['status'] == 'success') {
      if(headervalues.sourcecode !=''){
        this.toastr.success("",'Successfully Updated',{timeOut:1500});
      }else{
       this.toastr.warning("",results['message'],{timeOut:1500}); 
      }
      this.headergroup.controls['headgrpname'].reset('')
      this.headergroup.controls['description'].reset('')
      this.headergroup.controls['source'].reset('')
      this.headgrp_summary_clear()
      this.headgrp_summary_search(this.headgrp_param)

    }else{      
      this.toastr.warning("",results['message'],{timeOut:1500}); 
      this.headergroup.controls['headgrpname'].reset('')
      this.headergroup.controls['description'].reset('')
      this.headergroup.controls['source'].reset('')
      this.headgrp_summary_clear()
      this.headgrp_summary_search(this.headgrp_param)

    }
  }, error => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
}
}
deletehead(dssdelete,i){
  var sourceconfirm=window.confirm("Are You Sure Change The Status?")
  console.log(sourceconfirm)
  if(!sourceconfirm){
    return false;
  }else{
    
    let id=dssdelete.value.headerid
    let status=dssdelete.value.headerstatus
    let sourcestatus
    if(status==0){
      sourcestatus=1
    }else{
      sourcestatus=0
    }
    this.headgrp_param={
      "name":'',
      "code":'',
      "source":''
    }
    this.SpinnerService.show()
    this.dataService.deletehead(id,sourcestatus).subscribe((results) => {
      if(results.status=='success'){
        if(sourcestatus==1){
          this.toastr.success("","Source Active  Succesfully",{timeOut:1500})
          this.headgrp_summary_search(this.headgrp_param) 
        }else{
          this.toastr.success("","Source In-Active Source Succesfully",{timeOut:1500})
          this.headgrp_summary_search(this.headgrp_param)
        }
      }
      this.SpinnerService.hide()

    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  
 }
  clearheadergrp(){
    this.headergroup.controls['headgrpname'].reset('')
    this.headergroup.controls['description'].reset('')
    this.headergroup.controls['source'].reset('')
  }
  addsource_dropdown(ind) {
    let prokeyvalue: String = "";
    this.get_source_dropdown(prokeyvalue);
    var arrayControl = this.dss_headgroup.get('headergroups') as FormArray;
    let item = arrayControl.at(ind);
    console.log("source=>",item)
    item.get('headersource').valueChanges.pipe(
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

  autocompletesourcetoScroll(){
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1
  
    setTimeout(() => {
      if (
        this.addsourceauto &&
        this.autocompleteTrigger &&
        this.addsourceauto.panel
      ) {
        fromEvent(this.addsourceauto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.addsourceauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.addsourceauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.addsourceauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.addsourceauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.get_source_dropdown(this.sourceinputto.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.sourcedata = this.sourcedata.concat(datas);
                    if (this.sourcedata.length >= 0) {
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
     this.SpinnerService.show();
        console.log("code",headgrpdata.code)
    this.dataService.set_headgrp(headval)
      .subscribe((results: any[]) => {

     this.SpinnerService.hide();
     this.headgrp_param={
      "name":'',
      "code":'',
      "source":''
    }
      if (results['status'] == 'success') {
        this.closepopadd.nativeElement.click();
        this.closepopedit.nativeElement.click();
        this.toastr.success("",results['message'],{timeOut:1500});
        this.headergroup.controls['headgrpname'].reset('')
        this.headergroup.controls['description'].reset('')
        this.headergroup.controls['source'].reset('')
        this.headgrp_summary_search(this.headgrp_param)

      }else{
        this.closepopadd.nativeElement.click();
        this.closepopedit.nativeElement.click();
        this.toastr.warning("",results['message'],{timeOut:1500}); 
        this.headergroup.controls['headgrpname'].reset('')
        this.headergroup.controls['description'].reset('')
        this.headergroup.controls['source'].reset('')
        this.headgrp_summary_search(this.headgrp_param)

      }
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
}
