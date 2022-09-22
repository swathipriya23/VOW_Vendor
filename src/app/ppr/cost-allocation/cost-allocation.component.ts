import { DatePipe, formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ErrorhandlingService } from '../errorhandling.service';
import { PprService } from '../ppr.service';
export interface allocation{
  id:number,
  name:string
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

@Component({
  selector: 'app-cost-allocation',
  templateUrl: './cost-allocation.component.html',
  styleUrls: ['./cost-allocation.component.scss'],
  providers:[ { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe]
})
export class CostAllocationComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger ,{read : MatAutocompleteTrigger}) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('bscc_summary_auto') bscc_summary_auto: MatAutocomplete;
  @ViewChild('bscc_summary_input') bscc_summary_input: any;
  @ViewChild('bscc_summary_auto_add') bscc_summary_auto_add: MatAutocomplete;
  @ViewChild('bscc_summary_input_add') bscc_summary_input_add: any;
  @ViewChild('bs_summary_auto') bs_summary_auto: MatAutocomplete;
  @ViewChild('bs_summary_input') bs_summary_input: any;
  @ViewChild('bs_summary_auto_add') bs_summary_auto_add: MatAutocomplete;
  @ViewChild('bs_summary_input_add') bs_summary_input_add: any;
  @ViewChild('cc_summary_auto') cc_summary_auto: MatAutocomplete;
  @ViewChild('cc_summary_input') cc_summary_input: any;
  @ViewChild('cc_summary_auto_add') cc_summary_auto_add: MatAutocomplete;
  @ViewChild('cc_summary_input_add') cc_summary_input_add: any;
  @ViewChildren('to_bscc_auto') to_bscc_auto: QueryList<MatAutocomplete>;
  @ViewChildren('to_bscc_input') to_bscc_input: QueryList<ElementRef>;
  @ViewChildren('to_bs_auto') to_bs_auto: QueryList<MatAutocomplete>;
  @ViewChildren('to_bs_input') to_bs_input: QueryList<ElementRef>;
  @ViewChildren('to_cc_auto') to_cc_auto: QueryList<MatAutocomplete>;
  @ViewChildren('to_cc_input') to_cc_input: QueryList<ElementRef>;
  presentpage: number=1;
  has_next_summary: boolean=false;
  has_previous_summary: boolean=false;
  isSummaryPagination: boolean;
  allocationsummary: any; 
  allocation_group:FormGroup
  empty_value:any=''
  bscc_summary: any;
  has_next: boolean;
  has_previous: boolean;
  currentpage: number=1;
  identificationSize:number=10
  bs_summary: any;
  cc_summary: any;
  summary_param: { allocation: any; bs: any; cc: any; };
  page_changes:boolean=false
  bscc_add: any;
  bs_add: any;
  cc_add: any;
  to_bscc: any;
  isLoading: boolean;
  to_has_previous: any;
  to_has_next: any;
  to_currentpage: any;
  to_bs: any;
  to_cc: any;
  total_ratio: number=0;
  to_value: any=[];
  paticular_id:number=0
  todata_id:any=[]
  bs_id: any;
  minvalue_from: any;
  view_edit:boolean=false
  constructor(private datePipe:DatePipe,private formbuilder:FormBuilder,private toastr:ToastrService,private allocationserives:PprService,private SpinnerService:NgxSpinnerService,private errorHandler:ErrorhandlingService) { }

  ngOnInit(): void {
    this.allocation_group=this.formbuilder.group({
      allocation:[''],
      bs:[''],
      cc:[''],
      validity_from:[''],
      validity_to:[''],
      level:[''],
      to_allocation:new FormArray([
        this.to_allocation()
      ])
    })
    this.summary_param={
      'allocation':'',
      'bs':'',
      'cc':''
    }
    this.costallocation_summary(this.summary_param)
  }
  to_allocation(){
    let to_allocation=new FormGroup({
      to_bscc:new FormControl(''),
      to_cc: new FormControl(''),
      to_bs: new FormControl(''),
      to_ratio: new FormControl(''),
    })
    return to_allocation;
  }
  get_bscc(keyvalue,diff) {
    let bscc
    if(diff=='summary'){
     console.log('summary')
     bscc=this.bscc_summary_input.nativeElement.value
    }
    if(diff=='add'){
      console.log('add',this.bscc_summary_input)
      bscc=this.bscc_summary_input_add.nativeElement.value
    }
    console.log("bscc")
    this.allocationserives.get_business_dropdown(1,keyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        console.log("bss data=>",datas)
        if(diff=='summary'){
          this.bscc_summary = datas;
        }
        if(diff=='add'){
          this.bscc_add = datas;
        }
      }
    )
  } 
  bsccDropdown(bscc_diff) {
    let bscc:any
    if(bscc_diff=='summary'){
      bscc=this.bscc_summary_input
    }
    if(bscc_diff=='add'){
      bscc=this.bscc_summary_input_add
    }
   this.allocationserives.get_business_dropdown(1,bscc.nativeElement.value,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        if(bscc_diff=='summary'){
          this.bscc_summary = datas;
        }
        if(bscc_diff=='add'){
          this.bscc_add = datas;
        }
      }
    )
  }
  bsccscroll(bscc_diff){
    this.has_next = true
    this.has_previous = true
    this.currentpage = 1
    console.log("scroll")
    let bsccautocomplete:any
    let bsccinput:any
    if(bscc_diff=='summary'){
      console.log("bscc=>",this.bscc_summary_input)
      console.log("bscc=>",this.bscc_summary_auto)
      bsccautocomplete=this.bscc_summary_auto,
      bsccinput=this.bscc_summary_input
    }
    if(bscc_diff=='add'){
      bsccautocomplete=this.bscc_summary_auto_add
      bsccinput=this.bscc_summary_input_add
    }
    setTimeout(() => {
      if (
        bsccautocomplete &&
        this.autocompleteTrigger &&
        bsccautocomplete.panel
      ) {
        fromEvent(bsccautocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => bsccautocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = bsccautocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = bsccautocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = bsccautocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                console.log("true")
                this.allocationserives.get_business_dropdown(1,bsccinput.nativeElement.value, this.currentpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    console.log("loop",this.currentpage)
                    if(bscc_diff=='summary'){
                      this.bscc_summary = this.bscc_summary.concat(datas);
                      if (this.bscc_summary.length >= 0) {
                        this.has_next = datapagination.has_next;
                        this.has_previous = datapagination.has_previous;
                        this.currentpage = datapagination.index;
                      }
                    }
                    if(bscc_diff=='add'){
                      this.bscc_add = this.bscc_add.concat(datas);
                      if (this.bscc_add.length >= 0) {
                        this.has_next = datapagination.has_next;
                        this.has_previous = datapagination.has_previous;
                        this.currentpage = datapagination.index;
                      }
                    }
                  }
                )
              }
            }
          }
        );
      }
    });
  }
  public displaybscc(bscc?: allocation): string | undefined {
    return bscc ? bscc.name : undefined;
  }
  public displaybscc_add(bscc?: allocation): string | undefined {
    return bscc ? bscc.name : undefined;
  }
  bsDropdown(bs_diff){
    console.log(this.allocation_group)
    let bscc_id=this.allocation_group.controls.allocation.value.id
    console.log(bscc_id)
    let bsinput
    if(bs_diff=='summary'){
      bsinput=this.bs_summary_input
    }
    if(bs_diff=='add'){
      bsinput=this.bs_summary_input_add
    }
    this.allocationserives.get_bs_dropdown(bscc_id,bsinput.nativeElement.value,1).subscribe((results: any[]) => {
        let datas = results["data"];
        this.allocation_group.controls['cc'].reset('')
        if(bs_diff=='summary'){
          this.bs_summary = datas;
        }
        if(bs_diff=='add'){
          this.bs_add = datas;
        }
      }
    )
  }
  bs_search(keyvalue,bs_diff) {
    let bsinput
    if(bs_diff=='summary'){
      console.log(this.bs_summary_input)
      bsinput=this.bs_summary_input.nativeElement.value
    }
    if(bs_diff=='add'){
      console.log(this.bs_summary_input_add)
      bsinput=this.bs_summary_input_add
    }
    if(bsinput != '' || bsinput != undefined || bsinput != null){
      let bscc_id=this.allocation_group.controls.allocation.value.id
      this.allocationserives.get_bs_dropdown(bscc_id,keyvalue,1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          if(bs_diff=='summary'){
            this.bs_summary = datas;
          }
          if(bs_diff=='add'){
            this.bs_add = datas;
          }
        }
      )
    }
  }
  displaybs(bs:allocation): string | undefined{
    return bs ? bs.name : undefined;
  }
  displaybs_add(bs:allocation): string | undefined{
    return bs ? bs.name : undefined;
  }
  bsscroll(bs_diff){
    this.has_next = true
    this.has_previous = true
    this.currentpage = 1
    let bsautocomplete:any=''
    let bsinput:any=''
    let bscc_id=this.allocation_group.controls.allocation.value.id
    if(bs_diff=='summary'){
      bsautocomplete=this.bs_summary_auto
      bsinput==this.bs_summary_input
    }
    if(bs_diff=='add'){
      bsautocomplete=this.bs_summary_auto_add
      bsinput==this.bs_summary_input_add
    }
    setTimeout(() => {
      if (
        bsautocomplete &&
        this.autocompleteTrigger &&
        bsautocomplete.panel
      ) {
        fromEvent(bsautocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => bsautocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = bsautocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = bsautocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = bsautocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                console.log("true")
                this.allocationserives.get_bs_dropdown(bscc_id,bsinput.nativeElement.value, this.currentpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    console.log("loop",this.currentpage)
                    if(bs_diff=='summary'){
                      this.bs_summary = this.bs_summary.concat(datas);
                      if (this.bs_summary.length >= 0) {
                        this.has_next = datapagination.has_next;
                        this.has_previous = datapagination.has_previous;
                        this.currentpage = datapagination.index;
                      }
                    }
                    if(bs_diff=='add'){
                      this.bs_add = this.bs_add.concat(datas);
                      if (this.bs_add.length >= 0) {
                        this.has_next = datapagination.has_next;
                        this.has_previous = datapagination.has_previous;
                        this.currentpage = datapagination.index;
                      }
                    }
                  }
                )
              }
            }
          }
        );
      }
    });
  }
  cc_search(cc_diff){
    let bs_id=this.allocation_group.controls.bs.value.id
    let ccinput
    if(cc_diff=="summary"){
      ccinput=this.cc_summary_input
    }
    if(cc_diff=="add"){
      ccinput=this.cc_summary_input_add
    }
    this.allocationserives.get_cc_dropdown(bs_id,ccinput.nativeElement.value,1).subscribe((results: any[]) => {
        let datas = results["data"];
        if(cc_diff=='summary'){
          this.cc_summary = datas;
        }
        if(cc_diff=="add"){
          this.cc_add = datas;
        } 
      }
    )
  }
  get_cc(keyvalue,cc_diff) {
    let bs_id=this.allocation_group.controls.bs.value.id
    let ccinput
    if(cc_diff=="summary"){
      ccinput=this.cc_summary_input.nativeElement.value
    }
    if(cc_diff=="add"){
      ccinput=this.cc_summary_input_add.nativeElement.value
    }
    if(ccinput != null || ccinput != undefined || ccinput != null){
      this.allocationserives.get_cc_dropdown(bs_id,keyvalue,1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          if(cc_diff=='summary'){
            this.cc_summary = datas;
          }
          if(cc_diff=='add'){
            this.cc_add = datas;
          } 
        }
      )
    }
  }
  displaycc(ccname:allocation):string |undefined{
    return ccname?ccname.name :undefined
  }
  displaycc_add(ccname:allocation):string |undefined{
    return ccname?ccname.name :undefined
  }
  ccscroll(cc_diff){
    this.has_next = true
    this.has_previous = true
    this.currentpage = 1
    let ccautocomplete:any=''
    let ccinput:any=''
    let bs_id=this.allocation_group.controls.bs.value.id
    if(cc_diff=='summary'){
      ccautocomplete=this.cc_summary_auto
      ccinput==this.cc_summary_input
    }
    if(cc_diff=='add'){
      ccautocomplete=this.cc_summary_auto_add
      ccinput==this.cc_summary_input_add
    }
     console.log("scroll")
     setTimeout(() => {
       if (
         ccautocomplete &&
         this.autocompleteTrigger &&
         ccautocomplete.panel
       ) {
         fromEvent(ccautocomplete.panel.nativeElement, 'scroll')
           .pipe(
             map(x => ccautocomplete.panel.nativeElement.scrollTop),
             takeUntil(this.autocompleteTrigger.panelClosingActions)
           )
           .subscribe(x => {
             const scrollTop = ccautocomplete.panel.nativeElement.scrollTop;
             const scrollHeight = ccautocomplete.panel.nativeElement.scrollHeight;
             const elementHeight = ccautocomplete.panel.nativeElement.clientHeight;
             const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
             if (atBottom) {
               if (this.has_next === true) {
                 console.log("true")
                 this.allocationserives.get_cc_dropdown(bs_id,ccinput.nativeElement.value, this.currentpage+1)
                   .subscribe((results: any[]) => {
                     let datas = results["data"];
                     let datapagination = results["pagination"];
                     console.log("loop",this.currentpage)
                     if(cc_diff=='summary'){
                      this.cc_summary = this.cc_summary.concat(datas);
                      if (this.cc_summary.length >= 0) {
                        this.has_next = datapagination.has_next;
                        this.has_previous = datapagination.has_previous;
                        this.currentpage = datapagination.index;
                      }
                    }
                    if(cc_diff=='add'){
                      this.cc_add = this.cc_add.concat(datas);
                      if (this.cc_add.length >= 0) {
                        this.has_next = datapagination.has_next;
                        this.has_previous = datapagination.has_previous;
                        this.currentpage = datapagination.index;
                      }
                    }
                   }
                  )
                }
              }
            }
          );
        }
      }
    );
  }
  costallocation_summary(alloction_summary) {
   console.log("summary=>",alloction_summary)
   let summary_allocation
   let summary_bs
   let summary_cc
   if(alloction_summary.allocation == '' || alloction_summary.allocation == undefined || alloction_summary.allocation == null){

    summary_allocation=''
   }else{
    if(typeof alloction_summary.allocation=='object'){
      summary_allocation=alloction_summary.allocation.id
    }else{
      summary_allocation=alloction_summary.allocation
    }
   }
   if(alloction_summary.bs == '' || alloction_summary.bs == undefined || alloction_summary.bs == null){
    summary_bs=''
   }else{
    if(typeof alloction_summary.bs=='object'){
      summary_bs=alloction_summary.bs.id
    }else{
      summary_bs=alloction_summary.bs
    }
   }
   if(alloction_summary.cc == '' || alloction_summary.cc == undefined || alloction_summary.cc == null){
    summary_cc=''
   }else{
    if(typeof alloction_summary.cc.id=='object'){
      summary_cc=alloction_summary.cc.id
    }else{
      summary_cc=alloction_summary.cc
    }
   }
   this.summary_param={
    "allocation":summary_allocation,
    "bs":summary_bs,
    "cc":summary_cc
   }
   this.SpinnerService.show()
   this.allocationserives.get_cost_allocation_summary(this.currentpage,this.summary_param)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        let data=results
        let dataPagination = results['pagination'];
        this.allocationsummary = datas;
        console.log("summary=>",this.allocationsummary)
        if(data['description']=="NO_DATA_FOUND"){
          this.has_next_summary = false;
          this.has_previous_summary = false;
          this.presentpage = 1;
          this.isSummaryPagination = false;
          return false;
        }
        if (datas.length >= 0) {
          console.log("val")
          this.has_next_summary = dataPagination.has_next;
          this.has_previous_summary = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isSummaryPagination = true;
        } if (datas <= 0) {
          console.log("val1")
          this.isSummaryPagination = false;
        }

      },error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    )
  }
  nextClick() {
    if (this.has_next_summary === true) {  
      this.currentpage = this.presentpage + 1
      this.costallocation_summary(this.summary_param)
    }
  }
  previousClick() {
    if (this.has_previous_summary === true) { 
      this.currentpage = this.presentpage - 1
      this.costallocation_summary(this.summary_param)
    }
  }
  costallocation_clear(diff_reset){
    if(diff_reset=='summary'){
      this.total_ratio=0
      this.summary_param={
        "allocation":'',
        "bs":'',
        "cc":''
      }
      this.allocation_group.reset('')
    }
    if(diff_reset=='summary_add'){
      this.summary_param={
        "allocation":'',
        "bs":'',
        "cc":''
      }
      this.allocation_group.reset('')
      const control = <FormArray>this.allocation_group.controls['to_allocation'];
        for(let i = control.length-1; i >= 1; i--) {
            control.removeAt(i)
    }
      this.total_ratio=0
      this.page_changes=false
      this.costallocation_summary(this.summary_param)
    }
  }
  allocation_page_changes(page_change,id){
    if(page_change=='add'){
      this.page_changes=true
      this.view_edit=false
      this.paticular_id=id
      this.costallocation_clear('summary')
    }
    if(page_change == 'edit'){
      this.page_changes=true
      this.view_edit=false
      this.paticular_id=id
      this.costallocation_clear('summary')
      this.get_particular_value(id)
    }
    if(page_change == 'view'){
      this.page_changes=true
      this.view_edit=true
      this.paticular_id=id
      this.costallocation_clear('summary')
      this.get_particular_value(id)
    }
  }
  new_allocation_row(){
    const form = <FormArray> this.allocation_group.get('to_allocation')
    form.push(this.to_allocation())
  }
  public display_to_bscc(bsccocde_level?: allocation): string | undefined {
    return bsccocde_level ? bsccocde_level.name : undefined;
  }
  get_to_bscc(keyvalue,index) {
    this.allocationserives.get_business_dropdown(1,keyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.to_bscc = datas;
        console.log("out")
      }
    )
  }
  to_bscc_droupdown(index) {
    console.log(index)
    let bscc = this.to_bscc_input['_results'][index].nativeElement.value
     this.allocationserives.get_business_dropdown(1,bscc,1).subscribe((results: any[]) => {
        let datas = results["data"];
        this.to_bscc = datas;
        this.allocation_group.get('to_allocation')['controls'][index].get("to_bs").reset('')
      }
    )    
  }
  bscc_scroll(index){
    this.to_has_next = true
    this.to_has_previous = true
    this.to_currentpage = 1
    console.log("scroll",this.to_bscc_auto['_results'],index)
    setTimeout(() => {
      if (
        this.to_bscc_auto['_results'][index]&&
        this.autocompleteTrigger &&
        this.to_bscc_auto['_results'][index].panel
      ) {
        console.log("true")
        fromEvent(this.to_bscc_auto['_results'][index].panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.to_bscc_auto['_results'][index].panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.to_bscc_auto['_results'][index].panel.nativeElement.scrollTop;
            const scrollHeight = this.to_bscc_auto['_results'][index].panel.nativeElement.scrollHeight;
            const elementHeight = this.to_bscc_auto['_results'][index].panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            console.log('atbottom=>',atBottom)
            if (atBottom) {
              console.log("true",this.to_has_next)
              if (this.to_has_next === true) {
                console.log("true")
                this.allocationserives.get_business_dropdown(1,this.to_bscc_input['_results'][index].nativeElement.value,this.to_currentpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    console.log("loop",this.currentpage)
                      this.to_bscc = this.to_bscc.concat(datas);
                      if (this.to_bscc.length >= 0) {
                        this.to_has_next = datapagination.has_next;
                        this.to_has_previous = datapagination.has_previous;
                        this.to_currentpage = datapagination.index;
                      }
                    }
                  )
                }
              }
            }
          );
        }
      }
    );
  }
  public display_to_bs(bs?: allocation): string | undefined {
    return bs ? bs.name : undefined;
  }
  get_to_bs(keyvalue,index) {
    let bscc=this.allocation_group.value.to_allocation[index].to_bscc.id
    this.allocationserives.get_bs_dropdown(bscc,keyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.to_bs = datas;
      }
    )
  }
  to_bs_dropdown(index) {
    console.log(index)
    let bscc_id=this.allocation_group.value.to_allocation[index].to_bscc.id
    let bscc = this.to_bs_input['_results'][index].nativeElement.value
     this.allocationserives.get_bs_dropdown(bscc_id,bscc,1).subscribe((results: any[]) => {
        let datas = results["data"];
        this.to_bs = datas;
        
      }
    )    
  }
  bs_scroll(index){
    this.to_has_next = true
    this.to_has_previous = true
    this.to_currentpage = 1
    console.log("scroll",this.to_bs_auto['_results'],index)
    let bscc=this.allocation_group.value.to_allocation[index].to_bscc.id
    setTimeout(() => {
      if (
        this.to_bs_auto['_results'][index]&&
        this.autocompleteTrigger &&
        this.to_bs_auto['_results'][index].panel
      ) {
        console.log("true")
        fromEvent(this.to_bs_auto['_results'][index].panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.to_bs_auto['_results'][index].panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.to_bs_auto['_results'][index].panel.nativeElement.scrollTop;
            const scrollHeight = this.to_bs_auto['_results'][index].panel.nativeElement.scrollHeight;
            const elementHeight = this.to_bs_auto['_results'][index].panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            console.log('atbottom=>',atBottom)
            if (atBottom) {
              console.log("true",this.to_has_next)
              if (this.to_has_next === true) {
                console.log("true")
                this.allocationserives.get_bs_dropdown(bscc,this.to_bs_input['_results'][index].nativeElement.value,this.to_currentpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    console.log("loop",this.currentpage)
                      this.to_bs = this.to_bs.concat(datas);
                      if (this.to_bs.length >= 0) {
                        this.to_has_next = datapagination.has_next;
                        this.to_has_previous = datapagination.has_previous;
                        this.to_currentpage = datapagination.index;
                      }
                    }
                  )
                }
              }
            }
          );
        }
      }
    );
  }
  public display_to_cc(bs?: allocation): string | undefined {
    return bs ? bs.name : undefined;
  }
  get_to_cc(keyvalue,index) {
    let bs=this.allocation_group.value.to_allocation[index].to_bs.id
    this.allocationserives.get_cc_dropdown(bs,keyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.to_cc = datas;
      }
    )
  }
  to_cc_dropdown(index) {
    console.log(index)
    let bs=this.allocation_group.value.to_allocation[index].to_bs.id
    let bscc = this.to_cc_input['_results'][index].nativeElement.value
     this.allocationserives.get_cc_dropdown(bs,bscc,1).subscribe((results: any[]) => {
        let datas = results["data"];
        this.to_cc = datas;
      }
    )    
  }
  cc_scroll(index){
    this.to_has_next = true
    this.to_has_previous = true
    this.to_currentpage = 1
    console.log("scroll",this.to_bs_auto['_results'],index)
    let bs=this.allocation_group.value.to_allocation[index].to_bs.id
    setTimeout(() => {
      if (
        this.to_cc_auto['_results'][index]&&
        this.autocompleteTrigger &&
        this.to_cc_auto['_results'][index].panel
      ) {
        console.log("true")
        fromEvent(this.to_cc_auto['_results'][index].panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.to_cc_auto['_results'][index].panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.to_cc_auto['_results'][index].panel.nativeElement.scrollTop;
            const scrollHeight = this.to_cc_auto['_results'][index].panel.nativeElement.scrollHeight;
            const elementHeight = this.to_cc_auto['_results'][index].panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            console.log('atbottom=>',atBottom)
            if (atBottom) {
              console.log("true",this.to_has_next)
              if (this.to_has_next === true) {
                console.log("true")
                this.allocationserives.get_cc_dropdown(bs,this.to_cc_input['_results'][index].nativeElement.value,this.to_currentpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    console.log("loop",this.currentpage)
                      this.to_cc = this.to_cc.concat(datas);
                      if (this.to_cc.length >= 0) {
                        this.to_has_next = datapagination.has_next;
                        this.to_has_previous = datapagination.has_previous;
                        this.to_currentpage = datapagination.index;
                      }
                    }
                  )
                }
              }
            }
          );
        }
      }
    );
  }
  deleteRow(index) {
    console.log("index=>",index)
    var delBtn = confirm(" Do you want to delete ?");
    if (delBtn == true) {
      let controls = this.allocation_group.get('to_allocation') as FormArray;
      controls.removeAt(index)
      this.ration_cal()
    }
    console.log(this.allocation_group,this.allocation_group.controls.to_allocation['controls'])
  }
  ration_cal(){
    let total:number=0
    for(var calc of this.allocation_group.controls.to_allocation['controls']){
      console.log("calc=>",calc)
      total+=(Number(calc.value.to_ratio))
    }
    console.log("total_ratio=>",total)
    this.total_ratio=total
  }
  allocat_value(){
    console.log("value",this.allocation_group.controls.to_allocation.value)
    console.log("controls",this.allocation_group.controls.to_allocation['controls'])
    var maxratio=0
    let from_bscc:any
    let from_bs:any
    let from_cc:any
    let toratio:any
    let tobscc:any
    let tobs:any
    let tocc:any
    let id:any
    let ccvalidation:boolean=false
    if(this.allocation_group.value.allocation=='' || this.allocation_group.value.allocation==undefined || this.allocation_group.value.allocation==null){
      this.toastr.warning('', 'Please Select Core Bs', { timeOut: 1500 });
      return false;
    }else{
      from_bscc=this.allocation_group.value.allocation.id
    }
    if(this.allocation_group.value.bs=='' ||this.allocation_group.value.bs==undefined || this.allocation_group.value.bs==null){
      this.toastr.warning('', 'Please Select BS', { timeOut: 1500 });
      return false;
    }else{
      from_bs=this.allocation_group.value.bs.id
    }
    if(this.allocation_group.value.cc=='' ||this.allocation_group.value.cc==undefined || this.allocation_group.value.cc==null){
      from_cc=''
    }else{
      from_cc=this.allocation_group.value.cc.id
      ccvalidation=true
    }
    console.log("this.allocation_group.value.validity_to=>",this.allocation_group.value.validity_to)

    if(this.allocation_group.value.validity_from=='' || this.allocation_group.value.validity_from==null || this.allocation_group.value.validity_from==undefined){
      this.toastr.warning('', 'Please Select Form Date', { timeOut: 1500 });
      return false;

    }
    if(this.allocation_group.value.validity_to=='' || this.allocation_group.value.validity_to==null || this.allocation_group.value.validity_to==undefined){
      this.toastr.warning('', 'Please Select To Date', { timeOut: 1500 });
      return false;

    }
    for(let [ind,val] of this.allocation_group.controls.to_allocation['controls'].entries()){
      maxratio+=(Number(val.value.to_ratio))
      let indnum=(Number(ind))+1
      console.log("todata_id=>",val.value.to_bscc,ind)
      
      if(val.value.to_bscc=='' || val.value.to_bscc==undefined || val.value.to_bscc==null){
        console.log("index =>",ind +1)
        console.log("indnum=>",indnum)
        this.toastr.warning("Must Be Select Core Bs" + '\xa0\xa0' + indnum +'\xa0\xa0' + 'Row','',{timeOut:1500});
        return false;
        tobscc='' 
      }else{ 
        tobscc=val.value.to_bscc.id
      }
      if(val.value.to_bs=='' || val.value.to_bs==undefined || val.value.to_bs==null){
        this.toastr.warning("Please Select BS" + '\xa0\xa0' +  indnum +'\xa0\xa0' + 'Row','',{timeOut:1500});
        return false;
        tobs=''
      }else{
        tobs=val.value.to_bs.id
      }
      if(ccvalidation==true){
        if(val.value.to_cc == '' || val.value.to_cc == undefined || val.value.to_cc == null){
          this.toastr.warning("Please Select CC" + '\xa0\xa0' +  indnum +'\xa0\xa0' + 'Row','',{timeOut:1500});
          return false;
        }else{
          tocc=val.value.to_cc.id
        }
      }else{
        if(val.value.to_cc == '' || val.value.to_cc == undefined || val.value.to_cc == null){
          tocc=''
        }else{
          tocc=val.value.to_cc.id
        }
      }
      if(val.value.to_ratio =='' || val.value.to_ratio==null || val.value.to_ratio ==undefined){
        this.toastr.warning("Please Enter The Ratio Value");  
          return false;
      }else{
        toratio=val.value.to_ratio
      }
        if(val.value.id=='' || val.value.id==undefined || val.value.id==null){
          id=''
        }else{
          id=val.value.id
        }
      
        console.log("else")
        if(this.paticular_id != 0){
          this.to_value.push({
            "id":id,
            "bscc_code": tobscc,
            "cc_id": tocc,
            "bs_id": tobs,
            "ratio": toratio
          });
        }else{
          this.to_value.push({  
            "bscc_code": tobscc,
            "cc_id": tocc,
            "bs_id": tobs,
            "ratio": toratio
          }
        );
      }
    }
    if(Number(maxratio)!=100){
      console.log("max",maxratio)
      this.toastr.error("Ratio Value Should Be 100 Percentage");
      return false;
    }
    console.log("validity_from=>",this.allocation_group.value.validity_from)
    var fromdate=this.allocation_group.value.validity_from
    let validityfrom=this.datePipe.transform(fromdate, 'yyyy-MM-dd')
    var todate=this.allocation_group.value.validity_to
    let validityto=this.datePipe.transform(todate, 'yyyy-MM-dd')

    console.log("finally=>",this.to_value)
    console.log("Core BSCC=>",this.allocation_group.value)
    console.log("BSCC=>",this.allocation_group.value.bscc)
    console.log("paticular_id=>",this.paticular_id)
    let changeValue
    if(this.paticular_id != 0){
      changeValue = {
        "bs_id":from_bs,
        "cc_id":from_cc,
        "frombscccode": from_bscc,
        "validity_from":validityfrom,
        "validity_to":validityto,
        "level": 4,
        "to_data":this.to_value,
        "id":this.paticular_id
        }
    }else{
      changeValue = {
        "bs_id":from_bs,
        "cc_id":from_cc,
        "frombscccode": from_bscc,
        "validity_from":validityfrom,
        "validity_to":validityto,
        "level": 4,
        "to_data":this.to_value
        }
    }
    console.log("amount=>",changeValue)
    this.SpinnerService.show()
    this.allocationserives.set_allocationratio(changeValue,this.paticular_id).subscribe(res => {
      this.SpinnerService.hide()
      if(res){
        this.toastr.success('',res['set_description'],{ timeOut: 1500 })
        this.to_value=[]
        this.paticular_id=0
        this.costallocation_clear('summary_add')
        this.summary_param={
          'allocation':'',
          'bs':'',
          'cc':''
        }
        this.costallocation_summary(this.summary_param);
      }
    },error => {
      changeValue={}
      this.to_value=[]
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
    console.log("new value",this.to_value)
  }
  private get_particular_value(allocaton_id) {
    this.SpinnerService.show()
    this.allocationserives.particularallocation(allocaton_id)
      .subscribe((datas: any[]) => {
    this.SpinnerService.hide()

        let results =datas['data'][0]
        console.log("new=>",this.allocation_group.controls.to_allocation['controls'])
        this.paticular_id=results.id
        let display_data=results['to_data']
        let data=new FormArray([])
        display_data.forEach(element => {
          console.log("element",element)
          this.minvalue_from=results['validity_from']
          data.push(this.formbuilder.group({
          id:element.id,
          to_bscc: element['bscc_data'],
          to_bs:element['bs_data'],
          to_cc:element['cc_data'],
          to_ratio:element['ratio'],
          }))
          return data;
        });
        this.allocation_group.setControl('to_allocation',data)
        console.log("newrow",this.allocation_group)
        this.allocation_group.patchValue({
          allocation:results['bscc_data'],
          bs:results['bs_data'],
          cc:results['cc_data'],
          validity_from:results['validity_from'],
          validity_to:results['validity_to'],
         })
         this.ration_cal()
        console.log("cost_allocationform",this.allocation_group)
       },error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    )

  }
  status_change(id,status){
    let statusid
    let message
    if(status==1){
      statusid=0
      message='Successfully In-Active'
    }else{
      statusid=1
      message='Successfully Active'
    }
    console.log(id,statusid)
    let dataConfirm = confirm("Are you sure,You Are Change The Status?")
    if (dataConfirm == false) {
      return false;
    }
    this.allocationserives.getStatus(id,statusid).subscribe((results: any[]) => {
        this.toastr.success('', message , { timeOut: 1500 });
        this.summary_param={
          'allocation':'',
          'bs':'',
          'cc':''
        }
        this.costallocation_summary(this.summary_param);
        console.log("result=>",results)
      })
  }
  allocation_clear(clear,index){
    if(clear=='bscc'){
      console.log('diff bscc')
      this.allocation_group.controls['bs'].reset('')
      this.allocation_group.controls['cc'].reset('')
    }
    if(clear=='bs'){
      this.allocation_group.controls['cc'].reset('')
    }
    if(clear=='bscc_to'){
      this.allocation_group.get('to_allocation')['controls'][index].get("to_bs").reset('')
      this.allocation_group.get('to_allocation')['controls'][index].get("to_cc").reset('')
    }
    if(clear=='bs_to'){
      this.allocation_group.get('to_allocation')['controls'][index].get("to_cc").reset('')
    }
  }
}
