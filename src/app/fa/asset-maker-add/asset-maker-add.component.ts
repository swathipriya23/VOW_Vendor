import { Component, OnInit, Inject ,ViewChild, ElementRef,HostListener} from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';

import { faservice } from '../fa.service';
import { faShareService } from '../share.service'
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable,fromEvent } from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe, formatDate } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../error-handler.service';
// import { formatNumber } from '@angular/common';
// import { group } from 'console';
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

export interface assetgrplists {
  id: string;
  name: string;
}

export interface assetidlistss {
  id: string;
  name: string;
}
export interface assetgrpsub {
  id: string;
  name: string;
  glno:string
}


@Component({
  selector: 'app-asset-maker-add',
  templateUrl: './asset-maker-add.component.html',
  styleUrls: ['./asset-maker-add.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class AssetMakerAddComponent implements OnInit {
  @ViewChild('locationsub') location_sub:ElementRef;
  @ViewChild('fileInput') frmdata:FormData;
  @ViewChild('exampleModal') public exampleModal: ElementRef;
  @ViewChild('exampleModals') public exampleModals: ElementRef;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('bs') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('commodityInput') commodityInput: any;

  @ViewChild('cc') matccAutocomplete: MatAutocomplete;
  @ViewChild('ccInput') Inputcc: any;

  @ViewChild('branchname') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') Inputbranch: any;

  @ViewChild('locationname') matlocationAutocomplete: MatAutocomplete;
  @ViewChild('inputlocation') Inputlocation: any;

  @ViewChild('branch_id') matbranchidAutocomplete: MatAutocomplete;
  @ViewChild('branchidInput') Inputbranchid: any;

  @ViewChild('apcategory') matapAutocomplete: MatAutocomplete;
  @ViewChild('inputap') Inputap: any;

  @ViewChild('apsubcategory') matapsubAutocomplete: MatAutocomplete;
  @ViewChild('inputapsub') Inputapsub: any;

  @ViewChild('assetgroup') matassetgroupAutocomplete: MatAutocomplete;
  @ViewChild('inputassetgroup') Inputassetgroup: any;

  @ViewChild('assetid') matassetidAutocomplete: MatAutocomplete;
  @ViewChild('inputassetid') Inputassetid: any;

  @ViewChild('product') matproductbAutocomplete: MatAutocomplete;
  @ViewChild('inputproduct') Inputproduct: any;

  @ViewChild('assetcategory') matassetbAutocomplete: MatAutocomplete;
  @ViewChild('inputasset') Inputasset: any;

  @ViewChild('branch') matsplitbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchsInput') Inputsplitbranch: any;

  @ViewChild('bs') matsplitbsAutocomplete: MatAutocomplete;
  @ViewChild('bsInput') splitbsInput: any;

  @ViewChild('location') matLocation:MatAutocomplete;
  @ViewChild('locationInput') locationInput:any;

  @ViewChild('inputccsplit') matccsplit:MatAutocomplete;
  @ViewChild('splitccinput')ccInput:any;

  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
   
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
  assetcatlist:any=[];
  apcategoryList: Array<any>=[];
  subcategoryList: Array<any>=[];
  subcatidList: any
  Subcatid: number = 0;
  Subcatid_bs:number=0;
  Subcatid_cc:number=0;
  Subcatid_Branch:number=1;
  Subcatid_location:number=0;
  Subcatid_apcategory:number=0;
  Subcatid_apsubcategory:number=0;
  Subcatid_product:number=0;
  Subcatid_product_id:number=0;
  splitlocation_next:boolean=true;
  splitlocation_pre:boolean=true;
  splitlocation_prsent:number=1;
  splitcc_next:boolean=true;
  splitcc_pre:boolean=true;
  splitcc_present:number=1;
  assetgrp = new FormControl();
  subcatname = new FormControl();
  isLoading = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  assetgroupform:any= FormGroup;
  isassetmaker: boolean
  isassetbuk: boolean
  isinvoice: boolean=false;
  isexpense: boolean=false;
  isassetwbuk: boolean
  isin: boolean
  public selectedValue: string;
  radiobutton: any
  isradio: boolean = true;
  view: String = "sa"
  ismakerCheckerButton: boolean;
  has_nextwbuk = true;
  has_previouswbuk = true;
  presentpagewbuk: number = 1;

  has_nextbuk = false;
  has_previousbuk = false;
  presentpagebuk: number = 1;
  pageSize = 10;
  quantity: any
  regquantity: number = 2

  isshow: boolean = false;
  isshows: boolean = false;
  isdisable: boolean;
  isdisables: boolean = false;
  isdisrow: boolean;
  bntStyle: string;
  isfiles: boolean;
  disabled: boolean = false;

  total: number = 0;
  istotals: boolean = true;
  istotal: boolean = false;
  totals: number = 0;
  totale: number = 0;
  factor: number;
  isappo: boolean;
  test: number;
  data:any;
  qty: number;
  selectedPersonId: number;
  checked_auth:boolean=false;
  // *******************************
  sub_data=[];
  final_bulky_data:any= {};
  assetlocation:any= FormGroup;
  asset_bc:Array<any>=[{'id':'GST-00'},{'id':'PBLG-10'},{'id':'Vehicle-01'},{'id':'Vehicle-03'}];
  as_bc=[];
  as_cc:Array<any>;
  as_branchname=[];
  as_location:Array<any>;
  as_apcategory=[];
  as_apsubcategory:Array<any>;
  as_branchname_id=[];
  as_product=[];
  as_assetcat=[];
  as_subcategory='';
  as_bs_count:number=1;
  has_nextcom=true;
  currentpagecom=1;
  has_nextcom_cc=true;
  currentpagecom_cc=1;
  has_nextcom_branch=true;
  currentpagecom_branch=1;
  has_previouscombranch=true;

  has_nextcom_branchsplit=true;
  currentpagecom_branchsplit=1;
  has_previouscombranchsplit=true;

  has_nextcom_bssplit=true;
  currentpagecom_bssplit=1;
  has_previouscombssplit=true;

  currentpagecom_branchid=1;
  has_previouscom=true;
  has_nextcom_branch_id=true;
  currentpagecom_branch_id=1;
  //
  has_nextcom_ap=true;
  currentpagecom_ap=1;

  has_nextcom_apsub=true;
  currentpagecom_apsub=1;
  //
  has_nextcom_product=true;
  currentpagecom_product=1;

  has_nextcom_asset=true;
  currentpagecom_asset=1;

  has_nextcc=true;
  has_prevecc=true;
  has_presentpagecc=1;

  has_nextlocation=true;
  has_prevelocation=true;
  has_presentpagelocation=1;

  has_nextassetgroup=true;
  has_preveassetgroup=true;
  has_presentpageassetgroup=1;

  has_nextassetid=true;
  has_preveassetid=true;
  has_presentpageassetid=1;

  data_addlocation={};
  branch_id:number;
  name:any='';
  floor:any='';
  remarks:any='';
  date=new Date();
  minDate:any;
  is_submit=false;
  is_cancel=false;
  total_amount_to_capitalize=0;
  already_capitalize_amount=0;
  balance_amount_to_capitalize=0;
  asset_details:any={}
  strike_out:boolean=false;
  bs_id:number=0;
  cc_id:number=0;
  sum_asset=[];
  total_value:number=0;
  total_value1:number=0;
  sum_asset_value:number=0;
  revised_value:number=0;
  mark_up_ratio:any=1;
  new_mark_up_radio:any=1;
  select_invoice_amount=0;
  dup_tot:number=0;
  dub_rev:number=0;
  dub_mark:number=0;
  c_1:number=0;
  c_2:number=0;
  c_3:number=0;
  base_value=0;
  check:boolean=false;
  default:string='Ravi';
  fixed_data_id:number=0;
  fixed_asset_id:number=0;
  frmData :any= new FormData();
  productname:any=FormArray;
  product_select:string;
  pro_name=new FormControl();
  splitquantity:any=FormGroup;
  sp_quantity:number=0;
  sp_unitprice:number=0;
  split_length:number=0;
  split_bs:any=[];
  split_cc:any=[];
  split_branch:any=[];
  split_location:any=[];
  sp_add_d:any;
  split_base_index:number=0;
  quantity_max:number;
  sub_asset_data:any;
  splitqty_branch:any=0;
  splitqty_location:any=0;
  splitqty_bs:number=0;
  splitqty_cc:any=0;
  split_addqty:number=0;
  split_addanoqty:number=0;
  splitqty_ng:any='';
  asset_bscode:any;
  asset_cccode:any;
  asset_branch:any;
  supplier_name:any='';
  expdataList:Array<any>=[];
  total_amount_to_capitalizeexp:number=0;
  balance_amount_to_capitalizeexp:number=0;
  expform:any=FormGroup;
  as_apcategoryexp:Array<any>=[];
  selectIndex:number=0;
  split_enb_check:boolean=true;
  split_qty_length:boolean=true;
  exp_bs:number=0;
  exp_cc:number=0;
  cap_check:boolean=true;
  cap_after_change:number;
  isreadonly:boolean=true;
  split_subdata=[];
  duplicate_value:number;
  choice:any=[];
  
  images:any;
  locationreadonly:boolean=true;
  ccreadonly:boolean=true;
  subcatreadonly:boolean=true;
  assetidreadonly:boolean=true;
  submit_btn_ena:boolean=true;
  apsubcatid:any=0;
  valuetoggle:boolean=true;
  //******************************* */
  
  // get images(): string[] {
    // const selectedPerson = this.assetcatlist.find(person => person.id === this.selectedPersonId);
    // if (selectedPerson?.images.length) {
    //   return selectedPerson.images;
    // }

  //   return [];
  // }




  subcaptypelist = [{ 'id': '1', 'show': 'Existing', 'name': 'WDV' }, { 'id': '2', 'show': 'New', 'name': 'SLM' }]



  constructor(private errorHandler:ErrorHandlerService,private notification: NotificationService, private router: Router, private share: faShareService
    , private Faservice: faservice, private fb: FormBuilder,public datepipe: DatePipe,private toastr:ToastrService ,private spinner:NgxSpinnerService ) { }
    

  ngOnInit() {
    setTimeout(()=>{
      this.spinner.show();
      
    });
    let d:any={"Jan":1,"Feb":2,"Mar":3,"Apr":4,"May":5,"Jun":6,"Jul":7,"Aug":8,"Sept":9,"Oct":10,"Nov":11,"Dec":12};
    //console.log('h=',this.date.toString().split(" ")[1])
    if(d[this.date.toString().split(" ")[1]] >= 4){
      this.minDate=this.date.getFullYear().toString()+'-'+'04-01';
     // console.log('1=',this.minDate)
    }
    else{
      let year:any=this.date.getFullYear()-1;
      this.minDate=year.toString()+'-'+'04-01';
      //console.log('2=',this.minDate);
    }
    this.data = this.share.regular.value;
    // newly added
     this.assetlocation=new FormGroup({
       'branch_id':new FormControl('',Validators.required),
       'name':new FormControl('',Validators.required),
       'floor':new FormControl('',Validators.required),
       'remarks':new FormControl('',Validators.required),

     });
     this.expform=this.fb.group({
      'cat':new FormControl(''),
      'subcat':new FormControl(''),
      'glno':new FormControl(''),
      'amount':new FormControl(''),
      'bsid':this.fb.array([
        this.fb.control({
          'bs':new FormControl(''),
          'bscode':new FormControl('')
        })
      ]),
      'ccid':this.fb.array([
        this.fb.control({
          'cc':new FormControl(''),
          'cccode':new FormControl('')
        })
      ])
      
    });
    (this.expform.get('bsid') as FormArray).clear();
    (this.expform.get('ccid') as FormArray).clear();
     this.splitquantity=this.fb.group({
      listofquantity:this.fb.array([
        this.numberOnlydude()
        
        // this.fb.group({
        //   'asset_quantity':new FormControl(),
        //   'bs':new FormControl(),
        //   'cc':new FormControl(),
        //   'branch':new FormControl(),
        //   'location':new FormControl()
        // })
      ])
    });
    this.expform.get('cat').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:string) => this.Faservice.getassetcategorydata_expence(value,1)
      .pipe(
        finalize(() => {
          this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.as_apcategoryexp = datas;
        // console.log('new wow=',results);
        // for(let i=0;i<datas.length;i++){
        //     this.as_apcategory.push(datas[i])
        //     console.log(datas[i])
        // }
        // console.log("apcategory=", datas)

      });
    //  console.log(this.sum_asset)
      for(let i=0;i<this.sum_asset.length;i++){
        this.sum_asset_value=this.sum_asset_value + this.sum_asset[i].faclringheader_balanceamount;
      };
      
      this.split_length=((this.splitquantity.get('listofquantity') as FormArray).length);
  //  this.assetgroupform.get('assetcategory').patchValue('one');
    if (this.data = "REGULAR") {
      // console.log('condition1=',this.data);
      this.assetgroupform =this.fb.group({
        'bs':new FormControl(),
        'cc':new FormControl(),
        'branchname': new FormControl(),
        'locationname': new FormControl(),
        'apcategory':new FormControl(),
        'apsubcategory':new FormControl(),
        'productname':this.fb.array([
         this.fb.group({
           'product':new FormControl(),
           'id':new FormControl(),
         })
        ]),
        'assetcategory':this.fb.array([
          this.fb.group({
            'assetcat':new FormControl(),
            'id':new FormControl()
          })
        ]),
        // 'date':new FormControl(this.date)
        'date':this.fb.array([
          this.fb.group({
            'dates':new FormControl(this.date)
          })
        ])
      });
      
      
 
    
      if (this.data = "CWIP" || "BUC") {
        this.assetgroupform = this.fb.group({
          'bs': ['', Validators.required],
          cc: ['', Validators.required],
          branchname: ['', Validators.required],
          locationname: ['', Validators.required],
          apcategory: ['', Validators.required],
          apsubcategory: ['', Validators.required],
          subcaptilization: new FormControl(),
          capitilizationamt: new FormControl(0),

          assetgroup: new FormControl(),
          assetid: new FormControl(),
          'productname':this.fb.array([
            this.fb.group({
              'product':new FormControl(),
              'id':new FormControl(),
            })
          ]),
          
          'assetcategory':this.fb.array([
            this.fb.group({
              'assetcat':new FormControl(),
              'id':new FormControl()
            })
          ]),
          'date':this.fb.array([
            this.fb.group({
              'dates':new FormControl(this.date)
            })
          ])

        })

      }
      // this.cap_after_change=
      // this.assetgroupform.get('capitilizationamt').valueChanges.pipe(
      //   map((value:any)=>{
      //     console.log(value),
      //     this.cap_after_change=value,
      //     this.select_invoice_amount=value
      //   })
      // )

      this.get();
      this.getinvoicesummary(1,10);
      this.invoiceBtn(0);

     
      let apcatkeyvalue: String = "";
      this.getapcat(apcatkeyvalue);
      this.getsubcatid();
      // this is value changes in bs
      this.assetgroupform.get('bs').valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(()=>{
          this.isLoading=true;
        }),
        switchMap((value:string) => this.Faservice.getassetbsdata(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          // console.log('d=',results)
          let datas = results["data"];
          this.as_bc=datas;
          // console.log('bs=',this.as_bc)
        });
        // this is value changes in cc
        // console.log(this.as_bc)
      this.assetgroupform.get('cc').valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(()=>{
          this.isLoading=true;
        }),
        switchMap(value => this.Faservice.getassetccdata(this.Subcatid_bs)
        .pipe(
          finalize(() => {
            this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.as_cc = datas;
          // console.log("cc=", datas)
          // console.log('cc_name=',datas['costcentre_id'])


        }
        );
        // this is value changes in Branch Name
        // let datas = results["data"];
        //     this.as_branchname = datas;
      
        this.assetgroupform.get('branchname').valueChanges.pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(()=>{
            this.isLoading=true;
          }),
          switchMap((value:any) => this.Faservice.getassetbranchdata(value,1).pipe(
            finalize(()=>{
              this.isLoading=false;
            })
          ))
        ).
          subscribe((results: any[]) => {
              this.as_branchname=results['data']
              // console.log('branch_name=',results)
          });
          //this is value changes in location 
          this.assetgroupform.get('locationname').valueChanges.pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(()=>{
              this.isLoading=true;
            }),
            switchMap(value => this.Faservice.getassetlocationdata(this.Subcatid_Branch)
            .pipe(
              finalize(() => {
                this.isLoading = false
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.as_location = datas;
              // console.log("apcategory", results)
    
            });
            //this is apcategory
            
            this.assetgroupform.get('apcategory').valueChanges.pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(()=>{
                this.isLoading=true;
              }),
              switchMap((value:string) => this.Faservice.getassetcategorydata(value,1)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                    }),
                  )
                )
              )
              .subscribe((results: any[]) => {
                let datas = results["data"];
                this.as_apcategory = datas;
                // console.log('new wow=',results);
                // for(let i=0;i<datas.length;i++){
                //     this.as_apcategory.push(datas[i])
                //     console.log(datas[i])
                // }
                // console.log("apcategory=", datas)
      
              });
            // this is value changes in apsubcategory
            this.assetgroupform.get('apsubcategory').valueChanges.pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(()=>{
                this.isLoading=true;
              }),
              switchMap((value:string) => this.Faservice.getassetsubcategoryccdata(value,this.Subcatid_apcategory)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                    }),
                  )
                )
              )
              .subscribe((results: any[]) => {
                let datas = results["data"];
                this.as_apsubcategory = datas;
                // console.log("apcategory", results)
      
              });

        //this is value changes in assetgroup
      this.assetgroupform.get('assetgroup').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.Faservice.getapcatt(this.assetgroupform.get('assetgroup').value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.apcategoryList = datas;
          console.log("apcategory", datas)

        })


    }
    this.Faservice.getassetproductdata('',1).subscribe(data=>{
      this.as_product=data['data'];
    })
    this.Faservice.getassetproductdata('',1).subscribe(data=>{
      this.as_product=data['data'];
    }
    )
// this product name
    this.assetgroupform.get('productname').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
        
      }),
      
      switchMap((value:any) => this.Faservice.getassetproductdata(value[this.fixed_data_id].product,1).pipe(
        finalize(()=>{
          // console.log('id1=',this.fixed_data_id);
          // console.log('dear=',value[this.fixed_data_id].product)
          this.isLoading=false;
        })
      ))
    ).
      subscribe((results: any[]) => {
          this.as_product=results['data']
          
          // console.log('branch_name=',results)
      });

    this.assetlocation.get('branch_id').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any) => this.Faservice.getassetbranchdata(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).
      subscribe((results: any[]) => {
          this.as_branchname_id=results['data']
          // console.log('branch_name=',results['data'])
      });
      this.Faservice.getassetcategorynew('',1).subscribe(data=>{
        this.as_assetcat=data['data'];
      });
       // 
       this.assetgroupform.get('assetcategory').valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(()=>{
          this.isLoading=true;
        }),
        switchMap((value:any) => this.Faservice.getassetcategorynew("subcat_id="+this.apsubcatid+"&subcatname="+value[this.fixed_asset_id]['assetcat'],1).pipe(
          finalize(()=>{
            this.isLoading=false;
          })
        ))
      ).
        subscribe((results: any[]) => {
            this.as_assetcat=results['data']
            
            // console.log('branch_name=',results['data'])
        });
     // this is total amount
     this.sp_add_d=this.splitquantity.get('listofquantity') as FormArray;
    //  const dws=this.sp_add_d.controls.at(this.split_base_index);
    //  console.log('data=',this.sp_add_d);
    //  console.log('dws=',dws);
     (this.splitquantity.get('listofquantity') as FormArray).at(0).get('bs').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:string) => this.Faservice.getassetbsdata(value,1)
      .pipe(
        finalize(() => {
          console.log('wall=',value)
          console.log('af=',this.split_base_index);
          this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        console.log('d=',results)
        let datas = results["data"];
        this.split_bs=datas;
        // console.log('bs=',this.as_bc)
      });
       
      (this.splitquantity.get('listofquantity') as FormArray).at(0).get('cc').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:string) => this.Faservice.getassetccdata(this.splitqty_bs)
      .pipe(
        finalize(() => {
          console.log('wall=',value)
          this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        // console.log('d=',results)
        let datas = results["data"];
        this.split_cc=datas;
        console.log('cc=',this.as_bc)
      });
      // // // split branch
      (this.splitquantity.get('listofquantity') as FormArray).at(0).get('branch').valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(()=>{
          this.isLoading=true;
        }),
        switchMap((value:any) => this.Faservice.getassetbranchdata(value,1).pipe(
          finalize(()=>{
            this.isLoading=false;
          })
        ))
      ).
        subscribe((results: any[]) => {
            this.split_branch=results['data']
            // console.log('branch_name=',results)
        });


      // /**        */
      (this.splitquantity.get('listofquantity') as FormArray).at(0).get('location').valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(()=>{
          this.isLoading=true;
        }),
        switchMap(value => this.Faservice.getassetlocationdata(this.splitqty_branch)
        .pipe(
          finalize(() => {
            this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.split_location = datas;
          // console.log("apcategory", results)

        });
      // this.split_quntity_asset(this.split_base_index);

  }
  //*************************** */
  split_qty_details(data:any,i:any){
    this.sub_asset_data=data;
    // console.log(data);
    this.sp_quantity=data.faclringdetails_qty;
    this.sp_unitprice=data.faclringheader_balanceamount;
    this.quantity_max=i;
    this.duplicate_value=i;
  };
  split_quntity_asset(i:any){
    (this.splitquantity.get('listofquantity').controls as FormArray).at(i).get('bs').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:string) => this.Faservice.getassetbsdata(value,1)
      .pipe(
        finalize(() => {
          // console.log('wall=',value)
          console.log('af=',this.split_base_index);
          this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        console.log('d=',results)
        let datas = results["data"];
        this.split_bs=datas;
        // console.log('bs=',this.as_bc)
      });
      // console.log('welcome=',this.subcategoryList)
      
    }
  // When the user clicks on the button, scroll to the top of the document
   qty_matched(event,i){
    let num:any=i;
    let sumd:any=0; 
    let val:any=this.sp_quantity;
    console.log((this.splitquantity.get('listofquantity') as FormArray).value)
    for(let j=0;j<(this.splitquantity.get('listofquantity') as FormArray).length;j++){
      if(i<=num){
        sumd=sumd+(this.splitquantity.get('listofquantity') as FormArray).at(j).get('asset_quantity').value;
      }
      
    }
    // console.log('sumd=',sumd);
    // console.log('lll',this.splitqty_ng);
    if((val ) < sumd ){
      
      this.toastr.warning('Data Not Matched');
      // console.log(event.target.value );
      // console.log();
     
      (this.splitquantity.get('listofquantity') as FormArray).at(i).get('asset_quantity').reset();
      this.split_addqty=0;
      return false;
    }
    
  }
  branch_data(d,i){
    this.splitqty_branch=d.id;
    console.log(d);
    (this.splitquantity.get('listofquantity') as FormArray).at(i).patchValue({'branchqty':d.id});
    this.Faservice.getassetlocationdata(this.splitqty_branch).subscribe(data=>{
      this.split_location=data['data'];
    })
  }
  locationdata(d,i){
    console.log('location=',d);
    this.splitqty_location=d.id;
    (this.splitquantity.get('listofquantity') as FormArray).at(i).patchValue({'locationqty':d.id})
  }
  bsdata(d,i){
    this.splitqty_bs=d.id;
    // console.log('bs=',d);
    (this.splitquantity.get('listofquantity') as FormArray).at(i).patchValue({'bsqty':d.code});
    this.Faservice.getassetccdata(this.splitqty_bs).subscribe(data=>{
      this.split_cc=data['data'];
    })
  }
  ccdata(d,i){
    this.split_qty_length=false;
    this.splitqty_cc=d.id;
    // console.log('cc=',d);
    (this.splitquantity.get('listofquantity') as FormArray).at(i).patchValue({'ccqty':d.code});
    this.split_enb_check=!((this.splitquantity.get('listofquantity') as FormArray).at(i).valid);
    console.log(this.splitquantity.valid);
  }
  cpaamount_change(event){
    console.log(event.target.value);
    this.cap_check=false;
    if(this.assetcatlist[0].faclringheader_balanceamount>=event.target.value){
      this.cap_after_change= event.target.value;
      this.select_invoice_amount=event.target.value;
    this.assetcatlist[0].unit_prices=event.target.value;
    // this.cap_after_change= event.target.value;
    }
    else{
      this.cap_after_change= this.assetcatlist[0].faclringheader_balanceamount;
      this.assetcatlist[0].unit_price=this.assetcatlist[0].faclringheader_balanceamount;
      this.toastr.warning("Capitalized Amount MisMatch","",{timeOut:1000})
    }
    
    
  }


  
  //************ */
  autocompletecommodityScroll() {
    setTimeout(() => {
      if (
        this.matcommodityAutocomplete &&
        this.autocompleteTrigger &&
        this.matcommodityAutocomplete.panel
      ) {
        fromEvent(this.matcommodityAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcommodityAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcommodityAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcommodityAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcommodityAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom === true) {
                this.Faservice.getassetbsdata( this.commodityInput.nativeElement.value, this.currentpagecom+1 )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    // console.log('pagination=',results)
                    let datapagination = results["pagination"];
                    this.as_bc = this.as_bc.concat(datas);
                    if (this.as_bc.length >= 0) {
                      this.has_nextcom = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  };
  autocompletecommodityScrollsplitlocation() {
    setTimeout(() => {
      if (
        this.matLocation&&
        this.autocompleteTrigger &&
        this.matLocation.panel
      ) {
        fromEvent(this.matLocation.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matLocation.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matLocation.panel.nativeElement.scrollTop;
            const scrollHeight = this.matLocation.panel.nativeElement.scrollHeight;
            const elementHeight = this.matLocation.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.splitlocation_next === true) {
                this.Faservice.getassetlocationdata(this.splitqty_branch)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    // console.log('pagination=',results)
                    let datapagination = results["pagination"];
                    this.split_location = this.split_location.concat(datas);
                    if (this.split_location.length >= 0) {
                      this.splitlocation_next = datapagination.has_next;
                      this.splitlocation_pre = datapagination.has_previous;
                      this.splitlocation_prsent = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  };
  autocompletecommodityScrollsplitcc() {
    setTimeout(() => {
      if (
        this.matccsplit&&
        this.autocompleteTrigger &&
        this.matccsplit.panel
      ) {
        fromEvent(this.matccsplit.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matccsplit.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matccsplit.panel.nativeElement.scrollTop;
            const scrollHeight = this.matccsplit.panel.nativeElement.scrollHeight;
            const elementHeight = this.matccsplit.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.splitcc_next === true) {
                this.Faservice.getassetccdata(this.splitqty_bs)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    // console.log('pagination=',results)
                    let datapagination = results["pagination"];
                    this.split_cc = this.split_cc.concat(datas);
                    if (this.split_cc.length >= 0) {
                      this.splitcc_next = datapagination.has_next;
                      this.splitcc_pre = datapagination.has_previous;
                      this.splitcc_present = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  };
  splitquantityadd(){
    this.split_enb_check=true;
    this.split_base_index=1;
    (this.splitquantity.get('listofquantity') as FormArray).push(this.fb.group({
      'asset_quantity':null,
        'bs':null,
        "bsqty":null,
        'cc':null,
        'ccqty':null,
        'branch':null,
        'branchqty':null,
        'location':null,
        'locationqty':null
    }));
    let l:any=(this.splitquantity.get('listofquantity') as FormArray).length;
    (this.splitquantity.get('listofquantity') as FormArray).at(l-1).get('bs').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:string) => this.Faservice.getassetbsdata(value,1)
      .pipe(
        finalize(() => {
          // console.log('wall=',value)
          console.log('af=',this.split_base_index);
          this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        console.log('d=',results)
        let datas = results["data"];
        this.split_bs=datas;
        // console.log('bs=',this.as_bc)
      });
      (this.splitquantity.get('listofquantity') as FormArray).at(l-1).get('cc').valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(()=>{
          this.isLoading=true;
        }),
        switchMap((value:string) => this.Faservice.getassetccdata(this.splitqty_bs)
        .pipe(
          finalize(() => {
            // console.log('wall=',value)
            this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          // console.log('d=',results)
          let datas = results["data"];
          this.split_cc=datas;
          // console.log('cc=',this.as_bc)
        });
        (this.splitquantity.get('listofquantity') as FormArray).at(l-1).get('branch').valueChanges.pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(()=>{
            this.isLoading=true;
          }),
          switchMap((value:any) => this.Faservice.getassetbranchdata(value,1).pipe(
            finalize(()=>{
              this.isLoading=false;
            })
          ))
        ).
          subscribe((results: any[]) => {
              this.split_branch=results['data']
              // console.log('branch_name=',results)
          });
          (this.splitquantity.get('listofquantity') as FormArray).at(l-1).get('location').valueChanges.pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(()=>{
              this.isLoading=true;
            }),
            switchMap(value => this.Faservice.getassetlocationdata(this.splitqty_branch)
            .pipe(
              finalize(() => {
                this.isLoading = false
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.split_location = datas;
              // console.log("apcategory", results)
    
            });
    this.split_length=((this.splitquantity.get('listofquantity') as FormArray).length);
    // console.log('we=',this.sp_add_d);
    for(let i=0;i<((this.splitquantity.get('listofquantity') as FormArray).length);i++){
      let d1:any=((this.splitquantity.get('listofquantity') as FormArray).at(i).get('asset_quantity').value);
      let d2:any=((this.splitquantity.get('listofquantity') as FormArray).at(i).get('bs').value);
      let d3:any=((this.splitquantity.get('listofquantity') as FormArray).at(i).get('cc').value);
      let d4:any=((this.splitquantity.get('listofquantity') as FormArray).at(i).get('branch').value);
      let d:any=((this.splitquantity.get('listofquantity') as FormArray).at(i).get('location').value);
      // console.log('wel=',d1)

      ((this.splitquantity.get('listofquantity') as FormArray).at(i).patchValue({'asset_quantity':d1,'bs':d2,'cc':d3,'location':d,'branch':d4}));
    }
    
    this.sp_add_d=this.splitquantity.get('listofquantity') as FormArray;
    // const dws=this.sp_add_d.controls.at(this.split_base_index);
    // console.log('data=',this.sp_add_d);
    // console.log('dws=',dws);
    (this.splitquantity.get('listofquantity') as FormArray).at(this.split_base_index).get('bs').valueChanges.pipe(
     debounceTime(100),
     distinctUntilChanged(),
     tap(()=>{
       this.isLoading=true;
     }),
     switchMap((value:string) => this.Faservice.getassetbsdata(value,1)
     .pipe(
       finalize(() => {
         // console.log('wall=',value)
        //  console.log('af=',this.split_base_index);
         this.isLoading = false
           }),
         )
       )
     )
     .subscribe((results: any[]) => {
      //  console.log('d=',results)
       let datas = results["data"];
       this.split_bs=datas;
       // console.log('bs=',this.as_bc)
     });

  }
  removesplitquantuty(){
    
    const d:number=((this.splitquantity.get('listofquantity') as FormArray).length);
    ((this.splitquantity.get('listofquantity') as FormArray).removeAt(d-1))
    this.split_length=((this.splitquantity.get('listofquantity') as FormArray).length);
  }


  //************ */
  autocompletecommodityScroll_splitbranch(){
    setTimeout(() => {
      if (
        this.matsplitbranchAutocomplete &&
        this.autocompleteTrigger &&
        this.matsplitbranchAutocomplete.panel
      ) {
        fromEvent(this.matsplitbranchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsplitbranchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsplitbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsplitbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsplitbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_branchsplit === true) {
                this.Faservice.getassetbranchdata( this.Inputsplitbranch.nativeElement.value, this.currentpagecom_branchsplit+1 )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    // console.log('branch_branch=',results)
                    let datapagination = results["pagination"];
                    console.log('hii')
                    this.split_branch = this.split_branch.concat(datas);
                    if (this.split_branch.length >= 0) {
                      this.has_nextcom_branchsplit = datapagination.has_next;
                      this.has_previouscombranchsplit = datapagination.has_previous;
                      this.currentpagecom_branchsplit = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });

  }
  autocompletelocation(){
    setTimeout(() => {
      if (
        this.matlocationAutocomplete &&
        this.autocompleteTrigger &&
        this.matlocationAutocomplete.panel
      ) {
        fromEvent(this.matlocationAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matlocationAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matlocationAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matlocationAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matlocationAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextlocation === true) {
                this.Faservice.getassetlocationdata( this.has_presentpagelocation+1 )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    // console.log('branch_branch=',results)
                    let datapagination = results["pagination"];
                    this.as_location = this.as_location.concat(datas);
                    if (this.as_location.length >= 0) {
                      this.has_nextlocation = datapagination.has_next;
                      this.has_prevelocation = datapagination.has_previous;
                      this.has_presentpagelocation = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });

  }

  autocompletecommodityassetgroup() {
    setTimeout(() => {
      if (
        this.matassetgroupAutocomplete &&
        this.autocompleteTrigger &&
        this.matassetgroupAutocomplete.panel
      ) {
        fromEvent(this.matassetgroupAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matassetgroupAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matassetgroupAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matassetgroupAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matassetgroupAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextassetgroup === true) {
                this.Faservice.getapcatt( this.Inputassetgroup.nativeElement.value,this.has_presentpageassetgroup+1 )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    // console.log('pagination=',results)
                    let datapagination = results["pagination"];
                    this.apcategoryList= this.apcategoryList.concat(datas);
                    if (this.apcategoryList.length >= 0) {
                      this.has_nextassetgroup = datapagination.has_next;
                      this.has_preveassetgroup = datapagination.has_previous;
                      this.has_presentpageassetgroup = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompletecommodityassetgroupid() {
    setTimeout(() => {
      if (
        this.matassetidAutocomplete &&
        this.autocompleteTrigger &&
        this.matassetidAutocomplete.panel
      ) {
        fromEvent(this.matassetidAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matassetidAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matassetidAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matassetidAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matassetidAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextassetid === true) {
                this.Faservice.getapcatid(this.Subcatid)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('pagination=',results)
                    // let datapagination = results["pagination"];
                    this.subcategoryList= this.subcategoryList.concat(results);
                    // if (this.subcategoryList.length >= 0) {
                    //   this.has_nextassetid = datapagination.has_next;
                    //   this.has_preveassetid = datapagination.has_previous;
                    //   this.has_presentpageassetid = datapagination.index;
                    // }
                  })
              }
            }
          });
      }
    });
  }

  autocompletecommodityScroll_cc() {
    setTimeout(() => {
      if (
        this.matccAutocomplete &&
        this.autocompleteTrigger &&
        this.matccAutocomplete.panel
      ) {
        fromEvent(this.matccAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matccAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matccAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matccAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matccAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_cc === true) {
                this.Faservice.getassetccdata( this.commodityInput.nativeElement.value )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    // console.log('pagination=',results)
                    let datapagination = results["pagination"];
                    this.as_cc = this.as_cc.concat(datas);
                    if (this.as_bc.length >= 0) {
                      this.has_nextcom_cc = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom_cc = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  autocompletecommodityScrollbssplit(){

    setTimeout(() => {
      if (
        this.matsplitbsAutocomplete &&
        this.autocompleteTrigger &&
        this.matsplitbsAutocomplete.panel
      ) {
        fromEvent(this.matsplitbsAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsplitbsAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsplitbsAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsplitbsAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsplitbsAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_bssplit === true) {
                this.Faservice.getassetbsdata( this.splitbsInput.nativeElement.value, this.currentpagecom_bssplit+1 )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    // console.log('pagination=',results)
                    let datapagination = results["pagination"];
                    this.split_bs = this.split_bs.concat(datas);
                    if (this.split_bs.length >= 0) {
                      this.has_nextcom_bssplit = datapagination.has_next;
                      this.has_previouscombssplit = datapagination.has_previous;
                      this.currentpagecom_bssplit = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  //*********************** */
  autocompletecommodityScroll_branchid() {
    setTimeout(() => {
      if (
        this.matbranchidAutocomplete &&
        this.autocompleteTrigger &&
        this.matbranchidAutocomplete.panel
      ) {
        fromEvent(this.matbranchidAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbranchidAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbranchidAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbranchidAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranchidAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_branch_id === true) {
                this.Faservice.getassetbranchdata( this.Inputbranchid.nativeElement.value, this.currentpagecom_branch_id+1 )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    // console.log('branch_branch=',results)
                    let datapagination = results["pagination"];
                    this.as_branchname_id = this.as_branchname_id.concat(datas);
                    if (this.as_branchname_id.length >= 0) {
                      this.has_nextcom_branch_id = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom_branch_id = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

//*********************** */
autocompletecommodityScroll_branch() {
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
              this.Faservice.getassetbranchdata( this.Inputbranch.nativeElement.value, this.currentpagecom_branch+1 )
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  // console.log('branch_branch=',results)
                  let datapagination = results["pagination"];
                  this.as_branchname = this.as_branchname.concat(datas);
                  if (this.as_branchname.length >= 0) {
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



  //*********** */
  autocompletecommodityScroll_ap() {
    setTimeout(() => {
      if (
        this.matapAutocomplete &&
        this.autocompleteTrigger &&
        this.matapAutocomplete.panel
      ) {
        fromEvent(this.matapAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matapAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matapAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matapAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matapAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_ap === true) {
                this.Faservice.getassetcategorydata( this.Inputap.nativeElement.value, this.currentpagecom_ap+1 )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    // console.log('branch_branch=',results)
                    let datapagination = results["pagination"];
                    this.as_apcategory = this.as_apcategory.concat(datas);
                    if (this.as_apcategory.length >= 0) {
                      this.has_nextcom_ap = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom_ap = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  

  //** */
  autocompletecommodityScroll_apsub() {
    setTimeout(() => {
      if (
        this.matapsubAutocomplete &&
        this.autocompleteTrigger &&
        this.matapsubAutocomplete.panel
      ) {
        fromEvent(this.matapsubAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matapsubAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matapsubAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matapsubAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matapsubAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_apsub === true) {
                this.Faservice.getassetsubcategoryccdata( this.Inputapsub.nativeElement.value, this.currentpagecom_apsub+1 )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    // console.log('branch_branch=',results)
                    let datapagination = results["pagination"];
                    this.as_apsubcategory = this.as_apsubcategory.concat(datas);
                    if (this.as_apsubcategory.length >= 0) {
                      this.has_nextcom_apsub = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom_apsub = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  

  //** 
  autocompletecommodityScroll_product() {
    setTimeout(() => {
      if (
        this.matproductbAutocomplete &&
        this.autocompleteTrigger &&
        this.matproductbAutocomplete.panel
      ) {
        fromEvent(this.matproductbAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matproductbAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matproductbAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matproductbAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matproductbAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_product === true) {
                this.Faservice.getassetproductdata( this.Inputproduct.innerHTML, this.currentpagecom_product+1 )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    // console.log('branch_branch=',results)
                    let datapagination = results["pagination"];
                    this.as_product = this.as_product.concat(datas);
                    // console.log(datapagination);
                    if (this.as_product.length >= 0) {
                      this.has_nextcom_product = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom_product = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  
  
  //*
  autocompletecommodityScroll_asset() {
    setTimeout(() => {
      if (
        this.matassetbAutocomplete &&
        this.autocompleteTrigger &&
        this.matassetbAutocomplete.panel
      ) {
        fromEvent(this.matassetbAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matassetbAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matassetbAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matassetbAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matassetbAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_asset === true) {
                this.Faservice.getassetcategorynew( this.Inputasset.nativeElement.value ,this.currentpagecom_asset+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    // console.log('assetcategory=',results)
                    let datapagination = results["pagination"];
                    this.as_assetcat = this.as_assetcat.concat(datas);
                    if (this.as_assetcat.length >= 0) {
                      this.has_nextcom_asset = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom_asset = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  

  finalsubmit(){
    
      console.log(this.cap_after_change)
      
    
    this.final_bulky_data['Doc_Type']=this.data;
    this.final_bulky_data['AssetGroup_id']='0';
    console.log(this.split_subdata);
    if(this.isin){

   
    this.final_bulky_data['assetdetails_id']=this.assetgroupform.get('assetid').value ;
    this.final_bulky_data['assetgroup_id']=this.assetgroupform.get('assetgroup').value;
  }
    console.log('kk');
    console.log(this.sub_data)
    let data=[];
    for(let i=0;i<this.sub_data.length;i++){
      for(let j=0;j<this.split_subdata.length;j++){
        if(this.sub_data[i]['faclringdetails_gid']==this.split_subdata[j]['faclringdetails_gid']){
          if(this.data=="CWIP" || this.data=="BUC"){
            this.assetcatlist[i]['Asset_Value']=this.cap_after_change;
            }
            let dates=((this.assetgroupform.get('date') as FormArray).at(i) as FormGroup).value;
            let year=dates['dates'].getFullYear().toString();
            let date=dates['dates'].getDate().toString();
            let month=dates['dates'].getMonth().toString();
            let fulldate=date+'-'+month+'-'+year;
            // this.split_subdata[j]['BS_NO']=this.asset_bscode;
            // this.split_subdata[j]['CC_NO']=this.asset_cccode;
            // this.split_subdata[j]['Branch_id']=this.asset_branch;
            // this.split_subdata[j]['Location_id']=this.Subcatid_location;
            const asset_id=((this.assetgroupform.get('assetcategory') as FormArray).at(i) as FormGroup).value;
            this.split_subdata[j]['Asset_Cat_id']=asset_id.id;
            const d:any=((this.assetgroupform.get('productname') as FormArray).at(i) as FormGroup).value;
            this.split_subdata[j]['Product_id']=d.id;
            this.split_subdata[j]['product_name']=d.product;
            this.split_subdata[j]['CP_Date']={'dates':this.datepipe.transform(dates['dates'],"yyyy-MM-dd")};
            this.split_subdata[j]['files']=this.assetcatlist[i].files;
            this.split_subdata[j]['images']=this.assetcatlist[i].images;
            this.split_subdata[j]['image']=this.assetcatlist[i].image;
            this.split_subdata[j]['assetdetails_id']=this.assetgroupform.get('assetid').value ;
            this.split_subdata[j]['assetgroup_id']=this.assetgroupform.get('assetgroup').value;
            this.split_subdata[j]['crnum']=this.assetcatlist[i].crnum;
          data.push(this.split_subdata[j]);
        }}
    }
    for(let i=0;i<this.assetcatlist.length;i++){
      if(this.assetcatlist[i].isChecked && !this.assetcatlist[i].is_split){
        this.assetcatlist[i]['faclringheader_balanceamount']=this.assetcatlist[i]['faclringheader_balanceamount']*this.new_mark_up_radio;
        this.assetcatlist[i]['BS_NO']=this.asset_bscode;
        this.assetcatlist[i]['CC_NO']=this.asset_cccode;
        this.assetcatlist[i]['Branch_id']=this.asset_branch;
        this.assetcatlist[i]['Location_id']=this.Subcatid_location;
        const asset_id=((this.assetgroupform.get('assetcategory') as FormArray).at(i) as FormGroup).value
        this.assetcatlist[i]['Asset_Cat_id']=asset_id.id;
        const d:any=((this.assetgroupform.get('productname') as FormArray).at(i) as FormGroup).value;
        this.assetcatlist[i]['Product_id']=d.id;
        this.assetcatlist[i]['product_name']=d.product;
        const dates:any=((this.assetgroupform.get('date') as FormArray).at(i) as FormGroup).value;
        console.log('dates=',dates)
        this.assetcatlist[i]['CP_Date']={'dates':this.datepipe.transform(dates['dates'],"yyyy-MM-dd")};
        if(this.data=="CWIP" || this.data=="BUC"){
          this.assetcatlist[i]['Asset_Value']=this.cap_after_change;
          }
        data.push(this.assetcatlist[i]);
      }
    }
    //apportion data append
    for(let i=0;i<this.assetcatlist.length;i++){
      if(this.assetcatlist[i].isChecked_apportion){
        data.push(this.assetcatlist[i]);
      }
    }
    console.log('ee=',data);
    this.final_bulky_data['ASSET']=data;
    console.log(this.sub_data);
    this.final_bulky_data['MarkedUpRatio']=this.new_mark_up_radio;
    if(this.data == 'REGULAR'){
      if(this.expdataList.length>0){
        if(this.expform.value.cat.id ==undefined || this.expform.value.cat==undefined || this.expform.value.cat=='' || this.expform.value.cat==null){
          this.toastr.error('Please Select The Invoice Category in Expence');
          return false;
        }
        if(this.expform.value.subcat.id ==undefined || this.expform.value.subcat==undefined || this.expform.value.subcat=='' || this.expform.value.subcat==null){
          this.toastr.error('Please Select The Invoice SubCategory in Expence');
          return false;
        }
        // if(this.expform.value.glno ==undefined || this.expform.value.glno==undefined || this.expform.value.glno=='' || this.expform.value.glno==null){
        //   this.toastr.error('Please Select The Invoice GL No in Expence');
        //   return false;
        // }
        for(let i=0;i<this.expdataList.length;i++){
          this.expdataList[i]['cat']=this.expform.value.cat.id;
          this.expdataList[i]['subcat']=this.expform.value.subcat.id;
          this.expdataList[i]['glno']=this.expform.value.subcat.glno;
        }
        this.final_bulky_data['expence']=this.expdataList;
      }
    }
    // this.final_bulky_data[ "FA_ClearanceDetail_ids"]=[this.assetcatlist[0].FAClearnceDetails_id];
    this.final_bulky_data['Actual_Capitalize_Amount']=this.total_amount_to_capitalize;
    this.frmData.append('data',JSON.stringify(this.final_bulky_data));
    for(let i of this.frmData){
      console.log(i);
    }
    console.log(this.final_bulky_data);
    this.spinner.show();
    this.Faservice.getassetfinaldata(this.frmData).subscribe(
      (next)=>{
        console.log(next); //data['CbsStatus'][0].Status=="Success"
        if(next.status=="success"){
          this.spinner.hide();
          this.toastr.success('Inserted  Successfully');
          this.router.navigate(['/fa/assetmaker'],{skipLocationChange:true});
        }
        else{
          this.spinner.hide();
          this.frmData.delete('data');
          this.toastr.error(next.code);
          this.toastr.error(next.description);
        
        }
       
      
    },
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.errorHandler.errorHandler(error,'');
      this.toastr.error('Failed To Insert');
      
    }
    
    );
    
    
    
  }
  getbranch(e:any){
    this.Faservice.getassetbranchdata('',1).subscribe(data=>{
      this.split_branch=data['data'];
    });
    (this.splitquantity.get('listofquantity') as FormArray).at(e).get('location').reset('');
  }
  getbs(e:any){
    this.Faservice.getassetbsdata('',1).subscribe(data=>{
      this.split_bs=data['data'];
    });
    (this.splitquantity.get('listofquantity') as FormArray).at(e).get('cc').reset('');
  }
  getlocation(e:any){
    if((this.splitquantity.get('listofquantity') as FormArray).at(e).get('branch').value == null || (this.splitquantity.get('listofquantity') as FormArray).at(e).get('branch').value == ''){
      this.toastr.warning('Please Select Branch Name','',{timeOut:500});
    }
  }
  getcc(e:any){
    if((this.splitquantity.get('listofquantity') as FormArray).at(e).get('bs').value == null || (this.splitquantity.get('listofquantity') as FormArray).at(e).get('bs').value == ''){
      this.toastr.warning('Please Select BS','',{timeOut:500});
    }
  }
  pickonedate(event:any){
    // console.log(event.target.value)
    // this.assetgroupform.get('date').setValue(parseInt(event.target.value));
  }
  splitsubmit(){

    console.log(((this.splitquantity.get('listofquantity') as FormArray).value));
    for(let i=0;i<((this.splitquantity.get('listofquantity') as FormArray).value).length;i++){
      const s:any=((this.splitquantity.get('listofquantity') as FormArray).at(i) as FormGroup).value;
      s['Location_id']=(this.splitquantity.get('listofquantity') as FormArray).at(i).get('locationqty').value;
      s['Branch_id']=(this.splitquantity.get('listofquantity') as FormArray).at(i).get('branchqty').value;
      s['BS_NO']=(this.splitquantity.get('listofquantity') as FormArray).at(i).get('bsqty').value;
      s['CC_NO']=(this.splitquantity.get('listofquantity') as FormArray).at(i).get('ccqty').value;
      s['branch_name']=(this.splitquantity.get('listofquantity') as FormArray).at(i).get('branch').value;//branch
      s['QTY']=(this.splitquantity.get('listofquantity') as FormArray).at(i).get('asset_quantity').value;
      const asset_id=((this.assetgroupform.get('assetcategory') as FormArray).at(this.quantity_max) as FormGroup).value
      s['Asset_Cat_id']=asset_id.id;
    // listItem['Product_id']=this.Subcatid_product_id;
      const d:any=((this.assetgroupform.get('productname') as FormArray).at(this.quantity_max) as FormGroup).value;
      s['faclringdetails_gid']=this.sub_asset_data.faclringdetails_gid;
      //s['Asset_Value']=Math.round(this.sub_asset_data['unit_price']*(this.splitquantity.get('listofquantity') as FormArray).at(i).get('asset_quantity').value);
      s['Asset_Value']=Number((this.sub_asset_data['unit_prices'] * (this.splitquantity.get('listofquantity') as FormArray).at(i).get('asset_quantity').value).toFixed(2));
      s['Product_id']=d.id;
      s['faclringdetails_qty']=(this.splitquantity.get('listofquantity') as FormArray).at(i).get('asset_quantity').value;
      s['faclringdetail_totamount']=this.sub_asset_data['faclringdetail_totamount'];
      s['faclringdetails_gid']=this.sub_asset_data['faclringdetails_gid'];
      s['faclringdetails_ponum']=this.sub_asset_data['faclringdetails_ponum'];
      s['faclringdetails_productgid']=this.sub_asset_data['faclringdetails_productgid'];
      s['faclringheader_balanceamount']=this.sub_asset_data['faclringheader_balanceamount'];
      s['faclringheader_balanceqty']=this.sub_asset_data['faclringheader_balanceqty'];
      s['faclringheader_captalizedamount']=this.sub_asset_data['faclringheader_captalizedamount'];
      s['faclringheader_gid']=this.sub_asset_data['faclringheader_gid'];
      s['faclringheader_totamount']=this.sub_asset_data['unit_price'] / (this.splitquantity.get('listofquantity') as FormArray).at(i).get('asset_quantity').value;
      s['faclringheader_totinvamount']=this.sub_asset_data['faclringheader_totinvamount'];
      s['faclringheader_tottaxamount']=this.sub_asset_data['faclringheader_tottaxamount'];
      s['inv_debit_tax']=this.sub_asset_data['inv_debit_tax'];
      s['invoicedetails_totalamt']=this.sub_asset_data['invoicedetails_totalamt'];
      s['isChecked']=this.sub_asset_data['isChecked'];
      s['isChecked_apportion']=this.sub_asset_data['isChecked_apportion'];
      s['product_name']=this.sub_asset_data['product_name'];
      s['supplier_name']=this.sub_asset_data['supplier_name'];
      s['files']=[];
      s['images']=[];
      s['image']=[];
      s['is_split']=true;
      // const dates:any=((this.assetgroupform.get('date') as FormArray).at(this.quantity_max) as FormGroup).value;
      this.assetcatlist[this.quantity_max]['is_split']=true;
      let dates=((this.assetgroupform.get('date') as FormArray).at(this.quantity_max) as FormGroup).value;
      let year=dates['dates'].getFullYear().toString();
  let date=dates['dates'].getDate().toString();
  let month=dates['dates'].getMonth().toString();
  
  
  let fulldate=date+'-'+month+'-'+year;
  s['CP_Date']={'dates':this.datepipe.transform(dates['dates'],"yyyy-MM-dd")};
      this.split_subdata.push(s);
      console.log(this.split_subdata)
      // this.sub_data.push(s);
    }
    
    console.log('split=',this.split_subdata);
    // this.sub_data.splice(this.duplicate_value,1);
    // this.sub_data[this.duplicate_value]=this.split_subdata;
    for(let i=0;i<((this.splitquantity.get('listofquantity') as FormArray).value).length;i++){
      if(i==0){
        ((this.splitquantity.get('listofquantity') as FormArray).at(i).reset())
      }
      else{
        ((this.splitquantity.get('listofquantity') as FormArray).removeAt(i));
      }
    };
    this.exampleModal.nativeElement.click();
    this.toastr.success('Success');
  }
  closesplitmodal(){
    // for(let i=0;i<((this.splitquantity.get('listofquantity') as FormArray).value).length;i++){
    //   if(i==0){
    //     ((this.splitquantity.get('listofquantity') as FormArray).at(i).reset())
    //   }
    //   else{
    //     ((this.splitquantity.get('listofquantity') as FormArray).removeAt(i));
    //   }
    // };
    // this.exampleModals.nativeElement.click();
  }


  locationsubmit(){
    if(this.assetlocation.get('branch_id').value ==null || this.assetlocation.get('branch_id').value ==''){
      this.toastr.error('Please Select The Branch');
      return false;
    }
    if(this.assetlocation.get('name').value ==null || this.assetlocation.get('name').value ==''){
      this.toastr.error('Please Add Location Field');
      return false;
    }
    if(this.assetlocation.get('floor').value ==null || this.assetlocation.get('floor').value ==''){
      this.toastr.error('Please Filled the Floor');
      return false;
    }
    if(this.assetlocation.get('remarks').value ==null || this.assetlocation.get('remarks').value ==''){
      this.toastr.error('Please Filled the Remarks');
      return false;
    }
    this.spinner.show();
    this.data_addlocation['branch_id']=this.branch_id;
    this.data_addlocation['name']=this.assetlocation.get('name').value;
    this.data_addlocation['floor']=this.assetlocation.get('floor').value;
    this.data_addlocation['remarks']=this.assetlocation.get('remarks').value;
    // console.log(this.data_addlocation);
    this.Faservice.getassetdatalocation(this.data_addlocation).subscribe(
      (next)=>{
        this.spinner.hide();
      this.toastr.success('location Added Successfully')
    },
    
    (error:HttpErrorResponse)=>{
      this.spinner.hide();
      this.errorHandler.errorHandler(error,'');
      // this.toastr.error('Failed to Uploaded');
    });
    this.assetlocation.patchValue({'branch_id':'','name':'','floor':'','remarks':''});
    this.location_sub.nativeElement.click();
  }
  removeproduct(data:number,asset:any){
    this.product_select='';
    this.fixed_data_id=data;
    // console.log('id=',data);
    
    ((this.assetgroupform.get('productname')).at(data) as FormGroup).patchValue({'product':''});
  }
  restlocation(){
    this.assetlocation.patchValue({'branch_id':'','name':'','floor':'','remarks':''});
  }
  removeasset(i:number){

    ((this.assetgroupform.get('assetcategory')).at(i) as FormGroup).patchValue({'assetcat':''});
    // this.assetgroupform.get('assetcategory').setValue('');
  }
  // private filter_value(value:string):string[]{
  //   console.log(value);
  //   const filterValue = value.toLowerCase();

  //   return this.asset_bc.filter((val:string) => val.toLowerCase().includes(filterValue));

  // }
  private getsubcatid() {
    this.Faservice.getsubcatid()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcatidList = datas;
        // console.log("usage", datas)
      })



  }
  getcolor(){
    this.strike_out=!this.strike_out;
    // return this.strike_out
  }

  public displayastgrp(autoapcat?: assetgrplists): string | undefined {
    return autoapcat ? autoapcat.name : undefined;
  }

  get autocit() {
    return this.assetgroupform.get('assetgroup');
  }

  private getapcat(apcatkeyvalue) {
    this.Faservice.getapcatt(apcatkeyvalue,this.has_presentpageassetgroup)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        
        this.apcategoryList = datas;

      })


    let subcatkeyvalue: String = "";
    this.getsubcat(this.Subcatid, subcatkeyvalue);


    this.assetgroupform.get('assetid').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.Faservice.getapcatid(this.Subcatid)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
      .subscribe((results: any[]) => {
        let datas = results;
        this.subcategoryList = datas['data'];
        console.log("subcategory", datas)

      })




  }



  public displayassetid(autosubcat?: assetidlistss): string | undefined {
    return autosubcat ? autosubcat.name : undefined;
  }

  get autosubcat() {
    return this.assetgroupform.get('assetid');
  }

  private getsubcat(id, subcatkeyvalue) {
    this.Faservice.getsubcat(id, subcatkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcategoryList = datas;

      })
  }
  
  // this. is bs in getsubcat
  private getsubcat_bs(id, subcatkeyvalue) {
    // this.Faservice.getsubcat(id, subcatkeyvalue)
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.subcategoryList = datas;

    //   })
  }
  // this is cc in getsubcat
  private getsubcat_cc(id, subcatkeyvalue) {
    // this.Faservice.getsubcat(id, subcatkeyvalue)
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.subcategoryList = datas;

    //   })
  }
   // this branch getsub
   private getsubcat_branch(id, subcatkeyvalue) {
    // this.Faservice.getsubcat(id, subcatkeyvalue)
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.subcategoryList = datas;

    //   })
  }
  assetgrps_bs(data){
    this.Subcatid_bs=data.id;
    this.asset_bscode=data.code;
    this.getsubcat_cc(data.id,'');
    this.Faservice.getassetccdata(this.Subcatid_bs).subscribe(data=>{
      this.as_cc=data['data'];
      console.log(this.as_bc)
    });
    this.ccreadonly=false;
    // console.log('bs_id=',this.Subcatid_bs);
  }
  assetgrps_bsexp(data,i){
    this.exp_bs=data.id;
    ((this.expform.get('bsid') as FormArray).at(i) as FormGroup).patchValue({'bs':data.name,'bscode':data.id});
    this.Faservice.getassetccdata(data.id).subscribe(data=>{
      this.as_cc=data['data'];
      console.log(this.as_bc)
    });
    this.expdataList[i]['bs']=data.id;
  }
  assetgrps_cc(data){
    this.Subcatid_cc=data.id;
    this.asset_cccode=data['costcentre_id'].no;
    console.log('di=',data);
    // this.getsubcat_bs(data.id,'');

  }
  assetexpccdata(){
    
    this.Faservice.getassetccdata(this.exp_bs).subscribe(data=>{
      this.as_cc=data['data'];
      console.log(this.as_bc)
    });
  }
  assetgrps_cc_exp(data,i){
    this.exp_cc=data.id;
    ((this.expform.get('ccid') as FormArray).at(i) as FormGroup).patchValue({'cc':data['costcentre_id'].name,'cccode':data['costcentre_id'].id});
    //this.asset_cccode=data['costcentre_id'].no;
    console.log('di=',data);
    this.expdataList[i]['cc']=data['costcentre_id'].id;
    // this.getsubcat_bs(data.id,'');

  }
  assetgrps_branch(data){
      this.Subcatid_Branch=data.id;
      this.asset_branch=data.id;
      this.getsubcat_branch(data,'');
      this.Faservice.getassetlocationdata(this.Subcatid_Branch).subscribe(data=>{
        this.as_location=data['data'];
      });
      this.locationreadonly=false;
  }
  assetgrps_location(data){
    // this.assetgrps_location=data.code;
    this.Subcatid_location=data.id;
  }
  assetgrps_apcategory(data){
    this.spinner.show();
    this.Subcatid_apcategory=data.id;
    this.Faservice.getassetsubcategoryccdata('',this.Subcatid_apcategory).subscribe(data=>{
      this.as_apsubcategory=data['data'];
      this.spinner.hide();
    });
    this.subcatreadonly=false;
  }
  assetgrps_apsubcategory(data){
    // this.assetgroupform.get('assetcategory').setValue(data.name);
    let dear:any=[{'subcatname':'','id':''}];
    this.apsubcatid=data.id;
    let search:string="&subcat_id="+data.id;
    this.Faservice.getassetcategorynew(search,1).subscribe(datas=>{

      console.log('d=',datas)
      if(datas['data'].length>=1){

      dear=datas['data'][0];
      console.log(dear);
      for(let i=0;i<this.assetcatlist.length;i++){
        ((this.assetgroupform.get('assetcategory') as FormArray).at(i) as FormGroup).patchValue({'assetcat': dear['subcategory_id'].name});
        ((this.assetgroupform.get('assetcategory') as FormArray).at(i) as FormGroup).patchValue({'id':dear.id});
  
        
      };
      }
      else{
        this.notification.showError('Asset Category Not Found');
        for(let i=0;i<this.assetcatlist.length;i++){
          ((this.assetgroupform.get('assetcategory') as FormArray).at(i) as FormGroup).get('assetcat').reset();
          ((this.assetgroupform.get('assetcategory') as FormArray).at(i) as FormGroup).get('id').reset();
    
          
        };
      }
      
      
    });
    
    
    
    this.as_subcategory=data.name;
    this.Subcatid_apsubcategory=data.id;
  }
  asset_product_cat(data,i:any,asset:any){
    this.product_select=data.name;
    // console.log(i);
    // console.log('ha=',data);
    ((this.assetgroupform.get('productname') as FormArray).at(i) as FormGroup).patchValue({'productname':data.name});
    ((this.assetgroupform.get('productname') as FormArray).at(i) as FormGroup).patchValue({'id':data.id});
    this.Subcatid_product_id=data.id;

    
  }

  assetgrps(data) {
    this.valuetoggle=false;
    this.Subcatid = data.id;
   // this.getsubcat(data.id, '');
   console.log(data);
    this.Faservice.getapcatid(data.id).subscribe(data=>{
      console.log(data);
      if(data['data'].length==0){
        this.toastr.warning('Asset Group Id related Asset Id Not Found','',{timeOut:1000});
        this.subcategoryList=[];
        return false;
      }
      this.subcategoryList=data['data'];
    });
    this.assetidreadonly=false;

    // console.log('check', this.getsubcat(data.id, ''))
  }
  assetgrps_addbranch(asset:any){
    this.branch_id=asset.id;
    // this.assetlocation.get('branch_id').setValue(asset.id);
    // console.log(this.assetlocation.get('branch_id').value)
  }
   increase(){
    this.as_bs_count=this.as_bs_count+1;
    // console.log(this.as_bs_count)
    // this.Faservice.getassetbsdata(this.as_bs_count).subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   // this.as_bc.push(datas);
    //   console.log('length=',datas.length);
    //   for(let i=0;i<datas.length;i++){
    //     console.log(datas[i]);
    //     this.as_bc.push(datas[i])
    //   }
    //   console.log(datas[0])
    //   console.log("bs data_total=", this.as_bc)
    //   console.log('bs_total_data=',this.as_bc.length)
    //   return datas;
    // })
    
  }
  // public data: any;
  increasedataof(event:any){
    console.log('h=',event.target.value);
    console.log(this.valuetoggle);
    if(this.valuetoggle){
    this.Faservice.getapcattreverse(event.target.value,1).subscribe(data=>{
      // this.apcategoryList=data;
      if(data['code']=="INVALID_DATA"){
        this.toastr.warning(data['code'],'',{timeOut: 1000});
        this.apcategoryList=[];
      }
      else{
        this.apcategoryList=[data];
        
      }
      console.log('reverse=',data);
    },
    (error)=>{
      this.toastr.error(error.Status+error.statusText);
    }
    )
  }
  }
  get() {
    this.data = this.share.regular.value;

    // console.log("RegularValue", this.data)

    if (this.data == "REGULAR") {
      this.isradio = false
    }
    if (this.data == "CWIP") {
      this.isradio = true
      this.quantity = 1
    }
    if (this.data == "BUC") {
      this.isradio = true
      this.quantity = 1
    }

  }


  // getinvoicesummary(pageNumber = 1, pageSize = 10) {

  //   this.Faservice.getinvoicesummary(pageNumber, pageSize)
  //     .subscribe((result) => {
  //       console.log('landlords')
  //       console.log("landlords", result)
  //       let datass = result['data'];
  //       let datapagination = result["pagination"];
  //       this.assetcatlist = datass;
  //       // console.log("this.is called id");
  //       // console.log(this.share.asset_id.value)
  //       this.test = this.assetcatlist
  //         .map(data => data.lifetime * data.lifetime)
  //         .reduce((test, data) => test + data)



  //       console.log("assetcat1", this.assetcatlist)
  //       if (this.assetcatlist.length >= 0) {
  //         this.has_nextbuk = datapagination.has_next;
  //         this.has_previousbuk = datapagination.has_previous;
  //         this.presentpagebuk = datapagination.index;
  //       }

  //     })

  // }


  //newlyadded
   asset_id=this.share.asset_id.value;
    getinvoicesummary(pageNumber = 1, pageSize = 10){
      
      
      this.Faservice.getinvoicesummary(this.asset_id)
      .subscribe((result) => {
        // console.log(result)
        this.spinner.hide();
        if(result['code']=="Asset Creation Already Locked"){
          this.notification.showWarning(result['code']);
          this.notification.showWarning(result['description']);
          return true;
        }
        console.log("landlords", result)
        
        let datapagination = result["pagination"];
        this.assetcatlist=result;
        // console.log('final');
        
        for(let i=0;i<this.assetcatlist.length;i++){
          this.assetcatlist[i]['isCheckedExp']=false;
          this.assetcatlist[i]['isapportionExp']=false;
          this.assetcatlist[i]['isExp']=false;
          this.assetcatlist[i]['isExpn']=false;
          this.supplier_name=this.assetcatlist[0].supplier_name;
          this.assetcatlist[i]['is_split']=false;
          this.assetcatlist[i]['unit_price']=((this.assetcatlist[i].invoicedetails_totalamt))/this.assetcatlist[i]['faclringdetails_qty'];
          this.assetcatlist[i]['files']=[];
          this.assetcatlist[i]['images']=[];
          this.assetcatlist[i]['image']=[];
          this.assetcatlist[i]['total_amount_to_capitalize']=this.assetcatlist[0].faclringheader_captalizedamount + this.assetcatlist[0].faclringheader_balanceamount;
          this.assetcatlist[i]['unit_prices']=((this.assetcatlist[i].invoicedetails_totalamt-this.assetcatlist[i].inv_debit_tax))/this.assetcatlist[i]['faclringheader_balanceqty'];
          //this.assetcatlist[i]['unit_prices']=((this.assetcatlist[i].faclringheader_balanceamount))/this.assetcatlist[i]['faclringdetails_qty'];
          (this.assetgroupform.get('productname') as FormArray).push(this.fb.group({
            'product':new FormControl(),
            'id':null
          }));
          (this.assetgroupform.get('assetcategory') as FormArray).push(this.fb.group({
            'assetcat':new FormControl(),
            'id':null
          }));
          (this.assetgroupform.get('date') as FormArray).push(this.fb.group({
            'dates':new FormControl(),
            
          }));
  
          ((this.assetgroupform.get('productname') as FormArray).at(i) as FormGroup).patchValue({'product':this.assetcatlist[i].product_name});
          ((this.assetgroupform.get('productname') as FormArray).at(i) as FormGroup).patchValue({'id':this.assetcatlist[i].faclringdetails_productgid});
  
          ((this.assetgroupform.get('date') as FormArray).at(i) as FormGroup).patchValue({'dates':this.date});
          // ((this.assetgroupform.get('assetcategory') as FormArray).at(i) as FormGroup).patchValue({'id':null});
  
          
        }; 
        if(this.data=="REGULAR"){
          for(let i=0;i<this.assetcatlist.length;i++){
            // this.total_amount_to_capitalize=this.total_amount_to_capitalize + this.assetcatlist[i].faclringheader_totamount * this.assetcatlist[i].faclringdetails_qty;
            // this.balance_amount_to_capitalize=this.balance_amount_to_capitalize + this.assetcatlist[i].faclringheader_balanceamount
            // this.already_capitalize_amount=this.already_capitalize_amount + this.assetcatlist[i].faclringheader_captalizedamount;
            this.total_amount_to_capitalize=this.assetcatlist[0].faclringheader_captalizedamount + this.assetcatlist[0].faclringheader_balanceamount;
            this.already_capitalize_amount=this.assetcatlist[0].faclringheader_captalizedamount;
            this.balance_amount_to_capitalize =this.assetcatlist[0].faclringheader_balanceamount;
            // this.isreadonly=false;
          }

        }
        
        if(this.data== "CWIP" || this.data=="BUC"){
          this.assetcatlist[0]['unit_prices']=this.assetcatlist[0]['faclringheader_balanceamount'];
          this.cap_after_change=this.assetcatlist[0].faclringheader_balanceamount;
          this.assetcatlist[0].faclringdetails_qty=1;
          this.isreadonly=true;
          this.assetcatlist=[this.assetcatlist[0]];
          for(let i=0;i<this.assetcatlist.length;i++){
            // this.total_amount_to_capitalize=this.total_amount_to_capitalize + this.assetcatlist[i].faclringheader_totamount * this.assetcatlist[i].faclringdetails_qty;
            // this.balance_amount_to_capitalize=this.balance_amount_to_capitalize + this.assetcatlist[i].faclringheader_balanceamount
            // this.already_capitalize_amount=this.already_capitalize_amount + this.assetcatlist[i].faclringheader_captalizedamount;
            this.total_amount_to_capitalize=this.assetcatlist[0].faclringheader_captalizedamount + this.assetcatlist[0].faclringheader_balanceamount;;
            this.already_capitalize_amount=this.assetcatlist[0].faclringheader_captalizedamount;
            this.balance_amount_to_capitalize=this.assetcatlist[0].faclringheader_balanceamount;
          
     
          }
        }
        this.spinner.hide();
        console.log('big=',this.assetcatlist)
        if (this.assetcatlist.length >= 0) {
                  // this.has_nextbuk = datapagination.has_next;
                  // this.has_previousbuk = datapagination.has_previous;
                  // this.presentpagebuk = datapagination.index;
                }
        
        this.test = this.assetcatlist
          .map(data => data.lifetime * data.lifetime)
          .reduce((test, data) => test + data)

      },
      (error)=>{
        this.spinner.hide();
        this.toastr.error(error.status+error.statusText);
      }
      );
     
    }

  invoiceBtn(d:number) {
    if(d==0){
    this.isinvoice = true;
    this.isexpense = false;
    }
    if(d==1){
      if(this.expdataList.length==0){
        this.toastr.warning('Please Select The Data');
        this.selectIndex=0;
        return false;
      }
      this.isexpense = true;
    this.isinvoice = false;

    }

  }

  expenseBtn() {
    this.isexpense = true;
    this.isinvoice = false;


  }




  calculateTotals() {
    const items = this.assetcatlist.filter(x => x.nobillChecked || x.billChecked)
    const total = items.length ? items.map(x => x.lifetime * x.lifetime).reduce((totals, data) => totals + data) : 0

    const items2 = this.assetcatlist.find(x => x.billChecked) ? this.assetcatlist.filter(x => x.nobillChecked) : []
    const totale = items2.length ? items2.map(x => x.lifetime * x.lifetime).reduce((totals, data) => totals + data) : 0


    const factor = totale && total ? total / totale : 0
    this.totale = totale;
    this.total = total;
    this.factor = factor;
    return [total, totale, factor]

  }
  // faclearancelistid: Array<any>
  faclearancelistid: any[] = [];
  product_name(data:any){
   return false;

  }

  noBillChecked(listItem, event,i:any) {
    
    if(this.product_select ==' ' ){
      // console.log('enter');
      event.preventDefault();
      return false;
        }
        if(this.assetgroupform.get('bs').value == '' || this.assetgroupform.get('bs').value ==null || this.assetgroupform.get('bs').value ==undefined){
          this.toastr.error('Please Select Valid BS');
          event.preventDefault();
          return false;
        }
        if(this.assetgroupform.get('cc').value == '' || this.assetgroupform.get('cc').value ==null || this.assetgroupform.get('cc').value ==undefined){
          this.toastr.error('Please Select Valid CC');
          event.preventDefault();
          return false;
        }
        if(this.assetgroupform.get('branchname').value == '' || this.assetgroupform.get('branchname').value ==null || this.assetgroupform.get('branchname').value ==undefined){
          this.toastr.error('Please Select Valid BranchName');
          event.preventDefault();
          return false;
        }
        if(this.assetgroupform.get('locationname').value == '' || this.assetgroupform.get('locationname').value ==null || this.assetgroupform.get('locationname').value ==undefined){
          this.toastr.error('Please Select Valid Location Name');
          event.preventDefault();
          return false;
        }
        if(this.assetgroupform.get('apcategory').value == '' || this.assetgroupform.get('apcategory').value ==null || this.assetgroupform.get('apcategory').value == undefined){
          this.toastr.error('Please Select Valid Apcategery');
          event.preventDefault();
          return false;
        }
        if(this.assetgroupform.get('apsubcategory').value == '' || this.assetgroupform.get('apsubcategory').value ==null || this.assetgroupform.get('apsubcategory').value ==undefined){
          this.toastr.error('Please Select Valid ApSubcategery');
          event.preventDefault();
          return false;
        };
        if(((this.assetgroupform.get('assetcategory') as FormArray).at(i) as FormGroup).get('assetcat').value=="" || ((this.assetgroupform.get('assetcategory') as FormArray).at(i) as FormGroup).get('assetcat').value==null || ((this.assetgroupform.get('assetcategory') as FormArray).at(i) as FormGroup).get('assetcat').value==undefined){
          this.toastr.error('Please Select Valid AssetCategory');
          event.preventDefault();
          return false;
        }
        if(((this.assetgroupform.get('productname') as FormArray).at(i) as FormGroup).get('product').value=="" || ((this.assetgroupform.get('assetcategory') as FormArray).at(i) as FormGroup).get('assetcat').value==null || ((this.assetgroupform.get('assetcategory') as FormArray).at(i) as FormGroup).get('assetcat').value==undefined){
          this.toastr.error('Please Select Valid Product Name');
          event.preventDefault();
          return false;
        }
        if(this.data=="CWIP" || this.data=="BUC"){
          this.isreadonly=false;
        }
    
    
    listItem.isBillDisabled = event.target.checked;
    listItem.nobillChecked = event.target.checked;
    this.assetcatlist[0].billChecked=true;    ///sample piece code added in 10-09-2021
    this.recalculate();
    this.is_submit=!this.is_submit;
    this.is_cancel=!this.is_cancel;
    ///***********************/
    
    // console.log('data=',listItem)
    listItem['FAClearnceDetails_id']=listItem['faclringdetails_gid'];
    listItem['BS_NO']=this.asset_bscode;
    listItem['CC_NO']=this.asset_cccode;
    listItem['Branch_id']=this.asset_branch;
    listItem['Location_id']=this.Subcatid_location;

    const asset_id=((this.assetgroupform.get('assetcategory') as FormArray).at(i) as FormGroup).value
    listItem['Asset_Cat_id']=asset_id.id;
    // listItem['faclringdetail_totamount']=listItem.faclringdetail_totamount/listItem.faclringdetails_qty;
    // listItem['Product_id']=this.Subcatid_product_id;
    const d:any=((this.assetgroupform.get('productname') as FormArray).at(i) as FormGroup).value;
    console.log('haha=',d);
    listItem['Product_id']=d.id;
    listItem['product_name']=d.product;
    
    const dates:any=((this.assetgroupform.get('date') as FormArray).at(i) as FormGroup).value;
  //  let dw=new dates();
  let year=dates['dates'].getFullYear().toString();
  let date=dates['dates'].getDate().toString();
  let month=dates['dates'].getMonth().toString();
  let fulldate=date+'-'+month+'-'+year;
  console.log(fulldate)
  //  console.log(dw.format('dd-mm-yyyy'))
  //  console.log(this.datepipe.transform(dw,'dd-mm-yyyy'))

    listItem['CP_Date']={'dates':this.datepipe.transform(dates['dates'],"yyyy-MM-dd")};
    /// console.log('dates',typeof dates.toString()) listItem.invoicedetails_totalamt
    listItem['Asset_Value']=Number((listItem.unit_prices * listItem.faclringdetails_qty).toFixed(2));//listItem.faclringdetail_totamount/listItem.faclringdetails_qty
    //listItem['Asset_Value']=Math.round(listItem.faclringheader_balanceamount/listItem.faclringheader_balanceqty);
    // console.log(this.date)
    listItem["QTY"]=Number(listItem.faclringdetails_qty);
    // if(this.data=="CWIP" || this.data=="BUC"){
    //   this.cap_after_change=this.assetcatlist[0].faclringheader_balanceamount;
    //   // listItem['faclringheader_balanceamount']=this.cap_after_change;
    // }
    listItem['faclringdetails_gid']=listItem.faclringdetails_gid;
    if(this.isin){
      listItem['assetgroup_id']=this.assetgroupform.get('assetgroup').value;
      listItem['assetdetails_id']=this.assetgroupform.get('assetid').value;
      listItem['cap_amount']=this.assetgroupform.get('capitilizationamt').value;
      // this.cap_after_change=this.balance_amount_to_capitalize;
    }
    if(event.currentTarget.checked){
      this.assetcatlist[i]['isCheckedExp']=false;
      this.assetcatlist[i]['isapportionExp']=true;
      this.assetcatlist[i]['isExpn']=true;
      this.submit_btn_ena=false;
      if(this.data=="CWIP" || this.data=="BUC"){
        this.cap_check=false;
        this.isreadonly=false;
        this.cap_after_change=listItem['faclringheader_balanceamount'];
        
      };
      listItem.billChecked=true;
    for(let i=0;i<this.assetcatlist.length;i++){
      if(this.assetcatlist[i].faclringdetails_gid == listItem.faclringdetails_gid){
        this.assetcatlist[i].isChecked=!this.assetcatlist[i].isChecked;
        this.total_value=this.assetcatlist[i].invoicedetails_totalamt * this.assetcatlist[i].faclringdetails_qty;
        // this.total_value1=this.total_value1+this.total_value;
        if(this.data=="REGULAR"){
          ////this.select_invoice_amount=this.select_invoice_amount+ (this.assetcatlist[i].unit_price* this.assetcatlist[i].faclringdetails_qty)-this.assetcatlist[i].inv_debit_tax;
          this.select_invoice_amount=this.select_invoice_amount+ (this.assetcatlist[i].unit_price* this.assetcatlist[i].faclringdetails_qty)-this.assetcatlist[i].inv_debit_tax;
          //this.select_invoice_amount=this.select_invoice_amount+ (this.assetcatlist[i].unit_prices* this.assetcatlist[i].faclringdetails_qty);
        }
        else{
          this.select_invoice_amount=listItem['faclringheader_balanceamount'];
        }
        console.log('first=',this.select_invoice_amount);
        // this.c_1=this.c_1+((this.assetcatlist[i].unit_price* this.assetcatlist[i].faclringdetails_qty)-this.assetcatlist[i].inv_debit_tax);
        this.c_1=this.c_1+((this.assetcatlist[i].invoicedetails_totalamt)-this.assetcatlist[i].inv_debit_tax);
        console.log('bc1=',this.c_1);
        //console.log('bc2=',this.c_2);
        this.sub_data.push(listItem);
        console.log('dsb=',this.sub_data);
        }
    }
  }
  else{
    this.assetcatlist[i]['isCheckedExp']=false;
    this.assetcatlist[i]['isapportionExp']=false;
    this.assetcatlist[i]['isExpn']=false;
    this.submit_btn_ena=true;
    if(this.data=="CWIP" || this.data=="BUC"){
      this.isreadonly=true;
      // this.cap_after_change=this.balance_amount_to_capitalize;
    };
    listItem.billChecked=false;
    for(let i=0;i<this.assetcatlist.length;i++){
      if(this.assetcatlist[i].faclringdetails_gid == listItem.faclringdetails_gid){
        this.assetcatlist[i].isChecked=!this.assetcatlist[i].isChecked;
        this.total_value=this.assetcatlist[i].invoicedetails_totalamt * this.assetcatlist[i].faclringdetails_qty;
        // this.total_value1=this.total_value1-this.total_value;
        if(this.data=="REGULAR"){
        this.select_invoice_amount=this.select_invoice_amount-((this.assetcatlist[i].unit_price*this.assetcatlist[i].faclringdetails_qty) -this.assetcatlist[i].inv_debit_tax);
        //this.select_invoice_amount=this.select_invoice_amount - (this.assetcatlist[i].unit_prices* this.assetcatlist[i].faclringdetails_qty);
      } /// console.log('total_value=',this.total_value1);
         
        console.log('second=',this.select_invoice_amount);
        
        //this.c_1=this.c_1-((this.assetcatlist[i].unit_price* this.assetcatlist[i].faclringdetails_qty)-this.assetcatlist[i].inv_debit_tax);
        this.c_1=this.c_1-((this.assetcatlist[i].invoicedetails_totalamt)-this.assetcatlist[i].inv_debit_tax);
       
        console.log('ac1=',this.c_1);
        //console.log('ac2=',this.c_2);
        let index=this.sub_data.indexOf(listItem.faclringdetails_gid);
        this.sub_data.splice(index,1);
        console.log('dsa=',this.sub_data);
      }

  }
}
  for(let i of this.assetcatlist){
    if(i.isChecked){
      this.submit_btn_ena=false;
    }
  }
    

    this.calculation_data(listItem,event);
  }
  asset_product(data:any,i:number){
    this.Subcatid_product=data.id;
    // console.log('waste=',data);
    ((this.assetgroupform.get('assetcategory') as FormArray).at(i) as FormGroup).patchValue({'assetcat':data.subcatname});
    ((this.assetgroupform.get('assetcategory') as FormArray).at(i) as FormGroup).patchValue({'id':data.id});
    

  }

  billChecked(listItem, event,i:any) {
    listItem.isNoBillDisabled = event.target.checked;
    listItem.billChecked = event.target.checked;
    this.sum_asset.push(listItem);
    if(this.sub_data.length==0){
      this.toastr.warning('Please Select Product Data');
      event.preventDefault();
      return false;
    }
    this.recalculate();
    // console.log(listItem);
    
    // console.log(event.currentTarget.checked)
    if (event.currentTarget.checked == true) {
      this.assetcatlist[i]['isCheckedExp']=true;
      this.assetcatlist[i]['isapportionExp']=false;
      this.assetcatlist[i]['isExpn']=true;
      this.faclearancelistid.push(listItem.id);
      for(let i=0;i<this.assetcatlist.length;i++){
        if(this.assetcatlist[i].faclringdetails_gid == listItem.faclringdetails_gid){
          this.checked_auth=!this.assetcatlist[i].isChecked_apportion;
          this.assetcatlist[i]['isChecked_apportion']=!this.assetcatlist[i]['isChecked_apportion'];

          // this.revised_value=this.total_value1+this.revised_value + (this.assetcatlist[i].faclringheader_balanceamount * this.assetcatlist[i].faclrance_qty);
          this.select_invoice_amount=this.select_invoice_amount+ ((this.assetcatlist[i].unit_price* this.assetcatlist[i].faclringdetails_qty)-this.assetcatlist[i].inv_debit_tax);
          // console.log(this.revised_value)
          this.c_2=this.c_2+((this.assetcatlist[i].invoicedetails_totalamt)-this.assetcatlist[i].inv_debit_tax);
          console.log('c21=',this.c_2);
          this.sub_data.push(listItem);
        }
      }
      this.total_value1=0;
      
      // this.mark_up_ratio=this.revised_value /(this.assetcatlist[0].faclringheader_balanceamount);
      this.total_value=this.revised_value;

    }
    else {
      this.assetcatlist[i]['isCheckedExp']=false;
      this.assetcatlist[i]['isapportionExp']=false;
      this.assetcatlist[i]['isExpn']=false;
      for(let i=0;i<this.assetcatlist.length;i++){
        if(this.assetcatlist[i].faclringdetails_gid == listItem.faclringdetails_gid){
          this.checked_auth=!this.assetcatlist[i].isChecked_apportion;
          this.assetcatlist[i].isChecked_apportion=!this.assetcatlist[i].isChecked_apportion;
          // this.revised_value=this.total_value1+this.revised_value - (this.assetcatlist[i].faclringheader_balanceamount * this.assetcatlist[i].faclrance_qty);
          this.select_invoice_amount=this.select_invoice_amount- ((this.assetcatlist[i].unit_price* this.assetcatlist[i].faclringdetails_qty) -this.assetcatlist[i].inv_debit_tax);
          console.log('c2e1=',this.c_2);
          this.c_2=this.c_2-((this.assetcatlist[i].invoicedetails_totalamt)-this.assetcatlist[i].inv_debit_tax);
        console.log('c2e=',this.c_2);
        let index=this.sub_data.indexOf(listItem.faclringdetails_gid);
        this.sub_data.splice(index,1);
        }
      }
      const index = this.faclearancelistid.indexOf(listItem.id)
      this.faclearancelistid.splice(index, 1)
      
    }
   
    this.calculation_data(listItem,event);
  
  }
  
   public calculation_data(data:any,event){
    
     this.mark_up_ratio=((this.c_1+this.c_2)/this.c_1).toFixed(2);
     this.new_mark_up_radio=((this.c_1+this.c_2)/this.c_1);
     console.log(this.mark_up_ratio)
    
   } 
    

  recalculate() {
    [this.totale, this.total, this.factor] = this.calculateTotals();
  }



  public onSelect(value) {
    this.selectedValue = value;
    if (this.selectedValue == "Existing") {
      this.isin = true
    }
    if (this.selectedValue == "New") {
      this.isin = false
    }

  }

  assetView() {
    this.router.navigate(['/fa/assetmakeradd'], { skipLocationChange: true })
  }
  assetsplitView(val: number) {
    this.qty = val;
    this.share.quantity.next(this.qty)
    // console.log("a", this.qty)


    this.router.navigate(['/fa/assetmakersplit'], { skipLocationChange: true })


  }
  BackBtn() {
    this.router.navigate(['/fa/assetmaker'], { skipLocationChange: true })


  }


  buknextClick() {

    if (this.has_nextbuk === true) {

      this.getinvoicesummary(this.presentpagebuk + 1, 10)

    }
  }

  bukpreviousClick() {

    if (this.has_previousbuk === true) {

      this.getinvoicesummary(this.presentpagebuk - 1, 10)

    }
  }


  files: any
  // images:any

  myFiles: Array<any> = [];
  asq: any
  getFileDetails(index, e,data:any) {
    console.log('q=',data);
    const d:any=new FormData();
    for (var i = 0; i < e.target.files.length; i++) {
      if (!this.assetcatlist[index].files) {
        this.assetcatlist[index].files = []
        this.assetcatlist[index].images = [];
        this.assetcatlist[index].image = []

      }
      // console.log('brr',this.assetcatlist[index])
      // console.log( "brid",this.assetcatlist[index].files);

      this.assetcatlist[index].files.push(e.target.files[i].name);
      const reader :any= new FileReader();
      reader.readAsDataURL(e.target.files[i]);
      reader.onload = (_event) => {
        this.assetcatlist[index].images.push(reader.result);
        
      }
      this.frmData.append('file',e.target.files[i])
    }
    
    // console.log( "brid",this.assetcatlist[index].files);
    console.log('form=',this.frmData)
    this.assetcatlist[index].image.push(d);
    console.log(this.assetcatlist[index])
  }



  uploadFiles() {
    const frmData = new FormData();

    for (var i = 0; i < this.myFiles.length; i++) {
      frmData.append("fileUpload", this.myFiles[i]);
    }
  }


  deleteRow(listIndex: number, fileIndex: number) {
    // console.log("files", this.assetcatlist[listIndex].files);
    this.assetcatlist[listIndex].files.splice(fileIndex, 1);
    this.assetcatlist[listIndex].images.splice(fileIndex, 1);

    // console.log("filess", this.assetcatlist[listIndex].files);
  }


  btn(personId: number) {
    this.selectedPersonId = personId;
  }
  displayFn(assetgrplists?:assetgrplists){
    return assetgrplists? assetgrplists.name:undefined;

  }
numberOnlydude():FormGroup{
  let dears=this.fb.group({
    'asset_quantity':new FormControl(),
    'bs':new FormControl(),
    'bsqty':new FormControl(),
    'cc':new FormControl(),
    'ccqty':new FormControl(),
    'branch':new FormControl(),
    'branchqty':new FormControl(),
    'location':new FormControl(),
    'locationqty':new FormControl()
  });
  // console.log('enter');
  // dears.get('bs').valueChanges.subscribe(res=>{
  //   console.log('well=',res);
  // });
  return dears;
    
  }
  imagess(e:any){
    this.images=e;
  }
  resetsof(){
    this.ccreadonly=true;
    this.subcatreadonly=true;
    this.locationreadonly=true;
    this.assetidreadonly=true;
    this.mark_up_ratio=1;
    this.new_mark_up_radio=1;
    this.select_invoice_amount=0;
    this.c_1=0;
    this.c_2=0;
    this.checked_auth=false;
    this.assetgroupform.get('bs').patchValue("");
    this.assetgroupform.get('cc').patchValue("");
    this.assetgroupform.get('branchname').patchValue("");
    this.assetgroupform.get('locationname').patchValue("");
    this.assetgroupform.get('apcategory').patchValue("");
    this.assetgroupform.get('apsubcategory').patchValue("");
    if(this.assetgroupform.get('assetid').value !=null){
      this.assetgroupform.get('assetid').patchValue("");
    }
    if(this.assetgroupform.get('assetgroup').value !=null){
      this.assetgroupform.get('assetgroup').patchValue("");
    }
    for(let i=0;i<this.assetcatlist.length;i++){
      this.assetcatlist[i].isChecked=false;
      this.assetcatlist[i].isChecked_apportion=false;
      // ABCA21IPITE00002/01/01
    }
  }
  getbsdata(){
    this.Faservice.getassetbsdata('',1).subscribe(data=>{
      this.as_bc=data['data'];
    });
    this.assetgroupform.get('cc').patchValue('');
  }
  getbsdata_exp(){
    this.Faservice.getassetbsdata('',1).subscribe(data=>{
      this.as_bc=data['data'];
    });
    //this.assetgroupform.get('cc').patchValue('');
  }
  getbsdatas(){
    this.assetgroupform.get('cc').patchValue('');
  }
  getbranchdata(){
    this.Faservice.getassetbranchdata('',1).subscribe(data=>{
      this.as_branchname=data['data'];
    });
    this.assetgroupform.get('locationname').patchValue('');
  }
  getbranchdatas(){
    this.assetgroupform.get('locationname').patchValue('');
  }
  getapcategory(){
    this.Faservice.getassetcategorydata('',1).subscribe(data=>{
      this.as_apcategory=data['data'];
    });
    this.assetgroupform.get('apsubcategory').patchValue('');
    let d:any=(this.assetgroupform.get('assetcategory') as FormArray).length;
    for (let i=0;i<d;i++){
      ((this.assetgroupform.get('assetcategory') as FormArray).at(i) as FormGroup).get('assetcat').reset('');
      ((this.assetgroupform.get('assetcategory') as FormArray).at(i) as FormGroup).get('id').reset('');

    }
  }
  getapcategorys(){
    this.assetgroupform.get('apsubcategory').patchValue('');
    for(let i=0;i<this.assetcatlist.length;i++){
      ((this.assetgroupform.get('assetcategory') as FormArray).at(i) as FormGroup).get('assetcat').reset();
      ((this.assetgroupform.get('assetcategory') as FormArray).at(i) as FormGroup).get('id').reset();

      
    };
  }
  getassetcategorys(){
    // this.assetgroupform.get('apsubcategory').patchValue('');
    for(let i=0;i<this.assetcatlist.length;i++){
      ((this.assetgroupform.get('assetcategory') as FormArray).at(i) as FormGroup).get('assetcat').reset();
      ((this.assetgroupform.get('assetcategory') as FormArray).at(i) as FormGroup).get('id').reset();

      
    };
  }
  expdata(data,i,event){
    this.total_amount_to_capitalizeexp=0;
    this.balance_amount_to_capitalizeexp=0;
    if(event.currentTarget.checked){
      // ischeckedexp
      for(let i=0;i<this.assetcatlist.length;i++){
        if(this.assetcatlist[i]['faclringdetails_gid']==data.faclringdetails_gid){
          this.assetcatlist[i]['isCheckedExp']=true;
          this.assetcatlist[i]['isapportionExp']=true;
          this.assetcatlist[i]['isExp']=true;
          this.assetcatlist[i]['isExpn']=false;
          data['bs']=0;
          data['cc']=0;
        }
      }
      
      // this.assetcatlist[i]['isChecked']=false;
      // this.assetcatlist[i]['isChecked_apportion']=false;
      this.expdataList.push(data);
      (this.expform.get('bsid') as FormArray).push(this.fb.group({
        'bs':new FormControl(''),
        'bscode':new FormControl(''),
      }));
      (this.expform.get('ccid') as FormArray).push(this.fb.group({
        'cc':new FormControl(''),
        'cccode':new FormControl(''),
      }));
      let indx:any=(this.expform.get('ccid') as FormArray).length;
      ((this.expform.get('bsid') as FormArray).at(indx-1) as FormGroup).patchValue({'bs':'','bscode':''});
      ((this.expform.get('ccid') as FormArray).at(indx-1) as FormGroup).patchValue({'cc':'','cccode':''});
      ((this.expform.get('bsid') as FormArray).at(indx-1) as FormGroup).get('bs').valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(()=>{
          this.isLoading=true;
        }),
        switchMap((value:string) => this.Faservice.getassetbsdata(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          // console.log('d=',results)
          let datas = results["data"];
          this.as_bc=datas;
          // console.log('bs=',this.as_bc)
        });
        ((this.expform.get('ccid') as FormArray).at(indx-1) as FormGroup).get('cc').valueChanges.pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(()=>{
            this.isLoading=true;
          }),
          switchMap(value => this.Faservice.getassetccdata(this.exp_bs)
          .pipe(
            finalize(() => {
              this.isLoading = false
                }),
              )
            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.as_cc = datas;
            // console.log("cc=", datas)
            // console.log('cc_name=',datas['costcentre_id'])
  
  
          }
          );
    }
    else{
      for(let i=0;i<this.assetcatlist.length;i++){
        if(this.assetcatlist[i]['faclringdetails_gid']==data.faclringdetails_gid){
        this.assetcatlist[i]['isCheckedExp']=false;
        this.assetcatlist[i]['isapportionExp']=false;
        this.assetcatlist[i]['isExp']=false;
        this.assetcatlist[i]['isExpn']=false;
        data['bs']=0;
        data['cc']=0;
        }
      }
      // this.assetcatlist[i]['isChecked']=false;
      // this.assetcatlist[i]['isChecked_apportion']=false;
      let index=this.expdataList.findIndex(d=>d.faclringdetails_gid==data.faclringdetails_gid);
      this.expdataList.splice(index,1);
      let indx:any=(this.expform.get('ccid') as FormArray).length;
      ((this.expform.get('bsid') as FormArray).removeAt(indx-1));
      ((this.expform.get('ccid') as FormArray).removeAt(indx-1));
    }
    if(this.expdataList.length>0){
      for(let i=0;i<this.expdataList.length;i++){
      this.total_amount_to_capitalizeexp=this.total_amount_to_capitalizeexp+Number(this.expdataList[i].invoicedetails_totalamt);
      this.balance_amount_to_capitalizeexp =this.balance_amount_to_capitalizeexp +Number(this.expdataList[i].invoicedetails_totalamt);
    }
  }
  }
  assetgrps_apcategory_expsubcat(){
    if(this.expform.value.cat.id ==undefined || this.expform.value.cat==undefined || this.expform.value.cat==null || this.expform.value.cat==''){
      this.toastr.warning('Please Select The Invoice Category');
      return false;
    }
    this.expform.get('subcat').valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:string) => this.Faservice.getassetsubcategoryccdata(value,this.expform.value.cat.id)
      .pipe(
        finalize(() => {
          this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.as_apsubcategory = datas;
        // console.log("apcategory", results)

      });
    // this.spinner.show();
    // this.Subcatid_apcategory=data.id;
    // this.Faservice.getassetsubcategoryccdata('',this.Subcatid_apcategory).subscribe(data=>{
    //   this.as_apsubcategory=data['data'];
    //   this.spinner.hide();
    // });
    // this.subcatreadonly=false;
  }
  // public displayastgrp(autoapcat?: assetgrplists): string | undefined {
  //   return autoapcat ? autoapcat.name : undefined;
  // }
  public displayastsub(autoapcat?: assetgrpsub): string | undefined {
    return autoapcat ? autoapcat.name : undefined;
  }
  getdata(data){
    console.log('joo');
    this.expform.get('glno').patchValue(data['glno']);
  }
  autocompletecommodityScroll_apexp() {
    setTimeout(() => {
      if (
        this.matapAutocomplete &&
        this.autocompleteTrigger &&
        this.matapAutocomplete.panel
      ) {
        fromEvent(this.matapAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matapAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matapAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matapAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matapAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_ap === true) {
                this.Faservice.getassetcategorydata_expence( this.Inputap.nativeElement.value, this.currentpagecom_ap+1 )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    // console.log('branch_branch=',results)
                    let datapagination = results["pagination"];
                    this.as_apcategoryexp = this.as_apcategory.concat(datas);
                    if (this.as_apcategoryexp.length >= 0) {
                      this.has_nextcom_ap = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom_ap = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  autocompletecommodityScroll_apsubexp() {
    setTimeout(() => {
      if (
        this.matapsubAutocomplete &&
        this.autocompleteTrigger &&
        this.matapsubAutocomplete.panel
      ) {
        fromEvent(this.matapsubAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matapsubAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matapsubAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matapsubAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matapsubAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_apsub === true) {
                this.Faservice.getassetsubcategoryccdata( this.Inputapsub.nativeElement.value, this.currentpagecom_apsub+1 )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    // console.log('branch_branch=',results)
                    let datapagination = results["pagination"];
                    this.as_apsubcategory = this.as_apsubcategory.concat(datas);
                    if (this.as_apsubcategory.length >= 0) {
                      this.has_nextcom_apsub = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom_apsub = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
}
