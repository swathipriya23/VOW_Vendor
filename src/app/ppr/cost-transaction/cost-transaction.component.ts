import { DatePipe, formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { catchError, concatAll, debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PprService } from '../ppr.service';
import {MatDatepicker} from '@angular/material/datepicker';
import { NotificationService } from 'src/app/service/notification.service';
import { ToastrService } from 'ngx-toastr';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxSpinnerService } from 'ngx-spinner';
import { EMPTY, fromEvent } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ErrorhandlingService } from '../errorhandling.service';
const dateValid = (c: AbstractControl) => {
  if ( !c || !c.value ) {
    return null
  }

  if ( c.value.length === 2 && c.value.every(_ => _) ) {
    return null
  }

  return { invalidDate: 'Please select month and year' }
}

const dateInPast = (c: AbstractControl) => {
  console.log("date picker=>",c)
  if ( !c || !c.value ) {
    return null
  }

  if ( c.value.length === 2 && c.value.every(_ => _) ) {

    const currDate = new Date();
    if ( 
      c.value[1]  <  currDate.getFullYear() ||
    ( c.value[1] === currDate.getFullYear() && c.value[0] < (currDate.getMonth() + 1 ) )
 
  ) {

    return { dateInPast: 'Please select a present or future date.' };

  }    

  }

  return null
}
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import { C } from '@angular/cdk/keycodes';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export interface allocationFromNameLists {
  id: number
  name: string
}
export interface BSCNameLists {
  id: number
  name: string
}
export interface ccList {
  id: number
  name: string
}
export interface CostDriverInputList {
  id: number
  name:string
  sector: string
}
export interface BSNameLists {
  id: number
  name: string
}
export interface ccNameList{
  id:number
  name:string
}
@Component({
  selector: 'app-cost-transaction',
  templateUrl: './cost-transaction.component.html',
  styleUrls: ['./cost-transaction.component.scss'],


})
export class CostTransactionComponent implements OnInit {
  datedefalut=''
  maxdate=new Date()
  cost_transfer: FormGroup
  newrowadd: FormGroup
  Bsccname: Array<BSCNameLists>
  Bscchidename: Array<BSCNameLists>

  allocationfrom: Array<allocationFromNameLists>
  BsNamecode: Array<BSCNameLists>
  BsNamehidecode:Array<BSCNameLists>
  cccode: Array<ccList>
  cchidecode: Array<ccList>
  cc_id: any 
  isLoading:boolean
  bscc_id: any;
  bs_id: any;
  pramsName: any;
  format: any="";
  bsalocationdropdown_id: any;
  newrowadddetails: FormGroup;
  has_next: any;
  has_previous: any;
  presentpage: any;
  isSummaryPagination: boolean;
  // datePipe: any;
  // var tranferdate=this.datePipe.transform(format.capdate_Value, 'yyyy-MM-dd')
  // monthdate = new FormControl(moment1());
  @ViewChild('myFormField', {read: ElementRef}) private formField: ElementRef;
  tranferdate
  Bsfromcode: any;
  has_nextval: boolean;
  has_previousval: boolean;
  currentpagenum: number;
  ccfromcode: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  // bs
  @ViewChild('bsformInput') bsformInput: any;
  @ViewChild('bsfromAutoComplete') bsfromAutoComplete:MatAutocomplete;

  // cc

  @ViewChild('ccformInput') ccformInput: any;
  @ViewChild('ccfromAutoComplete') ccfromAutoComplete:MatAutocomplete;

  @ViewChild('bsInput') bsInput: any;
  @ViewChild('allocationFromAutoComplete') allocationFromAutoComplete:MatAutocomplete;
  allocation_list: any;
  year: number;
  transaction: { bscc_id: any; bs_id: any; cc_id: any; core_bscc: any; level_id: number; transaction_month: any; };
  amountval: any=true;
  get datePlaceholder(): string {
  //  var dat= new Date(this.date.value[0],this.date.value[1]).toLocaleString('en-us',{month:'long', year:'numeric', day:'numeric'})
    // this.tranferdate=this.datePipe.transform(this.date.value, 'yyyy-MM')
    // console.log("d and dste=>",dat)
    const ans = ['MM', '-', 'YYYY'];
    

    // console.log(dat)
    if (this.date.value) {
      // console.log(this.date)
      if (this.date.value[0]) {

        const _v = this.date.value[0] < 13 ? `0${this.date.value[0]}` : this.date.value[0];
        var a = _v;
         ans[0]=new Date(a).toLocaleString('en-us',{month:'short'})

      }

      if (this.date.value[1]) {
        ans[2] = this.date.value[1];
        // =new Date(b).toLocaleString('en-us',{year:'numeric'})
      }
    }
    
    return ans.join('');
  }

  ngAfterViewInit() {

    this.formField.nativeElement.classList.remove("mat-form-field-disabled");

  }

  date = new FormControl(null, [Validators.required, dateValid, dateInPast] );
  changeval( dp: MatDatepicker<Date>){
    console.log("this.bsalocationdropdown_id=>",this.bsalocationdropdown_id)
    if(this.bsalocationdropdown_id==null || this.bsalocationdropdown_id==undefined || this.bsalocationdropdown_id==''){
      console.log("open")
      dp.close()
      // return false;
    }
  }
  chosenYearHandler(d: Date) {
    // if(this.bsalocationdropdown_id==null || this.bsalocationdropdown_id==undefined || this.bsalocationdropdown_id==''){
    //   console.log("open")
    //   // dp.close()
    //   return false;
    // }
    const v: null | [number, number]  = this.date.value;
    const yr = d.getFullYear();

    if (v) {

      if (v[1] !== yr ) {

        v[1] = yr;
        this.year=yr
        this.date.setValue(v);

      }

      return;

    }
    
    if (!v) {
      const _v = [undefined, yr];
      this.date.setValue(_v);
    }
  
    console.log(this.bsalocationdropdown_id)
    

  }
 displaydateandyear
  chosenMonthHandler(d: Date, datepicker: MatDatepicker<Date>) {
    
    // console.log("d and dste=>",this.tranferdate)
    // this.displaydateandyear=d
    const v: null | [number, number]  = this.date.value;
    const m = d.getMonth() + 1;

    if (v) {

      if (v[0] !== m ) {

        v[0] = m;
        this.date.setValue(v);

      }

    } else {
      const _v = [m, this.year];
      this.date.setValue(_v);
      
    }
    console.log("date=>",this.date)
  //   const newrowadddetailscontrol = <FormArray>this.newrowadddetails.controls['rows_value'];
  //   for(let i = newrowadddetailscontrol.length; i >= 0; i--) {
  //       newrowadddetailscontrol.removeAt(i)
  // }
    // let cls= (this.newrowadddetails.controls['rows_value'] as FormArray)
    // cls.reset();
      
      
      // this.toDisplay=
    datepicker.close();
    
    this.yeartransfer(this.date)

  }

  // chosenYearHandler(normalizedYear: Moment) {
  //   const ctrlValue = this.monthdate.value;
  //   ctrlValue.year(normalizedYear.year());
  //   this.monthdate.setValue(ctrlValue);
  //   // this.format=ctrlValue._d
  // }

  // chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
  //   // console.log("this.cost_transfer",this.cost_transfer)
  //   const ctrlValue = this.monthdate.value;
  //   ctrlValue.month(normalizedMonth.month());
  //   this.monthdate.setValue(ctrlValue);
  //   // this.format=ctrlValue._d
  //   let date=this.monthdate.value._d
  //   this.yeartransfer(date)
  //   // console.log(this.format)
  //   datepicker.close()
  
  // }
  constructor(private formBuilder: FormBuilder,private errorHandler:ErrorhandlingService, private SpinnerService: NgxSpinnerService,private pprserice: PprService,private datePipe:DatePipe,private notification: NotificationService,private toastr:ToastrService) { 
    // console.log(this.monthdate.value)
  }
  // date = new FormControl(moment());

  ngOnInit(): void {
    // this.monthdate.patchValue('')
    // this.cost_transfer.patchValue({
    //   monthdate:this.monthdate.value
    // })
    this.cost_transfer = this.formBuilder.group({
      allocationfrom_ratio:[''],
      allocationfrom_filter: [""],
      monthdate:[''],
      allocationbsform_filter:[''],
      allocationfromcc:['']
      
    })
    this.newrowadd = this.formBuilder.group({
      rows_value: new FormArray([
        this.createItemFormGroup()
      ])
    })
    this.newrowadddetails = this.formBuilder.group({
      rows_value: new FormArray([
        this.createItemValueFormGroup()
      ])
    })
  }
  bsfromDropdown(){
    let keyvalue: String = "";
    console.log(this.cost_transfer.value)
    let bscc_id
    this.Bsfromcode=[]
    if(this.cost_transfer.value.allocationfrom_filter==''|| this.cost_transfer.value.allocationfrom_filter==null || this.cost_transfer.value.allocationfrom_filter==undefined|| Object.keys(this.cost_transfer.value.allocationfrom_filter).length==0){
      bscc_id=''
    }else{
     bscc_id=this.cost_transfer.value.allocationfrom_filter.id
    }
    console.log(bscc_id)
    this.getasset_Bs(bscc_id,keyvalue);
    this.cost_transfer.get('allocationbsform_filter').valueChanges
      .pipe(
        
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.pprserice.get_bs_dropdown(bscc_id,value,1)
          .pipe(
            finalize(() => {
              // console.log(value.id)
              // this.val=value
              // this.bsdropdown_id=value.id
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Bsfromcode = datas;
        console.log("value")
        
      })
  }
  private getasset_Bs(id,keyvalue) {
    this.pprserice.get_bs_dropdown(id,keyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Bsfromcode = datas;
        
        console.log("main=>",this.Bsfromcode)
      })
  }
  displaybsfrom(BSName:BSNameLists): string | undefined{
    return BSName ? BSName.name : undefined;
  }
  bsfromscroll(){
     this.has_nextval = true
     this.has_previousval = true
     this.currentpagenum = 1
     let bscc_id
     if(this.cost_transfer.value.allocationfrom_filter=='' || this.cost_transfer.value.allocationfrom_filter==null || this.cost_transfer.value.allocationfrom_filter==undefined || Object.keys(this.cost_transfer.value.allocationfrom_filter).length==0){
       bscc_id=''
  
    }else{
       bscc_id=this.cost_transfer.value.allocationfrom_filter.id
  
    }
      console.log("scroll")
      setTimeout(() => {
        if (
          this.bsfromAutoComplete &&
          this.autocompleteTrigger &&
          this.bsfromAutoComplete.panel
        ) {
          fromEvent(this.bsfromAutoComplete.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.bsfromAutoComplete.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.bsfromAutoComplete.panel.nativeElement.scrollTop;
              const scrollHeight = this.bsfromAutoComplete.panel.nativeElement.scrollHeight;
              const elementHeight = this.bsfromAutoComplete.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextval === true) {
                  console.log("true")
                  this.pprserice.get_bs_dropdown(bscc_id,this.bsformInput.nativeElement.value, this.currentpagenum+1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      console.log("loop",this.currentpagenum)
                      this.Bsfromcode = this.Bsfromcode.concat(datas);
                      if (this.Bsfromcode.length >= 0) {
                        this.has_nextval = datapagination.has_next;
                        this.has_previousval = datapagination.has_previous;
                        this.currentpagenum = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
  }
  
  ccfromDropdown(){
    let keyvalue: String = "";
    let bs_id=this.cost_transfer?.value?.allocationbsform_filter?.id
    this.getasset_cc(bs_id,keyvalue);
    this.cost_transfer.get('allocationfromcc').valueChanges
      .pipe(
        
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.pprserice.get_cc_dropdown(bs_id,value,1)
          .pipe(
            finalize(() => {
              // console.log(value.id)
              // this.val=value
              // this.bsdropdown_id=value.id
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccfromcode = datas;
        console.log("value")
        
      })
  }
  private getasset_cc(id,keyvalue) {
    this.pprserice.get_cc_dropdown(id,keyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccfromcode = datas;
        
        console.log("main=>",this.ccfromcode)
      })
  }
  displayccfrom(ccname:ccNameList):string |undefined{
    return ccname?ccname.name :undefined
  }
  ccfromscroll(){
    let bs_id=this.cost_transfer?.value?.allocationbsform_filter?.id
    this.has_nextval = true
    this.has_previousval = true
    this.currentpagenum = 1
     console.log("scroll")
     setTimeout(() => {
       if (
         this.ccfromAutoComplete &&
         this.autocompleteTrigger &&
         this.ccfromAutoComplete.panel
       ) {
         fromEvent(this.ccfromAutoComplete.panel.nativeElement, 'scroll')
           .pipe(
             map(x => this.ccfromAutoComplete.panel.nativeElement.scrollTop),
             takeUntil(this.autocompleteTrigger.panelClosingActions)
           )
           .subscribe(x => {
             const scrollTop = this.ccfromAutoComplete.panel.nativeElement.scrollTop;
             const scrollHeight = this.ccfromAutoComplete.panel.nativeElement.scrollHeight;
             const elementHeight = this.ccfromAutoComplete.panel.nativeElement.clientHeight;
             const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
             if (atBottom) {
               if (this.has_nextval === true) {
                 console.log("true")
                 this.pprserice.get_cc_dropdown(bs_id,this.ccformInput.nativeElement.value, this.currentpagenum+1)
                   .subscribe((results: any[]) => {
                     let datas = results["data"];
                     let datapagination = results["pagination"];
                     console.log("loop",this.currentpagenum)
                     this.ccfromcode = this.ccfromcode.concat(datas);
                     if (this.ccfromcode.length >= 0) {
                       this.has_nextval = datapagination.has_next;
                       this.has_previousval = datapagination.has_previous;
                       this.currentpagenum = datapagination.index;
                     }
                   })
               }
             }
           });
       }
     });
  }
  valuealocationfrom:any
  public displayallocationfromppr(allocationfrom?: allocationFromNameLists): string | undefined {
    return allocationfrom ? allocationfrom.name : undefined;
  }
  private allocation_fromdroupdown(keyvalue) {
    this.pprserice.get_business_dropdown(1,keyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.allocationfrom = datas;
        
        console.log("main=>",this.allocationfrom)
      })
  }
  allocation_from(){
    let keyvalue: String = "";
    this.allocation_fromdroupdown(keyvalue);
    this.cost_transfer.get('allocationfrom_filter').valueChanges
      .pipe(
        
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.pprserice.get_business_dropdown(1,value,1)
          .pipe(
            finalize(() => {
              // console.log(value.id)
              this.valuealocationfrom=value
              this.bsalocationdropdown_id=value.id
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.allocationfrom = datas;
        this.newrowadd.reset();
        this.newrowadddetails.reset();
        this.hidebutton=false
        this.cost_transfer.controls
        this.cost_transfer.controls['allocationbsform_filter'].reset('')
        this.format=''
        this.quarter=0
        const control = <FormArray>this.newrowadd.controls['rows_value'];
        for(let i = control.length-1; i >= 1; i--) {
            control.removeAt(i)
    }
    const newrowadddetailscontrol = <FormArray>this.newrowadddetails.controls['rows_value'];
    for(let i = newrowadddetailscontrol.length; i >= 0; i--) {
        newrowadddetailscontrol.removeAt(i)
  }
      })
  }
  costallocationfromscroll(){
    this.has_nextval = true
    this.has_previousval = true
    this.currentpagenum = 1
    console.log("scroll")
    setTimeout(() => {
      if (
        this.allocationFromAutoComplete &&
        this.autocompleteTrigger &&
        this.allocationFromAutoComplete.panel
      ) {
        fromEvent(this.allocationFromAutoComplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.allocationFromAutoComplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.allocationFromAutoComplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.allocationFromAutoComplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.allocationFromAutoComplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextval === true) {
                console.log("true")
                this.pprserice.get_business_dropdown(1,this.bsInput.nativeElement.value, this.currentpagenum+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    console.log("loop",this.currentpagenum)
                    this.allocationfrom = this.allocationfrom.concat(datas);
                    if (this.allocationfrom.length >= 0) {
                      this.has_nextval = datapagination.has_next;
                      this.has_previousval = datapagination.has_previous;
                      this.currentpagenum = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  createItemFormGroup() {
    let fg = new FormGroup({
      Bscc:new FormControl(''),
      cc_dropdown: new FormControl(''),
      bsName_dropdown: new FormControl(''),
      parameter_dropdown: new FormControl(''),
      inputvalue: new FormControl(''),
      ratiovalue: new FormControl(''),
      amount_value: new FormControl(''),
      premium_amount:new FormControl(''),
    })
    
    return fg
    
  }
  createItemValueFormGroup() {
    let fg = new FormGroup({
      Bscc:new FormControl(''),
      cc_dropdown: new FormControl(''),
      bsName_dropdown: new FormControl(''),
      parameter_dropdown: new FormControl(''),
      inputvalue: new FormControl(''),
      ratiovalue: new FormControl(''),
      amount_value: new FormControl(''),
      premium_amount:new FormControl(''),
      gl_name:new FormControl(''),

    })
    
    return fg
    
  }
  private getasset_Bscc(keyvalue) {
    this.pprserice.getbusinessdropdown(1, keyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Bsccname = datas;

      })
  }

  public displaybscc(bsccocde_level?: BSCNameLists): string | undefined {
    return bsccocde_level ? bsccocde_level.name : undefined;
  }
  BsccDropdown(i) {
    let keyvalue: String = "";
    this.getasset_Bscc(keyvalue);
    console.log(this.newrowadd.value['rows_value'])
   
    var arrayControl = this.newrowadd.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
    item.get("Bscc").valueChanges

      .pipe(
        
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),

        switchMap(value => this.pprserice.getbusinessdropdown(1, value,1)
          .pipe(
            finalize(() => {
              // console.log(value.id)
              this.bscc_id = value.id
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Bsccname = datas;
        // let filterdata=this.Bsccname.findIndex(brid=>brid.id===this.bsdropdown_id)
        //      this.Bsccname.splice(filterdata,1)

      })

  }
  public displaybsName(bsccocde_level?: BSCNameLists): string | undefined {
    return bsccocde_level ? bsccocde_level.name : undefined;
  }

  getbsDropdown(keyvalue) {

    this.pprserice.getbsdropdown(this.bscc_id, keyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BsNamecode = datas;
        

      })
  }
  bsNameDropdown(i) {
    let keyvalue: String = "";
    this.getbsDropdown(keyvalue);
    var arrayControl = this.newrowadd.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
    item.get("bsName_dropdown").valueChanges
      .pipe(
        
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),

        switchMap(value => this.pprserice.getbsdropdown(this.bscc_id, value, 1)
          .pipe(
            finalize(() => {
              console.log(value.id)
              this.bs_id = value.id
              this.isLoading = false

            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BsNamecode = datas;

      })
  }
  
  private getasset_cccode(keyvalue) {
    this.pprserice.getccdropdown(this.bs_id, keyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cccode = datas;

      })
  }

  public displayccppr(cc_name?: ccList): string | undefined {
    return cc_name ? cc_name.name : undefined;
  }
  ccDropdown(i) {
    let keyvalue: String = "";
    this.getasset_cccode(keyvalue);
    var arrayControl = this.newrowadd.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
    item.get("cc_dropdown").valueChanges
      .pipe(
        
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),

        switchMap(value => this.pprserice.getccdropdown(this.bs_id, value, 1)
          .pipe(
            finalize(() => {
              // console.log(value)
              this.cc_id = value.id
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cccode = datas;

      })

  }
  parameter_dropdown = new FormControl()
  parameter: Array<CostDriverInputList>
  public displayparam(CostDriver?: CostDriverInputList): string | undefined {
    return CostDriver ? CostDriver.sector : undefined;
  }
  getParameterDropdown(keyvalue) {

    this.pprserice.getcostdriverdropdown(keyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.parameter = datas;
        console.log(this.parameter)

      })
  }
  ParameterDropdown(i) {
    let prokeyvalue: String = "";
    this.getParameterDropdown(prokeyvalue);
    var arrayControl = this.newrowadd.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
    item.get("parameter_dropdown").valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.pprserice.getcostdriverdropdown(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)
              this.pramsName=value
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.parameter = datas;

      })
  }
  year_trans:any
  date_trans:any
  hidebutton=false
  amountvalue=0
  quarter:any=0
  finyear=0
  amount=0
  month_trans
  yeartransfer(value){
    this.amountvalue=0
    // let date=this.monthdate.value._d
    console.log("log",value)
    this.year_trans=value.value[1]
    this.month_trans=value.value[0]
    console.log("year and month",this.year_trans,this.month_trans)
    // this.date_trans=this.datePipe.transform(value,'MM')
    //  this.finyear=this.year_trans.slice(2,4)
    console.log("finyear=>",this.finyear)
    if(this.month_trans==4||this.month_trans==5||this.month_trans==6){
      this.quarter=1
      console.log("4 to 6")
    }
    else if(this.month_trans==7||this.month_trans==8||this.month_trans==9){
      this.quarter=2
      console.log("7to 8")
    }
    else if(this.month_trans==10||this.month_trans==11||this.month_trans==12){
      this.quarter=3
      console.log("8 to 12")
    }
    else{
      this.quarter=4
    }
    console.log("this.quarter",this.quarter)
    if(this.bsalocationdropdown_id==18){
      // this.toDisplay=true
 
  // var yearsplite=dateformat.getFullYear()
var amount=0
var bsdetails
var ccdetails
console.log("month",this.month_trans)
let  od_aloocation=new FormArray([])

  this.pprserice.transfervalidation(this.year_trans,this.month_trans).subscribe((elements:any[])=>{
    // console.log(element)
   
    let data=elements['data']
    console.log(data)
    if(data.length===0){
      this.hidebutton=true
      
      console.log("value")
    }
    else{
      this.hidebutton=false
    }
   
    data.forEach(element => {
      bsdetails={name:element['bsname'],id:element['bs_code']}
      ccdetails={name:element['ccname'],id:element['cc_code']}
      let amountformat=0
      amount=(Number(element['totalamount'])+amount)
      // this.amount=parseFloat(amountformat)
      // console.log("amountformat",amount)
    // tech_aloocation.push(this.formBuilder.group({
    //   // id:element.id,
    //   Bscc: '',
    //   bsName_dropdown:element['bs_code'],
    //   cc_dropdown:element['cc_code'],
    //   parameter_dropdown:'',
    //   premium_amount:'',
    //   inputvalue:0,
    //   ratiovalue:'',
    //   amount_value:element['totalamount']
    //   }))
    //   return tech_aloocation;
    })
// this.newrowadd.setControl('rows_value',tech_aloocation)
console.log("amount=>",bsdetails)
var zeroval=(0).toFixed(2)
var amountval=(1).toFixed(2)
od_aloocation.push(this.formBuilder.group({
      // id:element.id,
      Bscc: this.valuealocationfrom,
      bsName_dropdown:bsdetails,
      cc_dropdown:ccdetails,
      parameter_dropdown:'',
      premium_amount:amountval,
      inputvalue:zeroval,
      ratiovalue:100,
      amount_value:amount
      }))
      return od_aloocation;

})
this.newrowadd.setControl('rows_value',od_aloocation)

      // this.newrowadd.controls.rows_value['controls'].at(0).patchValue({amount_value:amount})

    }
    
    if(this.bsalocationdropdown_id==11){
      this.pprserice.transferAllocation(this.year_trans,this.month_trans).subscribe((elements:any[])=>{
        console.log("allocation",elements)
        let holder={}
        let inputValue=[]
    var itdata=elements['data']
    if(itdata.length===0){
      
      this.toDisplay=false
      this.hidebutton=true
      console.log("value")
    }
    else{
      this.hidebutton=false
    }
        let tech_aloocation=new FormArray([])
      // itdata.forEach(element => {
      //   if (holder.hasOwnProperty(element['bs_data'].id),holder.hasOwnProperty(element['cc_data'].id)) {
      //     holder[element['bs_data'].id,element['cc_data'].id] = holder[element['bs_data'].id,element['cc_data'].id] + Number(element.totalamount);
      //   } else {
      //     holder[element['bs_data'].id,element['cc_data'].id] = Number(element.totalamount);
      //   }
      //   // console.log(element['bs_data'].id)
      //   // if(element)
      // });
      // for (var prop in holder) {
      //   console.log(holder)
      //   inputValue.push({ "amount": holder[prop] });
      // }
      // console.log(inputValue)
      var count=[]
      var ratioamounts=0
      var amountValue=0
      var bsName_dropdown
      var ccdrop
      console.log("itdata=>",itdata['bs_data'])
      for(let itvalue of itdata){
        this.amountvalue+=Number(itvalue.totalamount)

        console.log("it=>",itvalue['bs_data'])
          if(Number(itvalue['bs_data'].code)===64 && Number(itvalue['cc_data'].code)===258){
        // console.log("if=>",elements['bs_data'].code)
        console.log("elements=>",elements)
        bsName_dropdown=itvalue['bs_data']
        ccdrop=itvalue['cc_data']
        console.log("itvalue.totalamount=>",itvalue.totalamount)
        
      }
      }
      var zeroval=(0).toFixed(2)
      var amountval=(1).toFixed(2)
      console.log("count",count)
      console.log("amount",this.amountvalue)
      for(let len=0;len<=this.newrowadd.controls.rows_value['controls'].length-1;len++){
        this.newrowadd.controls.rows_value['controls'].at(len).patchValue({Bscc:this.valuealocationfrom})
        this.newrowadd.controls.rows_value['controls'].at(len).patchValue({amount_value:this.amountvalue});
        this.newrowadd.controls.rows_value['controls'].at(len).patchValue({bsName_dropdown:bsName_dropdown})
        this.newrowadd.controls.rows_value['controls'].at(len).patchValue({cc_dropdown:ccdrop})
        this.newrowadd.controls.rows_value['controls'].at(len).patchValue({ratiovalue:100})
        this.newrowadd.controls.rows_value['controls'].at(len).patchValue({inputvalue:zeroval})
        this.newrowadd.controls.rows_value['controls'].at(len).patchValue({premium_amount:amountval})



      }
  //   itdata.forEach(element => {
  //     tech_aloocation.push(this.formBuilder.group({
  //       // id:element.id,
  //       Bscc: '',
  //       bsName_dropdown:element['bs_data'],
  //       cc_dropdown:element['cc_data'],
  //       parameter_dropdown:'',
  //       premium_amount:'',
  //       inputvalue:0,
  //       ratiovalue:'',
  //       amount_value:element['totalamount']
  //       }))
  //       return tech_aloocation;
  
  // })
  // this.newrowadd.setControl('rows_value',tech_aloocation)
    })
     
    }
  }
  
  private getasset_Bsccvalue(keyvalue) {
    this.pprserice.getbusinessdropdown(1, keyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Bscchidename = datas;

      })
  }

  public displaybscchide(bsccocde_level?: BSCNameLists): string | undefined {
    return bsccocde_level ? bsccocde_level.name : undefined;
  }
  BscchideDropdown(i) {
    let keyvalue: String = "";
    this.getasset_Bsccvalue(keyvalue);
    console.log(this.newrowadddetails.value['rows_value'])
   
    var arrayControl = this.newrowadddetails.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
    item.get("Bscc").valueChanges

      .pipe(
        
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),

        switchMap(value => this.pprserice.getbusinessdropdown(1, value,1)
          .pipe(
            finalize(() => {
              // console.log(value.id)
              this.bscc_id = value.id
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Bscchidename = datas;
       
      })

  }

  public displaybsNamehide(bsccocde_level?: BSCNameLists): string | undefined {
    return bsccocde_level ? bsccocde_level.name : undefined;
  }

  getbshideDropdown(keyvalue) {

    this.pprserice.getbsdropdown(this.bscc_id, keyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BsNamehidecode = datas;
        

      })
  }
  bsNamehideDropdown(i) {
    let keyvalue: String = "";
    this.getbshideDropdown(keyvalue);
    var arrayControl = this.newrowadddetails.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
    item.get("bsName_dropdown").valueChanges
      .pipe(
        
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),

        switchMap(value => this.pprserice.getbsdropdown(this.bscc_id, value, 1)
          .pipe(
            finalize(() => {
              console.log(value.id)
              this.bs_id = value.id
              this.isLoading = false

            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BsNamehidecode = datas;

      })
  }



  private getassethide_cccode(keyvalue) {
    this.pprserice.getccdropdown(this.bs_id, keyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cchidecode = datas;

      })
  }

  public displayccpprhide(cc_name?: ccList): string | undefined {
    return cc_name ? cc_name.name : undefined;
  }
  cchideDropdown(i) {
    let keyvalue: String = "";
    this.getassethide_cccode(keyvalue);
    var arrayControl = this.newrowadddetails.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
    item.get("cc_dropdown").valueChanges
      .pipe(
        
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),

        switchMap(value => this.pprserice.getccdropdown(this.bs_id, value, 1)
          .pipe(
            finalize(() => {
              // console.log(value)
              this.cc_id = value.id
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cchidecode = datas;

      })

  }
  // parameter_dropdown = new FormControl()
  parameterhide: Array<CostDriverInputList>
  public displayparamhide(CostDriver?: CostDriverInputList): string | undefined {
    return CostDriver ? CostDriver.sector : undefined;
  }
  getParameterhideDropdown(keyvalue) {

    this.pprserice.getcostdriverdropdown(keyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.parameterhide = datas;
        console.log(this.parameterhide)

      })
  }
  ParameterhideDropdown(i) {
    let prokeyvalue: String = "";
    this.getParameterhideDropdown(prokeyvalue);
    var arrayControl = this.newrowadddetails.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
    item.get("parameter_dropdown").valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.pprserice.getcostdriverdropdown(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)
              this.pramsName=value
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.parameterhide = datas;

      })
  }

  toDisplay = false;
  id
  openDatePicker(date){
    date.open()
  }
  loadingdata=true
  Generate(){
    // console.log("date",this.monthdate.value._d)

    // let id
    // this.SpinnerService.show();

    console.log(this.amount)
    if(this.bsalocationdropdown_id===18  ){
    this.toDisplay = !this.toDisplay;
    // this.id=21
    console.log("toDisplay=>",this.toDisplay)
    this.getparticularallocationcost(this.bsalocationdropdown_id)
    }
    else if(this.bsalocationdropdown_id===11){
      this.toDisplay = !this.toDisplay;
      // this.id=18
      this.getparticularallocationcost(this.bsalocationdropdown_id)
    }
   
  }

  private getparticularallocationcost(id_vals,pageNumber=1, pageSize=10) {
    console.log("id_val=>",id_vals)
    let type=this.cost_transfer.value.allocationfrom_filter.name
    let id_val=this.cost_transfer.value.allocationfrom_filter.id
    
console.log("val",this.cost_transfer.value.allocationfrom_filter)
    this.loadingdata=false;

    this.pprserice.getparticularallocation(type,id_val,this.year_trans,this.month_trans,pageNumber,pageSize)
      .subscribe((results: any[]) => {
        console.log(pageNumber)
        this.loadingdata=true;
        
        console.log("new=>",this.newrowadddetails.controls.rows_value['controls'])
        // alocation_from=
        var ratioamonut=0
        let display_data=results['data']
        let dataPagination=results['pagination']
        if (display_data.length >= 0) {
          console.log("val")
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isSummaryPagination = true;
        } if (display_data <= 0) {
          console.log("val1")
    
          this.isSummaryPagination = false;
        }
        // this.todata_id=results['to_data'].id
        // this.costsummary_id=prokeyvalue
        // console.log("display_data=>",this.todata_id)
    //  // this.newrowadd.controls.rows_value['controls'].at(len).patchValue({inputvalue:elem});
    var data=new FormArray([])
         display_data.forEach((element,ind) => {
      console.log(element)
    // this.todata_id.push(element.id)
     //id_droupdown summary
     this.bscc_id=element['bscc_data'].id
     this.bs_id=element['bs_data'].id
     
    // console.log("display_data=>",this.newrowadd.controls.rows_value['controls'].at(ind).get('gl_name'))
      
      data.push(this.formBuilder.group({
      id:element.id,
      Bscc: element['bscc_data'],
      bsName_dropdown:element['bs_data'],
      cc_dropdown:element['cc_data'],
      parameter_dropdown:element['parameter'],
      premium_amount:element['premium_amount'],
      inputvalue:element['input_value'],
      ratiovalue:element['ratio'],
      amount_value:element['ratioamount'],
      gl_name:element['subcategoryname']

      }))
      return data;
    });
    
    this.newrowadddetails.setControl('rows_value',data)
    
        console.log(this.amountvalue)
    //     for(let amonut in display_data){
    //       console.log("val amount=>",display_data[amonut].ratio)
    //       ratioamonut=(Number(display_data[amonut].ratio)/100)*this.amount
    //       console.log("ratioamonut=>",ratioamonut)
    //  this.newrowadddetails.controls.rows_value['controls'].at(amonut).patchValue({amount_value:ratioamonut});

   for(let val of this.newrowadddetails.controls.rows_value['controls']){
     console.log("values data=>",val.value.gl_name)
   }
   
    //     }
    // let dataPagination=results['pagination']
    console.log("dataPagination",dataPagination)
   

      })

  }
  currentpage=1
  previousClick(){
    if (this.has_next === true) {
      console.log("previous")   
      this.currentpage = this.presentpage - 1
      this.getparticularallocationcost(1,this.presentpage - 1,10)
    }
  }
  nextClick() {
    if (this.has_next === true) {
      console.log("page=>",this.presentpage)
        this.currentpage = this.presentpage + 1
        console.log("pre=>",this.currentpage)
        this.getparticularallocationcost(1,this.presentpage + 1,10)
      }
   
    }
  allocation=[]
  
  submit(){
    var FY="FY"
    let year=this.year_trans.toString()
    let finyear=year.slice(2,4)
    console.log("year=>",finyear)
    // console.log(this.monthdate.value.monthdate)
    let date=FY+finyear+"-"+(Number(finyear)+1)
    console.log("date=>",date)
    let cruentdata=new Date()
    let formatdate=this.datePipe.transform(cruentdata, 'yyyy-MM-dd')
    console.log(formatdate)
    console.log("dates",this.year_trans,this.month_trans)
    var allocation_name=this.cost_transfer.value.allocationfrom_filter.name
    var allocation_id=this.cost_transfer.value.allocationfrom_filter.id
//     console.log("newrowadddetails=>",this.cost_transfer.value.allocationfrom_filter.id)
//     // for(let cost of this.cost_transfer.value){
//     //   console.log(cost)
//     // }
    var totamount=0
    for(let amount of this.newrowadd.controls.rows_value['controls']){
      totamount=Number(amount.value.amount_value)+totamount
    }
    this.pprserice.allocation_values(allocation_name,this.year_trans,this.month_trans,allocation_id).subscribe(ele=>{
      console.log("sub=>",ele)
      let data =ele['data']
      var level=0
      if(this.cost_transfer.value.allocationfrom_filter.id==18){
         level=4
      }
      if(this.cost_transfer.value.allocationfrom_filter.id==11){
        level=7
     }
      for(let elem of data ){

        this.allocation.push({
          "finyear":date,
          "sector":"KVB SECTOR",
          "apexpence_id":elem['apexpense_id'],
          "status":1,
          "cat_id":elem['categorygid'],
          "subcat_id":elem['subcat'],
          "quarter":this.quarter,
          "transactionmonth":this.month_trans,
          "transactionyear":this.year_trans,
          "transactiondate":formatdate,
          "valuedate":formatdate,
          "cc_code":elem['cc_data'].id,
          "bs_code":elem['bs_data'].id,
          "apinvoice_id":0,
          "bsname":elem['bs_data'].name,
          "ccname":elem['cc_data'].name,
          "bizname":elem['bscc_data'].name,
          "level":level,
          "cost_driver":1,
          "allocation_amount":totamount,
          "bscc_code":elem['bscc_data'].id,
          "parameter":elem['parameter'],
          "input_value":elem['input_value'],
          "ratio":elem['ratio'],
          "to_amount":elem['ratioamount'],
          "source_bscc_code":this.cost_transfer.value.allocationfrom_filter.id,
          "frombscccode":this.cost_transfer.value.allocationfrom_filter.id,
          "premium_amount":elem['premium_amount']
      
        })
  
      }
      console.log("alocation=>",this.allocation)

    
      this.pprserice.allocationValue(this.allocation,level,this.month_trans,this.year_trans).subscribe(ele=>{
              this.newrowadd.reset();
              this.newrowadddetails.reset();
              this.cost_transfer.reset();
                this.date.reset('')
              this.allocation=[]
              const control = <FormArray>this.newrowadd.controls['rows_value'];
              for(let i = control.length-1; i >= 1; i--) {
                  control.removeAt(i)
          }
          const newrowadddetailscontrol = <FormArray>this.newrowadddetails.controls['rows_value'];
          for(let i = newrowadddetailscontrol.length-1; i >= 1; i--) {
              newrowadddetailscontrol.removeAt(i)
        }
        console.log("code=>",ele.code)
          if(ele.code=="Allocation Already Genrated"){
            this.toastr.warning(ele.description)

          }else{
                  this.notification.showSuccess("Successfully Updated!...")

          }
        
            })
            
    console.log("allocation=>",this.allocation)

          })
    

          // console.log("allocation=>",this.allocation)

   
//     console.log("amount=>",totamount)
//     console.log("this.newrowadddetails.controls.rows_value['controls']",this.newrowadddetails.controls.rows_value['controls'])
//     for(let val of this.newrowadddetails.controls.rows_value['controls']){
//       this.allocation.push({
//         "finyear":date,
//         "sector":"KVB SECTOR",
//         "apexpence_id":21,
//         "status":1,
//         "cat_id":21,
//         "subcat_id":451,
//         "quarter":this.quarter,
//         "transactionmonth":this.date_trans,
//         "transactionyear":this.year_trans,
//         "transactiondate":formatdate,
//         "valuedate":formatdate,
//         "cc_code":val.value.cc_dropdown.id,
//         "bs_code":val.value.bsName_dropdown.id,
//         "apinvoice_id":0,
//         "bsname":val.value.bsName_dropdown.name,
//         "ccname":val.value.cc_dropdown.name,
//         "bizname":val.value.Bscc.name,
//         "level":4,
//         "cost_driver":1,
//         "allocation_amount":totamount,
//         "bscc_code":val.value.Bscc.id,
//         "parameter":val.value.parameter_dropdown,
//         "input_value":val.value.inputvalue,
//         "ratio":val.value.ratiovalue,
//         "to_amount":val.value.amount_value,
//         "source_bscc_code":this.cost_transfer.value.allocationfrom_filter.id,
//         "frombscccode":this.cost_transfer.value.allocationfrom_filter.id,
//         "premium_amount":val.value.premium_amount
    
//       })
//     }
// //     this.pprserice.allocationValue(this.allocation).subscribe(ele=>{
// //       this.newrowadd.reset();
// //       this.newrowadddetails.reset();
// //       this.cost_transfer.reset();
// //       const control = <FormArray>this.newrowadd.controls['rows_value'];
// //       for(let i = control.length-1; i >= 1; i--) {
// //           control.removeAt(i)
// //   }
// //   const newrowadddetailscontrol = <FormArray>this.newrowadddetails.controls['rows_value'];
// //   for(let i = newrowadddetailscontrol.length-1; i >= 1; i--) {
// //       newrowadddetailscontrol.removeAt(i)
// // }
// //       this.notification.showSuccess("Successfully Updated!...")

// //     })
  }
  transactionsearch(transactiondata,date){
    console.log("transactiondata=>",transactiondata,date)
    if(transactiondata.allocationbsform_filter==null || transactiondata.allocationbsform_filter==undefined || transactiondata.allocationbsform_filter==''){
      this.toastr.warning('Please Select The BS')

      return false;
      transactiondata.allocationbsformfilter=''
    }else{
      transactiondata.allocationbsformfilter=transactiondata.allocationbsform_filter.id
    }
    if(transactiondata.allocationfrom_filter==null || transactiondata.allocationfrom_filter==undefined || transactiondata.allocationfrom_filter==''){
      this.toastr.warning('Please Select The Core Bs')
      return false;
      transactiondata.allocationfromfilter=''
    }else{
      transactiondata.allocationfromfilter=transactiondata.allocationfrom_filter.id
    }
    if(transactiondata.allocationfromcc==null || transactiondata.allocationfromcc==undefined || transactiondata.allocationfromcc==''){
      transactiondata.allocationcc=''
    }else{
      transactiondata.allocationcc=transactiondata.allocationfromcc.id
    }
    let dateval
    if(date==null || date==undefined || date==''){
      this.toastr.warning('Please Select The Transacation Month')
      return false;
      dateval=''
      console.log(dateval)
    }else{
      dateval=date[0]
      console.log(dateval)
    }
    console.log(dateval)
    this.transaction={
      "bscc_id": transactiondata.allocationfromfilter,
      "bs_id":transactiondata.allocationbsformfilter,
      "cc_id":transactiondata.allocationcc,
      "core_bscc":transactiondata.allocationfromfilter,
      "level_id":4,
      "transaction_month":dateval
    }
    for (var ind in this.transaction) {
      if (this.transaction[ind] == null || this.transaction[ind] == undefined || this.transaction[ind] == '') {
        delete this.transaction[ind];
      }
    }
    console.log(this.transaction)
  
    this.SpinnerService.show()
    this.pprserice.allocation_list(this.transaction).subscribe(data=>{
      console.log(data)
      let results=data['data']
      this.SpinnerService.hide()
      if(results.length!=0){
        let zeroornot=results.map(x=>x.final_total)
        this.amountval =zeroornot.every( val => val === 0 )
        console.log(this.amountval)
        this.toDisplay=true
      }else{
        this.toDisplay=false
        this.amountval=true
      }
      this.allocation_list=results
    },error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  
  }
  transactionclear(transation,date){
    this.cost_transfer.controls['allocationbsform_filter'].reset('')
    this.cost_transfer.controls['allocationfrom_filter'].reset('')
    this.cost_transfer.controls['allocationfromcc'].reset('')
    this.date.reset('')
  }
  trancation(){
    // let transaction={
    //   "bscc_id": 3,
    //   "bs_id":1,
    //   "cc_id":1,
    //   "core_bscc":5,
    //   "level_id":4,
    //   "transaction_month":1
    // }
    // for (var ind in transaction) {
    //   if (transaction[ind] == null || transaction[ind] == undefined || transaction[ind] == '') {
    //     delete transaction[ind];
    //   }
    // } 
    console.log(this.transaction)
    this.SpinnerService.show()
    this.pprserice.trancationinsert(this.transaction).subscribe(data=>{
      this.SpinnerService.hide()
      console.log(data)
      if(data.status=='success'){
        this.toastr.success('',data.message,{ timeOut: 1500 })
        this.transactionsearch(this.cost_transfer.value,this.date.value)
      }
    },error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })

  }
}
